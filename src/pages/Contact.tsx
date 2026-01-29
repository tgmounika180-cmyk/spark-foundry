import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl opacity-95">Have questions? We're here to help.</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <Input placeholder="John Doe" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <Input type="email" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Subject</label>
                <Input placeholder="How can we help?" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Message</label>
                <Textarea placeholder="Tell us more about your startup or inquiry..." rows={6} required />
              </div>
              <Button className="w-full" size="lg" type="submit">Send Message</Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", text: "hello@sparkfoundry.in" },
                  { icon: Phone, label: "Phone", text: "+91 80-4567-8900" },
                  { icon: MapPin, label: "Address", text: "Level 5, Innovation Hub, Koramangala, Bangalore - 560095" }
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-0.5">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl gradient-card shadow-soft">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-bold mb-2">Office Hours</h3>
                  <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p className="text-sm text-muted-foreground">Saturday: 10:00 AM - 5:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-muted/30">
              <h3 className="font-bold mb-3">Other Locations</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Mumbai:</strong> Andheri East, Mumbai - 400069</p>
                <p><strong>Delhi:</strong> Connaught Place, New Delhi - 110001</p>
                <p><strong>Hyderabad:</strong> HITEC City, Hyderabad - 500081</p>
                <p><strong>Pune:</strong> Viman Nagar, Pune - 411014</p>
                <p><strong>Chennai:</strong> OMR, Chennai - 600096</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;