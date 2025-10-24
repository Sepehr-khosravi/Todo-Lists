import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import dataConfig from "../config"; "../config/";

export default function SignInForm() {
    const [form, setForm] = useState({ email: "", password: "", confirm: "" });
    const [error, setError] = useState<string>("");
    const [welcome, setWelcome] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            if (!form.password || !form.confirm || form.password !== form.confirm) {
                setError("Passwords do not match!");
                return;
            }

            const { confirm, ...data } = form;
            const apiAddress = dataConfig.Server_Address + dataConfig.Api.Auth.Signin;

            const response = await axios.post(apiAddress , data);

            if (!response || !response.data) {
                setError("Connection Error!");
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email" , response.data.user.email);
            setWelcome("Welcome!");
            window.location.href = "/";
        } catch (e: any) {
            console.error("Connection Error:", e);
            setError("Something went wrong!");
        }
    };

    return (
        <div className="auth-inner">
            <h2>Sign in to your account</h2>
            <form className="auth-form">
                <input
                autoComplete="off"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                autoComplete="off"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    type="password"
                    required
                />
                <input
                autoComplete="off"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    type="password"
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                {welcome && <p style={{ color: "green" }}>{welcome}</p>}
                <button type="button" onClick={handleSubmit}>
                    Sign In
                </button>
            </form>
            <p className="auth-footer">
                New here? <Link to="/auth/signup">Create an account</Link>
            </p>
        </div>
    );
}
