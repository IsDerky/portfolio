import type { Metadata } from "next";
import About from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import MoreInfo from "@/components/sections/MoreInfo";

export const metadata: Metadata = {
  title: "Derkyu · Portfolio",
  description: "Junior engineer at NTT DATA in Barcelona, working across development, infrastructure and DevOps. Homelab, Ansible, CI/CD and security projects.",
};

export default function Home() {
  return (
    <>
      <About />
      <MoreInfo />
      <Footer />
    </>
  );
}