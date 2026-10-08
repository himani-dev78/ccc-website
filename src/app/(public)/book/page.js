export const metadata = { title: "Book a 15-minute call | CCC for Leaders", robots: { index: false } };

export default async function BookPage({ searchParams }) {
  const { name = "", email = "" } = await searchParams;
  const url = new URL(process.env.NEXT_PUBLIC_BOOKING_URL);
  if (name) url.searchParams.set("name", name);
  if (email) url.searchParams.set("email", email);
  return <iframe src={url.toString()} title="Book a 15-minute call" className="h-[780px] w-full border-0" />;
}