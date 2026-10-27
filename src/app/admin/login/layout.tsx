import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function AdminLoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
