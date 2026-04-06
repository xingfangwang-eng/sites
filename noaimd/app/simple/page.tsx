export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-10 gap-8">
          {/* 左侧主内容 */}
          <div className="md:col-span-6.5">
            <h1 className="text-4xl font-bold mb-8">Left Column</h1>
            <div className="bg-gray-100 p-6 mb-6">
              <p>This is the left column content. It should take up 65% of the width on desktop.</p>
            </div>
            <div className="bg-gray-100 p-6">
              <p>More content in the left column.</p>
            </div>
          </div>

          {/* 右侧侧边栏 */}
          <div className="md:col-span-3.5 md:sticky md:top-8">
            <h2 className="text-2xl font-bold mb-4">Right Column</h2>
            <div className="bg-gray-100 p-6 mb-6">
              <p>This is the right column content. It should take up 35% of the width on desktop and be sticky.</p>
            </div>
            <div className="bg-gray-100 p-6">
              <p>More content in the right column.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
