#!/usr/bin/env python3
"""
Vérifie les résultats annoncés dans XLGuide en les faisant recalculer par LibreOffice Calc.

  node tests/export-examples.js > /tmp/ex.json && python3 tests/verify_libreoffice.py /tmp/ex.json

Les fonctions que la version de LibreOffice installée ne connaît pas sont signalées « non testables »
(pas en échec). Dépendances : libreoffice (soffice) et openpyxl.
"""
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import tempfile

from openpyxl import Workbook, load_workbook

EPOCH = dt.datetime(1899, 12, 30)


def to_number(v):
    if isinstance(v, dt.datetime):
        return (v - EPOCH).total_seconds() / 86400
    if isinstance(v, dt.date):
        return (dt.datetime(v.year, v.month, v.day) - EPOCH).days
    if isinstance(v, dt.time):
        return (v.hour * 3600 + v.minute * 60 + v.second) / 86400
    return v


def same(got, exp):
    if isinstance(exp, str) and exp.startswith("d:"):
        y, m, d = map(int, exp[2:].split("-"))
        want = (dt.datetime(y, m, d) - EPOCH).days
        got = to_number(got)
        return isinstance(got, (int, float)) and abs(got - want) < 1e-9
    if isinstance(exp, bool):
        return got is exp or got == exp
    if isinstance(exp, (int, float)):
        got = to_number(got)
        if isinstance(got, bool) or not isinstance(got, (int, float)):
            return False
        return abs(got - exp) <= 1e-9 * max(1.0, abs(exp))
    return str(got) == exp


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    rows = json.load(open(src)) if src else json.load(sys.stdin)
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        print("LibreOffice introuvable : vérification ignorée.")
        return 0
    tmp = tempfile.mkdtemp(prefix="xlguide-")
    wb = Workbook()
    ws = wb.active
    for i, r in enumerate(rows, start=1):
        ws.cell(row=i, column=1, value=r["file"])
        ws.cell(row=i, column=2, value=r["en"])
    inp = os.path.join(tmp, "in.xlsx")
    wb.save(inp)
    outdir = os.path.join(tmp, "out")
    os.makedirs(outdir)
    env = dict(os.environ, HOME=tmp)
    subprocess.run([soffice, "--headless", "--norestore", "--convert-to", "xlsx", "--outdir", outdir, inp],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env, timeout=300)
    res = load_workbook(os.path.join(outdir, "in.xlsx"), data_only=True).active

    ok = ko = skipped = 0
    for i, r in enumerate(rows, start=1):
        got = res.cell(row=i, column=1).value
        if isinstance(got, str) and got.startswith("#"):
            got = res.cell(row=i, column=2).value  # même formule sans préfixe _xlfn.
        if isinstance(got, str) and got.startswith(("#NAME", "#VALUE", "Err:5")):
            if any(s in ("2019", "2021", "2024", "365") for s in r["since"]):
                skipped += 1
                print(f"  ~ non testable avec ce LibreOffice : {r['fr']}")
                continue
        if same(got, r["expected"]):
            ok += 1
        else:
            ko += 1
            print(f"  ✗ {r['where']}\n      FR      : {r['fr']}\n      EN      : {r['en']}\n      attendu : {r['expected']!r}\n      obtenu  : {got!r}")
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"\nLibreOffice : {ok} résultat(s) confirmé(s), {ko} écart(s), {skipped} non testable(s).")
    return 1 if ko else 0


if __name__ == "__main__":
    sys.exit(main())
