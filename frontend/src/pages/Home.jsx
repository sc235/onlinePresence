import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Briefcase, Anchor, TrendingUp, Shield, Award,
  Users, ChevronRight, ArrowRight, Phone, MessageCircle,
  CheckCircle, Star, BookOpen, Globe
} from 'lucide-react';

// ──────────────────────────────────────────────
// Hook: Intersection Observer for scroll animations
// ──────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

// ──────────────────────────────────────────────
// Animated Counter Component
// ──────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ──────────────────────────────────────────────
// HERO SECTION
// ──────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #080f1f 0%, #0c1b33 40%, #152238 100%)' }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(201,168,76,0.08), transparent 60%)' }}
      />

      {/* Decorative floating orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-navy-600/20 blur-3xl pointer-events-none" />
      
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-px h-full pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.1), transparent)' }} />

      <div className="section-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8">
              <Scale className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-medium text-gold-400 tracking-wider uppercase">Cabinet d'Avocat — Dakar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-cream leading-tight mb-6">
              L'Excellence<br />
              <span className="text-gradient-gold">Juridique</span><br />
              à Votre Service
            </h1>

            <p className="text-lg text-cream/60 max-w-lg mb-10 leading-relaxed">
              Le Cabinet Maître Cheikh Ahmadou Ndiaye, avocat au Barreau du Sénégal depuis 1996, 
              vous accompagne avec rigueur et expertise dans tous vos enjeux juridiques.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                id="hero-cta-contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
              >
                Prendre Rendez-vous
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                id="hero-cta-services"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold-500/30 text-cream rounded-xl hover:bg-gold-500/10 hover:border-gold-500/50 transition-all duration-300"
              >
                Nos Services
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gold-500/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold-500" />
                <span className="text-sm text-cream/50">Consultation confidentielle</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-500" />
                <span className="text-sm text-cream/50">Barreau du Sénégal</span>
              </div>
            </div>
          </div>

          {/* Right — Decorative card */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main card */}
              <div className="glass-card p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/20">
                    <Scale className="w-8 h-8 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-cream">Maître Ndiaye</h3>
                    <p className="text-sm text-gold-400">Avocat au Barreau du Sénégal</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Briefcase, text: 'Droit des Affaires & OHADA' },
                    { icon: Anchor, text: 'Droit Maritime' },
                    { icon: TrendingUp, text: 'Droit des Investissements' },
                    { icon: Globe, text: 'Droits de l\'Homme & Droit International' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700/30">
                      <item.icon className="w-4 h-4 text-gold-500" />
                      <span className="text-sm text-cream/70">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Contact quick access */}
                <div className="mt-6 pt-6 border-t border-gold-500/10 flex items-center gap-4">
                  <a
                    href="tel:+221776303703"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-navy-800/50 text-cream/70 hover:text-gold-400 hover:bg-navy-700/50 transition-all text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                  <a
                    href="https://wa.me/221776303703"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Decorative floating cards */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-gold-500/10 border border-gold-500/15 backdrop-blur-sm flex items-center justify-center animate-float">
                <Award className="w-8 h-8 text-gold-500/40" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-20 rounded-xl bg-navy-700/30 border border-navy-600/20 backdrop-blur-sm flex items-center justify-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                <Star className="w-4 h-4 text-gold-500/60" />
                <div>
                  <div className="text-xs text-cream/50">Expérience</div>
                  <div className="text-sm font-semibold text-gold-400">+28 ans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// EXPERTISE SECTION
