import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

import "./DashboardLayout.css";

function DashboardLayout() {

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>

    );
}

export default DashboardLayout;