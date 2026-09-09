import { readFile, writeFile  } from 'node:fs/promises';
import { resolve } from 'node:path';
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

const LOGO_PATH = resolve(
  process.cwd(),
  'public/pc-logo/printcampus-logo-w-removebg-preview.png',
);

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

  const logo = await readFile(LOGO_PATH);
  const logoDataUrl = `data:image/png;base64,${logo.toString('base64')}`;

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
      width: 500,
      height: 500,
      bgColor: '#ffffff',
      borderWidth: 8,
      borderRadius: 12,
    },
  });

  return qrCode.getSvgString();
}


const qrRes =  await generateQrCode('https://printcampus.com', 500)
await writeFile('public/qr-code.svg', qrRes, 'utf8');