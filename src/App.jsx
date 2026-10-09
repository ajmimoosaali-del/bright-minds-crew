import React, { useState, useEffect } from 'react';
import { 
  Trophy, Star, Users, CheckSquare, BarChart2, 
  Plus, Trash2, Globe, Award, Moon, Sun, ChevronDown, ChevronUp
} from 'lucide-react';

const TRANSLATIONS = {
  ar: {
    title: "طاقم العقول النيرة",
    subtitle: "منصة تقييم وتحفيز معلمات اللغة الإنجليزية",
    dashboard: "لوحة التحكم",
    team: "إدارة الفريق والتقييم",
    tasks: "فئات المهام",
    evaluations: "سجل التقييمات",
    weeklyLeaders: "أبطال الأسبوع",
    monthlyLeaders: "أبطال الشهر",
    totalStars: "إجمالي النجوم",
    weeklyStars: "نجوم الأسبوع",
    monthlyStars: "نجوم الشهر",
    activeTeachers: "المعلمات النشطات",
    evaluationsCount: "عدد التقييمات",
    addTeacher: "إضافة معلمة",
    addTask: "إضافة فئة مهمة",
    evaluate: "تقييم معلمة",
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
    save: "حفظ التقييمات",
    cancel: "إلغاء",
    podiumTitle: "لوحة الشرف والأبطال",
    switchLanguage: "English",
    confirmDeleteTeacher: "هل أنت متأكد من حذف هذه المعلمة؟",
    confirmDeleteTask: "هل أنت متأكد من حذف هذه المهمة؟",
    quickEval: "تقييم المهام",
    selectTeacherToEvaluate: "اختر معلمة لتقييم مهامها:"
  },
  en: {
    title: "Bright Minds Crew",
    subtitle: "English Teachers Evaluation & Motivation Platform",
    dashboard: "Dashboard",
    team: "Team Management & Evaluation",
    tasks: "Task Categories",
    evaluations: "Evaluations Log",
    weeklyLeaders: "Weekly Leaders",
    monthlyLeaders: "Monthly Leaders",
    totalStars: "Total Stars",
    weeklyStars: "Weekly Stars",
    monthlyStars: "Monthly Stars",
    activeTeachers: "Active Teachers",
    evaluationsCount: "Evaluations Count",
    addTeacher: "Add Teacher",
    addTask: "Add Task Category",
    evaluate: "Evaluate Teacher",
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
    save: "Save Evaluations",
    cancel: "Cancel",
    podiumTitle: "Leaderboard & Champions",
    switchLanguage: "العربية",
    confirmDeleteTeacher: "Are you sure you want to delete this teacher?",
    confirmDeleteTask: "Are you sure you want to delete this task category?",
    quickEval: "Evaluate Tasks",
    selectTeacherToEvaluate: "Select a teacher to evaluate her tasks:"
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
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [evaluations, setEvaluations] = useState([]);
  
  // Modals state
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // Evaluation state for tasks
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [taskRatings, setTaskRatings] = useState({}); // { categoryId: { stars: 5, comment: '' } }

  // New Teacher & Task forms
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTaskAr, setNewTaskAr] = useState('');
  const [newTaskEn, setNewTaskEn] = useState('');

  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const savedTeachers = localStorage.getItem('bmc_teachers');
    const savedCategories = localStorage.getItem('bmc_categories');
    const savedEvaluations = localStorage.getItem('bmc_evaluations');
    const savedDarkMode = localStorage.getItem('bmc_darkmode');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedEvaluations) setEvaluations(JSON.parse(savedEvaluations));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem('bmc_teachers', JSON.stringify(teachers));
    localStorage.setItem('bmc_categories', JSON.stringify(categories));
    localStorage.setItem('bmc_evaluations', JSON.stringify(evaluations));
    localStorage.setItem('bmc_darkmode', JSON.stringify(darkMode));
  }, [teachers, categories, evaluations, darkMode]);

  // فتح التقييم لمعلمة محددة
  const openEvalForTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    // إعداد التقييم الافتراضي لجميع المهام (5 نجوم لكل مهمة)
    const initialRatings = {};
    categories.forEach(cat => {
      initialRatings[cat.id] = { stars: 5, comment: '' };
    });
    setTaskRatings(initialRatings);
    setShowEvalModal(true);
  };

  // تغيير نجوم مهمة محددة
  const setTaskStars = (catId, stars) => {
    setTaskRatings(prev => ({
      ...prev,
      [catId]: { ...prev[catId], stars }
    }));
  };

  // تغيير ملاحظة مهمة محددة
  const setTaskComment = (catId, comment) => {
    setTaskRatings(prev => ({
      ...prev,
      [catId]: { ...prev[catId], comment }
    }));
  };

  // حفظ تقييمات كافة المهام للمعلمة
  const handleSaveAllEvaluations = (e) => {
    e.preventDefault();
    if (!selectedTeacherId) return;

    let totalNewStars = 0;
    const newEvalList = [];
    const evalDate = new Date().toLocaleDateString(lang === 'ar' ? 'ar-OM' : 'en-US');

    Object.keys(taskRatings).forEach(catId => {
      const rating = taskRatings[catId];
      if (rating && rating.stars > 0) {
        totalNewStars += rating.stars;
        newEvalList.push({
          id: Date.now().toString() + Math.random().toString().substr(2, 4),
          teacherId: selectedTeacherId,
          categoryId: catId,
          stars: rating.stars,
          comment: rating.comment,
          date: evalDate
        });
      }
    });

    setEvaluations([...newEvalList, ...evaluations]);

    // تحديث نجوم المعلمة
    setTeachers(teachers.map(teacher => {
      if (teacher.id === selectedTeacherId) {
        return {
          ...teacher,
          stars: teacher.stars + totalNewStars,
          weeklyStars: teacher.weeklyStars + totalNewStars,
          monthlyStars: teacher.monthlyStars + totalNewStars
        };
      }
      return teacher;
    }));

    setShowEvalModal(false);
  };

  // إضافة معلمة
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacherName) return;

    const avatars = ['👩‍🏫', '👩‍🎓', '👩‍🔬', '👩‍💻', '👩‍🎨'];
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

  const selectedTeacherObj = teachers.find(t => t.id === selectedTeacherId);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#121218] text-[#F3F3F6]' : 'bg-[#FFF7FA] text-[#342536]'} ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 shadow-sm backdrop-blur-md ${darkMode ? 'bg-[#1A1A24]/90 border-gray-800' : 'bg-white/80 border-[#F8C2D8]'}`}>
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
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl border transition ${darkMode ? 'bg-[#242432] border-gray-700 text-amber-400 hover:bg-[#2D2D3F]' : 'bg-[#FFF7FA] border-[#F8C2D8] text-gray-600 hover:bg-[#FCE7F0]'}`}
                title="الوضع الداكن"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Switch */}
              <button 
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition ${darkMode ? 'bg-[#242432] border-gray-700 text-gray-200 hover:bg-[#2D2D3F]' : 'bg-[#FFF7FA] border-[#F8C2D8] hover:bg-[#FCE7F0]'}`}
              >
                <Globe className="w-4 h-4 text-[#E879A9]" />
                {t.switchLanguage}
              </button>

              {/* Evaluate Button */}
              <button 
                onClick={() => {
                  if (teachers.length > 0) openEvalForTeacher(teachers[0].id);
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
            <nav className={`rounded-3xl p-4 border shadow-sm space-y-2 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
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
                        : darkMode ? 'text-gray-300 hover:bg-[#242432] hover:text-[#E879A9]' : 'text-gray-600 hover:bg-[#FFF7FA] hover:text-[#E879A9]'
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
                  <div className={`p-6 rounded-3xl border shadow-sm flex items-center gap-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-[#E879A9] ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-[#F8C2D8]'}`}>
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.activeTeachers}</p>
                      <h3 className="text-2xl font-bold">{teachers.length}</h3>
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl border shadow-sm flex items-center gap-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-amber-500 ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-[#F8C2D8]'}`}>
                      <Star className="w-7 h-7 fill-amber-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.totalStars}</p>
                      <h3 className="text-2xl font-bold">
                        {teachers.reduce((acc, curr) => acc + curr.stars, 0)}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl border shadow-sm flex items-center gap-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-[#C9A7E8] ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-[#F8C2D8]'}`}>
                      <CheckSquare className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.evaluationsCount}</p>
                      <h3 className="text-2xl font-bold">{evaluations.length}</h3>
                    </div>
                  </div>
                </div>

                {/* Podium */}
                <div className={`p-6 rounded-3xl border shadow-sm ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-gradient-to-br from-white to-[#FFF7FA] border-[#F8C2D8]'}`}>
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
                        <div className={`w-full rounded-2xl p-4 border text-center shadow-sm ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
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
                        <div className={`w-full rounded-2xl p-6 border text-center shadow-md ${darkMode ? 'bg-[#2C2318] border-amber-500/40' : 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-300'}`}>
                          <span className="inline-block px-3 py-1 bg-amber-400 text-white rounded-full text-xs font-bold mb-2">🏆 #1</span>
                          <p className="font-bold text-base text-amber-500 truncate">{sortedByWeekly[0].name}</p>
                          <p className="text-amber-500 font-extrabold text-xl mt-1">{sortedByWeekly[0].weeklyStars} ★</p>
                        </div>
                      </div>
                    )}

                    {sortedByWeekly[2] && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{sortedByWeekly[2].avatar}</span>
                        <div className={`w-full rounded-2xl p-4 border text-center shadow-sm ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-orange-50 border-orange-200'}`}>
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

            {/* Team View & Direct Evaluation */}
            {activeTab === 'team' && (
              <div className={`p-6 rounded-3xl border shadow-sm space-y-6 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
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
                    <thead className={`border-b ${darkMode ? 'bg-[#242432] text-gray-300 border-gray-800' : 'bg-[#FFF7FA] text-gray-600 border-[#F8C2D8]'}`}>
                      <tr>
                        <th className="p-4">{t.teacherName}</th>
                        <th className="p-4">{t.role}</th>
                        <th className="p-4">{t.weeklyStars}</th>
                        <th className="p-4">{t.monthlyStars}</th>
                        <th className="p-4">{t.totalStars}</th>
                        <th className="p-4">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                      {teachers.map(teacher => (
                        <tr key={teacher.id} className={darkMode ? 'hover:bg-[#242432]' : 'hover:bg-gray-50'}>
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
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 rounded-xl text-xs font-bold transition"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {t.quickEval}
                            </button>
                            <button 
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-xl transition"
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
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
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
                    <div key={cat.id} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-[#F8C2D8]'}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#E879A9] text-white font-bold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold">{cat.nameAr}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.nameEn}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTask(cat.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluations Log View */}
            {activeTab === 'evaluations' && (
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
                <h2 className="text-lg font-bold mb-4">{t.evaluations}</h2>
                <div className="space-y-3">
                  {evaluations.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">لا توجد تقييمات مسجلة بعد</p>
                  ) : (
                    evaluations.map(item => {
                      const teacher = teachers.find(t => t.id === item.teacherId);
                      const category = categories.find(c => c.id === item.categoryId);
                      return (
                        <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-gray-100'}`}>
                          <div>
                            <p className="font-bold text-sm">{teacher?.name}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ar' ? category?.nameAr : category?.nameEn}</p>
                            {item.comment && <p className="text-xs text-pink-500 mt-1">"{item.comment}"</p>}
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
              <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
                <h2 className="text-lg font-bold">
                  {activeTab === 'weekly' ? t.weeklyLeaders : t.monthlyLeaders}
                </h2>
                <div className="space-y-3">
                  {(activeTab === 'weekly' ? sortedByWeekly : sortedByMonthly).map((teacher, index) => (
                    <div key={teacher.id} className={`flex items-center justify-between p-4 rounded-2xl border ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-white border-gray-100'}`}>
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

      {/* Modal: Comprehensive Evaluation (Teacher + Tasks List below) */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-2xl w-full p-6 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
            
            {/* Header / Select Teacher */}
            <div className="border-b pb-4 space-y-3">
              <h3 className="text-lg font-bold text-center">{t.evaluate}</h3>
              
              <div>
                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t.selectTeacherToEvaluate}
                </label>
                <select 
                  className={`w-full p-3 rounded-xl border text-sm font-bold focus:outline-none focus:border-[#E879A9] ${darkMode ? 'bg-[#242432] border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  value={selectedTeacherId}
                  onChange={e => openEvalForTeacher(e.target.value)}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.avatar} {t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tasks List with Individual Star Rating */}
            <form onSubmit={handleSaveAllEvaluations} className="space-y-4">
              <div className="space-y-4">
                {categories.map((cat) => {
                  const currentRating = taskRatings[cat.id] || { stars: 5, comment: '' };
                  return (
                    <div key={cat.id} className={`p-4 rounded-2xl border space-y-2 ${darkMode ? 'bg-[#242432] border-gray-700' : 'bg-[#FFF7FA] border-[#F8C2D8]'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-sm">{lang === 'ar' ? cat.nameAr : cat.nameEn}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'ar' ? cat.nameEn : cat.nameAr}</p>
                        </div>

                        {/* Interactive Stars */}
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTaskStars(cat.id, star)}
                              className="p-1 transition transform hover:scale-125"
                            >
                              <Star className={`w-6 h-6 ${star <= currentRating.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Task Note */}
                      <input 
                        type="text" 
                        placeholder="ملاحظة تشجيعية حول هذه المهمة (اختياري)..."
                        value={currentRating.comment}
                        onChange={e => setTaskComment(cat.id, e.target.value)}
                        className={`w-full p-2 text-xs rounded-lg border focus:outline-none focus:border-[#E879A9] ${darkMode ? 'bg-[#1A1A24] border-gray-700 text-gray-200' : 'bg-white border-gray-200'}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex gap-3 pt-4 border-t">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-[#E879A9] text-white font-bold rounded-xl hover:bg-[#C95388] shadow-md shadow-[#E879A9]/20 transition"
                >
                  {t.save}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEvalModal(false)}
                  className={`px-6 py-3 font-bold rounded-xl transition ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
            <h3 className="text-lg font-bold text-center border-b pb-3">{t.addTeacher}</h3>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.teacherName}</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-[#E879A9] ${darkMode ? 'bg-[#242432] border-gray-700 text-white' : 'bg-white border-gray-200'}`}
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
                  className={`px-4 py-3 font-bold rounded-xl transition ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 border shadow-2xl space-y-4 ${darkMode ? 'bg-[#1A1A24] border-gray-800' : 'bg-white border-[#F8C2D8]'}`}>
            <h3 className="text-lg font-bold text-center border-b pb-3">{t.addTask}</h3>
            <form onSubmit={handleAddTaskCategory} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.taskNameAr}</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-[#E879A9] ${darkMode ? 'bg-[#242432] border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  value={newTaskAr}
                  onChange={e => setNewTaskAr(e.target.value)}
                  placeholder="مثال: ورش العمل الإبداعية"
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.taskNameEn}</label>
                <input 
                  type="text" 
                  className={`w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-[#E879A9] ${darkMode ? 'bg-[#242432] border-gray-700 text-white' : 'bg-white border-gray-200'}`}
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
                  className={`px-4 py-3 font-bold rounded-xl transition ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
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