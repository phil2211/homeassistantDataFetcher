const axios = require('axios');
const FormData = require('form-data');

const regulation = {
    method: 'post',
    url: 'http://192.168.1.133/PAGE215.XML',
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate"
    }
}    

const login = {
    method: 'get',
    url: 'http://192.168.1.133/syswww/LOGIN.xml',
    maxRedirects: 0,
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Encoding": "gzip, deflate"
    }
}


function setHeatCurve(curveNumber) {
    axios(login)
        .then((resp) => {
            console.log("LOGIN FORM SUCCESS", resp.data)
        })
        .catch((err) => {
            console.log("LOGIN FORM ERR");
            login.headers["Cookie"] = "SoftPLC=" + getCookie(err.response.headers["set-cookie"][0])
            login.headers["Content-Type"] = "multipart/form-data";
            login.method = "post";
            const formData = new FormData();
            formData.append("USER", "user");
            formData.append("PASS", getLoginPassword(err.response.headers["set-cookie"][0]));
            login.data = formData;
            axios(login)
                .then((resp) => {
                    console.log("LOGIN SUCCESS", resp.data);
                })
                .catch((err) => {
                    console.log("LOGIN ERR", err.response.headers);
                    regulation.headers["Cookie"] = "SoftPLC=" + getCookie(err.response.headers["set-cookie"][0])
                    regulation.headers["Content-Type"] = "application/x-www-form-urlencoded";
                    regulation.headers["Content-Length"] = "18";
                    regulation.method = "post";
                    const params = {
                        "__R2380_USINT_d": curveNumber
                    };
                    const data = Object.keys(params)
                        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
                        .join('&');     
                    console.log(data);
                    regulation.data = data;
                    axios(regulation)
                        .then((resp) => {
                            console.log("REGULATION SUCCESS", resp.data);
                        })
                        .catch((err) => {
                            console.log("REGULATION ERR", err.response.headers);
                        })
                })
        })
}

function sha1Hash(g) {
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

function getCookie(cookie) {
    var a = cookie.indexOf("SoftPLC=") + 8;
    var b = cookie.indexOf(";", a);
    if (b == -1) b = cookie.length;
    return unescape(cookie.substring(a, b));
}

function getLoginPassword(cookieString) {
    const cookie = getCookie(cookieString);
    if (sha1Hash("0") == "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c") {
        return sha1Hash(cookie + 12345678)
    } else {
        console.err("sha1Hash() is not working properly");
    }
}

setHeatCurve("30");




/*
<INPUT NAME="__R23925.6_BOOL_i" VALUE="0" /> == Compressor
*/