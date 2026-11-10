"use client";

import { Suspense, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const STA_PRODAJE = [
  "Odjeća i obuća",
  "Kozmetika",
  "Alat i oprema",
  "Namještaj",
  "Hrana i piće",
  "Dječija roba",
  "Nakit i dodaci",
  "Nešto drugo",
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

  const mogucnosti = [
    { ic: "📦", n: "Neograničeno artikala", t: "Dodaješ koliko hoćeš proizvoda, varijanti, veličina i boja. Nema limita ni doplate po artiklu." },
    { ic: "🏷️", n: "Cijene i akcije", t: "Mijenjaš cijenu u sekundi, postavljaš akcijsku cijenu i precrtanu staru. Sve odmah živo na sajtu." },
    { ic: "📋", n: "Narudžbe na jednom mjestu", t: "Svaka narudžba pada u panel s imenom, brojem i adresom. Mijenjaš status jednim klikom." },
    { ic: "📊", n: "Statistika prodaje", t: "Promet po danu, najprodavaniji artikli, prosječna narudžba. Znaš šta ide, a šta stoji." },
    { ic: "🚚", n: "Dostava i kuriri", t: "Postavljaš cijenu dostave, besplatnu dostavu iznad iznosa, i vodiš evidenciju šta je predano kuriru." },
    { ic: "📱", n: "Radi na telefonu", t: "I prodavnica i panel rade savršeno na mobitelu. Narudžbe potvrđuješ s telefona, bilo gdje." },
    { ic: "🔔", n: "Obavijest na telefon", t: "Čim neko naruči, stigne ti poruka. Ne moraš provjeravati sajt svakih pola sata." },
    { ic: "🎯", n: "Facebook pixel spreman", t: "Pixel ugrađen kako treba, pa Facebook zna ko je naručio i kome da gura tvoje oglase." },
  ];

  const zaKoga = [
    { ic: "👗", n: "Butici i odjeća" },
    { ic: "💄", n: "Kozmetika" },
    { ic: "🔧", n: "Alat i oprema" },
    { ic: "🛋️", n: "Namještaj" },
    { ic: "🧸", n: "Dječija roba" },
    { ic: "🍯", n: "Domaći proizvodi" },
    { ic: "💍", n: "Nakit i dodaci" },
    { ic: "📦", n: "Veleprodaja" },
  ];

  const koraci = [
    { br: "1", n: "Razgovor", t: "Ispričaš šta prodaješ i kako radiš. Besplatno i bez obaveze." },
    { br: "2", n: "Ponuda i rok", t: "Dobiješ tačnu cijenu i rok. Bez skrivenih stavki i bez mjesečnih obaveza." },
    { br: "3", n: "Izrada", t: "Pravim shop i panel, javljam ti kako napreduje. Vidiš prije nego je gotovo." },
    { br: "4", n: "Puštanje u rad", t: "Shop ide na tvoju domenu, prođem s tobom kroz panel da znaš sve koristiti." },
    { br: "5", n: "Podrška", t: "Trebaš izmjenu ili nova funkcija — javiš se i riješimo." },
  ];

  const faqs = [
    { q: "Koliko košta izrada shopa?", a: "Ovisi koliko artikala imaš i koje funkcije trebaš. Zato ne stavljam cijenu unaprijed — javi se, opiši šta prodaješ i dobiješ tačnu cijenu i rok, bez obaveze." },
    { q: "Da li plaćam nešto svaki mjesec?", a: "Za sam shop ne. Plaćaš samo izradu jednom. Jedini stalni trošak su domena i hosting, a to je simbolično na godišnjem nivou — i plaćaš direktno, bez posrednika." },
    { q: "Mogu li sam dodavati artikle?", a: "Da, to je cijela poenta vlastitog panela. Dodaješ artikle, slike, cijene, veličine i akcije sam, bez da zoveš ikoga." },
    { q: "Šta ako ne znam raditi s računarom?", a: "Panel je pravljen da bude jednostavan — ako znaš postaviti objavu na Facebook, znaćeš i ovo. Uz predaju ide i obuka dok ne budeš siguran." },
    { q: "Kako kupci plaćaju?", a: "Najčešće pouzećem, što je u BiH i najzastupljenije. Ako želiš i kartično plaćanje, to se može dodati — pričamo o tome na razgovoru." },
    { q: "Imam već stranicu, može li se nadograditi?", a: "Obično da. Pogledam šta imaš i kažem ti iskreno isplati li se nadograditi postojeće ili praviti novo." },
    { q: "Koliko traje izrada?", a: "Manji shop obično brzo, veći s puno artikala i varijanti traje duže. Tačan rok dobiješ uz ponudu, prije nego bilo šta krene." },
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
      djelatnost:   odabrano.join(", "),
      usluge:       "Izrada webshopa",
      poruka:       String(fd.get("poruka") || ""),
      status:       "novo",
      source:       "webshop",
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
        product_name: `WEBSHOP UPIT: ${lead.djelatnost || "nije precizirano"}`,
        full_name: lead.full_name,
        phone: lead.phone,
        address_place: lead.firma || "—",
        total: 0,
      }),
    }).catch(() => {});

    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: "Webshop upit", currency: "BAM" });
    }

    form.reset();
    setOdabrano([]);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fbf7ef; }

        .page {
          font-family: 'Nunito', sans-serif;
          background: #fbf7ef; color: #16130d;
          min-height: 100vh; max-width: 520px; margin: 0 auto;
          padding-bottom: 86px; overflow-x: hidden;
        }
        .disp { font-family: 'Bricolage Grotesque', sans-serif; letter-spacing: -.025em; }

        /* HEADER */
        .hdr {
          position: sticky; top: 0; z-index: 80;
          background: rgba(251,247,239,0.93); backdrop-filter: blur(10px);
          border-bottom: 1px solid #e8dfcd;
          padding: 12px 18px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 9px; }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 9px; background: #0b5c45;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: #e0a92e;
        }
        .logo-txt { font-size: 16px; font-weight: 700; color: #16130d; letter-spacing: .05em; }
        .logo-txt span { color: #0b5c45; }
        .hdr-btn {
          background: #0b5c45; border: none; color: #fbf7ef;
          font-family: 'Nunito', sans-serif; font-size: 12.5px; font-weight: 800;
          padding: 9px 15px; border-radius: 8px; cursor: pointer;
        }

        /* HERO */
        .hero { padding: 36px 18px 34px; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fdf0d3; border: 1px solid #e8cf96; color: #8a6514;
          font-size: 11.5px; font-weight: 800; padding: 6px 13px;
          border-radius: 50px; margin-bottom: 18px; letter-spacing: .02em;
        }
        .hero h1 {
          font-size: 37px; font-weight: 800; line-height: 1.08;
          color: #16130d; margin-bottom: 15px;
        }
        .hero h1 em {
          font-style: normal; color: #0b5c45;
          position: relative; white-space: nowrap;
        }
        .hero h1 em::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 3px; height: 9px;
          background: #e0a92e; opacity: .32; border-radius: 2px; z-index: -1;
        }
        .hero-sub { font-size: 15.5px; color: #5c5547; line-height: 1.66; margin-bottom: 24px; }

        .cta-btn {
          width: 100%; padding: 18px; background: #d2451e; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 17px; font-weight: 900;
          border: none; border-radius: 13px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 8px 24px rgba(210,69,30,0.28);
        }
        .cta-btn:hover { background: #b33817; transform: translateY(-1px); }
        .cta-note { text-align: center; font-size: 12.5px; font-weight: 700; color: #948a77; margin-top: 11px; }

        /* DUO MOCKUP */
        .duo { position: relative; margin-bottom: 26px; padding-bottom: 42px; }

        .panel {
          background: #fffdf8; border: 1px solid #e3dac7; border-radius: 14px;
          overflow: hidden; box-shadow: 0 16px 44px rgba(22,19,13,0.13);
        }
        .panel-bar {
          background: #0b5c45; padding: 10px 13px;
          display: flex; align-items: center; gap: 7px;
        }
        .pdot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); }
        .panel-t {
          margin-left: 6px; font-size: 10.5px; font-weight: 800;
          color: rgba(255,255,255,0.85); letter-spacing: .04em;
        }
        .panel-body { padding: 13px; }

        .phone {
          position: absolute; right: -4px; bottom: 0; width: 132px;
          background: #16130d; border-radius: 20px; padding: 6px;
          box-shadow: 0 16px 38px rgba(22,19,13,0.3);
        }
        .phone-scr { background: #fffdf8; border-radius: 15px; overflow: hidden; }
        .phone-top {
          background: #0b5c45; padding: 7px 9px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .phone-logo { font-size: 8.5px; font-weight: 800; color: #e0a92e; letter-spacing: .06em; }
        .phone-cart { font-size: 9px; }
        .pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 7px; }
        .pcard { }
        .pimg {
          width: 100%; aspect-ratio: 1; border-radius: 5px;
          display: flex; align-items: center; justify-content: center; font-size: 17px;
        }
        .pname { font-size: 6.5px; font-weight: 700; color: #16130d; margin-top: 3px; line-height: 1.2; }
        .pprice { font-size: 7.5px; font-weight: 900; color: #0b5c45; margin-top: 1px; }
        .pbtn {
          background: #d2451e; color: #fff; font-size: 6px; font-weight: 800;
          text-align: center; padding: 3px; border-radius: 3px; margin-top: 3px;
        }

        /* TABLICE U PANELU */
        .rows { display: flex; flex-direction: column; gap: 6px; }
        .row {
          background: #faf5ea; border: 1px solid #ece3d1; border-radius: 8px;
          padding: 9px 11px; display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
        }
        .row-l { min-width: 0; }
        .row-t { font-size: 11px; font-weight: 800; color: #16130d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row-s { font-size: 9px; font-weight: 600; color: #998f7b; margin-top: 2px; }
        .row-r { text-align: right; flex-shrink: 0; }
        .row-v { font-size: 11.5px; font-weight: 900; color: #16130d; }
        .pill { font-size: 8.5px; font-weight: 800; padding: 3px 8px; border-radius: 50px; display: inline-block; }
        .pl-new { background: #ece3d1; color: #7d7360; }
        .pl-ok  { background: #d7ebe2; color: #0b5c45; }
        .pl-go  { background: #fdf0d3; color: #8a6514; }
        .pl-red { background: #fadfd6; color: #a8381a; }

        .kpi3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 11px; }
        .kpi {
          background: #faf5ea; border: 1px solid #ece3d1; border-radius: 8px; padding: 9px 8px;
        }
        .kpi-l { font-size: 8px; font-weight: 800; color: #998f7b; text-transform: uppercase; letter-spacing: .06em; }
        .kpi-v { font-size: 16px; font-weight: 900; color: #16130d; margin-top: 3px; line-height: 1; }
        .kpi-d { font-size: 8px; font-weight: 800; color: #0b5c45; margin-top: 3px; }

        .bars { display: flex; align-items: flex-end; gap: 4px; height: 50px; margin-top: 4px; }
        .bwrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .bar { width: 100%; border-radius: 2px 2px 0 0; background: #0b5c45; }
        .bar.g { background: #e0a92e; }
        .bl { font-size: 7px; font-weight: 700; color: #998f7b; }

        /* SECTIONS */
        .section { padding: 36px 18px; }
        .section.cream { background: #f5eddd; border-top: 1px solid #e8dfcd; border-bottom: 1px solid #e8dfcd; }
        .section.dark { background: #0b5c45; }
        .s-label {
          font-size: 11px; font-weight: 800; color: #0b5c45;
          text-transform: uppercase; letter-spacing: .14em; margin-bottom: 11px;
        }
        .section.dark .s-label { color: #e0a92e; }
        .s-title { font-size: 27px; font-weight: 800; color: #16130d; line-height: 1.17; margin-bottom: 13px; }
        .section.dark .s-title { color: #fff; }
        .s-text { font-size: 15px; color: #5c5547; line-height: 1.68; }
        .section.dark .s-text { color: rgba(255,255,255,0.75); }

        /* VS TABELA */
        .vs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 22px; }
        .vs-card { border-radius: 15px; padding: 18px 15px; }
        .vs-rent { background: #fff; border: 1.5px solid #e3dac7; }
        .vs-own  { background: #0b5c45; border: 1.5px solid #0b5c45; }
        .vs-h { font-size: 13px; font-weight: 900; letter-spacing: .02em; }
        .vs-rent .vs-h { color: #998f7b; }
        .vs-own .vs-h { color: #e0a92e; }
        .vs-li { display: flex; gap: 7px; align-items: flex-start; margin-top: 12px; font-size: 12.5px; font-weight: 700; line-height: 1.45; }
        .vs-rent .vs-li { color: #5c5547; }
        .vs-own .vs-li { color: rgba(255,255,255,0.92); }
        .vs-mark { flex-shrink: 0; font-size: 12px; }

        /* MOGUCNOSTI */
        .mg-list { display: flex; flex-direction: column; gap: 10px; margin-top: 22px; }
        .mg {
          background: #fff; border: 1px solid #e8dfcd; border-radius: 14px;
          padding: 16px; display: flex; gap: 13px; align-items: flex-start;
        }
        .mg-ic {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          background: #f0f6f3; border: 1px solid #cfe3da;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .mg-n { font-size: 15px; font-weight: 800; color: #16130d; }
        .mg-t { font-size: 13px; color: #6b6253; line-height: 1.6; margin-top: 5px; }

        /* FEATURE */
        .feat { margin-top: 26px; }
        .feat + .feat { margin-top: 34px; }
        .feat-n { font-size: 11px; font-weight: 800; color: #0b5c45; text-transform: uppercase; letter-spacing: .11em; margin-bottom: 8px; }
        .feat-h { font-size: 21px; font-weight: 800; color: #16130d; line-height: 1.28; margin-bottom: 9px; }
        .feat-p { font-size: 14px; color: #6b6253; line-height: 1.65; margin-bottom: 16px; }

        /* ZA KOGA */
        .zk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 20px; }
        .zk {
          background: #fff; border: 1px solid #e8dfcd; border-radius: 12px;
          padding: 15px 13px; display: flex; align-items: center; gap: 10px;
        }
        .zk-ic { font-size: 21px; }
        .zk-n { font-size: 13px; font-weight: 800; color: #16130d; line-height: 1.3; }
        .zk-note { margin-top: 15px; text-align: center; font-size: 13px; font-weight: 700; color: #948a77; }

        /* KORACI */
        .kor { display: flex; gap: 15px; padding-bottom: 20px; position: relative; }
        .kor:last-child { padding-bottom: 0; }
        .kor::before {
          content: ''; position: absolute; left: 17px; top: 38px; bottom: 0;
          width: 1px; background: rgba(224,169,46,0.4);
        }
        .kor:last-child::before { display: none; }
        .kor-br {
          width: 35px; height: 35px; border-radius: 50%; flex-shrink: 0; z-index: 1;
          background: #0b5c45; border: 1.5px solid #e0a92e; color: #e0a92e;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 800;
        }
        .kor-n { font-size: 15px; font-weight: 800; color: #fff; padding-top: 7px; }
        .kor-t { font-size: 13px; color: rgba(255,255,255,0.72); line-height: 1.6; margin-top: 4px; }

        /* FAQ */
        .faq-item { border: 1px solid #e8dfcd; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #fff; }
        .faq-q { display: flex; justify-content: space-between; align-items: center; padding: 15px 16px; cursor: pointer; user-select: none; gap: 11px; }
        .faq-q-t { font-size: 14px; font-weight: 800; color: #16130d; line-height: 1.35; }
        .faq-ic {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: #f0f6f3; border: 1px solid #cfe3da;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #0b5c45; transition: transform .2s;
        }
        .faq-item.open .faq-ic { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #6b6253; line-height: 1.72;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 300px; padding: 0 16px 15px; }

        /* FORMA */
        .form-wrap { padding: 36px 18px 40px; background: #f5eddd; border-top: 2px solid #0b5c45; }
        .form-head { text-align: center; margin-bottom: 24px; }
        .form-badge {
          display: inline-block; background: #fdf0d3; border: 1px solid #e8cf96;
          color: #8a6514; font-size: 11.5px; font-weight: 800;
          padding: 6px 14px; border-radius: 50px; margin-bottom: 13px;
        }
        .form-t { font-size: 27px; font-weight: 800; color: #16130d; margin-bottom: 9px; line-height: 1.2; }
        .form-s { font-size: 14px; color: #6b6253; line-height: 1.6; }

        .fl { font-size: 12px; font-weight: 800; color: #7d7360; margin-bottom: 7px; display: block; }
        .inp {
          width: 100%; background: #fff; border: 1.5px solid #ddd2bc;
          border-radius: 10px; padding: 14px 15px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          color: #16130d; transition: border-color .2s; outline: none;
        }
        .inp::placeholder { color: #b5ab96; font-weight: 600; }
        .inp:focus { border-color: #0b5c45; }
        textarea.inp { resize: vertical; min-height: 88px; line-height: 1.55; }

        .chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .chip {
          background: #fff; border: 1.5px solid #ddd2bc; color: #6b6253;
          font-family: 'Nunito', sans-serif; font-size: 12.5px; font-weight: 700;
          padding: 9px 13px; border-radius: 50px; cursor: pointer; transition: all .15s;
        }
        .chip.on { background: #0b5c45; border-color: #0b5c45; color: #fff; }

        .submit {
          width: 100%; padding: 18px; background: #d2451e; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900;
          border: none; border-radius: 13px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 8px 24px rgba(210,69,30,0.26);
        }
        .submit:hover:not(:disabled) { background: #b33817; transform: translateY(-1px); }
        .submit:disabled { opacity: .6; cursor: not-allowed; }

        .trust { display: flex; justify-content: center; gap: 15px; margin-top: 15px; flex-wrap: wrap; }
        .trust span { font-size: 12px; font-weight: 700; color: #948a77; }

        @keyframes pop { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .ok-wrap { text-align: center; padding: 46px 16px; animation: pop .4s ease both; }
        .ok-ic { font-size: 62px; margin-bottom: 16px; }
        .ok-t { font-size: 27px; font-weight: 800; color: #0b5c45; margin-bottom: 10px; }
        .ok-s { font-size: 15px; font-weight: 600; color: #6b6253; line-height: 1.65; }

        /* STICKY */
        .sticky {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 520px; z-index: 90;
          background: rgba(251,247,239,0.96); backdrop-filter: blur(10px);
          border-top: 1px solid #e3dac7;
          padding: 11px 16px calc(11px + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 12px;
        }
        .sticky-t { font-size: 13px; font-weight: 900; color: #16130d; line-height: 1.15; }
        .sticky-s { font-size: 10px; font-weight: 700; color: #948a77; margin-top: 2px; }
        .sticky-b {
          flex: 1; padding: 14px; background: #d2451e; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 900;
          border: none; border-radius: 11px; cursor: pointer;
        }

        .footer { padding: 28px 18px 32px; text-align: center; background: #16130d; }
        .f-logo { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 9px; letter-spacing: .08em; }
        .f-logo span { color: #e0a92e; }
        .f-t { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.7; }
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
          <div className="eyebrow">🛒 Izrada webshopa s vlastitim panelom</div>

          <h1 className="disp">
            Tvoja prodavnica.<br />Tvoj panel.<br /><em>Tvoje pare.</em>
          </h1>

          <p className="hero-sub">
            Webshop napravljen po mjeri, s panelom u kojem sam dodaješ artikle, mijenjaš cijene i pratiš narudžbe. Bez mjesečne kirije i bez provizije na svaku prodaju.
          </p>

          {/* DUO MOCKUP */}
          <div className="duo">
            <div className="panel">
              <div className="panel-bar">
                <span className="pdot" /><span className="pdot" /><span className="pdot" />
                <span className="panel-t">TVOJ PANEL · Narudžbe</span>
              </div>
              <div className="panel-body">
                <div className="kpi3">
                  <div className="kpi">
                    <div className="kpi-l">Danas</div>
                    <div className="kpi-v">14</div>
                    <div className="kpi-d">narudžbi</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Promet</div>
                    <div className="kpi-v">1.280</div>
                    <div className="kpi-d">▲ 22% KM</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Čeka</div>
                    <div className="kpi-v">3</div>
                    <div className="kpi-d">potvrdu</div>
                  </div>
                </div>

                <div className="rows" style={{ marginBottom: "60px" }}>
                  {[
                    { n: "Amra Selimović", s: "2× Haljina · M · Tuzla", v: "118 KM", p: "Novo", c: "pl-new" },
                    { n: "Mirza Hodžić", s: "1× Patike 43 · Zenica", v: "89 KM", p: "Potvrđeno", c: "pl-ok" },
                    { n: "Ivana Babić", s: "3× Krema · Mostar", v: "67 KM", p: "Poslano", c: "pl-go" },
                  ].map((r) => (
                    <div className="row" key={r.n}>
                      <div className="row-l">
                        <div className="row-t">{r.n}</div>
                        <div className="row-s">{r.s}</div>
                      </div>
                      <div className="row-r">
                        <div className="row-v">{r.v}</div>
                        <span className={`pill ${r.c}`} style={{ marginTop: "4px" }}>{r.p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TELEFON — ono što kupac vidi */}
            <div className="phone">
              <div className="phone-scr">
                <div className="phone-top">
                  <span className="phone-logo">TVOJ SHOP</span>
                  <span className="phone-cart">🛒</span>
                </div>
                <div className="pgrid">
                  {[
                    { e: "👗", n: "Haljina", c: "59 KM", bg: "#f4e4e8" },
                    { e: "👟", n: "Patike", c: "89 KM", bg: "#e4ecf4" },
                    { e: "🧴", n: "Krema", c: "22 KM", bg: "#eef4e4" },
                    { e: "👜", n: "Torba", c: "64 KM", bg: "#f4eee4" },
                  ].map((p) => (
                    <div className="pcard" key={p.n}>
                      <div className="pimg" style={{ background: p.bg }}>{p.e}</div>
                      <div className="pname">{p.n}</div>
                      <div className="pprice">{p.c}</div>
                      <div className="pbtn">U KORPU</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button className="cta-btn" onClick={scrollToForm}>ZATRAŽI BESPLATNU PONUDU</button>
          <div className="cta-note">Bez obaveze · Odgovor isti dan</div>
        </section>

        {/* PROBLEM */}
        <section className="section cream">
          <div className="s-label">Razmisli</div>
          <div className="s-title disp">Zašto bi plaćao kiriju za vlastitu prodavnicu?</div>
          <p className="s-text">
            Gotove platforme uzimaju mjesečnu pretplatu dok god prodaješ, a mnoge i procenat od svake narudžbe. Što više prodaš, to im više daješ. I kad jednog dana staneš s plaćanjem — shop se gasi, a sve ostaje kod njih.
          </p>

          <div className="vs">
            <div className="vs-card vs-rent">
              <div className="vs-h">ZAKUPLJENA PLATFORMA</div>
              <div className="vs-li"><span className="vs-mark">✕</span><span>Plaćaš svaki mjesec, zauvijek</span></div>
              <div className="vs-li"><span className="vs-mark">✕</span><span>Procenat od prodaje odlazi njima</span></div>
              <div className="vs-li"><span className="vs-mark">✕</span><span>Staneš platiti — shop se gasi</span></div>
              <div className="vs-li"><span className="vs-mark">✕</span><span>Radiš kako njihov sistem dozvoli</span></div>
            </div>
            <div className="vs-card vs-own">
              <div className="vs-h">TVOJ WEBSHOP</div>
              <div className="vs-li"><span className="vs-mark">✓</span><span>Platiš izradu jednom</span></div>
              <div className="vs-li"><span className="vs-mark">✓</span><span>Nema provizije — sve ti ostaje</span></div>
              <div className="vs-li"><span className="vs-mark">✓</span><span>Shop je tvoj, na tvojoj domeni</span></div>
              <div className="vs-li"><span className="vs-mark">✓</span><span>Pravi se kako ti radiš</span></div>
            </div>
          </div>
        </section>

        {/* MOGUĆNOSTI */}
        <section className="section">
          <div className="s-label">Šta panel radi</div>
          <div className="s-title disp">Sve što ti treba, bez zvanja programera.</div>
          <p className="s-text">Panel je pravljen da ga koristiš sam — jednostavno, na bosanskom i na telefonu.</p>

          <div className="mg-list">
            {mogucnosti.map((m) => (
              <div className="mg" key={m.n}>
                <div className="mg-ic">{m.ic}</div>
                <div>
                  <div className="mg-n">{m.n}</div>
                  <div className="mg-t">{m.t}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EKRANI */}
        <section className="section cream">
          <div className="s-label">Kako izgleda</div>
          <div className="s-title disp">Evo ekrana iz panela.</div>
          <p className="s-text">Tvoj panel se pravi prema tome šta prodaješ — ovo su primjeri.</p>

          {/* ARTIKLI */}
          <div className="feat">
            <div className="feat-n">01 — Artikli</div>
            <div className="feat-h disp">Dodaj artikal, postavi cijenu, gotovo</div>
            <p className="feat-p">
              Sliku, naziv, cijenu i zalihu mijenjaš direktno u panelu. Staviš akcijsku cijenu i stara se automatski precrta na sajtu. Artikal koji je nestao samo isključiš.
            </p>
            <div className="panel">
              <div className="panel-bar">
                <span className="pdot" /><span className="pdot" /><span className="pdot" />
                <span className="panel-t">Artikli · 128 aktivnih</span>
              </div>
              <div className="panel-body">
                <div className="rows">
                  {[
                    { n: "Zimska jakna · crna", s: "Zaliha: 24 · M, L, XL", v: "149 KM", p: "Aktivan", c: "pl-ok" },
                    { n: "Patike Runner", s: "Zaliha: 8 · 40–45", v: "89 KM", p: "Akcija", c: "pl-go" },
                    { n: "Krema za lice 50ml", s: "Zaliha: 2 · pri kraju", v: "22 KM", p: "Nestaje", c: "pl-red" },
                    { n: "Kožna torba", s: "Zaliha: 0", v: "64 KM", p: "Isključen", c: "pl-new" },
                  ].map((r) => (
                    <div className="row" key={r.n}>
                      <div className="row-l">
                        <div className="row-t">{r.n}</div>
                        <div className="row-s">{r.s}</div>
                      </div>
                      <div className="row-r">
                        <div className="row-v">{r.v}</div>
                        <span className={`pill ${r.c}`} style={{ marginTop: "4px" }}>{r.p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* STATISTIKA */}
          <div className="feat">
            <div className="feat-n">02 — Statistika</div>
            <div className="feat-h disp">Vidiš šta se prodaje, a šta stoji</div>
            <p className="feat-p">
              Promet po danima i lista najprodavanijih artikala. Odmah znaš šta vrijedi gurati u oglasima, a šta ti samo zauzima magacin.
            </p>
            <div className="panel">
              <div className="panel-bar">
                <span className="pdot" /><span className="pdot" /><span className="pdot" />
                <span className="panel-t">Statistika · ovaj mjesec</span>
              </div>
              <div className="panel-body">
                <div className="kpi3">
                  <div className="kpi">
                    <div className="kpi-l">Promet</div>
                    <div className="kpi-v">18.4k</div>
                    <div className="kpi-d">▲ 31% KM</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Narudžbi</div>
                    <div className="kpi-v">214</div>
                    <div className="kpi-d">▲ 18%</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-l">Prosjek</div>
                    <div className="kpi-v">86</div>
                    <div className="kpi-d">KM/narudžba</div>
                  </div>
                </div>

                <div style={{ background: "#faf5ea", border: "1px solid #ece3d1", borderRadius: "8px", padding: "11px", marginBottom: "10px" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 800, color: "#16130d", marginBottom: "6px" }}>Promet po sedmicama</div>
                  <div className="bars">
                    {[
                      { h: 46, l: "S1" }, { h: 62, l: "S2" },
                      { h: 54, l: "S3" }, { h: 92, l: "S4", g: true },
                    ].map((b) => (
                      <div className="bwrap" key={b.l}>
                        <div className={`bar${b.g ? " g" : ""}`} style={{ height: `${b.h}%` }} />
                        <span className="bl">{b.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rows">
                  {[
                    { n: "🥇 Zimska jakna · crna", s: "38 prodanih", v: "5.662 KM" },
                    { n: "🥈 Patike Runner", s: "29 prodanih", v: "2.581 KM" },
                    { n: "🥉 Kožna torba", s: "21 prodana", v: "1.344 KM" },
                  ].map((r) => (
                    <div className="row" key={r.n}>
                      <div className="row-l">
                        <div className="row-t">{r.n}</div>
                        <div className="row-s">{r.s}</div>
                      </div>
                      <div className="row-r"><div className="row-v">{r.v}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ZA KOGA */}
        <section className="section">
          <div className="s-label">Za koga</div>
          <div className="s-title disp">Ako imaš šta prodati — imaš gdje.</div>

          <div className="zk-grid">
            {zaKoga.map((z) => (
              <div className="zk" key={z.n}>
                <span className="zk-ic">{z.ic}</span>
                <span className="zk-n">{z.n}</span>
              </div>
            ))}
          </div>

          <div className="zk-note">...i sve ostalo — javi šta prodaješ.</div>
        </section>

        {/* KAKO IDE */}
        <section className="section dark">
          <div className="s-label">Kako ide</div>
          <div className="s-title disp">Pet koraka do tvog shopa.</div>
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
                <div className="form-t disp">Hajde da napravimo tvoj shop</div>
                <p className="form-s">
                  Ostavi broj i javljam se da čujem šta prodaješ. Dogovor je besplatan — tek nakon razgovora dobiješ cijenu i rok.
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
                  <label className="fl">Naziv firme ili brenda (opcionalno)</label>
                  <input className="inp" name="firma" autoComplete="off" placeholder="Naziv" />
                </div>

                <div>
                  <label className="fl">Šta prodaješ? (možeš označiti više)</label>
                  <div className="chips">
                    {STA_PRODAJE.map((v) => (
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
                  <label className="fl">Reci ukratko šta ti treba</label>
                  <textarea className="inp" name="poruka" placeholder="Npr. imam oko 60 artikala odjeće, prodajem preko Instagrama i trebam pravi shop gdje kupci sami naručuju..." />
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
            Izrada webshopova s vlastitim panelom<br />
            Bosna i Hercegovina
          </p>
        </footer>

      </div>

      {!success && (
        <div className="sticky">
          <div>
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