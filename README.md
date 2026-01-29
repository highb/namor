# Namor

Corpus-based English-speaker pronounceable name generator that runs entirely in the browser.

**[Live Demo](https://highb.github.io/namor/)** | **[Download Standalone HTML](https://highb.github.io/namor/standalone.html)**

## How It Works

This generator uses **corpus-based phonotactics** rather than random letter combinations. It learns what makes names "sound like names" by analyzing real name patterns.

The approach:
1. **Syllabification**: Breaks training names into onset (initial consonants), nucleus (vowel), and coda (final consonants)
2. **Frequency extraction**: Counts how often each pattern appears in real names
3. **Weighted sampling**: Generates new names by probabilistically combining these patterns

Unlike random generators that produce unpronounceable gibberish like "xqztl", this respects English phonotactic constraints - the rules for which sound combinations are actually possible. For example, English allows "pl" at the start of syllables (plant, please) but not "lp", so the generator learns this from the training data.

The result: pronounceable nonsense that feels plausible, even when it's meaningless.

For a deeper dive into the linguistics, see [THEORY.md](THEORY.md).

## Development

```bash
npm install
npm run dev
```

## Build

### Vite app (GitHub Pages)

```bash
npm run build
```

Output goes to `dist/`. Deployed automatically to GitHub Pages on push to `main`.

### Standalone HTML

```bash
npm run build:standalone
```

Produces a single `standalone.html` file (~11KB) with no external dependencies. This is a drop-in replacement for any existing name/noise generator widget — same UI controls (base syllables slider, noise range slider, click-to-copy results), but powered by the corpus-based algorithm.

The build script (`scripts/build-standalone.ts`) imports the same `NameCorpus` and `syllabify` modules used by the main app, trains the corpus at build time, and inlines the pre-computed frequency tables (onsets, nuclei, codas, bigram transitions) as JSON directly into the HTML. At runtime, the standalone file only does weighted sampling and validation — no syllabification or corpus training happens in the browser.

## Project Structure

```
namor/
├── src/
│   ├── syllabify.ts          # Syllable segmentation (onset/nucleus/coda)
│   │                         # and sonority-based phonotactic validation
│   ├── corpus.ts             # NameCorpus class — learns frequency tables
│   │                         # and bigram transitions from training names
│   ├── generator.ts          # NameGenerator — weighted sampling with
│   │                         # reject/regenerate loop for invalid output
│   ├── main.ts               # Vite app entry point (UI wiring)
│   ├── index.html            # Vite app page
│   └── data/
│       └── names-*.json      # 43 language corpora (MatthiasWinkelmann/firstname-database)
├── scripts/
│   └── build-standalone.ts   # Builds self-contained HTML with inlined
│                             # pre-computed corpus data
├── .github/workflows/
│   └── deploy.yml            # GitHub Pages deployment via Actions
├── vite.config.ts
├── tsconfig.json
├── THEORY.md                 # Linguistic background and references
└── README.md
```

## Sources for Further Reading (Might be hallucinations)

### Foundational Linguistics

**Sonority and Syllable Structure**
- Clements, G. N. (1990). "The role of the sonority cycle in core syllabification." *Papers in Laboratory Phonology I*, 283-333.
- Kahn, D. (1976). *Syllable-based generalizations in English phonology*. MIT dissertation.
- Blevins, J. (1995). "The syllable in phonological theory." *The Handbook of Phonological Theory*, 206-244.

**English Phonotactics**
- Hammond, M. (1999). *The Phonology of English: A Prosodic Optimality-Theoretic Approach*. Oxford University Press.
- Giegerich, H. J. (1992). *English Phonology: An Introduction*. Cambridge University Press.

### Computational/Corpus Approaches

- Jurafsky, D. & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed. draft). [Chapter 3](https://web.stanford.edu/~jurafsky/slp3/).
- Coleman, J. S. & Pierrehumbert, J. (1997). "Stochastic phonological grammars and acceptability." *Computational Phonology*, 49-56.
- Sejnowski, T. J. & Rosenberg, C. R. (1987). "Parallel networks that learn to pronounce English text." *Complex Systems*, 1, 145-168.

### Training Corpora

43 language corpora (`names-*.json`) are extracted from [MatthiasWinkelmann/firstname-database](https://github.com/MatthiasWinkelmann/firstname-database), a curated multinational first name database (GNU Free Documentation License).
26 mythological names (`myth-*.json`) are extracted from [repushko/mythology_names_dataset](https://github.com/repushko/mythology_names_dataset), a curated mythological names database (CC0 1.0 Universal).

### Other Datasets and Tools

- [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) - 134,000+ English words mapped to phoneme sequences
- [Wiktionary](https://en.wiktionary.org/) - IPA pronunciations for many names across languages

### Accessible Introductions

- Fromkin, V., Rodman, R., & Hyams, N. (2018). *An Introduction to Language* (11th ed.). Cengage.
- Ladefoged, P. & Johnson, K. (2014). *A Course in Phonetics* (7th ed.). Cengage.
