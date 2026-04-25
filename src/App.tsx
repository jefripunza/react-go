import { Fragment } from "react/jsx-runtime";
import { RouterProvider } from "react-router/dom";

import { routers } from "@/routers";
import PWABadge from "@/PWABadge";
import { use_offline_app } from "@/constant";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export default function App() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  return (
    <Fragment>
      <RouterProvider router={routers} />
      {use_offline_app && <PWABadge />}
    </Fragment>
  );
}
