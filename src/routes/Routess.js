import { Route, Routes } from "react-router-dom";
import Login from "../Authentication/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Home from "../pages/Home";
import Logout from "../Authentication/Logout";
import Header from "../layouts/Header/Header";
import Layout from "../layouts/layout/Layout";
import Settings from "../pages/Settings";

function Routess() {
    return(
        <div>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/pages/Home" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
                <Route path="/logout" element={<ProtectedRoute>  <Logout /> </ProtectedRoute>}/>
                <Route path="/header" element={<ProtectedRoute>  <Header /> </ProtectedRoute>}/>
                <Route path="/layout" element={<ProtectedRoute> <Layout/> </ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute> <Settings/> </ProtectedRoute>} />
                Settings
                <Route path="*" element={<Login />} />
            </Routes>
        </div>
    )
}
export default Routess