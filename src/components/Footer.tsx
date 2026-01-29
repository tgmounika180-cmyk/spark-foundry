import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 gradient-hero bg-clip-text text-transparent">Spark Foundry</h3>
            <p className="text-sm text-muted-foreground">
              India's leading incubation forum empowering startups to build the future.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              {["About", "Programs", "Events", "Apply"].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <div className="space-y-2">
              {["Startups", "Mentors", "Contact"].map(item => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-xs text-muted-foreground mb-3">Get monthly startup insights & events</p>
            <form className="flex gap-2 mb-4" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Your email" className="flex-1" />
              <Button size="sm" type="submit">Subscribe</Button>
            </form>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" aria-label={`Social link ${i + 1}`} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 Spark Foundry. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;