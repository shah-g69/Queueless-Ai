import { useEffect, useState } from "react";

const COLORS = ["#0d9488", "#22c55e", "#eab308", "#6366f1", "#ec4899", "#f97316"];
const PARTICLE_COUNT = 50;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

/**
 * Confetti – Triggers a burst of confetti particles.
 *
 * Props:
 *   active   – boolean to trigger
 *   duration – ms (default 3000)
 *   onComplete – callback when done
 */
const Confetti = ({ active, duration = 3000, onComplete = () => {} }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(10, 90),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      delay: randomBetween(0, 0.5),
      duration: randomBetween(1.5, 3),
      rotation: randomBetween(0, 360),
      drift: randomBetween(-30, 30),
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            borderRadius: "2px",
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) translateX(${randomBetween(-50, 50)}px) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
