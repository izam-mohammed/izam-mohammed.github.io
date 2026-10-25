# izam-mohammed.github.io: what every change passes

There is no single local command yet. `plans/01-quality-gates.md` lands
`make check` and runs it on every pull request. Until then, a change is
done when the vibe check and the security gate are green.

## Toolchain

| What | Version | Pinned in |
| --- | --- | --- |
| HTML, CSS, JavaScript | browser defaults, no build | none needed |
| Python | runner's `python3`, stdlib only | not pinned (`scripts/gen-meta.py`) |
| pre-commit hooks | gitleaks v8.30.1, pre-commit-hooks v6.0.0 | `.pre-commit-config.yaml` |
| Shared security gate | `izam-mohammed/.github` at `ff76c48` | `.github/workflows/security.yml` |

## Checks

| Check | Tool | Config | Command | Passing means |
| --- | --- | --- | --- | --- |
| No frameworks | grep | `.github/workflows/vibe-check.yml` | the "check if anyone added tailwind" and "node_modules" steps | no Tailwind, no `node_modules` |
| Every page ships | find, grep | `.deployinclude` | the "forgotten-page guard" step | every `*.html` top folder is listed |
| Generated metadata | `scripts/gen-meta.py` | | `python3 scripts/gen-meta.py`, run by `.githooks/pre-commit` | `sitemap.xml`, `robots.txt`, `llms.txt`, `openapi.json` match the pages |
| Secret scan | gitleaks | `.pre-commit-config.yaml`; the gate | `pre-commit run --all-files`; the gate on PRs | no findings |
| Static analysis | semgrep (JavaScript packs), zizmor | the gate (`ecosystem: node`) | on PRs, reports only | read the PR comment |
| Dependency audit | osv-scanner in the gate | | on PRs | nothing to scan: no packages |
| HTML, links, JS lint, Python lint and tests | none yet | | | `plans/01-quality-gates.md` |

## Tests

None yet. `plans/01-quality-gates.md` adds unit tests for
`scripts/gen-meta.py` with a 90 % line coverage floor on that file.

## Constraints

- From `CLAUDE.md`: no frameworks, no npm, no build step, browser-default
  looks, inline styles left alone, text in the owner's voice.
- Generated files (`sitemap.xml`, `robots.txt`, `llms.txt`,
  `openapi.json`) are never hand-edited.
- A new top-level page or folder is added to `.deployinclude`.

## Conventions

- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `ci(deps):`),
  lowercase, no attribution lines; `[skip changelog]` keeps a commit out
  of the changelog page.
- Changes reach `main` through PRs with the template in
  `.github/PULL_REQUEST_TEMPLATE.md`.
- Install the hook once per clone: `git config core.hooksPath .githooks`.

## CI

- `.github/workflows/vibe-check.yml`: push to `main` and by hand.
- `.github/workflows/security.yml`: every PR and Mondays 03:17 UTC.
- `.github/workflows/static.yml`: deploys on push to `main`.

## Decided

- The shared security gate, from `repo-template`.
- The local pre-commit hook over a CI bot for the changelog, so nothing
  pushes back to `main` (commit `d0d230e`).
