'use client'
import { useState } from 'react'
import { Telescope, Zap, FlaskConical, Calendar, Trophy, User, ChevronRight } from 'lucide-react'

type Tab = 'ixtirolar' | 'tajribalar' | 'sanalar' | 'olimlar' | 'rekordlar'

/* ══════════ DATA ══════════ */
interface Invention {
  id: number; emoji: string; name: string; inventor: string
  year: number; country: string; color: string
  front: string; back: string; tags: string[]
}

const INVENTIONS: Invention[] = [
  {
    id:1, emoji:'🚗', name:'Avtomobil', inventor:'Karl Benz', year:1885, country:'Germaniya',
    color:'#ef4444',
    front:'Dunyodagi birinchi benzinli avtomobil',
    back:'Karl Benz 1885-yilda "Benz Patent-Motorwagen"ni yaratdi — ichki yonuv dvigateli bilan ishlagan birinchi avtomobil. U 3 g\'ildirakli bo\'lib, 0.75 ot kuchiga ega edi. Tezligi soatiga 16 km ga yetardi.',
    tags:['Transport','Mexanika','Muhandislik'],
  },
  {
    id:2, emoji:'📺', name:'Televizor', inventor:'John Logie Baird', year:1926, country:'Shotlandiya',
    color:'#8b5cf6',
    front:'Birinchi marta harakatlanuvchi tasvir efirga uzatildi',
    back:'1926-yil 26-yanvarda Jon Beird London\'da birinchi televizion namoyishni o\'tkazdi. U mexanik skanerlash usulidan foydalangan. Dastlabki tasvirlar juda past sifatli bo\'lsa-da, bu kashfiyot zamonaviy televizion texnologiyaning asosi bo\'ldi.',
    tags:['Elektrotexnika','Optika','Signal'],
  },
  {
    id:3, emoji:'💻', name:'Kompyuter (ENIAC)', inventor:'Eckert va Mauchly', year:1946, country:'AQSh',
    color:'#06b6d4',
    front:'Birinchi universal elektron kompyuter',
    back:'ENIAC (Electronic Numerical Integrator and Computer) 1946-yilda Pensilvaniya universitetida yaratildi. 18 000 vakuum trubka ishlatilgan, vazni 27 tonna, maydoni 167 m² ga ega edi. Har sekundda 5 000 ta qo\'shish amalini bajara olardi.',
    tags:['Elektronika','Raqamli texnologiya','Matematik'],
  },
  {
    id:4, emoji:'✈️', name:'Samolyot', inventor:'Rait birodarlar', year:1903, country:'AQSh',
    color:'#34D399',
    front:'Inson birinchi marta qushday uchdi',
    back:'1903-yil 17-dekabrda Orville va Wilbur Wright Shimoliy Karolinada birinchi motorli uchishni amalga oshirdi. Birinchi parvoz atigi 12 soniya davom etdi va 36 metr masofani bosib o\'tdi. To\'rtinchi uchishda 59 soniyada 260 metr o\'tdi.',
    tags:['Aerodinamika','Mexanika','Muhandislik'],
  },
  {
    id:5, emoji:'📞', name:'Telefon', inventor:'Alexander Graham Bell', year:1876, country:'AQSh',
    color:'#f59e0b',
    front:'Ovozni elektr orqali uzatish mumkin ekanligi isbotlandi',
    back:'1876-yil 10-martda Bell o\'z yordamchisiga: "Bay Watson, bu yerga kel, sizga kerak" degan birinchi telefon qo\'ng\'irog\'ini amalga oshirdi. U "Photophone" ham ixtiro qilgan — zamonaviy optik tolali aloqaning otasi hisoblanadi.',
    tags:['Elektrotexnika','Akustika','Aloqa'],
  },
  {
    id:6, emoji:'⚡', name:'Elektromagnit induksiya', inventor:'Maykl Faradey', year:1831, country:'Buyuk Britaniya',
    color:'#ec4899',
    front:'Elektr tokini magnit orqali hosil qilish mumkin',
    back:'Faradey 1831-yilda magnitning harakatlanishi elektr toki hosil qilishini kashf etdi. Bu kashfiyot generator va transformatorning ixtiro qilinishiga olib keldi. Bugungi kunda dunyodagi barcha elektr energiyasining 99% Faradey kashfiyotiga asoslanadi.',
    tags:['Elektr','Magnit','Energiya'],
  },
  {
    id:7, emoji:'☢️', name:'Radioaktivlik', inventor:'Mari Kyuri', year:1898, country:'Polsha/Fransiya',
    color:'#10b981',
    front:'Atomlar o\'z-o\'zidan nurlanishi kashf etildi',
    back:'Mari Kyuri 1898-yilda poliy va radiy elementlarini kashf etdi va "radioaktivlik" atamasini kiritdi. U Nobel mukofotini ikki marta olgan — fizika (1903) va kimyo (1911) sohasida. Uning kashfiyotlari tibbiyotda rentgen va onkologiya davolanishiga asos bo\'ldi.',
    tags:['Yadro fizikasi','Kimyo','Tibbiyot'],
  },
  {
    id:8, emoji:'🍎', name:'Tortishish qonuni', inventor:'Isaak Nyuton', year:1687, country:'Buyuk Britaniya',
    color:'#a78bfa',
    front:'Koinotdagi barcha jismlar bir-birini tortadi',
    back:'1687-yilda Nyuton "Naturalis Principia Mathematica" asarini nashr etdi. Afsonaviy olmaning tushishi unga ilhom bergan. Tortishish qonuni F = Gm₁m₂/r² formulasi bilan ifodalanadi. Bu kashfiyot astronomiyani inqilob qildi va kosmik parvozlarni mumkin qildi.',
    tags:['Mexanika','Gravitatsiya','Astronomiya'],
  },
  {
    id:9, emoji:'💡', name:'Elektr chiroq', inventor:'Thomas Edison', year:1879, country:'AQSh',
    color:'#fbbf24',
    front:'Insoniyat tunni yoritishga muvaffaq bo\'ldi',
    back:'1879-yil 22-oktyabrda Edison 13 soat yongan elektr chiroqni namoyish qildi. U 1000 dan ortiq materiallarni sinab ko\'rgandan so\'ng volfram sim topdi. Edison yana 1 000 dan ortiq ixtirogar — fonograf, kinokamera va ko\'p narsalarni ixtiro qilgan.',
    tags:['Elektrotexnika','Issiqlik','Nurlanish'],
  },
  {
    id:10, emoji:'🔭', name:'Teleskop (optik)', inventor:'Galiley Galiley', year:1609, country:'Italiya',
    color:'#60a5fa',
    front:'Inson birinchi marta yulduzlarni yaqindan ko\'rdi',
    back:'1609-yilda Galiley Gollandiya ixtirochisining teleskopi haqida eshitib, o\'zi 8× kattalashtiruvchi asbob yasadi. Oyning krateri, Yupiterning yo\'ldoshlari va Somon yo\'lini kashf etdi. Teleskop orqali Kopernik gелиotsentrik nazariyasini tasdiqladi.',
    tags:['Optika','Astronomiya','Ko\'rish'],
  },
  {
    id:11, emoji:'🧪', name:'Penitsillin', inventor:'Alexander Fleming', year:1928, country:'Shotlandiya',
    color:'#34d399',
    front:'Birinchi antibiotik tasodifan kashf etildi',
    back:'1928-yilda Fleming laboratoriyasiga qoldirilgan petri idishida mog\'or o\'sganini va atrofidagi bakteriyalar o\'lganini payqadi. Penitsillin milliarda hayot qutqargan birinchi antibiotik bo\'ldi. Ikkinchi jahon urushida minglab askarlar hayoti saqlab qolindi.',
    tags:['Biologiya','Kimyo','Tibbiyot'],
  },
  {
    id:12, emoji:'🚂', name:'Bug\' dvigateli', inventor:'James Watt', year:1769, country:'Shotlandiya',
    color:'#f97316',
    front:'Sanoat inqilobining asosi yaratildi',
    back:'James Watt 1769-yilda samarali bug\' dvigatelini patentladi. U kondensatorni alohida qilib, bug\' isrofini kamaytirdi va quvvatni 4 baravardan ko\'proq oshirdi. "Vatt" — quvvat o\'lchov birligi uning sharafiga nomlangan. Sanoat inqilobini boshlab berdi.',
    tags:['Termodinamika','Mexanika','Muhandislik'],
  },
]

