import { Link } from "wouter";
import { Sparkles, Mail, FileText, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4" data-testid="footer-brand">
              <Sparkles className="w-6 h-6 text-primary" data-testid="icon-footer-logo" />
              <span className="text-xl font-bold" data-testid="text-footer-brand">ATS Analyzer</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md" data-testid="text-footer-tagline">
              Professional ATS resume analysis powered by AI. Get instant feedback and 
              actionable recommendations to land your dream job.
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-footer-trust">
              Trusted by thousands of job seekers worldwide
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="heading-footer-product">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-footer-analyze">
                  <FileText className="w-4 h-4" />
                  Analyze Resume
                </Link>
              </li>
              <li>
                <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-reviews">
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="heading-footer-legal">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-footer-privacy">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-testid="link-footer-contact">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
            © {new Date().getFullYear()} ATS Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
