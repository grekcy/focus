import { Alert, AlertColor, Snackbar, SnackbarOrigin } from "@mui/material";
import { Ref, forwardRef, useImperativeHandle, useState } from "react";

interface ToastProps {
  defaultseverity?: AlertColor;
  anchorOrigin?: SnackbarOrigin;
  audoHideDuration?: number;
}

export interface IToast {
  toast: (message: string, severity?: AlertColor) => void;
}

export const Toast = forwardRef(
  (
    {
      defaultseverity = "info",
      anchorOrigin = { vertical: "top", horizontal: "center" },
      audoHideDuration = 6000,
    }: ToastProps,
    ref: Ref<IToast>
  ) => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSeverity, setToastSeverity] =
      useState<AlertColor>(defaultseverity);

    useImperativeHandle(ref, () => ({
      toast(message: string, severity?: AlertColor) {
        setToastSeverity(severity ? severity : defaultseverity);
        setToastMessage(message);
        setOpenToast(true);
      },
    }));

    return (
      <Snackbar
        open={openToast}
        anchorOrigin={anchorOrigin}
        autoHideDuration={audoHideDuration}
        onClose={(e, r) => {
          if (r === "clickaway") return;
          setOpenToast(false);
        }}
      >
        <Alert severity={toastSeverity} onClose={() => setOpenToast(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    );
  }
);
