import React, { useContext } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Link,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import HttpsIcon from "@mui/icons-material/Https";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext, tokens } from "../../theme";

const ResetPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleFormSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }
    if (!email) {
      window.alert("Email is missing. Please restart password recovery.");
      navigate("/forgot-password");
      return;
    }

    try {
      const response = await fetch(`${colors.palette[50]}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: values.password }),
      });

      if (response.ok) {
        await response.json();
        navigate("/login");
      } else {
        const errorData = await response.json();
        window.alert(errorData.message || "Failed to reset password");
      }
    } catch (error) {
      window.alert("Error resetting password");
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
          backgroundImage: `linear-gradient(${
            theme.palette.mode === "dark"
              ? "rgba(7, 12, 20, 0.72), rgba(8, 12, 18, 0.62)"
              : "rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.45)"
          }), url('/assets/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
          border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`,
          background: isDark ? "rgba(9, 14, 20, 0.62)" : "rgba(255, 255, 255, 0.68)",
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
          maxWidth: 520,
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          backdropFilter: "blur(8px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 30px 80px rgba(0,0,0,0.55)"
              : "0 24px 72px rgba(12, 20, 25, 0.18)",
          background: isDark ? "rgba(9, 14, 20, 0.88)" : "rgba(255, 255, 255, 0.9)",
          p: { xs: 3, sm: 4.5 },
        }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                  color: isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.48)",
                  mb: 1,
                }}
              >
                Security
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.85rem", sm: "2.15rem" },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 1.2,
                  color: isDark ? "#f5fff9" : "#162228",
                }}
              >
                Reset Password
              </Typography>

              {email ? (
                <Typography
                  sx={{
                    mb: 3.5,
                    color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  Creating a new password for{" "}
                  <Box component="span" sx={{ color: colors.palette[500] }}>
                    {email}
                  </Box>
                </Typography>
              ) : (
                <Typography
                  sx={{
                    mb: 3.5,
                    color: isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  Session expired. Start recovery again to continue.
                </Typography>
              )}

              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  "& .auth-field .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.84)",
                  },
                  "& .auth-field .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)",
                  },
                  "& .auth-field .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark ? "rgba(255,255,255,0.36)" : "rgba(0,0,0,0.25)",
                  },
                  "& .auth-field .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderWidth: "1px",
                    borderColor: colors.palette[500],
                  },
                }}
              >
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  className="auth-field"
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
                            color: isDark ? "rgba(255,255,255,0.74)" : "rgba(0,0,0,0.58)",
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
                  label="Confirm Password"
                  className="auth-field"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={!!touched.confirmPassword && !!errors.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsIcon
                          sx={{
                            color: isDark ? "rgba(255,255,255,0.74)" : "rgba(0,0,0,0.58)",
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
                to="/login"
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
                Back to login
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
                    color: isDark ? "#08150e" : "#ffffff",
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
                  Reset Password
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

export default ResetPassword;
