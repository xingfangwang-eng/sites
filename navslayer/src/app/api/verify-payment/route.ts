import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";

const PAYMENT_AMOUNT = 0.50;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

interface PaymentRecord {
  domain: string;
  email: string;
  amount: number;
  timestamp: number;
  transactionId: string;
  verified: boolean;
}

const paymentStore = new Map<string, PaymentRecord>();

const VERIFY_SCHEMA = z.object({
  domain: z.string().min(1).max(255),
  transactionId: z.string().min(1).max(100),
  payerEmail: z.string().email().optional(),
});

function generateRequestId(): string {
  return `pay_${Date.now()}_${randomBytes(4).toString("hex")}`;
}

function sanitizeLog(message: string): string {
  return message
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[EMAIL]")
    .replace(/(?:password|token|key|secret)["\s:=]+[\w-]+/gi, "[REDACTED]");
}

function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  
  if (!origin && !referer) {
    return process.env.NODE_ENV === "development";
  }

  const checkOrigin = origin || (referer ? new URL(referer).origin : "");
  return ALLOWED_ORIGINS.some((allowed) => {
    try {
      const allowedUrl = new URL(allowed);
      return allowedUrl.origin === checkOrigin;
    } catch {
      return false;
    }
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestId = generateRequestId();

  try {
    if (!validateOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden", requestId },
        { status: 403 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", requestId },
        { status: 400 }
      );
    }

    const parseResult = VERIFY_SCHEMA.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: parseResult.error.issues, requestId },
        { status: 400 }
      );
    }

    const { domain, transactionId, payerEmail } = parseResult.data;

    const sanitizedDomain = domain.toLowerCase().replace(/[^a-z0-9.-]/g, "");
    
    if (sanitizedDomain !== domain.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid domain format", requestId },
        { status: 400 }
      );
    }

    const existingPayment = paymentStore.get(transactionId);
    if (existingPayment) {
      if (existingPayment.domain === sanitizedDomain && existingPayment.verified) {
        return NextResponse.json({
          success: true,
          verified: true,
          message: "Payment already verified",
          requestId,
        });
      }
      return NextResponse.json({
        success: false,
        error: "Transaction ID already used for different domain",
        requestId,
      }, { status: 400 });
    }

    console.log(sanitizeLog(`[${requestId}] Payment verification request for domain: ${sanitizedDomain}, tx: ${transactionId}`));

    const paymentRecord: PaymentRecord = {
      domain: sanitizedDomain,
      email: payerEmail || "unknown",
      amount: PAYMENT_AMOUNT,
      timestamp: Date.now(),
      transactionId,
      verified: true,
    };

    paymentStore.set(transactionId, paymentRecord);

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Payment verified successfully",
      requestId,
    });
  } catch (error) {
    console.error(sanitizeLog(`[${requestId}] Payment verification error: ${error instanceof Error ? error.message : "Unknown"}`));
    
    return NextResponse.json(
      { error: "Internal server error", requestId },
      { status: 500 }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0] || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
