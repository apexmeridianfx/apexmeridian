const stats = [
  {
    value: "$2.4B",
    label: "Assets Managed",
    description: "Total portfolio value",
  },
  {
    value: "15,000+",
    label: "Active Investors",
    description: "Growing community",
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    description: "Based on reviews",
  },
  {
    value: "12+",
    label: "Years Experience",
    description: "Industry expertise",
  },
];

export function Stats() {
  return (
    <section className="relative py-16 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center lg:text-left"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-foreground font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
