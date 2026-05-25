"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [navSolid, setNavSolid]   = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const [popup, setPopup]         = useState<{ text: string; name: string } | null>(null);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () =>
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const baseTotal = 34.0; // 25 + 9 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  /* ── sticky nav ── */
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── popup rotation ── */
  const popups = [
    { name: "Elma, Sarajevo",   text: "Postavila mrežu na balkon sama za 10 minuta!" },
    { name: "Nikola, Banja Luka", text: "Drže čvrsto, čak i kad dune jači vjetar." },
    { name: "Amila, Tuzla",     text: "Super stvar, sad imamo hlad u dvorištu bez ulaganja." },
    { name: "Ivan, Mostar",     text: "Jednostavno rješenje, montaža bez bušenja!" },
    { name: "Lejla, Zenica",    text: "Kupili za baštu, zakačke rade posao odlično." },
    { name: "Adnan, Brčko",     text: "Po ovoj cijeni nema bolje opcije." },
    { name: "Milica, Trebinje", text: "Odlično za mrežu iznad auta – štiti i od sunca i od lišća." },
    { name: "Tarik, Doboj",     text: "Koristim ih za mrežu na gradilištu – super čvrste." },
    { name: "Ivana, Konjic",    text: "Praktične, lagane i mogu se koristiti više puta." },
    { name: "Dino, Bihać",      text: "Idealne za našu terasu, brzo ih skidam kad treba više svjetla." },
  ];

  useEffect(() => {
    let idx = 0;
    const show = () => {
      setPopup(popups[idx % popups.length]);
      idx++;
      setTimeout(() => setPopup(null), 4000);
    };
    const timer = setInterval(show, 7000);
    const init = setTimeout(show, 2500);
    return () => { clearInterval(timer); clearTimeout(init); };
  }, []);

  const benefits = [
    { icon: "☀️", title: "UV-otporna plastika", desc: "Izrađene od tvrde plastike otporne na sunce, kišu i vjetar – bez pucanja i savijanja." },
    { icon: "🔧", title: "Montaža bez alata", desc: "Ručno se pričvršćuju za ogradu, stub ili sajlu za manje od minute." },
    { icon: "♻️", title: "Višekratna upotreba", desc: "Skinite, složite, koristite ponovo – godinama bez gubitka čvrstoće." },
    { icon: "💡", title: "Pametna alternativa", desc: "Zaboravite na skupe tende. Mreža + zakačke = isto rješenje, 10× jeftinije." },
    { icon: "🏠", title: "Višenamjenske", desc: "Balkon, terasa, dvorište, gradilište, garderoba za auto – sve u jednom." },
    { icon: "📦", title: "50 komada u setu", desc: "Dovoljan broj za veliku površinu ili više mjesta odjednom." },
  ];

  const steps = [
    { n: "01", title: "Naruči online", desc: "Popuni formu za manje od 60 sekundi. Bez registracije, bez kartice." },
    { n: "02", title: "Potvrda pozivom", desc: "Naš tim te nazove kako bi potvrdio narudžbu i adresu dostave." },
    { n: "03", title: "Dostava na adresu", desc: "Paket stiže na tvoju adresu u roku od 2–4 radna dana." },
    { n: "04", title: "Plati pouzećem", desc: "Platiš kuriru tek kada preuzmeš paket — nikakav rizik." },
  ];

  const testimonials = [
    { text: "Kupili smo zakačke za mrežu na balkonu i riješili problem suncem bez majstora. Postavili smo sve sami za manje od pola sata!", author: "Elma H.", city: "Sarajevo" },
    { text: "Imam malu radionicu u dvorištu i mreža sa zakačkama mi pravi sjenu dok radim. Drže odlično, nisu popustile ni kad je padala jaka kiša.", author: "Nikola V.", city: "Banja Luka" },
    { text: "Dugo smo tražili način da napravimo hladovinu bez velikih troškova. Ove zakačke su bile savršeno rješenje – jednostavne i povoljne.", author: "Amila K.", city: "Tuzla" },
    { text: "Postavio sam mrežu iznad auta uz pomoć zakački i sad više nemam problem sa užarenim vozilom. Lako se montira, a još lakše skida.", author: "Ivan D.", city: "Mostar" },
    { text: "Živim na spratu i željela sam više privatnosti na balkonu. Mreža + zakačke = brzo rješenje koje izgleda uredno i funkcioniše savršeno.", author: "Lejla M.", city: "Zenica" },
    { text: "Koristim ih za sjenku u vrtu. Prvo sam bila skeptična, ali sad sam oduševljena. Nisu se pomjerile ni kad je puhao jak vjetar.", author: "Adnan T.", city: "Brčko" },
  ];

  const faqs = [
    { q: "Kako se zakačke montiraju?", a: "Jednostavno ih ručno pričvrstite na mrežu i željeni oslonac – ogradu, stub, sajlu i sl. Nisu potrebni alati ni bušenje." },
    { q: "Da li su otporne na vremenske uslove?", a: "Da, izrađene su od UV-otporne plastike i otporne su na kišu, sunce i vjetar – pogodne za dugotrajnu vanjsku upotrebu." },
    { q: "Koliko puta se mogu koristiti?", a: "Zakačke su višekratne – skinite ih, složite i koristite ponovo bez oštećenja ili gubitka funkcionalnosti." },
    { q: "Koliko komada dolazi u pakovanju?", a: "Jedno pakovanje sadrži 50 plastičnih zakački – dovoljno za veću površinu ili više mjesta odjednom." },
    { q: "Za šta se sve mogu koristiti?", a: "Idealne za mreže za zaštitu od sunca, privatnost ili vjetar – na terasama, balkonima, u baštama, dvorištima, iznad automobila ili na gradilištu." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš tek kada preuzmeš paket na svojoj adresi. Nema rizika." },
  ];

  const included = [
    "50× zakačka UV-otporna plastika",
    "Boja: Crna",
    "Montaža bez alata",
    "Višekratna upotreba",
    "Otporne na kišu, sunce i vjetar",
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Zakačke za zaštitnu mrežu od sunca – 50 komada",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      9,
      product_price: 25.0,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "zakacke-mreza",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);
    if (error) { alert("Greška pri slanju. Pokušajte ponovo."); setLoading(false); return; }

    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: order.product_name, value: order.total, currency: "BAM" });
    }

    form.reset();
    setGiftPack(false);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --bg:      #080C0A;
          --bg2:     #0D1210;
          --bg3:     #111916;
          --card:    #141C18;
          --border:  rgba(255,255,255,0.07);
          --accent:  #3DEB8A;
          --accent2: #00C96A;
          --red:     #FF5252;
          --text:    #EDF5F0;
          --text2:   rgba(237,245,240,0.55);
          --text3:   rgba(237,245,240,0.28);
          --radius:  18px;
          --font-h:  'Outfit', sans-serif;
          --font-b:  'DM Sans', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }

        .wrap {
          font-family: var(--font-b);
          color: var(--text);
          background: var(--bg);
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          overflow-x: hidden;
          position: relative;
        }

        /* ── POPUP ── */
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popupOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(16px); }
        }
        .popup {
          position: fixed;
          bottom: 24px;
          left: 16px;
          right: 16px;
          max-width: 360px;
          margin: 0 auto;
          z-index: 999;
          background: var(--card);
          border: 1px solid rgba(61,235,138,0.25);
          border-radius: 16px;
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          animation: popupIn .4s ease both;
        }
        .popup-icon {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(61,235,138,0.12);
          border: 1px solid rgba(61,235,138,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 16px;
        }
        .popup-text { font-size: 13px; color: var(--text2); line-height: 1.5; }
        .popup-name { font-family: var(--font-h); font-weight: 800; font-size: 12px; color: var(--accent); margin-top: 3px; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          transition: background .3s, box-shadow .3s;
        }
        .nav.solid {
          background: rgba(8,12,10,0.9);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 var(--border);
        }
        .nav-logo { font-family: var(--font-h); font-weight: 900; font-size: 16px; color: var(--accent); }
        .nav-cta {
          font-family: var(--font-h); font-weight: 800; font-size: 13px;
          background: var(--accent); color: #031a0d;
          border: none; cursor: pointer; padding: 10px 18px;
          border-radius: 50px; transition: opacity .15s, transform .15s;
        }
        .nav-cta:hover { opacity: .88; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          position: relative; overflow: hidden;
          padding: 44px 22px 52px;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(61,235,138,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(61,235,138,0.035) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .hero-radial {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 55% at 50% 0%, rgba(61,235,138,0.11) 0%, transparent 68%);
          pointer-events: none;
        }
        .hero-radial2 {
          position: absolute; bottom: -80px; right: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(0,201,106,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(61,235,138,0.4); }
          60%      { box-shadow: 0 0 0 8px rgba(61,235,138,0); }
        }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-h); font-weight: 800; font-size: 12px;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--accent);
          background: rgba(61,235,138,0.09);
          border: 1px solid rgba(61,235,138,0.28);
          border-radius: 50px; padding: 8px 16px;
          animation: badgePulse 2.5s infinite;
        }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }

        .hero-h1 {
          font-family: var(--font-h); font-weight: 900;
          font-size: clamp(36px, 11vw, 50px);
          line-height: 1.07; letter-spacing: -.03em;
          margin-top: 18px; color: var(--text);
        }
        .hero-h1 span { color: var(--accent); }
        .hero-sub { font-size: 15px; color: var(--text2); margin-top: 10px; line-height: 1.65; }

        .stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 10px; margin-top: 26px;
        }
        .stat {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 14px 8px; text-align: center;
        }
        .stat-num { font-family: var(--font-h); font-weight: 900; font-size: 22px; color: var(--accent); }
        .stat-lbl { font-size: 10px; color: var(--text3); margin-top: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }

        .product-frame {
          position: relative; margin-top: 24px;
          border-radius: 22px; overflow: hidden;
          border: 1.5px solid rgba(61,235,138,0.18);
          box-shadow: 0 0 50px rgba(61,235,138,0.07), 0 20px 40px rgba(0,0,0,0.5);
        }
        .product-frame img { width: 100%; display: block; }
        .product-frame::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 72px;
          background: linear-gradient(0deg, rgba(8,12,10,0.65) 0%, transparent 100%);
          pointer-events: none;
        }
        .product-tag {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          font-family: var(--font-h); font-weight: 900; font-size: 13px;
          background: var(--accent); color: #031a0d;
          padding: 6px 14px; border-radius: 50px;
        }
        .product-sale {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          font-family: var(--font-h); font-weight: 800; font-size: 12px;
          background: var(--red); color: #fff;
          padding: 5px 12px; border-radius: 50px;
        }

        .hero-prices {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 18px;
        }
        .price-old {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 16px; text-align: center;
        }
        .price-old-lbl { font-size: 11px; color: var(--text3); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
        .price-old-num {
          font-family: var(--font-h); font-weight: 800; font-size: 24px;
          color: var(--text3); text-decoration: line-through; margin-top: 4px;
        }
        .price-new {
          background: linear-gradient(135deg, rgba(61,235,138,0.12), rgba(0,201,106,0.07));
          border: 1.5px solid rgba(61,235,138,0.3);
          border-radius: var(--radius); padding: 16px; text-align: center;
        }
        .price-new-lbl { font-size: 11px; color: var(--accent); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .price-new-num { font-family: var(--font-h); font-weight: 900; font-size: 28px; color: var(--accent); margin-top: 4px; }
        .price-new-sub { font-size: 11px; font-weight: 700; color: var(--accent); opacity: .7; margin-top: 2px; }

        .hero-cta {
          width: 100%; margin-top: 14px; padding: 18px;
          font-family: var(--font-h); font-weight: 900; font-size: 18px; letter-spacing: .05em;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #031a0d; border: none; border-radius: var(--radius); cursor: pointer;
          transition: opacity .15s, transform .15s;
          box-shadow: 0 8px 32px rgba(61,235,138,0.2);
        }
        .hero-cta:hover { opacity: .9; transform: translateY(-2px); }

        /* ── GENERAL ── */
        .section { padding: 40px 20px; }
        .section-title {
          font-family: var(--font-h); font-weight: 900; font-size: 26px;
          letter-spacing: -.02em; color: var(--text); margin-bottom: 22px;
        }
        .section-title span { color: var(--accent); }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(61,235,138,0.15), transparent); }

        /* ── BEFORE/AFTER ── */
        .ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ba-card { border-radius: 16px; overflow: hidden; position: relative; border: 1px solid var(--border); }
        .ba-card img { width: 100%; display: block; }
        .ba-label {
          position: absolute; bottom: 8px; left: 8px;
          font-family: var(--font-h); font-weight: 800; font-size: 11px;
          padding: 4px 10px; border-radius: 50px;
          letter-spacing: .06em; text-transform: uppercase;
        }
        .ba-label.before { background: rgba(255,82,82,0.85); color: #fff; }
        .ba-label.after  { background: rgba(61,235,138,0.85); color: #031a0d; }

        /* ── BENEFITS ── */
        .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .benefit-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 18px 15px;
          transition: border-color .2s, transform .2s;
        }
        .benefit-card:hover { border-color: rgba(61,235,138,0.3); transform: translateY(-3px); }
        .benefit-icon { font-size: 26px; }
        .benefit-title { font-family: var(--font-h); font-weight: 800; font-size: 14px; color: var(--text); margin-top: 10px; }
        .benefit-desc { font-size: 12px; color: var(--text2); margin-top: 5px; line-height: 1.55; }

        /* ── EXPERT ── */
        .expert-wrap {
          border-radius: var(--radius); overflow: hidden;
          border: 1px solid rgba(61,235,138,0.15);
        }
        .expert-img img { width: 100%; display: block; max-height: 220px; object-fit: cover; }
        .expert-body {
          background: var(--card);
          border-top: 3px solid var(--accent);
          padding: 20px;
        }
        .expert-quote { font-size: 14px; color: var(--text2); line-height: 1.75; font-style: italic; }
        .expert-author { margin-top: 12px; font-family: var(--font-h); font-weight: 800; font-size: 13px; color: var(--accent); }

        /* ── STEPS ── */
        .steps { display: flex; flex-direction: column; gap: 12px; }
        .step {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 18px;
          transition: border-color .2s;
        }
        .step:hover { border-color: rgba(61,235,138,0.25); }
        .step-num { font-family: var(--font-h); font-weight: 900; font-size: 28px; color: var(--accent); opacity: .55; line-height: 1; flex-shrink: 0; width: 36px; }
        .step-title { font-family: var(--font-h); font-weight: 800; font-size: 16px; color: var(--text); }
        .step-desc { font-size: 13px; color: var(--text2); margin-top: 4px; line-height: 1.5; }

        /* ── TESTIMONIALS ── */
        .t-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .t-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 16px;
          transition: border-color .2s, transform .2s;
        }
        .t-card:hover { border-color: rgba(61,235,138,0.22); transform: translateY(-2px); }
        .t-text { font-size: 12px; color: var(--text2); line-height: 1.6; }
        .t-author { margin-top: 10px; font-family: var(--font-h); font-weight: 800; font-size: 11px; color: var(--accent); }

        /* ── PRICING ── */
        .pricing-card {
          background: linear-gradient(160deg, #041a0c, var(--card));
          border: 2px solid rgba(61,235,138,0.25);
          border-radius: 24px; padding: 28px 22px;
          box-shadow: 0 0 60px rgba(61,235,138,0.05);
        }
        .pricing-header { text-align: center; margin-bottom: 22px; }
        .pricing-old-price { font-family: var(--font-h); font-weight: 800; font-size: 20px; color: var(--text3); text-decoration: line-through; }
        .pricing-price { font-family: var(--font-h); font-weight: 900; font-size: 56px; color: var(--accent); line-height: 1; letter-spacing: -.04em; }
        .pricing-price-sub { font-size: 13px; color: var(--text2); margin-top: 5px; }
        .pricing-divider { height: 1px; background: var(--border); margin: 18px 0; }
        .pricing-item { display: flex; align-items: center; gap: 12px; padding: 9px 0; }
        .pricing-check {
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(61,235,138,0.12); border: 1px solid rgba(61,235,138,0.28);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 10px; color: var(--accent);
        }
        .pricing-item-text { font-size: 14px; font-weight: 600; color: var(--text); }

        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text2); padding: 5px 0; }
        .summary-total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--border); }
        .summary-total-lbl { font-family: var(--font-h); font-weight: 900; font-size: 20px; color: var(--text); }
        .summary-total-val { font-family: var(--font-h); font-weight: 900; font-size: 26px; color: var(--accent); }

        /* ── URGENCY ── */
        .urgency {
          background: linear-gradient(90deg, #180400, #0f0000);
          border-top: 1px solid rgba(255,82,82,0.14); border-bottom: 1px solid rgba(255,82,82,0.14);
          padding: 18px 24px; text-align: center;
        }
        .urgency-title { font-family: var(--font-h); font-weight: 900; font-size: 18px; color: var(--red); }
        .urgency-sub { font-size: 13px; color: var(--text2); margin-top: 4px; }

        /* ── FAQ ── */
        .faq-item {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); overflow: hidden; transition: border-color .2s;
          margin-bottom: 10px;
        }
        .faq-item.open { border-color: rgba(61,235,138,0.28); }
        .faq-q { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 18px; cursor: pointer; user-select: none; }
        .faq-q-text { font-family: var(--font-h); font-weight: 700; font-size: 15px; color: var(--text); }
        .faq-icon {
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(61,235,138,0.1); border: 1px solid rgba(61,235,138,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 14px; color: var(--accent); transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a { font-size: 13px; color: var(--text2); line-height: 1.7; max-height: 0; overflow: hidden; padding: 0 18px; transition: max-height .3s ease, padding .3s ease; }
        .faq-item.open .faq-a { max-height: 200px; padding: 0 18px 18px; }

        /* ── FORM ── */
        .form-section { padding: 44px 20px; background: linear-gradient(180deg, var(--bg) 0%, #031a0c 100%); }
        .form-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-h); font-weight: 800; font-size: 12px;
          letter-spacing: .07em; text-transform: uppercase;
          color: var(--accent); background: rgba(61,235,138,0.08);
          border: 1px solid rgba(61,235,138,0.2);
          border-radius: 50px; padding: 8px 16px; margin-bottom: 16px;
        }
        .form-title { font-family: var(--font-h); font-weight: 900; font-size: 36px; letter-spacing: -.03em; color: var(--text); margin-bottom: 6px; }
        .form-sub { font-size: 14px; color: var(--text2); margin-bottom: 24px; }

        .inp {
          width: 100%; background: var(--card); border: 1.5px solid var(--border);
          border-radius: var(--radius); padding: 16px 18px;
          font-family: var(--font-b); font-size: 15px; color: var(--text);
          transition: border-color .2s; outline: none;
        }
        .inp::placeholder { color: var(--text3); }
        .inp:focus { border-color: var(--accent); }

        .gift-label {
          display: flex; gap: 14px; align-items: flex-start;
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: var(--radius); padding: 16px; cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .gift-label.checked { border-color: rgba(61,235,138,0.4); background: rgba(61,235,138,0.05); }
        .gift-label input { accent-color: var(--accent); width: 18px; height: 18px; margin-top: 2px; }
        .gift-lbl-title { font-weight: 700; font-size: 15px; color: var(--text); }
        .gift-lbl-sub { font-size: 12px; color: var(--text2); margin-top: 2px; }

        .submit-btn {
          width: 100%; padding: 18px;
          font-family: var(--font-h); font-weight: 900; font-size: 20px; letter-spacing: .05em;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #031a0d; border: none; border-radius: var(--radius); cursor: pointer;
          transition: opacity .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 8px 32px rgba(61,235,138,0.18);
        }
        .submit-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(61,235,138,0.28); }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── SUCCESS ── */
        @keyframes scaleIn { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 48px 24px; animation: scaleIn .4s ease both; }
        .success-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(61,235,138,0.15), rgba(0,201,106,0.1));
          border: 2px solid rgba(61,235,138,0.35);
          display: flex; align-items: center; justify-content: center; font-size: 36px;
        }
        .success-title { font-family: var(--font-h); font-weight: 900; font-size: 28px; color: var(--text); margin-top: 20px; }
        .success-sub { font-size: 15px; color: var(--text2); margin-top: 8px; line-height: 1.6; }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .55s ease, transform .55s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      <div className="wrap">

        {/* ── POPUP ── */}
        {popup && (
          <div className="popup">
            <div className="popup-icon">🛒</div>
            <div>
              <div className="popup-text">{popup.text}</div>
              <div className="popup-name">{popup.name}</div>
            </div>
          </div>
        )}

        {/* ── NAV ── */}
        <nav className={`nav${navSolid ? " solid" : ""}`}>
          <span className="nav-logo">☀️ Zakačke 50kom</span>
          <button className="nav-cta" onClick={scrollToOrder}>NARUČI →</button>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-radial" />
          <div className="hero-radial2" />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="badge">
              <span className="badge-dot" />
              ☀️ Zaštita od sunca · 50 komada
            </div>

            <h1 className="hero-h1">
              Zakačke za<br />
              <span>zaštitnu</span><br />
              mrežu
            </h1>

            <p className="hero-sub">
              Postavi vlastitu zaštitu od sunca bez majstora i skupih tendi —
              brzo, jednostavno i višekratno.
            </p>

            <div className="stats">
              <div className="stat">
                <div className="stat-num">50</div>
                <div className="stat-lbl">Komada</div>
              </div>
              <div className="stat">
                <div className="stat-num">UV</div>
                <div className="stat-lbl">Otporno</div>
              </div>
              <div className="stat">
                <div className="stat-num">0</div>
                <div className="stat-lbl">Alata</div>
              </div>
            </div>

            <div className="product-frame">
              <span className="product-tag">25,00 KM</span>
              <span className="product-sale">-37%</span>
              <img src="https://i.imgur.com/elbYwKT.jpeg" alt="Zakačke za zaštitnu mrežu" />
            </div>

            <div className="hero-prices">
              <div className="price-old">
                <div className="price-old-lbl">Redovna cijena</div>
                <div className="price-old-num">39,90 KM</div>
              </div>
              <div className="price-new">
                <div className="price-new-lbl">Akcijska cijena</div>
                <div className="price-new-num">25,00 KM</div>
                <div className="price-new-sub">50 komada u setu</div>
              </div>
            </div>

            <button className="hero-cta" onClick={scrollToOrder}>
              NARUČI ODMAH →
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text3)", marginTop: "10px" }}>
              Plaćanje pouzećem · Dostava 2–4 radna dana
            </p>
          </div>
        </section>

        <div className="divider" />

        {/* ── PRIJE / POSLIJE ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">📸 Prije i <span>poslije</span></h2>
          <div className="ba-grid">
            <div className="ba-card">
              <img src="https://i.imgur.com/4KVzA61.jpeg" alt="Prije postavljanja mreže" />
              <span className="ba-label before">Prije</span>
            </div>
            <div className="ba-card">
              <img src="https://i.imgur.com/LcszNfN.png" alt="Poslije postavljanja mreže" />
              <span className="ba-label after">Poslije</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── BENEFITI ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">✅ Zašto <span>ove zakačke</span></h2>
          <div className="benefits-grid">
            {benefits.map((b) => (
              <div className="benefit-card" key={b.title}>
                <div className="benefit-icon">{b.icon}</div>
                <div className="benefit-title">{b.title}</div>
                <div className="benefit-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── EXPERT – VLASNIK KAFIĆA ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">☕ Vlasnik <span>kafića kaže</span></h2>
          <div className="expert-wrap">
            <div className="expert-img">
              <img src="https://i.imgur.com/hbJoZ1K.jpeg" alt="Vlasnik kafića Adis K." />
            </div>
            <div className="expert-body">
              <p className="expert-quote">
                "Umjesto skupe tende, sam sam postavio mrežu sa ovim zakačkama – brzo, jeftino i funkcionalno. Gosti su odmah primijetili razliku."
              </p>
              <div className="expert-author">— Adis K., vlasnik kafića, Sarajevo</div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── KAKO NARUČITI ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">⚡ Kako <span>naručiti</span></h2>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── TESTIMONIALS ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">💬 Kupci <span>kažu</span></h2>
          <div className="t-grid">
            {testimonials.map((t, i) => (
              <div className="t-card" key={i}>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">{t.author} · {t.city}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── PRICING ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">💰 Cijena <span>pakovanja</span></h2>
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="pricing-old-price">39,90 KM</div>
              <div className="pricing-price">25,00</div>
              <div className="pricing-price-sub">KM · Plaćanje pouzećem</div>
            </div>
            <div className="pricing-divider" />
            {included.map((item) => (
              <div className="pricing-item" key={item}>
                <div className="pricing-check">✓</div>
                <span className="pricing-item-text">{item}</span>
              </div>
            ))}
            <div className="pricing-divider" />
            <div className="summary-row"><span>Cijena</span><span>25,00 KM</span></div>
            <div className="summary-row"><span>Dostava</span><span>9,00 KM</span></div>
            <div className="summary-total">
              <span className="summary-total-lbl">UKUPNO</span>
              <span className="summary-total-val">34,00 KM</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── URGENCY ── */}
        <div className="urgency reveal">
          <div className="urgency-title">⏳ Akcija traje dok ima zaliha</div>
          <div className="urgency-sub">25,00 KM umjesto 39,90 KM — trenutna akcijska cijena.</div>
        </div>

        <div className="divider" />

        {/* ── FAQ ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">❓ Česta <span>pitanja</span></h2>
          {faqs.map((item, i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}>
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="faq-q-text">{item.q}</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </section>

        <div className="divider" />

        {/* ── ORDER FORM ── */}
        <section ref={orderRef} className="form-section">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✅</div>
              <div className="success-title">Narudžba primljena!</div>
              <p className="success-sub">
                Hvala! Naš tim će te uskoro kontaktirati radi potvrde. Dostava 2–4 radna dana, plaćanje pouzećem.
              </p>
            </div>
          ) : (
            <>
              <div className="form-badge">☀️ Zakačke za zaštitnu mrežu – 50 kom</div>
              <h2 className="form-title">Naruči odmah</h2>
              <p className="form-sub">Plaćanje pouzećem · Bez registracije</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input className="inp" name="ime"       autoComplete="off" placeholder="Ime i prezime" />
                <input className="inp" name="telefon"   autoComplete="off" placeholder="Broj telefona" />
                <input className="inp" name="adresa"    autoComplete="off" placeholder="Adresa i mjesto" />
                <input className="inp" name="postanski" autoComplete="off" placeholder="Poštanski broj" />

                <label className={`gift-label${giftPack ? " checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={giftPack}
                    onChange={(e) => setGiftPack(e.target.checked)}
                  />
                  <div>
                    <div className="gift-lbl-title">Poklon pakovanje</div>
                    <div className="gift-lbl-sub">+ 5,00 KM</div>
                  </div>
                </label>

                <div style={{
                  background: "var(--card)",
                  border: "1.5px solid rgba(61,235,138,0.25)",
                  borderRadius: "var(--radius)",
                  padding: "18px",
                }}>
                  <div className="summary-row"><span>Zakačke 50 komada</span><span>25,00 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>9,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "var(--accent)" }}>
                      <span>Poklon pakovanje</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "NARUČI ODMAH →"}
                </button>
                <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text3)" }}>
                  Plaćanje tek pri preuzimanju paketa
                </p>
              </form>
            </>
          )}
        </section>

      </div>
    </>
  );
}