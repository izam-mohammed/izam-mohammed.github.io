# every change to the site is checked by one make check, locally and on every PR, and only what should ship is public

## The ask

The repository standard asks for lint and format, tests, a coverage floor
of 90 % (target 95 %), and security checks (dependency audit, secret scan,
static analysis), all run by one local check command and by CI on every
PR, reusing the shared gate in `izam-mohammed/.github`.

What it means here: a plain static site whose `CLAUDE.md` rules out
frameworks, npm and a build. The shared gate already runs on PRs. The
gaps found:

- the vibe check runs after merge, never on the PR;
- nothing validates the HTML, checks links, lints the JavaScript, or lints
  and tests `scripts/gen-meta.py`, and only the local hook keeps the
  generated metadata fresh;
- there is no one local command (`make` targets are jokes);
- `static.yml` and `vibe-check.yml` pin actions by tag, not SHA;
- the Pages source is "deploy from a branch", so the whole repository is
  public and `.deployinclude` filters nothing (`CLAUDE.md`, `.env` and
  `Makefile` answered HTTP 200 on 22/10/2026).

A 90 % floor over the browser JavaScript is not applicable: it is
DOM-bound IIFEs, and measuring it needs a browser harness and npm, which
`CLAUDE.md` refuses. The floor applies to `scripts/gen-meta.py`, the one
piece of program logic.

Built so far: `docs/built/BUILT-2026-10-22-1827.md`.

## Constraints

- From `CLAUDE.md`: "no frameworks. no webpack. no npm. no node_modules",
  "don't you dare suggest settin' up a dev server", "it's supposed to look
  ugly". The checks run beside the site; none of them changes how a page
  is written or served.

## Alternatives

### Decision 1: where the checks run (two-way door)

Searched 2026-10-22: "GitHub Pages publishing source deploy from a branch
vs GitHub Actions custom workflow"; GitHub Docs "Configuring a publishing
source for your GitHub Pages site", the shared gate's README.

| Criterion | Weight | Baseline: vibe check on push only | `make check` from `vibe-check.yml`, on PRs too | A new `check.yml` beside it |
| --- | ---: | ---: | ---: | ---: |
| Performance efficiency | 40 | 5 | 4 | 4 |
| Compatibility | 35 | 1 | 5 | 3 |
| Maintainability of the result | 25 | 3 | 4 | 3 |
| **Weighted total** | **100** | **3.10** | **4.35** | **3.40** |

- Compatibility: the vibe check is already the site's guard, in the
  owner's voice; growing it keeps one place (5). A second workflow splits
  the guard in two (3). Push-only fails the "on every PR" ask (1).
- The guard's steps move into `make check` so they run locally too.

**Chosen: `make check`, run by `vibe-check.yml` on pull requests and
pushes.** Revisit if the check grows slow enough to want parallel jobs.

### Decision 2: how the HTML is validated (two-way door)

Searched 2026-10-22: "html-validate vs Nu Html Checker vnu static site
CI"; meiert.com's 2024 comparison of npm validators (html-validate not at
parity with the W3C checker), Jim Nielsen's "Validating HTML" (2022), the
html5validator PyPI page (a vnu wrapper, needs Java).

| Must | Nu Html Checker (`vnu.jar`) | html5validator (vnu wrapper) | html-validate |
| --- | --- | --- | --- |
| No npm (`CLAUDE.md`) | yes | yes | no (an npm package) |
| **Survives** | **yes** | **yes** | no |

| Criterion | Weight | `vnu.jar` | html5validator |
| --- | ---: | ---: | ---: |
| Performance efficiency | 40 | 3 | 3 |
| Fit to the ask | 35 | 5 | 5 |
| Reliability | 25 | 5 | 3 |
| **Weighted total** | **100** | **4.20** | **3.70** |

- Efficiency: both start a JVM (3); 17 pages, so seconds, unmeasured.
- Reliability: the jar is the W3C checker itself, pinned by release (5);
  the wrapper adds a layer whose current maintenance is unverified (3).

**Chosen: `vnu.jar`**, a pinned release, run with `--skip-non-html` over
the deployed paths. Rules the pages fail today are recorded and excluded
first, then fixed in later plans, never mixed into this one. Revisit if
Java on the runner becomes a problem.

### Decision 3: how links are checked (two-way door)

Searched 2026-10-22: "lychee link checker vs markdown-link-check vs
htmltest 2026"; lychee's docs and its own comparison table,
OpenTelemetry's link-checking page (htmltest as its default).

| Criterion | Weight | lychee | htmltest |
| --- | ---: | ---: | ---: |
| Performance efficiency | 40 | 5 | 5 |
| Fit to the ask | 35 | 5 | 4 |
| Reliability | 25 | 4 | 3 |
| **Weighted total** | **100** | **4.75** | **4.15** |

- Fit: lychee reads HTML and Markdown, so one tool covers the pages and
  the README (5); htmltest reads HTML only (4).
- Reliability: lychee's comparison is self-published, so 4.

**Chosen: lychee**, offline for internal links in `make check`, online
weekly so a flaky outside site never blocks a PR.

