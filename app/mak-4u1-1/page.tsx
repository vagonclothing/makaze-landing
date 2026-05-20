"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

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
    { icon: "🔩", name: "Aku udarni odvijač", desc: "180 Nm – vijci bez napora" },
    { icon: "⚙️", name: "Aku kutna brusilica", desc: "Disk 115mm – reže i brusi" },
    { icon: "🪨", name: "Aku SDS bušilica", desc: "Beton, cigla i kamen" },
    { icon: "🔧", name: "Aku bušilica", desc: "Drvo, metal, plastika" },
  ];

  const benefits = [
    "Radi svugdje – bez kabla i produžnog voda",
    "Sva 4 alata u jednom čvrstom koferu",
    "4 baterije – radiš bez prekida",
    "SDS bušilica probija beton i ciglu",
    "Brzi punjač – kratko čekaš, dugo radiš",
    "Tvrdi kofer štiti alat na gradilištu i u autu",
    "3 godine garancije na sve alate u setu",
  ];

  const testimonials = [
    { text: "Koristim na gradilištu svaki dan. Baterije traju, kofer je čvrst. Solidna stvar.", author: "Nermin B.", city: "Sarajevo" },
    { text: "Radio kompletnu renovaciju stana ovim setom. Za tu cijenu – odlično.", author: "Emir T.", city: "Tuzla" },
    { text: "SDS bušilica je odlična za beton. Ništa joj ne može. Zadovoljan sam.", author: "Zoran K.", city: "Banja Luka" },
    { text: "Dosta mi je kablova svuda po radionici. Ove baterije traju kako treba.", author: "Branko M.", city: "Mostar" },
    { text: "Garancija 3 godine je bila presudna. Pravi alat, ne igračka.", author: "Adis H.", city: "Zenica" },
    { text: "Poklonio ocu za rođendan. Veoma zadovoljan, svaki dan ga koristi.", author: "Damir Š.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Šta je sve u setu?", a: "Aku udarni odvijač, aku kutna brusilica, aku SDS bušilica, aku bušilica, 4 baterije 128V, brzi punjač i tvrdi kofer." },
    { q: "Može li SDS bušilica bušiti beton?", a: "Da. SDS bušilica ima udarnu i rotacijsku funkciju i namijenjena je za beton, ciglu i kamen." },
    { q: "Koliko traje baterija?", a: "Baterije 128V Li-Ion dizajnirane su za duže korištenje. Sa brzim punjačem uvijek si spreman za rad." },
    { q: "Kakva je garancija?", a: "Na sve alate u setu dolazi 3 godine garancije – Makita standard kvalitete." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš tek kada preuzmeš paket na svojoj adresi." },
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
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap');

        .fd { font-family: 'Oswald', sans-serif; }
        .fb { font-family: 'Source Sans 3', sans-serif; }

        .inp {
          font-family: 'Source Sans 3', sans-serif;
          font-size: 16px;
          background: #fff;
          border: 2px solid #ddd;
          color: #1a1a1a;
          transition: border-color .2s;
        }
        .inp::placeholder { color: #aaa; }
        .inp:focus { outline: none; border-color: #F5A800; }

        .order-btn {
          background: #F5A800;
          color: #1C1200;
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          letter-spacing: .05em;
          transition: background .15s, transform .15s;
        }
        .order-btn:hover:not(:disabled) {
          background: #e09a00;
          transform: translateY(-1px);
        }
        .order-btn:disabled { opacity: .65; }

        .tool-card {
          background: #fff;
          border: 2px solid #eee;
          transition: border-color .2s;
        }
        .tool-card:hover { border-color: #F5A800; }
      `}</style>

      <div className="fb min-h-screen pb-16" style={{ background: "#F4F1EB", color: "#1a1a1a" }}>
        <div className="mx-auto max-w-md overflow-hidden bg-white shadow-lg">

          {/* ── HERO ── */}
          <section style={{ background: "#1C1200" }}>
            {/* Top label */}
            <div
              className="fd py-3 text-center text-sm tracking-widest"
              style={{ background: "#F5A800", color: "#1C1200", fontSize: "13px" }}
            >
              🔧 PROFESIONALNI AKU SET · 4 ALATA · 3 GOD. GARANCIJA
            </div>

            <div className="px-5 pb-7 pt-5">
              <h1
                className="fd text-center leading-tight text-white"
                style={{ fontSize: "38px" }}
              >
                MAKITA AKU SET 4U1
              </h1>
              <p
                className="mt-2 text-center text-base font-semibold"
                style={{ color: "#F5A800" }}
              >
                Udarni odvijač · Brusilica · SDS Bušilica · Bušilica
              </p>

              {/* Image */}
              <div className="mt-4 overflow-hidden rounded-2xl" style={{ border: "3px solid #F5A800" }}>
                <img
                  src="https://i.imgur.com/zq6UeUi.jpeg"
                  alt="Makita aku set 4u1"
                  className="w-full object-cover"
                />
              </div>

              {/* Price block */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Vrijednost seta
                  </div>
                  <div
                    className="fd mt-1 text-3xl line-through"
                    style={{ color: "rgba(255,255,255,0.3)", fontSize: "28px" }}
                  >
                    300,00 KM
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "#F5A800" }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-yellow-900">
                    Vaša cijena
                  </div>
                  <div className="fd mt-1 text-white" style={{ fontSize: "30px", color: "#1C1200" }}>
                    179,90 KM
                  </div>
                  <div className="text-xs font-bold" style={{ color: "#1C1200" }}>
                    + 3 god. garancija
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToOrder}
                className="order-btn mt-4 w-full rounded-xl py-4 font-bold"
              >
                NARUČI SET ODMAH
              </button>
              <p className="mt-2 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Plaćanje pouzećem · Dostava na kućnu adresu
              </p>
            </div>
          </section>

          {/* ── ŠTA JE U SETU ── */}
          <section className="px-5 py-6" style={{ background: "#fff" }}>
            <h2 className="fd mb-4 text-2xl" style={{ color: "#1C1200" }}>
              📦 ŠTA JE SVE U SETU
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {tools.map((t) => (
                <div key={t.name} className="tool-card rounded-xl p-4">
                  <div className="text-3xl">{t.icon}</div>
                  <div className="mt-2 font-bold text-base" style={{ color: "#1C1200" }}>{t.name}</div>
                  <div className="mt-0.5 text-sm" style={{ color: "#777" }}>{t.desc}</div>
                </div>
              ))}
            </div>

            <div
              className="mt-4 rounded-xl p-4"
              style={{ background: "#FFF8E6", border: "2px solid #F5A800" }}
            >
              <div className="fd mb-3 text-base" style={{ color: "#1C1200" }}>
                + UKLJUČENO U SET:
              </div>
              {["4× baterija 128V Li-Ion", "Brzi punjač", "Tvrdi kofer za transport"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-1.5">
                  <span className="text-lg">✅</span>
                  <span className="text-base font-semibold" style={{ color: "#1C1200" }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── GARANCIJA ── */}
          <section
            className="px-5 py-6 text-center"
            style={{ background: "#1C1200" }}
          >
            <div
              className="fd text-white"
              style={{ fontSize: "64px", lineHeight: 1, opacity: 0.12 }}
            >
              3 GOD.
            </div>
            <div className="-mt-10 relative z-10">
              <div className="fd text-white" style={{ fontSize: "42px" }}>
                3 GODINE
              </div>
              <div className="fd" style={{ fontSize: "28px", color: "#F5A800" }}>
                GARANCIJE
              </div>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                Na sve alate u setu. Kupuješ bez rizika – Makita stoji iza svakog alata.
              </p>
              <div
                className="fd mx-auto mt-4 inline-block rounded-full px-6 py-2 text-base"
                style={{ background: "#F5A800", color: "#1C1200" }}
              >
                🛡️ ZAŠTITA KUPCA
              </div>
            </div>
          </section>

          {/* ── ZAŠTO OVAJ SET ── */}
          <section className="px-5 py-6" style={{ background: "#fff" }}>
            <h2 className="fd mb-4 text-2xl" style={{ color: "#1C1200" }}>
              ✅ ZAŠTO OVAJ SET
            </h2>
            <div className="space-y-2">
              {benefits.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#F9F9F9", border: "1.5px solid #eee" }}
                >
                  <span className="mt-0.5 text-lg flex-shrink-0">✅</span>
                  <span className="text-base font-semibold leading-snug" style={{ color: "#1a1a1a" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ── EXPERT ── */}
          <section className="px-5 py-6" style={{ background: "#FFF8E6" }}>
            <div
              className="rounded-2xl p-5"
              style={{ background: "#fff", border: "2px solid #F5A800" }}
            >
              <h2 className="fd mb-3 text-xl" style={{ color: "#1C1200" }}>
                👷 MIŠLJENJE MAJSTORA
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#444", fontStyle: "italic" }}>
                "Aku alati su budućnost svake radionice. Makita baterije su pouzdane, a kada u jednom koferu dobiješ četiri alata – to je prava ušteda. Preporučujem svakom ko ozbiljno radi."
              </p>
              <div className="mt-3 font-bold text-base" style={{ color: "#F5A800" }}>
                — Haris Begić, majstor opće gradnje
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="px-5 py-6" style={{ background: "#fff" }}>
            <h2 className="fd mb-4 text-2xl" style={{ color: "#1C1200" }}>
              💬 KUPCI KAŽU
            </h2>
            <div className="space-y-3">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{ background: "#F9F9F9", border: "1.5px solid #eee" }}
                >
                  <p className="text-base leading-relaxed" style={{ color: "#444" }}>
                    "{t.text}"
                  </p>
                  <div className="mt-2 font-bold text-sm" style={{ color: "#F5A800" }}>
                    — {t.author}, {t.city}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── URGENCY ── */}
          <section
            className="px-5 py-5 text-center"
            style={{ background: "#C0392B" }}
          >
            <div className="fd text-white" style={{ fontSize: "22px" }}>
              ⏳ OGRANIČENE ZALIHE
            </div>
            <p className="mt-1 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>
              179,90 KM za kompletan set je trenutna akcijska cijena.
            </p>
          </section>

          {/* ── FAQ ── */}
          <section className="px-5 py-6" style={{ background: "#fff" }}>
            <h2 className="fd mb-4 text-2xl" style={{ color: "#1C1200" }}>
              ❓ ČESTO POSTAVLJANA PITANJA
            </h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl p-4"
                  style={{ background: "#F9F9F9", border: "1.5px solid #eee" }}
                >
                  <div className="font-bold text-base" style={{ color: "#1C1200" }}>
                    {item.q}
                  </div>
                  <p className="mt-2 text-base leading-relaxed" style={{ color: "#555" }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ORDER FORM ── */}
          <section
            ref={orderRef}
            className="px-5 py-7"
            style={{ background: "#1C1200" }}
          >
            <div
              className="fd mb-1 rounded-xl py-3 text-center text-base tracking-wider"
              style={{ background: "#F5A800", color: "#1C1200" }}
            >
              🔧 MAKITA AKU SET 4U1
            </div>

            <h2
              className="fd mt-4 text-center text-white"
              style={{ fontSize: "34px" }}
            >
              NARUČI ODMAH
            </h2>
            <p
              className="mt-1 text-center text-base"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Plaćanje pouzećem · Dostava na adresu
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
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
                  className="inp w-full rounded-xl p-4"
                />
              ))}

              <label
                className="flex cursor-pointer items-start gap-3 rounded-xl p-4"
                style={{
                  background: giftPack ? "#FFF8E6" : "rgba(255,255,255,0.07)",
                  border: `2px solid ${giftPack ? "#F5A800" : "rgba(255,255,255,0.15)"}`,
                  transition: "all .2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={giftPack}
                  onChange={(e) => setGiftPack(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-amber-500"
                />
                <div>
                  <div
                    className="text-base font-bold"
                    style={{ color: giftPack ? "#1C1200" : "#fff" }}
                  >
                    Poklon pakovanje
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: giftPack ? "#7a5c00" : "rgba(255,255,255,0.45)" }}
                  >
                    + 5,00 KM
                  </div>
                </div>
              </label>

              {/* Price summary */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#fff", border: "2px solid #F5A800" }}
              >
                {[
                  { label: "Makita aku set 4u1", value: "179,90 KM" },
                  { label: "Dostava", value: "10,00 KM" },
                  ...(giftPack ? [{ label: "Poklon pakovanje", value: "5,00 KM" }] : []),
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between py-1 text-base"
                    style={{ color: "#666" }}
                  >
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
                <div
                  className="mt-2 border-t pt-3"
                  style={{ borderColor: "#eee" }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="fd text-xl" style={{ color: "#1C1200" }}>
                      UKUPNO
                    </span>
                    <span className="fd text-2xl" style={{ color: "#F5A800" }}>
                      {total.toFixed(2)} KM
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="order-btn w-full rounded-xl py-5"
              >
                {loading ? "ŠALJE SE..." : "NARUČI ODMAH →"}
              </button>

              <p
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Plaćanje tek pri preuzimanju paketa
              </p>
            </form>
          </section>

        </div>
      </div>
    </>
  );
}