/* ── Experiments ── */
interface Experiment {
  id: number; emoji: string; name: string; scientist: string
  year: string; color: string; desc: string; result: string; difficulty: string
}

const EXPERIMENTS: Experiment[] = [
  {
    id:1, emoji:'🏀', name:'Galileyning sharlari tajribasi', scientist:'Galiley Galiley', year:'~1590',
    color:'#ef4444',
    desc:'Piza minorasi ustidan turli og\'irlikdagi sharlar tushirildi',
    result:'Barcha jismlar havo qarshiligi bo\'lmasa bir xil tezlanish bilan tushadi (g ≈ 9.8 m/s²)',
    difficulty:'Boshlang\'ich',
  },
  {
    id:2, emoji:'🐱', name:'Shredinger\'ning mushuki', scientist:'Ervin Shredinger', year:'1935',
    color:'#8b5cf6',
    desc:'Kvant superpozitsiya prinsipi absurdligi ko\'rsatildi (fikriy tajriba)',
    result:'Kvant mexanikasida zarralar o\'lchangunicha bir vaqtda bir necha holatda bo\'lishi mumkin',
    difficulty:'Yuqori',
  },
  {
    id:3, emoji:'🌊', name:'Ikki tirqish tajribasi', scientist:'Thomas Yang', year:'1801',
    color:'#06b6d4',
    desc:'Yorug\'lik ikki tirqishdan o\'tkazildi — ekranda interferensiya ko\'rildi',
    result:'Yorug\'lik to\'lqin xususiyatiga ega. Keyinchalik elektronlar ham shu xossani ko\'rsatdi',
    difficulty:'O\'rta',
  },
  {
    id:4, emoji:'🧲', name:'Oersted tajribasi', scientist:'Hans Christian Oersted', year:'1820',
    color:'#34D399',
    desc:'Elektr toki oqayotgan sim yonidagi kompas ignasi og\'di',
    result:'Elektr toki magnit maydon hosil qiladi — elektromagnetizm asosi',
    difficulty:'Boshlang\'ich',
  },
  {
    id:5, emoji:'💡', name:'Milliken\'ning yog\' tomchi tajribasi', scientist:'Robert Milliken', year:'1909',
    color:'#f59e0b',
    desc:'Elektr maydonda uchuvchi yog\' tomchilari kuzatildi',
    result:'Elektronning aniq zaryadi va massasi o\'lchandi: e = 1.6 × 10⁻¹⁹ Kl',
    difficulty:'O\'rta',
  },
  {
    id:6, emoji:'☢️', name:'Rezerford tajribasi', scientist:'Ernest Rezerford', year:'1909',
    color:'#ec4899',
    desc:'Alfa zarrachalar oltin plastinkadan o\'tkazildi',
    result:'Atom tarkibida kichik yadro bor. Atom tuzilishining zamonaviy modeliga asos solingan',
    difficulty:'Yuqori',
  },
]

