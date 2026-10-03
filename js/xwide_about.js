/*
 * X-WIDE Use Everywhere —— 设置页里的「关于 / 作者」面板
 *
 * 这是本修复版新增的文件：在 ComfyUI 设置 -> Use Everywhere -> About 里
 * 显示版本、作者卡片与本次修复说明。
 */
import { VERSION } from "./shared.js";

const XWIDE_AUTHOR_PAGE = "https://github.com/XWIDE";
const XWIDE_REPO        = "https://github.com/XWIDE/comfyui-xwide-use-everywhere";
const ORIG_AUTHOR       = "chrisgoringe";
const ORIG_REPO         = "https://github.com/chrisgoringe/cg-use-everywhere";
const ORIG_COFFEE       = "https://www.buymeacoffee.com/chrisgoringe";

const STYLE_ID = "xwue-about-style";

const CSS = `
.xwue-about { max-width: 560px; font-size: 14px; line-height: 1.6; }
.xwue-about .xwue-title { font-size: 17px; font-weight: 700; color: #ffd479; }
.xwue-about .xwue-sub { font-size: 13px; color: #9aa0a8; margin: 4px 0 14px; }
.xwue-about .xwue-sec {
  font-size: 15px; font-weight: 600; color: #cfd4da;
  margin: 18px 0 10px; padding-top: 12px; border-top: 1px solid #33373d;
}
.xwue-about .xwue-sec.first { margin-top: 0; padding-top: 0; border-top: none; }
.xwue-about .xwue-card {
  display: flex; align-items: center; gap: 14px; max-width: 470px;
  background: #1b1b1b; border: 1px solid #3a3a3a; border-radius: 8px;
  padding: 12px 14px; margin-bottom: 10px;
}
.xwue-about .xwue-card img {
  width: 92px; height: 92px; object-fit: contain; flex: none;
  background: #f4f5f7; border: 1px solid #c9ced4; border-radius: 8px;
}
.xwue-about .xwue-card > .xwue-body { min-width: 0; flex: 1 1 auto; }
.xwue-about .xwue-who { font-size: 16px; font-weight: 600; color: #ffd479; margin-bottom: 5px; }
.xwue-about .xwue-what { font-size: 13px; color: #9aa0a8; line-height: 1.65; }
.xwue-about .xwue-links { margin-top: 6px; }
.xwue-about a { color: #79a9ff; text-decoration: underline; font-size: 13px; }
.xwue-about a:hover { color: #a8c8ff; }
.xwue-about .xwue-text { color: #cfd4da; font-size: 13px; }
.xwue-about .xwue-text b { color: #ffd479; }
.xwue-about .xwue-note { color: #9aa0a8; font-size: 12px; margin-top: 8px; }
`;

function ensure_style() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
}

function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
}

function link(href, text) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noreferrer noopener";
    a.textContent = text;
    return a;
}

function card(logo_url, who, what, links) {
    const box = el("div", "xwue-card");
    if (logo_url) {
        const img = document.createElement("img");
        img.src = logo_url;
        img.alt = who;
        box.appendChild(img);
    }
    const body = el("div", "xwue-body");
    body.appendChild(el("div", "xwue-who", who));
    body.appendChild(el("div", "xwue-what", what));
    if (links && links.length) {
        const row = el("div", "xwue-links");
        links.forEach((item, index) => {
            if (index > 0) row.appendChild(document.createTextNode("  ·  "));
            row.appendChild(link(item.href, item.text));
        });
        body.appendChild(row);
    }
    box.appendChild(body);
    return box;
}

export function build_xwide_about() {
    ensure_style();

    const root = el("div", "xwue-about");
    root.appendChild(el("div", "xwue-title", "X-WIDE Use Everywhere  " + VERSION));
    root.appendChild(el("div", "xwue-sub", "基于开源项目 cg-use-everywhere 的修复版本 / A fixed fork of cg-use-everywhere"));

    const logo_url = new URL("./logo_xwide_icon.png", import.meta.url).href;

    root.appendChild(el("div", "xwue-sec first", "作者 / Authors"));
    root.appendChild(card(
        logo_url,
        "X-WIDE（本版本 / This version）",
        "在原版基础上修复了浏览器端连线不显示的 BUG，其余功能与原版保持一致，遵循 Apache-2.0 继续开源。",
        [
            { href: XWIDE_AUTHOR_PAGE, text: "打开作者主页 / Author Page" },
            { href: XWIDE_REPO, text: "开源项目首页 / GitHub" },
        ],
    ));
    root.appendChild(card(
        null,
        ORIG_AUTHOR + "（原作者 / Original author）",
        "cg-use-everywhere —— 本项目的原始版本由 " + ORIG_AUTHOR + " 开发，版权归原作者所有。",
        [
            { href: ORIG_REPO, text: "查看原项目 / View Original" },
            { href: ORIG_COFFEE, text: "请原作者喝咖啡 / Buy him a coffee" },
        ],
    ));

    root.appendChild(el("div", "xwue-sec", "本版本修复内容 / What this fork fixes"));
    const fix = el("div", "xwue-text");
    fix.innerHTML =
        "修复 <b>浏览器端 UE 虚拟连线（以及连线上的流动动画）不显示</b> 的问题：" +
        "在部分 ComfyUI 前端版本下，插件因加载时序问题未能挂上画布绘制钩子，" +
        "表现为连线时有时无、甚至一条都不画。本版本改为由自愈看门狗补齐" +
        "（分析器、控制器、绘制钩子、连线列表），并在每次打开页面时自动生效。<br>" +
        "本版本<b>只做这一处修复</b>，节点、参数、行为与原版一致。";
    root.appendChild(fix);

    const note = el("div", "xwue-note");
    note.textContent =
        "注意：节点 ID 与原版相同，请勿与原版 cg-use-everywhere 同时安装（会相互覆盖）。" +
        "本插件为 Apache-2.0 许可的衍生作品，详见仓库 NOTICE 与 LICENSE。";
    root.appendChild(note);

    return root;
}
