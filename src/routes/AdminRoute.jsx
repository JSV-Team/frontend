import { Navigate, Outlet, useLocation } from "react-router-dom";

// Helper function to decode JWT payload without external library
const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.role ? payload.role.toLowerCase() : null;
  } catch (e) {
    console.error("Token decoding error:", e);
    return null;
  }
};

function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = getRoleFromToken(token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    console.warn("Unauthorized access attempt to admin area. Forced redirect.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
