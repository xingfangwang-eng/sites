import { Metadata } from 'next';
import { use } from 'react';
import keywords from '@/data/keywords.json';
import { HeroSection } from '@/components/seo/HeroSection';
import { ProblemDeepDive } from '@/components/seo/ProblemDeepDive';
import { SolutionShowcase } from '@/components/seo/SolutionShowcase';
import { SecurityAudit } from '@/components/seo/SecurityAudit';
import { FAQAccordion } from '@/components/seo/FAQAccordion';

// Debug: Log keywords array
console.log('Keywords array:', keywords);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export async function generateStaticParams() {
  console.log('Keywords length:', keywords.length);
  console.log('First 10 keywords:', keywords.slice(0, 10).map(item => item.slug));
  
  // Check if specific slug exists
  const hasKeepTeamsSlug = keywords.some(item => item.slug === 'keep-teams-status-active-while-gaming');
  console.log('Has keep-teams-status-active-while-gaming:', hasKeepTeamsSlug);
  
  const params = keywords.map((item) => ({
    slug: item.slug,
  }));
  console.log('Generated params length:', params.length);
  return params;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const keyword = keywords.find((item) => item.slug === slug);
  
  return {
    title: keyword?.title || 'Stealth Gaming Solutions',
    description: keyword?.problem_description || 'Stealth gaming solutions for office workers',
    keywords: [keyword?.keyword || 'stealth gaming', 'office gaming', 'quiet quitting'],
  };
}

interface CodeSnippet {
  title: string;
  code: string;
  language: string;
}

const codeSnippets: CodeSnippet[] = [
  {
    title: 'Stealth Gaming Setup',
    code: '// StealthPlay configuration\nconst stealthConfig = {\n  uiSkin: \'excel\',\n  mouseSimulation: true,\n  tabDisguise: \'Quarterly Report\',\n  emailAutoReply: true,\n  meetingMode: false,\n};\n\n// Initialize StealthPlay\nStealthPlay.init(stealthConfig);\n\n// Start gaming session\nStealthPlay.startSession(\'cyberpunk-2077\');',
    language: 'javascript',
  },
  {
    title: 'Mouse Movement Simulation',
    code: '// AI Mouse Simulator\nclass MouseSimulator {\n  constructor() {\n    this.movementPatterns = [\n      \'reading\',\n      \'editing\',\n      \'data-entry\',\n      \'browsing\'\n    ];\n  }\n\n  simulate() {\n    const pattern = this.movementPatterns[Math.floor(Math.random() * this.movementPatterns.length)];\n    this.executePattern(pattern);\n  }\n\n  executePattern(pattern) {\n    // Implementation of different mouse movement patterns\n    console.log(\'Simulating \' + pattern + \' pattern\');\n  }\n}\n\nconst simulator = new MouseSimulator();\nsetInterval(() => simulator.simulate(), 3000);',
    language: 'javascript',
  },
  {
    title: 'Email Auto-Reply Setup',
    code: '// AI Email Replier\nconst emailConfig = {\n  tone: \'professional\',\n  responseTime: \'1-2 hours\',\n  stallPhrases: [\n    \'Looking into this, will update you later today.\',\n    \'Reviewing the details, will get back to you shortly.\',\n    \'In a meeting right now, will follow up when I\'m free.\'\n  ]\n};\n\n// Initialize email replier\nconst emailReplier = new EmailReplier(emailConfig);\n\n// Start monitoring emails\nemailReplier.startMonitoring();',
    language: 'javascript',
  },
  {
    title: 'Tab Title Disguise',
    code: '// Dynamic Tab Title Changer\nfunction changeTabTitle() {\n  const workTitles = [\n    \'Quarterly Report - Excel\',\n    \'Project Plan - Google Docs\',\n    \'Meeting Notes - OneNote\',\n    \'Sales Dashboard - Salesforce\',\n    \'Code Review - VS Code\'\n  ];\n\n  const randomTitle = workTitles[Math.floor(Math.random() * workTitles.length)];\n  document.title = randomTitle;\n}\n\n// Change title every 5 minutes\nsetInterval(changeTabTitle, 300000);',
    language: 'javascript',
  },
];

function getRandomCodeSnippet(): CodeSnippet {
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
}

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log('Params slug:', slug);
  console.log('Keywords length:', keywords.length);
  
  const keyword = keywords.find((item) => item.slug === slug);
  console.log('Found keyword:', keyword);

  if (!keyword) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 border border-slate-200 rounded-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Not Found</h1>
          <p className="text-slate-600 mb-4">Slug: {params.slug}</p>
          <p className="text-slate-600 mb-4">Keywords length: {keywords.length}</p>
          <p className="text-slate-600">First 5 slugs:</p>
          <ul className="list-disc list-inside text-slate-600">
            {keywords.slice(0, 5).map((item, index) => (
              <li key={index}>{item.slug}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Use slug-based seed for consistent variant selection
  const seed = keyword.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heroVariant = ['A', 'B', 'C'][seed % 3] as 'A' | 'B' | 'C';
  const solutionVariant = ['A', 'B', 'C'][(seed + 1) % 3] as 'A' | 'B' | 'C';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title={keyword.title}
        problemDescription={keyword.problem_description}
        variant={heroVariant}
        persona={keyword.persona}
        tone={keyword.tone}
      />

      {/* Problem Deep Dive */}
      <ProblemDeepDive
        problemDescription={keyword.problem_description}
        industryContext={keyword.industry_context}
        technicalHurdle={keyword.technical_hurdle}
        persona={keyword.persona}
        tone={keyword.tone}
      />

      {/* Solution Showcase */}
      <SolutionShowcase
        howToSolve={keyword.how_to_solve}
        variant={solutionVariant}
        persona={keyword.persona}
        technicalHurdle={keyword.technical_hurdle}
      />

      {/* Security Audit */}
      <SecurityAudit
        technicalHurdle={keyword.technical_hurdle}
        industryContext={keyword.industry_context}
        tone={keyword.tone}
      />

      {/* FAQ Accordion */}
      <FAQAccordion
        slug={keyword.slug}
        title={keyword.title}
        persona={keyword.persona}
        industryContext={keyword.industry_context}
      />
    </div>
  );
}
