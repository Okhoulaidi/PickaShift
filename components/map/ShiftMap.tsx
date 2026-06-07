'use client';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';
import type { ShiftWithBusiness } from '@/lib/types';
import { formatPayHour } from '@/lib/utils';

const MADRID_CENTER: [number, number] = [-3.7038, 40.4168];
const DEFAULT_ZOOM = 12;

function toCoord(value: number | string | null | undefined): number | null {
  if (value == null) return null;
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function shiftsWithCoords(shifts: ShiftWithBusiness[]) {
  return shifts.filter((s) => {
    const lat = toCoord(s.lat);
    const lng = toCoord(s.lng);
    return lat != null && lng != null;
  });
}

export interface ShiftMapProps {
  shifts: ShiftWithBusiness[];
  selectedId?: string;
  onSelect?: (shift: ShiftWithBusiness) => void;
  className?: string;
  height?: string | number;
}

export function ShiftMap({
  shifts,
  selectedId,
  onSelect,
  className,
  height = 400,
}: ShiftMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: MADRID_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const located = shiftsWithCoords(shifts);

    located.forEach((shift) => {
      const lat = toCoord(shift.lat)!;
      const lng = toCoord(shift.lng)!;

      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'shift-map-pin';
      el.setAttribute('aria-label', `${shift.business.business_name} — ${shift.title}`);
      el.innerHTML = `<span class="shift-map-pin-dot${shift.is_urgent ? ' urgent' : ''}"></span>`;
      el.style.cssText =
        'background:none;border:none;padding:0;cursor:pointer;line-height:0;';

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 24, closeButton: false }).setHTML(
            `<div style="font-family:Inter,system-ui,sans-serif;padding:2px 0;">
              <div style="font-weight:800;font-size:14px;">${shift.business.business_name}</div>
              <div style="color:#6B6B6B;font-size:13px;margin-top:2px;">${shift.title}</div>
              <div style="font-weight:800;color:#E8401C;margin-top:6px;">${formatPayHour(shift.pay_per_hour_cents)}/hr</div>
            </div>`,
          ),
        )
        .addTo(map);

      el.addEventListener('click', () => onSelect?.(shift));
      markersRef.current.push(marker);
    });

    if (located.length === 1) {
      const s = located[0];
      map.flyTo({ center: [toCoord(s.lng)!, toCoord(s.lat)!], zoom: 14, duration: 800 });
    } else if (located.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      located.forEach((s) => bounds.extend([toCoord(s.lng)!, toCoord(s.lat)!]));
      map.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 800 });
    }
  }, [shifts, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const shift = shiftsWithCoords(shifts).find((s) => s.id === selectedId);
    if (!shift) return;

    map.flyTo({
      center: [toCoord(shift.lng)!, toCoord(shift.lat)!],
      zoom: 14,
      duration: 600,
    });
  }, [selectedId, shifts]);

  if (!token) {
    return (
      <div
        className={className}
        style={{
          height,
          borderRadius: 14,
          border: '1px solid var(--line)',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted)',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Map unavailable — set NEXT_PUBLIC_MAPBOX_TOKEN
      </div>
    );
  }

  return (
    <>
      <style>{`
        .shift-map-pin-dot {
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 50% 50% 50% 0;
          background: var(--primary);
          transform: rotate(-45deg);
          box-shadow: 0 4px 10px rgba(232, 64, 28, 0.35);
          border: 2px solid #fff;
        }
        .shift-map-pin-dot.urgent {
          background: #1A1A1A;
        }
        .shift-map-pin:hover .shift-map-pin-dot {
          transform: rotate(-45deg) scale(1.15);
        }
      `}</style>
      <div
        ref={containerRef}
        className={className}
        style={{
          height,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid var(--line)',
        }}
      />
    </>
  );
}
