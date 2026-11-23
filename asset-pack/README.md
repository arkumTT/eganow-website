# Eganow asset prompt pack

Everything needed to produce the imagery, 3D, motion and UI visuals for the new Eganow website.

| File | What it is |
|---|---|
| `ASSETS.md` | 42 ready-to-paste prompts (photo P01–P16, 3D D01–D10, motion M01–M08, UI U01–U06, brand B01–B02) with placement, size, format, negative prompt, notes |
| `assets.csv` | Same list as a tracker (import to Sheets/Notion/Asana): id, placement, size, filename, prompt, negative, tools, notes |
| `STYLE.md` | The visual rules behind every prompt: palette, light, composition, casting, 3D/motion language, do/don't |
| `SHOTLIST.md` | Brief for a real photoshoot (casting, wardrobe, locations, setups, releases, delivery) — the preferred route for people imagery |
| `PIPELINE.md` | Workflow, tool routing, naming, optimisation budgets, QA checklist, legal/ethics, consistency tricks |
| `build_pack.py` | Source of truth: edit the data here, run `python3 build_pack.py` to regenerate `ASSETS.md` and `assets.csv` |

Order of work: STYLE → generate 3D (D01–D03) and UI (U01–U04) → hero photography (P01, P02, P08, P09) → motion → remaining photography → optimise and ship per PIPELINE.
