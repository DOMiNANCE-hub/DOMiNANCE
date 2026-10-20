"""Compare supplied source excerpts to actual PDF text, never infer a page offset.

Usage: python3 scripts/academic/reconcile-csm177.py PACKAGE.zip LECTURER.pdf OUTPUT.json
Neither source document is executed or copied into the repository.
"""
import collections
import csv
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import unicodedata
from zipfile import ZipFile


def tokens(text):
    return re.findall(r"[a-z0-9]+", unicodedata.normalize("NFKD", text).lower())


def grams(words):
    return set(zip(words, words[1:], words[2:], words[3:]))


def reconcile(archive, pdf):
    with ZipFile(archive) as package:
        checks = list(csv.DictReader(io.StringIO(package.read("03_QA_EVIDENCE/FILE_SHA256_MANIFEST.csv").decode("utf-8-sig"))))
        for entry in checks:
            raw = package.read(entry["path"])
            if len(raw) != int(entry["bytes"]) or hashlib.sha256(raw).hexdigest() != entry["sha256"]:
                raise ValueError("Package integrity failure: " + entry["path"])
        questions = json.loads(package.read("02_QUIZZES/CSM177_274_EDITORIAL_MASTER.json"))
        metrics = json.loads(package.read("03_QA_EVIDENCE/FINAL_METRICS_AND_RELEASE_GATE.json"))
    raw_text = subprocess.check_output(["pdftotext", "-layout", str(pdf), "-"], text=True)
    pages = raw_text.split("\f")
    if not pages[-1].strip():
        pages.pop()
    page_grams = [grams(tokens(page)) for page in pages]
    anchors = collections.defaultdict(list)
    for question in questions:
        anchors[question["source_pages"][0]].append(question)
    mapping = []
    for source_page in range(1, metrics["pdf_pages"] + 1):
        evidence, possible = [], []
        for question in anchors[source_page]:
            words = tokens(question.get("cp4_first_source_excerpt", ""))
            needle = grams(words)
            if len(needle) < 5:
                evidence.append({"question": question["id"], "status": "insufficient-text-anchor"})
                continue
            scores = sorted(((len(needle & haystack) / len(needle), i + 1) for i, haystack in enumerate(page_grams)), reverse=True)
            best, second = scores[0], scores[1]
            verified = best[0] >= .85 and best[0] - second[0] >= .10
            if verified:
                possible.append(best[1])
            evidence.append({"question": question["id"], "status": "unique-text-anchor" if verified else "ambiguous-or-unmatched", "actualPage": best[1] if verified else None, "match": round(best[0], 4), "runnerUp": round(second[0], 4), "anchor": " ".join(words[:18])})
        unique = set(possible)
        actual = next(iter(unique)) if len(unique) == 1 else None
        mapping.append({"packagePage": source_page, "actualPage": actual, "status": "text-anchored" if actual else "conflicting-anchors" if len(unique) > 1 else "unresolved-no-unique-text-anchor", "actualTextSha256": hashlib.sha256(pages[actual - 1].encode()).hexdigest() if actual else None, "evidence": evidence})
    return {"packageSha256": hashlib.sha256(Path(archive).read_bytes()).hexdigest(), "packageSourceSha256Claim": metrics["original_source_pdf_sha256"], "packageOriginalPdfAvailable": False, "actualPdfSha256": hashlib.sha256(Path(pdf).read_bytes()).hexdigest(), "packagePageCount": metrics["pdf_pages"], "actualPageCount": len(pages), "fileIntegrityChecks": len(checks), "method": "Unique 4-token source excerpt overlap >= 0.85; lead >= 0.10 over every other actual PDF page. No inferred offset; unresolved pages remain unmapped.", "summary": dict(collections.Counter(row["status"] for row in mapping)), "pages": mapping}


if __name__ == "__main__":
    result = reconcile(Path(sys.argv[1]), Path(sys.argv[2]))
    Path(sys.argv[3]).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"sourcePages": result["packagePageCount"], "actualPages": result["actualPageCount"], "summary": result["summary"]}))
