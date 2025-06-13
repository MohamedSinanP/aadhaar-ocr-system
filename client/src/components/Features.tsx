import { Shield, Sparkles } from 'lucide-react'

const Features = () => {
  return (
    <>
      <div className="mt-16 grid md:grid-cols-2 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Processing</h3>
          <p className="text-gray-600">Your documents are processed securely with end-to-end encryption</p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
          <p className="text-gray-600">Get structured data from your Aadhaar card in just seconds</p>
        </div>
      </div>
    </>
  )
}

export default Features
