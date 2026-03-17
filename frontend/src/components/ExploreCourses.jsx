import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, User, Tag, ShieldCheck, ExternalLink, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      let url = 'http://localhost:5000/api/courses';
      if (filter) {
        url = `http://localhost:5000/api/courses/topic/${filter}`;
      }
      const res = await axios.get(url);
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-primary-600 mb-6 tracking-tight">
          Explore Future Careers
        </h1>
        <p className="text-xl text-light-subtext dark:text-gray-300 max-w-2xl mx-auto font-bold leading-relaxed">
          Find specialized courses created by industry experts to excel in your recommended career path.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-12 items-center justify-between">
        <div className="relative w-full lg:w-[32rem]">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-light-subtext dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for skills, topics, or coaches..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-dark-bg/70 backdrop-blur-md focus:border-teal-500 dark:focus:border-teal-500 outline-none shadow-xl shadow-gray-200/20 dark:shadow-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-light-subtext/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 w-full lg:w-auto no-scrollbar">
          <button
            onClick={() => setFilter('')}
            className={`px-8 py-3 rounded-xl font-black transition-all whitespace-nowrap uppercase tracking-widest text-xs shadow-lg ${
              filter === '' 
              ? 'bg-teal-600 text-white shadow-teal-500/20' 
              : 'bg-white dark:bg-gray-800 text-light-subtext dark:text-gray-400 hover:bg-teal-50 hover:text-teal-600 shadow-gray-200/50 dark:shadow-none'
            }`}
          >
            All Tracks
          </button>
          {['Engineering', 'Medicine', 'Business', 'Arts', 'Data Science', 'Law', 'Research'].map(topic => (
            <button
              key={topic}
              onClick={() => setFilter(topic)}
              className={`px-8 py-3 rounded-xl font-black transition-all whitespace-nowrap uppercase tracking-widest text-xs shadow-lg ${
                filter === topic 
                ? 'bg-teal-600 text-white shadow-teal-500/20' 
                : 'bg-white dark:bg-gray-800 text-light-subtext dark:text-gray-400 hover:bg-teal-50 hover:text-teal-600 shadow-gray-200/50 dark:shadow-none'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-20 text-center card-glass">
              <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-medium">No courses found matching your criteria.</p>
            </div>
          ) : (
            filteredCourses.map(course => (
              <div key={course._id} className="card-glass overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
                <div className="h-2 bg-gradient-to-r from-teal-500 to-primary-600"></div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <span className="px-5 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-teal-100 dark:border-teal-900/50 shadow-sm">
                      {course.topic}
                    </span>
                    <div className={`flex items-center text-sm font-black tracking-widest ${course.pricePlan === 'free' ? 'text-emerald-500' : 'text-primary-600'}`}>
                      <Tag className="w-4 h-4 mr-1.5" />
                      {course.pricePlan === 'free' ? 'FREE' : `₹${course.price}`}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-light-text dark:text-white mb-4 group-hover:text-teal-600 transition-colors leading-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-light-subtext dark:text-gray-300 leading-relaxed mb-10 flex-1 font-medium italic">
                    "{course.description}"
                  </p>
                  
                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-inner">
                        <User className="w-6 h-6 text-light-subtext dark:text-gray-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-light-subtext/50 dark:text-gray-500 uppercase font-black tracking-widest mb-0.5">Coach</span>
                        <span className="text-sm font-black text-light-text dark:text-dark-text">{course.coach?.name || 'Expert Counselor'}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/course/${course._id}`}
                      className="flex items-center text-teal-600 dark:text-teal-400 font-extrabold hover:translate-x-1 transition-all text-sm uppercase tracking-widest"
                    >
                      <span>Details</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;
