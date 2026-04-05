// if you're readin' this file, you're either:
// 1. a developer (respect)
// 2. tryin' to steal my mass of html (go ahead, it's open source)
// 3. claude code reviewin' its own work (meta)

console.log("%c hey there, inspector gadget 🕵️", "font-size:24px;font-weight:bold;color:#333");
console.log("%c you opened devtools on a static html site. what were you expectin', a hidden bitcoin wallet?", "font-size:14px;color:#666");
console.log("%c since you're here, might as well hire me: https://linkedin.com/in/izammohammed", "font-size:12px;color:#888");
console.log("%c or if you found a bug, congrats - you're now the QA team.", "font-size:12px;color:#888");
console.log("%c p.s. this entire site is smaller than your node_modules folder.", "font-size:11px;color:#aaa");
console.log("%c p.p.s. no, there are no API keys hidden here. i checked.", "font-size:11px;color:#aaa");

// detect devtools open and log a message
var _devtoolsOpen = false;
var _checkDevtools = setInterval(function () {
    var threshold = 160;
    var widthCheck = window.outerWidth - window.innerWidth > threshold;
    var heightCheck = window.outerHeight - window.innerHeight > threshold;
    if ((widthCheck || heightCheck) && !_devtoolsOpen) {
        _devtoolsOpen = true;
        console.log("%c 👀 devtools just opened. i see you.", "font-size:14px;color:tomato;font-weight:bold");
        console.log("%c go ahead, read the source. it's all vanilla js. no secrets, no frameworks, no regrets.", "font-size:12px;color:#666");
    } else if (!widthCheck && !heightCheck) {
        _devtoolsOpen = false;
    }
}, 1000);

// easter egg: if they type "hire" in console
Object.defineProperty(window, "hire", {
    get: function () {
        console.log("%c you typed 'hire' in the console. that's basically a job application right?", "font-size:14px;color:green;font-weight:bold");
        console.log("%c reach out: check the email link on the page (it's rot13'd, figure it out - consider it a technical interview)", "font-size:12px;color:#666");
        return "thanks for the interest :)";
    }
});

// easter egg: if they type "help" in console
Object.defineProperty(window, "help_me", {
    get: function () {
        console.log("%c available commands:", "font-size:14px;font-weight:bold;color:#333");
        console.log("%c   hire       - wanna work together?", "font-size:12px;color:#666");
        console.log("%c   help_me    - you're lookin' at it", "font-size:12px;color:#666");
        console.log("%c   vibe_check - check the current vibe", "font-size:12px;color:#666");
        console.log("%c   secret     - there is no secret", "font-size:12px;color:#666");
        return "choose wisely.";
    }
});

Object.defineProperty(window, "vibe_check", {
    get: function () {
        var vibes = [
            "vibes: immaculate ✨",
            "vibes: currently debuggin' life",
            "vibes: 404 motivation not found",
            "vibes: runnin' on chai and chaos",
            "vibes: somewhere between burnout and breakthrough",
            "vibes: the code works but i don't know why"
        ];
        var v = vibes[Math.floor(Math.random() * vibes.length)];
        console.log("%c " + v, "font-size:14px;color:purple;font-weight:bold");
        return v;
    }
});

Object.defineProperty(window, "secret", {
    get: function () {
        console.log("%c there is no secret. i told you.", "font-size:14px;color:red;font-weight:bold");
        console.log("%c ...okay fine. the secret is that this entire website was vibe coded with claude at 2am.", "font-size:12px;color:#888");
        return "you happy now?";
    }
});
