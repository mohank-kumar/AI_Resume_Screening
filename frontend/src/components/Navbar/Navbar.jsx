import "./Navbar.css";

function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (

        <header className="navbar">

            <div className="navbar-title">

                <h2>Dashboard</h2>


            </div>


            {user && user.email && (

                <div className="user-profile-badge">

                    <div className="user-avatar">
                        {(user.full_name || "HR")
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div className="user-info">

                        <span className="user-name">
                            {user.full_name || "HR Admin"}
                        </span>

                        <span className="user-email">
                            {user.email}
                        </span>

                    </div>

                </div>

            )}

        </header>

    );
}

export default Navbar;