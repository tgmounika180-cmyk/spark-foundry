import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, TrendingUp, CheckCircle } from "lucide-react";

const programs = [
  {
    icon: Rocket,
    title: "Pre-Incubation Program",
    duration: "3 months",
    description: "Perfect for early-stage ideas that need validation and initial direction. Designed for solo founders and small teams exploring problem-solution fit.",
    features: [
      "Bi-weekly ideation & brainstorming sessions",
      "Market research & competitor analysis support",
      "Customer discovery & validation frameworks",
      "Basic pitch deck creation workshop",
      "Access to co-working space (8 hours/week)",
      "Introductory networking events"
    ],
    eligibility: "Anyone with a startup idea, no prior experience needed",
    investment: "₹25,000 program fee"
  },
  {
    icon: Zap,
    title: "Core Incubation Program",
    duration: "6 months",
    description: "Comprehensive program for startups with validated MVP looking to achieve product-market fit and initial revenue traction.",
    features: [
      "Dedicated 1-on-1 mentor matching",
      "Weekly office hours with industry experts",
      "Full-time co-working space access",
      "Legal, accounting, and compliance support",
      "Introduction to angel investors & VCs",
      "Cloud credits worth ₹2L (AWS/GCP/Azure)",
      "Marketing & growth strategy workshops",
      "Demo Day presentation opportunity"
    ],
    eligibility: "Working prototype/MVP, founding team committed full-time",
    investment: "5-7% equity stake"
  },
  {
    icon: TrendingUp,
    title: "Accelerator Program",
    duration: "4 months",
    description: "High-intensity program for growth-stage startups ready to scale rapidly. Focus on metrics, fundraising, and exponential growth.",
    features: [
      "C-suite mentor access (CEOs, CTOs, CFOs)",
      "Direct investor introductions & warm intros",
      "Advanced growth hacking & marketing",
      "Financial modeling & fundraising prep",
      "Recruitment & team building support",
      "International market entry guidance",
      "PR & media coverage assistance",
      "Curated investor Demo Day with 50+ VCs"
    ],
    eligibility: "₹50L+ ARR or significant user traction, Series A readiness",
    investment: "3-5% equity stake"
  }
];

const Programs = () => {
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
        <div className="grid lg:grid-cols-3 gap-8">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-2xl gradient-card shadow-soft hover:shadow-lift transition-all flex flex-col"
            >
              <program.icon className="w-14 h-14 text-primary mb-4" />
              <Badge variant="secondary" className="mb-3 w-fit">{program.duration}</Badge>
              <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm">What You Get:</h4>
                <ul className="space-y-2">
                  {program.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1"><strong>Eligibility:</strong> {program.eligibility}</p>
                <p className="text-xs text-muted-foreground mb-4"><strong>Investment:</strong> {program.investment}</p>
                <Button className="w-full">Apply to {program.title.split(' ')[0]}</Button>
              </div>
            </motion.div>
          ))}
        </div>

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
    </div>
  );
};

export default Programs;