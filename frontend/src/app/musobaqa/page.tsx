'use client'
import { useState, useEffect } from 'react'
import {
  Trophy, Clock, Users, Zap, Lock, ChevronRight,
  Medal, Star, Crown, Target, Calendar, X,
  CheckCircle, XCircle, Award, BookOpen, Flame, FlaskConical,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface Question { q: string; opts: string[]; ans: number }
interface Competition {
  id: number; title: string; subject: string; desc: string
  status: 'active' | 'upcoming' | 'ended'
  participants: number; maxParticipants: number
  duration: number; startDate: string; prize: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'olimpiada' | 'formula'
  questions: Question[]
}
interface LeaderEntry { rank: number; name: string; score: number; time: string; badge: string }

/* ── OLIMPIADA COMPETITIONS ── */
const OLIMPIADALAR: Competition[] = [
  {
    id: 1, title: 'Mexanika Olimpiadasi', subject: 'Kinematika va Dinamika', category: 'olimpiada',
    desc: "Newton qonunlari, kinematika va dinamikaga oid 10 ta savol. Har bir to'g'ri javob 10 ball.",
    status: 'active', participants: 48, maxParticipants: 100, duration: 45, startDate: 'Hozir aktiv',
    prize: '🥇 Sertifikat + Oltin nishon', difficulty: 'medium',
    questions: [
      { q: "Jism 36 km/soat tezlikda harakatlanmoqda. Bu necha m/s?", opts: ["36 m/s","3.6 m/s","10 m/s","100 m/s"], ans: 2 },
      { q: "Tezlanish 4 m/s², dastlabki tezlik 0. 5 soniyada qancha yo'l bosib o'tiladi?", opts: ["20 m","50 m","100 m","10 m"], ans: 1 },
      { q: "Massa 5 kg bo'lgan jismga 20 N kuch ta'sir etmoqda. Tezlanish qancha?", opts: ["100 m/s²","4 m/s²","25 m/s²","2 m/s²"], ans: 1 },
      { q: "Erkin tushayotgan jism 3 soniyada qancha yo'l bosib o'tadi? (g=10 m/s²)", opts: ["30 m","90 m","45 m","15 m"], ans: 2 },
      { q: "Newton'ning 2-qonuni formulasi?", opts: ["E = mc²","F = ma","p = mv","v = at"], ans: 1 },
      { q: "1000 kg li avtomobil 20 m/s tezlikda. Impulsi qancha?", opts: ["50 kg·m/s","20 000 kg·m/s","1 000 kg·m/s","200 000 kg·m/s"], ans: 1 },
      { q: "Gorizontal tashlanma jismning gorizontal tezligi qanday o'zgaradi?", opts: ["Ortadi","Kamayadi","O'zgarmaydi","Avval ortadi keyin kamayadi"], ans: 2 },
      { q: "Absolyut elastik to'qnashuvda nima saqlanadi?", opts: ["Faqat energiya","Faqat impuls","Impuls va kinetik energiya","Hech narsa"], ans: 2 },
      { q: "Qaysi harakatda tezlanish nolga teng?", opts: ["Tezlashgan","Sekinlashgan","Tekis chiziqli","Aylanma"], ans: 2 },
      { q: "Og'irlik kuchi formulasi?", opts: ["F = ma","G = mg","E = mgh","F = kx"], ans: 1 },
    ],
  },
  {
    id: 2, title: 'Elektr va Magnit', subject: 'Elektrodinamika', category: 'olimpiada',
    desc: "Ohm qonuni, rezistorlar, magnit maydon va elektromagnit induksiyaga oid 10 ta savol.",
    status: 'upcoming', participants: 12, maxParticipants: 80, duration: 60, startDate: '2026-yil 12-iyun',
    prize: '🥈 Kumush nishon', difficulty: 'hard',
    questions: [
      { q: "Ohm qonuni formulasi?", opts: ["P = UI","I = U/R","W = UIt","R = ρl/S"], ans: 1 },
      { q: "220 V va 100 Ω uchun tok kuchi?", opts: ["22 A","2.2 A","0.22 A","220 A"], ans: 1 },
      { q: "Ketma-ket 2 ta 6 Ω ning umumiy qarshiligi?", opts: ["3 Ω","12 Ω","6 Ω","1.5 Ω"], ans: 1 },
      { q: "Parallel 2 ta 10 Ω ning umumiy qarshiligi?", opts: ["20 Ω","10 Ω","5 Ω","2.5 Ω"], ans: 2 },
      { q: "Elektr zaryadning SI birligi?", opts: ["Amper","Volt","Kulon","Farad"], ans: 2 },
      { q: "60 W lampochka 220 V ga ulangan. Tok kuchi?", opts: ["3.67 A","0.27 A","13200 A","60 A"], ans: 1 },
      { q: "1 kWsoat necha Joule?", opts: ["1 000 J","3 600 J","3 600 000 J","1 000 000 J"], ans: 2 },
      { q: "Elektromagnit induksiyani kim kashf etgan?", opts: ["Amper","Faraday","Ohm","Volta"], ans: 1 },
      { q: "Tranzformatorning asosiy vazifasi?", opts: ["Tokni kuchaytirish","Kuchlanishni o'zgartirish","Energiyani saqlash","Qarshilikni o'zgartirish"], ans: 1 },
      { q: "Kondensator sig'imining birligi?", opts: ["Volt","Amper","Farad","Varaq"], ans: 2 },
    ],
  },
  {
    id: 3, title: 'Optika Bellashuvi', subject: "Geometrik va to'lqin optikasi", category: 'olimpiada',
    desc: "Yorug'likning qaytishi, sinishi, interferensiya va diffraktsiyaga oid 10 ta savol.",
    status: 'upcoming', participants: 5, maxParticipants: 60, duration: 30, startDate: '2026-yil 15-iyun',
    prize: '🥉 Bronza nishon', difficulty: 'easy',
    questions: [
      { q: "Yorug'likning vakuumdagi tezligi?", opts: ["3×10⁶ m/s","3×10⁸ m/s","3×10¹⁰ m/s","300 m/s"], ans: 1 },
      { q: "Tekis ko'zguda hosil bo'lgan tasvir?", opts: ["Haqiqiy, teskari","Virtual, to'g'ri","Haqiqiy, to'g'ri","Virtual, teskari"], ans: 1 },
      { q: "Linzaning optik kuchi birligi?", opts: ["Metr","Dioptri","Lux","Kandela"], ans: 1 },
      { q: "Oq nur prizmadan o'tganda hosil bo'ladi?", opts: ["Interferensiya","Diffraktsiya","Dispersion spektr","To'liq qaytish"], ans: 2 },
      { q: "To'liq ichki qaytish qachon bo'ladi?", opts: ["Burchak kritikdan kichik","Burchak kritikdan katta","Nur perpendikulyar tushganda","Har doim"], ans: 1 },
      { q: "Ko'z ko'radigan yorug'lik to'lqin uzunligi?", opts: ["100–200 nm","400–700 nm","700–1000 nm","1–10 nm"], ans: 1 },
      { q: "Yig'uvchi linza formulasi?", opts: ["n₁sinθ₁=n₂sinθ₂","1/f=1/d₀+1/dᵢ","P=hν","I=I₀cos²θ"], ans: 1 },
      { q: "Interferensiya qanday hodisa?", opts: ["Nur to'g'ri tarqalishi","Ikki kogerent to'lqin qo'shilishi","Sinish","Qaytish"], ans: 1 },
      { q: "Tushish va qaytish burchaklari?", opts: ["Tushish katta","Qaytish katta","Teng","Har doim 90°"], ans: 2 },
      { q: "Gipermetriya ko'z uchun qanday linza?", opts: ["Yig'uvchi (musbat)","Tarqatuvchi (manfiy)","Prizma","Kerak emas"], ans: 0 },
    ],
  },
  {
    id: 4, title: 'Termodinamika Kubogi', subject: 'Issiqlik va gaz qonunlari', category: 'olimpiada',
    desc: "Termodinamika qonunlari, gaz jarayonlari va kalorimetriyaga oid 10 ta savol. Tugagan.",
    status: 'ended', participants: 95, maxParticipants: 100, duration: 40, startDate: '2026-yil 1-iyun',
    prize: '🏆 Chempion kubogi', difficulty: 'hard',
    questions: [
      { q: "Termodinamikaning 1-qonuni?", opts: ["Entropiya ortadi","Energiya saqlanish va o'tish qonuni","0 K da harakat to'xtaydi","Issiqlik faqat issiqqadan sovuqqa"], ans: 1 },
      { q: "Izobar jarayon nima?", opts: ["T o'zgarmaydigan","P o'zgarmaydigan","V o'zgarmaydigan","Issiqlik almashinmaydigan"], ans: 1 },
      { q: "Ideal gaz holat tenglamasi?", opts: ["PV = nRT","E = mc²","F = kx","PV = const"], ans: 0 },
      { q: "Absolyut nol Kelvin?", opts: ["0 K","273 K","−100 K","100 K"], ans: 0 },
      { q: "Suvning qaynash temperaturasi 1 atm da?", opts: ["90°C","95°C","100°C","110°C"], ans: 2 },
      { q: "Izoterm jarayon qonuni?", opts: ["Charles","Boyl-Mariott","Gay-Lyussak","Stefan-Boltzmann"], ans: 1 },
      { q: "Gaz 3 barobar kengaydi, T=const. Bosim?", opts: ["3 barobar ortadi","3 barobar kamayadi","O'zgarmaydi","9 barobar kamayadi"], ans: 1 },
      { q: "1 kaloriya necha Joule?", opts: ["1 J","4.18 J","10 J","100 J"], ans: 1 },
      { q: "Entropiya nima?", opts: ["Ichki energiya","Issiqlik miqdori","Tartibsizlik o'lchovi","Bosim"], ans: 2 },
      { q: "Karno FIK formulasi?", opts: ["η=Q_h/Q_c","η=1−T_c/T_h","η=W/Q_c","η=T_h/T_c"], ans: 1 },
    ],
  },
]

/* ── FORMULA TESTS ── */
const FORMULA_TESTS: Competition[] = [
  {
    id: 11, title: 'Mexanika Formulalari', subject: 'Kinematika, Dinamika, Energiya', category: 'formula',
    desc: "Mexanika formulalarini bilasizmi? Kinematika, Newton qonunlari, energiya va impuls formulalari bo'yicha 20 ta savol.",
    status: 'active', participants: 234, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '📐 Mexanika ustasi', difficulty: 'medium',
    questions: [
      { q: "Tekis tezlashgan harakatda tezlik formulasi?", opts: ["v = v₀ + at","v = at²","v = v₀ - at","v = v₀/t"], ans: 0 },
      { q: "Yo'l formulasi (tezlashgan harakat, v₀=0)?", opts: ["s = at","s = v₀t","s = ½at²","s = at²"], ans: 2 },
      { q: "Og'irlik kuchi G = ?", opts: ["G = Fm","G = mg","G = m/g","G = ma"], ans: 1 },
      { q: "Kinetik energiya formulasi?", opts: ["Ek = mv","Ek = mv²/2","Ek = mgh","Ek = Fs"], ans: 1 },
      { q: "Potentsial energiya (h balandlikda) formulasi?", opts: ["Ep = mv²/2","Ep = mgh","Ep = Fv","Ep = at²/2"], ans: 1 },
      { q: "Jism impulsi formulasi p = ?", opts: ["p = ma","p = mv","p = Ft","p = mv²"], ans: 1 },
      { q: "Mexanik ish formulasi W = ?", opts: ["W = F/s","W = F·s·cosα","W = mv²/2","W = Pt"], ans: 1 },
      { q: "Quvvat formulasi P = ?", opts: ["P = W/t","P = Fv","Ikkalasi ham to'g'ri","P = F/v"], ans: 2 },
      { q: "Gravitatsiya qonuni F = ?", opts: ["F = Gm₁m₂/r","F = Gm₁m₂/r²","F = G(m₁+m₂)/r²","F = Gm/r"], ans: 1 },
      { q: "Erkin tushishda vaqt t da tezlik v = ?", opts: ["v = gt²","v = gt","v = ½gt²","v = 2gt"], ans: 1 },
      { q: "Erkin tushishda yo'l h = ?", opts: ["h = gt²","h = ½gt²","h = gt","h = 2gt²"], ans: 1 },
      { q: "Markazga intilma tezlanish a = ?", opts: ["a = v²r","a = v²/r","a = v/r","a = ω/r"], ans: 1 },
      { q: "Burchak tezligi ω = ?", opts: ["ω = 2πT","ω = 2π/T","ω = T/2π","ω = πT"], ans: 1 },
      { q: "Guk qonuni (elastik kuch) F = ?", opts: ["F = kx","F = k/x","F = kx²","F = x/k"], ans: 0 },
      { q: "Aylanma harakatda chiziqli tezlik v = ?", opts: ["v = ωr","v = ω/r","v = ω²r","v = r/ω"], ans: 0 },
      { q: "Impuls-kuch teoremasi: Ft = ?", opts: ["mv","mv²/2","Δp = mv₂−mv₁","Ikkalasi (a va c)"], ans: 3 },
      { q: "Birinchi kosmik tezlik v₁ = ?", opts: ["√(gR)","√(2gR)","gR","√(gR/2)"], ans: 0 },
      { q: "Mexanik energiya saqlanish qonuni: Ek₁ + Ep₁ = ?", opts: ["0","Ek₂ − Ep₂","Ek₂ + Ep₂","Ek₂·Ep₂"], ans: 2 },
      { q: "Davr T va chastota f orasidagi bog'liqlik?", opts: ["T = f","T = 1/f","T = 2πf","T = f²"], ans: 1 },
      { q: "To'lqin uzunligi λ = ?", opts: ["λ = f/v","λ = v/f","λ = v·f","λ = f²/v"], ans: 1 },
    ],
  },
  {
    id: 12, title: 'Termodinamika Formulalari', subject: 'Gaz qonunlari, Issiqlik, Jarayonlar', category: 'formula',
    desc: "Gaz holat tenglamasi, izojarayonlar, issiqlik miqdori va kalorimetriya formulalari — 20 ta savol.",
    status: 'active', participants: 189, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '🌡️ Termodinamika ustasi', difficulty: 'medium',
    questions: [
      { q: "Ideal gaz holat tenglamasi?", opts: ["PV = nRT","PV = NkT","Ikkalasi to'g'ri","PV = const"], ans: 2 },
      { q: "Boyl-Mariott qonuni (T=const): P₁V₁ = ?", opts: ["P₂/V₂","P₂V₂","P₂+V₂","V₂/P₂"], ans: 1 },
      { q: "Charles qonuni (P=const): V₁/T₁ = ?", opts: ["V₂·T₂","V₂/T₂","T₂/V₂","V₂−T₂"], ans: 1 },
      { q: "Gay-Lyussak qonuni (V=const): P₁/T₁ = ?", opts: ["P₂·T₂","T₂/P₂","P₂/T₂","P₂+T₂"], ans: 2 },
      { q: "Termodinamikaning 1-qonuni: ΔU = ?", opts: ["Q + A","Q − A","A − Q","Q·A"], ans: 1 },
      { q: "Issiqlik miqdori formulasi Q = ?", opts: ["Q = cm","Q = cmΔT","Q = cT","Q = mΔT"], ans: 1 },
      { q: "Absolyut temperatura: T = ?", opts: ["t + 273","t − 273","273 − t","t × 273"], ans: 0 },
      { q: "Karno tsikli FIK: η = ?", opts: ["1 − Q₂/Q₁","1 − T₂/T₁","Ikkalasi ham","T₁/T₂"], ans: 2 },
      { q: "Molekulalar o'rtacha kinetik energiyasi Ek = ?", opts: ["kT","3kT/2","kT/2","3kT"], ans: 1 },
      { q: "Erish issiqligi formulasi Q = ?", opts: ["Q = Lm","Q = λm","Q = cm","Q = qm"], ans: 1 },
      { q: "Bug'lanish issiqligi formulasi Q = ?", opts: ["Q = λm","Q = Lm","Q = cm","Q = rm"], ans: 1 },
      { q: "Yonish issiqligi formulasi Q = ?", opts: ["Q = qm","Q = q/m","Q = cm","Q = Lm"], ans: 0 },
      { q: "Chiziqli issiqlik kengayishi ΔL = ?", opts: ["ΔL = αLΔT","ΔL = αL/ΔT","ΔL = L·ΔT","ΔL = αΔT/L"], ans: 0 },
      { q: "Stefan-Boltzmann qonunida nur chiqarish quvvati W ∝ ?", opts: ["T²","T³","T⁴","T"], ans: 2 },
      { q: "Kalorimetriya tenglamasi (issiq+sovuq)?", opts: ["Q₁=Q₂","Q_beruvchi=Q_oluvchi","ΔQ=0","Barchasi to'g'ri"], ans: 3 },
      { q: "Gaz zichligi ρ = ?", opts: ["ρ = m/V","ρ = V/m","ρ = mg/V","ρ = m·V"], ans: 0 },
      { q: "Izoterm jarayonda bajarilgan ish A = ?", opts: ["A = 0","A = nRT·ln(V₂/V₁)","A = PΔV","A = nCᵥΔT"], ans: 1 },
      { q: "Izoxorik jarayonda bajarilgan ish A = ?", opts: ["A = PΔV","A = nRT","A = 0","A = ΔU"], ans: 2 },
      { q: "Entropiya o'zgarishi ΔS = ?", opts: ["ΔS = Q/T","ΔS = QT","ΔS = T/Q","ΔS = Q−T"], ans: 0 },
      { q: "Atmosfera bosimi birligi Pa necha N/m²?", opts: ["1 Pa = 1 N/m","1 Pa = 1 N/m²","1 Pa = 10 N/m²","1 Pa = 100 N/m²"], ans: 1 },
    ],
  },
  {
    id: 13, title: 'Elektrodinamika Formulalari', subject: 'Tok, Kuchlanish, Qarshilik, Quvvat', category: 'formula',
    desc: "Ohm qonuni, zanjir hisoblash, Joule-Lens, EYuK va elektr energiya formulalari — 20 ta savol.",
    status: 'active', participants: 312, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '⚡ Elektr ustasi', difficulty: 'hard',
    questions: [
      { q: "Ohm qonuni (zanjir qismi): I = ?", opts: ["I = U·R","I = U/R","I = R/U","I = U+R"], ans: 1 },
      { q: "To'liq zanjir Ohm qonuni: I = ?", opts: ["ε/R","ε/(R+r)","ε·r/R","ε/(R−r)"], ans: 1 },
      { q: "Elektr quvvat P = ?", opts: ["P = I/U","P = UI","P = U²·R","Faqat b to'g'ri"], ans: 1 },
      { q: "Joule-Lens qonuni Q = ?", opts: ["Q = I²Rt","Q = IR²t","Q = U²t/R","a va c ikkalasi ham"], ans: 3 },
      { q: "Rezistivlik: R = ?", opts: ["R = ρl/S","R = ρS/l","R = ρlS","R = l/ρS"], ans: 0 },
      { q: "Ketma-ket rezistorlar: Rₒᵤₜ = ?", opts: ["R₁·R₂","R₁+R₂","R₁R₂/(R₁+R₂)","1/R₁+1/R₂"], ans: 1 },
      { q: "Parallel rezistorlar: 1/Rₒᵤₜ = ?", opts: ["R₁+R₂","1/R₁+1/R₂","R₁R₂/(R₁+R₂)","1/(R₁+R₂)"], ans: 1 },
      { q: "Elektr energiya A = ?", opts: ["A = Pt","A = UIt","Ikkalasi ham","A = I²Rt"], ans: 2 },
      { q: "Kondensator sig'imi C = ?", opts: ["C = q/U","C = U/q","C = q·U","C = q²/U"], ans: 0 },
      { q: "Kondensatorda to'plangan energiya W = ?", opts: ["W = CU²","W = CU²/2","W = CU","W = C²U/2"], ans: 1 },
      { q: "Kulon qonuni F = ?", opts: ["kq₁q₂/r","kq₁q₂/r²","k(q₁+q₂)/r²","kq₁q₂·r²"], ans: 1 },
      { q: "Elektr maydoni kuchlanganligi E = ?", opts: ["E = F/q","E = F·q","E = q/F","E = F²/q"], ans: 0 },
      { q: "Potentsial: φ = ?", opts: ["kq/r²","kq/r","kq·r","q/r"], ans: 1 },
      { q: "Elektr o'tkazuvchanlik G = ?", opts: ["G = R","G = 1/R","G = R²","G = U/I"], ans: 1 },
      { q: "Tranzformator koeffitsienti k = ?", opts: ["U₁/U₂ = I₂/I₁ = N₁/N₂","U₁/U₂ = N₂/N₁","I₁/I₂ = N₁/N₂","Faqat b to'g'ri"], ans: 0 },
      { q: "Kapasitor reaktiv qarshiligi Xc = ?", opts: ["Xc = ωC","Xc = 1/(ωC)","Xc = ωC²","Xc = C/ω"], ans: 1 },
      { q: "Katushka reaktiv qarshiligi XL = ?", opts: ["XL = ωL","XL = 1/(ωL)","XL = ωL²","XL = L/ω"], ans: 0 },
      { q: "To'la qarshilik (impedans) Z = ?", opts: ["Z = R + X","Z = √(R² + X²)","Z = R·X","Z = R² + X²"], ans: 1 },
      { q: "O'zgaruvchan tokda quvvat P = ?", opts: ["P = UIcosφ","P = UI","P = UIsinφ","P = UI/cosφ"], ans: 0 },
      { q: "Elektr zaryadning saqlanish qonuni qaysi?", opts: ["q = It","Σqᵢ = const","q = CV","q = CU"], ans: 1 },
    ],
  },
  {
    id: 14, title: 'Magnit Maydoni Formulalari', subject: 'Amper, Lorents, Induksiya, Induktivlik', category: 'formula',
    desc: "Amper kuchi, Lorents kuchi, elektromagnit induksiya va o'z-o'zini induksiya formulalari — 20 ta savol.",
    status: 'active', participants: 156, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '🧲 Magnit ustasi', difficulty: 'hard',
    questions: [
      { q: "Amper kuchi F = ?", opts: ["F = BIl","F = BIlsinα","F = BIlcosα","F = B²Il"], ans: 1 },
      { q: "Lorents kuchi F = ?", opts: ["F = qvBcosα","F = qvBsinα","F = qvB","F = qB/v"], ans: 1 },
      { q: "Magnit oqimi Φ = ?", opts: ["Φ = BSsinα","Φ = BScosα","Φ = BS","Φ = B/S"], ans: 1 },
      { q: "Faraday elektromagnit induksiya qonuni |ε| = ?", opts: ["|ΔΦ/Δt|","ΔΦ·Δt","ΔΦ/ΔI","B·ΔS"], ans: 0 },
      { q: "O'z-o'zini induksiya EMF: ε = ?", opts: ["ε = −LΔI/Δt","ε = LI","ε = L/I","ε = LΔI·Δt"], ans: 0 },
      { q: "Katushkadagi energiya W = ?", opts: ["W = LI²","W = LI²/2","W = L²I/2","W = LI/2"], ans: 1 },
      { q: "Rezonans chastotasi ω₀ = ?", opts: ["ω₀ = 1/√(LC)","ω₀ = √(LC)","ω₀ = LC","ω₀ = 1/LC"], ans: 0 },
      { q: "Induktivlik birligi?", opts: ["Tesla","Weber","Henry","Farad"], ans: 2 },
      { q: "Magnit induksiya B birligi?", opts: ["Tesla","Weber","Henry","Oersted"], ans: 0 },
      { q: "Magnit oqimi birligi?", opts: ["Tesla","Weber","Henry","Amper"], ans: 1 },
      { q: "Amper kuchining yo'nalishi qaysi qoida bilan topiladi?", opts: ["O'ng qo'l","Chap qo'l","Lenz","Gimlet"], ans: 1 },
      { q: "Induksion tokning yo'nalishi qaysi qoida bilan topiladi?", opts: ["O'ng qo'l","Chap qo'l","Lenz","Amper"], ans: 2 },
      { q: "Elektromagnit to'lqin tezligi c = ?", opts: ["c = fλ","c = 3×10⁸ m/s","Ikkalasi ham","c = λ/f"], ans: 2 },
      { q: "Tranzformator: U₁/U₂ = ?", opts: ["I₁/I₂","N₁/N₂","I₂/I₁","N₂/N₁"], ans: 1 },
      { q: "Elektromagnit tebranish davri T = ?", opts: ["T = 2π√(LC)","T = 2π/√(LC)","T = √(LC)","T = 2πLC"], ans: 0 },
      { q: "Vakuumda B va H orasida: B = ?", opts: ["B = μ₀H","B = H/μ₀","B = μ₀H²","B = H"], ans: 0 },
      { q: "Katushka induktivligi L = ?", opts: ["L = μ₀N²S/l","L = μ₀NS/l","L = N²S/l","L = μ₀N²/Sl"], ans: 0 },
      { q: "O'zgaruvchan EMF: e = ?", opts: ["e = Emsinωt","e = Emcosωt","Ikkalasi (fazaga qarab)","e = Em/sinωt"], ans: 2 },
      { q: "O'zgaruvchan tok amplitudasi Im va effektiv qiymat I₀ orasidagi bog'liqlik?", opts: ["I₀ = Im","I₀ = Im/√2","I₀ = Im√2","I₀ = Im/2"], ans: 1 },
      { q: "Magnit maydoni ishi zaryadlangan zarraga (Lorents)?", opts: ["W = qvBd","W = 0 (doim)","W = qvB","W = Fd"], ans: 1 },
    ],
  },
  {
    id: 15, title: 'Optika Formulalari', subject: 'Qaytish, Sinish, Linzalar, To\'lqin optikasi', category: 'formula',
    desc: "Snell qonuni, linza va ko'zgu formulasi, interferensiya, diffraktsiya formulalari — 20 ta savol.",
    status: 'active', participants: 198, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '🔭 Optika ustasi', difficulty: 'easy',
    questions: [
      { q: "Yorug'lik tezligi formulasi c = ?", opts: ["c = λ/T","c = λf","Ikkalasi ham","c = f/λ"], ans: 2 },
      { q: "Snell (sinish) qonuni?", opts: ["n₁sinθ₁ = n₂cosθ₂","n₁sinθ₁ = n₂sinθ₂","n₁cosθ₁ = n₂sinθ₂","sinθ₁ = sinθ₂"], ans: 1 },
      { q: "Yig'uvchi linza formulasi?", opts: ["1/f = 1/d₀ + 1/dᵢ","1/f = 1/d₀ − 1/dᵢ","f = d₀ + dᵢ","f = d₀·dᵢ"], ans: 0 },
      { q: "Linzaning optik kuchi D = ?", opts: ["D = f","D = 1/f","D = f²","D = 2/f"], ans: 1 },
      { q: "Qo'shilgan linzalar umumiy kuchi D = ?", opts: ["D₁·D₂","D₁ + D₂","D₁ − D₂","1/(D₁+D₂)"], ans: 1 },
      { q: "Ko'zguda kattalashtirish Γ = ?", opts: ["Γ = a/b","Γ = |b/a|","Γ = f/a","Γ = a+b"], ans: 1 },
      { q: "Sferik ko'zgu formulasi: 1/a + 1/b = ?", opts: ["1/f","2/R","Ikkalasi ham (f=R/2)","a/b"], ans: 2 },
      { q: "Muhit sinish ko'rsatkichi n = ?", opts: ["n = c/v","n = v/c","n = c·v","n = 1/v"], ans: 0 },
      { q: "Shisha (n) dan havoga to'liq qaytish: sinθc = ?", opts: ["n","1/n","√(n−1)","n²"], ans: 1 },
      { q: "Diffraktsion panjara maksimumlar sharti?", opts: ["d·sinθ = mλ","d·cosθ = mλ","d·sinθ = (m+½)λ","d/sinθ = mλ"], ans: 0 },
      { q: "Young tajribasida interferensiya: ochiq pola Δ = ?", opts: ["mλ","(2m+1)λ/2","mλ/2","(m+1)λ"], ans: 0 },
      { q: "Malus qonuni (polyarizatsiya): I = ?", opts: ["I₀cosθ","I₀cos²θ","I₀sinθ","I₀/cos²θ"], ans: 1 },
      { q: "Brewster burchagi: tanθB = ?", opts: ["1/n","n","sinθB","cosθB"], ans: 1 },
      { q: "Telesko kattalashtirishi Γ = ?", opts: ["Γ = f₁/f₂","Γ = f₂/f₁","Γ = f₁·f₂","Γ = f₁+f₂"], ans: 0 },
      { q: "Mikroskop kattalashtirishi Γ = ?", opts: ["Γ = Γ₁/Γ₂","Γ = Γ₁ + Γ₂","Γ = Γ₁·Γ₂","Γ = Γ₂/Γ₁"], ans: 2 },
      { q: "Yorug'likning intensivligi I ∝ ?", opts: ["A (amplituda)","A² (kvadrat)","A³","√A"], ans: 1 },
      { q: "Nur optik yo'li: L = ?", opts: ["L = nl","L = l/n","L = n²l","L = l+n"], ans: 0 },
      { q: "Tekis ko'zguda tasvir masofasi?", opts: ["Predmetdan kichik","Predmetga teng","Predmetdan katta","Ko'zguga bog'liq"], ans: 1 },
      { q: "To'liq ichki qaytish sodir bo'ladigan muhit?", opts: ["Siyrak dan zich","Zich dan siyrak","Ikki tengli muhit","Havo dan shisha"], ans: 1 },
      { q: "Yorug'likning to'lqin uzunligi muhitda λn = ?", opts: ["λn = nλ₀","λn = λ₀/n","λn = λ₀·n²","λn = √n·λ₀"], ans: 1 },
    ],
  },
  {
    id: 16, title: 'Atom Fizikasi Formulalari', subject: 'Kvant, Radioaktivlik, Yadro', category: 'formula',
    desc: "Fotoeffekt, de Broyl, Bohr modeli, radioaktiv yemirilish va yadro energiyasi formulalari — 20 ta savol.",
    status: 'active', participants: 143, maxParticipants: 500, duration: 30, startDate: 'Har doim ochiq',
    prize: '⚛️ Atom fizikasi ustasi', difficulty: 'hard',
    questions: [
      { q: "Foton energiyasi E = ?", opts: ["E = hλ","E = hν","E = h/ν","E = ν/h"], ans: 1 },
      { q: "Fotoeffektning Eynshteyn formulasi: hν = ?", opts: ["A + Ek_max","A − Ek","Ek − A","A·Ek"], ans: 0 },
      { q: "Fotonning impulsi p = ?", opts: ["p = hν/c","p = h/λ","Ikkalasi ham","p = mc"], ans: 2 },
      { q: "De Broyl to'lqin uzunligi λ = ?", opts: ["λ = h/p","λ = h·p","λ = p/h","λ = h/mv (p=mv bo'lsa)"], ans: 0 },
      { q: "Radioaktiv yemirilish qonuni N = ?", opts: ["N = N₀e^(λt)","N = N₀e^(−λt)","N = N₀/t","N = N₀(1−e^(−λt))"], ans: 1 },
      { q: "Yarim yemirilish davri T₁/₂ = ?", opts: ["T₁/₂ = λ/ln2","T₁/₂ = ln2/λ","T₁/₂ = λ·ln2","T₁/₂ = 1/λ"], ans: 1 },
      { q: "Bohr modelida atom energiyasi Eₙ = ?", opts: ["E₁/n","E₁/n²","E₁·n²","E₁·n"], ans: 1 },
      { q: "Massa-energiya ekvivalentligi E = ?", opts: ["E = mc","E = mc²","E = m/c²","E = mc³"], ans: 1 },
      { q: "Bog'lanish energiyasi Ebog = ?", opts: ["Ebog = Δm·c²","Ebog = m·c","Ebog = Δm/c²","Ebog = mc²"], ans: 0 },
      { q: "Yadro massa soni A = ?", opts: ["A = Z + N (Z-proton, N-neytron)","A = Z − N","A = Z·N","A = Z/N"], ans: 0 },
      { q: "α-yemirilishda element o'zgarishi: Z→?, A→?", opts: ["Z−1, A−3","Z−2, A−4","Z+2, A+4","Z, A−4"], ans: 1 },
      { q: "β⁻-yemirilishda chiqadigan zarralar?", opts: ["Proton + neytron","Elektron + antineytrinо","Alfa zarracha","Foton"], ans: 1 },
      { q: "γ-nurlanish bu nima?", opts: ["Elektron oqimi","Alfa zarralar","Elektromagnit nurlanish","Proton oqimi"], ans: 2 },
      { q: "Radioaktivlik faoliyati A = ?", opts: ["A = λN","A = N·ln2/T₁/₂","Ikkalasi ham","A = N/λ"], ans: 2 },
      { q: "Plank konstantasi h ≈ ?", opts: ["6.626×10⁻³⁴ J·s","6.626×10⁻²⁴ J·s","6.626×10³⁴ J·s","6.626×10⁻¹⁴ J·s"], ans: 0 },
      { q: "Heizenberg noaniqlik prinsipi: Δx·Δp ≥ ?", opts: ["h","h/2","ħ/2","ħ"], ans: 2 },
      { q: "Elektron volt (eV) necha Joule?", opts: ["1.6×10⁻¹⁹ J","1.6×10⁻²⁴ J","9.1×10⁻³¹ J","1.67×10⁻²⁷ J"], ans: 0 },
      { q: "Fotoeffektda to'xtatuvchi potentsial: eVa = ?", opts: ["hν − A","hν + A","A − hν","hν·A"], ans: 0 },
      { q: "Lazer ishlash prinsipi asosida?", opts: ["Spontan nurlanish","Majburiy (induksiyalangan) nurlanish","Fotoeffekt","Radioaktivlik"], ans: 1 },
      { q: "Neytron massasi proton massasiga nisbatan qanday?", opts: ["Kichikroq","Taxminan teng","Ancha katta","2 barobar katta"], ans: 1 },
    ],
  },
]

const COMPETITIONS: Competition[] = [...OLIMPIADALAR, ...FORMULA_TESTS]

const LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: 'Alibek T.',  score: 98, time: '18:42', badge: '👑' },
  { rank: 2, name: 'Nodira K.',  score: 95, time: '21:05', badge: '🥇' },
  { rank: 3, name: 'Jasur M.',   score: 92, time: '23:17', badge: '🥈' },
  { rank: 4, name: 'Malika R.',  score: 89, time: '25:30', badge: '🥉' },
  { rank: 5, name: 'Otabek S.',  score: 87, time: '26:44', badge: '⭐' },
  { rank: 6, name: 'Zulfiya A.', score: 84, time: '28:12', badge: '⭐' },
  { rank: 7, name: 'Sherzod N.', score: 81, time: '29:58', badge: '⭐' },
]

