import { MADRID_DISTRICTS } from './constants';

/** Approximate geographic centers of Madrid districts (lat, lng). */
export const MADRID_DISTRICT_COORDS: Record<(typeof MADRID_DISTRICTS)[number], { lat: number; lng: number }> = {
  Centro: { lat: 40.4168, lng: -3.7038 },
  Arganzuela: { lat: 40.3982, lng: -3.6962 },
  Retiro: { lat: 40.409, lng: -3.682 },
  Salamanca: { lat: 40.429, lng: -3.677 },
  Chamartín: { lat: 40.462, lng: -3.676 },
  Tetuán: { lat: 40.459, lng: -3.697 },
  Chamberí: { lat: 40.434, lng: -3.703 },
  'Fuencarral-El Pardo': { lat: 40.503, lng: -3.719 },
  'Moncloa-Aravaca': { lat: 40.435, lng: -3.738 },
  Latina: { lat: 40.389, lng: -3.745 },
  Carabanchel: { lat: 40.383, lng: -3.724 },
  Usera: { lat: 40.388, lng: -3.702 },
  'Puente de Vallecas': { lat: 40.391, lng: -3.655 },
  Moratalaz: { lat: 40.408, lng: -3.642 },
  'Ciudad Lineal': { lat: 40.448, lng: -3.642 },
  Hortaleza: { lat: 40.469, lng: -3.642 },
  Villaverde: { lat: 40.348, lng: -3.71 },
  'Villa de Vallecas': { lat: 40.367, lng: -3.618 },
  Vicálvaro: { lat: 40.404, lng: -3.606 },
  'San Blas-Canillejas': { lat: 40.431, lng: -3.606 },
  Barajas: { lat: 40.476, lng: -3.58 },
};

const DEFAULT_COORDS = MADRID_DISTRICT_COORDS.Centro;

export function getDistrictCoords(district: string): { lat: number; lng: number } {
  return MADRID_DISTRICT_COORDS[district as keyof typeof MADRID_DISTRICT_COORDS] ?? DEFAULT_COORDS;
}
