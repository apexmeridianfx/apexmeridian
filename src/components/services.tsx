import { TrendingUp, Building2, Banknote, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "forex",
    icon: TrendingUp,
    title: "Forex Trading & Investment",
    description:
      "Access managed forex portfolios with competitive returns. Our expert traders leverage advanced algorithms and market insights to grow your investments in the world&apos;s largest financial market.",
    features: [
      "Professional portfolio management",
      "Real-time market analysis",
      "Risk-adjusted strategies",
      "Monthly performance reports",
    ],
    href: "#forex",
  },
  {
    id: "real-estate",
    icon: Building2,
    title: "Real Estate Investment",
    description:
      "Invest in curated commercial and residential property opportunities across prime locations. Build lasting wealth through carefully vetted real estate assets with attractive yields.",
    features: [
      "Premium property selection",
      "Diversified portfolio options",
      "Passive income streams",
      "Full property management",
    ],
    href: "#real-estate",
  },
  {
    id: "loans",
    icon: Banknote,
    title: "Business Loans",
    description:
      "Fast approval financing for businesses and individuals. Whether you need capital for expansion, equipment, or operations, we offer competitive rates and flexible terms.",
    features: [
      "Quick approval process",
      "Competitive interest rates",
      "Flexible repayment terms",
      "No hidden fees",
    ],
    href: "#loans",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Comprehensive Financial <span className="text-primary">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Three powerful investment pathways designed to help you build, protect, and grow your wealth with confidence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={service.href}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
