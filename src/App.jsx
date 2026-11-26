import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./components/Shell";
import WorkspaceLayout from "./components/WorkspaceLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/Workspaces";
import WorkspaceOverview from "./pages/WorkspaceOverview";
import DocumentEditor from "./pages/DocumentEditor";
import Kanban from "./pages/Kanban";
import AIAssistant from "./pages/AIAssistant";
import Members from "./pages/Members";
import MobileShell from "./components/MobileShell";
import useIsMobile from "./hooks/useIsMobile";

export default function App() {
const mobile = useIsMobile();
const Layout = mobile ? MobileShell : Shell;
  return (   
    <Routes>
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
     <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/w/:id" element={<WorkspaceLayout />}>
          <Route index element={<WorkspaceOverview />} />
          <Route path="board" element={<Kanban />} />
          <Route path="ai" element={<AIAssistant />} />
          <Route path="members" element={<Members />} />
        </Route>
        <Route path="/w/:id/doc/:fid" element={<DocumentEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}