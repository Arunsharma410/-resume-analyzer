// frontend/src/components/landing/TestimonialsSection.jsx
// 💬 Customer Testimonials

import { testimonials } from '@/data/landingData';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { Star, MessageCircle, Quote } from 'lucide-react';
import { stringToColor } from '@utils/helpers';

const TestimonialsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* 📌 Section Header */}
        <div className="text-center mb-16">
          <Badge variant="success" icon={MessageCircle} className="mb-4">
            Customer Stories
          </Badge>
          <h2 className="text-display-md text-slate-900 dark:text-white mb-4 text-balance">
            Loved by{' '}
            <span className="gradient-text">job seekers</span>{' '}
            worldwide
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands who've transformed their job search with ResumeAI.
          </p>
        </div>

        {/* 💬 Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              variant="glass"
              hoverable
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 💬 Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-500/20" />

              {/* ⭐ Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* 📝 Text */}
              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* 👤 Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: stringToColor(testimonial.name) }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;