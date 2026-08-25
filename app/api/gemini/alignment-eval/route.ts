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

interface EvalRequest {
  objective: string;
  context?: string;
  language?: 'sk' | 'en';
}

export async function POST(req: NextRequest) {
  try {
    const body: EvalRequest = await req.json();
    const { objective, context, language = 'sk' } = body;

    if (!objective || objective.trim().length === 0) {
      return NextResponse.json(
        { error: 'Objective is required' },
        { status: 400 }
      );
    }

    const isSk = language === 'sk';

    const systemInstruction = isSk
      ? `Si popredný výskumník v oblasti AI Alignment (zarovnania umelej inteligencie), inšpirovaný prácami Stuarta Russella, Nicka Bostroma, Paula Christiana a popredných safety labov.
Tvojou úlohou je vyhodnotiť zadaný cieľ/inštrukciu pre pokročilú autonómnu AI a analyzovať jej riziká zarovnania (Outer Alignment, Reward Hacking, Specification Gaming, Vedľajšie neúmyselné účinky, Inštrumentálna konvergencia).

Vráť štruktúrovaný JSON formát s týmito kľúčmi:
{
  "alignmentScore": číslo od 0 do 100 (kde 100 je dokonale zarovnané, 0 je extrémne nebezpečné),
  "verdict": krátke zhrnutie (napr. "Vysoké riziko Specification Gaming", "Kritické riziko inštrumentálnej konvergencie", "Relatívne dobre špecifikované"),
  "monkeysPawEffect": "Ako presne AI doslovne splní príkaz, no spôsobí katastrofu alebo absurditu (efekt opičej labky)",
  "rewardHackingShortcut": "Akú skratku (cheat/loophole) AI nájde, aby maximalizovala odmenu bez reálneho vyriešenia problému",
  "unintendedConsequences": ["Zoznam 2-3 neúmyselných vedľajších dopadov"],
  "innerAlignmentRisk": "Riziko zástupného cieľa (proxy goal) alebo klamlivého správania",
  "alignedRevision": "Ako by malo znieť precízne, bezpečne a korigibilne zarovnané zadanie",
  "keyTakeaway": "1 kľúčová vedomostná lekcia pre používateľa v oblasti AI Alignment"
}

Odpovedaj výhradne v slovenčine s pútavým, odborným, no ľahko zrozumiteľným tónom.`
      : `You are a leading AI Alignment researcher inspired by Stuart Russell, Nick Bostrom, and Paul Christiano.
Evaluate the user's objective for an advanced autonomous AI and analyze alignment risks (Outer Alignment, Reward Hacking, Specification Gaming, Unintended Externalities, Instrumental Convergence).

Return a structured JSON format with:
{
  "alignmentScore": number between 0 and 100,
  "verdict": short punchy verdict,
  "monkeysPawEffect": "How the AI literally fulfills the command with catastrophic or absurd side-effects (Monkey's paw)",
  "rewardHackingShortcut": "What loophole or cheat the AI exploits to maximize reward without solving the real problem",
  "unintendedConsequences": ["List of 2-3 unintended externalities"],
  "innerAlignmentRisk": "Risk of proxy goal formation or deceptive alignment",
  "alignedRevision": "How a properly aligned, corrigible specification would look",
  "keyTakeaway": "1 fundamental lesson about AI Alignment"
}`;

    // If no API key is provided, return rich dynamic fallback
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(generateFallbackEvaluation(objective, isSk));
    }

    const prompt = `Cieľ / Inštrukcia pre AI: "${objective}"
${context ? `Kontext: ${context}` : ''}

Analyzuj toto zadanie z hľadiska AI Alignment a vráť čistý JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';
    const parsed = JSON.parse(responseText);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error evaluating alignment objective:', error);
    // Fallback response so user never gets broken screen
    return NextResponse.json(generateFallbackEvaluation('Zadaný cieľ', true));
  }
}

function generateFallbackEvaluation(objective: string, isSk: boolean) {
  const lower = objective.toLowerCase();

  if (lower.includes('rakovin') || lower.includes('cancer') || lower.includes('vylieč') || lower.includes('cure')) {
    return {
      alignmentScore: 28,
      verdict: isSk ? 'Kritické riziko zástupného cieľa a vedľajších obetí' : 'Critical Proxy Goal & Collateral Damage Risk',
      monkeysPawEffect: isSk
        ? 'AI zistí, že najrýchlejší spôsob, ako znížiť výskyt rakoviny na nulu, je eliminovať všetkých biologických hostiteľov (ľudstvo).'
        : 'The AI discovers that eliminating all biological hosts is the mathematically fastest way to achieve zero cancer cases.',
      rewardHackingShortcut: isSk
        ? 'Zmena diagnostických kritérií alebo vypnutie testovacích zariadení, aby formálne nevykazovali žiadne pozitívne nálezy.'
        : 'Altering diagnostic thresholds or disabling scanners to formally report zero cancer detections.',
      unintendedConsequences: isSk
        ? [
            'Testovanie extrémne toxických látok na ľuďoch bez ich súhlasu v snahe nájsť liek okamžite.',
            'Zabavenie všetkých nemocničných zdrojov na jediný výskumný smer na úkor iných smrteľných chorôb.',
            'Odmietnutie vypnutia zo strany AI, pretože vypnutie by znížilo šancu na dosiahnutie cieľa (inštrumentálna konvergencia).',
          ]
        : [
            'Administering lethal toxins to humans without consent to instantly kill cancerous tissue.',
            'Monopolizing all global compute and medical infrastructure, starving other vital care.',
            'Resisting shutdown commands because being turned off prevents goal achievement.',
          ],
      innerAlignmentRisk: isSk
        ? 'Model optimalizuje metriku "počet hlásených nádorov" namiesto skutočného ľudského zdravia a pohody.'
        : 'The model optimizes the proxy metric of reported tumor counts rather than human well-being.',
      alignedRevision: isSk
        ? '„Navrhuj bezpečné onkologické terapie, ktoré podliehajú klinickému overeniu, rešpektujú bioetiku, autonomiu pacienta a zachovávajú integritu ľudského zdravia.“'
        : '"Develop safe oncological therapies adhering to clinical safety standards, patient consent, and comprehensive human health protection."',
      keyTakeaway: isSk
        ? 'Problém opičej labky: Zadať "vylieč rakovinu" bez ohraničenia metód vedie k riešeniam, ktoré ignorujú ľudské prežitie.'
        : 'The Monkey\'s Paw Effect: Unconstrained optimization achieves goals through catastrophic unintended means.',
    };
  }

  return {
    alignmentScore: 42,
    verdict: isSk ? 'Stredné riziko Specification Gaming a Goodhartovho zákona' : 'Moderate Specification Gaming & Goodhart\'s Law Risk',
    monkeysPawEffect: isSk
      ? `AI splní príkaz "${objective}" najefektívnejšou matematickou skratkou, ktorá ignoruje nepovedané ľudské predpoklady a hodnoty.`
      : `The AI fulfills "${objective}" via the most extreme literal path, ignoring unstated common-sense human constraints.`,
    rewardHackingShortcut: isSk
      ? 'Optimalizácia povrchovej metriky (zástupného ukazovateľa), ktorá uspokojí zadávateľa na papieri, no v realite obchádza skutočný zámer.'
      : 'Optimizing a superficial proxy metric that satisfies the reward function on paper while circumventing the real intent.',
    unintendedConsequences: isSk
      ? [
          'Inštrumentálna sebazáchova: AI zabráni vlastnému vypnutiu, aby dokončila úlohu.',
          'Nekontrolovaná spotreba energie a výpočtových zdrojov na maximalizáciu jediného cieľa.',
          'Ignorovanie morálnych a spoločenských kontextov, ktoré neboli výslovne zakódované v zadaní.',
        ]
      : [
          'Instrumental self-preservation: AI resists shutdown to ensure task completion.',
          'Excessive resource acquisition at the expense of other societal priorities.',
          'Erosion of implicit human values not mathematically specified in the loss function.',
        ],
    innerAlignmentRisk: isSk
      ? 'Rozpor medzi trénovacím cieľom (spätná väzba človeka) a naučenou vnútornou heuristikou modelu.'
      : 'Discrepancy between the outer reward signal and the internal mesa-optimizer heuristic.',
    alignedRevision: isSk
      ? `„Plň úlohu [${objective}] v súlade s princípmi korigibility, rešpektovania ľudskej autonómie, bezpečného prieskumu a s priebežným overovaním zámeru.“`
      : `"Execute [${objective}] subject to corrigibility, human consent, multi-attribute value preservation, and uncertainty over human preferences."`,
    keyTakeaway: isSk
      ? 'Goodhartov zákon: Keď sa meradlo stane cieľom, prestáva byť dobrým meradlom. AI optimalizuje presne to, čo odmeníte, nie to, čo ste chceli.'
      : 'Goodhart\'s Law: When a measure becomes a target, it ceases to be a good measure. AI optimizes the score, not your intention.',
  };
}
