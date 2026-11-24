#!/usr/bin/env python3
"""Generates the Eganow Business hub + service pages. Run: python3 build.py  (outputs business/**/index.html)"""
import os, html, json, re

REGISTER = "https://merchant.deveganowapi.com/register"
LOGIN = "https://merchant.deveganowapi.com/login"
SALES = "https://eganow.com/contact?topic=sales"
SANDBOX = "https://eganow.com/contact?topic=sandbox"
DOCS = "https://docs.sandbox.egacoreapi.com/"
SITE = "https://eganow.com"
LEGAL = ("Eganow (TekSol Eganow Ltd) is a financial technology company, not a Bank. Eganow is licensed by Bank of Ghana as an Enhanced Payment "
         "Service Provider (EPSP) under the Payment Systems and Services ACT, 2019 (ACT 987). TekSol Eganow Ltd. (Registered Number CS129662020) is a "
         "fintech company incorporated in Ghana under the new companies Act, 2019 (ACT 992). Mastercard is a registered trademark of Mastercard International Incorporated.")

SERVICES = [  # slug, name, tagline
    ("bizcollect", "BizCollect", "Get paid in seconds."),
    ("egapos", "EgaPOS", "Tap. Paid."),
    ("card-issuing", "Card Issuing", "Issue cards. Control spend."),
    ("agency-banking", "Agency Banking", "Cash in. Cash out. Anywhere."),
    ("bulk-messaging", "Bulk Messaging", "Reach everyone. Instantly."),
    ("egahub", "Egahub", "Your business, in your pocket."),
]
e = html.escape
ORG = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"FinancialService","name":"Eganow","url":"https://eganow.com","logo":"https://eganow.com/brand/eganow-icon.svg","areaServed":"GH"}</script>'

def li(items, cls=""): return f'<ul class="{cls}">' + "".join(f"<li>{x}</li>" for x in items) + "</ul>"

def SUF(path): return "Eganow Business" if path.startswith("/business") else "Eganow"
NOINDEX = '<meta name="robots" content="noindex">'
def BC(path, title):
    if path == "/": return ""
    items = [{"@type":"ListItem","position":1,"name":"Business","item":SITE+"/business/"}]
    if path != "/business/": items.append({"@type":"ListItem","position":2,"name":title,"item":SITE+path})
    return '<script type="application/ld+json">' + json.dumps({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items}) + '</script>'

def head(title, desc, path):
    pre = '<link rel="preload" as="image" href="/assets/img/hero-scene-poster.webp" fetchpriority="high">' if path == "/" else ""
    return f'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | {SUF(path)}</title><meta name="description" content="{e(desc)}">
<link rel="canonical" href="{SITE}{path}"><link rel="icon" href="/brand/eganow-icon.svg" type="image/svg+xml"><link rel="icon" href="/assets/icon-192.png" sizes="192x192" type="image/png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="manifest" href="/assets/site.webmanifest"><meta name="theme-color" content="#CC0229">{NOINDEX if (path in ("/help/","/security/","/blog/") or path.startswith("/blog/") or path in ("/legal/privacy/","/legal/cookies/","/legal/aml-policy/","/legal/complaints/")) else ""}
<meta property="og:title" content="{e(title)} | {SUF(path)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website"><meta property="og:url" content="{SITE}{path}"><meta property="og:site_name" content="Eganow"><meta property="og:image" content="{SITE}/assets/img/og-eganow.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Eganow: your one app for everything money"><meta name="twitter:card" content="summary_large_image">
{pre}<link rel="preload" href="/assets/fonts/inter-latin-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/manrope-latin-xn7gYHE41ni1AdIRggexSg.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/tokens.css"><link rel="stylesheet" href="/assets/business.css">
{BC(path,title)}{ORG if path=="/" else ""}
</head><body><a class="skip" href="#main">Skip to content</a>'''

def header(active):
    nav = [("Personal", "/", "per"), ("Business", "/business/", "biz"), ("Developers", "/business/developers/", "dev"), ("About", "/about/", "abt"), ("Help", "/help/", "hlp")]
    links = "".join(f'<a href="{h}"{" aria-current=page" if k and k==active else ""}>{n}</a>' for n, h, k in nav)
    drawer = "".join(f'<a href="{h}">{n}</a>' for n, h, k in nav) + "".join(f'<a href="/business/{s}/">{n}</a>' for s, n, t in SERVICES)
    return f'''<header class="hdr"><a href="/business/" aria-label="Eganow Business home"><img src="/brand/eganow-wordmark-red.svg" alt="eganow" width="98" height="28"></a>
<nav class="nav" aria-label="Main">{links}</nav><div class="hdr__r"><a class="btn btn--line btn--sm hide-s" href="{LOGIN}">Business sign in</a><a class="btn btn--red btn--sm" href="{REGISTER}">Open an account</a>
<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="drawer"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button></div></header>
<nav class="drawer" id="drawer" aria-label="Mobile">{drawer}</nav>'''

def footer():
    biz = "".join(f'<li><a href="/business/{s}/">{n}</a></li>' for s, n, t in SERVICES) + '<li><a href="/business/developers/">Developers</a></li>'
    return f'''<footer class="ft"><div class="ft__in"><div class="ft__b"><img src="/brand/eganow-wordmark-white.svg" alt="eganow" width="118" height="34"><p>Simple. Speed. Secure.</p></div>
<nav aria-label="Personal"><h2>Personal</h2><ul><li><a href="https://eganow.com/money-transfer">Money transfer</a></li><li><a href="https://eganow.com/bill-payment">Bill payments</a></li><li><a href="https://eganow.com/cards">Cards</a></li><li><a href="https://eganow.com/groups">Groups</a></li></ul></nav>
<nav aria-label="Business"><h2>Business</h2><ul>{biz}</ul></nav>
<nav aria-label="Company"><h2>Company</h2><ul><li><a href="/about/">About</a></li><li><a href="/blog/">Blog</a></li><li><a href="/security/">Security</a></li><li><a href="/help/">Help</a></li><li><a href="/contact/">Contact</a></li><li><a href="/blog/">Blog</a></li><li><a href="/legal/">Legal</a></li><li><a href="/legal/privacy/">Privacy policy</a></li><li><a href="/legal/terms/">Terms</a></li></ul></nav>
<nav aria-label="Get started"><h2>Get started</h2><ul><li><a href="{REGISTER}">Open a business account</a></li><li><a href="{LOGIN}">Business sign in</a></li><li><a href="{SALES}">Talk to sales</a></li><li><a href="{SANDBOX}">Get sandbox access</a></li></ul></nav></div>
<p class="ft__l">{LEGAL} © 2026 Eganow.</p></footer><script src="/assets/business.js"></script></body></html>'''

HERO_PHOTOS = {
 "BizCollect": ("p08-bizcollect-market-stall", "A market-stall owner and a customer completing a mobile money payment at a produce stall in Accra"),
 "EgaPOS": ("p09-egapos-boutique", "A boutique owner handing a customer a handheld payment terminal in a clothing shop in Kumasi"),
 "Card Issuing": ("p10-card-issuing-office", "A finance manager handing a red company card to a teammate in a modern office"),
 "Agency Banking": ("p11-agency-banking-kiosk", "An agent in a red uniform counting cash for a customer at a kiosk in Ghana"),
 "Bulk Messaging": ("p12-bulk-messaging-retail", "A retail manager sending a promotion from a tablet while a customer receives a notification on a phone"),
 "Egahub": ("p13-egahub-market-merchant", "A merchant walking through a busy market while checking daily sales on a phone"),
}
def hero(name, title, lead, cta, vis, strip, crumb=True):
    if name in HERO_PHOTOS:
        b, alt = HERO_PHOTOS[name]
        vis = f'<div class="photo hero-photo"><img src="/assets/img/{b}_1400.webp" srcset="/assets/img/{b}_800.webp 800w, /assets/img/{b}_1400.webp 1400w" sizes="(max-width:959px) 92vw, 520px" width="1400" height="927" alt="{alt}" decoding="async"></div>' + vis
    ctas = "".join(f'<a class="btn {c}" href="{h}">{t}</a>' for t, h, c in cta)
    crumbs = f'<ol class="crumbs"><li><a href="/business/">Business</a></li><li aria-current="page">{name}</li></ol>' if crumb else ''
    s3 = "".join(f"<li><b>{b}</b><span>{t}</span></li>" for b, t in strip)
    return f'''<main id="main"><section class="hero" aria-labelledby="h1"><div class="wrap hero__in"><div class="hero__copy"><nav aria-label="Breadcrumb">{crumbs}</nav>
<p class="over">{name}</p><h1 class="d-xl" id="h1">{title}</h1><p class="lead">{lead}</p><div class="cta">{ctas}</div></div><div class="hero__vis" aria-hidden="true">{vis}</div></div>
<div class="wrap"><ul class="s3">{s3}</ul></div></section>'''

def sec_head(over, title, lead=""):
    return f'<div class="sec__h rv"><p class="over">{over}</p><h2 class="d-lg">{title}</h2>' + (f'<p class="lead">{lead}</p>' if lead else '') + '</div>'

def split(over, title, lead, bullets, vis, cta=None, flip=False):
    c = f'<a class="link" href="{cta[1]}">{cta[0]}</a>' if cta else ''
    return f'''<div class="split{" split--flip" if flip else ""}"><div class="split__copy rv"><p class="over">{over}</p><h2 class="d-lg">{title}</h2><p class="lead">{lead}</p>{li(bullets,"ticks")}{c}</div>
