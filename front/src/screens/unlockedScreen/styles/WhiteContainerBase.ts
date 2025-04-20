import styled from "@emotion/styled";

export const WhiteContainerBase = styled("div", {
  shouldForwardProp: (prop) => prop !== "background",
})<{ background: string }>`
  backdrop-filter: blur(10px);
  background: ${({ background }) => background};
`;
