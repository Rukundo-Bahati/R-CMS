import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Users,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Briefcase as BriefcaseIcon,
  Trash2,
  Eye,
  Edit,
  Calendar as CalendarDays,
  UserCheck,
  X,
  Target,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "../hooks/use-debounce";

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof Department;
  direction: SortDirection;
}

interface Department {
  id: string;
  name: string;
  description: string;
  leader: string;
  email: string;
  phone: string;
  memberCount: number;
  status: "active" | "inactive";
  established: string;
  activities: string[];
  color: string;
}

// Mock data for departments - expanded from president's dashboard
const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Worship",
    description: "Leading worship services and music ministry",
    leader: "John Doe",
    email: "worship@church.org",
    phone: "+1234567890",
    memberCount: 25,
    status: "active",
    established: "2020-01-15",
    activities: ["Sunday Services", "Special Events", "Music Practice"],
    color: "#4f46e5"
  },
  {
    id: "2",
    name: "Youth Ministry",
    description: "Ministering to young people and teenagers",
    leader: "Jane Smith",
    email: "youth@church.org",
    phone: "+1234567891",
    memberCount: 32,
    status: "active",
    established: "2019-03-20",
    activities: ["Youth Meetings", "Outreach Programs", "Summer Camps"],
    color: "#10b981"
  },
  {
    id: "3",
    name: "Women's Ministry",
    description: "Supporting and empowering women in the church",
    leader: "Emily Davis",
    email: "women@church.org",
    phone: "+1234567892",
    memberCount: 28,
    status: "active",
    established: "2018-06-10",
    activities: ["Women's Retreats", "Bible Studies", "Community Service"],
    color: "#f59e0b"
  },
  {
    id: "4",
    name: "Men's Ministry",
    description: "Building strong men through fellowship and service",
    leader: "Robert Johnson",
    email: "men@church.org",
    phone: "+1234567893",
    memberCount: 22,
    status: "active",
    established: "2018-09-05",
    activities: ["Men's Breakfast", "Service Projects", "Leadership Training"],
    color: "#8b5cf6"
  },
  {
    id: "5",
    name: "Children's Ministry",
    description: "Nurturing children in faith and learning",
    leader: "Sarah Brown",
    email: "children@church.org",
    phone: "+1234567894",
    memberCount: 18,
    status: "active",
    established: "2021-02-14",
    activities: ["Sunday School", "Vacation Bible School", "Children's Programs"],
    color: "#ec4899"
  },
  {
    id: "6",
    name: "Evangelism",
    description: "Spreading the gospel and outreach programs",
    leader: "Michael Wilson",
    email: "evangelism@church.org",
    phone: "+1234567895",
    memberCount: 20,
    status: "active",
    established: "2019-11-30",
    activities: ["Community Outreach", "Mission Trips", "Visitation Ministry"],
    color: "#14b8a6"
  },
  {
    id: "7",
    name: "Administration",
    description: "Managing church operations and administration",
    leader: "Lisa Garcia",
    email: "admin@church.org",
    phone: "+1234567896",
    memberCount: 15,
    status: "active",
    established: "2017-01-01",
    activities: ["Office Management", "Record Keeping", "Event Planning"],
    color: "#f97316"
  },
  {
    id: "8",
    name: "Finance",
    description: "Managing church finances and stewardship",
    leader: "David Lee",
    email: "finance@church.org",
    phone: "+1234567897",
    memberCount: 12,
    status: "active",
    established: "2017-01-01",
    activities: ["Budget Planning", "Financial Reporting", "Fundraising"],
    color: "#84cc16"
  }
];

interface DepartmentDialogProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Department) => void;
  mode: 'view' | 'edit';
}

