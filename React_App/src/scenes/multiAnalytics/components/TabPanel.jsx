import React from "react";
import { Box } from "@mui/material";

export default function TabPanel({ children, value, index }) {
  return value === index ? <Box pt={1}>{children}</Box> : null;
}
