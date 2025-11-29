import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Search, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Mock members data
const initialMembers = [
    { id: "1", name: "John Smith", voice: "Tenor", status: "Active" },
    { id: "2", name: "Mary Johnson", voice: "Soprano", status: "Active" },
    { id: "3", name: "Peter Brown", voice: "Bass", status: "Active" },
    { id: "4", name: "Sarah Williams", voice: "Alto", status: "Active" },
    { id: "5", name: "Michael Davis", voice: "Tenor", status: "Inactive" },
    { id: "6", name: "Lisa Garcia", voice: "Soprano", status: "Active" },
    { id: "7", name: "James Miller", voice: "Bass", status: "Active" },
    { id: "8", name: "Maria Rodriguez", voice: "Alto", status: "Active" },
];

export default function ChoirAttendance() {
    const [date, setDate] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});

    // Filter members based on search
    const filteredMembers = initialMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Initialize attendance if not set for filtered members
    const handleToggle = (id: string) => {
        setAttendance(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleToggleAll = (present: boolean) => {
        const newAttendance = { ...attendance };
        filteredMembers.forEach(member => {
            newAttendance[member.id] = present;
        });
        setAttendance(newAttendance);
    };

    const handleSave = () => {
        // Here you would typically save to backend
        console.log({
            date: format(date, "yyyy-MM-dd"),
            attendance
        });
        toast.success("Attendance saved successfully");
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalCount = filteredMembers.length;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Choir Attendance</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage attendance for choir rehearsals and events.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Attendance
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl font-semibold">Member List</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
                            <div className="text-sm font-medium">
                                Mark all as:
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleToggleAll(true)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                    <Check className="w-4 h-4 mr-1" /> Present
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleAll(false)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <X className="w-4 h-4 mr-1" /> Absent
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Voice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Attendance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.voice}</TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                                    member.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                )}>
                                                    {member.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={cn(
                                                        "text-sm font-medium w-16 text-center",
                                                        attendance[member.id] ? "text-green-600" : "text-red-600"
                                                    )}>
                                                        {attendance[member.id] ? "Present" : "Absent"}
                                                    </span>
                                                    <Switch
                                                        checked={!!attendance[member.id]}
                                                        onCheckedChange={() => handleToggle(member.id)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                No members found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{format(date, "PPP")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Members</span>
                                <span className="font-medium">{totalCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Present</span>
                                <span className="font-medium text-green-600">{presentCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Absent</span>
                                <span className="font-medium text-red-600">{totalCount - presentCount}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="text-sm font-medium mb-2">Attendance Rate</div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${totalCount ? (presentCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                            <div className="mt-1 text-xs text-right text-muted-foreground">
                                {totalCount ? Math.round((presentCount / totalCount) * 100) : 0}%
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
