import { useNavigate } from "react-router-dom";
import Button from '../components/Button'

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-blue-50 to-white text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
            <span>Advancio</span>
            <span className="block text-blue-600">Vista Portal</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto">
            Welcome to Advancio's client support portal. Submit and track your support tickets with ease.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              Access Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Features
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything you need in one place
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Submit Tickets', desc: 'Easily create support tickets for any issues or questions you have.' },
              { title: 'Track Progress', desc: 'Monitor the status and progress of your tickets in real-time.' },
              { title: 'Communicate', desc: 'Add comments and receive updates from our support team.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 bg-white shadow rounded-lg">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-2 text-base text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold">Advancio Vista Portal</h3>
            <p className="mt-2 text-gray-400">
              Your gateway to Advancio's support services
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2 text-gray-400">support@advancio.com</p>
            <p className="text-gray-400">+1 (800) 123-4567</p>
          </div>
        </div>

        {/* Move copyright inside max width container */}
        <div className="max-w-7xl mx-auto px-4 mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400 text-center md:text-left">
          &copy; {new Date().getFullYear()} Advancio. All rights reserved.
        </div>
      </footer>
    </div>
  );

}

export default Home