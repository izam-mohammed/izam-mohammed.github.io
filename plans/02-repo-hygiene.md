# the site's pinned hooks are kept current by dependabot, and its security policy says exactly where to report a problem

## The ask

The owner asked, in their own words, to "have dependabot in all of my
repos", to "have proper security.md file for all of my repos", and for a
"proper licence for all of the repos ... which is a product in nature ...
even for private ones". This is a personal website, not a product, so the owner's brief gives
it no licence; it gets Dependabot and a proper security policy.

What is there on `main` (read 22/10/2026):

- `.github/dependabot.yml` covers `github-actions` only. The hooks pinned
  in `.pre-commit-config.yaml` (gitleaks, pre-commit-hooks) get no
  updates. No other manifest exists: `scripts/gen-meta.py` uses the
  standard library only.
- `.github/SECURITY.md` exists in the site's voice, but names no channel
  ("hit me up"), no supported version and no scope, so a reporter of this
  public repository does not know where to go.
- Topics `github-hosted`, `html5`, `links`, `linktree`,
  `personal-website`, `website`, all accurate.

No built snapshot: this change adds repository settings and policy files
and touches no code.

## Alternatives

### Decision 1: which bot keeps dependencies current (two-way door)

Searched 22/10/2026: "dependabot vs renovate 2026"; the Dependabot options
reference on docs.github.com (ecosystem values, `cooldown`, `groups`), the
Renovate docs at docs.renovatebot.com.

| Criterion | Dependabot | Renovate |
| --- | --- | --- |
| Performance efficiency | runs on GitHub's side, no app or runner minutes | hosted app or a self-run job |
| Fit to the ask | the ask names Dependabot; `github-actions` already configured here | a new config and app |
| Compatibility | `github-actions`, `pre-commit` listed as ecosystems | covers the same managers |
| Security | first-party, no third-party app with write access | a third-party app with write access |

**Chosen: Dependabot (the owner's pick).** It needs no extra app with
write access and covers every ecosystem found. Revisit if grouping or
scheduling needs outgrow its options.

## The decision

Topics are a repository setting, set from the README and description,
keeping every existing one. Dependabot (Decision 1) is extended only
where an ecosystem is missing: the `github-actions` entry stays as it is,
and a `pre-commit` entry in the shared shape (weekly,
`cooldown: default-days: 7`, one group, `chore(deps)` prefix) is added.
`.github/SECURITY.md` keeps its voice and its opening, and gains the
sections `decisionsmith`'s has: supported versions, GitHub's private
vulnerability reporting link, what happens next and scope. No licence,
per the owner's brief.

New dependencies or permissions: none.

Security: no code, input, secret or permission changes; the change only
asks for update PRs and says where to report a vulnerability.

## Where it lands

| Path | New or edit | Phase | What changes | Firm? |
| --- | --- | --- | --- | --- |
| `.github/dependabot.yml` | edit | 2 | `pre-commit` added | fixed |
| `.github/SECURITY.md` | edit | 3 | the security policy | fixed |

*Reused, not rewritten:*

- `.github/dependabot.yml`: the existing `github-actions` entry is kept.
- `.github/SECURITY.md`: its opening and voice are kept, not replaced.
- `decisionsmith`'s `.github/dependabot.yml` and `SECURITY.md`: the
  shapes copied.

## Declined

- Renovate: lost Decision 1 on security (a third-party app with write
  access).
- A licence: the owner's brief marks this repository as not getting one.

## Phases

### Phase 1: topics

- [x] The repository topics set from the README and description, recorded
  here: `github-hosted`, `html5`, `links`, `linktree`,
  `personal-website`, `static-site`, `website`; check: `gh repo view izam-mohammed/izam-mohammed.github.io --json repositoryTopics`
  lists them.

### Phase 2: dependabot

- [x] `.github/dependabot.yml` keeps its `github-actions` entry and adds
  `pre-commit` (`/`), weekly with a seven-day cooldown and one group; check: the file parses as YAML (checked with `yaml.safe_load`).

### Phase 3: security policy

- [x] `.github/SECURITY.md` keeps its voice and says only the latest
  commit on `main` is live, links GitHub's private vulnerability
  reporting, says what happens next, and names the scope (the pages, the
  pre-commit and deploy workflows, `scripts/gen-meta.py`).

### Phase 4: open the PR

- [x] The branch pushed and its PR opened against the branch it was cut
  from (or, if one is already open for this branch, its body brought up to
  date) with a Conventional Commit title for the whole change, a body naming
  this plan, what changed and why, and the checks run with their result. The
  PR's URL printed as the evidence. Opened, never merged.
  Landed 22/10/2026: https://github.com/izam-mohammed/izam-mohammed.github.io/pull/11.
