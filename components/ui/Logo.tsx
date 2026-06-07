'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export interface LogoProps {
  className?: string;
  imageSrc?: string;
}

export function Logo({ className = 'logo', imageSrc = '/logo.svg' }: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const showText = !imageSrc || imgError;

  if (showText) {
    return (
      <Link href="/" aria-label="Pick a Shift home" className={className}>
        <span
          style={{
            color: 'var(--primary)',
            fontWeight: 900,
            fontSize: className.includes('logo-sm') ? '1.05rem' : '1.2rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            display: 'block',
          }}
        >
          Pick a Shift
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Pick a Shift home">
      <Image
        src={imageSrc}
        alt="Pick a Shift"
        width={160}
        height={40}
        className={className}
        onError={() => setImgError(true)}
        priority
      />
    </Link>
  );
}
