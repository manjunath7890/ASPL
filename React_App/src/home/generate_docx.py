from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(11)

# ── Title ──
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = title.add_run('ALTENER – VEHICLE SPECIFICATIONS')
run.bold = True
run.font.size = Pt(18)
run.font.color.rgb = RGBColor(0, 0x88, 0xF6)

doc.add_paragraph()

# ── Helper ──
def add_heading_blue(text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(0, 0x77, 0xC0)
    p.space_after = Pt(4)

def add_bullet(text):
    p = doc.add_paragraph(style='List Bullet')
    p.clear()
    label, _, value = text.partition(': ')
    run_label = p.add_run(label + ': ')
    run_label.bold = True
    run_label.font.size = Pt(11)
    run_value = p.add_run(value)
    run_value.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(0)

# ── BUZZ ──
add_heading_blue('BUZZ')

buzz_specs = [
    "Motor: 9 kW PMSM, IP67 Sealed (all-weather)",
    "Battery: 11.8 kWh LiFePO4 (LFP)",
    "System Voltage: 72V",
    "Range: 120–140 km (single charge)",
    "Payload: 550 kg",
    "Gross Weight: 1,100 kg",
    "Top Speed (Eco): 30 km/h",
    "Top Speed (Boost): 50 km/h",
    "Drive Modes: Eco / Boost / Auto / Rev",
    "Auto Mode: Smart switching between Eco and Boost",
    "Transmission: 2-Speed Gearbox (Gear Ratios: 14.96 / 8.06)",
    "Charging: Onboard 25A, 5–6 hrs (0–80%)",
    "Battery Cycles: 2,000+",
    'Display: 7.0" Colour Touch LCD',
    "Cluster Features: Live speed, SoC (battery %), range, trip data, fault codes, maintenance reminders",
    'Reverse Camera: Dedicated 4.3" screen (Container variant)',
    "Start System: Keyless Entry + Encrypted Immobilizer",
    "Connectivity: 4G LTE + GNSS (GPS)",
    "OTA Updates: Yes (remote software)",
    "Fleet Management: Live GPS, Geofencing, Diagnostics",
    "Mobile App: Real-time battery %, range estimate, remote immobilizer, trip logs, SOS, push alerts",
    "Web Portal: Live fleet map, driver scores, idle time monitoring, maintenance tracking, CSV/PDF export",
    "Front Brake: Disc Brake",
    "Rear Brake: Drum Brake",
    "Regenerative Braking: Yes",
    "Tyre Size: 10–12 inch heavy-duty",
    "Front Suspension: Twin Shock Absorbers + Springs",
    "Rear Suspension: Rubber Damping + Shock Absorbers",
    "Chassis: High-strength steel",
    "Gradeability: 26.5%",
    "Hill Hold Assist: Yes",
    "Cooling: Active Controller Cooling",
]

for spec in buzz_specs:
    add_bullet(spec)

doc.add_paragraph()

# ── LITE ──
add_heading_blue('LITE')

lite_specs = [
    "Motor: 6 kW PMSM, IP67 Sealed",
    "Battery: 6.5 kWh LiFePO4 (LFP)",
    "System Voltage: 72V",
    "Range: 100–120 km (single charge)",
    "Payload: 350 kg",
    "Gross Weight: 1,100 kg",
    "Top Speed: 45 km/h",
    "Transmission: Single-Speed Automatic (no gear changing)",
    "Charging: Onboard 25A, 4–5 hrs (0–80%)",
    "Battery Cycles: 2,000+",
    'Display: 5.0" Digital Instrument Cluster',
    "Cluster Features: Live speed, SoC (battery %), range, trip data, fault codes, maintenance reminders",
    'Reverse Camera: Dedicated 4.3" screen (Container variant)',
    "Start System: Physical Key",
    "Connectivity: 4G LTE + GNSS (GPS)",
    "OTA Updates: Yes (remote software)",
    "Fleet Management: Live GPS, Geofencing, Diagnostics",
    "Mobile App: Real-time battery %, range estimate, remote immobilizer, trip logs, SOS, push alerts",
    "Web Portal: Live fleet map, driver scores, idle time monitoring, maintenance tracking, CSV/PDF export",
    "Front Brake: Drum Brake",
    "Rear Brake: Drum Brake",
    "Regenerative Braking: Yes",
    "Tyre Size: 8 inch city-optimized",
    "Front Suspension: Twin Shock Absorbers + Springs",
    "Rear Suspension: Rubber Damping + Shock Absorbers",
    "Chassis: High-strength steel",
    "Cooling: Active Controller Cooling",
]

for spec in lite_specs:
    add_bullet(spec)

doc.add_paragraph()

# ── Footer ──
footer = doc.add_paragraph()
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = footer.add_run('* Specifications are subject to change without notice.\n* Performance values are under standard test conditions.')
run.font.size = Pt(9)
run.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)
run.italic = True

doc.save(r'd:\Desktop\Programs\Telematics\Client\src\home\AltEner_Vehicle_Specifications.docx')
print("Done – saved AltEner_Vehicle_Specifications.docx")
