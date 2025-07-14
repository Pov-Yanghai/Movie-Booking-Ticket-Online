import React, {useEffect} from "react";
import AdminDashboard from "../components/Admin/AdminDashborad";
import  {useNavigate} from "react-router-dom";
function AdminPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
export default AdminPage;