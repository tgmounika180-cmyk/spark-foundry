import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AppRow = any;

export default function AdminApplications() {
  const { toast } = useToast();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [programId, setProgramId] = useState<string>("all");
  const [selected, setSelected] = useState<AppRow | null>(null);

  const load = async () => {
    const [appsRes, programsRes] = await Promise.all([
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase.from("programs").select("id,name").order("created_at", { ascending: false }),
    ]);

    if (appsRes.error) toast({ title: "Error", description: appsRes.error.message, variant: "destructive" });
    if (programsRes.error) toast({ title: "Error", description: programsRes.error.message, variant: "destructive" });
    setApps(appsRes.data ?? []);
    setPrograms(programsRes.data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const okStatus = status === "all" ? true : a.status === status;
      const okProgram = programId === "all" ? true : a.program_id === programId;
      return okStatus && okProgram;
    });
  }, [apps, status, programId]);

  const updateStatus = async (app: AppRow, next: string) => {
    const { error } = await supabase.from("applications").update({ status: next }).eq("id", app.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Updated", description: `Status set to ${next}.` });
    setSelected((s) => (s?.id === app.id ? { ...s, status: next } : s));
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Review and update startup applications.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Select value={programId} onValueChange={setProgramId}>
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All programs</SelectItem>
            {programs.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((a) => (
          <Card key={a.id} className="p-4 shadow-soft flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">{a.startup_name}</div>
              <div className="text-sm text-muted-foreground truncate">{a.program_type}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={a.status === "pending" ? "secondary" : "outline"}>{a.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                View
              </Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 ? <div className="text-muted-foreground">No applications.</div> : null}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="font-semibold">{selected.startup_name}</div>
                <div className="text-sm text-muted-foreground">{selected.program_type}</div>
              </div>

              <Card className="p-3 bg-muted/30">
                <pre className="text-xs whitespace-pre-wrap break-words">
                  {JSON.stringify(selected.answers ?? {}, null, 2)}
                </pre>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => updateStatus(selected, "under_review")}>
                  Mark Under Review
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected, "approved")}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => updateStatus(selected, "rejected")}>
                  Reject
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
