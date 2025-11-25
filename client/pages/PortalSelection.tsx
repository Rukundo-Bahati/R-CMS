import { useNavigate } from "react-router-dom";
import { useAuth, Portal } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  Music,
  Heart,
  DoorOpen,
  User,
  UserCheck,
  Home,
} from "lucide-react";

const portals = [
  {
    id: "president",
    name: "President",
    description: "Full system administration and oversight",
    icon: User,
    color: "from-blue-600 to-blue-700",
  },
  {
    id: "grand_pere_mere",
    name: "Grand Père/Mère",
    description: "Family and member management",
    icon: Heart,
    color: "from-purple-600 to-purple-700",
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Financial management and reporting",
    icon: Briefcase,
    color: "from-green-600 to-green-700",
  },
  {
    id: "family",
    name: "Family",
    description: "Family information access",
    icon: Home,
    color: "from-orange-600 to-orange-700",
  },
  {
    id: "choir",
    name: "Choir",
    description: "Attendance and scheduling",
    icon: Music,
    color: "from-pink-600 to-pink-700",
  },
  {
    id: "intercessors",
    name: "Intercessors",
    description: "Prayer group management",
    icon: UserCheck,
    color: "from-indigo-600 to-indigo-700",
  },
  {
    id: "ushers",
    name: "Ushers",
    description: "Event and member assistance",
    icon: DoorOpen,
    color: "from-amber-600 to-amber-700",
  },
  {
    id: "pastor",
    name: "Pastor",
    description: "Pastoral oversight and guidance",
    icon: Users,
    color: "from-red-600 to-red-700",
  },
];

export default function PortalSelection() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePortalSelect = (portalId: string) => {
    const demoUser = {
      id: "1",
      name: "Church Administrator",
      email: "admin@church.com",
      portal: portalId as Portal,
    };
    login(demoUser);
    navigate(`/dashboard/${portalId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            RCA R-CMS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Église du Réveil Chrétien Africain
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your portal to access the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <button
                key={portal.id}
                onClick={() => handlePortalSelect(portal.id)}
                className="group relative"
              >
                <div
                  className={`bg-gradient-to-br ${portal.color} rounded-lg p-8 text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 cursor-pointer h-full`}
                >
                  <Icon className="w-12 h-12 mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-xl font-bold mb-2">{portal.name}</h3>
                  <p className="text-sm opacity-90 mb-6 min-h-10">
                    {portal.description}
                  </p>
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold">
                    Access Portal
                  </Button>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
