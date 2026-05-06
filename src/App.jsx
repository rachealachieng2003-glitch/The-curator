import { useState, useEffect, useCallback } from "react";

// ── Google Fonts ──
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

// ══════════════════════════════════════════
// MARKET DATA & ENGINE
// ══════════════════════════════════════════
const LOCATIONS = {
  "Westlands":    { vacancy:0.08, expense:0.20, appreciation:0.07, locScore:3, minYield:0.065, grade:"Prime" },
  "Kilimani":     { vacancy:0.10, expense:0.20, appreciation:0.06, locScore:3, minYield:0.065, grade:"Prime" },
  "Kileleshwa":   { vacancy:0.10, expense:0.20, appreciation:0.06, locScore:3, minYield:0.065, grade:"Prime" },
  "Karen":        { vacancy:0.09, expense:0.22, appreciation:0.07, locScore:3, minYield:0.060, grade:"Prime" },
  "Lavington":    { vacancy:0.10, expense:0.20, appreciation:0.06, locScore:3, minYield:0.060, grade:"Prime" },
  "Ngong Road":   { vacancy:0.10, expense:0.20, appreciation:0.05, locScore:2, minYield:0.075, grade:"Mid-Prime" },
  "South B/C":    { vacancy:0.12, expense:0.20, appreciation:0.04, locScore:2, minYield:0.075, grade:"Mid" },
  "Thika Road":   { vacancy:0.12, expense:0.20, appreciation:0.04, locScore:2, minYield:0.080, grade:"Mid" },
  "Mombasa Road": { vacancy:0.12, expense:0.20, appreciation:0.04, locScore:2, minYield:0.080, grade:"Mid" },
  "Syokimau":     { vacancy:0.13, expense:0.20, appreciation:0.04, locScore:2, minYield:0.080, grade:"Mid" },
  "Mlolongo":     { vacancy:0.14, expense:0.20, appreciation:0.04, locScore:2, minYield:0.080, grade:"Mid" },
  "Kitengela":    { vacancy:0.14, expense:0.20, appreciation:0.04, locScore:2, minYield:0.085, grade:"Mid" },
  "Ruiru":        { vacancy:0.13, expense:0.20, appreciation:0.04, locScore:2, minYield:0.085, grade:"Mid" },
  "Athi River":   { vacancy:0.15, expense:0.20, appreciation:0.03, locScore:1, minYield:0.090, grade:"Economy" },
  "Eastleigh":    { vacancy:0.15, expense:0.22, appreciation:0.03, locScore:1, minYield:0.090, grade:"Economy" },
};

const COMPARABLES = [
  { location:"Westlands",   type:"2 Bed",    size:900,  price:7500000,  rent:55000 },
  { location:"Westlands",   type:"2 Bed",    size:850,  price:6800000,  rent:50000 },
  { location:"Westlands",   type:"1 Bed",    size:700,  price:5500000,  rent:40000 },
  { location:"Westlands",   type:"Bedsitter",size:450,  price:3800000,  rent:28000 },
  { location:"Kilimani",    type:"2 Bed",    size:820,  price:6200000,  rent:48000 },
  { location:"Kilimani",    type:"1 Bed",    size:650,  price:5000000,  rent:38000 },
  { location:"Kilimani",    type:"Bedsitter",size:420,  price:3500000,  rent:26000 },
  { location:"Kileleshwa",  type:"2 Bed",    size:870,  price:6500000,  rent:50000 },
  { location:"Kileleshwa",  type:"1 Bed",    size:680,  price:5200000,  rent:39000 },
  { location:"Karen",       type:"2 Bed",    size:1100, price:9500000,  rent:65000 },
  { location:"Karen",       type:"3 Bed",    size:1500, price:14000000, rent:90000 },
  { location:"Lavington",   type:"2 Bed",    size:950,  price:7800000,  rent:55000 },
  { location:"Lavington",   type:"1 Bed",    size:720,  price:5800000,  rent:42000 },
  { location:"Syokimau",    type:"2 Bed",    size:950,  price:4500000,  rent:35000 },
  { location:"Syokimau",    type:"1 Bed",    size:750,  price:3500000,  rent:28000 },
  { location:"Syokimau",    type:"Bedsitter",size:380,  price:2200000,  rent:18000 },
  { location:"Mlolongo",    type:"2 Bed",    size:900,  price:4200000,  rent:32000 },
  { location:"Mlolongo",    type:"1 Bed",    size:700,  price:3200000,  rent:25000 },
  { location:"Mlolongo",    type:"Bedsitter",size:360,  price:2000000,  rent:16000 },
  { location:"Athi River",  type:"2 Bed",    size:1000, price:3800000,  rent:30000 },
  { location:"Athi River",  type:"1 Bed",    size:800,  price:3000000,  rent:25000 },
  { location:"Athi River",  type:"Bedsitter",size:300,  price:2047000,  rent:7500  },
  { location:"Kitengela",   type:"2 Bed",    size:920,  price:3900000,  rent:28000 },
  { location:"Kitengela",   type:"1 Bed",    size:720,  price:3000000,  rent:22000 },
  { location:"Ngong Road",  type:"2 Bed",    size:880,  price:5800000,  rent:42000 },
  { location:"Ngong Road",  type:"1 Bed",    size:660,  price:4500000,  rent:33000 },
  { location:"South B/C",   type:"2 Bed",    size:840,  price:4800000,  rent:36000 },
  { location:"South B/C",   type:"1 Bed",    size:650,  price:3800000,  rent:28000 },
  { location:"Mombasa Road",type:"2 Bed",    size:860,  price:4200000,  rent:32000 },
  { location:"Mombasa Road",type:"1 Bed",    size:680,  price:3300000,  rent:25000 },
  { location:"Thika Road",  type:"2 Bed",    size:880,  price:4400000,  rent:33000 },
  { location:"Thika Road",  type:"1 Bed",    size:700,  price:3400000,  rent:26000 },
  { location:"Ruiru",       type:"2 Bed",    size:920,  price:3600000,  rent:28000 },
  { location:"Ruiru",       type:"1 Bed",    size:720,  price:2800000,  rent:22000 },
  { location:"Ruiru",       type:"Bedsitter",size:340,  price:1800000,  rent:14000 },
];

