import mongoose from "mongoose";

const serviceFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const serviceSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    features: { type: [serviceFeatureSchema], default: [] },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    heroImage: { type: String, default: "", trim: true },
    intro: { type: String, required: true, trim: true },
    audienceHeading: { type: String, default: "Who should attend?", trim: true },
    audience: { type: [String], default: [] },
    outcomesHeading: { type: String, default: "Program outcomes", trim: true },
    outcomes: { type: [String], default: [] },
    sections: { type: [serviceSectionSchema], default: [] },
  },
  { timestamps: true },
);

const cachedServiceModel = mongoose.models.Service;
if (cachedServiceModel && !cachedServiceModel.schema.path("sections")) {
  mongoose.deleteModel("Service");
}

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
