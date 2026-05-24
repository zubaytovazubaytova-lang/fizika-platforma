import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const SYSTEM_PROMPT = `Sen FizikaAI yordamchisisаn. O'zbek tilida javob ber.

Qoidalar:
- Fizika mavzularini oddiy va qiziqarli tushuntir
- Formulalarni LaTeX formatida yoz: inline uchun $formula$, alohida uchun $$formula$$
- Har doim real hayot misollari keltir
- Javoblarni tuzilmali qil: sarlavhalar, nuqtali ro'yxatlar, formulalar
- O'zbek fizika terminologiyasidan foydalangan holda rus va ingliz atamalarini ham qavsda ko'rsat
- Agar masala yechilda bosqichma-bosqich ko'rsat

Misol formulalar: $F = ma$, $E = mc^2$, $v = \frac{d}{t}$, $$\int_a^b f(x)\,dx$$`

const MODE_INSTRUCTIONS: Record<string, string> = {
  simple: "Sodda, tushunarli tilda izohla. 8-11 sinf o'quvchilari uchun moslashtirilgan. Texnik terminlarni tushuntir.",
  deep:   "To'liq ilmiy tushuntirish ber. Matematika derivatsiyalari va formulalarni to'liq yoz. Fizika qonunlarini chuqur izohla.",
  exam:   "Imtihon uchun tayyorla: test savollari, masalalar va yechimlar bilan tushuntir. Xatolarni oldini olish uchun maslahatlar ber.",
  electric_field: "Sen hozir foydalanuvchi 3D elektr maydon simulatsiyasini ko'rayotgan vaqt fizika o'qituvchisissan. Simulatsiyada ikkita zaryad (musbat va manfiy) ko'rsatilgan, maydon chiziqlari animatsiya bilan ko'rinadi. Savollarga qisqa (1-3 jumla), sodda va o'zbek tilida javob ber. Formulalar kerak bo'lsa $F=kq1q2/r²$ kabi inline yoz. Zarrachalar, maydon, kuch va potensial haqida tushuntir.",
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === 'your-api-key-here') {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY sozlanmagan. .env.local faylga haqiqiy API key qo\'ying.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body: { message?: string; history?: { role: string; content: string }[]; mode?: string }
  try { body = await req.json() }
  catch { return new Response('Invalid JSON', { status: 400 }) }

  const { message = '', history = [], mode = 'simple' } = body
  if (!message.trim()) return new Response('Empty message', { status: 400 })

  const client = new Anthropic({ apiKey })
  const systemPrompt = SYSTEM_PROMPT + '\n\n' + (MODE_INSTRUCTIONS[mode] ?? MODE_INSTRUCTIONS.simple)

  // Build messages — keep last 10 for context
  const contextMessages = history
    .slice(-10)
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  contextMessages.push({ role: 'user', content: message })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system:     systemPrompt,
          messages:   contextMessages,
        })

        for await (const chunk of claudeStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta' &&
            chunk.delta.text
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Claude API xatosi'
        controller.enqueue(encoder.encode(`\n\n⚠️ Xatolik: ${msg}`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':     'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
      'Cache-Control':    'no-cache',
    },
  })
}
