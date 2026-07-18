# Abjadify — Free Abjad Calculator

> A free, dependency-free Abjad calculator — converts Persian and Arabic names into their traditional Abjad numeral values, right in the browser.

Abjadify converts each letter of a name into a number using the traditional
**Abjad** system, then totals it — the same method used for centuries in
poetry, divination, and chronograms.

This repository is a small, dependency-free **static site**: plain HTML, one
CSS file, and one JavaScript file. There is no build step and no framework —
open `index.html` and it works.

## About abjadify.com

[**abjadify.com**](https://abjadify.com/) is the home of the project — a free
online Abjad (Abjad Kabir / حساب الجُمَّل) calculator for Persian and Arabic
names. Enter any name and it instantly maps each letter to its traditional
numeral value and shows the total, along with a reference table of the eight
classic mnemonic letter groups.

The site is meant for exploring the Abjad tradition and for fun — naming a
baby or a business, poetic chronograms (*ماده‌تاریخ*), and name-based
divination. It's a curiosity and learning tool, not a substitute for expert
advice. The full site is also available in Persian and Arabic.

Live site: <https://abjadify.com/>

## Features

- **Live calculator** — type any Persian or Arabic name and see each letter's
  value and the running total, rendered instantly in the browser.
- **Abjad Kabir reference table** — the eight traditional mnemonic groups
  (Abjad, Hawwaz, Hutti …) with every letter's value.
- **Hamza toggle** — choose whether the hamza (ء) and its carriers are counted.
- **Maghribi order** — switch between the eastern order and the Maghribi
  (western) order, which reassigns six letters.
- **Responsive** — mobile nav, back-to-top button, reduced-motion aware.

## Getting started

Because it's fully static, you only need a browser:

```bash
git clone https://github.com/<your-username>/abjadify.git
cd abjadify
```

Then either open `index.html` directly, or serve the folder locally:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Visit <http://localhost:8000>.

## Project structure

```
.
├── index.html            # the page and all English content
├── style.css             # all styling
├── assets/
│   ├── js/
│   │   └── app.js        # calculator, nav, back-to-top (no dependencies)
│   └── images/
│       └── abjad-values-chart.webp   # Abjad Kabir reference chart
├── README.md
├── LICENSE
└── .gitignore
```

## How the calculation works

Every Abjad letter maps to a value (`ا`=1, `ب`=2, … `غ`=1000). `app.js`
walks the entered text, looks up each letter, optionally skips hamza carriers,
optionally applies the Maghribi overrides, and sums the result. Only Persian
and Arabic letters are counted; everything else is ignored.

## Contributing

Issues and pull requests are welcome. Since there's no build step, keep changes
to plain HTML/CSS/JS so the site stays open-and-run simple.

## License

Released under the [GNU General Public License v2.0 or later](LICENSE).
