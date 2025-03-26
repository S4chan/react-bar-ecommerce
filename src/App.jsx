import { createHashRouter, RouterProvider } from "react-router";
import routes from "./router/index.jsx";

const router = createHashRouter(routes);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
