import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Program = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  category: "pre-incubation" | "incubation" | "accelerator";
  application_url: string | null;
  image_url: string | null;
};

export function LatestPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("programs")
        .select("id,name,description,duration,category,application_url,image_url")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!mounted) return;

      if (error) {
        console.error("Failed to load programs", error);
        setPrograms([]);
      } else {
        setPrograms((data ?? []) as any);
      }
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const label = (c: Program["category"]) => {
    if (c === "pre-incubation") return "Pre-Incubation";
    if (c === "incubation") return "Incubation";
    return "Accelerator";
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold">Latest Programs</h2>
            <p className="text-xl text-muted-foreground mt-2">
              Apply to active programs—updated automatically.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/programs")}>View all</Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No programs published yet.
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {programs.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-2xl gradient-card shadow-soft hover:shadow-lift transition-all overflow-hidden flex flex-col"
              >
                {p.image_url ? (
                  <div className="aspect-[16/9] w-full">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <Badge variant="secondary">{label(p.category)}</Badge>
                    {p.duration ? (
                      <span className="text-xs text-muted-foreground">{p.duration}</span>
                    ) : null}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-4">
                    {p.description}
                  </p>

                  <div className="mt-auto">
                    <Button className="w-full" onClick={() => navigate(`/apply?programId=${p.id}`)}>
                      Apply
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
