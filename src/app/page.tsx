import PortfolioAnalytics from '@/components/PortfolioAnalytics';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <PortfolioAnalytics />
      </main>
      <footer className="mt-8 text-center">
        <Link 
          href="https://github.com/chongwongus"
          className="mx-4 hover:underline"
        >
          GitHub
        </Link>
        <Link 
          href="https://linkedin.com/in/richardleee"
          className="mx-4 hover:underline"
        >
          LinkedIn
        </Link>
      </footer>
    </div>
  );
}