"use client";

import { Suspense, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const USLUGE = [
  "Web stranica za firmu",
  "Webshop s admin panelom",
  "Praćenje poslovanja",
  "CRM — baza klijenata",
  "Zakazivanje termina",
  "Radni nalozi / servis",
  "Magacin i zalihe",
  "Fakture i ponude",
  "Evidencija radnika",
  "Nešto drugo",
];

function PageContent() {
  const searchParams = useSearchParams();
  const utmSource   = searchParams.get("utm_source") || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const utmContent  = searchParams.get("utm_content") || null;
  const adId        = searchParams.get("ad_id") || null;

  const [odabrane, setOdabrane] = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const formRef = useRef<HTMLElement | null>(null);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  function toggleUsluga(u: string) {
    setOdabrane((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]
    );
  }

  const servisi = [
    { icon: "🌐", naslov: "Web stranica za firmu", tekst: "Prezentacija firme koja izgleda ozbiljno — usluge, galerija, kontakt, Google mapa. Radi savršeno na telefonu." },
    { icon: "🛒", naslov: "Webshop s admin panelom", tekst: "Prodaja online sa svojim panelom: dodaješ artikle, mijenjaš cijene, vidiš narudžbe. Bez mjesečnih provizija." },
    { icon: "📊", naslov: "Praćenje poslovanja", tekst: "Gdje pare ulaze, gdje izlaze, šta ostaje. Promet, troškovi i zarada po danu, sedmici i mjesecu — na jednom ekranu." },
    { icon: "👥", naslov: "CRM — baza klijenata", tekst: "Svaki klijent, njegova historija, šta je kupio, kad je zadnji put bio i koliko je ostavio. Nema više bilježnice." },
    { icon: "📅", naslov: "Zakazivanje termina", tekst: "Klijent sam bira slobodan termin online. Ti dobiješ obavijest, on podsjetnik. Nema dvostrukih termina." },
    { icon: "🔧", naslov: "Radni nalozi", tekst: "Za servise i majstore — ko je donio, šta se radi, koji dijelovi, koliko sati, koliko košta. Sve na jednom mjestu." },
    { icon: "📦", naslov: "Magacin i zalihe", tekst: "Koliko čega imaš, šta je pri kraju, šta treba naručiti. Sistem te sam upozori prije nego ostaneš bez robe." },
    { icon: "🧾", naslov: "Fakture i ponude", tekst: "Napraviš ponudu za dvije minute, pošalješ PDF na mail. Pregled šta je plaćeno, a šta još čeka." },
    { icon: "⏱️", naslov: "Evidencija radnika", tekst: "Dolasci, odlasci, radni sati, godišnji. Na kraju mjeseca izvještaj spreman za obračun." },
    { icon: "📱", naslov: "Landing stranice", tekst: "Stranice za Facebook i Instagram oglase napravljene da konvertuju — forma, praćenje i izvještaj odakle dolaze upiti." },
  ];

  const branse = [
    { icon: "🚗", naziv: "Auto servisi", opis: "Radni nalozi, termini, historija vozila" },
    { icon: "🦷", naziv: "Zubarske ordinacije", opis: "Kartoni pacijenata i zakazivanje" },
    { icon: "💅", naziv: "Saloni za nokte", opis: "Termini, klijentice, cjenovnik" },
    { icon: "💇", naziv: "Frizerski saloni", opis: "Raspored po radnicima i smjenama" },
    { icon: "🏗️", naziv: "Građevina i zanati", opis: "Ponude, gradilišta, radnici" },
    { icon: "📦", naziv: "Veleprodaja", opis: "Magacin, kupci, narudžbe" },
    { icon: "☕", naziv: "Kafići i restorani", opis: "Rezervacije, utrošak, smjene" },
    { icon: "🛍️", naziv: "Online prodaja", opis: "Narudžbe, kuriri, zarada po artiklu" },
    { icon: "🏠", naziv: "Apartmani", opis: "Kalendar rezervacija i gosti" },
    { icon: "🏋️", naziv: "Teretane i studiji", opis: "Članarine, dolasci, podsjetnici" },
  ];

  const koraci = [
    { br: "1", naslov: "Razgovor", tekst: "Javiš se, ispričaš kako radiš i gdje gubiš vrijeme. Besplatno i bez obaveze." },
    { br: "2", naslov: "Prijedlog i rok", tekst: "Dobiješ konkretan prijedlog šta sistem radi, koliko traje i koliko košta. Bez skrivenih stavki." },
    { br: "3", naslov: "Izrada", tekst: "Pravim i javljam ti kako napreduje. Vidiš kako izgleda prije nego je gotovo i možeš tražiti izmjene." },
    { br: "4", naslov: "Predaja i obuka", tekst: "Puštamo u rad i prođem s tobom kroz sve. Ne ostavljam te da sam otkrivaš gdje je šta." },
    { br: "5", naslov: "Podrška", tekst: "Trebaš izmjenu ili nešto ne radi — javiš se i riješimo. Nisi sam poslije predaje." },
  ];

  const faqs = [
    { q: "Koliko košta izrada?", a: "Ovisi o tome koliko je sistem veliki — jednostavna web stranica i kompletan poslovni sistem nisu ista stavka. Zato ne stavljam cijenu unaprijed: javite se, opišete šta trebate i dobijete tačnu cijenu i rok, bez obaveze." },
    { q: "Koliko traje izrada?", a: "Jednostavnija web stranica obično za nekoliko dana. Veći sistemi s panelom i više funkcija traju duže — tačan rok dobijete uz ponudu, prije nego što bilo šta počnemo." },
    { q: "Mogu li sam mijenjati sadržaj poslije?", a: "Da. Svaki sistem dolazi s admin panelom gdje sami dodajete artikle, mijenjate cijene, tekstove i slike. Ne morate zvati nikoga za sitnice." },
    { q: "Da li radi na telefonu?", a: "Da, sve što pravim radi i na telefonu i na računaru. Većina vlasnika firmi u BiH posao prati s telefona, pa se tako i pravi." },
    { q: "Šta sa domenom i hostingom?", a: "Mogu to srediti umjesto vas — registracija domene, postavljanje i puštanje u rad. Ako već imate, radim na postojećem." },
    { q: "Šta ako mi kasnije zatreba nova funkcija?", a: "Sistem se nadograđuje. Javite se s onim što treba, dogovorimo izmjenu i to se doda. Ne pravi se sve ispočetka." },
    { q: "Radite li i izvan moga grada?", a: "Da. Dogovor i izrada idu online — telefon, poruke, video poziv. Lokacija nije prepreka." },
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
      firma:        String(fd.get("firma") || ""),
      djelatnost:   String(fd.get("djelatnost") || ""),
      usluge:       odabrane.join(", "),
      poruka:       String(fd.get("poruka") || ""),
      status:       "novo",
      source:       "vektor",
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
        product_name: `UPIT: ${lead.usluge || "nije precizirano"}`,
        full_name: lead.full_name,
        phone: lead.phone,
        address_place: `${lead.firma} ${lead.djelatnost}`.trim() || "—",
        total: 0,
      }),
    }).catch(() => {});

    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: "Vektor upit", currency: "BAM" });
    }

    form.reset();
    setOdabrane([]);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070b14; }

        .page {
          font-family: 'Nunito', sans-serif;
          background: #070b14; color: #e8edf7;
          min-height: 100vh; max-width: 520px; margin: 0 auto;
          padding-bottom: 86px; overflow-x: hidden;
        }

        .disp { font-family: 'Space Grotesk', sans-serif; letter-spacing: -.02em; }

        /* HEADER */
        .hdr {
          position: sticky; top: 0; z-index: 80;
          background: rgba(7,11,20,0.9); backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 9px; }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 9px;
          background: linear-gradient(135deg, #38bdf8, #6366f1);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: #070b14;
        }
        .logo-txt { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: .06em; }
        .logo-txt span { color: #38bdf8; }
        .hdr-btn {
          background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8; font-family: 'Nunito', sans-serif;
          font-size: 12.5px; font-weight: 800; padding: 8px 14px;
          border-radius: 8px; cursor: pointer;
        }

        /* HERO */
        .hero { padding: 34px 18px 30px; position: relative; }
        .hero::before {
          content: ''; position: absolute; top: -80px; left: 50%;
          transform: translateX(-50%); width: 340px; height: 300px;
          background: radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%);
          pointer-events: none;
        }
        .hero-inner { position: relative; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25);
          color: #7dd3fc; font-size: 11.5px; font-weight: 800;
          padding: 6px 13px; border-radius: 50px; margin-bottom: 18px;
          letter-spacing: .03em;
        }
        .hero h1 {
          font-size: 34px; font-weight: 700; line-height: 1.14;
          color: #fff; margin-bottom: 14px;
        }
        .hero h1 em {
          font-style: normal;
          background: linear-gradient(100deg, #38bdf8, #818cf8);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-sub { font-size: 15px; color: #94a3b8; line-height: 1.66; margin-bottom: 22px; }

        .cta-btn {
          width: 100%; padding: 17px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 8px 26px rgba(220,38,38,0.32);
        }
        .cta-btn:hover { background: #b91c1c; transform: translateY(-1px); }
        .cta-note { text-align: center; font-size: 12.5px; font-weight: 700; color: #64748b; margin-top: 11px; }

        /* ── MOCKUP OKVIR ── */
        .mock {
          background: #0e1525; border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 18px 50px rgba(0,0,0,0.55);
        }
        .mock-bar {
          background: #141d31; padding: 9px 12px;
          display: flex; align-items: center; gap: 6px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mock-dot { width: 9px; height: 9px; border-radius: 50%; }
        .mock-title {
          margin-left: 8px; font-size: 10.5px; font-weight: 700;
          color: #475569; letter-spacing: .04em;
        }
        .mock-body { padding: 14px; }

        /* KPI */
        .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 13px; }
        .kpi {
          background: #141d31; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px; padding: 10px 9px;
        }
        .kpi-l { font-size: 8.5px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: .07em; }
        .kpi-v { font-size: 17px; font-weight: 800; margin-top: 4px; line-height: 1; }
        .kpi-d { font-size: 8.5px; font-weight: 700; margin-top: 4px; }

        /* CHART */
        .chart {
          background: #141d31; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 9px; padding: 12px; margin-bottom: 11px;
        }
        .chart-h { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 11px; }
        .chart-t { font-size: 10.5px; font-weight: 800; color: #cbd5e1; }
        .chart-s { font-size: 9px; font-weight: 700; color: #475569; }
        .bars { display: flex; align-items: flex-end; gap: 5px; height: 62px; }
        .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .bar {
          width: 100%; border-radius: 3px 3px 0 0;
          background: linear-gradient(180deg, #38bdf8, #0ea5e9);
        }
        .bar.dim { background: linear-gradient(180deg, #1e3a52, #16293b); }
        .bar-l { font-size: 7.5px; font-weight: 700; color: #475569; }

        /* ROWS */
        .rows { display: flex; flex-direction: column; gap: 6px; }
        .row {
          background: #141d31; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 9px 11px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .row-l { min-width: 0; }
        .row-t { font-size: 11px; font-weight: 800; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row-s { font-size: 9px; font-weight: 600; color: #475569; margin-top: 2px; }
        .row-r { text-align: right; flex-shrink: 0; }
        .row-v { font-size: 11.5px; font-weight: 800; }
        .pill {
          font-size: 8.5px; font-weight: 800; padding: 3px 8px;
          border-radius: 50px; white-space: nowrap; display: inline-block;
        }
        .p-green { background: rgba(22,163,74,0.16); color: #4ade80; }
        .p-blue  { background: rgba(56,189,248,0.14); color: #38bdf8; }
        .p-amber { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .p-red   { background: rgba(220,38,38,0.16); color: #f87171; }
        .p-gray  { background: rgba(148,163,184,0.12); color: #94a3b8; }

        /* STOCK BAR */
        .stock-track { height: 5px; background: #1e293b; border-radius: 50px; margin-top: 6px; overflow: hidden; }
        .stock-fill { height: 5px; border-radius: 50px; }

        /* TERMIN */
        .slot {
          display: flex; align-items: center; gap: 9px;
          background: #141d31; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px; padding: 8px 10px;
        }
        .slot.free { border-style: dashed; border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.05); }
        .slot-time {
          font-size: 10px; font-weight: 800; color: #38bdf8;
          width: 38px; flex-shrink: 0;
        }
        .slot-name { font-size: 10.5px; font-weight: 700; color: #e2e8f0; }
        .slot-serv { font-size: 8.5px; font-weight: 600; color: #475569; margin-top: 1px; }
        .slot-free-t { font-size: 10px; font-weight: 800; color: #38bdf8; }

        /* SECTIONS */
        .section { padding: 34px 18px; }
        .section.alt { background: #0b1120; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .s-label {
          font-size: 11px; font-weight: 800; color: #38bdf8;
          text-transform: uppercase; letter-spacing: .13em; margin-bottom: 10px;
        }
        .s-title { font-size: 25px; font-weight: 700; color: #fff; line-height: 1.22; margin-bottom: 12px; }
        .s-text { font-size: 14.5px; color: #94a3b8; line-height: 1.68; }

        /* SERVISI */
        .srv-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .srv {
          background: #0e1525; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 16px;
          display: flex; gap: 13px; align-items: flex-start;
        }
        .srv-ic {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .srv-n { font-size: 15px; font-weight: 800; color: #fff; }
        .srv-t { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 5px; }

        /* FEATURE BLOK */
        .feat { margin-top: 24px; }
        .feat + .feat { margin-top: 34px; }
        .feat-n {
          font-size: 11px; font-weight: 800; color: #38bdf8;
          text-transform: uppercase; letter-spacing: .1em; margin-bottom: 8px;
        }
        .feat-h { font-size: 20px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 9px; }
        .feat-p { font-size: 14px; color: #94a3b8; line-height: 1.65; margin-bottom: 16px; }

        /* BRANSE */
        .br-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 20px; }
        .br-card {
          background: #0e1525; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px;
        }
        .br-ic { font-size: 23px; }
        .br-n { font-size: 13px; font-weight: 800; color: #fff; margin-top: 7px; }
        .br-o { font-size: 10.5px; font-weight: 600; color: #64748b; margin-top: 3px; line-height: 1.45; }
        .br-note {
          margin-top: 14px; text-align: center;
          font-size: 13px; font-weight: 700; color: #64748b;
        }

        /* KORACI */
        .kor-list { display: flex; flex-direction: column; gap: 0; margin-top: 20px; }
        .kor {
          display: flex; gap: 15px; padding-bottom: 20px; position: relative;
        }
        .kor:last-child { padding-bottom: 0; }
        .kor::before {
          content: ''; position: absolute; left: 17px; top: 38px; bottom: 0;
          width: 1px; background: rgba(56,189,248,0.2);
        }
        .kor:last-child::before { display: none; }
        .kor-br {
          width: 35px; height: 35px; border-radius: 50%; flex-shrink: 0; z-index: 1;
          background: #0e1525; border: 1.5px solid #38bdf8; color: #38bdf8;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800;
        }
        .kor-n { font-size: 15px; font-weight: 800; color: #fff; padding-top: 7px; }
        .kor-t { font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 4px; }

        /* FAQ */
        .faq-item {
          border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
          overflow: hidden; margin-bottom: 8px; background: #0e1525;
        }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 16px; cursor: pointer; user-select: none; gap: 11px;
        }
        .faq-q-t { font-size: 14px; font-weight: 800; color: #e8edf7; line-height: 1.35; }
        .faq-ic {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #38bdf8; transition: transform .2s;
        }
        .faq-item.open .faq-ic { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #94a3b8; line-height: 1.72;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 280px; padding: 0 16px 15px; }

        /* FORMA */
        .form-wrap {
          padding: 34px 18px 38px;
          background: linear-gradient(180deg, #0b1120, #070b14);
          border-top: 1px solid rgba(56,189,248,0.2);
        }
        .form-head { text-align: center; margin-bottom: 24px; }
        .form-badge {
          display: inline-block; background: rgba(56,189,248,0.12);
          border: 1px solid rgba(56,189,248,0.3); color: #38bdf8;
          font-size: 11.5px; font-weight: 800; padding: 6px 14px;
          border-radius: 50px; margin-bottom: 13px; letter-spacing: .03em;
        }
        .form-t { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 9px; line-height: 1.25; }
        .form-s { font-size: 14px; color: #94a3b8; line-height: 1.6; }

        .fl { font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 7px; display: block; letter-spacing: .02em; }
        .inp {
          width: 100%; background: #0e1525; border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 10px; padding: 14px 15px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          color: #fff; transition: border-color .2s, background .2s; outline: none;
        }
        .inp::placeholder { color: #475569; font-weight: 600; }
        .inp:focus { border-color: #38bdf8; background: #121b2e; }
        textarea.inp { resize: vertical; min-height: 88px; line-height: 1.55; }

        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          background: #0e1525; border: 1.5px solid rgba(255,255,255,0.1);
          color: #94a3b8; font-family: 'Nunito', sans-serif;
          font-size: 12.5px; font-weight: 700; padding: 9px 13px;
          border-radius: 50px; cursor: pointer; transition: all .15s;
        }
        .chip.on {
          background: rgba(56,189,248,0.14); border-color: #38bdf8; color: #7dd3fc;
        }

        .submit {
          width: 100%; padding: 18px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 8px 26px rgba(220,38,38,0.3);
        }
        .submit:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .submit:disabled { opacity: .6; cursor: not-allowed; }

        .trust { display: flex; justify-content: center; gap: 15px; margin-top: 15px; flex-wrap: wrap; }
        .trust span { font-size: 12px; font-weight: 700; color: #475569; }

        @keyframes pop { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .ok-wrap { text-align: center; padding: 46px 16px; animation: pop .4s ease both; }
        .ok-ic { font-size: 62px; margin-bottom: 16px; }
        .ok-t { font-size: 26px; font-weight: 700; color: #4ade80; margin-bottom: 10px; }
        .ok-s { font-size: 15px; font-weight: 600; color: #94a3b8; line-height: 1.65; }

        /* STICKY */
        .sticky {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 520px; z-index: 90;
          background: rgba(7,11,20,0.95); backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.09);
          padding: 11px 16px calc(11px + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 12px;
        }
        .sticky-l { flex-shrink: 0; }
        .sticky-t { font-size: 13px; font-weight: 900; color: #fff; line-height: 1.15; }
        .sticky-s { font-size: 10px; font-weight: 700; color: #475569; margin-top: 2px; }
        .sticky-b {
          flex: 1; padding: 14px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 900;
          border: none; border-radius: 11px; cursor: pointer;
        }

        .footer {
          padding: 26px 18px 30px; text-align: center;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .f-logo { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 9px; letter-spacing: .08em; }
        .f-logo span { color: #38bdf8; }
        .f-t { font-size: 12.5px; color: #475569; line-height: 1.7; }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <header className="hdr">
          <div className="logo">
            <div className="logo-mark disp">V</div>
            <div className="logo-txt disp">VEKTOR<span>.</span></div>
          </div>
          <button className="hdr-btn" onClick={scrollToForm}>Zatraži ponudu</button>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow">⚡ Web stranice · Shopovi · Poslovni sistemi</div>

            <h1 className="disp">
              Tvoj posao zaslužuje <em>sistem</em>, a ne bilježnicu i Excel.
            </h1>

            <p className="hero-sub">
              Pravim web stranice, webshopove i sisteme po mjeri za firme u BiH — da znaš gdje ti pare ulaze, gdje izlaze i šta ti je zakazano, bez traženja po papirima.
            </p>

            {/* HERO MOCKUP */}
            <div className="mock" style={{ marginBottom: "22px" }}>
              <div className="mock-bar">
                <span className="mock-dot" style={{ background: "#ef4444" }} />
                <span className="mock-dot" style={{ background: "#eab308" }} />
                <span className="mock-dot" style={{ background: "#22c55e" }} />
                <span className="mock-title">Pregled poslovanja</span>
              </div>
              <div className="mock-body">
                <div className="kpi-row">
                  <div className="kpi">
                    <div className="kpi-l">Promet</div>
                    <div className="kpi-v" style={{ color: "#fff" }}>8.420</div>
                    <div className="kpi-d" style={{ color: "#4ade80" }}>▲ 12% KM</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Troškovi</div>
                    <div className="kpi-v" style={{ color: "#f87171" }}>3.150</div>
                    <div className="kpi-d" style={{ color: "#64748b" }}>KM mjesec</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Zarada</div>
                    <div className="kpi-v" style={{ color: "#4ade80" }}>5.270</div>
                    <div className="kpi-d" style={{ color: "#4ade80" }}>▲ 18% KM</div>
                  </div>
                </div>

                <div className="chart">
                  <div className="chart-h">
                    <span className="chart-t">Promet po danima</span>
                    <span className="chart-s">zadnjih 7 dana</span>
                  </div>
                  <div className="bars">
                    {[
                      { h: 42, l: "PON" }, { h: 58, l: "UTO" }, { h: 35, l: "SRI" },
                      { h: 72, l: "ČET" }, { h: 90, l: "PET" }, { h: 64, l: "SUB" },
                      { h: 28, l: "NED", dim: true },
                    ].map((b) => (
                      <div className="bar-wrap" key={b.l}>
                        <div className={`bar${b.dim ? " dim" : ""}`} style={{ height: `${b.h}%` }} />
                        <span className="bar-l">{b.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rows">
                  <div className="row">
                    <div className="row-l">
                      <div className="row-t">Uplata — Marković d.o.o.</div>
                      <div className="row-s">Danas · 11:24</div>
                    </div>
                    <div className="row-r"><div className="row-v" style={{ color: "#4ade80" }}>+840 KM</div></div>
                  </div>
                  <div className="row">
                    <div className="row-l">
                      <div className="row-t">Nabavka materijala</div>
                      <div className="row-s">Danas · 09:05</div>
                    </div>
                    <div className="row-r"><div className="row-v" style={{ color: "#f87171" }}>−310 KM</div></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="cta-btn" onClick={scrollToForm}>ZATRAŽI BESPLATNU PONUDU</button>
            <div className="cta-note">Bez obaveze · Odgovor isti dan</div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section alt">
          <div className="s-label">Poznato?</div>
          <div className="s-title disp">Posao raste, a evidencija je i dalje u glavi.</div>
          <p className="s-text">
            Termini u bilježnici, narudžbe u porukama, računi u fascikli, a na kraju mjeseca pola dana ide samo da shvatiš jesi li u plusu. Sve to može biti na jednom ekranu — i na telefonu, dok si na terenu.
          </p>
        </section>

        {/* ŠTA PRAVIMO */}
        <section className="section">
          <div className="s-label">Šta pravim</div>
          <div className="s-title disp">Od obične stranice do kompletnog sistema.</div>
          <p className="s-text">Sve se pravi po mjeri — ne kupuješ gotov šablon u koji moraš uklopiti svoj način rada.</p>

          <div className="srv-list">
            {servisi.map((s) => (
              <div className="srv" key={s.naslov}>
                <div className="srv-ic">{s.icon}</div>
                <div>
                  <div className="srv-n">{s.naslov}</div>
                  <div className="srv-t">{s.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRIMJERI SISTEMA */}
        <section className="section alt">
          <div className="s-label">Kako to izgleda</div>
          <div className="s-title disp">Evo ekrana koje dobijaš.</div>
          <p className="s-text">Nekoliko primjera sistema koje pravim — tvoj izgleda po tvojoj djelatnosti.</p>

          {/* WEBSHOP */}
          <div className="feat">
            <div className="feat-n">01 — Webshop panel</div>
            <div className="feat-h disp">Narudžbe stižu, ti ih samo potvrđuješ</div>
            <p className="feat-p">
              Svaka narudžba sa stranice pada u panel. Vidiš ko je naručio, šta, koliko i u kojoj je fazi. Jedan klik mijenja status, kupac dobija obavijest.
            </p>
            <div className="mock">
              <div className="mock-bar">
                <span className="mock-dot" style={{ background: "#ef4444" }} />
                <span className="mock-dot" style={{ background: "#eab308" }} />
                <span className="mock-dot" style={{ background: "#22c55e" }} />
                <span className="mock-title">Narudžbe · 14 novih</span>
              </div>
              <div className="mock-body">
                <div className="rows">
                  {[
                    { n: "Amir Hodžić", s: "2× Zimska jakna · Tuzla", v: "189 KM", p: "Novo", c: "p-gray" },
                    { n: "Ivana Perić", s: "1× Cipele 41 · Mostar", v: "95 KM", p: "Potvrđeno", c: "p-green" },
                    { n: "Senad Begić", s: "3× Majica · Sarajevo", v: "72 KM", p: "Poslano", c: "p-blue" },
                    { n: "Marija Lukić", s: "1× Torba · Banja Luka", v: "64 KM", p: "Isporučeno", c: "p-green" },
                  ].map((r) => (
                    <div className="row" key={r.n}>
                      <div className="row-l">
                        <div className="row-t">{r.n}</div>
                        <div className="row-s">{r.s}</div>
                      </div>
                      <div className="row-r">
                        <div className="row-v" style={{ color: "#fff" }}>{r.v}</div>
                        <span className={`pill ${r.c}`} style={{ marginTop: "4px" }}>{r.p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TERMINI */}
          <div className="feat">
            <div className="feat-n">02 — Zakazivanje termina</div>
            <div className="feat-h disp">Klijent sam bira termin, ti samo radiš</div>
            <p className="feat-p">
              Za salone, ordinacije i servise. Klijent vidi šta je slobodno i rezerviše sam. Nema propuštenih poziva, nema dvostrukih termina, nema „zaboravio sam".
            </p>
            <div className="mock">
              <div className="mock-bar">
                <span className="mock-dot" style={{ background: "#ef4444" }} />
                <span className="mock-dot" style={{ background: "#eab308" }} />
                <span className="mock-dot" style={{ background: "#22c55e" }} />
                <span className="mock-title">Raspored · Petak, 14.</span>
              </div>
              <div className="mock-body">
                <div className="rows">
                  {[
                    { t: "09:00", n: "Lejla Mujić", s: "Gel nokti · 60 min", free: false },
                    { t: "10:15", n: "Sanja Kovač", s: "Manikir · 45 min", free: false },
                    { t: "11:30", n: "", s: "", free: true },
                    { t: "12:00", n: "Amra Delić", s: "Gel nokti + dizajn · 90 min", free: false },
                    { t: "14:00", n: "", s: "", free: true },
                  ].map((x) => (
                    <div className={`slot${x.free ? " free" : ""}`} key={x.t}>
                      <span className="slot-time">{x.t}</span>
                      {x.free ? (
                        <span className="slot-free-t">+ Slobodan termin</span>
                      ) : (
                        <div>
                          <div className="slot-name">{x.n}</div>
                          <div className="slot-serv">{x.s}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CRM */}
          <div className="feat">
            <div className="feat-n">03 — CRM · baza klijenata</div>
            <div className="feat-h disp">Znaš ko ti je klijent i šta je radio</div>
            <p className="feat-p">
              Cijela historija na jednom mjestu — kad je zadnji put bio, šta je rađeno, koliko je ostavio. Vidiš odmah ko ti je najvredniji i ko se dugo nije javio.
            </p>
            <div className="mock">
              <div className="mock-bar">
                <span className="mock-dot" style={{ background: "#ef4444" }} />
                <span className="mock-dot" style={{ background: "#eab308" }} />
                <span className="mock-dot" style={{ background: "#22c55e" }} />
                <span className="mock-title">Klijenti · 342 ukupno</span>
              </div>
              <div className="mock-body">
                <div className="rows">
                  {[
                    { n: "Emir Kadrić", s: "Golf 7 · Zadnji put: prije 3 mj.", v: "1.240 KM", p: "Redovan", c: "p-green" },
                    { n: "Dragan Milić", s: "Passat B8 · Zadnji put: prije 8 mj.", v: "680 KM", p: "Davno", c: "p-amber" },
                    { n: "Adnan Softić", s: "Octavia · Zadnji put: prije 2 sedm.", v: "2.115 KM", p: "VIP", c: "p-blue" },
                  ].map((r) => (
                    <div className="row" key={r.n}>
                      <div className="row-l">
                        <div className="row-t">{r.n}</div>
                        <div className="row-s">{r.s}</div>
                      </div>
                      <div className="row-r">
                        <div className="row-v" style={{ color: "#fff" }}>{r.v}</div>
                        <span className={`pill ${r.c}`} style={{ marginTop: "4px" }}>{r.p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MAGACIN */}
          <div className="feat">
            <div className="feat-n">04 — Magacin i zalihe</div>
            <div className="feat-h disp">Sistem te upozori prije nego ostaneš bez robe</div>
            <p className="feat-p">
              Vidiš koliko čega imaš i šta je pri kraju. Kad zaliha padne ispod granice koju ti postaviš, artikal se oboji crveno — prije nego te kupac pita, a ti nemaš.
            </p>
            <div className="mock">
              <div className="mock-bar">
                <span className="mock-dot" style={{ background: "#ef4444" }} />
                <span className="mock-dot" style={{ background: "#eab308" }} />
                <span className="mock-dot" style={{ background: "#22c55e" }} />
                <span className="mock-title">Zalihe · 2 upozorenja</span>
              </div>
              <div className="mock-body">
                <div className="rows">
                  {[
                    { n: "Ulje 5W30 · 4L", q: "48 kom", pct: 80, col: "#4ade80", p: null },
                    { n: "Filter zraka · univerzalni", q: "6 kom", pct: 14, col: "#f87171", p: "Pri kraju" },
                    { n: "Disk pločice · prednje", q: "23 kom", pct: 52, col: "#38bdf8", p: null },
                    { n: "Antifriz G12", q: "3 kom", pct: 7, col: "#f87171", p: "Naruči" },
                  ].map((r) => (
                    <div className="row" key={r.n} style={{ display: "block" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <div className="row-t">{r.n}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                          {r.p && <span className="pill p-red">{r.p}</span>}
                          <span className="row-v" style={{ color: "#cbd5e1" }}>{r.q}</span>
                        </div>
                      </div>
                      <div className="stock-track">
                        <div className="stock-fill" style={{ width: `${r.pct}%`, background: r.col }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRANŠE */}
        <section className="section">
          <div className="s-label">Za koga radim</div>
          <div className="s-title disp">Sistem se pravi po tvojoj branši.</div>
          <p className="s-text">Automehaničar i salon za nokte ne trebaju isti ekran. Zato se svaki sistem pravi prema tome kako ti stvarno radiš.</p>

          <div className="br-grid">
            {branse.map((b) => (
              <div className="br-card" key={b.naziv}>
                <div className="br-ic">{b.icon}</div>
                <div className="br-n">{b.naziv}</div>
                <div className="br-o">{b.opis}</div>
              </div>
            ))}
          </div>

          <div className="br-note">...i svaka druga djelatnost — javi šta radiš.</div>
        </section>

        {/* KAKO RADIMO */}
        <section className="section alt">
          <div className="s-label">Kako ide</div>
          <div className="s-title disp">Pet koraka od poziva do gotovog sistema.</div>

          <div className="kor-list">
            {koraci.map((k) => (
              <div className="kor" key={k.br}>
                <div className="kor-br">{k.br}</div>
                <div>
                  <div className="kor-n">{k.naslov}</div>
                  <div className="kor-t">{k.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
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
                da prođemo detalje i dogovorimo dalje.
              </p>
            </div>
          ) : (
            <>
              <div className="form-head">
                <div className="form-badge">💬 BESPLATNA KONSULTACIJA</div>
                <div className="form-t disp">Reci šta ti treba</div>
                <p className="form-s">
                  Ostavi broj i javljam se da čujem kako radiš. Dogovor je besplatan i bez obaveze — tek nakon razgovora dobiješ cijenu i rok.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
                <div>
                  <label className="fl">Ime i prezime *</label>
                  <input className="inp" name="ime" autoComplete="off" placeholder="Vaše ime" />
                </div>

                <div>
                  <label className="fl">Broj telefona *</label>
                  <input className="inp" name="telefon" autoComplete="off" placeholder="061 000 000" />
                </div>

                <div>
                  <label className="fl">Email (opcionalno)</label>
                  <input className="inp" name="email" autoComplete="off" placeholder="vas@email.com" />
                </div>

                <div>
                  <label className="fl">Naziv firme (opcionalno)</label>
                  <input className="inp" name="firma" autoComplete="off" placeholder="Naziv vaše firme" />
                </div>

                <div>
                  <label className="fl">Čime se bavite?</label>
                  <input className="inp" name="djelatnost" autoComplete="off" placeholder="npr. auto servis, salon, veleprodaja..." />
                </div>

                <div>
                  <label className="fl">Šta vas zanima? (možete označiti više)</label>
                  <div className="chips">
                    {USLUGE.map((u) => (
                      <button
                        type="button"
                        key={u}
                        className={`chip${odabrane.includes(u) ? " on" : ""}`}
                        onClick={() => toggleUsluga(u)}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="fl">Opišite ukratko šta vam treba</label>
                  <textarea className="inp" name="poruka" placeholder="Npr. imam auto servis, trebam da vodim radne naloge i da klijenti mogu zakazati termin online..." />
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
            Web stranice · Webshopovi · Poslovni sistemi po mjeri<br />
            Bosna i Hercegovina
          </p>
        </footer>

      </div>

      {/* STICKY */}
      {!success && (
        <div className="sticky">
          <div className="sticky-l">
            <div className="sticky-t">Besplatna ponuda</div>
            <div className="sticky-s">Bez obaveze</div>
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