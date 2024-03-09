"use client";

import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { red, yellow } from "@mui/material/colors";

import "./globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const AppTheme = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: red[700],
      },
      secondary: {
        main: yellow[500],
      },
    },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
