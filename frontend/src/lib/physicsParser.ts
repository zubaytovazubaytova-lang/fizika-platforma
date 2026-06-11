export interface KV  { raw: number; unit: string; si: number }
export interface Prob { v?: KV; s?: KV; t?: KV; find: 'v'|'s'|'t'|null }
export interface Sol  {
  given:    { sym: string; disp: string }[]
  find:     string
  formula:  string
  steps:    string[]
  answer:   { sym: string; val: number; unit: string; alt?: string }
  concepts: string[]
}

const _v = (n:number, u:string) =>
  /km\/(soat|h)/i.test(u)  ? n/3.6 :
  /km\/min/i.test(u)        ? n*1000/60 :
  /m\/min/i.test(u)         ? n/60 : n

const _s = (n:number, u:string) =>
  /\bkm\b/i.test(u) ? n*1000 :
  /sm|cm/i.test(u)  ? n/100  : n

const _t = (n:number, u:string) =>
  /soat|^h$/i.test(u)        ? n*3600 :
  /minut|min(?!\/)/i.test(u) ? n*60   : n

export const _f = (n:number, d=2) => parseFloat(n.toFixed(d))

/* ── unit aliases matched in text ── */
const VU = /km\/soat|km\/h|km\/min|m\/min|m\/sek(?:und)?|m\/s/i
const SU = /\bkm\b|\bkilometr\b|\bmetr\b|\bm\b(?!\/)|sm\b|cm\b/
const TU = /soat|daqiqa|minut(?:da)?|min(?!\/)\b|sekund(?:da)?|sek\b/i

function parseNum(s: string): number { return parseFloat(s.replace(',','.')) }

/* ── Uzbek morphology normalizer ─────────────────────────────────────────
   Strips case/possession suffixes so parsers see bare physics words/units.
   e.g. "metrni" → "metr", "tezgini" → "tezlik", "minutda" → "minut"
   ──────────────────────────────────────────────────────────────────────── */
