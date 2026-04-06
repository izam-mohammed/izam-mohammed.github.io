// nice try readin' my source code. these are rot13'd.
// if you're decryptin' this just to know what am doin' at 3am, you need a hobby.
(function () {
    var d = function (t) {
        return t.replace(/[a-z]/gi, function (c) {
            return String.fromCharCode(((c.charCodeAt(0) - (c <= "Z" ? 65 : 97) + 13) % 26) + (c <= "Z" ? 65 : 97));
        });
    };
    var h = new Date(Date.now() + (5.5 * 60 * 60 * 1000)).getUTCHours();
    var s = ["fyrrcva' yvxr n znff bs qrnq pryyf 💤","fyrrcva'... be qbbz fpebyyva'. cebonoyl qbbz fpebyyva'.","rvgure univa' n qrrc rkvfgragvny pevfvf be whfg nfyrrc.","nfyrrc. vs nz abg, fbzrguva' jrag irel jebat.","fyrrcva'. frevbhfyl jub'f purpxva' zl fvgr ng 4nz VFG?","jnxva' hc naq dhrfgvbava' jul gur nynez rkvfgf.","oehfuva' grrgu naq cergraqva' gb or n zbeavat' crefba.","pbbxva' oernxsnfg be oheava' vg. gurer'f ab va orgjrra.","sbbqva'. qba'g qvfgheo. guvf vf fnperq gvzr.","jbexva'. be ng yrnfg tbg gur yncgbc bcra.","ivor pbqva' - jurer gur NV jevgrf naq v gnxr perqvg.","qrrc va n enoovg ubyr gung fgnegrq jvgu bar pynhqr zrffntr.","yhapu oernx. gur bayl zrrgva' v npghnyyl rawbl.","sbbqva' be va n sbbq pbzn. obgu rdhnyyl cebqhpgvir.","jbexva'. gur cbfg-yhapu sbphf uvgf qvssrerag (fbzrgvzrf).","cebonoyl qrohttvat' fbzrguva' v jebgr ng 2nz.","fgvyy jbexva'. be jngpuva' n grpu ivqrb naq pnyyva' vg erfrnepu.","jencchva' hc jbex. be fgnegva' gur erny jbex (fvqr cebwrpgf).","yrneavat' fbzrguva' arj. be ng yrnfg cergraqva' gb.","pbbxva' qvaare. lbhghor erpvcr bcra ba bar gno, 47 bgure gnof bcra sbe ab ernfba.","rngva' be fpebyyvat' be obgu. zhygvgnfxva' yrtraq.","jngpuva' n zbivr be ernqva'. gur cebqhpgvir cneg bs gur qnl vf bire.","ivor pbqva' fvqr cebwrpgf gung'yy arire frr n tvg chfu.","fgvyy njnxr sbe nofbyhgryl ab tbbq ernfba."];
    document.getElementById("status").textContent = d(s[h]);
})();
