"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight, Star, MapPin } from "lucide-react";
import type { CatalogProvince, IslandGroup, Product } from "@/lib/types";

const IndonesiaMap = dynamic(() => import("@/components/catalog/IndonesiaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[440px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
      <span className="text-gray-600 text-sm">Memuat peta...</span>
    </div>
  ),
});

interface Props {
  provinces: CatalogProvince[];
  islands: IslandGroup[];
  initialProducts: Product[];
}

function normalizeProvName(name: string): string {
  return name.toUpperCase().trim().replace(/\s+/g, " ");
}

// Map GeoJSON canonical uppercase names to catalog/product names
const GEOJSON_TO_CATALOG: Record<string, string> = {
  "DAERAH ISTIMEWA YOGYAKARTA": "DI YOGYAKARTA",
  "NUSATENGGARA BARAT": "NUSA TENGGARA BARAT",
  "DI. ACEH": "ACEH",
};

function resolveGeoToDisplay(geoName: string): string {
  return GEOJSON_TO_CATALOG[geoName] ?? geoName;
}

export default function CatalogPageClient({ provinces, islands, initialProducts }: Props) {
  const [search, setSearch] = useState("");
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<CatalogProvince | null>(null);
  const [mapSelectedGeo, setMapSelectedGeo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sortedIslands = useMemo(
    () => [...islands].sort((a, b) => a.sortOrder - b.sortOrder),
    [islands]
  );

  const filteredProvinces = useMemo(() => {
    let list = provinces;
    if (selectedIsland) list = list.filter((p) => p.islandKey === selectedIsland);
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.costumeName.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [provinces, selectedIsland, search]);

  const filteredProducts = useMemo(() => {
    let list = initialProducts;
    if (selectedProvince) {
      list = list.filter((p) => normalizeProvName(p.province) === normalizeProvName(selectedProvince.name));
    } else if (mapSelectedGeo && !selectedProvince) {
      const resolved = resolveGeoToDisplay(mapSelectedGeo);
      list = list.filter((p) => normalizeProvName(p.province).includes(resolved) || resolved.includes(normalizeProvName(p.province)));
    }
    if (search && !selectedProvince && !mapSelectedGeo) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.province.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [initialProducts, selectedProvince, mapSelectedGeo, search]);

  // Province names that exist in either catalog or products (for map highlighting)
  const availableProvinceNames = useMemo(() => {
    const fromCatalog = provinces.map((p) => p.name);
    const fromProducts = [...new Set(initialProducts.map((p) => p.province))];
    return [...new Set([...fromCatalog, ...fromProducts])];
  }, [provinces, initialProducts]);

  // Normalized province name → product count (for map info panel)
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of initialProducts) {
      const key = normalizeProvName(p.province);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [initialProducts]);

  function handleMapSelect(geoCanonical: string | null) {
    if (!geoCanonical) {
      setMapSelectedGeo(null);
      setSelectedProvince(null);
      return;
    }
    setMapSelectedGeo(geoCanonical);
    setSearch("");

    // Try to match to a catalog province
    const resolved = resolveGeoToDisplay(geoCanonical);
    const match = provinces.find(
      (p) => normalizeProvName(p.name) === resolved || normalizeProvName(p.name).includes(resolved) || resolved.includes(normalizeProvName(p.name))
    );
    if (match) {
      setSelectedProvince(match);
    } else {
      setSelectedProvince(null);
    }
  }

  function handleReset() {
    setSelectedProvince(null);
    setMapSelectedGeo(null);
    setSelectedIsland(null);
    setSearch("");
  }

  const showMapResults = mapSelectedGeo && !selectedProvince;

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 pt-10"
      >
        <span className="text-[10px] font-bold tracking-[0.3em] text-brand-light block mb-4">
          KOLEKSI NUSANTARA
        </span>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-light italic mb-6">
          Katalog Busana Adat
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Jelajahi koleksi busana adat dari berbagai provinsi di seluruh Nusantara.
        </p>
      </motion.div>

      {/* Indonesia Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={14} className="text-brand-muted" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500">
            PILIH PROVINSI DARI PETA
          </span>
          {mapSelectedGeo && (
            <button
              onClick={handleReset}
              className="ml-auto text-[10px] text-gray-500 hover:text-brand-light flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Reset pilihan
            </button>
          )}
        </div>
        <IndonesiaMap
          availableProvinces={availableProvinceNames}
          productCounts={productCounts}
          selectedProvince={
            selectedProvince
              ? selectedProvince.name
              : mapSelectedGeo
              ? resolveGeoToDisplay(mapSelectedGeo)
              : null
          }
          onSelect={handleMapSelect}
        />
      </motion.div>

      {/* Search bar */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedProvince(null);
            setMapSelectedGeo(null);
          }}
          placeholder="Cari provinsi atau nama busana..."
          className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-12 py-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-brand-muted/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Island Filter */}
      {sortedIslands.length > 0 && !selectedProvince && !mapSelectedGeo && (
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          <button
            onClick={() => { setSelectedIsland(null); setSelectedProvince(null); }}
            className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] border transition-all ${
              !selectedIsland
                ? "bg-brand-dark border-brand-muted/50 text-brand-light"
                : "border-white/10 text-gray-500 hover:border-brand-muted/30 hover:text-gray-300"
            }`}
          >
            SEMUA PULAU
          </button>
          {sortedIslands.map((island) => (
            <button
              key={island.key}
              onClick={() => { setSelectedIsland(island.key); setSelectedProvince(null); }}
              className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.15em] border transition-all ${
                selectedIsland === island.key
                  ? "bg-brand-dark border-brand-muted/50 text-brand-light"
                  : "border-white/10 text-gray-500 hover:border-brand-muted/30 hover:text-gray-300"
              }`}
            >
              {island.name.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Map filter result: show products directly (no catalog entry) */}
      {showMapResults && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-light tracking-[0.2em] font-bold transition-colors"
            >
              ← KEMBALI
            </button>
            <span className="text-xs text-gray-600">
              Menampilkan produk untuk:{" "}
              <span className="text-brand-muted">
                {resolveGeoToDisplay(mapSelectedGeo!)
                  .split(" ")
                  .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                  .join(" ")}
              </span>
            </span>
          </div>

          <h3 className="text-xs font-bold tracking-[0.3em] text-gray-500 mb-6">
            KOLEKSI TERSEDIA ({filteredProducts.length})
          </h3>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  idx={idx}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600">
              <p className="font-serif text-xl italic">Belum ada produk untuk provinsi ini</p>
            </div>
          )}
        </div>
      )}

      {/* All Products Grid - Default View */}
      {!selectedProvince && !showMapResults && (
        <div>
          <h2 className="text-xs font-bold tracking-[0.3em] text-gray-500 mb-6">
            SEMUA PRODUK ({filteredProducts.length})
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  idx={idx}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600">
              <p className="font-serif text-xl italic">Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      )}

      {/* Province Detail + Products */}
      {selectedProvince && (
        <div>
          <button
            onClick={() => { setSelectedProvince(null); setMapSelectedGeo(null); }}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-light mb-8 tracking-[0.2em] font-bold transition-colors"
          >
            ← KEMBALI KE SEMUA PROVINSI
          </button>

          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {selectedProvince.imageUrl && (
              <div className="w-full md:w-64 h-48 md:h-80 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                <img
                  src={selectedProvince.imageUrl}
                  alt={selectedProvince.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-end">
              <span className="text-[10px] font-bold tracking-[0.3em] text-brand-muted mb-2">
                {islands.find((i) => i.key === selectedProvince.islandKey)?.name?.toUpperCase() ??
                  selectedProvince.islandKey.toUpperCase()}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-light italic mb-2">
                {selectedProvince.name}
              </h2>
              <p className="text-brand-muted text-sm mb-3">{selectedProvince.costumeName}</p>
              {selectedProvince.description && (
                <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                  {selectedProvince.description}
                </p>
              )}
            </div>
          </div>

          <h3 className="text-xs font-bold tracking-[0.3em] text-gray-500 mb-6">
            KOLEKSI TERSEDIA ({filteredProducts.length})
          </h3>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  idx={idx}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600">
              <p className="font-serif text-xl italic">Belum ada produk untuk provinsi ini</p>
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              {selectedProduct.imageUrl && (
                <div className="aspect-video w-full relative">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.3em] text-brand-muted uppercase">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-light italic mt-1">
                      {selectedProduct.name}
                    </h3>
                    {selectedProduct.traditionalName && (
                      <p className="text-xs text-gray-500 mt-1 italic">{selectedProduct.traditionalName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-2xl font-bold text-brand-light mb-4">
                  Rp {selectedProduct.price.toLocaleString("id-ID")}
                  <span className="text-sm font-normal text-gray-500"> / sewa</span>
                </p>

                {selectedProduct.description && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>
                )}

                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-gray-400">
                    {selectedProduct.province}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${
                      selectedProduct.isAvailable
                        ? "bg-green-900/30 border border-green-500/30 text-green-400"
                        : "bg-red-900/30 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {selectedProduct.isAvailable ? "TERSEDIA" : "TIDAK TERSEDIA"}
                  </span>
                </div>

                {selectedProduct.isAvailable && (
                  <a
                    href={`https://wa.me/?text=Halo, saya ingin menyewa ${encodeURIComponent(selectedProduct.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-brand-dark hover:bg-brand-muted hover:text-black py-4 rounded-full text-xs font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                  >
                    <Star size={14} /> PESAN SEKARANG
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({
  product,
  idx,
  onClick,
}: {
  product: Product;
  idx: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 }}
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer hover:border-brand-muted/30 transition-colors"
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-brand-light/20">
          <span className="font-serif text-5xl italic">K</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="text-[9px] font-bold tracking-[0.3em] text-brand-muted uppercase">
          {product.category}
        </span>
        <h3 className="font-serif font-bold text-brand-light italic mt-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-1">Rp {product.price.toLocaleString("id-ID")}</p>
      </div>
    </motion.div>
  );
}