/* ── Timeline events ── */
const TIMELINE = [
  { year:'1543', event:'Kopernik gелиotsentrik tizimini e\'lon qildi', icon:'🌍', color:'#34D399' },
  { year:'1609', event:'Galiley teleskopni osmon jismlarini kuzatishga ishlatdi', icon:'🔭', color:'#06b6d4' },
  { year:'1687', event:'Nyuton "Principia" asarini nashr etdi — klassik mexanika', icon:'🍎', color:'#8b5cf6' },
  { year:'1752', event:'Franklin momaqaldiroq hodisasining elektr tabiatini isbotladi', icon:'⚡', color:'#f59e0b' },
  { year:'1800', event:'Volta birinchi elektr batareyasini yaratdi', icon:'🔋', color:'#ef4444' },
  { year:'1820', event:'Oersted elektr va magnit maydoni bog\'liqligini kashf etdi', icon:'🧲', color:'#ec4899' },
  { year:'1831', event:'Faradey elektromagnit induksiyani kashf etdi', icon:'💡', color:'#fbbf24' },
  { year:'1864', event:'Maksvell elektromagnit to\'lqinlar nazariyasini yaratdi', icon:'📡', color:'#34D399' },
  { year:'1895', event:'Rentgen X-nurlarni kashf etdi', icon:'🦴', color:'#06b6d4' },
  { year:'1897', event:'Thomson elektronni kashf etdi', icon:'⚛️', color:'#8b5cf6' },
  { year:'1905', event:'Eynshteyn maxsus nisbiylik nazariyasini e\'lon qildi', icon:'🌌', color:'#ef4444' },
  { year:'1945', event:'Birinchi yadro bombasi portlatildi (Manhattan loyihasi)', icon:'☢️', color:'#f97316' },
  { year:'1969', event:'Apollo 11: inson Oyga qadam qo\'ydi', icon:'🚀', color:'#a78bfa' },
  { year:'2012', event:'Higgs bozoni CERN\'da topildi', icon:'🔬', color:'#34D399' },
  { year:'2016', event:'Gravitatsion to\'lqinlar birinchi marta qayd etildi (LIGO)', icon:'〰️', color:'#06b6d4' },
]

