import { useEffect, useRef } from "react";

export const clipSrc = (name) => `${import.meta.env.BASE_URL}assets/${name}.mp4`;

export default function Clip({ name, loop = false, onEnded, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
  }, []);
  return <video ref={ref} src={clipSrc(name)} playsInline loop={loop} onEnded={onEnded} preload="auto" className={className} />;
}