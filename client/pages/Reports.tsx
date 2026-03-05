import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  FileText, 
  FileBarChart2, 
  Download, 
  Users, 
  Home, 
  Calendar as CalendarIcon,
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Loader2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type ReportType = 'members' | 'families' | 'attendance' | 'financial' | 'service-schedule';
type ReportFormat = 'pdf' | 'excel' | 'csv';

interface Family {
  id: string;
  name: string;
  members: any[];
  serviceWeeks?: number[];
}

interface ServiceWeek {
  weekNumber: number;
  date: Date;
  familyId: string | null;
  familyName?: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  icon: React.ReactNode;
  lastGenerated?: string;
  availableFormats?: ReportFormat[];
  category: string;
}

const reports: Report[] = [
  {
    id: 'members-list',
    title: 'Members Directory',
    description: 'Complete list of all members with contact information, roles, and status',
    type: 'members',
    icon: <Users className="h-5 w-5" />,
    lastGenerated: '2023-11-25',
    availableFormats: ['pdf', 'excel', 'csv'],
    category: 'members'
  },
  {
    id: 'member-demographics',
    title: 'Demographics',
    description: 'Age, gender, and location distribution of members',
    type: 'members',
    icon: <Users className="h-5 w-5" />,
    availableFormats: ['pdf', 'excel'],
    category: 'members'
  },
  {
    id: 'family-directory',
    title: 'Family Directory',
    description: 'Directory of all families and their members with contact details',
    type: 'families',
    icon: <Home className="h-5 w-5" />,
    lastGenerated: '2023-11-24',
    availableFormats: ['pdf', 'excel'],
    category: 'families'
  },
  {
    id: 'family-structure',
    title: 'Family Structure',
    description: 'Analysis of family sizes and structures',
    type: 'families',
    icon: <Home className="h-5 w-5" />,
    availableFormats: ['pdf'],
    category: 'families'
  },
  {
    id: 'attendance-summary',
    title: 'Attendance Summary',
    description: 'Weekly, monthly, and yearly attendance statistics and trends',
    type: 'attendance',
    icon: <Calendar className="h-5 w-5" />,
    lastGenerated: '2023-11-20',
    availableFormats: ['pdf', 'excel'],
    category: 'attendance'
  },
  {
    id: 'attendance-detailed',
    title: 'Detailed Attendance',
    description: 'Detailed attendance records for all events and services',
    type: 'attendance',
    icon: <Calendar className="h-5 w-5" />,
    availableFormats: ['excel', 'csv'],
    category: 'attendance'
  },
  {
    id: 'monthly-contributions',
    title: 'Contributions',
    description: 'Summary of financial contributions by members and families',
    type: 'financial',
    icon: <FileBarChart2 className="h-5 w-5" />,
    availableFormats: ['pdf', 'excel'],
    category: 'financial'
  },
  {
    id: 'financial-summary',
    title: 'Financial Summary',
    description: 'Comprehensive financial report including income, expenses, and balances',
    type: 'financial',
    icon: <FileBarChart2 className="h-5 w-5" />,
    availableFormats: ['pdf'],
    category: 'financial'
  },
  {
    id: 'service-schedule',
    title: 'Service Schedule',
    description: 'Manage family service weeks for church services',
    type: 'service-schedule',
    icon: <Calendar className="h-5 w-5" />,
    availableFormats: ['pdf', 'excel'],
    category: 'service-schedule'
  }
];

// Sample data - in a real app, this would come from your API
const sampleFamilies: Family[] = [
  { id: '1', name: 'Jonathan Family', members: [] },
  { id: '2', name: 'David Family', members: [] },
  { id: '3', name: 'Samuel Family', members: [] },
  { id: '4', name: 'Esther Family', members: [] },
  { id: '5', name: 'Ruth Family', members: [] },
];

