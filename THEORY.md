# The Linguistic Theory Behind Pronounceable Name Generation

## Why Most Name Generators Suck

Traditional "random name generators" typically work by either:
1. Randomly concatenating syllables from a fixed list
2. Following simple pattern templates (CVCVC, etc.)
3. Applying basic letter frequency statistics

These produce names like "Qrztnx", "Blimp", or "Aaeooi" - technically pronounceable by some standard, but obviously not real names. The problem: they ignore **phonotactics**, the systematic constraints on which sound combinations are legal in a language.

## Phonotactics: The Rules You Never Learned

Every language has implicit rules about sound combinations. Native speakers internalize these rules without ever being taught them explicitly. For English:

### Legal and Illegal Consonant Clusters

**Legal onsets** (syllable-initial consonants):
- "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "tr"
- "sc", "sk", "sl", "sm", "sn", "sp", "st", "sw"
- "spr", "str", "spl", "shr", "thr"

**Illegal onsets** (never appear in English):
- "lp", "mb", "tn", "bd", "gp"
- Most clusters that violate sonority sequencing (see below)

**Legal codas** (syllable-final consonants):
- "nt", "nd", "st", "mp", "nk", "lt", "ld", "pt", "kt"
- "nch", "nth", "ndth"

**Illegal codas**:
- "tf", "kg", "dt", "pb"
- Complex clusters that violate sonority

These aren't arbitrary - they're constrained by the Sonority Sequencing Principle.

## The Sonority Sequencing Principle (SSP)

**Core concept**: Sonority is how "loud" or "resonant" a sound is. Syllables prefer to rise in sonority toward the vowel and fall away from it.

**Sonority hierarchy** (least to most sonorous):
```
stops (p,b,t,d,k,g) < fricatives (f,v,s,z,sh,th) < nasals (m,n) < liquids (l,r) < glides (w,y) < vowels
```

**Why "play" works but "lpay" doesn't:**
- "play": p(1) -> l(4) -> ay(6) - rising sonority to peak
- "lpay": l(4) -> p(1) -> ay(6) - drops before rising

**Why "help" works but "hepl" doesn't:**
- "help": e(6) -> l(4) -> p(1) - falling sonority from peak
- "hepl": e(6) -> p(1) -> l(4) - rises after falling

The SSP isn't absolute - languages violate it sometimes (/spr/ in "spring" is a famous English violation), but violations are marked and restricted. The principle correctly predicts the vast majority of phonotactic patterns.

## Syllable Structure

Every syllable has three parts:
- **Onset**: Initial consonant(s) - optional in English
- **Nucleus**: The vowel - required
- **Coda**: Final consonant(s) - optional in English

```
      Syllable
      /      \
   Onset   Rhyme
           /    \
       Nucleus  Coda
```

