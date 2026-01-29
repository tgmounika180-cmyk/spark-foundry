import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Startups = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    fetchStartups();
  }, [selectedSector]);

  const fetchStartups = async () => {
    let query = supabase
      .from('startups')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (selectedSector) {
      query = query.eq('sector', selectedSector);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching startups:', error);
    } else {
      setStartups(data || []);
    }
    setLoading(false);
  };

  const sectors = ["AI/ML", "HealthTech", "FinTech", "EdTech", "AgriTech", "CleanTech"];

  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl opacity-95">{startups.length}+ startups building solutions across 15+ sectors</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge 
            variant={!selectedSector ? "default" : "outline"} 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedSector(null)}
          >
            All
          </Badge>
          {sectors.map(sector => (
            <Badge 
              key={sector} 
              variant={selectedSector === sector ? "default" : "outline"} 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedSector(sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading startups...</div>
        ) : startups.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No startups found in this category</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
          {startups.map((startup, i) => (
            <motion.div
              key={startup.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl gradient-card shadow-soft hover:shadow-lift transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{startup.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{startup.stage}</Badge>
                      <Badge variant="outline" className="text-xs">{startup.sector}</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{startup.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  {startup.team_size} team
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <TrendingUp className="w-4 h-4" />
                  {startup.traction}
                </span>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-2xl gradient-card shadow-soft"
        >
          <h3 className="text-2xl font-bold mb-3">Is your startup a good fit?</h3>
          <p className="text-muted-foreground mb-6">Join our portfolio of high-growth companies transforming industries</p>
          <Button size="lg" className="gap-2" onClick={() => navigate('/apply')}>
            Apply to Incubation Program <ExternalLink className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Startups;