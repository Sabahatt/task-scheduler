import { Route, Routes } from "react-router-dom";
import DashboardController from "@/ui/screens/dashboard/DashboardController";
import BrowseTaskController from "@/ui/screens/tasks/browse/BrowseTaskController";
import BrowseMemberController from "@/ui/screens/members/browse/BrowseMemberController";
import AddTaskController from "@/ui/screens/tasks/create/CreateTaskController";
import EditTaskController from "@/ui/screens/tasks/edit/EditTaskController";
import CreateMemberController from "@/ui/screens/members/create/CreateMemberController";
import EditMemberController from "@/ui/screens/members/edit/EditMemberController";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardController />} />
      <Route path="/tasks" element={<BrowseTaskController />} />
      <Route path="/tasks/add" element={<AddTaskController />} />
      <Route path="/task/edit/:id" element={<EditTaskController />} />
      <Route path="/members" element={<BrowseMemberController />} />
      <Route path="/members/add" element={<CreateMemberController />} />
      <Route path="/members/edit/:id" element={<EditMemberController />} />
    </Routes>
  );
};

export default AppRoutes;
