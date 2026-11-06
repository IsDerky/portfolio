import type { Metadata } from "next";
import Aboutme from "@/components/sections/about/Aboutme";
import WorkExperience from "@/components/sections/about/WorkExperience";
import GitContributions from "@/components/sections/about/GitContributions";
import Footer from "@/components/sections/Footer";

const description = "Junior engineer at NTT DATA in Barcelona, working across development, infrastructure and DevOps. I run my own home server like production.";

export const metadata: Metadata = {
  title: "About - Alex Miguel (Derkyu)",
  description,
  openGraph: {
    title: "About - Alex Miguel (Derkyu)",
    description,
    url: "https://derkyu.com/about",
    siteName: "Alex Miguel (Derkyu)",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Alex Miguel (Derkyu)",
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
