// ============================================================
// TIRTA — WebGIS Map Page (True 3D MapLibre GL - Clean & Elegant)
// Tanpa Emoji — Teks Berkontras Tinggi & Elemen Vektor Presisi
// ============================================================
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { X, ChevronLeft, ChevronUp, ChevronDown, Layers, MapPin, Zap, RotateCcw, Navigation, ExternalLink, Compass, Truck, Play, Square, Droplet, HeartPulse, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getNearestSumberAir, getNearestRumahSakit } from '../data/sampleData';
import type { Desa } from '../types';

export const POSKO_MDMC = {
  nama: 'Posko Induk MDMC Banjarnegara',
  lat: -7.3995,
  lng: 109.6975,
  alamat: 'Jl. Letjend Suprapto No. 54, Banjarnegara',
};

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  destination: Desa;
  coordinates: [number, number][];
}

const CLUSTER_COLORS = {
  kritis:  '#ef4444',
  waspada: '#f59e0b',
  siaga:   '#10b981',
  default: '#38bdf8', // Sian cerah elegan untuk data lapangan mentah belum dianalisis
};

// Offset multi-arah agar popup tidak pernah bertumpuk dengan marker di semua orientasi kamera (top, bottom, samping)
const POPUP_OFFSETS: maplibregl.Offset = {
  'top': [0, 16],
  'top-left': [0, 16],
  'top-right': [0, 16],
  'bottom': [0, -44],
  'bottom-left': [0, -44],
  'bottom-right': [0, -44],
  'left': [16, -20],
  'right': [-16, -20],
  'center': [0, 0],
};

// Alur Koridor Geografis Sungai Serayu & Sungai Merawu Kabupaten Banjarnegara
export const SUNGAI_SERAYU_COORDS: [number, number][] = [
  [109.8550, -7.2050], // Dieng hulu
  [109.8320, -7.2340],
  [109.7950, -7.2850],
  [109.7700, -7.3450], // Sigaluh
  [109.7280, -7.3820], // Madukara / Bendung Banjarcahyana
  [109.6890, -7.4045], // Singomerto
  [109.6550, -7.4120], // Banjarnegara selatan
  [109.6200, -7.3920], // Bawang / Inlet Mrica
  [109.6105, -7.3912], // Waduk PB Soedirman (Mrica) Spillway
  [109.5630, -7.4520], // Purwanegara muara
  [109.4950, -7.4850], // Mandiraja hilir
];

export const SUNGAI_MERAWU_COORDS: [number, number][] = [
  [109.7850, -7.2150], // Wanayasa pegunungan utara
  [109.7340, -7.2845], // Karangkobar
  [109.7120, -7.3320], // Banjarmangu
  [109.6890, -7.4045], // Pertemuan DAS Serayu di Singomerto
];

export interface KecamatanSummary {
  namaKecamatan: string;
  lat: number;
  lng: number;
  totalDesa: number;
  kritisCount: number;
  waspadaCount: number;
  siagaCount: number;
  totalWarga: number;
  totalDefisit: number;
  dominantCluster: 'kritis' | 'waspada' | 'siaga' | 'default';
}

function getCircleColor(d: Desa): string {
  if (d.cluster) return CLUSTER_COLORS[d.cluster];
  return CLUSTER_COLORS.default;
}

