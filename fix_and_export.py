import docx
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
import zipfile
import xml.etree.ElementTree as ET
import os
import shutil
import subprocess

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"

ET.register_namespace('w', W_NS)
ET.register_namespace('wp', WP_NS)
ET.register_namespace('a', A_NS)

src_docx = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_updated__2_.docx'
out_dir = r'C:\Users\ashra\Downloads'
mod_docx = os.path.join(out_dir, 'BurnTheMap_Project_Synopsis_Updated_Final.docx')
mod_pdf = os.path.join(out_dir, 'BurnTheMap_Project_Synopsis_Updated_Final.pdf')

temp_dir = os.path.join(out_dir, '_temp_extract2')
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)

with zipfile.ZipFile(src_docx, 'r') as z:
    z.extractall(temp_dir)

doc_xml_path = os.path.join(temp_dir, 'word', 'document.xml')
tree = ET.parse(doc_xml_path)
root = tree.getroot()

# 1. Update Chapter 1 Reference Numbers (Unbold, remove Arial/size overrides)
for p in root.iter(f'{{{W_NS}}}p'):
    p_text = ''.join([n.text for n in p.iter(f'{{{W_NS}}}t') if n.text])
    if any(k in p_text for k in ['Chapter 1', '1.1', '1.2', '1.3', 'Background and Motivation', 'The Genesis', 'Table 1.1']):
        for r in p.iter(f'{{{W_NS}}}r'):
            r_text = ''.join([n.text for n in r.iter(f'{{{W_NS}}}t') if n.text])
            if r_text.strip() in ('[14]', '[1]-[4], [6]'):
                rPr = r.find(f'{{{W_NS}}}rPr')
                if rPr is not None:
                    for tag in ('b', 'bCs', 'rFonts', 'sz', 'szCs'):
                        for elem in rPr.findall(f'{{{W_NS}}}{tag}'):
                            rPr.remove(elem)
                print(f"Cleaned reference run XML: {r_text}")

# 2. Reformat Section 4.1 Project Objective into points starting with "To develop"
body = root.find(f'{{{W_NS}}}body')
target_p = None
for p in list(body.iter(f'{{{W_NS}}}p')):
    p_text = ''.join([n.text for n in p.iter(f'{{{W_NS}}}t') if n.text])
    if 'The core objective is to design and engineer a full-stack, map-first real estate marketplace. This involves developing' in p_text:
        target_p = p
        break

