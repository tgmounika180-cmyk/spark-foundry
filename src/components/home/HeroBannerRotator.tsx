import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type HeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  sort_order: number;
};

const FALLBACK: HeroBanner = {
  id: "fallback",
  title: "Empowering Startups. Accelerating Innovation.",
  subtitle:
    "Spark Foundry is a dynamic incubation forum with programs, mentors, events, and a live startup directory.",
  cta_label: "Apply for Incubation",
  cta_href: "/apply",
  image_url: null,
  sort_order: 0,
};

export function HeroBannerRotator() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from("hero_banners")
        .select("id,title,subtitle,cta_label,cta_href,image_url,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!mounted) return;

      if (error) {
        console.error("Failed to load hero banners", error);
        setBanners([FALLBACK]);
      } else {
        setBanners((data?.length ? (data as any) : [FALLBACK]) as HeroBanner[]);
      }
      setIndex(0);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 7000);
    return () => window.clearInterval(t);
  }, [banners.length]);

  const active = useMemo(() => banners[index] ?? FALLBACK, [banners, index]);

  const handleCta = () => {
    if (!active.cta_href) return;
    if (active.cta_href.startsWith("/")) navigate(active.cta_href);
    else window.open(active.cta_href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden py-32 px-6 gradient-hero text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        {active.image_url ? (
          <img
            src={active.image_url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              {active.title}
            </h1>
            {active.subtitle ? (
              <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
                {active.subtitle}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-lg"
                onClick={handleCta}
              >
                {active.cta_label ?? "Get Started"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary shadow-lg"
                onClick={() => navigate("/mentors")}
              >
                Browse Mentors
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                className="h-2.5 w-2.5 rounded-full border border-primary-foreground/50"
                style={{ opacity: i === index ? 1 : 0.45 }}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
