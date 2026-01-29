import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Award, Users, Linkedin } from "lucide-react";

const mentors = [
  { 
    name: "Dr. Anjali Gupta", 
    expertise: ["AI/ML", "Product Strategy", "Deep Tech"], 
    role: "Chief AI Officer at TechCorp",
    background: "PhD Stanford, Former Google Brain researcher. Built AI products used by 100M+ users.",
    companies: "Google, DeepMind"
  },
  { 
    name: "Ravi Malhotra", 
    expertise: ["FinTech", "Fundraising", "Growth"], 
    role: "Partner at Venture Fund XYZ",
    background: "Led PayPal India. Invested in 40+ startups. 2 successful exits including acquisition by Stripe.",
    companies: "PayPal, Stripe, Razorpay"
  },
  { 
    name: "Dr. Meera Krishnan", 
    expertise: ["HealthTech", "Regulatory", "Operations"], 
    role: "Founder & CEO, HealthCo",
    background: "MBBS, Harvard MBA. Built India's largest telemedicine network. Advisor to Ministry of Health.",
    companies: "Apollo Hospitals, Practo"
  },
  { 
    name: "Vikram Sengupta", 
    expertise: ["SaaS", "Sales", "Enterprise GTM"], 
    role: "VP Sales, GlobalSoft",
    background: "Built enterprise sales teams from 0 to 200+. $100M+ in closed deals. Expert in B2B SaaS.",
    companies: "Salesforce, Freshworks, Zoho"
  },
  { 
    name: "Pooja Reddy", 
    expertise: ["Marketing", "Brand", "Growth Hacking"], 
    role: "CMO at Consumer Brand Inc",
    background: "Scaled 3 brands to $10M+ ARR. Performance marketing specialist. Built viral campaigns for unicorns.",
    companies: "Flipkart, Swiggy, CRED"
  },
  { 
    name: "Arjun Nair", 
    expertise: ["EdTech", "Content", "Community"], 
    role: "Founder, LearnCo (Acquired)",
    background: "Built edtech startup acquired by BYJU'S. Expert in content creation and learner engagement.",
    companies: "BYJU'S, Unacademy"
  },
  { 
    name: "Kavita Iyer", 
    expertise: ["Legal", "Compliance", "IP"], 
    role: "Partner, Law Firm Associates",
    background: "20+ years in startup law. Handled 100+ funding rounds. Expert in IP, contracts, and regulatory.",
    companies: "Advises 50+ startups"
  },
  { 
    name: "Sanjay Patel", 
    expertise: ["Manufacturing", "Supply Chain", "Hardware"], 
    role: "COO, HardwareCo",
    background: "Built supply chains for hardware startups. Expert in manufacturing, logistics, and ops at scale.",
    companies: "Xiaomi India, OnePlus, boAt"
  }
];

const Mentors = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Mentors & Advisors</h1>
          <p className="text-xl opacity-95">142 experts from Google, Sequoia, Flipkart, and leading startups</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">All Mentors</Badge>
          {["AI/ML", "FinTech", "HealthTech", "SaaS", "Marketing", "Legal"].map(area => (
            <Badge key={area} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
              {area}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {mentors.map((mentor, i) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl gradient-card shadow-soft hover:shadow-lift transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{mentor.role}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mentor.expertise.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{mentor.background}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  {mentor.companies}
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" />
                  Connect
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

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