/* ── Records ── */
interface Rec { emoji:string; title:string; value:string; detail:string; color:string }
const RECORDS: Rec[] = [
  { emoji:'⚡', title:"Eng tez narsa",             value:'Yorug\'lik — 299 792 km/s', detail:'Yorug\'lik vakuumda sekundiga taxminan 300 000 km bosib o\'tadi. Yer dan Oyga 1.3 soniyada yetadi.',                           color:'#fbbf24' },
  { emoji:'🔥', title:'Eng issiq narsa',            value:'Plazma — 15 milliard °C', detail:'CERN\'dagi proton to\'qnashuvida hosil bo\'lgan plazma Quyoshning markazidan 100 000 marta issiq.',                              color:'#ef4444' },
  { emoji:'🧊', title:'Eng sovuq harorat',          value:'−273.15 °C (mutlaq nol)', detail:'Mutlaq nolda atomlar to\'liq to\'xtaydi. Kvant holatlarda esa hatto u yerda ham energiya qoladi.',                              color:'#60a5fa' },
  { emoji:'⚫', title:'Eng og\'ir jism',            value:'TON 618 qora tuynuk (66 mlrd. Quyosh massasi)', detail:'TON 618 — eng massiv qora tuynuk. Uning Schwarzschild radiusi 1 300 AU dan katta.',                         color:'#8b5cf6' },
  { emoji:'🔬', title:'Eng kichik zarra',           value:'Elektron — 9.1×10⁻³¹ kg', detail:'Elektron nuqtaviy zarra hisoblanadi — kuzatilgan hajmi yo\'q. Hozirga qadar tarkibi topilmagan.',                             color:'#34D399' },
  { emoji:'🌌', title:"Eng katta tuzilma",         value:'Koinotning katta devori — 1.38 mlrd. yo\'l yili', detail:'Tuzilma galaktikalarning ulkan to\'rini hosil qiladi. Koinotning 1% ni qamrab oladi.',                   color:'#ec4899' },
  { emoji:'⏱️', title:'Eng qisqa vaqt birligi',    value:'Planck vaqti — 5.4×10⁻⁴⁴ s', detail:'Bundan qisqa vaqt oralig\'ida fizika qonunlari ishlamaydi. Zamonaviy fizikaning chegarasi.',                               color:'#f59e0b' },
  { emoji:'💪', title:'Eng kuchli kuch',            value:'Kuchli yadroli o\'zaro ta\'sir', detail:'Proton va neytronlarni birlashtirib tutadi. Gravitatsiyadan 10³⁸ marta kuchli. Soniya ulushida ishlaydi.',               color:'#10b981' },
]

