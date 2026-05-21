import { Navigate } from "react-router-dom";

const { useState, useEffect } = require("react");
const { default: api } = require("../api/axios");

function ProtectedRoute({ children, allowedRole }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        const role = res.data.data.user.role;
        setStatus(role === allowedRole ? "allowed" : "denied");
      })
      .catch(() => setStatus("denied"));
  }, [allowedRole]);

  if (status === "loading") return <p>Loadng...</p>;
  if (status === "denied") return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
