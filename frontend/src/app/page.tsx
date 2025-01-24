export default function HomePage() {
    return (
      <main className="relative min-h-screen flex flex-col px-4 bg-black">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/home_bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-xl text-center mx-auto pt-24 md:pt-32">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Welcome to AirFleet
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Your modern pilot&apos;s logbook — track flights, store photos, and explore
            insightful AI-driven analytics.
          </p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block bg-white text-black px-6 py-3 rounded-md font-medium
                         hover:bg-gray-100 transition-colors"
            >
              Log In
            </a>
          </div>
        </div>
      </main>
    );
}
