import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  { 
    title: "Demo Day - Spring 2026 Cohort", 
    date: "2026-02-15", 
    time: "3:00 PM - 7:00 PM", 
    location: "Spark Foundry Main Hall, Bangalore", 
    type: "Demo Day",
    description: "18 startups from our Spring cohort will pitch to 60+ investors. Open to all founders and investors."
  },
  { 
    title: "Product-Market Fit Masterclass", 
    date: "2026-02-20", 
    time: "10:00 AM - 4:00 PM", 
    location: "Virtual (Zoom)", 
    type: "Workshop",
    description: "Led by Rahul Vohra (Superhuman CEO). Learn frameworks for achieving PMF in B2B SaaS."
  },
  { 
    title: "Fundraising 101: From Angel to Series A", 
    date: "2026-02-28", 
    time: "6:00 PM - 8:00 PM", 
    location: "Mumbai Hub", 
    type: "Workshop",
    description: "Panel discussion with VCs from Sequoia, Accel, and Lightspeed on fundraising strategies."
  },
  { 
    title: "Startup Legal & Compliance Bootcamp", 
    date: "2026-03-05", 
    time: "2:00 PM - 5:00 PM", 
    location: "Delhi Hub", 
    type: "Workshop",
    description: "Everything founders need to know about company formation, cap tables, ESOP, and compliance."
  },
  { 
    title: "Founder Networking Night", 
    date: "2026-03-12", 
    time: "7:00 PM - 9:30 PM", 
    location: "Spark Foundry Bangalore", 
    type: "Networking",
    description: "Casual evening with 100+ founders, mentors, and investors. Food, drinks, and great conversations."
  },
  { 
    title: "Growth Marketing Sprint", 
    date: "2026-03-18", 
    time: "10:00 AM - 6:00 PM", 
    location: "Hyderabad Hub", 
    type: "Workshop",
    description: "Hands-on workshop on SEO, content marketing, paid ads, and growth hacking tactics."
  }
];

const Events = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-6 gradient-hero text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Events & Workshops</h1>
          <p className="text-xl opacity-95">Learn from experts, network with peers, showcase your startup</p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
        <div className="space-y-6">
          {upcomingEvents.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              className="p-6 rounded-xl gradient-card shadow-soft hover:shadow-lift transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <Badge variant="secondary">{event.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <Button className="md:self-start">Register Free</Button>
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
          <h3 className="text-2xl font-bold mb-3">Want to speak at our events?</h3>
          <p className="text-muted-foreground mb-6">We're always looking for experts to share knowledge with our community</p>
          <Button variant="outline" size="lg">Submit Speaker Proposal</Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Events;