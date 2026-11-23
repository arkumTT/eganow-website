#!/usr/bin/env python3
"""Builds the Eganow asset prompt pack: assets.csv, ASSETS.md (full prompts), from the data below. Run: python3 build_pack.py"""
import csv, os, textwrap

# ---- shared style blocks (appended to every prompt of that type) ----
STYLE = {
 "photo": ("Photorealistic editorial lifestyle photograph, shot on a full-frame camera with an 85mm lens at f/2, shallow depth of field, soft key light with gentle rim light, "
           "natural skin texture and real pores (no retouched plastic skin), authentic candid expression, warm skin tones, slightly desaturated environment so the single accent colour "
           "Eganow red #CC0229 pops, secondary ice-blue #F2F9FE tones, clean uncluttered background, generous negative space on the {space} for headline text, contemporary West African / diaspora setting, "
           "no text, no logos, no watermarks"),
 "3d":    ("Glossy clay-smooth 3D render, soft ice-blue (#F2F9FE) studio lighting with subtle bounce, Eganow red #CC0229 as the hero colour with a tiny accent of brand blue #1F8FFF, "
           "rounded forms, realistic soft contact shadow, high-end product-render look (Octane/Blender Cycles), 4K, transparent background (PNG/WebP with alpha), no text, no real-brand logos"),
 "motion":("Smooth 60fps motion graphic, easing cubic-bezier(.2,.8,.2,1), Eganow palette (red #CC0229, blue #1F8FFF, ice #F2F9FE, ink #14202E), flat clean vector look with soft shadows, "
           "seamless loop where stated, no text baked in unless specified, designed to be exported as Lottie JSON (<= 150 KB) with a poster frame"),
 "ui":    ("Clean mobile fintech app UI, 390x844, Eganow design system: red #CC0229 primary buttons, white cards on ice #F2F9FE, Manrope headings, Inter body, 28px radius cards, "
           "tabular numerals, realistic but fictional data, GH₵ currency symbol rendered correctly, no real bank/brand logos, high-fidelity, flat front-on view"),
}
NEG = {
 "photo": "plastic skin, over-smoothing, extra fingers, deformed hands, distorted phone screen UI, readable fake text, stock-photo posing, forced laughing, cultural stereotypes, poverty tropes, watermark, logo, oversaturated, HDR halo, cluttered background",
 "3d": "text, brand logos, scratches, noise, harsh reflections, extra parts, floating artifacts, low-poly, cartoonish, dark background",
 "motion": "flicker, jitter, text distortion, off-palette colours, heavy gradients that bloat file size, rasterised bitmaps larger than 200 KB",
 "ui": "lorem ipsum, real bank logos, garbled text, skewed perspective, glossy skeuomorphic buttons, off-palette colours, low contrast text",
}
TOOLS = {
 "photo": "Primary: commission real shoot (see SHOTLIST.md). AI stand-in / concepting: Magnific images_generate (photoreal model), Higgsfield, Figma Weave, Adobe Firefly",
 "3d": "Magnific images_generate / models3d_text_generate, Meshy (text-to-3D) then Blender/Spline for lighting; Figma generate_image for concepts",
 "motion": "After Effects + Bodymovin (Lottie), Remotion (video/loops), Magnific video_generate for photoreal clips, Jitter/Rive for UI loops",
 "ui": "Figma (use_figma/generate_design) or Claude design tools; export PNG @2x + frames for the scroll story",
}

A = []  # (id,type,name,placement,size,format,subject,space,notes)
def add(*a): A.append(a)

# ---------------- PHOTOGRAPHY ----------------
add("P01","photo","Home hero model","Home hero (right column, behind/beside phone)","2400x1600 (3:2), plus transparent cut-out PNG","WebP + PNG cut-out",
    "A confident Ghanaian woman in her late 20s, natural curls, smiling warmly while looking at her phone held at chest height, wearing a clean white blouse, standing against a seamless Eganow-red #CC0229 studio backdrop, soft Accra-skyline silhouette glow far behind","left",
    "Shoot/generate a variant with a clean cut-out (hair detail preserved). Existing hero animation uses a woman cut-out; keep wardrobe white/ice so it works on red.")
