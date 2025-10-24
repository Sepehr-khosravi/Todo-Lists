import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import dataConfig from "../config";

export default function SignUpForm() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState<string>("");
    const [welcome, setWelcome] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            const apiAddress = dataConfig.Server_Address + dataConfig.Api.Auth.Signup;
            const response = await axios.post(apiAddress, form);

            if (!response || !response.data) {
                setError("Invalid data or connection error.");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.user.email);
            setWelcome("Welcome!");
            window.location.href = "/";
        } catch (e: any) {
            console.error("Connection Error:", e);
            setError("Something went wrong!");
        }
    };

    return (
        <div className="auth-inner">
            <h2>Create your account</h2>
            <form className="auth-form">
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    type="text"
                    required
                />
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    type="password"
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                {welcome && <p style={{ color: "green" }}>{welcome}</p>}
                <button type="button" onClick={handleSubmit}>
                    Sign Up
                </button>
            </form>
            <p className="auth-footer">
                Already have an account? <Link to="/auth/signin">Sign in</Link>
            </p>
        </div>
    );
}
