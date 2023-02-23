import math
import urllib.parse

def sha1_hash(g):
    K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]
    g += chr(0x80)
    l = len(g) // 4 + 2
    N = math.ceil(l / 16)
    M = [[0] * 16 for i in range(N)]
    for i in range(N):
        for j in range(16):
            M[i][j] = (ord(g[i * 64 + j * 4]) << 24) | (ord(g[i * 64 + j * 4 + 1]) << 16) | (ord(g[i * 64 + j * 4 + 2]) << 8) | (ord(g[i * 64 + j * 4 + 3]))
    M[N - 1][14] = ((len(g) - 1) * 8) / math.pow(2, 32)
    M[N - 1][14] = math.floor(M[N - 1][14])
    M[N - 1][15] = ((len(g) - 1) * 8) & 0xffffffff
    h = 0x67452301
    k = 0xefcdab89
    m = 0x98badcfe
    n = 0x10325476
    o = 0xc3d2e1f0
    W = [0] * 80
    a, b, c, d, e = h, k, m, n, o
    for i in range(N):
        for t in range(16):
            W[t] = M[i][t]
        for t in range(16, 80):
            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1)
        for t in range(80):
            s = t // 20
            T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) & 0xffffffff
            e = d
            d = c
            c = ROTL(b, 30)
            b = a
            a = T
        h = (h + a) & 0xffffffff
        k = (k + b) & 0xffffffff
        m = (m + c) & 0xffffffff
        n = (n + d) & 0xffffffff
        o = (o + e) & 0xffffffff
    return hex(h)[2:].zfill(8) + hex(k)[2:].zfill(8) + hex(m)[2:].zfill(8) + hex(n)[2:].zfill(8) + hex(o)[2:].zfill(8)

def ROTL(x, n):
    return (x << n) | (x >> (32 - n))

def f(s, x, y, z):
    if s == 0:
        return (x & y) ^ (~x & z)
    elif s == 1 or s == 3:
        return x ^ y ^ z
    elif s == 2:
        return (x & y) ^ (x & z) ^ (y & z)
    else:
        raise ValueError("Invalid value for s: " + s)

def get_cookie(cookie):
    a = cookie.find("SoftPLC=") + 8
    b = cookie.find(";", a)
    if b == -1:
        b = len(cookie)
    return urllib.parse.unquote(cookie[a:b])

def get_login_password(cookie_string):
    cookie = get_cookie(cookie_string)
    if sha1_hash("0") == "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c":
        return sha1_hash(cookie + "12345678")
    else:
        print("sha1_hash() is not working properly")

import hashlib
import requests

def sha1Hash(string):
    return hashlib.sha1(string.encode('utf-8')).hexdigest()

def getCookie(cookie):
    a = cookie.index("SoftPLC=") + 8
    b = cookie.find(";", a)
    if b == -1:
        b = len(cookie)
    return requests.utils.unquote(cookie[a:b])

def getLoginPassword(cookieString):
    cookie = getCookie(cookieString)
    if sha1Hash("0") == "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c":
        return sha1Hash(cookie + "12345678")
    else:
        print("sha1Hash() is not working properly")

def setHeatCurve(curveNumber):
    login_url = "https://example.com/login"
    regulation_url = "https://example.com/regulation"
    session = requests.Session()

    # Make a GET request to the login page to obtain the initial cookie
    response = session.get(login_url)
    print("LOGIN FORM SUCCESS", response.text)

    # Log in to the website using the obtained cookie
    try:
        cookie = response.headers["set-cookie"]
        headers = {
            "Cookie": "SoftPLC=" + getCookie(cookie),
            "Content-Type": "multipart/form-data"
        }
        data = {
            "USER": "user",
            "PASS": getLoginPassword(cookie)
        }
        response = session.post(login_url, headers=headers, data=data)
        print("LOGIN SUCCESS", response.text)
    except:
        print("LOGIN ERR")

    # Set the heat curve using the obtained cookie
    try:
        cookie = response.headers["set-cookie"]
        headers = {
            "Cookie": "SoftPLC=" + getCookie(cookie),
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": "18"
        }
        params = {
            "__R2380_USINT_d": curveNumber
        }
        data = "&".join([f"{key}={value}" for key, value in params.items()])
        response = session.post(regulation_url, headers=headers, data=data)
        print("REGULATION SUCCESS", response.text)
    except:
        print("REGULATION ERR")
      