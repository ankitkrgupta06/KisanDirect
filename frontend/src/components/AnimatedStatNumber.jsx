import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedStatNumber({ value, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(typeof value === "number" ? 0 : String(value));

  useEffect(() => {
    if (!ref.current || typeof value !== "number") return undefined;

    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value,
      duration: 1.8,
      ease: "power2.out",
      paused: true,
      onUpdate: () => setDisplay(Math.floor(counter.value).toLocaleString()),
    });

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className="animated-stat-number">
      {prefix}{display}{suffix}
    </span>
  );
}
