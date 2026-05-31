import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale, GraduationCap, Briefcase, Globe, Award, Users,
  Heart, Shield, Target, BookOpen, ArrowRight, MapPin,
  Anchor, TrendingUp, FileCheck
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

export default function About() {
  const [heroRef, heroInView] = useInView();
  const [bioRef, bioInView] = useInView();
  const [timelineRef, timelineInView] = useInView();
  const [valuesRef, valuesInView] = useInView();

  useEffect(() => {
    document.title = 'À Propos — Cabinet Maître Ndiaye | Avocat au Barreau du Sénégal';
  }, []);

  const timeline = [
    { year: '1992', title: 'Maîtrise en Droit des Affaires', description: 'Diplôme de Maîtrise en Droit des Affaires obtenu à la Faculté de Droit de l\'Université Cheikh Anta Diop de Dakar (UCAD).', icon: GraduationCap },
    { year: '1996', title: 'Inscription au Barreau du Sénégal', description: 'Inscription au Barreau du Sénégal et début de l\'exercice de la profession d\'avocat.', icon: Scale },
    { year: '2000', title: 'Spécialisation Droit Maritime & OHADA', description: 'Développement d\'une expertise reconnue en droit maritime, droit OHADA et droit des investissements.', icon: Anchor },
    { year: '2005', title: 'Institut René Cassin — Strasbourg', description: 'Formation à l\'Institut International des Droits de l\'Homme René Cassin de Strasbourg. Obtention de certificats en Droit International des Droits de l\'Homme, DIH et DPI.', icon: Globe },
    { year: '2010', title: 'Expansion de la Pratique', description: 'Élargissement du cabinet avec une pratique couvrant l\'ensemble de l\'espace OHADA et le droit international.', icon: Briefcase },
    { year: '2024', title: 'Plus de 28 ans au Barreau', description: 'Près de trois décennies d\'expérience au service du droit, de la justice et de la défense des droits fondamentaux.', icon: Award },
  ];

  const values = [
    { icon: Shield, title: 'Intégrité', description: 'Une pratique fondée sur l\'éthique, la transparence et le strict respect du secret professionnel.' },
    { icon: Target, title: 'Excellence', description: 'Un engagement constant vers la qualité, avec une approche rigoureuse et méthodique de chaque dossier.' },
    { icon: Heart, title: 'Droits de l\'Homme', description: 'Un engagement profond pour la défense des droits fondamentaux, nourri par sa formation à l\'Institut René Cassin.' },
    { icon: Users, title: 'Engagement', description: 'Un dévouement total pour la défense des intérêts de ses clients, avec détermination et persévérance.' },
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
              <Scale className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-medium text-gold-400 tracking-wider uppercase">Notre Histoire</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-4">
              À Propos du <span className="text-gradient-gold">Cabinet</span>
            </h1>
            <div className="gold-divider mx-auto mb-6"></div>
            <p className="text-lg text-cream/50 max-w-2xl mx-auto">
              Plus de 28 ans d'engagement au service du droit et de la justice 
              au Sénégal et à l'international.
            </p>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="relative py-24 bg-navy-950 overflow-hidden" ref={bioRef}>
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className={`transition-all duration-700 ${bioInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="relative">
                <div className="glass-card p-4 relative z-10">
                  {/* Photo de Maître Ndiaye */}
                  <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-gold-500/10">
                    <img
                      src="/images/maitre-ndiaye.jpg"
                      alt="Maître Cheikh Ahmadou Ndiaye — Avocat au Barreau du Sénégal"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Fallback si l'image n'est pas disponible
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center">
                            <div class="text-center p-8">
                              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mx-auto mb-4 border-2 border-gold-500/20">
                                <svg class="w-16 h-16 text-gold-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                              </div>
                              <h3 class="text-xl font-semibold text-cream" style="font-family: 'Playfair Display', serif">Me. Cheikh Ahmadou Ndiaye</h3>
                              <p class="text-sm text-gold-400 mt-1">Avocat au Barreau du Sénégal</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-navy-800/50 text-center">
                      <div className="text-xl font-heading font-bold text-gold-400">28+</div>
                      <div className="text-xs text-cream/40">Années</div>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-800/50 text-center">
                      <div className="text-xl font-heading font-bold text-gold-400">1996</div>
                      <div className="text-xs text-cream/40">Barreau</div>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-800/50 text-center">
                      <div className="text-xl font-heading font-bold text-gold-400">UCAD</div>
                      <div className="text-xs text-cream/40">Formation</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 w-20 h-20 rounded-xl bg-gold-500/10 border border-gold-500/10 animate-float pointer-events-none"></div>
              </div>
            </div>

            {/* Bio Content */}
            <div className={`transition-all duration-700 delay-200 ${bioInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <span className="text-xs font-medium text-gold-500 tracking-widest uppercase mb-4 block">Biographie</span>
              <h2 className="text-3xl font-heading font-bold text-cream mb-6">
                Maître Cheikh Ahmadou <span className="text-gradient-gold">Ndiaye</span>
              </h2>
              <div className="gold-divider mb-8"></div>

              <div className="space-y-5 text-cream/60 leading-relaxed">
                <p>
                  Maître Cheikh Ahmadou Ndiaye est avocat au <strong className="text-cream/80">Barreau du Sénégal</strong> depuis 
                  son inscription en <strong className="text-cream/80">1996</strong>. Fort de plus de 28 années d'exercice, il s'est imposé 
                  comme une référence dans le paysage juridique sénégalais et ouest-africain.
                </p>
                <p>
                  Diplômé de la <strong className="text-cream/80">Faculté de Droit de l'Université Cheikh Anta Diop de Dakar</strong> (UCAD), 
                  où il a obtenu une Maîtrise en Droit des Affaires, Maître Ndiaye a développé au fil 
                  des années une expertise pointue dans des domaines juridiques stratégiques : le 
                  <strong className="text-cream/80"> droit maritime</strong>, le <strong className="text-cream/80">droit OHADA</strong> et le 
                  <strong className="text-cream/80"> droit des investissements</strong>.
                </p>
                <p>
                  Animé par un profond engagement pour les droits fondamentaux, il a également fréquenté 
                  l'<strong className="text-cream/80">Institut International des Droits de l'Homme René Cassin de Strasbourg</strong>, 
                  où il a obtenu plusieurs certificats en <strong className="text-cream/80">Droit International des Droits de l'Homme</strong>, 
                  <strong className="text-cream/80"> Droit International Humanitaire (DIH)</strong> et 
                  <strong className="text-cream/80"> Droit Pénal International (DPI)</strong>.
                </p>
                <p>
                  Cette double compétence — droit des affaires et droits de l'Homme — confère à 
                  Maître Ndiaye une vision unique et humaniste de la pratique juridique, au service 
                  de ses clients et de la justice.
                </p>
              </div>

              {/* Expertise badges */}
              <div className="flex flex-wrap gap-2 mt-8">
                {['Droit Maritime', 'Droit OHADA', 'Droit des Investissements', 'Droits de l\'Homme', 'DIH', 'DPI'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/15 text-xs text-gold-400 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-8">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="text-sm text-cream/40">Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-24 bg-navy-900 overflow-hidden" ref={timelineRef}>
        <div className="section-container relative z-10">
          <div className={`text-center mb-16 transition-all duration-700 ${timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs font-medium text-gold-500 tracking-widest uppercase mb-4 block">Parcours</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
              Notre <span className="text-gradient-gold">Parcours</span>
            </h2>
            <div className="gold-divider mx-auto"></div>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
              style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), rgba(201,168,76,0.1), transparent)' }}
            />

            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-start gap-6 mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } transition-all duration-700 ${timelineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gold-500 border-4 border-navy-900 -translate-x-1/2 z-10 shadow-lg shadow-gold-500/20"></div>

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/15 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-sm font-semibold text-gold-400">{item.year}</span>
                    </div>
                    <h3 className="text-base font-heading font-semibold text-cream mb-2">{item.title}</h3>
                    <p className="text-sm text-cream/50">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 bg-navy-950 overflow-hidden" ref={valuesRef}>
        <div className="section-container">
          <div className={`text-center mb-16 transition-all duration-700 ${valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-xs font-medium text-gold-500 tracking-widest uppercase mb-4 block">Nos Valeurs</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
              Ce Qui Nous <span className="text-gradient-gold">Définit</span>
            </h2>
            <div className="gold-divider mx-auto mb-6"></div>
            <p className="text-cream/50 max-w-2xl mx-auto">
              Des valeurs fondamentales qui guident notre pratique quotidienne 
              et notre engagement envers chaque client.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`glass-card p-6 text-center group transition-all duration-700 ${
                  valuesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/15 to-gold-600/15 flex items-center justify-center mx-auto mb-5 group-hover:from-gold-500/25 group-hover:to-gold-600/25 transition-all duration-300 border border-gold-500/10">
                  <value.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-cream mb-3">{value.title}</h3>
                <p className="text-sm text-cream/50 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-navy-900 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        <div className="section-container relative z-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-cream mb-4">
            Prêt à travailler avec nous ?
          </h2>
          <p className="text-cream/50 mb-8 max-w-lg mx-auto">
            Discutons de votre situation juridique lors d'une consultation confidentielle.
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
