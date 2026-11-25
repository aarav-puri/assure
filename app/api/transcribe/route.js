import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { getUsage, recordUsage } from '../../../lib/usage';
import { ENFORCED_PLAN } from '../../../lib/plans';
import { LIMITS } from '../../../lib/warranties';

// Speech to text for the claim assistant through AI Gateway.
const TRANSCRIBE_URL = 'https://ai-gateway.vercel.sh/v4/ai/transcription-model';
const TRANSCRIBE_MODEL = 'openai/gpt-transcribe';
const BYTES_PER_SECOND = 4000; // the client requests 32 kbps

const MAX_AUDIO_BYTES = 3 * 1024 * 1024; // base64 grows this by a third; stays under Vercel's 4.5 MB body limit
const ALLOWED_TYPES = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-m4a'];

export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    // Monthly allowance of audio seconds. A clip that starts under the limit is
    // allowed to finish, so a user can overshoot by at most one 2-minute clip.
    const limitSeconds = LIMITS.voiceMinutes * 60;
    const usage = await getUsage(user.id);
    if (usage.voice >= limitSeconds) {
      return NextResponse.json(
        { error: `You have used this month's ${LIMITS.voiceMinutes} minutes of voice input. More on the 1st.`, code: 'allowance_used', voiceSeconds: usage.voice },
        { status: 429 }
      );
    }

    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) throw new Error('Missing AI_GATEWAY_API_KEY');

    // The client sends the recording as the raw body, typed by its Content-Type.
    const mediaType = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_TYPES.includes(mediaType)) {
      return NextResponse.json({ error: 'Unsupported audio format.' }, { status: 415 });
    }

    const declared = Number(request.headers.get('content-length') || 0);
    if (declared > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'That recording is too long. Keep it under two minutes.' }, { status: 413 });
    }
    const audio = Buffer.from(await request.arrayBuffer());
    if (audio.length === 0) return NextResponse.json({ error: 'No audio received.' }, { status: 400 });
    if (audio.length > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'That recording is too long. Keep it under two minutes.' }, { status: 413 });
    }

    const response = await fetch(TRANSCRIBE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'ai-gateway-protocol-version': '0.0.1',
        'ai-transcription-model-specification-version': '4',
        'ai-model-id': TRANSCRIBE_MODEL,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: audio.toString('base64'),
        mediaType,
      }),
    });

    if (!response.ok) {
      console.error('AI Gateway transcribe error:', response.status, await response.text());
      return NextResponse.json({ error: 'Could not transcribe that recording. Try again.' }, { status: 502 });
    }

    const data = await response.json();
    // An invalid gateway payload is a service failure, not evidence of silence.
    if (typeof data?.text !== 'string') {
      console.error('AI Gateway transcription response missing text');
      return NextResponse.json({ error: 'The transcription service returned an invalid response. Please try again.' }, { status: 502 });
    }
    // Preserve the words returned by the model. Phrase-based "silence" filters
    // also delete real speech such as "thank you" and parenthesised sentences.
    const text = data.text.trim();
    if (!text) {
      console.warn('Empty voice transcription', {
        mediaType,
        audioBytes: audio.length,
        durationInSeconds: data.durationInSeconds ?? null,
      });
    }
    // Bill the length the model measured; estimate from size if it is ever missing.
    const measured = Number(data.durationInSeconds);
    const seconds = Math.max(1, Math.ceil(Number.isFinite(measured) && measured > 0 ? measured : audio.length / BYTES_PER_SECOND));
    const voiceSeconds = await recordUsage(user.id, 'voice', ENFORCED_PLAN, seconds);

    return NextResponse.json({ text, voiceSeconds });
  } catch (err) {
    console.error('transcribe error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
