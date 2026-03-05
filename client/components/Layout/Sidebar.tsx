import { Link, useLocation } from "react-router-dom";
import { useAuth, Portal } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Users2,
  Clock,
  Wallet,
  Package,
  FileText,
  User,
  Home,
  Music,
  Heart,
  UserCheck,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Calendar,
  StickyNote,
  Mic,
  BookOpen,
  ListTodo,
  Mail,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const getNavItems = (portal: Portal): NavItem[] => {
  const baseHref = `/dashboard/${portal}`;

  switch (portal) {
    case "president":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Equipment",
          href: `${baseHref}/equipment`,
          icon: <Package className="w-5 h-5" />,
        },
        {
          label: "Finance",
          href: `${baseHref}/finance`,
          icon: <Wallet className="w-5 h-5" />,
        },
        {
          label: "Departments",
          href: `${baseHref}/departments`,
          icon: <Home className="w-5 h-5" />,
        },
        {
          label: "Committee",
          href: `${baseHref}/committee`,
          icon: <Users2 className="w-5 h-5" />,
        },

        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "grand_pere_mere":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Families",
          href: `${baseHref}/families`,
          icon: <Heart className="w-5 h-5" />,
        },
        {
          label: "Schedule",
          href: `${baseHref}/schedule`,
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: "Assignments",
          href: `${baseHref}/assignments`,
          icon: <ListTodo className="w-5 h-5" />,
        },
        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "accountant":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Expenses",
          href: `${baseHref}/expenses`,
          icon: <Wallet className="w-5 h-5" />,
        },

        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "choir":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Attendance",
          href: `${baseHref}/attendance`,
          icon: <Clock className="w-5 h-5" />,
        },
        {
          label: "Contribution",
          href: `${baseHref}/contribution`,
          icon: <Wallet className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Committee",
          href: `${baseHref}/committee`,
          icon: <Users2 className="w-5 h-5" />,
        },

        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "ushers":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Attendance",
          href: `${baseHref}/attendance`,
          icon: <UserCheck className="w-5 h-5" />,
        },
        {
          label: "Schedule",
          href: `${baseHref}/schedule`,
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "intercessors":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Schedule",
          href: `${baseHref}/schedule`,
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "pastor":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Preachers",
          href: `${baseHref}/preachers`,
          icon: <Mic className="w-5 h-5" />,
        },
        {
          label: "Schedule",
          href: `${baseHref}/schedule`,
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Events",
          href: `${baseHref}/events`,
          icon: <BookOpen className="w-5 h-5" />,
        },
        {
          label: "Notes & Plans",
          href: `${baseHref}/notes`,
          icon: <StickyNote className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    case "admin":
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Members",
          href: `${baseHref}/members`,
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: "Committee",
          href: `${baseHref}/committee`,
          icon: <Users2 className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        }
      ];

    default:
      return [
        {
          label: "Dashboard",
          href: `${baseHref}`,
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: "Messaging",
          href: `${baseHref}/messages`,
          icon: <Mail className="w-5 h-5" />,
        },
        {
          label: "Profile",
          href: "/profile",
          icon: <User className="w-5 h-5" />,
        },
      ];
  }
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.portal);
  const baseHref = `/dashboard/${user.portal}`;

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 shadow-lg transition-all duration-300 z-50 border-r border-sidebar-border",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "border-b border-sidebar-border flex items-center justify-between transition-all duration-300",
        isCollapsed ? "p-4" : "p-6"
      )}>
        <Link
          to={baseHref}
          className={cn(
            "flex items-center gap-2 text-lg font-bold transition-opacity",
            isCollapsed && "opacity-0 w-0"
          )}
        >
          <Home className="w-7 h-7 flex-shrink-0" />
          <span className="text-sm">R-CMS</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <p className="text-sm opacity-90 px-6 py-2 capitalize">
          {user.portal?.replace("_", " ")}
        </p>
      )}

      <nav className={cn(
        "flex-1 p-2 overflow-y-auto",
        isCollapsed ? "overflow-x-hidden" : ""
      )}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors group relative",
              location.pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="opacity-90 flex-shrink-0">{item.icon}</span>
            {!isCollapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </nav>

      <div className={cn(
        "border-t border-sidebar-border transition-all duration-300 flex flex-col gap-1",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium group relative",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Toggle theme" : undefined}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              Toggle Theme
            </div>
          )}
        </button>

        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium group relative",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
