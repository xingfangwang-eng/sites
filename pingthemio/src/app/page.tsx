'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { calculateWaitDays } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

interface GhostedEmail {
  name: string;
  email: string;
  lastContactDate: string;
  subjectPreview: string;
}

export default function Home() {
  const { data: session } = useSession();
  
  // Use Zustand store
  const {
    ghostedEmails,
    loading,
    error,
    drawerOpen,
    selectedEmail,
    followUpMessage,
    showToast,
    paymentDialogOpen,
    isPaidUser,
    setDrawerOpen,
    setSelectedEmail,
    setFollowUpMessage,
    setShowToast,
    setPaymentDialogOpen,
    setIsPaidUser,
    fetchGhostedEmails,
    fetchUserSubscription,
    sendPing
  } = useAppStore();

  // Simulate checking if user is paid
  useEffect(() => {
    // In a real app, this would check a database or session
    setIsPaidUser(false); // Default to free user for demo
  }, [session, setIsPaidUser]);

  useEffect(() => {
    if (session?.user) {
      fetchUserSubscription();
      fetchGhostedEmails();
    }
  }, [session, fetchGhostedEmails, fetchUserSubscription]);

  const openDrawer = (email: GhostedEmail) => {
    setSelectedEmail(email);
    setFollowUpMessage(`Hey ${email.name}, just looping back on this. Any update?`);
    setDrawerOpen(true);
  };

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-grid px-4">
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900">
              Stop being ghosted
              <br />
              <span className="text-primary">One click to follow up</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
              PingThem.io identifies ghosted emails and lets you follow up in one click. No complexity, just closings.
            </p>
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-slate-700 font-medium">
                How it works: Sign in with Google → We scan your sent emails → Identify ghosted conversations → One click to follow up
              </p>
            </div>
          </div>

          <button 
            onClick={() => signIn('google')}
            className="bg-primary text-white font-bold text-xl px-12 py-6 rounded-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign in with Google to Start
          </button>
        </div>

        <div className="w-full max-w-md mb-16">
          <div className="border border-slate-200 rounded-lg p-8 text-center card-hover bg-white">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              <span className="text-primary">$9.9</span>
              <span className="text-lg text-slate-500">/mo</span>
            </h2>
            <p className="text-xl font-semibold mb-4 text-slate-800">
              Unlimited Pings
            </p>
            <p className="text-sm text-slate-500">
              Pay via PayPal: <span className="text-slate-700 font-medium">xingfang.wang@gmail.com</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-200 w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              Support:457239850@qq.com
            </p>
            <p className="text-slate-500 text-sm">
              © 2026 PingThem.io. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-grid px-4">
      <header className="py-6 flex justify-between items-center w-full max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Ping<span className="text-primary">Them</span>.io
        </h1>
        <button 
          onClick={() => signOut()}
          className="bg-white border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-lg hover:bg-slate-50 transition-all duration-300 shadow-sm"
        >
          Sign Out
        </button>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto">
        <div className="w-full mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">
            Your <span className="text-primary">Ghosted</span> Emails
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <button 
            onClick={fetchGhostedEmails}
            className="bg-primary text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-primary-dark transition-all duration-300 mb-8 shadow-md"
          >
            {loading ? 'Scanning...' : 'Scan Emails'}
          </button>

          {loading ? (
            <div className="text-center text-lg text-slate-500 py-12">Scanning your emails...</div>
          ) : ghostedEmails.length === 0 ? (
            <div className="text-center text-lg text-slate-500 py-12 bg-white border border-slate-200 rounded-lg">
              No ghosted emails found!
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {ghostedEmails.map((email, index) => {
                const waitDays = calculateWaitDays(email.lastContactDate);
                return (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                      <div className="text-slate-500 font-medium text-sm sm:text-base px-3 py-1 bg-slate-100 rounded-lg">
                        Wait for {waitDays} days
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 text-slate-900">{email.name}</h3>
                        <p className="text-slate-500 text-xs sm:text-sm mb-1">{email.lastContactDate}</p>
                        <p className="text-slate-700 text-sm">{email.subjectPreview}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => openDrawer(email)}
                      className="bg-primary text-white font-bold px-4 sm:px-6 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 text-sm sm:text-lg w-full sm:w-auto shadow-sm"
                    >
                      Ping
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && selectedEmail && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Ping {selectedEmail.name}</h3>
            <textarea 
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              className="w-full p-4 border border-slate-200 rounded-lg mb-6 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Type your follow-up message..."
            />
            <div className="flex space-x-4">
              <button 
                onClick={() => setDrawerOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => selectedEmail && sendPing(selectedEmail, followUpMessage)}
                className="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Dialog */}
      {paymentDialogOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Upgrade to Pro</h3>
            <p className="text-lg mb-6 text-slate-700">
              Unlock unlimited Pings for just $9.9/month
            </p>
            <div className="space-y-4">
              <a 
                href="https://paypal.me/xingfang.wang@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition-colors text-center text-lg shadow-sm"
              >
                Pay via PayPal
              </a>
              <button 
                onClick={() => setPaymentDialogOpen(false)}
                className="w-full bg-slate-100 text-slate-700 font-medium py-4 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-primary text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-300 z-50">
          Follow-up sent. Go close that deal!
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            Support:457239850@qq.com
          </p>
          <p className="text-slate-500 text-sm">
            © 2026 PingThem.io. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
