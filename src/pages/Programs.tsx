import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMyRoles } from "@/hooks/use-my-roles";
import { ProgramEditorDialog, ProgramRow } from "@/components/programs/ProgramEditorDialog";

type ProgramCategory = "pre-incubation" | "incubation" | "accelerator";

const CATEGORY_LABEL: Record<ProgramCategory, string> = {
  "pre-incubation": "Pre-Incubation",
  incubation: "Incubation",
  accelerator: "Accelerator",
};

const Programs = () => {
  const { toast } = useToast();
  const { isAdmin } = useMyRoles();
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ProgramCategory | "all">("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProgramRow | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    let q = supabase
      .from("programs")
      .select(
        "id,name,description,duration,category,application_url,image_url,is_active"
      )
      .order("created_at", { ascending: false });

    if (category !== "all") q = q.eq("category", category);

    const { data, error } = await q;
    if (error) {
      console.error("Error fetching programs:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setPrograms([]);
    } else {
      setPrograms((data ?? []) as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => programs, [programs]);

  const handleDelete = async (program: ProgramRow) => {
    const ok = window.confirm(`Delete program "${program.name}"?`);
    if (!ok) return;

    const { error } = await supabase.from("programs").delete().eq("id", program.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: "Program removed." });
    fetchPrograms();
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl opacity-95">Structured pathways from idea to scale-up</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={category === "all" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setCategory("all")}
            >
              All
            </Badge>
            {(Object.keys(CATEGORY_LABEL) as ProgramCategory[]).map((c) => (
              <Badge
                key={c}
                variant={category === c ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABEL[c]}
              </Badge>
            ))}
          </div>

          {isAdmin ? (
            <Button
              className="gap-2"
              onClick={() => {
                setEditing(null);
                setEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> New Program
            </Button>
          ) : null}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading programs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No programs found.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {filtered.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-2xl gradient-card shadow-soft hover:shadow-lift transition-all flex flex-col overflow-hidden"
              >
                {program.image_url ? (
                  <div className="aspect-[16/9] w-full">
                    <img
                      src={program.image_url}
                      alt={program.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <Badge variant="secondary" className="w-fit">
                      {CATEGORY_LABEL[program.category]}
                    </Badge>
                    {program.duration ? (
                      <span className="text-xs text-muted-foreground">{program.duration}</span>
                    ) : null}
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{program.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-5">
                    {program.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={() => {
                        const href = program.application_url?.trim();
                        if (href) window.open(href, "_blank", "noopener,noreferrer");
                        else window.location.assign(`/apply?programId=${program.id}`);
                      }}
                    >
                      Apply
                    </Button>

                    {isAdmin ? (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 flex-1"
                          onClick={() => {
                            setEditing(program);
                            setEditorOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 flex-1"
                          onClick={() => handleDelete(program)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-2xl bg-muted/30"
        >
          <h3 className="text-2xl font-bold mb-3">Not sure which program fits?</h3>
          <p className="text-muted-foreground mb-6">Schedule a free consultation with our team to find the right path for your startup</p>
          <Button variant="outline" size="lg">Book Free Consultation</Button>
        </motion.div>
      </section>

      <ProgramEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={editing}
        onSaved={fetchPrograms}
      />
    </div>
  );
};

export default Programs;