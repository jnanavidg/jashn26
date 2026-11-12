import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { key: "fullName", title: "Hey Junior! 👋", sub: "What should we call you?", label: "Full Name", type: "text", ph: "Your full name", auto: "name", cta: "CONTINUE" },
  { key: "email", title: "Let's stay connected! ✨", sub: "", label: "Email Address", type: "email", ph: "you@example.com", auto: "email", cta: "CONTINUE" },
  { key: "studentId", title: "One last thing! 🎓", sub: "What's your Student ID?", label: "Student ID", type: "text", ph: "e.g. 42", auto: "off", cta: "UNLOCK MY INVITATION" },
];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(key, v) {
  v = v.trim();
  if (!v) return "Oops, this one can't be empty!";
  if (key === "fullName" && v.length < 2) return "Please enter your full name.";
  if (key === "email" && !EMAIL_RE.test(v)) return "Hmm, that email doesn't look right.";
  if (key === "studentId" && !/^\d{2,4}$/.test(v)) return "Student ID should be a 2 to 4 digit number.";
  return "";
}

export default function Register({ onDone }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [vals, setVals] = useState({ fullName: "", email: "", studentId: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef(null);
  const s = STEPS[i];
  useEffect(() => { const t = setTimeout(() => input.current?.focus(), 450); return () => clearTimeout(t); }, [i]);

  const go = async (e) => {
    e.preventDefault();
    const m = validate(s.key, vals[s.key]);
    if (m) return setErr(m);
    setErr("");
    if (i < 2) { setDir(1); return setI(i + 1); }
    setBusy(true);
    try {
      const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(vals) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error || "Something went wrong. Please try again."); setBusy(false); return; }
      onDone(d.status === "existing");
    } catch { setErr("Couldn't reach the server. Check your connection and retry."); setBusy(false); }
  };
  const back = () => { setErr(""); setDir(-1); setI(i - 1); };

  return (
    <div className="min-h-screen flex flex-col px-6 sm:px-10 py-6">
      <div className="flex items-center justify-between h-10">
        {i > 0 ? <button onClick={back} className="flex items-center gap-2 text-gold-light/80 text-xs tracking-[0.2em] min-h-[44px]"><ArrowLeft size={16} /> BACK</button> : <span />}
        <span className="text-sm tracking-[0.3em] text-gold-light/80">0{i + 1}<span className="text-white/30"> / 03</span></span>
      </div>
      <div className="h-px bg-white/10 mt-3"><motion.div className="h-px bg-gold" animate={{ width: `${((i + 1) / 3) * 100}%` }} transition={{ duration: 0.6 }} /></div>
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.form key={i} custom={dir} onSubmit={go} noValidate className="w-full max-w-lg"
            variants={{ enter: (d) => ({ opacity: 0, x: 60 * d }), center: { opacity: 1, x: 0 }, exit: (d) => ({ opacity: 0, x: -60 * d }) }}
            initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold gold-text">{s.title}</h2>
            {s.sub && <p className="mt-2 text-xl sm:text-2xl text-white/90 font-light">{s.sub}</p>}
            <label htmlFor="f" className="block mt-10 text-[11px] tracking-[0.3em] text-gold/80">{s.label.toUpperCase()}</label>
            <input id="f" ref={input} className="gold-input" type={s.type} placeholder={s.ph} autoComplete={s.auto}
              inputMode={s.type === "email" ? "email" : s.key === "studentId" ? "numeric" : "text"} autoCapitalize={s.key === "email" ? "none" : "words"} maxLength={s.key === "email" ? 120 : s.key === "studentId" ? 4 : 80}
              value={vals[s.key]} onChange={(e) => { const v = s.key === "studentId" ? e.target.value.replace(/\D/g, "") : e.target.value; setVals({ ...vals, [s.key]: v }); setErr(""); }} aria-invalid={!!err} />
            <p className="h-6 mt-2 text-sm text-amber-300/90" role="alert">{err}</p>
            <button type="submit" disabled={busy} className="gold-btn mt-6 w-full sm:w-auto group">
              {busy ? "UNLOCKING…" : s.cta} {!busy && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
