import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Download, MapPin, Share2 } from "lucide-react";

// Uses whichever poster file exists in /assets (png, jpg, jpeg, webp).
const FILES = ["invitation.png", "invitation.jpg", "invitation.jpeg", "invitation.webp"];
const GLOW = ["0 0 0 1px rgba(212,168,75,.5), 0 0 30px rgba(212,168,75,.2)", "0 0 0 1px rgba(212,168,75,.9), 0 0 60px rgba(212,168,75,.4)", "0 0 0 1px rgba(212,168,75,.5), 0 0 30px rgba(212,168,75,.2)"];

export default function Reveal({ guest }) {
  const reduce = useReducedMotion();
  const [toast, setToast] = useState("");
  const [fi, setFi] = useState(0);
  const [missing, setMissing] = useState(false);
  const file = FILES[fi];
  const note = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const share = async () => {
    const data = { title: "JASHN'26 — Freshers' Party", text: "I just unlocked my invitation to JASHN'26! 🎉 Get yours:", url: window.location.href.split(/[?#]/)[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); note("Link copied! Share it with your friends ✨"); }
    } catch (e) { if (e.name !== "AbortError") note(data.url); }
  };

  return (
    <div className="h-[100svh] flex flex-col items-center justify-between px-4 py-4 overflow-hidden">
      {!reduce && <motion.div aria-hidden className="pointer-events-none fixed inset-y-0 -left-1/3 w-1/3 z-20"
        style={{ background: "linear-gradient(100deg,transparent,rgba(243,215,138,.35),transparent)" }}
        initial={{ x: "0%" }} animate={{ x: "420%" }} transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }} />}
      <motion.div className="shrink-0 w-full max-w-md text-center" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.3, duration: 0.8 }}>
        <p className="text-[10px] sm:text-xs tracking-[0.35em] text-gold/80">YOUR INVITATION IS UNLOCKED</p>
        <p className="mt-1 font-display text-2xl sm:text-3xl leading-tight gold-text truncate">{guest.fullName}</p>
        <p className="text-[10px] sm:text-xs tracking-[0.3em] text-white/50">STUDENT ID · {guest.studentId}</p>
      </motion.div>
      <motion.div className="relative flex-1 min-h-0 w-full my-3"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {missing ? (
            <div className="glass w-full max-w-sm max-h-full overflow-hidden flex flex-col items-center text-center px-6 py-8">
              <p className="text-[10px] tracking-[0.3em] text-gold-light/80">YOU'RE INVITED TO</p>
              <h2 className="font-display font-bold gold-text leading-none mt-4 text-6xl">JASHN'26</h2>
              <p className="mt-4 text-[11px] tracking-[0.25em] text-white">FRESHERS' PARTY 2026</p>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-gold/80">DEPT. OF ARTIFICIAL INTELLIGENCE AND DATA SCIENCE</p>
              <div className="mt-6 space-y-2 text-xs tracking-[0.15em] text-white/80">
                <p className="flex items-center justify-center gap-2"><CalendarDays size={14} className="text-gold" /> SAT, 14 NOV 2026</p>
                <p className="flex items-center justify-center gap-2"><Clock size={14} className="text-gold" /> 11:15 AM – 5:00 PM</p>
                <p className="flex items-center justify-center gap-2"><MapPin size={14} className="text-gold" /> MAIN BLOCK SEMINAR HALL</p>
              </div>
            </div>
          ) : (
            <motion.img key={file} src={`${import.meta.env.BASE_URL}assets/${file}`} alt="JASHN'26 Freshers' Party invitation" decoding="async"
              onError={() => (fi < FILES.length - 1 ? setFi(fi + 1) : setMissing(true))}
              animate={reduce ? undefined : { boxShadow: GLOW }} transition={{ duration: 3.5, repeat: Infinity }}
              className="block max-h-full max-w-full w-auto h-auto object-contain" />
          )}
        </div>
      </motion.div>
      <motion.div className="shrink-0 w-full flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 2, duration: 0.8 }}>
        <div className="flex gap-3 w-full max-w-md justify-center">
          {!missing && <a href={`${import.meta.env.BASE_URL}assets/${file}`} download={`JASHN26-Invitation.${file.split(".")[1]}`} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Download size={16} /> DOWNLOAD</a>}
          <button onClick={share} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Share2 size={16} /> SHARE</button>
        </div>
        <p className="mt-3 text-center text-white/60 text-xs sm:text-sm font-light">Get ready for a day full of music, memories and new beginnings.</p>
        <p className="mt-1 font-display text-xl gold-text">See you at JASHN'26! ✨</p>
      </motion.div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 border border-gold/50 bg-ink/95 px-5 py-3 text-sm text-gold-light">{toast}</div>}
    </div>
  );
}