// clean url - strip index.html from url bar
if (location.protocol !== 'file:' && location.pathname.endsWith('/index.html')) {
    history.replaceState(null, '', location.pathname.replace('/index.html', '/'));
}

// open all external links in new tab
document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});

// rot13 email obfuscation - add data-rot="encoded@email" to any <a> tag
document.querySelectorAll('a[data-rot]').forEach(function (link) {
    link.href = "mailto:" + link.getAttribute("data-rot").replace(/[a-z]/gi, function (c) {
        return String.fromCharCode(
            ((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 27) % 26) +
            (c <= "Z" ? 65 : 97)
        );
    });
});

// shareable list items - opt in with class="shareable" on a <ol>/<ul>. each <li> gets a
// 🔗 to copy a deep link; openin' it shows just that item (yellow) plus a "see all" way out.
// mark anythin' class="keep" to stay visible in single-item view. all driven by the url hash.
(() => {
    const items = [...document.querySelectorAll('.shareable > li')];
    if (!items.length) return;

    const css = (el, s) => Object.assign(el.style, s);
    const show = (el, on) => { if (el) el.style.display = on ? '' : 'none'; };
    const btnOf = (li) => li.querySelector(':scope > button');

    // tiny popup that hangs around a few secs, with a preview link to open in a new tab
    const toast = (msg, url) => {
        const t = document.createElement('div');
        t.textContent = msg + ' ';
        css(t, { position: 'fixed', bottom: '1em', left: '50%', transform: 'translateX(-50%)',
            background: 'black', color: 'white', padding: '0.4em 0.8em' });
        const a = document.createElement('a');
        Object.assign(a, { href: url, target: '_blank', rel: 'noopener noreferrer', textContent: 'preview' });
        a.style.color = 'yellow';
        t.append(a);
        document.body.append(t);
        setTimeout(() => t.remove(), 5000);
    };

    const seen = {};
    items.forEach((li) => {
        const lead = li.textContent.replace(/\s+/g, ' ').trim().toLowerCase().split(/ [-–] /)[0];
        let slug = lead.split(' ').slice(0, 8).join(' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (!slug) return;
        slug = seen[slug] ? `${slug}-${++seen[slug]}` : (seen[slug] = 1, slug);
        li.id = slug;

        const btn = document.createElement('button');
        btn.textContent = '🔗';
        btn.title = 'copy a link to this one';
        css(btn, { border: 'none', background: 'none', cursor: 'pointer', padding: '0' });
        btn.onclick = () => {
            const url = `${location.origin}${location.pathname}#${li.id}`;
            navigator.clipboard.writeText(url).then(() => {
                btn.textContent = '✅';
                setTimeout(() => { btn.textContent = '🔗'; }, 1500);
                toast('link copied! go spam it somewhere', url);
            });
            return false;
        };
        li.append(' ', btn);
    });

    const back = document.createElement('p');
    const backLink = document.createElement('a');
    Object.assign(backLink, { href: location.pathname, textContent: 'see all the other stuff →' });
    backLink.onclick = () => {
        history.pushState('', document.title, location.pathname);
        render();
        return false;
    };
    back.append(backLink);

    function render() {
        let target = location.hash && document.getElementById(location.hash.slice(1));
        if (!items.includes(target)) target = null;

        // full view: undo any hiding/highlighting from a previous single-item view
        back.remove();
        items.forEach((li) => { show(li, true); li.style.background = ''; show(btnOf(li), true); });
        new Set(items.map((li) => li.parentElement.parentElement))
            .forEach((c) => [...c.children].forEach((el) => show(el, true)));
        if (!target) return;

        // single-item view: keep the back-nav, <h1>, target's list and anythin' class="keep"
        const list = target.parentElement, container = list.parentElement;
        [...container.children].forEach((el) => show(el,
            el === list || el.tagName === 'H1' || el === container.firstElementChild || el.classList.contains('keep')));
        items.forEach((li) => show(li, li === target));
        target.style.background = 'yellow';
        show(btnOf(target), false);
        container.insertBefore(back, list);
    }

    render();
    addEventListener('hashchange', render);
})();