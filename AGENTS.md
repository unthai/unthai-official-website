# AGENTS.md — UNTHAI OFFICIAL WEBSITE

<!-- KH_MEMORY_BLOCK -->
## 🧠 MEMORY — Query Knowledge Hub BEFORE any task

**KH is the single source of truth** for all UNTH.AI projects.
It stores: deploy steps · current state · gotchas · API keys · services · architectural decisions · cross-project patterns · wiki · system snapshots.

**Rule: if you don't know something, search KH before asking the human.**

| | |
|---|---|
| **KH URL** | `https://knowledge-hub.unth.ai` |
| **API key** | `unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043` |
| **This project slug** | `unthai-official-website` |
| **Web UI** | <https://knowledge-hub.unth.ai> |

### Step 1 — Get this project's full context (run every new session)

```bash
curl -s \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  "https://knowledge-hub.unth.ai/api/projects/unthai-official-website/primer" | python3 -m json.tool
```

### Step 2 — Search for anything

```bash
# Scoped to this project
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/context" \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR QUESTION HERE", "project": "unthai-official-website", "role": "claude-code"}'

# Cross-project (no slug) — use for "what is X", "VPS IP", "postgres password"
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/context" \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR QUESTION HERE", "role": "claude-code"}'
```

### Step 3 — Contribute knowledge back to KH (after learning something)

```bash
# Entity (service, server, tool, API, container)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  -H "Content-Type: application/json" \
  -d '{"layer":"entities","agent_role":"claude-code","content":{"name":"Name","slug":"name","description":"What it is and where","applies_to":["unthai-official-website"]}}'

# Decision (architectural or technical choice)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  -H "Content-Type: application/json" \
  -d '{"layer":"decisions","agent_role":"claude-code","content":{"title":"Title","description":"What was decided and why","applies_to":["unthai-official-website"]}}'

# Pattern (gotcha, reusable approach, lesson learned)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: unthai_5e092c3c1cdae3743968790dfe3b0fc8ee2d111843062248ae701879a9aef043" \
  -H "Content-Type: application/json" \
  -d '{"layer":"patterns","agent_role":"claude-code","content":{"title":"Title","description":"The pattern or gotcha","applies_to":["unthai-official-website"]}}'
```

### For Claude Code — MCP tools (faster than curl)

MCP server `knowledge-hub` pre-configured in `~/.claude/mcp.json`.

| Tool | Purpose |
|---|---|
| `searchContext(query, project?)` | Hybrid search — fastest way to find anything |
| `getPrimer(slug)` | Full project primer (current state, gotchas, deploy) |
| `getGotchas(slug)` | Critical gotchas only |
| `readWikiPage(path)` | Read a wiki page |
| `writeWikiPage(path, content)` | Update the wiki |
| `getMemory(slug)` | Latest system snapshot (git SHA, container health) |
| `listProjects()` | All tracked projects and slugs |

```
searchContext("how to deploy this project", "unthai-official-website")
searchContext("what is hermes")     ← cross-project, no slug needed
getPrimer("unthai-official-website")
getGotchas("unthai-official-website")
```

<!-- KH_MEMORY_BLOCK_END -->


---

## Project Identity

| Key | Value |
|---|---|
| **KH slug** | `unthai-official-website` |
| **Full context** | Run Step 1 above every new session |

> Auto-generated. Add project-specific SSH, deploy, and gotcha sections as you work.