function analyze(inputs) {
  const { price, size, location, propType, rent, financing, ltv, rate, term } = inputs;
  const loc = LOCATIONS[location] || LOCATIONS["Thika Road"];
  const comps = COMPARABLES.filter(c => c.location === location && c.type === propType);
  const avgCompPrice = comps.length ? comps.reduce((s,c)=>s+c.price,0)/comps.length : null;
  const avgCompRent  = comps.length ? comps.reduce((s,c)=>s+c.rent,0)/comps.length : null;
  const avgCompPsf   = comps.length ? comps.reduce((s,c)=>s+(c.price/c.size),0)/comps.length : null;

  const annualGross  = rent * 12;
  const vacancy      = annualGross * loc.vacancy;
  const egi          = annualGross - vacancy;
  const expenses     = egi * loc.expense;
  const noi          = egi - expenses;
  const netYield     = price > 0 ? noi / price : 0;
  const grossYield   = price > 0 ? annualGross / price : 0;
  const payback      = noi > 0 ? price / noi : 999;
  const totalReturn  = netYield + loc.appreciation;
  const psf          = size > 0 ? price / size : 0;

  // Mortgage
  const loanAmt      = financing === "Mortgage" ? price * ltv : 0;
  const monthlyRate  = rate / 12;
  const termMonths   = term * 12;
  const monthlyPmt   = financing === "Mortgage" && loanAmt > 0
    ? loanAmt * (monthlyRate * Math.pow(1+monthlyRate, termMonths)) / (Math.pow(1+monthlyRate,termMonths)-1)
    : 0;
  const annualDebt   = monthlyPmt * 12;
  const cashAfterDebt = noi - annualDebt;
  const equity       = financing === "Mortgage" ? price*(1-ltv) : price;
  const cocReturn    = equity > 0 ? cashAfterDebt / equity : 0;
  const dcr          = financing === "Mortgage" && annualDebt > 0 ? noi / annualDebt : 10;

  // Comparables analysis
  const priceVar     = avgCompPrice ? (price/avgCompPrice)-1 : null;
  const rentVar      = avgCompRent  ? (rent/avgCompRent)-1  : null;
  const pricingVerdict = priceVar === null ? "No comparables" :
    priceVar > 0.15  ? "Overpriced" :
    priceVar > 0.05  ? "Slightly Above Market" :
    priceVar >= -0.05 ? "Fair Value" :
    priceVar >= -0.15 ? "Good Discount" : "Strong Discount";

  // Scoring
  const yieldScore   = netYield>=0.09?10:netYield>=0.075?8:netYield>=0.06?6:netYield>=0.045?4:2;
  const paybackScore = payback<=10?10:payback<=12?8:payback<=15?6:payback<=18?4:2;
  const pricingScore = priceVar===null?5:priceVar<=-0.15?10:priceVar<=-0.05?8:priceVar<=0.05?6:priceVar<=0.15?4:2;
  const locScore     = loc.locScore * 3.33;
  const mortgageScore = financing==="Cash"?10:dcr>=1.5?10:dcr>=1.3?8:dcr>=1.1?6:dcr>=0.9?4:2;
  const finalScore   = yieldScore*0.35 + paybackScore*0.20 + pricingScore*0.20 + locScore*0.15 + mortgageScore*0.10;

  const verdict = finalScore>=8?"STRONG INVESTMENT":finalScore>=6.5?"GOOD INVESTMENT":finalScore>=5?"CONSIDER WITH CAUTION":finalScore>=3.5?"WEAK — HIGH RISK":"AVOID";
  const riskFlag = netYield<loc.minYield && priceVar!==null && priceVar>0.1
    ? "HIGH RISK: Below-market yield AND overpriced vs comparables"
    : netYield<loc.minYield ? `CAUTION: Yield ${(netYield*100).toFixed(1)}% is below the ${(loc.minYield*100).toFixed(1)}% target for ${location}`
    : priceVar!==null && priceVar>0.1 ? "CAUTION: Priced above market comparables"
    : null;

  return {
    noi, netYield, grossYield, payback, totalReturn, psf,
    monthlyPmt, annualDebt, cashAfterDebt, equity, cocReturn, dcr,
    avgCompPrice, avgCompRent, avgCompPsf, priceVar, rentVar, pricingVerdict,
    yieldScore, paybackScore, pricingScore, locScore, mortgageScore, finalScore,
    verdict, riskFlag, locData: loc, compsCount: comps.length,
    annualGross, vacancy, egi, expenses, loanAmt,
  };
}

