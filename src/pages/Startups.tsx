import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const startups = [
  { 
    name: "VoiceAI Labs", 
    sector: "AI/ML", 
    stage: "Series A", 
    team: 28, 
    description: "Conversational AI platform for enterprise customer service. Raised ₹45 Cr from Sequoia.",
    traction: "500+ enterprise clients"
  },
  { 
    name: "AgriConnect", 
    sector: "AgriTech", 
    stage: "Seed", 
    team: 15, 
    description: "Direct farm-to-market platform connecting 50,000+ farmers with buyers across India.",
    traction: "₹120 Cr GMV"
  },
  { 
    name: "HealthFirst", 
    sector: "HealthTech", 
    stage: "Series B", 
    team: 85, 
    description: "Telemedicine and diagnostics platform serving Tier 2/3 cities. 2M+ consultations completed.",
    traction: "Profitable since 2024"
  },
  { 
    name: "SkillNest", 
    sector: "EdTech", 
    stage: "Growth", 
    team: 42, 
    description: "Upskilling platform for working professionals with job placement guarantee.",
    traction: "15,000+ placements"
  },
  { 
    name: "GreenGrid Energy", 
    sector: "CleanTech", 
    stage: "Seed", 
    team: 12, 
    description: "Smart energy management for commercial buildings. 30% energy cost reduction guaranteed.",
    traction: "200+ buildings"
  },
  { 
    name: "PayEasy", 
    sector: "FinTech", 
    stage: "Pre-Series A", 
    team: 22, 
    description: "Digital payment solutions for small retailers and street vendors across India.",
    traction: "1M+ merchants"
  },
  { 
    name: "LogiTrack", 
    sector: "Logistics", 
    stage: "Series A", 
    team: 35, 
    description: "Real-time supply chain visibility platform for e-commerce and manufacturing.",
    traction: "₹80 Cr ARR"
  },
  { 
    name: "HomeChef", 
    sector: "Food & Bev", 
    stage: "Seed", 
    team: 18, 
    description: "Marketplace connecting home chefs with customers for authentic regional cuisines.",
    traction: "5,000+ chefs, 8 cities"
  }
];

const Startups = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
          <p className="text-xl opacity-95">287 startups building solutions across 15+ sectors</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">All</Badge>
          {["AI/ML", "HealthTech", "FinTech", "EdTech", "AgriTech", "CleanTech"].map(sector => (
            <Badge key={sector} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {sector}
            </Badge>
          ))}
        </div>

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
                  {startup.team} team
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <TrendingUp className="w-4 h-4" />
                  {startup.traction}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-2xl gradient-card shadow-soft"
        >
          <h3 className="text-2xl font-bold mb-3">Is your startup a good fit?</h3>
          <p className="text-muted-foreground mb-6">Join our portfolio of high-growth companies transforming industries</p>
          <Button size="lg" className="gap-2">
            Apply to Incubation Program <ExternalLink className="w-4 h-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Startups;