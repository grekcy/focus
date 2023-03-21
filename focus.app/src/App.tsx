import { Alert, AlertColor, Box, Snackbar } from "@mui/material";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppBar } from "./AppBar";
import { FocusContext, IFocusApp } from "./FocusProvider";
import { DnDDemo } from "./demo/dnd";
import { FocusAPI } from "./lib/api";
import { ErrorPage } from "./routes/ErrorPage";
import { InboxPage } from "./routes/Inbox";
import { Root } from "./routes/Root";
import { TodayPage } from "./routes/Today";
import { CardPage } from "./routes/card";
import { ChallengePage } from "./routes/challenge";
import { ForecastPage } from "./routes/forecast";
import { PerformancePage } from "./routes/performance";
import { PlanningPage } from "./routes/planning";
import { DrawerHeader, SideBar } from "./sidebar";

function App() {
  const [openSideBar, setOpenSideBar] = useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<AlertColor>("success");

  // TODO authentication
  const service = new FocusAPI("http://localhost:8080");

  const impl: IFocusApp = {
    toggleSidebar() {
      setOpenSideBar((p) => !p);
    },
    toast(message: string, severity?: AlertColor) {
      setToastSeverity(severity ? severity : "info");
      setToastMessage(message);
      setOpenToast(true);
    },
    client() {
      return service;
    },
  };

  return (
    <CookiesProvider>
      <FocusContext.Provider value={impl}>
        <BrowserRouter>
          <Box sx={{ display: "flex" }}>
            <AppBar open={openSideBar} />
            <SideBar open={openSideBar} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <DrawerHeader />
              <Routes>
                <Route index element={<Root />} errorElement={<ErrorPage />} />
                <Route path="/inbox" element={<InboxPage />} />
                <Route path="/today" element={<TodayPage />} />
                <Route path="/forecast" element={<ForecastPage />} />
                <Route path="/cards/:cardId" element={<CardPage />} />
                <Route
                  path="/challenges/:challengeId"
                  element={<ChallengePage />}
                />
                <Route path="/planning" element={<PlanningPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/demo/dnd" element={<DnDDemo />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
        <Snackbar
          open={openToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={(e, r) => {
            if (r === "clickaway") return;
            setOpenToast(false);
          }}
        >
          <Alert severity={toastSeverity} onClose={() => setOpenToast(false)}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </FocusContext.Provider>
    </CookiesProvider>
  );
}
export default App;
