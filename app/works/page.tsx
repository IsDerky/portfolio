import type { Metadata } from "next";
import WorksIntro from "@/components/sections/works/WorksIntro";
import FeaturedProjects from "@/components/sections/works/FeaturedProjects";
import AllProjects from "@/components/sections/works/AllProjects";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Works - Derkyu",
  description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
  openGraph: {
    title: "Works - Derkyu",
    description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
    url: "https://derkyu.com/works",
    siteName: "Derkyu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works - Derkyu",
    description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
  },
};

export default function WorksPage() {
  return (
    <>
      <WorksIntro />
      <FeaturedProjects />
      <AllProjects />
      <Footer />
    </>
  );
}
