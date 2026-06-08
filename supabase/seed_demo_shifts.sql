-- Pick a Shift — Demo Seed Data
-- Run in Supabase SQL editor to populate the browse page for beta launch.
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.
-- Dates are set to July–August 2026 so they remain in the future.

-- ─────────────────────────────────────────────
-- 1. Demo business profiles (Clerk-style TEXT ids)
-- ─────────────────────────────────────────────
INSERT INTO profiles (id, role, email, first_name, last_name, onboarding_complete, created_at)
VALUES
  ('demo_biz_cafe_central',    'business', 'hola@cafecentralmadrid.es',     'Café',      'Central',    TRUE, NOW()),
  ('demo_biz_lateral',         'business', 'rrhh@lateral.es',               'Lateral',   'Group',      TRUE, NOW()),
  ('demo_biz_mango',           'business', 'personal@mango.com',            'Mango',     'Store',      TRUE, NOW()),
  ('demo_biz_eventospro',      'business', 'staff@eventospromadrid.com',    'Eventos',   'Pro',        TRUE, NOW()),
  ('demo_biz_soho_house',      'business', 'jobs@sohohouse.com',            'Soho',      'House',      TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 2. Demo businesses
-- ─────────────────────────────────────────────
INSERT INTO businesses (id, business_name, business_type, district, address, description, verified, verified_at, shifts_posted)
VALUES
  (
    'demo_biz_cafe_central',
    'Café Central',
    'Hospitality',
    'Centro',
    'Plaza del Ángel, 10, 28012 Madrid',
    'Historic jazz café and restaurant in the heart of Madrid. One of the city''s most iconic venues since 1982.',
    TRUE, NOW(), 6
  ),
  (
    'demo_biz_lateral',
    'Lateral',
    'Hospitality',
    'Salamanca',
    'Calle de Velázquez, 57, 28001 Madrid',
    'Modern tapas bar chain with multiple locations across Madrid. Known for quality pintxos and a buzzing atmosphere.',
    TRUE, NOW(), 4
  ),
  (
    'demo_biz_mango',
    'Mango',
    'Retail',
    'Chamartín',
    'C.C. El Corte Inglés, Paseo de la Castellana, 79, 28046 Madrid',
    'International fashion retailer. Fast-paced floor team with regular need for weekend and event cover.',
    TRUE, NOW(), 3
  ),
  (
    'demo_biz_eventospro',
    'Eventos Pro Madrid',
    'Events',
    'Chamberí',
    'Calle de Alberto Aguilera, 23, 28015 Madrid',
    'Event production company specialising in corporate events, festivals, and private functions across Madrid.',
    TRUE, NOW(), 5
  ),
  (
    'demo_biz_soho_house',
    'Soho House Madrid',
    'Hospitality',
    'Malasaña',
    'Calle de la Palma, 10, 28004 Madrid',
    'Private members club and hotel in Malasaña. Rooftop pool, multiple restaurants, and regular private events.',
    TRUE, NOW(), 4
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 3. Demo shifts (15 shifts across July–August 2026)
-- ─────────────────────────────────────────────
INSERT INTO shifts (
  business_id, title, description, district, address,
  shift_date, start_time, end_time,
  pay_per_hour_cents, workers_needed, skills_needed, is_urgent, status
)
VALUES

-- Café Central (Centro) ──────────────────────
(
  'demo_biz_cafe_central',
  'Waiter / Floor Staff',
  'Cover for busy Friday evening service at Café Central. You will take orders, serve food and drinks, and maintain table presentation. Experience in a café or restaurant preferred. Smart casual dress code.',
  'Centro',
  'Plaza del Ángel, 10, 28012 Madrid',
  '2026-07-04', '19:00', '23:30',
  1050, 2, ARRAY['Waitering','Customer Service','Spanish'], FALSE, 'open'
),
(
  'demo_biz_cafe_central',
  'Barista',
  'Morning shift at our iconic jazz café. Prepare espresso drinks, manage the counter, and keep the bar area clean. We use a La Marzocco machine. Barista experience required.',
  'Centro',
  'Plaza del Ángel, 10, 28012 Madrid',
  '2026-07-11', '09:00', '14:00',
  1000, 1, ARRAY['Barista','Coffee','Customer Service'], FALSE, 'open'
),
(
  'demo_biz_cafe_central',
  'Event Waiter — Live Jazz Night',
  'Special event cover for our weekly Thursday jazz night. Full-room service, cocktail orders, and high volume. Smart dress required. Previous event experience strongly preferred.',
  'Centro',
  'Plaza del Ángel, 10, 28012 Madrid',
  '2026-07-17', '20:00', '01:00',
  1200, 3, ARRAY['Waitering','Events','Cocktails','English'], TRUE, 'open'
),

-- Lateral (Salamanca) ────────────────────────
(
  'demo_biz_lateral',
  'Bar Staff — Pintxos Counter',
  'Fast-paced bar shift at our Velázquez location. Plate up pintxos, pour drinks, keep the counter stocked, and handle cash and card payments. Tapas bar experience a plus.',
  'Salamanca',
  'Calle de Velázquez, 57, 28001 Madrid',
  '2026-07-05', '12:00', '17:00',
  1000, 2, ARRAY['Bar Work','Food Handling','Spanish'], FALSE, 'open'
),
(
  'demo_biz_lateral',
  'Waiter — Terrace Service',
  'Summer terrace service at our busy Salamanca location. You''ll manage a section of outdoor tables during lunch and early dinner. Bilingual (Spanish/English) preferred as we serve many international guests.',
  'Salamanca',
  'Calle de Velázquez, 57, 28001 Madrid',
  '2026-07-19', '13:00', '19:00',
  1050, 2, ARRAY['Waitering','English','Customer Service'], FALSE, 'open'
),
(
  'demo_biz_lateral',
  'Kitchen Porter',
  'Urgent cover needed for our kitchen porter. Duties include washing up, keeping kitchen stations clean, and supporting the prep team. No experience necessary — just reliability and energy.',
  'Salamanca',
  'Calle de Velázquez, 57, 28001 Madrid',
  '2026-07-07', '11:00', '16:00',
  926, 1, ARRAY['Kitchen','Cleaning'], TRUE, 'open'
),

-- Mango (Chamartín) ──────────────────────────
(
  'demo_biz_mango',
  'Sales Assistant — Weekend Cover',
  'Floor assistant at our El Corte Inglés Castellana store. Greet customers, assist with fitting rooms, manage floor stock, and process sales. Fashion retail experience preferred. Smart appearance required.',
  'Chamartín',
  'Paseo de la Castellana, 79, 28046 Madrid',
  '2026-07-12', '10:00', '18:00',
  1000, 3, ARRAY['Retail','Sales','English','Customer Service'], FALSE, 'open'
),
(
  'demo_biz_mango',
  'Stock Room Assistant',
  'Receive deliveries, process new stock, organise the stockroom, and replenish the shop floor. Physical role — you will be on your feet and lifting boxes. Comfortable shoes recommended.',
  'Chamartín',
  'Paseo de la Castellana, 79, 28046 Madrid',
  '2026-07-20', '07:00', '13:00',
  950, 2, ARRAY['Stockroom','Retail','Physical Work'], FALSE, 'open'
),

-- Eventos Pro (Chamberí) ─────────────────────
(
  'demo_biz_eventospro',
  'Event Staff — Corporate Gala',
  'Assist with setup, guest registration, and service at a corporate gala dinner for 200 guests at the Palacio de Cibeles. Smart formal attire required (we provide the vest). English essential.',
  'Centro',
  'Palacio de Cibeles, Plaza de Cibeles, 1, 28014 Madrid',
  '2026-07-10', '17:00', '00:00',
  1200, 5, ARRAY['Events','English','Customer Service','Formal Dress'], TRUE, 'open'
),
(
  'demo_biz_eventospro',
  'Brand Promoter — Street Campaign',
  'Represent a consumer brand in a weekend outdoor activation in Malasaña. Hand out samples, engage passersby, and complete a brief daily report. Outgoing personality essential.',
  'Malasaña',
  'Calle de Fuencarral, 28004 Madrid',
  '2026-07-26', '11:00', '17:00',
  1000, 4, ARRAY['Promotions','Sales','Spanish','Outgoing'], FALSE, 'open'
),
(
  'demo_biz_eventospro',
  'Festival Crew — Setup & Breakdown',
  'Physical crew role for a 2-day summer festival in the Casa de Campo. Day 1 is setup (tents, barriers, signage), Day 2 is breakdown. Wear comfortable work clothes. Steel-toe shoes provided.',
  'Casa de Campo',
  'Casa de Campo, 28011 Madrid',
  '2026-08-01', '08:00', '18:00',
  1100, 6, ARRAY['Manual Labour','Events','Physical Work'], FALSE, 'open'
),

-- Soho House (Malasaña) ──────────────────────
(
  'demo_biz_soho_house',
  'Rooftop Pool Bar Staff',
  'High-end rooftop bar service during peak summer season. Mix cocktails, serve drinks and light food, and maintain the bar. Experience in a premium venue is required. Smart dress code enforced.',
  'Malasaña',
  'Calle de la Palma, 10, 28004 Madrid',
  '2026-07-18', '14:00', '22:00',
  1300, 2, ARRAY['Bartending','Cocktails','English','Premium Service'], FALSE, 'open'
),
(
  'demo_biz_soho_house',
  'Event Host — Private Members Evening',
  'Welcome and assist members and guests at a private evening event. Front-of-house duties: coat check, guest list management, and escorting guests. Polished presentation and fluent English required.',
  'Malasaña',
  'Calle de la Palma, 10, 28004 Madrid',
  '2026-07-24', '19:00', '23:00',
  1300, 1, ARRAY['Hosting','English','Customer Service','Formal Dress'], FALSE, 'open'
),
(
  'demo_biz_soho_house',
  'Breakfast Service Waiter',
  'Early morning breakfast service for hotel guests and members. Set tables, take orders, serve food and coffee, and keep the dining area immaculate. Previous hotel or fine dining experience preferred.',
  'Malasaña',
  'Calle de la Palma, 10, 28004 Madrid',
  '2026-07-13', '07:30', '12:00',
  1150, 2, ARRAY['Waitering','Coffee','English','Hotel'], FALSE, 'open'
),
(
  'demo_biz_soho_house',
  'Kitchen Runner',
  'Support the kitchen and front-of-house teams during busy Saturday dinner service. Carry dishes from kitchen to tables, clear plates, and keep the pass moving efficiently. Fast-paced — energy required.',
  'Malasaña',
  'Calle de la Palma, 10, 28004 Madrid',
  '2026-07-25', '19:30', '00:00',
  1000, 2, ARRAY['Kitchen','Runner','Physical Work'], TRUE, 'open'
);
