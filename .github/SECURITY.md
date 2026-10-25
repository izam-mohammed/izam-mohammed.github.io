## security policy

if you found a vulnerability in this website, congratulations - you hacked a bunch of static html files. there's nothin' here to steal. no database, no api keys, no user data. the most dangerous thing on this site is my opinions.

that said, if i accidentally leaked some personal info (an api key in a commit, my address in a comment, my embarrassin' search history in a screenshot - you get the idea), please let me know before the entire internet does. i'd rather fix it quietly than trend on twitter for the wrong reasons.

### supported versions

there are no releases. the site is whatever's on `main` right now, so only the latest commit on `main` gets fixes.

### how to report it

please don't open an issue or a pr for it. that's just tweetin' it with extra steps.

report it privately through github instead: [report a vulnerability](https://github.com/izam-mohammed/izam-mohammed.github.io/security/advisories/new) (the "security" tab, then "report a vulnerability").

tell me what you found, where (page, file or commit), and how to see it. leave out any real secrets you stumbled on, just say where they are.

### what happens next

it's one guy and a personal website, so no promised response times. i'll read it, fix it on `main`, rotate whatever leaked, and tell you when it's done. then i'll buy you chai.

### scope

in scope: the pages and scripts in this repo, the `.githooks/pre-commit` hook, `scripts/gen-meta.py`, and the workflows in `.github/workflows/` (deploy, vibe check, security scan).

the `.env` file is a joke. there's nothin' real in it. please don't report it, i know.

out of scope: github pages itself, and whatever the sites i link to get up to.
