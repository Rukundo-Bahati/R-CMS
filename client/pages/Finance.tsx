import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Receipt,
  CreditCard,
  Banknote,
  Eye,
  Filter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";

// Mock data for financial overview
const financialOverview = {
  totalIncome: 45600,
  totalExpenses: 38200,
  netIncome: 7400,
  monthlyBudget: 45000,
  budgetUtilization: 85,
  offeringGrowth: 12.5,
  expenseGrowth: 8.3,
  savingsRate: 16.2
};

// Mock data for offerings by month
const monthlyOfferings = [
  { month: "Jan", amount: 4200, target: 4000, year: 2025 },
  { month: "Feb", amount: 3800, target: 4000, year: 2025 },
  { month: "Mar", amount: 4500, target: 4000, year: 2025 },
  { month: "Apr", amount: 4100, target: 4000, year: 2025 },
  { month: "May", amount: 4800, target: 4500, year: 2025 },
  { month: "Jun", amount: 4300, target: 4500, year: 2025 },
  { month: "Jul", amount: 5200, target: 4500, year: 2025 },
  { month: "Aug", amount: 4600, target: 4500, year: 2025 },
  { month: "Sep", amount: 4900, target: 5000, year: 2024 },
  { month: "Oct", amount: 5100, target: 5000, year: 2024 },
  { month: "Nov", amount: 5300, target: 5000, year: 2024 },
  { month: "Dec", amount: 5500, target: 5000, year: 2024 },
];

// Mock data for expense categories
const expenseCategories = [
  { name: "Operations", amount: 15200, percentage: 40, color: "#4f46e5" },
  { name: "Ministry Programs", amount: 12800, percentage: 33, color: "#6366f1" },
  { name: "Facilities", amount: 6200, percentage: 16, color: "#f59e0b" },
  { name: "Administration", amount: 4000, percentage: 11, color: "#8b5cf6" },
];

// Mock data for department budgets
const departmentBudgets = [
  {
    department: "Worship",
    budget: 8500,
    spent: 7200,
    remaining: 1300,
    status: "on-track"
  },
  {
    department: "Youth Ministry",
    budget: 6500,
    spent: 6800,
    remaining: -300,
    status: "over-budget"
  },
  {
    department: "Children's Ministry",
    budget: 4200,
    spent: 3800,
    remaining: 400,
    status: "on-track"
  },
  {
    department: "Outreach",
    budget: 5800,
    spent: 5200,
    remaining: 600,
    status: "on-track"
  },
  {
    department: "Administration",
    budget: 3200,
    spent: 3100,
    remaining: 100,
    status: "on-track"
  },
];

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "1",
    date: "2024-12-15",
    description: "Sunday Offering",
    category: "Offerings",
    amount: 2850,
    type: "income",
    department: "General"
  },
  {
    id: "2",
    date: "2024-12-14",
    description: "Youth Event Supplies",
    category: "Ministry Programs",
    amount: -450,
    type: "expense",
    department: "Youth Ministry"
  },
  {
    id: "3",
    date: "2024-12-13",
    description: "Facility Maintenance",
    category: "Facilities",
    amount: -1200,
    type: "expense",
    department: "Operations"
  },
  {
    id: "4",
    date: "2024-12-12",
    description: "Special Offering",
    category: "Offerings",
    amount: 1200,
    type: "income",
    department: "Outreach"
  },
  {
    id: "5",
    date: "2024-12-11",
    description: "Office Supplies",
    category: "Administration",
    amount: -280,
    type: "expense",
    department: "Administration"
  },
];

// Mock data for budget vs actual by quarter
const quarterlyBudget = [
  {
    quarter: "Q1 2024",
    budget: 45000,
    actual: 42800,
    variance: 2200
  },
  {
    quarter: "Q2 2024",
    budget: 47000,
    actual: 46200,
    variance: 800
  },
  {
    quarter: "Q3 2024",
    budget: 48000,
    actual: 48900,
    variance: -900
  },
  {
    quarter: "Q4 2024",
    budget: 49000,
    actual: 45600,
    variance: 3400
  },
];

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  variant = 'default',
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-primary/5 border-primary/20';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <Card className={`p-6 ${getVariantStyles()} shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
          
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-primary">{icon}</div>
        </div>
      </div>
    </Card>
  );
};

