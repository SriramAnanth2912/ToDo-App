import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Authorise } from "../Authenticate";
import styles from "../home.styles.module.css";

export default function LoginSingUp() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { setToken } = useContext(Authorise);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const NavigateTo = useNavigate();

  function handleChange(event) {
    setformData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data);
        NavigateTo("/todo");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      const data = await response.json();
      if (response.ok) {
        setToken(data);
        NavigateTo("/todo");
      } else {
        console.error("Signup failed:", data.message);
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>ToDo</h1>
      <form className={styles["form-page"]} name="LoginSignup">
        <label>
          email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="write your email"
            autoComplete="true"
            required
          />
        </label>
        <label>
          password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            autoComplete="true"
            required
          />
        </label>
        <button type="submit" className={styles["form-login"]} onClick={handleLogin}>
          Login
        </button>
        <button type="submit" className={styles["form-signup"]} onClick={handleSignup}>
          newUser? <span>Signup</span>
        </button>
      </form>
    </div>
  );
}
