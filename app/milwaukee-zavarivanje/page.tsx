"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseTotal = 79.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const features = [
    "Velika snaga – 500A za ozbiljne poslove",
    "Inverter tehnologija – stabilan luk i ušteda energije",
    "Kompaktan i lagan – lako prenosiv i praktičan",
    "Jednostavno korištenje – za amatere i profesionalce",
    "Niska potrošnja struje – ekonomičan rad",
    "Radi sa svim vrstama elektroda",
    "Ugrađen ventilator za hlađenje",
  ];

  const packageItems = [
    "1x Milwaukee inverter aparat za zavarivanje 500A",
    "2x Kabeli s kleštima",
    "1x Zaštitna maska za lice",
    "1x Čekić i četka za čišćenje",
    "1x Praktični kofer",
    "3 godine garancije",
  ];

  const testimonials = [
    "Nevjerovatno jak aparat! Lagano sam zavarivao sve što mi je trebalo kod kuće. Preporučujem svima.",
    "Radio sam s više aparata, ali ovaj Milwaukee 500A mi je favorit. Stabilan, snažan i lagan.",
    "Savršen za radionicu! Imao sam sumnje, ali sad mi je žao što ga nisam ranije kupio.",
    "S ovim aparatom čak i ja koji nisam profesionalac mogu raditi kao pravi majstor!",
    "Garancija 3 godine me odmah uvjerila – i nisam se prevario. Radi kao sat!",
  ];

  const audience = [
    "Hobi majstore",
    "Kućne radionice",
    "Poluprofesionalne korisnike",
    "Profesionalne korisnike",
  ];

  const faqs = [
    {
      q: "Je li aparat jednostavan za korištenje?",
      a: "Da, vrlo jednostavan. Uključite, namjestite jačinu i spreman je za rad.",
    },
    {
      q: "Može li se koristiti za sve vrste elektroda?",
      a: "Da. Aparat podržava rutile, bazne, inox i druge vrste elektroda.",
    },
    {
      q: "Koliko je aparat težak?",
      a: "Zahvaljujući inverter tehnologiji, vrlo je lagan i lako prenosiv, manje od 5 kg.",
    },
    {
      q: "Je li dobar za profesionalnu upotrebu?",
      a: "Da. Snaga, stabilnost luka i pouzdan rad čine ga odličnim izborom i za profesionalce.",
    },
    {
      q: "Kako funkcioniše garancija?",
      a: "Uređaj ima 3 godine garancije na tvorničke kvarove.",
    },
    {
      q: "Dolazi li zaštitna oprema?",
      a: "Da, u paketu dobijate osnovnu zaštitnu masku.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Milwaukee aparat za zavarivanje inverter 500A",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 69.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "milwaukee-zavarivanje",
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

    if (typeof window !== "undefined" && window.fbq) {
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
    <div className="min-h-screen bg-neutral-100 pb-24 text-black">
      <div className="mx-auto max-w-md bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-red-800 via-red-700 to-red-600 px-4 pb-5 pt-4 text-white">
          <div className="mb-3 flex justify-center">
            <img
              src="https://i.imgur.com/qrAwh32.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
            ✅ GARANCIJA 3 GODINE
          </div>

          <h1 className="mt-4 text-center text-2xl font-black leading-tight">
            MILWAUKEE APARAT ZA ZAVARIVANJE INVERTER 500A
          </h1>

          <p className="mt-2 text-center text-sm font-semibold text-red-50">
            Profesionalna snaga – sada po nevjerovatnoj cijeni
          </p>

          <div className="mt-4 rounded-3xl bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/ckMdLH1.png"
              alt="Milwaukee aparat za zavarivanje"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-900 p-3 text-center shadow-lg">
              <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-300">
                Redovna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">250,00 KM</div>
            </div>

            <div className="rounded-2xl bg-yellow-400 p-3 text-center text-black shadow-lg ring-2 ring-white/40">
              <div className="text-[11px] font-bold uppercase tracking-wide">Akcija</div>
              <div className="mt-1 text-2xl font-black">69,90 KM</div>
            </div>
          </div>

          <a
            href="#narudzba"
            className="mt-4 block rounded-2xl bg-yellow-400 px-5 py-4 text-center text-base font-black uppercase tracking-wide text-black shadow-xl"
          >
            Naruči odmah
          </a>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-4">
            <h2 className="text-base font-black text-red-700">
              ❌ Ne propustite priliku da uzmete alat koji štedi vrijeme i novac
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Milwaukee inverter aparat 500A pruža ozbiljnu snagu, stabilan luk i pouzdan rad
              za kućne radionice, hobi majstore i profesionalce.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <div className="mb-3 rounded-2xl bg-yellow-100 px-4 py-3 text-center text-sm font-black text-black ring-1 ring-yellow-300">
              🛡️ 3 GODINE GARANCIJE
            </div>

            <h2 className="text-xl font-black">🔧 Glavne prednosti</h2>
            <div className="mt-4 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-5">
            <h2 className="text-xl font-black">📦 Šta dolazi u paketu?</h2>
            <div className="mt-4 space-y-2">
              {packageItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-neutral-800 shadow-sm"
                >
                  ✔ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <img
              src="https://i.imgur.com/2e06EhW.jpeg"
              alt="Varioc"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm leading-6 text-neutral-700">
                "Radim kao varioc preko 15 godina i koristio sam razne aparate. Milwaukee 500A me
                iskreno iznenadio – stabilan luk, čisto zavarivanje i dovoljno snage za ozbiljne
                poslove. Lagan je za nošenje i radi bez problema cijeli dan."
              </p>
              <p className="mt-2 text-sm font-black text-red-700">
                — Zoran V., profesionalni varioc
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-black">💬 Iskustva korisnika</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <p className="text-sm leading-6 text-neutral-700">“{item}”</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-black">🎯 Za koga je ovaj aparat?</h2>
            <div className="mt-4 space-y-3">
              {audience.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              🛡️ 3 GODINE GARANCIJE • 🛒 Količine su ograničene
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Sigurna kupovina i brza dostava na kućnu adresu.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Često postavljena pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-red-100 bg-red-50 p-4">
                  <h3 className="text-sm font-black text-red-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="narudzba"
            className="mt-5 rounded-3xl bg-gradient-to-b from-red-700 to-red-600 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
              ✅ GARANCIJA 3 GODINE
            </div>

            <h2 className="text-center text-2xl font-black">🛒 Naručite odmah</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />

              <label className="flex gap-3 rounded-2xl border border-yellow-300 bg-yellow-100 p-3 text-black">
                <input
                  type="checkbox"
                  checked={giftPack}
                  onChange={(e) => setGiftPack(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-bold">Želim poklon paket</div>
                  <div className="text-xs">+5,00 KM (vrijednost do 50,00 KM)</div>
                </div>
              </label>

              <div className="rounded-2xl border-2 border-red-500 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Milwaukee aparat</span>
                  <span>69,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-red-700">
                    <span>Poklon paket</span>
                    <span>5,00 KM</span>
                  </div>
                )}
                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between text-lg font-black">
                    <span>Ukupno</span>
                    <span>{total.toFixed(2)} KM</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-yellow-400 p-4 text-lg font-black uppercase tracking-wide text-black shadow-lg disabled:opacity-70"
              >
                {loading ? "Šalje se..." : "Naruči odmah"}
              </button>
            </form>
          </section>
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 p-4 text-center text-lg font-black text-black shadow-[0_-8px_25px_rgba(0,0,0,0.15)]">
        NARUČI ODMAH - {total.toFixed(2)} KM
      </div>
    </div>
  );
}