import { NameCorpus } from "./corpus";
import { NameGenerator } from "./generator";
import namesEn from "./data/names-en.json";
import namesEs from "./data/names-es.json";

const datasets: Record<string, string[]> = { en: namesEn, es: namesEs };

let corpus = new NameCorpus();
corpus.learn(namesEn);
let generator = new NameGenerator(corpus);

const btn = document.getElementById("generate") as HTMLButtonElement;
const list = document.getElementById("names") as HTMLUListElement;
const slider = document.getElementById("syllables") as HTMLInputElement;
const sylVal = document.getElementById("syl-val") as HTMLSpanElement;
const status = document.getElementById("status") as HTMLParagraphElement;
const prefixInput = document.getElementById("prefix") as HTMLInputElement;
const datasetSelect = document.getElementById("dataset") as HTMLSelectElement;

slider.addEventListener("input", () => {
  sylVal.textContent = slider.value;
});

datasetSelect.addEventListener("change", () => {
  corpus = new NameCorpus();
  corpus.learn(datasets[datasetSelect.value]);
  generator = new NameGenerator(corpus);
  render();
});

function render(): void {
  const count = parseInt(slider.value, 10);
  const prefix = prefixInput.value.trim();
  const batch = generator.generateBatch(10, count, prefix);
  list.innerHTML = batch.map((n) => `<li>${n}</li>`).join("");
  status.textContent = `Trained on ${corpus.totalNames} names`;
}

btn.addEventListener("click", render);
render();
