import { useState, useEffect, useRef } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  CheckCircle, AlertCircle, Upload, X, FileText
} from 'lucide-react';
import { contactsAPI, documentsAPI } from '../services/api';

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

export default function Contact() {
  const [formRef, formInView] = useInView();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
    rdv_date: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact — Cabinet Maître Ndiaye | Nous Contacter';
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.type === 'error') setStatus({ type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'Le fichier ne doit pas dépasser 10 MB.' });
        return;
      }
      setFile(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (formData.sujet === 'Demande de rendez-vous') {
      if (!formData.rdv_date) {
        setStatus({ type: 'error', message: 'Veuillez choisir une date pour votre rendez-vous.' });
        setLoading(false);
        return;
      }
      const selectedDate = new Date(formData.rdv_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setStatus({ type: 'error', message: 'La date choisie doit être dans le futur.' });
        setLoading(false);
        return;
      }
    }

    try {
      const result = await contactsAPI.send(formData);

      if (file && result.id) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        fileFormData.append('message_id', result.id);
        try {
          await documentsAPI.uploadPublic(fileFormData);
        } catch (uploadErr) {
          console.warn('File upload failed, but message was sent:', uploadErr);
        }
      }

      setStatus({
        type: 'success',
        message: result.message || 'Votre message a été envoyé avec succès !'
      });
      setFormData({ nom: '', email: '', telephone: '', sujet: '', message: '', rdv_date: '' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Téléphone', value: '+221 77 630 37 03', href: 'tel:+221776303703', description: 'Du lundi au vendredi, 8h — 18h' },
    { icon: Mail, title: 'Email', value: 'contact@cabinet-ndiaye.sn', href: 'mailto:contact@cabinet-ndiaye.sn', description: 'Réponse sous 24-48h' },
    { icon: MapPin, title: 'Adresse', value: "13 bis place de l'indépendance", href: 'https://maps.google.com/?q=13+bis+place+de+l+independance+Dakar+Senegal', description: 'Dakar, Sénégal' },
    { icon: Clock, title: 'Horaires', value: 'Lun — Ven : 8h — 18h', href: null, description: 'Sam : 9h — 13h (sur RDV)' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative py-32 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #080f1f 0%, #0c1b33 40%, #152238 100%)' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }} />

        <div className="section-container relative z-10">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-medium text-gold-400 tracking-wider uppercase">Nous Contacter</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-4">
              Prenez <span className="text-gradient-gold">Contact</span>
            </h1>
            <div className="gold-divider mx-auto mb-6"></div>
            <p className="text-lg text-cream/50 max-w-2xl mx-auto">
              Nous sommes à votre écoute. Contactez-nous pour une consultation 
              confidentielle ou pour toute question juridique.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-16 bg-navy-950 overflow-hidden">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => {
              const Wrapper = info.href ? 'a' : 'div';
              const wrapperProps = info.href
                ? { href: info.href, target: info.href.startsWith('http') ? '_blank' : undefined, rel: info.href.startsWith('http') ? 'noopener noreferrer' : undefined }
                : {};

              return (
                <Wrapper
                  key={index}
                  {...wrapperProps}
                  className="glass-card p-5 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0 group-hover:bg-gold-500/25 transition-colors border border-gold-500/10">
                      <info.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-cream mb-1">{info.title}</h3>
                      <p className="text-sm text-gold-400 group-hover:text-gold-300 transition-colors">{info.value}</p>
                      <p className="text-xs text-cream/40 mt-1">{info.description}</p>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="relative py-24 bg-navy-900 overflow-hidden" ref={formRef}>
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form — 3 columns */}
            <div className={`lg:col-span-3 transition-all duration-700 ${formInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h2 className="text-2xl font-heading font-bold text-cream mb-2">
                Envoyez-nous un <span className="text-gradient-gold">Message</span>
              </h2>
              <p className="text-sm text-cream/50 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              {/* Status Messages */}
              {status.type && (
                <div className={`flex items-start gap-3 p-4 rounded-xl mb-6 ${
                  status.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {status.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${status.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                    {status.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-nom" className="block text-sm text-cream/60 mb-2">
                      Nom complet <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-nom"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-cream/60 mb-2">
                      Email <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-telephone" className="block text-sm text-cream/60 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      id="contact-telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+221 77 000 00 00"
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-sujet" className="block text-sm text-cream/60 mb-2">Sujet</label>
                    <select
                      id="contact-sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                    >
                      <option value="" style={{ background: '#152238' }}>Choisir un sujet</option>
                      <option value="Demande de rendez-vous" style={{ background: '#152238' }}>Demande de rendez-vous</option>
                      <option value="Droit des affaires" style={{ background: '#152238' }}>Droit des Affaires</option>
                      <option value="Droit OHADA" style={{ background: '#152238' }}>Droit OHADA</option>
                      <option value="Droit maritime" style={{ background: '#152238' }}>Droit Maritime</option>
                      <option value="Droit des investissements" style={{ background: '#152238' }}>Droit des Investissements</option>
                      <option value="Consultation générale" style={{ background: '#152238' }}>Consultation Générale</option>
                      <option value="Autre" style={{ background: '#152238' }}>Autre</option>
                    </select>
                  </div>
                </div>

                {formData.sujet === 'Demande de rendez-vous' && (
                  <div className="animate-fade-in-up">
                    <label htmlFor="contact-rdv-date" className="block text-sm text-cream/60 mb-2">
                      Date de rendez-vous souhaitée <span className="text-gold-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="contact-rdv-date"
                      name="rdv_date"
                      required
                      value={formData.rdv_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="contact-message" className="block text-sm text-cream/60 mb-2">
                    Message <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre situation ou votre demande..."
                    className="w-full px-4 py-3 rounded-xl bg-navy-800/50 border border-navy-600/30 text-cream placeholder-cream/30 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all text-sm outline-none resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm text-cream/60 mb-2">
                    Joindre un document <span className="text-cream/30">(optionnel, max 10 MB)</span>
                  </label>
                  
                  {file ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-800/50 border border-gold-500/20">
                      <FileText className="w-4 h-4 text-gold-400" />
                      <span className="text-sm text-cream/70 flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-cream/40">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button type="button" onClick={removeFile} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="contact-file"
                      className="flex items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-navy-600/30 hover:border-gold-500/30 bg-navy-800/20 hover:bg-navy-800/40 transition-all cursor-pointer group"
                    >
                      <Upload className="w-5 h-5 text-cream/30 group-hover:text-gold-400 transition-colors" />
                      <span className="text-sm text-cream/40 group-hover:text-cream/60 transition-colors">
                        Cliquez pour joindre un fichier (PDF, DOC, JPG, PNG)
                      </span>
                      <input
                        type="file"
                        id="contact-file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  id="contact-submit-btn"
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map + Quick Contact — 2 columns */}
            <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-200 ${formInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {/* Google Maps */}
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-gold-500/10">
                  <h3 className="text-sm font-semibold text-cream flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    Notre Localisation
                  </h3>
                </div>
                <div className="aspect-[4/3]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.8885!2d-17.4299!3d14.6685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172e2cfc23e85%3A0xb6cfb0811e5f8f!2sPlace%20de%20l&#39;Ind%C3%A9pendance%2C%20Dakar!5e0!3m2!1sfr!2ssn!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Cabinet Maître Ndiaye"
                  ></iframe>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center border border-green-500/15">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-cream">WhatsApp</h3>
                    <p className="text-xs text-cream/40">Réponse rapide garantie</p>
                  </div>
                </div>
                <p className="text-sm text-cream/50 mb-4">
                  Pour une réponse immédiate, contactez-nous directement via WhatsApp.
                </p>
                <a
                  href="https://wa.me/221776303703?text=Bonjour%20Ma%C3%AEtre%20Ndiaye%2C%20je%20souhaite%20prendre%20rendez-vous."
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-btn"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 hover:border-green-500/50 transition-all text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ouvrir WhatsApp
                </a>
              </div>

              {/* Office Hours Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center border border-gold-500/10">
                    <Clock className="w-5 h-5 text-gold-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-cream">Heures d'ouverture</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { day: 'Lundi — Vendredi', hours: '08:00 — 18:00' },
                    { day: 'Samedi', hours: '09:00 — 13:00 (sur RDV)' },
                    { day: 'Dimanche', hours: 'Fermé' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-cream/50">{item.day}</span>
                      <span className={`text-cream/70 ${item.hours === 'Fermé' ? 'text-red-400/60' : ''}`}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
