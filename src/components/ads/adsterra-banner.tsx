const ADSTERRA_KEY = '0f5070e54410fe3ddcbada4c0fd0d684';
const ADSTERRA_INVOKE_URL = `https://www.highperformanceformat.com/${ADSTERRA_KEY}/invoke.js`;

const ADSTERRA_OPTIONS = {
  key: ADSTERRA_KEY,
  format: 'iframe',
  height: 50,
  width: 320,
  params: {},
} as const;

const ADSTERRA_FRAME_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=320, initial-scale=1">
    <style>
      html, body {
        width: 320px;
        height: 50px;
        margin: 0;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script>window.atOptions = ${JSON.stringify(ADSTERRA_OPTIONS)};</script>
    <script src="${ADSTERRA_INVOKE_URL}"></script>
  </body>
</html>`;

const ADSTERRA_FRAME_SRC = `data:text/html;charset=utf-8,${encodeURIComponent(
  ADSTERRA_FRAME_HTML
)}`;

export function AdsterraBanner() {
  return (
    <iframe
      title="Advertisement"
      src={ADSTERRA_FRAME_SRC}
      sandbox="allow-scripts allow-same-origin"
      width={320}
      height={50}
      className="mx-auto block h-[50px] w-[320px] overflow-hidden border-0"
    />
  );
}
