'use client';

import { useRouter } from 'next/navigation';

export function LocaleSwitcher() {
  const router = useRouter();

  function set(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 text-xs font-semibold">
      <button type="button" onClick={() => set('en')} className="hover:text-brand transition-colors">
        EN
      </button>
      <span className="text-muted-foreground">|</span>
      <button type="button" onClick={() => set('es')} className="hover:text-brand transition-colors">
        ES
      </button>
    </div>
  );
}
