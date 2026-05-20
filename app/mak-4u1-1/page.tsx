"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const ACCENT = "#C8FF00";
const ACCENT_DIM = "rgba(200,255,0,0.10)";
const ACCENT_BORDER = "rgba(200,255,0,0.28)";

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading] = useState(false);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const baseTotal = 189.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const tools = [
    { icon: "🔩", name: "Udarni odvijač", desc: "180 Nm – vijci za sekundu" },
    { icon: "⚙️", name: "Kutna brusilica", desc: "Disk 115mm – reže i brusi" },
    { icon: "🪨", name: "SDS bušilica", desc: "Beton, cigla, kamen" },
    { icon: "🔧", name: "Bušilica", desc: "Drvo, metal, plastika" },
  ];

  const included = [
    "4× baterija 128V Li-Ion",
    "Brzi punjač u kompletu",
    "Tvrdi kofer za transport",
  ];

  const benefits = [
    "Radi svugdje – nema kabla, nema produžnog",
    "4 alata u jednom koferu – uvijek spreman",
    "Baterije traju dugo, punjač puni brzo",
    "SDS bušilica bori se s betonom i kamenom",
    "Tvrdi kofer štiti alat na gradilištu i u autu",
    "3 godine garancije – Makita standard",
  ];

  const testimonials = [
    { text: "Koristim na gradilištu svaki dan. Baterije traju, kofer je masivan. Pravo rješenje.", author: "Nermin B.", city: "Sarajevo" },
    { text: "Radio kompletnu renovaciju stana ovim setom. Vrijednost za novac je odlična.", author: "Emir T.", city: "Tuzla" },
    { text: "SDS bušilica je fenomenalna za beton. Ništa joj ne može. Sretan kupac.", author: "Zoran K.", city: "Banja Luka" },
    { text: "Dosta mi je kablova svuda. Ove baterije traju, nema stajanja na poslu.", author: "Branko M.", city: "Mostar" },
    { text: "3 godine garancije je ono što me odlučilo. Pravi alat, ne igračka.", author: "Adis H.", city: "Zenica" },
    { text: "Poklonio ocu za rođendan. Prezadovoljan je, naziva svaki dan da hvali.", author: "Damir Š.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Šta je sve u setu?", a: "Aku udarni odvijač, aku kutna brusilica, aku SDS bušilica, aku bušilica, 4 baterije 128V, brzi punjač i tvrdi kofer." },
    { q: "Može li SDS bušilica bušiti beton?", a: "Da. SDS bušilica ima udarne i rotacijske funkcije i namijenjena je upravo za beton, ciglu i kamen." },
    { q: "Koliko traje baterija?", a: "Baterije 128V Li-Ion dizajnirane su za duže korištenje. Uz brzi punjač uvijek si spreman nastaviti rad." },
    { q: "Kakva je garancija?", a: "Na sve alate u setu dolazi 3 godine garancije – Makita standard kvalitete." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš tek kada preuzmeš paket na kućnu adresu." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Makita aku set 4u1 – udarni odvijač, brusilica, SDS bušilica, bušilica",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 179.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "makita-4u1",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);

    if (error) {
      alert("Greška pri slanju narudžbe. Pokušajte ponovo.");
      setLoading(false);
      return;
    }

    if (window.fbq) {
      window.fbq("track", "Lead", {
        content_name: order.product_name,
        value: order.total,
        currency: "BAM",
      });
    }

    alert("Narudžba uspješno poslana!");
    form.reset();
    setGiftPack(false);
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .fd { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .fb { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseLime {
          0%,100% { box-shadow: 0 0 0 0 rgba(200,255,0,0.45); }
          60%      { box-shadow: 0 0 0 10px rgba(200,255,0,0); }
        }

        .a1 { animation: fadeUp .5s .05s ease both; }
        .a2 { animation: fadeUp .5s .15s ease both; }
        .a3 { animation: fadeUp .5s .25s ease both; }
        .a4 { animation: fadeUp .5s .35s ease both; }
        .a5 { animation: fadeUp .5s .45s ease both; }

        .pulse { animation: pulseLime 2.2s infinite; }

        .hero-glow {
          background: radial-gradient(ellipse 90% 55% at 50% 105%, rgba(200,255,0,0.14) 0%, transparent 70%);
          pointer-events: none;
        }

        .tool-card {
          background: linear-gradient(145deg, #181818, #111);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color .2s, transform .2s;
        }
        .tool-card:hover {
          border-color: rgba(200,255,0,0.38);
          transform: translateY(-2px);
        }

        .inp {
          background: #121212;
          border: 1.5px solid rgba(255,255,255,0.10);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .2s;
        }
        .inp::placeholder { color: rgba(255,255,255,0.28); }
        .inp:focus { outline: none; border-color: #C8FF00; }

        .lime-btn {
          background: #C8FF00;
          color: #080808;
          transition: transform .15s, box-shadow .15s;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: .06em;
        }
        .lime-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(200,255,0,0.38);
        }
        .lime-btn:active { transform: translateY(0); }

        .section-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,255,0,0.25), transparent);
        }

        .warranty-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px, 38vw, 180px);
          line-height: 1;
          color: #C8FF00;
          opacity: .08;
          user-select: none;
        }
      `}</style>

      <div className="fb min-h-screen pb-16" style={{ background: "#080808", color: "#fff" }}>
        <div className="mx-auto max-w-md overflow-hidden">

          {/* ── HERO ── */}
          <section className="relative overflow-hidden px-5 pb-8 pt-6">
            <div className="hero-glow absolute inset-0" />

            {/* Badge */}
            <div className="a1 relative z-10 flex justify-center mb-4">
              <span
                className="fd rounded-full px-4 py-2 text-sm tracking-widest"
                style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
              >
                🔧 PROFESIONALNI AKU SET · 4 ALATA
              </span>
            </div>

            {/* Headline */}
            <div className="a2 relative z-10 text-center">
              <h1
                className="fd leading-none"
                style={{ fontSize: "clamp(56px, 18vw, 80px)", color: "#fff" }}
              >
                MAKITA
              </h1>
              <h1
                className="fd leading-none"
                style={{ fontSize: "clamp(56px, 18vw, 80px)", color: ACCENT }}
              >
                4U1
              </h1>
              <p className="mt-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                Udarni odvijač · Brusilica · SDS Bušilica · Bušilica
              </p>
            </div>

            {/* Image */}
            <div className="a3 relative z-10 mt-5">
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 60px rgba(200,255,0,0.07)",
                }}
              >
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{ background: "linear-gradient(0deg, rgba(8,8,8,0.6) 0%, transparent 100%)" }}
                />
                <img
                  src="https://i.imgur.com/zq6UeUi.jpeg"
                  alt="Makita aku set 4u1"
                  className="w-full object-cover"
                />
              </div>
            </div>

            {/* Price cards */}
            <div className="a4 relative z-10 mt-5 grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl p-4"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Vrijednost
                </div>
                <div
                  className="fd mt-1 text-3xl line-through"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  300,00
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
                  4 alata odvojeno
                </div>
              </div>

              <div
                className="rounded-2xl p-4"
                style={{
                  background: "linear-gradient(135deg, #182000, #0f1700)",
                  border: `1.5px solid ${ACCENT_BORDER}`,
                }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: ACCENT }}
                >
                  Cijena seta
                </div>
                <div className="fd mt-1 text-3xl" style={{ color: ACCENT }}>
                  179,90
                </div>
                <div className="text-xs font-bold" style={{ color: ACCENT }}>
                  KM · 3 god. garancija
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="a5 relative z-10 mt-4">
              <button
                type="button"
                onClick={scrollToOrder}
                className="lime-btn pulse w-full rounded-2xl py-5 text-2xl"
              >
                NARUČI SET ODMAH →
              </button>
              <p
                className="mt-2 text-center text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Plaćanje pouzećem · Dostava na kućnu adresu
              </p>
            </div>
          </section>

          <div className="section-line" />

          {/* ── ŠTA JE U SETU ── */}
          <section className="px-5 py-7" style={{ background: "#0a0a0a" }}>
            <div className="fd mb-5 text-3xl text-white">ŠTA JE U SETU</div>

            <div className="grid grid-cols-2 gap-3">
              {tools.map((t) => (
                <div key={t.name} className="tool-card rounded-2xl p-4">
                  <div className="text-3xl">{t.icon}</div>
                  <div className="mt-2 text-sm font-bold text-white">{t.name}</div>
                  <div
                    className="mt-0.5 text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-3 rounded-2xl p-4"
              style={{ background: "#121212", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="mb-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: ACCENT }}
              >
                + Uključeno u set
              </div>
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3 py-1.5">
                  <div
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: ACCENT }}
                  />
                  <span className="text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="section-line" />

          {/* ── GARANCIJA ── */}
          <section
            className="relative overflow-hidden px-5 py-8 text-center"
            style={{
              background: "linear-gradient(135deg, #0d0d0d, #0c1700)",
              border: "none",
            }}
          >
            <div
              className="warranty-num absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
              aria-hidden
            >
              3
            </div>
            <div className="relative z-10">
              <div className="fd text-6xl text-white">3 GODINE</div>
              <div className="fd mt-1 text-4xl" style={{ color: ACCENT }}>
                GARANCIJE
              </div>
              <p
                className="mx-auto mt-3 max-w-xs text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Na sve alate u setu. Makita standard kvalitete – kupuješ bez rizika.
              </p>
              <div
                className="mx-auto mt-4 inline-block rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest"
                style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT_BORDER}`, color: ACCENT }}
              >
                🛡️ Zaštita kupca
              </div>
            </div>
          </section>

          <div className="section-line" />

          {/* ── ZAŠTO OVAJ SET ── */}
          <section className="px-5 py-7" style={{ background: "#0a0a0a" }}>
            <div className="fd mb-5 text-3xl text-white">ZAŠTO OVAJ SET</div>
            <div className="space-y-2">
              {benefits.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl px-4 py-3.5"
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    className="fd flex-shrink-0 text-xl"
                    style={{ color: ACCENT }}
                  >
                    0{i + 1}
                  </span>
                  <span className="text-sm font-semibold leading-snug text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="section-line" />

          {/* ── EXPERT ── */}
          <section className="px-5 py-7" style={{ background: "#0d0d0d" }}>
            <div
              className="rounded-3xl p-5"
              style={{
                background: "linear-gradient(145deg, #161616, #0f0f0f)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="fd mb-3 text-xl text-white">👷 MIŠLJENJE MAJSTORA</div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
              >
                "Aku alati su budućnost radionice i gradilišta. Makita baterije su pouzdane, a kada u jednom koferu dobiješ četiri alata – to je stvarna ušteda i sloboda. Preporučujem svakom ko ozbiljno radi."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: ACCENT_BORDER }} />
                <span
                  className="text-xs font-bold"
                  style={{ color: ACCENT }}
                >
                  Haris Begić, majstor opće gradnje
                </span>
              </div>
            </div>
          </section>

          <div className="section-line" />

          {/* ── TESTIMONIALS ── */}
          <section className="px-5 py-7" style={{ background: "#0a0a0a" }}>
            <div className="fd mb-5 text-3xl text-white">KUPCI KAŽU</div>
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    "{t.text}"
                  </p>
                  <div className="mt-2 text-xs font-bold" style={{ color: ACCENT }}>
                    {t.author} · {t.city}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="section-line" />

          {/* ── URGENCY ── */}
          <section
            className="px-5 py-5 text-center"
            style={{
              background: "linear-gradient(135deg, #1a0000, #100000)",
              borderTop: "1px solid rgba(255,70,70,0.12)",
              borderBottom: "1px solid rgba(255,70,70,0.12)",
            }}
          >
            <div
              className="fd text-2xl"
              style={{ color: "#FF5252" }}
            >
              ⏳ OGRANIČENE ZALIHE
            </div>
            <p
              className="mt-1 text-xs"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              179,90 KM za kompletan set je trenutna akcijska cijena.
            </p>
          </section>

          <div className="section-line" />

          {/* ── FAQ ── */}
          <section className="px-5 py-7" style={{ background: "#0a0a0a" }}>
            <div className="fd mb-5 text-3xl text-white">PITANJA</div>
            <div className="space-y-3">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl p-4"
                  style={{
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="text-sm font-bold text-white">{item.q}</div>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="section-line" />

          {/* ── ORDER FORM ── */}
          <section
            ref={orderRef}
            className="px-5 py-8"
            style={{
              background: "linear-gradient(180deg, #0a0a0a 0%, #0c1800 100%)",
            }}
          >
            <div className="mb-6 text-center">
              <span
                className="fd inline-block rounded-full px-5 py-2 text-sm tracking-widest"
                style={{
                  background: ACCENT_DIM,
                  border: `1px solid ${ACCENT_BORDER}`,
                  color: ACCENT,
                }}
              >
                MAKITA AKU SET 4U1
              </span>
              <h2 className="fd mt-3 text-4xl text-white">NARUČI ODMAH</h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Plaćanje pouzećem · Dostava na adresu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "ime", placeholder: "Ime i prezime" },
                { name: "telefon", placeholder: "Broj telefona" },
                { name: "adresa", placeholder: "Adresa i mjesto" },
                { name: "postanski", placeholder: "Poštanski broj" },
              ].map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  autoComplete="off"
                  placeholder={field.placeholder}
                  className="inp w-full rounded-2xl p-4 text-sm"
                />
              ))}

              <label
                className="flex cursor-pointer gap-3 rounded-2xl p-4"
                style={{
                  background: "#111",
                  border: `1.5px solid ${giftPack ? ACCENT_BORDER : "rgba(255,255,255,0.08)"}`,
                  transition: "border-color .2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={giftPack}
                  onChange={(e) => setGiftPack(e.target.checked)}
                  className="mt-0.5 accent-lime-400"
                />
                <div>
                  <div className="text-sm font-bold text-white">
                    Poklon pakovanje
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                  >
                    + 5,00 KM
                  </div>
                </div>
              </label>

              {/* Summary */}
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "#111",
                  border: `1.5px solid ${ACCENT_BORDER}`,
                }}
              >
                {[
                  { label: "Makita aku set 4u1", value: "179,90 KM" },
                  { label: "Dostava", value: "10,00 KM" },
                  ...(giftPack ? [{ label: "Poklon pakovanje", value: "5,00 KM" }] : []),
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-1 text-sm"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <div
                  className="mt-3 border-t pt-3"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="fd text-xl text-white">UKUPNO</span>
                    <span className="fd text-2xl" style={{ color: ACCENT }}>
                      {total.toFixed(2)} KM
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="lime-btn w-full rounded-2xl py-5 text-2xl disabled:opacity-60"
              >
                {loading ? "ŠALJE SE..." : "NARUČI ODMAH →"}
              </button>
            </form>
          </section>

        </div>
      </div>
    </>
  );
}