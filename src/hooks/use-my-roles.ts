import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "startup" | "mentor" | "investor";

export function useMyRoles() {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        if (mounted) {
          setRoles([]);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (!mounted) return;

      if (error) {
        // RLS prevents reading other users' roles; own roles should be readable.
        console.error("Failed to load roles", error);
        setRoles([]);
      } else {
        setRoles((data ?? []).map((r: any) => r.role as AppRole));
      }
      setLoading(false);
    };

    load();
    const { data } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = useMemo(() => roles.includes("admin"), [roles]);
  const isStartup = useMemo(() => roles.includes("startup"), [roles]);
  const isMentor = useMemo(() => roles.includes("mentor"), [roles]);
  const isInvestor = useMemo(() => roles.includes("investor"), [roles]);

  return { roles, loading, isAdmin, isStartup, isMentor, isInvestor };
}
