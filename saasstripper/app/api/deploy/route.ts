import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { 
  sanitizeOutput, 
  getClientIP, 
  getSecurityHeaders,
  validateJSON,
  checkRateLimit 
} from "@/lib/security";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * 检查匿名用户使用限制
 * 基于 IP 的 24 小时限制
 */
async function checkAnonymousLimit(
  clientIP: string, 
  supabase: SupabaseClient
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = 1;
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { count, error } = await supabase
    .from("endpoints")
    .select("*", { count: "exact", head: true })
    .eq("is_anonymous", true)
    .eq("client_ip", clientIP)
    .gte("created_at", windowStart);
  
  if (error) {
    console.error("Anonymous limit check error:", error);
    return { allowed: false, remaining: 0 };
  }
  
  return {
    allowed: (count || 0) < limit,
    remaining: Math.max(0, limit - (count || 0))
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. 速率限制检查
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
          resetTime: rateLimit.resetTime 
        },
        { 
          status: 429,
          headers: getSecurityHeaders()
        }
      );
    }

    // 2. 请求体解析和验证
    let body: { jsonData?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_REQUEST_BODY" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { jsonData } = body;

    // 3. 输入验证
    const validation = validateJSON(jsonData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: validation.error },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 4. 数据库配置检查
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Database not configured");
      return NextResponse.json(
        { error: "SERVICE_UNAVAILABLE" },
        { status: 503, headers: getSecurityHeaders() }
      );
    }

    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

    // 5. 数据脱敏处理
    const sanitizedJsonData = sanitizeOutput(jsonData);

    // 6. 匿名用户限制检查
    const { allowed, remaining } = await checkAnonymousLimit(clientIP, supabaseServer);
    
    if (!allowed) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: "You have reached the free limit. Pay $9 to create unlimited endpoints.",
          requiresPayment: true,
          paymentUrl: "https://www.paypal.com/paypalme/xingfangwang/9USD"
        },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // 7. 生成唯一短 ID
    const shortId = nanoid(10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 8. 数据库存储
    const { error: insertError } = await supabaseServer
      .from("endpoints")
      .insert({
        short_id: shortId,
        json_data: sanitizedJsonData,
        is_anonymous: true,
        is_paid: false,
        client_ip: clientIP,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { error: "DATABASE_ERROR" },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    const endpointUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/s/${shortId}`;

    // 9. 成功响应
    return NextResponse.json(
      {
        success: true,
        shortId,
        endpointUrl,
        remainingStrips: remaining - 1,
        expiresAt,
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error("Deploy endpoint error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
