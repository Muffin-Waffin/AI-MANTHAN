import { site, footer } from '../../data/site'

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">{title}</h4>
      {children}
    </div>
  )
}

const linkCls = 'hover:text-zinc-300 transition-colors'

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-obsidian-950 text-zinc-400 text-xs py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/logos/aimathan-logo.png"
              alt="AI Manthan logo"
              className="w-7 h-7 rounded object-cover"
            />
            <span className="font-bold text-sm text-white tracking-tight">
              {site.title} // {site.subtitle}
            </span>
          </div>
          <p className="text-zinc-500 leading-relaxed">{footer.mission}</p>
        </div>

        {/* Link columns */}
        {footer.columns.map((col) => (
          <FooterColumn key={col.title} title={col.title}>
            <ul className="space-y-2 text-zinc-500">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    className={linkCls}
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>
        ))}

        {/* Contact */}
        <FooterColumn title="Contact & Organizers">
          <div className="space-y-2 text-zinc-500">
            <div>{footer.contact.org}</div>
            <div>{footer.contact.address}</div>
            <div className="text-zinc-300 font-mono">{footer.contact.email}</div>
            <div className="pt-2 text-[11px] text-zinc-600">{footer.contact.node}</div>
          </div>
        </FooterColumn>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 font-mono text-[11px]">
        <div>{footer.legal}</div>
        <div className="flex items-center gap-4">
          {footer.meta.map((item, i) => (
            <span key={item} className="flex items-center gap-4">
              {i > 0 && <span>•</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
