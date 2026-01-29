import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StorageUploadButton } from "@/components/admin/StorageUploadButton";

export default function AdminMedia() {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("hero_banners")
      .select("id,title,subtitle,cta_label,cta_href,image_url,sort_order,is_active")
      .order("sort_order", { ascending: true });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows(data ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditor = (row: any | null) => {
    setEditing(row);
    setTitle(row?.title ?? "");
    setSubtitle(row?.subtitle ?? "");
    setCtaLabel(row?.cta_label ?? "");
    setCtaHref(row?.cta_href ?? "");
    setImageUrl(row?.image_url ?? "");
    setOpen(true);
  };

  const save = async () => {
    if (!title.trim()) {
      toast({ title: "Missing title", description: "Banner title is required.", variant: "destructive" });
      return;
    }
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      cta_label: ctaLabel.trim() || null,
      cta_href: ctaHref.trim() || null,
      image_url: imageUrl.trim() || null,
      is_active: true,
      sort_order: editing?.sort_order ?? 0,
    };
    const { error } = editing?.id
      ? await supabase.from("hero_banners").update(payload).eq("id", editing.id)
      : await supabase.from("hero_banners").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Saved", description: "Banner updated." });
      setOpen(false);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media</h1>
          <p className="text-muted-foreground">Manage homepage hero banners.</p>
        </div>
        <Button onClick={() => openEditor(null)}>New banner</Button>
      </div>

      <div className="grid gap-3">
        {rows.map((b) => (
          <Card key={b.id} className="p-4 shadow-soft flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold truncate">{b.title}</div>
              <div className="text-sm text-muted-foreground truncate">{b.subtitle}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => openEditor(b)}>
              Edit
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit banner" : "New banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>CTA label</Label>
                <Input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>CTA link</Label>
                <Input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="/apply or https://…" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground truncate">Image: {imageUrl || "(none)"}</div>
              <StorageUploadButton label="Upload image" folder="hero-banners" onUploaded={setImageUrl} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
