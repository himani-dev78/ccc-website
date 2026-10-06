import BlogForm from "@/components/admin/blogs/BlogForm";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  return <BlogForm blogId={id} />;
}
