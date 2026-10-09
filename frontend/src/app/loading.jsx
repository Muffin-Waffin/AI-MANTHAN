export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-16 h-16 mb-4">
        {/* Pulsing neon rings */}
        <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-60" />
        <span className="absolute inset-2 rounded-full border border-cyan-400/60 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/logos/image.png"
            alt="Loading"
            className="w-7 h-7 object-contain opacity-80"
          />
        </div>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300 animate-pulse">
        Initializing AI Manthan...
      </p>
    </div>
  )
}
