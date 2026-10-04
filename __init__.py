from comfy_api.latest import ComfyExtension, io
from .use_everywhere import SeedEverywhere, AnythingEverywhere, AnythingSomewhere, AnythingEverywhereTriplet, SimpleString, ComboClone, AnythingEverywherePrompts

UE_VERSION = "7.8.3"
WEB_DIRECTORY = "./js"
__all__ = [ "WEB_DIRECTORY"]

async def comfy_entrypoint() -> ComfyExtension:
    class UseEverywhereExtension(ComfyExtension):
        async def get_node_list(self) -> list[type[io.ComfyNode]]:
            return [
                AnythingEverywhere, AnythingSomewhere, AnythingEverywhereTriplet, SimpleString, ComboClone, SeedEverywhere, AnythingEverywherePrompts
            ]
        
    return UseEverywhereExtension()


# ---------------------------------------------------------------------------
# X-WIDE 修复版：安装冲突提示
#
# 本插件与原版 cg-use-everywhere 使用完全相同的节点 ID（这样老工作流可以无缝
# 迁移），因此两者不能同时安装 —— 同时安装时后加载的会覆盖先加载的节点定义，
# 症状正是"插件看起来在跑，但连线不画 / 参数对不上"。
# ---------------------------------------------------------------------------
def _xwide_check_original_plugin():
    try:
        import os as _os
        import folder_paths as _folder_paths
        me = _os.path.basename(_os.path.dirname(_os.path.realpath(__file__)))
        others = []
        for base in _folder_paths.get_folder_paths("custom_nodes"):
            if not _os.path.isdir(base):
                continue
            for name in _os.listdir(base):
                if name == me or name.endswith(".disabled"):
                    continue
                other = _os.path.join(base, name)
                if _os.path.isfile(_os.path.join(other, "use_everywhere.py")) or \
                   _os.path.isfile(_os.path.join(other, "js", "use_everywhere.js")):
                    others.append(name)
        if others:
            print("=" * 78, flush=True)
            print("[X-WIDE Use Everywhere] 检测到同时安装了原版插件：" + ", ".join(others), flush=True)
            print("[X-WIDE Use Everywhere] 两者节点 ID 相同，会相互覆盖，请只保留其中一个：", flush=True)
            print("[X-WIDE Use Everywhere]   · 保留本修复版 -> 把上面那个目录改名为 xxx.disabled 后重启", flush=True)
            print("[X-WIDE Use Everywhere]   · 或删除本插件目录后重启", flush=True)
            print("=" * 78, flush=True)
    except Exception as error:  # 提示失败不影响插件运行
        print(f"[X-WIDE Use Everywhere] 冲突检查跳过：{error}", flush=True)


_xwide_check_original_plugin()
