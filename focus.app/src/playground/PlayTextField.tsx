import { Chip, TextField, Typography } from '@mui/material';

export function PlayTextField() {
  return (
    <>
      <Typography>With chip</Typography>
      <TextField
        InputProps={{
          startAdornment: (
            <>
              <Chip label="focus" color="primary" onDelete={() => {}} />
              <Chip label="grekcy" color="secondary" onDelete={() => {}} />
            </>
          ),
        }}
        fullWidth
      />

      <Typography>Width: with sx</Typography>
      <TextField sx={{ width: { sm: 200, md: 300 } }} placeholder="with sx" />

      <Typography>Width: with sx</Typography>
      <TextField sx={{ width: 300 }} placeholder="with sx" />
    </>
  );
}
