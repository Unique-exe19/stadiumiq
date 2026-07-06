'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Inline SVG flag components (sharp, no emoji rendering issues)
function BrazilFlag() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-label="Brazil flag" role="img">
      <rect width="20" height="14" fill="#009C3B"/>
      <polygon points="10,1 19,7 10,13 1,7" fill="#FEDF00"/>
      <circle cx="10" cy="7" r="3.2" fill="#002776"/>
      <path d="M7.1 6.5 Q10 4.5 12.9 6.5" stroke="white" strokeWidth="0.5" fill="none"/>
    </svg>
  );
}

function USAFlag() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-label="USA flag" role="img">
      <rect width="20" height="14" fill="#B22234"/>
      {[1,3,5,7,9,11].map(y => (
        <rect key={y} x="0" y={y} width="20" height="1" fill="white"/>
      ))}
      <rect width="8" height="7" fill="#3C3B6E"/>
      {[0.8,2.4,4,5.6].map((y,i) => (
        <circle key={i} cx={i % 2 === 0 ? 1.5 : 2.5} cy={y} r="0.5" fill="white"/>
      ))}
    </svg>
  );
}

function SaudiFlag() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-label="Saudi Arabia flag" role="img">
      <rect width="20" height="14" fill="#006C35"/>
      <text x="3" y="9.5" fontSize="5.5" fill="white" fontFamily="serif">الله</text>
      <rect x="13" y="8" width="4" height="0.8" fill="white"/>
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote: "StadiumIQ guided us from the metro to our seats in under 5 minutes, even with my wheelchair. The audio navigation was incredible.",
    author: "Maria S.",
    role: "Fan – Accessibility User",
    country: "Brazil",
    FlagComponent: BrazilFlag,
    rating: 5,
  },
  {
    quote: "The crowd predictions were spot-on. We redirected 800 fans before a bottleneck even formed. This is what modern stadium management looks like.",
    author: "James K.",
    role: "Venue Manager",
    country: "USA",
    FlagComponent: USAFlag,
    rating: 5,
  },
  {
    quote: "المساعد تحدث معي بالعربية وفهم طلبي بدقة. وجدت المقعد بسهولة تامة.",
    author: "Ahmed Al-R.",
    role: "Fan",
    country: "Saudi Arabia",
    FlagComponent: SaudiFlag,
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-tag mb-4">Fan Stories</span>
          <h2 id="testimonials-heading" className="text-3xl font-display font-bold text-slate-900 mt-3">
            Trusted by fans &amp; operators worldwide
          </h2>
          <p className="text-slate-500 mt-3 text-base max-w-xl mx-auto">
            Hear from the people who experienced StadiumIQ firsthand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.figure
              key={t.author}
              className="glass-card rounded-2xl p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" role="img" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="flex-1">
                <p className="text-slate-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>

              <figcaption className="flex items-center gap-2.5 pt-4 border-t border-slate-100">
                <t.FlagComponent />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.country}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
