import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const Apply = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl opacity-95">Start your journey with us today</p>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "For Startups", desc: "Apply to our incubation programs" },
            { title: "For Mentors", desc: "Share your expertise with innovators" },
            { title: "For Investors", desc: "Discover promising ventures" }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 text-center shadow-soft hover:shadow-lift transition-shadow">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Button className="w-full">Apply Now</Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-xl gradient-card shadow-soft"
        >
          <h2 className="text-2xl font-bold mb-6">Application Process</h2>
          <div className="space-y-4">
            {[
              "Submit your application form",
              "Initial screening review",
              "Interview with our team",
              "Final selection & onboarding"
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Step {i + 1}:</span> {step}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Apply;