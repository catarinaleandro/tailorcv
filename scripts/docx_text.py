#!/usr/bin/env python3
"""Print the plain text of a .docx, one paragraph per line (tabs shown as ' || ')."""
import sys, docx
for p in docx.Document(sys.argv[1]).paragraphs:
    t = p.text.replace('\t', ' || ')
    if t.strip():
        print(t)
