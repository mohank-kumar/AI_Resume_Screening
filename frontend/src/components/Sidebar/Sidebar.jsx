import { useNavigate, NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
    FaHome,
    FaFileAlt,
    FaUsers,
    FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (

        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">

                <div className="logo-icon">
                    AI
                </div>

                <div className="logo-text">
                    <h2>Smart Screening</h2>
                    
                </div>

            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">

                <p className="nav-section-title">
                    MAIN MENU
                </p>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <FaHome className="nav-icon" />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <FaFileAlt className="nav-icon" />
                    <span>Jobs</span>
                </NavLink>


                <NavLink
                    to="/candidates"
                    className={({ isActive }) =>
                        isActive ? "nav-item active" : "nav-item"
                    }
                >
                    <FaUsers className="nav-icon" />
                    <span>Candidates</span>
                </NavLink>

            </nav>


            {/* Bottom */}
            <div className="sidebar-bottom">

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="nav-icon" />

                    <span>Logout</span>
                </button>

            </div>

        </aside>

    );
}

export default Sidebar;