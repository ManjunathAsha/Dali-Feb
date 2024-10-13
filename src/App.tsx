import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import ColorModeContext from "./context/ColorModeContext";
import { useLanguage, LanguageProvider } from "./context/LanguageContext";
import { createCustomTheme } from "./context/CustomTheme";
import LoginPage from "./components/Authentication/LoginPage";
import Dashboard from "./components/pages/Dashboard";
import TranslationDemo from "./context/TranslationDemo";
import TranslationPrompt from "./context/TranslationPrompt ";

function App() {
  const { t, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Load mode from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    if (savedMode && (savedMode === "light" || savedMode === "dark")) {
      setMode(savedMode);
    }
  }, []);

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createCustomTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