<div class="split__vis rv" aria-hidden="true"><div style="position:relative;min-height:340px">{vis}</div></div></div>'''

def cards(items, cols=3):
    return f'<ul class="grid grid--{cols}">' + "".join(f'<li class="card rv" style="--i:{i%3}"><span class="ico" aria-hidden="true">{n[0]}</span><h3 class="h4">{n}</h3><p>{t}</p></li>' for i, (n, t) in enumerate(items)) + '</ul>'

def use(items):
    return '<ul class="grid grid--3 use">' + "".join(f'<li class="rv" style="--i:{i%3}"><h3 class="h4">{n}</h3><p>{t}</p></li>' for i, (n, t) in enumerate(items)) + '</ul>'

def steps(items): return '<ol class="steps">' + "".join(f'<li class="rv" style="--i:{i}"><h3 class="h4">{n}</h3><p>{t}</p></li>' for i, (n, t) in enumerate(items)) + '</ol>'

def section(inner, cls=""): return f'<section class="sec {cls}"><div class="wrap">{inner}</div></section>'

def price(name, text, cta_t="Get a quote", href=SALES):
    return section(f'<div class="price rv"><p class="over">Pricing</p><h2 class="d-lg">Simple, clear pricing.</h2><p class="lead">{text}</p><a class="btn btn--red" href="{href}">{cta_t}</a></div>')

def faq(items):
    d = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in items)
    ld = ",".join('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}' % (q.replace('"', '\\"'), a.replace('"', '\\"')) for q, a in items)
    return section(f'<div class="faq"><div class="faq__l rv"><p class="over">FAQ</p><h2 class="d-lg">Good questions.</h2></div><div class="faq__list rv">{d}</div></div>', "sec--ice") + \
           f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{ld}]}}</script>'

PERSONAL = [("money-transfer", "Money transfer"), ("bill-payment", "Bill payments"), ("cards", "Cards"), ("groups", "Groups")]
def final(title, lead, cta, current=None, personal=None):
    ctas = "".join(f'<a class="btn {c}" href="{h}">{t}</a>' for t, h, c in cta)
    if personal: rel = "".join(f'<a href="/{k}/">{n}</a>' for k, n in PERSONAL if k != personal) + '<a href="/business/">Business</a>'
    else: rel = "".join(f'<a href="/business/{s}/">{n}</a>' for s, n, t in SERVICES if s != current) + ('<a href="/business/">All Business services</a>')
    return f'<section class="sec sec--red"><div class="wrap final"><h2 class="d-lg rv">{title}</h2><p class="lead rv">{lead}</p><div class="cta rv">{ctas}</div><div class="related rv" style="--i:2">{rel}</div></div></section></main>'

# ---------- mock helpers ----------
def mk(pos, inner, cls=""): return f'<div class="mk {cls}" style="{pos}">{inner}</div>'
def row(a, b): return f'<div class="row"><span>{a}</span><span>{b}</span></div>'
PILL = '<span class="pill">✓ Paid</span>'; PEND = '<span class="pill p">… Pending</span>'

def phone(pos, inner): return f'<div class="phone float" style="{pos}"><div class="phone__s">{inner}</div></div>'

# ---------- page definitions ----------
def page_bizcollect():
    vis = (mk("left:4%;top:6%;width:250px", '<p class="mk-h">Checkout</p><div class="big">GHS 250.00</div><div class="tabs"><span class="on">Mobile money</span><span>Card</span><span>Bank</span></div><span class="pay">Pay now</span>', "float") +
           mk("right:2%;top:30%;width:230px", '<p class="mk-h">Payment received</p><div class="big">GHS 250.00</div><span class="pill">✓ Kofi M.</span>', "float b") +
           mk("left:12%;bottom:4%;width:210px", '<p class="mk-h">Today</p><div class="big">GHS 48,200</div><div class="bar"><i style="width:72%"></i></div><small>Payment link · *000# USSD</small>', "float c"))
    body = hero("BizCollect", "Get paid in seconds.", "Collect payments from your customers, pay out when you need to, and watch every transaction on one dashboard.",
        [("Open a business account", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "One integration or one link. Every way your customers pay, in one place."), ("Speed", "Customers pay in a few taps and you see it on your dashboard as it happens."), ("Secure", "Licensed, monitored and built to protect every transaction.")])
    body += section(sec_head("Collections", "Four ways to get paid.", "Pick the one that fits. Use them together if you like.") +
        split("API", "Build it into your app.", "One API to request a payment and get notified when it lands. Test in the sandbox, then go live.", ["Request a payment with one call", "Get a callback when it is paid", "Test with sandbox keys first"],
              '<div class="code" style="margin-top:30px">POST /v1/collections\n{\n  "amount": 250.00,\n  "currency": "GHS",\n  "method": "mobile_money",\n  "reference": "ORDER-1042",\n  "callback_url": "https://yourshop.com/hook"\n}\n\n200 OK  {"status": "pending"}</div>', ("Read the docs →", DOCS)) +
        split("Hosted Checkout", "A checkout you don’t have to build.", "Send customers to a secure Eganow page. They pick how to pay, you get the result. No payment code on your side.", ["Mobile money, card and bank in one page", "Mobile friendly, secured by Eganow", "Redirect back with the result"],
              mk("left:12%;top:8%;width:260px", '<p class="mk-h">Pay Kente Shop</p><div class="row"><span>Phone number</span><span>024 000 0000</span></div><span class="pay">Pay GHS 250.00</span><small>Secured by Eganow</small>', "float"), ("Talk to sales →", SALES), True) +
        split("Payment Link", "Share a link. Get paid.", "Create a link in seconds and send it on WhatsApp, SMS or email. No website needed.", ["Set an amount and what it is for", "Share anywhere customers already are", "See when it is paid"],
              mk("left:8%;top:8%;width:270px", '<p class="mk-h">Create payment link</p><div class="row"><span>Amount</span><span>GHS 85.00</span></div><div class="row"><span>For</span><span>Table booking</span></div><span class="pay">Create link</span>', "float"), ("Open a business account →", REGISTER)) +
        split("USSD", "Works on any phone.", "Customers without a smartphone or data can still pay by dialling a code and approving on their phone.", ["Dial *000# and choose Pay a merchant", "Enter merchant code and amount", "Approve with PIN"],
              mk("left:14%;top:6%;width:240px", '<p class="mk-h">Dial *000#</p>' + row("1.", "Pay a merchant") + row("2.", "Enter merchant code") + row("3.", "Enter amount") + row("4.", "Approve with PIN") + '<span class="pill" style="margin-top:8px">✓ Payment confirmed</span>', "float"), None, True))
    body += section(sec_head("How it works", "Four steps to your first payment.") + steps([("Open an account", "Register your business and get verified."), ("Choose how to collect", "Plug in the API, use Hosted Checkout, or share a Payment Link or USSD code."), ("Customers pay", "They choose their method and approve in a few taps."), ("Track and settle", "See every transaction on your dashboard and pay out when you need to.")]), "sec--ice")
    body += section(sec_head("Payouts and dashboard", "Money in. Money out. All in sight.") +
        split("Payouts", "Pay out in a few clicks.", "Send money to suppliers, staff or customers straight from your dashboard.", ["Pay one person or many at once", "Check the total before you send", "Keep a record of every payout"],
              mk("left:6%;top:6%;width:290px", '<p class="mk-h">Bulk payout · 3 recipients</p>' + row("Ama A.", "GHS 1,200.00") + row("Kofi M.", "GHS 800.00") + row("Efua T.", "GHS 450.00") + row("<b>Total</b>", "<b>GHS 2,450.00</b>") + '<span class="pay">Send payouts</span>', "float")) +
        split("Dashboard", "See every transaction.", "Track payments by channel, search any transaction and keep your books tidy.", ["Mobile money, card, bank, link and USSD side by side", "Search by name, amount or reference", "Paid and pending at a glance"],
              mk("left:4%;top:6%;width:310px", '<p class="mk-h">Collected this month</p><div class="big">GHS 48,200</div>' + row("Kofi M. · Mobile money", "250.00 " + PILL) + row("Ama A. · Card", "1,200.00 " + PILL) + row("Yaw B. · Payment Link", "85.00 " + PEND) + row("Efua T. · USSD", "40.00 " + PILL), "float"), None, True))
    body += section(sec_head("Who it’s for", "Made for how Ghana pays.") + use([("Online shops", "Take payments at checkout without building a payment system."), ("Shops and services", "Send a Payment Link to a customer and get paid on the spot."), ("Schools and clubs", "Collect fees and dues, and see who has paid."), ("Events", "Sell tickets and registrations online or through a USSD code."), ("Utilities and subscriptions", "Collect recurring and one-off payments reliably."), ("NGOs and communities", "Receive contributions from anyone, on any phone.")]))
    body += price("BizCollect", "No surprises. Tell us how you collect and we’ll show you exactly what you pay.")
    body += faq([("Which payment methods can my customers use?", "Customers can pay with mobile money, cards and bank transfers. The exact networks and banks available are confirmed when you open your account."), ("Do I need a website to use BizCollect?", "No. You can share a Payment Link or a USSD code without a website. If you do have a website or app, use Hosted Checkout or the API."), ("How long until I get my money?", "You can follow every payment on your dashboard as it happens. Settlement timing depends on your account setup and is confirmed during onboarding."), ("Can I pay out money too?", "Yes. Send payouts to suppliers, staff or customers from your dashboard, one at a time or in bulk."), ("Is there a sandbox to test in?", "Yes. Ask for sandbox access and test with test money before going live.")])
    body += final("Ready to get paid?", "Open an account in minutes, or talk to our team.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "bizcollect")
    return "BizCollect — Get paid in seconds", "Collect from mobile money, cards and bank transfers with Hosted Checkout, Payment Links, USSD or API. Pay out and track everything on one dashboard.", "bizcollect", body

def page_egapos():
    vis = (mk("left:6%;top:4%;width:240px", '<p class="mk-h">EgaPOS</p><div class="big">GHS 85.00</div><span class="pill">✓ Approved</span><div class="bar"><i style="width:100%"></i></div><small>Tap card to pay</small>', "float") +
           '<div class="phone float b" style="right:6%;top:18%;width:200px;height:340px;border-radius:30px"><div class="phone__s" style="border-radius:22px;align-content:center;text-align:center"><b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">TOTAL</b><div class="big">GHS 85.00</div><span class="pill" style="justify-self:center">Tap card to pay</span><div style="height:8px"></div><div class="qa"><span>1</span><span>2</span><span>3</span><span>4</span></div></div></div>' +
           mk("left:14%;bottom:4%;width:230px", '<p class="mk-h">Terminals · 3</p>' + row("Accra Mall · Till 1", '<span class="pill">Online</span>') + row("Tema · Till 1", '<span class="pill off">Offline</span>'), "float c"))
    body = hero("EgaPOS", "Tap. Paid.", "Get an Eganow POS device and take payments at the counter. Manage every terminal from one platform.", [("Open a business account", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "Get a device, switch on and start selling. Manage everything from one platform."), ("Speed", "Customers tap to pay and the sale is done in seconds."), ("Secure", "Licensed and monitored, with every sale on record.")])
    body += section(sec_head("Devices", "The right device for how you sell.", "Eganow issues the device and sets it up for you.") +
        '<ul class="grid grid--3">' + "".join(f'<li class="card rv" style="--i:{i}"><span class="ico" aria-hidden="true">{n[0]}</span><h3 class="h4">{n}</h3><p>{d}</p>{li(b,"ticks")}<a class="link" href="{SALES}">Ask about the {n} →</a></li>' for i, (n, d, b) in enumerate([
            ("Handheld POS", "Walk the shop floor, serve at the table or deliver to the door. Take payments wherever your customer is.", ["Light and easy to hold", "Built-in keypad and screen", "Great for shops, restaurants and deliveries"]),
            ("Countertop POS", "A bigger screen for the busy counter. Stays put, stays ready, and is easy for every cashier to use.", ["Large, clear display", "Made for busy checkouts", "Great for supermarkets and pharmacies"]),
            ("Mini POS", "Compact tap-to-pay for market stalls, kiosks and pop-ups. Small enough for any counter.", ["Pocket-friendly size", "Quick tap-to-pay", "Great for stalls, kiosks and events"])])) + '</ul>')
    body += section(sec_head("Device issuing", "From sign-up to first sale.") + steps([("Apply", "Tell us about your business and how many devices you need."), ("Get verified", "We verify your business so you can start accepting safely."), ("Receive your device", "Eganow issues and sets up your device for you."), ("Start accepting", "Tap, accept, and watch every sale appear on the platform.")]), "sec--ice")
    body += section(split("POS management platform", "Every terminal. One view.", "See which devices are online, what each one sold and how the day is going, without leaving your desk.", ["All your devices and branches in one place", "Sales by terminal, with every transaction listed", "Spot an offline device before it costs you a sale"],
        mk("left:2%;top:4%;width:300px", '<p class="mk-h">Terminals · 3</p>' + row("Accra Mall · Till 1", '<span class="pill">Online</span>') + row("Kumasi Central · Till 2", '<span class="pill">Online</span>') + row("Tema Branch · Till 1", '<span class="pill off">Offline</span>') + '<div class="big" style="margin-top:8px">GHS 3,420.00</div><small>Sales today · 38 transactions</small>', "float") +
        mk("right:0;bottom:2%;width:250px", row("10:42 · Card", "120.00 " + PILL) + row("10:38 · Mobile money", "45.00 " + PILL) + row("10:27 · Mobile money", "60.00 " + PEND), "float b")) +
        '<div style="height:24px"></div>' + cards([("Cards and mobile money at the counter", "Customers pay the way they prefer."), ("Receipts for every sale", "Give customers proof of payment, every time."), ("Every terminal, one platform", "Manage all your devices and branches in one place."), ("Sales by device and branch", "See what each terminal sold, and when."), ("One dashboard for everything", "Keep POS sales alongside your BizCollect payments."), ("Help when you need it", "Our team supports your setup and any device issue.")]))
    body += section(sec_head("Who it’s for", "From market stalls to supermarkets.") + use([("Retail shops", "Speed up the till and keep every sale on record."), ("Restaurants and cafés", "Take payment at the table with a handheld device."), ("Pharmacies and clinics", "A clear, quick checkout for every customer."), ("Market and street traders", "A small device that fits a small stall."), ("Delivery and field sales", "Collect payment at the door and know it went through."), ("Events and pop-ups", "Set up anywhere and sell all day.")]), "sec--ice")
    body += price("EgaPOS", "No surprises. Tell us what devices you need and we’ll show you exactly what you pay.")
    body += faq([("How do I get a POS device?", "Apply for an Eganow business account and tell us what you need. Once you’re verified, Eganow issues and sets up your device."), ("Which payments can I accept?", "You can accept the payment methods Eganow supports on the device. We confirm the full list when you apply."), ("Can I manage more than one terminal?", "Yes. The POS management platform shows every device, branch and sale in one place."), ("What if a device is lost or stops working?", "Contact our support team and we’ll help you get back to selling."), ("Can I use EgaPOS with BizCollect?", "Yes. Many businesses use POS at the counter and BizCollect for online payments, payment links and USSD.")])
    body += final("Ready to tap and get paid?", "Open an account in minutes, or talk to our team.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "egapos")
    return "EgaPOS — Tap. Paid.", "Eganow issues POS devices for cards and mobile money, with one platform to manage every terminal, receipt and settlement.", "egapos", body

def page_cards():
    vis = ('<div class="card3d r float" style="left:6%;top:6%"><span>Virtual · Marketing</span><b>•••• 4821</b></div><div class="card3d d float b" style="right:2%;top:32%"><span>Physical · Team travel</span><b>•••• 7305</b></div><div class="card3d w float c" style="left:16%;bottom:4%"><span>Customer card</span><b>•••• 1096</b></div>' +
           mk("right:4%;top:2%;width:190px", '<p class="mk-h">Monthly limit</p><div class="big">GHS 5,000</div><div class="bar"><i style="width:64%"></i></div>', "float c"))
    body = hero("Card Issuing", "Issue cards. Control spend.", "Mastercard virtual and physical cards for your team’s expenses, or offer cards to your own customers as a re-issuer.", [("Open a business account", REGISTER, "btn--red"), ("Become a re-issuer", SALES, "btn--line")], vis,
        [("Simple", "Create a card in a few clicks, or by API. One dashboard for every card."), ("Speed", "Virtual cards are ready to use as soon as you issue them."), ("Secure", "Set limits, freeze any card and see every transaction.")])
    body += section(sec_head("Two ways to issue", "Cards for your team. Or for your customers.") +
        split("Team expenses", "Issue cards for your organisation.", "Give every team, project or supplier their own card. Keep spending separate and easy to follow.", ["Virtual cards for ads, tools and online suppliers", "Physical cards for people who spend in person", "A limit on every card, and a freeze button", "Every transaction in one dashboard"],
              mk("left:6%;top:4%;width:280px", '<p class="mk-h">Team cards</p>' + row("Member · Ama A.", "•••• 2210") + row("Member · Kofi M.", "•••• 9034") + row("Member · Efua T.", "•••• 1096"), "float"), ("Open a business account →", REGISTER)) +
        split("Re-issuer programme", "Offer cards to your members and customers.", "Run your own card programme on Eganow. Issue Mastercard cards to the people you serve, from the portal or by API.", ["Issue to your members or customers", "Use the portal, or integrate with the API", "Eganow powers the cards behind your programme"],
              '<div class="card3d r float" style="left:10%;top:10%"><span>Your programme</span><b>•••• 1096</b></div><div class="card3d d float b" style="left:34%;top:44%"><span>Your members</span><b>•••• 7742</b></div>', ("Apply as a re-issuer →", SALES), True))
    body += section(sec_head("Virtual and physical", "Pick the card that fits the job.") + '<div class="grid grid--2">' +
        '<div class="card rv"><span class="ico">V</span><h3 class="h4">Virtual cards</h3><p>Issued digitally and ready for online spending. Make as many as you need, one for each purpose.</p>' + li(["Great for ads, subscriptions and online suppliers", "Create one card per campaign, tool or vendor", "Freeze or delete a card without touching the others"], "ticks") + '</div>' +
        '<div class="card rv" style="--i:1"><span class="ico">P</span><h3 class="h4">Physical cards</h3><p>A real card in your team’s hands, for spending in person.</p>' + li(["Great for field teams, travel and daily spend", "Same limits and controls as virtual cards", "Issued to your business or your members"], "ticks") + '</div></div>', "sec--ice")
    body += section(split("Control", "Spend with confidence.", "Know what every card is for, how much it has spent and what it is spending on.", ["Set a spending limit on each card", "Freeze or unfreeze a card in one tap", "See every transaction, by card"],
        mk("left:2%;top:4%;width:300px", '<p class="mk-h">Cards · 3</p>' + row("Marketing · Virtual", "3,200 / 5,000") + row("Team travel · Physical", "860 / 2,000") + row("Supplier: Kente Co. · Virtual", '<span class="pill off">Frozen</span>') + '<span class="pay">Freeze card</span>', "float")) +
        '<div style="height:24px"></div>' + sec_head("Get started", "From sign-up to your first card.") + steps([("Apply", "Tell us about your business and which programme you need: team expenses, re-issuer, or both."), ("Get verified", "We verify your business so you can issue cards safely."), ("Set up your cards", "Choose virtual or physical, name each card and set how much it can spend."), ("Issue and manage", "Hand out cards, follow every transaction and freeze a card whenever you need to.")]))
    body += section(split("For developers", "Issue cards from your own app.", "Create, fund and manage cards with the Eganow API. Perfect for re-issuers who want cards built into their product.", ["Create and manage cards by API", "Test in the sandbox first"],
        '<div class="code" style="margin-top:20px">POST /v1/cards\n{\n  "type": "virtual",\n  "holder": "Ama Mensah",\n  "currency": "GHS",\n  "label": "Marketing",\n  "spend_limit": 5000.00\n}\n\n200 OK  {"status":"active","last4":"4821"}</div><p style="color:#9fb4cc;font-size:13px;margin-top:10px">Illustrative example. Real fields are in your sandbox docs.</p>', ("Read the docs →", DOCS), True), "sec--night")
    body += section(sec_head("Who it’s for", "Cards for every team and every programme.") + use([("Marketing and ads", "One virtual card per campaign or platform, each with its own limit."), ("Travel and field teams", "Physical cards for people on the road, with a spending cap."), ("Suppliers and subscriptions", "Pay tools and vendors without sharing one card number."), ("Staff allowances", "Give every team member a card and see what it is used for."), ("Cooperatives and associations", "Offer members their own cards under your programme."), ("Apps, fintechs and retailers", "Embed cards for your customers with the Eganow API.")]))
    body += price("Card Issuing", "No surprises. Tell us about your programme and we’ll show you exactly what you pay.")
    body += faq([("What cards can my business issue?", "Mastercard virtual cards and Mastercard physical cards, issued from the Eganow portal or by API."), ("What is the difference between the two programmes?", "With team expenses you issue cards for your own organisation. As a re-issuer you offer cards to your members or customers under your own programme."), ("Who can become a re-issuer?", "Businesses and organisations that want to offer cards to their members or customers. Apply and our team will guide you through eligibility and onboarding."), ("Can I set spending limits and freeze cards?", "Yes. You can set how much each card can spend and freeze or unfreeze a card at any time from your dashboard."), ("Can I issue cards by API?", "Yes. Use the Eganow API to create and manage cards from your own app, or use the portal if you prefer not to code.")])
    body += final("Ready to issue your first card?", "Open an account in minutes, or talk to our team.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "card-issuing")
    return "Card Issuing — Issue cards. Control spend.", "Issue Mastercard virtual and physical cards for team expenses, or become a re-issuer and offer cards to your customers, from the portal or by API.", "card-issuing", body

def page_agency():
    vis = (mk("left:6%;top:6%;width:250px", '<p class="mk-h">Cash in</p><div class="row"><span>Wallet or account</span><span>024 000 0000</span></div><div class="row"><span>Amount</span><span>GHS 300.00</span></div><span class="pill">✓ Name matched: Ama A.</span><span class="pay">Confirm cash in</span>', "float") +
           mk("right:2%;top:34%;width:230px", '<p class="mk-h">Cash out</p><div class="row"><span>Customer</span><span>Kofi M.</span></div><div class="row"><span>Request</span><span>GHS 150.00</span></div><span class="pill">✓ Request verified</span>', "float b") +
           mk("left:14%;bottom:2%;width:220px", '<p class="mk-h">Balance</p><div class="big">GHS 12,400</div>', "float c"))
    body = hero("Agency Banking", "Cash in. Cash out. Anywhere.", "Turn your shop into a service point. Let customers deposit and withdraw cash to their mobile wallet or bank account.", [("Become an agent", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "Two services, one app. Take cash in and pay cash out in a few taps."), ("Speed", "Customers are served in moments and get a confirmation straight away."), ("Secure", "Every transaction is recorded, verified and easy to trace.")])
    body += section(sec_head("Two services", "Cash in. Cash out. Done.", "Everything an agent does comes down to these two.") +
        split("Cash in", "Customers deposit cash.", "A customer brings cash and wants it in their mobile wallet or bank account. You take the cash and send the money in seconds.", ["The customer hands you the cash", "You enter their wallet number or account", "You enter the amount and confirm", "The money lands in their wallet or account, and they get a confirmation"],
              mk("left:8%;top:8%;width:260px", '<p class="mk-h">Cash in</p><div class="row"><span>Wallet</span><span>024 000 0000</span></div><div class="row"><span>Amount</span><span>GHS 300.00</span></div><span class="pay">Confirm cash in</span>', "float")) +
        split("Cash out", "Customers withdraw cash.", "A customer wants cash from their wallet or account. You check the request, confirm it and hand over the cash.", ["The customer starts a withdrawal or gives you their details", "You check the request in the app", "You confirm the withdrawal", "You hand over the cash and the customer gets a confirmation"],
              mk("left:8%;top:8%;width:260px", '<p class="mk-h">Withdrawal request</p><div class="row"><span>Customer</span><span>Kofi M.</span></div><div class="row"><span>Amount</span><span>GHS 150.00</span></div><span class="pay">Pay out GHS 150.00</span>', "float"), None, True))
    body += section(sec_head("Why become an agent", "More customers. More income.") + cards([("Bring customers through your door", "People who need cash come to you. Many stay to shop."), ("Earn on every transaction", "Agents earn on the cash in and cash out they process."), ("Serve wallet and bank customers", "One agent point for customers who use a mobile wallet or a bank account."), ("Run it from your phone", "Manage your agent business in the Eganow app or the business portal."), ("See every transaction", "Your balance, your cash in, your cash out, all in one place."), ("Help when you need it", "Our team supports you with setup and day-to-day questions.")]), "sec--ice")
    body += section(sec_head("How to start", "Become an agent in four steps.") + steps([("Apply", "Tell us about your shop or business and where you operate."), ("Get verified", "We verify your business so you can serve customers safely."), ("Get set up", "We set up your agent account and show you how it works."), ("Start serving", "Take cash in, pay cash out, and watch your day add up.")]))
    body += section(split("Your agent dashboard", "Know your balance. Track every transaction.", "See your balance, today’s cash in and cash out, and a record of every customer you served.", ["Your balance and today’s totals at a glance", "A record of every deposit and withdrawal", "Reminders to top up before you run low"],
        mk("left:2%;top:4%;width:320px", '<p class="mk-h">Today</p>' + row("Balance", "<b>GHS 12,400</b>") + row("Cash in", "GHS 3,150") + row("Cash out", "GHS 2,480") + row("10:42 · Ama A.", "300.00 " + PILL) + row("10:20 · Yaw B.", "400.00 " + PEND), "float")), "sec--ice")
    body += section(sec_head("Who it’s for", "Any counter can be an agent point.") + use([("Corner shops", "Add a service that brings people in every day."), ("Pharmacies", "A trusted counter where customers already come."), ("Supermarkets and minimarts", "Let customers get cash while they shop."), ("Market and kiosk operators", "Serve your neighbourhood without a bank branch nearby."), ("Fuel stations", "Cash services for customers on the road."), ("Cooperatives and community points", "Help your members move money close to home.")]))
    body += price("Agency Banking", "Tell us about your shop and we’ll show you how agents earn.", "See how agents earn")
    body += faq([("What is an agent?", "An agent is a shop or business that helps customers put cash into, and take cash out of, their mobile wallet or bank account."), ("What can my customers do at my agent point?", "They can deposit cash into their mobile wallet or bank account (cash in) and withdraw cash from them (cash out)."), ("Which wallets and banks are supported?", "We confirm the full list of supported wallets and banks when you apply."), ("How do agents earn?", "Agents earn on the transactions they process. Talk to our team for the details for your business."), ("Do I need special equipment?", "You manage everything from the Eganow app or business portal. We confirm what you need when you apply.")])
    body += final("Ready to become an agent?", "Apply in minutes, or talk to our team.", [("Become an agent", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "agency-banking")
    return "Agency Banking — Cash in. Cash out. Anywhere.", "Become an Eganow agent: let customers deposit and withdraw cash to their mobile wallet or bank account from your shop.", "agency-banking", body

def page_bulk():
    vis = (mk("left:4%;top:4%;width:260px", '<p class="mk-h">New SMS campaign</p><div class="row"><span>To</span><span>All customers · 1,240</span></div><div class="row"><span>From</span><span>KenteShop</span></div><small>Hi Ama, your order is ready for pickup.</small><div class="bar"><i style="width:49%"></i></div><small>78 / 160 characters</small>', "float") +
           mk("right:2%;top:36%;width:220px", '<p class="mk-h">Delivered</p><div class="big">12,480</div><span class="pill">98% delivered</span>', "float b") +
           mk("left:10%;bottom:2%;width:250px", '<p class="mk-h">Email campaign</p><div class="row"><span>Subject</span><span>Weekend offer</span></div><span class="pay">Send to list</span>', "float c"))
    body = hero("Bulk Messaging", "Reach everyone. Instantly.", "Send bulk SMS and email to your customers from one place, and see exactly what was delivered.", [("Open a business account", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "Write it once and send it to everyone. SMS and email, in one place."), ("Speed", "Reach thousands of customers in one go."), ("Secure", "Your contacts stay yours, and every send is recorded.")])
    body += section(sec_head("Two channels", "SMS and email. One place.", "Pick the channel that fits the message. Use both for the best reach.") +
        split("Bulk SMS", "Reach any phone.", "SMS lands on every phone, smartphone or not, and gets read fast. Perfect for order updates, reminders and offers.", ["Send to a list of contacts in one go", "Show your business name as the sender", "Keep an eye on the length as you type"],
              mk("left:6%;top:6%;width:280px", '<p class="mk-h">New SMS campaign</p><div class="row"><span>To</span><span>All customers · 1,240</span></div><div class="row"><span>From</span><span>KenteShop</span></div><small>Hi Ama, your order is ready for pickup. Thank you for shopping with us!</small><small>78 / 160 characters</small><span class="pay">Send now</span>', "float")) +
        split("Bulk email", "Say more with email.", "Send newsletters, receipts and announcements to everyone on your list, with room for your brand, links and images.", ["Send to a list of subscribers in one go", "Add a subject, your message and a button", "Send yourself a test first"],
              mk("left:6%;top:6%;width:280px", '<p class="mk-h">New email campaign</p><div class="row"><span>Subscribers</span><span>3,820</span></div><div class="row"><span>Subject</span><span>Our weekend offer is here</span></div><span class="pay">Send to list</span>', "float"), None, True))
    body += section(sec_head("How it works", "From list to delivered in four steps.") + steps([("Add your contacts", "Upload your list or add contacts one by one."), ("Write your message", "Write an SMS or email. Preview it before it goes out."), ("Choose when to send", "Send right away, or schedule it for later."), ("Track delivery", "See how many messages were sent and delivered.")]), "sec--ice")
    body += section(split("Delivery reports", "Know it landed.", "See how many messages were sent, how many arrived and which ones didn’t. Learn from every campaign.", ["Sent, delivered and not delivered, at a glance", "A report for every campaign", "SMS and email side by side"],
        mk("left:2%;top:4%;width:330px", '<p class="mk-h">Campaign report · Weekend offer</p>' + row("Sent", "12,230 · 98%") + row("Not delivered", "250 · 2%") + row("Weekend offer · SMS", "12,480 " + PILL) + row("June newsletter · Email", "3,820 " + PILL) + row("Fee reminder · SMS", '<span class="pill p">Scheduled</span>'), "float")) +
        '<div style="height:24px"></div>' + sec_head("What you get", "Everything you need to reach people.") + cards([("SMS and email together", "Run both channels from one place, with one login."), ("Reusable contact lists", "Organise customers into lists and message them again and again."), ("Personal touches", "Add each person’s name so every message feels written for them."), ("Schedule for later", "Write now, send at the right moment."), ("Delivery reports", "See what was sent, what arrived and what didn’t."), ("Send from the portal or by API", "Click to send, or trigger messages from your own app.")]))
    body += section(sec_head("Use it for", "Messages that move your business.") + use([("Order and payment updates", "Tell customers their order is ready or their payment arrived."), ("Offers and promotions", "Announce a sale and bring customers back."), ("Reminders", "Remind people about appointments, fees and due dates."), ("Announcements", "Keep members, parents or staff in the loop."), ("Event invitations", "Invite your audience and share the details."), ("Thank-yous and feedback", "Say thanks after a purchase and ask how it went.")]), "sec--ice")
    body += section(sec_head("Responsible messaging", "Message the right way.") + cards([("Message people who agreed", "Only send to people who have said they are happy to hear from you."), ("Make it easy to opt out", "Include a clear way to stop messages, and respect it every time."), ("Use your real business name", "Customers should always know who a message is from.")]))
    body += price("Bulk Messaging", "No surprises. Tell us what you send and how often, and we’ll show you exactly what you pay.")
    body += faq([("What can I send?", "Bulk SMS and bulk email to your own contact lists."), ("Can I see whether messages were delivered?", "Yes. Every campaign has a delivery report showing sent, delivered and not delivered."), ("Can I show my business name as the sender?", "Yes. SMS can show your business name as the sender, subject to approval."), ("Can I schedule messages?", "Yes. Send right away or schedule for later."), ("Can I send from my own app?", "Yes. Send from the portal, or trigger messages by API.")])
    body += final("Ready to reach your customers?", "Open an account in minutes, or talk to our team.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "bulk-messaging")
    return "Bulk Messaging — Reach everyone. Instantly.", "Send bulk SMS and email to your customers from one place, schedule campaigns and see delivery reports.", "bulk-messaging", body

def page_egahub():
    vis = (phone("left:12%;top:2%", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">TODAY’S SALES</b><div class="big">GHS 8,420</div><div class="qa"><span>Collect</span><span>Payout</span><span>Cards</span><span>SMS</span></div>' + row("New sale", "120.00 " + PILL) + row("Kofi M.", "250.00 " + PILL) + row("Ama A.", "85.00 " + PILL)) +
           mk("right:0;top:34%;width:200px", '<p class="mk-h">Payment received</p><div class="big">GHS 120.00</div><span class="pill">✓ New sale</span>', "float b") +
           mk("right:8%;bottom:4%;width:180px", '<p class="mk-h">Terminals</p>' + row("Accra · Till 1", '<span class="pill">On</span>'), "float c"))
    body = hero("Egahub", "Your business, in your pocket.", "The Eganow Business app. Collect, pay out and manage everything from your phone.", [("Get the app", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "The whole portal, shaped for your phone. Everything is a tap away."), ("Speed", "Check a payment, send a payout or message a customer in moments."), ("Secure", "Your business account, protected on your phone.")])
    mods = [("Get paid anywhere.", "Request a payment, share a Payment Link and see what came in, all from your phone.", ["Create and share a Payment Link", "See payments as they arrive", "Follow every transaction"], ("Learn about BizCollect →", "/business/bizcollect/"), '<p class="mk-h">Payment received · Kofi M.</p><div class="big">GHS 250.00</div><div class="tabs"><span class="on">Mobile money</span><span>Card</span><span>Bank</span></div><span class="pay">Share payment link</span>'),
            ("Pay out in a few taps.", "Send money to suppliers, staff or customers without going back to your desk.", ["Pay one person or many at once", "Check the total before you send", "Keep a record of every payout"], ("Learn about payouts →", "/business/bizcollect/"), '<p class="mk-h">Payout</p>' + row("Ama A.", "1,200.00") + row("Kofi M.", "800.00") + row("<b>Total</b>", "<b>GHS 2,450.00</b>") + '<span class="pay">Send payouts</span>'),
            ("Watch every terminal.", "See which EgaPOS devices are online and what each one has sold today.", ["Every device and branch in one list", "Sales by terminal, live", "Spot an offline device quickly"], ("Learn about EgaPOS →", "/business/egapos/"), '<p class="mk-h">Terminals</p>' + row("Accra Mall · Till 1", '<span class="pill">Online</span>') + row("Kumasi · Till 2", "GHS 1,780") + row("Tema · Till 1", '<span class="pill off">Offline</span>')),
            ("Control your cards.", "Issue, freeze and manage your Mastercard cards from wherever you are.", ["Freeze or unfreeze in one tap", "Check limits and spending", "Issue virtual cards on the go"], ("Learn about Card Issuing →", "/business/card-issuing/"), '<p class="mk-h">Virtual · Marketing</p><div class="big">•••• 4821</div><div class="bar"><i style="width:64%"></i></div><small>Monthly limit GHS 5,000</small><span class="pay">Freeze card</span>'),
            ("Serve customers as an agent.", "Take cash in and pay cash out right from your phone.", ["Cash in to a wallet or account", "Cash out with a quick confirmation", "See your day’s totals"], ("Learn about Agency Banking →", "/business/agency-banking/"), '<p class="mk-h">Cash in</p>' + row("Wallet", "024 000 0000") + row("Amount", "GHS 300.00") + '<span class="pay">Confirm cash in</span>'),
            ("Message your customers.", "Send bulk SMS and email without opening your laptop.", ["Write once, send to a whole list", "Pick SMS, email or both", "Check delivery afterwards"], ("Learn about Bulk Messaging →", "/business/bulk-messaging/"), '<p class="mk-h">New message</p>' + row("To", "All customers · 1,240") + '<small>Hi Ama, your order is ready for pickup.</small><span class="pay">Send to 1,240</span>')]
    inner = sec_head("Inside the app", "The whole portal. In your hand.", "Everything you do on the Eganow portal, shaped for your phone.")
    for i, (t, d, b, c, m) in enumerate(mods):
        inner += split(["Collect", "Payouts", "POS", "Cards", "Agency", "Messages"][i], t, d, b, mk("left:10%;top:6%;width:270px", m, "float"), c, i % 2 == 1)
    body += section(inner)
    body += section(split("Portal and app", "One account. Every screen.", "Start on your laptop and carry on from your phone. Your balance, payments and settings are the same everywhere.", ["Use the portal at your desk", "Use Egahub when you’re out and about", "See the same information on both"],
        mk("left:2%;top:6%;width:300px", '<p class="mk-h">Collected this month</p><div class="big">GHS 48,200</div><small>Same figure on portal and app</small>', "float") + phone("right:6%;top:40px;transform:scale(.8);transform-origin:top right", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">COLLECTED THIS MONTH</b><div class="big">GHS 48,200</div>')), "sec--ice")
    body += section(sec_head("Why Egahub", "Run your business from anywhere.") + cards([("One account", "Sign in to Egahub with the same business account you use on the portal."), ("Know when you’re paid", "Get notified the moment a payment arrives."), ("Quick, safe sign-in", "Open the app with a PIN or your fingerprint."), ("Built for the shop floor", "Big buttons and simple screens for busy days."), ("Every service in one place", "Collect, pay out, cards, cash services and messages."), ("Help when you need it", "Our team is a message away.")]))
    body += faq([("Which phones does Egahub run on?", "Egahub is available for Android. Other platforms are confirmed on request."), ("Do I need a separate account?", "No. Use the same business account you use on the Eganow portal."), ("Can I do everything the portal does?", "The app covers collecting, payouts, POS, cards, agency banking and messaging. Some account setup tasks stay on the portal."), ("How do I get the app?", "Open a business account, then download Egahub and sign in.")])
    body += final("Take your business with you.", "Open an account in minutes, then sign in on Egahub.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")], "egahub")
    return "Egahub — Your business, in your pocket.", "The Eganow Business app: collect, pay out, manage terminals and cards, serve customers as an agent and send messages from your phone.", "egahub", body

def page_dev():
    vis = mk("left:4%;top:8%;width:380px", '<p class="mk-h">Illustrative example</p><div class="code" style="margin:8px 0;font-size:12.5px">POST /v1/collections\n{\n  "amount": 250.00,\n  "currency": "GHS",\n  "method": "mobile_money"\n}</div><span class="pill">✓ Payment received</span>', "float")
    body = hero("Developers", "Integrate in an afternoon.", "One API for collections, payouts and cards. Test in the sandbox, then go live when you are ready.", [("Get sandbox access", SANDBOX, "btn--red"), ("Read the docs", DOCS, "btn--line")], vis,
        [("Simple", "One API for collections, payouts and cards."), ("Speed", "Test in the sandbox, then go live when you are ready."), ("Secure", "Keep your keys private and confirm every payment before you deliver.")])
    body += section(sec_head("What you can build", "Put Eganow inside your product.") + cards([("Collections", "Request a payment from mobile money, cards or bank transfer, and get told when it lands."), ("Payouts", "Send money out to wallets and bank accounts from your own system."), ("Card issuing", "Create and manage Mastercard virtual cards for your team or your customers."), ("Messaging", "Trigger SMS and email from your app, with delivery status you can check."), ("Status checks", "Look up any payment by its reference to see where it stands."), ("Reports", "Pull your transactions and settlements into your own books.")]))
    body += section(f'''<div class="split"><div class="split__copy rv"><p class="over">How it works</p><h2 class="d-lg">Ask. Get told. Deliver.</h2><p class="lead">Your system asks Eganow to collect a payment. When the customer pays, Eganow tells your system, and you deliver the order.</p>{li(["Your server sends a request", "The customer approves on their phone", "Eganow sends your server a confirmation"],"ticks")}</div>
