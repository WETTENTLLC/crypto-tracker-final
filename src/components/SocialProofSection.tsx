'use client';

interface TestimonialCardProps {
  name: string;
  title: string;
  content: string;
  avatar?: string;
  rating: number;
}

function TestimonialCard({ name, title, content, avatar, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400 mr-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-600">({rating}/5)</span>
      </div>
      
      <blockquote className="text-gray-700 mb-4 italic">
        &quot;{content}&quot;
      </blockquote>
      
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
          {avatar || name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function SocialProofSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Crypto Trader",
      content: "CryptoTracker's alerts saved me from a major loss during the last market crash. The SMS notifications are instant and reliable. Best $9.99 I spend every month!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      title: "Portfolio Manager",
      content: "Managing 50+ cryptocurrencies was impossible before Premium. The portfolio analytics and unlimited alerts are game-changers for serious investors.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      title: "DeFi Enthusiast",
      content: "The advanced charts with technical indicators helped me increase my trading profits by 40%. The ad-free experience is so much better than other platforms.",
      rating: 5
    },
    {
      name: "David Kim",
      title: "Bitcoin HODLer",
      content: "Set it and forget it! I get alerts when Bitcoin hits my target prices. Made $15K profit last month thanks to timely notifications. Worth every penny!",
      rating: 5
    },
    {
      name: "Lisa Wang",
      title: "Altcoin Investor",
      content: "Tracking 20+ altcoins manually was a nightmare. Premium's portfolio tracking shows me exactly where I stand. The ROI tracking is incredibly accurate.",
      rating: 5
    },
    {
      name: "James Miller",
      title: "Day Trader",
      content: "The instant SMS alerts give me an edge in day trading. I've caught more profitable moves since upgrading. The $9.99 pays for itself in one good trade.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Active Premium Users", value: "25,000+" },
    { label: "Alerts Sent Daily", value: "150,000+" },
    { label: "Average Satisfaction", value: "4.9/5" },
    { label: "Money Saved by Users", value: "$50M+" }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by Crypto Investors Worldwide</h2>
          <p className="text-gray-600 mb-8">Join thousands of successful traders who rely on CryptoTracker Premium</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">What Our Premium Users Say</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                title={testimonial.title}
                content={testimonial.content}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>

        {/* Urgency/Scarcity Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">⚡ Limited Time: Special Pricing</h3>
          <p className="text-lg mb-6">
            Only <span className="font-bold text-yellow-300">247 spots</span> left at this discounted rate!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">🕒</div>
              <div className="text-sm">Offer expires in 3 days</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">👥</div>
              <div className="text-sm">127 people viewing this page</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">💰</div>
              <div className="text-sm">Save $7/month with current offer</div>
            </div>
          </div>
          
          <div className="mt-8">
            <a 
              href="/premium" 
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Claim Your Spot Now - Only $9.99/month
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
