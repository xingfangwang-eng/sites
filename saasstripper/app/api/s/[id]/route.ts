import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { 
  sanitizeOutput, 
  getClientIP, 
  getSecurityHeaders,
  validateShortId,
  checkRateLimit 
} from "@/lib/security";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * 获取端点数据
 * GET /api/s/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. 参数解析和验证
    const { id } = await params;

    if (!validateShortId(id)) {
      return NextResponse.json(
        { error: "INVALID_ENDPOINT_ID" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 3. 数据库配置检查
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Database not configured");
      return NextResponse.json(
        { error: "SERVICE_UNAVAILABLE" },
        { status: 503, headers: getSecurityHeaders() }
      );
    }

    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

    // 4. 查询端点数据
    const { data, error } = await supabaseServer
      .from("endpoints")
      .select("json_data, is_paid, is_anonymous, expires_at, client_ip")
      .eq("short_id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "ENDPOINT_NOT_FOUND" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // 5. 过期检查
    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
    const now = new Date();

    if (expiresAt && now > expiresAt) {
      return NextResponse.json(
        { 
          error: "ENDPOINT_EXPIRED",
          message: "This endpoint has expired. Pay $9 to keep it forever.",
          paymentUrl: "https://www.paypal.com/paypalme/xingfangwang/9USD"
        },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // 6. 数据脱敏
    const sanitizedData = sanitizeOutput(data.json_data);

    // 7. 成功响应
    return NextResponse.json(sanitizedData, {
      headers: getSecurityHeaders(),
    });

  } catch (error) {
    console.error("Short link GET error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * 删除端点
 * DELETE /api/s/{id}
 * 仅允许创建者（通过 IP 验证）删除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // 2. 参数解析和验证
    const { id } = await params;

    if (!validateShortId(id)) {
      return NextResponse.json(
        { error: "INVALID_ENDPOINT_ID" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 3. 数据库配置检查
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "SERVICE_UNAVAILABLE" },
        { status: 503, headers: getSecurityHeaders() }
      );
    }

    const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

    // 4. 查询端点并验证所有权
    const { data: endpoint, error: fetchError } = await supabaseServer
      .from("endpoints")
      .select("client_ip, is_anonymous")
      .eq("short_id", id)
      .single();

    if (fetchError || !endpoint) {
      return NextResponse.json(
        { error: "ENDPOINT_NOT_FOUND" },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // 5. 权限验证 - 仅允许创建者删除
    // 注意：IP 验证不是完美的安全机制，但在无用户系统下是最可行的方案
    if (endpoint.is_anonymous && endpoint.client_ip !== clientIP) {
      return NextResponse.json(
        { 
          error: "FORBIDDEN",
          message: "You can only delete endpoints created from your IP address"
        },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // 6. 执行删除
    const { error: deleteError } = await supabaseServer
      .from("endpoints")
      .delete()
      .eq("short_id", id);

    if (deleteError) {
      console.error("Delete endpoint error:", deleteError);
      return NextResponse.json(
        { error: "DELETE_FAILED" },
        { status: 500, headers: getSecurityHeaders() }
      );
    }

    // 7. 成功响应
    return NextResponse.json(
      { success: true, message: "Endpoint deleted successfully" },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error("Short link DELETE error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
