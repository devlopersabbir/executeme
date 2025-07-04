export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`
                absolute w-1 h-1 bg-white/40 rounded-full
                animate-float-${(i % 3) + 1}
              `}
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
