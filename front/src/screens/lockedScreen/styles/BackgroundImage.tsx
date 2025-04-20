import styled from "@emotion/styled";
import { PokerWallpaper } from "../../../core";

export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${PokerWallpaper});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(15px) brightness(60%);
`;
