import { NextRequest, NextResponse } from "next/server";

// 直接导入生成的 Prisma 客户端
const { PrismaClient } = require("../../../node_modules/.prisma/client");

// 全局单例模式
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // 在开发环境中，确保每次热重载时都使用同一个实例
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// 扩展全局类型
declare global {
  var prisma: any;
}

// API Key 校验（预留字段）
function validateApiKey(request: NextRequest) {
  // 从请求头获取 API Key
  const apiKey = request.headers.get('x-api-key');
  
  // 这里可以从环境变量或数据库中获取有效的 API Key
  // 目前使用硬编码的 API Key 作为示例
  const validApiKey = process.env.API_KEY || 'test-api-key';
  
  // 开发环境下可以跳过 API Key 校验
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return apiKey === validApiKey;
}

export async function GET(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contexts = await prisma.context.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(contexts, { status: 200 });
  } catch (error) {
    console.error("Error fetching contexts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
