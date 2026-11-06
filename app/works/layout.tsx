import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Works - Alex Miguel (Derkyu)",
  description: "Infrastructure, automation and security projects by Derkyu: homelab, Ansible, CI/CD and more.",
};

export default function WorksLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