/* ── Scientists ── */
interface Scientist { id:number; emoji:string; name:string; years:string; country:string; color:string; discovery:string; quote:string }
const SCIENTISTS: Scientist[] = [
  { id:1, emoji:'⚛️', name:'Isaak Nyuton',      years:'1643–1727', country:'🇬🇧 Buyuk Britaniya', color:'#a78bfa', discovery:'Mexanika, tortishish qonuni, optika, matematika',            quote:'"Agar men uzoqroq ko\'ra olgan bo\'lsam, u holda gigantlarning yelkasiga minib turgandim."' },
  { id:2, emoji:'🌌', name:'Albert Eynshteyn',   years:'1879–1955', country:'🇩🇪 Germaniya',       color:'#06b6d4', discovery:'Nisbiylik nazariyasi, fotoeffekt, E=mc²',                    quote:'"Tasavvur bilimdan muhimroq. Bilim cheklangan, tasavvur esa butun koinotni qamrab oladi."' },
  { id:3, emoji:'⚡', name:'Nikola Tesla',        years:'1856–1943', country:'🇷🇸 Serbiya',         color:'#ef4444', discovery:'O\'zgaruvchan tok, radio, elektr magnit asoslari',          quote:'"Kelajak meniki. Hozir esa men uchun kecha."' },
  { id:4, emoji:'☢️', name:'Mari Kyuri',          years:'1867–1934', country:'🇵🇱 Polsha',          color:'#ec4899', discovery:'Radioaktivlik, poliy, radiy elementlari',                   quote:'"Hayotda qo\'rquvchan bo\'lmang. Juda kam narsa qo\'rqishga arziydi."' },
  { id:5, emoji:'🍎', name:'Galiley Galiley',     years:'1564–1642', country:'🇮🇹 Italiya',         color:'#34D399', discovery:'Teleskop, erkin tushish, osmon mexanikasi',                 quote:'"Tabiiy fanlarning tili matematika."' },
  { id:6, emoji:'💡', name:'Maykl Faradey',       years:'1791–1867', country:'🇬🇧 Buyuk Britaniya', color:'#fbbf24', discovery:'Elektromagnit induksiya, elektroliz, Faradey qafasi',       quote:'"Hech narsa juda qiyin emas, agar siz uni kichik qismlarga bo\'lsangiz."' },
  { id:7, emoji:'🔬', name:'Maks Plank',           years:'1858–1947', country:'🇩🇪 Germaniya',       color:'#8b5cf6', discovery:'Kvant nazariyasi, Plank konstanta',                         quote:'"Ilm – bu haqiqatni qidirish jaroyoni, haqiqatning o\'zi emas."' },
  { id:8, emoji:'🌊', name:'Niels Bor',            years:'1885–1962', country:'🇩🇰 Daniya',          color:'#60a5fa', discovery:'Atom modeli, kvant mexanikasi, to\'ldiruvchilik prinsipi', quote:'"Kvant mexanikasidan hayron qolmagan kishi uni tushunmagan."' },
]

/* ══════════════════════════════ COMPONENTS ══════════════════════════════ */

