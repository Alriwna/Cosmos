import zipfile
import xml.etree.ElementTree as ET
import os
import shutil
import subprocess

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace('w', W_NS)

src_docx = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_updated__2_ (1) (1) (1).docx'
out_dir = r'C:\Users\ashra\Downloads'
mod_docx = os.path.join(out_dir, 'BurnTheMap_Project_Synopsis_Updated_Final.docx')
mod_pdf = os.path.join(out_dir, 'BurnTheMap_Project_Synopsis_Updated_Final.pdf')

temp_dir = os.path.join(out_dir, '_temp_extract')
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)

with zipfile.ZipFile(src_docx, 'r') as z:
    z.extractall(temp_dir)

doc_xml_path = os.path.join(temp_dir, 'word', 'document.xml')
tree = ET.parse(doc_xml_path)
root = tree.getroot()

# 1. Update Chapter 1 reference numbers run properties (remove bold, font Arial override, size 26)
for p in root.iter(f'{{{W_NS}}}p'):
    p_text = ''.join([n.text for n in p.iter(f'{{{W_NS}}}t') if n.text])
    if 'Chapter 1' in p_text or '1.1' in p_text or '1.2' in p_text or '1.3' in p_text:
        for r in p.iter(f'{{{W_NS}}}r'):
            r_text = ''.join([n.text for n in r.iter(f'{{{W_NS}}}t') if n.text])
            if r_text in ('[14]', '[1]-[4], [6]'):
                rPr = r.find(f'{{{W_NS}}}rPr')
                if rPr is not None:
                    # remove bold
                    for b_elem in rPr.findall(f'{{{W_NS}}}b'):
                        rPr.remove(b_elem)
                    for bcs_elem in rPr.findall(f'{{{W_NS}}}bCs'):
                        rPr.remove(bcs_elem)
                    # remove rFonts
                    for font_elem in rPr.findall(f'{{{W_NS}}}rFonts'):
                        rPr.remove(font_elem)
                    # remove sz / szCs
                    for sz_elem in rPr.findall(f'{{{W_NS}}}sz'):
                        rPr.remove(sz_elem)
                    for szcs_elem in rPr.findall(f'{{{W_NS}}}szCs'):
                        rPr.remove(szcs_elem)
                print(f"Updated reference run text: {r_text}")

# 2. Update Section 4.1 Project Objective into points starting with "To develop"
body = root.find(f'{{{W_NS}}}body')
p_obj_target = None
for p in list(body.iter(f'{{{W_NS}}}p')):
    p_text = ''.join([n.text for n in p.iter(f'{{{W_NS}}}t') if n.text])
    if 'The core objective is to design and engineer a full-stack, map-first real estate marketplace. This involves developing' in p_text:
        p_obj_target = p
        break

if p_obj_target is not None:
    print("Found Section 4.1 target paragraph. Replacing with points...")
    # Create replacement paragraphs
    points = [
        "To develop a responsive, server-rendered Next.js frontend with an interactive Google Maps search surface, custom pins and marker clustering as the primary discovery interface.",
        "To develop advanced multi-criteria filtering across price, bedrooms, locality and amenities that stays synchronized live with the map view.",
        "To develop a RESTful Node.js/Express backend with full CRUD for listings and real-time synchronization between owner updates and buyer views.",
        "To develop a persistent Saved Properties feature alongside a criteria-driven Search Alert subscription mechanism.",
        "To develop an automated Nodemailer email engine that dispatches alerts the moment a new listing matches saved criteria.",
        "To develop secure JWT authentication and authorization, with OAuth planned as an extension, to distinguish buyer/renter from owner/agent accounts.",
        "To develop unit, integration and system-level testing pipelines covering search accuracy, map responsiveness and alert-delivery latency."
    ]
    
    # We will insert intro sentence + bullet point paragraphs before p_obj_target, then remove p_obj_target
    idx = list(body).index(p_obj_target)
    
    # Intro paragraph
    p_intro = ET.Element(f'{{{W_NS}}}p')
    pPr_intro = ET.SubElement(p_intro, f'{{{W_NS}}}pPr')
    ET.SubElement(pPr_intro, f'{{{W_NS}}}pStyle', {f'{{{W_NS}}}val': 'BodyText'})
    p_spacing = ET.SubElement(pPr_intro, f'{{{W_NS}}}spacing', {f'{{{W_NS}}}line': '271', f'{{{W_NS}}}lineRule': 'auto', f'{{{W_NS}}}after': '120'})
    ET.SubElement(pPr_intro, f'{{{W_NS}}}jc', {f'{{{W_NS}}}val': 'both'})
    r_intro = ET.SubElement(p_intro, f'{{{W_NS}}}r')
    t_intro = ET.SubElement(r_intro, f'{{{W_NS}}}t')
    t_intro.text = "The core objective is to design and engineer a full-stack, map-first real estate marketplace through the following key objectives:"
    body.insert(idx, p_intro)
    idx += 1

    for pt in points:
        p_pt = ET.Element(f'{{{W_NS}}}p')
        pPr_pt = ET.SubElement(p_pt, f'{{{W_NS}}}pPr')
        ET.SubElement(pPr_pt, f'{{{W_NS}}}pStyle', {f'{{{W_NS}}}val': 'BodyText'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}spacing', {f'{{{W_NS}}}line': '271', f'{{{W_NS}}}lineRule': 'auto', f'{{{W_NS}}}after': '120'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}ind', {f'{{{W_NS}}}left': '720', f'{{{W_NS}}}hanging': '360'})
        ET.SubElement(pPr_pt, f'{{{W_NS}}}jc', {f'{{{W_NS}}}val': 'both'})
        
        # Bullet symbol run
        r_b = ET.SubElement(p_pt, f'{{{W_NS}}}r')
        t_b = ET.SubElement(r_b, f'{{{W_NS}}}t', {'xml:space': 'preserve'})
        t_b.text = "• "
        
        # Text run
        r_t = ET.SubElement(p_pt, f'{{{W_NS}}}r')
        t_t = ET.SubElement(r_t, f'{{{W_NS}}}t')
        t_t.text = pt
        
        body.insert(idx, p_pt)
        idx += 1

    body.remove(p_obj_target)

# 3. Update Section Properties (sectPr) for margins and page borders
# Guidelines:
# Margins: Top: 1" (1440), Bottom: 1" (1440), Right: 1" (1440), Left: 1.5" (2160)
# Header: 0.5" (720), Footer: 0.5" (720)
for sect in root.iter(f'{{{W_NS}}}sectPr'):
    # pgMar
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
    
    # pgBorders
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

# Re-zip to mod_docx
with zipfile.ZipFile(mod_docx, 'w', zipfile.ZIP_DEFLATED) as z_out:
    for root_dir, dirs, files in os.walk(temp_dir):
        for file in files:
            full_p = os.path.join(root_dir, file)
            rel_p = os.path.relpath(full_p, temp_dir)
            z_out.write(full_p, rel_p)

shutil.rmtree(temp_dir)
print(f"Successfully generated modified docx: {mod_docx}")
