"""每日全球新闻采集与摘要脚本。

默认只依赖 Python 标准库，方便在本地或 GitHub Actions 中直接运行。
设置 LLM_API_KEY 后，会调用 OpenAI-compatible Chat Completions 接口生成中英双语摘要；
未设置密钥时，脚本仍会抓取 RSS 并生成可浏览的降级数据。
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DEFAULT_OUTPUT = ROOT / "data" / "stories.json"
USER_AGENT = "GlobalBriefing/0.1 (+https://github.com/example/global-briefing)"

FEEDS = [
    ("BBC News", "https://feeds.bbci.co.uk/news/world/rss.xml", "world"),
    ("NPR World", "https://feeds.npr.org/1004/rss.xml", "world"),
    ("The Guardian", "https://www.theguardian.com/world/rss", "world"),
    ("CNBC Economy", "https://www.cnbc.com/id/20910258/device/rss/rss.html", "economy"),
    ("TechCrunch", "https://techcrunch.com/feed/", "tech"),
    ("Nature News", "https://www.nature.com/nature.rss", "science"),
    ("Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml", "security"),
]

CATEGORY_NAMES = {
    "world": "国际时政",
    "economy": "经济财经",
    "tech": "科技",
    "security": "冲突与安全",
    "science": "科学健康",
    "culture": "社会文化",
    "china": "中国",
}


def clean_text(value: str | None) -> str:
    value = html.unescape(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def child_text(element: ET.Element, names: tuple[str, ...]) -> str:
    for child in list(element):
        local_name = child.tag.rsplit("}", 1)[-1]
        if local_name in names:
            return clean_text("".join(child.itertext()))
    return ""


def fetch(url: str, timeout: int = 20) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def parse_feed(source_name: str, url: str, category: str, limit: int) -> list[dict]:
    root = ET.fromstring(fetch(url))
    entries = [node for node in root.iter() if node.tag.rsplit("}", 1)[-1] in {"item", "entry"}]
    results = []
    for item in entries[:limit]:
        title = child_text(item, ("title",))
        link = child_text(item, ("link",))
        if not link:
            for child in list(item):
                if child.tag.rsplit("}", 1)[-1] == "link" and child.attrib.get("href"):
                    link = child.attrib["href"]
                    break
        summary = child_text(item, ("description", "summary", "content", "encoded"))
        published = child_text(item, ("pubDate", "published", "updated", "date"))
        if title and link:
            results.append({"source": source_name, "url": link, "title": title, "summary": summary, "published": published, "category": category})
    return results


def normalize_title(title: str) -> str:
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]", "", title.lower())


def deduplicate(items: list[dict]) -> list[dict]:
    seen: set[str] = set()
    result = []
    for item in items:
        key = normalize_title(item["title"])
        if not key or key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result


def classify_fallback(item: dict) -> str:
    title = item["title"].lower()
    keywords = {
        "tech": ("ai", "artificial intelligence", "software", "chip", "科技", "人工智能"),
        "economy": ("economy", "market", "bank", "trade", "econom", "business", "经济", "贸易"),
        "science": ("health", "science", "climate", "research", "medical", "科学", "健康", "气候"),
        "security": ("war", "attack", "military", "conflict", "security", "冲突", "安全"),
    }
    for category, words in keywords.items():
        if any(word in title for word in words):
            return category
    return item["category"]


def fallback_story(item: dict, index: int) -> dict:
    category = classify_fallback(item)
    summary = item["summary"] or "该报道正在等待进一步的交叉核实。"
    story_id = hashlib.sha1(item["url"].encode("utf-8")).hexdigest()[:12]
    return {
        "id": f"rss-{index}-{story_id}",
        "category": category,
        "importance": 6,
        "sourcesCount": 1,
        "titleZh": item["title"],
        "titleEn": item["title"],
        "summaryZh": summary[:180],
        "summaryEn": summary[:260],
        "detailZh": f"来源：{item['source']}。这是基于 RSS 摘要生成的待加工条目。接入大模型后，系统会进一步完成中文改写、事实核对、背景补充和多源合并。",
        "detailEn": f"Source: {item['source']}. This is an RSS-based draft. After an LLM is configured, the pipeline will rewrite, fact-check, enrich and merge reports about the same event.",
        "tags": [CATEGORY_NAMES.get(category, "全球")],
        "sources": [item["source"]],
        "sourceUrls": [item["url"]],
    }


def llm_request(item: dict, api_key: str, api_url: str, model: str) -> dict:
    prompt = f"""你是一名严谨的国际新闻编辑。请仅根据下面的 RSS 材料生成一条新闻卡片，不要补写材料之外的事实。

