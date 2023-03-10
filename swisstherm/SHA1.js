function isMobileBrower() {
    var a = (navigator.userAgent || navigator.vendor || window.opera);
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
}

function StyleForMob() {
    var a = document.getElementsByTagName("input"); if (!isMobileBrower()) { var b = document.getElementById("wrapper"); b.style.width = "480px"; for (i = 0; i < a.length; i++)a[i].style.fontSize = "120%"; document.getElementById("wrap").style.margin = "6px 24px 12px 24px"; return true } return false
}

export default function sha1Hash(g) {
    var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
    g += String.fromCharCode(0x80);
    var l = g.length / 4 + 2;
    var N = Math.ceil(l / 16);
    var M = new Array(N);
    for (var i = 0; i < N; i++) {
        M[i] = new Array(16);
        for (var j = 0; j < 16; j++) {
            M[i][j] = (g.charCodeAt(i * 64 + j * 4) << 24) |
                (g.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                (g.charCodeAt(i * 64 + j * 4 + 2) << 8) |
                (g.charCodeAt(i * 64 + j * 4 + 3))
        }
    }
    M[N - 1][14] = ((g.length - 1) * 8) / Math.pow(2, 32);
    M[N - 1][14] = Math.floor(M[N - 1][14]); M[N - 1][15] = ((g.length - 1) * 8) & 0xffffffff;
    var h = 0x67452301;
    var k = 0xefcdab89;
    var m = 0x98badcfe;
    var n = 0x10325476;
    var o = 0xc3d2e1f0;
    var W = new Array(80);
    var a, b, c, d, e;
    for (var i = 0; i < N; i++){
        for (var t = 0; t < 16; t++)W[t] = M[i][t];
        for (var t = 16; t < 80; t++)W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1); a = h; b = k; c = m; d = n; e = o;
        for (var t = 0; t < 80; t++) {
            var s = Math.floor(t / 20);
            var T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff; e = d; d = c; c = ROTL(b, 30); b = a; a = T
        }
        h = (h + a) & 0xffffffff;
        k = (k + b) & 0xffffffff;
        m = (m + c) & 0xffffffff;
        n = (n + d) & 0xffffffff;
        o = (o + e) & 0xffffffff
    } return h.toHexStr() + k.toHexStr() + m.toHexStr() + n.toHexStr() + o.toHexStr()
}

function f(s, x, y, z)
{ switch (s) { case 0: return (x & y) ^ (~x & z); case 1: return x ^ y ^ z; case 2: return (x & y) ^ (x & z) ^ (y & z); case 3: return x ^ y ^ z } }

function ROTL(x, n) {
    return (x << n) | (x >>> (32 - n))
}

Number.prototype.toHexStr = function () {
    var s = "", v;
    for (var i = 7; i >= 0; i--){
        v = (this >>> (i * 4)) & 0xf; s += v.toString(16)
    } return s
};

function ProccessLogin() {
    var a = document.cookie.indexOf("SoftPLC=") + 8;
    var b = document.cookie.indexOf(";", a);
    if (b == -1) b = document.cookie.length;
    if (document.forms && sha1Hash("0") == "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c") {
        document.forms[0].PASS.value = sha1Hash(unescape(document.cookie.substring(a, b)) + document.forms[0].PASS.value)
    } return true
}