add("P02","photo","Money transfer hero – UK to Ghana","Money Transfer hero (behind calculator card)","2400x1600","WebP",
    "A Black man in his 30s in a small London flat, over-the-shoulder shot as he video-calls family in Accra on his phone, the screen shows a warm smiling family (screen content soft and out of focus), evening window light, plants and a bookshelf, cosy and emotional","left",
    "Variants P02b (US: man in a Houston apartment), P02c (Canada: woman in a Toronto kitchen). Faces on the phone screen must be indistinct.")
add("P03","photo","Receiving family in Ghana","Money Transfer 'They receive' band","1600x1600 (1:1)","WebP",
    "A multigenerational Ghanaian family in a bright courtyard home in Accra, grandmother holding a phone and smiling as the family gathers around, warm midday light, colourful but muted fabrics","right","Pairs with P02 to show both ends of a transfer.")
add("P04","photo","Bills at home","Bill Payment hero / Home bento","2000x1500","WebP",
    "A young professional woman relaxing on a bright sofa in a modern Accra apartment, paying bills on her phone with a calm satisfied expression, a lamp and plants nearby, ice-blue and white interior","right","")
add("P05","photo","Card abroad","Cards hero","2400x1400","WebP",
    "A stylish young traveller tapping a red card on a payment terminal at a sunny café abroad, blurred city street background, shallow depth of field, focus on hand and card","left","Card artwork must be a fictional red Eganow card with no network logos; add Mastercard mark in post using the official asset.")
add("P06","photo","Groups – Susu circle","Groups hero","2400x1400","WebP",
    "Diverse friends and family laughing together outdoors at a community gathering, candid, golden-hour light, one person holding a phone to show a progress screen (screen blurred)","bottom","Candid, never posed; include different ages.")
add("P07","photo","Church / association contributions","Groups use-case tile","1600x1200","WebP",
    "A small church committee reviewing contributions on a tablet after a service, smart clothing in muted tones, warm interior light","right","Handle religious imagery respectfully; no logos or crosses in focus.")
add("P08","photo","BizCollect – market stall","BizCollect hero & use-case","2400x1600","WebP",
    "A market-stall owner in Accra checking a payment confirmation on a phone while a customer smiles and pays by mobile money, colourful produce stall softly blurred, natural morning light","left","")
add("P09","photo","EgaPOS – boutique counter","EgaPOS hero","2400x1600","WebP",
    "A boutique owner in Kumasi handing a customer a handheld POS terminal, stylish shop interior with clothes on rails, natural window light, the terminal screen shows a generic 'Approved' state","right","Variants: P09b restaurant table payment, P09c pharmacy counter.")
add("P10","photo","Card Issuing – finance team","Card Issuing hero","2400x1600","WebP",
    "A young finance manager in a modern Accra office handing a red company card to a teammate, laptop in the background showing an abstract dashboard (blurred), professional and friendly","left","")
add("P11","photo","Agency Banking – agent kiosk","Agency Banking hero","2400x1600","WebP",
    "A friendly agent at a branded kiosk counter counting cash for a customer, bright midday street background, neat uniform in red and white with no readable text","right","")
add("P12","photo","Bulk Messaging – retail manager","Bulk Messaging hero","2400x1600","WebP",
    "A retail manager sending a promotion from a tablet behind the counter, staff in the background, a customer's phone in the foreground receiving a notification (screen blurred)","left","")
add("P13","photo","Egahub – merchant on the move","Egahub hero","2400x1600","WebP",
    "A merchant walking through a busy market checking daily sales on a phone, confident stride, shallow depth of field, warm light","left","")
add("P14","photo","About – team portrait","About hero","2800x1400","WebP",
    "Diverse Eganow team of six standing together in a modern office, relaxed confident poses, red and ice-blue accents in clothing and décor, soft window light","top","Use REAL staff for About; AI only for concept layout.")
add("P15","photo","Security & trust","Security hero","2400x1400","WebP",
    "Close-up of hands holding a phone showing a generic lock icon over a softly lit desk, abstract and calm, ice-blue tones","right","Optional; prefer 3D shield (D08) if photography feels forced.")
add("P16","photo","Home diaspora band","Home 'Send money home' band","1800x1800","WebP",
    "Two-panel feel: a woman in a London flat on a video call, and her mother laughing in Accra on the phone screen (indistinct), warm emotional tone","left","Replaces CSS video-call mock on Home.")

# ---------------- 3D ----------------
add("D01","3d","Hero phone","Home hero, Home pinned story, Egahub","3000x3000","PNG alpha + 5s turntable MP4/WebM",
    "A modern smartphone, front and slightly angled, glossy black bezel, screen glowing with a clean red-and-white fintech UI (blurred, no text), floating with a soft shadow","",
    "Screen content is swapped in code/video; ask for a blank white screen version D01b for compositing.")
