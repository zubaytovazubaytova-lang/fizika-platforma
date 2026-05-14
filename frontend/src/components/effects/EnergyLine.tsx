export default function EnergyLine() {
  return (
    <div
      className="h-px w-full"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.35) 30%, rgba(139,92,246,0.35) 60%, transparent)',
        boxShadow: '0 0 6px rgba(99,179,237,0.2)',
        animation: 'neon-pulse 3s ease-in-out infinite',
      }}
    />
  )
}