// ══════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════
const CSS = `
  :root {
    --dark: #0E0B07;
    --dark2: #1A1410;
    --dark3: #2A1F14;
    --gold: #C9A84C;
    --gold-light: #E8C96A;
    --gold-dim: #8A6220;
    --cream: #FAF6EE;
    --cream2: #EDE5D0;
    --muted: #8B7355;
    --white: #FFFFFF;
    --danger: #E53E3E;
    --success: #2F855A;
    --warn: #C05621;
    --border: rgba(201,168,76,0.18);
    --border-strong: rgba(201,168,76,0.4);
    --ff-display: 'Cormorant Garamond', Georgia, serif;
    --ff-body: 'Montserrat', sans-serif;
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--dark); color:var(--cream); font-family:var(--ff-body); }

  .app { min-height:100vh; background:var(--dark); }

  /* NAV */
  .nav {
    position:sticky; top:0; z-index:100;
    background:rgba(14,11,7,0.95);
    backdrop-filter:blur(12px);
    border-bottom:1px solid var(--border);
    padding:0 24px;
    display:flex; align-items:center; justify-content:space-between;
    height:64px;
  }
  .nav-brand { display:flex; align-items:center; gap:10px; }
  .nav-logo { width:32px; height:32px; }
  .nav-title { font-family:var(--ff-display); font-size:18px; color:var(--gold); letter-spacing:2px; font-weight:400; }
  .nav-sub { font-size:9px; letter-spacing:3px; color:var(--muted); text-transform:uppercase; }
  .nav-right { display:flex; gap:8px; align-items:center; }
  .nav-tab { background:none; border:none; color:var(--muted); font-family:var(--ff-body); font-size:11px; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; padding:6px 12px; border-radius:2px; transition:all 0.2s; }
  .nav-tab:hover { color:var(--gold); }
  .nav-tab.active { color:var(--gold); border-bottom:1px solid var(--gold); }
  .nav-pill { background:var(--gold); color:var(--dark); font-size:10px; font-weight:600; padding:6px 14px; border-radius:1px; border:none; cursor:pointer; letter-spacing:1px; font-family:var(--ff-body); transition:all 0.2s; }
  .nav-pill:hover { background:var(--gold-light); }

  /* HERO */
  .hero {
    position:relative; overflow:hidden;
    padding:80px 24px 60px;
    text-align:center;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%);
    border-bottom:1px solid var(--border);
  }
  .hero-eyebrow { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
  .hero-title { font-family:var(--ff-display); font-size:clamp(36px,6vw,64px); font-weight:300; color:var(--cream); line-height:1.1; margin-bottom:16px; }
  .hero-title em { font-style:italic; color:var(--gold); }
  .hero-sub { font-size:13px; color:var(--muted); letter-spacing:0.5px; max-width:480px; margin:0 auto 32px; line-height:1.8; }
  .hero-cta { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .btn-gold { background:var(--gold); color:var(--dark); border:none; padding:14px 32px; font-family:var(--ff-body); font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
  .btn-gold:hover { background:var(--gold-light); transform:translateY(-1px); }
  .btn-outline { background:none; color:var(--gold); border:1px solid var(--border-strong); padding:14px 32px; font-family:var(--ff-body); font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
  .btn-outline:hover { border-color:var(--gold); background:rgba(201,168,76,0.06); }
  .hero-grid { position:absolute; inset:0; opacity:0.03; background-image: linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px); background-size:50px 50px; pointer-events:none; }

  /* TIERS */
  .tiers { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1px; background:var(--border); margin:0; }
  .tier-card { background:var(--dark2); padding:32px 28px; position:relative; overflow:hidden; }
  .tier-card.featured { background:linear-gradient(135deg, var(--dark3) 0%, #1E160A 100%); }
  .tier-card.featured::before { content:'MOST POPULAR'; position:absolute; top:16px; right:-28px; background:var(--gold); color:var(--dark); font-size:8px; font-weight:700; letter-spacing:2px; padding:4px 40px; transform:rotate(45deg); transform-origin:center; }
  .tier-badge { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:12px; }
  .tier-name { font-family:var(--ff-display); font-size:28px; color:var(--cream); margin-bottom:4px; font-weight:300; }
  .tier-price { font-size:32px; font-weight:300; color:var(--gold); margin-bottom:4px; }
  .tier-price span { font-size:12px; color:var(--muted); }
  .tier-desc { font-size:11px; color:var(--muted); margin-bottom:24px; line-height:1.7; }
  .tier-features { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .tier-features li { font-size:11px; color:var(--cream2); display:flex; gap:10px; align-items:flex-start; }
  .tier-features li::before { content:''; display:block; width:4px; height:4px; background:var(--gold); border-radius:50%; margin-top:5px; flex-shrink:0; }
  .tier-btn { width:100%; margin-top:28px; padding:12px; background:none; border:1px solid var(--border-strong); color:var(--gold); font-family:var(--ff-body); font-size:10px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
  .tier-btn:hover { background:rgba(201,168,76,0.08); }
  .tier-btn.gold { background:var(--gold); color:var(--dark); border-color:var(--gold); }
  .tier-btn.gold:hover { background:var(--gold-light); }

  /* MAIN CONTENT */
  .content { max-width:1100px; margin:0 auto; padding:48px 24px; }
  .section-title { font-family:var(--ff-display); font-size:28px; font-weight:300; color:var(--cream); margin-bottom:8px; }
  .section-sub { font-size:11px; color:var(--muted); letter-spacing:1px; margin-bottom:32px; }

  /* FORM */
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:32px; }
  @media(max-width:640px){.form-grid{grid-template-columns:1fr;}}
  .form-section { background:var(--dark2); border:1px solid var(--border); padding:28px; }
  .form-section-title { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid var(--border); }
  .field { margin-bottom:18px; }
  .field label { display:block; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
  .field input, .field select {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid var(--border);
    color:var(--cream); font-family:var(--ff-body); font-size:13px; padding:12px 14px;
    outline:none; transition:all 0.2s; appearance:none;
  }
  .field input:focus, .field select:focus { border-color:var(--gold-dim); background:rgba(201,168,76,0.05); }
  .field select option { background:var(--dark2); color:var(--cream); }
  .field .hint { font-size:10px; color:var(--muted); margin-top:6px; }

  .analyse-btn {
    width:100%; padding:18px; background:var(--gold); color:var(--dark); border:none;
    font-family:var(--ff-body); font-size:12px; font-weight:600; letter-spacing:3px;
    text-transform:uppercase; cursor:pointer; transition:all 0.2s; margin-bottom:12px;
  }
  .analyse-btn:hover { background:var(--gold-light); transform:translateY(-1px); }
  .analyse-btn.pro { background:var(--dark3); color:var(--gold); border:1px solid var(--gold); }
  .analyse-btn.pro:hover { background:rgba(201,168,76,0.1); }

  /* RESULTS */
  .results { animation: fadeUp 0.5s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .score-banner {
    background:linear-gradient(135deg, var(--dark3) 0%, #120E08 100%);
    border:1px solid var(--border-strong);
    padding:40px; margin-bottom:24px;
    display:grid; grid-template-columns:auto 1fr auto; gap:32px; align-items:center;
  }
  @media(max-width:640px){.score-banner{grid-template-columns:1fr;text-align:center;}}
  .score-circle { width:100px; height:100px; border-radius:50%; border:2px solid var(--gold); display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; }
  .score-num { font-family:var(--ff-display); font-size:42px; color:var(--gold); line-height:1; font-weight:300; }
  .score-denom { font-size:10px; color:var(--muted); letter-spacing:1px; }
  .score-verdict { font-family:var(--ff-display); font-size:clamp(22px,4vw,36px); color:var(--cream); font-weight:300; margin-bottom:8px; }
  .score-rec { font-size:12px; color:var(--muted); line-height:1.8; max-width:520px; }
  .risk-flag { margin-top:12px; padding:10px 14px; background:rgba(229,62,62,0.1); border-left:3px solid var(--danger); font-size:11px; color:#FC8181; }

  .metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1px; background:var(--border); margin-bottom:24px; }
  .metric-card { background:var(--dark2); padding:22px 20px; }
  .metric-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:8px; }
  .metric-value { font-family:var(--ff-display); font-size:26px; color:var(--cream); font-weight:300; }
  .metric-value.gold { color:var(--gold); }
  .metric-value.green { color:#68D391; }
  .metric-value.red { color:#FC8181; }
  .metric-status { font-size:10px; margin-top:6px; }
  .metric-status.good { color:#68D391; }
  .metric-status.bad { color:#FC8181; }
  .metric-status.warn { color:#F6AD55; }

  .scores-breakdown { background:var(--dark2); border:1px solid var(--border); padding:28px; margin-bottom:24px; }
  .scores-title { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
  .score-row { display:grid; grid-template-columns:1fr auto 80px; gap:16px; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); }
  .score-row:last-child { border-bottom:none; }
  .score-row-label { font-size:11px; color:var(--cream2); }
  .score-row-weight { font-size:10px; color:var(--muted); }
  .score-bar-wrap { display:flex; align-items:center; gap:8px; }
  .score-bar { height:4px; background:rgba(201,168,76,0.15); border-radius:2px; flex:1; overflow:hidden; }
  .score-bar-fill { height:100%; background:var(--gold); border-radius:2px; transition:width 0.8s ease; }
  .score-bar-val { font-size:11px; color:var(--gold); width:28px; text-align:right; font-weight:600; }

  .comps-section { background:var(--dark2); border:1px solid var(--border); padding:28px; margin-bottom:24px; }
  .comps-title { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:20px; }
  .comps-table { width:100%; border-collapse:collapse; }
  .comps-table th { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); padding:8px 12px; text-align:left; border-bottom:1px solid var(--border); }
  .comps-table td { font-size:11px; color:var(--cream2); padding:10px 12px; border-bottom:1px solid rgba(201,168,76,0.06); }
  .comps-table tr:last-child td { border-bottom:none; }
  .comps-table tr.subject td { color:var(--gold); font-weight:500; }
  .tag { display:inline-block; font-size:9px; letter-spacing:1px; padding:3px 8px; border-radius:1px; font-weight:600; }
  .tag.good { background:rgba(104,211,145,0.15); color:#68D391; }
  .tag.bad  { background:rgba(252,129,129,0.15); color:#FC8181; }
  .tag.warn { background:rgba(246,173,85,0.15);  color:#F6AD55; }
  .tag.neutral { background:rgba(201,168,76,0.15); color:var(--gold); }

  .income-table { width:100%; border-collapse:collapse; margin-bottom:24px; background:var(--dark2); border:1px solid var(--border); }
  .income-table th { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); padding:14px 20px; text-align:left; background:var(--dark3); border-bottom:1px solid var(--border); }
  .income-table td { font-size:12px; padding:12px 20px; border-bottom:1px solid rgba(201,168,76,0.06); }
  .income-table td:last-child { text-align:right; font-family:var(--ff-display); font-size:15px; color:var(--cream); }
  .income-table tr.total td { color:var(--gold); font-weight:600; border-top:1px solid var(--border-strong); }

  /* SAVED */
  .saved-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .saved-card { background:var(--dark2); border:1px solid var(--border); padding:24px; cursor:pointer; transition:all 0.2s; }
  .saved-card:hover { border-color:var(--gold-dim); background:var(--dark3); }
  .saved-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
  .saved-card-loc { font-family:var(--ff-display); font-size:18px; color:var(--cream); }
  .saved-card-type { font-size:10px; color:var(--muted); letter-spacing:1px; margin-top:2px; }
  .saved-card-score { font-family:var(--ff-display); font-size:32px; color:var(--gold); }
  .saved-card-meta { display:flex; gap:16px; flex-wrap:wrap; }
  .saved-meta-item { font-size:10px; color:var(--muted); }
  .saved-meta-val { color:var(--cream2); font-weight:500; }
  .saved-date { font-size:10px; color:var(--muted); margin-top:12px; padding-top:12px; border-top:1px solid var(--border); }
  .delete-btn { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; padding:4px; transition:color 0.2s; }
  .delete-btn:hover { color:var(--danger); }

  .empty-state { text-align:center; padding:80px 20px; }
  .empty-icon { font-size:40px; margin-bottom:16px; opacity:0.4; }
  .empty-text { font-family:var(--ff-display); font-size:22px; color:var(--muted); margin-bottom:8px; }
  .empty-sub { font-size:11px; color:var(--muted); opacity:0.7; }

  .divider { height:1px; background:var(--border); margin:40px 0; }
  .gold-rule { height:1px; background:linear-gradient(90deg, transparent, var(--gold-dim), transparent); margin:32px 0; }

  .pro-gate { background:var(--dark3); border:1px solid var(--border-strong); padding:32px; text-align:center; margin-top:24px; }
  .pro-gate-title { font-family:var(--ff-display); font-size:24px; color:var(--cream); margin-bottom:8px; }
  .pro-gate-sub { font-size:11px; color:var(--muted); margin-bottom:20px; line-height:1.7; }
  .pro-features { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-bottom:24px; }
  .pro-feature { font-size:10px; color:var(--gold); border:1px solid var(--border); padding:6px 14px; letter-spacing:1px; }

  /* COMPARABLES DB PAGE */
  .comps-db { }
  .comps-filter { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; }
  .filter-btn { background:none; border:1px solid var(--border); color:var(--muted); font-family:var(--ff-body); font-size:10px; letter-spacing:1px; padding:8px 16px; cursor:pointer; transition:all 0.2s; }
  .filter-btn.active { border-color:var(--gold); color:var(--gold); background:rgba(201,168,76,0.06); }
  .filter-btn:hover { border-color:var(--gold-dim); color:var(--cream2); }
  .db-table { width:100%; border-collapse:collapse; }
  .db-table th { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); padding:12px 16px; text-align:left; background:var(--dark3); border-bottom:1px solid var(--border); position:sticky; top:64px; }
  .db-table td { font-size:11px; color:var(--cream2); padding:12px 16px; border-bottom:1px solid rgba(201,168,76,0.06); }
  .db-table tr:hover td { background:rgba(201,168,76,0.03); }
  .db-wrap { background:var(--dark2); border:1px solid var(--border); overflow:auto; max-height:600px; }
  .db-stats { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1px; background:var(--border); margin-bottom:24px; }
  .db-stat { background:var(--dark2); padding:20px; }
  .db-stat-label { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
  .db-stat-val { font-family:var(--ff-display); font-size:22px; color:var(--gold); }

  .update-notice { background:rgba(201,168,76,0.06); border:1px solid var(--border); padding:16px 20px; margin-bottom:24px; display:flex; gap:12px; align-items:flex-start; }
  .update-notice-icon { color:var(--gold); font-size:14px; flex-shrink:0; margin-top:1px; }
  .update-notice-text { font-size:11px; color:var(--muted); line-height:1.7; }
  .update-notice strong { color:var(--cream2); }

  .footer { border-top:1px solid var(--border); padding:40px 24px; text-align:center; }
  .footer-brand { font-family:var(--ff-display); font-size:20px; color:var(--gold); letter-spacing:3px; margin-bottom:8px; }
  .footer-sub { font-size:10px; color:var(--muted); letter-spacing:2px; }
`;

