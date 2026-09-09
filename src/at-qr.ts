import { writeFile } from 'node:fs/promises';
import QrCodeWithLogo from 'qrcode-with-logos';

type QrCodeWithLogoInstance = {
  getSvgString(): Promise<string>;
};

// The package ships a CommonJS bundle but declares an ESM default export. Cast
// its runtime default to the constructor shape for NodeNext compatibility.
const QrCodeWithLogoConstructor = QrCodeWithLogo as unknown as new (options: {
  content: string;
  width: number;
  renderer: 'svg';
  nodeQrCodeOptions: {
    errorCorrectionLevel: 'H';
    margin: number;
  };
  logo: {
    src: string;
    width: number;
    height: number;
    bgColor: string;
    borderWidth: number;
    borderRadius: number;
  };
}) => QrCodeWithLogoInstance;

// Vector version of the AT mark. It is embedded as an SVG data URL, so no
// external image file is needed in the generated QR code.
const AT_LOGO_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 123 60">
    <path fill="#4d7fe8" d="M14 47 28 12h11l15 35H44l-3-9H27l-4 9h-9Zm17-16h7l-4-11-3 11Zm20-19h55v9H85v26H75V21H51v-9Z"/>
  </svg>
`;

/**
 * Creates an SVG QR code containing the supplied text and the PrintCampus logo.
 *
 * The SVG is returned as a string so it can be sent in an HTTP response, written
 * to a file, or embedded directly in an HTML page.
 */
export async function generateQrCode(content: string, width = 500): Promise<string> {
  if (!content.trim()) {
    throw new TypeError('QR code content must not be empty.');
  }

  const logoDataUrl = `data:image/svg+xml,${encodeURIComponent(AT_LOGO_SVG)}`;

  const qrCode = new QrCodeWithLogoConstructor({
    content,
    width,
    renderer: 'svg',
    nodeQrCodeOptions: {
      errorCorrectionLevel: 'H',
      margin: 24,
    },
    logo: {
      src: logoDataUrl,
      width: 123,
      height: 60,
      bgColor: '#ffffff',
      borderWidth: 8,
      borderRadius: 12,
    },
  });

  return qrCode.getSvgString();
}


const qrRes =  await generateQrCode('upi://pay?pa=eazypay.8KVDV4D8IDC28NP@icici&pn=MerchantName&cu=INR', 500)
await writeFile('public/amity-at-pay.svg', qrRes, 'utf8');
