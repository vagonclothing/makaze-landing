"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

type Order = {
  id: string;
  full_name: string;
  product_name: string;
  source: string;
  total: number;
  product_price: number;
  shipping: number;
  status: string;
  created_at: string;
  gift_pack: boolean;
};

type Margin = {
  source: string;
  naziv: string;
  zarada: number;
};

const TABS = ["Danas", "Sedmica", "Mjesec"];

function startOf(period: string): Date {
  const now = new Date();
  if (period === "Danas") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "Sedmica") {
    const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const d = new Date(now);
    d.setDate(now.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  // Mjesec
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function DashboardPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [margins, setMargins]       = useState<Margin[]>([]);
  const [tab, setTab]               = useState("Danas");
  const [showMargins, setShowMargins] = useState(false);
  const [showOdgodjene, setShowOdgodjene] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Editing margins
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [editValue, setEditValue]         = useState("");
  const [editNaziv, setEditNaziv]         = useState("");
  const [saving, setSaving]               = useState(false);

  const fetchData = useCallback(async () => {
    const [{ data: ordersData }, { data: marginsData }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("margins").select("*"),
    ]);

    if (ordersData) setOrders(ordersData);
    if (marginsData) setMargins(marginsData);
    setLoading(false);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh svakih 60 sekundi
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Filtriraj po periodu
  const since = startOf(tab);
  const periodOrders = orders.filter(
    (o) => new Date(o.created_at) >= since
  );

  // Potvrđene narudžbe za zaradu
  const potvrdjene = periodOrders.filter(
    (o) => o.status === "potvrdjena" || o.status === "otkucano"
  );
  const otkucane = periodOrders.filter((o) => o.status === "otkucano");
  const naChekanju = periodOrders.filter((o) => o.status === "potvrdjena");
  const odgodjene = periodOrders.filter((o) => o.status === "odgodjena");

  function getZarada(source: string): number {
    const m = margins.find((m) => m.source === source);
    return m ? m.zarada : 0;
  }

  const ukupnoPromet = potvrdjene.reduce(
    (s, o) => s + (o.product_price || o.total - (o.shipping || 10)), 0
  );
  const ukupnoZarada = potvrdjene.reduce(
    (s, o) => s + getZarada(o.source), 0
  );

  // Artikli u periodu (potvrđene)
  const articleMap: Record<string, number> = {};
  potvrdjene.forEach((o) => {
    articleMap[o.product_name] = (articleMap[o.product_name] || 0) + 1;
  });

  // Artikli odgođenih
  const odgodjenoMap: Record<string, { count: number; promet: number; zarada: number; source: string }> = {};
  odgodjene.forEach((o) => {
    if (!odgodjenoMap[o.product_name]) {
      odgodjenoMap[o.product_name] = { count: 0, promet: 0, zarada: 0, source: o.source };
    }
    odgodjenoMap[o.product_name].count += 1;
    odgodjenoMap[o.product_name].promet += o.product_price || (o.total - (o.shipping || 10));
    odgodjenoMap[o.product_name].zarada += getZarada(o.source);
  });
  const izgubljenPromet = odgodjene.reduce((s, o) => s + (o.product_price || (o.total - (o.shipping || 10))), 0);
  const izgubljenZarada = odgodjene.reduce((s, o) => s + getZarada(o.source), 0);

  // Novi sources koji nemaju maržu
  const allSources = [...new Set(orders.map((o) => o.source).filter(Boolean))];
  const missingMargins = allSources.filter(
    (s) => !margins.find((m) => m.source === s)
  );

  // Pronađi naziv za source iz narudžbi
  function getNameForSource(source: string): string {
    const o = orders.find((ord) => ord.source === source);
    return o?.product_name || source;
  }

  async function saveMargin(source: string) {
    setSaving(true);
    const zarada = parseFloat(editValue) || 0;
    const naziv = editNaziv || getNameForSource(source);

    const existing = margins.find((m) => m.source === source);
    if (existing) {
      await supabase
        .from("margins")
        .update({ zarada, naziv })
        .eq("source", source);
    } else {
      await supabase
        .from("margins")
        .insert({ source, zarada, naziv });
    }

    await fetchData();
    setEditingSource(null);
    setSaving(false);
  }

  function startEdit(m: Margin) {
    setEditingSource(m.source);
    setEditValue(String(m.zarada));
    setEditNaziv(m.naziv);
  }

  function startEditNew(source: string) {
    setEditingSource(source);
    setEditValue("");
    setEditNaziv(getNameForSource(source));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="font-semibold text-gray-500">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10 text-black">
      <div className="mx-auto max-w-2xl">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-black px-5 py-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-lg font-black text-white">📊 Dashboard</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Refresh: {lastRefresh.toLocaleTimeString("bs-BA", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-bold text-white hover:bg-gray-600"
            >
              🔄
            </button>
            <button
              onClick={() => setShowMargins(!showMargins)}
              className={`rounded-lg px-3 py-2 text-xs font-bold text-white transition ${
                showMargins ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              ⚙️ Marže
            </button>
            <a
              href="/orders7847312"
              className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-bold text-white hover:bg-gray-600"
            >
              📋 Narudžbe
            </a>
          </div>
        </div>

        {showMargins ? (
          /* ── MARŽE PANEL ── */
          <div className="p-4">
            <h2 className="mb-1 text-lg font-black">⚙️ Zarada po artiklu</h2>
            <p className="mb-4 text-sm text-gray-500">
              Jednom uneseš — automatski se računa za svaku narudžbu.
            </p>

            {/* Novi artikli bez marže */}
            {missingMargins.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs font-bold text-yellow-800">
                  ⚠️ {missingMargins.length} novi artikal{missingMargins.length > 1 ? "a" : ""} bez marže
                </div>
                {missingMargins.map((source) => (
                  <div key={source} className="mb-2 rounded-xl border-2 border-dashed border-yellow-300 bg-white p-4">
                    <div className="font-bold text-sm text-black">{getNameForSource(source)}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{source}</div>
                    {editingSource === source ? (
                      <div className="mt-3 flex gap-2 items-center">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="0.00"
                          className="w-24 rounded-lg border-2 border-blue-400 px-3 py-2 text-sm font-bold outline-none"
                          autoFocus
                        />
                        <span className="text-sm font-bold text-gray-500">KM zarada</span>
                        <button
                          onClick={() => saveMargin(source)}
                          disabled={saving}
                          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                        >
                          {saving ? "..." : "✓ Sačuvaj"}
                        </button>
                        <button
                          onClick={() => setEditingSource(null)}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditNew(source)}
                        className="mt-2 rounded-lg bg-yellow-400 px-4 py-1.5 text-xs font-bold text-black"
                      >
                        + Dodaj maržu
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Postojeće marže */}
            <div className="space-y-2">
              {margins.map((m) => (
                <div key={m.source} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-bold text-sm text-black">{m.naziv}</div>
                      <div className="text-xs text-gray-400">{m.source}</div>
                    </div>
                    {editingSource === m.source ? (
                      <div className="flex gap-2 items-center shrink-0">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 rounded-lg border-2 border-blue-400 px-2 py-1.5 text-sm font-bold outline-none"
                          autoFocus
                        />
                        <span className="text-xs font-bold text-gray-500">KM</span>
                        <button
                          onClick={() => saveMargin(m.source)}
                          disabled={saving}
                          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                        >
                          {saving ? "..." : "✓"}
                        </button>
                        <button
                          onClick={() => setEditingSource(null)}
                          className="rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-bold text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-base font-black text-green-600">
                          {m.zarada.toFixed(2)} KM
                        </span>
                        <button
                          onClick={() => startEdit(m)}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {margins.length === 0 && missingMargins.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center text-gray-400">
                Nema artikala. Čim dođe narudžba, artikal će se pojaviti ovdje.
              </div>
            )}
          </div>

        ) : (
          <>
            {/* ── PERIOD TABS ── */}
            <div className="flex gap-2 p-4 pb-0">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-black transition ${
                    tab === t
                      ? "bg-black text-white shadow"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* ── UPOZORENJE: artikli bez marže ── */}
            {missingMargins.length > 0 && (
              <div className="mx-4 mt-3 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-800">
                  ⚠️ {missingMargins.length} artikal{missingMargins.length > 1 ? "a" : ""} bez marže
                </span>
                <button
                  onClick={() => setShowMargins(true)}
                  className="rounded-lg bg-yellow-400 px-3 py-1 text-xs font-black text-black"
                >
                  Dodaj →
                </button>
              </div>
            )}

            {/* ── KPI KARTICE ── */}
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Promet</div>
                <div className="mt-1 text-3xl font-black text-black">{ukupnoPromet.toFixed(2)}</div>
                <div className="text-xs font-semibold text-gray-400">KM · bez dostave</div>
              </div>

              <div className="rounded-2xl bg-green-50 p-4 shadow-sm border-2 border-green-200">
                <div className="text-xs font-bold uppercase tracking-wide text-green-600">Zarada</div>
                <div className="mt-1 text-3xl font-black text-green-600">{ukupnoZarada.toFixed(2)}</div>
                <div className="text-xs font-semibold text-green-500">KM neto</div>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">Potvrđene</div>
                <div className="mt-1 text-3xl font-black text-black">{potvrdjene.length}</div>
                <div className="text-xs font-semibold text-gray-400">
                  {otkucane.length} otkucano · {naChekanju.length} čeka
                </div>
              </div>

              <button
                onClick={() => setShowOdgodjene(!showOdgodjene)}
                className="rounded-2xl bg-red-50 p-4 shadow-sm border border-red-100 text-left w-full transition hover:border-red-300"
              >
                <div className="text-xs font-bold uppercase tracking-wide text-red-400">Odgođene</div>
                <div className="mt-1 text-3xl font-black text-red-500">{odgodjene.length}</div>
                <div className="text-xs font-semibold text-red-400">
                  {showOdgodjene ? "▲ zatvori" : "▼ prikaži detalje"}
                </div>
              </button>
            </div>

            {/* ── ODGOĐENE DETALJI ── */}
            {showOdgodjene && (
              <div className="mx-4 mb-1 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
                <div className="mb-3 font-black text-sm text-red-700">⏸ Odgođene narudžbe — detalji</div>

                {/* Ukupni gubici */}
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white p-3 border border-red-100">
                    <div className="text-xs font-bold text-red-400 uppercase tracking-wide">Izgubljen promet</div>
                    <div className="text-xl font-black text-red-500 mt-0.5">{izgubljenPromet.toFixed(2)} KM</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-red-100">
                    <div className="text-xs font-bold text-red-400 uppercase tracking-wide">Izgubljena zarada</div>
                    <div className="text-xl font-black text-red-500 mt-0.5">{izgubljenZarada.toFixed(2)} KM</div>
                  </div>
                </div>

                {/* Po artiklu */}
                {Object.keys(odgodjenoMap).length === 0 ? (
                  <div className="text-center text-sm text-red-400 py-2">Nema odgođenih narudžbi.</div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(odgodjenoMap)
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([name, data]) => (
                        <div key={name} className="rounded-xl bg-white p-3 border border-red-100">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-black">{name}</div>
                            </div>
                            <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-black text-red-600">
                              {data.count}×
                            </span>
                          </div>
                          <div className="mt-2 flex gap-3">
                            <div>
                              <div className="text-xs text-gray-400">Promet</div>
                              <div className="text-sm font-black text-red-500">−{data.promet.toFixed(2)} KM</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Zarada</div>
                              <div className="text-sm font-black text-red-500">−{data.zarada.toFixed(2)} KM</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ARTIKLI ── */}
            {Object.keys(articleMap).length > 0 && (
              <div className="mx-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="mb-3 font-black text-sm text-black">📦 Artikli ({tab.toLowerCase()})</div>
                <div className="space-y-2">
                  {Object.entries(articleMap)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => {
                      const source = potvrdjene.find((o) => o.product_name === name)?.source || "";
                      const zaradaPoKom = getZarada(source);
                      return (
                        <div key={name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                          <div className="min-w-0 mr-2">
                            <div className="truncate text-sm font-semibold text-black">{name}</div>
                            {zaradaPoKom > 0 && (
                              <div className="text-xs text-gray-400">
                                {count} × {zaradaPoKom.toFixed(2)} KM
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-700">
                              {count}×
                            </span>
                            {zaradaPoKom > 0 && (
                              <div className="mt-0.5 text-xs font-black text-green-600">
                                +{(count * zaradaPoKom).toFixed(2)} KM
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ── NARUDŽBE LISTA ── */}
            <div className="mx-4 mt-3">
              <div className="mb-3 font-black text-sm text-black">
                🧾 Potvrđene narudžbe ({tab.toLowerCase()})
              </div>
              <div className="space-y-2">
                {potvrdjene.length === 0 && (
                  <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-400 font-semibold">
                    Nema potvrđenih narudžbi za ovaj period.
                  </div>
                )}
                {potvrdjene.map((o) => {
                  const zarada = getZarada(o.source);
                  const isOtkucano = o.status === "otkucano";
                  return (
                    <div
                      key={o.id}
                      className={`rounded-xl bg-white p-4 border-2 ${
                        isOtkucano ? "border-blue-300" : "border-green-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-black truncate">{o.full_name}</div>
                          <div className="text-xs text-gray-400 truncate">{o.product_name}</div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          isOtkucano
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {isOtkucano ? "📦 Otkucano" : "✅ Potvrđena"}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          {new Date(o.created_at).toLocaleString("bs-BA", {
                            day: "2-digit", month: "2-digit",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </div>
                        <div className="flex gap-3 items-center">
                          <span className="text-sm font-bold text-gray-700">{o.total.toFixed(2)} KM</span>
                          {zarada > 0 ? (
                            <span className="text-sm font-black text-green-600">+{zarada.toFixed(2)} KM</span>
                          ) : (
                            <span className="text-xs font-semibold text-yellow-600">⚠️ bez marže</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}