import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function getExt(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function StorageUploadButton({
  label,
  folder,
  onUploaded,
  accept = "image/*",
}: {
  label: string;
  folder: string; // e.g. "program-banners"
  accept?: string;
  onUploaded: (publicUrl: string) => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handlePick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setUploading(false);
        toast({ title: "Sign in required", description: "Please sign in first.", variant: "destructive" });
        return;
      }

      const ext = getExt(file.name);
      const path = `${userId}/${folder}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

      const { error } = await supabase.storage.from("public-assets").upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

      if (error) {
        setUploading(false);
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        return;
      }

      const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
      setUploading(false);
      onUploaded(data.publicUrl);
      toast({ title: "Uploaded", description: "File uploaded successfully." });
    };
    input.click();
  };

  return (
    <Button type="button" variant="outline" onClick={handlePick} disabled={uploading}>
      {uploading ? "Uploading…" : label}
    </Button>
  );
}
