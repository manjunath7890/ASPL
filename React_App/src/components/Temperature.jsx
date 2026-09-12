import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { Squircle } from "@squircle-js/react";

const Temp = ({
  temp,
  unit,
  value,
  fontSize = "1rem",
  icon,
  color = 100,
  bg = 500,
  bbg = 110,
  br = 2,
  brr = "0.5rem",
  height = "2.8rem",
  hFont = "0.5rem",
  fontWeight = 400,
  width = "100%",
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const bgcolor = colors.palette[bg];
  const bbgcolor = colors.palette[bbg];
  const Color = colors.palette[color];

  return (
    <Box
      m={"2px 0px 0px 3px"}
      pl={"0.5rem"}
      width={width}
      borderRadius={"0.5rem"}
      display="flex"
      alignItems="center"
      color={Color}
      height={height}
      boxShadow={colors.palette[210]}
      border={`1px solid ${colors.palette[900]}`}
    >
      {icon ? (
        <Box>
          <Squircle
            cornerRadius={11.5}
            cornerSmoothing={1}
            style={{
              color: colors.palette[110],
              background: bgcolor,
              border: `${br}px solid ${bbgcolor}`,
              marginRight: "0.5rem",
              fontSize: fontSize,
              display: "flex",
              alignItems: "center",
              padding: "0.2rem"
            }}
          >
            {icon}
          </Squircle>
        </Box>
      ) : (
        <></>
      )}
      <Box marginLeft={"0.5rem"}>
        <Box
          fontSize={hFont}
          mt={"0.3rem"}
          mb={"0.0rem"}
          color={colors.palette[150]}
        >
          {" "}
          {temp}
        </Box>
        <Box
          style={{
            fontSize: fontSize,
            display: "flex",
            alignItems: "center",
            marginBottom: "0.2rem",
            marginRight: "0.2rem",
            fontWeight: fontWeight,
          }}
        >
          {value}{" "}
          <span
            style={{
              fontWeight: 300,
              fontSize: "0.8rem",
              marginLeft: "0.4rem",
            }}
          >
            {unit}
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default Temp;
