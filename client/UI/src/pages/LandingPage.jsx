import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* 1. Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">
          StoreRating
        </div>
        <div className="space-x-8 font-bold text-sm hidden md:flex">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#about" className="hover:text-blue-600 transition">About</a>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="font-bold text-sm hover:text-blue-600">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-left flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Transparent <span className="text-blue-600">Feedback</span> for Every Store.
          </h1>
          <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
            The ultimate platform for customers to share experiences and for store owners to grow through honest ratings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/register" className="bg-black text-white px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:bg-gray-800 transition">
              Sign Up Now
            </Link>
            <div className="flex -space-x-3 items-center justify-center">
               <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold">IB</div>
               <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold">RB</div>
               <div className="w-10 h-10 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center text-xs font-bold">SM</div>
               <p className="ml-4 text-sm font-bold text-gray-400 italic">+ Join 1,000+ Users</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 mt-20 md:mt-0 relative">
            {/* Visual element representing a store card */}
            <div className="bg-blue-50 w-full h-80 rounded-[40px] flex items-center justify-center relative overflow-hidden">
                <div className="bg-white p-6 rounded-3xl shadow-2xl w-64 transform -rotate-6">
                    <div className="h-4 w-20 bg-gray-100 rounded mb-4"></div>
                    <div className="h-6 w-full bg-blue-600 rounded mb-2"></div>
                    <div className="flex text-yellow-400 space-x-1">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-200">★</span>
                    </div>
                </div>
                <div className="absolute bottom-10 right-10 bg-black text-white p-4 rounded-2xl text-xs font-black shadow-xl">
                   TRUSTED FEEDBACK
                </div>
            </div>
        </div>
      </header>

      {/* 3. Features Section */}
      <section id="features" className="bg-gray-50 py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-black mb-4">Why use StoreRating?</h2>
            <p className="text-gray-500 font-medium">Built for everyone in the retail ecosystem.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <FeatureCard 
            title="Real People" 
            desc="Authentic feedback from verified users to ensure high data integrity." 
            icon="👥"
          />
          <FeatureCard 
            title="Smart Insights" 
            desc="Store owners get advanced analytics to improve their customer service." 
            icon="📈"
          />
          <FeatureCard 
            title="Admin Control" 
            desc="System administrators maintain the highest standards of platform quality." 
            icon="🛡️"
          />
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-12 border-t text-center text-gray-400 font-bold text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} StoreRating Platform. Built with MERN Stack.
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="text-5xl mb-6">{icon}</div>
    <h3 className="text-xl font-black mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;