import type { Metadata } from "next";
import Aboutme from "@/components/sections/about/Aboutme";
import GitContributions from "@/components/sections/about/GitContributions";
import Footer from "@/components/sections/Footer";

const description = "Junior engineer in Barcelona, working across development, infrastructure and DevOps. I run my own home server like production.";

export const metadata: Metadata = {
  title: "About - Alex (Derkyu)",
  description,
  openGraph: {
    title: "About - Alex (Derkyu)",
    description,
    url: "https://derkyu.com/about",
    siteName: "Alex (Derkyu)",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About - Alex (Derkyu)",
    description,
  },
};

export default function AboutPage() {
  return (
    <>
      <Aboutme />
      <GitContributions />
      <Footer />
    </>
  );
}
