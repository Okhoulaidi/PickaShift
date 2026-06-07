const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, TabStopType, TabStopPosition,
  ExternalHyperlink, PageBreak
} = require('docx');
const fs = require('fs');

// ── Helpers ────────────────────────────────────────────────────────────────
const BRAND = 'E8401C';
const DARK  = '1A1A1A';
const MUTED = '6B6B6B';
const GREEN = '1E9E5A';
const GREY  = 'F5F5F5';
const LINE  = 'ECECEC';

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: LINE };
const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const noBorder   = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders  = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: 'Arial' })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: BRAND, font: 'Arial' })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: DARK, font: 'Arial' })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: opts.muted ? MUTED : DARK, ...opts })],
  });
}
function mono(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
    children: [new TextRun({ text, font: 'Courier New', size: 20, color: '444444' })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })],
  });
}
function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbers', level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })],
  });
}
function divider() {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 1 } },
    children: [],
  });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function label(text) {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 18, color: BRAND, font: 'Arial', characterSpacing: 40 })],
  });
}
function tag(text) {
  return new Paragraph({
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text: `  ${text}  `, size: 18, font: 'Arial', color: BRAND, highlight: 'yellow' })],
  });
}

// ── Two-col table helper ───────────────────────────────────────────────────
function twoCol(leftText, rightText, leftW = 3000, rightW = 6360) {
  return new Table({
    width: { size: leftW + rightW, type: WidthType.DXA },
    columnWidths: [leftW, rightW],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: leftW, type: WidthType.DXA },
            margins: { top: 40, bottom: 40, left: 0, right: 200 },
            children: [new Paragraph({ children: [new TextRun({ text: leftText, bold: true, size: 20, font: 'Arial', color: MUTED })] })],
          }),
          new TableCell({
            borders: noBorders,
            width: { size: rightW, type: WidthType.DXA },
            margins: { top: 40, bottom: 40, left: 0, right: 0 },
            children: [new Paragraph({ children: [new TextRun({ text: rightText, size: 20, font: 'Arial', color: DARK })] })],
          }),
        ],
      }),
    ],
  });
}

// ── Schema table ───────────────────────────────────────────────────────────
function schemaTable(title, cols, rows) {
  const colW = Math.floor(9360 / cols.length);
  const colWidths = cols.map(() => colW);

  const headerCells = cols.map(c =>
    new TableCell({
      borders: allBorders,
      width: { size: colW, type: WidthType.DXA },
      shading: { fill: DARK, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, size: 18, font: 'Arial', color: 'FFFFFF' })] })],
    })
  );

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          borders: allBorders,
          width: { size: colW, type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? 'FFFFFF' : 'FAFAFA', type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 18, font: 'Courier New', color: DARK })] })],
        })
      ),
    })
  );

  return [
    new Paragraph({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text: title, bold: true, size: 22, font: 'Arial', color: DARK })] }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: colWidths,
      rows: [new TableRow({ children: headerCells }), ...dataRows],
    }),
    new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),
  ];
}

