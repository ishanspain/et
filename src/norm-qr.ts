import { writeFile } from 'node:fs/promises';
import QrCodeWithLogo from 'qrcode-with-logos';

type NormalQrCodeInstance = {
  getSvgString(): Promise<string>;
};

const QrCodeWithLogoConstructor = QrCodeWithLogo as unknown as new (options: {
  content: string;
  width: number;
  renderer: 'svg';
  nodeQrCodeOptions: {
    errorCorrectionLevel: 'M';
    margin: number;
  };
}) => NormalQrCodeInstance;

/** Creates a plain SVG QR code with no logo. */
export async function generateNormalQrCode(
  content: string,
  width = 500,
): Promise<string> {
  if (!content.trim()) {
    throw new TypeError('QR code content must not be empty.');
  }

  const qrCode = new QrCodeWithLogoConstructor({
    content,
    width,
    renderer: 'svg',
    nodeQrCodeOptions: {
      errorCorrectionLevel: 'M',
      margin: 24,
    },
  });

  return qrCode.getSvgString();
}

const qrRes = await generateNormalQrCode('https://wa.me/918920827507', 500);
await writeFile('public/normal-qr.svg', qrRes, 'utf8');
