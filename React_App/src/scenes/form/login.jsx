import React, { useContext, useEffect } from "react";
import { useTheme } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Link,
  Switch,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import HttpsIcon from "@mui/icons-material/Https";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const SECRET_KEY = "telematics_secure_local_storage_key"; // In production, move to .env

const Login = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";

  const navigate = useNavigate();
  const host = colors.palette[50];

  useEffect(() => {
    const email = localStorage.getItem("email");
    const encryptedPassword = localStorage.getItem("password");
    const isLoggedOut = localStorage.getItem("loggedOut") === "true";

    if (email && encryptedPassword && !isLoggedOut) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword) {
          handleFormSubmit({ email, password: originalPassword });
        }
      } catch (err) {
        console.error("Failed to decrypt stored password.");
      }
    }
  }, []);

  const handleFormSubmit = async (values) => {
    try {
      // Encrypt password before sending to the backend to avoid plaintext over network/logs
      const encryptedPayloadPassword = CryptoJS.AES.encrypt(values.password, SECRET_KEY).toString();
      const payload = { ...values, password: encryptedPayloadPassword };

      const response = await fetch(`${host}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Enter valid email or password");
      }

      const responseData = await response.json();

      props.onLogin(
        responseData.role,
        responseData.accessToken,
        responseData.dealerToken,
        responseData.financeToken
      );

      // Encrypt password before storing in localStorage
      const encryptedPassword = CryptoJS.AES.encrypt(values.password, SECRET_KEY).toString();

      localStorage.setItem("email", values.email);
      localStorage.setItem("password", encryptedPassword);
      localStorage.setItem("loggedOut", false);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={{ xs: 2, sm: 3 }}
      py={{ xs: 3, sm: 4 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(120deg, #0f1418 0%, #101b25 45%, #11292a 100%)"
            : "linear-gradient(125deg, #e9f4ef 0%, #f8f5ea 45%, #eef3ff 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${theme.palette.mode === "dark"
            ? "rgba(7, 12, 20, 0.72), rgba(8, 12, 18, 0.62)"
            : "rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.45)"
            }), url('/assets/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "loginBgDrift 18s ease-in-out infinite alternate",
          "@keyframes loginBgDrift": {
            "0%": { transform: "scale(1) translateY(0)" },
            "100%": { transform: "scale(1.05) translateY(-1.5%)" },
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: { xs: 200, sm: 280 },
          height: { xs: 200, sm: 280 },
          top: { xs: "-10%", sm: "-8%" },
          right: { xs: "-8%", sm: "6%" },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(0, 227, 150, 0.3) 0%, rgba(0, 227, 150, 0) 70%)"
              : "radial-gradient(circle, rgba(0, 163, 106, 0.26) 0%, rgba(0, 163, 106, 0) 70%)",
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: { xs: 220, sm: 320 },
          height: { xs: 220, sm: 320 },
          bottom: { xs: "-11%", sm: "-10%" },
          left: { xs: "-12%", sm: "4%" },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(60, 156, 255, 0.25) 0%, rgba(60, 156, 255, 0) 72%)"
              : "radial-gradient(circle, rgba(31, 119, 242, 0.2) 0%, rgba(31, 119, 242, 0) 72%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: { xs: 14, sm: 20 },
          right: { xs: 14, sm: 20 },
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          px: 1.2,
          py: 0.45,
          borderRadius: "999px",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`,
          background: theme.palette.mode === "dark" ? "rgba(9, 14, 20, 0.62)" : "rgba(255, 255, 255, 0.68)",
          backdropFilter: "blur(8px)",
        }}
      >
        <LightModeIcon sx={{ fontSize: "1rem", color: isDark ? "rgba(255,255,255,0.45)" : colors.palette[500] }} />
        <Switch
          checked={isDark}
          onChange={colorMode.toggleColorMode}
          inputProps={{ "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode" }}
          size="small"
          sx={{
            mx: -0.2,
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: colors.palette[500],
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: colors.palette[500],
            },
          }}
        />
        <DarkModeIcon sx={{ fontSize: "1rem", color: isDark ? colors.palette[500] : "rgba(0,0,0,0.35)" }} />
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "1060px",
          minHeight: { md: "620px" },
          position: "relative",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          borderRadius: "24px",
          overflow: "hidden",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          backdropFilter: "blur(8px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 30px 80px rgba(0,0,0,0.55)"
              : "0 24px 72px rgba(12, 20, 25, 0.18)",
          opacity: 0,
          transform: "translateY(22px)",
          animation:
            "loginContainerEnter 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards",
          "@keyframes loginContainerEnter": {
            "0%": { opacity: 0, transform: "translateY(22px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 6,
            color: theme.palette.mode === "dark" ? "#eef9f5" : "#0f2f24",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(160deg, rgba(11,28,31,0.88) 0%, rgba(7,17,27,0.88) 100%)"
                : "linear-gradient(160deg, rgba(240,250,245,0.9) 0%, rgba(228,238,255,0.88) 100%)",
          }}
        >
          <Box>
            <Box
              component="img"
              src={theme.palette.mode === "dark" ? "/assets/logo-dark.png" : "/assets/logo-light.png"}
              alt="Telematics logo"
              sx={{ height: 52, width: "auto", mb: 6 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 2 }}>
              Fleet intelligence for every route.
            </Typography>
            <Typography sx={{ opacity: 0.85, fontSize: "1.02rem", maxWidth: "30ch" }}>
              Monitor vehicle health, optimize operations, and respond in real time from one control hub.
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gap: 1.2, maxWidth: "33ch" }}>
            <Typography sx={{ fontSize: "0.88rem", opacity: 0.82 }}>
              Live status tracking
            </Typography>
            <Typography sx={{ fontSize: "0.88rem", opacity: 0.82 }}>
              Automated diagnostics and alerts
            </Typography>
            <Typography sx={{ fontSize: "0.88rem", opacity: 0.82 }}>
              Role-based dashboard accessss
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: { xs: 3, sm: 4.5, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background:
              theme.palette.mode === "dark"
                ? "rgba(9, 14, 20, 0.88)"
                : "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.62)"
                        : "rgba(0,0,0,0.48)",
                    mb: 1,
                  }}
                >
                  Secure Access
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.25rem" },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 1.2,
                    color: theme.palette.mode === "dark" ? "#f5fff9" : "#162228",
                  }}
                >
                  Welcome back
                </Typography>
                <Typography
                  sx={{
                    mb: 4,
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.72)"
                        : "rgba(0,0,0,0.6)",
                  }}
                >
                  Sign in to continue to your telematics dashboard.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    "& .login-field": {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(255,255,255,0.84)",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.18)"
                            : "rgba(0,0,0,0.12)",
                      },
                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.36)"
                            : "rgba(0,0,0,0.25)",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: "1px",
                        borderColor: colors.palette[500],
                      },
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    className="login-field"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.74)"
                                  : "rgba(0,0,0,0.58)",
                              fontSize: "1.25rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    className="login-field"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HttpsIcon
                            sx={{
                              color:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.74)"
                                  : "rgba(0,0,0,0.58)",
                              fontSize: "1.25rem",
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    mt: 1.5,
                    color: colors.palette[500],
                    textDecorationColor: "transparent",
                    transition: "text-decoration-color 200ms ease",
                    "&:hover": { textDecorationColor: colors.palette[500] },
                  }}
                >
                  Forgot password?
                </Link>

                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "3.3rem",
                      borderRadius: "12px",
                      fontSize: "0.98rem",
                      fontWeight: 700,
                      textTransform: "none",
                      color: theme.palette.mode === "dark" ? "#08150e" : "#ffffff",
                      background: `linear-gradient(90deg, ${colors.palette[500]} 0%, ${colors.palette[550]} 100%)`,
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 10px 24px rgba(0, 227, 150, 0.25)"
                          : "0 8px 20px rgba(2, 179, 132, 0.28)",
                      transition: "transform 180ms ease, box-shadow 180ms ease",
                      "&:hover": {
                        background: `linear-gradient(90deg, ${colors.palette[550]} 0%, ${colors.palette[500]} 100%)`,
                        transform: "translateY(-1px)",
                        boxShadow:
                          theme.palette.mode === "dark"
                            ? "0 14px 26px rgba(0, 227, 150, 0.3)"
                            : "0 10px 22px rgba(2, 179, 132, 0.32)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});
const initialValues = {
  email: "",
  password: "",
};

export default Login;
