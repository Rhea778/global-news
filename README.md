# 每日全球要闻

这是一个手机优先的中英双语新闻 PWA 原型，包含 RSS 采集、模型摘要和静态 JSON 发布链路。

## 本地生成新闻

项目只使用 Python 标准库，不需要安装依赖。先复制 `.env.example` 中的配置到环境变量，再运行：

```powershell
$env:LLM_API_KEY = "你的模型服务商密钥"
$env:LLM_API_URL = "https://api.9e.lv/v1/chat/completions"
$env:LLM_MODEL = "gpt-5.6-luna"
$env:LLM_REASONING_EFFORT = "high"
python collector.py
```

不设置 `LLM_API_KEY` 也可以运行，此时会抓取 RSS 并生成待加工的降级条目，不会调用模型。

生成结果位于 `data/stories.json`，前端会自动读取；直接双击 `index.html` 时如果浏览器阻止读取本地 JSON，会自动回退到内置演示数据。完整 PWA 离线能力需要通过本地静态服务器或部署后访问。

## GitHub Actions 自动更新

`.github/workflows/update-news.yml` 会每天北京时间 06:00 运行。将 `LLM_API_KEY` 配置为仓库 Secret；如果使用其他 OpenAI-compatible 服务，可同时配置 `LLM_API_URL` 和 `LLM_MODEL` Variables。

新闻页面只展示摘要和原文链接，不保存或转载完整文章正文。
