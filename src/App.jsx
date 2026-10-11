import React, { useState, useEffect } from 'react';
import { 
  Trophy, Star, Users, CheckSquare, BarChart2, 
  Plus, Trash2, Globe, Award, Moon, Sun, ChevronLeft, ChevronRight, LogOut, Filter
} from 'lucide-react';

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const INITIAL_TEACHERS = [
  { id: '1', name: 'أستاذة مريم', avatar: '👩‍🏫' },
  { id: '2', name: 'أستاذة أمل', avatar: '👩‍🏫' }
];

const INITIAL_CATEGORIES = [
  { id: '1', nameAr: 'الإنماء المهني' },
  { id: '2', nameAr: 'التحضير' },
  { id: '3', nameAr: 'الواجبات' },
  { id: '4', nameAr: 'مشاركة الأعمال' },
  { id: '5', nameAr: 'سرعة تنفيذ الأعمال' },
  { id: '6', nameAr: 'تنزيل الأعمال فالپادلت' },
  { id: '7', nameAr: 'تفعيل المبادرات' }
];

export default function App() {
  const [lang, setLang] = useState('ar');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('eval'); // 'eval' أو 'stats'
  const [year, setYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // أكتوبر (index 9)
  const [selectedWeekFilter, setSelectedWeekFilter] = useState('all');

  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [evaluations, setEvaluations] = useState([]); // { teacherId, categoryId, stars, year, month }

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  // استرجاع البيانات من LocalStorage
  useEffect(() => {
    const savedTeachers = localStorage.getItem('bmc_teachers_v2');
    const savedCategories = localStorage.getItem('bmc_categories_v2');
    const savedEvals = localStorage.getItem('bmc_evals_v2');
    const savedDark = localStorage.getItem('bmc_dark_v2');

    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedEvals) setEvaluations(JSON.parse(savedEvals));
    if (savedDark) setDarkMode(JSON.parse(savedDark));
  }, []);

  useEffect(() => {
    localStorage.setItem('bmc_teachers_v2', JSON.stringify(teachers));
    localStorage.setItem('bmc_categories_v2', JSON.stringify(categories));
    localStorage.setItem('bmc_evals_v2', JSON.stringify(evaluations));
    localStorage.setItem('bmc_dark_v2', JSON.stringify(darkMode));
  }, [teachers, categories, evaluations, darkMode]);

  // حساب نجمة معلمة لمهمة معينة في الشهر والسنة المحددة
  const getTeacherTaskStars = (teacherId, categoryId) => {
    const found = evaluations.find(
      e => e.teacherId === teacherId && 
           e.categoryId === categoryId && 
           e.year === year && 
           e.month === selectedMonth
    );
    return found ? found.stars : 0;
  };

  // تقييم مهمة لمعلمة
  const setTaskStars = (teacherId, categoryId, stars) => {
    setEvaluations(prev => {
      const filtered = prev.filter(
        e => !(e.teacherId === teacherId && e.categoryId === categoryId && e.year === year && e.month === selectedMonth)
      );
      if (stars > 0) {
        return [...filtered, { teacherId, categoryId, stars, year, month: selectedMonth }];
      }
      return filtered;
    });
  };

  // حساب إجمالي نجوم معلّمة لشهر محدد
  const getTeacherMonthlyStars = (teacherId, m = selectedMonth, y = year) => {
    return evaluations
      .filter(e => e.teacherId === teacherId && e.month === m && e.year === y)
      .reduce((sum, item) => sum + item.stars, 0);
  };

  // حساب إجمالي نجوم معلّمة للسنة كاملة
  const getTeacherYearlyStars = (teacherId, y = year) => {
    return evaluations
      .filter(e => e.teacherId === teacherId && e.year === y)
      .reduce((sum, item) => sum + item.stars, 0);
  };

  // المعلمة الفائزة بنجمة الشهر
  const getTopMonthlyTeacher = () => {
    let topTeacher = null;
    let maxStars = -1;
    teachers.forEach(t => {
      const stars = getTeacherMonthlyStars(t.id);
      if (stars > maxStars) {
        maxStars = stars;
        topTeacher = t;
      }
    });
    return { teacher: topTeacher, stars: maxStars > 0 ? maxStars : 0 };
  };

  // المعلمة الفائزة بنجمة السنة
  const getTopYearlyTeacher = () => {
    let topTeacher = null;
    let maxStars = -1;
    teachers.forEach(t => {
      const stars = getTeacherYearlyStars(t.id);
      if (stars > maxStars) {
        maxStars = stars;
        topTeacher = t;
      }
    });
    return { teacher: topTeacher, stars: maxStars > 0 ? maxStars : 0 };
  };

  // إضافة معلمة جديدة
  const handleAddTeacher = () => {
    if (!newTeacherName.trim()) return;
    const newTeacher = {
      id: Date.now().toString(),
      name: newTeacherName,
      avatar: '👩‍🏫'
    };
    setTeachers([...teachers, newTeacher]);
    setNewTeacherName('');
  };

  // حذف معلمة
  const handleDeleteTeacher = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المعلمة؟')) {
      setTeachers(teachers.filter(t => t.id !== id));
      setEvaluations(evaluations.filter(e => e.teacherId !== id));
    }
  };

  // إضافة مهمة
  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    const newCat = {
      id: Date.now().toString(),
      nameAr: newTaskName
    };
    setCategories([...categories, newCat]);
    setNewTaskName('');
  };

  // حذف مهمة
  const handleDeleteTask = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      setCategories(categories.filter(c => c.id !== id));
      setEvaluations(evaluations.filter(e => e.categoryId !== id));
    }
  };

  const topMonthly = getTopMonthlyTeacher();
  const topYearly = getTopYearlyTeacher();

  // إحصائيات عامة
  const totalEvaluatedStarsFiltered = evaluations
    .filter(e => e.year === year && e.month === selectedMonth)
    .reduce((sum, item) => sum + item.stars, 0);

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-[#181824] text-white' : 'bg-[#FFD6E5] text-[#333]'}`}>
      
      {/* Top Main Bar */}
      <div className={`p-4 shadow-sm border-b flex flex-wrap justify-between items-center gap-4 ${darkMode ? 'bg-[#222232] border-gray-800' : 'bg-white/90 border-pink-200'} rounded-b-3xl max-w-7xl mx-auto mt-2 px-6`}>
        <div className="flex items-center gap-2">
          <div className="bg-[#FF4D80] text-white p-2 rounded-xl flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <span className="font-extrabold text-xl text-[#FF4D80]">Bright Minds Crew</span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-pink-50 p-1.5 rounded-2xl border border-pink-200">
          <button 
            onClick={() => setActiveTab('eval')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'eval' ? 'bg-[#FF4D80] text-white shadow-md' : 'text-gray-600 hover:text-[#FF4D80]'}`}
          >
            🗓️ الرصد والتسجيل
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'stats' ? 'bg-[#FF4D80] text-white shadow-md' : 'text-gray-600 hover:text-[#FF4D80]'}`}
          >
            📊 صفحة الإحصائيات
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${darkMode ? 'bg-gray-800 text-amber-400 border-gray-700' : 'bg-white text-gray-700 border-pink-200'}`}
          >
            {darkMode ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن'}
          </button>

          <button 
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 bg-white border border-pink-200 text-gray-700 rounded-xl text-xs font-bold"
          >
            {lang === 'ar' ? 'English 🌐' : 'العربية 🌐'}
          </button>

          <button className="px-3 py-2 bg-[#FF4D80] text-white rounded-xl text-xs font-bold flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" /> خروج
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* PAGE 1: الرصد والتسجيل */}
        {activeTab === 'eval' && (
          <>
            {/* Year & Months Selector Bar */}
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-4 bg-white/80 backdrop-blur border border-pink-200 rounded-2xl p-2 max-w-sm mx-auto shadow-sm">
                <button onClick={() => setYear(year - 1)} className="p-1 hover:bg-pink-100 rounded-lg"><ChevronRight className="w-5 h-5 text-[#FF4D80]" /></button>
                <span className="font-extrabold text-lg text-[#FF4D80]">{year}</span>
                <button onClick={() => setYear(year + 1)} className="p-1 hover:bg-pink-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-[#FF4D80]" /></button>
                
                <button 
                  onClick={() => {
                    const name = prompt('أدخل اسم المعلمة الجديدة:');
                    if (name) {
                      setTeachers([...teachers, { id: Date.now().toString(), name, avatar: '👩‍🏫' }]);
                    }
                  }}
                  className="mr-auto px-3 py-1.5 bg-[#FF4D80] text-white text-xs font-bold rounded-xl shadow hover:bg-pink-600 transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> إضافة معلمة جديدة
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 bg-white/60 p-2 rounded-2xl border border-pink-200 shadow-sm text-center">
                {MONTHS_AR.map((mName, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMonth(idx)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${selectedMonth === idx ? 'bg-[#FF4D80] text-white shadow-md scale-105' : 'bg-white/80 text-gray-700 hover:bg-pink-100'}`}
                  >
                    {mName}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Champions Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Monthly Star Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-700 mb-1">نجمة الشهر (الأعلى نشاطاً بالشهر)</p>
                  <h3 className="text-xl font-black text-amber-900">
                    {topMonthly.teacher ? topMonthly.teacher.name : 'لا تتوفر تقييمات'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-amber-400 text-white px-4 py-2 rounded-2xl font-black shadow-md">
                  <Trophy className="w-6 h-6 fill-white" />
                  <span>★ {topMonthly.stars}</span>
                </div>
              </div>

              {/* Yearly Star Card */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-pink-700 mb-1">نجمة السنة (الأعلى تقييماً سنوياً)</p>
                  <h3 className="text-xl font-black text-pink-900">
                    {topYearly.teacher ? topYearly.teacher.name : 'لا تتوفر تقييمات'}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-[#FF4D80] text-white px-4 py-2 rounded-2xl font-black shadow-md">
                  <Award className="w-6 h-6" />
                  <span>★ {topYearly.stars}</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid: Tasks Sidebar & Teachers Rating Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Task Management Sidebar */}
              <div className="lg:col-span-1 bg-white p-5 rounded-3xl border border-pink-200 shadow-sm space-y-4">
                <h3 className="font-black text-base text-gray-800 flex items-center gap-2 border-b pb-3">
                  <CheckSquare className="w-5 h-5 text-[#FF4D80]" /> إدارة المهام
                </h3>

                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="اسم المهمة الجديدة..." 
                    value={newTaskName}
                    onChange={e => setNewTaskName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF4D80]"
                  />
                  <button 
                    onClick={handleAddTask}
                    className="w-full py-2.5 bg-[#FF4D80] text-white font-bold rounded-xl text-xs shadow hover:bg-pink-600 transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> إضافة مهمة
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-2.5 bg-pink-50 rounded-xl border border-pink-100 flex items-center justify-between text-xs font-bold text-gray-700">
                      <span>{cat.nameAr}</span>
                      <button onClick={() => handleDeleteTask(cat.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teachers Cards List */}
              <div className="lg:col-span-3 space-y-6">
                {teachers.map(teacher => {
                  const monthlyScore = getTeacherMonthlyStars(teacher.id);
                  return (
                    <div key={teacher.id} className="bg-white p-6 rounded-3xl border border-pink-200 shadow-sm space-y-4">
                      
                      {/* Teacher Card Header */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{teacher.avatar}</span>
                          <h3 className="font-extrabold text-lg text-gray-800">{teacher.name}</h3>
                          <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Total Monthly Score Badge */}
                        <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-full font-black text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{monthlyScore}</span>
                        </div>
                      </div>

                      {/* Tasks Grid Rating */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map(cat => {
                          const currentStars = getTeacherTaskStars(teacher.id, cat.id);
                          return (
                            <div key={cat.id} className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2 text-center">
                              <p className="text-xs font-bold text-gray-700 truncate">{cat.nameAr}</p>
                              
                              {/* Interactive 5 Stars */}
                              <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => setTaskStars(teacher.id, cat.id, star === currentStars ? 0 : star)}
                                    className="p-0.5 transition hover:scale-125"
                                  >
                                    <Star className={`w-5 h-5 ${star <= currentStars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          </>
        )}

        {/* PAGE 2: صفحة الإحصائيات */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-3xl border border-pink-200 shadow-sm space-y-3">
              <h3 className="font-black text-base text-[#FF4D80] flex items-center gap-2">
                <Filter className="w-5 h-5" /> تصفية الإحصائيات بالأسابيع
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">اختر الشهر:</label>
                  <select 
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    {MONTHS_AR.map((m, idx) => (
                      <option key={idx} value={idx}>{m} / {year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">اختر الأسبوع:</label>
                  <select 
                    value={selectedWeekFilter}
                    onChange={e => setSelectedWeekFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    <option value="all">كل أسابيع الشهر (الشهر كاملاً)</option>
                    <option value="w1">الأسبوع الأول</option>
                    <option value="w2">الأسبوع الثاني</option>
                    <option value="w3">الأسبوع الثالث</option>
                    <option value="w4">الأسبوع الرابع</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-pink-200 shadow-sm text-center space-y-1">
                <p className="text-xs text-gray-500 font-bold">إجمالي المعلمات</p>
                <h3 className="text-3xl font-black text-[#FF4D80]">{teachers.length}</h3>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-pink-200 shadow-sm text-center space-y-1">
                <p className="text-xs text-gray-500 font-bold">مجموع النجوم الممنوحة للفترة</p>
                <h3 className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-amber-400" /> {totalEvaluatedStarsFiltered}
                </h3>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-pink-200 shadow-sm text-center space-y-1">
                <p className="text-xs text-gray-500 font-bold">الأعلى أداءً بالفترة</p>
                <h3 className="text-xl font-black text-gray-800">
                  {topMonthly.teacher ? topMonthly.teacher.name : '---'}
                </h3>
              </div>
            </div>

            {/* Performance Comparison Bar Chart */}
            <div className="bg-white p-6 rounded-3xl border border-pink-200 shadow-sm space-y-6">
              <h3 className="font-black text-base text-gray-800">📊 مقارنة أداء المعلمات (النجوم)</h3>

              <div className="space-y-4 pt-4">
                {teachers.map(t => {
                  const stars = getTeacherMonthlyStars(t.id);
                  const maxPossible = categories.length * 5; // أقصى عدد نجوم محتمل
                  const percentage = maxPossible > 0 ? Math.min(100, Math.round((stars / maxPossible) * 100)) : 0;

                  return (
                    <div key={t.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{t.name}</span>
                        <span className="text-amber-500 font-black">{stars} نجمة</span>
                      </div>
                      <div className="w-full h-4 bg-pink-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-400 to-[#FF4D80] transition-all duration-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}