function Privacy() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #667eea 1px, transparent 0)', backgroundSize: '40px 40px' }}
          ></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl animate-fade-in-down">
            <p className="text-sm font-semibold tracking-widest text-primary-600 mb-3">PRIVACY</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-700">
              We respect your privacy and protect your data. We collect only the information
              required to provide and improve our services.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Information We Collect</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Account details such as name, email, and phone number.</li>
              <li>Order and payment history for service delivery.</li>
              <li>Device and usage data for site performance.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How We Use Data</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Process orders and provide customer support.</li>
              <li>Improve product recommendations and UX.</li>
              <li>Send service updates and transaction notices.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Sharing</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>We do not sell personal data to third parties.</li>
              <li>Data may be shared with trusted service providers.</li>
              <li>We comply with legal requests where required.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Security</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Encryption and secure storage for sensitive data.</li>
              <li>Regular monitoring for unauthorized access.</li>
              <li>Access controls to limit internal exposure.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h3>
          <p className="text-gray-600 mb-4">
            You can request access, correction, or deletion of your data. Contact support
            for privacy-related requests.
          </p>
          <p className="text-gray-600">
            You can also update your profile details at any time in your account settings.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-900 text-white p-6">
            <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
            <p className="text-white/80">
              We use cookies to improve performance and personalize your experience.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Controls</h3>
            <p className="text-gray-600">Manage notifications and privacy settings in your profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
