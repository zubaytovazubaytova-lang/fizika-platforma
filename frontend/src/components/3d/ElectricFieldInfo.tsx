'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/* ── Accordion ── */
function Section({
  title, emoji, color, defaultOpen = false, children,
}: {
  title: string; emoji: string; color: string
  defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-2xl border transition-all"
      style={{ borderColor: open ? color + '40' : 'rgba(255,255,255,0.06)', background: open ? color + '08' : 'rgba(8,8,25,0.6)' }}>
      <button
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-all"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-2xl">{emoji}</span>
        <span className="flex-1 font-bold text-white">{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform duration-300 text-gray-500"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: open ? color : undefined }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/[0.05]">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Small card ── */
function Card({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="flex gap-3 rounded-xl p-4 transition-all"
      style={{ background: color + '10', border: `1px solid ${color}25` }}>
      <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ── Fact badge ── */
function Fact({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl px-4 py-3"
      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
      <span className="text-lg shrink-0">{icon}</span>
      <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
    </div>
  )
}

/* ── Phenomenon row ── */
function Phenomenon({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{ background: color + '15', border: `1px solid ${color}25` }}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm" style={{ color }}>{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ── Main export ── */
export default function ElectricFieldInfo() {
  return (
    <div className="space-y-3">

      {/* ── Kirish ── */}
      <div className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
            ⚡
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Elektr maydon nima?</h2>
            <p className="text-xs text-yellow-400/70">Kulon qonuni · F = k·|q₁·q₂| / r²</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Elektr maydon — bu zaryadlangan jism atrofidagi fazoda boshqa zaryadlarga ta&apos;sir ko&apos;rsatadigan
          kuch maydoni. Ko&apos;z bilan ko&apos;rib bo&apos;lmaydi, lekin ta&apos;sirini his qilish mumkin.
          Yuqoridagi simulatsiyada ikkita zaryadning o&apos;zaro ta&apos;siri va elektr maydon chiziqlari ko&apos;rsatilgan.
        </p>
      </div>

      {/* ── Simulatsiyada nima tasvirlangan ── */}
      <Section title="Simulatsiyada nima tasvirlangan?" emoji="🔍" color="#60a5fa" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-3 mt-2">
          <Card icon="🔴" color="#ef4444"
            title="Qizil shar = Musbat zaryad"
            desc="Proton kabi — elektron yo'qotgan atom. Maydon chiziqlari bundan chiqadi." />
          <Card icon="🔵" color="#3b82f6"
            title="Ko'k shar = Manfiy zaryad"
            desc="Elektron kabi — ortiqcha elektroni bor atom. Maydon chiziqlari bunga kiradi." />
          <Card icon="➡️" color="#e5e7eb"
            title="Chiziqlar = Kuch yo'nalishi"
            desc="Kichik musbat zaryad qo'yilsa, aynan shu chiziqlar bo'ylab harakat qiladi." />
        </div>
        <div className="mt-3 rounded-xl px-4 py-3 text-sm text-gray-400"
          style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.12)' }}>
          💡 <strong className="text-blue-300">Maslahat:</strong> Slayderlarda zaryadlarni o&apos;zgartiring va maydon
          chiziqlari qanday o&apos;zgarishini kuzating. Ikkala zaryad bir xil belgi bo&apos;lsa — chiziqlar uzoqlashadi.
        </div>
      </Section>

      {/* ── Qanday hodisa bo'layapti ── */}
      <Section title="Qanday hodisa bo'layapti?" emoji="⚗️" color="#34d399">
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <Phenomenon icon="↔️" color="#f87171"
            title="Bir xil zaryadlar (++ yoki −−): ITARADI"
            desc="Ikkala qizil yoki ikkala ko'k bo'lsa — bir-birini itaradi. Maydon chiziqlari bir-biridan uzoqlashadi." />
          <Phenomenon icon="🔗" color="#34d399"
            title="Har xil zaryadlar (+−): TORTADI"
            desc="Qizil va ko'k bo'lsa — bir-birini tortadi. Maydon chiziqlari musbatdan manfiyga uzluksiz o'tadi." />
          <Phenomenon icon="📏" color="#fbbf24"
            title="Masofa oshsa: kuch KAMAYADI"
            desc="4 marta uzoq = 16 marta kuchsiz! Bu kvadrat qonuni: F ∝ 1/r²." />
          <Phenomenon icon="🧲" color="#a78bfa"
            title="Magnitda ham xuddi shunday"
            desc="Magnit qutblari bilan sinab ko'ring — bir tomoni tortadi, ikkinchi tomoni itaradi. Xuddi zaryadlar kabi!" />
        </div>
      </Section>

      {/* ── Kundalik hayotda ── */}
      <Section title="Kundalik hayotda qayerlarda?" emoji="🌍" color="#f59e0b">
        <div className="grid gap-2.5 sm:grid-cols-2 mt-2">
          {[
            { icon: '⚡', title: 'Elektr toki', desc: 'O\'tkazgichdagi zaryadlar harakati — elektr maydon ularni suradi', color: '#fbbf24' },
            { icon: '📱', title: 'Sensorli ekran', desc: 'Barmoq tekkanda ekrandagi elektr maydon o\'zgaradi — qurilma sezadi', color: '#60a5fa' },
            { icon: '🖨️', title: 'Printer / Kopir', desc: 'Toner zaryadlar yordamida qog\'ozga yopishadi — elektrografiya', color: '#34d399' },
            { icon: '⛈️', title: 'Chaqmoq', desc: 'Bulutlar va yer orasida million voltlik elektr maydon hosil bo\'ladi', color: '#f87171' },
            { icon: '🔋', title: 'Kondensator', desc: 'Ikkita plastina orasida elektr maydon energiya sifatida saqlanadi', color: '#a78bfa' },
            { icon: '🫀', title: 'EKG apparati', desc: 'Yurak ishlaganda hosil bo\'lgan elektr maydonni tana sirtidan o\'lchaydi', color: '#ec4899' },
            { icon: '🚗', title: 'Elektr avtomobil', desc: 'Elektr motor ichidagi maydon kuchidan g\'ildiraklar aylanadi', color: '#06b6d4' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 transition-all hover:bg-white/[0.03]"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: item.color }}>{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Jihozlar ── */}
      <Section title="Qaysi jihozlarda ko'rish mumkin?" emoji="🔬" color="#06b6d4">
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          {[
            { icon: '📺', name: 'Oscillograf', desc: 'Elektr signallarni ko\'rinadigan grafik ko\'rinishda chiqaradi. Laboratoriyalarda keng qo\'llaniladi.' },
            { icon: '⚡', name: 'Van de Graaff generatori', desc: 'Millionlab voltli kuchlanish hosil qiladi. Sochlar tikka turadi — bo\'y va zaryadlarning ta\'siri.' },
            { icon: '🛡️', name: 'Faraday qafasi', desc: 'Metal to\'r tashqi elektr maydonni to\'sadi. Lift va samolyotda telefon signal olmaydi — shuning uchun!' },
            { icon: '📡', name: 'Elektr maydon sensori', desc: 'Atmosfera elektr maydonini o\'lchaydi. Meteorologiya stantsiyalarida bo\'ron oldindan seziladi.' },
          ].map(j => (
            <div key={j.name} className="rounded-xl p-4"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{j.icon}</span>
                <p className="font-semibold text-cyan-300 text-sm">{j.name}</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{j.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Qiziqarli faktlar ── */}
      <Section title="Qiziqarli faktlar" emoji="🌟" color="#a78bfa">
        <div className="space-y-2.5 mt-2">
          <Fact icon="🧬" text="Inson tanasi ham kichik elektr maydon hosil qiladi — yurak, miya va mushaklarda." />
          <Fact icon="🦈" text="Akulalar va ba'zi baliqlar elektr maydonni sezadigan maxsus organlarga ega — ovda ishlatadilar." />
          <Fact icon="🌍" text="Yerning o'zi ham elektr maydoniga ega: atmosfera bilan yer yuzasi orasida taxminan 100 V/m." />
          <Fact icon="⚛️" text="Atom ichida ham elektr maydon bor — proton elektronni o'ziga tortib ushlaydi." />
          <Fact icon="🌩️" text="Bir chaqmoq ta'sirida havo 30,000 °C gacha qiziydi — Quyosh yuzasidan 5 marta issiq!" />
          <Fact icon="🔭" text="Kosmosda ham elektr maydonlar bor — quyosh shamoli zaryadlangan zarralardan iborat." />
        </div>
      </Section>

    </div>
  )
}
