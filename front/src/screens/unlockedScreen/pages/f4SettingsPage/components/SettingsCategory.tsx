import { FC } from "react";
import { Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import { Setting, SettingProps } from "./Setting";

const CategoryTitle = styled(Typography)`
  margin-bottom: 16px;
  font-weight: 600;
`;

const SettingsGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 1vw;
  gap: 1vh 4vw;
`;

const DisabledWrapper = styled.div<{ disabled: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

interface Props {
  title?: string;
  settings: SettingProps<boolean | number | string>[];
}

export const SettingsCategory: FC<Props> = ({ title, settings }) => {
  return (
    <div style={{ marginBottom: "5vh" }}>
      {title && <CategoryTitle variant="h5">{title}</CategoryTitle>}
      <SettingsGrid>
        {settings.map((setting, index) => (
          <DisabledWrapper key={index} disabled={!setting.onChange && !setting.keyboardShortcut}>
            <Setting {...setting} />
          </DisabledWrapper>
        ))}
      </SettingsGrid>
    </div>
  );
};
