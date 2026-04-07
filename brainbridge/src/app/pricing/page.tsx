import { useEffect, useRef, useState } from 'react';

export default function Pricing() {
  const [isPro, setIsPro] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const uid = useRef('test-user'); // 实际应用中应该从认证状态获取

  // 检查用户是否为 Pro
  useEffect(() => {
    // 实际应用中应该从 Firebase 或其他认证系统获取用户状态
    // 这里模拟检查
    const checkProStatus = async () => {
      // 模拟 API 调用
      setIsPro(false);
    };
    checkProStatus();
  }, []);

  // 集成 PayPal JS SDK
  useEffect(() => {
    if (isPro) return;

    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '6.90'
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log('Payment approved:', order);
            
            // 调用后端 API 将用户状态置为 Pro
            try {
              const response = await fetch('/api/upgrade-to-pro', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid: uid.current }),
              });
              
              if (response.ok) {
                alert('恭喜！您已成功升级到 Pro 版本');
                setIsPro(true);
              } else {
                alert('升级失败，请稍后再试');
              }
            } catch (error) {
              console.error('Error upgrading to pro:', error);
              alert('升级失败，请稍后再试');
            }
          },
          onError: (error: any) => {
            console.error('PayPal error:', error);
            alert('支付失败，请稍后再试');
          }
        }).render(paypalRef.current!);
      }
    };
    
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [isPro]);

  if (isPro) {
    return (
      <div className="flex min-h-screen flex-col p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">价格方案</h1>
          <div className="bg-card rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">🎉 您已升级到 Pro 版本</h2>
            <p className="text-lg mb-6">享受无限记忆和所有高级功能！</p>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition-colors hover:bg-primary/90"
              href="/app"
            >
              前往记忆库
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">价格方案</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">免费版</h2>
            <p className="text-3xl font-bold mb-4">$0</p>
            <ul className="space-y-2 mb-6">
              <li>最多 5 条记忆</li>
              <li>基本功能</li>
              <li>社区支持</li>
            </ul>
            <a
              className="flex h-10 items-center justify-center rounded-md border border-solid border-primary px-4 text-primary transition-colors hover:bg-primary/10"
              href="/app"
            >
              开始使用
            </a>
          </div>
          <div className="bg-card rounded-lg p-6 border-2 border-primary">
            <h2 className="text-xl font-semibold mb-2">专业版</h2>
            <p className="text-3xl font-bold mb-4">$6.9</p>
            <p className="text-sm text-muted-foreground mb-6">终身访问</p>
            <ul className="space-y-2 mb-6">
              <li>无限记忆</li>
              <li>高级功能</li>
              <li>优先支持</li>
            </ul>
            <div ref={paypalRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}