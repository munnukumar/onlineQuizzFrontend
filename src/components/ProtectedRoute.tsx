import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

// Typed selector for Redux state
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);

  // Redirect if no access token exists in both Redux and localStorage
  if (!accessToken && !localStorage.getItem("accessToken")) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if role is specified and user's role does not match
  if (role && user?.role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
