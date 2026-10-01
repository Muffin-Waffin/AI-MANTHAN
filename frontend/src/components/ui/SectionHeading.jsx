export default function SectionHeading({ eyebrow, title, body, align = 'left', className = '' }) {
  const isCenter = align === 'center'
  return (
    <div className={`${isCenter ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl pl-[3%]'} ${className}`}>
      <span className="text-xs font-mono font-medium tracking-wider text-brand-cyan uppercase">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-wide text-white mt-2">{title}</h2>
      {body && <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{body}</p>}
    </div>
  )
}
