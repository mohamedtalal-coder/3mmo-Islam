import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateCertificate(
  studentName: string,
  courseName: string,
  issueDate: string,
  certificateNumber: string
): Promise<Blob> {
  const dateFormatted = new Date(issueDate).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Create an off-screen container to render the certificate HTML
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  // A4 landscape at 2x for crisp output (1684 × 1190)
  const W = 1684;
  const H = 1190;

  container.innerHTML = `
    <div id="cert-root" style="
      width: ${W}px;
      height: ${H}px;
      background: #ffffff;
      font-family: 'Cairo', 'IBM Plex Sans Arabic', 'Amiri', 'Noto Naskh Arabic', sans-serif;
      direction: rtl;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    ">
      <!-- Outer gold border -->
      <div style="
        position: absolute;
        inset: 30px;
        border: 6px solid #D9B861;
        pointer-events: none;
      "></div>
      <!-- Inner gold border -->
      <div style="
        position: absolute;
        inset: 44px;
        border: 1.5px solid #D9B861;
        pointer-events: none;
      "></div>

      <!-- Content wrapper -->
      <div style="
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 80px 120px;
        box-sizing: border-box;
      ">
        <!-- Title -->
        <div style="
          font-size: 80px;
          font-weight: 700;
          color: #D9B861;
          margin-bottom: 40px;
        ">شهادة إتمام</div>

        <!-- Intro -->
        <div style="
          font-size: 36px;
          color: #666666;
          margin-bottom: 30px;
        ">تشهد المنصة بأن</div>

        <!-- Student Name -->
        <div style="
          font-size: 64px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        ">${escapeHtml(studentName)}</div>

        <!-- Divider -->
        <div style="
          width: 400px;
          height: 2px;
          background: #e0e0e0;
          margin: 20px auto;
        "></div>

        <!-- Course intro -->
        <div style="
          font-size: 36px;
          color: #666666;
          margin-top: 30px;
          margin-bottom: 20px;
        ">قد أتم بنجاح متطلبات الدورة التدريبية</div>

        <!-- Course Name -->
        <div style="
          font-size: 52px;
          font-weight: 700;
          color: #D9B861;
          margin-bottom: 40px;
        ">${escapeHtml(courseName)}</div>
      </div>

      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 60px;
        left: 80px;
        right: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        direction: rtl;
      ">
        <div style="color: #666;">
          <span>تاريخ الإصدار: </span>
          <span style="color: #1a1a1a; font-weight: 600;">${escapeHtml(dateFormatted)}</span>
        </div>
        <div style="color: #666;">
          <span>رقم الشهادة: </span>
          <span style="color: #1a1a1a; font-weight: 600;">${escapeHtml(certificateNumber)}</span>
        </div>
      </div>
    </div>
  `;

  const certRoot = container.querySelector('#cert-root') as HTMLElement;

  // Use html2canvas to capture the rendered HTML as a high-quality image
  const canvas = await html2canvas(certRoot, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: W,
    height: H,
  });

  // Create a landscape A4 PDF and embed the canvas as an image
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // Clean up the off-screen container
  document.body.removeChild(container);

  // Return as Blob
  return pdf.output('blob');
}

export async function generateCertificateImage(
  studentName: string,
  courseName: string,
  issueDate: string,
  certificateNumber: string
): Promise<string> {
  const dateFormatted = new Date(issueDate).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  const W = 1684;
  const H = 1190;

  container.innerHTML = `
    <div id="cert-root" style="
      width: ${W}px;
      height: ${H}px;
      background: #ffffff;
      font-family: 'Cairo', 'IBM Plex Sans Arabic', 'Amiri', 'Noto Naskh Arabic', sans-serif;
      direction: rtl;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    ">
      <div style="
        position: absolute;
        inset: 30px;
        border: 6px solid #D9B861;
        pointer-events: none;
      "></div>
      <div style="
        position: absolute;
        inset: 44px;
        border: 1.5px solid #D9B861;
        pointer-events: none;
      "></div>
      <div style="
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 80px 120px;
        box-sizing: border-box;
      ">
        <div style="
          font-size: 80px;
          font-weight: 700;
          color: #D9B861;
          margin-bottom: 40px;
        ">شهادة إتمام</div>
        <div style="
          font-size: 36px;
          color: #666666;
          margin-bottom: 30px;
        ">تشهد المنصة بأن</div>
        <div style="
          font-size: 64px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        ">${escapeHtml(studentName)}</div>
        <div style="
          width: 400px;
          height: 2px;
          background: #e0e0e0;
          margin: 20px auto;
        "></div>
        <div style="
          font-size: 36px;
          color: #666666;
          margin-top: 30px;
          margin-bottom: 20px;
        ">قد أتم بنجاح متطلبات الدورة التدريبية</div>
        <div style="
          font-size: 52px;
          font-weight: 700;
          color: #D9B861;
          margin-bottom: 40px;
        ">${escapeHtml(courseName)}</div>
      </div>
      <div style="
        position: absolute;
        bottom: 60px;
        left: 80px;
        right: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        direction: rtl;
      ">
        <div style="color: #666;">
          <span>تاريخ الإصدار: </span>
          <span style="color: #1a1a1a; font-weight: 600;">${escapeHtml(dateFormatted)}</span>
        </div>
        <div style="color: #666;">
          <span>رقم الشهادة: </span>
          <span style="color: #1a1a1a; font-weight: 600;">${escapeHtml(certificateNumber)}</span>
        </div>
      </div>
    </div>
  `;

  const certRoot = container.querySelector('#cert-root') as HTMLElement;

  const canvas = await html2canvas(certRoot, {
    scale: 0.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: W,
    height: H,
  });

  document.body.removeChild(container);
  return canvas.toDataURL('image/png');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}