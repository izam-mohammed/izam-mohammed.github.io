# claude.md

yo claude, this file is for you. try not to mess things up okay?

## what even is this

this is izam's personal website. it's simple. don't go creatin' a bunch of react components or suggestin' we add typescript. am beggin' you.

## architecture (if you can even call it that)

- `index.html` - the main page. html + css + js shoved together like a burrito
- no frameworks. no webpack. no npm. no node_modules folder eatin' up 500mb of disk space
- deploys to github pages when you push to `main`. github actions handles it, not you

## how to develop

1. open `index.html` in browser
2. that's it. am not jokin'

don't you dare suggest settin' up a dev server or hot reloadin'. we don't do that here.

## style guide

- it's supposed to look ugly. it's inspired by motherfuckingwebsite.com. don't try to "improve" it
- no custom css. just vibin' with default browser styles like it's 1999
- the email is obfuscated with some rot13 nonsense so spambots don't find it. don't "fix" it thinkin' it's broken
- if you see inline styles, leave them alone. am not refactorin' 3 lines of css into a separate file
- write like i talk. use slang. droppin' the g from -ing words (writin', buildin', doin'). use gonna, wanna, 'em, ain't, etc. lowercase everything. keep it casual like you're textin' a friend not writin' a resume
- be funny. self-deprecatin' humor, sarcasm, absurd observations - that's the vibe. if a sentence can be boring or funny, pick funny. don't force it tho, cringe humor is worse than no humor. think "dev who doesn't take himself seriously" not "corporate blog tryin' to be relatable"

## things you should never do

- add a css framework
- suggest "maybe we could use tailwind here"
- over-engineer things for "better organization"
- add comments explainin' what `<h1>` does

## when addin' a new html page

checklist so you don't forget somethin':

1. **script tag** - use relative path to common.js based on depth:
   - root level: `<script src="assets/js/common.js"></script>`
   - `brain-dumps/xyz/`: `<script src="../../assets/js/common.js"></script>`
   - `brain-dumps/xyz/abc/`: `<script src="../../../assets/js/common.js"></script>`
2. **brain dumps index** - if it's a new note, add a link in `brain-dumps/index.html`
3. **file map below** - update the file map in this file
5. **email links** - use `<a href="#" data-rot="hyzlcdudknodq1@flzhk.bnl">` for email links. common.js handles the decoding
6. **back link** - every page should have `<p><a href="../">← back to ...</a></p>` at the top

## keepin' the changelog in sync

`brain-dumps/whats-changed/index.html` is a static changelog of every commit. you usually DON'T need to touch it by hand anymore - the `changelog.yml` ci workflow ("write it down before i forget") auto-logs each push to `main`: it adds a matchin' `<li>` at the TOP of the list and commits it back with `[skip changelog]` (so it don't loop on itself). the deploy (`static.yml`) only runs AFTER that, so the new entry actually ships.

if you ever gotta add a line manually (the bot's down, or you're backfillin'), the format is:

```html
<li><a href="https://github.com/izam-mohammed/izam-mohammed.github.io/commit/FULL_SHA"><code>SHORT_SHA</code></a> — commit message here <small>(DD Mon YYYY)</small></li>
```

- use the FULL 40-char sha in the href, the SHORT 7-char sha inside `<code>`
- html-escape the message (apostrophes become `&#x27;` etc) so it don't break the page
- put `[skip changelog]` in a commit message if you want the bot to ignore it

## file map

- `index.html` - main page
- `404.html` - custom 404 page
- `assets/js/common.js` - shared js (external links, rot13 emails, url cleanup)
- `assets/js/home.js` - home page logic (visit counter, spy box, source code reveal)
- `assets/js/what-am-i-doin.js` - rot13 encoded status messages by IST hour
- `assets/js/hey-dev.js` - console easter eggs for devtools users
- `brain-dumps/index.html` - brain dumps listin' page
- `brain-dumps/before-i-die/index.html` - bucket list
- `brain-dumps/3am-shower-thoughts/index.html` - software ideas
- `brain-dumps/will-i-ever-learn-all-this/index.html` - things to learn as swe
- `brain-dumps/brain-not-brainin/index.html` - cognitive biases
- `brain-dumps/blogs-worth-stalkin/index.html` - blogs worth readin'
- `brain-dumps/link-hoarding-problem/index.html` - collection of links
- `brain-dumps/where-i-doomscroll/index.html` - tech monitor sites
- `brain-dumps/timewastin-with-ai/index.html` - ai chat tools
- `brain-dumps/movies-that-hit-different/index.html` - movies & series
- `brain-dumps/rebuilding-the-wheel/index.html` - build from scratch projects
- `brain-dumps/things-life-taught-me/index.html` - life lessons / ideologies
- `brain-dumps/things-people-ask-me/index.html` - faq / things people ask me
- `brain-dumps/whats-changed/index.html` - changelog pulled live from github commit history
- `brain-dumps/projects/index.html` - things i built (moved here from top-level `projects/`)
- `sitemap.xml`, `robots.txt`, `llms.txt`, `openapi.json` - **all auto-generated, do NOT hand-edit.** rebuilt from the deployed pages by `scripts/gen-meta.py` (the changelog bot reruns it every push). `llms.txt` is the [llmstxt.org](https://llmstxt.org) overview for ai crawlers; `openapi.json` is a tongue-in-cheek spec treatin' each page as a GET endpoint (there's no real api)
- `.deployinclude` - whitelist of files/dirs that actually get deployed. the deploy copies ONLY what's listed here into `_site`. **if you add a new top-level page or folder, add it here or it won't ship** (the vibe-check guard will yell at you if you forget)
- `scripts/gen-meta.py` - regenerates sitemap.xml + robots.txt + llms.txt + openapi.json from the deployed pages (reads each page's `<title>` and `<meta description>`). run `python3 scripts/gen-meta.py` to refresh locally
- `.github/workflows/static.yml` - the deploy ("ship it before i change my mind"). runs after the changelog bot, copies `.deployinclude` stuff, pushes to github pages
- `.github/workflows/changelog.yml` - auto-logs each push into the changelog + regenerates all the metadata files ("write it down before i forget")
- `.github/workflows/vibe-check.yml` - guard ci: fails if someone sneaks in tailwind/node_modules, or adds a page that ain't in `.deployinclude`

## final words

this website loads in like 0.001 seconds. let's keep it that way. am countin' on you claude. don't let me down.
