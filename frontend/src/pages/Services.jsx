import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, Briefcase, Anchor, TrendingUp, BookOpen, ArrowRight,
  CheckCircle, ChevronDown, ChevronUp, Shield, Globe,
  Gavel, Building, Ship, Coins, Handshake
} from 'lucide-react';

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

// FAQ Accordion Item
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-gold-500/10 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-gold-400' : 'text-cream/80 group-hover:text-cream'}`}>
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gold-400 shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cream/40 group-hover:text-cream/60 shrink-0 ml-4" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-cream/50 leading-relaxed px-1">{answer}</p>
      </div>
    </div>
  );
}

export default function Services() {
  const [heroRef, heroInView] = useInView();
  const [servicesRef, servicesInView] = useInView();
  const [faqRef, faqInView] = useInView();
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
    document.title = 'Services — Cabinet Maître Ndiaye | Domaines d\'Expertise';
  }, []);

  const services = [
    {
      icon: Briefcase,
      accent: Building,
      title: 'Droit des Affaires',
      subtitle: 'Conseil & Contentieux Commercial',
      description: 'Un accompagnement juridique complet pour les entreprises à chaque étape de leur développement, de la création à l\'expansion.',
      details: [
        'Création et constitution de sociétés (SA, SARL, SAS)',
        'Rédaction et négociation de contrats commerciaux',
        'Contentieux commercial et recouvrement de créances',
        'Conseil en gouvernance d\'entreprise',
        'Fusions, acquisitions et restructurations',
        'Droit de la concurrence et distribution',
      ],
    },
    {
      icon: BookOpen,
      accent: Gavel,
      title: 'Droit OHADA',
      subtitle: 'Actes Uniformes & Arbitrage',
      description: 'Une expertise approfondie du droit harmonisé des affaires en Afrique, applicable dans les 17 États membres de l\'OHADA.',
      details: [
        'Application des Actes Uniformes OHADA',
        'Arbitrage devant la CCJA',
        'Droit des sociétés commerciales OHADA',
        'Droit des sûretés et des procédures collectives',
        'Droit commercial général harmonisé',
        'Droit comptable et information financière',
      ],
    },
    {
      icon: Anchor,
      accent: Ship,
      title: 'Droit Maritime',
      subtitle: 'Transport & Litiges Portuaires',
      description: 'Une compétence reconnue dans le secteur maritime, essentielle pour un pays à vocation maritime comme le Sénégal.',
      details: [
        'Transport maritime de marchandises',
        'Assurances maritimes et contentieux',
        'Litiges portuaires et douaniers',
        'Droit de la mer et zones économiques',
        'Contrats d\'affrètement et connaissement',
        'Accidents maritimes et responsabilité',
      ],
    },
    {
      icon: TrendingUp,
      accent: Coins,
      title: 'Droit des Investissements',
      subtitle: 'Code des Investissements & PPP',
      description: 'L\'accompagnement stratégique des investisseurs nationaux et étrangers dans leurs projets au Sénégal et en Afrique de l\'Ouest.',
      details: [
        'Code des investissements du Sénégal',
        'Joint-ventures et partenariats stratégiques',
        'Partenariats publics-privés (PPP)',
        'Arbitrage international d\'investissement',
        'Due diligence juridique',
        'Protection des investissements étrangers',
      ],
    },
  ];

  const faqs = [
    { question: 'Comment se déroule une première consultation ?', answer: 'La première consultation est un entretien confidentiel d\'environ 45 minutes. Nous évaluons votre situation, identifions les enjeux juridiques et vous proposons une stratégie adaptée.' },
    { question: 'Quels sont vos honoraires ?', answer: 'Nos honoraires sont fixés en fonction de la complexité du dossier, de l\'enjeu financier et du temps consacré. Nous établissons toujours une convention d\'honoraires transparente.' },
    { question: 'Intervenez-vous dans d\'autres pays d\'Afrique de l\'Ouest ?', answer: 'Oui, grâce à notre expertise en droit OHADA et notre réseau de partenaires, nous intervenons dans l\'ensemble de l\'espace OHADA.' },
    { question: 'Pouvez-vous m\'assister en cas de litige maritime ?', answer: 'Absolument. Nous disposons d\'une expertise reconnue en droit maritime et intervenons devant les juridictions compétentes.' },
    { question: 'Proposez-vous des consultations en ligne ?', answer: 'Oui, nous proposons des consultations par visioconférence pour les clients ne pouvant se déplacer.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        ref={heroRef}
        style={{ background: 'linear-gradient(135deg, #080f1f 0%, #0c1b33 40%, #152238 100%)' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        <div className="section-container relative z-10">
          <div className={`text-center transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
              <Briefcase className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-medium text-gold-400 tracking-wider uppercase">Nos Expertises</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-4">
              Nos <span className="text-gradient-gold">Services</span> Juridiques
            </h1>
            <div className="gold-divider mx-auto mb-6"></div>
            <p className="text-lg text-cream/50 max-w-2xl mx-auto">
              Des solutions juridiques sur mesure pour accompagner les entreprises 
              et les particuliers dans leurs enjeux les plus stratégiques.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="relative py-24 bg-navy-950 overflow-hidden" ref={servicesRef}>
        <div className="section-container">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={index}
                id={`service-${index}`}
                className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
                  servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Service info side */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/15 to-gold-600/15 flex items-center justify-center border border-gold-500/15">
                      <service.icon className="w-7 h-7 text-gold-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-cream">{service.title}</h2>
                      <p className="text-sm text-gold-400">{service.subtitle}</p>
                    </div>
                  </div>

                  <div className="gold-divider mb-6"></div>

                  <p className="text-cream/60 leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Demander une consultation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Service details card */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <service.accent className="w-5 h-5 text-gold-500/50" />
                      <h3 className="text-sm font-semibold text-cream/70 uppercase tracking-wider">Domaines d'intervention</h3>
                    </div>

                    <ul className="space-y-4">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-cream/60">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 bg-navy-900 overflow-hidden">
        <div className="section-container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-cream mb-4">
              Pourquoi <span className="text-gradient-gold">Nous Choisir</span> ?
            </h2>
            <div className="gold-divider mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Expertise Reconnue', text: 'Plus de 28 ans d\'expérience dans les domaines juridiques les plus complexes.' },
              { icon: Handshake, title: 'Approche Personnalisée', text: 'Chaque dossier est traité avec une attention individuelle et une stratégie sur mesure.' },
              { icon: Globe, title: 'Réseau International', text: 'Des partenariats solides dans tout l\'espace OHADA pour une couverture régionale.' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 text-center group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mx-auto mb-4 border border-gold-500/10 group-hover:bg-gold-500/25 transition-colors">
                  <item.icon className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-base font-heading font-semibold text-cream mb-2">{item.title}</h3>
                <p className="text-sm text-cream/50">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-navy-950 overflow-hidden" ref={faqRef}>
        <div className="section-container max-w-3xl">
          <div className={`text-center mb-12 transition-all duration-700 ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs font-medium text-gold-500 tracking-widest uppercase mb-4 block">FAQ</span>
            <h2 className="text-3xl font-heading font-bold text-cream mb-4">
              Questions <span className="text-gradient-gold">Fréquentes</span>
            </h2>
            <div className="gold-divider mx-auto"></div>
          </div>

          <div className={`glass-card p-6 sm:p-8 transition-all duration-700 delay-200 ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-navy-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />
        <div className="section-container text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-cream mb-4">
            Besoin d'un accompagnement juridique ?
          </h2>
          <p className="text-cream/50 mb-8 max-w-lg mx-auto">
            Contactez-nous pour discuter de votre projet ou de votre situation juridique.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
          >
            Prendre Rendez-vous
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
