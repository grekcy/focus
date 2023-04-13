import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFocusApp, useFocusClient } from "../FocusProvider";
import { User } from "../lib/proto/focus_v1alpha1_pb";
import { newGuestUser } from "../lib/proto/helper";

export function AccountPage() {
  const [user, setUser] = useState<User.AsObject>(newGuestUser());

  const app = useFocusApp();
  const api = useFocusClient();

  useEffect(() => {
    api
      .getProfile()
      .then((r) => setUser(r))
      .catch((e) => app.toast(e.message, "error"));
  }, []);

  return (
    <>
      <Typography variant="h5">Profile</Typography>
      <ul>
        <li>Email: {user.email}</li>
        <li>Name: {user.name}</li>
      </ul>
    </>
  );
}
