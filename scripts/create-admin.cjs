require("dotenv").config({ path: ".env.local" });

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
  );
}

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");

    const email = ADMIN_EMAIL.toLowerCase();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await Admin.create({
      name: ADMIN_NAME,
      email,
      password: hashedPassword,
    });

    console.log("Admin created successfully!");
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();