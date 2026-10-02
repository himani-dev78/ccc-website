import BrandSlider from "@/components/pages/home/Brandslider";
import Hero from "@/components/pages/home/Hero";
import ServicesSection from "@/components/pages/home/Servicessection";
import Team from "@/components/pages/home/Team";
import Testimonials from "@/components/pages/home/Testimonials";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <BrandSlider />
        <Team />
        <ServicesSection />
        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
