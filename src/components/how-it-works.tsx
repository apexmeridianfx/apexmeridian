import { UserPlus, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in minutes with our streamlined onboarding process. Complete identity verification and set your investment preferences to get started.",
  },
  {
    number: "02",
    icon: Target,
    title: "Choose Your Investment",
    description:
      "Select from forex trading, real estate opportunities, or business financing. Our advisors can help you build a diversified portfolio tailored to your goals.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Watch Your Wealth Grow",
    description:
      "Monitor your investments through our intuitive dashboard. Receive regular updates, performance reports, and expert insights to maximize your returns.",
  },
];

export function HowItWorks() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Getting started with Apex Meridian is simple. Follow these three steps to begin your investment journey.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-secondary border-2 border-primary/30 mb-6">
                  <div className="text-center">
                    <span className="block text-xs text-primary font-semibold mb-1">
                      STEP
                    </span>
                    <span className="block text-2xl font-bold text-foreground">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
