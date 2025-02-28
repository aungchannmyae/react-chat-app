import { createBrowserRouter } from "react-router-dom";
import MainPage from "../features/main/page/MainPage";
import LoginPage from "../features/login/page/LoginPage";
import RegisterPage from "../features/register/page/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
