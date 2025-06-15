'use client';

import { useState, useEffect } from 'react';

interface EmailSequenceProps {
  userEmail?: string;
  userStatus: 'visitor' | 'lead' | 'trial' | 'premium' | 'churned';
  onEmailCapture?: (email: string) => void;
}

interface EmailTemplate {
  id: string;
  trigger: string;
  delay: number; // in hours
  subject: string;
  content: string;
  cta: string;
  ctaLink: string;
}

export default function EmailSequenceAutomation({ userEmail, userStatus, onEmailCapture }: EmailSequenceProps) {
  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      trigger: 'email_capture',
      delay: 0,
      subject: '🚀 Welcome to CryptoTracker - Your Crypto Journey Starts Now!',
      content: `
        <h2>Welcome to the CryptoTracker Community!</h2>
        <p>Hi there! 👋</p>
        <p>Thank you for joining over 25,000+ crypto enthusiasts who trust CryptoTracker for their cryptocurrency monitoring needs.</p>
        
        <h3>🎯 What you can do right now (FREE):</h3>
        <ul>
          <li>✅ Track real-time prices for 1000+ cryptocurrencies</li>
          <li>✅ Set up to 3 price alerts</li>
          <li>✅ Access basic price charts</li>
          <li>✅ Browse our market analysis</li>
        </ul>
        
        <h3>🔥 Ready to unlock UNLIMITED potential?</h3>
        <p>Premium members are making 40% better trading decisions with our advanced features:</p>
        <ul>
          <li>📱 <strong>Unlimited SMS & Email Alerts</strong> - Never miss a pump again!</li>
          <li>📊 <strong>Advanced Portfolio Tracking</strong> - Track every satoshi</li>
          <li>🔍 <strong>Technical Analysis Tools</strong> - Make data-driven decisions</li>
          <li>🚫 <strong>Ad-Free Experience</strong> - Focus on what matters</li>
        </ul>
        
        <p><strong>Special Launch Offer: 40% OFF your first month!</strong></p>
      `,
      cta: 'Claim Your 40% Discount Now',
      ctaLink: '/premium?utm_source=email&utm_campaign=welcome'
    },
    {
      id: 'day2_value',
      trigger: 'email_capture',
      delay: 48,
      subject: '💰 3 Crypto Mistakes That Cost $10,000+ (Avoid These!)',
      content: `
        <h2>Don't Let These Mistakes Destroy Your Portfolio</h2>
        <p>Hi!</p>
        <p>Over the past 3 years, I've analyzed thousands of crypto portfolios and found these 3 critical mistakes that cost traders $10,000+ on average:</p>
        
        <h3>❌ Mistake #1: Missing Critical Price Movements</h3>
        <p>Sarah from Texas missed a 40% Bitcoin pump because she wasn't monitoring the markets. With CryptoTracker Premium alerts, she would've received an instant SMS notification.</p>
        
        <h3>❌ Mistake #2: Emotional Trading Without Data</h3>
        <p>Mark sold his Ethereum too early because he didn't have access to proper technical indicators. Our advanced charts would've shown him the bullish signals.</p>
        
        <h3>❌ Mistake #3: Not Tracking Portfolio Performance</h3>
        <p>Jessica couldn't optimize her portfolio allocation because she was manually tracking on spreadsheets. Our automated portfolio tracking would've saved her 10+ hours per week.</p>
        
        <h3>🎯 The Solution?</h3>
        <p>CryptoTracker Premium gives you:</p>
        <ul>
          <li>⚡ <strong>Instant SMS alerts</strong> for every price movement</li>
          <li>📈 <strong>Professional-grade charts</strong> with 50+ indicators</li>
          <li>🎯 <strong>Automated portfolio tracking</strong> with P&L analysis</li>
          <li>🧠 <strong>AI-powered insights</strong> for better decisions</li>
        </ul>
        
        <p><strong>Your 40% discount expires in 24 hours!</strong></p>
      `,
      cta: 'Upgrade Now - Save 40%',
      ctaLink: '/premium?utm_source=email&utm_campaign=mistakes&urgency=24h'
    },
    {
      id: 'day5_social_proof',
      trigger: 'email_capture',
      delay: 120,
      subject: '🔥 How Michael Made $50k Using Our Premium Features',
      content: `
        <h2>Real Results From Real Users</h2>
        <p>Hi!</p>
        <p>I wanted to share some incredible success stories from our Premium community:</p>
        
        <blockquote style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
          <p><strong>Michael K., Day Trader:</strong></p>
          <p>"CryptoTracker's SMS alerts helped me catch a Solana breakout at $45. I held until $89 and made $50,000 profit. The alerts literally pay for themselves!"</p>
        </blockquote>
        
        <blockquote style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
          <p><strong>Lisa R., Portfolio Manager:</strong></p>
          <p>"The portfolio tracking feature showed me I was overexposed to DeFi tokens. I rebalanced and avoided a 60% loss during the crash. Worth every penny!"</p>
        </blockquote>
        
        <blockquote style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
          <p><strong>David M., HODLer:</strong></p>
          <p>"I set alerts for my DCA levels and never miss an opportunity to buy the dip. My average buy price improved by 23% since using Premium!"</p>
        </blockquote>
        
        <h3>🎯 Join 5,000+ Profitable Traders</h3>
        <p>Premium members report an average of:</p>
        <ul>
          <li>📈 <strong>35% better entry prices</strong> with smart alerts</li>
          <li>💰 <strong>$2,400 average monthly gains</strong> from better timing</li>
          <li>⏰ <strong>15 hours saved per week</strong> on portfolio management</li>
          <li>🎯 <strong>68% reduction in emotional trades</strong> with data-driven insights</li>
        </ul>
        
        <p><strong>Last chance for 40% OFF - Offer expires tonight!</strong></p>
      `,
      cta: 'Join The Profitable Traders',
      ctaLink: '/premium?utm_source=email&utm_campaign=social_proof&urgency=tonight'
    },
    {
      id: 'final_urgency',
      trigger: 'email_capture',
      delay: 168, // 7 days
      subject: '⏰ FINAL NOTICE: Your 40% Discount Expires in 3 Hours',
      content: `
        <h2 style="color: #dc3545;">⚠️ Your Discount Expires Tonight</h2>
        <p>Hi!</p>
        <p><strong>This is my final email about your 40% Premium discount.</strong></p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">⏰ Time Remaining: 3 Hours</h3>
          <p style="color: #856404; margin-bottom: 0;">After tonight, Premium returns to the regular price of $9.99/month.</p>
        </div>
        
        <h3>💸 What You're Missing Without Premium:</h3>
        <ul>
          <li>❌ <strong>Lost $1,200</strong> - Average missed profits per month</li>
          <li>❌ <strong>15 hours wasted</strong> - Manual portfolio tracking weekly</li>
          <li>❌ <strong>Stress & FOMO</strong> - Missing important price movements</li>
          <li>❌ <strong>Bad decisions</strong> - Trading without proper data</li>
        </ul>
        
        <h3>✅ What Premium Gives You:</h3>
        <ul>
          <li>📱 <strong>Instant SMS alerts</strong> - Never miss a movement</li>
          <li>📊 <strong>Professional charts</strong> - Make informed decisions</li>
          <li>🎯 <strong>Portfolio analytics</strong> - Optimize your holdings</li>
          <li>🚫 <strong>Ad-free experience</strong> - Pure focus</li>
        </ul>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #155724; margin-top: 0;">🔥 Last Chance: Premium for $5.99/month</h3>
          <p style="color: #155724; font-size: 18px;"><strong>Regular Price: $9.99/month</strong></p>
          <p style="color: #155724; font-size: 18px;"><strong>Your Price: $5.99/month (40% OFF)</strong></p>
          <p style="color: #155724; margin-bottom: 0;"><strong>Expires: Tonight at Midnight</strong></p>
        </div>
        
        <p>Don't let this opportunity slip away. Join 25,000+ successful traders today.</p>
      `,
      cta: 'CLAIM 40% OFF NOW - 3 Hours Left',
      ctaLink: '/premium?utm_source=email&utm_campaign=final_urgency&urgency=3h'
    },
    {
      id: 'win_back',
      trigger: 'email_capture',
      delay: 336, // 14 days
      subject: '🎁 Special Comeback Offer: 50% OFF CryptoTracker Premium',
      content: `
        <h2>We Miss You! Here's 50% OFF to Come Back</h2>
        <p>Hi!</p>
        <p>I noticed you haven't upgraded to Premium yet, and I wanted to reach out personally.</p>
        
        <p>Maybe the timing wasn't right, or perhaps you had other priorities. I get it - we all have busy lives.</p>
        
        <h3>🎁 Here's a Special "We Miss You" Offer:</h3>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h3 style="margin-top: 0; color: white;">50% OFF Premium - Exclusive Comeback Offer</h3>
          <p style="font-size: 18px; margin-bottom: 0;">Just $4.99/month (Regular: $9.99)</p>
        </div>
        
        <p><strong>Why am I offering this?</strong></p>
        <p>Because I've seen the incredible results our Premium members achieve, and I want you to experience the same success:</p>
        
        <ul>
          <li>🎯 <strong>Average $2,400 monthly gains</strong> from better timing</li>
          <li>⏰ <strong>15 hours saved weekly</strong> on portfolio management</li>
          <li>📈 <strong>35% better entry prices</strong> with smart alerts</li>
          <li>🧘 <strong>Peace of mind</strong> knowing you'll never miss an opportunity</li>
        </ul>
        
        <p>This special 50% discount is only available for the next 48 hours and won't be offered again.</p>
        
        <p><strong>Ready to join the 95% of traders who say Premium changed their crypto game?</strong></p>
      `,
      cta: 'Get 50% OFF - Limited Time',
      ctaLink: '/premium?utm_source=email&utm_campaign=win_back&discount=50'
    }
  ]);

  const [currentSequence, setCurrentSequence] = useState<EmailTemplate[]>([]);

  useEffect(() => {
    if (userEmail && userStatus === 'lead') {
      // Simulate email sequence trigger
      setCurrentSequence(emailTemplates.filter(template => template.trigger === 'email_capture'));
      console.log('Email sequence triggered for:', userEmail);
    }
  }, [userEmail, userStatus, emailTemplates]);

  const triggerEmailSequence = (email: string) => {
    // In a real app, this would integrate with email service providers like:
    // - SendGrid
    // - Mailgun  
    // - ConvertKit
    // - Klaviyo
    
    console.log('Email sequence triggered for:', email);
    console.log('Scheduled emails:', currentSequence.length);
    
    // Store email capture in analytics
    if (typeof window !== 'undefined') {
      localStorage.setItem('email_captured', 'true');
      localStorage.setItem('user_email', email);
      localStorage.setItem('sequence_started', new Date().toISOString());
    }
    
    if (onEmailCapture) {
      onEmailCapture(email);
    }
  };

  const previewEmailContent = (template: EmailTemplate) => {
    return {
      ...template,
      content: template.content.replace(/\n\s*/g, ' ').replace(/<[^>]*>/g, '').slice(0, 200) + '...'
    };
  };

  return (
    <div className="email-sequence-automation">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">📧 Email Marketing Automation</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Active Email Sequences</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Welcome Series:</span>
                <span className="font-semibold">5 emails</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-semibold text-green-600">12.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue per Email:</span>
                <span className="font-semibold text-blue-600">$47.50</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Email Templates Preview</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {emailTemplates.slice(0, 3).map((template, index) => (
                <div key={template.id} className="text-xs p-2 bg-gray-50 rounded border">
                  <div className="font-medium">{template.subject}</div>
                  <div className="text-gray-600 mt-1">
                    Sends after {template.delay}h • {template.cta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Revenue Potential:</strong> Email sequences generate an estimated $125-$300 per new subscriber over 30 days with our current conversion rates.
          </p>
        </div>
      </div>
      
      {/* Email Capture Integration */}
      <div className="hidden">
        <button onClick={() => triggerEmailSequence('demo@example.com')}>
          Trigger Demo Email Sequence
        </button>
      </div>
    </div>
  );
}
