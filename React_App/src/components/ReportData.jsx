import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Squircle } from "@squircle-js/react";

const RepoData = ({
  title,
  label1,
  label2,
  init,
  final,
  secondary,
  primary,
  icon,
  iconColor,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Box
        pl={"1rem"}
        pb={"0.5rem"}
        borderBottom={`1px solid ${colors.palette[900]}`}
        mb={"0.2rem"}
        fontSize={"0.75rem"}
        pt={"0.4rem"}
        color={colors.palette[150]}
      >
        {title}
      </Box>
      <Box
        pl={"1rem"}
        width={"100%"}
        borderRadius={"1rem"}
        display="flex"
        alignItems="center"
        color={colors.palette[100]}
        height="3.9rem"
      >
        <Squircle
          cornerRadius={18}
          cornerSmoothing={1}
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "1rem",
            padding: "0.2rem",
            background: iconColor,
            borderRadius: "1rem",
          }}
        >
          {icon}
        </Squircle>

        <Box width={"7rem"}>
          <Box
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem", lg: "1.4rem" },
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              color: colors.palette[100],
            }}
          >
            {primary}
          </Box>
          <Box fontSize={"0.9rem"} mt={"-0.1rem"}>
            {" "}
            {secondary}
          </Box>
        </Box>

        <Box>
          <Box
            style={{
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              color: colors.palette[150],
            }}
          >
            {label1}
          </Box>
          <Box fontSize={"0.9rem"} mt={"-0.25rem"}>
            {" "}
            {init}
          </Box>

          <Box
            style={{
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              color: colors.palette[150],
              marginTop: "0.3rem",
            }}
          >
            {label2}
          </Box>
          <Box fontSize={"0.9rem"} mt={"-0.25rem"} mb={"0.5rem"}>
            {" "}
            {final}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RepoData;
