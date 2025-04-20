import { FC, Suspense } from "react";
import { Providers } from "@/providers";
import { Router } from "./Router";
import { Loading } from "../core";
import { Brightness } from "./Brightness";
import { BackendCheck } from "./BackendCheck";

export const App: FC = () => (
  <Providers>
    <Suspense fallback={<Loading />}>
      <BackendCheck>
        <Brightness>
          <Router />
        </Brightness>
      </BackendCheck>
    </Suspense>
  </Providers>
);

// TODO Check if all projects' imports are sorted and using @/
// TODO Check if all components are typed using Props
// TODO Add cool spaces between all useKeyDown
// TODO REMOVE H3 BODY2 SUBTITLE1 H5 H1 H2 H3 H4 H5 H6

// TODO Check all useStates and check if type and initializer are good

// TODO Find a way to make all the images load beforehand
// TODO convert to webp

//TODO Remove hardcoded colors
