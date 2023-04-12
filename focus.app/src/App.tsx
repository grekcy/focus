import { Box } from "@mui/material";
import { useState } from "react";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppBar } from "./AppBar";
import { FocusClientProvider, FocusProvider } from "./FocusProvider";
import { DrawerHeader, SideBar } from "./SideBar";
import { PlayIndex } from "./playground/PlayIndex";
import { AccountPage } from "./routes/AccountPage";
import { CardPage } from "./routes/Cards";
import { ChallengeIndex } from "./routes/Challenge";
import { ErrorPage } from "./routes/ErrorPage";
import { ForecastPage } from "./routes/Forecast";
import { InboxPage } from "./routes/Inbox";
import { LabelsPage } from "./routes/LabelsPage";
import { LoginPage } from "./routes/LoginPage";
import { PerformancePage } from "./routes/Performance";
import { PlanningPage } from "./routes/Planning";
import { RootPage } from "./routes/Root";
import { TodayPage } from "./routes/Today";

function App() {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <CookiesProvider>
      <FocusClientProvider>
        <FocusProvider onToggleSideBar={() => setOpenSideBar((p) => !p)}>
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
                    element={<RootPage />}
                    errorElement={<ErrorPage />}
                  />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/today" element={<TodayPage />} />
                  <Route path="/forecast" element={<ForecastPage />} />
                  <Route path="/cards/:cardNo?" element={<CardPage />} />
                  <Route
                    path="/challenges/:challengeId?"
                    element={<ChallengeIndex />}
                  />
                  <Route path="/planning" element={<PlanningPage />} />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="/labels" element={<LabelsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/playground/:playId?" element={<PlayIndex />} />
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
