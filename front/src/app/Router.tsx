import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { screens } from "@/screens";

export const Router: FC = () => (
  <BrowserRouter>
    <Routes>
      {Object.values(screens).map((screen) => (
        <Route key={screen.name} path={screen.path} element={screen.element} />
      ))}
    </Routes>
  </BrowserRouter>
);
