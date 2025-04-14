import { FC } from "react";
import { Typography, Switch, Slider, Select, MenuItem, Button, Box } from "@mui/material";
import styled from "@emotion/styled";
import { ShortcutChip } from "../../../../components";

const SettingContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
`;

const ControlsContainer = styled(Box)`
  min-width: 200px;
  max-width: 300px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const StyledSelect = styled(Select)`
  color: white;
  height: 4vh;

  .MuiOutlinedInput-notchedOutline {
    border-color: rgba(255, 255, 255, 0.27);
  }

  .MuiSvgIcon-root {
    color: white;
  }
`;

const StyledSlider = styled(Slider)`
  color: white;

  .MuiSlider-rail {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .MuiSlider-track {
    background-color: white;
  }

  .MuiSlider-thumb {
    background-color: white;

    &:hover,
    &.Mui-active {
      box-shadow: 0px 0px 0px 8px rgba(255, 255, 255, 0.16);
    }
  }
`;

const StyledButton = styled(Button)`
  min-width: 150px;
  text-transform: none;
`;

interface SettingProps {
  label: string;
  type: "select" | "slider" | "button" | "toggle";
  value?: any;
  onChange?: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  keyboardShortcut?: [string] | [string, string];
  onClick?: () => void;
}

export const Setting: FC<SettingProps> = ({
  label,
  type,
  value,
  onChange,
  options,
  min,
  max,
  keyboardShortcut,
  onClick,
}) => {
  return (
    <SettingContainer>
      <Typography variant="settingsLabel">{label}</Typography>
      <ControlsContainer>
        {keyboardShortcut && <ShortcutChip shortcut={keyboardShortcut[0]} />}
        {type === "select" && (
          <StyledSelect value={value} onChange={(e) => onChange?.(e.target.value)} fullWidth>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
        )}
        {type === "slider" && (
          <StyledSlider value={value} onChange={(_e, val) => onChange?.(val)} min={min} max={max} />
        )}
        {type === "toggle" && <Switch checked={value} onChange={(e) => onChange?.(e.target.checked)} />}
        {type === "button" && (
          <StyledButton variant="contained" onClick={onClick}>
            {label}
          </StyledButton>
        )}
        {keyboardShortcut && keyboardShortcut[1] && <ShortcutChip shortcut={keyboardShortcut[1]} />}
      </ControlsContainer>
    </SettingContainer>
  );
};