### Decision 4: how the JavaScript is linted (two-way door)

Searched 2026-10-22: "biome standalone binary lint JavaScript without npm
vs eslint vs oxlint"; tech-insider and pkgpulse 2026 comparisons, Peter
Bengtsson's oxlint vs biome benchmark.

| Must | Biome | oxlint | ESLint |
| --- | --- | --- | --- |
| Runs without npm in the repository | yes (release binary) | yes (release binary) | no |
| **Survives** | **yes** | **yes** | no |

| Criterion | Weight | Biome | oxlint |
| --- | ---: | ---: | ---: |
| Performance efficiency | 40 | 4 | 5 |
| Fit to the ask | 35 | 5 | 3 |
| Compatibility | 25 | 4 | 4 |
| **Weighted total** | **100** | **4.35** | **4.05** |

- Efficiency: both lint four small files in well under a second; oxlint
  is the faster in published benchmarks (5 against 4).
- Fit: Biome lints and can check formatting in one binary (5); oxlint
  lints only (3).

**Chosen: Biome, lint only.** Its formatter is not turned on: the files
were never formatted by a tool, and reformatting all of them would bury
any change (the inline-style rule in `CLAUDE.md` says leave them).
Revisit if the owner wants formatting.

### Decision 5: how `scripts/gen-meta.py` is linted and tested (two-way door)

Searched 2026-10-22: "ruff vs pylint speed 2026 python linter",
"coverage.py with unittest vs pytest-cov fail-under"; Astral's benchmark
(Ruff about 126 times faster than Pylint on CPython, vendor-published),
the pytest-cov and coverage.py guides on `fail_under`.

| Criterion | Weight | Ruff | Pylint |
| --- | ---: | ---: | ---: |
| Performance efficiency | 40 | 5 | 2 |
| Fit to the ask | 35 | 5 | 5 |
| Compatibility | 25 | 5 | 4 |
| **Weighted total** | **100** | **5.00** | **3.55** |

| Criterion | Weight | `unittest` + coverage.py | pytest + pytest-cov |
| --- | ---: | ---: | ---: |
| Performance efficiency | 40 | 4 | 4 |
| Fit to the ask | 35 | 5 | 5 |
| Compatibility | 25 | 5 | 3 |
| **Weighted total** | **100** | **4.60** | **4.10** |

- Compatibility: the script is stdlib only; `unittest` keeps the tests
  stdlib too, with coverage.py run through `uvx` and nothing installed in
  the repository (5); pytest adds two packages (3).

**Chosen: Ruff for lint, `unittest` with coverage.py for tests**, the
floor 90 % (target 95 %) on `scripts/gen-meta.py`. Revisit if a second
script arrives.

## The decision

`make check` runs, in order: the vibe-check guards (moved from the
workflow into `scripts/vibe-check.sh`), the generated-metadata freshness
check, ShellCheck on `.githooks/pre-commit`, `vnu.jar` on the pages
(decision 2), lychee offline (decision 3), Biome lint (decision 4), Ruff
and the `gen-meta` tests with coverage (decision 5), and the pre-commit
hooks. `vibe-check.yml` runs it on every PR and push (decision 1). Actions
in `static.yml` and `vibe-check.yml` are pinned by SHA. The Pages source
moves to "GitHub Actions", so only `.deployinclude` paths are public; that
is a repository setting, done by the owner.

Dependencies, all in CI and on the owner's machine, none in the
repository: Java (for `vnu.jar`), `vnu.jar`, lychee, Biome, ShellCheck,
`uv` (for `uvx ruff`, `uvx coverage`, `uvx pre-commit`), each pinned by
release or version. No secret. Permission: the Pages source setting.

Standards: `docs/standards.md` (the vibe check and the shared gate today;
`make check` from Phase 1).

## Where it lands

| Path | New or edit | Phase | What changes | Firm? |
| --- | --- | --- | --- | --- |
| `Makefile` | edit | 1 | a `check` target, joke targets kept | reuse |
| `scripts/vibe-check.sh` | new | 1 | the guard steps from the workflow | expected |
| `.github/workflows/vibe-check.yml` | edit | 1 | `pull_request` trigger, runs `make check`, SHA pins | reuse |
| `.github/workflows/static.yml` | edit | 3 | actions pinned by SHA | reuse |
| `tests/test_gen_meta.py` | new | 2 | unit tests for each `gen-meta` function | expected |
| `biome.json` | new | 2 | lint rules only, formatter off | expected |
| `docs/standards.md` | edit | 1 | the one command and each check | reuse |
| `CLAUDE.md` | edit | 1 | `make check` in "how to develop", file map rows | reuse |

*Reused, not rewritten:*

- `.github/workflows/vibe-check.yml`: its three guards, moved verbatim.
- `scripts/gen-meta.py`: run to compare against the committed outputs;
  tested by loading it with `importlib` (its hyphen keeps it from a plain
  import).
- `.pre-commit-config.yaml`: run as is inside `make check`.
- `izam-mohammed/.github` `security-scan.yml`: unchanged, still called.

## Security

