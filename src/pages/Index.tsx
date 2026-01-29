import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Users, Target, Lightbulb, TrendingUp, Shield, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { label: "Startups Incubated", target: 287, suffix: "", icon: Rocket },
  { label: "Mentors Onboarded", target: 142, suffix: "", icon: Users },
  { label: "Programs Conducted", target: 96, suffix: "", icon: Target }
];

const services = [
  {
    icon: Lightbulb,
    title: "Incubation Programs",
    description: "Structured 6-12 month programs with curriculum, workspace, and hands-on guidance to transform ideas into market-ready ventures."
  },
  {
    icon: Users,
    title: "Mentorship",
    description: "Access to 140+ industry veterans across technology, finance, marketing, and operations who provide personalized strategic guidance."
  },
  {
    icon: TrendingUp,
    title: "Funding Support",
    description: "Connect with angel investors, VCs, and government grants. We've helped startups raise over ₹420 crores in total funding."
  },
  {
    icon: Shield,
    title: "Innovation Labs",
    description: "State-of-the-art prototyping facilities with 3D printing, IoT kits, cloud credits, and technical resources worth ₹50L+."
  }
];

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-32 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Empowering Startups.<br />Accelerating Innovation.
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
            Spark Foundry is India's leading incubation forum providing end-to-end support for early-stage startups. 
            From ideation to scale, we offer mentorship, funding access, workspace, and a thriving entrepreneurial community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
              Apply for Incubation <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg">
              Join as Mentor
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What We Offer</h2>
            <p className="text-xl text-muted-foreground">Comprehensive support to turn your vision into reality</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-2xl gradient-card shadow-soft hover:shadow-lift transition-all"
              >
                <service.icon className="w-14 h-14 text-primary mb-5" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Highlight */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Briefcase, title: "₹420 Cr+", subtitle: "Total Funding Raised", desc: "Our startups have collectively raised over ₹420 crores from leading investors" },
              { icon: Rocket, title: "85%", subtitle: "Success Rate", desc: "85% of incubated startups are operational and growing after 2 years" },
              { icon: Target, title: "40+", subtitle: "Exits & Acquisitions", desc: "Successful exits including acquisitions by Fortune 500 companies" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-xl gradient-card shadow-soft"
              >
                <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2 gradient-hero bg-clip-text text-transparent">{item.title}</div>
                <div className="font-semibold mb-2">{item.subtitle}</div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build the Future?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join 287+ startups that chose Spark Foundry as their launchpad to success
          </p>
          <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
            Start Your Journey Today <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
