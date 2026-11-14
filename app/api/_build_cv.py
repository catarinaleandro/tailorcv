#!/usr/bin/env python3
"""Fill a copy of sample/IENYC_CV_Template.docx from a CV spec JSON.

Usage: python3 scripts/build_cv.py SPEC.json OUT.docx [--template PATH] [--pdf]

The spec is produced by the cv-builder agent (see agents/cv-builder.md). Layout is cloned
from paragraphs of the template (name, contact line, headings, entry lines, bullets), so the
output keeps the template's fonts, borders, tabs and list style. The template's review
comments and sample text are dropped. Also writes OUT.docx.sources.json (CV text -> source IDs).
"""
import copy, json, re, subprocess, sys, os
import docx
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
# paragraph indices of the template used as layout prototypes
P_NAME, P_CONTACT, P_HEAD, P_SUMMARY, P_ORG, P_ROLE, P_BULLET, P_BLANK, P_SKILL, P_ADD = 0, 1, 7, 4, 20, 21, 42, 11, 37, 41


def fmt_month(ym):
    y, m = ym.split('-')
    return f"{MONTHS[int(m) - 1]} {y}"


def fmt_dates(s):
    """Profile date string -> 'Mon. YYYY – Mon. YYYY'. Unknown shapes are returned unchanged."""
    if not s:
        return ''
    s = s.strip()
    expected = '(expected)' in s.lower()
    s = re.sub(r'\s*\(expected\)', '', s, flags=re.I).strip()
    m = re.fullmatch(r'(\d{4}-\d{2})\s+to\s+(present|\d{4}-\d{2})', s, flags=re.I)
    if m:
        end = 'Present' if m.group(2).lower() == 'present' else fmt_month(m.group(2))
        out = f"{fmt_month(m.group(1))} – {end}"
    elif re.fullmatch(r'\d{4}-\d{2}', s):
        out = fmt_month(s)
    else:
        return s
    return out + (' (expected)' if expected else '')


def mk_run(text='', bold=False, italic=False, smallcaps=False, size=None, tab=False, heading=False):
    r = OxmlElement('w:r')
    rpr = OxmlElement('w:rPr')
    f = OxmlElement('w:rFonts')
    f.set(qn('w:asciiTheme'), 'minorHAnsi'); f.set(qn('w:eastAsiaTheme'), 'minorEastAsia')
    f.set(qn('w:hAnsiTheme'), 'minorHAnsi'); f.set(qn('w:cstheme'), 'minorBidi')
    rpr.append(f)
    if bold:
        rpr.append(OxmlElement('w:b')); rpr.append(OxmlElement('w:bCs'))
    if italic:
        rpr.append(OxmlElement('w:i')); rpr.append(OxmlElement('w:iCs'))
    if smallcaps:
        rpr.append(OxmlElement('w:smallCaps'))
    if heading:
        sp = OxmlElement('w:spacing'); sp.set(qn('w:val'), '5'); rpr.append(sp)
        k = OxmlElement('w:kern'); k.set(qn('w:val'), '28'); rpr.append(k)
    if size:
        for tag in ('w:sz', 'w:szCs'):
            e = OxmlElement(tag); e.set(qn('w:val'), str(size)); rpr.append(e)
    r.append(rpr)
    if tab:
        r.append(OxmlElement('w:tab'))
    else:
        t = OxmlElement('w:t'); t.text = text
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
        r.append(t)
    return r


def build(spec, template, out, make_pdf=False):
    d = docx.Document(template)
    protos = {i: copy.deepcopy(p._p) for i, p in enumerate(d.paragraphs)}
    body = d.element.body
    sect = body.find(qn('w:sectPr'))
    for child in list(body):
        if child is not sect:
            body.remove(child)
    sources = []

    def para(proto_idx, runs):
        p = copy.deepcopy(protos[proto_idx])
        for ch in list(p):
            if ch.tag != qn('w:pPr'):
                p.remove(ch)
        for r in runs:
            p.append(r)
        sect.addprevious(p)

    def blank():
        para(P_BLANK, [])

    def heading(text):
        para(P_HEAD, [mk_run(text, bold=True, smallcaps=True, heading=True)])

    def bullet(b):
        para(P_BULLET, [mk_run(b['text'])])
        sources.append({'text': b['text'], 'sources': b.get('sources', [])})

    def entry(e, first_key='org', second_key='role'):
        line1 = [mk_run(e[first_key], smallcaps=True)]
        if e.get('descriptor'):
            line1 += [mk_run(' | ', smallcaps=True), mk_run(e['descriptor'], smallcaps=True)]
        if e.get('location'):
            line1 += [mk_run(tab=True), mk_run(e['location'], smallcaps=True)]
        para(P_ORG, line1)
        line2 = [mk_run(e[second_key], italic=True)]
        if e.get('dates'):
            line2 += [mk_run(tab=True), mk_run(fmt_dates(e['dates']), smallcaps=True)]
        para(P_ROLE, line2)
        for b in e.get('bullets', []):
            bullet(b)

    para(P_NAME, [mk_run(spec['name'], smallcaps=True, size=36)])
    c = spec['contact']
    parts = [x for x in (c.get('email'), c.get('phone'), c.get('linkedin'), c.get('location')) if x]
    para(P_CONTACT, [mk_run(' | '.join(parts))])
    blank()
    if spec.get('summary', {}).get('text'):
        heading('Professional Summary')
        para(P_SUMMARY, [mk_run(spec['summary']['text'])])
        sources.append({'text': spec['summary']['text'], 'sources': spec['summary'].get('sources', [])})
        blank()
    heading('Education')
    for i, e in enumerate(spec.get('education', [])):
        if i: blank()
        entry(e, 'org', 'degree')
    blank()
    heading('Professional Experience')
    for i, e in enumerate(spec.get('experience', [])):
        if i: blank()
        entry(e)
    blank()
    heading('Skills')
    for s in spec.get('skills', []):
        para(P_SKILL, [mk_run(s['label'] + ':', bold=True), mk_run(' ' + s['text'])])
        sources.append({'text': s['label'] + ': ' + s['text'], 'sources': s.get('sources', [])})
    if spec.get('additional'):
        blank()
        heading('Additional Experience')
        for i, e in enumerate(spec['additional']):
            if i: blank()
            line = [mk_run(e['title'], smallcaps=True)]
            if e.get('dates'):
                line += [mk_run(tab=True), mk_run(fmt_dates(e['dates']), smallcaps=True)]
            para(P_ADD, line)
            for b in e.get('bullets', []):
                bullet(b)
    # drop the template's review comments and related parts
    for rid, rel in list(d.part.rels.items()):
        if any(k in rel.reltype for k in ('comments', 'people')):
            del d.part.rels[rid]
    d.save(out)
    with open(out + '.sources.json', 'w', encoding='utf8') as f:
        json.dump(sources, f, ensure_ascii=False, indent=1)
    pages = None
    if make_pdf:
        outdir = os.path.dirname(os.path.abspath(out))
        subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', outdir, out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
        pdf = os.path.splitext(os.path.abspath(out))[0] + '.pdf'
        info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
        m = re.search(r'Pages:\s+(\d+)', info)
        pages = int(m.group(1)) if m else None
    return pages


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    tpl = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sample', 'IENYC_CV_Template.docx')
    if '--template' in sys.argv:
        tpl = sys.argv[sys.argv.index('--template') + 1]
        args = [a for a in args if a != tpl]
    spec = json.load(open(args[0], encoding='utf8'))
    pages = build(spec, tpl, args[1], make_pdf='--pdf' in sys.argv)
    print(json.dumps({'out': args[1], 'pages': pages}))
