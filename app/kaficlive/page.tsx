"use client";

import { useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    "Konobar naručuje na telefonu — bez papira i vikanja",
    "Šank vidi narudžbu odmah sa zvučnom notifikacijom",
    "Admin prati promet u realnom vremenu s bilo kojeg uređaja",
    "Napomene po svakom artiklu — bez grešaka u pripremi",
    "Naplata jednim klikom — konobar vidi ukupnu cifru po stolu",
    "Vi podešavate meni, kategorije i cijene — sami, kad hoćete",
  ];

  const testimonials = [
    "Od kad koristimo KafićLive, konobar ne trči do šanka svaki put. Sve ide brže. — Emir T., vlasnik kafića, Sarajevo",
    "Vidim promet u realnom vremenu s telefona. Znao sam tačno koji stol nosi najviše. — Selma K., vlasnik, Tuzla",
    "Osoblje se naučilo za 15 minuta. Nema komplikacija, radi savršeno. — Adnan M., kafić, Banja Luka",
    "Narudžbe više ne gube se ni ne zaboravljaju. Gosti su zadovoljniji. — Lejla P., menadžer, Mostar",
  ];

  const faqs = [
    {
      q: "Da li trebam poseban uređaj?",
      a: "Ne. Radi na svakom pametnom telefonu, tabletu i računaru — bilo koji pretraživač je dovoljan.",
    },
    {
      q: "Koliko stolova može imati kafić?",
      a: "Neograničeno. Podešavate broj stolova u admin panelu po potrebi.",
    },
    {
      q: "Kako konobar vidi kad je narudžba gotova?",
      a: "Šank označava status 'Gotovo' i narudžba se pojavljuje kononbaru u naplati — spreman za naplatu.",
    },
    {
      q: "Mogu li mijenjati meni i cijene?",
      a: "Da, admin može dodavati, mijenjati i brisati artikle i kategorije u sekundi. Promjena je vidljiva odmah.",
    },
    {
      q: "Šta ako nemam internet?",
      a: "Sistem radi u oblaku i zahtijeva internet vezu — standardni WiFi u kafiću je sasvim dovoljan.",
    },
    {
      q: "Da li ovo zamjenjuje fiskalnu kasu?",
      a: "Ne. KafićLive je pomoćni alat za efikasnost — ide uz vašu postojeću fiskalnu kasu, ne zamjenjuje je.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "KafićLive — sistem za narudžbe",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("kafic") || ""),
      postal_code: String(formData.get("grad") || ""),
      gift_pack: false,
      shipping: 0,
      product_price: 999,
      total: 999,
      status: "novo",
      source: "kafic-live",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);

    if (error) {
      alert("Greška pri slanju. Pokušajte ponovo.");
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

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10 text-black">
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-orange-950 to-amber-800 px-4 pb-6 pt-5 text-white">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute -left-14 bottom-10 h-44 w-44 rounded-full bg-orange-300/15 blur-3xl" />

          <div className="relative z-10">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-amber-200 shadow-lg ring-1 ring-white/20">
              ☕ Digitalni sistem za kafiće • Jednokratno plaćanje
            </div>

            <h1 className="mt-4 text-center text-3xl font-black leading-tight">
              Vaš kafić radi brže.<br />Vi zarađujete više.
            </h1>

            <p className="mt-2 text-center text-sm font-semibold text-amber-100">
              Konobar naručuje na telefonu. Šank vidi odmah. Vi pratite promet uživo.
            </p>

            {/* Mock screen */}
            <div className="mt-4 rounded-[24px] bg-white p-3 shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-stone-950">
                {/* Fake šank screen */}
                <div className="bg-stone-900 px-3 py-2 flex items-center justify-between border-b border-white/10">
                  <span className="text-xs font-black text-amber-400">☕ KafićLive · Šank ekran</span>
                  <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2">
                  <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-2">
                    <div className="text-[10px] font-black text-red-400 mb-1">NOVO</div>
                    <div className="text-base font-black text-red-300">Sto 5</div>
                    <div className="text-[10px] text-white/60 mt-1">2x Cappuccino</div>
                    <div className="text-[10px] text-amber-300 italic">bez šećera</div>
                    <div className="mt-2 rounded-lg bg-amber-500 text-center text-[10px] font-black text-white py-1">Pokreni ▶</div>
                  </div>
                  <div className="bg-green-900/40 border border-green-500/40 rounded-xl p-2">
                    <div className="text-[10px] font-black text-green-400 mb-1">GOTOVO</div>
                    <div className="text-base font-black text-green-300">Sto 2</div>
                    <div className="text-[10px] text-white/60 mt-1">1x Espresso</div>
                    <div className="text-[10px] text-white/60">1x Rakija</div>
                    <div className="mt-2 rounded-lg bg-white/10 text-center text-[10px] font-black text-white/60 py-1">Arhiviraj ✓</div>
                  </div>
                </div>
                <div className="px-3 pb-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-2 flex justify-between items-center">
                    <span className="text-[10px] text-white/50">Dnevni promet</span>
                    <span className="text-sm font-black text-amber-400">432,00 KM</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToOrder}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-base font-black uppercase tracking-wide text-stone-950 shadow-xl"
            >
              Zatražite besplatnu prezentaciju →
            </button>
          </div>
        </section>

        <main className="px-4 py-5">

          {/* Problem */}
          <section className="rounded-3xl bg-stone-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black text-amber-300">
              ☕ Konobar viče prema šanku. Narudžbe se gube. Vi ne znate šta se dešava.
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-200">
              Svaki kafić koji radi na papiru ili "napamet" gubi novac svaki dan — kroz greške, 
              sporiju uslugu i nemogućnost praćenja prometa. KafićLive rješava sve to za 
              manje od 1.000 KM — jednokratno, zauvijek vaše.
            </p>
          </section>

          {/* Features */}
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
            <h2 className="text-xl font-black">✅ Šta dobijate?</h2>
            <div className="mt-4 space-y-3">
              {features.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-stone-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          {/* 3 roles */}
          <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-xl font-black mb-4">👥 Tri uloge, jedna platforma</h2>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="font-black text-stone-900 mb-1">📱 Konobar</div>
                <div className="text-sm text-stone-600 leading-6">Bira stol, dodaje artikle s napomenama i šalje narudžbu jednim klikom. Radi na svakom telefonu.</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="font-black text-stone-900 mb-1">🖥️ Šank ekran</div>
                <div className="text-sm text-stone-600 leading-6">Svaka narudžba se pojavljuje odmah sa zvukom. Status: Novo → U pripremi → Gotovo. Bez osvježavanja.</div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="font-black text-stone-900 mb-1">📊 Admin / Vlasnik</div>
                <div className="text-sm text-stone-600 leading-6">Promet po satu, najprodavaniji artikli, ranking stolova — s telefona, iz auta, od kuće. Uvijek uživo.</div>
              </div>
            </div>
          </section>

          {/* Urgency */}
          <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-stone-950">
              💡 Ne mijenja fiskalnu kasu — ide uz nju
            </div>
            <div className="mt-1 text-xs font-semibold text-stone-700">
              Nema mjesečnih pretplata. Jednokratno plaćanje, zauvijek vaše.
            </div>
          </section>

          {/* Testimonials */}
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-amber-100">
            <h2 className="text-xl font-black">💬 Vlasnici kažu</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                >
                  <p className="text-sm leading-6 text-stone-700">"{item}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="mt-5 rounded-3xl bg-stone-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black text-amber-300">💰 Cijena</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between rounded-2xl bg-white/10 p-3 text-sm">
                <span>KafićLive sistem</span><span className="font-black">999 KM</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-white/10 p-3 text-sm">
                <span>Instalacija i podešavanje</span><span className="font-black text-green-400">Uključeno</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-white/10 p-3 text-sm">
                <span>Obuka osoblja</span><span className="font-black text-green-400">Uključeno</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-white/10 p-3 text-sm">
                <span>6 mjeseci podrške</span><span className="font-black text-green-400">Uključeno</span>
              </div>
              <div className="flex justify-between rounded-2xl bg-white/10 p-3 text-sm">
                <span>Mjesečna naknada</span><span className="font-black text-green-400">0 KM</span>
              </div>
              <div className="mt-3 rounded-2xl border-2 border-amber-400 bg-amber-400/10 p-4">
                <div className="flex justify-between text-lg font-black">
                  <span>Ukupno</span><span className="text-amber-300">999 KM</span>
                </div>
                <div className="text-xs text-stone-400 mt-1">Jednokratno. Bez skrivenih troškova.</div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-5 rounded-3xl border border-amber-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <h3 className="text-sm font-black text-amber-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Urgency banner */}
          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-red-800">
              ⏳ Ograničen broj instalacija ovaj mjesec
            </div>
            <div className="mt-1 text-xs font-semibold text-stone-700">
              Ostavite kontakt danas i javimo se u roku 24h.
            </div>
          </section>

          {/* ── FORMA ── */}
          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-stone-950 to-amber-950 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-stone-950 shadow-lg">
              ☕ KafićLive — sistem za narudžbe
            </div>

            <h2 className="text-center text-2xl font-black">📋 Zatražite prezentaciju</h2>
            <p className="mt-2 text-center text-sm text-amber-100">
              Besplatno. Bez obaveza. Javimo se danas.
            </p>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-green-500/20 border border-green-400/40 p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-xl font-black text-green-300 mb-2">Zahtjev primljen!</div>
                <div className="text-sm text-stone-300 leading-6">
                  Javit ćemo vam se u roku 24 sata.<br />Hvala na povjerenju!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  name="ime"
                  autoComplete="off"
                  placeholder="Ime i prezime"
                  className="w-full rounded-2xl border-2 border-amber-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
                />
                <input
                  name="telefon"
                  autoComplete="off"
                  placeholder="Broj telefona"
                  className="w-full rounded-2xl border-2 border-amber-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
                />
                <input
                  name="kafic"
                  autoComplete="off"
                  placeholder="Naziv kafića"
                  className="w-full rounded-2xl border-2 border-amber-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
                />
                <select
                  name="grad"
                  className="w-full rounded-2xl border-2 border-amber-200 bg-white p-4 text-black outline-none"
                >
                  <option value="">Odaberite grad...</option>
                  <option>Sarajevo</option>
                  <option>Banja Luka</option>
                  <option>Tuzla</option>
                  <option>Mostar</option>
                  <option>Zenica</option>
                  <option>Bijeljina</option>
                  <option>Trebinje</option>
                  <option>Bihać</option>
                  <option>Drugi grad</option>
                </select>

                <div className="rounded-2xl border-2 border-amber-300 bg-white/10 p-4">
                  <div className="flex justify-between text-sm text-amber-100">
                    <span>KafićLive sistem</span>
                    <span>999 KM</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-300 mt-1">
                    <span>Instalacija + obuka</span>
                    <span>Gratis</span>
                  </div>
                  <div className="mt-3 border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-black">
                      <span>Ukupno</span>
                      <span className="text-amber-300">999 KM</span>
                    </div>
                    <div className="text-xs text-stone-400 mt-1">Jednokratno. Bez mjesečne pretplate.</div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-amber-400 p-4 text-lg font-black uppercase tracking-wide text-stone-950 shadow-lg disabled:opacity-70"
                >
                  {loading ? "Šalje se..." : "Pošalji zahtjev — javimo se danas!"}
                </button>

                <p className="text-center text-xs text-stone-400">
                  🔒 Vaši podaci su sigurni. Bez spama.
                </p>
              </form>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}