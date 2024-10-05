import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in (based on localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Dashboard setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default App;
