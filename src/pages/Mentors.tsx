import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Award, Linkedin, Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type MentorRow = {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  background: string | null;
  companies: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  bio: string | null;
};

const Mentors = () => {
  const [mentors, setMentors] = useState<MentorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("mentors")
        .select(
          "id,name,role,expertise,background,companies,linkedin_url,photo_url,bio"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching mentors:", error);
        setMentors([]);
      } else {
        setMentors((data ?? []) as any);
      }
      setLoading(false);
    };
    load();
  }, []);

  const allExpertise = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => (m.expertise ?? []).forEach((e) => set.add(e)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [mentors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mentors.filter((m) => {
      const matchesQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        (m.role ?? "").toLowerCase().includes(q) ||
        (m.expertise ?? []).some((e) => e.toLowerCase().includes(q));
      const matchesExpertise = !selectedExpertise || (m.expertise ?? []).includes(selectedExpertise);
      return matchesQ && matchesExpertise;
    });
  }, [mentors, query, selectedExpertise]);

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Mentors & Advisors</h1>
          <p className="text-xl opacity-95">
            {loading ? "Loading..." : `${mentors.length} mentors available to help you build faster`}
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mentors by name, role, or expertise..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedExpertise ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedExpertise(null)}
            >
              All
            </Badge>
            {allExpertise.slice(0, 18).map((area) => (
              <Badge
                key={area}
                variant={selectedExpertise === area ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedExpertise(area)}
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading mentors...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No mentors found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {filtered.map((mentor, i) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl gradient-card shadow-soft hover:shadow-lift transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {mentor.photo_url ? (
                      <img src={mentor.photo_url} alt={mentor.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Users className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{mentor.role}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(mentor.expertise ?? []).slice(0, 6).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-4">
                  {mentor.bio || mentor.background}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    {mentor.companies ?? ""}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => {
                      if (mentor.linkedin_url) {
                        window.open(mentor.linkedin_url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    disabled={!mentor.linkedin_url}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    Connect
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-2xl gradient-hero text-primary-foreground shadow-soft"
        >
          <Award className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Share Your Expertise</h2>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            Join 142 mentors helping shape India's startup ecosystem. Commit just 2-4 hours per month.
          </p>
          <Button size="lg" variant="secondary">Apply to Become a Mentor</Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Mentors;