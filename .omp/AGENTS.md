# Project Instructions: moebio-mind

## Product Vision
Moebius Mind: an interactive 3D / PCA language-model simulator (per `work` PRJ-0028 state, integrated into the Aprender CML course through a sandbox). Static site hosted from the repo (`.nojekyll`).
TODO(owner): confirm the vision; this repo has no README, no project note and no registry entry.

## Tech Stack
- Plain HTML/JS static site (`index.html`, `mind/`, `Pulse_And_Tiles/`), Node build scripts for Portuguese dictionary datasets (`build_*.js`, `generate_*_pt*.js`, `dict_pt_*.js`), data in `data/`, fonts in `fonts/`.

## Architecture
- `index.html` entry; `mind/` simulator; `data/` datasets; root scripts generate `dict_pt_*` files. `openspec/` change control.

## Build & Verification Commands
- TODO(owner): how to rebuild the dictionaries and serve the site locally.

## Quality Gates & Invariants
- Generated dictionary files are derived; change the generator scripts, then regenerate.
- It is embedded in a sandbox in another app; keep it free of external network calls and personal data.

## DU Pointers
- No project note yet: creating `PRJ` and `REP` entries needs the owner's decision (see change Task 11).
