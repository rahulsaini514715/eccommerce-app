import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth,setAuth]=useAuth()
  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        })
        localStorage.setItem('auth',JSON.stringify(res.data))
        navigate(location.state || "/");//same page pe redirect kareyega login se pahale jo page vist karna chata tha
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
       <Layout title="Login - Ecommer App">
  <div
    className="d-flex align-items-center justify-content-center"
    style={{
      minHeight: "78vh",
      background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
    }}
  >
    <div
      className="p-4 shadow-lg bg-white"
      style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "20px",
      }}
    >
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#343a40" }}>
          Welcome Back 👋
        </h2>
        <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
          <strong>Admin Login use this:</strong>Email address : admin@gmail.com | password: 1234
        </p>
        <p className="text-muted" style={{ fontSize: "0.9rem" }}>
          Or register first if you’re a new user
        </p>
      </div>

      <form onSubmit={handleSubmit} >
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 text-end">
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate("/forgot-password")}
            style={{ fontSize: "0.9rem", color: "#0d6efd" }}
          >
            Forgot Password?
          </button>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary rounded-pill">
            Login
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</Layout>
  );
};

export default Login;