来源：{item['source']}
标题：{item['title']}
摘要：{item['summary']}

只输出 JSON，字段必须为：category（world/economy/tech/security/science/culture/china）、importance（1-10）、titleZh、titleEn、summaryZh（不超过45字）、summaryEn（不超过30词）、detailZh（120-220字）、detailEn（80-150词）、tags（最多3个字符串）。"""
    payload = {"model": model, "temperature": 0.2, "messages": [{"role": "user", "content": prompt}]}
    reasoning_effort = os.getenv("LLM_REASONING_EFFORT", "high").strip()
    if reasoning_effort:
        payload["reasoning_effort"] = reasoning_effort
    request = urllib.request.Request(api_url, data=json.dumps(payload).encode("utf-8"), headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "User-Agent": USER_AGENT}, method="POST")
    with urllib.request.urlopen(request, timeout=60) as response:
        body = json.loads(response.read().decode("utf-8"))
    content = body["choices"][0]["message"]["content"].strip()
    content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content, flags=re.IGNORECASE)
    return json.loads(content)


def ai_story(item: dict, index: int, config: dict) -> dict:
    try:
        generated = llm_request(item, config["key"], config["url"], config["model"])
        category = generated.get("category", item["category"])
        story_id = hashlib.sha1(item["url"].encode("utf-8")).hexdigest()[:12]
        return {
            "id": f"rss-{index}-{story_id}",
            "category": category if category in CATEGORY_NAMES else item["category"],
            "importance": max(1, min(10, int(generated.get("importance", 6)))),
            "sourcesCount": 1,
            "titleZh": generated.get("titleZh", item["title"]),
            "titleEn": generated.get("titleEn", item["title"]),
            "summaryZh": generated.get("summaryZh", item["summary"]),
            "summaryEn": generated.get("summaryEn", item["summary"]),
            "detailZh": generated.get("detailZh", item["summary"]),
            "detailEn": generated.get("detailEn", item["summary"]),
            "tags": generated.get("tags", [CATEGORY_NAMES.get(category, "全球")]),
            "sources": [item["source"]],
            "sourceUrls": [item["url"]],
        }
    except (KeyError, TypeError, ValueError, urllib.error.URLError, TimeoutError) as error:
        print(f"  AI fallback for {item['title'][:50]}: {error}", file=sys.stderr)
        return fallback_story(item, index)


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch RSS feeds and generate bilingual news stories.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--limit", type=int, default=5, help="每个 RSS 源最多抓取多少条")
    parser.add_argument("--max-stories", type=int, default=40)
    args = parser.parse_args()

    raw_items = []
    for source, url, category in FEEDS:
        try:
            items = parse_feed(source, url, category, args.limit)
            raw_items.extend(items)
            print(f"Fetched {source}: {len(items)} items")
        except (ET.ParseError, OSError, urllib.error.URLError, TimeoutError) as error:
            print(f"Skipped {source}: {error}", file=sys.stderr)

    items = deduplicate(raw_items)[: args.max_stories]
    api_key = os.getenv("LLM_API_KEY", "").strip()
    config = {
        "key": api_key,
        "url": os.getenv("LLM_API_URL", "https://api.9e.lv/v1/chat/completions"),
        "model": os.getenv("LLM_MODEL", "gpt-5.6-luna"),
    }
    print(f"Prepared {len(items)} unique stories; AI={'on' if api_key else 'off (fallback mode)'}")

    stories = []
    for index, item in enumerate(items, start=1):
        print(f"Processing {index}/{len(items)}: {item['title'][:60]}")
        stories.append(ai_story(item, index, config) if api_key else fallback_story(item, index))
        if api_key:
            time.sleep(0.4)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(stories, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(stories)} stories to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
