import { Outlet, NavLink } from "react-router-dom";
import ThemeToggle from "../components/ButtonThem";
import "./styles/auth.css";

export default function AuthLayout() {
    return (
        <div className="auth-page-root">
            <div className="circle"></div>
            <div className="auth-left">
                <div className="brand">
                    <h1>MyApp</h1>
                    <p>Welcome — please sign in or create an account</p>
                </div>
                <div className="nav-switch">
                    <NavLink to="/auth/signin" className={({ isActive }) => isActive ? "tab active" : "tab"}>
                        Sign In
                    </NavLink>
                    <NavLink to="/auth/signup" className={({ isActive }) => isActive ? "tab active" : "tab"}>
                        Sign Up
                    </NavLink>
                </div>
            </div>

            <div className="auth-card">
                {/* Outlet will render SignInForm or SignUpForm based on nested route */}
                <Outlet />
                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
