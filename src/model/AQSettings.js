import mongoose from "mongoose";

const aqQuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    options: {
      type: [
        new mongoose.Schema(
          {
            text: { type: String, required: true, trim: true },
            points: { type: Number, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { _id: false },
);

const aqProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    headline: { type: String, required: true, trim: true },
    minScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
    strengths: { type: [String], default: [] },
    watchOuts: { type: [String], default: [] },
    recommendedService: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const aqSettingsSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    questions: { type: [aqQuestionSchema], default: [] },
    profiles: { type: [aqProfileSchema], default: [] },
  },
  { timestamps: true },
);

const AQSettings =
  mongoose.models.AQSettings ||
  mongoose.model("AQSettings", aqSettingsSchema);

export default AQSettings;