add("D02","3d","Card trio","Cards hero, Home bento, Card Issuing hero","3200x2200","PNG alpha + loop",
    "Three rounded payment cards fanned out: one Eganow-red, one near-black navy, one white-silver, each with a tiny gold chip, gentle floating motion, no network logos","",
    "Add Mastercard mark only in compositing with the official asset.")
add("D03","3d","POS terminal","EgaPOS hero","3000x3000","PNG alpha + 6s rotate loop",
    "A modern countertop payment terminal with a bright screen showing 'Approved' in clean sans type (blurred), contactless ring glow, small receipt paper peeking out","","Create handheld (D03b) and mini (D03c) variants for the device carousel.")
add("D04","3d","POS exploded view","EgaPOS scroll story","3200x2400","PNG sequence or MP4 (alpha)",
    "Exploded view of a payment terminal separating into parts: chip reader, NFC ring, QR scanner and receipt printer, each with a soft glowing red accent, floating in ice-blue studio space","","Parts must be labelled in code, not in the image.")
add("D05","3d","Coin and wallet stack","Money Transfer, Home","2400x2400","PNG alpha",
    "A stack of rounded gold-silver coins beside a soft red wallet with a small blue accent clasp, tiny sparkles, floating","","Coins show a neutral emblem, not a real currency design.")
add("D06","3d","Frosted icon set – bills","Bill Payment feature grid","6 icons, 1200x1200 each","PNG alpha",
    "A consistent set of six frosted-glass and red 3D icons: light bulb (electricity), water drop, wifi/data signal, ticket (subscriptions), calendar with tick (scheduled), shield with tick (government fees); same lighting, same scale","","Generate as one grid to guarantee style consistency, then slice.")
add("D07","3d","Group ring","Groups hero & Home bento","2400x2400","PNG alpha",
    "A circular progress ring in red and ice-blue with five small rounded person avatars in a circle around it, a tiny heart at the centre, glossy and friendly","","")
add("D08","3d","Security shield","Security page, trust sections","2400x2400","PNG alpha",
    "A rounded shield in frosted glass with a red tick, hovering over a soft ice-blue circular platform, delicate light rays","","")
add("D09","3d","Cash in / cash out","Agency Banking","2400x2400","PNG alpha",
    "A chunky mobile-wallet icon exchanging with a stack of banknotes (neutral, non-currency design) via two curved arrows, red and blue accents","","")
add("D10","3d","SMS & email bubbles","Bulk Messaging","2400x2400","PNG alpha",
    "Three glossy speech bubbles (one red, one white, one blue) and a small envelope floating together, soft depth","","")

# ---------------- MOTION ----------------
add("M01","motion","Home hero scene","Home hero (replace/extend existing Lottie)","1184x1145, 4s, 60fps","Lottie JSON <=150 KB + poster WebP",
    "Sun disc rises, Accra skyline slides up, the woman cut-out (P01) eases in over ~2s then holds; subtle breathing parallax; final frame is the poster","",
    "Existing Welcome_Home_Animation is the reference; strip any third-party badge layers before use.")
add("M02","motion","Phone walkthrough","Home pinned story (4 states)","390x844 screens, 600ms transitions","Lottie or MP4/WebM sprite",
    "Phone UI morphs between Send, Pay, Save and Cards screens; numbers count up; the selected tab slides; matches the screens U01–U04","","Scroll-scrubbed: export as frame sequence or Lottie with markers.")
add("M03","motion","Corridor arcs","Money Transfer hero & Home band","1600x900, 6s loop","Lottie / WebM",
    "Stylised Africa-focused world map in ice blue; glowing red arcs travel from London, New York and Toronto to Accra, coins pulse at the endpoints, seamless loop","","Keep the map simple (continent shapes only), no political borders.")
add("M04","motion","Card flip & top-up","Cards page","1200x800, 3s","Lottie",
    "A mobile-money wallet icon sends a stream of coins to a card that flips from back to front and glows; 'Top up' button presses","","")
add("M05","motion","POS tap","EgaPOS hero","1200x800, 3s loop","Lottie",
    "A card taps a terminal, contactless waves ripple, screen turns green 'Approved', receipt slides out","","")
