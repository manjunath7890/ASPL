import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
      palette: {
        10: "../../assets/logo-dark.png",
        // 50: "https://aspl-iotserver.vercel.app",
        // 50: "https://1.22.230.165/api",
        // 50: "http://localhost:4000",
        // 50: "https://altener.work.gd/api",
        50: "/api",
        100: "#ffffff",
        110: "#000000",
        120: "#000000",
        130: "#1a1a1a",
        140: "#3a3a3a",
        150: "#cccccc",
        200: "0 5px 10px 1px #111111",
        210: "0 5px 7px 1px #191919",
        300: "#282828",
        400: "#5f5f5f",
        500: "#00d49b",
        550: "#02b384",
        510: "#2eefbe",
        600: "#555555",
        700: "#888",
        800: "#555555",
        900: "#555555",
        1000: "#00d38b",
        1100: "#0d6efd",
        1150: "#005a41",
        1200: "#00e396",
        1300: "#feb019",
        1400: "#ff4560",
        1450: "#2d1013",
        1500: "#775dd0",
        1600: "#d44cec",
        1700: "#0dcaf0",
      },
    }
    : {
      palette: {
        10: "../../assets/logo-light.png",
        50: "/api",
        // 50: "https://aspl-iotserver.vercel.app",
        // 50: "https://1.22.230.165/api",
        // 50: "https://altener.work.gd/api",
        100: "#000000",
        110: "#ffffff",
        120: "#e6e6e6",
        130: "hsla(84, 8.50%, 88.40%, 0.85)",
        140: "#cccccc",
        150: "#333333",
        200: "0 5px 15px rgba(0,0,0,0.05)",
        210: "0 2px 8px rgba(0,0,0,0.03)",
        300: "#ffffff",
        400: "#e4e4e4",
        500: "#02b384",
        550: "#10c998",
        510: "#089d77",
        600: "#acacac",
        700: "#999999",
        800: "#ccc",
        900: "#ccc",
        1000: "#00d38b",
        1100: "#0d6efd",
        1150: "#c5ede1",
        1200: "#00e396",
        1300: "#feb019",
        1400: "#ff4560",
        1450: "#ffdada",
        1500: "#775dd0",
        1600: "#d44cec",
        1700: "#0dcaf0",
      },
    }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          // palette values for dark mode
          primary: {
            main: colors.palette[100],
          },
          secondary: {
            main: colors.palette[500],
          },
          neutral: {
            dark: colors.palette[700],
            main: colors.palette[500],
            light: colors.palette[100],
          },
          background: {
            default: colors.palette[130],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.palette[100],
          },
          secondary: {
            main: colors.palette[500],
          },
          neutral: {
            dark: colors.palette[700],
            main: colors.palette[500],
            light: colors.palette[100],
          },
          background: {
            default: colors.palette[130],
          },
        }),
    },
    typography: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: 40,
        MarginBottom: "-0.5rem"
      },
      h2: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: "2rem",
      },
      h3: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Kanit", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => { },
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