// ──────────────────────────────────────────────
function ExpertiseSection() {
  const [sectionRef, isInView] = useInView();

  const expertises = [
    {
      icon: Briefcase,
      title: 'Droit des Affaires',
      description: 'Création de sociétés, contrats commerciaux, contentieux des affaires et conseil juridique aux entreprises.',
      features: ['Création de sociétés', 'Contentieux commercial', 'Conseil juridique'],
    },
    {
      icon: BookOpen,
      title: 'Droit OHADA',
      description: 'Maîtrise des Actes Uniformes, arbitrage CCJA, droit des sociétés commerciales et des sûretés.',
      features: ['Actes Uniformes', 'Arbitrage CCJA', 'Droit des sûretés'],
    },
    {
      icon: Anchor,
      title: 'Droit Maritime',
      description: 'Transport maritime, assurances maritimes, litiges portuaires et droit de la mer.',
      features: ['Transport maritime', 'Assurances maritimes', 'Litiges portuaires'],
    },
    {
      icon: TrendingUp,
      title: 'Droit des Investissements',
      description: 'Code des investissements, joint-ventures, partenariats publics-privés et arbitrage d\'investissement.',
      features: ['Code des investissements', 'Joint-ventures', 'PPP'],
    },
  ];

  return (
    <section id="expertise-section" className="relative py-24 bg-navy-900 overflow-hidden" ref={sectionRef}>
      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-xs font-medium text-gold-500 tracking-widest uppercase mb-4 block">Nos Domaines</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
            Domaines d'<span className="text-gradient-gold">Expertise</span>
          </h2>
          <div className="gold-divider mx-auto mb-6"></div>
          <p className="text-cream/50 max-w-2xl mx-auto">
            Une expertise pointue dans les domaines juridiques les plus stratégiques 
            pour les acteurs économiques en Afrique de l'Ouest.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertises.map((item, index) => (
            <Link
              to="/services"
              key={index}
              className={`glass-card p-6 group cursor-pointer transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/15 to-gold-600/15 flex items-center justify-center mb-5 group-hover:from-gold-500/25 group-hover:to-gold-600/25 transition-all duration-300 border border-gold-500/10">
                <item.icon className="w-6 h-6 text-gold-400" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-heading font-semibold text-cream mb-3 group-hover:text-gold-400 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-cream/50 mb-5 leading-relaxed">
                {item.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-cream/40">
                    <CheckCircle className="w-3 h-3 text-gold-500/50 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Link */}
              <div className="flex items-center gap-1 text-sm text-gold-500/60 group-hover:text-gold-400 transition-colors">
                En savoir plus
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// STATS SECTION
// ──────────────────────────────────────────────
function StatsSection() {
  const [sectionRef, isInView] = useInView();

  const stats = [
    { value: 28, suffix: '+', label: 'Années d\'expérience', icon: Award },
    { value: 500, suffix: '+', label: 'Dossiers traités', icon: Briefcase },
    { value: 200, suffix: '+', label: 'Clients satisfaits', icon: Users },
    { value: 98, suffix: '%', label: 'Taux de succès', icon: Star },
  ];

  return (
    <section id="stats-section" className="relative py-20 bg-navy-950 overflow-hidden">
      <div className="section-container relative z-10" ref={sectionRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center p-8 rounded-2xl bg-navy-900/50 border border-gold-500/10 hover:border-gold-500/20 transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <stat.icon className="w-6 h-6 text-gold-500/50 mx-auto mb-4" />
              <div className="text-3xl sm:text-4xl font-heading font-bold text-gradient-gold mb-2">
                {isInView && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
              </div>
              <p className="text-sm text-cream/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// CTA SECTION
// ──────────────────────────────────────────────
function CTASection() {
  const [sectionRef, isInView] = useInView();

  return (
    <section
      id="cta-section"
      className="relative py-24 overflow-hidden"
      ref={sectionRef}
      style={{ background: 'linear-gradient(90deg, #0c1b33, #152238, #0c1b33)' }}
    >
      {/* Decorative border lines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

      <div className={`section-container relative z-10 text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Scale className="w-10 h-10 text-gold-500/40 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
          Besoin d'un <span className="text-gradient-gold">Conseil Juridique</span> ?
        </h2>
        <p className="text-cream/50 max-w-xl mx-auto mb-10">
          Prenez contact dès aujourd'hui pour une consultation confidentielle. 
          Notre équipe est à votre écoute pour vous accompagner dans vos démarches juridiques.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            id="cta-contact-form"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4" />
            Nous Contacter
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://wa.me/221776303703"
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-600/30 hover:border-green-500/50 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// HOME PAGE
// ──────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    document.title = 'Cabinet Maître Ndiaye — Avocat à Dakar, Sénégal';
  }, []);

  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <StatsSection />
      <CTASection />
    </>
  );
}
