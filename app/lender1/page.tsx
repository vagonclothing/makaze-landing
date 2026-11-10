"use client";

import { Suspense, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const STA_REKLAMIRA = [
  "Imam proizvod, tek krećem",
  "Već vrtim oglase",
  "Prodajem preko Instagrama",
  "Dropshipping",
  "Usluge, ne proizvod",
  "Još ne znam tačno",
];

function PageContent() {
  const searchParams = useSearchParams();
  const utmSource   = searchParams.get("utm_source") || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const utmContent  = searchParams.get("utm_content") || null;
  const adId        = searchParams.get("ad_id") || null;

  const [odabrano, setOdabrano] = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const formRef = useRef<HTMLElement | null>(null);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  function toggle(v: string) {
    setOdabrano((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  const anatomija = [
    { br: "01", n: "Udarni naslov", t: "Prvih par riječi odlučuje hoće li ostati ili izaći. Piše se oko problema koji tvoj proizvod rješava, ne oko naziva artikla." },
    { br: "02", n: "Slika i cijena odmah", t: "Kupac mora vidjeti šta kupuje i koliko košta bez skrolanja. Skrivena cijena je najbrži način da izgubiš posjetioca." },
    { br: "03", n: "Zašto baš taj proizvod", t: "Konkretne prednosti napisane jezikom kupca — ne lista tehničkih podataka koju niko ne čita." },
    { br: "04", n: "Povjerenje", t: "Plaćanje pouzećem, rok dostave, mogućnost povrata. Sve ono što skida strah da je prevara." },
    { br: "05", n: "Razlog da naruči sad", t: "Ograničena zaliha, akcijska cijena, gratis dostava. Bez toga kupac kaže „razmislit ću“ i nikad se ne vrati." },
    { br: "06", n: "Kratka forma", t: "Ime, telefon, adresa — ništa više. Svako dodatno polje obara broj narudžbi." },
    { br: "07", n: "Pixel koji radi", t: "Postavljen kako treba, da Facebook zna ko je naručio i kome dalje da gura tvoj oglas." },
  ];

  const ukljuceno = [
    "Jedna stranica za jedan proizvod",
    "Pisanje teksta koji prodaje",
    "Forma za narudžbu",
    "Facebook pixel postavljen",
    "Prilagođeno za telefon",
    "Tvoje boje i stil",
    "Puštanje na tvoju domenu",
    "Izmjene dok ne budeš zadovoljan",
  ];

  const zaKoga = [
    { ic: "📦", n: "Dropshipping", o: "Jedan proizvod, jedan lender, jedan oglas" },
    { ic: "📱", n: "Instagram prodaja", o: "Prestani slati ljude u DM" },
    { ic: "🏪", n: "Male prodavnice", o: "Testiraj artikal prije nego uložiš u shop" },
    { ic: "🛠️", n: "Usluge i zanati", o: "Lender koji skuplja pozive" },
  ];

  const koraci = [
    { br: "1", n: "Pošalješ proizvod", t: "Slike, cijenu i par rečenica o proizvodu. Ostalo je moj posao." },
    { br: "2", n: "Pravim stranicu", t: "Pišem tekst, slažem dizajn i postavljam formu i pixel." },
    { br: "3", n: "Pregledaš", t: "Dobiješ link, pogledaš i kažeš šta mijenjamo. Mijenja se dok ne bude kako treba." },
    { br: "4", n: "Puštamo uživo", t: "Stranica ide na domenu i spremna je da primi saobraćaj s oglasa." },
  ];

  const faqs = [
    { q: "Zašto 49,90 KM — gdje je kvaka?", a: "Nema kvake. Jedna stranica za jedan proizvod je posao koji se da napraviti brzo jer imam gotov sistem i rutinu. Cijena raste samo ako trebaš više proizvoda, posebne animacije ili dodatne verzije za testiranje." },
    { q: "Koliko traje izrada?", a: "Obično u roku od par dana od trenutka kad pošalješ slike i podatke o proizvodu. Ako ti treba hitno, javi — vidim šta mogu." },
    { q: "Mogu li sam mijenjati tekst poslije?", a: "Manje izmjene radim ja i to je uključeno. Ako želiš potpunu kontrolu i sam mijenjati sadržaj, to se pravi drugačije i pričamo o tome na razgovoru." },
    { q: "Gdje stranica živi?", a: "Na tvojoj domeni ako je imaš. Ako nemaš, mogu ti je srediti ili stranicu pustiti na besplatnom poddomenu dok ne odlučiš." },
    { q: "Gdje stižu narudžbe?", a: "U bazu kojoj ti pristupaš, a mogu postaviti i da ti svaka narudžba stigne kao poruka na telefon čim neko naruči." },
    { q: "Šta ako proizvod ne proda?", a: "To ovisi o proizvodu, cijeni i oglasu — stranica je samo jedan dio. Ono što garantujem je da stranica neće biti razlog zašto nije prodalo: brza je, jasna, radi na telefonu i ima ispravno postavljen pixel." },
    { q: "Radite li i oglase?", a: "Pravim stranicu i postavljam pixel. Za same oglase se dogovaramo posebno — reci na razgovoru šta ti treba." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const lead = {
      full_name:    String(fd.get("ime") || ""),
      phone:        String(fd.get("telefon") || ""),
      email:        String(fd.get("email") || ""),
      firma:        String(fd.get("proizvod") || ""),
      djelatnost:   odabrano.join(", "),
      usluge:       "Izrada landing stranice",
      poruka:       String(fd.get("poruka") || ""),
      status:       "novo",
      source:       "landing-stranice",
      utm_source:   utmSource,
      utm_campaign: utmCampaign,
      utm_content:  utmContent,
      ad_id:        adId,
    };

    if (!lead.full_name || !lead.phone) {
      alert("Molimo upišite ime i broj telefona.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("leads").insert(lead);
    if (error) { alert("Greška pri slanju. Pokušajte ponovo."); setLoading(false); return; }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: `LANDING UPIT: ${lead.djelatnost || "nije precizirano"}`,
        full_name: lead.full_name,
        phone: lead.phone,
        address_place: lead.firma || "—",
        total: 0,
      }),
    }).catch(() => {});

    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: "Landing stranica upit", currency: "BAM" });
    }

    form.reset();
    setOdabrano([]);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #120a1e; }

        .page {
          font-family: 'Nunito', sans-serif;
          background: #120a1e; color: #f3eefa;
          min-height: 100vh; max-width: 520px; margin: 0 auto;
          padding-bottom: 86px; overflow-x: hidden;
        }
        .disp { font-family: 'Outfit', sans-serif; letter-spacing: -.028em; }

        /* HEADER */
        .hdr {
          position: sticky; top: 0; z-index: 80;
          background: rgba(18,10,30,0.92); backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 9px; }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #ec4899, #f59e0b);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: #120a1e;
        }
        .logo-txt { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: .05em; }
        .logo-txt span { color: #ec4899; }
        .hdr-price {
          background: rgba(236,72,153,0.14); border: 1px solid rgba(236,72,153,0.35);
          color: #f9a8d4; font-size: 12px; font-weight: 800;
          padding: 8px 13px; border-radius: 8px; white-space: nowrap;
        }

        /* HERO */
        .hero { padding: 34px 18px 32px; position: relative; }
        .hero::before {
          content: ''; position: absolute; top: -60px; left: 50%;
          transform: translateX(-50%); width: 360px; height: 280px;
          background: radial-gradient(circle, rgba(236,72,153,0.18), transparent 70%);
          pointer-events: none;
        }
        .hero-in { position: relative; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3);
          color: #fcd34d; font-size: 11.5px; font-weight: 800;
          padding: 6px 13px; border-radius: 50px; margin-bottom: 18px;
        }
        .hero h1 {
          font-size: 36px; font-weight: 800; line-height: 1.08;
          color: #fff; margin-bottom: 14px;
        }
        .hero h1 em {
          font-style: normal;
          background: linear-gradient(100deg, #ec4899, #f59e0b);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub { font-size: 15.5px; color: #a898c4; line-height: 1.66; margin-bottom: 20px; }

        .price-hook {
          display: flex; align-items: baseline; gap: 9px;
          margin-bottom: 22px; flex-wrap: wrap;
        }
        .ph-od { font-size: 14px; font-weight: 800; color: #a898c4; }
        .ph-cijena { font-size: 42px; font-weight: 900; color: #fbbf24; line-height: 1; }
        .ph-note {
          background: rgba(236,72,153,0.14); border: 1px solid rgba(236,72,153,0.3);
          color: #f9a8d4; font-size: 11.5px; font-weight: 800;
          padding: 5px 11px; border-radius: 50px;
        }

        .cta-btn {
          width: 100%; padding: 18px; color: #fff;
          background: linear-gradient(100deg, #ec4899, #db2777);
          font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 900;
          border: none; border-radius: 13px; cursor: pointer;
          transition: filter .15s, transform .15s;
          box-shadow: 0 10px 30px rgba(236,72,153,0.32);
        }
        .cta-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .cta-note { text-align: center; font-size: 12.5px; font-weight: 700; color: #7a6a95; margin-top: 11px; }

        /* ── TELEFON S PRIMJEROM ── */
        .demo-wrap { margin-bottom: 24px; display: flex; justify-content: center; }
        .phone {
          width: 232px; background: #2a1840; border-radius: 30px; padding: 8px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(236,72,153,0.2);
        }
        .notch {
          width: 72px; height: 5px; background: #120a1e;
          border-radius: 50px; margin: 2px auto 7px;
        }
        .scr { background: #fff; border-radius: 23px; overflow: hidden; }

        .d-top {
          background: #15803d; color: #fff; text-align: center;
          padding: 5px; font-size: 6.5px; font-weight: 800;
        }
        .d-pad { padding: 9px; }
        .d-badge {
          display: inline-block; background: #fef2f2; color: #dc2626;
          font-size: 5.5px; font-weight: 800; padding: 2.5px 6px;
          border-radius: 3px; border: 1px solid #fecaca;
        }
        .d-h1 { font-size: 13px; font-weight: 900; color: #111; line-height: 1.12; margin-top: 5px; letter-spacing: -.02em; }
        .d-sub { font-size: 6px; color: #666; line-height: 1.45; margin-top: 4px; }
        .d-img {
          margin-top: 7px; border-radius: 7px; height: 76px;
          background: linear-gradient(140deg, #e0f2fe, #dbeafe);
          border: 1.5px solid #16a34a; position: relative;
          display: flex; align-items: center; justify-content: center; font-size: 34px;
        }
        .d-img-b {
          position: absolute; top: 5px; left: 5px; background: #dc2626; color: #fff;
          font-size: 5px; font-weight: 900; padding: 2px 5px; border-radius: 3px;
        }
        .d-img-p {
          position: absolute; top: 5px; right: 5px; background: #16a34a; color: #fff;
          font-size: 6px; font-weight: 900; padding: 2px 5px; border-radius: 3px;
        }
        .d-prices { display: flex; align-items: baseline; gap: 5px; margin-top: 7px; }
        .d-new { font-size: 16px; font-weight: 900; color: #16a34a; line-height: 1; }
        .d-old { font-size: 8px; font-weight: 700; color: #bbb; text-decoration: line-through; }
        .d-save {
          background: #fef2f2; color: #dc2626; font-size: 5px; font-weight: 800;
          padding: 2px 5px; border-radius: 3px;
        }
        .d-cta {
          margin-top: 7px; background: #dc2626; color: #fff; text-align: center;
          padding: 7px; border-radius: 6px; font-size: 7.5px; font-weight: 900;
        }
        .d-trust { display: flex; justify-content: center; gap: 7px; margin-top: 5px; }
        .d-trust span { font-size: 4.5px; font-weight: 700; color: #666; }
        .d-sep { height: 5px; background: #f3f4f6; margin: 8px -9px; }
        .d-sect { font-size: 7.5px; font-weight: 900; color: #111; }
        .d-ben {
          display: flex; gap: 4px; align-items: center; margin-top: 4px;
          background: #f9fafb; border: 1px solid #eee; border-radius: 4px; padding: 4px 5px;
        }
        .d-ben span { font-size: 5.2px; font-weight: 700; color: #333; }
        .d-rev {
          background: #f9fafb; border-left: 2px solid #16a34a;
          border-radius: 4px; padding: 5px; margin-top: 4px;
        }
        .d-stars { font-size: 5px; color: #f59e0b; }
        .d-rev-t { font-size: 5px; color: #444; line-height: 1.4; margin-top: 2px; }
        .d-inp {
          background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px;
          padding: 5px 6px; font-size: 5.5px; color: #aaa; margin-top: 4px; font-weight: 600;
        }

        /* FLOW */
        .flow { display: flex; flex-direction: column; gap: 0; margin-top: 22px; }
        .fl-step {
          background: #1c1030; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; padding: 16px; display: flex; gap: 13px; align-items: flex-start;
        }
        .fl-ic {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 21px;
          background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.25);
        }
        .fl-n { font-size: 15px; font-weight: 800; color: #fff; }
        .fl-t { font-size: 13px; color: #a898c4; line-height: 1.58; margin-top: 4px; }
        .fl-arrow { text-align: center; font-size: 18px; color: #ec4899; padding: 7px 0; }

        /* SECTIONS */
        .section { padding: 36px 18px; }
        .section.alt { background: #1a0f2b; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .s-label {
          font-size: 11px; font-weight: 800; color: #ec4899;
          text-transform: uppercase; letter-spacing: .14em; margin-bottom: 11px;
        }
        .s-title { font-size: 27px; font-weight: 800; color: #fff; line-height: 1.17; margin-bottom: 13px; }
        .s-text { font-size: 15px; color: #a898c4; line-height: 1.68; }

        /* ANATOMIJA */
        .an-list { margin-top: 22px; }
        .an {
          display: flex; gap: 14px; padding-bottom: 18px; position: relative;
        }
        .an:last-child { padding-bottom: 0; }
        .an::before {
          content: ''; position: absolute; left: 20px; top: 40px; bottom: 0;
          width: 1px; background: rgba(236,72,153,0.22);
        }
        .an:last-child::before { display: none; }
        .an-br {
          width: 41px; height: 41px; border-radius: 11px; flex-shrink: 0; z-index: 1;
          background: #1c1030; border: 1px solid rgba(236,72,153,0.35); color: #f9a8d4;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; font-family: 'Outfit', sans-serif;
        }
        .an-n { font-size: 15px; font-weight: 800; color: #fff; padding-top: 9px; }
        .an-t { font-size: 13px; color: #a898c4; line-height: 1.6; margin-top: 4px; }

        /* CIJENA KARTICA */
        .pcard {
          background: linear-gradient(165deg, #241438, #1a0f2b);
          border: 1.5px solid rgba(251,191,36,0.4); border-radius: 20px;
          padding: 26px 20px; margin-top: 22px; text-align: center;
          box-shadow: 0 16px 50px rgba(0,0,0,0.4);
        }
        .pc-tag {
          display: inline-block; background: rgba(251,191,36,0.15);
          border: 1px solid rgba(251,191,36,0.35); color: #fcd34d;
          font-size: 11px; font-weight: 800; padding: 5px 13px;
          border-radius: 50px; margin-bottom: 15px; letter-spacing: .04em;
        }
        .pc-row { display: flex; align-items: baseline; justify-content: center; gap: 8px; }
        .pc-od { font-size: 15px; font-weight: 800; color: #a898c4; }
        .pc-v { font-size: 52px; font-weight: 900; color: #fbbf24; line-height: 1; }
        .pc-km { font-size: 20px; font-weight: 800; color: #fbbf24; }
        .pc-note { font-size: 12.5px; font-weight: 700; color: #7a6a95; margin-top: 8px; }
        .pc-list { text-align: left; margin-top: 20px; display: flex; flex-direction: column; gap: 9px; }
        .pc-li { display: flex; gap: 9px; align-items: flex-start; font-size: 13.5px; font-weight: 700; color: #e4dcf0; line-height: 1.4; }
        .pc-ch { color: #4ade80; flex-shrink: 0; font-size: 13px; }
        .pc-foot {
          margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.09);
          font-size: 12.5px; color: #7a6a95; line-height: 1.58;
        }

        /* ZA KOGA */
        .zk-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .zk {
          background: #1c1030; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 13px; padding: 15px; display: flex; gap: 13px; align-items: center;
        }
        .zk-ic { font-size: 24px; flex-shrink: 0; }
        .zk-n { font-size: 14.5px; font-weight: 800; color: #fff; }
        .zk-o { font-size: 12.5px; color: #a898c4; margin-top: 2px; }

        /* KORACI */
        .kor { display: flex; gap: 15px; padding-bottom: 20px; position: relative; }
        .kor:last-child { padding-bottom: 0; }
        .kor::before {
          content: ''; position: absolute; left: 17px; top: 38px; bottom: 0;
          width: 1px; background: rgba(236,72,153,0.25);
        }
        .kor:last-child::before { display: none; }
        .kor-br {
          width: 35px; height: 35px; border-radius: 50%; flex-shrink: 0; z-index: 1;
          background: #1c1030; border: 1.5px solid #ec4899; color: #f9a8d4;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800;
        }
        .kor-n { font-size: 15px; font-weight: 800; color: #fff; padding-top: 7px; }
        .kor-t { font-size: 13px; color: #a898c4; line-height: 1.6; margin-top: 4px; }

        /* FAQ */
        .faq-item {
          border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
          overflow: hidden; margin-bottom: 8px; background: #1c1030;
        }
        .faq-q { display: flex; justify-content: space-between; align-items: center; padding: 15px 16px; cursor: pointer; user-select: none; gap: 11px; }
        .faq-q-t { font-size: 14px; font-weight: 800; color: #f3eefa; line-height: 1.35; }
        .faq-ic {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #f9a8d4; transition: transform .2s;
        }
        .faq-item.open .faq-ic { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #a898c4; line-height: 1.72;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 320px; padding: 0 16px 15px; }

        /* FORMA */
        .form-wrap {
          padding: 36px 18px 40px;
          background: linear-gradient(180deg, #1a0f2b, #120a1e);
          border-top: 2px solid rgba(236,72,153,0.4);
        }
        .form-head { text-align: center; margin-bottom: 24px; }
        .form-badge {
          display: inline-block; background: rgba(251,191,36,0.13);
          border: 1px solid rgba(251,191,36,0.32); color: #fcd34d;
          font-size: 11.5px; font-weight: 800; padding: 6px 14px;
          border-radius: 50px; margin-bottom: 13px;
        }
        .form-t { font-size: 27px; font-weight: 800; color: #fff; margin-bottom: 9px; line-height: 1.2; }
        .form-s { font-size: 14px; color: #a898c4; line-height: 1.6; }

        .fl-lbl { font-size: 12px; font-weight: 800; color: #7a6a95; margin-bottom: 7px; display: block; }
        .inp {
          width: 100%; background: #1c1030; border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 14px 15px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          color: #fff; transition: border-color .2s, background .2s; outline: none;
        }
        .inp::placeholder { color: #5e5179; font-weight: 600; }
        .inp:focus { border-color: #ec4899; background: #241438; }
        textarea.inp { resize: vertical; min-height: 88px; line-height: 1.55; }

        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          background: #1c1030; border: 1.5px solid rgba(255,255,255,0.12); color: #a898c4;
          font-family: 'Nunito', sans-serif; font-size: 12.5px; font-weight: 700;
          padding: 9px 13px; border-radius: 50px; cursor: pointer; transition: all .15s;
        }
        .chip.on { background: rgba(236,72,153,0.16); border-color: #ec4899; color: #f9a8d4; }

        .submit {
          width: 100%; padding: 18px; color: #fff;
          background: linear-gradient(100deg, #ec4899, #db2777);
          font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900;
          border: none; border-radius: 13px; cursor: pointer;
          transition: filter .15s, transform .15s;
          box-shadow: 0 10px 30px rgba(236,72,153,0.3);
        }
        .submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .submit:disabled { opacity: .6; cursor: not-allowed; }

        .trust { display: flex; justify-content: center; gap: 15px; margin-top: 15px; flex-wrap: wrap; }
        .trust span { font-size: 12px; font-weight: 700; color: #5e5179; }

        @keyframes pop { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .ok-wrap { text-align: center; padding: 46px 16px; animation: pop .4s ease both; }
        .ok-ic { font-size: 62px; margin-bottom: 16px; }
        .ok-t { font-size: 27px; font-weight: 800; color: #4ade80; margin-bottom: 10px; }
        .ok-s { font-size: 15px; font-weight: 600; color: #a898c4; line-height: 1.65; }

        /* STICKY */
        .sticky {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 520px; z-index: 90;
          background: rgba(18,10,30,0.96); backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.09);
          padding: 11px 16px calc(11px + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 12px;
        }
        .sticky-t { font-size: 17px; font-weight: 900; color: #fbbf24; line-height: 1; }
        .sticky-s { font-size: 10px; font-weight: 700; color: #7a6a95; margin-top: 3px; }
        .sticky-b {
          flex: 1; padding: 14px; color: #fff;
          background: linear-gradient(100deg, #ec4899, #db2777);
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 900;
          border: none; border-radius: 11px; cursor: pointer;
        }

        .footer { padding: 28px 18px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.07); }
        .f-logo { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 9px; letter-spacing: .08em; }
        .f-logo span { color: #ec4899; }
        .f-t { font-size: 12.5px; color: #5e5179; line-height: 1.7; }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <header className="hdr">
          <div className="logo">
            <div className="logo-mark disp">V</div>
            <div className="logo-txt disp">VEKTOR<span>.</span></div>
          </div>
          <div className="hdr-price">od 49,90 KM</div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-in">
            <div className="eyebrow">⚡ Gotova za par dana</div>

            <h1 className="disp">
              Oglas ti troši pare.<br /><em>Stranica ih vraća.</em>
            </h1>

            <p className="hero-sub">
              Landing stranica za jedan proizvod, napravljena da posjetilac s Facebooka naruči — a ne da pogleda i izađe. Tekst, dizajn, forma i pixel, sve spremno za oglas.
            </p>

            {/* TELEFON S PRIMJEROM */}
            <div className="demo-wrap">
              <div className="phone">
                <div className="notch" />
                <div className="scr">
                  <div className="d-top">🚚 DOSTAVA 2–4 DANA · PLAĆANJE POUZEĆEM</div>
                  <div className="d-pad">
                    <span className="d-badge">⏳ AKCIJA — UŠTEDI 40 KM</span>
                    <div className="d-h1">Aku bušilica set<br />sa 2 baterije</div>
                    <div className="d-sub">Buši beton, drvo i metal. Dvije baterije, brzi punjač i kofer — spremno za rad iz kutije.</div>

                    <div className="d-img">
                      <span className="d-img-b">−40%</span>
                      <span className="d-img-p">89,90 KM</span>
                      🔩
                    </div>

                    <div className="d-prices">
                      <span className="d-new">89,90 KM</span>
                      <span className="d-old">129,90</span>
                      <span className="d-save">UŠTEDA 40 KM</span>
                    </div>

                    <div className="d-cta">🛒 NARUČI ODMAH</div>
                    <div className="d-trust">
                      <span>✅ Pouzećem</span>
                      <span>🚚 2–4 dana</span>
                      <span>🛡️ Garancija</span>
                    </div>

                    <div className="d-sep" />

                    <div className="d-sect">✅ Zašto ovaj set</div>
                    <div className="d-ben"><span>🔋 2 baterije — nema stajanja</span></div>
                    <div className="d-ben"><span>💼 Kofer i nastavci uključeni</span></div>

                    <div className="d-sep" />

                    <div className="d-sect">💬 Šta kažu kupci</div>
                    <div className="d-rev">
                      <div className="d-stars">★★★★★</div>
                      <div className="d-rev-t">Bušio sam beton bez problema. Za ove pare odlično.</div>
                    </div>

                    <div className="d-sep" />

                    <div className="d-sect">🛒 Naruči odmah</div>
                    <div className="d-inp">Ime i prezime</div>
                    <div className="d-inp">Broj telefona</div>
                    <div className="d-inp">Adresa i mjesto</div>
                    <div className="d-cta">POŠALJI NARUDŽBU</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="price-hook">
              <span className="ph-od">već od</span>
              <span className="ph-cijena disp">49,90 KM</span>
              <span className="ph-note">jedan proizvod</span>
            </div>

            <button className="cta-btn" onClick={scrollToForm}>ZATRAŽI SVOJU STRANICU</button>
            <div className="cta-note">Bez obaveze · Odgovor isti dan</div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section alt">
          <div className="s-label">Gdje pucaju oglasi</div>
          <div className="s-title disp">Oglas može biti savršen — ako stranica ne valja, pare su bačene.</div>
          <p className="s-text">
            Klik je plaćen onog trenutka kad ga neko napravi. Šta se dalje dešava odlučuje stranica. Ako se sporo otvara, ako kupac ne vidi cijenu, ako ne zna kako da naruči ili ako forma traži pet polja — izlazi, a tvoj novac je već potrošen.
          </p>
        </section>

        {/* FLOW */}
        <section className="section">
          <div className="s-label">Kako to radi</div>
          <div className="s-title disp">Od oglasa do narudžbe na telefonu.</div>

          <div className="flow">
            <div className="fl-step">
              <div className="fl-ic">📣</div>
              <div>
                <div className="fl-n">1. Kupac vidi tvoj oglas</div>
                <div className="fl-t">Skrola Facebook ili Instagram, zastane na tvom proizvodu i klikne.</div>
              </div>
            </div>
            <div className="fl-arrow">↓</div>
            <div className="fl-step">
              <div className="fl-ic">📱</div>
              <div>
                <div className="fl-n">2. Otvara se tvoja stranica</div>
                <div className="fl-t">Vidi isti proizvod, istu cijenu i istu ponudu kao u oglasu. Bez traženja i bez zbunjivanja.</div>
              </div>
            </div>
            <div className="fl-arrow">↓</div>
            <div className="fl-step">
              <div className="fl-ic">🔔</div>
              <div>
                <div className="fl-n">3. Narudžba stiže tebi</div>
                <div className="fl-t">Popuni ime, telefon i adresu — a tebi stigne obavijest. Nazoveš i potvrdiš.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ANATOMIJA */}
        <section className="section alt">
          <div className="s-label">Šta stranica sadrži</div>
          <div className="s-title disp">Sedam dijelova koji pretvaraju klik u narudžbu.</div>
          <p className="s-text">Ništa od ovoga nije ukras — svaki dio ima zadatak da kupca odvede korak bliže narudžbi.</p>

          <div className="an-list">
            {anatomija.map((a) => (
              <div className="an" key={a.br}>
                <div className="an-br disp">{a.br}</div>
                <div>
                  <div className="an-n">{a.n}</div>
                  <div className="an-t">{a.t}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CIJENA */}
        <section className="section">
          <div className="s-label">Cijena</div>
          <div className="s-title disp">Jasno, bez skrivenih stavki.</div>

          <div className="pcard">
            <div className="pc-tag">JEDAN PROIZVOD · JEDNA STRANICA</div>
            <div className="pc-row">
              <span className="pc-od">već od</span>
              <span className="pc-v disp">49,90</span>
              <span className="pc-km disp">KM</span>
            </div>
            <div className="pc-note">Jednokratno — nema mjesečne pretplate</div>

            <div className="pc-list">
              {ukljuceno.map((u) => (
                <div className="pc-li" key={u}>
                  <span className="pc-ch">✓</span>
                  <span>{u}</span>
                </div>
              ))}
            </div>

            <div className="pc-foot">
              Više proizvoda, posebne animacije ili dodatne verzije za testiranje — dogovaramo se posebno i cijenu znaš prije nego krenemo.
            </div>
          </div>
        </section>

        {/* ZA KOGA */}
        <section className="section alt">
          <div className="s-label">Za koga</div>
          <div className="s-title disp">Ako plaćaš oglase, ovo ti treba.</div>

          <div className="zk-list">
            {zaKoga.map((z) => (
              <div className="zk" key={z.n}>
                <span className="zk-ic">{z.ic}</span>
                <div>
                  <div className="zk-n">{z.n}</div>
                  <div className="zk-o">{z.o}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KAKO IDE */}
        <section className="section">
          <div className="s-label">Kako ide</div>
          <div className="s-title disp">Četiri koraka i stranica je živa.</div>
          <div style={{ marginTop: "22px" }}>
            {koraci.map((k) => (
              <div className="kor" key={k.br}>
                <div className="kor-br">{k.br}</div>
                <div>
                  <div className="kor-n">{k.n}</div>
                  <div className="kor-t">{k.t}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section alt">
          <div className="s-label">Pitanja</div>
          <div className="s-title disp">Često postavljana pitanja</div>
          <div style={{ marginTop: "20px" }}>
            {faqs.map((item, i) => (
              <div
                className={`faq-item${openFaq === i ? " open" : ""}`}
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span className="faq-q-t">{item.q}</span>
                  <div className="faq-ic">+</div>
                </div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FORMA */}
        <section ref={formRef} className="form-wrap">
          {success ? (
            <div className="ok-wrap">
              <div className="ok-ic">✅</div>
              <div className="ok-t disp">Upit je stigao!</div>
              <p className="ok-s">
                Hvala na povjerenju. Javljam se na vaš broj u najkraćem roku<br />
                da prođemo proizvod i dogovorimo dalje.
              </p>
            </div>
          ) : (
            <>
              <div className="form-head">
                <div className="form-badge">💬 BESPLATAN DOGOVOR</div>
                <div className="form-t disp">Reci šta prodaješ</div>
                <p className="form-s">
                  Ostavi broj i javljam se da čujem o kojem je proizvodu riječ. Cijenu i rok znaš odmah na razgovoru.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
                <div>
                  <label className="fl-lbl">Ime i prezime *</label>
                  <input className="inp" name="ime" autoComplete="off" placeholder="Vaše ime" />
                </div>
                <div>
                  <label className="fl-lbl">Broj telefona *</label>
                  <input className="inp" name="telefon" autoComplete="off" placeholder="061 000 000" />
                </div>
                <div>
                  <label className="fl-lbl">Email (opcionalno)</label>
                  <input className="inp" name="email" autoComplete="off" placeholder="vas@email.com" />
                </div>
                <div>
                  <label className="fl-lbl">Koji proizvod reklamiraš?</label>
                  <input className="inp" name="proizvod" autoComplete="off" placeholder="npr. aku alat, kozmetika, dječija igračka..." />
                </div>

                <div>
                  <label className="fl-lbl">Gdje si trenutno? (možeš označiti više)</label>
                  <div className="chips">
                    {STA_REKLAMIRA.map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`chip${odabrano.includes(v) ? " on" : ""}`}
                        onClick={() => toggle(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="fl-lbl">Reci ukratko šta ti treba</label>
                  <textarea className="inp" name="poruka" placeholder="Npr. imam proizvod koji bih reklamirao na Facebooku, trebam stranicu gdje kupci ostavljaju narudžbu..." />
                </div>

                <button type="submit" disabled={loading} className="submit">
                  {loading ? "ŠALJE SE..." : "POŠALJI UPIT"}
                </button>

                <div className="trust">
                  <span>🔒 Podaci ostaju kod mene</span>
                  <span>💬 Bez obaveze</span>
                  <span>⚡ Odgovor isti dan</span>
                </div>
              </form>
            </>
          )}
        </section>

        <footer className="footer">
          <div className="f-logo disp">VEKTOR<span>.</span></div>
          <p className="f-t">
            Landing stranice za Facebook i Instagram oglase<br />
            Bosna i Hercegovina
          </p>
        </footer>

      </div>

      {!success && (
        <div className="sticky">
          <div>
            <div className="sticky-t disp">49,90 KM</div>
            <div className="sticky-s">već od · jednokratno</div>
          </div>
          <button className="sticky-b" onClick={scrollToForm}>ZATRAŽI</button>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}