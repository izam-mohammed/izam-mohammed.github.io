// nice try readin' my source code. these are rot13'd.
// if you're decryptin' this just to know what am doin' at 3am, you need a hobby.
(function () {
    var d = function (t) {
        return t.replace(/[a-z]/gi, function (c) {
            return String.fromCharCode(((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26) + (c <= "Z" ? 65 : 97));
        });
    };
    var h = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).getUTCHours();

    fetch("assets/data/status-messages.json")
        .then(function (r) { return r.json(); })
        .then(function (s) {
            document.getElementById("status").textContent = d(s[h]);
        })
        .catch(function () {
            document.getElementById("status").textContent = "existin'. probably.";
        });
})();
