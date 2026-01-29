import { NameCorpus } from "./corpus";
import { NameGenerator } from "./generator";
import namesEn from "./data/names-en.json";
import namesEs from "./data/names-es.json";

const corpora: Record<string, NameCorpus> = {};
for (const [lang, names] of Object.entries({ en: namesEn, es: namesEs } as Record<string, string[]>)) {
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
const weightSliders = document.querySelectorAll<HTMLInputElement>(".lang-weight");

function rebuildCorpus(): void {
  const langs: string[] = [];
  const weights: number[] = [];
  weightSliders.forEach((s) => {
    langs.push(s.dataset.lang!);
    weights.push(parseInt(s.value, 10));
  });
  corpus = NameCorpus.blendMany(
    langs.map((l) => corpora[l]),
    weights,
  );
  generator = new NameGenerator(corpus);

  const total = weights.reduce((s, w) => s + w, 0) || 1;
  const pcts = langs.map((l, i) => `${l.toUpperCase()} ${Math.round((weights[i] / total) * 100)}%`);
  mixInfo.textContent = `Mix: ${pcts.join(" / ")}`;
}

slider.addEventListener("input", () => {
  sylVal.textContent = slider.value;
});

weightSliders.forEach((s) => {
  s.addEventListener("input", () => {
    rebuildCorpus();
    render();
  });
});

function render(): void {
  const count = parseInt(slider.value, 10);
  const prefix = prefixInput.value.trim();
  const batch = generator.generateBatch(10, count, prefix);
  list.innerHTML = batch.map((n) => `<li>${n}</li>`).join("");
  status.textContent = `Trained on ${corpus.totalNames} names`;
}

rebuildCorpus();
btn.addEventListener("click", render);
render();
