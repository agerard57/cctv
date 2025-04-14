import { FC, Suspense } from "react";
import { Providers } from "@/providers";
import { Router } from "./Router";
import { Loading } from "../core";
import { Brightness } from "./Brightness";

export const App: FC = () => (
  <Providers>
    <Suspense fallback={<Loading />}>
      <Brightness>
        <Router />
      </Brightness>
    </Suspense>
  </Providers>
);
