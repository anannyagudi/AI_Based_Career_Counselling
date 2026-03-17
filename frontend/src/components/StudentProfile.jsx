import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, BookOpen, ChevronRight, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { 'x-auth-token': token }
      });
      setProfile(res.data);
    } catch (err) {
      setError('Failed to fetch profile details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-light-text dark:text-white mb-2">My Profile</h1>
        <p className="text-light-subtext dark:text-gray-400 font-bold">Manage your account and track your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-glass p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-gray-800 shadow-xl">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-black text-light-text dark:text-white mb-1">{profile?.name}</h2>
            <span className="px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-primary-100 dark:border-primary-900/50">
              {profile?.role}
            </span>

            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-light-subtext dark:text-gray-400">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold">{profile?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-light-subtext dark:text-gray-400">
                <Calendar className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-bold">Joined {new Date(profile?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="card-glass p-8">
            <h3 className="text-lg font-black text-light-text dark:text-white mb-6 flex items-center">
              <Award className="w-5 h-5 mr-3 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <Clock className="w-5 h-5 text-teal-500 mr-3" />
                <div>
                  <div className="text-xs font-black text-light-text dark:text-white uppercase tracking-tighter">Early Adopter</div>
                  <div className="text-[10px] text-light-subtext dark:text-gray-500 font-bold">Joined during beta launch</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-light-text dark:text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-primary-600" />
              Enrolled Courses
            </h3>
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-black rounded-lg">
              {profile?.enrolledCourses?.length || 0}
            </span>
          </div>

          {!profile?.enrolledCourses || profile.enrolledCourses.length === 0 ? (
            <div className="card-glass p-20 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-light-subtext dark:text-gray-400 text-xl font-bold mb-8">You haven't enrolled in any courses yet.</p>
              <Link to="/explore" className="btn-primary inline-flex items-center">
                Explore Courses <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.enrolledCourses.map(course => (
                <Link key={course._id} to={`/course/${course._id}`} className="card-glass group hover:-translate-y-1 transition-all overflow-hidden border-transparent hover:border-primary-500/20">
                  <div className="h-1.5 bg-primary-600 w-0 group-hover:w-full transition-all duration-500"></div>
                  <div className="p-6">
                    <div className="mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                        {course.topic}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-light-text dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-light-subtext dark:text-gray-400 line-clamp-2 font-medium mb-6">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-500" />
                        </div>
                        <span className="text-[10px] font-black text-light-subtext dark:text-gray-500">{course.coach?.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
