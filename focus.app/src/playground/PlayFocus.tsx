import Button from "@mui/material/Button";
import { useFocusApp } from "../FocusProvider";

function PlayFocus() {
  const app = useFocusApp();

  return (
    <>
      <Button onClick={() => app.toast("hello world")}>Toast message</Button>
    </>
  );
}
export default PlayFocus;
