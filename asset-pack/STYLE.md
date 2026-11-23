# Visual style bible

Reference feel: Revolut-level polish (big product visuals, confident colour) with Eganow's warmth. Tokens come from `../design-system/DESIGN.md`.

## Palette in imagery
- **Hero accent:** Eganow Red `#CC0229`. One red element per frame (backdrop, card, garment accent), never red everywhere.
- **Support:** Ice `#F2F9FE` and white for space; Ink `#14202E` for deep shadows; Brand Blue `#1F8FFF` as a small accent (logo tick, a light, a card chip).
- Avoid: orange-teal Hollywood grading, neon gradients, purple "AI" gradients, pure black backgrounds, green/yellow dominance.

## Photography
- **Look:** editorial lifestyle, 85mm, f/1.8–f/2.8, soft window or large softbox key, gentle rim light, 5200–5600 K, warm skin, slightly desaturated surroundings.
- **Skin & people:** real texture, natural expressions (smiles that reach the eyes), varied ages, skin tones, body types, hair; dignified, aspirational, never pity or poverty tropes. Wardrobe: solid, clean, white/ice/navy with at most one red accent; no visible third-party logos.
- **Settings:** contemporary Accra, Kumasi, London, Houston, Toronto; modern interiors, markets, offices; real objects (phones, cards, POS).
- **Composition:** subject on a third, 25–40 % negative space on the side where the headline sits (prompts specify left/right/top/bottom). Phone screens always blurred or generic (UI is added later).
- **Backdrop variants:** red seamless (hero/cut-out), ice seamless (product), real location (lifestyle).
- **Consistency across a set:** same grade, same lens look, same light direction per page; use one reference image per page as the style anchor.

## 3D
- Soft clay/gloss hybrid, large radii (match 28 px UI radius), rounded edges, no sharp bevels.
- Lighting: large ice-blue key from top-left, soft bounce, faint red rim from bottom-right; contact shadow only.
- Materials: glossy red plastic, frosted glass, brushed navy, white ceramic; metallic only for chips/coins.
- Scale/perspective: 3/4 view, 15–25° tilt, consistent camera for a set; transparent PNG/WebP with alpha, 4K master, 2x for web.
- Never render real brand marks (Mastercard, Visa, MTN, Telecel, AirtelTigo): add official assets in design if licensed.

## Motion
- Easing `cubic-bezier(.2,.8,.2,1)`; 150 ms hover, 300 ms UI, 600 ms section reveals, 3–6 s loops.
- Meaning over decoration: show a payment arriving, a card flipping, money crossing a border.
- Budgets: Lottie ≤150 KB; no embedded bitmaps over 200 KB; poster frame always supplied; reduced-motion shows the poster; autoplay media muted and pausable.

## UI screens
- Use the real component styling (red primary, white cards on ice, Manrope/Inter, 28 px radius).
- Data is fictional but plausible, amounts in GH₵ / £ / $ / C$ with correct symbols and tabular numerals; label rate-bearing screens "Illustrative".
- No lorem ipsum; names such as Ama, Kofi, Efua, Yaw are fine.

## Text in images
Image models garble text. Generate **without** text, add all words in Figma/code. Exceptions: none.

## Do / Don't
| Do | Don't |
|---|---|
| Real, dignified people and real use cases | Stereotypes, poverty imagery, tokenised diversity |
| One red accent per frame | Red everywhere or competing accents |
| Blurred generic phone UI in photos | Readable fake UI/text or real bank brands |
| Transparent 3D with soft shadow | Hard-edged, noisy, dark 3D |
| Label AI-generated assets in the register | Pass AI people off as real customers or staff |
