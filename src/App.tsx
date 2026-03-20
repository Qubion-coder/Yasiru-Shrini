/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, Heart, Volume2, VolumeX, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const WEDDING_DATE = new Date("2026-05-28T18:30:00");
const GOOGLE_SCRIPT_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SCRIPT_WEB_APP_URL ?? "";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isMuted, setIsMuted] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({
    fullName: "",
    guests: "1 Guest (Just Me)",
    dietaryNotes: ""
  });
  const [wishForm, setWishForm] = useState({
    name: "",
    message: ""
  });
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [wishStatus, setWishStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const submitToGoogleSheets = async (payload: Record<string, string>) => {
    const body = new URLSearchParams(payload);

    await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body
    });
  };

  const handleRsvpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rsvpForm.fullName.trim()) {
      setRsvpStatus("error");
      return;
    }

    if (!GOOGLE_SCRIPT_WEB_APP_URL.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheets({
        formType: "rsvp",
        fullName: rsvpForm.fullName,
        guests: rsvpForm.guests,
        dietaryNotes: rsvpForm.dietaryNotes
      });

      setRsvpStatus("success");
      setRsvpForm({
        fullName: "",
        guests: "1 Guest (Just Me)",
        dietaryNotes: ""
      });
    } catch {
      setRsvpStatus("error");
    }
  };

  const handleWishSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wishForm.name.trim() || !wishForm.message.trim()) {
      setWishStatus("error");
      return;
    }

    if (!GOOGLE_SCRIPT_WEB_APP_URL.trim()) {
      setWishStatus("error");
      return;
    }

    setWishStatus("sending");

    try {
      await submitToGoogleSheets({
        formType: "wish",
        name: wishForm.name,
        message: wishForm.message
      });

      setWishStatus("success");
      setWishForm({ name: "", message: "" });
    } catch {
      setWishStatus("error");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    setTimeout(() => {
      setShowWebsite(true);
    }, 2500); // Delay to show the card before loading site
  };

  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  function calculateTimeLeft() {
    const difference = +WEDDING_DATE - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.muted = isMuted;

    if (showWebsite && !isMuted) {
      void audio.play().catch(() => {
        // Playback can fail until a user interaction occurs.
      });
    }

    if (isMuted) {
      audio.pause();
    }
  }, [isMuted, showWebsite]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="heart-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.22),transparent_38%),radial-gradient(circle_at_80%_75%,rgba(184,134,11,0.18),transparent_40%),linear-gradient(140deg,#fdf9f2_0%,#f5edde_50%,#f1e6d4_100%)]" />

          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`loader-spark-${i}`}
              initial={{ opacity: 0.2, y: 30 }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                y: [0, -26, 0],
                x: [0, i % 2 === 0 ? 8 : -8, 0]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold/40"
              style={{
                left: `${12 + i * 8}%`,
                top: `${20 + (i % 5) * 12}%`
              }}
            />
          ))}

          <div className="relative flex items-center justify-center z-10">
            {/* Outer Halo */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.25, 0.5, 0.25]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[340px] h-[340px] md:w-[520px] md:h-[520px] rounded-full border border-gold/20"
            />

            {/* Pulsing Heart Frame */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full text-gold/20 fill-current">
                <path d="M100 180c-20-20-80-70-80-110 0-30 20-50 50-50 15 0 25 10 30 15 5-5 15-15 30-15 30 0 50 20 50 50 0 40-60 90-80 110z" />
              </svg>
            </motion.div>

            {/* Main Heart Frame */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] flex flex-col items-center justify-center"
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-gold fill-none stroke-current stroke-[0.6] drop-shadow-[0_0_14px_rgba(212,175,55,0.35)]">
                <path d="M100 180c-20-20-80-70-80-110 0-30 20-50 50-50 15 0 25 10 30 15 5-5 15-15 30-15 30 0 50 20 50 50 0 40-60 90-80 110z" />
              </svg>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-center z-10"
              >
                <span className="text-[10px] uppercase tracking-[0.45em] text-gold-dark/70 font-semibold block mb-4">Together Forever</span>
                <h1 className="text-5xl md:text-7xl font-display text-ink mb-2 leading-none">Viraj</h1>
                <span className="text-3xl md:text-4xl font-serif italic text-gold block mb-2">&</span>
                <h1 className="text-5xl md:text-7xl font-display text-ink leading-none">Sandu</h1>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-12 text-center z-10"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-gold"
                />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 mt-4">Crafting your invitation experience</p>
          </motion.div>
        </motion.div>
      ) : !showWebsite ? (
        <motion.div
          key="envelope-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] envelope-stage flex items-center justify-center p-4 overflow-hidden"
        >
          <div className="envelope-ornament envelope-ornament-left" />
          <div className="envelope-ornament envelope-ornament-right" />

          <div className="envelope-wrapper w-full max-w-[600px]">
            <div className="envelope-heading text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.45em] text-gold-dark/70 font-semibold">Wedding Invitation</span>
              <h2 className="text-4xl md:text-5xl font-display mt-3 mb-2">A Sealed Letter of Love</h2>
              <p className="text-stone-500 font-serif italic text-lg">Open the wax seal to reveal your exclusive invitation.</p>
            </div>

            <div className={`envelope ${isEnvelopeOpened ? 'open' : ''}`}>
              <div className="envelope-flap" />
              <div className="envelope-glow" />

              <div className="envelope-card">
                <Sparkles className="text-gold mb-4" size={26} />
                <h2 className="text-3xl font-display mb-4">You Are Gracefully Invited</h2>
                <p className="text-stone-500 font-serif italic text-lg mb-6">
                  To witness and bless the union of <br />
                  <span className="text-gold-dark font-bold not-italic tracking-wide">Viraj & Sandu</span>
                </p>
                <div className="h-px w-12 bg-gold/30 mb-6" />
                <p className="text-stone-400 text-[10px] uppercase tracking-[0.3em]">A private invitation awaits inside</p>
              </div>

              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                className="gold-seal"
                onClick={handleOpenEnvelope}
              >
                <Heart size={24} fill="white" />
              </motion.div>
            </div>
            
            {!isEnvelopeOpened && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-10"
              >
                <p className="text-stone-500 font-serif italic text-xl animate-pulse">
                  Tap the wax seal to open
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="main-website"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative min-h-screen bg-ivory text-ink selection:bg-gold/20 selection:text-gold-dark overflow-x-hidden font-sans"
        >
          <audio
            ref={audioRef}
            src="/paulyudin-wedding-485932.mp3"
            loop
            preload="auto"
          />

          {/* Scroll Progress Rail */}
          <motion.div 
            style={{ scaleY: scrollYProgress }}
            className="fixed left-0 top-0 bottom-0 w-1 bg-gold origin-top z-50 hidden md:block"
          />

          {/* Floating Audio Control (Visual) */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-gold-dark hover:scale-110 transition-transform"
          >
            {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Hero Section: Split Editorial Layout */}
          <section className="relative h-screen flex flex-col md:flex-row overflow-hidden border-b border-gold/10">
            {/* Left Pane: Image */}
            <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
              <motion.div 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000" 
                  alt="Wedding Background" 
                  className="w-full h-full object-cover grayscale-[0.2] brightness-90"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
              
              {/* Vertical Rail Text */}
              <div className="absolute left-8 bottom-12 hidden md:block">
                <span className="vertical-text text-[10px] uppercase tracking-[0.8em] text-white/60 font-medium">
                  EST. MAY TWENTY EIGHTH • TWO THOUSAND TWENTY SIX
                </span>
              </div>
            </div>

            {/* Right Pane: Content */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-ivory-dark flex flex-col justify-center px-8 md:px-20 relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1.2 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px w-12 bg-gold" />
                  <span className="text-gold-dark uppercase tracking-[0.4em] text-[10px] font-semibold">
                    The Union of Two Souls
                  </span>
                </div>
                
                <h1 className="text-7xl md:text-[120px] leading-[0.85] mb-12 font-display">
                  Viraj <br />
                  <span className="italic text-gold-dark ml-8 md:ml-16">&</span> Sandu
                </h1>

                <div className="flex flex-col gap-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-serif italic text-gold">28</span>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-widest font-bold">May</span>
                      <span className="text-xs uppercase tracking-widest text-stone-400">2026</span>
                    </div>
                  </div>
                  <p className="text-stone-500 font-serif italic text-xl max-w-sm">
                    Join us as we celebrate a love that was written in the stars.
                  </p>
                </div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div 
                style={{ opacity }}
                className="absolute bottom-12 right-12 flex flex-col items-center gap-4"
              >
                <span className="vertical-text text-[9px] uppercase tracking-[0.4em] text-stone-400">Scroll</span>
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-px h-12 bg-gold/30"
                />
              </motion.div>
            </div>
          </section>

          {/* Countdown: Minimalist Data Grid */}
          <section className="py-32 bg-white relative">
            <div className="max-w-6xl mx-auto px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 border border-gold/20">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <div key={unit} className={`p-12 flex flex-col items-center justify-center ${index !== 3 ? 'border-r border-gold/20' : ''} ${index < 2 ? 'border-b md:border-b-0 border-gold/20' : ''}`}>
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-6xl md:text-8xl font-display text-ink mb-4"
                    >
                      {value.toString().padStart(2, '0')}
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-gold-dark font-bold">{unit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <p className="text-stone-400 uppercase tracking-[0.3em] text-[10px]">Countdown to our forever</p>
              </div>
            </div>
          </section>

          {/* Invitation: Prestige Layout */}
          <section className="py-40 bg-ivory-dark relative overflow-hidden">
            {/* Decorative Oversized Number */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <span className="text-[400px] font-display leading-none">05</span>
            </div>

            <div className="max-w-4xl mx-auto px-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-24 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-5xl md:text-7xl mb-12 font-display leading-tight">
                    The <br />
                    <span className="italic text-gold">Invitation</span>
                  </h2>
                  <div className="space-y-8 text-stone-600 font-serif text-xl italic leading-relaxed">
                    <p>
                      "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
                    </p>
                    <p>
                      We request the honor of your presence as we exchange our vows and begin our new life together.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative aspect-[4/5] rounded-t-full border-t border-x border-gold/30 p-4"
                >
                  <div className="w-full h-full rounded-t-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000" 
                      alt="Invitation Detail" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gold flex items-center justify-center text-white p-4 text-center shadow-2xl rotate-12">
                    <span className="text-[10px] uppercase tracking-widest font-bold">You are Invited</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Details: Hardware/Tool Style Grid */}
          <section className="py-40 bg-ink text-ivory">
            <div className="max-w-6xl mx-auto px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                <div>
                  <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block">The Itinerary</span>
                  <h2 className="text-5xl md:text-7xl font-display">Event Details</h2>
                </div>
                <div className="h-px flex-1 bg-gold/20 mx-8 hidden md:block" />
                <div className="text-right">
                  <span className="text-stone-400 font-serif italic text-xl">Monarch Imperial</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-px bg-gold/20 border border-gold/20">
                {[
                  { icon: <Calendar size={24} />, title: "The Date", detail: "Thursday, May 28", sub: "2026" },
                  { icon: <Clock size={24} />, title: "The Time", detail: "06:30 PM", sub: "Arrival & Cocktails" },
                  { icon: <MapPin size={24} />, title: "The Venue", detail: "Monarch Imperial", sub: "Sri Jayawardenepura Kotte" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                    className="bg-ink p-16 flex flex-col items-center text-center group transition-colors"
                  >
                    <div className="text-gold mb-8 group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 font-bold">{item.title}</h3>
                    <p className="text-3xl font-display mb-2">{item.detail}</p>
                    <p className="text-stone-500 font-serif italic">{item.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Venue Location */}
          <section className="py-32 bg-ivory border-t border-gold/10">
            <div className="max-w-6xl mx-auto px-8">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-3xl overflow-hidden border border-gold/20 shadow-2xl"
                >
                  <img
                    src="/1.jpg"
                    alt="Venue Location"
                    className="w-full h-[360px] md:h-[460px] object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gold/20 rounded-3xl p-8 md:p-12"
                >
                  <span className="text-gold-dark uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Venue Location</span>
                  <h2 className="text-4xl md:text-5xl font-display mb-6">Monarch Imperial</h2>
                  <p className="text-stone-500 font-serif italic text-xl mb-8">Sri Jayawardenepura Kotte, Sri Lanka</p>
                  <div className="space-y-3 text-stone-500 text-sm uppercase tracking-[0.2em]">
                    <p>Thursday, May 28, 2026</p>
                    <p>06:30 PM Onwards</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Monarch+Imperial+Sri+Jayawardenepura+Kotte"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-ink text-ivory rounded-full text-[10px] uppercase tracking-[0.35em] font-bold hover:bg-gold transition-colors"
                  >
                    <MapPin size={16} />
                    Connect Live Location
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* RSVP: Minimal Luxury */}
          <section className="py-40 bg-white border-t border-gold/10">
            <div className="max-w-2xl mx-auto px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Sparkles className="text-gold mx-auto mb-8" size={32} />
                <h2 className="text-5xl md:text-6xl font-display mb-6">Will You Join Us?</h2>
                <p className="text-stone-400 font-serif italic text-xl mb-16">
                  Kindly respond by the thirtieth of April
                </p>
                
                <form className="space-y-10 text-left" onSubmit={handleRsvpSubmit}>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-400 block mb-3">Full Name</label>
                    <input
                      type="text"
                      placeholder="John & Jane Doe"
                      value={rsvpForm.fullName}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, fullName: e.target.value }));
                      }}
                      className="w-full bg-transparent border border-stone-200 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all font-serif italic text-xl placeholder:text-stone-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-400 block mb-3">Guests</label>
                    <select
                      value={rsvpForm.guests}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, guests: e.target.value }));
                      }}
                      className="w-full bg-transparent border border-stone-200 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all text-stone-500"
                    >
                      <option>1 Guest (Just Me)</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-400 block mb-3">Dietary Notes</label>
                    <textarea
                      rows={4}
                      placeholder="Allergies, Vegan, etc."
                      value={rsvpForm.dietaryNotes}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, dietaryNotes: e.target.value }));
                      }}
                      className="w-full bg-transparent border border-stone-200 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all text-stone-500 resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={rsvpStatus === "sending"}
                    className="w-full px-8 py-5 bg-ink text-ivory rounded-full text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl hover:bg-gold transition-all duration-500"
                  >
                    {rsvpStatus === "sending" ? "Sending RSVP..." : "Send RSVP"}
                  </motion.button>

                  {rsvpStatus === "success" && (
                    <p className="text-sm text-green-700 text-center">RSVP sent successfully.</p>
                  )}
                  {rsvpStatus === "error" && (
                    <p className="text-sm text-red-600 text-center">Please add your full name and ensure VITE_GOOGLE_SCRIPT_WEB_APP_URL is set in .env.</p>
                  )}
                </form>
              </motion.div>
            </div>
          </section>

          {/* Blessings & Wishes */}
          <section className="py-36 bg-ivory-dark border-t border-gold/10">
            <div className="max-w-4xl mx-auto px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
              >
                <Heart className="text-gold mx-auto mb-6" size={28} />
                <h2 className="text-5xl md:text-6xl font-display mb-4">Blessings & Wishes</h2>
                <p className="text-stone-500 font-serif italic text-xl">Share your love and warm words for our new journey.</p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleWishSubmit}
                className="bg-white border border-gold/20 rounded-3xl p-8 md:p-10 space-y-6"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={wishForm.name}
                  onChange={(e) => {
                    setWishStatus("idle");
                    setWishForm((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  className="w-full bg-transparent border border-stone-200 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all"
                />
                <textarea
                  rows={5}
                  placeholder="Write your blessing or wish..."
                  value={wishForm.message}
                  onChange={(e) => {
                    setWishStatus("idle");
                    setWishForm((prev) => ({ ...prev, message: e.target.value }));
                  }}
                  className="w-full bg-transparent border border-stone-200 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={wishStatus === "sending"}
                  className="px-10 py-4 bg-gold text-white rounded-full text-[10px] uppercase tracking-[0.35em] font-bold hover:bg-gold-dark transition-colors"
                >
                  {wishStatus === "sending" ? "Sending Wish..." : "Send Blessing"}
                </button>

                {wishStatus === "success" && (
                  <p className="text-sm text-green-700">Wish sent successfully.</p>
                )}
                {wishStatus === "error" && (
                  <p className="text-sm text-red-600">Please fill your name and message, and ensure VITE_GOOGLE_SCRIPT_WEB_APP_URL is set in .env.</p>
                )}
              </motion.form>
            </div>
          </section>

          {/* Footer: Minimalist Branding */}
          <footer className="py-24 bg-ivory-dark text-center">
            <div className="max-w-4xl mx-auto px-8">
              <div className="h-px w-full bg-gold/10 mb-16" />
              <h2 className="text-4xl font-display mb-4">V <span className="text-gold italic">&</span> S</h2>
              <p className="text-[9px] uppercase tracking-[0.6em] text-stone-400 mb-12">Viraj & Sandu • 2026</p>
              <div className="flex justify-center gap-8 text-gold/40">
                <Heart size={16} />
                <Sparkles size={16} />
                <Heart size={16} />
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


