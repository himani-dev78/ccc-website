import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Client Centered Consulting" },
    tagline: { type: String, default: "A Learning and Development Organization" },
    newsletterTitle: { type: String, default: "Presentation Science" },
    phone: { type: String, default: "+91 99717 64792" },
    email: { type: String, default: "clientcenteredconsulting@gmail.com" },
    address: { type: String, default: "India" },
    facebook: { type: String, default: "https://www.facebook.com/" },
    linkedin: { type: String, default: "https://www.linkedin.com/" },
    instagram: { type: String, default: "https://www.instagram.com/" },
    youtube: { type: String, default: "https://www.youtube.com/" },
  },
  { timestamps: true }
);

const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", settingsSchema);

export default SiteSettings;