What is protected: what the public can fetch from the site, and the CI
that deploys it. Who reaches it: anyone on the web (read), pull requests
(CI), the owner (Pages settings).

| Threat | Here | Handled by | Proved by |
| --- | --- | --- | --- |
| Information disclosure: repository files served | Pages serves the whole branch | Pages source set to GitHub Actions, so only `.deployinclude` paths deploy | `curl` of `/CLAUDE.md` and `/.env` returns 404 after the switch |
| Tampering: a moved action tag | `@v7` re-pointed upstream | actions pinned by SHA, Dependabot bumps them | zizmor in the gate reports no unpinned action |
| Tampering: a swapped tool binary | lychee, Biome or `vnu.jar` replaced | each downloaded by release with its checksum verified | the workflow fails on a checksum mismatch |
| Information disclosure: a real secret committed | a future `.env` with real values | gitleaks in the hooks and the gate | the gate's stage 1 |

Data: the site already sends visitors' browsers to ipify, ipapi and
open-meteo; unchanged here. Secrets: none. Checklist: OWASP Top 10
(2025) A05 security misconfiguration for the Pages source, and the CIS
GitHub benchmark, editions confirmed when built.

## Declined

- Vibe check on push only (decision 1): never runs on the PR.
- A separate `check.yml` (decision 1): splits the guard.
- html-validate (decision 2): an npm package, against `CLAUDE.md`.
- html5validator (decision 2): a wrapper over the same jar, maintenance
  unverified.
- htmltest (decision 3): HTML only.
- ESLint (decision 4): needs npm. oxlint (decision 4): lint only, and the
  speed gap does not matter on four files.
- Pylint (decision 5): slower, same fit. pytest (decision 5): two packages
  for a stdlib script.
- A coverage floor on the browser JavaScript: needs a browser harness and
  npm.
- A `site/` one-pager: the repository is the site.

## What the tests hold

- Each `gen-meta` function (`collect_pages`, `meta`, `priority`,
  `write_sitemap`, `write_robots`, `write_llms`, `write_openapi`) on a
  fixture tree, at or over 90 % line coverage of `scripts/gen-meta.py`.
- A page outside `.deployinclude`, a Tailwind link, stale metadata, an
  invalid tag and a broken internal link each fail `make check`.

## Follow-ups

- Whether the Vercel config (`vercel.json`) is deployed anywhere is
  unverified; if not, `vercel.json` and `.vercelignore` are cleanup
  candidates for the owner.
- Fixing the HTML rules excluded in Phase 1, one plan per batch.

## Phases

### Phase 1: the rough cut (needs you: try it)

- [ ] `make check` runs the vibe-check guards (moved into
  `scripts/vibe-check.sh`), the metadata freshness check (rerun
  `scripts/gen-meta.py`, fail on any diff), ShellCheck on
  `.githooks/pre-commit`, `vnu.jar` on the deployed pages and lychee
  offline (expected in `Makefile`); HTML rules the pages fail today are
  listed in `docs/standards.md` and excluded by name.
- [ ] `.github/workflows/vibe-check.yml` runs `make check` on every pull
  request and push to `main`, `contents: read`, its actions pinned by SHA.
- [ ] `docs/standards.md` names `make check` and each check, and
  `CLAUDE.md` says to run it, in its own voice, with the new files in its
  file map.
- [ ] Check: `make check` passes locally; on a scratch branch a page left
  out of `.deployinclude`, stale `sitemap.xml` and a broken internal link
  each fail it; the PR shows the vibe check green.
- [ ] You try it: run `make check`, break one link on a scratch branch,
  run it again, and say whether the output reads right. What you want
  changed goes into the phases below.

### Phase 2: lint the code, test the generator

- [ ] Biome lints `assets/js/` with its formatter off (expected in
  `biome.json`), starting from the rules the files pass today, run by
  `make check`.
- [ ] Ruff lints `scripts/` and `tests/`, and `tests/test_gen_meta.py`
  tests every `gen-meta` function on a fixture tree under
  `coverage run -m unittest`, failing under 90 % of
  `scripts/gen-meta.py`, both run by `make check`.
- [ ] Check: `make check` passes, and its coverage line shows
  `scripts/gen-meta.py` at or over 90 %.

### Phase 3: only what should ship is public (needs you: change the Pages source)

- [ ] Actions in `.github/workflows/static.yml` pinned by commit SHA with
  the version in a trailing comment.
- [ ] You switch Settings, Pages, Build and deployment, Source to
  "GitHub Actions"; the plan stops here until it is done.
- [ ] Check: `make check` passes; after the next deploy,
  https://izam-mohammed.github.io/ still loads and `/CLAUDE.md`, `/.env`
  and `/Makefile` return 404; lychee runs online on the weekly schedule.

### Phase 4: open the PR

- [ ] The branch pushed and its PR opened against the branch it was cut
  from (or, if one is already open for this branch, its body brought up
  to date) with a Conventional Commit title for the whole change, a body
  naming this plan, what changed and why, and the checks run with their
  result. The PR's URL printed as the evidence. Opened, never merged.
