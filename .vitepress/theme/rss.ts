import { dirname } from "path";
import fg from "fast-glob";
import fs from "fs-extra";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import type { FeedOptions, Item } from "feed";
import { Feed } from "feed";

const DOMAIN = "https://qiang-chen.github.io/";
const AUTHOR = {
  name: "玉麟 & 阿幺",
  email: "chenqiang171@163.com",
  link: DOMAIN,
};
const OPTIONS: FeedOptions = {
  title: "玉麟 & 阿幺",
  description: "玉麟 & 阿幺' Blog",
  id: `${DOMAIN}/`,
  link: `${DOMAIN}/`,
  copyright: "MIT License",
  feedLinks: {
    json: DOMAIN + "/feed.json",
    atom: DOMAIN + "/feed.atom",
    rss: DOMAIN + "/feed.xml",
  },
  author: AUTHOR,
  image: "https://qiang-chen.github.io/blog/bird.svg",
  favicon: "https://qiang-chen.github.io/blog/bird.svg",
};

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export async function buildBlogRSS() {
  const posts = await generateRSS();
  writeFeed("feed", posts);
}

async function generateRSS() {
  const jsFiles = await fg("js/*.md");
  const dicomFiles = await fg("dicom/*.md");
  const httpFiles = await fg("http/*.md");
  const webFiles = await fg("web/*.md");
  const vueFiles = await fg("vue/*.md");
  const algorithmFiles = await fg("算法/*.md");
  const chajianFiles = await fg("插件/*.md");


  const posts: any[] = (
    await Promise.all(
      [...jsFiles,...dicomFiles,...httpFiles,...webFiles,...vueFiles,...algorithmFiles,...chajianFiles]
        .filter((i) => !i.includes("index"))
        .map(async (i) => {
          const raw = await fs.readFile(i, "utf-8");
          const { data, content } = matter(raw);
          const html = markdown
            .render(content)
            .replace('src="/', `src="${DOMAIN}/`);

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: `${DOMAIN}/${i.replace(".md", ".html")}`,
          };
        })
    )
  ).filter(Boolean);

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return posts;
}

async function writeFeed(name: string, items: Item[]) {
  const feed = new Feed(OPTIONS);
  items.forEach((item) => feed.addItem(item));

  await fs.ensureDir(dirname(`./.vitepress/dist/${name}`));
  await fs.writeFile(`./.vitepress/dist/${name}.xml`, feed.rss2(), "utf-8");
  await fs.writeFile(`./.vitepress/dist/${name}.atom`, feed.atom1(), "utf-8");
  await fs.writeFile(`./.vitepress/dist/${name}.json`, feed.json1(), "utf-8");
}
