import styles from "./Header.module.css";
import React from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear token & auth state
    navigate("/login"); // Redirect to login page
  };
  return (
    <>
      <div className={styles.header}>
        <header>
          <b>Welcome to Janky</b>
        </header>
        <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
      </div>

      
    </>
  );
}

export default Header;
