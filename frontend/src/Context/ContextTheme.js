import { useState, createContext, useContext } from "react";

const ContextTheme = createContext();

const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);

  return (
    <ContextTheme.Provider value={[theme, setTheme]}>
      {children}
    </ContextTheme.Provider>
  );
};

//custom hook
const useTheme = () => useContext(ContextTheme);

export { useTheme, ThemeProvider };