// ══════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════
const Logo = () => (
  <svg viewBox="0 0 40 40" className="nav-logo">
    <rect width="40" height="40" rx="6" fill="#1A1410"/>
    <rect x="8"  y="28" width="5"  height="8"  rx="1" fill="#C9A84C" opacity="0.5"/>
    <rect x="15" y="22" width="5"  height="14" rx="1" fill="#C9A84C" opacity="0.7"/>
    <rect x="22" y="16" width="5"  height="20" rx="1" fill="#C9A84C"/>
    <rect x="29" y="20" width="5"  height="16" rx="1" fill="#C9A84C" opacity="0.7"/>
    <line x1="6" y1="28" x2="36" y2="14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
    <circle cx="36" cy="14" r="2" fill="#E8C96A"/>
  </svg>
);

const fmt = (n) => n?.toLocaleString("en-KE", { maximumFractionDigits:0 }) ?? "—";
const fmtPct = (n) => n != null ? (n*100).toFixed(1)+"%" : "—";
const fmtYrs = (n) => n < 900 ? n.toFixed(1)+" yrs" : "N/A";

function ScoreBar({ label, weight, score }) {
  return (
    <div className="score-row">
      <div className="score-row-label">{label}</div>
      <div className="score-row-weight">{weight}</div>
      <div className="score-bar-wrap">
        <div className="score-bar">
          <div className="score-bar-fill" style={{width:`${score*10}%`}}/>
        </div>
        <div className="score-bar-val">{score.toFixed(1)}</div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, status, statusText }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value ${status||""}`}>{value}</div>
      {statusText && <div className={`metric-status ${status||""}`}>{statusText}</div>}
    </div>
  );
}

// ══════════════════════════════════════════
// PAGES
// ══════════════════════════════════════════
function AnalysePage({ tier, onSave }) {
  const [inputs, setInputs] = useState({
    price:7000000, size:900, location:"Westlands", propType:"2 Bed",
    rent:50000, financing:"Cash", ltv:0.7, rate:0.135, term:20
  });
  const [result, setResult] = useState(null);
  const [analysed, setAnalysed] = useState(false);

  const set = (k,v) => setInputs(p=>({...p,[k]:v}));

  const run = () => {
    const r = analyze(inputs);
    setResult(r);
    setAnalysed(true);
  };

  const save = () => {
    if (!result) return;
    onSave({ inputs, result, date: new Date().toISOString(), id: Date.now() });
  };

  const verdictColor = (v) => {
    if (!v) return "";
    if (v.includes("STRONG")) return "green";
    if (v.includes("GOOD")) return "green";
    if (v.includes("CAUTION")) return "warn";
    if (v.includes("WEAK") || v.includes("AVOID")) return "red";
    return "gold";
  };

  return (
    <div>
      <div style={{marginBottom:32}}>
        <div className="section-title">Analyse a Property</div>
        <div className="section-sub">Enter the details below. Free tier gives you core metrics. Pro unlocks full deep-dive.</div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <div className="form-section-title">Property Details</div>
          <div className="field">
            <label>Purchase Price (KShs)</label>
            <input type="number" value={inputs.price} onChange={e=>set("price",+e.target.value)} placeholder="e.g. 7000000"/>
          </div>
          <div className="field">
            <label>Property Size (sq ft)</label>
            <input type="number" value={inputs.size} onChange={e=>set("size",+e.target.value)}/>
          </div>
          <div className="field">
            <label>Location</label>
            <select value={inputs.location} onChange={e=>set("location",e.target.value)}>
              {Object.keys(LOCATIONS).map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Property Type</label>
            <select value={inputs.propType} onChange={e=>set("propType",e.target.value)}>
              {["Bedsitter","1 Bed","2 Bed","3 Bed"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Rental Income & Financing</div>
          <div className="field">
            <label>Expected Monthly Rent (KShs)</label>
            <input type="number" value={inputs.rent} onChange={e=>set("rent",+e.target.value)}/>
          </div>
          <div className="field">
            <label>Financing Method</label>
            <select value={inputs.financing} onChange={e=>set("financing",e.target.value)}>
              <option>Cash</option>
              <option>Mortgage</option>
            </select>
          </div>
          {inputs.financing === "Mortgage" && <>
            <div className="field">
              <label>Loan-to-Value (e.g. 0.7 = 70%)</label>
              <input type="number" step="0.05" min="0.1" max="0.9" value={inputs.ltv} onChange={e=>set("ltv",+e.target.value)}/>
              <div className="hint">Typical Kenya banks: 70–80% LTV</div>
            </div>
            <div className="field">
              <label>Annual Interest Rate (e.g. 0.135 = 13.5%)</label>
              <input type="number" step="0.005" value={inputs.rate} onChange={e=>set("rate",+e.target.value)}/>
            </div>
            <div className="field">
              <label>Loan Term (Years)</label>
              <input type="number" value={inputs.term} onChange={e=>set("term",+e.target.value)}/>
            </div>
          </>}
        </div>
      </div>

      <button className="analyse-btn" onClick={run}>
        ▶ &nbsp; Run Free Analysis
      </button>
      {tier === "free" && (
        <button className="analyse-btn pro" onClick={()=>alert("Upgrade to Pro for deep-dive analysis with comparables, mortgage simulation, risk flags and downloadable report.")}>
          ★ &nbsp; Run Pro Deep-Dive Analysis — KShs 500
        </button>
      )}

      {analysed && result && (
        <div className="results">
          <div className="gold-rule"/>

          {/* Score Banner */}
          <div className="score-banner">
            <div className="score-circle">
              <div className="score-num">{result.finalScore.toFixed(1)}</div>
              <div className="score-denom">/ 10</div>
            </div>
            <div>
              <div className={`score-verdict`} style={{color: result.finalScore>=6.5?"#C9A84C":result.finalScore>=5?"#F6AD55":"#FC8181"}}>
                {result.verdict}
              </div>
              <div className="score-rec">
                {result.finalScore>=8 && "The numbers stack up. Strong yield, fair pricing, solid location. Proceed with confidence — subject to legal and physical due diligence."}
                {result.finalScore>=6.5 && result.finalScore<8 && "The fundamentals are sound. A few metrics could be stronger but overall this is a sensible buy. Negotiate on price if possible."}
                {result.finalScore>=5 && result.finalScore<6.5 && "This property has potential but carries risk. Push for a price reduction or confirm rent assumptions before committing."}
                {result.finalScore>=3.5 && result.finalScore<5 && "The yield is thin, the price may be high or the location limits upside. Avoid unless you have a strong strategic reason."}
                {result.finalScore<3.5 && "This deal does not make financial sense at the current price and rent levels. Walk away or renegotiate significantly."}
              </div>
              {result.riskFlag && <div className="risk-flag">⚠ {result.riskFlag}</div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2,marginBottom:8}}>LOCATION GRADE</div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:22,color:"var(--cream)"}}>{result.locData.grade}</div>
              <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>{inputs.location}</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <MetricCard label="Net Annual Yield" value={fmtPct(result.netYield)}
              status={result.netYield>=result.locData.minYield?"green":"red"}
              statusText={result.netYield>=result.locData.minYield?`✔ Above ${fmtPct(result.locData.minYield)} target`:`✘ Below ${fmtPct(result.locData.minYield)} target`}/>
            <MetricCard label="Gross Yield" value={fmtPct(result.grossYield)}
              status={result.grossYield>=0.078?"green":"warn"}
              statusText={result.grossYield>=0.078?"✔ Above NMA avg 7.8%":"Below NMA avg 7.8%"}/>
            <MetricCard label="Payback Period" value={fmtYrs(result.payback)}
              status={result.payback<=12?"green":result.payback<=15?"warn":"red"}
              statusText={result.payback<=12?"✔ Strong":result.payback<=15?"Fair":"Long"}/>
            <MetricCard label="Net Operating Income" value={"KShs "+fmt(result.noi)+"/yr"}
              status="gold"/>
            <MetricCard label="Total Return" value={fmtPct(result.totalReturn)}
              status={result.totalReturn>=0.12?"green":"warn"}
              statusText="Yield + capital growth"/>
            <MetricCard label="Price per sq ft" value={"KShs "+fmt(result.psf)}
              status={result.avgCompPsf && result.psf<=result.avgCompPsf?"green":result.avgCompPsf?"red":""}
              statusText={result.avgCompPsf?`Avg comparable: KShs ${fmt(result.avgCompPsf)}/sqft`:"No comparables"}/>
            {inputs.financing==="Mortgage" && <>
              <MetricCard label="Monthly Mortgage" value={"KShs "+fmt(result.monthlyPmt)}
                status={result.dcr>=1.2?"green":"red"}
                statusText={result.dcr>=1.2?`✔ DCR ${result.dcr.toFixed(2)}x`:`✘ DCR ${result.dcr.toFixed(2)}x — below 1.2x`}/>
              <MetricCard label="Cash-on-Cash Return" value={fmtPct(result.cocReturn)}
                status={result.cocReturn>=0.08?"green":"warn"}/>
            </>}
            <MetricCard label="Pricing vs Market" value={result.priceVar!=null?fmtPct(result.priceVar):"No comps"}
              status={result.priceVar!=null?(result.priceVar<=-0.05?"green":result.priceVar<=0.05?"warn":"red"):""}
              statusText={result.pricingVerdict}/>
          </div>

          {/* Income Waterfall */}
          <table className="income-table">
            <thead><tr><th>Income & Expense Breakdown</th><th style={{textAlign:"right"}}>Annual (KShs)</th></tr></thead>
            <tbody>
              <tr><td>Gross Annual Rent</td><td>KShs {fmt(result.annualGross)}</td></tr>
              <tr><td>Less: Vacancy ({(result.locData.vacancy*100).toFixed(0)}% for {inputs.location})</td><td style={{color:"#FC8181"}}>− KShs {fmt(result.vacancy)}</td></tr>
              <tr><td>Effective Gross Income</td><td>KShs {fmt(result.egi)}</td></tr>
              <tr><td>Less: Expenses ({(result.locData.expense*100).toFixed(0)}% — maintenance, mgmt, insurance)</td><td style={{color:"#FC8181"}}>− KShs {fmt(result.expenses)}</td></tr>
              <tr className="total"><td>Net Operating Income (NOI)</td><td>KShs {fmt(result.noi)}</td></tr>
              {inputs.financing==="Mortgage" && <>
                <tr><td>Less: Annual Debt Service</td><td style={{color:"#FC8181"}}>− KShs {fmt(result.annualDebt)}</td></tr>
                <tr className="total"><td>Cash After Debt Service</td><td>KShs {fmt(result.cashAfterDebt)}</td></tr>
              </>}
            </tbody>
          </table>

          {/* Score Breakdown */}
          <div className="scores-breakdown">
            <div className="scores-title">Score Breakdown</div>
            <ScoreBar label="Rental Yield" weight="35% weight" score={result.yieldScore}/>
            <ScoreBar label="Payback Period" weight="20% weight" score={result.paybackScore}/>
            <ScoreBar label="Pricing vs Market" weight="20% weight" score={result.pricingScore}/>
            <ScoreBar label="Location Quality" weight="15% weight" score={result.locScore}/>
            <ScoreBar label="Mortgage Cover" weight="10% weight" score={result.mortgageScore}/>
          </div>

          {/* Comparables */}
          {tier !== "free" || true ? (
            <div className="comps-section">
              <div className="comps-title">
                Market Comparables — {inputs.location} · {inputs.propType}
                {result.compsCount === 0 && <span style={{color:"var(--muted)",marginLeft:8}}>No exact match found</span>}
              </div>
              {result.compsCount > 0 ? (
                <table className="comps-table">
                  <thead><tr><th>Property</th><th>Size</th><th>Sale Price</th><th>Monthly Rent</th><th>Price/sqft</th><th>Gross Yield</th></tr></thead>
                  <tbody>
                    {COMPARABLES.filter(c=>c.location===inputs.location&&c.type===inputs.propType).map((c,i)=>(
                      <tr key={i}>
                        <td>{c.location} {c.type} #{i+1}</td>
                        <td>{fmt(c.size)} sq ft</td>
                        <td>KShs {fmt(c.price)}</td>
                        <td>KShs {fmt(c.rent)}/mo</td>
                        <td>KShs {fmt(Math.round(c.price/c.size))}</td>
                        <td>{((c.rent*12/c.price)*100).toFixed(1)}%</td>
                      </tr>
                    ))}
                    <tr className="subject">
                      <td>◆ Your Property</td>
                      <td>{fmt(inputs.size)} sq ft</td>
                      <td>KShs {fmt(inputs.price)}</td>
                      <td>KShs {fmt(inputs.rent)}/mo</td>
                      <td>KShs {fmt(Math.round(result.psf))}</td>
                      <td>{fmtPct(result.grossYield)}</td>
                    </tr>
                    <tr style={{background:"rgba(201,168,76,0.05)"}}>
                      <td style={{color:"var(--muted)"}}>Market Average</td>
                      <td>—</td>
                      <td>KShs {fmt(result.avgCompPrice)}</td>
                      <td>KShs {fmt(result.avgCompRent)}/mo</td>
                      <td>KShs {fmt(result.avgCompPsf)}</td>
                      <td>{result.avgCompRent&&result.avgCompPrice?((result.avgCompRent*12/result.avgCompPrice)*100).toFixed(1)+"%":"—"}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div style={{color:"var(--muted)",fontSize:12,padding:"12px 0"}}>
                  No comparables found for {inputs.propType} in {inputs.location}. Expand your comparables database or check a neighbouring area.
                </div>
              )}
            </div>
          ) : (
            <div className="pro-gate">
              <div className="pro-gate-title">Unlock Deep-Dive Analysis</div>
              <div className="pro-gate-sub">Get the full picture: market comparables, risk flags, mortgage simulation, pricing verdict and a downloadable PDF report.</div>
              <div className="pro-features">
                {["Market Comparables","Risk Flag Analysis","Mortgage Simulation","Price vs Market","PDF Report"].map(f=>(
                  <div key={f} className="pro-feature">{f}</div>
                ))}
              </div>
              <button className="btn-gold" onClick={()=>alert("Pro report: KShs 500 per analysis. Subscription: KShs 2,000/mo for unlimited reports.")}>
                Get Pro Report — KShs 500
              </button>
            </div>
          )}

          <div style={{display:"flex",gap:12,marginTop:8}}>
            <button className="btn-gold" onClick={save}>Save This Analysis</button>
            <button className="btn-outline" onClick={()=>alert("PDF download coming in v2. The full report will include all metrics, comparables and recommendation.")}>
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SavedPage({ saved, onLoad, onDelete }) {
  if (!saved.length) return (
    <div className="empty-state">
      <div className="empty-icon">◈</div>
      <div className="empty-text">No saved analyses yet</div>
      <div className="empty-sub">Run your first analysis and save it to see it here</div>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:32}}>
        <div className="section-title">Saved Analyses</div>
        <div className="section-sub">{saved.length} saved · Click any card to reload</div>
      </div>
      <div className="saved-grid">
        {saved.map(s=>(
          <div key={s.id} className="saved-card" onClick={()=>onLoad(s)}>
            <div className="saved-card-top">
              <div>
                <div className="saved-card-loc">{s.inputs.location}</div>
                <div className="saved-card-type">{s.inputs.propType} · {s.inputs.financing}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <div className="saved-card-score">{s.result.finalScore.toFixed(1)}</div>
                <button className="delete-btn" onClick={e=>{e.stopPropagation();onDelete(s.id);}}>✕</button>
              </div>
            </div>
            <div className="saved-card-meta">
              <div className="saved-meta-item">Price: <span className="saved-meta-val">KShs {fmt(s.inputs.price)}</span></div>
              <div className="saved-meta-item">Yield: <span className="saved-meta-val">{fmtPct(s.result.netYield)}</span></div>
              <div className="saved-meta-item">Payback: <span className="saved-meta-val">{fmtYrs(s.result.payback)}</span></div>
            </div>
            <div style={{marginTop:8}}>
              <span className={`tag ${s.result.finalScore>=6.5?"good":s.result.finalScore>=5?"warn":"bad"}`}>
                {s.result.verdict}
              </span>
            </div>
            <div className="saved-date">{new Date(s.date).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"})}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparablesPage() {
  const [locFilter, setLocFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const locs = ["All",...[...new Set(COMPARABLES.map(c=>c.location))]];
  const types = ["All",...[...new Set(COMPARABLES.map(c=>c.type))]];

  const filtered = COMPARABLES.filter(c=>
    (locFilter==="All"||c.location===locFilter) &&
    (typeFilter==="All"||c.type===typeFilter)
  );

  const avgYield = filtered.reduce((s,c)=>s+(c.rent*12/c.price),0)/filtered.length;
  const avgPsf   = filtered.reduce((s,c)=>s+(c.price/c.size),0)/filtered.length;

  return (
    <div>
      <div style={{marginBottom:32}}>
        <div className="section-title">Comparables Database</div>
        <div className="section-sub">{COMPARABLES.length} properties across {Object.keys(LOCATIONS).length} Nairobi locations · Updated Q1 2025</div>
      </div>

      <div className="update-notice">
        <div className="update-notice-icon">ℹ</div>
        <div className="update-notice-text">
          <strong>Data sourcing: </strong>
          Comparables are sourced from PropertyPro Kenya, BuyRentKenya, KenyaPropertyCentre, Hauzisha, Cytonn Research and Estate Intel.
          Data is reviewed and updated monthly by The Curators team. Last updated: <strong>March 2025.</strong>
          To suggest a comparable or report a stale listing, email <strong>data@thecurators.ke</strong>
        </div>
      </div>

      <div className="db-stats">
        <div className="db-stat"><div className="db-stat-label">Total Comparables</div><div className="db-stat-val">{COMPARABLES.length}</div></div>
        <div className="db-stat"><div className="db-stat-label">Locations Covered</div><div className="db-stat-val">{Object.keys(LOCATIONS).length}</div></div>
        <div className="db-stat"><div className="db-stat-label">Avg Gross Yield</div><div className="db-stat-val">{(avgYield*100).toFixed(1)}%</div></div>
        <div className="db-stat"><div className="db-stat-label">Avg Price / sqft</div><div className="db-stat-val">KShs {fmt(avgPsf)}</div></div>
      </div>

      <div className="comps-filter">
        {locs.map(l=><button key={l} className={`filter-btn${locFilter===l?" active":""}`} onClick={()=>setLocFilter(l)}>{l}</button>)}
      </div>
      <div className="comps-filter" style={{marginTop:-8}}>
        {types.map(t=><button key={t} className={`filter-btn${typeFilter===t?" active":""}`} onClick={()=>setTypeFilter(t)}>{t}</button>)}
      </div>

      <div className="db-wrap">
        <table className="db-table">
          <thead>
            <tr>
              <th>Location</th><th>Type</th><th>Size (sqft)</th>
              <th>Sale Price (KShs)</th><th>Monthly Rent (KShs)</th>
              <th>Price/sqft</th><th>Gross Yield</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={i}>
                <td><strong>{c.location}</strong></td>
                <td><span className="tag neutral">{c.type}</span></td>
                <td>{fmt(c.size)}</td>
                <td>KShs {fmt(c.price)}</td>
                <td>KShs {fmt(c.rent)}</td>
                <td>KShs {fmt(Math.round(c.price/c.size))}</td>
                <td style={{color: (c.rent*12/c.price)>=0.08?"#68D391":"#F6AD55"}}>
                  {((c.rent*12/c.price)*100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PricingPage({ onSelectTier }) {
  return (
    <div>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div className="section-title" style={{marginBottom:8}}>Choose Your Plan</div>
        <div className="section-sub">From a quick check to a full investment report</div>
      </div>
      <div className="tiers">
        <div className="tier-card">
          <div className="tier-badge">Free</div>
          <div className="tier-name">Starter</div>
          <div className="tier-price">KShs 0 <span>forever</span></div>
          <div className="tier-desc">Quick sanity check on any property before you go deeper.</div>
          <ul className="tier-features">
            <li>Net yield & gross yield</li>
            <li>Payback period</li>
            <li>Basic investment score</li>
            <li>Cash or mortgage toggle</li>
            <li>3 analyses per day</li>
          </ul>
          <button className="tier-btn" onClick={()=>onSelectTier("free")}>Start Free</button>
        </div>
        <div className="tier-card featured">
          <div className="tier-badge">Per Report</div>
          <div className="tier-name">Pro Report</div>
          <div className="tier-price">KShs 500 <span>/ report</span></div>
          <div className="tier-desc">Full deep-dive on one property. Pay only when you need it.</div>
          <ul className="tier-features">
            <li>Everything in Free</li>
            <li>Market comparables (15+ locations)</li>
            <li>Pricing verdict vs market</li>
            <li>Risk flag analysis</li>
            <li>Full mortgage simulation</li>
            <li>Downloadable PDF report</li>
            <li>Score breakdown</li>
          </ul>
          <button className="tier-btn gold" onClick={()=>alert("M-Pesa & card payment coming. For now, email reports@thecurators.ke")}>Buy Report</button>
        </div>
        <div className="tier-card">
          <div className="tier-badge">Subscription</div>
          <div className="tier-name">Unlimited</div>
          <div className="tier-price">KShs 2,000 <span>/ month</span></div>
          <div className="tier-desc">For serious investors, agents and developers. Unlimited analyses + history.</div>
          <ul className="tier-features">
            <li>Everything in Pro</li>
            <li>Unlimited analyses</li>
            <li>Saved analysis history</li>
            <li>Portfolio overview</li>
            <li>Comparables database access</li>
            <li>Monthly market data updates</li>
            <li>Priority support</li>
          </ul>
          <button className="tier-btn" onClick={()=>alert("Subscription launching soon. Join waitlist: subscribe@thecurators.ke")}>Join Waitlist</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [tier] = useState("free");
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("curators_saved") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("curators_saved", JSON.stringify(saved)); } catch {}
  }, [saved]);

  const onSave = (analysis) => {
    setSaved(p => [analysis, ...p].slice(0, 50));
    alert("Analysis saved! View it in My Analyses.");
  };

  const onDelete = (id) => setSaved(p => p.filter(s => s.id !== id));

  const onLoad = (s) => setPage("analyse");

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-brand">
            <Logo/>
            <div>
              <div className="nav-title">THE CURATORS</div>
              <div className="nav-sub">Investment Intelligence</div>
            </div>
          </div>
          <div className="nav-right">
            {[["home","Home"],["analyse","Analyse"],["saved","My Analyses"],["comps","Comparables"],["pricing","Pricing"]].map(([id,label])=>(
              <button key={id} className={`nav-tab${page===id?" active":""}`} onClick={()=>setPage(id)}>{label}</button>
            ))}
          </div>
        </nav>

        {/* HOME */}
        {page === "home" && (
          <>
            <div className="hero">
              <div className="hero-grid"/>
              <div className="hero-eyebrow">Real Estate Intelligence, Carefully Curated</div>
              <h1 className="hero-title">
                Does this property<br/>actually <em>make sense?</em>
              </h1>
              <p className="hero-sub">
                The Curators Investment App goes beyond a basic calculator — combining rental yield, payback period and real market comparables to give you a clear investment score and recommendation before you commit millions.
              </p>
              <div className="hero-cta">
                <button className="btn-gold" onClick={()=>setPage("analyse")}>Analyse a Property</button>
                <button className="btn-outline" onClick={()=>setPage("pricing")}>View Pricing</button>
              </div>
            </div>
            <div style={{padding:"0 24px"}}>
              <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 0"}}>
                <div style={{textAlign:"center",marginBottom:40}}>
                  <div className="section-title">How It Works</div>
                  <div className="section-sub">Three steps. One clear answer.</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:1,background:"var(--border)"}}>
                  {[
                    ["01","Enter Details","Purchase price, size, location, type and expected rent."],
                    ["02","We Analyse","Yield, payback, market comparables, mortgage simulation, risk flags — all calculated instantly."],
                    ["03","Get Your Score","A clear 0–10 investment score with a plain-English recommendation. No jargon."],
                  ].map(([n,t,d])=>(
                    <div key={n} style={{background:"var(--dark2)",padding:"32px 28px"}}>
                      <div style={{fontFamily:"var(--ff-display)",fontSize:48,color:"var(--gold)",opacity:0.3,lineHeight:1,marginBottom:12}}>{n}</div>
                      <div style={{fontFamily:"var(--ff-display)",fontSize:20,color:"var(--cream)",marginBottom:8}}>{t}</div>
                      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.8}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:"var(--dark2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"48px 24px"}}>
              <div style={{maxWidth:1100,margin:"0 auto"}}>
                <div style={{textAlign:"center",marginBottom:32}}>
                  <div className="section-title">Nairobi Market Coverage</div>
                  <div className="section-sub">{Object.keys(LOCATIONS).length} locations · {COMPARABLES.length} comparable transactions · Updated Q1 2025</div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                  {Object.entries(LOCATIONS).map(([loc,data])=>(
                    <div key={loc} style={{background:"var(--dark3)",border:"1px solid var(--border)",padding:"8px 16px",cursor:"pointer"}}
                      onClick={()=>setPage("analyse")}>
                      <div style={{fontSize:12,color:"var(--cream2)"}}>{loc}</div>
                      <div style={{fontSize:9,color:"var(--muted)",letterSpacing:1,marginTop:2}}>{data.grade} · Min yield {(data.minYield*100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <PricingPage onSelectTier={()=>setPage("analyse")}/>
          </>
        )}

        {/* CONTENT PAGES */}
        {page !== "home" && (
          <div className="content">
            {page === "analyse"   && <AnalysePage tier={tier} onSave={onSave}/>}
            {page === "saved"     && <SavedPage saved={saved} onLoad={onLoad} onDelete={onDelete}/>}
            {page === "comps"     && <ComparablesPage/>}
            {page === "pricing"   && <PricingPage onSelectTier={()=>setPage("analyse")}/>}
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-brand">THE CURATORS</div>
          <div className="footer-sub">Real Estate Intelligence, Carefully Curated · Nairobi, Kenya</div>
          <div style={{marginTop:16,fontSize:10,color:"var(--muted)",opacity:0.6,maxWidth:500,margin:"16px auto 0",lineHeight:1.8}}>
            This tool provides analytical guidance only. It does not constitute financial or legal advice.
            Always conduct independent due diligence including a physical inspection, legal title search,
            and formal valuation before purchasing.
          </div>
        </footer>
      </div>
    </>
  );
}
