import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const rise = (d) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] } });

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col px-5 sm:px-10">
      <header className="flex items-center justify-between py-5">
        <img src="/assets/rit-logo.png" alt="Rajeev Institute of Technology" className="h-10 sm:h-12 w-auto" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
        <span className="text-[10px] sm:text-xs tracking-[0.3em] text-gold-light/80">FRESHERS' PARTY 2026</span>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center pb-16">
        <motion.p {...rise(0.2)} className="text-[11px] sm:text-sm tracking-[0.35em] text-white/90">RAJEEV INSTITUTE OF TECHNOLOGY</motion.p>
        <motion.p {...rise(0.35)} className="mt-3 text-[10px] sm:text-xs tracking-[0.3em] text-gold/80 max-w-xs sm:max-w-none">DEPARTMENT OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE</motion.p>
        <motion.h1 initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.4, delay: 0.5 }}
          className="font-display font-bold gold-text leading-none mt-8 text-[clamp(4rem,19vw,10rem)]">JASHN'26</motion.h1>
        <motion.div {...rise(1)} className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <motion.p {...rise(1.1)} className="mt-6 text-xs sm:text-base tracking-[0.25em] text-white">A NEW BEGINNING, A BIGGER FAMILY.</motion.p>
        <motion.p {...rise(1.25)} className="mt-4 text-sm sm:text-lg text-white/60 font-light max-w-md">Your invitation to an unforgettable celebration awaits.</motion.p>
        <motion.div {...rise(1.5)} className="mt-10">
          <button onClick={onStart} className="gold-btn group">GET YOUR INVITATION <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
        </motion.div>
        <motion.p {...rise(1.7)} className="mt-8 text-[11px] sm:text-xs tracking-[0.2em] text-white/40">SAT, 14 NOV 2026 · 11:15 AM – 5:00 PM · MAIN BLOCK SEMINAR HALL</motion.p>
      </section>
    </div>
  );
}
