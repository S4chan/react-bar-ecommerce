import AdminLayout from "../layouts/AdminLayout";
import FrontLayout from "../layouts/FrontLayout";
import AboutPage from "../views/front/AboutPage";
import HomePage from "../views/front/HomePage";
import MenuPage from "../views/front/MenuPage";
import MenuDetailPage from "../views/front/MenuDetailPage";
import EventPage from "../views/front/EventPage";
import CartPage from "../views/front/CartPage";
import NotFound from "../views/front/NotFound";
import CheckoutFormPage from "../views/front/CheckoutFormPage";
import CheckoutSuccessPage from "../views/front/CheckoutSuccessPage";
import Login from "../views/admin/Login";
import AdminProducts from "../views/admin/AdminProducts";
import AdminOrders from "../views/admin/AdminOrders";
import ScrollToTop from "../components/ScrollToTop";
import AdminCoupons from "../views/admin/AdminCoupons";
import AdminHome from "../views/admin/AdminHome";

const routes = [
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <FrontLayout />
      </>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "menu/:id",
        element: <MenuDetailPage />,
      },
      {
        path: "event",
        element: <EventPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout-form",
        element: <CheckoutFormPage />,
      },
      {
        path: "checkout-success",
        element: <CheckoutSuccessPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <>
        <ScrollToTop />
        <AdminLayout />
      </>
    ),
    children: [
      {
        path: "home",
        element: <AdminHome />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "coupons",
        element: <AdminCoupons />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
