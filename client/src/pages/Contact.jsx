function Contact() {
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
            <p className="text-sm font-semibold tracking-widest text-primary-600 mb-3">SUPPORT</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-700">
              Have a question or need help with an order? Reach out and our team will get back
              to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email</h2>
            <p className="text-gray-600">support@shophub.com</p>
            <p className="text-sm text-gray-500 mt-2">Replies within 24 hours.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Phone</h2>
            <p className="text-gray-600">+91 9876543210</p>
            <p className="text-sm text-gray-500 mt-2">Mon to Sat, 9:00 AM to 6:00 PM.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Address</h2>
            <p className="text-gray-600">123 Commerce Street, New Delhi, India 110001</p>
            <p className="text-sm text-gray-500 mt-2">Visit our office by appointment.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-3xl bg-white p-8 shadow">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a message</h2>
            <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <input
                type="text"
                placeholder="Order ID (optional)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                rows="5"
                placeholder="How can we help?"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="w-full md:w-auto rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-semibold text-white shadow"
              >
                Submit Request
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 rounded-3xl bg-gray-900 text-white p-8">
            <h3 className="text-xl font-semibold mb-4">Support hours</h3>
            <p className="text-white/80">Mon to Sat: 9:00 AM to 6:00 PM</p>
            <p className="text-white/80">Sunday: Limited email support</p>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Quick help</h4>
              <ul className="space-y-2 text-white/80">
                <li>Order tracking and updates</li>
                <li>Returns and refunds</li>
                <li>Account and payment issues</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order help</h3>
            <p className="text-gray-600">Need to change or cancel an order? We can help.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Returns</h3>
            <p className="text-gray-600">Start a return in a few clicks from your orders page.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payments</h3>
            <p className="text-gray-600">Questions about charges or refunds? Reach out.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
