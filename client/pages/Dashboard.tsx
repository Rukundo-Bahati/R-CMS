import { useAuth } from "@/contexts/AuthContext";
import GrandPereMereDashboard from "./dashboards/GrandPereMereDashboard";
import PresidentDashboard from "./dashboards/PresidentDashboard";
import ChoirDashboard from "./dashboards/ChoirDashboard";
import DefaultDashboard from "./dashboards/DefaultDashboard";
import UsherDashboard from "./dashboards/UsherDashboard";
import IntercessorDashboard from "./dashboards/IntercessorDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>;
  }

  switch (user.portal) {
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

    default:
      return <DefaultDashboard />;
  }
}
