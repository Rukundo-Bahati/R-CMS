import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Send,
    Users,
    Search,
    CheckCircle2,
    UserCircle,
    Mail,
    Info,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Recipient {
    id: string;
    name: string;
    email: string;
    role?: string;
    department?: string;
    isUser?: boolean;
}

export default function Messages() {
    const { user } = useAuth();
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("compose");
    const [messagesList, setMessagesList] = useState<any[]>([]);

    const fetchMessages = async (status: string) => {
        try {
            const params: any = { status };
            if (status !== 'inbox') {
                params.portal = user?.portal;
            } else {
                params.email = user?.email;
            }
            const data = await api.messages.getAll(params);
            setMessagesList(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error("Failed to load messages");
        }
    };

    useEffect(() => {
        if (activeTab !== "compose") {
            fetchMessages(activeTab);
        }
    }, [activeTab]);

    const fetchRecipients = async () => {
        setLoading(true);
        try {
            const data = await api.messages.getRecipients(user?.portal, user?.department);
            // Combine members and user roles
            const all = [...data.members, ...data.users];
            setRecipients(all);
        } catch (error) {
            console.error('Error fetching recipients:', error);
            toast.error("Failed to load recipients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipients();
    }, []);

    const filteredRecipients = recipients.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.department && r.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleRecipient = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const selectAll = () => {
        if (selectedIds.size === filteredRecipients.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredRecipients.map(r => r.id)));
        }
    };

    const handleSendMessage = async () => {
        if (selectedIds.size === 0) {
            toast.error("Please select at least one recipient");
            return;
        }
        if (!subject.trim() || !message.trim()) {
            toast.error("Please enter a subject and message");
            return;
        }

        setSending(true);
        try {
            const emails = recipients
                .filter(r => selectedIds.has(r.id))
                .map(r => r.email);

            await api.messages.send({
                recipients: emails,
                subject,
                message,
                senderName: user?.name || "RCA RAJEPRA",
                portal: user?.portal
            });

            toast.success("Message sent successfully!");
            setSubject("");
            setMessage("");
            setSelectedIds(new Set());
            if (activeTab === "compose") {
                // optionally redirect to sent tab later
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!subject.trim() && !message.trim()) {
            toast.error("Please enter a subject or message to save draft");
            return;
        }
        try {
            const emails = recipients
                .filter(r => selectedIds.has(r.id))
                .map(r => r.email);
            await api.messages.saveDraft({
                recipients: emails,
                subject,
                message,
                senderName: user?.name || "RCA RAJEPRA",
                portal: user?.portal
            });
            toast.success("Draft saved successfully!");
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error("Failed to save draft");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Messaging Center</h1>
                    <p className="text-muted-foreground mt-1">
                        Send important updates and messages to your members
                    </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                        Portal Control: {user?.portal?.replace(/_/g, ' ').toUpperCase() || 'GENERAL'}
                    </span>
                </div>
            </div>

            <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
                <TabsContent value="compose">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recipient Selection */}
                        <Card className="lg:col-span-1 flex flex-col h-[700px] overflow-hidden border-border/50 shadow-lg">
                            <div className="p-4 border-b border-border bg-muted/50">
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-primary" />
                                    Select Recipients
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        className="pl-9 bg-background/50 border-border/50 focus:ring-primary/20"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">Loading members...</p>
                                    </div>
                                ) : filteredRecipients.length === 0 ? (
                                    <div className="text-center py-10">
                                        <UserCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">No recipients found</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                {filteredRecipients.length} Available
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-primary hover:text-primary/80"
                                                onClick={selectAll}
                                            >
                                                {selectedIds.size === filteredRecipients.length ? "Deselect All" : "Select All"}
                                            </Button>
                                        </div>
                                        {filteredRecipients.map((recipient) => (
                                            <div
                                                key={recipient.id}
                                                onClick={() => toggleRecipient(recipient.id)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${selectedIds.has(recipient.id)
                                                    ? "bg-primary/5 border-primary shadow-sm"
                                                    : "bg-background border-border hover:bg-muted/50 hover:border-border/80"
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedIds.has(recipient.id) ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                                                    }`}>
                                                    {recipient.isUser ? (
                                                        <UserCircle className="w-5 h-5" />
                                                    ) : (
                                                        <Users className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                                        {recipient.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">{recipient.email}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedIds.has(recipient.id)
                                                    ? "bg-primary border-primary"
                                                    : "border-border bg-background"
                                                    }`}>
                                                    {selectedIds.has(recipient.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </Card>

                        {/* Message Composition */}
                        <Card className="lg:col-span-2 p-8 flex flex-col h-[700px] border-border/50 shadow-lg">
                            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Mail className="w-6 h-6 text-primary" />
                                        Compose Message
                                    </h3>
                                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/30 rounded-lg border border-border/50">
                                        {selectedIds.size === 0 ? (
                                            <span className="text-sm text-muted-foreground p-1">No recipients selected...</span>
                                        ) : (
                                            recipients.filter(r => selectedIds.has(r.id)).slice(0, 10).map(r => (
                                                <span
                                                    key={r.id}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold animate-in zoom-in-95"
                                                >
                                                    {r.name}
                                                    <button onClick={(e) => { e.stopPropagation(); toggleRecipient(r.id); }} className="hover:text-destructive">
                                                        ×
                                                    </button>
                                                </span>
                                            ))
                                        )}
                                        {selectedIds.size > 10 && (
                                            <span className="text-xs font-semibold text-muted-foreground flex items-center px-2">
                                                + {selectedIds.size - 10} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
                                        <Input
                                            id="subject"
                                            placeholder="E.g., Important: Upcoming Community Meeting"
                                            className="h-12 text-lg border-border/50 focus:border-primary/50"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                                        <div className="relative">
                                            <Textarea
                                                id="message"
                                                placeholder="Type your message here..."
                                                className="min-h-[300px] resize-none border-border/50 focus:border-primary/50 pb-12 transition-all duration-300"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground/60">
                                                {message.length} characters
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border mt-auto flex items-center justify-between">
                                <div className="hidden sm:block text-sm text-muted-foreground">
                                    Sending to <span className="font-bold text-foreground">{selectedIds.size}</span> members
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleSaveDraft}
                                        disabled={sending}
                                    >
                                        Save Draft
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="px-8 gap-2 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
                                        disabled={sending || selectedIds.size === 0}
                                        onClick={handleSendMessage}
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Announcement
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {['inbox', 'sent', 'drafts', 'failed'].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue}>
                        {messagesList.length === 0 ? (
                            <Card className="p-12 text-center border-border/50">
                                <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-foreground">No messages found</h3>
                                <p className="text-muted-foreground mt-1">There are no messages in your {tabValue}.</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {messagesList.map((m) => (
                                    <Card key={m.id} className="p-6 border-border/50 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-semibold text-lg text-foreground">{m.subject}</h4>
                                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
                                                    <span>From: <span className="text-foreground/80">{m.sender_name}</span></span>
                                                    {m.recipients && Array.isArray(m.recipients) && (
                                                        <span>To: {m.recipients.length} recipients</span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                                                {new Date(m.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-foreground/80 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: m.body }} />
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
