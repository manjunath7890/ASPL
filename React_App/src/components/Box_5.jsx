import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Box, Skeleton, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Button from "@mui/material/Button";

function Box_5(props) {
  const [switchValue, setSwitchValue] = useState(true);
  const [access, setAccess] = useState();
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSwitchChange = (value) => {
    const newValue = value;
    setSwitchValue(newValue);

    postData(newValue);
  };

  const postData = async (value) => {
    try {
      const response = await fetch(`${colors.palette[50]}/postinput`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          var1: value,
          var2: props.user,
          var3: props.role
        }),
      });
      if (response.ok) {
        // console.log(`Switch value (${value}) posted successfully!`);
      } else {
        console.log("Failed to post switch value.");
      }
    } catch (error) {
      console.error("Error posting switch value:", error);
    }
  };

  

  useEffect(() => {

    const checkSwitchValue = async () => {
      if(props.signal === 0){
        try {
          const response = await fetch(
            `${colors.palette[50]}/getinput?user=${props.user}`
          );
          if (response.ok) {
            const data = await response.json();
            setSwitchValue(data.var1);
            setAccess(data.var3);
          } else {
            console.log("Failed to fetch initial switch value.");
          }
        } catch (error) {
          console.error("Error fetching initial switch value:", error);
        }
      }
    };

    const intervalId = setInterval(checkSwitchValue, 6000);
    return () => clearInterval(intervalId);
  }, [colors.palette, props.signal, props.user]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const CustomButton = withStyles({
    root: {
      width: 100,
      height: 50,
      borderRadius: "0.7rem",
      border: "2px solid",
      borderColor:
        props.signal === 0 && switchValue === true
          ? colors.palette[500]
          : (props.signal === 0 && switchValue === false && (access === props.role || access === 'customer'))
          ? colors.palette[1400]
          : colors.palette[700],
      color:
        props.signal === 0 && switchValue === true
          ? colors.palette[500]
          : (props.signal === 0 && switchValue === false && (access === props.role || access === 'customer'))
          ? colors.palette[1400]
          : colors.palette[700],
      fontSize: "1.4rem",
      fontWeight: "500",
    },
    label: {
      textTransform: "capitalize",
    },
  })(Button);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      height="100%"
      width="100%"
      position="relative"
      p={"0.5rem"}
    >
      <Box>
        <Box
          style={{
            fontSize: "1.8rem",
            fontWeight: "500",
            margin: "-0.3rem 0",
            color: colors.palette[100],
          }}
        >
          {props.vehicleName}
        </Box>
        <Box
          style={{
            fontSize: "1rem",
            color: colors.palette[510],
          }}
        >
          {props.vehicleNumber}
        </Box>
      </Box>

      <Box
        style={{
          padding: "0.3rem 0.9rem",
          background: colors.palette[100],
          fontSize: "0.7rem",
          color: colors.palette[110],
          fontWeight: 500,
          position: "absolute",
          top: "1rem",
          right: "1rem",
          borderRadius: "0.5rem",
        }}
      >
        {props.signal === 1 ? "ONLINE" : "OFFLINE"}
      </Box>

      <Box
        position="absolute"
        bottom="0.2rem"
        right="0.2rem"
      >
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={100}
            height={50}
            style={{ borderRadius: "0.5rem" }}
          />
        ) : (
          <>
            {props.signal === 0 && switchValue === true ? (
              <Box
                boxShadow={colors.palette[200]}
                borderRadius={"1rem"}
                p={"0.3rem"}
                border={`1px solid ${colors.palette[800]}`}
                mt={"1.5rem"}
              >
                <CustomButton
                  onClick={() => handleSwitchChange(!switchValue)}
                  disabled={props.signal === 1}
                >
                  {switchValue === true ? "ON" : "OFF"}
                </CustomButton>
              </Box>
            ) : (props.signal === 0 && access === props.role) ||
              access === "customer" ? (
              <Box
                boxShadow={colors.palette[200]}
                borderRadius={"1rem"}
                p={"0.3rem"}
                border={`1px solid ${colors.palette[800]}`}
                mt={"1.5rem"}
              >
                <CustomButton
                  onClick={() => handleSwitchChange(!switchValue)}
                  disabled={props.signal === 1}
                >
                  {switchValue === true ? "ON" : "OFF"}
                </CustomButton>
              </Box>
            ) : props.signal === 1 ? (
              <Box fontSize={"0.7rem"}>
                <Box
                  boxShadow={colors.palette[200]}
                  borderRadius={"1rem"}
                  p={"0.3rem"}
                  border={`1px solid ${colors.palette[800]}`}
                  mt={"1.5rem"}
                >
                  <CustomButton>
                    {switchValue === true ? "ON" : "OFF"}
                  </CustomButton>
                </Box>
              </Box>
            ) : (
              <Box fontSize={"0.7rem"}>
                <Box
                  boxShadow={colors.palette[200]}
                  borderRadius={"1rem"}
                  p={"0.3rem"}
                  border={`1px solid ${colors.palette[800]}`}
                  m={"0.8rem 0"}
                >
                  <CustomButton>
                    {switchValue === true ? "ON" : "OFF"}
                  </CustomButton>
                </Box>
                {access} turned off
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Box_5;
