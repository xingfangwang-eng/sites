import { NextRequest, NextResponse } from "next/server";
import { 
  getClientIP, 
  getSecurityHeaders,
  checkRateLimit 
} from "@/lib/security";

/**
 * 验证输入是否为有效的 JSON 字符串
 */
function validateJSONInput(input: string): { valid: boolean; parsed?: unknown; error?: string } {
  if (!input || typeof input !== "string") {
    return { valid: false, error: "Input must be a non-empty string" };
  }

  // 检查输入大小，防止 DoS
  if (input.length > 100 * 1024) { // 100KB 限制
    return { valid: false, error: "Input size exceeds 100KB limit" };
  }

  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch {
    return { valid: false, error: "Invalid JSON format" };
  }
}

/**
 * 本地 JSON 处理函数
 * 模拟 AI 功能，选择最可能有商业价值的字段
 */
function processJSONLocally(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object") {
    return { message: "Invalid input data" };
  }

  const result: Record<string, unknown> = {};
  const dataObj = data as Record<string, unknown>;
  
  // 优先选择这些有商业价值的字段
  const valuableFields = [
    'price', 'pricing', 'cost', 'amount', 'revenue', 'sales',
    'user', 'customer', 'client', 'email', 'name', 'contact',
    'product', 'service', 'item', 'sku', 'inventory',
    'transaction', 'order', 'payment', 'invoice', 'billing',
    'date', 'timestamp', 'created_at', 'updated_at',
    'status', 'status_code', 'success', 'error',
    'id', 'uuid', 'key', 'token',
    'quantity', 'count', 'total', 'sum',
    'url', 'link', 'website', 'domain',
    'location', 'address', 'country', 'city',
    'phone', 'phone_number', 'mobile',
    'company', 'organization', 'business',
    'description', 'summary', 'notes',
    'category', 'type', 'tag', 'label',
    'score', 'rating', 'review', 'feedback',
    'size', 'weight', 'dimensions',
    'color', 'brand', 'model', 'version',
  ];

  let fieldCount = 0;
  
  // 遍历数据对象，寻找有商业价值的字段
  for (const [key, value] of Object.entries(dataObj)) {
    if (fieldCount >= 5) break; // 最多选择 5 个字段
    
    const lowerKey = key.toLowerCase();
    const isValuable = valuableFields.some(field => 
      lowerKey.includes(field)
    );
    
    if (isValuable && value !== null && value !== undefined) {
      result[key] = value;
      fieldCount++;
    }
  }

  // 如果找到的字段不足 5 个，选择一些其他字段
  if (fieldCount < 5) {
    for (const [key, value] of Object.entries(dataObj)) {
      if (fieldCount >= 5) break;
      if (!result[key] && value !== null && value !== undefined) {
        result[key] = value;
        fieldCount++;
      }
    }
  }

  // 如果还是不足 5 个字段，添加示例数据
  if (Object.keys(result).length === 0) {
    return {
      message: "No valuable fields found",
      sample_data: {
        customer_id: "12345",
        order_total: 99.99,
        order_status: "completed",
        product_name: "Sample Product",
        purchase_date: new Date().toISOString()
      }
    };
  }

  return result;
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

    // 2. 请求体解析
    let body: { jsonInput?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "INVALID_REQUEST_BODY" },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const { jsonInput } = body;

    // 3. JSON 验证
    const validation = validateJSONInput(jsonInput || "");
    if (!validation.valid) {
      return NextResponse.json(
        { error: "INVALID_JSON", message: validation.error },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // 4. 本地处理 JSON
    const processedData = processJSONLocally(validation.parsed!);

    // 5. 成功响应
    return NextResponse.json(
      { result: processedData },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error("Strip JSON error:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
