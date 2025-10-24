import "./styles/navbar.css";
import ThemeToggle from "./ButtonThem";
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from "react";


export default function Navbar() {
    const [isLogin, setLogin] = useState<boolean>(false);
    const [userEmail , setUserEmail] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        setUserEmail(email ? email : "");
        setLogin(token && email ? true : false);
    }, []);
    return (
        <div className="navbar">
            <ThemeToggle />
            <div className="items-div">
                <NavLink to="/" className={({ isActive }) => isActive ? "active-NavLink" : "div"}>
                    <p>Home</p>
                </NavLink>
                <NavLink to="/todos" className={({ isActive }) => isActive ? "active-NavLink" : "div"}>
                    <p>Todos</p>
                </NavLink>
            </div>
            {!isLogin ? (
                <>
                    <div className="button-div">

                        <NavLink to="/auth/signin" className="button-one">
                            <p>SignIn</p>
                        </NavLink>
                        <NavLink to="/auth/signup" className="button-two">
                            <p>SignUp</p>
                        </NavLink>
                    </div>
                </>
            ) : (
                <>
                    <div style={{marginRight : "20px"}}><p>{userEmail}</p></div>
                </>
            )
            }
        </div >
    )
}
