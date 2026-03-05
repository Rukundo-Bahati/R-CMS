import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();

  if (!user) return null;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">
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
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-gray-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