/* Flip card */
function FlipCard({ item }: { item: Invention }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            background: `linear-gradient(160deg, rgba(6,8,30,0.82) 0%, ${item.color}22 100%)`,
            border: `2px solid ${item.color}70`,
            backdropFilter: 'blur(18px)',
            boxShadow: `0 0 28px ${item.color}30, inset 0 1px 0 ${item.color}40, inset 0 -1px 0 rgba(0,0,0,0.4)`,
          }}
        >
          {/* Top color bar */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}44)`, borderRadius: '10px 10px 0 0' }} />
          {/* Subtle glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: `radial-gradient(ellipse at 50% 20%, ${item.color}28 0%, transparent 60%)` }}/>

          <div className="flex flex-col items-center justify-center flex-1 gap-2 px-5 pt-3">
            {/* Emoji with glow ring */}
            <div className="flex items-center justify-center rounded-2xl"
              style={{ width: 64, height: 64, background: `${item.color}18`, border: `1.5px solid ${item.color}50`, boxShadow: `0 0 18px ${item.color}35`, fontSize: 36 }}>
              {item.emoji}
            </div>
            <div className="text-center mt-1">
              <h3 style={{ fontWeight: 900, fontSize: 17, color: '#fff', textShadow: `0 0 16px ${item.color}90, 0 2px 8px rgba(0,0,0,0.9)`, letterSpacing: '-0.3px' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: 12, marginTop: 4, fontWeight: 700, color: item.color, textShadow: `0 0 10px ${item.color}80` }}>
                {item.inventor}, {item.year}
              </p>
              <p style={{ fontSize: 11, marginTop: 2, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{item.country}</p>
            </div>
          </div>

          <div className="pb-2.5 flex justify-center">
            <div className="flex flex-wrap justify-center gap-1 px-4">
              {item.tags.map((t) => (
                <span key={t} style={{
                  borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700,
                  background: `${item.color}22`, color: item.color,
                  border: `1.5px solid ${item.color}55`,
                  textShadow: `0 0 8px ${item.color}70`,
                  letterSpacing: '0.02em',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.05em' }}>⟳ bosing</div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col p-5 overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(160deg, rgba(5,5,20,0.97) 0%, ${item.color}14 100%)`,
            border: `2px solid ${item.color}60`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 0 32px ${item.color}25, inset 0 1px 0 ${item.color}35`,
          }}
        >
          {/* Top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${item.color}, ${item.color}33)`, borderRadius: '10px 10px 0 0' }} />
          <div className="flex items-center gap-2 mb-3 mt-1">
            <span style={{ fontSize: 22, filter: `drop-shadow(0 0 8px ${item.color})` }}>{item.emoji}</span>
            <div>
              <h3 style={{ fontWeight: 900, fontSize: 14, color: '#fff', textShadow: `0 0 12px ${item.color}70` }}>{item.name}</h3>
              <p style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.year} yil</p>
            </div>
          </div>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.80)', lineHeight: 1.65, flex: 1, overflowY: 'auto' }}>{item.back}</p>
          <button
            className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold w-full transition-all"
            style={{ background:`${item.color}25`, border:`1.5px solid ${item.color}50`, color: item.color, textShadow: `0 0 8px ${item.color}70` }}
            onClick={(e) => { e.stopPropagation(); setFlipped(false) }}
          >
            ← Orqaga
          </button>
        </div>
      </div>
    </div>
  )
}

/* Experiment card */
function ExpCard({ ex }: { ex: Experiment }) {
  const [open, setOpen] = useState(false)
  const diffColor = ex.difficulty === 'Boshlang\'ich' ? '#34D399' : ex.difficulty === 'O\'rta' ? '#f59e0b' : '#ef4444'
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(160deg, rgba(5,5,20,0.88) 0%, ${ex.color}16 100%)`,
        border: `2px solid ${open ? ex.color+'65' : ex.color+'35'}`,
        backdropFilter: 'blur(16px)',
        boxShadow: open ? `0 0 24px ${ex.color}25` : 'none',
      }}>
      {/* Top bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${ex.color}, ${ex.color}22)` }} />
      <button onClick={() => setOpen((v)=>!v)} className="w-full flex items-center gap-4 p-4 text-left">
        <div style={{ fontSize: 28, flexShrink: 0, filter: `drop-shadow(0 0 6px ${ex.color}70)` }}>{ex.emoji}</div>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 800, color: '#fff', fontSize: 14, textShadow: `0 0 12px ${ex.color}60` }}>{ex.name}</p>
          <p style={{ fontSize: 11, color: ex.color, fontWeight: 600, marginTop: 3 }}>{ex.scientist} · {ex.year}</p>
        </div>
        <span style={{
          flexShrink: 0, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 800,
          background: `${diffColor}20`, color: diffColor,
          border: `1.5px solid ${diffColor}50`,
          textShadow: `0 0 8px ${diffColor}70`,
        }}>
          {ex.difficulty}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          <div className="pt-3">
            <p style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Tajriba</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{ex.desc}</p>
          </div>
          <div className="rounded-xl p-3" style={{ background:`${ex.color}14`, border:`1.5px solid ${ex.color}40` }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: ex.color, marginBottom: 5, textShadow: `0 0 8px ${ex.color}70` }}>Natija</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>{ex.result}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* Timeline item */