**Cross-linguistic universals:**
1. CV (consonant-vowel) is the most common syllable type across languages
2. Complex codas are rarer than complex onsets
3. All languages allow onsets; many prohibit codas entirely
4. The nucleus is always present (it's the syllable peak)

**English-specific patterns:**
- Allows both complex onsets (3 consonants max: "str") and complex codas (4 consonants max: "sixths")
- Prefers open syllables (no coda) in casual speech - we reduce "potato" to [pa.tei.do]
- Word-final syllables often have codas; word-medial syllables often don't

## Corpus-Based Learning: Let the Data Speak

Rather than hard-coding these rules, this generator **learns them from data**. Here's how:

### 1. Syllabification

Given a name like "Brandon":
```
B-r-a-n-d-o-n
```

We split it into syllables using the **maximal onset principle** (give as many consonants to the onset as possible while respecting phonotactics):

```
Br-an-don
|  |  |
|  |  +-- Onset: d, Nucleus: o, Coda: n
|  +----- Onset: -, Nucleus: a, Coda: n
+-------- Onset: br, Nucleus: a, Coda: -
```

This is approximate because English orthography is inconsistent (consider "through" vs "though"), but good enough for name generation.

### 2. Frequency Extraction

After syllabifying thousands of names, we count:
- How often "br" appears as an onset (Brandon, Brian, Brent...)
- How often "a" appears as a nucleus
- How often "n" appears as a coda (Brandon, Dylan, Logan...)

Build frequency tables:
```
onsets: { "br": 157, "j": 892, "m": 1043, ... }
nuclei: { "a": 2341, "e": 1876, "i": 2103, ... }
codas:  { "n": 3421, "l": 1234, "s": 987, ... }
```

### 3. N-gram Smoothing

Just counting individual components isn't enough - some combinations are more natural than others. Track **bigrams** (component pairs):

```
"Brandon" -> br|a, a|n, n|d, d|o, o|n
```

This helps avoid jarring transitions. "br" followed by "a" appears frequently (Brandon, Brad, Brayden), so it's a high-probability transition. "q" followed by "u" appears very frequently, while "q" followed by "a" almost never does.

### 4. Weighted Sampling

Generate a new name by:
1. Sample onset from frequency distribution (higher frequency = more likely)
2. Sample nucleus, weighted by bigram with preceding onset
3. Sample coda (or skip with some probability for open syllables)
4. Repeat for desired syllable count
5. Reject if bigram transitions are improbable or sonority is violated

**Example generation:**
- Syllable 1: Sample onset -> "br" (high frequency), nucleus -> "ai" (common after labials), no coda (first syllable often open)
- Syllable 2: Sample onset -> "l" (common medial consonant), nucleus -> "o" (common), coda -> "n" (very common final coda)
- Result: "Brailon"

The result respects English phonotactics because it learned from English names. It "sounds right" even though it's nonsense.

## Why This Approach Works

**Advantages:**
1. **Data-driven**: Discovers patterns automatically, no manual rule-writing
2. **Probabilistic**: Can generate infinite variations, weighted toward natural patterns
3. **Scalable**: Works with any language/corpus by just changing training data
4. **Linguistically motivated**: Based on actual syllable structure theory

**Limitations:**
1. **Orthography vs phonemes**: "tough" and "through" look similar but sound different
2. **Syllabification ambiguity**: "extra" could be "ex-tra" or "ext-ra"
3. **Rare patterns**: Low-frequency names might have interesting patterns that get lost
4. **No semantic awareness**: Can't avoid generating names that happen to be offensive words in other languages

## Comparison to Other Approaches

### Markov Chains
Traditional approach: n-gram model at the letter level. "Brandon" -> P(r|B), P(a|Br), P(n|Bra)...

**Problems:** No awareness of syllable boundaries, can violate phonotactic constraints, generates letter-by-letter without structural knowledge.

**Our approach:** Operates at syllable level, respects phonotactic constraints by construction.

### Neural Models
Modern approach: Train LSTM/Transformer on character sequences.

**Advantages:** Can learn complex, non-local patterns. Very flexible.

**Disadvantages:** Requires large training corpus, opaque (hard to understand what it learned), overkill for this task, needs GPU for training.

**Our approach:** Simpler, more interpretable, works with small corpora, runs in browser.

### Template-Based
Ancient approach: Fixed templates like "CVCVC", fill in randomly.

**Problems:** Rigid, repetitive output. Ignores frequency (treats all consonants equally). No notion of natural clustering.

**Our approach:** Templates emerge from data, weighted by naturalness.

## Future Directions

### Multi-language Support
Train on different name corpora:
- Japanese names (different phonotactics: no consonant clusters, syllables must be CV or CVN)
- Arabic names (different consonant inventory, trilateral roots)
- Finnish names (vowel harmony constraints)

### Phoneme-Level Processing
Use CMU Pronouncing Dictionary for true phoneme extraction:
- "Sean" -> /SH AO N/, not /S E A N/
- Better generalization across orthographic variation

### Stress Patterns
English names follow rhythmic patterns:
- **Trochaic**: strong-weak (Emily, Katherine, Jennifer)
- **Iambic**: weak-strong (Marie, Michelle, Antoine)

Could weight syllables by position and stress preference.

### Enhanced Validation
- Check against offensive word lists across languages
- Verify against existing name databases (avoid generating "John")
- More sophisticated sonority violation detection

## References

- Clements, G. N. (1990). "The role of the sonority cycle in core syllabification." *Papers in Laboratory Phonology I*, 283-333.
- Kahn, D. (1976). *Syllable-based generalizations in English phonology*. MIT dissertation.
- Blevins, J. (1995). "The syllable in phonological theory." *The Handbook of Phonological Theory*, 206-244.
- Jurafsky, D. & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed. draft). [Available online](https://web.stanford.edu/~jurafsky/slp3/).
- Coleman, J. S. & Pierrehumbert, J. (1997). "Stochastic phonological grammars and acceptability." *Computational Phonology*, 49-56.
- Sejnowski, T. J. & Rosenberg, C. R. (1987). "Parallel networks that learn to pronounce English text." *Complex Systems*, 1, 145-168.
- Hammond, M. (1999). *The Phonology of English*. Oxford University Press.
- Giegerich, H. J. (1992). *English Phonology: An Introduction*. Cambridge University Press.
- Ladefoged, P. & Johnson, K. (2014). *A Course in Phonetics* (7th ed.). Cengage.
