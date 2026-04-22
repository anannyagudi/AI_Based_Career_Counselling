import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { questions10th, questions12th } from '../data/questions';
import CourseCard from './CourseCard';

const Questionnaire = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(new Array(10).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  const questions = category === '10th' ? questions10th : questions12th;
  const categoryLabel = category === '10th' ? 'After 10th' : 'After 12th';

  useEffect(() => {
    if (category !== '10th' && category !== '12th') {
      navigate('/');
    }
  }, [category, navigate]);

  const handleOptionChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app we'd get userId from auth context
      const payload = {
        userId: "64a2c091f0eb1a052b0f4a21", // Dummy MongoDB ObjectId for demo
        category: categoryLabel,
        responses: answers
      };

      const response = await axios.post('http://localhost:5000/api/predict', payload);
      setResult(response.data);
      
      // Fetch related courses
      setLoadingCourses(true);
      try {
        const coursesRes = await axios.get(`http://localhost:5000/api/courses/topic/${response.data.recommendedCareer}`);
        setRecommendedCourses(coursesRes.data);
      } catch (err) {
        console.error("Failed to fetch related courses:", err);
      } finally {
        setLoadingCourses(false);
      }

    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("An error occurred while submitting. Make sure your local servers are running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-5xl mx-auto pt-10 animate-fade-in space-y-12">
        <div className="max-w-2xl mx-auto card-glass text-center space-y-8">
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-4xl font-extrabold text-light-text dark:text-dark-text leading-tight">Assessment Complete!</h2>
          
          <div className="p-10 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-inner">
            <h3 className="text-light-subtext dark:text-gray-400 font-bold text-sm mb-3 uppercase tracking-[0.2em]">Recommended Career Path</h3>
            <p className="text-4xl md:text-5xl font-black text-primary-600 dark:text-primary-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {result.recommendedCareer}
            </p>
            
            <div className="flex items-center justify-between text-left gap-6">
              <div className="flex-shrink-0">
                <span className="text-sm text-light-subtext dark:text-gray-400 font-bold block mb-1">Confidence Score</span>
                <span className="text-3xl font-black text-light-text dark:text-dark-text">{result.confidenceScore}%</span>
              </div>
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-1000"
                  style={{ width: `${result.confidenceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {loadingCourses ? (
             <div className="py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
             </div>
          ) : recommendedCourses.length > 0 && (
            <div className="text-left w-full space-y-8 animate-fade-in mx-auto mt-4 px-4">
              <h3 className="text-3xl font-extrabold text-light-text dark:text-dark-text border-b border-gray-100 dark:border-gray-800 pb-4 text-center">
                Recommended Courses for You
              </h3>
              <div className={`grid gap-8 w-full ${
                recommendedCourses.length === 1 
                  ? 'grid-cols-1 max-w-md mx-auto' 
                  : recommendedCourses.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {recommendedCourses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto mt-12 pb-12">
            <button onClick={() => navigate('/')} className="btn-primary w-full text-lg">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="mb-10 items-center flex justify-between">
         <button onClick={() => navigate('/')} className="text-light-subtext hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 flex items-center gap-2 transition-colors font-bold text-sm uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Back to Home
         </button>
         <div className="flex items-center gap-4">
           <span className="text-xs font-black text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              {categoryLabel} Assessment
           </span>
         </div>
      </div>

      <div className="card-glass relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-teal-500 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pt-6 pb-8 border-b border-gray-100 dark:border-gray-800 mb-10 flex justify-between items-center text-sm font-bold text-light-subtext dark:text-gray-400 uppercase tracking-widest">
           <span>Question {currentStep + 1} / {questions.length}</span>
           <span className="text-primary-600 dark:text-primary-400">{Math.round(progress)}% Complete</span>
        </div>

        <h3 className="text-3xl font-extrabold mb-10 text-light-text dark:text-dark-text leading-tight">
          {currentQ.text}
        </h3>

        <div className="space-y-4 mb-12">
          {currentQ.options.map((option, idx) => (
            <label 
              key={idx} 
              className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
                ${answers[currentStep] === option.value 
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-lg shadow-primary-500/10' 
                  : 'border-gray-100 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 bg-white/50 dark:bg-transparent shadow-sm'
                }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 transition-all
                ${answers[currentStep] === option.value 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-primary-500'
                }`}>
                 {answers[currentStep] === option.value && (
                   <div className="w-2 h-2 rounded-full bg-white" />
                 )}
              </div>
              <input 
                type="radio" 
                name={`question-${currentStep}`} 
                value={option.value}
                checked={answers[currentStep] === option.value}
                onChange={() => handleOptionChange(option.value)}
                className="hidden"
              />
              <span className={`text-xl transition-colors ${
                answers[currentStep] === option.value 
                  ? 'text-primary-700 dark:text-primary-300 font-extrabold' 
                  : 'text-light-text dark:text-gray-300 font-bold'
              }`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center gap-6">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className={`btn-secondary flex-1 flex items-center justify-center gap-2 ${currentStep === 0 ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          
          {currentStep === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting || answers.includes(null)}
              className="btn-primary flex-[2] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? 'Processing...' : 'Submit Assessment'}
              {!isSubmitting && <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            </button>
          ) : (
            <button 
              onClick={handleNext} 
              disabled={!answers[currentStep]}
              className="btn-primary flex-[2] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Next Step <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
