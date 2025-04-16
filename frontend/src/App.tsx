import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./ui/components/NavBar";

const App = () =>  {
  return (
    <div>
      <NavBar/>
      <AppRoutes />;
    </div>
  );
}

export default App;
