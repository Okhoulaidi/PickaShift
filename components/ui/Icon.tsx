import type { CSSProperties } from 'react';

export const PATHS = {
  calendar:
    'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  pin: 'M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z|M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  euro: 'M18 7a6 6 0 1 0 0 10M4 10h9M4 14h7',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home: 'M3 11l9-8 9 8M5 9.5V21h14V9.5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  briefcase:
    'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 12h18',
  star: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  chevright: 'M9 6l6 6-6 6',
  chevleft: 'M15 6l-6 6 6 6',
  arrowup: 'M12 19V5M5 12l7-7 7 7',
  arrowdown: 'M12 5v14M19 12l-7 7-7-7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  users:
    'M17 21v-2a4 4 0 0 0-3-3.87M9 21v-2a4 4 0 0 1 3-3.87M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87',
  chart: 'M3 3v18h18M7 15l3-4 3 2 4-6',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  clipboard:
    'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1zM8 6H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2',
  trend: 'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
  gauge: 'M12 14l4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  flame:
    'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C8 10 7 12 7 14a5 5 0 0 0 10 0c0-5-5-12-5-12z',
  insta:
    'M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17 6.5h.01',
  x_social: 'M4 4l16 16M20 4 4 20',
  linkedin:
    'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-12h4v2a4 4 0 0 1 2-2zM6 9H2v11h4zM4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
} as const;

export type IconName = keyof typeof PATHS;

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  fill?: boolean;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, stroke = 2, fill = false, style }: IconProps) {
  const segs = (PATHS[name] || '').split('|');

  return (
    <span className="ico" style={style}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill ? 'currentColor' : 'none'}
        stroke={fill ? 'none' : 'currentColor'}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {segs.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  );
}
