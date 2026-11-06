import type { Metadata } from "next";
import Aboutme from "@/components/sections/about/Aboutme";
import WorkExperience from "@/components/sections/about/WorkExperience";
import GitContributions from "@/components/sections/about/GitContributions";
import Footer from "@/components/sections/Footer";

const description = "Cloud engineer at NTT DATA in Barcelona, focused on DevOps, SRE and defensive security. I run my own home server like production.";

export const metadata: Metadata = {
  title: "About - Derkyu",
  description,
  openGraph: {
    title: "About - Derkyu",
    description,
    url: "https://derkyu.com/about",
    siteName: "Derkyu",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Derkyu",
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <Aboutme />
      <WorkExperience />
      <GitContributions />
      <Footer />
    </>
  );
}
