import { Box } from "@mui/material";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppBar } from "./AppBar";
import { BoardPage } from "./routes/board";
import { CardPage } from "./routes/card";
import { ErrorPage } from "./routes/ErrorPage";
import { ForecastPage } from "./routes/forecast";
import { InboxPage } from "./routes/Inbox";
import { Root } from "./routes/Root";
import { TodayPage } from "./routes/today";
import { DrawerHeader, SideBar } from "./sidebar";

function App() {
  const [open, setOpen] = useState(false);

  function toggleSideBar() {
    setOpen((p) => !p);
  }

  return (
    <CookiesProvider>
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <AppBar open={open} onMenuClick={() => toggleSideBar()} />
          <SideBar open={open} onClose={() => toggleSideBar()} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Routes>
              <Route index element={<Root />} errorElement={<ErrorPage />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/today" element={<TodayPage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/cards/:cardId" element={<CardPage />} />
              <Route path="/boards/:boardId" element={<BoardPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </CookiesProvider>
  );
}
export default App;
