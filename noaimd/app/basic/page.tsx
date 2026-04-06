export default function BasicPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 两栏布局 - 左侧 65%，右侧 35% */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', flexWrap: 'wrap' }}>
          {/* 左侧主内容 */}
          <div style={{ width: '100%', flex: '2' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>Test Page</h1>
            
            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
              <p style={{ fontSize: '18px' }}>
                This is a test page to verify the two-column layout using basic HTML and CSS.
              </p>
            </div>

            <div style={{ backgroundColor: '#e6f7ff', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>The Problem</h2>
              <p style={{ marginBottom: '16px' }}>
                User loves Markdown but hates that their editor now takes 5 seconds to load because of forced AI indexing and 'smart' features.
              </p>
              <p>
                In today's digital landscape, it feels like every software company is rushing to integrate AI into their products, regardless of whether it actually adds value.
              </p>
            </div>
          </div>

          {/* 右侧侧边栏 */}
          <div style={{ width: '100%', flex: '1' }}>
            <div style={{ backgroundColor: '#f6ffed', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Zero Latency</h2>
              <p>Opens in under 100ms. No AI bloat slowing you down.</p>
            </div>

            <div style={{ backgroundColor: '#f6ffed', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>100% Private</h2>
              <p>Your data never leaves your device. No cloud, no tracking.</p>
            </div>

            <a
              href="/"
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '16px 24px',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              START WRITING NOW
            </a>
          </div>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>
            <strong>NoAIMD</strong> - The only editor that doesn't spy on your thoughts with AI.
          </p>
          <p>
            support: 457239850@qq.com
          </p>
        </div>
      </div>
    </div>
  )
}
