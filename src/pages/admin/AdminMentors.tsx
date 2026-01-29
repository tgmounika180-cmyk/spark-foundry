import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminMentors() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("mentors")
      .select("id,name,role,is_active")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActive = async (id: string, is_active: boolean) => {
    const { error } = await supabase.from("mentors").update({ is_active }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mentors</h1>
        <p className="text-muted-foreground">Approve/disable mentor visibility.</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid gap-3">
          {rows.map((m) => (
            <Card key={m.id} className="p-4 shadow-soft flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{m.name}</div>
                <div className="text-sm text-muted-foreground truncate">{m.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.is_active ? "default" : "outline"}>{m.is_active ? "Visible" : "Hidden"}</Badge>
                <Button size="sm" variant="outline" onClick={() => setActive(m.id, !m.is_active)}>
                  {m.is_active ? "Hide" : "Show"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
