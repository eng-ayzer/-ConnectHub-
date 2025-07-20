import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/Slices/AuthSlices";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  }

  return (
    
    <button
      className="flex items-center text-red-600 hover:underline"
      onClick={handleLogout}
    >
      <LogOut className="w-5 h-5 mr-1" />
    </button>
  );
};

export default LogoutButton;
