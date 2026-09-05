import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Book, User, Tag, ShieldCheck, ChevronLeft, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      setError('Failed to fetch course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      setError('Please login to enroll in a course');
      return;
    }

    if (user.role !== 'student') {
      setError('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/courses/${id}/enroll`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      setEnrolled(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-light-text dark:text-white mb-4">{error}</h2>
        <Link to="/explore" className="text-primary-600 font-bold hover:underline flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Link to="/explore" className="flex items-center text-light-subtext dark:text-gray-400 font-bold mb-8 hover:text-primary-600 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Explore
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <span className="px-5 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-primary-100 dark:border-primary-900/50">
              {course.topic}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-light-text dark:text-white leading-tight">
              {course.title}
            </h1>
          </div>

          <div className="card-glass p-8">
            <h2 className="text-xl font-black text-light-text dark:text-white mb-6 flex items-center">
              <Book className="w-6 h-6 mr-3 text-primary-600" />
              Course Description
            </h2>
            <p className="text-lg text-light-subtext dark:text-gray-300 leading-relaxed font-medium">
              {course.description}
            </p>
          </div>

          <div className="card-glass p-8">
            <h2 className="text-xl font-black text-light-text dark:text-white mb-6 flex items-center">
              <ShieldCheck className="w-6 h-6 mr-3 text-teal-600" />
              What you'll learn
            </h2>
            <ul className="space-y-4">
              {['Comprehensive industry insights', 'Practical skills and techniques', 'Expert guidance and feedback', 'Certification post-completion'].map((item, i) => (
                <li key={i} className="flex items-start text-light-subtext dark:text-gray-300 font-medium">
                  <CheckCircle className="w-5 h-5 mr-3 text-teal-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 card-glass p-8 space-y-8 border-2 border-primary-500/10">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
                {course.pricePlan === 'free' ? 'FREE' : `₹${course.price}`}
              </div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-light-subtext dark:text-gray-500">
                {course.pricePlan}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="text-[10px] text-light-subtext/50 dark:text-gray-500 uppercase font-black tracking-widest">Instructor</div>
                  <div className="font-black text-light-text dark:text-white">{course.coach?.name}</div>
                </div>
              </div>
            </div>

            {enrolled ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-xs border border-emerald-100 dark:border-emerald-900/50">
                <CheckCircle className="w-4 h-4 mr-2" />
                Enrolled Successfully
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center space-x-2 ${
                  enrolling
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white hover:-translate-y-1'
                }`}
              >
                {enrolling ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-b-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Enroll Now</span>
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="flex items-center text-red-500 text-xs font-bold leading-tight">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-6 text-center">
              <p className="text-[10px] text-light-subtext dark:text-gray-500 font-bold uppercase tracking-widest">
                30-day money back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
