import Link from 'next/link';

export interface LogoProps {
  className?: string;
}

/**
 * Pick a Shift wordmark — rendered inline as HTML + SVG mark.
 * Transparent background, primary red via CSS var.
 */
export function Logo({ className = 'logo' }: LogoProps) {
  return (
    <Link href="/" aria-label="Pick a Shift home" className={`logo-wordmark ${className}`}>
      <span className="logo-pica">Pick a</span>
      <span className="logo-shift">
        SH
        {/* Person-in-i mark — viewBox 0 0 120 142 */}
        <svg
          className="logo-icon"
          viewBox="0 0 120 142"
          aria-hidden="true"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="44.5" y="52" width="31" height="90" rx="15.5" transform="rotate(9 60 142)" />
          <ellipse cx="61" cy="24" rx="22" ry="24" transform="rotate(10 61 24)" />
        </svg>
        FT
      </span>
    </Link>
  );
}
