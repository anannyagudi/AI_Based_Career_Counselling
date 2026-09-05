import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, BookOpen, Clock, Tag, DollarSign } from 'lucide-react';
import { API_URL } from '../config';

const CoachDashboard = () => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    pricePlan: 'free',
    price: 0
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/my-courses`, {
        headers: { 'x-auth-token': token }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
      alert(`Error fetching courses: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/courses`, formData, {
        headers: { 'x-auth-token': token }
      });
      setShowForm(false);
      setFormData({ title: '', description: '', topic: '', pricePlan: 'free', price: 0 });
      fetchMyCourses();
    } catch (err) {
      alert('Failed to create course');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-light-text dark:text-dark-text tracking-tight">Coach Dashboard</h1>
          <p className="text-lg text-light-subtext dark:text-gray-400 mt-2 font-bold">Empower students by sharing your expertise through specialized courses.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 ${
            showForm 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-red-200/50 dark:bg-red-900/10 dark:text-red-400 dark:shadow-none' 
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/30'
          }`}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="uppercase tracking-widest text-sm">{showForm ? 'Discard Changes' : 'Create New Course'}</span>
        </button>
      </div>

      {showForm && (
        <div className="card-glass p-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-500 border-primary-500/20 shadow-primary-500/5">
          <h2 className="text-2xl font-black mb-10 text-light-text dark:text-dark-text flex items-center gap-3">
             <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
             Course Details
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Course Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300"
                placeholder="e.g., Master Data Analysis with Python"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300"
                placeholder="Briefly describe what students will achieve..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Topic / Career Track</label>
              <select
                name="topic"
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text"
                value={formData.topic}
                onChange={handleChange}
              >
                <option value="">Select Topic</option>
                <option value="Engineering">Engineering</option>
                <option value="Medicine">Medicine</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Data Science">Data Science</option>
                <option value="Law">Law</option>
                <option value="Research">Research</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Price Plan</label>
                <select
                  name="pricePlan"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text"
                  value={formData.pricePlan}
                  onChange={handleChange}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {formData.pricePlan === 'paid' && (
                <div className="animate-in fade-in slide-in-from-left-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      name="price"
                      className="w-full pl-10 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex justify-end pt-4">
              <button type="submit" className="btn-primary w-full md:w-auto px-12 text-sm uppercase tracking-widest">
                Launch Course
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full py-20 text-center card-glass p-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">You haven't created any courses yet.</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course._id} className="card-glass p-8 group hover:shadow-primary-500/5 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-5 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-primary-100 dark:border-primary-900/50">
                    {course.topic}
                  </span>
                  <div className={`flex items-center text-sm font-black tracking-widest ${course.pricePlan === 'free' ? 'text-emerald-500' : 'text-primary-600'}`}>
                    <Tag className="w-4 h-4 mr-1.5" />
                    {course.pricePlan === 'free' ? 'FREE' : `$${course.price}`}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 text-light-text dark:text-dark-text group-hover:text-primary-600 transition-colors leading-tight">
                  {course.title}
                </h3>
                <p className="text-light-subtext dark:text-gray-300 text-sm mb-8 line-clamp-3 font-medium flex-1">
                  {course.description}
                </p>
                <div className="flex items-center text-light-subtext/50 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest space-x-6 border-t border-gray-100 dark:border-gray-800 pt-6 mt-auto">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
