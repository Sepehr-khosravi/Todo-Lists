import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import Todos from "./screens/Todos";
import AuthLayout from "./screens/AuthLayout";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import Footer from "./screens/Footer";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";


function AppRoutes() {
  const { isLoggedIn, userData } = useContext(AuthContext);

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
        <Route path="/" element={<Home user={{}} />} />
          <Route path="/auth/*" element={<AuthLayout />}>
            <Route index element={<SignInForm />} />
            <Route path="signin" element={<SignInForm />} />
            <Route path="signup" element={<SignUpForm />} />
          </Route>

          <Route path="/signin" element={<Navigate to="/auth/signin" replace />} />
          <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home user={userData} />} />
          <Route path="/todos" element={<Todos user={userData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar /> 
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
