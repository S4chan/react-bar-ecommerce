import { Outlet } from "react-router";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
