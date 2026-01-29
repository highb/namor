import { NameCorpus } from "./corpus";
import { isValidSequence, type Syllable } from "./syllabify";

export class NameGenerator {
  private corpus: NameCorpus;

  constructor(corpus: NameCorpus) {
    this.corpus = corpus;
  }

  generate(syllableCount: number, prefix = ""): string {
    const lowerPrefix = prefix.toLowerCase();
    const maxAttempts = prefix ? 200 : 50;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const syllables: Syllable[] = [];
      for (let i = 0; i < syllableCount; i++) {
        const prevCoda = i > 0 ? syllables[i - 1].coda : undefined;
        syllables.push(this.corpus.sampleSyllable(i, syllableCount, prevCoda));
      }

      if (!isValidSequence(syllables)) continue;

      const name = syllables.map((s) => s.onset + s.nucleus + s.coda).join("");
      if (name.length < 2 || name.length > 12) continue;
      if (lowerPrefix && !name.startsWith(lowerPrefix)) continue;

      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    // Fallback
    return "Namora";
  }

  generateBatch(count: number, syllableCount: number, prefix = ""): string[] {
    const names = new Set<string>();
    let safety = 0;
    while (names.size < count && safety < count * 10) {
      names.add(this.generate(syllableCount, prefix));
      safety++;
    }
    return [...names];
  }
}
