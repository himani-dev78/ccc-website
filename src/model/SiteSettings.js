import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Client Centered Consulting" },
    tagline: { type: String, default: "A Learning and Development Organization" },
    newsletterTitle: { type: String, default: "Presentation Science" },
    phone: { type: String, default: "(+91) 997-176-4792" },
    email: { type: String, default: "greg@cccforleaders.com" },
    address: { type: String, default: "Gurgaon, NCR, Mumbai, Cape Town - S.A." },
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "https://www.linkedin.com/in/thisisgregchapman/" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
  },
  { timestamps: true }
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", settingsSchema);

export default SiteSettings;
