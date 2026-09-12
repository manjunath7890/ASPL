import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Temp from "./Temperature";

const Box_3 = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      mt={"0rem"}
      pt={"0rem"}
      display="flex"
      borderRadius={"1rem"}
      position="relative"
      width={'100%'}
      //
    >
      <Box
        position={"absolute"}
        right={"1rem"}
        top={"1.25rem"}
        border={`1px solid ${colors.palette[800]}`}
        boxShadow={colors.palette[210]}
        padding={"1rem"}
        borderRadius={'0.5rem'}
        width={'37%'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        Battery SOC
        <Box fontSize={"2.7rem"} fontWeight={"500"}>
          {" "}
          {props.soc} <span style={{fontSize:'1.5rem'}}> %</span>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        m={"0.25rem"}
        position={"absolute"}
        left={"0.5rem"}
        top={"1rem"}
        width={'50%'}
      >
        <h4 style={{marginLeft:'0.5rem', marginBottom:'2.25rem'}}>Battery insights</h4>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mb={"1rem"}
          width={"102%"}
        >
          <Temp
            temp={"Battery Ah"}
            bg={500}
            unit={" Ah"}
            hFont="0.6rem"
            value={props.aH}
            fontSize="1.1rem"
            height="3.2rem"
          />
          <Temp
            temp={"temperature"}
            bg={500}
            hFont="0.6rem"
            unit={" °C"}
            value={props.temperature}
            fontSize="1.1rem"
            height="3.2rem"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Box_3;
