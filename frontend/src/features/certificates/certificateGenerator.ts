import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCertificateHTML(
  studentName: string,
  contextName: string,
  issueDate: string,
  certificateNumber: string,
  score: number | null,
  rank: number | null,
  conditionType: string,
  W: number,
  H: number
): string {
  const dateFormatted = new Date(issueDate).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let extraContent = '';
  if (conditionType === 'SCORE' && score !== null) {
    extraContent = `
      <div style="font-size: 32px; color: #7A2E3A; font-weight: bold; margin-top: 20px;">
        بدرجة اجتياز: ${score}%
      </div>
    `;
  } else if (conditionType === 'TOP_N' && rank !== null) {
    extraContent = `
      <div style="font-size: 32px; color: #7A2E3A; font-weight: bold; margin-top: 20px;">
        المركز: ${rank}
      </div>
    `;
  }

  return `
    <div id="cert-root" style="
      width: ${W}px;
      height: ${H}px;
      background: #FAF8F5;
      font-family: 'Cairo', 'IBM Plex Sans Arabic', 'Amiri', 'Noto Naskh Arabic', sans-serif;
      direction: rtl;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    ">
      <!-- Outer border -->
      <div style="
        position: absolute;
        inset: 30px;
        border: 6px solid #7A2E3A;
        pointer-events: none;
      "></div>
      <!-- Inner border -->
      <div style="
        position: absolute;
        inset: 44px;
        border: 2px solid #D8A55A;
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
        <div style="font-size: 80px; font-weight: 900; color: #7A2E3A; margin-bottom: 20px;">شهادة اجتياز</div>
        
        <div style="font-size: 36px; color: #5B4332; margin-bottom: 30px;">تفتخر المنصة بتقديم هذه الشهادة إلى</div>
        
        <div style="font-size: 64px; font-weight: 800; color: #D8A55A; margin-bottom: 20px;">${escapeHtml(studentName)}</div>
        
        <div style="width: 400px; height: 2px; background: #D8A55A; margin: 20px auto;"></div>
        
        <div style="font-size: 36px; color: #5B4332; margin-top: 30px; margin-bottom: 20px;">لإتمام متطلبات اختبار</div>
        
        <div style="font-size: 52px; font-weight: 800; color: #7A2E3A; margin-bottom: 10px;">${escapeHtml(contextName)}</div>

        ${extraContent}
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
        font-weight: 600;
      ">
        <div style="color: #5B4332;">
          <span>تاريخ الإصدار: </span>
          <span style="color: #7A2E3A;">${escapeHtml(dateFormatted)}</span>
        </div>
        <div style="color: #5B4332;">
          <span>رقم الشهادة: </span>
          <span style="color: #7A2E3A;">${escapeHtml(certificateNumber)}</span>
        </div>
      </div>
    </div>
  `;
}

export async function generateCertificate(
  studentName: string,
  contextName: string,
  issueDate: string,
  certificateNumber: string,
  score: number | null = null,
  rank: number | null = null,
  conditionType: string = 'SCORE'
): Promise<Blob> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  const W = 1684;
  const H = 1190;
  container.innerHTML = getCertificateHTML(studentName, contextName, issueDate, certificateNumber, score, rank, conditionType, W, H);

  const certRoot = container.querySelector('#cert-root') as HTMLElement;
  const canvas = await html2canvas(certRoot, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#FAF8F5',
    width: W,
    height: H,
  });

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
  
  document.body.removeChild(container);
  return pdf.output('blob');
}

export async function generateCertificateImage(
  studentName: string,
  contextName: string,
  issueDate: string,
  certificateNumber: string,
  score: number | null = null,
  rank: number | null = null,
  conditionType: string = 'SCORE'
): Promise<string> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  document.body.appendChild(container);

  const W = 1684;
  const H = 1190;
  container.innerHTML = getCertificateHTML(studentName, contextName, issueDate, certificateNumber, score, rank, conditionType, W, H);

  const certRoot = container.querySelector('#cert-root') as HTMLElement;
  const canvas = await html2canvas(certRoot, {
    scale: 0.5,
    useCORS: true,
    backgroundColor: '#FAF8F5',
    width: W,
    height: H,
  });

  document.body.removeChild(container);
  return canvas.toDataURL('image/png');
}