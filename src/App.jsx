import { createHashRouter, RouterProvider } from "react-router";
import routes from "./router/index.jsx";

const router = createHashRouter(routes);

function App() {
  return (
    <RouterProvider router={router}>
      <h1>123</h1>
    </RouterProvider>
  );
}

export default App;
