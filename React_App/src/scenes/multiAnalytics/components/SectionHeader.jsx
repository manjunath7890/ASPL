import React from "react";
import { Box, Typography } from "@mui/material";

export default function SectionHeader({ title, sub, tx }) {
  return (
    <Box p={"0.5rem 0 0 0.5rem"}>
      <Typography
        variant="subtitle2"
        fontSize={"1rem"}
        fontWeight={500}
        color={tx}
      >
        {title}
      </Typography>
      {sub && (
        <Typography
          variant="caption"
          fontSize={"0.7rem"}
          color="text.secondary"
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}
