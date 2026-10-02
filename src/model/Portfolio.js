import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    client: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    context: {
      type: String,
      required: true,
      trim: true,
    },

    complexity: {
      type: String,
      required: true,
      trim: true,
    },

    resolution: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio =
  mongoose.models.Portfolio ||
  mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;