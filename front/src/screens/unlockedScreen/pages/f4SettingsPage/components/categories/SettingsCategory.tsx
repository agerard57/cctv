import { FC } from "react";
import { Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import { Setting } from "./Setting";

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

interface Setting {
  label: string;
  type: "button" | "select" | "slider" | "toggle";
  value: any;
  onChange?: (value: any) => void;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  keyboardShortcut?: [string] | [string, string];
}

interface SettingsCategoryProps {
  title?: string;
  // TODO Naturally, this is a placeholder.
  settings: any[];
}

export const SettingsCategory: FC<SettingsCategoryProps> = ({ title, settings }) => {
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
