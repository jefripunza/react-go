import { Fragment } from "react/jsx-runtime";
import { RouterProvider } from "react-router/dom";

import { routers } from "@/routers";
import PWABadge from "@/PWABadge";
import { use_offline_app } from "@/constant";

export default function App() {
  return (
    <Fragment>
      <RouterProvider router={routers} />
      {use_offline_app && <PWABadge />}
    </Fragment>
  );
}
