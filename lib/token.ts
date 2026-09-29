import crypto from "crypto";

const SECRET = process.env.REPORT_LINK_SECRET || "dateready-development-secret-key-32charsmin!";

export interface SignedTokenPayload {
  assessmentId: string;
  exp: number; // epoch ms
}

export function generateReportToken(assessmentId: string, expiresInHours: number = 72): string {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payload = `${assessmentId}.${exp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyReportToken(token: string): { valid: boolean; assessmentId?: string } {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return { valid: false };

    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");

    if (sig !== expectedSig) return { valid: false };

    const [assessmentId, expStr] = payload.split(".");
    const exp = parseInt(expStr, 10);

    if (Date.now() > exp) {
      return { valid: false }; // expired
    }

    return { valid: true, assessmentId };
  } catch (e) {
    return { valid: false };
  }
}
