import { Alert, Container, Typography } from "@mui/material";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useFocusApp, useFocusClient } from "../FocusProvider";

export function LoginPage() {
  const navigate = useNavigate();
  const app = useFocusApp();
  const api = useFocusClient();

  const cookies = new Cookies();

  const [error, setError] = useState("");

  return (
    <>
      <Typography variant="h5" flexGrow={1}>
        Login
      </Typography>

      <Container>
        {error && <Alert severity="error">{error}</Alert>}

        <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID!}>
          <GoogleLogin
            onSuccess={(resp) => {
              api
                .loginWithGoogle(resp.credential!, resp.clientId!)
                .then((r) => {
                  cookies.set("focus-token", r.value, {
                    path: "/",
                    maxAge: 86300 * 100,
                  });
                })
                .then(() => navigate("/inbox"))
                .catch((e) => app.toast(e.message, "error"));
            }}
            onError={() => setError("Login Failed")}
          ></GoogleLogin>
        </GoogleOAuthProvider>
      </Container>
    </>
  );
}
