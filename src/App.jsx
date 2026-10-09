import React, { useState, useEffect } from 'react';
import { 
  Trophy, Star, Users, CheckSquare, BarChart2, 
  Plus, Trash2, Globe, Award
} from 'lucide-react';

const TRANSLATIONS = {
  ar: {
    title: "طاقم العقول النيرة",
    subtitle: "منصة تقييم وتحفيز معلمات اللغة الإنجليزية",
    dashboard: "لوحة التحكم",
    team: "إدارة الفريق",
    tasks: "فئات المهام",
    evaluations: "التقييمات",
    weeklyLeaders: "أبطال الأسبوع",
    monthlyLeaders: "أبطال الشهر",
    totalStars: "إجمالي النجوم",
    weeklyStars: "نجوم الأسبوع",
    monthlyStars: "نجوم الشهر",
    activeTeachers: "المعلمات النشطات",
    evaluationsCount: "عدد التقييمات",
    addTeacher: "إضافة معلمة",
    addTask: "إضافة فئة مهمة",
    evaluate: "تقييم جديد",
    teacherName: "اسم المعلمة",
    taskNameAr: "اسم المهمة (بالعربية)",
    taskNameEn: "اسم المهمة (بالإنجليزية)",
    category: "فئة المهمة",
    stars: "النجوم",
    notes: "ملاحظات",
    date: "التاريخ",
    actions: "الإجراءات",
    role: "الدور",
    admin: "مشرفة / أدمن",
    member: "معلمة",
    save: "حفظ",
    cancel: "إلغاء",
    podiumTitle: "لوحة الشرف والأبطال",
    switchLanguage: "English",
    confirmDeleteTeacher: "هل أنت متأكد من حذف هذه المعلمة؟",
    confirmDeleteTask: "هل أنت متأكد من حذف هذه المهمة؟",
    quickEval: "تقييم سريح"
  },
  en: {
    title: "Bright Minds Crew",
    subtitle: "English Teachers Evaluation & Motivation Platform",
    dashboard: "Dashboard",
    team: "Team Management",
    tasks: "Task Categories",
    evaluations: "Evaluations",
    weeklyLeaders: "Weekly Leaders",
    monthlyLeaders: "Monthly Leaders",
    totalStars: "Total Stars",
    weeklyStars: "Weekly Stars",
    monthlyStars: "Monthly Stars",
    activeTeachers: "Active Teachers",
    evaluationsCount: "Evaluations Count",
    addTeacher: "Add Teacher",
    addTask: "Add Task Category",
    evaluate: "New Evaluation",
    teacherName: "Teacher Name",
    taskNameAr: "Task Name (Arabic)",
    taskNameEn: "Task Name (English)",
    category: "Task Category",
    stars: "Stars",
    notes: "Notes",
    date: "Date",
    actions: "Actions",
    role: "Role",
    admin: "Supervisor / Admin",
    member: "Teacher",
    save: "Save",
    cancel: "Cancel",
    podiumTitle: "Leaderboard & Champions",
    switchLanguage: "العربية",
    confirmDeleteTeacher: "Are you sure you want to delete this teacher?",
    confirmDeleteTask: "Are you sure you want to delete this task category?",
    quickEval: "Evaluate"
  }
};

const INITIAL_TEACHERS = [
  { id: '1', name: 'أمل الغافرية', role: 'admin', stars: 45, weeklyStars: 12, monthlyStars: 32, avatar: '👩‍🏫' },
  { id: '2', name: 'سارة البلوشية', role: 'member', stars: 38, weeklyStars: 10, monthlyStars: 28, avatar: '👩‍🎓' },
  { id: '3', name: 'مريم الزدجالية', role: 'member', stars: 42, weeklyStars: 15, monthlyStars: 35, avatar: '👩‍🔬' },
  { id: '4', name: 'فاطمة المعمرية', role: 'member', stars: 29, weeklyStars: 8, monthlyStars: 22, avatar: '👩‍💻' }
];

const INITIAL_CATEGORIES = [
  { id: '1', nameAr: 'الإنماء المهني', nameEn: 'Professional Development' },
  { id: '2', nameAr: 'التحضير والتخطيط', nameEn: 'Lesson Preparation' },
  { id: '3', nameAr: 'متابعة الواجبات', nameEn: 'Homework Tracking' },
  { id: '4', nameAr: 'مشاركة الأعمال المتميزة', nameEn: 'Sharing Work' },
  { id: '5', nameAr: 'سرعة تنفيذ المهام', nameEn: 'Task Execution Speed' },
  { id: '6', nameAr: 'تنزيل الأعمال في البادلت', nameEn: 'Padlet Uploads' },
  { id: '7', nameAr: 'تفعيل المبادرات والأنشطة', nameEn: 'Activating Initiatives' }
];

