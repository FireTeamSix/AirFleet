export default function HomePage() {
    return (
      <main className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to AirFleet
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Your modern pilot&apos;s logbook — track flights, store photos, and explore
            insightful AI-driven analytics.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block bg-white text-black px-6 py-3 rounded-md font-medium
                         hover:bg-gray-300 transition-colors"
            >
              Log In
            </a>
          </div>
        </div>
      </main>
    );
}