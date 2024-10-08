import Theme from "vitepress/theme";
import Tags from "./components/Tags.vue";
import MyLayout from "./components/MyLayout.vue";
import TwoslashFloatingVue from "@shikijs/vitepress-twoslash/client";
import "@shikijs/vitepress-twoslash/style.css";
import type { EnhanceAppContext } from "vitepress";

import "./custom.css";

export default {
  extends: Theme,
  Layout: MyLayout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component("Tags", Tags);
    app.use(TwoslashFloatingVue);
  },
};