export default function App() {
  const [lang, setLang] = useState('ar');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [evaluations, setEvaluations] = useState([]);
  
  // Modals state
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Evaluation form state
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [starsGiven, setStarsGiven] = useState(5);
  const [comment, setComment] = useState('');

  // New Teacher form state
  const [newTeacherName, setNewTeacherName] = useState('');

  // New Task form state
  const [newTaskAr, setNewTaskAr] = useState('');
  const [newTaskEn, setNewTaskEn] = useState('');

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const savedTeachers = localStorage.getItem('bmc_teachers');
    const savedCategories = localStorage.getItem('bmc_categories');
    const savedEvaluations = localStorage.getItem('bmc_evaluations');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedEvaluations) setEvaluations(JSON.parse(savedEvaluations));
  }, []);

  useEffect(() => {
    localStorage.setItem('bmc_teachers', JSON.stringify(teachers));
    localStorage.setItem('bmc_categories', JSON.stringify(categories));
    localStorage.setItem('bmc_evaluations', JSON.stringify(evaluations));
  }, [teachers, categories, evaluations]);

  // فتح نافذة التقييم لمعلمة محددة مباشرة
  const openEvalForTeacher = (teacherId) => {
    setSelectedTeacher(teacherId);
    if (categories.length > 0) {
      setSelectedCategory(categories[0].id);
    }
    setShowEvalModal(true);
  };

  // إضافة تقييم
  const handleAddEvaluation = (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedCategory) return;

    const newEval = {
      id: Date.now().toString(),
      teacherId: selectedTeacher,
      categoryId: selectedCategory,
      stars: starsGiven,
      comment,
      date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US')
    };

    setEvaluations([newEval, ...evaluations]);

    setTeachers(teachers.map(teacher => {
      if (teacher.id === selectedTeacher) {
        return {
          ...teacher,
          stars: teacher.stars + starsGiven,
          weeklyStars: teacher.weeklyStars + starsGiven,
          monthlyStars: teacher.monthlyStars + starsGiven
        };
      }
      return teacher;
    }));

    setShowEvalModal(false);
    setComment('');
  };

  // إضافة معلمة
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacherName) return;

    const avatars = ['👩‍🏫', '👩‍🎓', '👩‍🔬', '👩‍💻', '👩‍🎨', '👩‍🏫'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const teacher = {
      id: Date.now().toString(),
      name: newTeacherName,
      role: 'member',
      stars: 0,
      weeklyStars: 0,
      monthlyStars: 0,
      avatar: randomAvatar
    };

    setTeachers([...teachers, teacher]);
    setNewTeacherName('');
    setShowTeacherModal(false);
  };

  // حذف معلمة
  const handleDeleteTeacher = (id) => {
    if (window.confirm(t.confirmDeleteTeacher)) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  // إضافة فئة مهمة
  const handleAddTaskCategory = (e) => {
    e.preventDefault();
    if (!newTaskAr) return;

    const newCategory = {
      id: Date.now().toString(),
      nameAr: newTaskAr,
      nameEn: newTaskEn || newTaskAr
    };

    setCategories([...categories, newCategory]);
    setNewTaskAr('');
    setNewTaskEn('');
    setShowTaskModal(false);
  };

  // حذف فئة مهمة
  const handleDeleteTask = (id) => {
    if (window.confirm(t.confirmDeleteTask)) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const sortedByWeekly = [...teachers].sort((a, b) => b.weeklyStars - a.weeklyStars);
  const sortedByMonthly = [...teachers].sort((a, b) => b.monthlyStars - a.monthlyStars);

  return (
    <div className={`min-h-screen bg-[#FFF7FA] text-[#342536] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#F8C2D8] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E879A9] to-[#F4A6C1] flex items-center justify-center text-white shadow-lg shadow-[#E879A9]/30">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#E879A9] to-[#C9A7E8] bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-xs text-gray-500">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF7FA] border border-[#F8C2D8] text-sm font-medium hover:bg-[#FCE7F0] transition"
              >
                <Globe className="w-4 h-4 text-[#E879A9]" />
                {t.switchLanguage}
              </button>

              <button 
                onClick={() => {
                  if (teachers.length > 0) setSelectedTeacher(teachers[0].id);
                  if (categories.length > 0) setSelectedCategory(categories[0].id);
                  setShowEvalModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E879A9] text-white font-medium hover:bg-[#C95388] shadow-md shadow-[#E879A9]/20 transition"
              >
                <Star className="w-4 h-4 fill-white" />
                {t.evaluate}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-3xl p-4 border border-[#F8C2D8] shadow-sm space-y-2">
              {[
                { id: 'dashboard', label: t.dashboard, icon: BarChart2 },
                { id: 'weekly', label: t.weeklyLeaders, icon: Trophy },
                { id: 'monthly', label: t.monthlyLeaders, icon: Award },
                { id: 'team', label: t.team, icon: Users },
                { id: 'tasks', label: t.tasks, icon: CheckSquare },
                { id: 'evaluations', label: t.evaluations, icon: Star },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                      isActive 
                        ? 'bg-[#E879A9] text-white shadow-md shadow-[#E879A9]/20' 
                        : 'text-gray-600 hover:bg-[#FFF7FA] hover:text-[#E879A9]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dynamic Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF7FA] border border-[#F8C2D8] flex items-center justify-center text-[#E879A9]">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.activeTeachers}</p>
                      <h3 className="text-2xl font-bold text-[#342536]">{teachers.length}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF7FA] border border-[#F8C2D8] flex items-center justify-center text-amber-500">
                      <Star className="w-7 h-7 fill-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.totalStars}</p>
                      <h3 className="text-2xl font-bold text-[#342536]">
                        {teachers.reduce((acc, curr) => acc + curr.stars, 0)}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF7FA] border border-[#F8C2D8] flex items-center justify-center text-[#C9A7E8]">
                      <CheckSquare className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t.evaluationsCount}</p>
                      <h3 className="text-2xl font-bold text-[#342536]">{evaluations.length}</h3>
                    </div>
                  </div>
                </div>

                {/* Podium */}
                <div className="bg-gradient-to-br from-white to-[#FFF7FA] p-6 rounded-3xl border border-[#F8C2D8] shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      {t.podiumTitle} ({t.weeklyStars})
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-end pt-8 pb-4">
                    {sortedByWeekly[1] && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{sortedByWeekly[1].avatar}</span>
                        <div className="w-full bg-slate-100 rounded-2xl p-4 border border-slate-200 text-center shadow-sm">
                          <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold mb-2">#2</span>
                          <p className="font-bold text-sm truncate">{sortedByWeekly[1].name}</p>
                          <p className="text-amber-500 font-extrabold text-lg mt-1">{sortedByWeekly[1].weeklyStars} ★</p>
                        </div>
                      </div>
                    )}

                    {sortedByWeekly[0] && (
                      <div className="flex flex-col items-center -mt-6">
                        <div className="relative">
                          <span className="text-4xl mb-1 block animate-bounce">{sortedByWeekly[0].avatar}</span>
                          <Trophy className="w-6 h-6 text-amber-500 absolute -top-3 -right-2" />
                        </div>
                        <div className="w-full bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-300 text-center shadow-md">
                          <span className="inline-block px-3 py-1 bg-amber-400 text-white rounded-full text-xs font-bold mb-2">🏆 #1</span>
                          <p className="font-bold text-base text-amber-900 truncate">{sortedByWeekly[0].name}</p>
                          <p className="text-amber-600 font-extrabold text-xl mt-1">{sortedByWeekly[0].weeklyStars} ★</p>
                        </div>
                      </div>
                    )}

                    {sortedByWeekly[2] && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{sortedByWeekly[2].avatar}</span>
                        <div className="w-full bg-orange-50 rounded-2xl p-4 border border-orange-200 text-center shadow-sm">
                          <span className="inline-block px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold mb-2">#3</span>
                          <p className="font-bold text-sm truncate">{sortedByWeekly[2].name}</p>
                          <p className="text-amber-500 font-extrabold text-lg mt-1">{sortedByWeekly[2].weeklyStars} ★</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Team View with Direct Evaluation Buttons */}
            {activeTab === 'team' && (
              <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{t.team}</h2>
                  <button 
                    onClick={() => setShowTeacherModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E879A9] text-white text-sm font-medium hover:bg-[#C95388] transition"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addTeacher}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead className="bg-[#FFF7FA] text-gray-600 border-b border-[#F8C2D8]">
                      <tr>
                        <th className="p-4">{t.teacherName}</th>
                        <th className="p-4">{t.role}</th>
                        <th className="p-4">{t.weeklyStars}</th>
                        <th className="p-4">{t.monthlyStars}</th>
                        <th className="p-4">{t.totalStars}</th>
                        <th className="p-4">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {teachers.map(teacher => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="p-4 flex items-center gap-3 font-semibold">
                            <span className="text-xl">{teacher.avatar}</span>
                            {teacher.name}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              teacher.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'
                            }`}>
                              {teacher.role === 'admin' ? t.admin : t.member}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-amber-500">{teacher.weeklyStars} ★</td>
                          <td className="p-4 font-bold text-amber-500">{teacher.monthlyStars} ★</td>
                          <td className="p-4 font-bold text-amber-600">{teacher.stars} ★</td>
                          <td className="p-4 flex items-center gap-2">
                            <button 
                              onClick={() => openEvalForTeacher(teacher.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold transition"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {t.quickEval}
                            </button>
                            <button 
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Task Categories View */}
            {activeTab === 'tasks' && (
              <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">{t.tasks}</h2>
                  <button 
                    onClick={() => setShowTaskModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E879A9] text-white text-sm font-medium hover:bg-[#C95388] transition"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addTask}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat, idx) => (
                    <div key={cat.id} className="p-4 rounded-2xl bg-[#FFF7FA] border border-[#F8C2D8] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#E879A9] text-white font-bold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-gray-800">{cat.nameAr}</p>
                          <p className="text-xs text-gray-500">{cat.nameEn}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTask(cat.id)}
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluations View */}
            {activeTab === 'evaluations' && (
              <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm space-y-4">
                <h2 className="text-lg font-bold mb-4">{t.evaluations}</h2>
                <div className="space-y-3">
                  {evaluations.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">لا توجد تقييمات مسجلة بعد</p>
                  ) : (
                    evaluations.map(item => {
                      const teacher = teachers.find(t => t.id === item.teacherId);
                      const category = categories.find(c => c.id === item.categoryId);
                      return (
                        <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FFF7FA] flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">{teacher?.name}</p>
                            <p className="text-xs text-gray-500">{lang === 'ar' ? category?.nameAr : category?.nameEn}</p>
                            {item.comment && <p className="text-xs text-pink-600 mt-1">"{item.comment}"</p>}
                          </div>
                          <div className="text-left">
                            <p className="text-amber-500 font-bold">{item.stars} ★</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Leaderboards */}
            {(activeTab === 'weekly' || activeTab === 'monthly') && (
              <div className="bg-white p-6 rounded-3xl border border-[#F8C2D8] shadow-sm space-y-4">
                <h2 className="text-lg font-bold">
                  {activeTab === 'weekly' ? t.weeklyLeaders : t.monthlyLeaders}
                </h2>
                <div className="space-y-3">
                  {(activeTab === 'weekly' ? sortedByWeekly : sortedByMonthly).map((teacher, index) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#F8C2D8] transition">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-slate-300 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="text-2xl">{teacher.avatar}</span>
                        <p className="font-bold text-sm">{teacher.name}</p>
                      </div>
                      <div className="text-amber-500 font-extrabold text-lg">
                        {activeTab === 'weekly' ? teacher.weeklyStars : teacher.monthlyStars} ★
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modal: Add New Evaluation */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#F8C2D8] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center border-b pb-3">{t.evaluate}</h3>
            <form onSubmit={handleAddEvaluation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.teacherName}</label>
                <select 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  value={selectedTeacher}
                  onChange={e => setSelectedTeacher(e.target.value)}
                  required
                >
                  <option value="">اختر المعلمة...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.category}</label>
                <select 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">اختر الفئة...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.stars}</label>
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarsGiven(star)}
                      className="p-1 transition transform hover:scale-110"
                    >
                      <Star className={`w-8 h-8 ${star <= starsGiven ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.notes}</label>
                <textarea 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  rows="3"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="أضف ملاحظة تشجيعية..."
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#E879A9] text-white font-bold rounded-xl hover:bg-[#C95388] transition"
                >
                  {t.save}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Teacher */}
      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#F8C2D8] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center border-b pb-3">{t.addTeacher}</h3>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.teacherName}</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  placeholder="مثال: مريم العجمية"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#E879A9] text-white font-bold rounded-xl hover:bg-[#C95388] transition"
                >
                  {t.save}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Task Category */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#F8C2D8] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center border-b pb-3">{t.addTask}</h3>
            <form onSubmit={handleAddTaskCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.taskNameAr}</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  value={newTaskAr}
                  onChange={e => setNewTaskAr(e.target.value)}
                  placeholder="مثال: ورش العمل الإبداعية"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">{t.taskNameEn}</label>
                <input 
                  type="text" 
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E879A9]"
                  value={newTaskEn}
                  onChange={e => setNewTaskEn(e.target.value)}
                  placeholder="e.g. Creative Workshops"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#E879A9] text-white font-bold rounded-xl hover:bg-[#C95388] transition"
                >
                  {t.save}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}