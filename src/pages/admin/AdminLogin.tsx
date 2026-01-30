import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMyRoles } from "@/hooks/use-my-roles";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, loading } = useMyRoles();

  const [me, setMe] = useState<{ id: string; email?: string | null } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as any)?.from ?? "/admin";

  const signedIn = useMemo(() => !!me?.id, [me?.id]);

  useEffect(() => {
    let mounted = true;

    const loadMe = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!mounted) return;
      setMe(user ? { id: user.id, email: user.email } : null);
    };

    loadMe();
    const { data } = supabase.auth.onAuthStateChange(() => {
      loadMe();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [from, isAdmin, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Role check happens via useMyRoles(); we navigate once roles load.
    toast({ title: "Signed in", description: "Checking admin access…" });
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
  };

  const copyUserId = async () => {
    if (!me?.id) return;
    try {
      await navigator.clipboard.writeText(me.id);
      toast({ title: "Copied", description: "Your user ID was copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy it manually.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 shadow-soft">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold">Admin login</h1>
          <p className="text-sm text-muted-foreground">Sign in with an admin account to access the dashboard.</p>
        </div>

        {signedIn && !loading && !isAdmin ? (
          <div className="mb-4 rounded-md border border-border bg-muted/30 p-3 text-sm">
            <div className="font-medium">You’re signed in, but this account is not an admin.</div>
            <div className="text-muted-foreground mt-1 break-all">Signed in as: {me?.email ?? "(no email)"}</div>
            <div className="text-muted-foreground break-all">User ID: {me?.id}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={copyUserId}>
                Copy user ID
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onSignOut}>
                Sign out
              </Button>
            </div>
            <div className="text-muted-foreground mt-2">
              Ask an existing admin to grant your account the <span className="font-medium">admin</span> role.
            </div>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting || (signedIn && !isAdmin)}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
