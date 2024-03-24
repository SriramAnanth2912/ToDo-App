/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const Authorise = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  return <Authorise.Provider value={{ token, setToken }}>{children}</Authorise.Provider>;
};
