import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProgramCategory = "pre-incubation" | "incubation" | "accelerator";

export type ProgramRow = {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  category: ProgramCategory;
  application_url: string | null;
  image_url: string | null;
  is_active: boolean;
};

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).optional().nullable(),
  duration: z.string().trim().max(80).optional().nullable(),
  category: z.enum(["pre-incubation", "incubation", "accelerator"]),
  application_url: z.string().trim().url().optional().nullable(),
  image_url: z.string().trim().url().optional().nullable(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function ProgramEditorDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProgramRow | null;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      category: "incubation",
      application_url: "",
      image_url: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      duration: initial?.duration ?? "",
      category: (initial?.category ?? "incubation") as ProgramCategory,
      application_url: initial?.application_url ?? "",
      image_url: initial?.image_url ?? "",
      is_active: initial?.is_active ?? true,
    });
  }, [open, initial, form]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      duration: values.duration || null,
      category: values.category,
      application_url: values.application_url || null,
      image_url: values.image_url || null,
      is_active: values.is_active,
    };

    const { error } = initial?.id
      ? await supabase.from("programs").update(payload).eq("id", initial.id)
      : await supabase.from("programs").insert(payload);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Saved", description: "Program updated." });
    onOpenChange(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit program" : "New program"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="program-name">Name</Label>
            <Input id="program-name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="program-desc">Description</Label>
            <Textarea id="program-desc" rows={4} {...form.register("description")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="program-duration">Duration</Label>
              <Input id="program-duration" placeholder="e.g. 6 months" {...form.register("duration")} />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(v) => form.setValue("category", v as ProgramCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-incubation">Pre-Incubation</SelectItem>
                  <SelectItem value="incubation">Incubation</SelectItem>
                  <SelectItem value="accelerator">Accelerator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="program-apply-url">Application URL (optional)</Label>
            <Input id="program-apply-url" placeholder="https://..." {...form.register("application_url")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="program-image-url">Image URL (optional)</Label>
            <Input id="program-image-url" placeholder="https://..." {...form.register("image_url")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
