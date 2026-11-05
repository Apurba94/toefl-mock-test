# TOEFL Mock Test

A practice test across all four skills, with the new task types, timed.

Part of the [GRE and TOEFL Study Suite](https://github.com/Apurba94/gre-toefl-study-suite): 100 free study apps for the TOEFL iBT and more. It works offline, as a Windows program or in the browser.

## Download and run

- **Windows:** download `TOEFL Mock Test.exe` from the [latest release](https://github.com/Apurba94/toefl-mock-test/releases/latest) and open it. Nothing to install. It opens in its own window and saves your progress in your user folder.
- **Browser:** open it online in the suite's web edition at https://gre-toefl-study-suite.vercel.app/apps/toefl-mock-test/ . Progress stays in that browser.
- **From source:** `python launcher.py` (Python 3.10 or later, no packages needed).

## What it does

A practice TOEFL across all four skills with the January 2026 task types: Complete the Words, Read in Daily Life and an academic passage; Choose a Response, a conversation, an announcement and a talk; Build a Sentence, an email and an academic discussion post; Listen and Repeat and an interview. Reading and listening are marked; writing and speaking you review yourself. Practice timings are defaults, not official ones.

Sections: Reading, Listening, Writing, Speaking, Progress, About.

## How to use it

1. Work through the tabs in order: **Reading**, **Listening**, **Writing**, **Speaking**.
2. In Listening, each recording plays once, as on the test.
3. Review your writing with the checklists and listen to your speaking recordings.
4. Raw scores only: this app does not convert to the 1 to 6 bands.

## Good to know

- All questions, passages and definitions were written for this suite. None are official ETS questions. For official practice, use the materials on ets.org.
- It follows the GRE General Test as shortened in September 2023 and the TOEFL iBT as updated in January 2026. Formats change, so check ets.org before your test.
- Feedback on writing and speaking counts things a program can count honestly, such as length and linking words. It does not give an official score.
- Not endorsed by or affiliated with ETS. GRE and TOEFL are registered trademarks of ETS.

## For developers

The app is plain HTML and JavaScript in `web/`, run by a small Python launcher that serves it on 127.0.0.1 only and needs a secret token for saving. Tests: `node --test "tests/*.test.js"` (23 tests) and `python -m unittest discover -s tests`. Build the .exe with `python build_exe.py`.

Built with AI assistance (Claude Code). MIT licence. By JANIN A APURBA.
