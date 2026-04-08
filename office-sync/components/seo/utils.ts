// 生成随机类名的函数
export function generateRandomClasses(seed: string, count: number = 3): string[] {
  const classPrefixes = ['animate-', 'bg-', 'border-', 'text-', 'shadow-'];
  const classSuffixes = [
    'pulse', 'bounce', 'fade-in', 'slide-in', 'scale-in',
    'red-50', 'blue-50', 'green-50', 'yellow-50', 'purple-50',
    'border-slate-100', 'border-slate-200', 'border-slate-300',
    'text-slate-500', 'text-slate-600', 'text-slate-700',
    'shadow-sm', 'shadow-md', 'shadow-lg'
  ];
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const classes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const prefixIndex = (hash + i) % classPrefixes.length;
    const suffixIndex = (hash + i * 2) % classSuffixes.length;
    classes.push(`${classPrefixes[prefixIndex]}${classSuffixes[suffixIndex]}`);
  }
  
  return classes;
}

// 生成随机动画类型的函数
export function getRandomAnimation(seed: string): 'fade' | 'slide' | 'scale' {
  const animations: Array<'fade' | 'slide' | 'scale'> = ['fade', 'slide', 'scale'];
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return animations[hash % animations.length];
}

// 生成随机评论的函数
export function generateRandomComments(seed: string, count: number = 3) {
  const comments = [
    {
      name: 'Anonymous User',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      content: 'This solution saved my life! I can now play games during my lunch break without getting caught.',
      timestamp: '2 days ago'
    },
    {
      name: 'Office Gamer',
      avatar: 'https://randomuser.me/api/portraits/lego/2.jpg',
      content: 'The Excel skin is so realistic that my manager didn\'t even notice I was playing games during our last meeting.',
      timestamp: '1 week ago'
    },
    {
      name: 'Stealth Pro',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      content: 'The mouse movement simulation is perfect. It looks just like I\'m working on spreadsheets.',
      timestamp: '3 days ago'
    },
    {
      name: 'Gaming Employee',
      avatar: 'https://randomuser.me/api/portraits/lego/4.jpg',
      content: 'Finally, a way to balance work and play. The email auto-reply feature is a game-changer.',
      timestamp: '5 days ago'
    },
    {
      name: 'IT Escapee',
      avatar: 'https://randomuser.me/api/portraits/lego/5.jpg',
      content: 'I work in IT, and even I can\'t detect this. It\'s that good.',
      timestamp: '1 day ago'
    }
  ];
  
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffledComments = [...comments].sort((a, b) => {
    const hashA = a.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), hash);
    const hashB = b.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), hash);
    return hashA - hashB;
  });
  
  return shuffledComments.slice(0, count);
}
