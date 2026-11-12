import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Share2 } from "lucide-react";

const FILES = ["invitation.png", "invitation.jpg", "invitation.jpeg", "invitation.webp"];

export default function Reveal({ returning }) {
  const reduce = useReducedMotion();
  const [toast, setToast] = useState("");
  const [fi, setFi] = useState(0);
  const file = FILES[fi];
  const imageUrl = `${import.meta.env.BASE_URL}assets/invitation.jpeg`;
  const note = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const share = async () => {
    const data = {
      title: "JASHN'26 — Freshers' Party",
      text: "I just unlocked my invitation to JASHN'26! 🎉 Get yours:",
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        note("Link copied! Share it with your friends ✨");
      }
    } catch (e) {
      if (e.name !== "AbortError") note(data.url);
    }
  };

  return (
    <div className="h-[100svh] flex flex-col items-center justify-between px-4 py-4 overflow-hidden">
      {!reduce && <motion.div aria-hidden className="pointer-events-none fixed inset-y-0 -left-1/3 w-1/3 z-20"
        style={{ background: "linear-gradient(100deg,transparent,rgba(243,215,138,.35),transparent)" }}
        initial={{ x: "0%" }} animate={{ x: "420%" }} transition={{ duration: 1.8, delay: 0.8, ease: "easeInOut" }} />}
      {returning && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-gold-light text-xs sm:text-sm shrink-0">Looks like you've already unlocked your invitation! 🎉</motion.p>}

      <motion.div className="relative flex-1 min-h-0 w-full flex items-center justify-center py-2"
        initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: reduce ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="relative max-h-full max-w-full flex">
          <motion.div className="absolute -inset-px pointer-events-none" style={{ boxShadow: "0 0 0 1px rgba(212,168,75,.7), 0 0 50px rgba(212,168,75,.3)" }}
            animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} />
         <img src={imageUrl} alt="JASHN'26 Invitation" decoding="async"
            onError={() => setFi((n) => Math.min(n + 1, FILES.length - 1))}
            className="block max-h-full max-w-full w-auto h-auto object-contain" />
        </div>
      </motion.div>

      <motion.div className="shrink-0 w-full flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 3.4, duration: 0.8 }}>
        <div className="flex gap-3 w-full max-w-md justify-center">
          <a href={imageUrl} download={`JASHN26-Invitation.${file.split(".")[1]}`} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Download size={16} /> DOWNLOAD</a>
          <button onClick={share} className="gold-btn !px-3 sm:!px-8 flex-1 sm:flex-none !text-[11px] sm:!text-sm"><Share2 size={16} /> SHARE</button>
        </div>
        <p className="mt-3 text-center text-white/60 text-xs sm:text-sm font-light">Get ready for a day full of music, memories and new beginnings.</p>
        <p className="mt-1 font-display text-xl gold-text">See you at JASHN'26! ✨</p>
      </motion.div>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 border border-gold/50 bg-ink/95 px-5 py-3 text-sm text-gold-light">{toast}</div>}
    </div>
  );
}
