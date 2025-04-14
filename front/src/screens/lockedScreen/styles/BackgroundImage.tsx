import styled from "@emotion/styled";
import { LockedScreenBackground } from "../assets";

export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${LockedScreenBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(15px) brightness(60%);
`;
