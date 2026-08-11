import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../api/authApi";

import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setErrorMsg("");

        try {

            await registerUser({
                full_name: name,
                email,
                password
            });

            alert(
                "Account created successfully! Please log in."
            );

            navigate("/login");

        } catch (error) {

            console.log(error);

            setErrorMsg(
                error.response?.data?.detail ||
                "Registration failed. Please try again."
            );

            setLoading(false);

        }

    };

    return (

        <div className="login-page">

            <div className="login-card register-card">

                {/* Brand */}

                <div className="login-brand">

                    <div className="brand-icon">
                        R
                    </div>

                    <span>Resume AI</span>

                </div>


                {/* Heading */}

                <div className="login-heading">

                    <h1>Create Account</h1>

                    <p>
                        Register as an HR administrator
                    </p>

                </div>


                {/* Error */}

                {errorMsg && (

                    <div className="register-error">

                        <span>⚠</span>

                        <p>{errorMsg}</p>

                    </div>

                )}


                {/* Form */}

                <form
                    className="login-form"
                    onSubmit={handleRegister}
                >

                    {/* Full Name */}

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Email */}

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


                    {/* Password */}

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* Login */}

                <p className="auth-footer">

                    Already have an account?{" "}

                    <span
                        className="auth-link"
                        onClick={() => navigate("/login")}
                    >
                        Login here
                    </span>

                </p>

            </div>

        </div>

    );
}

export default Register;