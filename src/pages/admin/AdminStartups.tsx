import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminStartups() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("startups")
      .select("id,name,sector,stage,status,is_public,is_featured")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPublic = async (id: string, is_public: boolean) => {
    const { error } = await supabase.from("startups").update({ is_public }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Startups</h1>
        <p className="text-muted-foreground">Approve/hide startups from the public directory.</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <div className="grid gap-3">
          {rows.map((s) => (
            <Card key={s.id} className="p-4 shadow-soft flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{s.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {s.sector} • {s.stage}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={s.is_public ? "default" : "outline"}>{s.is_public ? "Public" : "Hidden"}</Badge>
                <Button size="sm" variant="outline" onClick={() => setPublic(s.id, !s.is_public)}>
                  {s.is_public ? "Hide" : "Show"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
