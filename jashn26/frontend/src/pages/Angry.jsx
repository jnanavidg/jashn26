import Clip from "../components/Clip.jsx";

export default function Angry() {
  return (
    <div className="h-[100svh] flex items-center justify-center p-4 overflow-hidden">
      <Clip name="angry" className="block max-h-full max-w-full w-auto h-auto object-contain ring-1 ring-gold/50 shadow-[0_0_50px_rgba(212,168,75,.25)]" />
    </div>
  );
}