function TimelineItem({ item, i }: { item: typeof TIMELINE[0]; i: number }) {
  const left = i % 2 === 0
  return (
    <div className={`flex items-center gap-4 ${left ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-1 ${left ? 'text-right' : 'text-left'}`}>
        <div className="inline-block rounded-2xl px-4 py-3 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: `linear-gradient(160deg, rgba(5,5,20,0.88) 0%, ${item.color}18 100%)`,
            border: `2px solid ${item.color}50`,
            backdropFilter: 'blur(16px)',
            boxShadow: `0 0 16px ${item.color}20`,
          }}>
          <p style={{ fontWeight: 900, fontSize: 14, color: item.color, textShadow: `0 0 10px ${item.color}80` }}>{item.year}</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 3, maxWidth: 280 }}>{item.event}</p>
        </div>
      </div>
      {/* Center dot */}
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-lg"
        style={{ background:`${item.color}20`, border:`2px solid ${item.color}40`, boxShadow:`0 0 12px ${item.color}30` }}>
        {item.icon}
      </div>
      <div className="flex-1" />
    </div>
  )
}

/* Record card */
function RecCard({ r }: { r: Rec }) {
  const [hov, setHov] = useState(false)
  return (
    <div className="rounded-2xl flex flex-col gap-3 transition-all duration-300 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, rgba(5,5,20,0.88) 0%, ${r.color}18 100%)`,
        border: `2px solid ${hov ? r.color+'75' : r.color+'40'}`,
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 8px 28px ${r.color}30, 0 0 0 1px ${r.color}18` : `0 2px 10px ${r.color}15`,
        backdropFilter: 'blur(16px)',
        padding: 0,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${r.color}, ${r.color}33)` }} />
      <div style={{ padding: '12px 16px 16px' }} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div style={{ fontSize: 30, filter: `drop-shadow(0 0 8px ${r.color}80)` }}>{r.emoji}</div>
          <div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{r.title}</p>
            <p style={{ fontWeight: 900, fontSize: 13, color: r.color, marginTop: 3, textShadow: `0 0 12px ${r.color}80` }}>{r.value}</p>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.60)', lineHeight: 1.65 }}>{r.detail}</p>
      </div>
    </div>
  )
}

