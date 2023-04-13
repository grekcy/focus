import { Box } from "@mui/material";
import { Ref, forwardRef, useImperativeHandle, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppBar } from "./AppBar";
import { DrawerHeader, SideBar } from "./SideBar";

export function PublicLayout() {
  return <Outlet />;
}

export interface ILayout {
  toggleSideBar: () => void;
}

interface LayoutProps {}

export const Layout = forwardRef(({}: LayoutProps, ref: Ref<ILayout>) => {
  const [openSideBar, setOpenSideBar] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleSideBar() {
      setOpenSideBar((p) => !p);
    },
  }));

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar open={openSideBar} />
      <SideBar open={openSideBar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* FIXME 여기에 이렇게 DrawerHeader를 두는건 좀... */}
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
});
