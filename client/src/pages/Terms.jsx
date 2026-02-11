function Terms() {
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
            <p className="text-sm font-semibold tracking-widest text-primary-600 mb-3">POLICIES</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-lg text-gray-700">
              By using ShopHub, you agree to follow our marketplace policies and applicable laws.
              Please review these terms regularly as they may be updated.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Keep your account details accurate and up to date.</li>
              <li>Protect your login credentials at all times.</li>
              <li>Notify us of any unauthorized access.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Orders & Payments</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Orders are subject to availability and verification.</li>
              <li>Payments are processed securely by our partners.</li>
              <li>Prices and promotions may change without notice.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipping & Delivery</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Delivery timelines vary by seller and destination.</li>
              <li>Tracking details are provided when available.</li>
              <li>Delays may occur due to factors outside our control.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Returns & Refunds</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Return eligibility depends on seller policy.</li>
              <li>Refunds are issued after inspection and approval.</li>
              <li>Contact support for help with disputed orders.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
          <p className="text-gray-600 mb-4">
            The following actions are not permitted on ShopHub:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Fraudulent transactions or misuse of payment methods.</li>
            <li>Posting restricted or illegal items.</li>
            <li>Harassment, abuse, or violation of user privacy.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-3xl bg-gray-900 text-white p-8">
          <h3 className="text-2xl font-semibold mb-3">Questions about these terms?</h3>
          <p className="text-white/80 mb-6">
            Contact support for clarification or policy questions. We are here to help.
          </p>
          <div className="inline-flex items-center rounded-xl bg-white text-gray-900 font-semibold px-6 py-3 shadow">
            Contact Support
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;
