// mass = E / c^2 old
document.getElementById("daysold").textContent = Math.floor((Date.now() - 1127865600000) / 864e5);

// load time
document.getElementById("loadtime").textContent = (performance.now() / 1000).toFixed(4);

// source code reveal
document.getElementById("srclink").addEventListener("click", function (e) {
    e.preventDefault();
    var msg = document.getElementById("srcmsg");
    msg.hidden = !msg.hidden;
});

// what do i know about you
document.getElementById("spylink").addEventListener("click", function (e) {
    e.preventDefault();
    var box = document.getElementById("spybox");
    if (!box.hidden) { box.hidden = true; return; }

    var n = navigator;
    var s = screen;
    var ua = n.userAgent;
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "dunno";
    var lang = n.language || "dunno";
    var platform = n.platform || "dunno";
    var cores = n.hardwareConcurrency || "dunno";
    var res = s.width + "x" + s.height;
    var dark = window.matchMedia("(prefers-color-scheme: dark)").matches ? "yes (a person of culture)" : "no (you like burnin' your retinas)";
    var online = n.onLine ? "yes" : "how are you even seein' this?";
    var touch = "ontouchstart" in window ? "yes (phone or tablet)" : "no (real keyboard enjoyer)";
    var cw = document.documentElement.clientWidth + "x" + document.documentElement.clientHeight;
    var battery = navigator.getBattery ? "checkin'..." : "your browser won't snitch";
    var dnt = n.doNotTrack === "1" ? "yes (cute. nobody respects this btw)" : "no";

    // browser detection
    var browser = "somethin' exotic";
    if (ua.indexOf("Firefox") > -1) browser = "firefox";
    else if (ua.indexOf("Edg/") > -1) browser = "edge (microsoft is watchin')";
    else if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) browser = "opera (fancy)";
    else if (ua.indexOf("Chrome") > -1) browser = "chrome (google knows everythin' about you already)";
    else if (ua.indexOf("Safari") > -1) browser = "safari (apple tax applies here too)";

    // incognito - browsers patched all detection tricks. respect.

    var lines = [
        "relax, am not stealin' anythin'. this is all public info your browser gives to every website you visit. scary right?",
        "",
        "- browser: " + browser,
        "- incognito: browsers got smart and won't let me check anymore. you win this round.",
        "- screen: " + res,
        "- browser window: " + cw,
        "- language: " + lang,
        "- platform: " + platform,
        "- cpu cores: " + cores,
        "- timezone: " + tz,
        "- dark mode: " + dark,
        "- do not track: " + dnt,
        "- touchscreen: " + touch,
        "- online: " + online,
        "- battery: <span id='batteryinfo'>" + battery + "</span>",
        "- location: <span id='locinfo'>checkin'...</span>",
        "",
        "and no, i don't track you. no cookies, no analytics, no pixels. this site is cleaner than your browser history."
    ];

    box.innerHTML = lines.map(function (l) { return l === "" ? "<br>" : l; }).join("<br>");
    box.hidden = false;

    // battery
    if (navigator.getBattery) {
        navigator.getBattery().then(function (b) {
            var pct = Math.round(b.level * 100);
            var msg = pct + "%";
            if (b.charging) msg += " (chargin')";
            if (pct < 20) msg += " - go charge your device before it dies on my website";
            else if (pct > 90) msg += " - nice, fully juiced";
            document.getElementById("batteryinfo").textContent = msg;
        });
    }

    // location via ip api
    fetch("https://ipapi.co/json/").then(function (r) { return r.json(); }).then(function (d) {
        var el = document.getElementById("locinfo");
        if (d.city && d.country_name) {
            el.textContent = d.city + ", " + d.region + ", " + d.country_name + " (yeah, your ip told me)";
        } else {
            el.textContent = "somewhere on earth. probably.";
        }
    }).catch(function () {
        document.getElementById("locinfo").textContent = "couldn't figure it out yet.";
    });
});
