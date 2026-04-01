"use client";

import { useMemo, useState } from "react";

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);

  const baseTotal = 69.8;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const features = [
    "Brzo presijecanje grana",
    "Precizan i čist rez",
    "Rad jednom rukom",
    "Minimalan napor",
    "Štedi vrijeme i snagu",
  ];

  const packageItems = [
    "Aku makaze",
    "2 punjive baterije",
    "Punjač",
    "Čvrsti transportni kofer",
    "Uputstvo za korištenje",
    "3 godine garancije",
  ];

  const testimonials = [
    "Razlika je ogromna. Ruka se ne umara i posao ide duplo brže.",
    "Dva akumulatora su spas – nema pauze.",
    "Vrijede svake marke.",
  ];

  const audience = [
    "Vlasnike kuća i vikendica",
    "Voćare i vinogradare",
    "Starije osobe kojima su ručne makaze teške",
    "Sve koji žele profesionalan rezultat bez komplikacija",
  ];

  const faqs = [
    {
      q: "Koliko traje baterija?",
      a: "Jedna baterija traje dovoljno za duži rad, a druga je odmah spremna za zamjenu.",
    },
    {
      q: "Da li može rezati deblje grane?",
      a: "Da, bez problema reže većinu grana u dvorištu, voćnjaku i vinogradu.",
    },
    {
      q: "Da li sve dolazi u paketu?",
      a: "Da. Dobijate komplet: makaze, 2 baterije, punjač, kofer i uputstvo.",
    },
    {
      q: "Da li je teško za korištenje?",
      a: "Ne. Makaze su jednostavne za rukovanje i rade se jednom rukom, bez velikog napora.",
    },
    {
      q: "Da li dobijam garanciju?",
      a: "Da, uz proizvod dobijate garanciju u trajanju od 3 godine.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 pb-24">
      <div className="mx-auto max-w-md bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-green-800 via-green-700 to-green-600 px-4 pb-5 pt-4 text-white">
          <div className="mb-3 flex justify-center">
            <img
              src="https://i.imgur.com/zBco9y4.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-green-50">
            Ograničena količina
          </div>

          <h1 className="mt-4 text-center text-2xl font-black leading-tight">
            ⚡ PROFESIONALNE MAKITA AKU MAKAZE
          </h1>

          <p className="mt-2 text-center text-sm font-semibold text-green-50">
            2 baterije + kofer + 3 godine garancije
          </p>

          <div className="mt-3 rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
            ✅ GARANCIJA 3 GODINE
          </div>

          <div className="mt-4 rounded-3xl bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/EDwEKHT.png"
              alt="Makita aku makaze"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <p className="mt-4 text-center text-sm leading-6 text-green-50">
            Ne propustite priliku da nabavite alat koji štedi vrijeme, novac i ruke.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-600 p-3 text-center shadow-lg">
              <div className="text-[11px] font-bold uppercase tracking-wide text-red-100">
                Redovna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">119,00 KM</div>
            </div>

            <div className="rounded-2xl bg-yellow-400 p-3 text-center text-black shadow-lg ring-2 ring-white/40">
              <div className="text-[11px] font-bold uppercase tracking-wide">Danas</div>
              <div className="mt-1 text-2xl font-black">59,90 KM</div>
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
              ❌ Prestanite se mučiti sa ručnim makazama
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Ako imate voćke, vinovu lozu ili živu ogradu — znate koliko rezanje zna biti
              naporno. Bol u ruci, spora obrada i neravni rezovi. Vrijeme je da to riješite.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">✅ Jedan stisak – savršen rez</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Ove aku makaze imaju snažan motor koji omogućava brz i čist rez uz minimalan
              napor. Posao koji traje sat vremena, sada završavate za 15–20 minuta.
            </p>

            <div className="mt-4 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">🔋 2 baterije = rad bez prekida</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Dok jednu koristite, druga je spremna. Nema čekanja, nema zastoja, nema gubljenja
              vremena. Idealno za veće dvorište i ozbiljan rad.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-green-50 p-3">
                <div className="text-lg font-black text-green-700">⚡</div>
                <div className="mt-1 text-xs font-bold uppercase text-neutral-700">
                  Dugotrajna baterija
                </div>
              </div>
              <div className="rounded-2xl bg-green-50 p-3">
                <div className="text-lg font-black text-green-700">🔄</div>
                <div className="mt-1 text-xs font-bold uppercase text-neutral-700">
                  Brza zamjena
                </div>
              </div>
              <div className="rounded-2xl bg-green-50 p-3">
                <div className="text-lg font-black text-green-700">⏱</div>
                <div className="mt-1 text-xs font-bold uppercase text-neutral-700">
                  Nema čekanja
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
            <h2 className="text-xl font-black">📦 Dobijate komplet spreman za rad</h2>
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
            <p className="mt-4 text-sm font-semibold text-neutral-700">
              Bez dodatnih troškova. Bez skrivenih iznenađenja.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">👨‍🌾 Šta kažu korisnici?</h2>
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

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-green-100">
            <img
              src="https://i.imgur.com/Lxmh7Dh.png"
              alt="Zadovoljan korisnik makaza"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">🎯 Za koga su ove makaze?</h2>
            <div className="mt-4 space-y-3">
              {audience.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-green-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">⚠ Zalihe su ograničene</div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Zbog velike potražnje količine su ograničene. Ne čekajte da ostanete bez svog
              primjerka.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-green-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <h3 className="text-sm font-black text-green-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="narudzba"
            className="mt-5 rounded-3xl bg-gradient-to-b from-green-700 to-green-600 p-5 text-white shadow-2xl"
          >
            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>
            <p className="mt-2 text-center text-sm text-green-100">
              Brza dostava na kućnu adresu • 3 godine garancije
            </p>

            <form className="mt-4 space-y-3">
              <input
                name="ime"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500 focus:border-green-500"
              />
              <input
                name="telefon"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500 focus:border-green-500"
              />
              <input
                name="adresa"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500 focus:border-green-500"
              />
              <input
                name="postanski"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500 focus:border-green-500"
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

              <div className="rounded-2xl border-2 border-green-500 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Makita aku makaze</span>
                  <span>59,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>9,90 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-green-700">
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
                className="w-full rounded-2xl bg-yellow-400 p-4 text-lg font-black uppercase tracking-wide text-black shadow-lg"
              >
                Naruči odmah
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
