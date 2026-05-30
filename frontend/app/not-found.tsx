import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar activePage="" />
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background pt-24">
        <span className="font-label-caps text-secondary text-xs mb-4 tracking-widest font-bold">
          ERROR 404
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-primary mb-6 font-semibold">
          Page Not Found
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
          The sanctuary you are looking for does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="bg-primary text-on-primary font-label-caps text-xs px-8 py-4 rounded-full hover:bg-secondary transition-all"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
