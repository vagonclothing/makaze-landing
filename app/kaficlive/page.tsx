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
      product_price: 0,
      total: 0,
      status: "novo",
      source: "kafic-live",
    };
    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("orders").insert(order);
    if (error) { alert("Greška pri slanju. Pokušajte ponovo."); setLoading(false); return; }
    if (window.fbq) { window.fbq("track", "Lead", { content_name: order.product_name, currency: "BAM" }); }
    setSent(true);
    setLoading(false);
  }

  const features = [
    { icon: "📱", title: "Konobar na telefonu", desc: "Odabir stola, artikala i napomene za svaki komad. Narudžba stiže na šank za sekundu. Radi na svakom Android i iPhone uređaju." },
    { icon: "🖥️", title: "Šank ekran uživo", desc: "Svaka nova narudžba se pojavljuje automatski sa zvučnom notifikacijom. Status: Novo → U pripremi → Gotovo. Bez osvježavanja stranice." },
    { icon: "📊", title: "Vi vidite sve u realnom vremenu", desc: "Promet po satu, najprodavaniji artikli, ranking stolova — s telefona, iz auta, od kuće. Uvijek uživo." },
    { icon: "💳", title: "Naplata jednim klikom", desc: "Konobar vidi sve narudžbe za stol i ukupnu cifru. Klikom označava plaćeno — brže, bez grešaka." },
    { icon: "📝", title: "Napomene po komadu", desc: "Dva cappuccina? Jedan bez šećera, drugi sa mlijekom. Svaki artikal ima svoju napomenu vidljivu odmah na šanku." },
    { icon: "⚙️", title: "Vaš meni, vaše cijene", desc: "Vi dodajete, mijenjate i brišete artikle i kategorije. Promjena je vidljiva svim konobarima odmah." },
  ];

  const steps = [
    { num: "1", title: "Konobar naručuje", desc: "Odabire stol i artikle na telefonu, dodaje napomene i šalje jednim klikom." },
    { num: "2", title: "Šank vidi odmah", desc: "Narudžba se pojavljuje na monitoru sa zvukom. Nema čekanja, nema papira." },
    { num: "3", title: "Priprema i isporuka", desc: "Šank označava status. Kad je gotovo — konobar zna da može ponijeti." },
    { num: "4", title: "Naplata i statistike", desc: "Konobar naplaćuje po stolu, vi pratite promet u realnom vremenu." },
  ];

  const testimonials = [
    "Od kad koristimo KafićLive, konobar ne trči do šanka svaki put. Sve ide brže. — Emir T., Sarajevo",
    "Vidim promet u realnom vremenu s telefona. Znao sam tačno koji stol nosi najviše. — Selma K., Tuzla",
    "Osoblje se naučilo za 15 minuta. Nema komplikacija, radi savršeno. — Adnan M., Banja Luka",
    "Narudžbe više ne gube se ni ne zaboravljaju. Gosti su zadovoljniji. — Lejla P., Mostar",
  ];

  const faqs = [
    { q: "Da li trebam poseban uređaj?", a: "Ne. Radi na svakom pametnom telefonu, tabletu i računaru — bilo koji pretraživač je dovoljan." },
    { q: "Da li ovo zamjenjuje fiskalnu kasu?", a: "Ne. KafićLive je pomoćni alat za efikasnost — ide uz vašu postojeću fiskalnu kasu, ne zamjenjuje je." },
    { q: "Koliko stolova može imati kafić?", a: "Neograničeno. Vi podešavate broj stolova u admin panelu po potrebi." },
    { q: "Mogu li mijenjati meni i cijene?", a: "Da, admin može dodavati, mijenjati i brisati artikle i kategorije u sekundi. Promjena je vidljiva odmah." },
    { q: "Šta ako nemam iskustva s tehnologijom?", a: "Instaliramo sve mi i obučimo vaše osoblje. Potrebno je svega 15-30 minuta." },
    { q: "Ima li mjesečnih troškova?", a: "Kontaktirajte nas za detalje — prilagođavamo ponudu svakom kafiću." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        :root {
          --amber: #E8881A; --amber-l: #F5A040;
          --leaf: #2B7A50; --leaf-l: #3D9A66;
          --dark: #0A0502; --dark2: #140A03; --dark3: #1E1008;
          --cream: #F5EDD8; --steam: #9E8672;
        }
        .kl-wrap { font-family: 'DM Sans', sans-serif; background: var(--dark); color: white; min-height: 100vh; }
        .kl-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 1rem 5%; display: flex; align-items: center; justify-content: space-between; background: rgba(10,5,2,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .kl-logo { display: flex; align-items: center; gap: 0.5rem; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.3rem; color: white; }
        .kl-logo em { font-style: normal; color: var(--amber); }
        .kl-nav-btn { background: linear-gradient(135deg, var(--leaf), var(--leaf-l)); color: white; padding: 0.6rem 1.4rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; border: none; cursor: pointer; }
        .kl-hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 8rem 5% 5rem; }
        .kl-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(232,136,26,0.13) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(43,122,80,0.1) 0%, transparent 50%); }
        .kl-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%); }
        .kl-hero-inner { max-width: 700px; text-align: center; position: relative; z-index: 2; }
        .kl-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(232,136,26,0.1); border: 1px solid rgba(232,136,26,0.25); border-radius: 999px; padding: 0.4rem 1rem; font-size: 0.78rem; font-weight: 700; color: var(--amber); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 1.75rem; }
        .kl-badge-dot { width: 6px; height: 6px; background: var(--amber); border-radius: 50%; animation: kl-pulse 2s infinite; }
        .kl-h1 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: clamp(2.4rem, 6vw, 4.2rem); line-height: 1.06; letter-spacing: -0.03em; margin-bottom: 1.4rem; }
        .kl-h1 em { font-style: normal; color: var(--amber); }
        .kl-hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.55); line-height: 1.75; max-width: 500px; margin: 0 auto 2.5rem; }
        .kl-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .kl-btn-primary { background: linear-gradient(135deg, var(--leaf), var(--leaf-l)); color: white; padding: 0.9rem 2.2rem; border-radius: 14px; font-weight: 700; font-size: 1rem; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
        .kl-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(43,122,80,0.4); }
        .kl-btn-sec { background: rgba(255,255,255,0.07); color: white; padding: 0.9rem 2.2rem; border-radius: 14px; font-weight: 600; font-size: 1rem; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; }
        .kl-stats { display: flex; gap: 3rem; justify-content: center; margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap; }
        .kl-stat-num { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 2.2rem; color: var(--amber); }
        .kl-stat-label { font-size: 0.8rem; color: var(--steam); margin-top: 0.2rem; }
        .kl-section { padding: 5rem 5%; }
        .kl-section-label { font-size: 0.77rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--amber); margin-bottom: 0.875rem; }
        .kl-section-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: clamp(1.75rem, 4vw, 2.6rem); line-height: 1.15; margin-bottom: 1rem; }
        .kl-section-sub { color: rgba(255,255,255,0.45); font-size: 0.95rem; line-height: 1.75; max-width: 480px; }

        /* SCREENS */
        .kl-screens { padding: 5rem 5%; }
        .kl-screens-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 1.5rem; align-items: center; max-width: 960px; margin: 3rem auto 0; }
        .kl-screen { background: #1C0E06; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
        .kl-screen-hd { background: #1A0C05; padding: 0.7rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
        .kl-screen-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; color: var(--steam); text-transform: uppercase; }
        .kl-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
        .kl-screen-body { padding: 0.875rem; }
        .kl-tgrid { display: grid; grid-template-columns: repeat(5,1fr); gap: 0.3rem; margin-bottom: 0.6rem; }
        .kl-tbtn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 0.35rem 0; font-size: 0.68rem; font-weight: 700; color: var(--steam); text-align: center; }
        .kl-tbtn.a { background: var(--amber); color: white; border-color: transparent; }
        .kl-prod { display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.5rem; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 0.3rem; border: 1px solid rgba(255,255,255,0.05); }
        .kl-prod.ic { background: rgba(232,136,26,0.08); border-color: rgba(232,136,26,0.22); }
        .kl-pname { font-size: 0.68rem; font-weight: 500; }
        .kl-pprice { font-size: 0.62rem; color: var(--amber); font-weight: 700; }
        .kl-qbtn { width: 18px; height: 18px; border-radius: 5px; border: none; font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .kl-send { width: 100%; background: linear-gradient(135deg,var(--leaf),var(--leaf-l)); border: none; border-radius: 9px; padding: 0.55rem; color: white; font-weight: 700; font-size: 0.72rem; margin-top: 0.6rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .kl-ocard { border-radius: 12px; padding: 0.7rem; margin-bottom: 0.5rem; border-left: 3px solid; }
        .kl-ocard.novo { border-color: #DC2626; background: rgba(220,38,38,0.07); }
        .kl-ocard.prep { border-color: #D97706; background: rgba(217,119,6,0.07); }
        .kl-ocard.done { border-color: #16A34A; background: rgba(22,163,74,0.07); }
        .kl-otable { font-family: 'Outfit',sans-serif; font-weight: 800; font-size: 1rem; }
        .kl-sbadge { font-size: 0.58rem; font-weight: 800; padding: 0.12rem 0.38rem; border-radius: 4px; letter-spacing: 0.05em; }
        .sb-novo { background: rgba(220,38,38,0.15); color: #F87171; }
        .sb-prep { background: rgba(217,119,6,0.15); color: #FBBF24; }
        .sb-done { background: rgba(22,163,74,0.15); color: #4ADE80; }
        .kl-oitem { font-size: 0.68rem; color: rgba(255,255,255,0.65); margin-bottom: 0.15rem; }
        .kl-oitem span { color: var(--amber); font-weight: 700; }
        .kl-oitem em { color: #FBBF24; font-style: italic; font-size: 0.62rem; }
        .kl-abtn { width: 100%; border: none; border-radius: 7px; padding: 0.42rem; font-size: 0.68rem; font-weight: 700; margin-top: 0.4rem; cursor: pointer; }
        .kl-abtn.amber { background: linear-gradient(135deg,var(--amber),var(--amber-l)); color: white; }
        .kl-abtn.green { background: linear-gradient(135deg,var(--leaf),var(--leaf-l)); color: white; }
        .kl-sgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; margin-bottom: 0.6rem; }
        .kl-scard { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 0.5rem; }
        .kl-snum { font-family: 'Outfit',sans-serif; font-weight: 800; font-size: 1.05rem; }
        .kl-slabel { font-size: 0.58rem; color: var(--steam); margin-top: 0.1rem; }

        /* ADMIN DEEP SECTION */
        .kl-admin-section { padding: 5rem 5%; background: linear-gradient(180deg, transparent, rgba(43,122,80,0.04), transparent); }
        .kl-admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; max-width: 1000px; margin: 3rem auto 0; }
        .kl-admin-screen { background: #F4EFE8; border-radius: 20px; overflow: hidden; border: 1px solid #E5DDD3; }
        .kl-admin-hd { background: white; padding: 0.875rem 1.25rem; border-bottom: 1px solid #E5DDD3; display: flex; align-items: center; gap: 0.5rem; }
        .kl-admin-hd-title { font-family: 'Outfit',sans-serif; font-weight: 700; font-size: 0.85rem; color: #1A0A03; }
        .kl-admin-body { padding: 1rem; }
        .kl-admin-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; margin-bottom: 1rem; }
        .kl-admin-stat { background: white; border-radius: 12px; padding: 0.875rem; border: 1px solid #E5DDD3; }
        .kl-admin-stat-num { font-family: 'Outfit',sans-serif; font-weight: 800; font-size: 1.5rem; color: #1A0A03; }
        .kl-admin-stat-label { font-size: 0.7rem; color: #9E8672; margin-top: 0.2rem; }
        .kl-admin-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #F0EAE0; font-size: 0.8rem; color: #3D2810; }
        .kl-admin-badge { font-size: 0.62rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px; letter-spacing: 0.04em; }
        .ab-novo { background: rgba(220,38,38,0.1); color: #DC2626; }
        .ab-gotovo { background: rgba(22,163,74,0.1); color: #16A34A; }
        .ab-naplaceno { background: rgba(37,99,235,0.1); color: #2563EB; }

        /* NAPLATA SCREEN */
        .kl-pay-screen { background: #1C0E06; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
        .kl-pay-table { border-radius: 12px; overflow: hidden; margin-bottom: 0.5rem; border: 1px solid rgba(255,255,255,0.08); }
        .kl-pay-table-hd { background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); padding: 0.6rem 0.75rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .kl-pay-table-num { font-family: 'Outfit',sans-serif; font-weight: 800; font-size: 0.95rem; color: #60A5FA; }
        .kl-pay-table-total { font-family: 'Outfit',sans-serif; font-weight: 800; font-size: 1rem; color: #60A5FA; }
        .kl-pay-detail { background: rgba(255,255,255,0.03); padding: 0.6rem 0.75rem; }
        .kl-pay-item { display: flex; justify-content: space-between; font-size: 0.68rem; color: rgba(255,255,255,0.65); margin-bottom: 0.2rem; }
        .kl-pay-item span { color: var(--amber); font-weight: 700; }
        .kl-pay-total-row { display: flex; justify-content: space-between; padding-top: 0.4rem; margin-top: 0.2rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; font-weight: 700; }
        .kl-pay-btn { width: 100%; margin-top: 0.5rem; background: linear-gradient(135deg,#1D4ED8,#2563EB); border: none; border-radius: 8px; padding: 0.55rem; color: white; font-weight: 700; font-size: 0.72rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.35rem; }
        .kl-paid-table { border-radius: 12px; border: 1px solid rgba(37,99,235,0.15); padding: 0.6rem 0.75rem; display: flex; justify-content: space-between; align-items: center; opacity: 0.5; }
        .kl-paid-label { font-size: 0.65rem; color: #60A5FA; font-weight: 700; }

        /* FEATURES */
        .kl-feat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.25rem; margin-top: 3rem; }
        .kl-feat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 1.75rem; transition: all 0.25s; }
        .kl-feat:hover { background: rgba(255,255,255,0.05); border-color: rgba(232,136,26,0.2); transform: translateY(-4px); }
        .kl-feat-icon { font-size: 1.6rem; margin-bottom: 1rem; }
        .kl-feat-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; }
        .kl-feat-desc { font-size: 0.86rem; color: rgba(255,255,255,0.45); line-height: 1.65; }
        .kl-steps { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .kl-step { text-align: center; }
        .kl-step-num { width: 54px; height: 54px; border-radius: 50%; background: #1E1008; border: 2px solid rgba(232,136,26,0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.1rem; font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.1rem; color: var(--amber); }
        .kl-step-title { font-weight: 700; font-size: 0.93rem; margin-bottom: 0.4rem; }
        .kl-step-desc { font-size: 0.82rem; color: rgba(255,255,255,0.4); line-height: 1.65; }
        .kl-testi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; margin-top: 2.5rem; }
        .kl-testi { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.25rem; font-size: 0.875rem; color: rgba(255,255,255,0.55); line-height: 1.7; }
        .kl-faq-grid { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2.5rem; }
        .kl-faq { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.25rem; }
        .kl-faq-q { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--cream); }
        .kl-faq-a { font-size: 0.85rem; color: rgba(255,255,255,0.45); line-height: 1.65; }
        .kl-form-section { padding: 5rem 5%; position: relative; }
        .kl-form-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(43,122,80,0.06) 0%, transparent 60%); }
        .kl-form-wrap { max-width: 540px; margin: 0 auto; position: relative; z-index: 1; }
        .kl-form-card { background: rgba(20,10,3,0.85); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 2.5rem; backdrop-filter: blur(20px); }
        .kl-form-label { display: block; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: var(--steam); margin-bottom: 0.4rem; }
        .kl-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.85rem 1rem; color: white; font-family: 'DM Sans', sans-serif; font-size: 0.92rem; outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
        .kl-input:focus { border-color: var(--amber); background: rgba(232,136,26,0.06); }
        .kl-input::placeholder { color: rgba(158,134,114,0.5); }
        .kl-input option { background: #1A0C05; }
        .kl-form-group { margin-bottom: 1rem; }
        .kl-submit { width: 100%; padding: 1rem; border-radius: 14px; border: none; background: linear-gradient(135deg, var(--leaf), var(--leaf-l)); color: white; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; margin-top: 0.5rem; }
        .kl-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(43,122,80,0.4); }
        .kl-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .kl-promise { text-align: center; margin-top: 0.875rem; font-size: 0.78rem; color: var(--steam); }
        .kl-footer { padding: 2.5rem 5%; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .kl-footer-copy { font-size: 0.8rem; color: var(--steam); }
        @keyframes kl-pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);} }
        @media(max-width: 768px) {
          .kl-screens-grid { grid-template-columns: 1fr; max-width: 320px; }
          .kl-screens-grid .kl-screen:first-child, .kl-screens-grid .kl-screen:last-child { display: none; }
          .kl-admin-grid { grid-template-columns: 1fr; }
          .kl-stats { gap: 1.5rem; }
        }
      `}</style>

      <div className="kl-wrap">
        {/* NAV */}
        <nav className="kl-nav">
          <div className="kl-logo">☕ Kafić<em>Live</em></div>
          <button className="kl-nav-btn" onClick={scrollToOrder}>Zatražite demo →</button>
        </nav>

        {/* HERO */}
        <section className="kl-hero">
          <div className="kl-hero-bg" />
          <div className="kl-grid-bg" />
          <div className="kl-hero-inner">
            <div className="kl-badge"><span className="kl-badge-dot" /> Novo rješenje za ugostiteljstvo</div>
            <h1 className="kl-h1">Vaš kafić,<br /><em>pod kontrolom</em><br />u realnom vremenu.</h1>
            <p className="kl-hero-sub">Konobar naručuje na telefonu. Šank vidi odmah. Vi pratite promet u svakom trenutku. Bez papira, bez vikanja, bez gužve.</p>
            <div className="kl-btns">
              <button className="kl-btn-primary" onClick={scrollToOrder}>📞 Želim demo &rarr;</button>
              <a className="kl-btn-sec" href="#kako-radi">▶ Kako radi</a>
            </div>
            <div className="kl-stats">
              <div style={{ textAlign: "center" }}><div className="kl-stat-num">3x</div><div className="kl-stat-label">brže uzimanje narudžbi</div></div>
              <div style={{ textAlign: "center" }}><div className="kl-stat-num">0</div><div className="kl-stat-label">grešaka u narudžbama</div></div>
              <div style={{ textAlign: "center" }}><div className="kl-stat-num">24/7</div><div className="kl-stat-label">uvid u promet</div></div>
            </div>
          </div>
        </section>

        {/* 3 SCREENS */}
        <section className="kl-screens">
          <div style={{ textAlign: "center" }}>
            <p className="kl-section-label">Tri ekrana, jedna platforma</p>
            <h2 className="kl-section-title" style={{ textAlign: "center" }}>Svako radi samo svoj posao.</h2>
          </div>
          <div className="kl-screens-grid">
            {/* Konobar */}
            <div className="kl-screen">
              <div className="kl-screen-hd">
                <span style={{ fontSize: "0.8rem" }}>📱</span>
                <span className="kl-screen-title">Konobar</span>
                <span className="kl-dot" style={{ background: "#16A34A" }} />
              </div>
              <div className="kl-screen-body">
                <div className="kl-tgrid">
                  {[1,2,3,4,5].map(n => <div key={n} className={`kl-tbtn${n===3?" a":""}`}>{n}</div>)}
                </div>
                <div className="kl-prod ic">
                  <span style={{ fontSize: "1.1rem" }}>☕</span>
                  <div style={{ flex: 1 }}><div className="kl-pname">Cappuccino</div><div className="kl-pprice">2,50 KM</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <button className="kl-qbtn" style={{ background: "rgba(220,38,38,0.2)", color: "#F87171" }}>−</button>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, minWidth: 12, textAlign: "center" }}>2</span>
                    <button className="kl-qbtn" style={{ background: "#2B7A50", color: "white" }}>+</button>
                  </div>
                </div>
                <div className="kl-prod">
                  <span style={{ fontSize: "1.1rem" }}>🥤</span>
                  <div style={{ flex: 1 }}><div className="kl-pname">Cola 0.33</div><div className="kl-pprice">2,00 KM</div></div>
                  <button className="kl-qbtn" style={{ background: "#2B7A50", color: "white" }}>+</button>
                </div>
                <button className="kl-send"><span>📤 Pošalji</span><span style={{ fontFamily: "Outfit", fontWeight: 800 }}>5,00 KM</span></button>
              </div>
            </div>

            {/* Šank */}
            <div className="kl-screen">
              <div className="kl-screen-hd">
                <span style={{ fontSize: "0.8rem" }}>🖥️</span>
                <span className="kl-screen-title">Šank ekran · 10:42:17</span>
                <span className="kl-dot" style={{ background: "#16A34A", animation: "kl-pulse 2s infinite" }} />
              </div>
              <div className="kl-screen-body">
                <div className="kl-ocard novo">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span className="kl-otable" style={{ color: "#F87171" }}>Sto 5</span>
                    <span className="kl-sbadge sb-novo">NOVO</span>
                  </div>
                  <div className="kl-oitem"><span>2x</span> Cappuccino <em>— bez šećera</em></div>
                  <div className="kl-oitem"><span>1x</span> Cola 0.33</div>
                  <button className="kl-abtn amber">Pokreni ▶</button>
                </div>
                <div className="kl-ocard prep">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span className="kl-otable" style={{ color: "#FBBF24" }}>Sto 3</span>
                    <span className="kl-sbadge sb-prep">U PRIPREMI</span>
                  </div>
                  <div className="kl-oitem"><span>1x</span> Espresso</div>
                  <div className="kl-oitem"><span>1x</span> Voda negazirana</div>
                  <button className="kl-abtn green">Gotovo ✓</button>
                </div>
                <div className="kl-ocard done">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="kl-otable" style={{ color: "#4ADE80" }}>Sto 1</span>
                    <span className="kl-sbadge sb-done">GOTOVO</span>
                  </div>
                  <div className="kl-oitem" style={{ marginTop: "0.3rem" }}><span>2x</span> Pivo 0.5</div>
                </div>
              </div>
            </div>

            {/* Admin mini */}
            <div className="kl-screen">
              <div className="kl-screen-hd">
                <span style={{ fontSize: "0.8rem" }}>📊</span>
                <span className="kl-screen-title">Admin</span>
                <span className="kl-dot" style={{ background: "#E8881A" }} />
              </div>
              <div className="kl-screen-body">
                <div className="kl-sgrid">
                  <div className="kl-scard"><div className="kl-snum" style={{ color: "#E8881A" }}>24</div><div className="kl-slabel">Narudžbe danas</div></div>
                  <div className="kl-scard"><div className="kl-snum" style={{ color: "#3D9A66" }}>432 KM</div><div className="kl-slabel">Promet danas</div></div>
                  <div className="kl-scard"><div className="kl-snum" style={{ color: "#60A5FA" }}>6</div><div className="kl-slabel">Otvoreni stolovi</div></div>
                  <div className="kl-scard"><div className="kl-snum" style={{ color: "#4ADE80" }}>18</div><div className="kl-slabel">Završene</div></div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "0.5rem", height: 58, position: "relative", overflow: "hidden" }}>
                  <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
                    <polyline points="0,45 30,38 60,30 90,20 120,15 150,10 180,8 200,6" fill="none" stroke="#2B7A50" strokeWidth="2" />
                    <polyline points="0,45 30,38 60,30 90,20 120,15 150,10 180,8 200,6 200,50 0,50" fill="rgba(43,122,80,0.15)" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN DEEP SECTION — za vlasnike */}
        <section className="kl-admin-section">
          <div style={{ textAlign: "center" }}>
            <p className="kl-section-label">Za vlasnike kafića</p>
            <h2 className="kl-section-title" style={{ textAlign: "center" }}>Sve što se dešava u vašem kafiću<br /><em style={{ fontStyle: "normal", color: "var(--amber)" }}>vidite u realnom vremenu.</em></h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", textAlign: "center", maxWidth: 520, margin: "0 auto" }}>Nije bitno jeste li u kafiću, kući ili na putu — admin dashboard vam daje potpunu kontrolu.</p>
          </div>

          <div className="kl-admin-grid">
            {/* Admin dashboard mockup — light theme */}
            <div className="kl-admin-screen">
              <div className="kl-admin-hd">
                <span style={{ fontSize: "1rem" }}>☕</span>
                <span className="kl-admin-hd-title">KafićLive · Admin dashboard</span>
                <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
              </div>
              <div className="kl-admin-body">
                <div className="kl-admin-stat-grid">
                  <div className="kl-admin-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(43,122,80,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>📈</div>
                      <span style={{ fontSize: "0.68rem", color: "#9E8672", fontWeight: 600 }}>Narudžbe danas</span>
                    </div>
                    <div className="kl-admin-stat-num">24</div>
                  </div>
                  <div className="kl-admin-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(232,136,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>💰</div>
                      <span style={{ fontSize: "0.68rem", color: "#9E8672", fontWeight: 600 }}>Dnevni promet</span>
                    </div>
                    <div className="kl-admin-stat-num" style={{ color: "#E8881A" }}>432 KM</div>
                  </div>
                  <div className="kl-admin-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>🪑</div>
                      <span style={{ fontSize: "0.68rem", color: "#9E8672", fontWeight: 600 }}>Otvoreni stolovi</span>
                    </div>
                    <div className="kl-admin-stat-num" style={{ color: "#2563EB" }}>6</div>
                  </div>
                  <div className="kl-admin-stat">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(22,163,74,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>✅</div>
                      <span style={{ fontSize: "0.68rem", color: "#9E8672", fontWeight: 600 }}>Završene</span>
                    </div>
                    <div className="kl-admin-stat-num" style={{ color: "#16A34A" }}>18</div>
                  </div>
                </div>
                {/* Chart */}
                <div style={{ background: "white", borderRadius: 12, padding: "0.75rem", marginBottom: "0.75rem", border: "1px solid #E5DDD3" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1A0A03", marginBottom: "0.5rem" }}>Promet po satu (danas)</div>
                  <svg width="100%" height="60" viewBox="0 0 300 60">
                    <polyline points="0,55 30,50 60,42 90,35 120,25 150,18 180,15 210,10 240,12 270,8 300,6" fill="none" stroke="#2B7A50" strokeWidth="2.5" strokeLinecap="round" />
                    <polyline points="0,55 30,50 60,42 90,35 120,25 150,18 180,15 210,10 240,12 270,8 300,6 300,60 0,60" fill="rgba(43,122,80,0.08)" stroke="none" />
                  </svg>
                </div>
                {/* Top products */}
                <div style={{ background: "white", borderRadius: 12, padding: "0.75rem", border: "1px solid #E5DDD3" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1A0A03", marginBottom: "0.5rem" }}>🏆 Najprodavaniji</div>
                  {[["🥇 Cappuccino", 12], ["🥈 Espresso", 9], ["🥉 Cola 0.33", 7], ["4. Pivo 0.5", 6]].map(([n, v]) => (
                    <div key={String(n)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0", borderBottom: "1px solid #F0EAE0" }}>
                      <span style={{ fontSize: "0.75rem", color: "#3D2810" }}>{n}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: Math.round(Number(v) / 12 * 60), height: 4, background: "linear-gradient(90deg,#2B7A50,#3D9A66)", borderRadius: 2 }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#E8881A", fontFamily: "Outfit" }}>{v}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ranking stolova + naplata */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Ranking stolova */}
              <div className="kl-admin-screen">
                <div className="kl-admin-hd">
                  <span style={{ fontSize: "1rem" }}>🏆</span>
                  <span className="kl-admin-hd-title">Ranking stolova po prometu</span>
                </div>
                <div className="kl-admin-body">
                  {[
                    { sto: 5, km: 87.50, pct: 100, medal: "🥇" },
                    { sto: 2, km: 64.00, pct: 73, medal: "🥈" },
                    { sto: 8, km: 51.50, pct: 59, medal: "🥉" },
                    { sto: 3, km: 38.00, pct: 43, medal: "4." },
                    { sto: 7, km: 22.00, pct: 25, medal: "5." },
                  ].map(r => (
                    <div key={r.sto} style={{ marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.9rem", minWidth: 24 }}>{r.medal}</span>
                          <span style={{ fontWeight: 600, color: "#1A0A03", fontSize: "0.85rem" }}>Sto {r.sto}</span>
                        </div>
                        <span style={{ fontFamily: "Outfit", fontWeight: 800, color: "#E8881A", fontSize: "0.88rem" }}>{r.km.toFixed(2)} KM</span>
                      </div>
                      <div style={{ height: 6, background: "#F0EAE0", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${r.pct}%`, background: r.medal === "🥇" ? "linear-gradient(90deg,#E8881A,#F5A040)" : r.medal === "🥈" ? "linear-gradient(90deg,#9CA3AF,#D1D5DB)" : r.medal === "🥉" ? "linear-gradient(90deg,#92400E,#B45309)" : "linear-gradient(90deg,#2B7A50,#3D9A66)", borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Naplata po stolu */}
              <div className="kl-pay-screen">
                <div className="kl-screen-hd">
                  <span style={{ fontSize: "0.8rem" }}>💳</span>
                  <span className="kl-screen-title">Naplata po stolu</span>
                  <span className="kl-dot" style={{ background: "#2563EB" }} />
                </div>
                <div className="kl-screen-body">
                  <p style={{ fontSize: "0.62rem", color: "var(--steam)", marginBottom: "0.6rem", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>Stolovi za naplatu</p>

                  {/* Sto 5 — otvoren, detalji */}
                  <div className="kl-pay-table" style={{ marginBottom: "0.5rem" }}>
                    <div className="kl-pay-table-hd">
                      <span className="kl-pay-table-num">Sto 5</span>
                      <span className="kl-pay-table-total">21,50 KM ▲</span>
                    </div>
                    <div className="kl-pay-detail">
                      <div className="kl-pay-item"><span>2x</span> Cappuccino <span style={{ marginLeft: "auto", color: "var(--steam)" }}>5,00 KM</span></div>
                      <div className="kl-pay-item"><span>1x</span> Cola 0.33 <span style={{ marginLeft: "auto", color: "var(--steam)" }}>2,00 KM</span></div>
                      <div className="kl-pay-item"><span>3x</span> Pivo 0.5 <span style={{ marginLeft: "auto", color: "var(--steam)" }}>9,00 KM</span></div>
                      <div className="kl-pay-item"><span>2x</span> Rakija <span style={{ marginLeft: "auto", color: "var(--steam)" }}>5,00 KM</span></div>
                      <div className="kl-pay-total-row">
                        <span style={{ color: "var(--cream)" }}>UKUPNO</span>
                        <span style={{ color: "#60A5FA", fontFamily: "Outfit" }}>21,50 KM</span>
                      </div>
                      <button className="kl-pay-btn">💳 Plaćeno — 21,50 KM ✓</button>
                    </div>
                  </div>

                  {/* Sto 3 — collapsed */}
                  <div className="kl-pay-table" style={{ marginBottom: "0.5rem" }}>
                    <div className="kl-pay-table-hd" style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}>
                      <span className="kl-pay-table-num" style={{ color: "#93C5FD" }}>Sto 3</span>
                      <span className="kl-pay-table-total" style={{ color: "#93C5FD" }}>14,00 KM ▼</span>
                    </div>
                  </div>

                  {/* Sto 1 — naplaćen */}
                  <div className="kl-paid-table">
                    <div>
                      <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "0.88rem", color: "#60A5FA" }}>Sto 1</span>
                      <div className="kl-paid-label">NAPLAĆENO ✓</div>
                    </div>
                    <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "0.82rem", color: "#60A5FA" }}>32,00 KM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="kl-section" id="kako-radi" style={{ background: "linear-gradient(180deg,transparent,rgba(232,136,26,0.04),transparent)" }}>
          <p className="kl-section-label">Zašto KafićLive</p>
          <h2 className="kl-section-title">Sve što vam treba.<br />Ništa što vam smeta.</h2>
          <p className="kl-section-sub">Dizajnirano za kafiće koji žele raditi brže i pametnije — bez skupih POS sistema i komplikovane obuke.</p>
          <div className="kl-feat-grid">
            {features.map(f => (
              <div key={f.title} className="kl-feat">
                <div className="kl-feat-icon">{f.icon}</div>
                <div className="kl-feat-title">{f.title}</div>
                <div className="kl-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section className="kl-section">
          <div style={{ textAlign: "center" }}>
            <p className="kl-section-label">Proces</p>
            <h2 className="kl-section-title" style={{ textAlign: "center" }}>Od narudžbe do naplate<br />za manje od minute.</h2>
          </div>
          <div className="kl-steps">
            {steps.map(s => (
              <div key={s.num} className="kl-step">
                <div className="kl-step-num">{s.num}</div>
                <div className="kl-step-title">{s.title}</div>
                <div className="kl-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="kl-section">
          <p className="kl-section-label">Utisci</p>
          <h2 className="kl-section-title">Vlasnici kažu.</h2>
          <div className="kl-testi-grid">
            {testimonials.map((t, i) => <div key={i} className="kl-testi">"{t}"</div>)}
          </div>
        </section>

        {/* FAQ */}
        <section className="kl-section">
          <p className="kl-section-label">Pitanja</p>
          <h2 className="kl-section-title">Najčešća pitanja.</h2>
          <div className="kl-faq-grid" style={{ maxWidth: 680 }}>
            {faqs.map(f => (
              <div key={f.q} className="kl-faq">
                <div className="kl-faq-q">{f.q}</div>
                <div className="kl-faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FORM */}
        <section className="kl-form-section" ref={orderRef}>
          <div className="kl-form-wrap">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p className="kl-section-label">Kontakt</p>
              <h2 className="kl-section-title">Ostavite kontakt.<br />Javimo se u roku 24h.</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem", marginTop: "0.75rem" }}>Besplatna demonstracija. Bez obaveza.</p>
            </div>
            <div className="kl-form-card">
              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
                  <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.5rem", color: "#3D9A66", marginBottom: "0.75rem" }}>Zahtjev primljen!</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", lineHeight: 1.7 }}>Javit ćemo vam se u roku 24 sata.<br />Hvala na povjerenju!</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="kl-form-group">
                    <label className="kl-form-label">Ime i prezime</label>
                    <input name="ime" className="kl-input" placeholder="Marko Marković" autoComplete="off" />
                  </div>
                  <div className="kl-form-group">
                    <label className="kl-form-label">Broj telefona</label>
                    <input name="telefon" className="kl-input" placeholder="+387 61 123 456" autoComplete="off" />
                  </div>
                  <div className="kl-form-group">
                    <label className="kl-form-label">Naziv kafića</label>
                    <input name="kafic" className="kl-input" placeholder="npr. Kafić Central" autoComplete="off" />
                  </div>
                  <div className="kl-form-group">
                    <label className="kl-form-label">Grad</label>
                    <select name="grad" className="kl-input">
                      <option value="">Odaberite grad...</option>
                      {["Sarajevo","Banja Luka","Tuzla","Mostar","Zenica","Bijeljina","Trebinje","Bihać","Drugi grad"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="kl-submit" disabled={loading}>
                    {loading ? "Šalje se..." : "📞 Pošaljite zahtjev — javimo se danas!"}
                  </button>
                  <p className="kl-promise">🔒 Vaši podaci su sigurni. Bez spama.</p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="kl-footer">
          <div className="kl-logo">☕ Kafić<em>Live</em></div>
          <div className="kl-footer-copy">© 2025 KafićLive. Sva prava zadržana.</div>
          <div style={{ fontSize: "0.8rem", color: "var(--steam)" }}>Jednostavno · Brzo · Uvijek na vrijeme.</div>
        </footer>
      </div>
    </>
  );
}