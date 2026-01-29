import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProgramEditorDialog, ProgramRow } from "@/components/programs/ProgramEditorDialog";

const label = (c: string) =>
  c === "pre-incubation" ? "Pre-Incubation" : c === "incubation" ? "Incubation" : "Accelerator";

export default function AdminPrograms() {
  const { toast } = useToast();
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programs")
      .select("id,name,description,duration,category,application_url,image_url,is_active,applications_open")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setRows([]);
    } else {
      setRows((data ?? []) as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const del = async (p: ProgramRow) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("programs").delete().eq("id", p.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Program removed." });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground">Create, edit, and publish incubation programs.</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-muted-foreground">No programs yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <Card key={p.id} className="p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{label(p.category)}</Badge>
                    <Badge variant="outline">{p.is_active ? "Active" : "Hidden"}</Badge>
                  </div>
                </div>
              </div>
              {p.description ? (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{p.description}</p>
              ) : null}
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 flex-1"
                  onClick={() => {
                    setEditing(p);
                    setEditorOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="gap-2 flex-1" onClick={() => del(p)}>
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ProgramEditorDialog open={editorOpen} onOpenChange={setEditorOpen} initial={editing} onSaved={load} />
    </div>
  );
}