// ══════════════════════════════════════════════════════════════════════════
//  DOCUMENT
// ══════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 440, hanging: 280 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '\u25E6', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 800, hanging: 280 } } } },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 440, hanging: 280 } } } },
          { level: 1, format: LevelFormat.DECIMAL, text: '%2.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 800, hanging: 280 } } } },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, font: 'Arial', color: DARK }, paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: BRAND }, paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: DARK }, paragraph: { spacing: { before: 220, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [

        // ── COVER ──────────────────────────────────────────────────────
        new Paragraph({ spacing: { before: 1200, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PICK A SHIFT', bold: true, size: 72, font: 'Arial', color: BRAND })] }),
        new Paragraph({ spacing: { before: 80, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Full Platform Technical Specification', size: 28, font: 'Arial', color: MUTED })] }),
        new Paragraph({ spacing: { before: 40, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Version 1.0  ·  June 2026  ·  Confidential', size: 20, font: 'Arial', color: MUTED })] }),
        new Paragraph({ spacing: { before: 600, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Madrid, España', size: 22, font: 'Arial', color: MUTED })] }),
        pageBreak(),

        // ── 1. OVERVIEW ────────────────────────────────────────────────
        h1('1. Project Overview'),
        p('Pick a Shift is a two-sided marketplace connecting university students and young workers in Madrid with local businesses (restaurants, cafés, retail stores, event companies) that need short-term, flexible staffing. Students browse and apply to shifts of 1–4 hours that fit around their class schedules. Businesses post openings, review applicants ranked by reliability score, and confirm workers in one tap.'),
        p('The platform operates across three user roles — Student, Business, and Admin — each with a completely separate interface, onboarding flow, and permission set.'),
        divider(),

        label('Core Value Proposition'),
        bullet('Students: earn income between classes without rigid contracts or language barriers'),
        bullet('Businesses: fill urgent staffing gaps within minutes, not days'),
        bullet('Platform: commission per completed shift + premium business features'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        label('Tech Stack'),
        twoCol('Frontend', 'Next.js 14 (App Router) + TypeScript + Tailwind CSS'),
        twoCol('Auth', 'Clerk (supports Google, Apple, email — role selection on first login)'),
        twoCol('Database', 'Supabase (PostgreSQL) with Row Level Security per role'),
        twoCol('Storage', 'Supabase Storage (profile photos, CVs, business logos)'),
        twoCol('Maps', 'Mapbox GL JS (shift pins, student location, distance filter)'),
        twoCol('Payments', 'Stripe Connect (platform escrow, student payouts, business billing)'),
        twoCol('Messaging', 'Supabase Realtime (in-platform chat between student ↔ business)'),
        twoCol('Notifications', 'Supabase Realtime + email via Resend'),
        twoCol('Deployment', 'Vercel (frontend) + Supabase (backend)'),
        twoCol('Design tokens', '#E8401C primary · #F5F5F5 bg · #1A1A1A text · Inter font'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),
        pageBreak(),

        // ── 2. USER ROLES ──────────────────────────────────────────────
        h1('2. User Roles & Permissions'),
        p('Every user in the system has exactly one role assigned at first login. The role is stored in Clerk public metadata and mirrored in the Supabase profiles table. Row Level Security policies enforce that each role can only read and write data they are permitted to access.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('2.1 Student'),
        bullet('Browse, filter, and apply to open shifts'),
        bullet('View shift details, business profile, and map location'),
        bullet('Manage own applications (pending / confirmed / completed / cancelled)'),
        bullet('Maintain a personal profile: photo, bio, skills, availability, CV upload'),
        bullet('Receive and send in-platform messages to businesses for confirmed shifts'),
        bullet('Rate businesses after a completed shift (1–5 stars + optional comment)'),
        bullet('View own reliability score and earnings history'),
        bullet('Cannot access any other student\'s data'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('2.2 Business'),
        bullet('Create and manage a verified business profile (name, logo, district, description)'),
        bullet('Post, edit, and delete shift listings (go live instantly)'),
        bullet('View and rank applicants by reliability score'),
        bullet('Accept or reject individual applicants per shift'),
        bullet('Add students to a private Talent Pool for future direct invitations'),
        bullet('Send in-platform messages to confirmed workers'),
        bullet('Rate students after a completed shift (1–5 stars + optional comment)'),
        bullet('View analytics: fill rate, no-show rate, cost per shift, monthly spend'),
        bullet('Manage billing and payout settings via Stripe'),
        bullet('Account visible to students only after manual Admin verification'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('2.3 Admin (Founders + Moderators)'),
        bullet('Full read access to all users, shifts, applications, messages, and ratings'),
        bullet('Verify or reject business accounts (toggles business visibility to students)'),
        bullet('Suspend or ban any user account'),
        bullet('View platform-wide analytics: GMV, active users, shifts posted/filled, revenue'),
        bullet('Override any shift status (cancel, mark complete, resolve disputes)'),
        bullet('Access moderation queue: flagged messages, disputed ratings, reported content'),
        bullet('Cannot be signed up through the public onboarding flow — accounts created manually in Supabase'),
        pageBreak(),

        // ── 3. SITE STRUCTURE ─────────────────────────────────────────
        h1('3. Site Structure & Routes'),
        p('All routes are defined in Next.js App Router. Protected routes check Clerk auth status and user role via middleware — unauthenticated users are redirected to /sign-in, wrong-role users are redirected to their correct dashboard.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('3.1 Public Routes'),
        ...schemaTable('', ['Route', 'Page', 'Notes'],
          [
            ['/', 'Landing page', 'Visible to all; CTAs redirect to /sign-up'],
            ['/sign-in', 'Clerk sign-in', 'Clerk hosted UI, custom appearance'],
            ['/sign-up', 'Role selection → onboarding', 'Step 1: choose Student or Business'],
            ['/onboarding/student', 'Student profile setup', 'Runs once; skipped on subsequent logins'],
            ['/onboarding/business', 'Business profile setup', 'Runs once; account pending verification'],
            ['/shifts/[id]', 'Public shift detail', 'SEO-friendly; apply button requires auth'],
          ]
        ),

        h2('3.2 Student Routes (role: student)'),
        ...schemaTable('', ['Route', 'Page'],
          [
            ['/dashboard', 'Student home — stats, nearby shifts, upcoming'],
            ['/browse', 'Browse shifts — map + card list with filters'],
            ['/applications', 'My applications — tabs: Pending / Confirmed / Completed'],
            ['/messages', 'Inbox — list of conversations'],
            ['/messages/[id]', 'Individual conversation thread'],
            ['/profile', 'Edit own profile, availability, skills, CV'],
            ['/earnings', 'Earnings history, Stripe payout status'],
          ]
        ),

        h2('3.3 Business Routes (role: business)'),
        ...schemaTable('', ['Route', 'Page'],
          [
            ['/biz/dashboard', 'Business home — stats, active listings, recent applicants'],
            ['/biz/shifts', 'Manage all shifts — Open / Filled / Completed'],
            ['/biz/shifts/new', 'Post a new shift (full form)'],
            ['/biz/shifts/[id]', 'Shift detail — applicant list, accept/reject'],
            ['/biz/talent-pool', 'Saved workers — invite to future shifts'],
            ['/biz/messages', 'Business inbox'],
            ['/biz/messages/[id]', 'Individual conversation thread'],
            ['/biz/analytics', 'Fill rate, spend, no-show rate charts'],
            ['/biz/billing', 'Stripe billing portal (embedded)'],
            ['/biz/profile', 'Edit business profile, logo, description'],
          ]
        ),

        h2('3.4 Admin Routes (role: admin)'),
        ...schemaTable('', ['Route', 'Page'],
          [
            ['/admin', 'Platform overview — GMV, users, shifts, revenue'],
            ['/admin/businesses', 'Business verification queue + all businesses'],
            ['/admin/users', 'All users — search, filter, suspend, ban'],
            ['/admin/shifts', 'All shifts — cancel, mark complete, resolve disputes'],
            ['/admin/moderation', 'Flagged messages, disputed ratings, reported content'],
            ['/admin/analytics', 'Full platform analytics with date range filters'],
          ]
        ),
        pageBreak(),

        // ── 4. ONBOARDING FLOWS ───────────────────────────────────────
        h1('4. Onboarding Flows'),
        p('Onboarding is triggered once: immediately after a user creates an account via Clerk, before they can access any dashboard. A flag onboarding_complete: boolean is stored in Clerk public metadata. Middleware checks this flag on every request — if false, the user is redirected to the appropriate onboarding route regardless of what URL they requested.'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('4.1 Sign-Up Entry Point (/sign-up)'),
        p('This page appears before Clerk\'s auth UI. It presents two large cards:'),
        bullet('I\'m a Student — looking for flexible shifts'),
        bullet('I\'m a Business — I need to hire staff'),
        p('Selecting a card stores the intended role in a session cookie, then redirects to Clerk\'s /sign-up page with the role pre-configured. After Clerk creates the account, the user is sent to /onboarding/student or /onboarding/business based on the stored role.'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('4.2 Student Onboarding (/onboarding/student)'),
        p('Multi-step form — progress bar at the top, cannot skip steps, can go back.'),
        numbered('Step 1 — Personal info: first name, last name, profile photo (upload), date of birth'),
        numbered('Step 2 — Education: university name (dropdown of Madrid universities + "other"), degree, year of study'),
        numbered('Step 3 — Availability: weekly availability grid (Mon–Sun × Morning / Afternoon / Evening — tap to toggle)'),
        numbered('Step 4 — Skills & languages: multi-select skill chips (Barista, Waiter, Cashier, Sales, Event staff, Heavy lifting, Customer service, Cocktails, Food prep, POS/TPV, English, French, German, Other); language proficiency (Spanish level: None / Basic / Intermediate / Fluent / Native)'),
        numbered('Step 5 — CV upload: optional PDF upload (max 5 MB); can skip and add later from profile'),
        numbered('Step 6 — Done screen: confirmation, redirect to /dashboard'),
        p('On completion: set onboarding_complete: true in Clerk metadata, create row in profiles table (role: student).', { muted: true }),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('4.3 Business Onboarding (/onboarding/business)'),
        p('Also multi-step, triggers manual verification before full access.'),
        numbered('Step 1 — Business identity: business name, business type (Restaurant / Café / Retail / Events / Hotel / Other), NIF/CIF (Spanish tax ID — stored but not validated in MVP)'),
        numbered('Step 2 — Location & contact: address, district (dropdown of 21 Madrid districts), public phone, public email, website (optional)'),
        numbered('Step 3 — Logo upload: image upload, cropped to square, max 2 MB'),
        numbered('Step 4 — Description: short bio (max 300 chars), what kind of shifts they typically post'),
        numbered('Step 5 — Stripe Connect: link or create a Stripe account for billing and payments'),
        numbered('Step 6 — Pending screen: "Your account is under review. We\'ll email you within 24h." No dashboard access until Admin verifies.'),
        p('On completion: set onboarding_complete: true and verified: false in Clerk metadata, create row in businesses table. Admin sees this account in /admin/businesses verification queue.', { muted: true }),
        pageBreak(),

        // ── 5. PAGE SPECS ─────────────────────────────────────────────
        h1('5. Page-by-Page Specifications'),

        h2('5.1 Landing Page (/)'),
        p('The public face of the platform. Designed to convert both students and businesses.'),
        new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

        h3('Header'),
        bullet('Logo (left) — links to /'),
        bullet('Nav center: "How it Works" (anchor), "For Students" (/sign-up), "For Business" (/sign-up?role=business)'),
        bullet('Right: "Log In" (ghost btn → /sign-in), "Sign Up" (primary btn → /sign-up)'),
        bullet('Mobile: hamburger icon → slide-in sheet from right with same links'),
        bullet('Sticky on scroll, frosted glass background (backdrop-filter blur)'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Hero Section'),
        bullet('Headline: "Work when you want to." — "want to." in brand red (#E8401C)'),
        bullet('Subline: "Find 1–4 hour paid shifts that fit perfectly between your classes."'),
        bullet('Two CTAs: "Browse Shifts Near Me" (primary, → /browse) and "Post a Shift" (outline, → /sign-up?role=business)'),
        bullet('Right column: a single live ShiftCard component (pulls first real shift from DB; falls back to mock)'),
        bullet('Two floating micro-cards: "Sofia got paid €48 ✓" and "Avg fill time: under 9 min"'),
        bullet('Mobile: hero is single column, floating cards hidden'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Stats Strip'),
        bullet('4 stats in a row: Active Workers, Businesses, On-time Rate, Avg Hourly Pay'),
        bullet('Numbers pulled from DB via server component; cached every 60s'),
        bullet('Mobile: 2×2 grid'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('How It Works'),
        bullet('Two columns side by side: For Students (3 steps) and For Business (3 steps, darker bg)'),
        bullet('Student steps: Create Profile → Browse Shifts → Get Paid'),
        bullet('Business steps: Post a Shift → Pick Workers → Done'),
        bullet('Each step: numbered circle, title, short description, arrow connector between steps'),
        bullet('Mobile: single column, student first'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Live Shifts Preview'),
        bullet('Section title: "Shifts near you, today." with "Open right now" kicker'),
        bullet('3 ShiftCard components showing real open shifts from DB (server-side, no auth required)'),
        bullet('Apply button: if not logged in → redirect to /sign-up; if logged in → apply inline'),
        bullet('"See all open shifts →" CTA below'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Footer'),
        bullet('4-column grid: brand + tagline + socials | Platform | Company | Support'),
        bullet('Bottom bar: © 2026 Pick a Shift · Madrid, España | Hecho con 🧡 para estudiantes'),
        bullet('Mobile: 2-column then single column'),
        divider(),

        h2('5.2 Browse Shifts (/browse)'),
        p('The core student discovery experience. Split-view: interactive map on the left, scrollable shift cards on the right. Mobile: tabbed toggle between map and list.'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Filter Bar (top, sticky)'),
        bullet('District dropdown (21 Madrid districts + "Any")'),
        bullet('Date picker (Today / Tomorrow / This week / Pick date)'),
        bullet('Pay range slider (€9 – €25/hr)'),
        bullet('Shift length (1h / 2h / 3h / 4h+ toggle chips)'),
        bullet('Skills needed (multi-select dropdown)'),
        bullet('"Clear filters" link appears when any filter is active'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Map (Mapbox GL JS)'),
        bullet('Default center: Puerta del Sol, Madrid'),
        bullet('Each open shift = a red pin marker with pay amount label (e.g. "€12/hr")'),
        bullet('Clicking a pin: highlights the corresponding card in the right column, opens a mini popup with shift title, business name, time, and an "Apply" button'),
        bullet('Student\'s location (if browser permission granted): blue dot'),
        bullet('Distance ring: 1km and 3km radius circles around student location (toggleable)'),
        bullet('Map updates in real-time as filters change (no page reload)'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Shift Card List'),
        bullet('Infinite scroll (load 12 at a time, fetch more on scroll)'),
        bullet('Each card: business logo/initials, business name, role title, date + time, district, pay/hr, estimated total for shift, URGENT badge if urgent, Apply button'),
        bullet('Applied state persists in UI without page reload'),
        bullet('Cards sorted by: distance (if location granted), then urgency, then pay'),
        bullet('Empty state: "No shifts found matching your filters" with a reset button'),
        divider(),

        h2('5.3 Student Dashboard (/dashboard)'),
        h3('Layout'),
        bullet('Desktop: fixed left sidebar (240px) + scrollable main content'),
        bullet('Mobile: top bar + bottom navigation bar (5 tabs)'),
        bullet('Sidebar items: Home, Browse Shifts, My Applications (badge with count), My Profile, Notifications, Messages'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Top Bar'),
        bullet('"Hey [First Name] 👋" greeting'),
        bullet('Sub-line: "You have X shifts coming up this week — you\'re on a Y-shift streak."'),
        bullet('Right: notification bell (dot if unread), avatar'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Stats Row (4 cards)'),
        bullet('Shifts Completed | Hours Worked | Total Earned | Reliability Score'),
        bullet('Each card: icon, number, label, trend vs. last month'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Available Shifts Near You'),
        bullet('Horizontally scrollable row of ShiftCard components'),
        bullet('Pulls from DB: open shifts within 5km of student\'s saved district, sorted by urgency'),
        bullet('"View all →" link to /browse'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('My Upcoming Shifts'),
        bullet('Panel with confirmed shifts sorted by date ascending'),
        bullet('Each row: date box, shift title + business, time + location, status badge (Confirmed / Today)'),
        bullet('"Calendar" link (future: export to Google Calendar)'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Map Panel'),
        bullet('Mapbox embed showing open shifts near the student\'s district'),
        bullet('Same pin behaviour as /browse but condensed'),
        bullet('"Open full map" → /browse'),
        divider(),

        h2('5.4 Business Dashboard (/biz/dashboard)'),
        h3('Layout'),
        bullet('Same sidebar + bottom nav structure as student, business-coloured accent'),
        bullet('Sidebar: Overview, Post a Shift, Manage Shifts (badge), Worker Pool, Messages, Analytics, Billing'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Stats Row (4 cards)'),
        bullet('Open Shifts | Applicants Today | Shifts Filled This Month | No-Show Rate'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Active Shift Listings'),
        bullet('Grid of listing cards (3 cols desktop, 1 col mobile)'),
        bullet('Each card: title, date/time/pay, district, status badge (Open / Urgent / Filled), applicant count with avatar stack, "Review" button'),
        bullet('"Post New Shift" prominent button → opens Post Shift modal or navigates to /biz/shifts/new'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Recent Applicants Table'),
        bullet('Columns: Worker (avatar + name + university), Reliability Score (score + bar), Availability, Action (Accept / Reject)'),
        bullet('Accept → moves applicant to confirmed, triggers notification to student, sends message thread open'),
        bullet('Reject → removes from list, sends polite automated message to student'),
        bullet('Add to Talent Pool → saves student to /biz/talent-pool (separate from accept/reject)'),
        bullet('Mobile: Availability column hidden, Action buttons show icon only'),
        divider(),

        h2('5.5 Post a Shift Modal/Page'),
        p('Accessible from the dashboard "Post New Shift" button (modal on desktop, full page on mobile). Goes live instantly on submit.'),
        bullet('Job Title (text input, required)'),
        bullet('Date (date picker, required, minimum: today)'),
        bullet('Start Time and End Time (time pickers, side by side, required)'),
        bullet('Location (district dropdown + optional street address, required)'),
        bullet('Pay Per Hour in € (number input, min €9.26 — Madrid minimum wage; warning shown if below)'),
        bullet('Number of Workers Needed (1–10 stepper)'),
        bullet('Job Description (textarea, max 500 chars, required)'),
        bullet('Skills Needed (same chip selector as onboarding)'),
        bullet('Mark as Urgent toggle (shows URGENT badge to students)'),
        bullet('On submit: POST /api/shifts, instant redirect to /biz/shifts/[id]'),
        divider(),

        h2('5.6 Shift Detail Page (/shifts/[id])'),
        bullet('Public page, SEO-friendly (server-rendered)'),
        bullet('Business info header: logo, name, verified badge, district, rating'),
        bullet('Shift details: role, date, time, pay, description, skills needed, number of spots remaining'),
        bullet('Mapbox embed showing exact location (street-level pin)'),
        bullet('Apply button: auth-gated — not logged in → /sign-up; logged in as student → apply inline; already applied → "Applied" state'),
        bullet('Business dashboard button shown if viewing user is the posting business'),
        divider(),

        h2('5.7 Messaging (/messages and /biz/messages)'),
        bullet('Conversation list on the left: avatar, name, last message preview, timestamp, unread dot'),
        bullet('Message thread on the right: chat bubble UI, timestamps, read receipts'),
        bullet('New conversations can only be initiated by a business after accepting a student'),
        bullet('Students can reply to any conversation they are part of'),
        bullet('Real-time updates via Supabase Realtime subscriptions (no polling)'),
        bullet('File attachments: not in MVP — text only'),
        bullet('Mobile: conversation list is full screen; tapping opens thread (back button to return)'),
        divider(),

        h2('5.8 Admin Dashboard (/admin)'),
        h3('Overview'),
        bullet('Full-width layout, no sidebar — top navigation bar instead'),
        bullet('Nav: Overview | Businesses | Users | Shifts | Moderation | Analytics'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Overview Page'),
        bullet('6 stat cards: Total Users, Active Students, Active Businesses, Shifts Posted (30d), Shifts Filled (30d), Platform GMV (30d)'),
        bullet('Line chart: daily shifts posted vs. filled over past 30 days'),
        bullet('Verification queue widget: businesses pending approval with Verify / Reject buttons'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Business Verification Queue (/admin/businesses)'),
        bullet('Table: business name, type, district, NIF, registered date, status (Pending / Verified / Rejected)'),
        bullet('Row actions: View Profile, Verify (sets verified: true in DB + notifies business by email), Reject (with reason), Suspend'),
        bullet('Filter by status, district, registration date'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('User Management (/admin/users)'),
        bullet('Search by name or email'),
        bullet('Filter by role (student / business / admin)'),
        bullet('Row actions: View Profile, Suspend (temporary), Ban (permanent), Reset Password'),
        bullet('Suspended users see a "Your account has been suspended" screen on login'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h3('Moderation Queue (/admin/moderation)'),
        bullet('Tabs: Flagged Messages | Disputed Ratings | Reported Shifts'),
        bullet('Each item: parties involved, content preview, report reason, date'),
        bullet('Actions: Dismiss (no action), Remove Content, Warn User, Suspend User'),
        pageBreak(),

        // ── 6. DATABASE SCHEMA ────────────────────────────────────────
        h1('6. Database Schema (Supabase / PostgreSQL)'),
        p('All tables use UUID primary keys generated by gen_random_uuid(). Row Level Security is enabled on every table. Timestamps are timestamptz, always stored in UTC.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('6.1 profiles'),
        p('One row per user. Created immediately after Clerk webhook fires on user.created.'),
        ...schemaTable('profiles', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', 'Matches Clerk user_id'],
            ['role', "enum('student','business','admin')", 'Set during onboarding'],
            ['email', 'text', 'From Clerk'],
            ['first_name', 'text', ''],
            ['last_name', 'text', ''],
            ['avatar_url', 'text', 'Supabase Storage URL'],
            ['onboarding_complete', 'boolean', 'Default false'],
            ['created_at', 'timestamptz', 'Default now()'],
            ['updated_at', 'timestamptz', 'Auto-updated'],
          ]
        ),

        h2('6.2 students'),
        p('Extended profile for users with role = student.'),
        ...schemaTable('students', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK FK → profiles.id', ''],
            ['university', 'text', ''],
            ['degree', 'text', ''],
            ['year_of_study', 'int', '1–6'],
            ['bio', 'text', 'Max 300 chars'],
            ['skills', 'text[]', 'Array of skill strings'],
            ['languages', 'jsonb', "{es: 'fluent', en: 'intermediate'}"],
            ['availability', 'jsonb', 'Weekly grid: {mon: [morning, evening]}'],
            ['cv_url', 'text', 'Supabase Storage URL, nullable'],
            ['reliability_score', 'numeric(4,2)', 'Computed — default 5.0'],
            ['shifts_completed', 'int', 'Default 0'],
            ['total_earned_cents', 'int', 'Default 0'],
            ['stripe_account_id', 'text', 'Stripe Connect account ID'],
          ]
        ),

        h2('6.3 businesses'),
        p('Extended profile for users with role = business.'),
        ...schemaTable('businesses', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK FK → profiles.id', ''],
            ['business_name', 'text', ''],
            ['business_type', 'text', 'Restaurant / Café / Retail / Events / Hotel / Other'],
            ['nif', 'text', 'Spanish tax ID'],
            ['district', 'text', 'One of 21 Madrid districts'],
            ['address', 'text', ''],
            ['phone', 'text', ''],
            ['website', 'text', 'Nullable'],
            ['logo_url', 'text', 'Supabase Storage URL'],
            ['description', 'text', 'Max 300 chars'],
            ['verified', 'boolean', 'Default false — set by Admin'],
            ['verified_at', 'timestamptz', 'Nullable'],
            ['verified_by', 'uuid FK → profiles.id', 'Admin who verified'],
            ['stripe_customer_id', 'text', 'Stripe customer ID for billing'],
            ['rating_avg', 'numeric(3,2)', 'Computed from ratings table'],
          ]
        ),

        h2('6.4 shifts'),
        ...schemaTable('shifts', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['business_id', 'uuid FK → businesses.id', ''],
            ['title', 'text', ''],
            ['description', 'text', ''],
            ['district', 'text', ''],
            ['address', 'text', 'For map pin'],
            ['lat', 'numeric(9,6)', 'Latitude — populated on save via geocode'],
            ['lng', 'numeric(9,6)', 'Longitude'],
            ['shift_date', 'date', ''],
            ['start_time', 'time', ''],
            ['end_time', 'time', ''],
            ['pay_per_hour_cents', 'int', 'Stored in cents to avoid float errors'],
            ['workers_needed', 'int', 'Default 1'],
            ['workers_confirmed', 'int', 'Default 0'],
            ['skills_needed', 'text[]', ''],
            ['is_urgent', 'boolean', 'Default false'],
            ['status', "enum('open','filled','completed','cancelled')", 'Default open'],
            ['created_at', 'timestamptz', ''],
          ]
        ),

        h2('6.5 applications'),
        ...schemaTable('applications', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['shift_id', 'uuid FK → shifts.id', ''],
            ['student_id', 'uuid FK → students.id', ''],
            ['status', "enum('pending','accepted','rejected','completed','no_show')", 'Default pending'],
            ['applied_at', 'timestamptz', ''],
            ['responded_at', 'timestamptz', 'When business accepted/rejected'],
            ['stripe_payment_intent_id', 'text', 'Created when accepted'],
          ]
        ),

        h2('6.6 talent_pool'),
        ...schemaTable('talent_pool', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['business_id', 'uuid FK → businesses.id', ''],
            ['student_id', 'uuid FK → students.id', ''],
            ['added_at', 'timestamptz', ''],
            ['note', 'text', 'Private business note about the student'],
          ]
        ),

        h2('6.7 messages'),
        ...schemaTable('messages', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['conversation_id', 'uuid FK → conversations.id', ''],
            ['sender_id', 'uuid FK → profiles.id', ''],
            ['body', 'text', ''],
            ['sent_at', 'timestamptz', ''],
            ['read_at', 'timestamptz', 'Nullable — null = unread'],
          ]
        ),

        h2('6.8 conversations'),
        ...schemaTable('conversations', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['shift_id', 'uuid FK → shifts.id', ''],
            ['student_id', 'uuid FK → students.id', ''],
            ['business_id', 'uuid FK → businesses.id', ''],
            ['created_at', 'timestamptz', ''],
            ['last_message_at', 'timestamptz', ''],
          ]
        ),

        h2('6.9 ratings'),
        ...schemaTable('ratings', ['Column', 'Type', 'Notes'],
          [
            ['id', 'uuid PK', ''],
            ['shift_id', 'uuid FK → shifts.id', ''],
            ['rater_id', 'uuid FK → profiles.id', 'Who gave the rating'],
            ['rated_id', 'uuid FK → profiles.id', 'Who received the rating'],
            ['score', 'int', '1–5'],
            ['comment', 'text', 'Nullable, max 300 chars'],
            ['created_at', 'timestamptz', ''],
          ]
        ),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),
        p('Unique constraint on (shift_id, rater_id) — one rating per person per shift. Trigger updates students.reliability_score and businesses.rating_avg after insert.', { muted: true }),
        pageBreak(),

        // ── 7. API ROUTES ─────────────────────────────────────────────
        h1('7. API Routes (Next.js App Router)'),
        p('All API routes live under /app/api/. Authentication is verified on every request using Clerk\'s auth() helper. Role is checked against the profiles table for sensitive operations.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('7.1 Shifts'),
        ...schemaTable('', ['Method', 'Route', 'Auth', 'Description'],
          [
            ['GET', '/api/shifts', 'None', 'List open shifts with optional filters (district, date, pay, skills)'],
            ['POST', '/api/shifts', 'Business (verified)', 'Create a new shift — goes live immediately'],
            ['GET', '/api/shifts/[id]', 'None', 'Get a single shift with business info'],
            ['PATCH', '/api/shifts/[id]', 'Business (owner)', 'Edit shift details (only if status = open)'],
            ['DELETE', '/api/shifts/[id]', 'Business (owner) or Admin', 'Cancel shift — notifies accepted applicants'],
          ]
        ),

        h2('7.2 Applications'),
        ...schemaTable('', ['Method', 'Route', 'Auth', 'Description'],
          [
            ['POST', '/api/applications', 'Student', 'Apply to a shift'],
            ['GET', '/api/applications', 'Student or Business', 'List own applications or shift applicants'],
            ['PATCH', '/api/applications/[id]', 'Business (shift owner)', 'Accept or reject an applicant'],
            ['PATCH', '/api/applications/[id]/complete', 'Admin or Business', 'Mark application as completed'],
          ]
        ),

        h2('7.3 Messages'),
        ...schemaTable('', ['Method', 'Route', 'Auth', 'Description'],
          [
            ['GET', '/api/conversations', 'Student or Business', 'List own conversations'],
            ['GET', '/api/conversations/[id]/messages', 'Participant only', 'Get messages in a thread'],
            ['POST', '/api/conversations/[id]/messages', 'Participant only', 'Send a message'],
            ['POST', '/api/conversations', 'Business only', 'Create a new conversation (after accepting a student)'],
          ]
        ),

        h2('7.4 Ratings'),
        ...schemaTable('', ['Method', 'Route', 'Auth', 'Description'],
          [
            ['POST', '/api/ratings', 'Student or Business', 'Submit a rating — only allowed after shift status = completed'],
            ['GET', '/api/ratings/[userId]', 'Any auth', 'Get public ratings for a user'],
          ]
        ),

        h2('7.5 Admin'),
        ...schemaTable('', ['Method', 'Route', 'Auth', 'Description'],
          [
            ['GET', '/api/admin/stats', 'Admin', 'Platform-wide statistics'],
            ['PATCH', '/api/admin/businesses/[id]/verify', 'Admin', 'Verify or reject a business account'],
            ['PATCH', '/api/admin/users/[id]/suspend', 'Admin', 'Suspend or ban a user'],
            ['GET', '/api/admin/moderation', 'Admin', 'Fetch flagged content queue'],
          ]
        ),

        h2('7.6 Webhooks'),
        ...schemaTable('', ['Method', 'Route', 'Source', 'Description'],
          [
            ['POST', '/api/webhooks/clerk', 'Clerk', 'user.created → create profiles row; user.deleted → soft-delete'],
            ['POST', '/api/webhooks/stripe', 'Stripe', 'payment_intent.succeeded → mark application paid; payout events → update student earnings'],
          ]
        ),
        pageBreak(),

        // ── 8. PAYMENTS ───────────────────────────────────────────────
        h1('8. Payment Flow (Stripe Connect)'),
        new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

        h2('8.1 Architecture'),
        bullet('Pick a Shift is the platform operator — it holds funds in escrow via Stripe Connect'),
        bullet('Businesses are Stripe customers — charged after a shift is confirmed'),
        bullet('Students are Stripe Connect Express accounts — receive payouts after shift completion'),
        bullet('Platform takes a commission fee (e.g. 15%) on each transaction — configurable in env variable PLATFORM_FEE_PERCENT'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('8.2 Payment Lifecycle'),
        numbered('Business posts a shift — no charge yet'),
        numbered('Business accepts a student applicant → Stripe PaymentIntent created for (hours × rate × 1 + platform_fee); status: requires_capture'),
        numbered('Student completes the shift — business confirms completion in dashboard'),
        numbered('PaymentIntent captured → funds split: student amount transferred to their Connect account, platform fee retained'),
        numbered('Student payout: automatic via Stripe Express payout schedule (daily by default)'),
        numbered('Cancellation: if business cancels after acceptance, partial refund policy applies (configurable)'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('8.3 Student Onboarding to Stripe'),
        bullet('During student onboarding Step 5 (or from /earnings page): "Connect your bank account to receive payments"'),
        bullet('Redirects to Stripe Express onboarding (hosted by Stripe)'),
        bullet('On return: stripe_account_id saved to students table'),
        bullet('Students without a connected account can apply to shifts but cannot be paid until connected'),
        pageBreak(),

        // ── 9. DESIGN SYSTEM ──────────────────────────────────────────
        h1('9. Design System'),
        p('The design system is already implemented in styles.css and components.jsx (from the Claude Design prototype). This section defines the tokens and rules for v0/Cursor implementation.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('9.1 Color Tokens'),
        ...schemaTable('', ['Token', 'Value', 'Usage'],
          [
            ['--primary', '#E8401C', 'Brand red — CTAs, badges, active states, accent text'],
            ['--primary-dark', '#C9330F', 'Hover state for primary buttons'],
            ['--primary-tint', '#FDEDE8', 'Light red — badge backgrounds, focus rings'],
            ['--bg', '#F5F5F5', 'Page background'],
            ['--surface', '#FFFFFF', 'Cards, panels, modals'],
            ['--text', '#1A1A1A', 'Primary text'],
            ['--muted', '#6B6B6B', 'Secondary text, placeholders, labels'],
            ['--line', '#ECECEC', 'Dividers, card borders'],
            ['--line-strong', '#E2E2E2', 'Input borders, stronger dividers'],
            ['--green', '#1E9E5A', 'Success states, confirmed badges, positive trends'],
            ['--green-tint', '#E7F5ED', 'Success badge backgrounds'],
            ['--amber', '#E8A21C', 'Warning states'],
          ]
        ),

        h2('9.2 Typography'),
        twoCol('Font family', 'Inter (Google Fonts) — weights 400, 500, 600, 700, 800, 900'),
        twoCol('Hero headline', 'clamp(42px, 5.4vw, 68px) · weight 900 · tracking -0.03em'),
        twoCol('Section title', '32–40px · weight 900 · tracking -0.02em'),
        twoCol('Card title', '17–20px · weight 900 · tracking -0.01em'),
        twoCol('Body', '15–16px · weight 400 · line-height 1.6'),
        twoCol('Label / kicker', '11–12px · weight 800 · uppercase · tracking 0.05em'),
        twoCol('Button', '15px · weight 700'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('9.3 Spacing & Radius'),
        twoCol('Card border-radius', '12px'),
        twoCol('Button border-radius', '8px'),
        twoCol('Pill border-radius', '999px'),
        twoCol('Modal border-radius', '18px'),
        twoCol('Section padding', '64px vertical (desktop) · 48px (mobile)'),
        twoCol('Card padding', '20–24px'),
        twoCol('Max content width', '1180px'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('9.4 Shadows'),
        twoCol('--sh-1 (subtle)', '0 1px 2px rgba(20,20,20,.05)'),
        twoCol('--sh-2 (card hover)', '0 4px 16px rgba(20,20,20,.07)'),
        twoCol('--sh-3 (modal/float)', '0 12px 36px rgba(20,20,20,.12)'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('9.5 Component Rules'),
        bullet('ShiftCard: always includes business initials avatar, role title, date/time row, location row, pay + estimated total, Apply button'),
        bullet('URGENT badge: brand red background, flame icon, uppercase "URGENT" — use sparingly'),
        bullet('Confirmed badge: green background, dot indicator'),
        bullet('All form inputs: 1.5px border, var(--line-strong), focus ring in var(--primary-tint), transition 150ms'),
        bullet('All hover states on interactive elements must have a visible but subtle transition (150ms)'),
        bullet('Active nav link: var(--primary) color, no background on sidebar; brand-red underline on mobile bottom nav'),
        bullet('Toast notifications: dark (#1A1A1A) background, bottom-center, 2.6s auto-dismiss'),
        pageBreak(),

        // ── 10. NOTIFICATIONS ─────────────────────────────────────────
        h1('10. Notifications'),
        new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

        h2('10.1 In-Platform (Supabase Realtime)'),
        ...schemaTable('', ['Trigger', 'Recipient', 'Message'],
          [
            ['Business accepts application', 'Student', '"You got the shift at [Business]! Check your upcoming shifts."'],
            ['Business rejects application', 'Student', '"[Business] has filled this shift. Keep applying!"'],
            ['New applicant on shift', 'Business', '"[Student Name] applied to [Shift Title]"'],
            ['New message received', 'Both parties', '"New message from [Name]"'],
            ['Shift starts in 2 hours', 'Student', '"Reminder: your shift at [Business] starts at [Time]"'],
            ['Shift completed — rate now', 'Both parties', '"How was your experience with [Name]?"'],
            ['Business account verified', 'Business', '"Your account is verified. Post your first shift!"'],
          ]
        ),

        h2('10.2 Email (Resend)'),
        bullet('Account verification confirmation'),
        bullet('Application accepted / rejected'),
        bullet('Shift reminder (24h before shift start)'),
        bullet('Payment received (student) / charged (business)'),
        bullet('Business verification approved / rejected by Admin'),
        pageBreak(),

        // ── 11. BUILD ORDER ───────────────────────────────────────────
        h1('11. Recommended Build Order'),
        p('Follow this sequence to always have a working app at each stage. Never build a feature that depends on an unbuilt one.'),
        new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

        h2('Phase 1 — Foundation'),
        numbered('Next.js 14 project scaffold with TypeScript, Tailwind, folder structure'),
        numbered('Clerk integration — sign-in, sign-up, middleware, user object'),
        numbered('Supabase project — all tables from Section 6, RLS policies, Clerk webhook'),
        numbered('Design system — port styles.css tokens to Tailwind config, shared components'),
        numbered('Role-selection screen (/sign-up) and onboarding flows for both roles'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Phase 2 — Core Student Flow'),
        numbered('Landing page (static, no DB calls yet)'),
        numbered('Browse shifts page with filters — DB connected, no map yet'),
        numbered('Shift detail page (public, server-rendered)'),
        numbered('Student dashboard — stats, upcoming shifts, available shifts near you'),
        numbered('Apply to shift — applications table, status management'),
        numbered('My Applications page — tabs and status'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Phase 3 — Core Business Flow'),
        numbered('Business dashboard — stats, active listings'),
        numbered('Post a Shift — form, validation, instant live'),
        numbered('Manage Shifts — shift detail with applicant list'),
        numbered('Accept / Reject applicants — status updates, notifications'),
        numbered('Talent Pool — save and view students'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Phase 4 — Map, Payments, Messaging'),
        numbered('Mapbox integration — /browse map view, shift pins, student location'),
        numbered('Shift detail map embed'),
        numbered('Stripe Connect setup — business billing, student payouts'),
        numbered('Payment flow — PaymentIntent on accept, capture on complete'),
        numbered('In-platform messaging — conversations, real-time messages'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Phase 5 — Ratings, Notifications, Admin'),
        numbered('Two-way rating system — trigger after shift completion'),
        numbered('Reliability score computation — trigger in Supabase'),
        numbered('In-platform notifications — Supabase Realtime subscriptions'),
        numbered('Email notifications — Resend integration'),
        numbered('Admin dashboard — stats, verification queue, user management'),
        numbered('Moderation tools — flagging, suspension, content removal'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Phase 6 — Polish & Launch'),
        numbered('SEO — metadata, OpenGraph, sitemap.xml, robots.txt'),
        numbered('Performance — image optimization, lazy loading, caching headers'),
        numbered('Error states — empty states, 404, 500, loading skeletons'),
        numbered('Mobile QA — test every flow on iOS Safari and Android Chrome'),
        numbered('Analytics — Vercel Analytics or PostHog for product metrics'),
        numbered('Security audit — RLS policy review, rate limiting on API routes, input sanitization'),
        pageBreak(),

        // ── 12. ENV VARIABLES ─────────────────────────────────────────
        h1('12. Environment Variables'),
        p('Store all of these in .env.local (never commit to git). Add to Vercel dashboard for production.'),
        new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

        h2('Clerk'),
        mono('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY='),
        mono('CLERK_SECRET_KEY='),
        mono('CLERK_WEBHOOK_SECRET='),
        mono('NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in'),
        mono('NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up'),
        mono('NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard'),
        mono('NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Supabase'),
        mono('NEXT_PUBLIC_SUPABASE_URL='),
        mono('NEXT_PUBLIC_SUPABASE_ANON_KEY='),
        mono('SUPABASE_SERVICE_ROLE_KEY='),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Mapbox'),
        mono('NEXT_PUBLIC_MAPBOX_TOKEN='),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Stripe'),
        mono('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='),
        mono('STRIPE_SECRET_KEY='),
        mono('STRIPE_WEBHOOK_SECRET='),
        mono('PLATFORM_FEE_PERCENT=15'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('Resend (Email)'),
        mono('RESEND_API_KEY='),
        mono('RESEND_FROM_EMAIL=noreply@pickashift.es'),
        new Paragraph({ spacing: { before: 60, after: 0 }, children: [] }),

        h2('App'),
        mono('NEXT_PUBLIC_APP_URL=https://pickashift.es'),
        mono('NEXT_PUBLIC_GOOGLE_MAPS_KEY=   # optional — for geocoding only'),
        pageBreak(),

        // ── CLOSING ───────────────────────────────────────────────────
        h1('13. Notes & Decisions'),
        new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

        h2('Why Clerk over Supabase Auth'),
        p('Clerk handles the complex parts of auth out of the box: Google/Apple OAuth, email magic links, session management, device management, and a production-grade UI. The Clerk → Supabase webhook pattern (user.created fires → create profile row) is battle-tested and keeps the two systems in sync without custom auth code.'),

        h2('Why Supabase over PlanetScale / Neon'),
        p('Supabase gives you the database, realtime subscriptions, file storage, and edge functions in one platform. For a marketplace that needs real-time messaging and notifications, this eliminates the need for a separate WebSocket server (Pusher, Ably, etc.).'),

        h2('Why Mapbox over Google Maps'),
        p('Mapbox is significantly cheaper at scale for a startup, has better-looking default map styles that match the Pick a Shift design language, and the GL JS library gives more control over custom markers and clustering. The free tier covers 50,000 map loads per month.'),

        h2('Business Verification'),
        p('Shifts go live instantly — no admin approval needed per shift. However, businesses must be verified by an Admin before any of their shifts are visible to students. This protects students from fraudulent listings while keeping the posting experience frictionless for legitimate businesses. The typical verification time target is under 24 hours.'),

        h2('Reliability Score'),
        p('Reliability score is a weighted average: 60% from business ratings (1–5 stars), 40% from on-time arrival (no-shows decrease score significantly). It is recomputed by a Supabase database trigger after each new rating insert or no-show mark. Displayed as a decimal out of 5.0 and visible on student profiles to businesses.'),

        h2('Spanish Labour Law Note'),
        p('The platform connects students with businesses for short-term work. This is currently structured as introducing parties rather than as an employment agency, which has different regulatory implications in Spain. This is a commercial and legal decision that should be reviewed by a Spanish labour law advisor before launch. The MVP can proceed on the current model.'),

        divider(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 0 },
          children: [new TextRun({ text: 'End of Specification', size: 20, font: 'Arial', color: MUTED, italics: true })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 40, after: 0 },
          children: [new TextRun({ text: 'Pick a Shift · pickashift.es · pickashift@gmail.com', size: 18, font: 'Arial', color: MUTED })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/claude/PickAShift_Technical_Spec.docx', buf);
  console.log('Done — PickAShift_Technical_Spec.docx');
});
