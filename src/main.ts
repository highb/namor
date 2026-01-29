import { NameCorpus } from "./corpus";
import { NameGenerator } from "./generator";
import { REGIONS, LANG_DATA } from "./languages";

const corpora: Record<string, NameCorpus> = {};
for (const [lang, names] of Object.entries(LANG_DATA)) {
  const c = new NameCorpus();
  c.learn(names);
  corpora[lang] = c;
}

let corpus: NameCorpus;
let generator: NameGenerator;

const mixInfo = document.getElementById("mix-info") as HTMLParagraphElement;
const btn = document.getElementById("generate") as HTMLButtonElement;
const list = document.getElementById("names") as HTMLUListElement;
const slider = document.getElementById("syllables") as HTMLInputElement;
const sylVal = document.getElementById("syl-val") as HTMLSpanElement;
const status = document.getElementById("status") as HTMLParagraphElement;
const prefixInput = document.getElementById("prefix") as HTMLInputElement;
const langControls = document.getElementById("lang-controls") as HTMLDivElement;
const resetBtn = document.getElementById("reset-lang") as HTMLButtonElement;

// Detect browser language, fall back to "en"
function detectBrowserLang(): string {
  const raw = navigator.language?.split("-")[0]?.toLowerCase() ?? "en";
  return raw in LANG_DATA ? raw : "en";
}

const browserLang = detectBrowserLang();

// Build language slider DOM
for (const region of REGIONS) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = region.name;
  details.appendChild(summary);

  for (const lang of region.langs) {
    const row = document.createElement("div");
    row.className = "lang-row";
    const span = document.createElement("span");
    span.className = "lang-label";
    span.textContent = lang.label;
    const input = document.createElement("input");
    input.type = "range";
    input.className = "lang-weight";
    input.dataset.lang = lang.code;
    input.min = "0";
    input.max = "100";
    input.value = lang.code === browserLang ? "100" : "0";
    span.addEventListener("click", () => {
      input.value = parseInt(input.value, 10) < 100 ? "100" : "0";
      rebuildCorpus();
      render();
    });
    row.appendChild(span);
    row.appendChild(input);
    details.appendChild(row);
  }

  // Auto-open regions that have non-zero defaults
  if (region.langs.some((l) => l.code === browserLang)) {
    details.open = true;
  }

  langControls.appendChild(details);
}

function getWeightSliders(): HTMLInputElement[] {
  return Array.from(document.querySelectorAll<HTMLInputElement>(".lang-weight"));
}

function rebuildCorpus(): void {
  const langs: string[] = [];
  const weights: number[] = [];
  for (const s of getWeightSliders()) {
    langs.push(s.dataset.lang!);
    weights.push(parseInt(s.value, 10));
  }
  corpus = NameCorpus.blendMany(
    langs.map((l) => corpora[l]),
    weights,
  );
  generator = new NameGenerator(corpus);

  const total = weights.reduce((s, w) => s + w, 0) || 1;
  const active = langs
    .map((l, i) => ({ l, w: weights[i] }))
    .filter((x) => x.w > 0);
  const pcts = active.map(
    (x) => `${x.l.toUpperCase()} ${Math.round((x.w / total) * 100)}%`,
  );
  mixInfo.textContent = `Mix: ${pcts.join(" / ")}`;
}

slider.addEventListener("input", () => {
  sylVal.textContent = slider.value;
  render();
});

langControls.addEventListener("input", (e) => {
  if ((e.target as HTMLElement).classList.contains("lang-weight")) {
    rebuildCorpus();
    render();
  }
});

function render(): void {
  const count = parseInt(slider.value, 10);
  const prefix = prefixInput.value.trim();
  const batch = generator.generateBatch(10, count, prefix);
  list.innerHTML = batch.map((n) => `<li>${n}</li>`).join("");
  status.textContent = `Trained on ${corpus.totalNames} names`;
}

function resetToBrowserLang(): void {
  const lang = detectBrowserLang();
  for (const s of getWeightSliders()) {
    s.value = s.dataset.lang === lang ? "100" : "0";
  }
  // Open the matching details group, close others
  const allDetails = langControls.querySelectorAll("details");
  const allLangs = REGIONS.map((r) => ({ name: r.name, codes: r.langs.map((l) => l.code) }));
  allDetails.forEach((d, i) => {
    d.open = allLangs[i]?.codes.includes(lang) ?? false;
  });
  rebuildCorpus();
  render();
}

resetBtn.addEventListener("click", resetToBrowserLang);

rebuildCorpus();
btn.addEventListener("click", render);
render();
