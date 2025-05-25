import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CryptoTracker - Seguimiento de Criptomonedas en Tiempo Real y Alertas de Precios',
  description: 'Rastrea precios de criptomonedas en tiempo real, establece alertas de precios personalizadas y gestiona tu cartera cripto con análisis avanzados. Recibe notificaciones instantáneas cuando los precios alcancen tus objetivos.',
  keywords: ['rastreador de criptomonedas', 'alertas de precio bitcoin', 'rastreador ethereum', 'cartera cripto', 'precios criptomonedas'],
  alternates: {
    canonical: '/es-ES',
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

export default function SpanishPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            CryptoTracker
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 mb-8">
            Seguimiento de Criptomonedas en Tiempo Real
          </p>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
            Rastrea precios de criptomonedas en tiempo real, establece alertas de precios personalizadas 
            y gestiona tu cartera cripto con análisis avanzados. Compatible con más de 10,000 criptomonedas 
            incluyendo Bitcoin, Ethereum y todas las principales altcoins.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Alertas en Tiempo Real</h3>
              <p className="text-gray-300">
                Recibe notificaciones instantáneas cuando los precios alcancen tus objetivos establecidos.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Gestión de Cartera</h3>
              <p className="text-gray-300">
                Rastrea el rendimiento de tu cartera con análisis detallados y métricas avanzadas.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">10,000+ Criptomonedas</h3>
              <p className="text-gray-300">
                Acceso a datos completos de mercado para todas las principales criptomonedas y tokens.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Comenzar Seguimiento
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
