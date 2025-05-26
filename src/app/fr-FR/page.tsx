import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CryptoTracker - Suivi des Cryptomonnaies en Temps Réel et Alertes de Prix',
  description: 'Suivez les prix des cryptomonnaies en temps réel, définissez des alertes de prix personnalisées et gérez votre portefeuille crypto avec des analyses avancées. Recevez des notifications instantanées lorsque les prix atteignent vos objectifs.',
  keywords: ['tracker crypto', 'alertes prix bitcoin', 'tracker ethereum', 'portefeuille crypto', 'prix cryptomonnaies'],
  alternates: {
    canonical: '/fr-FR',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
      'fr-FR': '/fr-FR',
      'de-DE': '/de-DE',
      'ja-JP': '/ja-JP',
      'ko-KR': '/ko-KR',
      'zh-CN': '/zh-CN',
    },
  },
}

export default function FrenchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            CryptoTracker
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8">
            Suivi des Cryptomonnaies en Temps Réel
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
            Suivez les prix des cryptomonnaies en temps réel, définissez des alertes de prix personnalisées 
            et gérez votre portefeuille crypto avec des analyses avancées. Compatible avec plus de 10 000 
            cryptomonnaies incluant Bitcoin, Ethereum et tous les principaux altcoins.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Alertes en Temps Réel</h3>
              <p className="text-gray-300">
                Recevez des notifications instantanées lorsque les prix atteignent vos objectifs définis.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Gestion de Portefeuille</h3>
              <p className="text-gray-300">
                Suivez la performance de votre portefeuille avec des analyses détaillées et des métriques avancées.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">10 000+ Cryptomonnaies</h3>
              <p className="text-gray-300">
                Accès aux données complètes du marché pour toutes les principales cryptomonnaies et tokens.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Commencer le Suivi
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
