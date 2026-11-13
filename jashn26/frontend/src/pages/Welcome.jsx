import { motion } from "framer-motion";
import Clip from "../components/Clip.jsx";

export default function Welcome({ guest, onDone }) {
  const first = guest.fullName.split(" ")[0];
  return (
    <div className="h-[100svh] flex flex-col items-center justify-between px-4 py-5 overflow-hidden">
      <motion.div className="shrink-0 text-center max-w-xl" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold gold-text leading-tight">Welcome, {first}! 🎉</h2>
        <p className="mt-2 text-white/70 text-sm sm:text-base font-light">We're so happy you're joining us at JASHN'26. Here comes your invitation!</p>
      </motion.div>
      <div className="relative flex-1 min-h-0 w-full my-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Clip name="welcome" onEnded={() => setTimeout(onDone, 800)} className="block max-h-full max-w-full w-auto h-auto object-contain ring-1 ring-gold/50 shadow-[0_0_50px_rgba(212,168,75,.25)]" />
        </div>
      </div>
      <button onClick={onDone} className="shrink-0 min-h-[44px] px-4 text-[11px] tracking-[0.3em] text-white/40 hover:text-gold-light transition-colors">SKIP</button>
    </div>
  );
}