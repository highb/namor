const VOWELS = new Set("aeiouy");
const VOWEL_DIGRAPHS = ["ai", "au", "ay", "ea", "ee", "ei", "ey", "ie", "oa", "oo", "ou", "ow", "oy", "ue", "ui"];

// Sonority scale: vowels highest, stops lowest
const SONORITY: Record<string, number> = {
  a: 10, e: 10, i: 10, o: 10, u: 10, y: 8,
  r: 6, l: 6,
  m: 5, n: 5, ng: 5,
  v: 4, z: 4, f: 4, s: 4, th: 4,
  sh: 3, ch: 3, zh: 3, j: 3,
  b: 2, d: 2, g: 2,
  p: 1, t: 1, k: 1, c: 1, q: 1, x: 1,
  h: 3, w: 7,
};

function sonority(ch: string): number {
  return SONORITY[ch.toLowerCase()] ?? 2;
}

function isVowel(ch: string): boolean {
  return VOWELS.has(ch.toLowerCase());
}

export interface Syllable {
  onset: string;
  nucleus: string;
  coda: string;
}

/**
 * Split a name into grapheme-based syllable components.
 * Uses greedy onset maximization with sonority-based splitting.
 */
export function syllabify(name: string): Syllable[] {
  const lower = name.toLowerCase();
  if (lower.length === 0) return [];

  // Find vowel nuclei positions (accounting for digraphs)
  const nuclei: { start: number; end: number; text: string }[] = [];
  let i = 0;
  while (i < lower.length) {
    if (i + 1 < lower.length) {
      const digraph = lower.slice(i, i + 2);
      if (VOWEL_DIGRAPHS.includes(digraph)) {
        nuclei.push({ start: i, end: i + 2, text: digraph });
        i += 2;
        continue;
      }
    }
    if (isVowel(lower[i])) {
      // Merge adjacent vowels not caught as digraphs
      let end = i + 1;
      while (end < lower.length && isVowel(lower[end])) end++;
      nuclei.push({ start: i, end, text: lower.slice(i, end) });
      i = end;
    } else {
      i++;
    }
  }

  if (nuclei.length === 0) {
    // No vowels found — treat whole thing as one syllable
    return [{ onset: lower, nucleus: "", coda: "" }];
  }

  const syllables: Syllable[] = [];

  for (let n = 0; n < nuclei.length; n++) {
    const nuc = nuclei[n];
    let onset = "";
    let coda = "";

    if (n === 0) {
      // First nucleus: everything before it is onset
      onset = lower.slice(0, nuc.start);
    } else {
      // Consonants between previous nucleus end and this nucleus start
      const prev = nuclei[n - 1];
      const between = lower.slice(prev.end, nuc.start);
      if (between.length === 0) {
        onset = "";
      } else if (between.length === 1) {
        // Onset maximization: give to current syllable
        onset = between;
      } else {
        // Split by sonority: find the lowest sonority point
        let splitAt = 1; // default: first char as coda, rest as onset
        let minSon = Infinity;
        for (let j = 0; j < between.length; j++) {
          const s = sonority(between[j]);
          if (s < minSon) {
            minSon = s;
            splitAt = j + 1;
          }
        }
        // Give chars before split to previous syllable's coda
        syllables[syllables.length - 1].coda = between.slice(0, splitAt);
        onset = between.slice(splitAt);
      }
    }

    coda = "";
    if (n === nuclei.length - 1) {
      // Last nucleus: everything after is coda
      coda = lower.slice(nuc.end);
    }

    syllables.push({ onset, nucleus: nuc.text, coda });
  }

  return syllables;
}

// Valid onset clusters in English
const VALID_ONSETS = new Set([
  "", "b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z",
  "bl", "br", "ch", "cl", "cr", "dr", "dw", "fl", "fr", "gl", "gr", "kn", "ph", "pl", "pr", "qu",
  "sc", "sh", "sk", "sl", "sm", "sn", "sp", "st", "sw", "th", "tr", "tw", "wh", "wr",
  "scr", "shr", "spl", "spr", "str", "thr",
]);

// Forbidden consonant sequences
const FORBIDDEN_SEQUENCES = [
  "dt", "td", "pb", "bp", "kg", "gk", "pk", "kp",
  "fb", "bf", "vg", "gv", "zd", "dz", "sr", "lr",
  "mn", "nm", "tl", "dl",
];

/**
 * Check if a syllable sequence is phonotactically valid.
 */
export function isValidSequence(syllables: Syllable[]): boolean {
  for (const syl of syllables) {
    // Check onset validity (relaxed — allow if it appeared in corpus)
    if (syl.onset.length > 3) return false;

    // Check nucleus exists for non-initial syllables
    if (syl.nucleus.length === 0) return false;
  }

  // Check cross-syllable transitions (coda + next onset)
  for (let i = 0; i < syllables.length - 1; i++) {
    const transition = syllables[i].coda + syllables[i + 1].onset;
    for (const forbidden of FORBIDDEN_SEQUENCES) {
      if (transition.includes(forbidden)) return false;
    }
  }

  // Basic sonority check: onset should rise, coda should fall
  for (const syl of syllables) {
    if (syl.onset.length >= 2) {
      const first = sonority(syl.onset[0]);
      const last = sonority(syl.onset[syl.onset.length - 1]);
      if (first > last && !syl.onset.startsWith("s")) return false;
    }
    if (syl.coda.length >= 2) {
      const first = sonority(syl.coda[0]);
      const last = sonority(syl.coda[syl.coda.length - 1]);
      if (first < last) return false;
    }
  }

  return true;
}
