import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Authentication/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./Authentication/Logout";
import './assets/scss/themes.scss';
import { ToastContainer } from "react-toastify";
import Routess from "./routes/Routess";
function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Routess/>
    </div>
  );
}

export default App;
