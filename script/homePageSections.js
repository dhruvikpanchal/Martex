import { load } from "./load.js";

for (let i = 1; i <= 20; i++) {
  load(`section-${i}`, `components/homePage/section-${i}.html`);
}
