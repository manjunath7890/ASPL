import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function SkeletonCard() {
  return (
    <Box p={2} borderRadius="1rem" overflow="hidden">
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{ mb: 1, borderRadius: 1 }}
      />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}
