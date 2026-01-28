import { syllabify, type Syllable } from "./syllabify";

interface FreqMap {
  [key: string]: number;
}

interface BigramMap {
  [key: string]: FreqMap;
}

export class NameCorpus {
  onsets: FreqMap = {};
  nuclei: FreqMap = {};
  codas: FreqMap = {};
  finalCodas: FreqMap = {};
  // Bigrams: onset->nucleus, nucleus->coda, coda->nextOnset
  onsetToNucleus: BigramMap = {};
  nucleusToCoda: BigramMap = {};
  codaToOnset: BigramMap = {};
  totalNames = 0;

  learn(names: string[]): void {
    for (const name of names) {
      const syls = syllabify(name);
      if (syls.length === 0) continue;
      this.totalNames++;

      for (let i = 0; i < syls.length; i++) {
        const s = syls[i];
        this.inc(this.onsets, s.onset);
        this.inc(this.nuclei, s.nucleus);

        if (i === syls.length - 1) {
          this.inc(this.finalCodas, s.coda);
        } else {
          this.inc(this.codas, s.coda);
        }

        // Bigrams within syllable
        this.incBigram(this.onsetToNucleus, s.onset, s.nucleus);
        this.incBigram(this.nucleusToCoda, s.nucleus, s.coda);

        // Bigram across syllable boundary
        if (i < syls.length - 1) {
          this.incBigram(this.codaToOnset, s.coda, syls[i + 1].onset);
        }
      }
    }
  }

  private inc(map: FreqMap, key: string): void {
    map[key] = (map[key] ?? 0) + 1;
  }

  private incBigram(map: BigramMap, ctx: string, key: string): void {
    if (!map[ctx]) map[ctx] = {};
    map[ctx][key] = (map[ctx][key] ?? 0) + 1;
  }

  /**
   * Sample a key from a frequency map, weighted by count.
   * If a bigram context is provided, blend bigram and unigram distributions.
   */
  sample(unigram: FreqMap, bigram?: BigramMap, context?: string): string {
    // Try bigram first with 70% weight
    let map = unigram;
    if (bigram && context !== undefined && bigram[context]) {
      const bi = bigram[context];
      // Merge: 70% bigram, 30% unigram
      map = {};
      const biTotal = Object.values(bi).reduce((a, b) => a + b, 0);
      const uniTotal = Object.values(unigram).reduce((a, b) => a + b, 0);
      for (const key of new Set([...Object.keys(bi), ...Object.keys(unigram)])) {
        const biWeight = ((bi[key] ?? 0) / biTotal) * 0.7;
        const uniWeight = ((unigram[key] ?? 0) / uniTotal) * 0.3;
        map[key] = biWeight + uniWeight;
      }
    }

    const entries = Object.entries(map);
    if (entries.length === 0) return "";
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let r = Math.random() * total;
    for (const [key, w] of entries) {
      r -= w;
      if (r <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  sampleSyllable(index: number, totalSyllables: number, prevCoda?: string): Syllable {
    const onset = this.sample(this.onsets, this.codaToOnset, prevCoda);
    const nucleus = this.sample(this.nuclei, this.onsetToNucleus, onset);
    const isFinal = index === totalSyllables - 1;
    const codaMap = isFinal ? this.finalCodas : this.codas;
    const coda = this.sample(codaMap, this.nucleusToCoda, nucleus);
    return { onset, nucleus, coda };
  }
}
