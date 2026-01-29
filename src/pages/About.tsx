import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Globe, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Spark Foundry</h1>
          <p className="text-xl opacity-95">Building India's most vibrant startup ecosystem</p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Founded in 2018, Spark Foundry emerged from a simple observation: brilliant ideas were failing not due to lack of talent, 
            but due to lack of proper guidance, resources, and network. A group of successful entrepreneurs and investors came together 
            with a mission to change this narrative.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            What started as a small co-working space in Bangalore with 12 startups has now grown into a pan-India incubation forum 
            with presence in 6 cities. We've incubated 287 startups across sectors including AI/ML, HealthTech, FinTech, AgriTech, 
            EdTech, and CleanTech.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, Spark Foundry is recognized as one of India's top incubation programs, backed by leading venture funds and 
            supported by government initiatives. Our alumni network includes companies valued at over ₹3,200 crores collectively.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { 
              icon: Target, 
              title: "Mission", 
              text: "To democratize entrepreneurship by providing world-class incubation support to early-stage startups, helping them navigate the journey from ideation to sustainable business models through mentorship, funding access, and ecosystem connections."
            },
            { 
              icon: Eye, 
              title: "Vision", 
              text: "To be India's most impactful startup incubator by 2030, fostering 1,000+ successful ventures that create jobs, drive innovation, and contribute meaningfully to economic growth while solving real-world problems."
            },
            { 
              icon: Heart, 
              title: "Values", 
              text: "Integrity in all dealings, collaborative spirit over competition, relentless focus on innovation, commitment to sustainable and inclusive growth, and unwavering support for founder journeys through ups and downs."
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl gradient-card shadow-soft hover:shadow-lift transition-shadow"
            >
              <item.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "Top 10 Incubator", desc: "Ranked among India's top 10 incubators by NASSCOM" },
              { icon: Globe, title: "6 City Presence", desc: "Operating in Bangalore, Mumbai, Delhi, Hyderabad, Pune, Chennai" },
              { icon: Zap, title: "4,200+ Jobs", desc: "Created directly by our portfolio companies" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-muted/30"
              >
                <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-12 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Rajesh Menon", role: "Founder & CEO", bg: "Former VP at Flipkart" },
              { name: "Dr. Priya Iyer", role: "Chief Innovation Officer", bg: "Ex-Google, PhD MIT" },
              { name: "Arjun Sharma", role: "Head of Programs", bg: "15+ years in startups" },
              { name: "Kavita Reddy", role: "Investment Lead", bg: "Ex-Sequoia Capital" }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center p-6 rounded-xl gradient-card shadow-soft"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <h4 className="font-bold mb-1">{member.name}</h4>
                <p className="text-sm font-medium text-primary mb-1">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bg}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;