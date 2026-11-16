"""Build the static, Cyrillic payment-bill template; not used in production."""
import argparse
import base64
import io
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

parser = argparse.ArgumentParser()
parser.add_argument("--fonts-dir", type=Path, default=Path("/usr/share/fonts/truetype/dejavu"))
args = parser.parse_args()
pdfmetrics.registerFont(TTFont("BillSans", str(args.fonts_dir / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("BillBold", str(args.fonts_dir / "DejaVuSans-Bold.ttf")))
buffer = io.BytesIO()
c = canvas.Canvas(buffer, pagesize=(420, 595), pageCompression=1, invariant=1)
c.setTitle("Оплата заявки через СБП")
c.setAuthor("Кривые Линии / WEB")
c.setFillColorRGB(.96, .95, .92)
c.rect(0, 0, 420, 595, fill=1, stroke=0)
c.setFillColorRGB(.1, .12, .1)
c.setFont("BillBold", 12)
c.drawString(32, 550, "КРИВЫЕ ЛИНИИ / WEB")
c.setFont("BillSans", 26)
c.drawString(32, 491, "Оплата заявки")
c.setFont("BillSans", 11)
c.setFillColorRGB(.4, .42, .4)
c.drawString(32, 455, "Номер сделки")
c.drawString(32, 377, "Сумма к оплате, ₽")
c.setFillColorRGB(.1, .12, .1)
c.rect(32, 250, 356, 58, fill=1, stroke=0)
c.setFillColorRGB(1, 1, 1)
c.setFont("BillBold", 14)
c.drawCentredString(210, 273, "ОПЛАТИТЬ ЧЕРЕЗ СБП")
c.setFillColorRGB(.1, .12, .1)
c.setFont("BillSans", 11)
for y, line in [
    (225, "Нажмите кнопку, выберите банк"),
    (208, "и подтвердите платёж в приложении."),
    (177, "Перед оплатой проверьте сумму"),
    (160, "и получателя в приложении банка."),
    (117, "Если кнопка не открывается, скопируйте"),
    (100, "ссылку ниже в адресную строку браузера."),
]:
    c.drawString(32, y, line)
c.setFont("Helvetica", 9)
c.drawString(32, 25, "web.curvedlines.ru")
c.showPage()
c.save()
output = Path(__file__).resolve().parents[1] / "app/lib/payment-bill-template.json"
output.write_text(json.dumps({"base64": base64.b64encode(buffer.getvalue()).decode()}, separators=(",", ":")) + "\n")
