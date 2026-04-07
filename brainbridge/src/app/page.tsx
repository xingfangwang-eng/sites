export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">解决跨平台 AI 记忆断层</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          BrainBridge 帮助您在不同 AI 平台间无缝衔接记忆，让您的智能助手真正理解您的上下文。
        </p>
        <div className="flex gap-4">
          <a
            className="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-primary-foreground transition-colors hover:bg-primary/90"
            href="/app"
          >
            开始使用
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-solid border-primary/30 px-8 text-primary transition-colors hover:bg-primary/10"
            href="/pricing"
          >
            查看价格
          </a>
        </div>
      </div>
    </div>
  );
}
