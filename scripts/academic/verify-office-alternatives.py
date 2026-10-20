"""Run feasible headless LibreOffice checks; never mark Microsoft GUI checks passed."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from zipfile import ZipFile

import openpyxl
from pptx import Presentation
from pptx.util import Inches


def run(archive, output):
    work = Path(tempfile.mkdtemp(prefix="csm177-office-"))
    executable = shutil.which("soffice")
    if not executable:
        raise RuntimeError("LibreOffice unavailable; no alternative tests executed")
    env = {**os.environ, "XDG_CACHE_HOME": str(work / "cache")}
    version = subprocess.check_output([executable, "--version"], text=True, env=env).strip()
    with ZipFile(archive) as package:
        original = package.read("04_PRACTICAL_TESTING/CSM177_FORMULA_VALIDATION_LAB_NOT_DESKTOP_VERIFIED.xlsx")
    source = work / "lab.xlsx"
    source.write_bytes(original)
    with ZipFile(source) as workbook:
        if any("vba" in name.lower() or "externallink" in name.lower() for name in workbook.namelist()):
            raise ValueError("Unexpected active/external workbook parts")
    evidence = []

    def convert(path, target, fmt):
        target.mkdir(parents=True, exist_ok=True)
        result = subprocess.run([executable, "-env:UserInstallation=" + (work / "profile").as_uri(), "--headless", "--convert-to", fmt, "--outdir", str(target), str(path)], capture_output=True, text=True, timeout=60, env=env)
        destination = target / (path.stem + "." + fmt)
        if result.returncode or not destination.exists():
            raise RuntimeError("LibreOffice conversion did not produce output: " + path.name)
        return destination

    def check(id, scenario, expected, actual, passed):
        evidence.append({"id": id, "relatedOfficeScenario": scenario, "method": "LibreOffice headless alternative; NOT Microsoft Office GUI", "expected": expected, "actual": actual, "status": "PASS" if passed else "FAIL"})

    recalculated = convert(source, work / "recalculated", "xlsx")
    values = openpyxl.load_workbook(recalculated, data_only=True)
    checks = [("EX-01", "Payroll Screenshot", "I7", 3138.75), ("EX-01", "Payroll Screenshot", "I23", 30410.75), ("EX-03", "Payroll Written", "I7", 3158.125), ("EX-03", "Payroll Written", "I23", 30598.625), ("EX-04", "Weighted Marks", "E6", 74.1), ("EX-04", "Weighted Marks", "C28", 74.1), ("EX-04", "Weighted Marks", "C29", 30), ("EX-04", "Weighted Marks", "C30", 55.1733333333333), ("EX-05", "Weighted Marks", "F6", "UNSET"), ("EX-07", "Filter and Functions", "B15", 40449)]
    for scenario, sheet, cell, expected in checks:
        actual = values[sheet][cell].value
        passed = actual == expected if isinstance(expected, str) else isinstance(actual, (int, float)) and abs(actual - expected) < 1e-8
        check(sheet + "!" + cell, scenario, expected, actual, passed)
    for row in range(4, 11):
        sheet = values["Filter and Functions"]
        if sheet[f"A{row}"].value == 40:
            actual = [sheet[f"B{row}"].value, sheet[f"C{row}"].value]
            check("filter-boundary-40", "EX-06", [False, True], actual, actual == [False, True])
    today, now = (values["Filter and Functions"][cell].value for cell in ["B13", "B14"])
    check("today-versus-now", "EX-07", "date-only midnight; NOW has a time component on same date", [str(today), str(now)], isinstance(today, datetime) and isinstance(now, datetime) and today.hour == today.minute == today.second == 0 and today.date() == now.date() and today != now)
    print("Recalculated source fixture", flush=True)

    changed = openpyxl.load_workbook(source)
    changed["Payroll Screenshot"]["I2"] = .18
    variant = work / "tax-variant.xlsx"
    changed.save(variant)
    variant_values = openpyxl.load_workbook(convert(variant, work / "variant", "xlsx"), data_only=True)
    for cell, expected in [("E7", 697.5), ("I7", 3022.5)]:
        actual = variant_values["Payroll Screenshot"][cell].value
        check("tax-variant-" + cell, "EX-02", expected, actual, isinstance(actual, (int, float)) and abs(actual - expected) < 1e-8)

    reference = openpyxl.Workbook()
    sheet = reference.active
    sheet.title = "Reference"
    sheet["B2"], sheet["B3"], sheet["F1"] = 4, 6, 3
    sheet["D2"], sheet["D3"] = "=B2*$F$1", "=B3*$F$1"
    for i in range(1, 5):
        extra = reference.create_sheet("Sheet" + str(i))
        for n in range(1, 11):
            extra[f"D{n}"] = n
    sheet["G2"] = "=SUM(Sheet1:Sheet4!D1:D10)"
    sheet["G3"] = "=MATCH(6,B2:B3,0)"
    reference_path = work / "reference.xlsx"
    reference.save(reference_path)
    ref_values = openpyxl.load_workbook(convert(reference_path, work / "references", "xlsx"), data_only=True)
    for cell, expected in [("D2", 12), ("D3", 18), ("G2", 220), ("G3", 2)]:
        actual = ref_values["Reference"][cell].value
        scenario = "new-3d-lesson" if cell == "G2" else "new-lookup-clarification" if cell == "G3" else "EX-09"
        check("reference-" + cell, scenario, expected, actual, actual == expected)
    print("Recalculated variants and reference example", flush=True)

    reference.active = 0
    sheet.print_area = "A1:G4"
    sheet.page_setup.orientation = "landscape"
    sheet.page_setup.paperSize = sheet.PAPERSIZE_A4
    sheet.page_setup.fitToWidth = 1
    sheet.page_setup.fitToHeight = 1
    sheet.sheet_properties.pageSetUpPr.fitToPage = True
    for other in list(reference)[1:]:
        reference.remove(other)
    sheet.oddHeader.center.text = "Fictional CSM177 print check"
    print_path = work / "print.xlsx"
    reference.save(print_path)
    pdf = convert(print_path, work / "print", "pdf")
    info = subprocess.check_output(["pdfinfo", str(pdf)], text=True)
    text = subprocess.check_output(["pdftotext", str(pdf), "-"], text=True)
    check("headless-print-header", "EX-11", "Fictional header present in exported PDF", "header present" if "Fictional CSM177 print check" in text else "missing", "Fictional CSM177 print check" in text)
    check("headless-landscape", "EX-11", "landscape PDF", next((line for line in info.splitlines() if line.startswith("Page size:")), "missing"), "841" in info and "595" in info)

    deck = Presentation()
    slide = deck.slides.add_slide(deck.slide_layouts[5])
    slide.shapes.title.text = "Fictional CSM177 layout check"
    table = slide.shapes.add_table(2, 2, Inches(1), Inches(2), Inches(6), Inches(1)).table
    table.cell(0, 0).text = "Table survives roundtrip"
    table.cell(1, 0).text = "Local review only"
    slide.shapes.add_textbox(Inches(1), Inches(4), Inches(6), Inches(1)).text = "Separate text box"
    presentation = work / "layout.pptx"
    deck.save(presentation)
    roundtrip = convert(presentation, work / "presentation", "pptx")
    reopened = Presentation(roundtrip)
    actual_tables = sum(shape.has_table for shape in reopened.slides[0].shapes)
    check("presentation-table-roundtrip", "PP-04", 1, actual_tables, actual_tables == 1)
    pp_pdf = convert(roundtrip, work / "presentation-pdf", "pdf")
    pp_text = subprocess.check_output(["pdftotext", str(pp_pdf), "-"], text=True)
    check("presentation-text-render", "PP-04", "title, table and textbox present", all(s in pp_text for s in ["Fictional CSM177 layout check", "Table survives roundtrip", "Separate text box"]), all(s in pp_text for s in ["Fictional CSM177 layout check", "Table survives roundtrip", "Separate text box"]))

    report = {"executedAt": datetime.now(timezone.utc).isoformat(), "engine": version, "fixtureSha256": hashlib.sha256(original).hexdigest(), "requiredMicrosoftOfficeGuiChecksExecuted": 0, "requiredMicrosoftOfficeGuiChecksPassed": 0, "evidence": evidence, "limitations": ["Headless LibreOffice is not Windows Excel or PowerPoint.", "No keyboard shortcuts, audio playback, animation/timing, protection dialogs or physical print acceptance verified.", "Payroll alternatives are calculations, not authoritative tax/grade policy."]}
    output.write_text(json.dumps(report, indent=2, default=str) + "\n")
    print(json.dumps({"alternativeChecks": len(evidence), "passed": sum(e["status"] == "PASS" for e in evidence), "failed": sum(e["status"] == "FAIL" for e in evidence), "MicrosoftOfficeGuiPassed": 0}))
    if any(e["status"] == "FAIL" for e in evidence):
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    run(args.archive, args.output)
