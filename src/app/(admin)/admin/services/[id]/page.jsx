import ServiceForm from "@/components/admin/services/ServiceForm";

export default async function EditServicePage({ params }) {
  const { id } = await params;
  return <ServiceForm serviceId={id} />;
}
