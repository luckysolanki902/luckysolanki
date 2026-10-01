# Resume review and parsing checks

Updated October 1, 2026.

## What changed in this revision

The resume now explains ownership, design decisions, and their purpose instead of mainly listing features. It gives Blitzit's from-scratch backend, shared provider/tool infrastructure, two-agent voice system, reversible changes, wake-word model, and operational backend six distinct bullets. MaddyCustom connects the custom-coded platform to business scale, grounded shopping assistance, payment recovery, and visibility into customer behavior.

The one-page layout uses a 10-point main body, visible profile URLs, simple section headings, and more of the available page height. There are no columns of body content, graphics, skill bars, hidden keywords, text boxes, or image-based text. Spyll remains a personal project. Only Blitzit and MaddyCustom appear as work experience. Project metrics are attributed to the project or business, not presented as personally caused growth.

## Parsing results

The final PDF was tested locally using **Poppler, pypdf, and pdfplumber**. These are independent extraction implementations, not commercial ATS services.

Each recovered **100% of the source's normalized word/number tokens**. This checks preservation of text, not the quality of a hiring decision. Separate checks confirmed:

- Name, email, phone, and visible profile URLs remain readable text.
- Experience, Selected Projects & Freelance, Technical Skills, and Education remain intact headings.
- Blitzit, MaddyCustom, Avana, AutoRemov, and Spyll appear in the intended reading order.
- Employment and education dates remain intact.
- Key ownership facts and all displayed impact figures survive extraction.
- All nine source links are present as PDF annotations.
- The document is one A4 page, tagged, unencrypted, with embedded Unicode-mapped fonts and no embedded images.
- Text stays inside the page boundaries. The final rendered page was visually inspected.
- No em dashes or other Unicode dash characters appear in the source content.

A specific issue was fixed: the earlier Education heading's letter spacing caused one extractor to insert spaces between letters. The final headings use ordinary spacing.

The exact machine-readable results are in `output/pdf/resume-parsing-checks.json`. The actual Poppler extraction is available as `output/pdf/lucky-solanki-resume.txt`.

## ATS and AI screening: what this establishes

**Local parsing readiness: passes the checks above.** The extracted text gives an AI reader the name, roles, companies, dates, education, skills, ownership, and outcomes without OCR or a website visit. The portfolio links provide optional deeper evidence rather than carrying essential information missing from the resume.

**Commercial ATS parsing: not directly tested.** No resume was uploaded to Greenhouse, Lever, Workday, or another resume-scoring site. Vendor field mapping can still need correction after an application upload.

**Job-match score: not measured.** No target job description or employer screening rubric was supplied. Backend and applied AI engineering keywords are supported by the candidate's work; they were not added as hidden text or repeated to manipulate scoring.

**Shortlisting likelihood: not measurable from formatting alone.** I would shortlist this profile for a product-focused backend or applied AI technical screen. Architecture ownership, two-agent execution, custom commerce systems, and real operational constraints provide strong interview material. Research-heavy ML roles would need a different evidence set.

The earlier 82/100 and 90/100 figures were subjective editorial ratings. They were not ATS scores. A claim of 98+/100 across ATS products or AI shortlisters would not be supported by these tests.

## Evidence that could strengthen it further

Measured before/after technical outcomes would add more than stronger adjectives: database connection usage, sync recovery rates, latency, job throughput, incident reduction, or operating cost. Add these when backed by real measurements. The resume does not invent them.

The overlapping MaddyCustom and Blitzit dates are preserved. Years of experience are not double-counted. The voice frontend review status is also retained.

## Vendor guidance consulted

[Greenhouse: Unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse), updated March 2, 2026, identifies spaced letters, graphics, image-only resumes, complex tables/headers/footers, column layouts, and unclear sections as possible parsing problems. It also documents a 2.5 MB parser limit. This PDF is about 255 KiB.

The document follows the relevant formatting guidance. This is not a claim that Greenhouse itself parsed it. Legal company suffixes were not invented merely to satisfy parser heuristics.
