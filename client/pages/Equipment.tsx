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
  Package,
  MapPin,
  Calendar as CalendarIcon,
  DollarSign,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Trash2,
  Eye,
  Edit,
  Calendar as CalendarDays,
  UserCheck,
  X,
  Filter,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "../hooks/use-debounce";

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof EquipmentItem;
  direction: SortDirection;
}

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: "In Use" | "Available" | "Maintenance" | "Out of Order";
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  description: string;
  assignedTo?: string;
  lastMaintenance?: string;
  warrantyExpiry?: string;
}

// Mock data for equipment - expanded from president's dashboard
const mockEquipment: EquipmentItem[] = [
  {
    id: "1",
    name: "PA System",
    category: "Audio",
    status: "In Use",
    location: "Main Hall",
    purchaseDate: "2023-01-15",
    purchasePrice: 2500,
    description: "Professional sound system with 8-channel mixer and speakers",
    assignedTo: "Worship Team",
    lastMaintenance: "2024-08-10",
    warrantyExpiry: "2026-01-15"
  },
  {
    id: "2",
    name: "Projector",
    category: "AV",
    status: "Maintenance",
    location: "Main Hall",
    purchaseDate: "2022-06-20",
    purchasePrice: 1800,
    description: "4K projector for presentations and video playback",
    assignedTo: "Technical Team",
    lastMaintenance: "2024-10-05",
    warrantyExpiry: "2025-06-20"
  },
  {
    id: "3",
    name: "Drum Set",
    category: "Musical",
    status: "In Use",
    location: "Worship Room",
    purchaseDate: "2021-09-10",
    purchasePrice: 1200,
    description: "Complete drum kit with cymbals and hardware",
    assignedTo: "Worship Team",
    lastMaintenance: "2024-07-15",
    warrantyExpiry: "2024-09-10"
  },
  {
    id: "4",
    name: "Microphones (Set of 4)",
    category: "Audio",
    status: "Available",
    location: "Equipment Storage",
    purchaseDate: "2023-03-08",
    purchasePrice: 800,
    description: "Wireless microphone set with receivers",
    assignedTo: "Available for use",
    lastMaintenance: "2024-09-20",
    warrantyExpiry: "2026-03-08"
  },
  {
    id: "5",
    name: "Piano",
    category: "Musical",
    status: "In Use",
    location: "Main Hall",
    purchaseDate: "2020-11-25",
    purchasePrice: 3500,
    description: "Digital piano with weighted keys",
    assignedTo: "Music Ministry",
    lastMaintenance: "2024-06-30",
    warrantyExpiry: "2025-11-25"
  },
  {
    id: "6",
    name: "Chairs (Stackable)",
    category: "Furniture",
    status: "In Use",
    location: "Main Hall",
    purchaseDate: "2022-05-15",
    purchasePrice: 1200,
    description: "Stackable chairs for events",
    assignedTo: "Event Team",
    lastMaintenance: "2024-09-01",
    warrantyExpiry: "2025-05-15"
  }
];

const Equipment: React.FC = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentItem[]>(mockEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [formData, setFormData] = useState<Partial<EquipmentItem>>({});

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter and sort equipment
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEquipment.length / itemsPerPage);
  const paginatedEquipment = sortedEquipment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof EquipmentItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAdd = () => {
    if (formData.name && formData.category && formData.status && formData.location) {
      const newEquipment: EquipmentItem = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        status: formData.status as EquipmentItem['status'],
        location: formData.location,
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
        purchasePrice: formData.purchasePrice || 0,
        description: formData.description || '',
        assignedTo: formData.assignedTo,
        lastMaintenance: formData.lastMaintenance,
        warrantyExpiry: formData.warrantyExpiry
      };
      setEquipment(prev => [...prev, newEquipment]);
      setIsAddDialogOpen(false);
      setFormData({});
      toast({ title: "Equipment added successfully" });
    }
  };

  const handleEdit = () => {
    if (selectedEquipment && formData.name && formData.category && formData.status && formData.location) {
      setEquipment(prev => prev.map(item =>
        item.id === selectedEquipment.id
          ? { ...item, ...formData }
          : item
      ));
      setIsEditDialogOpen(false);
      setSelectedEquipment(null);
      setFormData({});
      toast({ title: "Equipment updated successfully" });
    }
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    toast({ title: "Equipment deleted successfully" });
  };

  const getStatusIcon = (status: EquipmentItem['status']) => {
    switch (status) {
      case 'In Use': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Available': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Maintenance': return <Wrench className="h-4 w-4 text-yellow-500" />;
      case 'Out of Order': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: EquipmentItem['status']) => {
    switch (status) {
      case 'In Use': return 'text-green-700 bg-green-100';
      case 'Available': return 'text-blue-700 bg-blue-100';
      case 'Maintenance': return 'text-yellow-700 bg-yellow-100';
      case 'Out of Order': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment Management</h1>
          <p className="text-muted-foreground">Manage church equipment and inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.status || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EquipmentItem['status'] }))}
                >
                  <option value="">Select Status</option>
                  <option value="In Use">In Use</option>
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Order">Out of Order</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Equipment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="statusFilter">Status</Label>
            <select
              id="statusFilter"
              className="w-full p-2 border rounded"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="In Use">In Use</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Order">Out of Order</option>
            </select>
          </div>
          <div>
            <Label htmlFor="categoryFilter">Category</Label>
            <select
              id="categoryFilter"
              className="w-full p-2 border rounded"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="AV">AV</option>
              <option value="Musical">Musical</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Equipment Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead onClick={() => handleSort('location')} className="cursor-pointer">
                Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status}
                  </div>
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.assignedTo || 'Not assigned'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEquipment(item);
                        setFormData(item);
                        setIsEditDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedEquipment.length)} to {Math.min(currentPage * itemsPerPage, sortedEquipment.length)} of {sortedEquipment.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.status || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EquipmentItem['status'] }))}
              >
                <option value="In Use">In Use</option>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Out of Order">Out of Order</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-assignedTo">Assigned To</Label>
              <Input
                id="edit-assignedTo"
                value={formData.assignedTo || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Update Equipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Equipment;
