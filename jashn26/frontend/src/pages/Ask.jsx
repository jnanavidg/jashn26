import { motion } from "framer-motion";
import Clip, { clipSrc } from "../components/Clip.jsx";

export default function Ask({ guest, onYes, onNo }) {
  const first = guest.fullName.split(" ")[0];
  return (
    <div className="h-[100svh] flex flex-col items-center justify-between px-4 py-5 overflow-hidden">
      <motion.div className="shrink-0 text-center max-w-xl" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
        <p className="text-[10px] sm:text-xs tracking-[0.35em] text-gold/80 truncate">PSST, {first.toUpperCase()}…</p>
        <h2 className="mt-2 font-display text-3xl sm:text-5xl font-semibold gold-text leading-tight">Are you coming to the Freshers' Party?</h2>
        <p className="mt-2 text-white/60 text-xs sm:text-sm font-light">Be honest… this little fluffball is waiting for your answer 🐾</p>
      </motion.div>
      <div className="relative flex-1 min-h-0 w-full my-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <Clip name="asking" loop className="block max-h-full max-w-full w-auto h-auto object-contain ring-1 ring-gold/50 shadow-[0_0_50px_rgba(212,168,75,.25)]" />
        </div>
      </div>
      <motion.div className="shrink-0 flex gap-3 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
        <button onClick={onYes} className="gold-btn flex-1 !px-3 !bg-gold/15">YES, I'M COMING! 🎉</button>
        <button onClick={onNo} className="gold-btn flex-1 !px-3 !border-white/20 !text-white/60">NO</button>
      </motion.div>
      <video src={clipSrc("welcome")} preload="auto" muted className="hidden" />
      <video src={clipSrc("angry")} preload="auto" muted className="hidden" />
    </div>
  );
}