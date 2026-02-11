function About() {
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
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="animate-fade-in-down">
              <p className="text-sm font-semibold tracking-widest text-primary-600 mb-3">OUR STORY</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">About ShopHub</h1>
              <p className="text-lg text-gray-700 max-w-xl">
                ShopHub is a modern marketplace built to make shopping simple, fast, and enjoyable.
                We connect trusted sellers and quality products with secure payments and
                reliable support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">Verified Sellers</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">Secure Payments</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">Fast Shipping</span>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow">Easy Returns</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
              <div className="rounded-2xl bg-white p-5 text-center shadow">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="rounded-2xl bg-white p-5 text-center shadow">
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="rounded-2xl bg-white p-5 text-center shadow">
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
              <div className="rounded-2xl bg-white p-5 text-center shadow">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Curated Products</h2>
            <p className="text-gray-600">Verified items across categories, updated daily.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Secure Checkout</h2>
            <p className="text-gray-600">Protected payments with trusted providers.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Support That Cares</h2>
            <p className="text-gray-600">Real help when you need it, any day of the week.</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Why customers choose us</h3>
            <ul className="space-y-3 text-gray-600">
              <li>Transparent pricing with no hidden fees.</li>
              <li>Quality checks on popular and trending items.</li>
              <li>Flexible payment options for every shopper.</li>
              <li>Dedicated support for orders and returns.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-8">
            <h3 className="text-2xl font-semibold mb-2">Sell on ShopHub</h3>
            <p className="text-white/90 mb-6">
              Grow your business with tools for listings, orders, and payments. Reach customers
              across categories and regions.
            </p>
            <div className="inline-flex items-center rounded-xl bg-white text-gray-900 font-semibold px-6 py-3 shadow">
              Start Selling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
