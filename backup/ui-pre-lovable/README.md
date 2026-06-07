# UI backup — pre-Lovable reskin

Snapshot taken before the Lovable-style visual migration (`pick-your-play-time` reference).

## Rollback

To restore the previous UI:

```powershell
cd C:\Users\Lenovo\Desktop\PaS
Copy-Item backup/ui-pre-lovable/app/globals.css app/globals.css -Force
Copy-Item backup/ui-pre-lovable/app/page.tsx app/page.tsx -Force
Copy-Item backup/ui-pre-lovable/app/layout.tsx app/layout.tsx -Force
Copy-Item backup/ui-pre-lovable/components/layout/*.tsx components/layout/ -Force
Copy-Item backup/ui-pre-lovable/components/dashboard/StudentDashboardClient.tsx components/dashboard/ -Force
Copy-Item backup/ui-pre-lovable/app/biz/dashboard/page.tsx app/biz/dashboard/ -Force
```

Or checkout git branch `backup/pre-lovable-ui` (if pushed) for the full pre-reskin commit.

## Files included

- `app/globals.css` — design system
- `app/page.tsx` — landing page
- `app/layout.tsx` — fonts (Inter)
- `components/layout/*` — DashShell, SiteHeader, SiteFooter, MobileBottomNav, NotifBell
- `components/dashboard/StudentDashboardClient.tsx`
- `app/biz/dashboard/page.tsx`