const Finance: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'term1' | 'term2' | 'term3'>('term1');
  const [selectedYear, setSelectedYear] = useState('2025');

  if (!user) return null;

  const getTermData = (year: number) => {
    const terms = [
      { name: 'Term 1', months: ['Jan', 'Feb', 'Mar'] },
      { name: 'Term 2', months: ['Apr', 'May', 'Jun'] },
      { name: 'Term 3', months: ['Jul', 'Aug', 'Sep'] },
    ];

    return terms.map(term => {
      const termData = monthlyOfferings.filter(item =>
        term.months.includes(item.month) && item.year === year
      );
      const totalAmount = termData.reduce((sum, item) => sum + item.amount, 0);
      return { term: term.name, amount: totalAmount };
    });
  };

  const termData = getTermData(parseInt(selectedYear));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track':
        return <Badge variant="secondary" className="bg-primary/10 text-primary">On Track</Badge>;
      case 'over-budget':
        return <Badge variant="destructive">Over Budget</Badge>;
      case 'under-budget':
        return <Badge variant="outline">Under Budget</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Financial Overview Report', 20, 20);

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    // Financial Overview Summary
    doc.setFontSize(16);
    doc.text('Financial Summary', 20, 55);

    const summaryData = [
      ['Total Income', `$${financialOverview.totalIncome.toLocaleString()}`],
      ['Total Expenses', `$${financialOverview.totalExpenses.toLocaleString()}`],
      ['Net Income', `$${financialOverview.netIncome.toLocaleString()}`],
      ['Budget Utilization', `${financialOverview.budgetUtilization}%`],
    ];

    (doc as any).autoTable({
      startY: 65,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }, // primary color
    });

    // Department Budget Status
    doc.setFontSize(16);
    doc.text('Department Budget Status', 20, (doc as any).lastAutoTable.finalY + 20);

    const budgetData = departmentBudgets.map(dept => [
      dept.department,
      `$${dept.budget.toLocaleString()}`,
      `$${dept.spent.toLocaleString()}`,
      `$${dept.remaining.toLocaleString()}`,
      dept.status.replace('-', ' ').toUpperCase(),
    ]);

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Department', 'Budget', 'Spent', 'Remaining', 'Status']],
      body: budgetData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Recent Transactions
    doc.setFontSize(16);
    doc.text('Recent Transactions', 20, (doc as any).lastAutoTable.finalY + 20);

    const transactionData = recentTransactions.slice(0, 10).map(transaction => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.type === 'income' ? `+$${transaction.amount.toLocaleString()}` : `-$${Math.abs(transaction.amount).toLocaleString()}`,
      transaction.department,
    ]);

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Date', 'Description', 'Category', 'Amount', 'Department']],
      body: transactionData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Quarterly Budget Analysis
    doc.setFontSize(16);
    doc.text('Quarterly Budget Analysis', 20, (doc as any).lastAutoTable.finalY + 20);

    const quarterlyData = quarterlyBudget.map(quarter => [
      quarter.quarter,
      `$${quarter.budget.toLocaleString()}`,
      `$${quarter.actual.toLocaleString()}`,
      quarter.variance >= 0 ? `+$${quarter.variance.toLocaleString()}` : `$${quarter.variance.toLocaleString()}`,
      quarter.variance >= 0 ? 'Under Budget' : 'Over Budget',
    ]);

    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Quarter', 'Budget', 'Actual', 'Variance', 'Status']],
      body: quarterlyData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Save the PDF
    doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-500 mt-1">Monitor church financial health and stewardship</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term1">Term 1</SelectItem>
              <SelectItem value="term2">Term 2</SelectItem>
              <SelectItem value="term3">Term 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Total Income"
          value={`$${financialOverview.totalIncome.toLocaleString()}`}
          variant="success"
        />
        <StatCard
          icon={<Receipt className="w-5 h-5" />}
          title="Total Expenses"
          value={`$${financialOverview.totalExpenses.toLocaleString()}`}
          variant="default"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Net Income"
          value={`$${financialOverview.netIncome.toLocaleString()}`}
          variant="success"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          title="Budget Utilization"
          value={`${financialOverview.budgetUtilization}%`}
          subtitle={`$${financialOverview.monthlyBudget.toLocaleString()} budget`}
          variant={financialOverview.budgetUtilization > 90 ? 'warning' : 'default'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offerings by Term Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Offerings by Term</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="w-4 h-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={termData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="term" axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString()}`,
                    'Offerings'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#4f46e5" name="Offerings" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Categories Pie Chart */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Expense Breakdown</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <PieChartIcon className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                  label={false}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const entry = expenseCategories.find(d => d.name === value);
                    return `${value} (${entry?.percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Department Budgets and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Budget Status */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Department Budget Status</h3>
            <Button variant="outline" size="sm" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
          <div className="space-y-4">
            {departmentBudgets.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{dept.department}</span>
                  {getStatusBadge(dept.status)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dept.status === 'over-budget' ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min((dept.spent / dept.budget) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    ${dept.spent.toLocaleString()} / ${dept.budget.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Remaining: ${dept.remaining.toLocaleString()}</span>
                  <span>{((dept.spent / dept.budget) * 100).toFixed(0)}% used</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Button variant="outline" size="sm" className="text-xs">
              <FileText className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.date} • {transaction.department}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quarterly Budget Analysis */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Quarterly Budget Analysis</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{selectedYear}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quarter</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quarterlyBudget.map((quarter) => (
                <TableRow key={quarter.quarter}>
                  <TableCell className="font-medium">{quarter.quarter}</TableCell>
                  <TableCell className="text-right">${quarter.budget.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${quarter.actual.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    quarter.variance >= 0 ? 'text-primary' : 'text-red-600'
                  }`}>
                    {quarter.variance >= 0 ? '+' : ''}${quarter.variance.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {quarter.variance >= 0 ? (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Under Budget
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Over Budget
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Financial Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate a comprehensive financial report for the selected period.
              </p>
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Schedule Review
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Contact Treasurer
        </Button>
      </div>
    </div>
  );
};

export default Finance;