function normalizeUzb(s: string): string {
  return s
    .replace(/\bkilometr\w*/gi,  'km')
    .replace(/\bmetr\w*/gi,      'metr')
    .replace(/\bminut\w*/gi,     'minut')
    .replace(/\bdaqiqa\w*/gi,    'daqiqa')
    .replace(/\bsekund\w*/gi,    'sekund')
    .replace(/\bsoat\w*/gi,      'soat')
    .replace(/\bmasofa\w*/gi,    'masofa')
    .replace(/\bvaqt\w*/gi,      'vaqt')
    .replace(/\byo[''`ʻ]?l\w*/gi, "yo'l")
    // tezlik variants: tezligi/tezligini/tezligin (possessive) → tezlik
    .replace(/\btezligi\w*/gi,   'tezlik')
    // tezgi/tezgini/tezgin (informal casual) → tezlik
    .replace(/\btezgi\w*/gi,     'tezlik')
    // tezlikni/tezlikda/etc. → tezlik
    .replace(/\btezlik\w*/gi,    'tezlik')
}

export function parseProblem(inputTxt: string): Prob {
  const txt = normalizeUzb(inputTxt)
  const p: Prob = { find: null }
  const low = txt.toLowerCase()

  /* ── 1. Extract velocity ── */
  // explicit: v = 5 m/s  OR  tezlik(i) = 5 m/s
  let m = txt.match(/(?:v|tezlik[^=]*?)\s*[=:]\s*(\d+(?:[.,]\d+)?)\s*(km\/soat|km\/h|km\/min|m\/min|m\/sek(?:und)?|m\/s)/i)
  if (!m) m = txt.match(/(\d+(?:[.,]\d+)?)\s*(km\/soat|km\/h|km\/min|m\/min|m\/sek(?:und)?|m\/s)/i)
  if (m) {
    const n = parseNum(m[1])
    const u = m[2].replace(/sek(und)?/i,'s').replace(/soat/i,'soat')
    p.v = { raw:n, unit:u, si:_v(n,u) }
  }

  /* ── 2. Extract distance ── */
  // explicit: s = 100 km  OR  masofa = 100 m
  let ms = txt.match(/(?:s|masofa|yo['`'ʻ‘’]?l)\s*[=:]\s*(\d+(?:[.,]\d+)?)\s*(km\b|kilometr\b|metr\b|m\b(?!\/)|sm\b|cm\b)/i)
  if (!ms) {
    // strip velocity unit so "2 m/s 100 m" doesn't grab "m/s" as distance
    const stripped = txt.replace(/\d+(?:[.,]\d+)?\s*(?:km\/soat|km\/h|km\/min|m\/min|m\/sek(?:und)?|m\/s)/gi,'')
    ms = stripped.match(/(\d+(?:[.,]\d+)?)\s*(km\b|kilometr\b|metr\b|(?<![\/\w])m(?![\/\w])|sm\b|cm\b)/i)
  }
  if (ms) {
    const n = parseNum(ms[1])
    const u = ms[2].toLowerCase().replace('kilometr','km').replace('metr','m')
    p.s = { raw:n, unit:u, si:_s(n,u) }
  }

  /* ── 3. Extract time ── */
  // explicit: t = 20 minut
  let mt = txt.match(/(?:t|vaqt)\s*[=:]\s*(\d+(?:[.,]\d+)?)\s*(soat|daqiqa|minut(?:da)?|min(?!\/)\b|sekund(?:da)?|sek\b)/i)
  if (!mt) mt = txt.match(/(\d+(?:[.,]\d+)?)\s*(soat|daqiqa|minut(?:da)?|min(?!\/)\b|sekund(?:da)?|sek\b)/i)
  if (mt) {
    const n = parseNum(mt[1])
    const raw = mt[2].toLowerCase().replace(/da$/,'').replace('daqiqa','minut')
    p.t = { raw:n, unit:raw, si:_t(n,raw) }
  }

  /* ── 4. Determine what to find ── */
  // explicit markers: v=? t=? s=?
  if (/\bt\s*[=\-]\s*\?/i.test(txt)) { p.find='t' }
  else if (/\bv\s*[=\-]\s*\?/i.test(txt)) { p.find='v' }
  else if (/\bs\s*[=\-]\s*\?/i.test(txt)) { p.find='s' }

  // keyword: what the problem is asking
  if (!p.find) {
    const ask = /toping|topilsin|hisoblang|hisobla|aniqlang|aniqla|qancha|necha/i
    if (
      /tezlik\w*\s+(?:toping|topilsin|hisoblang|hisobla|aniqlang|aniqla)/i.test(txt) ||
      /qancha\s+tezlik/i.test(txt) ||
      /tezligi\s+(?:necha|qancha)/i.test(txt)
    ) { p.find = 'v' }
    else if (
      /vaqt\w*\s+(?:toping|topilsin|hisoblang|hisobla|aniqlang|aniqla)/i.test(txt) ||
      /qancha\s+vaqt/i.test(txt) ||
      /necha\s+(?:soat|minut|sekund)/i.test(txt)
    ) { p.find = 't' }
    else if (
      /(?:masofa|yo['`'ʻ‘’]?l|yol|yul)\w*\s+(?:toping|topilsin|hisoblang|hisobla|aniqlang|aniqla)/i.test(txt) ||
      /qancha\s+(?:yo['`'ʻ‘’]?l|yol|yul|masofa)/i.test(txt) ||
      /necha\s+(?:km|metr|m\b)/i.test(txt) ||
      /necha\s+metr/i.test(txt) ||
      /qancha\s+(?:km|metr|m\b)/i.test(txt) ||
      /(?:yo['`'ʻ‘’]?l|yol|yul)\s+bos/i.test(txt)
    ) { p.find = 's' }
  }

  // final fallback by available values
  if (!p.find) {
    if      (p.v && p.t && !p.s) p.find = 's'
    else if (p.v && p.s && !p.t) p.find = 't'
    else if (p.s && p.t && !p.v) p.find = 'v'
  }

  return p
}

export function solveProblem(p: Prob): Sol | null {
  if (p.find==='s' && p.v && p.t) {
    const si = p.v.si * p.t.si
    const km = si / 1000
    return {
      given: [
        { sym:'v', disp:`${p.v.raw} ${p.v.unit} = ${_f(p.v.si,3)} m/s` },
        { sym:'t', disp:`${p.t.raw} ${p.t.unit} = ${_f(p.t.si,0)} s`   },
      ],
      find: "s — bosib o'tilgan masofa",
      formula: 's = v · t',
      steps: [
        `v = ${_f(p.v.si,4)} m/s`,
        `t = ${_f(p.t.si,0)} s`,
        `s = ${_f(p.v.si,4)} × ${_f(p.t.si,0)} = ${_f(si,1)} m`,
        km >= 0.5 ? `s ≈ ${_f(km,2)} km` : '',
      ].filter(Boolean),
      answer: { sym:'s', val:km>=1?_f(km,2):_f(si,1), unit:km>=1?'km':'m', alt:km>=1?`${_f(si,0)} m`:undefined },
      concepts: [
        "Tekis harakatda: s = v · t",
        "Tezlik × Vaqt = Masofa",
        `${p.v.raw} ${p.v.unit} = ${_f(p.v.si,3)} m/s`,
      ],
    }
  }

  if (p.find==='t' && p.v && p.s) {
    const si  = p.s.si / p.v.si
    const min = si / 60
    const h   = si / 3600
    const [dv, du] = h>=1 ? [h,'soat'] : min>=1 ? [min,'minut'] : [si,'sekund']
    return {
      given: [
        { sym:'v', disp:`${p.v.raw} ${p.v.unit} = ${_f(p.v.si,3)} m/s` },
        { sym:'s', disp:`${p.s.raw} ${p.s.unit} = ${_f(p.s.si,0)} m`   },
      ],
      find: "t — harakat vaqti",
      formula: 't = s / v',
      steps: [
        `s = ${_f(p.s.si,0)} m`,
        `v = ${_f(p.v.si,4)} m/s`,
        `t = ${_f(p.s.si,0)} / ${_f(p.v.si,4)} = ${_f(si,2)} s`,
        du !== 'sekund' ? `t ≈ ${_f(dv,2)} ${du}` : '',
      ].filter(Boolean),
      answer: { sym:'t', val:_f(dv,2), unit:du, alt:du!=='sekund'?`${_f(si,1)} s`:undefined },
      concepts: [
        "Tekis harakatda: t = s / v",
        "Masofa / Tezlik = Vaqt",
        `${_f(si,1)} s = ${_f(min,1)} min`,
      ],
    }
  }

  if (p.find==='v' && p.s && p.t) {
    const si  = p.s.si / p.t.si
    const kmh = si * 3.6
    return {
      given: [
        { sym:'s', disp:`${p.s.raw} ${p.s.unit} = ${_f(p.s.si,0)} m` },
        { sym:'t', disp:`${p.t.raw} ${p.t.unit} = ${_f(p.t.si,0)} s` },
      ],
      find: "v — harakat tezligi",
      formula: 'v = s / t',
      steps: [
        `s = ${_f(p.s.si,0)} m`,
        `t = ${_f(p.t.si,0)} s`,
        `v = ${_f(p.s.si,0)} / ${_f(p.t.si,0)} = ${_f(si,3)} m/s`,
        `v = ${_f(kmh,1)} km/soat`,
      ],
      answer: { sym:'v', val:_f(si,3), unit:'m/s', alt:`${_f(kmh,1)} km/soat` },
      concepts: [
        "Tekis harakatda: v = s / t",
        "Tezlik SI da m/s bilan o'lchanadi",
        `${_f(si,3)} m/s = ${_f(kmh,1)} km/soat`,
      ],
    }
  }

  return null
}

/* ── detect which moving object the problem talks about ──
   Maps keywords found in the problem text to a TezlikSim OBJECTS id,
   so the simulation shows/animates the body the masala is actually about
   (e.g. "Avtomobil ... yurdi" → 'car'), not whatever was picked before. */
const OBJ_KEYWORDS: { id: string; re: RegExp }[] = [
  { id: 'truck',    re: /\byuk\s*(?:mashina|avtomobil)\w*/i },
  { id: 'car',      re: /\b(?:avtomobil|avtomashina|mashina|avto)\w*/i },
  { id: 'moto',     re: /\bmotor?otsikl\w*/i },
  { id: 'bicycle',  re: /\bvelosiped\w*/i },
  { id: 'wolf',     re: /\bbo[''`ʻ]?ri\w*/i },
  { id: 'rabbit',   re: /\bquyon\w*/i },
  { id: 'ant',      re: /\bchumoli\w*/i },
  { id: 'snail',    re: /\bshilliq[qg]?urt\w*/i },
  { id: 'ship',     re: /\bkema\w*/i },
  { id: 'airplane', re: /\bsam[ao]lyot\w*/i },
  { id: 'heli',     re: /\bvert[ao]lyot\w*/i },
  { id: 'balloon',  re: /\bhavo\s*shar\w*/i },
  { id: 'human',    re: /\b(?:odam|piyoda|bola|qiz|yigit|sayohatchi|talaba|o['`'ʻ‘’]?quvchi)\w*/i },
]

export function detectObjectId(inputTxt: string): string | null {
  const txt = normalizeUzb(inputTxt)
  for (const { id, re } of OBJ_KEYWORDS) {
    if (re.test(txt)) return id
  }
  return null
}

export const PROB_EXAMPLES = [
  "Avtomobil 72 km/soat tezlikda 2 soat yurdi. Qancha yo'l bosdi?",
  "Velosiped 5 m/s tezlikda 300 metr masofa bosdi. Vaqt toping.",
  "Odam 4 km yo'l bosib o'tishga 1 soat sarfladi. Tezlikni toping.",
]
