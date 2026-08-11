import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";

import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) return;

        try {

            setLoading(true);

            const response = await loginUser({
                email,
                password
            });

            const userData = response?.data || response;

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            navigate("/dashboard");

        } catch (error) {

            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);
            console.log(error);

            alert(
                error.response?.data?.detail ||
                "Invalid Credentials"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card">

                {/* Logo / Brand */}

                <div className="login-brand">

                    <div className="brand-icon">
                        R
                    </div>

                    <span>Resume AI</span>

                </div>


                {/* Heading */}

                <div className="login-heading">

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your AI Resume Screening System
                    </p>

                </div>


                {/* Login Form */}

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }

                    </button>

                </form>


                {/* Register */}

                <p className="auth-footer">

                    Don't have an account?{" "}

                    <span
                        className="auth-link"
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </span>

                </p>

            </div>

        </div>

    );
}

export default Login;