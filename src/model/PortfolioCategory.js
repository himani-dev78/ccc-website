import mongoose from "mongoose";

const portfolioCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const PortfolioCategory =
  mongoose.models.PortfolioCategory ||
  mongoose.model("PortfolioCategory", portfolioCategorySchema);

export default PortfolioCategory;
