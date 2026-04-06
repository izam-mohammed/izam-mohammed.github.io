// mass = E / c^2 old
document.getElementById("daysold").textContent = Math.floor((Date.now() - 1127865600000) / 864e5);

// load time
document.getElementById("loadtime").textContent = (performance.now() / 1000).toFixed(4);

// visit counter
(function () {
    var count = parseInt(localStorage.getItem("_izam_visits") || "0") + 1;
    localStorage.setItem("_izam_visits", count);
    var msg = "";
    if (count === 1) msg = "first time here? welcome. don't touch anythin'.";
    else if (count === 2) msg = "you came back? didn't expect that honestly.";
    else if (count === 3) msg = "3rd visit. at this point you're basically a regular.";
    else if (count <= 5) msg = "you clearly have nothin' better to do.";
    else if (count <= 10) msg = "should i charge you rent at this point?";
    else if (count <= 25) msg = "we're in a relationship now. no take-backs.";
    else if (count <= 50) msg = "you've been here more than my own mother.";
    else if (count <= 100) msg = "just bookmark me and stop pretendin' you typed the url.";
    else msg = "you need an intervention. or a hobby. or both.";
    document.getElementById("visitcount").textContent = msg;
})();

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

    // plugins/extensions count
    var plugins = navigator.plugins ? navigator.plugins.length : 0;
    var pluginMsg = plugins + (plugins === 0 ? " (either you're clean or your browser is hidin' 'em)" : plugins > 10 ? " (hoarder alert)" : "");

    var lines = [
        "relax, am not stealin' anythin'. this is all public info your browser gives to every website you visit. scary right?",
        "",
        "- browser: " + browser,
        "- incognito: browsers got smart and won't let me check anymore. you win this round.",
        "- plugins/extensions: " + pluginMsg,
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
        "- ipv4: <span id='ip4info'>checkin'...</span>",
        "- ipv6: <span id='ip6info'>checkin'...</span>",
        "- location: <span id='locinfo'>checkin'...</span>",
        "- vpn: <span id='vpninfo'>checkin'...</span>",
        "",
        "and no, am not storin' any of this anywhere. no cookies, no analytics, no pixels, no database. this is just a static html site - check the source code if you don't believe me.",
        "",
        "<a href='#' id='moredatabtn' style='color:#555'>wanna see what else i can find? (requires your permission)</a>",
        "<div id='moredata' hidden></div>"
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

    // location + ip via ip api (skip on file:// to avoid CORS)
    if (location.protocol === "file:") {
        document.getElementById("locinfo").textContent = "can't fetch locally. deploy me first.";
        document.getElementById("ip4info").textContent = "can't fetch locally. deploy me first.";
        document.getElementById("ip6info").textContent = "can't fetch locally. deploy me first.";
    } else {
        // get ipv4
        fetch("https://api.ipify.org?format=json").then(function (r) { return r.json(); }).then(function (d) {
            document.getElementById("ip4info").textContent = d.ip + " (every website sees this)";
        }).catch(function () {
            document.getElementById("ip4info").textContent = "couldn't fetch it.";
        });

        // get ipv6
        fetch("https://api64.ipify.org?format=json").then(function (r) { return r.json(); }).then(function (d) {
            var ip = d.ip;
            if (ip.indexOf(":") > -1) {
                document.getElementById("ip6info").textContent = ip + " (the long scary one)";
            } else {
                document.getElementById("ip6info").textContent = "not available (your network doesn't support ipv6)";
            }
        }).catch(function () {
            document.getElementById("ip6info").textContent = "couldn't fetch it.";
        });

        // location + vpn detection
        fetch("https://ipapi.co/json/").then(function (r) { return r.json(); }).then(function (d) {
            var el = document.getElementById("locinfo");
            var vpnEl = document.getElementById("vpninfo");
            if (d.city && d.country_name) {
                el.textContent = d.city + ", " + d.region + ", " + d.country_name + " (yeah, your ip told me)";
            } else {
                el.textContent = "somewhere on earth. probably.";
            }

            // vpn detection: compare browser timezone with ip timezone
            var browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            var ipTz = d.timezone || "";
            // load IANA timezone aliases and compare
            fetch("assets/data/tz-aliases.json").then(function (r) { return r.json(); }).then(function (tzAliases) {
                var normBrowser = tzAliases[browserTz] || browserTz;
                var normIp = tzAliases[ipTz] || ipTz;
                if (normBrowser && normIp) {
                    if (normBrowser === normIp) {
                        vpnEl.textContent = "probably not. your timezone and ip location match.";
                    } else {
                        vpnEl.textContent = "likely yes. your browser says " + browserTz + " but your ip says " + ipTz + ". either vpn or you just teleported.";
                    }
                } else {
                    vpnEl.textContent = "can't tell.";
                }
            }).catch(function () {
                // fallback: direct comparison if json fails to load
                if (browserTz === ipTz) {
                    vpnEl.textContent = "probably not. your timezone and ip location match.";
                } else {
                    vpnEl.textContent = "can't fully verify. browser says " + browserTz + ", ip says " + ipTz + ".";
                }
            });
        }).catch(function () {
            document.getElementById("locinfo").textContent = "couldn't figure it out yet.";
            document.getElementById("vpninfo").textContent = "can't tell without location data.";
        });
    }

    // more data button
    document.getElementById("moredatabtn").addEventListener("click", function (e) {
        e.preventDefault();
        var btn = this;
        btn.textContent = "askin' your browser nicely...";
        var moreBox = document.getElementById("moredata");
        var results = [];

        // gpu info via webgl
        try {
            var canvas = document.createElement("canvas");
            var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (gl) {
                var ext = gl.getExtension("WEBGL_debug_renderer_info");
                if (ext) {
                    results.push("- gpu: " + gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) + " (yes, i can see your graphics card)");
                }
            }
        } catch (err) { }

        // screen details
        results.push("- color depth: " + screen.colorDepth + " bit");
        results.push("- pixel ratio: " + window.devicePixelRatio + (window.devicePixelRatio >= 2 ? " (retina display, fancy)" : " (standard display)"));
        results.push("- max touch points: " + navigator.maxTouchPoints);

        // all languages
        if (navigator.languages) {
            results.push("- all languages: " + navigator.languages.join(", ") + " (polyglot or just never cleaned browser settings?)");
        }

        // cookies enabled
        results.push("- cookies enabled: " + (navigator.cookieEnabled ? "yes" : "no (respect the paranoia)"));

        // pdf viewer
        if (navigator.pdfViewerEnabled !== undefined) {
            results.push("- pdf viewer: " + (navigator.pdfViewerEnabled ? "yes" : "no"));
        }

        // webdriver (bot detection)
        if (navigator.webdriver) {
            results.push("- webdriver: DETECTED. are you a bot? a scraper? selenium? i have questions.");
        }

        moreBox.innerHTML = "<br><b>alright you asked for it. here's the deep dive:</b><br><br>" +
            results.join("<br>") +
            "<br><span id='gpsloc'>- gps location: requestin'...</span>" +
            "<br><span id='weatherloc'></span>" +
            "<br><span id='motionloc'></span>" +
            "<br><br><i>still think \"i have nothin' to hide\" after seein' all this?</i>";
        moreBox.hidden = false;
        btn.textContent = "you asked for it.";

        // ask for REAL gps location
        if (navigator.geolocation) {
            var gpsEl = document.getElementById("gpsloc");
            navigator.geolocation.getCurrentPosition(function (pos) {
                var lat = pos.coords.latitude.toFixed(6);
                var lon = pos.coords.longitude.toFixed(6);
                var acc = Math.round(pos.coords.accuracy);
                var alt = pos.coords.altitude ? pos.coords.altitude.toFixed(1) + "m above sea level" : "unknown";
                var speed = pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(1) + " km/h (are you movin' right now?)" : "stationary (or your gps can't tell)";
                gpsEl.innerHTML = "- gps location: " + lat + ", " + lon + " (accurate to ~" + acc + "m)" +
                    "<br>- altitude: " + alt +
                    "<br>- speed: " + speed +
                    "<br>- <a href='https://www.google.com/maps?q=" + lat + "," + lon + "' target='_blank' rel='noopener noreferrer' style='color:#555'>open in google maps</a> (yeah, that's you right there)";

                // weather from open-meteo (free, no api key)
                var wEl = document.getElementById("weatherloc");
                wEl.textContent = "- weather: checkin'...";
                fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto")
                    .then(function (r) { return r.json(); })
                    .then(function (w) {
                        var c = w.current;
                        var temp = c.temperature_2m;
                        var humidity = c.relative_humidity_2m;
                        var wind = c.wind_speed_10m;
                        var codes = {0:"clear sky",1:"mainly clear",2:"partly cloudy",3:"overcast",45:"foggy",48:"fog",51:"light drizzle",53:"drizzle",55:"dense drizzle",61:"slight rain",63:"moderate rain",65:"heavy rain",71:"slight snow",73:"moderate snow",75:"heavy snow",80:"slight showers",81:"moderate showers",82:"violent showers",95:"thunderstorm",96:"thunderstorm w/ hail",99:"thunderstorm w/ heavy hail"};
                        var desc = codes[c.weather_code] || "somethin' weather-ish";
                        var comment = "";
                        if (temp > 35) comment = " - go drink water right now.";
                        else if (temp > 28) comment = " - nice and toasty.";
                        else if (temp > 20) comment = " - perfect weather. why are you on a website?";
                        else if (temp > 10) comment = " - grab a hoodie.";
                        else comment = " - it's freezin'. stay inside and browse my site.";
                        wEl.textContent = "- weather: " + temp + "°C, " + desc + ", humidity " + humidity + "%, wind " + wind + " km/h" + comment;
                    })
                    .catch(function () {
                        wEl.textContent = "- weather: couldn't fetch it. the weather gods are uncooperative.";
                    });
            }, function (err) {
                if (err.code === 1) gpsEl.textContent = "- gps location: denied. smart move honestly.";
                else if (err.code === 2) gpsEl.textContent = "- gps location: couldn't get it. your device is bein' shy.";
                else gpsEl.textContent = "- gps location: timed out. maybe you're in a bunker?";
            }, { enableHighAccuracy: true, timeout: 15000 });
        } else {
            document.getElementById("gpsloc").textContent = "- gps location: your browser doesn't support this. ancient device?";
        }

        // device motion/orientation (mobile)
        var motionEl = document.getElementById("motionloc");
        if (window.DeviceOrientationEvent) {
            var gotOrientation = false;
            window.addEventListener("deviceorientation", function handler(ev) {
                if (gotOrientation) return;
                if (ev.alpha !== null) {
                    gotOrientation = true;
                    motionEl.textContent = "- device tilt: alpha=" + Math.round(ev.alpha) + " beta=" + Math.round(ev.beta) + " gamma=" + Math.round(ev.gamma) + " (i can tell how you're holdin' your device rn)";
                    window.removeEventListener("deviceorientation", handler);
                }
            });
            setTimeout(function () {
                if (!gotOrientation) motionEl.textContent = "";
            }, 3000);
        }
    });
});
