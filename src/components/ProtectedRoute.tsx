import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../app/store";
import { Navigate } from "react-router-dom";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: string;
}) => {
  const { accessToken, user } = useTypedSelector((state) => state.auth);

  // First check if accessToken is missing in BOTH Redux AND localStorage
  if (!accessToken && !localStorage.getItem("accessToken")) {
    return <Navigate to="/login" replace />;
  }

  // Check role only after user is fully loaded
  if (role && user?.role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;  // Only one child passed here
};

export default ProtectedRoute;
