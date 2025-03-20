import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

export default function FrontLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BackToTop />
      <Footer />
    </>
  );
}
