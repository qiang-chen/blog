import { getPosts, getPostLength } from "./theme/serverUtils";
import { buildBlogRSS } from "./theme/rss";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import mathjax3 from "markdown-it-mathjax3";

async function config() {
  return {
    base: '/blog/',
    lang: "en-US",
    title: "玉麟 & 阿幺",
    description: "Home of 玉麟 & 阿幺",
    head: [
      [
        "link",
        {
          rel: "icon",
          type: "image/svg",
          href: "bird.svg",
        },
      ],
      [
        "meta",
        {
          name: "author",
          content: "玉麟 & 阿幺",
        },
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "Home",
        },
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Home of 玉麟 & 阿幺",
        },
      ],
    ],
    // cleanUrls: "with-subfolders",
    lastUpdated: false,
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "/bird.svg",
      avator: "/avator.png",
      search: {
        provider: "local",
      },
      docsDir: "/",
      // docsBranch: "master",
      posts: await getPosts(),
      pageSize: 5,
      postLength: await getPostLength(),
      nav: [
        {
          text: "🏡Blogs",
          link: "/",
        },
        {
          text: "🔖Tags",
          link: "/tags",
        },
      ],
      // 去掉githup显示
      // socialLinks: [
      //   { icon: "github", link: "https://qiang-chen.github.io/blog" },
      // ],
      // outline: 2, //设置右侧aside显示层级
      aside: false,
      // blogs page show firewokrs animation
      showFireworksAnimation: false,
    },
    buildEnd: buildBlogRSS,
    markdown: {
      theme: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
      codeTransformers: [transformerTwoslash()],
      config: (md) => {
        md.use(mathjax3);
      },
    },
    // vite: {
    //   ssr: {
    //     noExternal: ["vitepress-plugin-twoslash"],
    //   },
    // },
  };
}
export default config();
