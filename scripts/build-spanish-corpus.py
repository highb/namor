#!/usr/bin/env python3
"""Download Spanish name data from INE and build names-es.json."""

import csv
import json
import os
import urllib.request

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SCRIPT_DIR, "..", "src", "data", "names-es.json")

SOURCES = {
    "hombres.csv": "https://raw.githubusercontent.com/marcboquet/spanish-names/master/hombres.csv",
    "mujeres.csv": "https://raw.githubusercontent.com/marcboquet/spanish-names/master/mujeres.csv",
}

MIN_FREQ = 1000


def download(filename: str, url: str) -> str:
    path = os.path.join(SCRIPT_DIR, filename)
    if not os.path.exists(path):
        print(f"Downloading {url}")
        urllib.request.urlretrieve(url, path)
    return path


def read_names(path: str) -> list[str]:
    names = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["nombre"].strip()
            freq = float(row["frec"].replace(",", "."))
            if " " in name:
                continue
            if freq < MIN_FREQ:
                continue
            names.append(name.title())
    return names


def main():
    all_names: set[str] = set()
    for filename, url in SOURCES.items():
        path = download(filename, url)
        all_names.update(read_names(path))

    result = sorted(all_names)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(result)} names to {OUT}")


if __name__ == "__main__":
    main()
