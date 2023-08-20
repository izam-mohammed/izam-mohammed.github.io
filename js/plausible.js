!(function () {
  "use strict";
  var a = window.location,
    r = window.document,
    o = r.currentScript,
    s = o.getAttribute("data-api") || new URL(o.src).origin + "/api/event";
  function l(t) {
    console.warn("Ignoring Event: " + t);
  }
  function t(t, e) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(a.hostname) ||
      "file:" === a.protocol
    )
      return l("localhost");
    if (
      !(
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress
      )
    ) {
      try {
        if ("true" === window.localStorage.plausible_ignore)
          return l("localStorage flag");
      } catch (t) {}
      var i = {};
      (i.n = t),
        (i.u = a.href),
        (i.d = o.getAttribute("data-domain")),
        (i.r = r.referrer || null),
        (i.w = window.innerWidth),
        e && e.meta && (i.m = JSON.stringify(e.meta)),
        e && e.props && (i.p = e.props);
      var n = new XMLHttpRequest();
      n.open("POST", s, !0),
        n.setRequestHeader("Content-Type", "text/plain"),
        n.send(JSON.stringify(i)),
        (n.onreadystatechange = function () {
          4 === n.readyState && e && e.callback && e.callback();
        });
    }
  }
  var e = (window.plausible && window.plausible.q) || [];
  window.plausible = t;
  for (var i, n = 0; n < e.length; n++) t.apply(this, e[n]);
  function p() {
    i !== a.pathname && ((i = a.pathname), t("pageview"));
  }
  var w,
    d = window.history;
  d.pushState &&
    ((w = d.pushState),
    (d.pushState = function () {
      w.apply(this, arguments), p();
    }),
    window.addEventListener("popstate", p)),
    "prerender" === r.visibilityState
      ? r.addEventListener("visibilitychange", function () {
          i || "visible" !== r.visibilityState || p();
        })
      : p();
})();
