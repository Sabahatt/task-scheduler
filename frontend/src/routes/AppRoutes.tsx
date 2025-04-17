import { Route, Routes } from "react-router-dom";
import DashboardController from "@/ui/screens/dashboard/DashboardController";
import BrowseTaskController from "@/ui/screens/tasks/browse/BrowseTaskController";
import BrowseMemberController from "@/ui/screens/members/browse/BrowseMemberController";
import AddTaskController from "@/ui/screens/tasks/create/CreateTaskController";
import EditTaskController from "@/ui/screens/tasks/edit/EditTaskController";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardController />} />
      <Route path="/tasks" element={<BrowseTaskController />} />
      <Route path="/tasks/add" element={<AddTaskController />} />
      <Route path="/task/edit/:id" element={<EditTaskController />} />
      <Route path="/members" element={<BrowseMemberController />} />
    </Routes>
  );
};

export default AppRoutes;
