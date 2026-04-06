export default function TestPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 两栏布局 - 左侧 65%，右侧 35% */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          {/* 左侧主内容 */}
          <div className="col-span-1 md:col-span-6.5">
            <div className="bg-blue-100 p-6 mb-6">
              <h1 className="text-3xl font-bold mb-4">Left Column (65%)</h1>
              <p>This is the left column content. It should take up 65% of the width on desktop.</p>
            </div>
            <div className="bg-blue-100 p-6">
              <h2 className="text-2xl font-bold mb-4">More Content</h2>
              <p>Additional content in the left column.</p>
            </div>
          </div>

          {/* 右侧侧边栏 */}
          <div className="col-span-1 md:col-span-3.5">
            <div className="bg-green-100 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Right Column (35%)</h2>
              <p>This is the right column content. It should take up 35% of the width on desktop.</p>
            </div>
            <div className="bg-green-100 p-6">
              <h3 className="text-xl font-bold mb-4">Sidebar Content</h3>
              <p>Additional content in the right sidebar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
