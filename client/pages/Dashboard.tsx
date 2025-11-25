import { useAuth } from "@/contexts/AuthContext";
import GrandPereMereDashboard from "./dashboards/GrandPereMereDashboard";
import PresidentDashboard from "./dashboards/PresidentDashboard";
import DefaultDashboard from "./dashboards/DefaultDashboard";

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

    default:
      return <DefaultDashboard />;
  }
}