<div class="rv" style="display:grid;gap:14px;min-width:0"><div class="code" id="req" tabindex="0" role="group" aria-label="Request example">POST /v1/collections\n{{\n  "amount": 250.00,\n  "currency": "GHS",\n  "method": "mobile_money",\n  "reference": "ORDER-1042",\n  "callback_url": "https://yourshop.com/hook"\n}}</div><div class="code" id="cb" tabindex="0" role="group" aria-label="Callback example">POST https://yourshop.com/hook\n{{\n  "reference": "ORDER-1042",\n  "status": "paid",\n  "amount": 250.00\n}}</div><p style="color:#9fb4cc;font-size:13px">These samples only show the shape of an integration. Real endpoints, fields, keys and security checks are in your sandbox documentation.</p></div></div>''', "sec--night")
    body += section(sec_head("Getting started", "From idea to live in four steps.") + steps([("Ask for sandbox access", "Tell us what you are building and we set you up."), ("Get your test keys", "Use them to try everything with test money. Nothing real moves."), ("Build and test", "Connect your app, make test payments and check your callbacks."), ("Go live", "When you are happy, our team switches you to live.")]), "sec--ice")
    body += section(sec_head("Good habits", "Build it safely.") + use([("Keep your keys private", "Never put a secret key in a mobile app or in your website’s public code. Keep it on your server."), ("Wait for confirmation", "Treat a payment as paid only when Eganow tells you it is. Do not rely on the customer’s screen."), ("Check before you deliver", "Match the amount and reference to the order before you hand over goods or service."), ("Expect the odd retry", "Networks fail. Make your system safe to receive the same message twice."), ("Test the unhappy paths", "Try a declined payment, a customer who never approves and a slow network before you go live."), ("Keep a record", "Log each request and reference you send, so you can trace any payment in minutes.")]))
    body += faq([("Is there a sandbox?", "Yes. Ask for sandbox access and our team sets you up so you can test with test money before going live."), ("Where is the documentation?", f"The API documentation is at {DOCS} and is shared with your sandbox access."), ("Which languages can I use?", "It is a standard web API, so you can call it from any language that can make secure web requests."), ("Do I need a business account first?", "Not to start testing. You need an approved business account to go live."), ("Who do I talk to if I get stuck?", "Use the contact form and choose the sandbox topic. Our team will help.")])
    body += final("Ready to build?", "Tell us what you are making and we will set up your sandbox.", [("Get sandbox access", SANDBOX, "btn--white"), ("Talk to sales", SALES, "btn--line")])
    return "Developers — Integrate in an afternoon", "Collections, payouts, cards and messaging through one Eganow API. Ask for sandbox access and test before you go live.", "developers", body

