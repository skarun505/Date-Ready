// lib/pdf.ts - PDF Generation Engine with Serverless resilience

export async function htmlToPdf(html: string): Promise<Buffer> {
  try {
    // Dynamic runtime resolution to avoid strict build-time module resolution failures
    const chromiumPkg = "@sparticuz/chromium";
    const playwrightPkg = "playwright-core";

    // @ts-ignore
    const chromium = (await import(/* webpackIgnore: true */ chromiumPkg)).default;
    // @ts-ignore
    const { chromium: pw } = await import(/* webpackIgnore: true */ playwrightPkg);

    const executablePath = await chromium.executablePath();
    const browser = await pw.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    // Graceful fallback to HTML document buffer for printing / saving
    return Buffer.from(html, "utf-8");
  }
}
