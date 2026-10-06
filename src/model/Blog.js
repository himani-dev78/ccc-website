import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },
    featuredImage: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const cachedBlogModel = mongoose.models.Blog;
if (cachedBlogModel && !cachedBlogModel.schema.path("category")) {
  mongoose.deleteModel("Blog");
}

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