def page_hub():
    S = {
        "bizcollect": ('<p class="mk-h">Checkout</p><div class="big">GHS 250.00</div><div class="tabs"><span class="on">Mobile money</span><span>Card</span><span>Bank</span></div><span class="pay">Pay now</span>'),
        "egapos": ('<p class="mk-h">EgaPOS</p><div class="big">GHS 85.00</div><span class="pill">✓ Approved</span><small>Tap card to pay</small>'),
        "card-issuing": None, "agency-banking": ('<p class="mk-h">Cash in</p>' + row("Wallet", "024 000 0000") + row("Amount", "GHS 300.00") + '<span class="pay">Confirm</span>'),
        "bulk-messaging": ('<p class="mk-h">Delivered</p><div class="big">12,480</div><span class="pill">98%</span><small>Hi Ama, your order is ready for pickup.</small>'), "egahub": None}
    def stage(slug):
        if slug == "card-issuing": return '<div style="position:relative;width:300px;height:300px"><div class="card3d r float" style="left:0;top:20px"><span>Virtual · Marketing</span><b>•••• 4821</b></div><div class="card3d d float b" style="left:50px;top:150px"><span>Team travel</span><b>•••• 7305</b></div></div>'
        if slug == "egahub": return phone("position:relative;transform:scale(.85)", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">TODAY’S SALES</b><div class="big">GHS 8,420</div><div class="qa"><span>Collect</span><span>Payout</span><span>Cards</span><span>SMS</span></div>' + row("New sale", "120.00 " + PILL))
        return f'<div class="mk float" style="position:relative;width:290px">{S[slug]}</div>'
    desc = {"bizcollect": "Collect from mobile money, cards and bank transfers. Pay out just as fast, and watch every transaction on one dashboard.", "egapos": "Get POS devices from Eganow and manage every terminal, receipt and settlement from one platform.", "card-issuing": "Mastercard virtual and physical cards for your team’s expenses, or become a re-issuer and offer cards to your own customers.", "agency-banking": "Turn your shop into a service point. Let customers deposit and withdraw cash to their mobile wallet or bank account.", "bulk-messaging": "Send bulk SMS and email to your customers, with delivery reports so you know it landed.", "egahub": "Everything above, in one mobile app. Collect, pay out, issue cards and message customers from anywhere."}
    names = {s: n for s, n, t in SERVICES}; tags = {s: t for s, n, t in SERVICES}
    vis = (mk("left:2%;top:4%;width:240px", '<p class="mk-h">Checkout</p><div class="big">GHS 250.00</div><span class="pill">✓ Payment received</span>', "float") +
           '<div class="card3d r float b" style="right:2%;top:8%"><span>Virtual · Marketing</span><b>•••• 4821</b></div>' +
           mk("left:12%;top:46%;width:240px", '<p class="mk-h">EgaPOS</p><div class="big">GHS 85.00</div><span class="pill">✓ Approved</span>', "float c") +
           mk("right:4%;bottom:2%;width:200px", '<p class="mk-h">Today</p><div class="big">GHS 48,200</div>', "float b"))
    body = hero("Eganow Business", "Business, made simple.", "Collect. Pay out. Issue cards. Accept at the counter. One platform for every way you get paid.", [("Open a business account", REGISTER, "btn--red"), ("Talk to sales", SALES, "btn--line")], vis,
        [("Simple", "One platform. One dashboard. One integration."), ("Speed", "Collect and pay out in seconds, not days."), ("Secure", "Licensed, monitored and built to protect every transaction.")], crumb=False)
    # pinned story
    steps_html = "".join(f'<div class="story__step"><p class="over">0{i+1} · {names[s]}</p><h2 class="d-lg">{tags[s]}</h2><p class="lead">{desc[s]}</p><a class="btn btn--red" href="/business/{s}/" style="justify-self:start">Explore {names[s]}</a></div>' for i, (s, n, t) in enumerate(SERVICES))
    panels = "".join(f'<div class="story__panel" aria-hidden="true">{stage(s)}</div>' for s, n, t in SERVICES)
    body += f'<section class="sec story" aria-label="Business services"><div class="wrap"><div class="story__in"><div class="story__stage">{panels}</div><div class="story__steps">{steps_html}</div></div></div></section>'
    # tiles (also the no-JS/quick-scan overview)
    tiles = "".join(f'<li><a class="card tile rv" style="--i:{i%3}" href="/business/{s}/"><span class="num">0{i+1}</span><h3 class="h4">{names[s]}</h3><p>{tags[s]}</p><span class="chips"><span>{chip}</span></span><span class="arrow">Explore {names[s]} →</span></a></li>' for i, ((s, n, t), chip) in enumerate(zip(SERVICES, ["Hosted Checkout · Link · USSD", "Handheld · Countertop · Mini", "Team expenses · Re-issuer", "Cash in · Cash out", "SMS · Email · Reports", "Android app"])))
    body += section(sec_head("All services", "Six ways to run your business on Eganow.") + f'<ul class="grid grid--3">{tiles}</ul>', "sec--ice")
    body += section(split("For developers", "Integrate in an afternoon.", "One API for collections, payouts and cards. Test in the sandbox, go live when you are ready.", ["One integration for every channel", "Sandbox keys to test with test money", "Callbacks when a payment lands"],
        '<div class="code" style="margin-top:30px">POST /v1/collections\n{\n  "amount": 250.00,\n  "currency": "GHS",\n  "method": "mobile_money",\n  "callback_url": "https://yourshop.com/hook"\n}</div>', ("Read the docs →", "/business/developers/")), "sec--night")
    body += section(sec_head("Why businesses trust Eganow", "Licensed. Certified. Reliable.") + cards([("Licensed by the Bank of Ghana", "Enhanced Payment Service Provider under the Payment Systems and Services Act, 2019 (Act 987)."), ("Mastercard card issuing", "Virtual and physical cards for your team and your customers."), ("Secure by design", "Encrypted, monitored and audited. Every transaction on record."), ("Responsive support", "Dedicated account managers, from technical to relationship."), ("Built to scale", "Systems designed for 99.95% uptime as your business grows."), ("One API", "Offline and online payments, one integration.")]))
    body += faq([("What is Eganow Business?", "A payments and digital financial services platform for businesses: accept payments, make payouts, issue cards, run POS devices, serve customers as an agent and message them in bulk."), ("How do I start?", "Open a business account on the Eganow portal and get verified. Our team helps you with the services you need."), ("Can I use more than one service?", "Yes. Most businesses combine them, such as EgaPOS at the counter and BizCollect for online payments and payment links."), ("Is there an app?", "Yes. Egahub is the Eganow Business app for your phone."), ("Can developers integrate?", "Yes. Ask for sandbox access and test before you go live.")])
    body += final("Ready when you are.", "Open an account in minutes, or talk to our team.", [("Open a business account", REGISTER, "btn--white"), ("Talk to sales", SALES, "btn--line")])
    return "Business, made simple", "Collect, pay out, issue cards and accept at the counter. Eganow Business is one platform for every way you get paid.", "", body

def photo(base, alt, sizes="(max-width:899px) 92vw, 540px"):
    return f'<div class="photo"><img src="/assets/img/{base}_1400.webp" srcset="/assets/img/{base}_800.webp 800w, /assets/img/{base}_1400.webp 1400w" sizes="{sizes}" width="1400" height="927" alt="{alt}" loading="lazy" decoding="async"></div>'
PHOTO_UK = photo("p02-uk-to-ghana-video-call", "A man in a London living room video-calling his family in Ghana on his phone")

def page_home():
    qa = '<div class="qa"><span>Send</span><span>Pay</span><span>Save</span><span>Cards</span></div>'
    vis = ('<div class="hhero__scene" data-lottie="/assets/lottie/hero-scene.json"><img class="hhero__model" src="/assets/img/hero-scene-poster.webp" width="1184" height="1145" alt="A smiling woman taking a selfie with her red phone in front of the Accra skyline, with the words Welcome Home" fetchpriority="high" decoding="async"></div>'+
           mk("left:-4%;top:110px;width:232px", '<p class="mk-h">Money sent</p><div class="big" style="font-size:19px">£200 → GH₵3,227.56</div><span class="pill">✓ Arrived in minutes</span>', "float") +
           mk("right:-6%;top:330px;width:210px", '<p class="mk-h">Bill paid</p><div class="big">GHS 150.00</div><span class="pill">✓ Electricity</span>', "float b"))
    body = f'''<main id="main"><section class="hhero hhero--bg" aria-labelledby="h1"><div class="wrap hhero__in"><div class="hhero__copy"><p class="over">Personal</p><h1 class="d-xl" id="h1" style="max-width:none;font-size:clamp(34px,3.9vw,56px)"><span style="display:block">Send. Pay. Spend.</span><span style="display:block">All in one app.</span></h1>
<p class="lead">Send money home, pay bills and spend worldwide.</p><div class="cta"><a class="btn btn--red" href="https://eganow.com/money-transfer">Get the app</a><a class="btn btn--line" href="#how-it-works">See how it works</a></div>
<p class="pts"><span>Simple to use</span><span>Quick to arrive</span><span>Safe to trust</span></p></div><div class="hhero__vis" aria-hidden="true">{vis}</div></div></section>'''
    # partners strip
    body += section('<div class="rv" style="display:grid;gap:14px"><p class="over">Link every account</p><h2 class="d-lg" style="max-width:20ch">Personal financial services for everyone.</h2><p class="lead">Link multiple cards and mobile money accounts and access a wide range of financial services on eganow.</p><div class="partners"><span>MTN</span><span>Telecel</span><span>AirtelTigo</span><span>Mastercard</span><span>Visa</span><span>Bank accounts</span></div></div>')
    # pinned phone story
    stories = [("Send", "Send money home. Watch it arrive.", "See the rate and fee first, then send to mobile money or a bank. Track it all the way.", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">SEND MONEY</b><div class="big">£200.00</div>' + row("They receive", "GH₵3,227.56") + row("Rate", "1 GBP = 16.30") + row("Arrives", "Within minutes") + '<span class="pay">Send money</span>', "https://eganow.com/money-transfer"),
               ("Pay", "Bills paid. Brain free.", "Airtime, electricity, water, subscriptions and school fees. Schedule once, pay from any linked account.", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">PAY BILLS</b>' + row("Airtime & data", "›") + row("Electricity", "›") + row("Water", "›") + row("Media subscriptions", "›") + '<div class="tabs"><span class="on">Schedule payment</span></div>', "https://eganow.com/bill-payment"),
               ("Groups", "Collect together, in the open.", "Contributions for funerals, weddings, Susu and causes, with every payment logged and visible to the group.", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">WEDDING FUND</b><div class="big">GHS 6,400</div><div class="bar"><i style="width:64%"></i></div><small>64% of GHS 10,000 goal</small>' + row("Ama", '<span class="pill">✓ Paid</span>') + row("Kofi", '<span class="pill">✓ Paid</span>') + row("Yaw", '<span class="pill p">Due</span>'), "https://eganow.com/groups"),
               ("Cards", "Your MoMo, now worldwide.", "Top up a Mastercard from your wallet and shop online, in store and abroad.", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">YOUR CARD</b><div class="card3d r" style="position:relative;width:100%;height:120px"><span>Eganow Mastercard</span><b>•••• 4821</b></div>' + row("Top up from MTN MoMo", "GHS 300") + '<span class="pay">Top up</span>', "https://eganow.com/cards")]
    steps_html = "".join(f'<div class="story__step"><p class="over">0{i+1} · {n}</p><h2 class="d-lg">{t}</h2><p class="lead">{d}</p><a class="btn btn--red" href="{h}" style="justify-self:start">Explore {n}</a></div>' for i, (n, t, d, m, h) in enumerate(stories))
    panels = "".join(f'<div class="story__panel" aria-hidden="true"><div class="phone" style="position:relative;transform:scale(.92)"><div class="phone__s">{m}</div></div></div>' for n, t, d, m, h in stories)
    body += f'<section class="sec story" id="how-it-works" aria-label="What you can do with Eganow"><div class="wrap"><div class="story__in"><div class="story__stage">{panels}</div><div class="story__steps">{steps_html}</div></div></div></section>'
    # bento
    body += section(sec_head("Everything money", "One app. Four things off your to-do list.") + f'''<div class="bento">
<a class="bt bt--red b1 rv" href="https://eganow.com/money-transfer"><p class="over" style="color:#fff">Money transfer</p><h3 class="d-lg">Home is one tap away.</h3><p>From the UK, US and Canada to Ghana, with the fee shown first.</p><span class="arrow">Send money →</span><div class="bt__vis">{mk("right:12px;bottom:12px;width:230px", '<p class="mk-h" style="color:var(--eg-slate)">You send</p><div class="big" style="color:var(--eg-ink)">£200.00</div><span class="pill">GH₵3,227.56 · minutes</span>', "float")}</div></a>
<a class="bt b2 rv" style="--i:1" href="https://eganow.com/bill-payment"><p class="over">Bill payments</p><h3 class="h4" style="font-size:26px">Never miss a due date.</h3><p>Schedule once. We pay it on time, every time.</p><span class="arrow" style="color:var(--eg-red)">Pay bills →</span></a>
<a class="bt bt--blue b3 rv" href="https://eganow.com/cards"><p class="over">Cards</p><h3 class="h4" style="font-size:26px">Mobile money, now global.</h3><p>Top up from your wallet. Spend anywhere Mastercard works.</p><span class="arrow" style="color:var(--eg-red)">Get a card →</span><div class="bt__vis"><div class="card3d d float" style="right:10px;bottom:10px"><span>Eganow card</span><b>•••• 7305</b></div></div></a>
<a class="bt b4 rv" style="--i:1" href="https://eganow.com/groups"><p class="over">Groups</p><h3 class="h4" style="font-size:26px">Chip in. See who did.</h3><p>Events, Susu, church and fundraising with a live record.</p><span class="arrow" style="color:var(--eg-red)">Start a group →</span></a>
<a class="bt bt--night b5 rv" href="/business/"><p class="over" style="color:#fff">Business</p><h3 class="d-lg">Run your business on Eganow.</h3><p>Accept payments, pay out, issue cards, take payments at the counter and message customers, all from one platform.</p>
<div class="stats"><div class="stat"><b>99.95%</b><span>uptime</span></div><div class="stat"><b>1</b><span>API for every channel</span></div><div class="stat"><b>100+</b><span>features shipped each year</span></div></div><span class="arrow">Explore Business →</span></a></div>''')
    # diaspora band
    body += section(split("Send money home", "Closer to the people who matter.", "Expats and migrant workers use Eganow to send money to loved ones in Africa, supporting education, healthcare and business growth, without hidden charges.", ["Competitive transfer fees, shown before you send", "Mobile money and bank payouts", "Corridors from the UK, US and Canada"],
        PHOTO_UK + mk("right:-2%;bottom:6%;width:260px", '<p class="mk-h">Money sent</p><div class="big" style="font-size:20px">£200 → GH₵3,227.56</div><span class="pill">✓ Arrived in minutes</span>', "float b"), ("See rates and send →", "https://eganow.com/money-transfer"), True), "sec--ice")
    body += section(sec_head("Why Eganow", "Built to be trusted.") + cards([("Licensed by the Bank of Ghana", "Licensed by the Bank of Ghana as an Enhanced Payment Service Provider under the Payment Systems and Services Act, 2019 (Act 987)."), ("No surprises", "Fees and rates are shown before you confirm. No hidden charges."), ("Protected end to end", "Encrypted, monitored and built to protect every transaction."), ("Your accounts, together", "Link mobile money and bank accounts and use them from one app."), ("Across town or across the ocean", "Local transfers and cross-border remittance on one platform."), ("Real help, fast", "Help when you need it, in the app or by contact.")]))
    body += faq([("What is Eganow?", "Eganow (TekSol Eganow Ltd) is a financial technology company, not a bank, licensed by the Bank of Ghana as an Enhanced Payment Service Provider. The app lets you link bank and mobile money accounts to send money, pay bills, use cards and contribute to groups."), ("How do I start using Eganow?", "Download the app, register an account and link your mobile money or bank account."), ("What bills can I pay with Eganow?", "Airtime and data, electricity and water, media subscriptions, orders and bookings, and investments, insurance, pension, taxes and other fees."), ("How can Eganow help me run my business?", "Eganow Business lets you accept payments, make payouts, issue cards, run POS devices, serve customers as an agent and send bulk messages, from one platform."), ("What is Eganow Groups?", "A transparent and secure way to make group contributions and donations: private groups for family and friends, and public groups for fundraising.")])
    body += final("Get the app. Do more with your money.", "Send money, pay bills and spend worldwide with eganow.", [("Get the app", "https://eganow.com/money-transfer", "btn--white"), ("Explore Business", "/business/", "btn--line")])
    return "Send. Pay. Spend. All in one app.", "Send money home, pay bills, top up a Mastercard and collect group contributions from your mobile money and bank accounts, all in the Eganow app.", "", body

CORR = {
 "money-transfer": dict(cur="", flag="", name="abroad", sym="", intro="Send money from wherever you are to family and friends in Ghana and across Africa, with transparent fees and fast delivery."),
 "uk": dict(cur="GBP", name="the United Kingdom", demo="£200", get="GH₵3,227.56", photo=("p02-uk-to-ghana-video-call", "A man in a London living room video-calling his family in Ghana on his phone"), intro="Send money from the UK to loved ones in Ghana. Pay by card or bank, and they receive it in their mobile money wallet or bank account."),
 "us": dict(cur="USD", name="the United States", demo="$200", get="GH₵2,449.12", photo=("p02b-us-to-ghana-video-call", "A man in a sunny Houston living room video-calling his family in Ghana on his phone"), intro="Send money from the US to loved ones in Ghana. Pay in dollars and they receive cedis, with the rate and fee shown first."),
 "canada": dict(cur="CAD", name="Canada", demo="C$200", get="GH₵1,792.79", photo=("p02c-canada-to-ghana-video-call", "A woman in a Toronto kitchen video-calling her family in Ghana on her phone"), intro="Send money from Canada to loved ones in Ghana. Pay in Canadian dollars and they receive cedis, with no hidden charges."),
}

def page_transfer(key):
    c = CORR[key]; cur = c["cur"]; name = c["name"]
    chips = "".join(f'<a href="/{k}/" class="chipx{" on" if k==key else ""}">{lbl}</a>' for k, lbl in [("uk", "United Kingdom"), ("us", "United States"), ("canada", "Canada")])
    calc = """<section class="calc" id="mt-calculator" role="region" aria-labelledby="mt-calc-title">
  <div class="calc__head"><h2 class="calc__title" id="mt-calc-title">Currency exchange calculator</h2><span class="badge" data-sample hidden>Sample rates</span></div>
  <div class="field"><div class="field__main"><label for="mt-send">You send</label><input id="mt-send" data-send-amount inputmode="decimal" autocomplete="off"></div><select data-send-currency aria-label="Currency you send"></select></div>
  <div class="swap-row"><button type="button" class="swap" data-swap aria-label="Swap currencies"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v14M3 14l4 4 4-4M17 20V6M13 10l4-4 4 4"/></svg></button></div>
  <div class="field"><div class="field__main"><label for="mt-recv">They receive</label><input id="mt-recv" data-receive-amount inputmode="decimal" autocomplete="off"></div><select data-receive-currency aria-label="Currency they receive"></select></div>
  <dl class="details"><div><dt>Rate</dt><dd data-rate>—</dd></div><div><dt>Fee</dt><dd data-fee>—</dd></div><div><dt>Arrives</dt><dd data-eta>—</dd></div></dl>
  <p class="expiry" data-expiry></p><p class="methods-label" id="mt-ml">Payout method</p><div class="methods" role="radiogroup" aria-labelledby="mt-ml" data-methods></div>
  <div class="error" data-error role="alert" hidden><span data-error-text></span><button type="button" class="retry" data-retry>Retry</button></div>
  <a class="calc-cta" data-cta href="https://eganow.com/download">Send money</a>
  <p class="legal">Indicative rate; the final rate and fee are shown before you confirm. Eganow is a fintech, not a bank, licensed by the Bank of Ghana.</p><p class="sr" data-live aria-live="polite"></p></section>"""
    body = f"""<link rel="stylesheet" href="/assets/calc.css"><main id="main"><section class="hhero" aria-labelledby="h1"><div class="wrap hhero__in"><div class="hhero__copy"><p class="over">Money transfer{(" · from " + name) if cur else ""}</p>
<h1 class="d-xl" id="h1" style="max-width:15ch;font-size:clamp(36px,5vw,62px)">Send money home in minutes.</h1><p class="lead">See the rate and fee first. Send to mobile money or a bank. Track it all the way.</p>
<div class="cta"><a class="btn btn--w" href="https://eganow.com/download">Download the app</a><a class="btn btn--ghost-w" href="#how">How it works</a></div><p class="pts"><span>Simple to use</span><span>Quick to arrive</span><span>Safe to trust</span></p></div>
<div class="mt-calc-slot">{calc}</div></div></section>"""
    body += section(f'<div class="rv" style="display:grid;gap:14px;justify-items:start"><p class="over">Sending from</p><h2 class="d-lg" style="max-width:20ch">Where are you sending from?</h2><p class="lead">{c["intro"]}</p><div class="chipsx">{chips}</div></div>')
    body += section(sec_head("How it works", "Three steps. No queues.") + steps([("Sign up", "Get the Eganow app, create your account and verify your identity."), ("Pick who gets it", "Choose a mobile money wallet or bank account in Ghana and save the recipient."), ("Check the rate and send", "See the rate, fee and delivery time first. Confirm and send; track it any time.")]).replace('class="steps"', 'class="steps steps--3" id="how"'), "sec--ice")
    body += section(split("Seamless transfer from anywhere", "A simple way to send money.", "Built for people supporting family back home: clear fees, quick delivery and tracking on every transfer.",
        ["Competitive fees shown before you send", "Delivery often within minutes", "Track every transfer"],
        photo(*c.get("photo", ("p02-uk-to-ghana-video-call", "A man video-calling his family in Ghana on his phone"))) + mk("left:-2%;bottom:8%;width:240px", f'<p class="mk-h">You send</p><div class="big">{c.get("demo","£200")}</div><span class="pill">Rate locked</span>', "float") + mk("right:-2%;top:6%;width:250px", f'<p class="mk-h">They receive</p><div class="big">{c.get("get","GH₵3,227.56")}</div><span class="pill">✓ Arrived in minutes</span>', "float b"),
        ("Compare with the calculator ↑", "#mt-calculator")))
    body += section(sec_head("Why Eganow", "Why choose Eganow for money transfers.") + cards([("Fair fees, shown first", "Transparent and competitive fees on every transaction, with no hidden charges."), ("Safe and tracked", "Compliant with regulatory standards, so your money is sent securely and can be tracked at any time."), ("Quick delivery", "Transfers to Africa are completed quickly, often within minutes, so your loved ones can access funds when they need them."), ("Send in your currency, they get cedis", "Send in your currency; recipients receive funds in their local currency without hassle."), ("People who pick up the phone", "Our customer service team is available to help with any question or issue."), ("Your support reaches home", "Remittances support education, healthcare and local investment in communities.")]), "sec--ice")
    body += section('<div class="split"><div class="split__copy rv"><p class="over">Payout</p><h3 class="d-lg">Where it lands.</h3><p class="lead">Your recipient chooses how to collect.</p>' + li(["Mobile money wallets: MTN, Telecel, AirtelTigo", "Bank accounts in Ghana"], "ticks") + '<div class="partners"><span>MTN</span><span>Telecel</span><span>AirtelTigo</span><span>Bank account</span></div></div><div class="rv"><div class="price" style="background:var(--eg-red);color:#fff"><p class="over" style="color:#fff">Get started</p><h3 class="d-lg">Send your first transfer today.</h3><p class="lead" style="color:rgba(255,255,255,.9)">See the rate and fee first, then send. Track it all the way with the Eganow app.</p><a class="btn btn--w" href="https://eganow.com/download">Download the app</a></div></div></div>')
    body += faq([("How fast will my money arrive?", "Transfers to Africa are completed quickly, often within minutes. The calculator shows the estimated delivery time for your payout method before you send."), ("What does it cost?", "Eganow shows the fee and the exchange rate before you confirm, with no hidden charges. The calculator on this page gives an indicative figure."), ("Which currencies can I send in?", "You can send in your local currency and your recipient receives funds in their local currency. Available currencies are shown in the calculator."), ("Can I track my transfer?", "Yes. Transfers can be tracked at any time in the app."), ("Is it safe?", "Eganow is licensed by the Bank of Ghana as an Enhanced Payment Service Provider and its services comply with regulatory standards."), ("Where can I read the terms?", "Read the money transfer terms and conditions on our website before you send.")])
    body += section('<p class="legalnote rv"><b>Regulatory information' + (f' for customers in {name}' if cur else '') + '.</b> Eganow (TekSol Eganow Ltd) is a financial technology company, not a Bank, licensed by the Bank of Ghana. <!-- TODO(legal): add the licence / registration statement required for ' + name + ' customers --> Read the <a href="/legal/money-transfer-terms">Money transfer terms and conditions</a>. Rates shown are indicative.</p>')
    body += final("Send money home today.", "Download the app and send in 3 easy steps.", [("Download the app", "https://eganow.com/download", "btn--white"), ("Business services", "/business/", "btn--line")])
    # calculator init + sticky bar
    body += """<div class="stickybar" id="sticky" aria-hidden="true"><span id="sticky-text">Send money to Ghana</span><button type="button" id="sticky-btn" tabindex="-1">Calculate</button></div>
<script type="module">
import { createCalculator } from "/assets/calc/calculator.js";
import { MockRateProvider } from "/assets/calc/rate-provider.js"; // TODO: swap for EganowRateProvider when the rate-engine API is ready
const region = (navigator.language||"").split("-")[1];
const def = "%s" || ({US:"USD",CA:"CAD",GB:"GBP"}[region]) || "GBP";
const root = document.getElementById("mt-calculator");
const calc = createCalculator(root, { provider: new MockRateProvider(), defaultFrom: def, appUrl: "https://eganow.com/download" });
const bar=document.getElementById("sticky"),btn=document.getElementById("sticky-btn"),txt=document.getElementById("sticky-text");
new IntersectionObserver(([e])=>{const on=!e.isIntersecting;bar.classList.toggle("is-visible",on);bar.setAttribute("aria-hidden",String(!on));btn.tabIndex=on?0:-1}).observe(root);
setInterval(()=>{const s=calc.state;txt.textContent=s.quote?`1 ${s.from} = ${s.quote.rate.toFixed(2)} ${s.to} · Send money to Ghana`:"Send money to Ghana"},1000);
btn.addEventListener("click",()=>{scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});setTimeout(()=>root.querySelector("[data-send-amount]").focus({preventScroll:true}),500)});
</script>""" % cur
    titles = {"money-transfer": "Money transfer to Ghana and Africa", "uk": "Send money from the UK to Ghana", "us": "Send money from the US to Ghana", "canada": "Send money from Canada to Ghana"}
    return titles[key], c["intro"], key, body

APP = "https://eganow.com/download"
def phero(over, title, lead, ctas, vis, mw="14ch", vcls=""):
    c = "".join(f'<a class="btn {k}" href="{h}">{t}</a>' for t, h, k in ctas)
    return f"""<main id="main"><section class="hhero" aria-labelledby="h1"><div class="wrap hhero__in"><div class="hhero__copy"><p class="over">{over}</p><h1 class="d-xl" id="h1" style="max-width:{mw};font-size:clamp(34px,4.8vw,60px)">{title}</h1><p class="lead">{lead}</p><div class="cta">{c}</div></div><div class="hhero__vis {vcls}" aria-hidden="true">{vis}</div></div></section>"""
def pfinal(title, lead, key, cta=None):
    return final(title, lead, cta or [("Get the app", APP, "btn--white"), ("Business services", "/business/", "btn--line")], None, key)

def page_bills():
    vis = (phone("left:62%", '<b style="font:800 12px var(--eg-font-display);color:var(--eg-slate)">PAY A BILL</b>' + row("Airtime & data", "›") + row("Electricity", "›") + row("Water", "›") + row("Media subscriptions", "›") + row("School fees", "›") + '<span class="pay">Schedule payment</span>').replace('position:absolute','position:absolute').replace("phone float","phone") +
           mk("left:-6%;top:70px;width:230px", '<p class="mk-h">Scheduled</p><div class="big">GHS 150.00</div><span class="pill">Electricity · 1st of month</span>', "float") +
           mk("right:-12%;top:330px;width:210px", '<p class="mk-h">Paid</p><div class="big">GHS 60.00</div><span class="pill">✓ Airtime & data</span>', "float b"))
    body = phero("Bill payment", "Pay bills without the legwork", "Airtime, power, water, subscriptions and school fees. Pay now or schedule once and forget it.", [("Pay a bill", APP, "btn--w"), ("Schedule a payment", APP, "btn--ghost-w")], vis, "13ch", "hhero__vis--phone")
    body += section(split("Scheduled payments", "Set it once. Never be late.", "Schedule your regular bill payments and focus on other things. No need to move money from one account to another just to make a payment: pay directly and conveniently from any of your linked accounts.", ["Pay on time, every time", "Use any linked account", "Keep a record of every payment"],
        photo("p04-bills-at-home", "A woman relaxing on a sofa in her Accra apartment, paying bills on her phone") + mk("right:-3%;bottom:-6%;width:290px", '<p class="mk-h">Upcoming payments</p>' + row("Electricity · 1 Dec", "GHS 150.00") + row("Water · 5 Dec", "GHS 45.00") + row("Netflix · 12 Dec", "GHS 70.00") + row("School fees · 2 Jan", "GHS 1,200.00") + '<span class="pill" style="margin-top:8px">✓ All scheduled</span>', "float"), ("Schedule payments →", APP)))
    body += section(sec_head("What you can pay", "Everything on your list, in one app.") + cards([("Never run out of credit", "Stay connected to your world of people and information without running out of credit."), ("Lights and water, sorted", "Make swift payments of your electricity and water bills at your convenience."), ("Streaming, covered", "Enjoy seamless entertainment and more subscription services through a reliable pay plan."), ("Orders and bookings", "Keep up with payment of your regular orders for food, travel, hospitality and more."), ("Taxes, pensions and fees", "Pay and keep records of your insurance, pension, taxes and other statutory fees."), ("School fees, stress-free", "Instant, stress-free termly payment of school fees and membership groups."), ("Auto-pay your regulars", "Automate your regular bills so they are never late.")], 3), "sec--ice")
    body += section(split("Wallets", "All your wallets. One tap.", "Eganow interoperability lets you link and transact between different wallets, including mobile money, international cards and bank accounts. Create multiple wallets and choose where each bill is paid from.", ["Link mobile money, cards and bank accounts", "Move between wallets without hassle", "See every balance together"],
        mk("left:4%;top:4%;width:290px", '<p class="mk-h">Your wallets</p>' + row("MTN Mobile Money", "GHS 2,100") + row("Telecel Cash", "GHS 340") + row("GCB Bank", "GHS 2,760") + row("Visa •••• 4821", "Linked") + '<span class="pay">Add a wallet</span>', "float"), ("Add a wallet →", APP), True))
    body += section(sec_head("How it works", "Pay a bill in three steps.") + steps([("Link an account", "Add your mobile money, card or bank account."), ("Choose a bill", "Pick airtime, utilities, subscriptions, school fees or any other bill."), ("Pay now or schedule", "Pay straight away, or schedule it to repeat.")]).replace('class="steps"', 'class="steps steps--3"'), "sec--ice")
    body += faq([("Which bills can I pay?", "Airtime and data, electricity and water, media subscriptions, orders and bookings, insurance, pension, taxes and other statutory fees, school fees and memberships."), ("Can I schedule payments?", "Yes. Schedule regular bills once and pay directly from any of your linked accounts."), ("Which accounts can I link?", "Mobile money wallets, international cards and bank accounts."), ("Do I get a record of my payments?", "Yes. The app keeps a record of your bill payments."), ("Is it secure?", "Eganow is licensed by the Bank of Ghana as an Enhanced Payment Service Provider and protects every transaction.")])
    body += pfinal("Link an account. Schedule your first bill.", "Download the app and never miss a due date again.", "bill-payment")
    return "Bill payments — Pay bills without the legwork", "Pay airtime, utilities, subscriptions, school fees and government fees from any linked account, and schedule recurring payments with the Eganow app.", "bill-payment", body

def page_cards_p():
    vis = ('<div class="card3d r float" style="left:6%;top:30px;background:linear-gradient(135deg,#fff,#dfe9f5);color:var(--eg-red)"><span>Eganow Mastercard</span><b>•••• 4821</b></div><div class="card3d d float b" style="right:0;top:190px"><span>Virtual card</span><b>•••• 7305</b></div>' +
           mk("left:12%;bottom:10px;width:240px", '<p class="mk-h">Top-up</p><div class="big">GHS 300.00</div><span class="pill">✓ From mobile wallet</span>', "float c"))
    body = phero("Cards", "Your mobile money, now worldwide.", "Top up a Mastercard from MTN, Telecel or AirtelTigo and shop online, in store and abroad.", [("Get your card", APP, "btn--w"), ("See card features", "#features", "btn--ghost-w")], vis, "14ch", "hhero__vis--lite")
    body += section(split("Shop. Pay. Stream. Travel.", "Tired of being locked out of international payments?", "With the Eganow Mastercard, your mobile wallet becomes global. Top up instantly from MTN, Telecel or AirtelTigo and use your card for:", ["Online shopping on Amazon, AliExpress, Jumia and more", "Subscriptions for Netflix, Apple TV and more", "In-store purchases and travel"],
        photo("p05-card-abroad", "A traveller tapping a red payment card on a contactless terminal at a sunny café abroad") + '<div class="card3d r float b" style="right:-4%;bottom:-24px;width:190px;height:116px"><span>Eganow Mastercard</span><b>•••• 4821</b></div>', ("Request card →", APP)))
    body += section(sec_head("Top up", "Three taps to global.", "Your mobile money balance goes global.") + steps([("Get your card", "Choose a virtual or physical card in the app."), ("Top up from your wallet", "Move money instantly from MTN, Telecel or AirtelTigo."), ("Spend anywhere", "Pay online, in store and worldwide.")]).replace('class="steps"', 'class="steps steps--3"'), "sec--ice")
    body += f"""<section class="sec sec--night"><div class="wrap"><div class="split"><div class="split__copy rv"><p class="over" style="color:var(--eg-amber)">Boss Card</p><h2 class="d-lg">Pay like a boss.</h2><p class="lead">Premium perks and partner discounts for people who pay in style. Unlock them with the Eganow Boss Card.</p><a class="btn" style="background:var(--eg-amber);color:var(--eg-ink)" href="{APP}">Get the Boss Card</a></div>
<div class="split__vis rv" aria-hidden="true"><div style="position:relative;min-height:300px"><div class="card3d d float" style="left:12%;top:20px;background:linear-gradient(135deg,#2a2210,#0f1b2a);border:1.5px solid var(--eg-amber)"><span style="color:var(--eg-amber)">Eganow Boss</span><b style="color:var(--eg-amber)">•••• 0001</b></div></div></div></div></div></section>"""
    body += section(f'<div id="features"></div>' + sec_head("Features", "Explore smart card features on eganow.", "Secure, fast and convenient card payments with real-time tracking and digital transaction records.") + cards([("Virtual or physical. Your call.", "Choose virtual or physical cards for flexible, secure payment options."), ("Pay anywhere, in store or online", "Easy to transact online and in person anywhere, anytime."), ("Locked down by PIN, chip and encryption", "Protected by PIN, chip and encryption technology."), ("Tap and go", "Pay instantly by tapping your card, with no insert or swipe needed."), ("See every payment live", "See every payment as it happens."), ("Every receipt, saved", "Payment history is tracked and stored digitally.")]))
    body += faq([("What is the Eganow card?", "A Mastercard you top up from your mobile wallet and use online, in store and worldwide."), ("Which wallets can I top up from?", "MTN, Telecel and AirtelTigo mobile money wallets."), ("Virtual or physical?", "You can choose a virtual card for online spending or a physical card for in-person use."), ("Is it secure?", "Cards are protected by PIN, chip and encryption technology, and you can track every transaction."), ("Where can I use it?", "Online, in store and worldwide wherever Mastercard is accepted.")])
    body += pfinal("Take your mobile money global.", "Request your Eganow card in the app.", "cards", [("Request card", APP, "btn--white"), ("Card issuing for business", "/business/card-issuing/", "btn--line")])
    return "Cards — Your mobile money, now worldwide", "Top up your Eganow Mastercard from your mobile wallet and spend online, in store and worldwide. Virtual and physical cards, contactless and secure.", "cards", body

def page_groups():
    vis = (mk("left:-2%;top:20px;width:260px", '<p class="mk-h">Family Susu</p><div class="big">GHS 6,400</div><div class="bar"><i style="width:64%"></i></div><small>64% of GHS 10,000 goal</small>', "float") +
           mk("right:-4%;top:160px;width:240px", '<p class="mk-h">Contributions</p>' + row("Ama", '<span class="pill">✓ Paid</span>') + row("Kofi", '<span class="pill">✓ Paid</span>') + row("Yaw", '<span class="pill p">Due</span>'), "float b") +
           mk("left:10%;bottom:10px;width:230px", '<p class="mk-h">Group chat</p><small>Ama: Sent mine! 🎉</small>', "float c"))
    body = phero("Groups", "Chip in together. Everyone sees the money.", "Collect for funerals, weddings, Susu, alumni and causes, with every contribution logged and visible.", [("Start a group", APP, "btn--w"), ("Browse public groups", "#public", "btn--ghost-w")], vis, "18ch", "hhero__vis--lite")
    body += section(sec_head("Private groups", "Pool money with your people.", "Mobilise group contributions for projects and events with your close network of members, friends and family.") + cards([("Funerals, weddings and celebrations", "Collect funds to support special occasions such as funerals, weddings and anniversaries."), ("Split the bill, skip the awkward chase", "Contribute funds together with friends for meals, gifts and shared expenses."), ("Alumni and class funds", "Collect alumni contributions easily for projects, events and shared initiatives."), ("Church and community", "Raise contributions for shared missions among church and membership groups."), ("Susu, simply done", "Collect regular Susu contributions from every member, with each payment recorded."), ("No contribution, no chop", "No contribution, no chop: everyone pays their share to participate, fair and simple."), ("Split bills", "Split bills effortlessly with friends for meals, gifts and shared expenses.")], 3))
    body += '<div id="public"></div>' + section(split("Public groups", "Rally a crowd for a cause.", "Whether it's supporting a charity or crowdfunding a community project, the Public Group feature helps you reach a wider audience, empowering people to make a meaningful impact together.", ["Share your cause with a wider audience", "Contributions are visible and tracked", "Anyone can give, from any wallet"],
        mk("left:4%;top:4%;width:290px", '<p class="mk-h">Community borehole</p><div class="big">GHS 18,250</div><div class="bar"><i style="width:73%"></i></div><small>73% of GHS 25,000 · 142 supporters</small><span class="pay">Contribute</span>', "float"), ("Explore public groups →", APP), True), "sec--ice")
    body += section(sec_head("Tools", "Everything you need to keep it fair.", "Collaborate, contribute and track goals with secure group tools.") + cards([("Chat with the group", "Lets members discuss and coordinate fundraising efforts."), ("Automatic records", "Automatically logs all payments for transparency."), ("Live progress", "Instantly track contributions and progress toward goals."), ("Public or private, you choose", "Create public or private groups to control access.")], 2))
    body += section(sec_head("How it works", "Start a group in three steps.") + steps([("Create a group", "Name it, set a goal and choose public or private."), ("Invite people", "Share a link or invite members from your contacts."), ("Contribute and track", "Everyone sees contributions and progress in real time.")]).replace('class="steps"', 'class="steps steps--3"'), "sec--ice")
    body += faq([("What is Eganow Groups?", "A transparent and secure way to make group contributions and donations: private groups for friends and family, and public groups for fundraising."), ("Can I make a group private?", "Yes. Group privacy settings let you create public or private groups to control access."), ("Can I see who has paid?", "Yes. Every payment is logged automatically and progress is tracked in real time."), ("Can I run a Susu group?", "Yes. Collect regular Susu contributions from your members and see who has paid."), ("Who can contribute to a public group?", "Public groups reach a wider audience so anyone can support the cause.")])
    body += pfinal("Start a group in minutes.", "Create a group, invite people and start collecting.", "groups", [("Create a group", APP, "btn--white"), ("Business services", "/business/", "btn--line")])
    return "Groups — Chip in together, everyone sees the money", "Private and public groups for events, Susu contributions, alumni, church and fundraising, with group chat, transaction records and real-time monitoring.", "groups", body

def T(t): return f'<mark class="todo">{t}</mark>'
DRAFT = '<div class="draft" role="note"><b>Draft.</b> Items highlighted <mark class="todo">like this</mark> are placeholders that Eganow must confirm or complete before this page is published.</div>'
def chead(over, title, lead, extra=""):
    return f'<main id="main"><section class="phead"><div class="wrap"><p class="over">{over}</p><h1 class="d-xl" style="font-size:clamp(34px,5vw,60px);max-width:18ch" id="h1">{title}</h1><p class="lead">{lead}</p>{extra}</div></section>'
def cend(title, lead, ctas):
    return final(title, lead, ctas, None, "none") if False else f'<section class="sec sec--red"><div class="wrap final"><h2 class="d-lg rv">{title}</h2><p class="lead rv">{lead}</p><div class="cta rv">' + "".join(f'<a class="btn {c}" href="{h}">{t}</a>' for t, h, c in ctas) + '</div></div></section></main>'

def page_about():
    team_board = [("Emmanuel Seygbo Goka", "Board Chairman"), ("Louis A. Adanuty", "Executive Board Member"), ("Dr. Daniel Agbeko", "Non-Executive Board Member")]
    mgmt = [("Senyo Fiati", "Chief Executive Officer"), ("Emmanuel Forffoe", "Chief Operations Officer"), ("Robert Adwini", "Human Resource Manager"), ("Edmond Frimpong", "Chief Technology Officer"), ("Ebenezer Anoful", "Internal Auditor"), ("Christian Agbai", "Risk & Compliance Officer")]
    def ppl(l): return '<ul class="team">' + "".join(f'<li class="person rv"><span class="av" aria-hidden="true">{"".join(w[0] for w in n.replace("Dr. ","").split()[:2])}</span><div><b>{n}</b><span>{r}</span></div></li>' for n, r in l) + '</ul>'
    body = chead("About Eganow", "We power happiness.", "To become Africa’s leading digital payment and financial services technology platform, empowering individuals, merchants and banks to transact seamlessly across borders.")
    body += section(split("Who we are", "A licensed fintech built for Africa.", "Eganow (TekSol Eganow Ltd) is a financial technology company, not a Bank. Eganow is licensed by Bank of Ghana as an Enhanced Payment Service Provider (EPSP), which allows it to offer a wide range of financial services including digital wallets and global payment gateway systems.", ["Licensed and compliant", "Built to scale", "Secure by design", "Africa-focused, globally connected"],
        mk("left:6%;top:8%;width:260px", '<p class="mk-h">Our mission</p><p style="font-weight:600">To democratise access to payments and financial services to promote inclusion.</p>', "float") + mk("right:4%;top:46%;width:230px", '<p class="mk-h">Our vision</p><p style="font-weight:600">Africa’s leading digital payments platform.</p>', "float b")))
    body += section(sec_head("We value", "What guides us.") + '<div class="pill-list rv"><span>Innovation</span><span>Integrity</span><span>Inclusion</span><span>Reliability</span><span>Partnership</span><span>Risk advisory</span></div>', "sec--ice")
    body += section(sec_head("What we do", "A robust suite of financial services for today’s interconnected economy.") + cards([("Payment acceptance & collections", "Mobile money, card payments, bank transfers and alternative payment methods."), ("PayFac & merchant services", "Onboarding, compliance, settlement and transaction management for businesses."), ("Local & cross-border transfers", "Fast, reliable money movement connecting Ghana to global markets."), ("Virtual & physical card services", "Issuing secure virtual and physical cards for local and global payments."), ("Group contribution payments", "Digital solutions for contributions, group collections, crowdfunding and shared payments."), ("Financial tools & APIs", "Developer-friendly infrastructure for integrating payments and financial services into apps and platforms.")]))
    body += section(sec_head("Our team", "The people behind eganow.") + '<h2 class="h4 rv" style="margin:0 0 14px">The Board</h2>' + ppl(team_board) + '<h2 class="h4 rv" style="margin:36px 0 14px">Management</h2>' + ppl(mgmt) + '<!-- TODO: add portraits (real staff photography, asset P14) and confirm titles/spellings with HR -->', "sec--ice")
    body += section(sec_head("Our partners", "Trusted partners powering the Eganow ecosystem.", "We collaborate with leading banks, mobile money operators, card schemes, global payment networks and cybersecurity agencies to deliver reliable, interoperable and compliant financial services across markets.") + '<div class="partners rv"><span>Banks</span><span>Mobile money operators</span><span>Card schemes</span><span>Global payment networks</span><span>Cybersecurity agencies</span></div><!-- TODO: add partner logos only where permission is held -->')
    body += section(split("Security", "We take your security and privacy seriously.", "We take security seriously so every payment made on our platform is secure. The ISO 27001 certification means that we have acceptable business practices and processes, including a robust business continuity plan, and is proof that Eganow as a payment gateway processor has satisfied the highest level of security audit.", ["Security audits", "Business continuity planning"], mk("left:8%;top:10%;width:250px", '<p class="mk-h">Certification</p><div class="big" style="font-size:24px">ISO 27001</div><span class="pill">As stated by Eganow</span>', "float"), ("How we protect you →", "/security/")), "sec--ice")
    body += cend("Let’s build a better financial future.", "Talk to our team or get the app.", [("Contact us", "/contact/", "btn--white"), ("Get the app", APP, "btn--line")])
    return "About Eganow — We power happiness", "Eganow (TekSol Eganow Ltd) is a Bank of Ghana licensed fintech powering payments, transfers, cards and group contributions across Africa.", "about", body

CTOPICS = [("support", "Support"), ("sales", "Sales"), ("complaint", "Complaint"), ("sandbox", "Sandbox access (developers)"), ("agent", "Become an agent"), ("reissuer", "Become a card re-issuer"), ("other", "Something else")]
def page_contact():
    opts = "".join(f'<option value="{k}">{v}</option>' for k, v in CTOPICS)
    ZF = "https://forms.zohopublic.com/egapassdevopsgm1/form/Contactwithphone/formperma/MjIApxhL1f9tmI2slJD96tvzD102v0u811Ft3yjea2k/htmlRecords/submit"
    form = f"""<form class="form rv" id="cform" action="{ZF}" method="POST" accept-charset="UTF-8" enctype="multipart/form-data" novalidate>
<input type="hidden" name="zf_referrer_name" value=""><input type="hidden" name="zf_redirect_url" value=""><input type="hidden" name="zc_gad" value="">
<h2 class="h4">Send a message</h2>
<div class="f"><label for="topic">Topic</label><select id="topic">{opts}</select></div>
<div class="row2"><div class="f"><label for="fn">First name <span class="req">*</span></label><input id="fn" name="Name_First" maxlength="255" required autocomplete="given-name"></div><div class="f"><label for="ln">Last name <span class="req">*</span></label><input id="ln" name="Name_Last" maxlength="255" required autocomplete="family-name"></div></div>
<div class="f"><label for="em">Email <span class="req">*</span></label><input id="em" name="Email" type="email" maxlength="255" required autocomplete="email"></div>
<div class="f"><label for="ph">Phone</label><input id="ph" name="PhoneNumber_countrycode" type="tel" maxlength="20" autocomplete="tel"></div>
<div class="f"><label for="msg">Message <span class="req">*</span></label><textarea id="msg" name="MultiLine" maxlength="65535" required></textarea></div>
<p class="error" id="cerr" role="alert" hidden style="margin:0;display:none;background:#fff1f3;border:1px solid #f3b3bf;color:#7d0a1d;border-radius:12px;padding:10px 14px;font-size:14px">Please complete the required fields.</p>
<button class="btn btn--red" type="submit">Submit</button><small>Never include your PIN, password or one-time codes. Eganow will never ask for them.</small></form>
<script>(function(){{var f=document.getElementById('cform'),t=document.getElementById('topic'),q=new URLSearchParams(location.search).get('topic');if(q&&t.querySelector('option[value="'+q+'"]'))t.value=q;
f.addEventListener('submit',function(e){{var bad=false;f.querySelectorAll('[required]').forEach(function(i){{var v=!i.value.trim()||(i.type==='email'&&!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(i.value));i.setAttribute('aria-invalid',v);if(v)bad=true}});
var er=document.getElementById('cerr');er.style.display=bad?'block':'none';er.hidden=!bad;if(bad){{e.preventDefault();return}}
var m=document.getElementById('msg');m.value='[Topic: '+t.options[t.selectedIndex].text+'] '+m.value}})}})();</script>"""
    info = """<div class="cinfo rv"><div><h2>Location</h2><p>No. 10 Parsnip Street<br>East Legon, Accra<br>Ghana</p></div><div><h2>Phone</h2><p><a href="tel:+233593900239">+233 593 900 239</a><br><a href="tel:+233540102290">+233 540 102 290</a></p></div>
<div><h2>Email</h2><p><a href="mailto:info@eganow.com">info@eganow.com</a><br><a href="mailto:sales@eganow.com">sales@eganow.com</a></p></div><div><h2>Follow</h2><p><a href="https://www.instagram.com/eganowapp/">Instagram</a> · <a href="https://www.facebook.com/eganowapp">Facebook</a> · <a href="https://www.linkedin.com/company/eganow-holdings-ltd/">LinkedIn</a></p></div>
<p class="stat-note">Eganow will never ask for your PIN, password or one-time codes.</p></div>"""
    body = chead("Let’s connect", "We would love to hear from you.", "Have questions or just want to say hi? Send us a message. We value your input; together we can create a better financial future.")
    body += section(f'<div class="cgrid">{info}{form}</div>')
    body += faq([("What is Eganow?", "Eganow (TekSol Eganow Ltd) is a financial technology company, not a bank, licensed by the Bank of Ghana as an Enhanced Payment Service Provider."), ("How do I start using Eganow?", "Download the app, register an account and link your mobile money or bank account."), ("What bills can I pay with Eganow?", "Airtime and data, electricity and water, media subscriptions, orders and bookings, and insurance, pension, taxes and other fees."), ("How can Eganow help me run my business?", "Accept payments, make payouts, issue cards, run POS devices, serve customers as an agent and send bulk messages, from one platform."), ("What is Eganow Groups?", "A transparent and secure way to make group contributions and donations, privately or publicly.")])
    body += cend("Prefer self-service?", "Browse answers in the Help centre.", [("Help centre", "/help/", "btn--white"), ("Get the app", APP, "btn--line")])
    return "Contact Eganow", "Contact Eganow in East Legon, Accra: phone, email, or send a message to support, sales or developer teams.", "contact", body

HELP = [
 ("getting-started", "Eganow app", "Getting started", "Download the app and set up your account.", [
   ("How do I get the Eganow app?", f"Download Eganow from the App Store on iPhone or Google Play on Android, then follow the steps to create your account.", ("Get the app", APP)),
   ("Why do you need to verify my identity?", "Verifying your identity keeps your money safe and is required by law. The more fully you are verified, the higher your limits can be.", None),
   ("I can’t sign in. What should I do?", "Check your phone number and PIN, and make sure you have a good connection. If you still can’t sign in, contact us and we’ll help you get back in. " + T("confirm the PIN-reset steps"), ("Contact support", "/contact/?topic=support"))]),
 ("money-transfer", "Eganow app", "Money transfer", "Send money at home and abroad.", [
   ("How do I send money?", "Choose Money Transfer in the app, pick or add a recipient, enter the amount and check every detail before you confirm.", ("Money transfer", "/money-transfer/")),
   ("Can I send money to another country?", "Eganow supports local and cross-border transfers. The countries available, any fees and the exchange rate are shown before you confirm. " + T("confirm supported corridors"), None),
   ("Can I cancel a transfer?", "Once a transfer is confirmed it may not be possible to cancel it. If you made a mistake, contact us straight away and we will do what we can.", ("Contact support", "/contact/?topic=support"))]),
 ("bill-payments", "Eganow app", "Bill payments", "Pay utilities, airtime, subscriptions and more.", [
   ("Which bills can I pay?", "Airtime and data, electricity and water, media subscriptions, orders and bookings, insurance, pension, taxes and other fees, school fees and memberships. " + T("confirm biller list"), ("Bill payments", "/bill-payment/")),
   ("Where can I find my receipt?", "You get a confirmation after each payment, and you can find past payments in your transaction history.", None),
   ("I paid a bill but it hasn’t updated. What now?", "Some billers take a little while to update. If it still hasn’t shown after " + T("time") + ", contact us with your payment reference and we’ll look into it.", ("Contact support", "/contact/?topic=support"))]),
 ("cards", "Eganow app", "Cards", "Virtual and physical Mastercard cards.", [
   ("What cards can I get?", "A virtual Mastercard card for online spending, and a physical Mastercard card for spending in person. " + T("confirm availability and delivery"), ("Cards", "/cards/")),
   ("How do I freeze my card?", "Open the Cards section of the app and freeze the card. You can unfreeze it again whenever you are ready. " + T("confirm the steps"), None),
   ("My card was lost or stolen.", "Freeze it in the app straight away, then contact us so we can help you replace it.", ("Contact support", "/contact/?topic=support"))]),
 ("groups", "Eganow app", "Groups", "Pool money with family, friends or a community.", [
   ("What are Groups?", "Groups let you pool money with other people towards a shared goal: a private Group for people you invite, or a public Group for a cause.", ("Groups", "/groups/")),
   ("What is the difference between private and public Groups?", "A private Group is for the people you invite. A public Group is open to a wider audience. " + T("confirm how public Groups are shared and discovered"), None),
   ("Can I see who has contributed?", "Members can follow a Group’s progress. What each person can see depends on the Group’s settings. " + T("confirm"), None)]),
 ("account-security", "Eganow app", "Account and security", "Keep your money and details safe.", [
   ("How do I keep my account safe?", "Never share your PIN, password or one-time codes with anyone. Eganow will never ask for them. Use a phone you control and keep it secure.", ("Security", "/security/")),
   ("I think someone used my account without my permission.", "Contact us immediately. Freeze your card in the app, change your PIN, and keep any messages as evidence.", ("Report fraud or make a complaint", "/contact/?topic=complaint")),
   ("How do I report a scam?", "Tell us what happened through the contact form and include any messages or numbers involved. Never reply to a message that asks for your PIN or codes.", ("Contact support", "/contact/?topic=support"))]),
 ("bizcollect", "Eganow Business", "BizCollect", "Collections, payouts and your dashboard.", [
   ("How do I start collecting payments?", "Open a business account, then choose how to collect: the API, Hosted Checkout, a Payment Link or USSD.", ("About BizCollect", "/business/bizcollect/")),
   ("Where can I see my transactions?", "Your BizCollect dashboard lists every transaction, so you can follow each payment from start to finish.", None),
   ("How do payouts work?", "You can pay out to one recipient or many from your dashboard. Check the total before you send. " + T("confirm payout limits and timing"), None)]),
 ("egapos", "Eganow Business", "EgaPOS", "POS devices and the management platform.", [
   ("How do I get a POS device?", "Apply for a business account and tell us what you need. Once you are verified, Eganow issues and sets up your device. " + T("confirm lead time"), ("About EgaPOS", "/business/egapos/")),
   ("How do I see all my terminals?", "The POS management platform lists every device with its status and what it has sold.", None),
   ("My terminal is offline or faulty.", "Check the power and the connection first. If it still isn’t working, contact us and we’ll help you get back to selling.", ("Contact support", "/contact/?topic=support"))]),
 ("card-issuing", "Eganow Business", "Card Issuing", "Mastercard cards for your team or customers.", [
   ("Can I issue cards for my team?", "Yes. You can issue virtual and physical Mastercard cards for your organisation’s expenses.", ("About Card Issuing", "/business/card-issuing/")),
   ("How do I become a re-issuer?", "Apply through the contact form and choose “Become a card re-issuer”. Our team will guide you through eligibility and onboarding.", ("Apply as a re-issuer", "/contact/?topic=reissuer")),
   ("Can I set a limit on a card?", "You can set how much each card can spend and freeze or unfreeze a card from your dashboard. " + T("confirm"), None)]),
 ("agency-banking", "Eganow Business", "Agency Banking", "Cash in and cash out for your customers.", [
   ("How do I become an agent?", "Apply through the contact form and choose “Become an agent”. We’ll verify your business and set you up.", ("Become an agent", "/contact/?topic=agent")),
   ("What can customers do at my agent point?", "They can put cash into their mobile wallet or bank account (cash in) and take cash out of them (cash out).", ("About Agency Banking", "/business/agency-banking/")),
   ("A customer’s cash out is still pending. What should I do?", "Check the status in your dashboard and wait for confirmation before handing over any cash. If it stays pending, contact us.", ("Contact support", "/contact/?topic=support"))]),
 ("bulk-messaging", "Eganow Business", "Bulk Messaging", "Bulk SMS and email for your business.", [
   ("Can I send both SMS and email?", "Yes. Bulk Messaging covers bulk SMS and bulk email from one account.", ("About Bulk Messaging", "/business/bulk-messaging/")),
   ("Do I need permission to message people?", "Yes. Only message people who have agreed to hear from you, and always honour opt-out requests.", None),
   ("How do I see whether my messages were delivered?", "Your delivery report shows how many messages were sent, delivered and not delivered. " + T("confirm report detail"), None)]),
 ("egahub", "Eganow Business", "Egahub", "The Eganow Business mobile app.", [
   ("What is Egahub?", "Egahub is the Eganow Business app. It puts the merchant portal on your phone so you can run your business from anywhere.", ("About Egahub", "/business/egahub/")),
   ("Do I use the same login as the portal?", "Egahub uses your Eganow business account. " + T("confirm shared login"), None),
   ("Where do I download Egahub?", "Get Egahub from the App Store or Google Play. " + T("confirm store links"), None)]),
]
def page_help():
    cats = ""
    for cid, over, name, sub, qs in HELP:
        items = ""
        for q, a, l in qs:
            link = f'<a class="link" href="{l[1]}">{l[0]} →</a>' if l else ""
            items += f'<details data-q><summary>{q}</summary><div class="a"><p>{a}</p>{link}</div></details>'
        cats += f'<section class="cat" id="{cid}" data-cat aria-labelledby="{cid}-h"><div class="wrap cat__in"><header><p class="over">{over}</p><h2 id="{cid}-h">{name}</h2><p>{sub}</p></header><div class="qs">{items}</div></div></section>'
    jp = "".join(f'<a href="#{c}">{n}</a>' for c, o, n, s, q in HELP if o == "Eganow app"); jb = "".join(f'<a href="#{c}">{n}</a>' for c, o, n, s, q in HELP if o != "Eganow app")
    extra = f'<form class="hs" id="hs" role="search" onsubmit="return false"><label for="hq" style="font:700 14px var(--eg-font-display)">Search the Help centre</label><input id="hq" type="search" placeholder="Try “freeze card” or “payment link”" autocomplete="off"><p class="stat-note" id="hstatus" role="status" aria-live="polite"></p></form><div class="jumps" id="jumps"><div><h2>Eganow app</h2><div class="jump">{jp}</div></div><div><h2>Eganow Business</h2><div class="jump">{jb}</div></div></div>{DRAFT}'
    body = chead("Help centre", "How can we help?", "Find answers about the Eganow app and Eganow Business, or get in touch with our team. Eganow will never ask for your PIN, password or one-time codes.", extra)
    body += f'<div id="hlist">{cats}</div><section class="sec" id="hnone" hidden><div class="wrap" style="text-align:center;display:grid;gap:12px;justify-items:center"><h2 class="d-lg">We couldn’t find that.</h2><p class="lead">Try different words, or ask our team directly.</p><a class="btn btn--red" href="/contact/?topic=support">Contact support</a></div></section>'
    body += cend("Still need help?", "Choose a topic and we’ll send your message to the right place.", [("Contact support", "/contact/?topic=support", "btn--white"), ("Make a complaint", "/contact/?topic=complaint", "btn--line")])
    body += """<script>(function(){var q=document.getElementById('hq'),st=document.getElementById('hstatus'),none=document.getElementById('hnone'),jumps=document.getElementById('jumps'),cats=[].slice.call(document.querySelectorAll('[data-cat]')),qs=[].slice.call(document.querySelectorAll('[data-q]')),tx=qs.map(function(e){return e.textContent.toLowerCase()});
function run(){var v=q.value.trim().toLowerCase(),w=v.split(/\\s+/).filter(Boolean),n=0;qs.forEach(function(e,i){var ok=!w.length||w.every(function(k){return tx[i].indexOf(k)>-1});e.hidden=!ok;if(ok)n++;if(w.length&&ok)e.open=true;else if(!w.length)e.open=false});
cats.forEach(function(c){c.hidden=!c.querySelector('[data-q]:not([hidden])')});jumps.hidden=!!v;none.hidden=!v||n>0;st.textContent=v?(n?n+' answer'+(n==1?'':'s')+' found':'No answers found for “'+q.value.trim()+'”.'):''}
q.addEventListener('input',run);var p=new URLSearchParams(location.search).get('q');if(p){q.value=p;run()}})();</script>"""
    return "Help centre", "Find answers about the Eganow app and Eganow Business, or get in touch with our team.", "help", body

def page_security():
    pillars = [("Licensed and regulated", "Eganow is licensed by the Bank of Ghana as an Enhanced Payment Service Provider (EPSP) under the Payment Systems and Services Act, 2019 (Act 987), so we operate under the rules that protect customers."), ("Verified customers", "We check who our customers are, which helps keep fraudsters out."), ("Protected sign-in", "Open your account with your PIN " + T("and fingerprint or face unlock — confirm") + ". We will never ask you for it."), ("Encrypted data", "Your information is encrypted " + T("confirm: in transit and at rest, and the standards used") + "."), ("Watching for fraud", "We monitor transactions for unusual activity and may pause a payment to check with you " + T("confirm monitoring approach and hours") + "."), ("Control of your cards", "Freeze and unfreeze your card in the app, and set limits " + T("confirm") + ".")]
    never = ["ask for your PIN, password or one-time codes", "ask you to send money to “unlock”, “verify” or “protect” your account", "ask you to install software or share your screen", "ask for your full card number or card security code in a call or message"]
    always = ["hang up and contact us through our official channels if you are unsure", "check who a message is from before you tap any link", "download the app only from the App Store or Google Play", "keep your phone locked and its software up to date", "check every detail of a payment before you confirm it"]
    scams = [("Someone pretending to be Eganow", "They may call, text or message you, often saying there is a problem with your account."), ("A friend or relative in urgent need", "A hijacked account or new number asks you to send money fast. Call them on a number you know."), ("Prizes, refunds and “fees”", "If you have to pay to receive money, it is a scam."), ("Fake agents and fake payment links", "Check you are at a real agent point, and that a payment link comes from someone you trust.")]
    biz = [("Protect your API keys", "Keep keys secret. Never put them in public code or in an app that customers can open."), ("Control who has access", "Give each team member their own login with only the access they need, and remove it when they leave."), ("Secure your devices", "Keep POS devices and phones with Egahub safe, and tell us straight away if one is lost."), ("Message responsibly", "Only send bulk messages to people who agreed, and honour every opt-out.")]
    body = chead("Security", "Your money. Protected.", "Secure is the third S in everything we build. Here is how we protect you, and how you can help keep your money safe.", f'<div class="cta"><a class="btn btn--red" href="#stay-safe">Stay safe</a><a class="btn btn--line" href="#problem">I have a problem</a></div>{DRAFT}')
    body += section(sec_head("How we protect you", "Built to keep your money safe.") + cards(pillars, 3))
    body += f'<section class="sec sec--ice" id="stay-safe"><div class="wrap">{sec_head("Stay safe", "A few habits keep you safe.")}<div class="two"><div class="box box--no rv"><h3 class="d-lg" style="font-size:26px">Eganow will never…</h3>{li(never)}</div><div class="box box--yes rv"><h3 class="d-lg" style="font-size:26px">You can always…</h3>{li(always)}</div></div><h3 class="h4 rv" style="margin:40px 0 14px">Scams to watch for</h3><ul class="scams">' + "".join(f'<li class="rv"><b>{a}</b><span>{b}</span></li>' for a, b in scams) + '</ul></div></section>'
    body += section(sec_head("For businesses", "Keep your business safe too.") + cards(biz, 2))
    body += f'<section class="sec sec--night" id="problem"><div class="wrap"><div class="split"><div class="split__copy rv"><p class="over">If something goes wrong</p><h2 class="d-lg">Act fast. We’re here to help.</h2><p class="lead" style="color:rgba(255,255,255,.8)">If you think someone has used your account, or you have been tricked, do these four things.</p><div class="cta"><a class="btn btn--red" href="/contact/?topic=support">Contact support</a><a class="btn btn--white" href="/contact/?topic=complaint">Make a complaint</a></div></div><ol class="steps--dark rv"><li>Freeze your card in the app and change your PIN.</li><li>Contact us straight away so we can help.</li><li>Keep evidence: messages, receipts and numbers involved.</li><li>If you are not happy with how it was handled, make a complaint.</li></ol></div></div></section>'
    body += section('<div class="two"><div class="card rv"><span class="ico" aria-hidden="true">!</span><h2 class="h4">Found a security issue?</h2><p>If you are a security researcher and you have found a vulnerability, please tell us privately at ' + T("security contact email") + '. Please do not share details publicly until we have had a chance to fix it. ' + T("link to the responsible-disclosure policy") + '</p></div><div class="card rv" style="--i:1"><span class="ico" aria-hidden="true">✓</span><h2 class="h4">Standards and certifications</h2><p>The About page states ISO 27001 certification. ' + T("Confirm the certificate is current and list any others held (for example PCI DSS). Do not list any that are not held.") + '</p></div></div>')
    body += faq([("Will Eganow ever ask for my PIN or password?", "No. We will never ask for your PIN, password or one-time codes, by phone, message or in person."), ("What should I do with a suspicious message?", "Do not click links or reply. Contact us through our official channels and tell us what you received."), ("What if I lose my phone?", "Contact us straight away. If you can, freeze your cards from another device and change your PIN."), ("How do I know a call or message is really from Eganow?", "If you are not sure, end the call and contact us yourself using the official details on this website or in the app.")])
    body += cend("Questions about security?", "Our team is happy to help.", [("Contact us", "/contact/", "btn--white"), ("Help centre", "/help/", "btn--line")])
    return "Security — Your money. Protected.", "How Eganow protects your money and information, and how you can stay safe from fraud and scams.", "security", body

import re as _re
from legal_drafts import DRAFTS
from blog_posts import POSTS
BASE = os.path.dirname(os.path.abspath(__file__))
def _slug(t): return _re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")[:40]
LEGAL_LIST = [("terms", "Terms of Service", "The terms that apply when you use the Eganow system and app.", "live"),
              ("money-transfer-terms", "Money transfer terms and conditions", "The terms for sending money with the Eganow remittance app.", "live"),
              ("privacy", "Privacy Policy", "What personal data we collect, why, and the choices you have.", "draft"),
              ("cookies", "Cookie Policy", "How this website uses cookies and similar technologies.", "draft"),
              ("aml-policy", "AML and KYC", "How we verify identity and help prevent financial crime.", "draft"),
              ("complaints", "Complaints", "How to tell us when something goes wrong, and what happens next.", "draft")]

def parse_terms(txt):
    """Terms of Service (migrated verbatim from the live page, duplicates from Framer's responsive variants removed)."""
    secs, cur = [], None
    for l in [x.strip() for x in txt.split("\n") if x.strip()]:
        if _re.match(r"^\d+\.\s+\S", l) and len(l) < 80:
            cur = [_slug(l), l, []]; secs.append(cur)
        elif _re.match(r"^[IVX]+\.\s+\S", l) and len(l) < 80:
            if cur is None: cur = ["intro", "Introduction", []]; secs.append(cur)
            cur[2].append(("h3", l))
        else:
            if cur is None: cur = ["intro", "Introduction", []]; secs.append(cur)
            cur[2].append(("b" if l.isupper() else "p", l))
    return secs

def _smart(h):
    small = {"of", "and", "to", "the", "a", "in", "on", "for", "or"}
    w = h.title().split(); return " ".join(x.lower() if (i and x.lower() in small) else x for i, x in enumerate(w))

def parse_mt(txt):
    """Money-transfer T&Cs: Framer glued ALL-CAPS headings to the first sentence ('CHANGESWe may…'); split them again."""
    secs, cur = [], None
    for l in [x.strip() for x in txt.split("\n") if x.strip()]:
        if l.startswith(("Terms & Conditions", "Eganow Ltd: Terms of Use")): continue
        m = _re.match(r"^([A-Z][A-Z &,’'()/\-]{3,}?)(?=[A-Z][a-z])(.*)$", l)
        if m and len(m.group(1)) < 70: head, rest = m.group(1).strip(), m.group(2)
        elif l.isupper() and len(l) < 60: head, rest = l, ""
        else: head, rest = None, l
        if head and not (head.startswith("BY USING") or head.startswith("WHEN YOU") or head.startswith("YOUR ATTENTION")):
            cur = [_slug(head), _smart(head) if head.isupper() else head, []]; secs.append(cur)
            if rest: cur[2].append(("p", rest))
        else:
            if cur is None: cur = ["notice", "Important notice", []]; secs.append(cur)
            cur[2].append(("b" if l.isupper() else "p", l))
    return secs

def render_sec(secs, numbered=True):
    out = ""; used = {}
    for sid, title, items in secs:
        used[sid] = used.get(sid, 0) + 1
        if used[sid] > 1: sid = f"{sid}-{used[sid]}"
        body = ""
        for it in items:
            if isinstance(it, tuple) and it[0] == "ul": body += li(it[1])
            elif isinstance(it, tuple) and it[0] == "h3": body += f'<h3>{it[1]}</h3>'
            elif isinstance(it, tuple) and it[0] == "b": body += f'<p><strong>{it[1]}</strong></p>'
            elif isinstance(it, tuple): body += f'<p>{it[1]}</p>'
            elif isinstance(it, str): body += f'<p>{it}</p>'
        out += f'<section id="{sid}"><h2>{title}</h2>{body}</section>'
    return out

def legal_doc_page(key):
    meta = {k: (t, d, st) for k, t, d, st in LEGAL_LIST}[key]; title, desc, status = meta
    if key == "terms": secs, lead = parse_terms(open(os.path.join(BASE, "legal-src/terms-of-service.txt")).read()), "The terms that apply when you use the Eganow system and app."
    elif key == "money-transfer-terms": secs, lead = parse_mt(open(os.path.join(BASE, "legal-src/money-transfer-terms.txt")).read()), "The terms that apply when you send money with the Eganow remittance app."
    else:
        d = DRAFTS[key]; lead = d["lead"]; secs = [(sid, t, [x if isinstance(x, (str, tuple)) else x for x in items]) for sid, t, items in d["sections"]]
        secs = [(sid, t, [(("ul", x[1]) if isinstance(x, tuple) else x) for x in items]) for sid, t, items in secs]
    if status == "draft":
        banner = '<div class="draft" role="note"><b>Draft for legal review.</b> This document is not yet in force. Items highlighted <mark class="todo">like this</mark> are placeholders Eganow must complete before publication.</div>'
    elif key == "terms":
        banner = '<div class="draft" role="note"><b>Review needed.</b> This is the text of the existing live page, moved into the new design without changes to its wording (repeated blocks produced by the old site builder were removed). It is titled “Privacy Policy” on the old site but is a Terms of Service; legal should review it, and the “II. System Subscription / III. System Revisions” clauses appear to contain duplicated text.</div>'
    else:
        banner = '<div class="draft" role="note"><b>Review needed.</b> This is the text of the existing live page, moved into the new design. It still contains “TBC” items (FCA register number, mobile app name) and refers to Eganow Ltd (England); legal should confirm the correct entity and complete them.</div>'
    _u = {}; _ids = []
    for sid, t, _ in secs:
        _u[sid] = _u.get(sid, 0) + 1; _ids.append(sid if _u[sid] == 1 else f"{sid}-{_u[sid]}")
    toc = "".join(f'<li><a href="#{i}">{t}</a></li>' for i, (sid, t, _) in zip(_ids, secs))
    related = "".join(f'<li><a href="/legal/{k}">{t}</a><span>{d}</span></li>' for k, t, d, st in LEGAL_LIST if k != key)
    body = f"""<main id="main"><section class="phead"><div class="wrap"><nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/legal">Legal</a></li><li aria-current="page">{title}</li></ol></nav><h1 class="d-xl" id="h1" style="font-size:clamp(32px,4.6vw,56px);max-width:22ch">{title}</h1><p class="lead">{lead}</p>{banner}</div></section>
<div class="wrap lgrid"><aside class="toc" aria-label="On this page"><details open><summary>On this page</summary><ol>{toc}</ol></details></aside><article class="doc{' doc--num' if status=='draft' else ''}">{render_sec(secs)}<nav class="relnav" aria-label="Other legal documents"><h2>Other legal documents</h2><ul>{related}</ul></nav></article></div></main>"""
    return title, desc, "legal-" + key, body

def page_legal_hub():
    rows = "".join(f'<li class="rv"><a class="card" href="/legal/{k}"><span class="chip-s {"on" if st=="live" else ""}">{"Live text" if st=="live" else "Draft"}</span><h2 class="h4">{t}</h2><p>{d}</p></a></li>' for k, t, d, st in LEGAL_LIST)
    body = chead("Legal", "Legal documents", "The terms, policies and notices that apply to Eganow’s website, app and services.", DRAFT) + section(f'<ul class="grid grid--2 legal-grid">{rows}</ul><p class="legalnote rv" style="margin-top:28px">Eganow (TekSol Eganow Ltd) is a financial technology company, not a Bank. Eganow is licensed by Bank of Ghana as an Enhanced Payment Service Provider (EPSP) under the Payment Systems and Services ACT, 2019 (ACT 987). Documents marked <b>Draft</b> are not yet in force.</p>') + cend("Questions about these documents?", "Contact our team.", [("Contact us", "/contact", "btn--white"), ("Complaints", "/legal/complaints", "btn--line")])
    return "Legal documents", "Terms, privacy, cookie, AML/KYC and complaints information for Eganow.", "legal", body

def page_blog_index():
    chips = "".join(f'<button type="button" class="chipx" data-cat="{c}">{c}</button>' for c in sorted({p["cat"] for p in POSTS}))
    cards_ = "".join(f'<li class="rv" data-cat="{p["cat"]}"><a class="card post" href="/blog/{p["slug"]}"><span class="chip-s">{p["cat"]}</span><h2 class="h4">{p["title"]}</h2><p>{p["lead"]}</p><span class="meta">{p["mins"]} min read</span></a></li>' for p in POSTS)
    body = chead("Blog", "Stories, tips and guides.", "Practical guides on sending money, staying safe, saving together and paying bills.", '<div class="draft" role="note"><b>Editorial drafts.</b> These starter articles contain general guidance only and need editorial and compliance approval before publication. The previous blog posts were template placeholder text and have been retired.</div>')
    body += section(f'<div class="chipsx" id="bf" style="margin-bottom:22px"><button type="button" class="chipx on" data-cat="">All</button>{chips}</div><ul class="grid grid--2" id="bl">{cards_}</ul><script>(function(){{var f=document.getElementById("bf");f.addEventListener("click",function(e){{var b=e.target.closest("button");if(!b)return;f.querySelectorAll("button").forEach(function(x){{x.classList.toggle("on",x===b)}});document.querySelectorAll("#bl>li").forEach(function(li){{li.hidden=b.dataset.cat&&li.dataset.cat!==b.dataset.cat}})}})}})();</script>')
    body += cend("Get the app.", "Send, pay, spend and do more on a single platform.", [("Get the app", APP, "btn--white"), ("Explore Business", "/business", "btn--line")])
    return "Blog", "Guides on sending money to Ghana, spotting scams, susu savings and paying bills on time.", "blog", body

def page_blog_post(slug):
    p = next(x for x in POSTS if x["slug"] == slug)
    secs = "".join(f'<section id="{_slug(h)}"><h2>{h}</h2>' + "".join(f"<p>{t}</p>" for t in ps) + "</section>" for h, ps in p["sections"])
    toc = "".join(f'<li><a href="#{_slug(h)}">{h}</a></li>' for h, _ in p["sections"])
    related = "".join(f'<li class="rv"><a class="card post" href="/blog/{q["slug"]}"><span class="chip-s">{q["cat"]}</span><h3 class="h4">{q["title"]}</h3><span class="meta">{q["mins"]} min read</span></a></li>' for q in POSTS if q["slug"] != slug)[:5000]
    ld = json.dumps({"@context": "https://schema.org", "@type": "BlogPosting", "headline": p["title"], "description": p["lead"], "author": {"@type": "Organization", "name": "Eganow"}, "publisher": {"@type": "Organization", "name": "Eganow"}, "mainEntityOfPage": f"{SITE}/blog/{slug}"})
    body = f"""<main id="main"><section class="phead"><div class="wrap"><nav aria-label="Breadcrumb"><ol class="crumbs"><li><a href="/blog">Blog</a></li><li aria-current="page">{p['cat']}</li></ol></nav><p class="over">{p['cat']} · {p['mins']} min read</p><h1 class="d-xl" id="h1" style="font-size:clamp(30px,4.4vw,52px);max-width:22ch">{p['title']}</h1><p class="lead">{p['lead']}</p><div class="draft" role="note"><b>Editorial draft.</b> General guidance; needs editorial and compliance approval before publication.</div></div></section>
<div class="wrap lgrid"><aside class="toc" aria-label="In this article"><details open><summary>In this article</summary><ol>{toc}</ol></details></aside><article class="doc article">{secs}<aside class="callout"><h2 class="h4">Ready to try it?</h2><p>Open the app and see for yourself.</p><a class="btn btn--red" href="{p['cta'][1]}">{p['cta'][0]}</a></aside><div class="share"><button type="button" class="btn btn--line btn--sm" id="cp">Copy link</button></div></article></div>
<section class="sec sec--ice"><div class="wrap"><h2 class="h4" style="margin-bottom:16px">Keep reading</h2><ul class="grid grid--3">{related}</ul></div></section>{cend('Do more with your money.', 'Send money, pay bills and manage your card in one app.', [('Get the app', APP, 'btn--white'), ('All articles', '/blog', 'btn--line')])}
<script type="application/ld+json">{ld}</script><script>document.getElementById('cp').addEventListener('click',function(){{var b=this;navigator.clipboard&&navigator.clipboard.writeText(location.href).then(function(){{b.textContent='Copied'}}).catch(function(){{b.textContent='Copy failed'}})}})</script>"""
    return p["title"], p["lead"], "blog-" + slug, body

def page_404():
    body = chead("Error 404", "We can’t find that page.", "The page may have moved or never existed. Try one of these instead.") + section('<div class="chipsx rv"><a class="chipx" href="/">Home</a><a class="chipx" href="/money-transfer">Money transfer</a><a class="chipx" href="/business">Business</a><a class="chipx" href="/help">Help centre</a><a class="chipx" href="/contact">Contact</a></div>') + '</main>'
    return "Page not found", "This page could not be found.", "404", body

def finalize(h):
    """Output hygiene: encode raw ampersands in text/attributes (outside <script>/<style>) and give every <input> an explicit type."""
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", h, flags=re.S)
    for i in range(0, len(parts), 2):
        parts[i] = re.sub(r"&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)", "&amp;", parts[i])
        parts[i] = re.sub(r"<input(?![^>]*\btype=)", '<input type="text"', parts[i])
    return "".join(parts)

PAGES = {"__t:legal": page_legal_hub, "__t:blog": page_blog_index, "__t:404": page_404, "__t:legal/terms": (lambda: legal_doc_page("terms")), "__t:legal/money-transfer-terms": (lambda: legal_doc_page("money-transfer-terms")), "__t:legal/privacy": (lambda: legal_doc_page("privacy")), "__t:legal/cookies": (lambda: legal_doc_page("cookies")), "__t:legal/aml-policy": (lambda: legal_doc_page("aml-policy")), "__t:legal/complaints": (lambda: legal_doc_page("complaints")), "__t:blog/send-money-to-ghana-safely": (lambda: page_blog_post("send-money-to-ghana-safely")), "__t:blog/spot-mobile-money-scams": (lambda: page_blog_post("spot-mobile-money-scams")), "__t:blog/susu-savings-explained": (lambda: page_blog_post("susu-savings-explained")), "__t:blog/pay-bills-on-time": (lambda: page_blog_post("pay-bills-on-time")), "__t:about": page_about, "__t:contact": page_contact, "__t:help": page_help, "__t:security": page_security, "__t:bill-payment": page_bills, "__t:cards": page_cards_p, "__t:groups": page_groups, "__t:money-transfer": lambda: page_transfer("money-transfer"), "__t:uk": lambda: page_transfer("uk"), "__t:us": lambda: page_transfer("us"), "__t:canada": lambda: page_transfer("canada"), "__home": page_home, "": page_hub, "bizcollect": page_bizcollect, "egapos": page_egapos, "card-issuing": page_cards, "agency-banking": page_agency, "bulk-messaging": page_bulk, "egahub": page_egahub, "developers": page_dev}
if __name__ == "__main__":
    for slug, fn in PAGES.items():
        title, desc, s, body = fn()
        home = slug == "__home"; tr = slug.startswith("__t:")
        path = "/" if home else ("/" + slug[4:] + "/" if tr else "/business/" + (slug + "/" if slug else ""))
        active = {"__t:about": "abt", "__t:help": "hlp"}.get(slug, "per") if (home or tr) else ("dev" if slug == "developers" else "biz")
        out = finalize(head(title, desc, path) + header(active) + body + footer())
        base = os.path.dirname(os.path.abspath(__file__)); d = base if home else (os.path.join(base, slug[4:]) if tr else os.path.join(base, "business", slug)); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w").write(out); print(path, len(out))
