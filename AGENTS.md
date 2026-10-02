# AGENTS.md — UNTHAI OFFICIAL WEBSITE

<!-- KH_MEMORY_BLOCK -->
## 🧠 MEMORY — Query Knowledge Hub BEFORE any task

**KH is the single source of truth** for all UNTH.AI projects.
It stores: deploy steps · current state · gotchas · API keys · services · architectural decisions · cross-project patterns · wiki · system snapshots.

**Rule: if you don't know something, search KH before asking the human.**

**Product names** (decided 2026-10-01): MUGEN = core · HERMES = agent · HERALD = social media posting · IRIS = content engine · PHEME = voice · XENIA = the CRM · NEME = Knowledge Hub · HEPH = local builder on Mat's Mac, the revived agentic-os. Internal labels, always said with UNTHAI; all sold inside MUGEN, alone or as a full suite. Older docs may still say crm, unth-os or Knowledge Hub; same things. Detail: `searchContext("product names")`.

| | |
|---|---|
| **KH URL** | `https://knowledge-hub.unth.ai` |
| **API key** | `$KNOWLEDGE_HUB_API_KEY` |
| **This project slug** | `unthai-official-website` |
| **Web UI** | <https://knowledge-hub.unth.ai> |

### Step 1 — Get this project's full context (run every new session)

Each block starts by loading `~/.claude/.kh-env`, where the key lives on a
Claude Code machine. Keep that line: Claude Code's Bash tool does not see
`~/.zshrc` exports, and nothing carries over from one command to the next.

```bash
set -a; . ~/.claude/.kh-env 2>/dev/null; set +a
curl -s \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  "https://knowledge-hub.unth.ai/api/projects/unthai-official-website/primer" | python3 -m json.tool
```

### Step 2 — Search for anything

```bash
set -a; . ~/.claude/.kh-env 2>/dev/null; set +a
# Scoped to this project
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/context" \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR QUESTION HERE", "project": "unthai-official-website", "role": "codex", "strict_project": true}'

# Cross-project (no slug) — use for "what is X", "VPS IP", "postgres password"
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/context" \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR QUESTION HERE", "role": "codex"}'
```

### Step 3 — Contribute knowledge back to KH (after learning something)

Always send `session_id` and `source_ref`. Without them the fact is stored
with no record of where it came from, and the next agent cannot check it.
`source_ref` is `<kind>:<value>` — `file:<path you read>`,
`transcript:<file>.jsonl`, `commit:<sha>`, `url:<url>`, `chat:<session>` or
`manual`. Never a token: the write path rejects credential-shaped values.

```bash
set -a; . ~/.claude/.kh-env 2>/dev/null; set +a
# Entity (service, server, tool, API, container)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"layer":"entities","agent_role":"codex","session_id":"YOUR-SESSION-ID","source_ref":"file:PATH-YOU-READ","content":{"name":"Name","slug":"name","description":"What it is and where","applies_to":["unthai-official-website"]}}'

# Decision (architectural or technical choice)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"layer":"decisions","agent_role":"codex","session_id":"YOUR-SESSION-ID","source_ref":"file:PATH-YOU-READ","content":{"title":"Title","rationale":"What was decided and why","applies_to":["unthai-official-website"]}}'

# Pattern (gotcha, reusable approach, lesson learned)
curl -s -X POST "https://knowledge-hub.unth.ai/api/agent/contribute" \
  -H "x-api-key: ${KNOWLEDGE_HUB_API_KEY:-${KH_API_KEY:?set KNOWLEDGE_HUB_API_KEY or KH_API_KEY}}" \
  -H "Content-Type: application/json" \
  -d '{"layer":"patterns","agent_role":"codex","session_id":"YOUR-SESSION-ID","source_ref":"file:PATH-YOU-READ","content":{"name":"Name","slug":"name","description":"The pattern or gotcha","applies_to":["unthai-official-website"]}}'
```

### Provenance — always send `session_id` and `source_ref`

Every fact records where it came from, and it is only useful if you send it.
`source_ref` is `<kind>:<value>`: `file:<path you read>`,
`transcript:<uuid>.jsonl`, `commit:<sha>`, `url:<url>`,
`chat:<session>`, or `manual`. `session_id` is whatever your tool calls a
session. `source_agent` is filled in for you from the API key — do not send it.
Both fields come back from `GET /api/agent/context`, so the next agent can see
where a claim came from. **Never put a token in either field** — the write paths
reject credential-shaped values outright.

### For Claude Code — MCP tools (faster than curl)

MCP server `knowledge-hub`, registered at user scope (`~/.claude.json`) by knowledge-hub's `scripts/client/install.sh` — not `~/.claude/mcp.json`, which
stopped being the config location and is what earlier copies of this block said.
Tools show up as `mcp__knowledge-hub__searchContext` and so on.

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
