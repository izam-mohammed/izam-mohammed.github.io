// clean url - strip index.html from url bar
if (location.pathname.endsWith('/index.html')) {
    history.replaceState(null, '', location.pathname.replace('/index.html', '/'));
}

// open all external links in new tab
document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
});