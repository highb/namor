/**
 * Build script that pre-computes corpus frequency tables from the existing
 * syllabify/corpus modules and emits a self-contained HTML file with the
 * friend's UI, replacing the random generator with corpus-based sampling.
 *
 * Usage: npx tsx scripts/build-standalone.ts > standalone.html
 */

import { NameCorpus } from "../src/corpus";
import names from "../src/data/names.json";

// Pre-compute all frequency tables
const corpus = new NameCorpus();
corpus.learn(names);

const corpusData = JSON.stringify({
  onsets: corpus.onsets,
  nuclei: corpus.nuclei,
  codas: corpus.codas,
  finalCodas: corpus.finalCodas,
  onsetToNucleus: corpus.onsetToNucleus,
  nucleusToCoda: corpus.nucleusToCoda,
  codaToOnset: corpus.codaToOnset,
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Namor - Name Generator</title>
<style>
  .noise-gen { font-family: system-ui, sans-serif; max-width: 600px; }
  .row { display: flex; gap: 12px; align-items: center; margin: 10px 0; }
  label { width: 110px; font-weight: 600; }
  input[type="range"] { flex: 1; }

  #results { margin-top: 12px; padding: 10px; border: 1px solid #9993; border-radius: 8px; }
  .item { cursor: pointer; padding: 6px 8px; border-radius: 6px; user-select: none; }
  .item:hover { background: #0001; }

  .status { font-size: 12px; opacity: 0.75; }
</style>
</head>
<body>
<div class="noise-gen">
  <div class="row">
    <label for="syllables">Base syllables</label>
    <input id="syllables" type="range" min="1" max="5" step="1" value="1" />
    <span id="syllVal">1</span>
  </div>

  <div class="row">
    <label for="noise">Noise range</label>
    <input id="noise" type="range" min="1" max="6" step="1" value="3" />
    <span id="noiseVal">3</span>
  </div>

  <div class="row">
    <button id="gen" type="button">Generate 10</button>
    <span id="status" class="status">Click a result to copy</span>
  </div>

  <div id="results"></div>
</div>

<script>
// --- Pre-computed corpus frequency tables (inlined at build time) ---
const C = ${corpusData};

const FORBIDDEN = [
  "dt","td","pb","bp","kg","gk","pk","kp",
  "fb","bf","vg","gv","zd","dz","sr","lr",
  "mn","nm","tl","dl"
];

const SONORITY = {
  a:10,e:10,i:10,o:10,u:10,y:8,
  r:6,l:6,m:5,n:5,v:4,z:4,f:4,s:4,
  b:2,d:2,g:2,p:1,t:1,k:1,c:1,q:1,x:1,h:3,w:7,j:3
};

function sonority(ch) { return SONORITY[ch] || 2; }

function sample(unigram, bigram, context) {
  var map = unigram;
  if (bigram && context !== undefined && bigram[context]) {
    var bi = bigram[context];
    map = {};
    var biTotal = 0, uniTotal = 0;
    for (var k in bi) biTotal += bi[k];
    for (var k in unigram) uniTotal += unigram[k];
    var keys = new Set(Object.keys(bi).concat(Object.keys(unigram)));
    keys.forEach(function(key) {
      map[key] = ((bi[key] || 0) / biTotal) * 0.7 + ((unigram[key] || 0) / uniTotal) * 0.3;
    });
  }
  var entries = Object.entries(map);
  if (!entries.length) return "";
  var total = entries.reduce(function(s, e) { return s + e[1]; }, 0);
  var r = Math.random() * total;
  for (var i = 0; i < entries.length; i++) {
    r -= entries[i][1];
    if (r <= 0) return entries[i][0];
  }
  return entries[entries.length - 1][0];
}

function isValid(syls) {
  for (var i = 0; i < syls.length; i++) {
    if (syls[i].onset.length > 3 || !syls[i].nucleus) return false;
    if (syls[i].onset.length >= 2) {
      var a = sonority(syls[i].onset[0]), b = sonority(syls[i].onset[syls[i].onset.length-1]);
      if (a > b && syls[i].onset[0] !== "s") return false;
    }
    if (syls[i].coda.length >= 2) {
      var a = sonority(syls[i].coda[0]), b = sonority(syls[i].coda[syls[i].coda.length-1]);
      if (a < b) return false;
    }
  }
  for (var i = 0; i < syls.length - 1; i++) {
    var t = syls[i].coda + syls[i+1].onset;
    for (var j = 0; j < FORBIDDEN.length; j++) {
      if (t.indexOf(FORBIDDEN[j]) >= 0) return false;
    }
  }
  return true;
}

function generateOne(syllableCount) {
  for (var attempt = 0; attempt < 50; attempt++) {
    var syls = [];
    for (var i = 0; i < syllableCount; i++) {
      var prevCoda = i > 0 ? syls[i-1].coda : undefined;
      var onset = sample(C.onsets, C.codaToOnset, prevCoda);
      var nucleus = sample(C.nuclei, C.onsetToNucleus, onset);
      var codaMap = (i === syllableCount - 1) ? C.finalCodas : C.codas;
      var coda = sample(codaMap, C.nucleusToCoda, nucleus);
      syls.push({ onset: onset, nucleus: nucleus, coda: coda });
    }
    if (!isValid(syls)) continue;
    var name = syls.map(function(s) { return s.onset + s.nucleus + s.coda; }).join("");
    if (name.length < 2 || name.length > 12) continue;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return "Namora";
}

// --- UI glue (preserved from original) ---
var elSyll = document.getElementById("syllables");
var elNoise = document.getElementById("noise");
var elSyllVal = document.getElementById("syllVal");
var elNoiseVal = document.getElementById("noiseVal");
var elResults = document.getElementById("results");
var elStatus = document.getElementById("status");
var elGen = document.getElementById("gen");

function sync() {
  elSyllVal.textContent = elSyll.value;
  elNoiseVal.textContent = elNoise.value;
}

function setStatus(msg) {
  elStatus.textContent = msg;
  clearTimeout(setStatus._t);
  setStatus._t = setTimeout(function() {
    elStatus.textContent = "Click a result to copy";
  }, 700);
}

function copyWord(div, word) {
  function onSuccess() {
    div.textContent = word + " (copied)";
    setStatus("Copied!");
    setTimeout(function() { div.textContent = word; }, 700);
  }
  // Try modern clipboard API first, fall back for file:// contexts
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(word).then(onSuccess, function() {
      fallbackCopy(word) ? onSuccess() : setStatus("Copy failed");
    });
  } else {
    fallbackCopy(word) ? onSuccess() : setStatus("Copy failed");
  }
}

function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  var ok = false;
  try { ok = document.execCommand("copy"); } catch(e) {}
  document.body.removeChild(ta);
  return ok;
}

function generate() {
  elResults.innerHTML = "";
  var base = Number(elSyll.value);
  var range = Number(elNoise.value);
  var seen = {};
  for (var i = 0; i < 10; i++) {
    var s = base + Math.floor(Math.random() * range);
    var word = generateOne(s);
    while (seen[word]) word = generateOne(s);
    seen[word] = true;
    var div = document.createElement("div");
    div.className = "item";
    div.textContent = word;
    div.addEventListener("click", (function(d,w){ return function(){ copyWord(d,w); }; })(div, word));
    elResults.appendChild(div);
  }
}

elSyll.addEventListener("input", sync);
elNoise.addEventListener("input", sync);
elGen.addEventListener("click", generate);
sync();
generate();
</script>
</body>
</html>`;

process.stdout.write(html);
