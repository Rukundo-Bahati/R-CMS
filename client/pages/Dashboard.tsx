import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import GrandPereMereDashboard from "./dashboards/GrandPereMereDashboard";
import PresidentDashboard from "./dashboards/PresidentDashboard";
import ChoirDashboard from "./dashboards/ChoirDashboard";
import DefaultDashboard from "./dashboards/DefaultDashboard";
import UsherDashboard from "./dashboards/UsherDashboard";
import IntercessorDashboard from "./dashboards/IntercessorDashboard";
import PastorDashboard from "./dashboards/PastorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const { portal: portalParam } = useParams();

  const portal = (portalParam || user?.portal)?.replace(/-/g, '_');

  if (!user) {
    return <p>Loading...</p>;
  }

  switch (portal) {
    case "grand_pere_mere":
      return <GrandPereMereDashboard />;

    case "president":
      return <PresidentDashboard />;

    case "choir":
      return <ChoirDashboard />;
    case "ushers":
      return <UsherDashboard />;
    case "intercessors":
      return <IntercessorDashboard />;
    case "pastor":
      return <PastorDashboard />;
    case "admin":
      return <AdminDashboard />;

    default:
      return <DefaultDashboard />;
  }
}
