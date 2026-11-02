#!/usr/bin/env python3
"""
Vérifie les résultats annoncés dans XLGuide en les faisant recalculer par LibreOffice Calc.

  node tests/export-examples.js > /tmp/ex.json && python3 tests/verify_libreoffice.py /tmp/ex.json

Deux sortes d'éléments :
  - « ex »     : une formule isolée et son résultat attendu ;
  - « sample » : un mini-tableau (données en A1, colonne recopiée, calculs) et ses résultats.

Chaque formule est écrite deux fois (avec et sans préfixe _xlfn.) pour couvrir les deux conventions.
Les fonctions que la version de LibreOffice installée ne connaît pas, et les résultats matriciels,
sont signalés « non testables » (pas en échec). Dépendances : libreoffice (soffice) et openpyxl.
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
RECENT = ("2019", "2021", "2024", "365")


def to_number(v):
    if isinstance(v, dt.timedelta):  # différence de deux dates relue comme une durée
        return v.total_seconds() / 86400
    if isinstance(v, dt.datetime):
        return (v - EPOCH).total_seconds() / 86400
    if isinstance(v, dt.date):
        return (dt.datetime(v.year, v.month, v.day) - EPOCH).days
    if isinstance(v, dt.time):
        return (v.hour * 3600 + v.minute * 60 + v.second) / 86400
    return v


def cell_value(v):
    """Valeur d'entrée d'un mini-tableau → valeur openpyxl."""
    if isinstance(v, str) and v.startswith("d:"):
        y, m, d = map(int, v[2:].split("-"))
        return dt.datetime(y, m, d)
    if isinstance(v, str) and v.startswith("t:"):
        h, mi = map(int, v[2:].split(":"))
        return dt.time(h, mi)
    if v == "":
        return None
    return v


def same(got, exp):
    if isinstance(exp, str) and exp.startswith("d:"):
        y, m, d = map(int, exp[2:].split("-"))
        want = (dt.datetime(y, m, d) - EPOCH).days
        got = to_number(got)
        return isinstance(got, (int, float)) and not isinstance(got, bool) and abs(got - want) < 1e-9
    if isinstance(exp, bool):
        return got is exp or got == exp
    if isinstance(exp, (int, float)):
        got = to_number(got)
        if isinstance(got, bool) or not isinstance(got, (int, float)):
            return False
        return abs(got - exp) <= 1e-9 * max(1.0, abs(exp))
    if exp == "":
        return got in (None, "")
    return str(got) == exp


def is_error(v):
    return isinstance(v, str) and (v.startswith("#") or v.startswith("Err:"))


class Checker:
    def __init__(self):
        self.ok = self.ko = self.skipped = 0

    def check(self, where, fr, en, expected, since, got_a, got_b):
        if isinstance(expected, list):
            self.skipped += 1
            print(f"  ~ résultat matriciel, non testable automatiquement : {fr}")
            return
        got = got_b if is_error(got_a) else got_a
        if is_error(got) and any(s in RECENT for s in since):
            self.skipped += 1
            print(f"  ~ non testable avec ce LibreOffice : {fr}")
            return
        if same(got, expected):
            self.ok += 1
        else:
            self.ko += 1
            print(f"  ✗ {where}\n      FR      : {fr}\n      EN      : {en}\n      attendu : {expected!r}\n      obtenu  : {got!r}")


def build(rows, path):
    """Écrit le classeur : feuille « EX » pour les exemples isolés, deux feuilles par mini-tableau."""
    wb = Workbook()
    ws = wb.active
    ws.title = "EX"
    plan = []
    r = 1
    for item in rows:
        if item["kind"] != "ex":
            continue
        ws.cell(row=r, column=1, value=item["file"])
        ws.cell(row=r, column=2, value=item["en"])
        plan.append(("ex", item, r))
        r += 1
    n = 0
    for item in rows:
        if item["kind"] != "sample":
            continue
        n += 1
        ncols = len(item["cols"])
        for variant in ("a", "b"):
            sh = wb.create_sheet(f"S{n}{variant}")
            for c, h in enumerate(item["cols"], start=1):
                sh.cell(row=1, column=c, value=h)
            for i, data in enumerate(item["rows"], start=2):
                for c, v in enumerate(data, start=1):
                    sh.cell(row=i, column=c, value=cell_value(v))
            if item["fill"]:
                for i, cell in enumerate(item["fill"]["cells"], start=2):
                    sh.cell(row=i, column=ncols + 1, value=cell["file"] if variant == "a" else cell["en"])
            for i, calc in enumerate(item["calc"], start=2):
                sh.cell(row=i, column=ncols + 3, value=calc["file"] if variant == "a" else calc["en"])
        plan.append(("sample", item, n))
    wb.save(path)
    return plan


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    rows = json.load(open(src)) if src else json.load(sys.stdin)
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if not soffice:
        print("LibreOffice introuvable : vérification ignorée.")
        return 0
    tmp = tempfile.mkdtemp(prefix="xlguide-")
    inp = os.path.join(tmp, "in.xlsx")
    plan = build(rows, inp)
    outdir = os.path.join(tmp, "out")
    os.makedirs(outdir)
    env = dict(os.environ, HOME=tmp)
    subprocess.run([soffice, "--headless", "--norestore", "--convert-to", "xlsx", "--outdir", outdir, inp],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=env, timeout=600)
    wb = load_workbook(os.path.join(outdir, "in.xlsx"), data_only=True)

    chk = Checker()
    for kind, item, ref in plan:
        if kind == "ex":
            ws = wb["EX"]
            chk.check(item["where"], item["fr"], item["en"], item["expected"], item["since"],
                      ws.cell(row=ref, column=1).value, ws.cell(row=ref, column=2).value)
            continue
        sa, sb = wb[f"S{ref}a"], wb[f"S{ref}b"]
        ncols = len(item["cols"])
        if item["fill"]:
            for i, cell in enumerate(item["fill"]["cells"], start=2):
                chk.check(item["where"] + f" (ligne {i})", cell["fr"], cell["en"], cell["expected"], cell["since"],
                          sa.cell(row=i, column=ncols + 1).value, sb.cell(row=i, column=ncols + 1).value)
        for i, calc in enumerate(item["calc"], start=2):
            chk.check(item["where"] + " — " + calc["label"], calc["fr"], calc["en"], calc["expected"], calc["since"],
                      sa.cell(row=i, column=ncols + 3).value, sb.cell(row=i, column=ncols + 3).value)

    shutil.rmtree(tmp, ignore_errors=True)
    print(f"\nLibreOffice : {chk.ok} résultat(s) confirmé(s), {chk.ko} écart(s), {chk.skipped} non testable(s).")
    return 1 if chk.ko else 0


if __name__ == "__main__":
    sys.exit(main())