const DIFF_COLOR = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' }
const DIFF_LABEL = { easy: 'Oson', medium: "O'rta", hard: 'Qiyin' }
const STATUS_CFG = {
  active:   { label: 'Aktiv',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
  upcoming: { label: 'Kutilmoqda', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  ended:    { label: 'Tugagan',    color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)' },
}

function knowledgeLevel(pct: number) {
  if (pct >= 90) return { label: "Olimpiada g'olibi", color: '#22c55e', icon: '🏆', desc: "Ajoyib! Siz eng yuqori darajaga erishdingiz." }
  if (pct >= 70) return { label: "Ilg'or daraja",     color: '#f59e0b', icon: '⭐', desc: "Yaxshi natija! Biroz mashq — va siz championga aylanasiz." }
  if (pct >= 50) return { label: "O'rta daraja",      color: '#7c3aed', icon: '📚', desc: "Yaxshi boshlanish. Ko'proq formulalarni takrorlang." }
  if (pct >= 30) return { label: "Boshlang'ich",      color: '#94a3b8', icon: '🔰', desc: "Asosiy formulalarni mustahkamlang va qayta urinib ko'ring." }
  return          { label: "Qayta urinib ko'ring",    color: '#ef4444', icon: '💪', desc: "Formulalar daftariga qarang va yana bir bor urining!" }
}

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/* ── COMPETITION MODAL ── */
function CompetitionModal({ comp, onClose, userName }: {
  comp: Competition
  onClose: (result?: { score: number; pct: number }) => void
  userName: string
}) {
  const [stage, setStage]     = useState<'intro' | 'test' | 'result'>('intro')
  const [qIdx, setQIdx]       = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(comp.questions.length).fill(null))
  const [selected, setSelected] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(comp.duration * 60)
  const [timeTaken, setTimeTaken] = useState(0)

  useEffect(() => {
    if (stage !== 'test') return
    const id = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(id); setStage('result'); return 0 } return t - 1 })
      setTimeTaken(t => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [stage])

  const goNext = () => {
    const upd = [...answers]; upd[qIdx] = selected; setAnswers(upd)
    if (qIdx + 1 < comp.questions.length) { setQIdx(qIdx + 1); setSelected(null) }
    else setStage('result')
  }

  const score = answers.filter((a, i) => a === comp.questions[i].ans).length
  const pct   = Math.round((score / comp.questions.length) * 100)
  const level = knowledgeLevel(pct)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={() => onClose()} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', background: 'rgba(8,15,30,0.98)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(91,33,182,0.1))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {comp.category === 'formula' ? <FlaskConical style={{ width: 16, height: 16, color: '#e9d5ff' }} /> : <Trophy style={{ width: 16, height: 16, color: '#fbbf24' }} />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{comp.title}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{comp.subject}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {stage === 'test' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)', border: `1px solid ${timeLeft < 60 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)'}`, color: timeLeft < 60 ? '#ef4444' : '#22c55e', fontSize: 13, fontWeight: 700 }}>
                <Clock style={{ width: 13, height: 13 }} />{fmtTime(timeLeft)}
              </div>
            )}
            <button onClick={() => onClose()} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>

        {/* INTRO */}
        {stage === 'intro' && (
          <div style={{ padding: 24 }}>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>{comp.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { icon: BookOpen, label: 'Savollar', val: `${comp.questions.length} ta` },
                { icon: Clock,    label: 'Vaqt',     val: `${comp.duration} daqiqa` },
                { icon: Award,    label: 'Mukofot',  val: comp.prize },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', textAlign: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: '#7c3aed', margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#fcd34d', lineHeight: 1.6 }}>
              ⚠️ Test boshlangandan so&apos;ng vaqt to&apos;xtamaydi. Har bir savolni diqqat bilan o&apos;qing.
            </div>
            {comp.status === 'ended' ? (
              <div style={{ textAlign: 'center', padding: '10px 0', fontSize: 13, color: '#64748b' }}>Bu musobaqa tugagan.</div>
            ) : (
              <button onClick={() => setStage('test')} style={{ width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 800, color: '#fff', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.5)' }}>
                🚀 Testni boshlash
              </button>
            )}
          </div>
        )}

        {/* TEST */}
        {stage === 'test' && (
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                <span>Savol {qIdx + 1} / {comp.questions.length}</span>
                <span>{Math.round((qIdx / comp.questions.length) * 100)}% bajarildi</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                <div style={{ height: '100%', borderRadius: 99, width: `${(qIdx / comp.questions.length) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7)', transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 7, flexWrap: 'wrap' }}>
                {comp.questions.map((_, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < qIdx ? '#7c3aed' : i === qIdx ? '#a855f7' : 'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '16px 18px', marginBottom: 18 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.6 }}>{comp.questions[qIdx].q}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {comp.questions[qIdx].opts.map((opt, i) => {
                const sel = selected === i
                return (
                  <button key={i} onClick={() => setSelected(i)} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: sel ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)', border: `2px solid ${sel ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`, color: sel ? '#e9d5ff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? '#7c3aed' : 'rgba(255,255,255,0.06)', color: sel ? '#fff' : '#475569' }}>
                      {['A','B','C','D'][i]}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            <button onClick={goNext} disabled={selected === null} style={{ width: '100%', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, color: selected === null ? '#475569' : '#fff', border: 'none', cursor: selected === null ? 'not-allowed' : 'pointer', background: selected === null ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#7c3aed,#a855f7)', transition: 'all 0.2s' }}>
              {qIdx + 1 < comp.questions.length ? 'Keyingisi →' : '✅ Javoblarni yuborish'}
            </button>
          </div>
        )}

        {/* RESULT */}
        {stage === 'result' && (
          <div style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 44, marginBottom: 6 }}>{level.icon}</div>
              <div style={{ fontSize: 50, fontWeight: 900, color: level.color, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{score}/{comp.questions.length} to&apos;g&apos;ri javob</div>
              <div style={{ display: 'inline-block', marginTop: 10, padding: '5px 18px', borderRadius: 20, background: level.color + '18', border: `1px solid ${level.color}30`, fontSize: 13, fontWeight: 700, color: level.color }}>{level.label}</div>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, lineHeight: 1.6 }}>{level.desc}</p>
              {userName && <div style={{ fontSize: 12, color: '#7c3aed', marginTop: 4 }}>👤 {userName}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
              {[
                { label: "To'g'ri", val: `${score}`, color: '#22c55e', icon: CheckCircle },
                { label: "Noto'g'ri", val: `${comp.questions.length - score}`, color: '#ef4444', icon: XCircle },
                { label: 'Vaqt', val: fmtTime(timeTaken), color: '#f59e0b', icon: Clock },
              ].map(({ label, val, color, icon: Icon }) => (
                <div key={label} style={{ background: color + '10', border: `1px solid ${color}25`, borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                  <Icon style={{ width: 16, height: 16, color, margin: '0 auto 5px' }} />
                  <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Savollar tahlili</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
                {comp.questions.map((q, i) => {
                  const ua = answers[i]; const ok = ua === q.ans
                  return (
                    <div key={i} style={{ background: ok ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10, padding: '8px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        {ok ? <CheckCircle style={{ width: 14, height: 14, color: '#22c55e', flexShrink: 0, marginTop: 2 }} /> : <XCircle style={{ width: 14, height: 14, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />}
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 2 }}>{i + 1}. {q.q}</div>
                          {!ok && <div style={{ fontSize: 11, color: '#22c55e' }}>✓ {q.opts[q.ans]}</div>}
                          {ua === null && <div style={{ fontSize: 11, color: '#f59e0b' }}>⏰ Javob berilmadi</div>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setStage('intro'); setAnswers(Array(comp.questions.length).fill(null)); setSelected(null); setQIdx(0); setTimeLeft(comp.duration * 60); setTimeTaken(0) }}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#a78bfa', cursor: 'pointer', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)' }}>
                🔄 Qayta
              </button>
              <button onClick={() => onClose({ score, pct })}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none' }}>
                ✅ Tugatish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── REGISTER MODAL ── */
function RegisterModal({ comp, onClose }: { comp: Competition; onClose: () => void }) {
  const [done, setDone] = useState(false)
  const confirm = () => {
    const regs: number[] = JSON.parse(localStorage.getItem('musobaqa_regs') || '[]')
    if (!regs.includes(comp.id)) regs.push(comp.id)
    localStorage.setItem('musobaqa_regs', JSON.stringify(regs))
    setDone(true)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: 'rgba(8,15,30,0.98)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 22, padding: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
        {!done ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px' }}>Ro&apos;yxatdan o&apos;tish</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}><span style={{ color: '#e9d5ff', fontWeight: 600 }}>{comp.title}</span> ga qo&apos;shilmoqchimisiz?</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
              {[['Sana', comp.startDate], ['Vaqt', `${comp.duration} daqiqa`], ['Savollar', `${comp.questions.length} ta`], ['Mukofot', comp.prize]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{l}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={confirm} style={{ width: '100%', padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>✅ Tasdiqlash</button>
            <button onClick={onClose} style={{ width: '100%', marginTop: 6, padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#64748b', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', background: 'transparent' }}>Bekor qilish</button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#22c55e', margin: '0 0 8px' }}>Ro&apos;yxatdan o&apos;tdingiz!</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}><span style={{ color: '#e9d5ff', fontWeight: 600 }}>{comp.title}</span> boshlanishida xabar beriladi.</p>
            <button onClick={onClose} style={{ padding: '11px 28px', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>Yopish</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── MAIN PAGE ── */
export default function MusobaqaPage() {
  const user = useAuthStore(s => s.user)
  const [catTab,  setCatTab]  = useState<'all' | 'olimpiada' | 'formula'>('all')
  const [statTab, setStatTab] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all')
  const [testComp, setTestComp] = useState<Competition | null>(null)
  const [regComp,  setRegComp]  = useState<Competition | null>(null)
  const [regs,     setRegs]     = useState<number[]>([])
  const [myResults, setMyResults] = useState<Record<number, { score: number; pct: number }>>({})

  useEffect(() => {
    setRegs(JSON.parse(localStorage.getItem('musobaqa_regs') || '[]'))
    setMyResults(JSON.parse(localStorage.getItem('musobaqa_results') || '{}'))
  }, [])

  const handleClose = (result?: { score: number; pct: number }) => {
    if (result && testComp) {
      const upd = { ...myResults, [testComp.id]: result }
      setMyResults(upd)
      localStorage.setItem('musobaqa_results', JSON.stringify(upd))
    }
    setTestComp(null)
  }

  const filtered = COMPETITIONS
    .filter(c => catTab === 'all' || c.category === catTab)
    .filter(c => statTab === 'all' || c.status === statTab)

  const myBest = Math.max(0, ...Object.values(myResults).map(r => r.pct))
  const participated = Object.keys(myResults).length
  const bestRank = myBest >= 90 ? '#1–3' : myBest >= 70 ? '#4–10' : myBest >= 50 ? '#11–20' : myBest > 0 ? '#20+' : '—'
  const userName = user ? (`${user.first_name ?? ''} ${user.last_name ?? ''}`).trim() || (user as { username?: string }).username || '' : ''

  return (
    <div style={{ minHeight: '100vh', background: '#060d18', color: '#fff', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15) 0%,transparent 60%)', borderBottom: '1px solid rgba(124,58,237,0.18)', padding: '36px 24px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 0 24px rgba(124,58,237,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy style={{ width: 24, height: 24, color: '#fbbf24' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Musobaqa Maydoni</h1>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Olimpiadalar va formula testlari</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Olimpiadalar',    value: '4',    icon: Trophy,       color: '#f59e0b' },
              { label: 'Formula testlar', value: '6',    icon: FlaskConical, color: '#a855f7' },
              { label: 'Ishtirokchilar',  value: '1200+', icon: Users,        color: '#22c55e' },
              { label: 'Bilim darajasi',  value: '5',    icon: Flame,        color: '#7c3aed' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 16px' }}>
                <Icon style={{ width: 16, height: 16, color }} />
                <span style={{ fontSize: 18, fontWeight: 800, color }}>{value}</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {([['all','Barchasi',null],['olimpiada','🏆 Olimpiadalar',null],['formula','📐 Formula testlari',null]] as const).map(([val, label]) => {
              const active = catTab === val
              return (
                <button key={val} onClick={() => setCatTab(val)} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', background: active ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)', border: active ? '1.5px solid rgba(168,85,247,0.6)' : '1px solid rgba(255,255,255,0.08)', color: active ? '#e9d5ff' : '#94a3b8' }}>
                  {label}
                </button>
              )
            })}
          </div>
          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 18 }}>
            {(['all','active','upcoming','ended'] as const).map(t => {
              const labels = { all: 'Barchasi', active: 'Aktiv', upcoming: 'Kutilmoqda', ended: 'Tugagan' }
              const active = t === statTab
              return (
                <button key={t} onClick={() => setStatTab(t)} style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.06)', color: active ? '#c4b5fd' : '#64748b' }}>
                  {labels[t]}
                </button>
              )
            })}
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: 14 }}>Bu filtr bo&apos;yicha musobaqa topilmadi</div>
            )}
            {filtered.map(comp => {
              const st = STATUS_CFG[comp.status]
              const fill = Math.round((comp.participants / comp.maxParticipants) * 100)
              const isEnded = comp.status === 'ended'
              const isReg   = regs.includes(comp.id)
              const myRes   = myResults[comp.id]
              const isFormula = comp.category === 'formula'
              return (
                <div key={comp.id} style={{
                  background: isFormula ? 'rgba(124,58,237,0.04)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${comp.status === 'active' ? (isFormula ? 'rgba(124,58,237,0.25)' : 'rgba(34,197,94,0.25)') : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 14, padding: '18px 20px',
                  boxShadow: comp.status === 'active' && !isFormula ? '0 0 16px rgba(34,197,94,0.05)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                          {comp.status === 'active' && '● '}{st.label}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: DIFF_COLOR[comp.difficulty], background: DIFF_COLOR[comp.difficulty] + '15', border: `1px solid ${DIFF_COLOR[comp.difficulty]}25` }}>
                          {DIFF_LABEL[comp.difficulty]}
                        </span>
                        {isFormula && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: '#a78bfa', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                            📐 Formula testi
                          </span>
                        )}
                        {isReg && !isEnded && !isFormula && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>✓ Ro&apos;yxatdan o&apos;tilgan</span>
                        )}
                        {myRes && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, color: knowledgeLevel(myRes.pct).color, background: knowledgeLevel(myRes.pct).color + '15', border: `1px solid ${knowledgeLevel(myRes.pct).color}25` }}>
                            {knowledgeLevel(myRes.pct).icon} {myRes.pct}%
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 3px', color: '#f1f5f9' }}>{comp.title}</h3>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{comp.subject}</p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      {isEnded ? (
                        <button onClick={() => setTestComp(comp)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(100,116,139,0.12)', border: '1px solid rgba(100,116,139,0.25)', color: '#94a3b8' }}>
                          <Lock style={{ width: 12, height: 12 }} />Natijalar
                        </button>
                      ) : isFormula || comp.status === 'active' ? (
                        <button onClick={() => setTestComp(comp)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: isFormula ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', color: '#fff', boxShadow: `0 3px 12px ${isFormula ? 'rgba(124,58,237,0.35)' : 'rgba(34,197,94,0.3)'}` }}>
                          {isFormula ? <FlaskConical style={{ width: 12, height: 12 }} /> : <Zap style={{ width: 12, height: 12 }} />}
                          {isFormula ? 'Boshlash' : 'Qatnashish'}
                        </button>
                      ) : isReg ? (
                        <button onClick={() => setTestComp(comp)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}>
                          <CheckCircle style={{ width: 12, height: 12 }} />Mashq
                        </button>
                      ) : (
                        <button onClick={() => setRegComp(comp)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', border: 'none', color: '#fff', boxShadow: '0 3px 12px rgba(124,58,237,0.3)' }}>
                          <ChevronRight style={{ width: 12, height: 12 }} />Ro&apos;yxat
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}><Clock style={{ width: 12, height: 12 }} />{comp.duration} daqiqa</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}><BookOpen style={{ width: 12, height: 12 }} />{comp.questions.length} savol</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}><Users style={{ width: 12, height: 12 }} />{comp.participants}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#94a3b8' }}><Calendar style={{ width: 12, height: 12 }} />{comp.startDate}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#fbbf24' }}><Trophy style={{ width: 12, height: 12 }} />{comp.prize}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: '#475569' }}>
                      <span>Ishtirokchilar</span><span>{fill}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
                      <div style={{ height: '100%', borderRadius: 99, width: `${fill}%`, background: isFormula ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : comp.status === 'active' ? 'linear-gradient(90deg,#22c55e,#86efac)' : comp.status === 'ended' ? 'linear-gradient(90deg,#475569,#64748b)' : 'linear-gradient(90deg,#7c3aed,#a78bfa)', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(91,33,182,0.2))', borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Crown style={{ width: 16, height: 16, color: '#fbbf24' }} />
              <span style={{ fontWeight: 800, fontSize: 13 }}>Termodinamika Kubogi</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {LEADERBOARD.map(({ rank, name, score, time, badge }) => (
                <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: rank <= 3 ? `rgba(124,58,237,${0.07 - rank * 0.02})` : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 13 }}>{badge}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: rank <= 3 ? 700 : 500, color: rank <= 3 ? '#e9d5ff' : '#94a3b8' }}>{name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#22c55e' }}>{score}%</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>{time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button style={{ width: '100%', padding: '7px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Medal style={{ width: 12, height: 12 }} />To&apos;liq reyting
              </button>
            </div>
          </div>

          {/* My stats */}
          <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Target style={{ width: 14, height: 14, color: '#7c3aed' }} />
              <span style={{ fontWeight: 700, fontSize: 13 }}>{userName ? `${userName} natijalari` : 'Mening natijam'}</span>
            </div>
            {[
              { label: 'Qatnashilgan', val: participated > 0 ? String(participated) : '0', icon: Trophy },
              { label: 'Eng yaxshi ball', val: myBest > 0 ? `${myBest}%` : '—', icon: Star },
              { label: "Reyting o'rni", val: bestRank, icon: Medal },
            ].map(({ label, val, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}><Icon style={{ width: 11, height: 11 }} />{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{val}</span>
              </div>
            ))}
            {myBest > 0 && (() => {
              const lv = knowledgeLevel(myBest)
              return (
                <div style={{ marginTop: 12, padding: '9px 12px', borderRadius: 10, background: lv.color + '12', border: `1px solid ${lv.color}25`, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, marginBottom: 3 }}>{lv.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: lv.color }}>{lv.label}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Sizning bilim darajangiz</div>
                </div>
              )
            })()}
            {participated === 0 && (
              <div style={{ marginTop: 12, padding: '10px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', textAlign: 'center', fontSize: 11, color: '#7c3aed', lineHeight: 1.5 }}>
                🎯 Formula testlarini boshlang va bilim darajangizni aniqlang!
              </div>
            )}
          </div>
        </div>
      </div>

      {testComp && <CompetitionModal comp={testComp} onClose={handleClose} userName={userName} />}
      {regComp  && <RegisterModal comp={regComp} onClose={() => { setRegs(JSON.parse(localStorage.getItem('musobaqa_regs') || '[]')); setRegComp(null) }} />}
    </div>
  )
}
