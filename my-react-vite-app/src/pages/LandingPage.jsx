import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 overflow-hidden" id="home">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                Academic Risk Detection System
              </h1>
              <p className="text-xl sm:text-2xl text-purple-100 leading-relaxed">
                Empowering students, advisors, and administrators with AI-powered insights to identify and prevent academic challenges before they become critical.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-purple-700 rounded-lg font-bold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl text-center"
                >
                  Login to Dashboard
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-purple-700 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full h-96">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6 animate-pulse"></div>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-9xl">
                  📊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden" id="features">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Key Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Everything you need to support student success, powered by advanced AI and intuitive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Feature Cards Data */}
            {[
              {
                icon: "🎯",
                title: "Early Risk Detection",
                desc: "Identify at-risk students weeks before they fail with AI-powered analytics and predictive modeling.",
                color: "from-red-600 to-pink-600",
                delay: "0"
              },
              {
                icon: "📊",
                title: "Real-time Analytics",
                desc: "Track student performance instantly with comprehensive live dashboards and visual data insights.",
                color: "from-blue-600 to-cyan-600",
                delay: "100"
              },
              {
                icon: "🤝",
                title: "Intervention Planning",
                desc: "Create, assign, and manage personalized intervention strategies for struggling students with ease.",
                color: "from-amber-500 to-orange-600",
                delay: "200"
              },
              {
                icon: "📱",
                title: "Instant Notifications",
                desc: "Stay informed 24/7 with real-time SMS and email alerts about critical changes in student progress.",
                color: "from-purple-600 to-indigo-600",
                delay: "300"
              },
              {
                icon: "📈",
                title: "Progress Tracking",
                desc: "Monitor long-term GPA trends, attendance patterns, and assignment completion rates over semesters.",
                color: "from-emerald-500 to-green-600",
                delay: "400"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                desc: "Enterprise-grade security with role-based access control and end-to-end data encryption.",
                color: "from-slate-500 to-slate-600",
                delay: "500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-[#0f0f13] rounded-3xl p-8 shadow-2xl hover:shadow-white/5 transition-all duration-500 hover:-translate-y-2 border border-white/10 overflow-hidden"
              >
                {/* Hover Gradient Border Effect */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

                {/* Icon Background Blob */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center text-4xl mb-6 shadow-lg shadow-black/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-1 ring-white/5`}>
                    <span className="drop-shadow-sm text-white">{feature.icon}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] relative" id="how-it-works">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, effective, and proven process</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:border-purple-500/50">
                <div className="text-5xl font-black mb-4 opacity-20 text-purple-500">01</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Data Collection</h3>
                <p className="text-gray-400">Students submit weekly self-assessments covering attendance, assignments, and academic challenges.</p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-gray-700">→</div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:border-indigo-500/50">
                <div className="text-5xl font-black mb-4 opacity-20 text-indigo-500">02</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Risk Analysis</h3>
                <p className="text-gray-400">Our AI algorithm analyzes multiple factors to calculate risk levels and identify patterns.</p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-gray-700">→</div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:border-blue-500/50">
                <div className="text-5xl font-black mb-4 opacity-20 text-blue-500">03</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Intervention</h3>
                <p className="text-gray-400">Advisors receive alerts and can create personalized support plans for at-risk students.</p>
              </div>
              {/* Arrow for desktop */}
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-gray-700">→</div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:border-green-500/50">
                <div className="text-5xl font-black mb-4 opacity-20 text-green-500">04</div>
                <h3 className="text-2xl font-bold mb-4 text-white">Success</h3>
                <p className="text-gray-400">Track progress and celebrate improvements as students overcome academic challenges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black" id="roles">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-400">Tailored solutions for every role</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="bg-[#0f0f13] rounded-3xl p-8 shadow-xl hover:shadow-purple-900/20 transform hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-purple-500/50 group">
              <div className="text-7xl mb-6 text-center drop-shadow-md group-hover:scale-110 transition-transform duration-300">🎓</div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">Students</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Track your academic progress</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Submit weekly self-assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">View personalized insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Access support resources</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="block w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-center hover:bg-purple-600 hover:border-purple-600 transform transition-all duration-300"
              >
                Student Login
              </Link>
            </div>

            {/* Advisor Card */}
            <div className="bg-[#0f0f13] rounded-3xl p-8 shadow-xl hover:shadow-indigo-900/20 transform hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-indigo-500/50 group">
              <div className="text-7xl mb-6 text-center drop-shadow-md group-hover:scale-110 transition-transform duration-300">👨‍🏫</div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">Advisors</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Monitor student risk levels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Create intervention plans</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Schedule meetings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Generate reports</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="block w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-center hover:bg-indigo-600 hover:border-indigo-600 transform transition-all duration-300"
              >
                Advisor Login
              </Link>
            </div>

            {/* Administrator Card */}
            <div className="bg-[#0f0f13] rounded-3xl p-8 shadow-xl hover:shadow-blue-900/20 transform hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-blue-500/50 group">
              <div className="text-7xl mb-6 text-center drop-shadow-md group-hover:scale-110 transition-transform duration-300">⚙️</div>
              <h3 className="text-3xl font-bold text-white mb-6 text-center">Administrators</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">System-wide analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">User management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Configure risk algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-400">Export comprehensive reports</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="block w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-center hover:bg-blue-600 hover:border-blue-600 transform transition-all duration-300"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Making an Impact</h2>
            <p className="text-xl text-purple-100">Real results from real institutions</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl font-black text-white mb-4">95%</div>
              <div className="text-xl text-purple-100 font-semibold">Early Detection Rate</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl font-black text-white mb-4">80%</div>
              <div className="text-xl text-purple-100 font-semibold">Student Retention</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl font-black text-white mb-4">24/7</div>
              <div className="text-xl text-purple-100 font-semibold">System Availability</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl font-black text-white mb-4">1000+</div>
              <div className="text-xl text-purple-100 font-semibold">Students Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Ready to Transform Student Success?</h2>
          <p className="text-xl text-gray-600 mb-10">Join hundreds of institutions using our platform to support student achievement.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              Login to Dashboard
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Academic Risk Detection</h4>
              <p className="text-gray-400 leading-relaxed">Empowering educational institutions with data-driven insights.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-purple-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-purple-400 transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-gray-400 hover:text-purple-400 transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-purple-400 transition-colors">Documentation</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl hover:bg-purple-600 transform hover:scale-110 transition-all duration-300">📘</a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl hover:bg-purple-600 transform hover:scale-110 transition-all duration-300">🐦</a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl hover:bg-purple-600 transform hover:scale-110 transition-all duration-300">💼</a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl hover:bg-purple-600 transform hover:scale-110 transition-all duration-300">📧</a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2026 Academic Risk Detection System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
