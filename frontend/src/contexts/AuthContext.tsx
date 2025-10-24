import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    setLoggedIn: (val: boolean) => void;
    userData: any;
    setUserData: (data: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setLoggedIn: () => { },
    userData: null,
    setUserData: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token) {
            setLoggedIn(true);
            setUserData(user ? JSON.parse(user) : null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
