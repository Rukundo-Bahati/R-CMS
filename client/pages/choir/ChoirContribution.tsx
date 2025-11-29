import { useState } from "react";
import { format } from "date-fns";
import { Search, Plus, Wallet, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock contribution data
const initialContributions = [
    { id: "1", memberName: "John Smith", type: "Monthly Fee", amount: 5000, date: "2025-11-28", status: "Paid" },
    { id: "2", memberName: "Mary Johnson", type: "Uniform", amount: 15000, date: "2025-11-27", status: "Paid" },
    { id: "3", memberName: "Peter Brown", type: "Monthly Fee", amount: 5000, date: "2025-11-25", status: "Paid" },
    { id: "4", memberName: "Sarah Williams", type: "Event Support", amount: 10000, date: "2025-11-20", status: "Paid" },
    { id: "5", memberName: "Michael Davis", type: "Monthly Fee", amount: 5000, date: "2025-11-15", status: "Paid" },
];

const contributionTypes = ["Monthly Fee", "Uniform", "Event Support", "Donation", "Other"];

export default function ChoirContribution() {
    const [contributions, setContributions] = useState(initialContributions);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newContribution, setNewContribution] = useState({
        memberName: "",
        type: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
    });

    const filteredContributions = contributions.filter(c =>
        c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = contributions.reduce((sum, c) => sum + c.amount, 0);
    const thisMonthAmount = contributions
        .filter(c => new Date(c.date).getMonth() === new Date().getMonth())
        .reduce((sum, c) => sum + c.amount, 0);

    const handleAddContribution = () => {
        if (!newContribution.memberName || !newContribution.type || !newContribution.amount) {
            toast.error("Please fill in all fields");
            return;
        }

        const contribution = {
            id: Math.random().toString(36).substr(2, 9),
            memberName: newContribution.memberName,
            type: newContribution.type,
            amount: Number(newContribution.amount),
            date: newContribution.date,
            status: "Paid",
        };

        setContributions([contribution, ...contributions]);
        setIsAddOpen(false);
        setNewContribution({
            memberName: "",
            type: "",
            amount: "",
            date: format(new Date(), "yyyy-MM-dd"),
        });
        toast.success("Contribution recorded successfully");
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
                    <p className="text-muted-foreground mt-2">
                        Track and manage choir member contributions and finances.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Record Contribution
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Record New Contribution</DialogTitle>
                            <DialogDescription>
                                Enter the details of the contribution.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="member">Member Name</Label>
                                <Input
                                    id="member"
                                    placeholder="e.g. John Doe"
                                    value={newContribution.memberName}
                                    onChange={(e) => setNewContribution({ ...newContribution, memberName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Contribution Type</Label>
                                <Select
                                    value={newContribution.type}
                                    onValueChange={(value) => setNewContribution({ ...newContribution, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contributionTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount (RWF)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={newContribution.amount}
                                    onChange={(e) => setNewContribution({ ...newContribution, amount: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newContribution.date}
                                    onChange={(e) => setNewContribution({ ...newContribution, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddContribution}>Save Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">RWF {totalAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime collected amount
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">RWF {thisMonthAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Collected in {format(new Date(), "MMMM")}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Contribution</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            RWF {contributions.length ? Math.round(totalAmount / contributions.length).toLocaleString() : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per transaction average
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>A list of recent contributions made by members.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredContributions.map((contribution) => (
                                    <TableRow key={contribution.id}>
                                        <TableCell>{format(new Date(contribution.date), "MMM dd, yyyy")}</TableCell>
                                        <TableCell className="font-medium">{contribution.memberName}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {contribution.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {contribution.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            RWF {contribution.amount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredContributions.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No contributions found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