// Generate service weeks for a term (e.g., 12 weeks)
const generateServiceWeeks = (startDate: Date, weeks: number): ServiceWeek[] => {
  return Array.from({ length: weeks }, (_, i) => ({
    weekNumber: i + 1,
    date: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000),
    familyId: null,
  }));
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportType>('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7 * 11)), // 12 weeks
  });
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Service schedule state
  const [termStartDate, setTermStartDate] = useState<Date>(new Date());
  const [termWeeks, setTermWeeks] = useState<number>(12);
  const [serviceWeeks, setServiceWeeks] = useState<ServiceWeek[]>(
    generateServiceWeeks(termStartDate, termWeeks)
  );
  const [families, setFamilies] = useState<Family[]>(sampleFamilies);
  const [showAssignDialog, setShowAssignDialog] = useState<{
    weekNumber: number;
    familyId: string | null;
  } | null>(null);

  const handleGenerateReport = (report: Report) => {
    setSelectedReport(report);
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real app, this would trigger a download or open a preview
      console.log(`Generated ${selectedFormat.toUpperCase()} report: ${report.title}`, {
        dateRange,
        format: selectedFormat
      });
    }, 1500);
  };

  const filteredReports = (type: ReportType) => {
    return reports
      .filter(report => report.type === type)
      .filter(report => 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const getReportCount = (type: ReportType) => {
    if (type === 'service-schedule') return 1; // Only one service schedule report
    return filteredReports(type).length;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive reports for church management
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {isFiltersOpen ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFiltersOpen && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="format" className="text-sm font-medium">Format</Label>
              <Select 
                value={selectedFormat} 
                onValueChange={(value: ReportFormat) => setSelectedFormat(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs 
        defaultValue="members" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as ReportType)}
      >
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger 
            value="members" 
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-none"
          >
            <Users className="h-4 w-4" />
            <span>Members</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {getReportCount('members')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="families" 
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-none"
          >
            <Home className="h-4 w-4" />
            <span>Families</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {getReportCount('families')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="attendance" 
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-none"
          >
            <Calendar className="h-4 w-4" />
            <span>Attendance</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {getReportCount('attendance')}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="financial" 
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-none"
          >
            <FileBarChart2 className="h-4 w-4" />
            <span>Financial</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {getReportCount('financial')}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="service-schedule" 
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:shadow-none"
          >
            <Calendar className="h-4 w-4" />
            <span>Service Schedule</span>
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {getReportCount('service-schedule')}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports('members').map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onGenerate={handleGenerateReport}
                isGenerating={isGenerating && selectedReport?.id === report.id}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="families" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports('families').map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onGenerate={handleGenerateReport}
                isGenerating={isGenerating && selectedReport?.id === report.id}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports('attendance').map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onGenerate={handleGenerateReport}
                isGenerating={isGenerating && selectedReport?.id === report.id}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports('financial').map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onGenerate={handleGenerateReport}
                isGenerating={isGenerating && selectedReport?.id === report.id}
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="service-schedule" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Service Schedule Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Assign families to specific weeks for church services during the school term
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label>Term Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !termStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {termStartDate ? (
                          format(termStartDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={termStartDate}
                        onSelect={(date) => {
                          if (date) {
                            setTermStartDate(date);
                            setServiceWeeks(generateServiceWeeks(date, termWeeks));
                          }
                        }}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label>Number of Weeks</Label>
                  <Select
                    value={termWeeks.toString()}
                    onValueChange={(value) => {
                      const weeks = parseInt(value);
                      setTermWeeks(weeks);
                      setServiceWeeks(generateServiceWeeks(termStartDate, weeks));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weeks" />
                    </SelectTrigger>
                    <SelectContent>
                      {[8, 10, 12, 14, 16].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      // In a real app, save the schedule to the database
                      console.log('Saving service schedule:', serviceWeeks);
                      alert('Service schedule saved successfully!');
                    }}
                  >
                    Save Schedule
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 border-b">
                  <div className="col-span-3 p-3 font-medium">Week</div>
                  <div className="col-span-3 p-3 font-medium">Date</div>
                  <div className="col-span-6 p-3 font-medium">Assigned Family</div>
                </div>
                
                {serviceWeeks.map((week) => (
                  <div key={week.weekNumber} className="grid grid-cols-12 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="col-span-3 p-3 flex items-center">
                      Week {week.weekNumber}
                    </div>
                    <div className="col-span-3 p-3 flex items-center text-sm text-gray-600">
                      {format(week.date, 'MMM d, yyyy')}
                    </div>
                    <div className="col-span-6 p-3">
                      <div className="flex items-center justify-between">
                        <span>
                          {week.familyId 
                            ? families.find(f => f.id === week.familyId)?.name || 'Not assigned'
                            : 'Not assigned'}
                        </span>
                        <Button 
                          variant={week.familyId ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setShowAssignDialog({
                            weekNumber: week.weekNumber,
                            familyId: week.familyId
                          })}
                          className={week.familyId ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
                        >
                          {week.familyId ? 'Change' : 'Assign'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Assign Family Dialog */}
          {showAssignDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-lg font-medium mb-4">
                  Assign Family to Week {showAssignDialog.weekNumber}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Select Family</Label>
                    <Select
                      value={showAssignDialog.familyId || undefined}
                      onValueChange={(value) => {
                        setShowAssignDialog({
                          ...showAssignDialog,
                          familyId: value || null
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={undefined}>None (Unassign)</SelectItem>
                        {families.map((family) => (
                          <SelectItem key={family.id} value={family.id}>
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAssignDialog(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        if (showAssignDialog.familyId) {
                          setServiceWeeks(prev => 
                            prev.map(w => 
                              w.weekNumber === showAssignDialog.weekNumber
                                ? { 
                                    ...w, 
                                    familyId: showAssignDialog.familyId,
                                    familyName: families.find(f => f.id === showAssignDialog.familyId)?.name
                                  }
                                : w
                            )
                          );
                        } else {
                          // Handle unassign
                          setServiceWeeks(prev => 
                            prev.map(w => 
                              w.weekNumber === showAssignDialog.weekNumber
                                ? { 
                                    ...w, 
                                    familyId: null,
                                    familyName: undefined
                                  }
                                : w
                            )
                          );
                        }
                        setShowAssignDialog(null);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ReportCardProps {
  report: Report;
  onGenerate: (report: Report, format: ReportFormat) => void;
  isGenerating: boolean;
  selectedFormat: ReportFormat;
  onFormatChange: (format: ReportFormat) => void;
}

function ReportCard({ 
  report, 
  onGenerate, 
  isGenerating, 
  selectedFormat,
  onFormatChange
}: ReportCardProps) {
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  
  const formatOptions = report.availableFormats || ['pdf', 'excel', 'csv'];
  
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'excel':
        return <FileBarChart2 className="h-4 w-4" />;
      case 'csv':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {report.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {report.title}
              </CardTitle>
              {report.lastGenerated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last generated: {format(new Date(report.lastGenerated), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setShowFormatOptions(!showFormatOptions)}
            >
              <span className="sr-only">Options</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </Button>
            
            {showFormatOptions && (
              <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <p className="px-4 py-2 text-xs font-medium text-gray-500">Export as</p>
                  {formatOptions.map((format) => (
                    <button
                      key={format}
                      type="button"
                      className={`flex w-full items-center px-4 py-2 text-sm ${
                        selectedFormat === format ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        onFormatChange(format as ReportFormat);
                        setShowFormatOptions(false);
                      }}
                    >
                      {getFormatIcon(format)}
                      <span className="ml-2">{format.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 mb-4">
          {report.description}
        </p>
        
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <span className="inline-flex items-center mr-4">
            <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {formatOptions.map(f => f.toUpperCase()).join(', ')}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onGenerate(report, selectedFormat)}
          disabled={isGenerating}
          className="w-full group-hover:bg-primary/90 transition-colors"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
          ) : (
            <><Download className="mr-2 h-4 w-4" />Generate {selectedFormat.toUpperCase()}</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
