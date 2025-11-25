import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user.name}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/profile" className="flex items-center">
          <Avatar className="h-8 w-8 bg-gray-200 hover:bg-gray-300 transition-colors">
            <AvatarFallback className="bg-gray-200">
              <User className="h-4 w-4 text-gray-600" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
