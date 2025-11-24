import { cn } from "@/lib/utils";

interface ChameleonSidebarPlaceholderProps {
  title: string;
  description: string;
  bullets: string[];
  badge?: string;
  cta?: string;
  className?: string;
}

const chameleonEnabled = process.env.NEXT_PUBLIC_ENABLE_CHAMELEON_SIDEBAR === "true";

export default function ChameleonSidebarPlaceholder({
  title,
  description,
  bullets,
  badge,
  cta,
  className,
}: ChameleonSidebarPlaceholderProps) {
  if (!chameleonEnabled) {
    return null;
  }

  return (
    <aside
      className={cn(
        "border-4 border-black bg-gradient-to-b from-[#C4F1BE] via-white to-[#A5F3FC] shadow-brutal-lg p-5 space-y-4",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center px-3 py-1 text-xs font-black uppercase bg-black text-white border-2 border-black shadow-brutal-sm">
          {badge}
        </span>
      )}
      <div>
        <h3 className="text-xl font-black text-black uppercase">{title}</h3>
        <p className="text-sm font-bold text-black mt-2 leading-relaxed">{description}</p>
      </div>
      <ul className="space-y-2">
        {bullets.map((bullet) => (
          <li
            key={bullet}
            className="text-sm font-bold text-black border-2 border-black bg-white px-3 py-2 shadow-brutal-sm"
          >
            {bullet}
          </li>
        ))}
      </ul>
      {cta && (
        <p className="text-xs font-black uppercase text-black border-2 border-black bg-[#FFD93D] px-3 py-2 shadow-brutal-sm">
          {cta}
        </p>
      )}
    </aside>
  );
}


