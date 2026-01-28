# Namor

Corpus-based pronounceable name generator that runs entirely in the browser.

**[Live Demo](https://highb.github.io/namor/)**

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

```bash
npm run build
```

Output goes to `dist/`. Deployed automatically to GitHub Pages on push to `main`.

## Sources for Further Reading

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

### Datasets and Tools

- [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) - 134,000+ English words mapped to phoneme sequences
- [SSA Baby Names Database](https://www.ssa.gov/oact/babynames/names.zip) - US baby names from 1880-present with frequency counts
- [Wiktionary](https://en.wiktionary.org/) - IPA pronunciations for many names across languages

### Accessible Introductions

- Fromkin, V., Rodman, R., & Hyams, N. (2018). *An Introduction to Language* (11th ed.). Cengage.
- Ladefoged, P. & Johnson, K. (2014). *A Course in Phonetics* (7th ed.). Cengage.
