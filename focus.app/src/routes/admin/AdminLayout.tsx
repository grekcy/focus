import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <Container>
      <Typography>Admin Layout</Typography>
      <Outlet />
    </Container>
  );
}
