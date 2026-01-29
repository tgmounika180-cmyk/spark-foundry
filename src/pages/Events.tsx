import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to register for events", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        full_name: user.user_metadata?.full_name || '',
        email: user.email || ''
      });

    if (error) {
      if (error.code === '23505') {
        toast({ title: "Already registered", description: "You're already registered for this event" });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Success", description: "You've been registered for this event!" });
    }
  };

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
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No upcoming events at the moment. Check back soon!</div>
        ) : (
          <div className="space-y-6">
            {events.map((event, i) => (
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
                    <Badge variant="secondary">{event.event_type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.event_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <Button className="md:self-start" onClick={() => handleRegister(event.id)}>
                  Register Free
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