if target_p is not None:
    print("Found Section 4.1 paragraph!")
    idx = list(body).index(target_p)
    
    # Intro paragraph
    p_intro = ET.Element(f'{{{W_NS}}}p')
    pPr_intro = ET.SubElement(p_intro, f'{{{W_NS}}}pPr')
    ET.SubElement(pPr_intro, f'{{{W_NS}}}pStyle', {f'{{{W_NS}}}val': 'BodyText'})
    ET.SubElement(pPr_intro, f'{{{W_NS}}}spacing', {f'{{{W_NS}}}line': '271', f'{{{W_NS}}}lineRule': 'auto', f'{{{W_NS}}}after': '120'})
    ET.SubElement(pPr_intro, f'{{{W_NS}}}jc', {f'{{{W_NS}}}val': 'both'})
    r_intro = ET.SubElement(p_intro, f'{{{W_NS}}}r')
    t_intro = ET.SubElement(r_intro, f'{{{W_NS}}}t')
    t_intro.text = "The core objective is to design and engineer a full-stack, map-first real estate marketplace through the following key objectives:"
    body.insert(idx, p_intro)
    idx += 1

    points = [
        "To develop a responsive, server-rendered Next.js frontend with an interactive Google Maps search surface, custom pins and marker clustering as the primary discovery interface.",
        "To develop advanced multi-criteria filtering across price, bedrooms, locality and amenities that stays synchronized live with the map view.",
        "To develop a RESTful Node.js/Express backend with full CRUD for listings and real-time synchronization between owner updates and buyer views.",
        "To develop a persistent Saved Properties feature alongside a criteria-driven Search Alert subscription mechanism.",
        "To develop an automated Nodemailer email engine that dispatches alerts the moment a new listing matches saved criteria.",
        "To develop secure JWT authentication and authorization, with OAuth planned as an extension, to distinguish buyer/renter from owner/agent accounts.",
        "To develop unit, integration and system-level testing pipelines covering search accuracy, map responsiveness and alert-delivery latency."
    ]
    
    for pt in points:
        p_pt = ET.Element(f'{{{W_NS}}}p')
        pPr_pt = ET.SubElement(p_pt, f'{{{W_NS}}}pPr')
        ET.SubElement(pPr_pt, f'{{{W_NS}}}pStyle', {f'{{{W_NS}}}val': 'BodyText'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}spacing', {f'{{{W_NS}}}line': '271', f'{{{W_NS}}}lineRule': 'auto', f'{{{W_NS}}}after': '120'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}ind', {f'{{{W_NS}}}left': '720', f'{{{W_NS}}}hanging': '360'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}jc', {f'{{{W_NS}}}val': 'both'})
        
        r_b = ET.SubElement(p_pt, f'{{{W_NS}}}r')
        t_b = ET.SubElement(r_b, f'{{{W_NS}}}t', {'xml:space': 'preserve'})
        t_b.text = "• "
        
        r_t = ET.SubElement(p_pt, f'{{{W_NS}}}r')
        t_t = ET.SubElement(r_t, f'{{{W_NS}}}t')
        t_t.text = pt
        
        body.insert(idx, p_pt)
        idx += 1

    body.remove(target_p)

# 3. Fit all tables within max width 8640 twips (6.0 inches)
MAX_TWIPS = 8640
for tbl in root.iter(f'{{{W_NS}}}tbl'):
    tblPr = tbl.find(f'{{{W_NS}}}tblPr')
    if tblPr is not None:
        tblW = tblPr.find(f'{{{W_NS}}}tblW')
        if tblW is not None:
            w_val = tblW.attrib.get(f'{{{W_NS}}}w')
            w_type = tblW.attrib.get(f'{{{W_NS}}}type')
            if w_type == 'dxa' and w_val and int(w_val) > MAX_TWIPS:
                tblW.set(f'{{{W_NS}}}w', str(MAX_TWIPS))
        # Ensure table alignment is centered or left within margin
        tblInd = tblPr.find(f'{{{W_NS}}}tblInd')
        if tblInd is not None:
            tblInd.set(f'{{{W_NS}}}w', '0')

# 4. Fit all drawing images within max width 5486400 EMUs (6.0 inches)
MAX_EMUS = 5486400
for extent in root.iter(f'{{{WP_NS}}}extent'):
    cx = int(extent.attrib.get('cx', '0'))
    cy = int(extent.attrib.get('cy', '0'))
    if cx > MAX_EMUS and cx > 0:
        ratio = MAX_EMUS / cx
        extent.set('cx', str(MAX_EMUS))
        extent.set('cy', str(int(cy * ratio)))

for ext in root.iter(f'{{{A_NS}}}ext'):
    cx = int(ext.attrib.get('cx', '0'))
    cy = int(ext.attrib.get('cy', '0'))
    if cx > MAX_EMUS and cx > 0:
        ratio = MAX_EMUS / cx
        ext.set('cx', str(MAX_EMUS))
        ext.set('cy', str(int(cy * ratio)))

# 5. Update Section Properties (sectPr) for margins and page borders
# Guidelines: Top: 1" (1440), Bottom: 1" (1440), Right: 1" (1440), Left: 1.5" (2160), Header: 0.5" (720), Footer: 0.5" (720)
for sect in root.iter(f'{{{W_NS}}}sectPr'):
    pgMar = sect.find(f'{{{W_NS}}}pgMar')
    if pgMar is None:
        pgMar = ET.SubElement(sect, f'{{{W_NS}}}pgMar')
    pgMar.set(f'{{{W_NS}}}top', '1440')
    pgMar.set(f'{{{W_NS}}}bottom', '1440')
    pgMar.set(f'{{{W_NS}}}left', '2160')
    pgMar.set(f'{{{W_NS}}}right', '1440')
    pgMar.set(f'{{{W_NS}}}header', '720')
    pgMar.set(f'{{{W_NS}}}footer', '720')
    pgMar.set(f'{{{W_NS}}}gutter', '0')
    
    pgBorders = sect.find(f'{{{W_NS}}}pgBorders')
    if pgBorders is None:
        pgBorders = ET.SubElement(sect, f'{{{W_NS}}}pgBorders')
    pgBorders.set(f'{{{W_NS}}}offsetFrom', 'text')
    
    for side in ('top', 'left', 'bottom', 'right'):
        side_elem = pgBorders.find(f'{{{W_NS}}}{side}')
        if side_elem is None:
            side_elem = ET.SubElement(pgBorders, f'{{{W_NS}}}{side}')
        side_elem.set(f'{{{W_NS}}}val', 'single')
        side_elem.set(f'{{{W_NS}}}sz', '8')
        side_elem.set(f'{{{W_NS}}}space', '24')
        side_elem.set(f'{{{W_NS}}}color', '000000')

tree.write(doc_xml_path, xml_declaration=True, encoding='utf-8')

# Re-zip
with zipfile.ZipFile(mod_docx, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for root_dir, dirs, files in os.walk(temp_dir):
        for file in files:
            full_p = os.path.join(root_dir, file)
            rel_p = os.path.relpath(full_p, temp_dir)
            z_out.write(full_p, rel_p)

shutil.rmtree(temp_dir)
print(f"Rebuilt DOCX cleanly: {mod_docx}")
