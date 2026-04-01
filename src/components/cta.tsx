import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-card to-secondary border border-border p-12 lg:p-20">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Ready to Start Your{" "}
              <span className="text-primary">Investment Journey?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Join over 15,000 investors who trust Apex Meridian to grow their wealth.
              Open your free account today and discover a smarter way to invest.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#get-started"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-base font-semibold hover:bg-primary/90 transition-all"
              >
                Open Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground rounded-lg text-base font-medium hover:bg-secondary transition-colors"
              >
                Schedule a Call
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              No credit card required • Free consultation available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
