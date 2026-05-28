// frontend/src/components/landing/StatsSection.jsx
// 📊 Impressive Numbers

import { stats } from '@/data/landingData';

const StatsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="glass-card p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* 🌌 Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5" />

          {/* 📊 Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* 🎨 Icon */}
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* 🔢 Number */}
                  <div className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2">
                    {stat.value}
                  </div>

                  {/* 📝 Label */}
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;