export default function PetaWebGIS() {
  const {
    desaList,
    sumberAirList,
    rumahSakitList,
    posDugaAirList,
    musim,
    isAnalyzed,
    isAnalyzing,
    runAutomatedAnalysis,
    resetAnalysis,
  } = useApp();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // State
  const [selectedDesa, setSelectedDesa] = useState<Desa | null>(null);
  const [filter, setFilter] = useState<'semua' | 'kritis' | 'waspada' | 'siaga'>('semua');
  const [filterKecamatan, setFilterKecamatan] = useState<string>('semua');
  const [displayMode, setDisplayMode] = useState<'drilldown' | 'semua_desa'>('drilldown');
  const [showRumahSakit, setShowRumahSakit] = useState<boolean>(true);
  const [showSumberAir, setShowSumberAir] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [showDetailInMax, setShowDetailInMax] = useState<boolean>(true);
  const [basemap, setBasemap] = useState<'satellite' | 'osm'>('satellite');
  const [directRouteMode, setDirectRouteMode] = useState<boolean>(false);
  const directRouteModeRef = useRef<boolean>(false);
  const [showCameraGuide, setShowCameraGuide] = useState<boolean>(false);

  // In-App Routing & Embedded Map States
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  const [, setIsLoadingRoute] = useState<boolean>(false);
  const [showGmapsModal, setShowGmapsModal] = useState<Desa | null>(null);
  const [isSimulatingTruck, setIsSimulatingTruck] = useState<boolean>(false);
  const simMarkerRef = useRef<maplibregl.Marker | null>(null);
  const simFrameRef = useRef<number | null>(null);

  useEffect(() => {
    directRouteModeRef.current = directRouteMode;
  }, [directRouteMode]);

  // List of unique kecamatan
  const kecamatanList = useMemo(() => {
    return Array.from(new Set(desaList.map(d => d.namaKecamatan))).sort();
  }, [desaList]);

  // Aggregated summaries for all 20 kecamatan
  const kecamatanSummaries = useMemo<KecamatanSummary[]>(() => {
    const mapByKec: Record<string, Desa[]> = {};
    desaList.forEach(d => {
      if (!mapByKec[d.namaKecamatan]) mapByKec[d.namaKecamatan] = [];
      mapByKec[d.namaKecamatan].push(d);
    });

    return Object.entries(mapByKec).map(([namaKecamatan, desas]) => {
      const totalDesa = desas.length;
      const kritisCount = desas.filter(d => d.cluster === 'kritis').length;
      const waspadaCount = desas.filter(d => d.cluster === 'waspada').length;
      const siagaCount = desas.filter(d => d.cluster === 'siaga').length;
      const totalWarga = desas.reduce((s, d) => s + d.jumlahWarga, 0);
      const totalDefisit = desas.reduce((s, d) => s + d.defisitAir, 0);
      const avgLat = desas.reduce((s, d) => s + d.lat, 0) / totalDesa;
      const avgLng = desas.reduce((s, d) => s + d.lng, 0) / totalDesa;

      let dominantCluster: 'kritis' | 'waspada' | 'siaga' | 'default' = 'default';
      if (kritisCount > 0) dominantCluster = 'kritis';
      else if (waspadaCount > 0) dominantCluster = 'waspada';
      else if (siagaCount > 0) dominantCluster = 'siaga';

      return {
        namaKecamatan,
        lat: avgLat,
        lng: avgLng,
        totalDesa,
        kritisCount,
        waspadaCount,
        siagaCount,
        totalWarga,
        totalDefisit,
        dominantCluster,
      };
    }).sort((a, b) => a.namaKecamatan.localeCompare(b.namaKecamatan));
  }, [desaList]);

  // Camera info state
  const [cameraPitch, setCameraPitch] = useState<number>(60);
  const [cameraBearing, setCameraBearing] = useState<number>(-15);

  // 3D Tour state
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourIndex, setTourIndex] = useState<number>(0);
  const tourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Orbit 360 state
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const orbitFrameRef = useRef<number | null>(null);

  // Automated SPK Engine Pipeline State
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisSummary, setAnalysisSummary] = useState<{
    kritis: number;
    waspada: number;
    siaga: number;
    topDesa: (Desa & { rekomendasiTangki?: number }) | null;
  } | null>(null);

  const handleStartPipeline = useCallback(() => {
    setShowAnalysisModal(true);
    setAnalysisStep(1);

    setTimeout(() => {
      setAnalysisStep(2);

      setTimeout(() => {
        setAnalysisStep(3);

        setTimeout(() => {
          const res = runAutomatedAnalysis();
          const kritis = res.desa.filter(d => d.cluster === 'kritis').length;
          const waspada = res.desa.filter(d => d.cluster === 'waspada').length;
          const siaga = res.desa.filter(d => d.cluster === 'siaga').length;
          const topResult = res.topsis[0];
          const topDesa = topResult ? { ...topResult.desa, rekomendasiTangki: topResult.rekomendasiTangki } : null;

          setAnalysisSummary({ kritis, waspada, siaga, topDesa });
          setAnalysisStep(4);
        }, 350);
      }, 350);
    }, 350);
  }, [runAutomatedAnalysis]);

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: '&copy; Esri World Imagery',
            maxzoom: 17, // Cap at 17 to prevent Esri "Map data not yet available" dummy tiles, MapLibre will smoothly overzoom
          },
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
            maxzoom: 19,
          },
          'terrain-dem': {
            type: 'raster-dem',
            tiles: [
              'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
            ],
            encoding: 'terrarium',
            tileSize: 256,
            maxzoom: 15,
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            layout: {
              visibility: 'none',
            },
          },
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-tiles',
            layout: {
              visibility: 'visible',
            },
          },
        ],
        terrain: {
          source: 'terrain-dem',
          exaggeration: 1.8,
        },
      },
      center: [109.68, -7.38],
      zoom: 10.8,
      pitch: 45,
      bearing: -10,
      maxPitch: 85,
      maxZoom: 18,
      minZoom: 8,
    });

    // 3D Navigation Controls with Compass & Pitch visualizer
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-right');

    map.on('pitch', () => setCameraPitch(Math.round(map.getPitch())));
    map.on('rotate', () => setCameraBearing(Math.round(map.getBearing())));

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Basemap Layer Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      map.setLayoutProperty('satellite-layer', 'visibility', basemap === 'satellite' ? 'visible' : 'none');
      map.setLayoutProperty('osm-layer', 'visibility', basemap === 'osm' ? 'visible' : 'none');
    } else {
      map.once('style.load', () => {
        map.setLayoutProperty('satellite-layer', 'visibility', basemap === 'satellite' ? 'visible' : 'none');
        map.setLayoutProperty('osm-layer', 'visibility', basemap === 'osm' ? 'visible' : 'none');
      });
    }
  }, [basemap]);

  // Handle Resize on Maximize
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isMaximized, selectedDesa]);

  // Keyboard shortcut: ESC to exit fullscreen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  // Truck Simulation Controls
  const handleStopTruckSimulation = useCallback(() => {
    setIsSimulatingTruck(false);
    if (simFrameRef.current) cancelAnimationFrame(simFrameRef.current);
    if (simMarkerRef.current) {
      simMarkerRef.current.remove();
      simMarkerRef.current = null;
    }
  }, []);

  // Clear Active Route & Line Layers
  const handleClearRoute = useCallback(() => {
    setActiveRoute(null);
    handleStopTruckSimulation();
    const map = mapRef.current;
    if (map) {
      if (map.getLayer('route-line-glow')) map.removeLayer('route-line-glow');
      if (map.getLayer('route-line-main')) map.removeLayer('route-line-main');
      if (map.getLayer('route-line-casing')) map.removeLayer('route-line-casing');
      if (map.getSource('route-source')) map.removeSource('route-source');
    }
  }, [handleStopTruckSimulation]);

  // Load Real Road Route (OSRM with mountain pass fallback)
  const loadRouteForDesa = useCallback(async (desa: Desa) => {
    setIsLoadingRoute(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${POSKO_MDMC.lng},${POSKO_MDMC.lat};${desa.lng},${desa.lat}?overview=full&geometries=geojson`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const r = data.routes[0];
        setActiveRoute({
          distanceKm: Number((r.distance / 1000).toFixed(1)),
          durationMin: Math.max(12, Math.round(r.duration / 60)),
          destination: desa,
          coordinates: r.geometry.coordinates,
        });
      } else {
        throw new Error('OSRM route failed');
      }
    } catch {
      const pts = 30;
      const coords: [number, number][] = [];
      for (let i = 0; i <= pts; i++) {
        const t = i / pts;
        const lng = POSKO_MDMC.lng + (desa.lng - POSKO_MDMC.lng) * t + Math.sin(t * Math.PI) * 0.015;
        const lat = POSKO_MDMC.lat + (desa.lat - POSKO_MDMC.lat) * t + Math.sin(t * Math.PI * 2) * 0.008;
        coords.push([lng, lat]);
      }
      const dist = Math.sqrt(Math.pow((desa.lat - POSKO_MDMC.lat) * 111, 2) + Math.pow((desa.lng - POSKO_MDMC.lng) * 111, 2)) * 1.35;
      setActiveRoute({
        distanceKm: Number(dist.toFixed(1)),
        durationMin: Math.round(dist * 1.9),
        destination: desa,
        coordinates: coords,
      });
    } finally {
      setIsLoadingRoute(false);
    }
  }, []);

  // Animate 3D Truck Simulation along road polyline
  const handleStartTruckSimulation = useCallback(() => {
    if (!activeRoute || activeRoute.coordinates.length < 2) return;
    setIsSimulatingTruck(true);

    const map = mapRef.current;
    if (!map) return;

    const truckEl = document.createElement('div');
    truckEl.className = 'truck-sim-marker';
    truckEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 17h4V5H2v12h3m11 0h3l3-3v-4h-6v7zM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
      </svg>
    `;

    if (simMarkerRef.current) simMarkerRef.current.remove();
    const marker = new maplibregl.Marker({ element: truckEl })
      .setLngLat(activeRoute.coordinates[0])
      .addTo(map);
    simMarkerRef.current = marker;

    let step = 0;
    const totalSteps = activeRoute.coordinates.length;
    const speedMultiplier = Math.max(1, Math.floor(totalSteps / 180));

    function animate() {
      if (!activeRoute) return;
      step += speedMultiplier;
      if (step >= totalSteps) {
        step = totalSteps - 1;
        marker.setLngLat(activeRoute.coordinates[step]);
        setIsSimulatingTruck(false);
        return;
      }
      marker.setLngLat(activeRoute.coordinates[step]);
      simFrameRef.current = requestAnimationFrame(animate);
    }

    simFrameRef.current = requestAnimationFrame(animate);
  }, [activeRoute]);

  // Clean-up animation on unmount
  useEffect(() => {
    return () => {
      if (simFrameRef.current) cancelAnimationFrame(simFrameRef.current);
      if (simMarkerRef.current) simMarkerRef.current.remove();
    };
  }, []);

  // Update Route Polyline Layer on MapLibre
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateRouteLayer = () => {
      if (map.getLayer('route-line-glow')) map.removeLayer('route-line-glow');
      if (map.getLayer('route-line-main')) map.removeLayer('route-line-main');
      if (map.getLayer('route-line-casing')) map.removeLayer('route-line-casing');
      if (map.getSource('route-source')) map.removeSource('route-source');

      if (!activeRoute) return;

      map.addSource('route-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: activeRoute.coordinates,
          },
        },
      });

      map.addLayer({
        id: 'route-line-casing',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 8,
          'line-opacity': 0.75,
        },
      });

      map.addLayer({
        id: 'route-line-main',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 4.5,
        },
      });

      map.addLayer({
        id: 'route-line-glow',
        type: 'line',
        source: 'route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.8,
          'line-opacity': 0.9,
        },
      });
    };

    if (map.isStyleLoaded()) {
      updateRouteLayer();
    } else {
      map.once('style.load', updateRouteLayer);
    }
  }, [activeRoute]);

  // Update River & Hydrology Flowlines Layer on MapLibre (When in Rainy Season)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateRiverLayers = () => {
      // Remove existing river layers if present
      if (map.getLayer('river-merawu-main')) map.removeLayer('river-merawu-main');
      if (map.getLayer('river-merawu-glow')) map.removeLayer('river-merawu-glow');
      if (map.getSource('river-merawu')) map.removeSource('river-merawu');

      if (map.getLayer('river-serayu-main')) map.removeLayer('river-serayu-main');
      if (map.getLayer('river-serayu-glow')) map.removeLayer('river-serayu-glow');
      if (map.getSource('river-serayu')) map.removeSource('river-serayu');

      if (musim !== 'hujan') return;

      // Add Serayu River Source & Layers
      map.addSource('river-serayu', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Sungai Serayu' },
          geometry: { type: 'LineString', coordinates: SUNGAI_SERAYU_COORDS }
        }
      });

      map.addLayer({
        id: 'river-serayu-glow',
        type: 'line',
        source: 'river-serayu',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0284c7',
          'line-width': 10,
          'line-opacity': 0.65,
        }
      });

      map.addLayer({
        id: 'river-serayu-main',
        type: 'line',
        source: 'river-serayu',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 4.5,
        }
      });

      // Add Merawu River Source & Layers
      map.addSource('river-merawu', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Sungai Merawu' },
          geometry: { type: 'LineString', coordinates: SUNGAI_MERAWU_COORDS }
        }
      });

      map.addLayer({
        id: 'river-merawu-glow',
        type: 'line',
        source: 'river-merawu',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0369a1',
          'line-width': 8,
          'line-opacity': 0.6,
        }
      });

      map.addLayer({
        id: 'river-merawu-main',
        type: 'line',
        source: 'river-merawu',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#60a5fa',
          'line-width': 3.5,
        }
      });
    };

    if (map.isStyleLoaded()) {
      updateRiverLayers();
    } else {
      map.once('style.load', updateRiverLayers);
    }
  }, [musim]);

  // Fly Camera To Desa in Cinematic 3D + Auto Load Route
  const flyToDesa = useCallback((d: Desa) => {
    setSelectedDesa(d);
    loadRouteForDesa(d);
    mapRef.current?.flyTo({
      center: [d.lng, d.lat],
      zoom: 14.5,
      pitch: 65,
      bearing: ((mapRef.current?.getBearing() || 0) + 35) % 360,
      speed: 0.9,
      curve: 1.4,
      essential: true,
    });
  }, [loadRouteForDesa]);

  // Global Popup Handlers
  useEffect(() => {
    (window as any).__openGmapsModal = (desaId: string) => {
      const target = desaList.find(d => d.id === desaId);
      if (target) setShowGmapsModal(target);
    };
    (window as any).__loadRoute = (desaId: string) => {
      const target = desaList.find(d => d.id === desaId);
      if (target) flyToDesa(target);
    };
    return () => {
      delete (window as any).__openGmapsModal;
      delete (window as any).__loadRoute;
    };
  }, [desaList, flyToDesa]);

  // Set Camera Preset
  const setCameraPreset = useCallback((p: number, b: number, z = 12) => {
    mapRef.current?.flyTo({
      pitch: p,
      bearing: b,
      zoom: z,
      duration: 1200,
      essential: true,
    });
  }, []);

  // Continuous 360° Orbit Mode
  useEffect(() => {
    if (!isOrbiting) {
      if (orbitFrameRef.current) cancelAnimationFrame(orbitFrameRef.current);
      return;
    }
    const map = mapRef.current;
    if (!map) return;

    let active = true;
    function rotate() {
      if (!active || !mapRef.current) return;
      const current = mapRef.current.getBearing();
      mapRef.current.setBearing((current + 0.25) % 360);
      orbitFrameRef.current = requestAnimationFrame(rotate);
    }
    orbitFrameRef.current = requestAnimationFrame(rotate);

    return () => {
      active = false;
      if (orbitFrameRef.current) cancelAnimationFrame(orbitFrameRef.current);
    };
  }, [isOrbiting]);

  // Automatic 3D Fly-Through Tour of Critical Villages
  const kritisDesa = desaList.filter(d => d.cluster === 'kritis');

  useEffect(() => {
    if (!isTourActive || kritisDesa.length === 0) {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
      return;
    }

    const currentDesa = kritisDesa[tourIndex % kritisDesa.length];
    flyToDesa(currentDesa);

    tourTimerRef.current = setTimeout(() => {
      setTourIndex(prev => (prev + 1) % kritisDesa.length);
    }, 6000);

    return () => {
      if (tourTimerRef.current) clearTimeout(tourTimerRef.current);
    };
  }, [isTourActive, tourIndex, kritisDesa, flyToDesa]);

  // Toggle Maximize
  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => {
      const next = !prev;
      if (next) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  // Fly to kecamatan when selected
  useEffect(() => {
    if (filterKecamatan === 'semua' || !mapRef.current) return;
    const targetDesa = desaList.filter(d => d.namaKecamatan === filterKecamatan);
    if (targetDesa.length > 0) {
      const avgLat = targetDesa.reduce((s, d) => s + d.lat, 0) / targetDesa.length;
      const avgLng = targetDesa.reduce((s, d) => s + d.lng, 0) / targetDesa.length;
      mapRef.current.flyTo({
        center: [avgLng, avgLat],
        zoom: 13,
        pitch: 55,
        bearing: -10,
        essential: true,
      });
    }
  }, [filterKecamatan, desaList]);

  // Render 3D Markers (Tanpa Emoji - Elemen Vektor Elegan)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // ── STASIUN HIDROMETRI & POS DUGA AIR (Always visible when in Mode Musim Hujan) ──
    if (musim === 'hujan') {
      posDugaAirList.forEach(pos => {
        const statusColor = pos.status === 'siaga' ? '#ef4444' : pos.status === 'waspada' ? '#f59e0b' : '#10b981';
        const statusBg = pos.status === 'siaga' ? 'rgba(239,68,68,0.2)' : pos.status === 'waspada' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)';

        const pdaEl = document.createElement('div');
        pdaEl.className = 'pos-duga-air-marker';
        pdaEl.innerHTML = `
          <div class="pda-pill ${pos.status}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <span class="pda-title">${pos.nama.split('—')[0].replace('Pos Duga Air ', '')}</span>
            <span class="pda-badge" style="background:${statusBg};color:${statusColor};">${pos.debitAir} m³/s &bull; TMA ${pos.tma}m</span>
          </div>
          <div class="pda-stem" style="background:${statusColor};"></div>
          <div class="pda-dot" style="background:${statusColor};"></div>
        `;

        const pdaPopupHtml = `
          <div style="font-family:'Inter',sans-serif;width:290px;color:#ffffff;line-height:1.4;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);padding-right:26px;">
              <div>
                <div style="font-size:13.5px;font-weight:800;color:#ffffff;line-height:1.2;">
                  ${pos.nama}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:2px;">
                  ${pos.wilayahSungai}
                </div>
              </div>
              <span style="font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:999px;text-transform:uppercase;background:${statusBg};color:${statusColor};border:1px solid ${statusColor};flex-shrink:0;margin-right:4px;">
                ${pos.status.toUpperCase()}
              </span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Debit Aliran</div>
                <div style="font-size:13.5px;font-weight:800;color:#38bdf8;">
                  ${pos.debitAir} <span style="font-size:10px;font-weight:500;color:#94a3b8;">m³/s</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Tinggi Muka Air</div>
                <div style="font-size:13.5px;font-weight:800;color:${statusColor};">
                  ${pos.tma} <span style="font-size:10px;font-weight:500;color:#94a3b8;">m</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Curah Hujan 24J</div>
                <div style="font-size:12.5px;font-weight:800;color:#ffffff;">
                  ${pos.curahHujan24j} <span style="font-size:10px;font-weight:500;color:#94a3b8;">mm/hari</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Tren Aliran</div>
                <div style="font-size:12px;font-weight:800;color:#ffffff;">
                  ${pos.tren === 'naik' ? '↑ Naik' : '→ Stabil'}
                </div>
              </div>
            </div>

            ${pos.kapasitasWadukPersen !== undefined ? `
              <div style="background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.25);border-radius:6px;padding:6px 8px;margin-bottom:8px;">
                <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:#cbd5e1;margin-bottom:3px;">
                  <span>Kapasitas Waduk PB Soedirman</span>
                  <span style="color:#38bdf8;">${pos.kapasitasWadukPersen}%</span>
                </div>
                <div style="height:5px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
                  <div style="width:${pos.kapasitasWadukPersen}%;height:100%;background:linear-gradient(90deg,#0284c7,#38bdf8);"></div>
                </div>
              </div>
            ` : ''}

            <div style="font-size:10px;color:#cbd5e1;background:rgba(0,0,0,0.25);padding:6px 8px;border-radius:4px;margin-bottom:8px;">
              ${pos.keterangan}
            </div>

            <div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;background:linear-gradient(135deg, #0284c7, #0369a1);color:#ffffff;text-decoration:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(2,132,199,0.4);"
                title="Buka Navigasi Rute Google Maps ke Stasiun Ini"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                <span>Buka Rute Google Maps ke Pos Ini &rarr;</span>
              </a>
            </div>
          </div>
        `;

        const pdaPopup = new maplibregl.Popup({ offset: POPUP_OFFSETS, closeButton: true, maxWidth: '310px' }).setHTML(pdaPopupHtml);
        const pdaMarker = new maplibregl.Marker({ element: pdaEl, anchor: 'bottom' })
          .setLngLat([pos.lng, pos.lat])
          .setPopup(pdaPopup)
          .addTo(map);

        pdaEl.addEventListener('click', () => {
          map.flyTo({
            center: [pos.lng, pos.lat],
            zoom: 14,
            pitch: 60,
            bearing: -10,
            essential: true,
          });
        });

        markersRef.current.push(pdaMarker);
      });
    }

    if (displayMode === 'drilldown' && filterKecamatan === 'semua') {
      // ── LEVEL 1: RENDER 20 KECAMATAN CLUSTER CALLOUTS ──
      const filteredKec = kecamatanSummaries.filter(kec => {
        if (filter === 'semua') return true;
        if (filter === 'kritis') return kec.kritisCount > 0;
        if (filter === 'waspada') return kec.waspadaCount > 0;
        if (filter === 'siaga') return kec.siagaCount > 0;
        return true;
      });

      filteredKec.forEach(kec => {
        const isBelumDianalisis = kec.dominantCluster === 'default';
        const color = isBelumDianalisis ? '#38bdf8' : CLUSTER_COLORS[kec.dominantCluster];
        const statusBadge = isBelumDianalisis
          ? `<span class="kec-pill-badge" style="background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid rgba(56,189,248,0.35);">Siap Analisa</span>`
          : kec.kritisCount > 0
          ? `<span class="kec-pill-kritis">${kec.kritisCount} Kritis</span>`
          : kec.waspadaCount > 0
          ? `<span class="kec-pill-badge" style="background:rgba(245,158,11,0.2);color:#fbbf24;">${kec.waspadaCount} Waspada</span>`
          : `<span class="kec-pill-badge" style="background:rgba(16,185,129,0.2);color:#34d399;">${kec.siagaCount} Siaga</span>`;

        const el = document.createElement('div');
        el.className = 'kecamatan-cluster-marker';
        el.innerHTML = `
          <div class="kecamatan-cluster-pill ${kec.dominantCluster}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span class="kec-pill-title">Kec. ${kec.namaKecamatan}</span>
            <span class="kec-pill-badge">${kec.totalDesa} Desa</span>
            ${statusBadge}
          </div>
          <div class="kec-stem" style="background:${color};"></div>
          <div class="kec-pulse-dot" style="background:${color};color:${color};"></div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setFilterKecamatan(kec.namaKecamatan);
          map.flyTo({
            center: [kec.lng, kec.lat],
            zoom: 13.5,
            pitch: 60,
            bearing: -15,
            speed: 1.1,
            essential: true,
          });
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([kec.lng, kec.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    } else {
      // ── LEVEL 2: RENDER INDIVIDUAL VILLAGE CALLOUTS + POSKO INDUK MDMC ──
      // Render Posko Induk MDMC Banjarnegara Base Marker
      const poskoEl = document.createElement('div');
      poskoEl.className = 'posko-mdmc-marker';
      poskoEl.innerHTML = `
        <div class="posko-mdmc-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 17h4V5H2v12h3m11 0h3l3-3v-4h-6v7zM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
          <span style="font-weight:800;font-size:11px;color:#ffffff;">Posko Induk MDMC</span>
        </div>
        <div class="posko-stem"></div>
        <div class="posko-dot"></div>
      `;
      const poskoPopup = new maplibregl.Popup({ offset: POPUP_OFFSETS, closeButton: true }).setHTML(`
        <div style="font-family:'Inter',sans-serif;color:#ffffff;padding:6px 8px;width:220px;padding-right:20px;">
          <div style="font-size:12.5px;font-weight:800;color:#60a5fa;">Posko Induk MDMC Banjarnegara</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Pusat Logistik &amp; Armada Tangki Air Bersih</div>
          <div style="font-size:10px;color:#cbd5e1;margin-top:5px;border-top:1px solid rgba(255,255,255,0.1);padding-top:4px;">Jl. Letjend Suprapto No. 54, Banjarnegara</div>
        </div>
      `);
      const poskoMarker = new maplibregl.Marker({ element: poskoEl, anchor: 'bottom' })
        .setLngLat([POSKO_MDMC.lng, POSKO_MDMC.lat])
        .setPopup(poskoPopup)
        .addTo(map);
      markersRef.current.push(poskoMarker);

      const filtered = desaList.filter(d => {
        const matchFilter = filter === 'semua' || d.cluster === filter;
        const matchKec = filterKecamatan === 'semua' || d.namaKecamatan === filterKecamatan;
        return matchFilter && matchKec;
      });

      filtered.forEach(desa => {
        const isBelumDianalisis = !desa.cluster;
        const rawKerawanan = desa.statusKerawananHujan || 'waspada';
        const rawHujanColor = rawKerawanan === 'rawan_tinggi' ? '#ef4444' : (rawKerawanan === 'waspada' ? '#f59e0b' : '#10b981');
        const color = isBelumDianalisis 
          ? (musim === 'hujan' ? rawHujanColor : '#38bdf8') 
          : getCircleColor(desa);
        const clusterKey = desa.cluster || (musim === 'hujan' ? (rawKerawanan === 'rawan_tinggi' ? 'kritis' : rawKerawanan) : 'default');

        // Titik Air Terdekat & RS / Faskes Terdekat
        const nearestSumber = getNearestSumberAir(desa, sumberAirList);
        const nearestRs = getNearestRumahSakit(desa, rumahSakitList);

        // Demografi & Rasio Terdampak Riil (BPS Banjarnegara)
        const totalWarga = desa.totalWargaDesa || Math.round(Math.max(desa.jumlahWarga * 1.55, 2300));
        const totalKK = desa.totalKK || Math.round(totalWarga / 3.8);
        const kkTerdampak = desa.kkTerdampak || Math.round(desa.jumlahWarga / 3.8);
        const persenTerdampak = desa.persenTerdampak || Number(((desa.jumlahWarga / totalWarga) * 100).toFixed(1));

        // Marker element - Ultra-sleek compact pill to avoid overlapping
        const el = document.createElement('div');
        el.className = 'maplibre-callout-marker';
        const calloutBadgeText = musim === 'hujan'
          ? `${desa.kemiringanLereng}%`
          : `${desa.defisitAir > 0 ? (desa.defisitAir / 1000).toFixed(0) + 'k' : 'Aman'}`;

        el.innerHTML = `
          <div class="maplibre-callout-box ${clusterKey}" title="Klik untuk melihat detail & rute Desa ${desa.namaDesa}">
            <span class="callout-dot-indicator" style="background:${color};"></span>
            <span class="callout-name">${desa.namaDesa}</span>
            <span class="callout-tag" style="${isBelumDianalisis && musim !== 'hujan' ? 'background:rgba(56,189,248,0.2);color:#38bdf8;' : `background:rgba(255,255,255,0.08);color:${color};`}">${calloutBadgeText}</span>
          </div>
          <div class="callout-stem" style="background:${color};"></div>
          <div class="callout-pin-dot" style="background:${color};"></div>
        `;

        // Popup with ultra-clean, symmetrical executive design
        const clusterBadgeStyle = desa.cluster === 'kritis'
          ? 'background:rgba(239,68,68,0.16);color:#f87171;border:1px solid rgba(239,68,68,0.4);'
          : desa.cluster === 'waspada'
          ? 'background:rgba(245,158,11,0.16);color:#fbbf24;border:1px solid rgba(245,158,11,0.4);'
          : desa.cluster === 'siaga'
          ? 'background:rgba(16,185,129,0.16);color:#34d399;border:1px solid rgba(16,185,129,0.4);'
          : (musim === 'hujan'
              ? (rawKerawanan === 'rawan_tinggi'
                  ? 'background:rgba(239,68,68,0.16);color:#f87171;border:1px solid rgba(239,68,68,0.4);'
                  : rawKerawanan === 'waspada'
                  ? 'background:rgba(245,158,11,0.16);color:#fbbf24;border:1px solid rgba(245,158,11,0.4);'
                  : 'background:rgba(16,185,129,0.16);color:#34d399;border:1px solid rgba(16,185,129,0.4);')
              : 'background:rgba(56,189,248,0.16);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);');

        const clusterLabel = desa.cluster
          ? (musim === 'hujan'
            ? (desa.cluster === 'kritis' ? 'BAHAYA MERAH' : desa.cluster === 'waspada' ? 'WASPADA KUNING' : 'AMAN HIJAU')
            : desa.cluster.toUpperCase())
          : (musim === 'hujan'
            ? (rawKerawanan === 'rawan_tinggi' ? 'RAWAN TINGGI' : (rawKerawanan === 'waspada' ? 'WASPADA SEDANG' : 'RELATIF AMAN'))
            : 'Belum Dianalisis');

        const namaBencanaText = desa.jenisBencanaDominan === 'tanah_longsor'
          ? 'Tanah Longsor Tebing'
          : desa.jenisBencanaDominan === 'gerakan_tanah'
          ? 'Gerakan Tanah / Retakan'
          : desa.jenisBencanaDominan === 'banjir_luapan'
          ? 'Luapan Aliran Sungai Serayu'
          : 'Morfologi Relatif Aman';

        const popupHtml = `
        <div style="font-family:'Inter',sans-serif;width:290px;color:#ffffff;line-height:1.4;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.12);padding-right:26px;">
            <div>
              <div style="font-size:15px;font-weight:800;color:#ffffff;letter-spacing:0.01em;line-height:1.2;">
                ${desa.namaDesa}
              </div>
              <div style="font-size:11.5px;color:#94a3b8;font-weight:500;margin-top:2px;">
                Kecamatan ${desa.namaKecamatan}
              </div>
            </div>
            <span style="display:inline-flex;align-items:center;gap:4px;font-size:9.5px;font-weight:800;letter-spacing:0.06em;padding:3px 8px;border-radius:999px;text-transform:uppercase;${clusterBadgeStyle};margin-right:4px;">
              <span style="width:5px;height:5px;border-radius:50%;background:currentColor;"></span>
              ${clusterLabel}
            </span>
          </div>

          ${musim === 'hujan' ? `
            <!-- 2x2 Metric Tiles Musim Hujan -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:8px;">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Curah Hujan 24J</div>
                <div style="font-size:13px;font-weight:800;color:#38bdf8;">
                  ${desa.curahHujan} <span style="font-size:10px;font-weight:500;color:#94a3b8;">mm</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Kemiringan Lereng</div>
                <div style="font-size:13px;font-weight:800;color:${(desa.kemiringanLereng || 0) > 30 ? 'var(--critical)' : 'var(--warning)'};">
                  ${desa.kemiringanLereng}%
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Warga Berisiko</div>
                <div style="font-size:13px;font-weight:800;color:#ffffff;">
                  ${desa.wargaTerancam?.toLocaleString('id-ID')} <span style="font-size:10px;font-weight:500;color:#94a3b8;">jiwa</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Kerentanan PVMBG</div>
                <div style="font-size:13px;font-weight:800;color:${color};">
                  Skala ${desa.indeksLongsor}/5
                </div>
              </div>
            </div>

            <!-- Kartu Deteksi Potensi Bencana -->
            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:7px 10px;margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                <span style="font-size:9px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Deteksi Potensi Bencana</span>
                <span style="font-size:9.5px;color:#38bdf8;font-weight:600;">DAS: ${desa.jarakSungai} km</span>
              </div>
              <div style="font-size:12px;font-weight:800;color:#ffffff;letter-spacing:0.01em;">
                ${namaBencanaText}
              </div>
              <div style="font-size:10px;color:#cbd5e1;margin-top:3px;line-height:1.35;">
                ${desa.detailPotensiBencana || 'Pemantauan morfologi topografi'}
              </div>
            </div>

            <!-- Rekomendasi Logistik & Relawan -->
            <div style="background:rgba(2,132,199,0.08);border:1px solid rgba(2,132,199,0.25);border-radius:6px;padding:6px 9px;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
              <div style="flex:1;">
                <div style="font-size:9px;color:#38bdf8;font-weight:700;text-transform:uppercase;">Rekomendasi Penanganan</div>
                <div style="font-size:10.5px;color:#ffffff;font-weight:500;line-height:1.3;margin-top:1px;">
                  ${desa.kebutuhanLogistikHujan}
                </div>
              </div>
            </div>
          ` : `
            <!-- 2x2 Metric Tiles Musim Kemarau -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:8px;">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                  <span style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">Warga Terdampak</span>
                  <span style="font-size:9.5px;font-weight:800;color:#38bdf8;background:rgba(56,189,248,0.15);padding:1px 5px;border-radius:4px;">${persenTerdampak}%</span>
                </div>
                <div style="font-size:13px;font-weight:800;color:#ffffff;">
                  ${desa.jumlahWarga.toLocaleString('id-ID')} <span style="font-size:10px;font-weight:500;color:#94a3b8;">jiwa</span>
                </div>
                <div style="font-size:9px;color:#94a3b8;margin-top:2px;">
                  dari ${totalWarga.toLocaleString('id-ID')} total warga
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;">Defisit Air Harian</div>
                <div style="font-size:13px;font-weight:800;color:${color};">
                  ${desa.defisitAir.toLocaleString('id-ID')} <span style="font-size:10px;font-weight:500;color:#94a3b8;">L</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;">Durasi Kekeringan</div>
                <div style="font-size:13px;font-weight:800;color:#ffffff;">
                  ${desa.durasiKekeringan} <span style="font-size:10px;font-weight:500;color:#94a3b8;">hari</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:7px 9px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;">Jarak Titik Air</div>
                <div style="font-size:13px;font-weight:800;color:#ffffff;">
                  ${desa.jarakSumber} <span style="font-size:10px;font-weight:500;color:#94a3b8;">km</span>
                </div>
              </div>
            </div>

            <!-- Total KK Row -->
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 9px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:10px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.03em;">Kepala Keluarga (KK):</span>
              <span style="font-size:11.5px;font-weight:700;color:#ffffff;">
                <strong style="#fbbf24;">${kkTerdampak.toLocaleString('id-ID')} KK</strong>
                <span style="color:#94a3b8;font-weight:400;font-size:10px;"> / ${totalKK.toLocaleString('id-ID')} total KK</span>
              </span>
            </div>
          `}

          <!-- SPK TOPSIS Priority Footer -->
          ${desa.topsisScore !== undefined ? `
            <div style="background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.22);border-radius:6px;padding:7px 10px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">Skor Prioritas TOPSIS</div>
                <div style="font-size:13px;font-weight:800;color:#38bdf8;font-family:'JetBrains Mono',monospace;">${desa.topsisScore.toFixed(4)}</div>
              </div>
              <div style="text-align:right;">
                <span style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#ffffff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:4px;letter-spacing:0.04em;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                  PRIORITAS #${desa.rank}
                </span>
              </div>
            </div>
          ` : `
            <div style="background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.2);border-radius:6px;padding:7px 10px;display:flex;justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.04em;">Status SPK</div>
                <div style="font-size:11.5px;font-weight:700;color:#38bdf8;">Menunggu Analisis</div>
              </div>
              <span style="font-size:9.5px;color:#94a3b8;">Siap K-Means + TOPSIS</span>
            </div>
          `}

          <!-- Titik Pasokan Air & RS / Faskes Terdekat -->
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;gap:6px;">
            <!-- Titik Air -->
            <div style="background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.22);border-radius:6px;padding:6px 8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:4px;">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                  <span style="font-size:9.5px;font-weight:700;color:#38bdf8;text-transform:uppercase;">Titik Air Terdekat</span>
                </div>
                <span style="font-size:10.5px;font-weight:800;color:#38bdf8;">${nearestSumber.jarakKm} km</span>
              </div>
              <div style="font-size:11.5px;font-weight:700;color:#ffffff;margin-top:2px;">${nearestSumber.sumber.nama}</div>
              <div style="font-size:9.5px;color:#94a3b8;margin-top:1px;display:flex;justify-content:space-between;">
                <span>${nearestSumber.sumber.jenis.replace('_', ' ')}</span>
                <span style="color:#10b981;font-weight:600;">Stok ${(nearestSumber.sumber.stokSaat / 1000).toFixed(0)}k L</span>
              </div>
            </div>

            <!-- RS / Faskes Terdekat -->
            <div style="background:rgba(244,63,94,0.08);border:1px solid rgba(244,63,94,0.25);border-radius:6px;padding:6px 8px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="display:flex;align-items:center;gap:4px;">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
                  <span style="font-size:9.5px;font-weight:700;color:#fb7185;text-transform:uppercase;">RS / Faskes Terdekat</span>
                </div>
                <span style="font-size:10.5px;font-weight:800;color:#fb7185;">${nearestRs.jarakKm} km &bull; ~${nearestRs.estWaktuMenit} mnt</span>
              </div>
              <div style="font-size:11.5px;font-weight:700;color:#ffffff;margin-top:2px;">${nearestRs.rs.nama}</div>
              <div style="font-size:9.5px;color:#cbd5e1;margin-top:1px;display:flex;justify-content:space-between;">
                <span>${nearestRs.rs.kelas.split('(')[0].trim()}</span>
                <span style="color:#fb7185;font-weight:600;">UGD: ${nearestRs.rs.telepon}</span>
              </div>
            </div>
          </div>

          <!-- Navigasi Rute Google Maps -->
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">
            <button
              onclick="window.__openGmapsModal('${desa.id}')"
              style="display:flex;align-items:center;justify-content:center;gap:7px;width:100%;box-sizing:border-box;background:linear-gradient(135deg, #0284c7, #0369a1);color:#ffffff;border:none;padding:7px 12px;border-radius:6px;font-size:11.5px;font-weight:700;box-shadow:0 2px 8px rgba(2,132,199,0.4);cursor:pointer;transition:all 0.2s ease;"
              title="Tampilkan Peta Rute Google Maps Interaktif Langsung di Web"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              <span>Tampilkan Peta Rute di Sini (In-App)</span>
            </button>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${desa.lat},${desa.lng}"
              target="_blank"
              rel="noopener noreferrer"
              style="display:flex;align-items:center;justify-content:center;gap:7px;width:100%;box-sizing:border-box;background:rgba(255,255,255,0.06);color:#93c5fd;border:1px solid rgba(147,197,253,0.3);text-decoration:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;transition:all 0.2s ease;"
              title="Buka Navigasi Rute Google Maps di Tab Baru"
            >
              <span>Buka di Tab Google Maps Baru &rarr;</span>
            </a>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: POPUP_OFFSETS, closeButton: true, maxWidth: '320px' }).setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([desa.lng, desa.lat])
        .setPopup(popup)
        .addTo(map);

      // Single click: If directRouteMode is ON, immediately open Google Maps; otherwise inspect & fly
      el.addEventListener('click', (e) => {
        if (directRouteModeRef.current) {
          e.stopPropagation();
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${desa.lat},${desa.lng}`, '_blank');
        } else {
          flyToDesa(desa);
        }
      });

      // Double click: Always immediately open Google Maps navigation route in new tab
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${desa.lat},${desa.lng}`, '_blank');
      });

      markersRef.current.push(marker);
    });
  }

    // ── SUMBER AIR MARKERS (Titik Pasokan Air MDMC) ──
    if (showSumberAir) {
      sumberAirList.forEach(s => {
        const el = document.createElement('div');
        el.className = 'maplibre-callout-marker';
        el.innerHTML = `
          <div class="maplibre-callout-box sumber" title="Sumber Air MDMC: ${s.nama}">
            <span class="callout-dot-indicator" style="background:#06b6d4;"></span>
            <span class="callout-name" style="color:#38bdf8;">${s.nama}</span>
            <span class="callout-tag">${(s.stokSaat / 1000).toFixed(0)}k</span>
          </div>
          <div class="callout-stem" style="background:#06b6d4;"></div>
          <div class="callout-pin-dot" style="background:#06b6d4;"></div>
        `;

        const popupHtml = `
          <div style="font-family:'Inter',sans-serif;width:260px;color:#ffffff;line-height:1.4;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);padding-right:24px;">
              <div>
                <div style="font-size:13.5px;font-weight:800;color:#ffffff;line-height:1.2;">
                  ${s.nama}
                </div>
                <div style="font-size:11px;color:#06b6d4;font-weight:600;text-transform:uppercase;margin-top:2px;">
                  ${s.jenis.replace('_', ' ')}
                </div>
              </div>
              <span style="font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:999px;background:rgba(16,185,129,0.16);color:#34d399;border:1px solid rgba(16,185,129,0.4);text-transform:uppercase;flex-shrink:0;">
                Aktif
              </span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Kapasitas Pasokan</div>
                <div style="font-size:13px;font-weight:800;color:#38bdf8;">${(s.kapasitas / 1000).toFixed(0)}k <span style="font-size:9.5px;font-weight:400;color:#94a3b8;">L/hr</span></div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Stok Tersedia</div>
                <div style="font-size:13px;font-weight:800;color:#10b981;">${(s.stokSaat / 1000).toFixed(0)}k <span style="font-size:9.5px;font-weight:400;color:#94a3b8;">L</span></div>
              </div>
            </div>

            <div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;background:linear-gradient(135deg, #0284c7, #0369a1);color:#ffffff;text-decoration:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;"
              >
                <span>Rute Pengambilan Air Google Maps &rarr;</span>
              </a>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: POPUP_OFFSETS, closeButton: true, maxWidth: '290px' }).setHTML(popupHtml);
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([s.lng, s.lat])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener('click', () => {
          map.flyTo({
            center: [s.lng, s.lat],
            zoom: 14,
            pitch: 50,
            bearing: 0,
            essential: true,
          });
        });

        markersRef.current.push(marker);
      });
    }

    // ── RUMAH SAKIT & FASKES DARURAT (MDMC, RSUD & Rujukan) ──
    if (showRumahSakit) {
      rumahSakitList.forEach(rs => {
        const rsEl = document.createElement('div');
        rsEl.className = 'rs-marker';
        rsEl.innerHTML = `
          <div class="rs-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20"/>
            </svg>
            <span class="rs-title">${rs.nama.replace(/\(.*?\)/g, '').trim()}</span>
            <span class="rs-badge">${rs.kapasitasTT} TT</span>
          </div>
          <div class="rs-stem"></div>
          <div class="rs-dot"></div>
        `;

        const rsPopupHtml = `
          <div style="font-family:'Inter',sans-serif;width:290px;color:#ffffff;line-height:1.4;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.12);padding-right:26px;">
              <div>
                <div style="font-size:13.5px;font-weight:800;color:#ffffff;line-height:1.2;">
                  ${rs.nama}
                </div>
                <div style="font-size:11px;color:#fb7185;font-weight:600;margin-top:2px;">
                  ${rs.tipe} &bull; ${rs.kelas}
                </div>
              </div>
              <span style="font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:999px;background:rgba(244,63,94,0.2);color:#fb7185;border:1px solid rgba(244,63,94,0.4);flex-shrink:0;">
                UGD 24J
              </span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Kapasitas Rawat</div>
                <div style="font-size:13px;font-weight:800;color:#38bdf8;">
                  ${rs.kapasitasTT} <span style="font-size:10px;font-weight:500;color:#94a3b8;">Tempat Tidur</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;">
                <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Ambulans Siaga</div>
                <div style="font-size:13px;font-weight:800;color:#10b981;">
                  ${rs.ambulansSiaga} <span style="font-size:10px;font-weight:500;color:#94a3b8;">Unit Armada</span>
                </div>
              </div>
            </div>

            <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:6px 8px;margin-bottom:8px;">
              <div style="font-size:9px;font-weight:600;color:#94a3b8;text-transform:uppercase;">Layanan Medis</div>
              <div style="font-size:10.5px;color:#cbd5e1;margin-top:2px;line-height:1.35;">${rs.layananUGD}</div>
            </div>

            <div style="font-size:10.5px;color:#94a3b8;margin-bottom:8px;">
              <div>${rs.alamat}</div>
              <div style="color:#ffffff;font-weight:700;margin-top:2px;">Hotline Darurat: <a href="tel:${rs.telepon.replace(/[^0-9]/g, '')}" style="color:#38bdf8;text-decoration:none;">${rs.telepon}</a></div>
            </div>

            <div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${rs.lat},${rs.lng}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;background:linear-gradient(135deg, #e11d48, #be123c);color:#ffffff;text-decoration:none;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(225,29,72,0.4);"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                <span>Rute Evakuasi Google Maps &rarr;</span>
              </a>
            </div>
          </div>
        `;

        const rsPopup = new maplibregl.Popup({ offset: POPUP_OFFSETS, closeButton: true, maxWidth: '310px' }).setHTML(rsPopupHtml);
        const rsMarker = new maplibregl.Marker({ element: rsEl, anchor: 'bottom' })
          .setLngLat([rs.lng, rs.lat])
          .setPopup(rsPopup)
          .addTo(map);

        rsEl.addEventListener('click', () => {
          map.flyTo({
            center: [rs.lng, rs.lat],
            zoom: 14.5,
            pitch: 55,
            bearing: -5,
            essential: true,
          });
        });

        markersRef.current.push(rsMarker);
      });
    }

  }, [desaList, sumberAirList, rumahSakitList, filter, filterKecamatan, displayMode, showRumahSakit, showSumberAir, kecamatanSummaries, flyToDesa]);

  return (
    <div className={isMaximized ? 'tirta-map-maximized' : ''}>
      {/* Page Header (hidden in maximized view) */}
      {!isMaximized && (
        <div className="page-header" style={{ marginBottom: 14 }}>
          <div className="page-header-text">
            <h1>Peta WebGIS 3D Spasial (Terrain &amp; Kamera Bebas)</h1>
            <p>Visualisasi spasial 3D elevasi topografi Kabupaten Banjarnegara tanpa distorsi</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Tombol Utama Mesin Otomatisasi SPK */}
            <button
              className={`btn ${!isAnalyzed ? 'pulse-glow-btn' : ''}`}
              onClick={handleStartPipeline}
              disabled={isAnalyzing}
              style={{
                background: !isAnalyzed
                  ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                boxShadow: !isAnalyzed
                  ? '0 0 20px rgba(56, 189, 248, 0.45)'
                  : '0 0 16px rgba(16, 185, 129, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <Zap size={16} />
              <span>{!isAnalyzed ? 'Jalankan Analisa SPK (K-Means & TOPSIS)' : 'Update / Hitung Ulang Analisa'}</span>
            </button>

            {isAnalyzed && (
              <button
                className="btn btn-secondary"
                onClick={resetAnalysis}
                title="Reset kembali ke data mentah (belum dianalisis)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RotateCcw size={14} />
                <span>Reset Data</span>
              </button>
            )}

            <button
              className={`btn ${isTourActive ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => {
                if (!isAnalyzed) {
                  handleStartPipeline();
                } else {
                  setIsTourActive(prev => !prev);
                }
              }}
            >
              {isTourActive ? 'Hentikan Tur 3D' : 'Mulai Tur 3D Otomatis'}
            </button>
            <button className="btn btn-secondary" onClick={toggleMaximize}>
              Fullscreen / Perbesar
            </button>
          </div>
        </div>
      )}

      {/* Filter & Status Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Display Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-card)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginRight: 6 }}>
            <button
              className={`btn btn-xs ${displayMode === 'drilldown' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setDisplayMode('drilldown');
              }}
              title="Tampilkan per kecamatan (klik kecamatan untuk memecah desanya)"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Layers size={12} /> Klaster Kecamatan (Mecah)
            </button>
            <button
              className={`btn btn-xs ${displayMode === 'semua_desa' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setDisplayMode('semua_desa');
              }}
              title="Tampilkan seluruh 266 desa sekaligus"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <MapPin size={12} /> Semua 266 Desa
            </button>
          </div>

          {(['semua', 'kritis', 'waspada', 'siaga'] as const).map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}

          <select
            value={filterKecamatan}
            onChange={e => setFilterKecamatan(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              marginLeft: 4,
            }}
          >
            <option value="semua">Semua Kecamatan (20)</option>
            {kecamatanList.map(kec => (
              <option key={kec} value={kec}>Kec. {kec}</option>
            ))}
          </select>

          {/* Layer toggles: Rumah Sakit & Titik Air */}
          <button
            className={`btn btn-xs ${showRumahSakit ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setShowRumahSakit(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: showRumahSakit ? 'rgba(244, 63, 94, 0.2)' : undefined,
              borderColor: showRumahSakit ? '#f43f5e' : undefined,
              color: showRumahSakit ? '#fb7185' : undefined,
            }}
            title="Tampilkan / Sembunyikan Marker Rumah Sakit & Faskes"
          >
            <HeartPulse size={12} /> RS ({rumahSakitList.length})
          </button>

          <button
            className={`btn btn-xs ${showSumberAir ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowSumberAir(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: showSumberAir ? 'rgba(6, 182, 212, 0.2)' : undefined,
              borderColor: showSumberAir ? '#06b6d4' : undefined,
              color: showSumberAir ? '#38bdf8' : undefined,
            }}
            title="Tampilkan / Sembunyikan Marker Titik Pasokan Air"
          >
            <Droplet size={12} /> Titik Air ({sumberAirList.length})
          </button>
        </div>

        {/* Camera Info Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-info">
            Pitch: {cameraPitch}°
          </span>
          <span className="badge badge-info">
            Bearing: {cameraBearing}°
          </span>
          <span className="badge badge-safe">
            Elevasi Terrain 3D: Aktif (1.8x)
          </span>
          <span className={`badge ${!isAnalyzed ? 'badge-warning' : 'badge-safe'}`}>
            {!isAnalyzed ? 'Belum Dianalisis (266 Data Siap)' : `Teranalisis (${desaList.filter(d => d.cluster === 'kritis').length} Kritis)`}
          </span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span><span className="cluster-dot cluster-kritis" /> Kritis ({desaList.filter(d => d.cluster === 'kritis').length})</span>
          <span><span className="cluster-dot cluster-waspada" /> Waspada ({desaList.filter(d => d.cluster === 'waspada').length})</span>
          <span><span className="cluster-dot cluster-siaga" /> Siaga ({desaList.filter(d => d.cluster === 'siaga').length})</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#06b6d4' }} /> Titik Air ({sumberAirList.length})</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }} /> RS / Faskes ({rumahSakitList.length})</span>

          {isMaximized && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-xs ${!isAnalyzed ? 'pulse-glow-btn' : 'btn-primary'}`}
                onClick={handleStartPipeline}
                style={{
                  background: !isAnalyzed ? 'linear-gradient(135deg, #0284c7, #2563eb)' : undefined,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Zap size={12} />
                {!isAnalyzed ? 'Jalankan Analisa SPK' : 'Update Analisa'}
              </button>
              {selectedDesa && (
                <button
                  className="btn btn-xs btn-secondary"
                  onClick={() => setShowDetailInMax(prev => !prev)}
                >
                  {showDetailInMax ? 'Sembunyikan Panel' : 'Panel Detail'}
                </button>
              )}
              <button
                className="btn btn-xs btn-danger"
                onClick={toggleMaximize}
                title="Keluar dari Fullscreen (Esc)"
              >
                Keluar Fullscreen (Esc)
              </button>
            </div>
          )}
        </div>
      </div>

      {!isAnalyzed && !isMaximized && (
        <div className="alert alert-info" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong>Peta Spasial Aktif:</strong> Seluruh 266 data desa di 20 kecamatan telah siap pada peta 3D.
            Data saat ini berstatus <strong>Data Mentah Lapangan (Belum Dianalisis)</strong>. Klik tombol untuk memulai klasifikasi K-Means Clustering &amp; Rekomendasi TOPSIS.
          </div>
          <button
            className="btn btn-sm btn-primary pulse-glow-btn"
            onClick={handleStartPipeline}
            style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <Zap size={14} />
            Mulai Analisa Otomatis Sekarang
          </button>
        </div>
      )}

      {/* Main Map + Panel Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: (!isMaximized && selectedDesa) ? '1fr 310px' : '1fr',
          gap: 16,
          flex: isMaximized ? 1 : 'unset',
          minHeight: 0,
        }}
      >
        {/* Map Viewport Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMaximized ? '100%' : '640px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {/* Top HUD Controls Floating over Map */}
          <div className="map-hud-top">
            {/* Left Group: Focused Kecamatan Pill + Perspective Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', pointerEvents: 'auto' }}>
              {/* Focused Kecamatan Drill-Down Pill */}
              {filterKecamatan !== 'semua' && (
                <div
                  className="map-hud-panel"
                  style={{
                    background: 'rgba(6, 18, 36, 0.95)',
                    border: '1.5px solid #38bdf8',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.75), 0 0 14px rgba(56, 189, 248, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '3px 8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Wilayah:
                    </span>
                    <strong style={{ fontSize: '12px', color: '#ffffff', whiteSpace: 'nowrap' }}>Kec. {filterKecamatan}</strong>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#38bdf8', background: 'rgba(56,189,248,0.2)', padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                      {desaList.filter(d => d.namaKecamatan === filterKecamatan).length}
                    </span>
                  </div>
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={() => {
                      setFilterKecamatan('semua');
                      setSelectedDesa(null);
                      handleClearRoute();
                      mapRef.current?.flyTo({
                        center: [109.68, -7.38],
                        zoom: 11,
                        pitch: 50,
                        bearing: -15,
                        duration: 1200,
                        essential: true,
                      });
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700, padding: '2px 7px', fontSize: '10.5px', whiteSpace: 'nowrap' }}
                    title="Kembali ke tampilan 20 kecamatan"
                  >
                    <ChevronLeft size={12} /> Semua Kec.
                  </button>
                </div>
              )}

              {/* Camera Perspective Presets */}
              <div className="map-hud-panel" style={{ padding: '3px 8px', gap: 5 }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Kamera:</span>
                <button
                  className={`btn btn-xs ${cameraPitch < 15 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCameraPreset(0, 0)}
                  style={{ fontSize: '10.5px', padding: '2px 6px' }}
                >
                  2D (0°)
                </button>
                <button
                  className={`btn btn-xs ${cameraPitch >= 35 && cameraPitch <= 50 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCameraPreset(45, -20)}
                  style={{ fontSize: '10.5px', padding: '2px 6px' }}
                >
                  45°
                </button>
                <button
                  className={`btn btn-xs ${cameraPitch > 50 && cameraPitch <= 70 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCameraPreset(65, 30)}
                  style={{ fontSize: '10.5px', padding: '2px 6px' }}
                >
                  65° Drone
                </button>
                <button
                  className={`btn btn-xs ${cameraPitch > 70 ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCameraPreset(80, 15)}
                  style={{ fontSize: '10.5px', padding: '2px 6px' }}
                >
                  80°
                </button>
              </div>
            </div>

            {/* Tour & Basemap Switcher */}
            <div className="map-hud-panel" style={{ padding: '3px 8px', gap: 5 }}>
              <button
                className={`btn btn-xs ${basemap === 'satellite' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setBasemap('satellite')}
                style={{ fontSize: '10.5px', padding: '2px 7px' }}
              >
                Satelit
              </button>
              <button
                className={`btn btn-xs ${basemap === 'osm' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setBasemap('osm')}
                style={{ fontSize: '10.5px', padding: '2px 7px' }}
              >
                Jalan
              </button>

              <button
                className={`btn btn-xs ${isOrbiting ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setIsOrbiting(prev => !prev)}
                style={{ fontSize: '10.5px', padding: '2px 7px' }}
              >
                {isOrbiting ? 'Stop' : 'Orbit 360°'}
              </button>

              <button
                className={`btn btn-xs ${directRouteMode ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setDirectRouteMode(prev => !prev)}
                title="Bila mode ini aktif, mengklik desa manapun di peta akan langsung membuka navigasi rute Google Maps"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '10.5px',
                  padding: '2px 7px',
                  ...(directRouteMode ? { background: '#2563eb', color: '#ffffff', borderColor: '#60a5fa', boxShadow: '0 0 10px rgba(37,99,235,0.7)', fontWeight: 800 } : {})
                }}
              >
                <Navigation size={11} />
                <span>{directRouteMode ? 'Rute: AKTIF' : 'Rute G-Maps'}</span>
              </button>

              <button
                className="btn btn-xs btn-secondary"
                onClick={toggleMaximize}
                style={{ fontSize: '10.5px', padding: '2px 7px' }}
              >
                {isMaximized ? 'Perkecil' : 'Fullscreen'}
              </button>
            </div>
          </div>

          {/* Bottom-Left 3D Tips & Quick Fly List */}
          <div className="map-hud-bottom">
            {!showCameraGuide ? (
              <button
                className="btn btn-xs btn-secondary"
                onClick={() => setShowCameraGuide(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(13, 27, 46, 0.92)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                  padding: '5px 12px',
                  borderRadius: 8,
                  color: '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: 600,
                  pointerEvents: 'auto',
                }}
              >
                <Compass size={13} color="#38bdf8" />
                <span>Panduan Navigasi &amp; Sensor ({posDugaAirList.length})</span>
                <ChevronUp size={13} />
              </button>
            ) : (
              <div className="map-hud-3d-panel" style={{ padding: '10px 14px', maxWidth: '380px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--cyan-400)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Compass size={13} /> Panduan Navigasi Kamera
                  </span>
                  <button
                    onClick={() => setShowCameraGuide(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2, display: 'flex' }}
                    title="Sembunyikan Panduan"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  • <strong>Klik Kanan + Geser</strong> (atau Ctrl + Drag): Kemiringan &amp; Rotasi 360°<br/>
                  • <strong>Klik Kiri + Geser</strong>: Menggeser posisi pandangan kamera<br/>
                  • <strong>Scroll Mouse</strong>: Zoom in dan zoom out halus ke permukaan bumi
                </div>
                {/* Quick Jump buttons */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: 'center' }}>
                    {musim === 'hujan' ? 'Pos Duga Air:' : 'Fokus ke:'}
                  </span>
                  {musim === 'hujan' ? (
                    posDugaAirList.map(pos => (
                      <div key={pos.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <button
                          className="btn btn-xs btn-secondary"
                          style={{ fontSize: '9.5px', padding: '2px 6px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          onClick={() => {
                            mapRef.current?.flyTo({
                              center: [pos.lng, pos.lat],
                              zoom: 14,
                              pitch: 60,
                              bearing: -10,
                              essential: true,
                            });
                          }}
                          title={pos.nama}
                        >
                          {pos.nama.split('—')[0].replace('Pos Duga Air ', '')}
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${pos.lat},${pos.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-primary"
                          style={{ fontSize: '9.5px', padding: '2px 4px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, display: 'inline-flex', alignItems: 'center' }}
                          title={`Buka Rute Google Maps ke ${pos.nama}`}
                        >
                          <Navigation size={9} />
                        </a>
                      </div>
                    ))
                  ) : (
                    kritisDesa.slice(0, 4).map(d => (
                      <div key={d.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <button
                          className="btn btn-xs btn-secondary"
                          style={{ fontSize: '9.5px', padding: '2px 6px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                          onClick={() => flyToDesa(d)}
                          title={`Fokuskan kamera ke Desa ${d.namaDesa}`}
                        >
                          {d.namaDesa}
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-primary"
                          style={{ fontSize: '9.5px', padding: '2px 4px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, display: 'inline-flex', alignItems: 'center' }}
                          title={`Buka Rute Google Maps ke Desa ${d.namaDesa}`}
                        >
                          <Navigation size={9} />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Route Navigation HUD (When route active) */}
          {activeRoute && (
            <div className="route-nav-hud">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Navigasi Rute Logistik MDMC
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                    Posko &rarr; Desa {activeRoute.destination.namaDesa}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Kecamatan {activeRoute.destination.namaKecamatan}
                  </div>
                </div>
                <button
                  className="btn btn-xs btn-secondary"
                  onClick={handleClearRoute}
                  title="Tutup Jalur Rute Peta"
                  style={{ padding: '2px 6px' }}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Distance & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Jarak Rute Darat</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8' }}>
                    {activeRoute.distanceKm} <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8' }}>km</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Est. Waktu Truk</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fbbf24' }}>
                    ~{activeRoute.durationMin} <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8' }}>menit</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => setShowGmapsModal(activeRoute.destination)}
                  style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #0284c7, #0369a1)', fontWeight: 700 }}
                >
                  <Navigation size={12} />
                  <span>Tampilkan Peta Google Maps (In-App)</span>
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    className="btn btn-xs btn-secondary"
                    onClick={isSimulatingTruck ? handleStopTruckSimulation : handleStartTruckSimulation}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  >
                    {isSimulatingTruck ? <Square size={11} color="#ef4444" /> : <Play size={11} color="#34d399" />}
                    <span>{isSimulatingTruck ? 'Stop Truk' : 'Simulasi 3D'}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeRoute.destination.lat},${activeRoute.destination.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none' }}
                  >
                    <ExternalLink size={11} />
                    <span>Tab Baru</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* MapLibre GL 3D Canvas */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />

          {/* Floating Detail Panel (When Fullscreen & Desa Selected) */}
          {isMaximized && selectedDesa && showDetailInMax && (
            <div className="map-floating-detail card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}>
                    {musim === 'hujan' ? 'Detail Prediksi Bencana Longsor' : 'Detail Wilayah Kekeringan'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {musim === 'hujan' ? 'Parameter Hidrometeorologi & Geoteknik' : 'Parameter Krisis Air Bersih'}
                  </div>
                </div>
                <button className="btn btn-xs btn-secondary" onClick={() => setSelectedDesa(null)}><X size={12} /></button>
              </div>

              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 2 }}>{selectedDesa.namaDesa}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Kecamatan {selectedDesa.namaKecamatan}</div>

              {selectedDesa.cluster ? (
                <div style={{ marginBottom: 12 }}>
                  <span className={`badge badge-${selectedDesa.cluster === 'kritis' ? 'critical' : selectedDesa.cluster === 'waspada' ? 'warning' : 'safe'}`}>
                    {musim === 'hujan'
                      ? (selectedDesa.cluster === 'kritis' ? 'ZONA BAHAYA MERAH' : selectedDesa.cluster === 'waspada' ? 'ZONA WASPADA KUNING' : 'ZONA AMAN HIJAU')
                      : `ZONA ${selectedDesa.cluster.toUpperCase()}`}
                  </span>
                  {selectedDesa.rank && (
                    <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Prioritas TOPSIS #{selectedDesa.rank}
                    </span>
                  )}
                </div>
              ) : musim === 'hujan' && selectedDesa.statusKerawananHujan ? (
                <div style={{ marginBottom: 12 }}>
                  <span className={`badge ${selectedDesa.statusKerawananHujan === 'rawan_tinggi' ? 'badge-critical' : selectedDesa.statusKerawananHujan === 'waspada' ? 'badge-warning' : 'badge-safe'}`}>
                    STATUS: {selectedDesa.statusKerawananHujan === 'rawan_tinggi' ? 'RAWAN TINGGI' : selectedDesa.statusKerawananHujan === 'waspada' ? 'WASPADA SEDANG' : 'RELATIF AMAN'}
                  </span>
                </div>
              ) : null}

              {(() => {
                if (musim === 'hujan') {
                  const items = [
                    { label: 'Formasi Bukit / Tebing', value: selectedDesa.namaBukitFormasi || 'Lereng Perbukitan' },
                    { label: 'Elevasi Topografi', value: `${selectedDesa.elevasiMdpl || 780} mdpl` },
                    { label: 'Kemiringan Lereng', value: `${selectedDesa.kemiringanLereng}% (${(selectedDesa.kemiringanLereng || 0) > 35 ? 'Sangat Terjal' : (selectedDesa.kemiringanLereng || 0) > 25 ? 'Curam' : 'Sedang'})` },
                    { label: 'Curah Hujan Harian', value: `${selectedDesa.curahHujan} mm/24j` },
                    { label: 'Aliran Sungai Terdekat', value: `${selectedDesa.namaSungaiTerdekat || 'DAS Serayu'} (${selectedDesa.jarakSungai} km)` },
                    { label: 'Warga Berisiko di Lereng', value: `${selectedDesa.wargaTerancam?.toLocaleString('id-ID')} jiwa` },
                    { label: 'Kerentanan PVMBG', value: `Skala ${selectedDesa.indeksLongsor}/5` },
                    { label: 'Deteksi Ancaman', value: selectedDesa.jenisBencanaDominan === 'tanah_longsor' ? 'Tanah Longsor Tebing' : (selectedDesa.jenisBencanaDominan === 'gerakan_tanah' ? 'Gerakan Tanah / Retakan' : (selectedDesa.jenisBencanaDominan === 'banjir_luapan' ? 'Luapan Aliran Sungai' : 'Morfologi Relatif Aman')) },
                  ];

                  return (
                    <>
                      {items.map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                          <strong style={{ textAlign: 'right', maxWidth: '58%' }}>{r.value}</strong>
                        </div>
                      ))}

                      {/* Kotak Ambang Batas Bencana */}
                      <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f87171', marginBottom: 2 }}>
                          Ambang Batas Pemicu Longsor / Banjir:
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#e2e8f0', lineHeight: 1.35 }}>
                          {selectedDesa.ambangBatasHujan}
                        </div>
                      </div>

                      {/* Rekomendasi Logistik & SAR */}
                      <div style={{ marginTop: 6, padding: '7px 10px', background: 'rgba(2, 132, 199, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(2, 132, 199, 0.22)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 1 }}>
                          Disposisi Penanganan MDMC:
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#ffffff', lineHeight: 1.3 }}>
                          {selectedDesa.kebutuhanLogistikHujan} ({selectedDesa.rekomendasiTimSar || 0} personil)
                        </div>
                      </div>
                    </>
                  );
                }

                const totalW = selectedDesa.totalWargaDesa || Math.round(Math.max(selectedDesa.jumlahWarga * 1.55, 2300));
                const totalK = selectedDesa.totalKK || Math.round(totalW / 3.8);
                const kkT = selectedDesa.kkTerdampak || Math.round(selectedDesa.jumlahWarga / 3.8);
                const pT = selectedDesa.persenTerdampak || Number(((selectedDesa.jumlahWarga / totalW) * 100).toFixed(1));

                return (
                  <>
                    {[
                      { label: 'Warga Terdampak', value: `${selectedDesa.jumlahWarga.toLocaleString('id-ID')} jiwa (${pT}%)` },
                      { label: 'Total Penduduk Desa', value: `${totalW.toLocaleString('id-ID')} jiwa` },
                      { label: 'Kepala Keluarga (KK)', value: `${kkT.toLocaleString('id-ID')} KK / ${totalK.toLocaleString('id-ID')} KK` },
                      { label: 'Defisit Air', value: `${selectedDesa.defisitAir.toLocaleString('id-ID')} L/hari` },
                      { label: 'Durasi Kekeringan', value: `${selectedDesa.durasiKekeringan} hari` },
                      { label: 'Rasio Rentan', value: `${selectedDesa.rasioRentan}%` },
                      { label: 'Jarak Titik Air', value: `${selectedDesa.jarakSumber} km` },
                      { label: 'Hambatan Medan', value: `${selectedDesa.indeksHambatan}/5` },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                        <strong>{r.value}</strong>
                      </div>
                    ))}

                    <div style={{ marginTop: 8, padding: '7px 10px', background: 'rgba(56,189,248,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56,189,248,0.18)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 4 }}>
                        <span>Tingkat Keterpaparan Warga</span>
                        <span style={{ color: '#38bdf8' }}>{pT}%</span>
                      </div>
                      <div className="progress-bar-outer" style={{ height: 5 }}>
                        <div className="progress-bar-inner" style={{ width: `${Math.min(100, pT)}%`, background: 'linear-gradient(90deg, #0284c7, #ef4444)' }} />
                      </div>
                    </div>
                  </>
                );
              })()}

              {selectedDesa.topsisScore !== undefined && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Skor Preferensi TOPSIS</div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: 'var(--cyan-400)' }}>
                    {selectedDesa.topsisScore.toFixed(4)}
                  </div>
                  <div className="progress-bar-outer" style={{ marginTop: 4 }}>
                    <div className="progress-bar-inner" style={{ width: `${selectedDesa.topsisScore * 100}%` }} />
                  </div>
                </div>
              )}

              {/* Titik Air Terdekat & RS / Faskes Terdekat */}
              {(() => {
                const nearSumber = getNearestSumberAir(selectedDesa, sumberAirList);
                const nearRs = getNearestRumahSakit(selectedDesa, rumahSakitList);
                return (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {/* Sumber Air */}
                    <div style={{ padding: '8px 10px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Droplet size={12} style={{ color: '#38bdf8' }} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>Titik Air Terdekat</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>{nearSumber.jarakKm} km</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{nearSumber.sumber.nama}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 1 }}>
                        {nearSumber.sumber.jenis.replace('_', ' ')} &bull; Stok {(nearSumber.sumber.stokSaat / 1000).toFixed(0)}k L ({nearSumber.sumber.kapasitas.toLocaleString('id-ID')} L/hari)
                      </div>
                      <div style={{ marginTop: 5 }}>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${selectedDesa.lat},${selectedDesa.lng}&destination=${nearSumber.sumber.lat},${nearSumber.sumber.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          <span>Rute Titik Pasokan Air &rarr;</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    {/* RS / Faskes Terdekat */}
                    <div style={{ padding: '8px 10px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.28)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <HeartPulse size={12} style={{ color: '#fb7185' }} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase' }}>RS / Faskes Terdekat</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fb7185' }}>{nearRs.jarakKm} km &bull; ~{nearRs.estWaktuMenit} mnt</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{nearRs.rs.nama}</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: 1 }}>
                        {nearRs.rs.tipe} ({nearRs.rs.kelas}) &bull; {nearRs.rs.kapasitasTT} TT &bull; {nearRs.rs.ambulansSiaga} Ambulans
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>{nearRs.rs.layananUGD}</div>
                      <div style={{ marginTop: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <a
                          href={`tel:${nearRs.rs.telepon.replace(/[^0-9]/g, '')}`}
                          style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          <Phone size={10} />
                          <span>UGD: {nearRs.rs.telepon}</span>
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${selectedDesa.lat},${selectedDesa.lng}&destination=${nearRs.rs.lat},${nearRs.rs.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                        >
                          <span>Rute Evakuasi &rarr;</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  className="btn btn-sm btn-primary"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                  onClick={() => setShowGmapsModal(selectedDesa)}
                >
                  <Navigation size={13} />
                  <span>Tampilkan Peta Rute di Web (In-App)</span>
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDesa.lat},${selectedDesa.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary"
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={12} />
                  <span>Buka di Tab Google Maps</span>
                </a>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: '0.78rem' }}
                    onClick={() => flyToDesa(selectedDesa)}
                  >
                    <Compass size={13} />
                    <span>Fokus 3D</span>
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: '0.78rem' }}
                    onClick={isSimulatingTruck ? handleStopTruckSimulation : handleStartTruckSimulation}
                    disabled={!activeRoute}
                  >
                    <Truck size={13} color={isSimulatingTruck ? '#ef4444' : '#38bdf8'} />
                    <span>{isSimulatingTruck ? 'Stop Truk' : 'Simulasi Truk'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Regular Detail Panel (Beside map when not fullscreen) */}
        {!isMaximized && selectedDesa && (
          <div className="card" style={{ padding: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>
                  {musim === 'hujan' ? 'Detail Prediksi Bencana Longsor' : 'Detail Wilayah'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {musim === 'hujan' ? 'Parameter Hidrometeorologi & Geoteknik' : 'Krisis Kekeringan & Logistik Air'}
                </div>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setSelectedDesa(null)}><X size={14} /></button>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 2 }}>{selectedDesa.namaDesa}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>Kecamatan {selectedDesa.namaKecamatan}</div>

            {selectedDesa.cluster ? (
              <div style={{ marginBottom: 16 }}>
                <span className={`badge badge-${selectedDesa.cluster === 'kritis' ? 'critical' : selectedDesa.cluster === 'waspada' ? 'warning' : 'safe'}`}>
                  {musim === 'hujan'
                    ? (selectedDesa.cluster === 'kritis' ? 'ZONA BAHAYA MERAH' : selectedDesa.cluster === 'waspada' ? 'ZONA WASPADA KUNING' : 'ZONA AMAN HIJAU')
                    : `ZONA ${selectedDesa.cluster.toUpperCase()}`}
                </span>
                {selectedDesa.rank && (
                  <span style={{ marginLeft: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Prioritas TOPSIS #{selectedDesa.rank}
                  </span>
                )}
              </div>
            ) : musim === 'hujan' && selectedDesa.statusKerawananHujan ? (
              <div style={{ marginBottom: 14 }}>
                <span className={`badge ${selectedDesa.statusKerawananHujan === 'rawan_tinggi' ? 'badge-critical' : selectedDesa.statusKerawananHujan === 'waspada' ? 'badge-warning' : 'badge-safe'}`}>
                  STATUS: {selectedDesa.statusKerawananHujan === 'rawan_tinggi' ? 'RAWAN TINGGI' : selectedDesa.statusKerawananHujan === 'waspada' ? 'WASPADA SEDANG' : 'RELATIF AMAN'}
                </span>
              </div>
            ) : null}

            {(() => {
              if (musim === 'hujan') {
                const items = [
                  { label: 'Formasi Bukit / Tebing', value: selectedDesa.namaBukitFormasi || 'Lereng Perbukitan' },
                  { label: 'Elevasi Topografi', value: `${selectedDesa.elevasiMdpl || 780} mdpl` },
                  { label: 'Kemiringan Lereng', value: `${selectedDesa.kemiringanLereng}% (${(selectedDesa.kemiringanLereng || 0) > 35 ? 'Sangat Terjal' : (selectedDesa.kemiringanLereng || 0) > 25 ? 'Curam' : 'Sedang'})` },
                  { label: 'Curah Hujan Harian', value: `${selectedDesa.curahHujan} mm/24j` },
                  { label: 'Aliran Sungai Terdekat', value: `${selectedDesa.namaSungaiTerdekat || 'DAS Serayu'} (${selectedDesa.jarakSungai} km)` },
                  { label: 'Warga Berisiko di Titik Rawan', value: `${selectedDesa.wargaTerancam?.toLocaleString('id-ID')} jiwa` },
                  { label: 'Kerentanan PVMBG', value: `Skala ${selectedDesa.indeksLongsor}/5 (${(selectedDesa.indeksLongsor || 0) >= 4 ? 'Tinggi' : 'Menengah'})` },
                  { label: 'Potensi Bencana', value: selectedDesa.jenisBencanaDominan === 'tanah_longsor' ? 'Tanah Longsor Tebing' : (selectedDesa.jenisBencanaDominan === 'gerakan_tanah' ? 'Gerakan Tanah / Retakan' : (selectedDesa.jenisBencanaDominan === 'banjir_luapan' ? 'Luapan Aliran Sungai' : 'Morfologi Relatif Aman')) },
                ];

                return (
                  <>
                    {items.map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.83rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                        <strong style={{ textAlign: 'right', maxWidth: '58%' }}>{r.value}</strong>
                      </div>
                    ))}

                    {/* Kotak Prediksi Ambang Batas Pemicu Bencana */}
                    <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f87171', marginBottom: 3 }}>
                        Ambang Batas Pemicu Longsor / Banjir:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                        {selectedDesa.ambangBatasHujan}
                      </div>
                    </div>

                    {/* Disposisi Penanganan Logistik & Tim SAR */}
                    <div style={{ marginTop: 8, padding: '9px 12px', background: 'rgba(2, 132, 199, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(2, 132, 199, 0.25)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 2 }}>
                        Rekomendasi Penanganan MDMC:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#ffffff', lineHeight: 1.35 }}>
                        {selectedDesa.kebutuhanLogistikHujan} ({selectedDesa.rekomendasiTimSar || 0} personil)
                      </div>
                    </div>
                  </>
                );
              }

              const totalW = selectedDesa.totalWargaDesa || Math.round(Math.max(selectedDesa.jumlahWarga * 1.55, 2300));
              const totalK = selectedDesa.totalKK || Math.round(totalW / 3.8);
              const kkT = selectedDesa.kkTerdampak || Math.round(selectedDesa.jumlahWarga / 3.8);
              const pT = selectedDesa.persenTerdampak || Number(((selectedDesa.jumlahWarga / totalW) * 100).toFixed(1));

              return (
                <>
                  {[
                    { label: 'Warga Terdampak', value: `${selectedDesa.jumlahWarga.toLocaleString('id-ID')} jiwa (${pT}%)` },
                    { label: 'Total Penduduk Desa', value: `${totalW.toLocaleString('id-ID')} jiwa` },
                    { label: 'Kepala Keluarga (KK)', value: `${kkT.toLocaleString('id-ID')} KK dari ${totalK.toLocaleString('id-ID')} KK` },
                    { label: 'Defisit Air Harian', value: `${selectedDesa.defisitAir.toLocaleString('id-ID')} L/hari` },
                    { label: 'Durasi Kekeringan', value: `${selectedDesa.durasiKekeringan} hari` },
                    { label: 'Rasio Rentan', value: `${selectedDesa.rasioRentan}%` },
                    { label: 'Jarak Titik Air', value: `${selectedDesa.jarakSumber} km` },
                    { label: 'Hambatan Medan', value: `${selectedDesa.indeksHambatan}/5` },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                      <strong>{r.value}</strong>
                    </div>
                  ))}

                  <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(56,189,248,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56,189,248,0.18)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 4 }}>
                      <span>Tingkat Keterpaparan Wilayah</span>
                      <span style={{ color: '#38bdf8' }}>{pT}% Warga</span>
                    </div>
                    <div className="progress-bar-outer" style={{ height: 6 }}>
                      <div className="progress-bar-inner" style={{ width: `${Math.min(100, pT)}%`, background: 'linear-gradient(90deg, #0284c7, #ef4444)' }} />
                    </div>
                  </div>
                </>
              );
            })()}

            {selectedDesa.topsisScore !== undefined && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>Skor Preferensi TOPSIS</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--cyan-400)' }}>
                  {selectedDesa.topsisScore.toFixed(4)}
                </div>
                <div className="progress-bar-outer" style={{ marginTop: 6 }}>
                  <div className="progress-bar-inner" style={{ width: `${selectedDesa.topsisScore * 100}%` }} />
                </div>
              </div>
            )}

            {/* Titik Air Terdekat & RS / Faskes Terdekat */}
            {(() => {
              const nearSumber = getNearestSumberAir(selectedDesa, sumberAirList);
              const nearRs = getNearestRumahSakit(selectedDesa, rumahSakitList);
              return (
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {/* Sumber Air */}
                  <div style={{ padding: '10px 12px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Droplet size={14} style={{ color: '#38bdf8' }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Titik Air Terdekat</span>
                      </div>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>{nearSumber.jarakKm} km</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{nearSumber.sumber.nama}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{nearSumber.sumber.jenis.replace('_', ' ')}</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Stok: {nearSumber.sumber.stokSaat.toLocaleString('id-ID')} L</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${selectedDesa.lat},${selectedDesa.lng}&destination=${nearSumber.sumber.lat},${nearSumber.sumber.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <span>Buka Rute Desa &rarr; Sumber Air (Google Maps)</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>

                  {/* RS / Faskes Terdekat */}
                  <div style={{ padding: '10px 12px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.28)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <HeartPulse size={14} style={{ color: '#fb7185' }} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.03em' }}>RS / Faskes Terdekat</span>
                      </div>
                      <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fb7185' }}>{nearRs.jarakKm} km &bull; ~{nearRs.estWaktuMenit} mnt</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: 3 }}>{nearRs.rs.nama}</div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: 2 }}>
                      {nearRs.rs.tipe} ({nearRs.rs.kelas}) &bull; {nearRs.rs.kapasitasTT} Tempat Tidur &bull; {nearRs.rs.ambulansSiaga} Ambulans Siaga
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{nearRs.rs.layananUGD}</div>
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <a
                        href={`tel:${nearRs.rs.telepon.replace(/[^0-9]/g, '')}`}
                        style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Phone size={11} />
                        <span>Hotline: {nearRs.rs.telepon}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${selectedDesa.lat},${selectedDesa.lng}&destination=${nearRs.rs.lat},${nearRs.rs.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <span>Rute Evakuasi &rarr;</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-sm btn-primary"
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45)',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
                onClick={() => setShowGmapsModal(selectedDesa)}
              >
                <Navigation size={14} />
                <span>Tampilkan Peta Rute di Web (In-App)</span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedDesa.lat},${selectedDesa.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary"
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  textDecoration: 'none',
                }}
              >
                <ExternalLink size={13} />
                <span>Buka di Tab Google Maps</span>
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onClick={() => flyToDesa(selectedDesa)}
                >
                  <Compass size={14} />
                  <span>Fokuskan 3D</span>
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  onClick={isSimulatingTruck ? handleStopTruckSimulation : handleStartTruckSimulation}
                  disabled={!activeRoute}
                >
                  <Truck size={14} color={isSimulatingTruck ? '#ef4444' : '#38bdf8'} />
                  <span>{isSimulatingTruck ? 'Stop Truk' : 'Simulasi Truk'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modal: Mesin Otomatisasi SPK */}
      {showAnalysisModal && (
        <div className="automation-modal-overlay">
          <div className="automation-modal-card">
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: musim === 'hujan' ? 'rgba(56,189,248,0.18)' : 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={22} color="#38bdf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.25 }}>
                    {musim === 'hujan' ? 'Mesin Analisa Zonasi Bencana & Prioritas SAR' : 'Mesin Otomatisasi Analisa SPK TIRTA'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0', lineHeight: 1.3 }}>
                    {musim === 'hujan'
                      ? 'Pipeline Komputasi K-Means & TOPSIS Mitigasi Longsor & Luapan DAS Serayu'
                      : 'Pipeline Komputasi K-Means Clustering & Pemeringkatan TOPSIS Multi-Kriteria'}
                  </p>
                </div>
              </div>
              {analysisStep >= 4 && (
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                  title="Tutup Modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Modal Body with smooth internal scroll */}
            <div className="automation-modal-body">
              {/* Progress Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: 6 }}>
                  <span>Kemajuan Komputasi</span>
                  <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
                    {analysisStep === 0 ? '0%' : analysisStep === 1 ? '30%' : analysisStep === 2 ? '65%' : analysisStep === 3 ? '85%' : '100%'}
                  </span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: analysisStep === 0 ? '0%' : analysisStep === 1 ? '30%' : analysisStep === 2 ? '65%' : analysisStep === 3 ? '85%' : '100%',
                      background: 'linear-gradient(90deg, #0284c7, #38bdf8, #10b981)',
                      transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 12px rgba(56,189,248,0.6)',
                    }}
                  />
                </div>
              </div>

              {/* 4 Pipeline Step Indicators */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, background: analysisStep >= 1 ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.02)', border: analysisStep === 1 ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: analysisStep > 1 ? '#10b981' : analysisStep === 1 ? '#0284c7' : 'rgba(255,255,255,0.1)', color: '#fff', flexShrink: 0 }}>
                    {analysisStep > 1 ? '✓' : '1'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: analysisStep >= 1 ? '#ffffff' : '#64748b' }}>
                      {musim === 'hujan' ? 'Fase 1: K-Means Zonasi Bahaya Hidrometeorologi (K=3)' : 'Fase 1: K-Means Clustering Multidimensi (K=3)'}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                      {musim === 'hujan' ? 'Klasterisasi 266 desa berdasarkan lereng, curah hujan, dan PVMBG' : 'Normalisasi Min-Max 6 kriteria & iterasi Euclidean untuk 266 desa'}
                    </div>
                  </div>
                  {analysisStep === 1 && <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, flexShrink: 0 }}>Memproses...</span>}
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, background: analysisStep >= 2 ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.02)', border: analysisStep === 2 ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: analysisStep > 2 ? '#10b981' : analysisStep === 2 ? '#0284c7' : 'rgba(255,255,255,0.1)', color: '#fff', flexShrink: 0 }}>
                    {analysisStep > 2 ? '✓' : '2'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: analysisStep >= 2 ? '#ffffff' : '#64748b' }}>
                      Fase 2: Pemodelan Prioritas TOPSIS
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                      {musim === 'hujan' ? 'Ranking kedekatan solusi ideal ancaman lereng & sempadan DAS' : 'Matriks ternormalisasi terbobot, solusi ideal (A+ & A-), dan koefisien kedekatan (V_i)'}
                    </div>
                  </div>
                  {analysisStep === 2 && <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, flexShrink: 0 }}>Menghitung...</span>}
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, background: analysisStep >= 3 ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.02)', border: analysisStep === 3 ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: analysisStep > 3 ? '#10b981' : analysisStep === 3 ? '#0284c7' : 'rgba(255,255,255,0.1)', color: '#fff', flexShrink: 0 }}>
                    {analysisStep > 3 ? '✓' : '3'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: analysisStep >= 3 ? '#ffffff' : '#64748b' }}>
                      {musim === 'hujan' ? 'Fase 3: Disposisi Tim SAR & Kebutuhan Logistik Bencana' : 'Fase 3: Alokasi Tangki Air & Urgensi Respon MDMC'}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                      {musim === 'hujan' ? 'Pengerahan personil SAR MDMC & kesiapsiagaan tenda darurat/terpal' : 'Estimasi ritase truk 5000L & rekomendasi aksi respon lapangan'}
                    </div>
                  </div>
                  {analysisStep === 3 && <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, flexShrink: 0 }}>Menghitung...</span>}
                </div>

                {/* Step 4 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 8, background: analysisStep >= 4 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)', border: analysisStep >= 4 ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, background: analysisStep >= 4 ? '#10b981' : 'rgba(255,255,255,0.1)', color: '#fff', flexShrink: 0 }}>
                    {analysisStep >= 4 ? '✓' : '4'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: analysisStep >= 4 ? '#ffffff' : '#64748b' }}>
                      Fase 4: Sinkronisasi Spasial WebGIS 3D
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                      Pemutakhiran layer klaster merah/kuning/hijau &amp; pin prioritas
                    </div>
                  </div>
                  {analysisStep >= 4 && <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 800, flexShrink: 0 }}>Selesai!</span>}
                </div>
              </div>

              {/* Summary Card upon completion */}
              {analysisStep >= 4 && analysisSummary && (
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    {musim === 'hujan' ? 'Ringkasan Zonasi Bahaya Bencana' : 'Ringkasan Hasil Analisis SPK'}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                    <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9.5px', color: '#f87171', fontWeight: 700 }}>
                        {musim === 'hujan' ? 'BAHAYA MERAH' : 'ZONA KRITIS'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ef4444' }}>{analysisSummary.kritis} Desa</div>
                    </div>
                    <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9.5px', color: '#fbbf24', fontWeight: 700 }}>
                        {musim === 'hujan' ? 'WASPADA KUNING' : 'ZONA WASPADA'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b' }}>{analysisSummary.waspada} Desa</div>
                    </div>
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '9.5px', color: '#34d399', fontWeight: 700 }}>
                        {musim === 'hujan' ? 'AMAN HIJAU' : 'ZONA SIAGA'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10b981' }}>{analysisSummary.siaga} Desa</div>
                    </div>
                  </div>

                  {analysisSummary.topDesa && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid #ef4444', borderRadius: 6, padding: '9px 12px' }}>
                      <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em' }}>
                        {musim === 'hujan'
                          ? 'PRIORITAS #1 SIAGA EVAKUASI & DISPOSISI TIM SAR MDMC'
                          : 'PRIORITAS #1 PENERJUNAN ARMADA LOGISTIK MDMC'}
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                        Desa {analysisSummary.topDesa.namaDesa} (Kec. {analysisSummary.topDesa.namaKecamatan})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                        {musim === 'hujan' ? (
                          <span>
                            Lereng: <strong>{analysisSummary.topDesa.kemiringanLereng}%</strong> &bull; Hujan: <strong>{analysisSummary.topDesa.curahHujan} mm</strong> &bull; Disposisi: <strong>{analysisSummary.topDesa.rekomendasiTimSar || 10} Personil SAR</strong>
                          </span>
                        ) : (
                          <span>
                            Defisit: <strong>{analysisSummary.topDesa.defisitAir.toLocaleString('id-ID')} L/hari</strong> &bull; Rekomendasi: <strong>{analysisSummary.topDesa.rekomendasiTangki} Tangki Air</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions - Clean, wrapped, and perfectly balanced */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}>
                {analysisStep >= 4 ? (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAnalysisModal(false)}
                      style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                    >
                      Tutup
                    </button>
                    {analysisSummary?.topDesa && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setShowAnalysisModal(false);
                            flyToDesa(analysisSummary.topDesa!);
                          }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '7px 12px' }}
                        >
                          <MapPin size={14} />
                          <span>Fokus ke Peta 3D</span>
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${analysisSummary.topDesa.lat},${analysisSummary.topDesa.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            padding: '7px 14px',
                          }}
                          title={`Buka Navigasi Rute Langsung ke Desa ${analysisSummary.topDesa.namaDesa}`}
                        >
                          <Navigation size={14} />
                          <span>Rute Google Maps #{analysisSummary.topDesa.namaDesa}</span>
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                    Memproses kalkulasi otomatis...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Embedded Google Maps In-App Viewer Modal */}
      {showGmapsModal && (
        <div className="automation-modal-overlay" style={{ zIndex: 9999 }}>
          <div className="automation-modal-card" style={{ maxWidth: 900, width: '92vw', height: '85vh', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Navigation size={18} color="#60a5fa" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Peta Rute Navigasi Google Maps &bull; Desa {showGmapsModal.namaDesa}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>
                    Rute dari Posko Induk MDMC Banjarnegara &rarr; Desa {showGmapsModal.namaDesa}, Kec. {showGmapsModal.namaKecamatan}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${showGmapsModal.lat},${showGmapsModal.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> Buka Tab Penuh
                </a>
                <button className="btn btn-xs btn-secondary" onClick={() => setShowGmapsModal(null)}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Embedded Google Maps Frame */}
            <div style={{ flex: 1, position: 'relative', background: '#0a0f1d' }}>
              <iframe
                src={`https://maps.google.com/maps?saddr=-7.3995,109.6975&daddr=${showGmapsModal.lat},${showGmapsModal.lng}&hl=id&output=embed`}
                title={`Peta Navigasi Google Maps Desa ${showGmapsModal.namaDesa}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Footer Info */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span>Koordinat Tujuan: <strong style={{ color: '#ffffff' }}>{showGmapsModal.lat.toFixed(4)}, {showGmapsModal.lng.toFixed(4)}</strong></span>
                <span>Defisit Air: <strong style={{ color: '#38bdf8' }}>{showGmapsModal.defisitAir.toLocaleString('id-ID')} L/hari</strong></span>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowGmapsModal(null)}>
                Tutup Tampilan Peta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
