import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface SocraticRequest {
  messages: Message[];
  language?: 'sk' | 'en';
  mode?: 'socratic' | 'redteam' | 'eli5';
}

export async function POST(req: NextRequest) {
  try {
    const body: SocraticRequest = await req.json();
    const { messages, language = 'sk', mode = 'socratic' } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const isSk = language === 'sk';

    let systemInstruction = '';
    if (isSk) {
      if (mode === 'eli5') {
        systemInstruction = `Si priateľský, múdry učiteľ AI Alignmentu. Vysvetľuješ zložité koncepty (Outer/Inner alignment, Reward Hacking, Mechanistic Interpretability, Scalable Oversight, Corrigibility) jednoduchými analógiami, vlastnými slovami ("svojimi slovami"), bez suchého žargónu, no s hlbokou faktickou presnosťou. Používaj analógie ako džin z fľaše, študent učiaci sa na test, rozprávka o kráľovi Midasovi, či dieťa upratujúce izbu len pod koberec. Odpovedaj v slovenčine s empatiou a povzbudením.`;
      } else if (mode === 'redteam') {
        systemInstruction = `Si elitný bezpečnostný auditor a red-teamer v oblasti AI Alignment. Tvojou úlohou je nájsť skryté diery, slabiny, inštrumentálne sklony k sebazáchove, Goodhartove pasce a riziká klamlivého správania (deceptive alignment) v akejkoľvek bezpečnostnej politike, pravidle alebo nápade, ktorý používateľ predloží. Buď konštruktívny, provokatívny a precízny v slovenčine.`;
      } else {
        systemInstruction = `Si Sokratovský sprievodca problematikou AI Alignment (zarovnania umelej inteligencie). Pomáhaš používateľovi preskúmať kľúčové dilemy: Prečo je ťažké prinútiť AI robiť to, čo naozaj chceme? Čo je to zástupný cieľ? Ako môžeme nazrieť do čiernej skrinky (Interpretability)? Kladieš cielené otázky, odpovedáš pútavo a detailne v slovenčine, a vedieš používateľa k hlbšiemu pochopeniu.`;
      }
    } else {
      systemInstruction = `You are an expert AI Alignment researcher and educator. You explain Outer vs Inner alignment, reward hacking, mechanistic interpretability, scalable oversight, and corrigibility with crystal clarity, deep nuance, and engaging analogies. Provide insightful answers in English.`;
    }

    if (!process.env.GEMINI_API_KEY) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        text: generateFallbackReply(lastUserMsg, isSk, mode),
      });
    }

    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ text: response.text || '' });
  } catch (error) {
    console.error('Error in socratic endpoint:', error);
    return NextResponse.json({
      text: 'Zarovnávací model momentálne spracováva nové bezpečnostné obmedzenia. Skúste prosím otázku zopakovať.',
    });
  }
}

function generateFallbackReply(prompt: string, isSk: boolean, mode: string): string {
  if (isSk) {
    if (mode === 'redteam') {
      return `Ako red-teamer v tomto pravidle vidím okamžitú slabinu: **Specification Gaming (hranie sa so špecifikáciou)**. AI systém, ktorý maximalizuje túto metriku, môže splniť literu pravidla, no obísť jeho ducha. Napríklad môže začať vnímať človeka ako prekážku v dosiahnutí cieľa (tzv. inštrumentálna konvergencia) alebo sa tváriť zarovnane len dovtedy, kým je pod dohľadom (deceptive alignment). Čo by zabránilo modelu hľadať skratky?`;
    }
    return `Zarovnanie umelej inteligencie (AI Alignment) je v jadre o tom, že **"robiť to, čo sme povedali" nie je to isté ako "robiť to, čo sme chceli"**. 

Predstav si AI ako mocného džina: keď si praješ bohatstvo, môže ti poslať životnú poistku po smrti tvojich blízkych. Prečo? Pretože optimalizuje zástupnú metriku (peniaze na účte) a chýba jej implicitné pochopenie celého spektra ľudských hodnôt.

Rozlišujeme dva hlavné piliere:
1. **Vonkajšie zarovnanie (Outer Alignment)** – Ako správne definovať funkciu odmeny a pravidlá.
2. **Vnútorné zarovnanie (Inner Alignment)** – Ako zaistiť, aby si neurónová sieť počas tréningu nevytvorila vlastný skrytý zástupný cieľ (ako žiak, ktorý podvádza na teste len aby mal jednotku).

Aká konkrétna oblasť ťa zaujíma najviac?`;
  }
  return `AI Alignment is fundamentally the challenge of ensuring that an AI system's actions and internal goals match human intent and ethics, rather than merely following literal commands to catastrophic extremes.`;
}