/* Scientist card */
function ScientistCard({ s }: { s: Scientist }) {
  const [hov, setHov] = useState(false)
  return (
    <div className="rounded-2xl flex flex-col gap-4 transition-all duration-300 overflow-hidden"
      style={{
        background: `linear-gradient(160deg, rgba(5,5,20,0.88) 0%, ${s.color}18 100%)`,
        border: `2px solid ${hov ? s.color+'80' : s.color+'45'}`,
        transform: hov ? 'translateY(-5px)' : 'none',
        boxShadow: hov ? `0 8px 32px ${s.color}35, 0 0 0 1px ${s.color}20` : `0 2px 12px ${s.color}18`,
        backdropFilter: 'blur(18px)',
        padding: 0,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Color top bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${s.color}, ${s.color}33)` }} />
      <div style={{ padding: '16px 20px 20px' }} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 flex items-center justify-center rounded-2xl text-2xl flex-shrink-0"
            style={{ background:`${s.color}20`, border:`2px solid ${s.color}55`, boxShadow: `0 0 14px ${s.color}30` }}>
            {s.emoji}
          </div>
          <div>
            <h3 style={{ fontWeight: 900, color: '#fff', fontSize: 15, textShadow: `0 0 14px ${s.color}80` }}>{s.name}</h3>
            <p style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.years}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{s.country}</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{s.discovery}</p>
        <blockquote style={{
          borderRadius: 12, padding: '10px 14px', fontSize: 11.5, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.65,
          background: `${s.color}12`, borderLeft: `3px solid ${s.color}70`,
        }}>
          {s.quote}
        </blockquote>
      </div>
    </div>
  )
}

/* ══════════════════════════════ PAGE ══════════════════════════════ */
const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id:'ixtirolar',  label:'Ixtirolar',  icon:Zap          },
  { id:'tajribalar', label:'Tajribalar', icon:FlaskConical  },
  { id:'sanalar',    label:'Sanalar',    icon:Calendar      },
  { id:'olimlar',    label:'Olimlar',    icon:User          },
  { id:'rekordlar',  label:'Rekordlar',  icon:Trophy        },
]

export default function KashfiyotlarPage() {
  const [tab, setTab] = useState<Tab>('ixtirolar')

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 slide-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Fizika tarixi</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <Telescope className="h-9 w-9 text-purple-400" />
            Kashfiyotlar
          </h1>
          <p className="text-gray-400">Fizika tarixidagi muhim ixtirolar, tajribalar va buyuk olimlar</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 slide-up-d1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id
            return (
              <button key={id} onClick={() => setTab(id)}
                className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300"
                style={{
                  background: active ? 'rgba(139,92,246,0.2)' : 'rgba(8,8,25,0.7)',
                  border: `1.5px solid ${active ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#a78bfa' : '#6b7280',
                  boxShadow: active ? '0 0 18px rgba(139,92,246,0.2)' : 'none',
                }}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            )
          })}
        </div>

        {/* ── Ixtirolar ── */}
        {tab === 'ixtirolar' && (
          <div className="slide-up">
            <p className="text-gray-500 text-sm mb-6">Kartochkani bosib batafsil ma&apos;lumot oling</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {INVENTIONS.map((inv) => <FlipCard key={inv.id} item={inv} />)}
            </div>
          </div>
        )}

        {/* ── Tajribalar ── */}
        {tab === 'tajribalar' && (
          <div className="slide-up space-y-3 max-w-3xl mx-auto">
            {EXPERIMENTS.map((ex) => <ExpCard key={ex.id} ex={ex} />)}
          </div>
        )}

        {/* ── Sanalar ── */}
        {tab === 'sanalar' && (
          <div className="slide-up max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                style={{ background:'linear-gradient(180deg,transparent,rgba(139,92,246,0.4),transparent)' }}/>
              <div className="space-y-6">
                {TIMELINE.map((item, i) => <TimelineItem key={item.year} item={item} i={i} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── Olimlar ── */}
        {tab === 'olimlar' && (
          <div className="slide-up grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SCIENTISTS.map((s) => <ScientistCard key={s.id} s={s} />)}
          </div>
        )}

        {/* ── Rekordlar ── */}
        {tab === 'rekordlar' && (
          <div className="slide-up">
            <div className="mb-6 rounded-2xl p-4 text-center"
              style={{ background:'linear-gradient(135deg,rgba(251,146,60,0.1),rgba(239,68,68,0.1))', border:'1px solid rgba(251,146,60,0.2)' }}>
              <p className="text-orange-300 font-bold">🏆 Koinotdagi eng g&apos;ayrioddiy rekordlar</p>
              <p className="text-gray-400 text-sm mt-1">Fizika qonunlari asosida tasdiqlangan</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {RECORDS.map((r) => <RecCard key={r.title} r={r} />)}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl p-6 text-center"
          style={{ background:'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(6,182,212,0.1))', border:'1px solid rgba(139,92,246,0.2)' }}>
          <p className="text-white font-black text-lg mb-2">Ko&apos;proq o&apos;rganishni istaysizmi?</p>
          <p className="text-gray-400 text-sm mb-4">AI Tutor bilan fizika tarixi haqida istalgan savolni bering</p>
          <a href="/ai-tutor"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-bold text-white text-sm"
            style={{ background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', boxShadow:'0 0 24px rgba(139,92,246,0.3)' }}>
            AI Tutor bilan suhbat <ChevronRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </div>
  )
}
