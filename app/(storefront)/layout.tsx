import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Nav from "@/components/storefront/Nav";
import Footer from "@/components/storefront/Footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: "var(--color-void)" }}>
      <AnnouncementBar />
      <div style={{ paddingTop: "40px" }}>
        <Nav />
        <main style={{ paddingTop: "64px" }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
