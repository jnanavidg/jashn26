import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GoldBackground from "./components/GoldBackground.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Reveal from "./pages/Reveal.jsx";

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | register | reveal
  const [returning, setReturning] = useState(false);
  const pages = {
    landing: <Landing onStart={() => setStage("register")} />,
    register: <Register onDone={(existing) => { setReturning(existing); setStage("reveal"); }} />,
    reveal: <Reveal returning={returning} />,
  };
  return (
    <div className="relative min-h-full bg-ink">
      <GoldBackground />
      <AnimatePresence mode="wait">
        <motion.main key={stage} className="relative z-10 min-h-screen"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {pages[stage]}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
