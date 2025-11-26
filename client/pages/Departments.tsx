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
