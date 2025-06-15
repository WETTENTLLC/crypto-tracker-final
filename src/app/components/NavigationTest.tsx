'use client';

import { useEffect, useState } from 'react';

interface NavigationTestResult {
  linkType: string;
  linkText: string;
  linkHref: string;
  hasNavigationHandler: boolean;
  status: 'passed' | 'failed';
}

export default function NavigationTest() {
  const [results, setResults] = useState<NavigationTestResult[]>([]);
  const [summary, setSummary] = useState<{passed: number, failed: number, total: number}>({
    passed: 0, 
    failed: 0, 
    total: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin and run test only if admin
    if (typeof window !== 'undefined') {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
      
      if (adminStatus) {
        // Run the test after a short delay to ensure all components are rendered
        const timer = setTimeout(() => {
          runNavigationTest();
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  function runNavigationTest() {
    const links = document.querySelectorAll('a[href]');
    const testResults: NavigationTestResult[] = [];
    
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      const isInternal = !href.startsWith('http') && !href.startsWith('#');
      
      if (isInternal) {
        // Only test internal links
        const hasDataNavFixed = link.hasAttribute('data-nav-fixed');
        const hasClickListener = Boolean(
          (link as any).__reactEvents?.click || 
          (link as any).onclick || 
          hasDataNavFixed
        );
        
        testResults.push({
          linkType: 'internal',
          linkText: link.textContent || 'Unknown',
          linkHref: href,
          hasNavigationHandler: hasClickListener,
          status: hasClickListener ? 'passed' : 'failed'
        });
      } else {
        testResults.push({
          linkType: 'external',
          linkText: link.textContent || 'Unknown',
          linkHref: href,
          hasNavigationHandler: true, // External links don't need our handlers
          status: 'passed'
        });
      }
    });
    
    // Calculate summary
    const passed = testResults.filter(r => r.status === 'passed').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    
    setResults(testResults);    setSummary({
      passed,
      failed,
      total: testResults.length
    });
  }

  return (
    <div className="fixed bottom-0 right-0 w-96 max-h-96 overflow-auto bg-white shadow-lg border border-gray-200 rounded-tl-lg p-4 z-50">
      <h2 className="text-lg font-bold mb-2">Navigation Test Results</h2>
      
      <div className="flex justify-between mb-4">
        <div className="text-sm">
          <span className="font-medium">Total Links:</span> {summary.total}
        </div>
        <div className="text-sm">
          <span className="text-green-600 font-medium">Passed:</span> {summary.passed}
        </div>
        <div className="text-sm">
          <span className="text-red-600 font-medium">Failed:</span> {summary.failed}
        </div>
      </div>
      
      <div className="overflow-auto max-h-64">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-left">Link Text</th>
              <th className="px-2 py-1 text-left">Href</th>
              <th className="px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className={result.status === 'failed' ? 'bg-red-50' : ''}>
                <td className="px-2 py-1 truncate max-w-[100px]">{result.linkText}</td>
                <td className="px-2 py-1 truncate max-w-[120px]">{result.linkHref}</td>
                <td className={`px-2 py-1 ${result.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status === 'passed' ? '✓' : '✗'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => document.querySelector('.fixed.bottom-0.right-0')?.remove()}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
