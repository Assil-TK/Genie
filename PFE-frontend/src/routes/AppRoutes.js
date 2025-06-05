import React, { useEffect } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { Box } from "@mui/material";

import PageCreation from "../admin/PageCreation";
import DashboardContent from "../admin/DashboardContent";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import HeaderAdmin from "../components/Header admin";
import SidebarAdmin from "../components/Sidebar admin";
import SultanChatbot from "../admin/SultanChatBot";
import SultanPreview from "../admin/SultanPreview";
import PageRenderer from "../client/PageRenderer";
import AdminModificationWizard from "../admin/AdminModificationWizard";
import HistoryPage from "../pages/HistoryPage";
import AuthPage from "../pages/AuthPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import PendingAdmins from "../admin/PendingAdmins";
import ActivityLog from "../admin/ActivityLog";
import SupprimerPage from "../admin/SupprimerPage";
import VersionManager from "../admin/VersionManager";
import AdminList from "../admin/AdminList";
import Unauthorized from "../admin/Unauthorized";
import RequireAuth from "../pages/RequireAuth";
import EditFilePage from "../pages/admin/EditFilePage";
import DynamiquePage from "./DynamiquePage";
import AdminCreatePage from "../pages/admin/AdminCreatePage";
import Parking from "../pages/Parking";
import PagePreviewInterface from "../pages/admin/PagePreviewInterface";
import ProjectUpload from "../admin/ProjectUpload";
import { ProjectProvider } from "../contexts/ProjectContext";
import ProjectList from "../pages/admin/ProjectList";
import ProjectDownload from "../pages/admin/ProjectList";
import ProjectDeploy from "../pages/admin/ProjectDeploy";
import AvisInterface from "../pages/admin/AvisInterface";
import AdminTableau from "../pages/admin/AdminTableau";
import WelcomeScreen from "../pages/admin/WelcomeScreen";
import RepoExplorer from '../pages/RepoExplorer';
import EditFile from '../pages/EditFile';
import FileContent from '../pages/filecontent';
import GeneratePage from '../pages/GeneratePage';
import FileContent2 from '../pages/filecontent2';
import Menu from '../pages/Menu';
import DeployGit from '../pages/deploygit';


import { removeFromFrontend } from "../services/api"; // Cleanup API

const DynamicPage = () => {
  const { route } = useParams();
  return <PageRenderer route={route} />;
};

const AppRoutes = ({ toggleSidebar, sidebarOpen }) => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.startsWith("/login");

  // Routes where you want to show HeaderAdmin and SidebarAdmin instead
  const adminHeaderSidebarRoutes = [
    "/admin/tableau",
    "/admin/history",
    "/admins",
  ];

  // Check if current path matches one of the special admin routes exactly or starts with them (for subpaths)
  const useAdminHeaderSidebar = adminHeaderSidebarRoutes.some((path) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
  );

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath !== "/filecontent3") {
      removeFromFrontend()
        .then(() => console.log("Frontend cleanup done."))
        .catch((err) => console.error("Cleanup failed:", err));
    }
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {isAdminPage && (
        <>
          {useAdminHeaderSidebar ? (
            <>
              <HeaderAdmin
                toggleSidebar={toggleSidebar}
                sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}
              />
              <SidebarAdmin open={sidebarOpen} />
            </>
          ) : (
            <>
              <Header
                toggleSidebar={toggleSidebar}
                sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}
              />
              <Sidebar open={sidebarOpen} />
            </>
          )}
        </>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2 }}>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/login/forgot-password" element={<ForgotPassword />} />
            <Route path="/login/reset-password" element={<ResetPassword />} />
            <Route path="/admin/dashboard" element={<DashboardContent />} />
            <Route path="/admin/delete" element={<SupprimerPage />} />
            <Route path="/admin/create" element={<PageCreation />} />
            <Route path="/admin/SultanChatbot/:pageId" element={<SultanChatbot />} />
            <Route path="/admin/SultanPreview" element={<SultanPreview />} />
            <Route path="/admin/modify" element={<AdminModificationWizard />} />
            <Route path="/admin/history" element={<HistoryPage />} />
            <Route path="/admin/my-history" element={<ActivityLog />} />
            <Route path="/admin/version-manager" element={<VersionManager />} />
            <Route path="/admins" element={<AdminList />} />
            <Route path="/admins/pending" element={<PendingAdmins />} />
            <Route path="/admin/SultanPreview/:pageId" element={<SultanPreview />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/preview" element={<PagePreviewInterface />} />
            <Route path="/admin/editfile" element={<EditFilePage />} />
            <Route path="/admin/createFile" element={<AdminCreatePage />} />
            <Route path="*" element={<div>Page non trouvée</div>} />
            <Route path="/:pageName" element={<DynamiquePage />} />
            <Route path="/admin/upload" element={<ProjectUpload />} />
            <Route path="/admin/download" element={<ProjectDownload />} />
            <Route path="/admin/deploy" element={<ProjectDeploy />} />
            <Route path="/admin/avis" element={<AvisInterface />} />
            
            <Route path="/admin/tableau" element={<AdminTableau />} />
            <Route path="/repo-explorer" element={<RepoExplorer />} />
            <Route path="/edit-file" element={<EditFile />} />
            <Route path="/filecontent" element={<FileContent />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/home" element={<Menu />} />
            <Route path="/deploygit" element={<DeployGit/>} />
            <Route path="/filecontent2" element={<FileContent2 />} />
 



















</Routes>
        </ProjectProvider>
      </Box>
    </Box>
  );
};

export default AppRoutes;
