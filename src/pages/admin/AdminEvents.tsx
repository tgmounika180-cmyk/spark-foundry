import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StorageUploadButton } from "@/components/admin/StorageUploadButton";

type EventRow = any;

function EventEditor({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: EventRow | null;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Workshop");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:00 AM - 12:00 PM");
  const [location, setLocation] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState<string>("");

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setEventType(initial?.event_type ?? "Workshop");
    setDate(initial?.event_date ? new Date(initial.event_date) : undefined);
    setTime(initial?.event_time ?? "10:00 AM - 12:00 PM");
    setLocation(initial?.location ?? "");
    setOnlineUrl(initial?.online_url ?? "");
    setDescription(initial?.description ?? "");
    setBanner(initial?.banner_image_url ?? "");
  }, [open, initial]);

  const save = async () => {
    if (!title.trim() || !date || !time.trim() || !location.trim() || !eventType.trim()) {
      toast({ title: "Missing fields", description: "Title, type, date, time, and location are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      event_type: eventType.trim(),
      event_date: format(date, "yyyy-MM-dd"),
      event_time: time.trim(),
      location: location.trim(),
      description: description.trim() || null,
      online_url: onlineUrl.trim() || null,
      banner_image_url: banner.trim() || null,
    };

    const { error } = initial?.id
      ? await supabase.from("events").update(payload).eq("id", initial.id)
      : await supabase.from("events").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved", description: "Event updated." });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit event" : "New event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Input value={eventType} onChange={(e) => setEventType(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Input value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Online link (optional)</Label>
            <Input value={onlineUrl} onChange={(e) => setOnlineUrl(e.target.value)} placeholder="https://…" />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground truncate">Banner: {banner || "(none)"}</div>
            <StorageUploadButton label="Upload banner" folder="event-banners" onUploaded={setBanner} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EventRegistrationsDialog({
  open,
  onOpenChange,
  eventId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  eventId: string | null;
}) {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !eventId) return;
    const load = async () => {
      const { data } = await supabase
        .from("event_registrations")
        .select("id,full_name,email,created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      setRows(data ?? []);
    };
    load();
  }, [open, eventId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrations</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.id} className="text-sm">
              <div className="font-medium">{r.full_name}</div>
              <div className="text-muted-foreground">{r.email}</div>
            </div>
          ))}
          {rows.length === 0 ? <div className="text-sm text-muted-foreground">No registrations.</div> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminEvents() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [regsOpen, setRegsOpen] = useState(false);
  const [regsEventId, setRegsEventId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setRows([]);
    } else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const del = async (e: any) => {
    if (!window.confirm(`Delete "${e.title}"?`)) return;
    const { error } = await supabase.from("events").delete().eq("id", e.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Event removed." });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Create events and view registrations.</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditing(null);
            setEditorOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-muted-foreground">No events.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((e) => (
            <Card key={e.id} className="p-5 shadow-soft">
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{e.event_date} • {e.event_time}</div>
              <div className="text-sm text-muted-foreground">{e.location}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setEditing(e);
                    setEditorOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => del(e)}>
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setRegsEventId(e.id);
                    setRegsOpen(true);
                  }}
                >
                  <Users className="w-4 h-4" /> Registrations
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <EventEditor open={editorOpen} onOpenChange={setEditorOpen} initial={editing} onSaved={load} />
      <EventRegistrationsDialog open={regsOpen} onOpenChange={setRegsOpen} eventId={regsEventId} />
    </div>
  );
}
