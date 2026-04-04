// clean url - strip index.html from url bar
if (location.pathname.endsWith('/index.html')) {
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