add("M06","motion","Cash in / out","Agency Banking","1200x800, 4s loop","Lottie",
    "Notes move from a hand to a counter while a phone wallet balance ticks up; reverse for cash out","","")
add("M07","motion","SMS stream","Bulk Messaging","1200x800, 4s loop","Lottie",
    "Message bubbles fly from a laptop to many small phone silhouettes; a delivery counter rises to 12,480","","")
add("M08","motion","Number counters","Home bento, Business hub stats","—","CSS/JS (no asset)",
    "Count-up animation for 99.95%, 100+, 1; triggered once on view","","Implemented in code; no asset needed.")

# ---------------- UI SCREENS ----------------
add("U01","ui","Send money screen","Home pinned story step 1","780x1688 @2x","PNG",
    "Send-money screen: recipient 'Ama Mensah', amount £200.00, 'They receive GH₵3,260.00', rate line, fee, 'Arrives within minutes', red 'Send money' button","","Use mock-rate disclaimer 'Illustrative'.")
add("U02","ui","Pay bills screen","Home story step 2","780x1688 @2x","PNG",
    "Bill-pay list: Airtime & data, Electricity, Water, Media subscriptions, with a 'Schedule payment' toggle and a next-payment date","","")
add("U03","ui","Groups screen","Home story step 3","780x1688 @2x","PNG",
    "Group 'Family Susu': progress ring 64% of GH₵10,000, member list with Paid/Due chips, 'Contribute' button","","")
add("U04","ui","Card screen","Home story step 4","780x1688 @2x","PNG",
    "Card screen: red virtual card •••• 4821, balance, 'Top up from MTN MoMo' sheet, recent transactions","","MTN name is a real wallet network; use plain text, not their logo, unless licensed.")
add("U05","ui","Portal dashboard","BizCollect/hub","1920x1200","PNG",
    "Business dashboard on a laptop frame: collected this month GH₵48,200, channel breakdown chart, transactions table with Paid/Pending chips","","")
add("U06","ui","Egahub home","Egahub hero","780x1688 @2x","PNG",
    "Egahub home: today's sales GH₵8,420, quick actions Collect/Payout/Cards/SMS, recent transactions, notification toast 'Payment received'","","")

# ---------------- BRAND / MISC ----------------
add("B01","misc","OG / social share image","All pages <meta og:image>","1200x630","PNG/JPG",
    "Eganow-red background, white eganow wordmark, headline per page, product mock on the right; use per-page headline text in design tool, not the image model","","Generate in Figma/Canva with real fonts; AI models garble text.")
add("B02","misc","App store badges / QR","Home final CTA","vector","SVG",
    "Official Apple/Google badges and a QR to the smart link; do not generate","","Download official assets; QR from smart-link provider.")

# ------------------------------------------------------------------
def full_prompt(a):
    i,t,name,place,size,fmt,subj,space,notes = a
    if t == "misc": return subj
    st = STYLE[t].replace("{space}", space or "left")
    return f"{subj}. {st}."

out = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(out, "assets.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["id","type","name","placement","size","format","filename","prompt","negative_prompt","tools","notes"])
    for a in A:
        i,t,name,place,size,fmt,subj,space,notes = a
        fn = f"{i.lower()}-{name.lower().replace(' – ','-').replace(' / ','-').replace(' ','-').replace('&','and')}"
        w.writerow([i,t,name,place,size,fmt,fn,full_prompt(a),NEG.get(t,""),TOOLS.get(t,""),notes])

with open(os.path.join(out, "ASSETS.md"), "w") as f:
    f.write("# Eganow asset prompts (generated from build_pack.py)\n\nCopy a prompt as-is. Style, lighting and palette are already appended. See STYLE.md for the rules behind them and PIPELINE.md for the workflow.\n\n")
    cur = None
    names = {"photo":"Photography","3d":"3D renders","motion":"Motion graphics","ui":"App / dashboard screens","misc":"Brand and misc"}
    for a in A:
        i,t,name,place,size,fmt,subj,space,notes = a
        if t != cur: f.write(f"\n---\n\n## {names[t]}\n"); cur = t
        f.write(f"\n### {i} · {name}\n- **Placement:** {place}\n- **Size / format:** {size} · {fmt}\n")
        f.write(f"- **Prompt:**\n\n```\n{full_prompt(a)}\n```\n")
        if t in NEG: f.write(f"- **Negative prompt:** `{NEG[t]}`\n")
        if notes: f.write(f"- **Notes:** {notes}\n")
print(len(A), "assets")
