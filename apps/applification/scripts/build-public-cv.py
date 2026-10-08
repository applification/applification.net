"""Build the public CV from published professional facts. Requires reportlab."""
import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer

app = Path(__file__).resolve().parents[1]
data = json.loads((app / "content/cv.json").read_text())
output = app / "public/cv/Dave-Hudson-CV.pdf"
output.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CVTitle", fontName="Helvetica-Bold", fontSize=27, leading=31, textColor=colors.HexColor("#202e40")))
styles.add(ParagraphStyle(name="CVHeading", fontName="Helvetica-Bold", fontSize=13, leading=17, spaceBefore=13, spaceAfter=5, textColor=colors.HexColor("#125985")))
styles.add(ParagraphStyle(name="CVBody", fontName="Helvetica", fontSize=10, leading=14, spaceAfter=6, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="CVMeta", fontName="Helvetica", fontSize=9, leading=13, textColor=colors.HexColor("#425367")))

def paragraph(text, style="CVBody"):
    return Paragraph(escape(text), styles[style])

def link(url, label=None):
    return Paragraph(f'<link href="{escape(url)}" color="#125985">{escape(label or url)}</link>', styles["CVMeta"])

story = [paragraph(data["name"], "CVTitle"), Spacer(1, 3 * mm), paragraph(data["role"], "CVHeading"), paragraph(data["stack"]), link(data["profile"]), link(data["linkedin"], "LinkedIn: hudsond"), Spacer(1, 4 * mm), paragraph(data["availability"]), paragraph(data["summary"]), paragraph("Engineering and delivery", "CVHeading")]
for label, text in data["skills"]:
    story.append(Paragraph(f"<b>{escape(label)}:</b> {escape(text)}", styles["CVBody"]))
story.append(paragraph("Selected experience", "CVHeading"))
for entry in data["experience"]:
    block = [paragraph(entry["period"], "CVMeta"), Paragraph(f'<b>{escape(entry["title"])}</b>', styles["CVBody"]), paragraph(entry["detail"])]
    if "url" in entry:
        block.append(link(entry["url"], "Read the case study"))
    block.append(Spacer(1, 2 * mm))
    story.append(KeepTogether(block))
story.extend([paragraph("Credentials", "CVHeading"), paragraph(data["credentials"]), paragraph(data["sourceNote"], "CVMeta")])

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#425367"))
    canvas.drawString(18 * mm, 12 * mm, "Dave Hudson · dave.applification.net")
    canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, str(doc.page))
    canvas.restoreState()

doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=17 * mm, bottomMargin=20 * mm, title="Dave Hudson — Contract frontend and product engineer", author="Dave Hudson")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"Built {output.relative_to(app)}")
