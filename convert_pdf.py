import subprocess
import os
import shutil

ps_code = """
$docPath = "C:\\Users\\ashra\\Downloads\\BurnTheMap_Project_Synopsis_Updated_Final.docx"
$pdfPath = "C:\\Users\\ashra\\Downloads\\BurnTheMap_Project_Synopsis_Updated_Final.pdf"

$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc = $word.Documents.Open($docPath)

# Set page setup margins and borders on all sections
foreach ($sect in $doc.Sections) {
    $ps = $sect.PageSetup
    $ps.TopMargin = 72      # 1.0 inch
    $ps.BottomMargin = 72   # 1.0 inch
    $ps.LeftMargin = 108    # 1.5 inch
    $ps.RightMargin = 72    # 1.0 inch
    $ps.HeaderDistance = 36 # 0.5 inch
    $ps.FooterDistance = 36 # 0.5 inch
    
    # Page Borders: 1 = wdBorderDistanceFromText, 0 = wdBorderDistanceFromPageEdge
    $ps.Borders.DistanceFrom = 1
    $ps.Borders.Enable = 1
}

# Save DOCX
$doc.Save()

# Export as PDF (17 = wdExportFormatPDF)
$doc.ExportAsFixedFormat($pdfPath, 17)

$doc.Close()
$word.Quit()

Write-Host "DOCX and PDF generated successfully!"
"""

with open('run_word_export.ps1', 'w', encoding='utf-8') as f:
    f.write(ps_code)

res = subprocess.run(['powershell', '-ExecutionPolicy', 'Bypass', '-File', 'run_word_export.ps1'], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)

if os.path.exists('run_word_export.ps1'):
    os.remove('run_word_export.ps1')

# Also update the original updated__2_ (1) (1) (1) files
orig_docx = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_updated__2_ (1) (1) (1).docx'
orig_pdf = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_updated__2_ (1) (1) (1).pdf'
mod_docx = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_Updated_Final.docx'
mod_pdf = r'C:\Users\ashra\Downloads\BurnTheMap_Project_Synopsis_Updated_Final.pdf'

shutil.copyfile(mod_docx, orig_docx)
if os.path.exists(mod_pdf):
    shutil.copyfile(mod_pdf, orig_pdf)
    print("Updated original files in Downloads as well!")
