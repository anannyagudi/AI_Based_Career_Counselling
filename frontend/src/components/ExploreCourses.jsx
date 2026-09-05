import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Search } from 'lucide-react';
import CourseCard from './CourseCard';
import { API_URL } from '../config';

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
      let url = `${API_URL}/api/courses`;
      if (filter) {
        url = `${API_URL}/api/courses/topic/${filter}`;
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
              <CourseCard key={course._id} course={course} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;
