import { Button } from '@mui/material';
import { useFocusApp } from '../lib/components/FocusProvider';

export function PlayFocus() {
  const app = useFocusApp();

  return (
    <>
      <Button onClick={() => app.toast('hello world')}>Toast message</Button>
    </>
  );
}
