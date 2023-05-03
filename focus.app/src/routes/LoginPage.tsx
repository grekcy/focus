import { Alert, Container, Typography } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/components/AuthProvider';
import { useFocus } from '../lib/components/FocusProvider';

export function LoginPage() {
  const navigate = useNavigate();
  const [app, api] = useFocus();
  const auth = useAuth();

  const [error, setError] = useState('');

  return (
    <>
      <Typography variant="h5">Login</Typography>

      <Container>
        {error && <Alert severity="error">{error}</Alert>}

        <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID!}>
          <GoogleLogin
            onSuccess={(resp) => {
              api
                .loginWithGoogle(resp.credential!, resp.clientId!)
                .then((r) => auth.setToken(r.value))
                .then(() => navigate('/inbox'))
                .catch((e) => app.toast(e.message, 'error'));
            }}
            onError={() => setError('Login Failed')}
          ></GoogleLogin>
        </GoogleOAuthProvider>
      </Container>
    </>
  );
}
