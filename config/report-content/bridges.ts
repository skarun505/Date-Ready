import { Dimension } from "@/config/dimensions";

export type BridgeKey = `${Dimension}__${Dimension}`;

export const bridges: Record<string, string> = {
  // Approach Primary
  "approach__resilience":
    "Because approaching feels high-stakes, any fear of rejection or delayed response feeds directly back into hesitation—creating a loop where you wait too long to make a move.",
  "approach__conversation":
    "Because starting the conversation feels intimidating, you worry that once you do step up, you won't know how to keep it flowing—leading to paralysis before you even begin.",
  "approach__social":
    "Because entering unfamiliar social groups feels taxing, finding natural moments to introduce yourself becomes twice as hard—keeping you isolated on the perimeter.",
  "approach__presentation":
    "Because you hold subtle doubts about how you look or present yourself, you hesitate to step into someone's line of sight, feeling unready before saying a word.",

  // Conversation Primary
  "conversation__approach":
    "Because carrying effortless conversation feels unpredictable, you naturally hesitate to approach in the first place, worrying you'll run out of things to say after 30 seconds.",
  "conversation__resilience":
    "Because awkward pauses feel painful to you, any momentary lapse in dialogue triggers overthinking, making you assume the other person is losing interest.",
  "conversation__social":
    "Because dynamic group banter feels overwhelming, you retreat into listening mode, finding it tricky to assert your voice and charisma when multiple people are speaking.",
  "conversation__presentation":
    "Because you feel self-conscious about how you are perceived, you focus inward on your delivery and body language rather than being present and playful in the conversation.",

  // Social Primary
  "social__approach":
    "Because bustling social rooms make you feel like an outsider, initiating individual interactions feels twice as daunting without a familiar anchor by your side.",
  "social__conversation":
    "Because large group environments drain your mental energy quickly, you find yourself giving shorter answers and struggling to maintain engaging dialogue.",
  "social__resilience":
    "Because you feel exposed in social settings, any perceived social friction or cold response hits harder, leading to an urge to make an early exit.",
  "social__presentation":
    "Because you worry about standing out or looking out of place in dynamic settings, you tend to adopt closed body language that inadvertently signals you want to be left alone.",

  // Resilience Primary
  "resilience__approach":
    "Because delayed texts or polite declines sting your self-esteem, your brain protects you by shutting down future approaches before you can experience that sting again.",
  "resilience__conversation":
    "Because you take momentary silence or low energy personally, you overcompensate during conversations by asking rapid-fire questions or over-apologizing.",
  "resilience__social":
    "Because you are hyper-aware of social judgment, entering rooms full of strangers feels emotionally risky, keeping you tethered to safe, familiar routines.",
  "resilience__presentation":
    "Because you look for external validation to confirm your attractiveness, any ambiguous interaction makes you question your style, looks, or dating appeal.",

  // Presentation Primary
  "presentation__approach":
    "Because you aren't completely confident in how you look and carry yourself, you talk yourself out of approaching, believing you need a 'better day' to introduce yourself.",
  "presentation__conversation":
    "Because you are preoccupied with whether you look awkward or tense, you lose track of the conversation flow and miss natural opportunities for banter.",
  "presentation__social":
    "Because you worry about how you measure up in group environments, you tend to shrink into the background rather than owning your space with relaxed presence.",
  "presentation__resilience":
    "Because your confidence in your appearance fluctuates, any neutral reaction or quiet moment leads you to assume they don't find you attractive.",
};

export function getBridge(primary: Dimension, secondary: Dimension): string {
  const key: BridgeKey = `${primary}__${secondary}`;
  return (
    bridges[key] ||
    `When ${primary} and ${secondary} compound, hesitation builds up. Breaking this down into small, daily habits will unlock rapid progress in both areas.`
  );
}
