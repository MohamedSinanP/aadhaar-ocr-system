import { Shield } from 'lucide-react'

const Header = () => {
  return (
    <>
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Trust
                </h1>
                <p className="text-sm text-gray-600">Secure Document Processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
