// Replaces team, portfolio, testimonial, service and site-settings data in
// MongoDB with the content migrated from https://cccforleaders.com.
// A JSON backup of every collection it touches is written to scripts/backups/
// before anything is changed.
//
//   npm run seed-old-site

require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const data = require("./old-site-data.cjs");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

const COLLECTIONS = [
  "teams",
  "portfolios",
  "portfoliocategories",
  "testimonials",
  "services",
  "sitesettings",
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Give each document its own timestamp so list order follows the data file.
function stamp(docs, { newestFirst = false } = {}) {
  const base = Date.now();
  return docs.map((doc, index) => {
    const offset = newestFirst ? docs.length - index : index;
    const time = new Date(base + offset * 1000);
    return { ...doc, createdAt: time, updatedAt: time };
  });
}

async function backup(db) {
  const dir = path.join(__dirname, "backups");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(
    dir,
    `before-old-site-seed-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  const snapshot = {};
  for (const name of COLLECTIONS) {
    snapshot[name] = await db.collection(name).find({}).toArray();
  }
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2));
  console.log(`Backup written to ${path.relative(process.cwd(), file)}`);
}

async function replace(db, name, docs) {
  const collection = db.collection(name);
  const removed = await collection.deleteMany({});
  if (docs.length) await collection.insertMany(docs);
  console.log(`${name}: removed ${removed.deletedCount}, inserted ${docs.length}`);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    await backup(db);

    await replace(db, "sitesettings", stamp([data.settings]));

    await replace(
      db,
      "teams",
      stamp(
        data.team.map((member) => ({
          social: [],
          marketing: { heading: "", items: [] },
          advisory: { heading: "", items: [] },
          closing: "",
          ...member,
        })),
      ),
    );

    await replace(
      db,
      "portfoliocategories",
      stamp(data.portfolioCategories.map((name) => ({ name, slug: slugify(name) }))),
    );

    await replace(
      db,
      "portfolios",
      stamp(
        data.portfolio.map((item) => ({ images: [], ...item })),
        { newestFirst: true },
      ),
    );

    await replace(
      db,
      "testimonials",
      stamp(
        data.testimonials.map((item, index) => ({
          rating: 5,
          active: true,
          order: index,
          ...item,
        })),
      ),
    );

    await replace(
      db,
      "services",
      stamp(
        data.services.map((service) => ({
          audienceHeading: "Who should attend?",
          outcomesHeading: "Program outcomes",
          ...service,
          sections: service.sections.map((section) => ({
            subtitle: "",
            description: "",
            ...section,
          })),
        })),
      ),
    );

    console.log("Old website content imported.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
