import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    href: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const featureItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    intro: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    social: {
      type: [socialSchema],
      default: [],
    },

    marketing: {
      heading: {
        type: String,
        default: "",
      },

      items: {
        type: [featureItemSchema],
        default: [],
      },
    },

    advisory: {
      heading: {
        type: String,
        default: "",
      },

      items: {
        type: [featureItemSchema],
        default: [],
      },
    },

    closing: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Team =
  mongoose.models.Team ||
  mongoose.model("Team", teamSchema);

export default Team;