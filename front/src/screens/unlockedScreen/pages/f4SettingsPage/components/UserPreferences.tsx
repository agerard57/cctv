import { FC, useState } from "react";
import { Typography, Switch, Box, Select, MenuItem, Slider } from "@mui/material";

export const UserPreferences: FC = () => {
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [keyboardLayout, setKeyboardLayout] = useState("qwerty");
  const [autoCorrect, setAutoCorrect] = useState(true);

  return (
    <Box>
      <Typography variant="h6">User Preferences</Typography>
      <Box marginY={2}>
        <Typography>Language</Typography>
        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
        </Select>
      </Box>
      <Box marginY={2}>
        <Typography>Notifications</Typography>
        <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
      </Box>
      <Box marginY={2}>
        <Typography>Theme</Typography>
        <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System Default</MenuItem>
        </Select>
      </Box>
      <Box marginY={2}>
        <Typography>Font Size</Typography>
        <Slider value={fontSize} onChange={(_e, value) => setFontSize(value as number)} min={10} max={20} />
      </Box>
      <Box marginY={2}>
        <Typography>Keyboard Layout</Typography>
        <Select value={keyboardLayout} onChange={(e) => setKeyboardLayout(e.target.value)}>
          <MenuItem value="qwerty">QWERTY</MenuItem>
          <MenuItem value="azerty">AZERTY</MenuItem>
          <MenuItem value="dvorak">Dvorak</MenuItem>
        </Select>
      </Box>
      <Box marginY={2}>
        <Typography>Auto-Correct</Typography>
        <Switch checked={autoCorrect} onChange={(e) => setAutoCorrect(e.target.checked)} />
      </Box>
    </Box>
  );
};
