import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { KeyButton } from "@/core";
import { useTranslation } from "react-i18next";
import { SupportedKeys, useKeyState } from "@/providers/keyState";
import { WhiteContainerBase } from "../styles";

const ControlsContainer = styled(WhiteContainerBase)`
  position: absolute;
  display: flex;
  bottom: 8vh;
  right: 0;
  z-index: 2;
  padding: 10px;
  border-radius: 10px 10px 0;
  transition: transform 0.2s ease-in-out;
  position: fixed;
  width: max-content;
`;

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  justify-items: center;
  align-items: center;
`;

const OtherButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  padding: 0 0 0 1vw;
`;

export const Controls = () => {
  const theme = useTheme();
  const { t } = useTranslation("UnlockedScreen");
  const { keyStates } = useKeyState();

  return (
    <ControlsContainer background={theme.app.core.whiteTransparentBackground}>
      <KeypadGrid>
        {[
          SupportedKeys.DIGIT_1,
          SupportedKeys.DIGIT_2,
          SupportedKeys.DIGIT_3,
          SupportedKeys.DIGIT_4,
          SupportedKeys.DIGIT_5,
          SupportedKeys.DIGIT_6,
          SupportedKeys.DIGIT_7,
          SupportedKeys.DIGIT_8,
          SupportedKeys.DIGIT_9,
          SupportedKeys.ASTERISK,
          SupportedKeys.DIGIT_0,
          SupportedKeys.HASH,
        ].map((key) => (
          <KeyButton
            key={key}
            label={key}
            icon={keyStates[key]?.icon}
            isEnabled={keyStates[key]?.enabled}
            width="1vw"
          />
        ))}
      </KeypadGrid>
      <OtherButtonsContainer>
        <Row>
          {[SupportedKeys.PG_UP, SupportedKeys.PG_DOWN].map((key) => (
            <KeyButton
              key={key}
              label={t(`controls.${key.charAt(0).toLowerCase() + key.slice(1)}`)}
              icon={keyStates[key]?.icon}
              isEnabled={keyStates[key]?.enabled}
              direction="column"
              width="2vw"
            />
          ))}
        </Row>
        <Row>
          {[SupportedKeys.BACKSPACE, SupportedKeys.SPACE, SupportedKeys.CANCEL, SupportedKeys.ENTER].map((key) => (
            <KeyButton
              key={key}
              label={t(`controls.${key.toLowerCase()}`)}
              icon={keyStates[key]?.icon}
              isEnabled={keyStates[key]?.enabled}
            />
          ))}
        </Row>
      </OtherButtonsContainer>
    </ControlsContainer>
  );
};
