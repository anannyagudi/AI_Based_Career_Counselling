import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Briefcase, User as UserIcon, LogOut, BookOpen, LayoutDashboard, Search, Award, HelpCircle, ChevronDown, ChevronUp, PlayCircle, Cpu, Target } from 'lucide-react'
import Questionnaire from './components/Questionnaire'
import Login from './components/Login'
import Signup from './components/Signup'
import CoachDashboard from './components/CoachDashboard'
import ExploreCourses from './components/ExploreCourses'
import CourseDetail from './components/CourseDetail'
import StudentProfile from './components/StudentProfile'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const [darkMode, setDarkMode] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setDarkMode(false)
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setDarkMode(true)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-light-bg dark:bg-dark-bg bg-mesh">
      <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-500 font-extrabold text-xl tracking-tight">
            <Briefcase className="w-6 h-6" />
            <span>AI CareerCounselor</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-light-subtext dark:text-gray-300 font-semibold hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/explore" className="text-light-subtext dark:text-gray-300 font-semibold hover:text-teal-500 transition-colors flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Courses
            </Link>
            {user?.role === 'coach' && (
              <Link to="/dashboard" className="text-light-subtext dark:text-gray-300 font-semibold hover:text-primary-600 transition-colors flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
            )}
            {user?.role === 'student' && (
              <Link to="/profile" className="text-light-subtext dark:text-gray-300 font-semibold hover:text-primary-600 transition-colors flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                Profile
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-light-subtext dark:text-gray-300"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm font-bold text-light-text dark:text-dark-text">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-light-subtext hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-light-subtext dark:text-gray-200 hover:text-primary-600 transition-colors">Login</Link>
                <Link to="/signup" className="px-5 py-2 text-sm font-bold bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<ExploreCourses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/profile" element={user ? <StudentProfile /> : <Home />} />
          <Route path="/dashboard" element={user?.role === 'coach' ? <CoachDashboard /> : <Home />} />
          <Route path="/assessment/:category" element={<Questionnaire />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg py-10">
        <div className="container mx-auto px-6 text-center text-light-subtext dark:text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} AI CareerCounselor. Built for your success.
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

function Home() {
  return (
    <div className="relative flex flex-col items-center space-y-24 py-12">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-20 w-[30rem] h-[30rem] bg-gradient-to-br from-primary-200/40 to-transparent dark:from-primary-900/20 rounded-full filter blur-[100px] animate-blob pointer-events-none"></div>
      <div className="absolute top-40 -right-20 w-[30rem] h-[30rem] bg-gradient-to-br from-teal-200/40 to-transparent dark:from-teal-900/20 rounded-full filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-40 left-40 w-[30rem] h-[30rem] bg-gradient-to-br from-purple-200/40 to-transparent dark:from-purple-900/20 rounded-full filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Discover Your True Potential
          </h1>
          <p className="text-lg md:text-xl text-light-subtext dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-semibold animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our AI-driven counseling tool analyzes your interests, skills, and goals to recommend the perfect career path. Select your current academic stage to begin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Link to="/assessment/10th" className="group card-glass flex flex-col items-center p-10 border-transparent hover:border-primary-500/50 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">10th</span>
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-light-text dark:text-gray-100">After 10th</h2>
            <p className="text-light-subtext dark:text-gray-400 text-center font-medium">Find the right stream for your students.</p>
          </Link>
          <Link to="/assessment/12th" className="group card-glass flex flex-col items-center p-10 border-transparent hover:border-teal-500/50 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-teal-700 dark:text-teal-400">12th</span>
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-light-text dark:text-gray-100">After 12th</h2>
            <p className="text-light-subtext dark:text-gray-400 text-center font-medium">Choose the best higher education track.</p>
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="w-full max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-white">How It Works</h2>
          <p className="text-light-subtext dark:text-gray-400 font-semibold text-lg">Your step-by-step guide to career success.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="card-glass p-8 space-y-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full group-hover:w-32 group-hover:h-32 transition-all"></div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400">
              <PlayCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-light-text dark:text-white">Where do I start?</h3>
            <p className="text-light-subtext dark:text-gray-400 leading-relaxed text-sm font-medium">
              <span className="font-bold text-primary-600 dark:text-primary-400">Try the free course:</span> Sign up and start one of our free introduction courses. You will learn all about what the career entails, current job market, and whether you would be a good fit.
            </p>
          </div>

          <div className="card-glass p-8 space-y-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full group-hover:w-32 group-hover:h-32 transition-all"></div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-2xl text-teal-600 dark:text-teal-400">
              <Cpu className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-light-text dark:text-white">Where do I go next?</h3>
            <p className="text-light-subtext dark:text-gray-400 leading-relaxed text-sm font-medium">
              <span className="font-bold text-teal-600 dark:text-teal-400">Learn new skills:</span> Once you've decided on a path, join our community! Enroll in online self-paced courses, access free workshops and affordable 1:1 coaching.
            </p>
          </div>

          <div className="card-glass p-8 space-y-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full group-hover:w-32 group-hover:h-32 transition-all"></div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <Target className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-light-text dark:text-white">Where do I end up?</h3>
            <p className="text-light-subtext dark:text-gray-400 leading-relaxed text-sm font-medium">
              <span className="font-bold text-purple-600 dark:text-purple-400">Start your career:</span> We teach you exactly how to land an entry-level position, giving you insider knowledge to set up your profile and resume like a pro.
            </p>
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <section className="w-full max-w-5xl mx-auto py-20 px-10 rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Award className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase">Certified Success</div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Certificate of Completion</h2>
            <p className="text-white/80 text-lg md:text-xl font-semibold">Show the world you're job ready.</p>
            <p className="text-white/90 leading-relaxed text-lg">
              We’re trusted by thousands of people starting new careers. Show others that you’ve got the skills necessary to excel. After in-depth training and passing our final exam, you’ll receive a certificate of completion!
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-56 h-72 md:w-72 md:h-96 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 flex flex-col items-center justify-center p-8 text-center space-y-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <Award className="w-20 h-20 text-yellow-300 drop-shadow-lg" />
              <div className="h-2 w-40 bg-white/20 rounded-full"></div>
              <div className="h-2 w-32 bg-white/20 rounded-full"></div>
              <div className="mt-12 text-xs font-bold tracking-[0.3em] text-white/60 uppercase">Certified Counselor</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-light-text dark:text-white">Frequently Asked Questions</h2>
          <p className="text-light-subtext dark:text-gray-400 font-semibold text-lg">Everything you need to know about getting started.</p>
        </div>
        
        <div className="grid gap-6">
          <FaqItem 
            question="Is the career assessment truly free?" 
            answer="Yes! Our AI-driven career assessment is completely free for all students. We want to help you find your path without any barriers."
          />
          <FaqItem 
            question="How long do the courses take?" 
            answer="Our courses are self-paced, meaning you can learn at your own speed. Most students complete the introductory courses in 2-4 weeks while working or studying."
          />
          <FaqItem 
            question="Are the coaches industry professionals?" 
            answer="Absolutely. All our coaches undergo a rigorous verification process and must have at least 5 years of verified experience in their respective professional fields."
          />
          <FaqItem 
            question="Can I upgrade from a free plan to a paid plan?" 
            answer="Yes, you can upgrade at any time to gain access to 1:1 coaching, advanced workshops, and our highly respected certification exams."
          />
        </div>
      </section>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="card-glass overflow-hidden transition-all duration-300 border-transparent hover:border-primary-500/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-7 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-xl font-extrabold text-light-text dark:text-white">{question}</span>
        <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {isOpen && (
        <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-light-subtext dark:text-gray-300 leading-relaxed text-lg font-medium">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
