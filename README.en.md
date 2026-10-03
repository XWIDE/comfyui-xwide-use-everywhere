# X-WIDE Use Everywhere

## 🌐 Language / 语言

[简体中文](https://github.com/XWIDE/comfyui-xwide-use-everywhere/blob/main/README.md) ｜ **English**

> This is a fixed fork of the open-source project
> [cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere)
> by [chrisgoringe](https://github.com/chrisgoringe).
> **It fixes exactly one bug: UE virtual links — and the "flowing" animation on them — were not drawn in the browser.**
> Nodes, parameters and behaviour are identical to the original, so it is a drop-in replacement.

![example](https://raw.githubusercontent.com/XWIDE/comfyui-xwide-use-everywhere/main/docs/simple-example.png)

---

## What is this

The `Anything Everywhere` (UE) nodes broadcast their input to any node that needs that data, so things like
MODEL / CLIP / VAE / prompts do not have to be wired to every node by hand.

This project is a bug-fix branch of the original `cg-use-everywhere` (UE Nodes) — **bug fix only, no feature changes**:

| | Original cg-use-everywhere 7.8 | This fork: X-WIDE Use Everywhere 7.8.1 |
| --- | --- | --- |
| UE virtual links | Not drawn at all / intermittently missing on some ComfyUI frontend versions | ✅ Self-healing watchdog restores them reliably |
| Flowing-link animation | Missing along with the links | ✅ Works again |
| Nodes, params, workflow format | — | **Identical** to the original (same node IDs) |
| Node display names | `Anything Everywhere` etc. | Prefixed with `X-WIDE ` (node IDs unchanged, so the node search box finds X-WIDE) |
| Installing both at once | — | ⚠️ **Not allowed** (identical node IDs overwrite each other); a loud warning is printed at startup |

## The fix (technical details)

Symptom: the small green badge on the node is drawn correctly, but **no UE broadcast link is visible** —
and sometimes a few appear after a refresh.

Cause: the plugin's initialisation depends on several objects being ready in the right order
(the graph analyser `graphAnalyser`, the link render controller `linkRenderController`, the
`drawConnections` hook on the canvas prototype, and the link list `ue_list`). On some frontend versions one of
them is not ready, initialisation fails silently, and the canvas then **never even asks** for UE links to be
drawn. The node badge comes from a separate code path (the `nodeCreated` hook), hence "badge visible, links gone".

Fix: a module-level **self-healing watchdog** is appended at the end of `js/use_everywhere.js`
(marked `[XW-UE fix]` in the source). Once the page is loaded it re-checks every 2 seconds and repairs
whatever is missing:

- missing `graphAnalyser` / `linkRenderController` → created;
- canvas prototype's `drawConnections` lacks the `render_all_ue_links` hook → hooked;
- missing link list `ue_list` → rebuilt, falling back to `analyse_graph(visible_graph(), true)`;
- leaked pause depth → reset.

When everything is healthy it is completely silent: no console output, no measurable cost.
The whole block can be deleted to return to original behaviour.

## Installation

### Option 1 — ComfyUI Manager (recommended, once published to the Registry)

Search for **`X-WIDE Use Everywhere`** in **ComfyUI Manager → Custom Nodes Manager**, install, restart ComfyUI.

### Option 2 — Manual

```powershell
cd <your ComfyUI>\custom_nodes
git clone https://github.com/XWIDE/comfyui-xwide-use-everywhere.git
```

Restart ComfyUI and hard-refresh the browser with **Ctrl + Shift + R**.

> ⚠️ **Uninstall (or disable/rename) the original `cg-use-everywhere` first**: both use the same node IDs and
> would overwrite each other. If you forget, the startup log prints a clear
> `[X-WIDE Use Everywhere] detected the original plugin installed alongside` warning.

## Make the links flow (recommended settings)

**Settings → Use Everywhere → Graphics**:

| Setting | Value | Why |
| --- | --- | --- |
| Animate UE links | **Dots** | `Pulse` never animated in the original frontend logic |
| Turn animation off when workflow is running | off | otherwise animation stops while a workflow runs |
| Show links | **All** (or Selected and mouse over) | how many UE links are shown |
| Statically distinguish UE links | on | easier to tell UE links apart |

Then hard-refresh with **Ctrl + Shift + R**.

## About / Authors

**Settings → Use Everywhere → About** shows the authors panel and this fix note (added by this fork).
You can also just open [`about.html`](https://github.com/XWIDE/comfyui-xwide-use-everywhere/blob/main/about.html) from the repository root in a browser.

## FAQ

- **Links still missing?**
  1. Hard-refresh (Ctrl + Shift + R); 2. make sure the original plugin is not installed as well;
  3. open the F12 console and look for `[XW-UE fix]` lines (a healthy install prints nothing);
  4. set `Animate UE links` to `Dots` and `Show links` to `All`.
- **Will it break my existing workflows?** No — node IDs, parameters and formats match the original 7.8
  (the only difference is the node display names, which now carry an `X-WIDE ` prefix).
- **How do I find it in the node search box?** Search for `X-WIDE`, or keep searching `Anything Everywhere`.
- **Can I keep the original installed and use different nodes?** No — the node IDs are identical, install only one.

## License & credits

Released under the **Apache License 2.0**. This is a modified version of
[cg-use-everywhere](https://github.com/chrisgoringe/cg-use-everywhere) by **chrisgoringe** (Apache-2.0);
all original copyright remains with the original author. See [NOTICE](https://github.com/XWIDE/comfyui-xwide-use-everywhere/blob/main/NOTICE) and
[CHANGELOG.md](https://github.com/XWIDE/comfyui-xwide-use-everywhere/blob/main/CHANGELOG.md); the upstream manual is kept as [UPSTREAM-README.md](https://github.com/XWIDE/comfyui-xwide-use-everywhere/blob/main/UPSTREAM-README.md).

If you like the original design, consider [buying the original author a coffee ☕](https://www.buymeacoffee.com/chrisgoringe).
