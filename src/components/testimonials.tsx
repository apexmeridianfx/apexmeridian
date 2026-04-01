import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Michael Richardson",
    role: "CEO, Richardson Ventures",
    location: "New York, USA",
    content:
      "Apex Meridian has transformed how I manage my portfolio. Their forex trading strategies have consistently delivered returns above my expectations. The team&apos;s expertise and professionalism are unmatched.",
    rating: 5,
    avatar: "MR",
  },
  {
    name: "Elizabeth van der Berg",
    role: "Private Investor",
    location: "Amsterdam, Netherlands",
    content:
      "The real estate opportunities presented by Apex Meridian have been exceptional. I&apos;ve diversified my wealth across multiple properties and the passive income has been remarkable. Highly recommended for serious investors.",
    rating: 5,
    avatar: "EB",
  },
  {
    name: "James O&apos;Connor",
    role: "Founder, TechStart Inc.",
    location: "London, UK",
    content:
      "When I needed capital to scale my business, Apex Meridian provided a business loan with competitive terms and incredibly fast approval. Their team understood my needs and delivered beyond expectations.",
    rating: 5,
    avatar: "JO",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Trusted by <span className="text-primary">Investors Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of satisfied clients who have grown their wealth with Apex Meridian.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-primary fill-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
