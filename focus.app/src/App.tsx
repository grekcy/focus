import { AlertColor, Box } from "@mui/material";
import { useRef, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppBar } from "./AppBar";
import {
  FocusClientProvider,
  FocusProvider,
  IFocusApp,
  IFocusProvider,
} from "./FocusProvider";
import { DrawerHeader, SideBar } from "./SideBar";
import { PlaygroundIndex } from "./playground/PlaygroundPage";
import { CardPage } from "./routes/Cards";
import { ChallengePage } from "./routes/Challenge";
import { ErrorPage } from "./routes/ErrorPage";
import { ForecastPage } from "./routes/Forecast";
import { InboxPage } from "./routes/Inbox";
import { LabelsPage } from "./routes/LabelsPage";
import { PerformancePage } from "./routes/Performance";
import { PlanningPage } from "./routes/Planning";
import { Root } from "./routes/Root";
import { TodayPage } from "./routes/Today";

function App() {
  const [openSideBar, setOpenSideBar] = useState(false);

  const impl: IFocusApp = {
    toggleSidebar() {
      setOpenSideBar((p) => !p);
    },
    toast(message: string, severity?: AlertColor) {
      focusRef.current && focusRef.current.toast(message, severity);
    },
  };

  const focusRef = useRef<IFocusProvider>(null);

  return (
    <CookiesProvider>
      <FocusClientProvider>
        <FocusProvider app={impl} ref={focusRef}>
          <BrowserRouter>
            <Box sx={{ display: "flex" }}>
              <AppBar open={openSideBar} />
              <SideBar open={openSideBar} />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* FIXME 여기에 이렇게 DrawerHeader를 두는건 좀... */}
                <DrawerHeader />
                <Routes>
                  <Route
                    index
                    element={<Root />}
                    errorElement={<ErrorPage />}
                  />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/today" element={<TodayPage />} />
                  <Route path="/forecast" element={<ForecastPage />} />
                  <Route path="/cards/:cardNo" element={<CardPage />} />
                  <Route
                    path="/challenges/:challengeId"
                    element={<ChallengePage />}
                  />
                  <Route path="/planning" element={<PlanningPage />} />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="/labels" element={<LabelsPage />} />
                  <Route
                    path="/playground/:playId?"
                    element={<PlaygroundIndex />}
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Box>
            </Box>
          </BrowserRouter>
        </FocusProvider>
      </FocusClientProvider>
    </CookiesProvider>
  );
}
export default App;
