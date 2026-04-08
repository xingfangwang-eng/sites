'use client';

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
                alert('Congratulations! You have successfully upgraded to Pro version');
                setIsPro(true);
              } else {
                alert('Upgrade failed, please try again later');
              }
            } catch (error) {
              console.error('Error upgrading to pro:', error);
              alert('Upgrade failed, please try again later');
            }
          },
          onError: (error: any) => {
            console.error('PayPal error:', error);
            alert('Payment failed, please try again later');
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
          <h1 className="text-3xl font-bold mb-8 text-center">Pricing</h1>
          <div className="bg-card rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">🎉 You've upgraded to Pro version</h2>
            <p className="text-lg mb-6">Enjoy unlimited memories and all premium features!</p>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-primary-foreground transition-colors hover:bg-primary/90"
              href="/app"
            >
              Go to Memory Library
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Pricing</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Free</h2>
            <p className="text-3xl font-bold mb-4">$0</p>
            <ul className="space-y-2 mb-6">
              <li>Up to 5 memories</li>
              <li>Basic features</li>
              <li>Community support</li>
            </ul>
            <a
              className="flex h-10 items-center justify-center rounded-md border border-solid border-primary px-4 text-primary transition-colors hover:bg-primary/10"
              href="/app"
            >
              Get Started
            </a>
          </div>
          <div className="bg-card rounded-lg p-6 border-2 border-primary">
            <h2 className="text-xl font-semibold mb-2">Pro</h2>
            <p className="text-3xl font-bold mb-4">$6.9</p>
            <p className="text-sm text-muted-foreground mb-6">Lifetime access</p>
            <ul className="space-y-2 mb-6">
              <li>Unlimited memories</li>
              <li>Advanced features</li>
              <li>Priority support</li>
            </ul>
            <div ref={paypalRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}