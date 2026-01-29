import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

type CountState = {
  startups: number;
  mentors: number;
  investors: number;
  programs: number;
  events: number;
  pendingApps: number;
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<CountState | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [startupsRes, mentorsRes, investorsRes, programsRes, eventsRes, pendingRes, appsRes, usersRes, eventsFeedRes] =
        await Promise.all([
          supabase.from("startups").select("id", { count: "exact", head: true }),
          supabase.from("mentors").select("id", { count: "exact", head: true }),
          supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "investor"),
          supabase.from("programs").select("id", { count: "exact", head: true }),
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("applications").select("id,startup_name,program_type,status,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("profiles").select("id,full_name,email,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("events").select("id,title,event_date,created_at").order("created_at", { ascending: false }).limit(5),
        ]);

      setCounts({
        startups: startupsRes.count ?? 0,
        mentors: mentorsRes.count ?? 0,
        investors: investorsRes.count ?? 0,
        programs: programsRes.count ?? 0,
        events: eventsRes.count ?? 0,
        pendingApps: pendingRes.count ?? 0,
      });

      setRecentApplications(appsRes.data ?? []);
      setRecentUsers(usersRes.data ?? []);
      setRecentEvents(eventsFeedRes.data ?? []);
      setLoading(false);
    };

    load();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Total Startups", value: counts?.startups ?? 0 },
      { label: "Total Mentors", value: counts?.mentors ?? 0 },
      { label: "Total Investors", value: counts?.investors ?? 0 },
      { label: "Total Programs", value: counts?.programs ?? 0 },
      { label: "Total Events", value: counts?.events ?? 0 },
      { label: "Pending Applications", value: counts?.pendingApps ?? 0 },
    ],
    [counts],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Live counts and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-5 shadow-soft">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="text-3xl font-bold mt-1">{loading ? "…" : c.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 shadow-soft">
          <div className="font-semibold mb-3">New applications</div>
          <div className="space-y-2">
            {recentApplications.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{a.startup_name}</div>
                  <div className="text-muted-foreground truncate">{a.program_type}</div>
                </div>
                <Badge variant={a.status === "pending" ? "secondary" : "outline"}>{a.status}</Badge>
              </div>
            ))}
            {recentApplications.length === 0 ? (
              <div className="text-sm text-muted-foreground">No activity yet.</div>
            ) : null}
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <div className="font-semibold mb-3">New users</div>
          <div className="space-y-2">
            {recentUsers.map((u) => (
              <div key={u.id} className="text-sm">
                <div className="font-medium">{u.full_name ?? "(no name)"}</div>
                <div className="text-muted-foreground truncate">{u.email}</div>
              </div>
            ))}
            {recentUsers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No activity yet.</div>
            ) : null}
          </div>
        </Card>

        <Card className="p-5 shadow-soft">
          <div className="font-semibold mb-3">New events</div>
          <div className="space-y-2">
            {recentEvents.map((e) => (
              <div key={e.id} className="text-sm">
                <div className="font-medium">{e.title}</div>
                <div className="text-muted-foreground">{e.event_date}</div>
              </div>
            ))}
            {recentEvents.length === 0 ? (
              <div className="text-sm text-muted-foreground">No activity yet.</div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
