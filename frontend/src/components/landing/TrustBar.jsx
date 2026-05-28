// frontend/src/components/landing/TrustBar.jsx
// 🤝 Trusted by section

import { trustedBy } from '@/data/landingData';

const TrustBar = () => {
  return (
    <section className="py-12 border-y border-slate-200 dark:border-white/10">
      <div className="container-custom">
        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 uppercase tracking-wider">
          Trusted by professionals from top companies
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 hover:opacity-100 transition-opacity">
          {trustedBy.map((company) => (
            <div
              key={company}
              className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;