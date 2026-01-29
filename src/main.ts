import { NameCorpus } from "./corpus";
import { NameGenerator } from "./generator";
import names from "./data/names.json";

const corpus = new NameCorpus();
corpus.learn(names);
const generator = new NameGenerator(corpus);

const btn = document.getElementById("generate") as HTMLButtonElement;
const list = document.getElementById("names") as HTMLUListElement;
const slider = document.getElementById("syllables") as HTMLInputElement;
const sylVal = document.getElementById("syl-val") as HTMLSpanElement;
const status = document.getElementById("status") as HTMLParagraphElement;
const prefixInput = document.getElementById("prefix") as HTMLInputElement;

slider.addEventListener("input", () => {
  sylVal.textContent = slider.value;
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
