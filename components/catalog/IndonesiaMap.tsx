"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Map, GeoJSON as LeafletGeoJSONLayer, Path, LeafletMouseEvent } from "leaflet";

/* ── Province name helpers ── */
function norm(s: string) {
  return s.toUpperCase().trim().replace(/\s+/g, " ");
}

const GEO_MAP: Record<string, string> = {
  "DAERAH ISTIMEWA YOGYAKARTA": "DI YOGYAKARTA",
  "NUSATENGGARA BARAT": "NUSA TENGGARA BARAT",
  "DI. ACEH": "ACEH",
};

function resolve(raw: string) {
  const up = norm(raw);
  return GEO_MAP[up] ?? up;
}

function toTitle(raw: string) {
  return resolve(raw)
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

/* ── Props ── */
interface HoverInfo {
  name: string;
  productCount: number;
  available: boolean;
}

interface Props {
  availableProvinces: string[];
  /** normalized province name → product count */
  productCounts: Record<string, number>;
  selectedProvince: string | null;
  onSelect: (name: string | null) => void;
}

export default function IndonesiaMap({
  availableProvinces,
  productCounts,
  selectedProvince,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const geoRef = useRef<LeafletGeoJSONLayer | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  /* Mutable refs so event handlers always see latest values */
  const availRef = useRef(availableProvinces);
  const countsRef = useRef(productCounts);
  const selRef = useRef(selectedProvince);
  const onSelRef = useRef(onSelect);
  const setHoverRef = useRef(setHoverInfo);
  availRef.current = availableProvinces;
  countsRef.current = productCounts;
  selRef.current = selectedProvince;
  onSelRef.current = onSelect;

  /* Compute style for a province */
  function buildStyle(rawName: string) {
    const resolved = resolve(rawName);
    const avSet = new Set(availRef.current.map(norm));
    const avail = avSet.has(resolved);
    const sel = selRef.current != null && norm(selRef.current) === resolved;
    return {
      fillColor: sel ? "#c4a882" : avail ? "#7a5c48" : "#222",
      fillOpacity: sel ? 0.88 : avail ? 0.78 : 0.35,
      color: sel ? "#e8d5bc" : avail ? "#b49e8e" : "#444",
      weight: sel ? 2.5 : avail ? 1 : 0.5,
    };
  }

  /* Init map once */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled) return;

      // Suppress marker icon errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: "", iconUrl: "", shadowUrl: "" });

      const map = L.map(containerRef.current!, {
        center: [-2, 118],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: true,
      });
      mapRef.current = map;

      const geoData = await fetch("/maps/indonesia-prov.geojson").then((r) => r.json());
      if (cancelled) return;

      let geoLayer: LeafletGeoJSONLayer;

      geoLayer = L.geoJSON(geoData, {
        style: (feature) => buildStyle(feature?.properties?.Propinsi ?? ""),

        onEachFeature: (feature, layer) => {
          const rawName = String(feature?.properties?.Propinsi ?? "");
          const displayName = toTitle(rawName);

          layer.on({
            click: () => {
              const resolved = resolve(rawName);
              const cur = selRef.current;
              if (cur != null && norm(cur) === resolved) {
                onSelRef.current(null);
              } else {
                onSelRef.current(resolved);
              }
            },

            mouseover: (e: LeafletMouseEvent) => {
              const l = e.target as Path;
              const base = buildStyle(rawName);
              l.setStyle({
                ...base,
                fillOpacity: Math.min(base.fillOpacity + 0.15, 1),
                weight: base.weight + 0.5,
              });
              l.bringToFront();

              // Show info panel
              const resolved = resolve(rawName);
              const avSet = new Set(availRef.current.map(norm));
              const avail = avSet.has(resolved);
              const count = countsRef.current[resolved] ?? 0;
              setHoverRef.current({ name: displayName, productCount: count, available: avail });
            },

            mouseout: (e: LeafletMouseEvent) => {
              geoLayer.resetStyle(e.target as Path);
              setHoverRef.current(null);
            },
          });
        },
      }).addTo(map);

      geoRef.current = geoLayer;

      setTimeout(() => {
        map.fitBounds([[5.5, 94.5], [-11, 141.5]], { padding: [20, 20] });
        map.invalidateSize();
      }, 100);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        geoRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Re-style on selection / availability change */
  useEffect(() => {
    if (!geoRef.current) return;
    geoRef.current.eachLayer((layer) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feat = (layer as any).feature;
      if (feat) {
        (layer as Path).setStyle(buildStyle(feat?.properties?.Propinsi ?? ""));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, availableProvinces]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
      {/* Hint */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
        <span className="text-[9px] font-bold tracking-[0.2em] text-gray-600 bg-black/50 px-2.5 py-1 rounded">
          KLIK PROVINSI UNTUK FILTER
        </span>
      </div>

      {/* Hover info panel — top right */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none" style={{ minWidth: 160 }}>
        <AnimatePresence mode="wait">
          {hoverInfo ? (
            <motion.div
              key={hoverInfo.name}
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="bg-[#1a1a1a]/95 border border-white/15 rounded-xl px-4 py-3 backdrop-blur-sm shadow-xl"
            >
              <p className="text-gray-200 text-sm font-medium leading-tight mb-1">
                {hoverInfo.name}
              </p>
              {hoverInfo.available ? (
                <p className="text-brand-muted text-[11px] font-bold tracking-wide">
                  {hoverInfo.productCount} produk tersedia
                </p>
              ) : (
                <p className="text-gray-600 text-[11px]">Belum ada produk</p>
              )}
            </motion.div>
          ) : selectedProvince ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#1a1a1a]/95 border border-brand-muted/30 rounded-xl px-4 py-3 backdrop-blur-sm shadow-xl"
            >
              <p className="text-[9px] font-bold tracking-[0.2em] text-brand-muted mb-1">DIPILIH</p>
              <p className="text-brand-light text-sm font-medium leading-tight">
                {selectedProvince
                  .split(" ")
                  .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                  .join(" ")}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Map container */}
      <div ref={containerRef} style={{ height: 440, width: "100%" }} />

      {/* Legend */}
      <div className="absolute bottom-3 right-4 z-[1000] pointer-events-none flex gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ background: "#7a5c48", border: "1px solid #b49e8e" }}
          />
          Ada koleksi
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ background: "#c4a882", border: "1px solid #e8d5bc" }}
          />
          Dipilih
        </span>
      </div>
    </div>
  );
}
