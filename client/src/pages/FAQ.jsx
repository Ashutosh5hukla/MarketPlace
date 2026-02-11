function FAQ() {
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
            <p className="text-sm font-semibold tracking-widest text-primary-600 mb-3">HELP CENTER</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQs</h1>
            <p className="text-lg text-gray-700">
              Quick answers to common questions about orders, shipping, and payments.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How do I place an order?</h2>
              <p className="text-gray-600">Browse products, add to cart, and complete checkout.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I track my order?</h2>
              <p className="text-gray-600">Yes, you can view order status in your orders page.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">What payment methods are supported?</h2>
              <p className="text-gray-600">We support secure online payments through trusted gateways.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I edit my order after checkout?</h2>
              <p className="text-gray-600">Contact support quickly and we will try to update it before dispatch.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How do returns work?</h2>
              <p className="text-gray-600">Request a return from your orders page and follow the steps.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">When will my order arrive?</h2>
              <p className="text-gray-600">Delivery timelines vary by location and seller. Estimates show at checkout.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">How do I update my account?</h2>
              <p className="text-gray-600">Go to your profile to edit your details and preferences.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Do you offer cash on delivery?</h2>
              <p className="text-gray-600">Availability depends on seller and location. You will see it at checkout.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white p-8 shadow">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Contact our support team and we will respond as quickly as possible.
          </p>
          <div className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 text-white font-semibold">
            Contact Support
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
