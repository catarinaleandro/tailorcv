#!/usr/bin/env python3
"""Check a CV .docx against docs/CV_FORMAT.md. Usage: python3 scripts/template_check.py CV.docx [expected_pages]
Prints JSON {checks: {name: bool}, passed: n, total: n}. Exit 1 if any check fails."""
import sys, re, json, zipfile, docx
from docx.shared import Inches
path = sys.argv[1]
d = docx.Document(path)
z = zipfile.ZipFile(path)
xml = z.read('word/document.xml').decode('utf8')
names = z.namelist()
text = [p.text for p in d.paragraphs if p.text.strip()]
s = d.sections[0]
heads = [p.text.strip() for p in d.paragraphs if p._p.xpath('./w:pPr/w:pBdr/w:bottom[@w:color="1F497D"]') and p.text.strip()]
order = ['Professional Summary', 'Education', 'Professional Experience', 'Skills', 'Additional Experience']
pos = [order.index(h) for h in heads if h in order]
ck = {
 'one_column_no_tables': len(d.tables) == 0 and not any(int(n) > 1 for n in re.findall(r'<w:cols[^>]*w:num="(\d+)"', xml)),
 'no_images_or_text_boxes': 'w:drawing' not in xml and 'w:pict' not in xml and 'txbxContent' not in xml,
 'us_letter': abs(s.page_width.inches - 8.5) < 0.01 and abs(s.page_height.inches - 11) < 0.01,
 'margins_half_inch': all(abs(m.inches - 0.5) < 0.01 for m in (s.left_margin, s.right_margin, s.top_margin, s.bottom_margin)),
 'headings_in_template_order': pos == sorted(pos) and 'Education' in heads and 'Professional Experience' in heads and 'Skills' in heads,
 'headings_have_1F497D_border': len(heads) >= 3,
 'calibri_theme_font_only': 'w:ascii="' not in xml and 'minorHAnsi' in xml,
 'contact_line_present': any('@' in t and 'linkedin' in t.lower() for t in text[:3]),
 'bullets_use_list_style': len(d.paragraphs) > 0 and xml.count('<w:numPr>') >= 5,
 'no_template_sample_text': not any(w in ' '.join(text) for w in ('James Smith', 'Zipper', 'Technical University Munich', 'ABC Global Business Challenge', 'Ksara')),
 'no_review_comments': not any('comments' in n for n in names) and 'commentReference' not in xml,
 'dates_use_template_format': all(re.search(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.? \d{4}', t) for t in text if ' || ' in t.replace('\t', ' || ') and re.search(r'\d{4}', t)),
}
print(json.dumps({'file': path, 'checks': ck, 'passed': sum(ck.values()), 'total': len(ck)}))
sys.exit(0 if all(ck.values()) else 1)
