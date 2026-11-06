import type { Metadata } from "next";
import WorksIntro from "@/components/sections/works/WorksIntro";
import FeaturedProjects from "@/components/sections/works/FeaturedProjects";
import AllProjects from "@/components/sections/works/AllProjects";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Works - Alex Miguel (Derkyu)",
  description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
  openGraph: {
    title: "Works - Alex Miguel (Derkyu)",
    description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
    url: "https://derkyu.com/works",
    siteName: "Alex Miguel (Derkyu)",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works - Alex Miguel (Derkyu)",
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
