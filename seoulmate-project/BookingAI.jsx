import { useState, useRef } from "react";
 
const C = {
  ink: "#0f0e0c", cream: "#f5f0e8", warm: "#f0e8d8",
  red: "#c0392b", gold: "#c9a84c", mid: "#8a8070",
  lightMid: "#d4cfc4", blue: "#1a3a5c",
};
 
const GF = `@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700;900&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@400;500;600;700&family=Space+Mono&display=swap');`;
 
const TOPICS = ["落地 · 生活（租房、銀行、簽證）","留學 · 語學堂","電商 · 韓貨 · 代購","整形 · 醫美","其他"];
const STAGES = ["還在台灣，正在規劃","快要出發了（一個月內）","已經在韓國"];
const METHODS = ["LINE（語音 / 視訊）","Zoom","都可以"];
const SLOTS = [
  { date: "週二 3/18", times: ["10:00","14:00","16:00"] },
  { date: "週三 3/19", times: ["11:00","15:00"] },
  { date: "週四 3/20", times: ["10:00","13:00","17:00"] },
  { date: "週五 3/21", times: ["10:00","14:00"] },
  { date: "週一 3/24", times: ["11:00","15:00","17:00"] },
];
const STEPS = ["填寫需求","選擇時間","付款","完成"];
 
// ─── Shared styles ────────────────────────────────────────────────────────────
const base = {
  page: { fontFamily:"'Outfit','Noto Serif TC',sans-serif", background:C.cream, minHeight:"100vh", color:C.ink },
  progress: { background:C.warm, borderBottom:`1px solid ${C.lightMid}`, padding:"1rem 2rem", display:"flex", alignItems:"center", position:"sticky", top:0, zIndex:10 },
  pLine: { flex:1, height:"1px", background:C.lightMid, margin:"0 0.4rem" },
  wrap: { maxWidth:"660px", margin:"0 auto", padding:"3.5rem 1.5rem" },
  h2: { fontFamily:"'Noto Serif TC',serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:900, letterSpacing:"-0.02em", marginBottom:"0.5rem" },
  sub: { fontSize:"0.88rem", color:C.mid, lineHeight:1.75, marginBottom:"2.5rem" },
  label: { display:"block", fontFamily:"'Space Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.mid, marginBottom:"0.4rem" },
  inp: (e) => ({ fontFamily:"'Outfit',sans-serif", fontSize:"0.92rem", color:C.ink, background:"white", border:`1.5px solid ${e?C.red:C.lightMid}`, padding:"0.75rem 1rem", width:"100%", outline:"none", display:"block" }),
  sel: (e) => ({ fontFamily:"'Outfit',sans-serif", fontSize:"0.92rem", color:C.ink, background:"white", border:`1.5px solid ${e?C.red:C.lightMid}`, padding:"0.75rem 1rem", width:"100%", outline:"none", appearance:"none", display:"block" }),
  ta: (e) => ({ fontFamily:"'Outfit',sans-serif", fontSize:"0.92rem", color:C.ink, background:"white", border:`1.5px solid ${e?C.red:C.lightMid}`, padding:"0.75rem 1rem", width:"100%", outline:"none", minHeight:"120px", resize:"vertical", display:"block" }),
  g: { marginBottom:"1.2rem" },
  row2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" },
  div: { height:"1px", background:C.lightMid, margin:"2rem 0" },
  btnRed: { fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.08em", textTransform:"uppercase", background:C.red, color:"white", border:"none", padding:"1rem 2.5rem", cursor:"pointer", display:"block", width:"100%", marginTop:"1.5rem" },
  btnInk: { fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.08em", textTransform:"uppercase", background:C.ink, color:C.cream, border:"none", padding:"1rem 2.5rem", cursor:"pointer", display:"block", width:"100%", marginTop:"1.5rem" },
  btnBack: { fontFamily:"'Space Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", background:"none", border:"none", color:C.mid, cursor:"pointer", padding:0, marginBottom:"2rem" },
  err: { fontSize:"0.7rem", color:C.red, marginTop:"0.3rem" },
  timeBtn: (s) => ({ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:"0.85rem", padding:"0.65rem 1.3rem", background:s?C.ink:"white", color:s?C.cream:C.ink, border:`1.5px solid ${s?C.ink:C.lightMid}`, cursor:"pointer" }),
};

// ...existing code...
