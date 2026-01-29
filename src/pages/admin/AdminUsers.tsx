import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ROLES = ["startup", "mentor", "investor", "admin"] as const;
type Role = (typeof ROLES)[number];

export default function AdminUsers() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_user_overview")
      .select("id,full_name,email,created_at,roles")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRole = async (userId: string, role: Role, has: boolean) => {
    if (has) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Updated", description: `Removed ${role}.` });
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Updated", description: `Added ${role}.` });
    }
    load();
  };

  const setDisabled = async (userId: string, disabled: boolean) => {
    const { error } = await supabase.from("profiles").update({ disabled }).eq("id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Updated", description: disabled ? "User disabled." : "User enabled." });
      load();
    }
  };

  const normalized = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        roles: (r.roles ?? []) as string[],
      })),
    [rows],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users & Roles</h1>
        <p className="text-muted-foreground">Assign roles and disable/enable accounts.</p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : (
        <div className="space-y-3">
          {normalized.map((u) => (
            <Card key={u.id} className="p-4 shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{u.full_name ?? "(no name)"}</div>
                  <div className="text-sm text-muted-foreground truncate">{u.email}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ROLES.map((role) => {
                      const has = u.roles.includes(role);
                      return (
                        <Badge
                          key={role}
                          variant={has ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleRole(u.id, role, has)}
                        >
                          {role}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDisabled(u.id, true)}>
                    Disable
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDisabled(u.id, false)}>
                    Enable
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