const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
  department,
  isOpen,
  onClose,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<Omit<Department, 'id'>>({
    name: '',
    description: '',
    leader: '',
    email: '',
    phone: '',
    memberCount: 0,
    status: 'active',
    established: '',
    activities: [],
    color: '#4f46e5',
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
        leader: department.leader,
        email: department.email,
        phone: department.phone,
        memberCount: department.memberCount,
        status: department.status,
        established: department.established,
        activities: department.activities,
        color: department.color,
      });
    }
  }, [department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'activities') {
      setFormData(prev => ({
        ...prev,
        activities: value.split(',').map(activity => activity.trim()).filter(activity => activity.length > 0)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'memberCount' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (department) {
      onSave({ ...formData, id: department.id });
    } else {
      onSave({ ...formData, id: Date.now().toString() });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' ? (
              <>
                <Building2 className="w-5 h-5" />
                Department Profile
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                {department ? 'Edit Department' : 'Add New Department'}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader">Department Leader</Label>
              <Input
                id="leader"
                name="leader"
                value={formData.leader}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberCount">Member Count</Label>
              <Input
                id="memberCount"
                name="memberCount"
                type="number"
                value={formData.memberCount}
                onChange={handleChange}
                disabled={mode === 'view'}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established Date</Label>
              <Input
                id="established"
                name="established"
                type="date"
                value={formData.established}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={mode === 'view'}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activities">Activities (comma-separated)</Label>
            <Input
              id="activities"
              name="activities"
              value={formData.activities.join(', ')}
              onChange={handleChange}
              disabled={mode === 'view'}
              placeholder="e.g. Sunday Services, Bible Studies, Community Outreach"
            />
          </div>

          {mode === 'edit' && (
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Departments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const itemsPerPage = 5;

  // On mount, set department data
  useEffect(() => {
    setDepartments(mockDepartments);
  }, []);

  const sortedAndFilteredDepartments = React.useMemo(() => {
    let result = [...departments];

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((department) => {
        return (
          department.name.toLowerCase().includes(searchLower) ||
          department.leader.toLowerCase().includes(searchLower) ||
          department.description.toLowerCase().includes(searchLower) ||
          department.activities.some(activity => activity.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [departments, debouncedSearchTerm, sortConfig]);

  const requestSort = (key: keyof Department) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedAndFilteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepartments = sortedAndFilteredDepartments.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (key: keyof Department) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const SortableHeader = ({ columnKey, children }: { columnKey: keyof Department; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1">{getSortIcon(columnKey)}</span>
      </div>
    </TableHead>
  );

  const handleAddDepartment = (newDepartment: Department) => {
    setDepartments(prev => {
      const updated = [...prev, newDepartment];
      toast({
        title: "Department Added",
        description: `${newDepartment.name} has been added successfully.`,
      });
      return updated;
    });
    setIsAddOpen(false);
  };

  const handleUpdateDepartment = (updatedDepartment: Department) => {
    setDepartments(prev => {
      const updated = prev.map(department =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      );
      toast({
        title: "Department Updated",
        description: `${updatedDepartment.name}'s details have been updated.`,
      });
      return updated;
    });
    setIsDialogOpen(false);
  };

  const handleDeleteDepartment = (departmentId: string, departmentName: string) => {
    const deleteDepartment = () => {
      setDepartments(prev => {
        const newDepartments = prev.filter(department => department.id !== departmentId);
        toast({
          title: "Department Deleted",
          description: `${departmentName} has been removed successfully.`,
          variant: "default",
        });
        return newDepartments;
      });
    };

    // Store the toast instance first
    const toastInstance = toast({
      title: "Confirm Deletion",
      description: `Are you sure you want to delete ${departmentName}? This action cannot be undone.`,
      variant: "destructive",
      action: (
        <button
          onClick={() => {
            deleteDepartment();
            // Dismiss the current toast using the stored instance
            toastInstance.dismiss();
          }}
          className="ml-4 px-3 py-1.5 text-sm font-medium text-white bg-destructive rounded hover:bg-destructive/90 focus:outline-none"
        >
          Delete
        </button>
      ),
    });
  };

  const openDepartmentDialog = (department: Department, mode: 'view' | 'edit') => {
    setSelectedDepartment(department);
    setDialogMode(mode);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all church departments
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        </DialogTrigger>
        <DepartmentDialog
          department={null}
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddDepartment}
          mode="edit"
        />
      </Dialog>

      {/* Department View/Edit Dialog */}
      <DepartmentDialog
        department={selectedDepartment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleUpdateDepartment}
        mode={dialogMode}
      />
      </div>

      <div className="mb-8">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="text-xs text-gray-500 mt-1 px-1">
            {currentDepartments.length} {currentDepartments.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {currentDepartments.length > 0 ? (
        <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <SortableHeader columnKey="name">Department</SortableHeader>
              <SortableHeader columnKey="leader">Leader</SortableHeader>
              <SortableHeader columnKey="memberCount">Members</SortableHeader>
              <SortableHeader columnKey="status">Status</SortableHeader>
              <TableHead className="w-[80px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: department.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{department.name}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{department.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{department.leader}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{department.memberCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    department.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {department.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openDepartmentDialog(department, 'view')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => openDepartmentDialog(department, 'edit')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Department</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDeleteDepartment(department.id, department.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Remove Department</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-600">No departments found matching your search</p>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {Math.min(startIndex + 1, sortedAndFilteredDepartments.length)} to {Math.min(startIndex + currentDepartments.length, sortedAndFilteredDepartments.length)} of {sortedAndFilteredDepartments.length} departments
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm px-2">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
