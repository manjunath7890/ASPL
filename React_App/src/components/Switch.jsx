import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Box, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../theme";
import Button from "@mui/material/Button";

function SwitchToggle(props) {
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

  const checkSwitchValue = async () => {
    if (props.signal === 0) {
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
          var3: props.role,
        }),
      });
      if (response.ok) {
        checkSwitchValue();
      } else {
        console.log("Failed to post switch value.");
      }
    } catch (error) {
      console.error("Error posting switch value:", error);
    }
  };

  useEffect(() => {
    checkSwitchValue();
  }, [props.signal, props.user, props.role]);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6000);  // more than interval of status checking
    return () => clearTimeout(timer);
  }, []);

  const CustomButton = withStyles({
    root: {
      width: 100,
      height: 50,
      borderRadius: "0.8rem",
      border: "2px solid",
      borderColor:
        props.signal === 0 && switchValue === true
          ? colors.palette[500]
          : (props.signal === 0 &&
            switchValue === false &&
            access === props.role) ||
            access === "customer"
            ? colors.palette[1400]
            : (props.signal === 1 &&
              switchValue === false &&
              access === props.role) ||
              access === "customer"
              ? colors.palette[1400]
              : colors.palette[700],
      color:
        props.signal === 0 && switchValue === true
          ? colors.palette[500]
          : (props.signal === 0 &&
            switchValue === false &&
            access === props.role) ||
            access === "customer"
            ? colors.palette[1400]
            : (props.signal === 1 &&
              switchValue === false &&
              access === props.role) ||
              access === "customer"
              ? colors.palette[1400]
              : colors.palette[700],
      fontSize: "1.5rem",
      fontWeight: "500",
    },
    label: {
      textTransform: "capitalize",
    },
  })(Button);

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          {/* <Skeleton
            animation="wave"
            variant="rectangular"
            width={130}
            height={30}
            style={{ marginBottom: "1rem", borderRadius: "0.5rem" }}
          /> */}
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={130}
            height={70}
            style={{ borderRadius: "0.5rem" }}
          />
        </Box>
      ) : (
        <Box>
          {/* <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 1rem",
              padding: "0.2rem",
              paddingRight: "0.4rem",
              background:
                props.signal === 1 ? colors.palette[1150] : colors.palette[400],
              color:
                props.signal === 1 ? colors.palette[510] : colors.palette[1400],
              fontSize: "0.6rem",
              borderRadius: "0.3rem",
              fontWeight: 500,
            }}
          >
            {props.signal === 1 ? "ONLINE" : "OFFLINE"}
          </Box> */}
          {props.signal === 0 && switchValue === true ? (
            <Box>
            <Box
              boxShadow={colors.palette[200]}
              borderRadius={"1rem"}
              p={"0.3rem"}
              border={`1px solid ${colors.palette[800]}`}
              // mt={"1.5rem"}
            >
              <CustomButton
                onClick={() => handleSwitchChange(!switchValue)}
                disabled={props.signal === 1}
              >
                {switchValue === true ? "ON" : "OFF"}
              </CustomButton>
              
            </Box>
            <Box ml={"0.5rem"} mt={"1.5rem"}></Box>
            </Box>
          ) : (props.signal === 0 && access === props.role) ||
            access === "customer" ? (
            <Box
              boxShadow={colors.palette[200]}
              borderRadius={"1rem"}
              p={"0.3rem"}
              border={`1px solid ${colors.palette[800]}`}
              // mt={"1.5rem"}
            >
              <CustomButton
                onClick={() => handleSwitchChange(!switchValue)}
                disabled={props.signal === 1}
              >
                {switchValue === true ? "ON" : "OFF"}
              </CustomButton>
              
            </Box>
          ) : props.signal === 1 && switchValue === true ? (
            <Box fontSize={"0.7rem"}>
              <Box
                boxShadow={colors.palette[200]}
                borderRadius={"1rem"}
                p={"0.3rem"}
                border={`1px solid ${colors.palette[800]}`}
                // mt={"1.5rem"}
              >
                <CustomButton>
                  {switchValue === true ? "ON" : "OFF"}
                </CustomButton>
              </Box>
              <Box ml={"0.5rem"} mt={"1.5rem"}></Box>
            </Box>
          ) : props.signal === 1 &&
            switchValue === false &&
            access === props.role ? (
            <Box fontSize={"0.7rem"}>
              <Box
                boxShadow={colors.palette[200]}
                borderRadius={"1rem"}
                p={"0.3rem"}
                border={`1px solid ${colors.palette[800]}`}
                // mt={"1.5rem"}
              >
                <CustomButton onClick={() => handleSwitchChange(!switchValue)}>
                  {switchValue === true ? "ON" : "OFF"}
                </CustomButton>
              </Box>
              <Box ml={"0.5rem"} mt={"1.5rem"}></Box>
            </Box>
          ) : (
            <Box fontSize={"0.7rem"}>
              <Box
                boxShadow={colors.palette[200]}
                borderRadius={"1rem"}
                p={"0.3rem"}
                border={`1px solid ${colors.palette[800]}`}
                // m={"0.8rem 0"}
              >
                <CustomButton>
                  {switchValue === true ? "ON" : "OFF"}
                </CustomButton>
              </Box>
             <Box ml={"0.5rem"} mt={"0.5rem"}>{access} turned off</Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SwitchToggle;
