import styled from "@emotion/styled";
import { FC } from "react";
import { formatSecondsIntoMinutes } from "../helpers";
import { BlackContainerBase } from "@/core";

const VideoProgressBarContainer = styled(BlackContainerBase)`
  height: 8vh;
  padding: 0 2vw;
  align-items: center;
  justify-content: space-between;
`;

const StyledVideoProgressBar = styled.div`
  background: rgb(237, 181, 54);
  background: radial-gradient(circle, rgba(237, 181, 54, 1) 0%, rgba(237, 181, 54, 0.3) 100%);
  border-radius: 0 0 15px 15px;
  height: 0.8vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const VideoProgressBarArrow = styled.div<{ position: string }>`
  position: relative;
  top: 1vh;
  left: ${(props) => {
    const arrowWidth = 1;
    const positionPercentage = Math.min(Math.max(parseFloat(props.position), 0), 100);
    return `calc(${positionPercentage}% - ${arrowWidth / 2}vw)`;
  }};
  width: 1vw;
  height: 1vh;
  background: rgba(193, 196, 62, 0.8);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transition: left 0.1s ease-out;
`;

const VideoProgressBarDuration = styled.p<{ position: string }>`
  position: relative;
  width: fit-content;
  left: ${(props) => {
    const positionPercentage = Math.min(Math.max(parseFloat(props.position), 0), 100);
    return `calc(${positionPercentage}%)`;
  }};
  font-size: 0.8vw;
  color: white;
  transition: left 0.1s ease-out;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 0 5px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
`;

export const VideoProgressBar: FC<{ progressPercentage: number; currentTime: number | undefined }> = ({
  progressPercentage,
  currentTime,
}) => {
  const clampedProgress = Math.min(Math.max(progressPercentage, 0), 100);

  return (
    <VideoProgressBarContainer>
      <StyledVideoProgressBar />
      <VideoProgressBarArrow position={`${clampedProgress}%`} />
      <VideoProgressBarDuration position={`${clampedProgress}%`}>
        {formatSecondsIntoMinutes(currentTime || 0)}
      </VideoProgressBarDuration>
    </VideoProgressBarContainer>
  );
};
