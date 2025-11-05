import { Route, Routes } from "react-router-dom";
import Login from "../Authentication/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Logout from "../Authentication/Logout";
import Header from "../layouts/Header/Header";
import Layout from "../layouts/layout/Layout";
import Settings from "../pages/Settings";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import DashboardV from "../pages/dashboard/Vendor/DashboardV";

function Routess() {
    return(
        <div>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<ProtectedRoute>  <Logout /> </ProtectedRoute>}/>
                <Route path="/header" element={<ProtectedRoute>  <Header /> </ProtectedRoute>}/>
                <Route path="/layout" element={<ProtectedRoute> <Layout/> </ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute> <Layout><Settings/></Layout> </ProtectedRoute>} />
                <Route path="/pages/dashboard/admin/Dashboard" element={<ProtectedRoute> <Layout><Dashboard/></Layout> </ProtectedRoute>} />
                <Route path="/pages/dashboard/Vendor/Dashboard" element={<ProtectedRoute> <Layout><DashboardV/></Layout> </ProtectedRoute>} />
                <Route path="*" element={<Login />} />
            </Routes>
        </div>
    )
}
export default Routess