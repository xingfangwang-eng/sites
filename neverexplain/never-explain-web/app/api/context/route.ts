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

// 生成随机4位词的函数
function generateRandomWord(): string {
  const adjectives = ["happy", "quick", "smart", "calm", "bold", "bright", "clean", "cool", "dear", "easy", "fair", "fast", "fine", "fresh", "gentle", "good", "great", "kind", "light", "nice", "pure", "rare", "real", "soft", "sweet", "true", "warm", "wise"];
  const nouns = ["cat", "dog", "bird", "fish", "tree", "flower", "sun", "moon", "star", "cloud", "rain", "wind", "fire", "water", "earth", "air", "book", "pen", "note", "song", "art", "game", "code", "idea", "plan", "goal", "dream", "hope"];
  
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdj}-${randomNoun}`;
}

export async function POST(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }
    
    // 生成唯一的 hook
    let hook;
    let isUnique = false;
    
    while (!isUnique) {
      hook = `recall-${generateRandomWord()}`;
      const existingContext = await prisma.context.findUnique({ where: { hook } });
      if (!existingContext) {
        isUnique = true;
      }
    }
    
    const context = await prisma.context.create({
      data: {
        title,
        content,
        hook,
      },
    });
    
    return NextResponse.json(context, { status: 201 });
  } catch (error) {
    console.error("Error creating context:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // 验证 API Key
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const hook = request.nextUrl.searchParams.get("hook");
    
    if (!hook) {
      return NextResponse.json({ error: "Hook is required" }, { status: 400 });
    }
    
    const context = await prisma.context.findUnique({ where: { hook } });
    
    if (!context) {
      return NextResponse.json({ error: "Context not found" }, { status: 404 });
    }
    
    // 设置 CORS 头
    const response = new NextResponse(context.content, {
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      },
    });
    
    return response;
  } catch (error) {
    console.error("Error getting context:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
