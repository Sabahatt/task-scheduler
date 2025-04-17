import "./App.css";
import AppRoutes from "@/routes/AppRoutes";
import NavBar from "@/ui/components/NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <NavBar />
      <AppRoutes />
      <ToastContainer position="top-right" />
    </Router>
  );
};

export default App;
