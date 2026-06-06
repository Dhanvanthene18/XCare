from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

from reportlab.platypus.tables import Table, TableStyle

from datetime import datetime

# -----------------------------
# GENERATE PDF REPORT
# -----------------------------
def generate_report(data):

    doc = SimpleDocTemplate(
        "health_report.pdf",
        pagesize=letter
    )

    styles = getSampleStyleSheet()

    elements = []

    # -----------------------------
    # TITLE
    # -----------------------------
    title = Paragraph(
        "<font size=20><b>XCare AI Health Report</b></font>",
        styles["Title"]
    )

    elements.append(title)
    elements.append(Spacer(1, 20))

    # -----------------------------
    # DATE
    # -----------------------------
    date_text = datetime.now().strftime(
        "%d-%m-%Y %I:%M %p"
    )

    date_para = Paragraph(
        f"<b>Generated On:</b> {date_text}",
        styles["Normal"]
    )

    elements.append(date_para)
    elements.append(Spacer(1, 15))

    # -----------------------------
    # PATIENT DETAILS TABLE
    # -----------------------------
    patient_data = [

        ["Field", "Value"],

        ["Age", data["age"]],

        ["Gender", data["gender"]],

        ["Height", f'{data["height"]} cm'],

        ["Weight", f'{data["weight"]} kg'],

        ["Symptoms", data["symptoms"]],

        ["Predicted Disease", data["disease"]],

        ["Risk Level", data["risk"]],

        ["Health Score", f'{data["health_score"]}/100'],

        ["BMI", f'{data["bmi"]} ({data["bmi_category"]})']
    ]

    table = Table(patient_data, colWidths=[180, 300])

    table.setStyle(TableStyle([

        ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),

        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),

        ('GRID', (0, 0), (-1, -1), 1, colors.black),

        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),

        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),

        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),

    ]))

    elements.append(table)
    elements.append(Spacer(1, 20))

    # -----------------------------
    # DESCRIPTION
    # -----------------------------
    description = Paragraph(
        f"<b>Description:</b><br/>{data['description']}",
        styles["BodyText"]
    )

    elements.append(description)
    elements.append(Spacer(1, 15))

    # -----------------------------
    # PRECAUTIONS
    # -----------------------------
    precautions_text = "<br/>".join(
        [f"• {p}" for p in data["precautions"]]
    )

    precautions = Paragraph(
        f"<b>Precautions:</b><br/>{precautions_text}",
        styles["BodyText"]
    )

    elements.append(precautions)
    elements.append(Spacer(1, 15))

    # -----------------------------
    # RECOMMENDATION
    # -----------------------------
    recommendation = Paragraph(
        f"<b>Recommendation:</b><br/>{data['recommendation']}",
        styles["BodyText"]
    )

    elements.append(recommendation)
    elements.append(Spacer(1, 20))

    # -----------------------------
    # DISCLAIMER
    # -----------------------------
    disclaimer = Paragraph(
        "<font color='red'><b>Disclaimer:</b> "
        "This report is AI-generated and "
        "not a substitute for professional "
        "medical advice.</font>",
        styles["BodyText"]
    )

    elements.append(disclaimer)

    # -----------------------------
    # BUILD PDF
    # -----------------------------
    doc.build(elements)