import React from 'react';
import { User, Tag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="card-glass overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full text-left">
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
        
        <p className="text-light-subtext dark:text-gray-300 leading-relaxed mb-10 flex-1 font-medium italic mx-0">
          "{course.description}"
        </p>
        
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-inner">
              <User className="w-6 h-6 text-light-subtext dark:text-gray-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-light-subtext/50 dark:text-gray-500 uppercase font-black tracking-widest mb-0.5">Coach</span>
              <span className="text-sm font-black text-light-text dark:text-dark-text pt-0 mt-0 transform-none">{course.coach?.name || 'Expert Counselor'}</span>
            </div>
          </div>
          <Link 
            to={`/course/${course._id}`}
            className="flex items-center text-teal-600 dark:text-teal-400 font-extrabold hover:translate-x-1 transition-all text-sm uppercase tracking-widest m-0"
          >
            <span>Details</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
