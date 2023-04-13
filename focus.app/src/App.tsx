import { useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { RequireAuth } from "./lib/components/AuthProvider";
import { FocusProvider } from "./lib/components/FocusProvider";
import { PlayIndex } from "./playground/PlayIndex";
import { AccountPage } from "./routes/AccountPage";
import { CardPage } from "./routes/Cards";
import { ChallengeIndex } from "./routes/Challenge";
import { ErrorPage } from "./routes/ErrorPage";
import { ForecastPage } from "./routes/Forecast";
import { InboxPage } from "./routes/Inbox";
import { LabelsPage } from "./routes/LabelsPage";
import { ILayout, Layout, PublicLayout } from "./routes/Layout";
import { LoginPage } from "./routes/LoginPage";
import { PerformancePage } from "./routes/Performance";
import { PlanningPage } from "./routes/Planning";
import { RootPage } from "./routes/Root";
import { TodayPage } from "./routes/Today";
import { AdminLayout } from "./routes/admin/AdminLayout";
import { AdminPage } from "./routes/admin/AdminPage";

function App() {
  const ref = useRef<ILayout>(null);

  function toggleSideBar() {
    if (ref.current) ref.current.toggleSideBar();
  }

  return (
    <FocusProvider onToggleSideBar={toggleSideBar}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<RootPage />} errorElement={<ErrorPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route element={<Layout ref={ref} />}>
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/cards/:cardNo?" element={<CardPage />} />
            <Route path="/challenges/:id?" element={<ChallengeIndex />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/labels" element={<LabelsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/playground/:playId?" element={<PlayIndex />} />
          </Route>
          <Route
            element={
              <RequireAuth require="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/:param?" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FocusProvider>
  );
}
export default App;
