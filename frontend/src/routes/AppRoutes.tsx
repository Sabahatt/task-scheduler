import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardController from "../ui/screens/dashboard/DashboardController";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route>
          <Route path="/" element={<DashboardController />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
