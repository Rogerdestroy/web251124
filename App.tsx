
import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { ViewState, InventoryItem, Project, Announcement, Course, CourseUnit, GalleryItem, IncidentReport, ProjectStage, ClassSession, CalendarEvent } from './types';
import { generateTeachingAssistance, generateProjectImage } from './services/geminiService';
import { 
  Users, AlertTriangle, PenTool, Calendar, Clock, CheckCircle, 
  Search, Plus, MoreHorizontal, FileText, Video, Box, 
  AlertCircle, Sparkles, Send, ShieldAlert, Bot,
  Settings2, Trash2, Edit, Eye, Filter,
  X, LayoutDashboard, BookOpen, Hammer, Images, MapPin, ChevronLeft, ChevronRight,
  TrendingUp, Download, ExternalLink, Zap, ArrowLeft, MoreVertical, GraduationCap,
  Minus, Camera, QrCode, UploadCloud, Save, Megaphone, Loader2, Check, XCircle, Link,
  ArrowRight, Rocket, Star, Cpu
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Mock Data Initialization ---
const INIT_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: '【重要】期末專題繳交期限延長', date: '2023-10-25', type: 'important', content: '考慮到雷切機預約爆滿，繳交期限延長至下週五。' },
  { id: '2', title: '全縣生活科技競賽報名開始', date: '2023-10-22', type: 'activity', content: '欲參加「液壓手臂」項目的同學請找老師報名。' },
  { id: '3', title: '3D印表機 #2 維修完成', date: '2023-10-20', type: 'important', content: '已更換噴頭，請同學愛惜使用。' },
  { id: '4', title: '工坊開放時間調整', date: '2023-10-18', type: 'important', content: '下週三下午因教師研習，工坊暫停開放一次。' },
];

const INIT_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'PLA 線材 (白)', category: 'consumable', quantity: 5, unit: '卷', location: 'A-01', status: 'available' },
  { id: '2', name: 'PLA 線材 (黑)', category: 'consumable', quantity: 1, unit: '卷', location: 'A-02', status: 'low_stock' },
  { id: '3', name: '雷切機 60W', category: 'equipment', quantity: 1, unit: '台', location: 'B-01', status: 'in_use' },
  { id: '4', name: '3mm 密迪板', category: 'consumable', quantity: 50, unit: '片', location: 'C-05', status: 'available', spec: '60x40cm' },
  { id: '5', name: 'Arduino Uno', category: 'equipment', quantity: 28, unit: '片', location: 'D-01', status: 'available' },
];

const INIT_PROJECTS: Project[] = [
  { id: '1', title: '智慧盆栽澆水系統', topic: '環境永續', groupName: '綠手指小隊', members: ['陳小明', '李小華'], stage: 'prototyping', progress: 65, thumbnail: 'https://picsum.photos/400/300?random=1', lastUpdate: '2天前', status: 'approved', description: '自動偵測土壤濕度並澆水。' },
  { id: '2', title: '液壓機械手臂', topic: '機構設計', groupName: '大力士', members: ['王大鈞', '林志豪'], stage: 'fabrication', progress: 80, thumbnail: 'https://picsum.photos/400/300?random=2', lastUpdate: '1小時前', status: 'approved', description: '模擬工業手臂運作。' },
  { id: '3', title: '藍芽遙控車', topic: '機電整合', groupName: '極速傳說', members: ['張建國'], stage: 'testing', progress: 95, thumbnail: 'https://picsum.photos/400/300?random=3', lastUpdate: '5天前', status: 'approved', description: '手機藍芽控制。' },
  { id: '4', title: '自動感應門', topic: '生活應用', groupName: '未來生活', members: ['周杰倫'], stage: 'ideation', progress: 20, thumbnail: 'https://picsum.photos/400/300?random=4', lastUpdate: '1天前', status: 'approved', description: '紅外線感應開啟。' },
];

const INIT_COURSES: Course[] = [
  { 
    id: 'c1', 
    title: '生活科技 I (必修)', 
    grade: '一年級', 
    time: '每週二 3-4 節', 
    description: '基礎工具使用、機構設計原理、電腦輔助繪圖入門。',
    studentCount: 35,
    color: 'from-cyan-400 to-blue-500',
    units: [
      { week: 1, topic: '工坊安全與工具介紹', status: 'completed', materials: true },
      { week: 2, topic: '機構結構原理 - 連桿與齒輪', status: 'completed', materials: true, video: true },
      { week: 3, topic: '電腦輔助繪圖 (CAD) - Tinkercad', status: 'active', materials: true },
      { week: 4, topic: '雷射切割實作 - 手機架', status: 'upcoming', materials: true },
    ]
  },
  { 
    id: 'c2', 
    title: '專題實作 (選修)', 
    grade: '二年級', 
    time: '每週四 5-6 節', 
    description: '進階機電整合、Arduino 程式設計、專題競賽培訓。',
    studentCount: 28,
    color: 'from-amber-400 to-orange-500',
    units: [
      { week: 1, topic: '專題題目發想與分組', status: 'completed', materials: true },
      { week: 2, topic: 'Arduino 基礎 I/O 控制', status: 'completed', materials: true },
      { week: 3, topic: '感測器應用實作', status: 'active', materials: true, video: true },
      { week: 4, topic: '馬達控制與驅動', status: 'upcoming', materials: true },
    ]
  },
  { 
    id: 'c3', 
    title: '機器人社團', 
    grade: '混齡', 
    time: '每週五 社團時間', 
    description: 'VEX 機器人結構組裝、遙控程式撰寫。',
    studentCount: 15,
    color: 'from-rose-400 to-pink-500',
    units: [
      { week: 1, topic: '社團幹部選舉與分組', status: 'completed' },
      { week: 2, topic: 'VEX V5 結構介紹', status: 'active', materials: true },
    ]
  }
];

const INIT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: '智慧自動分類垃圾桶',
    student: '李小華',
    year: '112',
    category: '機電整合',
    description: '使用 Arduino 結合超音波感測器與伺服馬達，能夠自動辨識垃圾丟入並開啟對應的蓋子。',
    image: 'https://picsum.photos/600/400?random=11',
    award: '特優'
  },
  {
    id: 2,
    title: '液壓怪手模型',
    student: '王大鈞',
    year: '112',
    category: '機構設計',
    description: '利用帕斯卡原理，使用針筒與水管製作的液壓手臂，可抓取 500g 重物。',
    image: 'https://picsum.photos/600/400?random=12',
    award: '優等'
  },
  {
    id: 3,
    title: '雷切手機擴音箱',
    student: '陳雅婷',
    year: '111',
    category: '創意木工',
    description: '運用雷射切割技術製作的木製擴音箱，不需插電即可放大手機聲音。',
    image: 'https://picsum.photos/600/400?random=13'
  },
  {
    id: 4,
    title: '智能溫控風扇',
    student: '張建國',
    year: '112',
    category: '機電整合',
    description: '當環境溫度超過 28 度時自動啟動風扇，並顯示目前溫濕度數據。',
    image: 'https://picsum.photos/600/400?random=14',
    award: '佳作'
  },
];

const INIT_INCIDENTS: IncidentReport[] = [];

const INIT_WEEKLY_SCHEDULE: ClassSession[] = [
  { day: 1, period: 3, class: '201 班', subject: '生活科技', room: '生科一' },
  { day: 1, period: 4, class: '201 班', subject: '生活科技', room: '生科一' },
  { day: 2, period: 5, class: '105 班', subject: '生活科技', room: '生科二' },
  { day: 2, period: 6, class: '105 班', subject: '生活科技', room: '生科二' },
  { day: 3, period: 1, class: '309 班', subject: '專題實作', room: '雷切區' },
  { day: 3, period: 2, class: '309 班', subject: '專題實作', room: '雷切區' },
  { day: 4, period: 5, class: '108 班', subject: '生活科技', room: '生科一' },
  { day: 4, period: 6, class: '108 班', subject: '生活科技', room: '生科一' },
  { day: 5, period: 7, class: '社團', subject: '機器人社', room: '生科一' },
  { day: 5, period: 8, class: '社團', subject: '機器人社', room: '生科一' },
];

const INIT_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', date: '2023-10-25', title: '專題初審', type: 'exam' },
  { id: 'e2', date: '2023-10-31', title: '萬聖節工坊活動', type: 'activity' },
  { id: 'e3', date: '2023-11-02', title: '段考週', type: 'exam' },
];

// --- Official Landing Page Component ---
const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-lg shadow-lg shadow-amber-500/20">
            <Hammer className="text-cyan-950 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-heading tracking-tight text-white">YUSI Craft</span>
        </div>
        <button 
          onClick={onEnter}
          className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2"
        >
          登入系統 <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 pb-32 px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles size={14} /> Empowering Future Makers
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-heading mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          優悉工坊 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">教學平台</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          專為生活科技教育打造的全方位管理系統。整合課程教學、專題追蹤、設備庫存與安全認證，讓創意實作更安全、更高效。
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onEnter}
            className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-lg rounded-xl shadow-xl shadow-cyan-500/30 transition-all hover:scale-105"
          >
            <span className="flex items-center gap-3">
              進入教學平台 <Rocket className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <a href="#" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-xl transition-all">
            了解更多功能
          </a>
        </div>
      </header>

      {/* Stats Section */}
      <section className="relative z-10 bg-slate-800/50 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: '註冊學生', value: '150+', icon: Users },
            { label: '專題作品', value: '300+', icon: Images },
            { label: '教學課程', value: '12+', icon: BookOpen },
            { label: '專業設備', value: '50+', icon: Cpu },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <stat.icon className="w-8 h-8 mx-auto text-amber-400 mb-2" />
              <div className="text-3xl font-bold text-white font-heading">{stat.value}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-16 font-heading">為什麼選擇 YUSI Craft？</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: '專題製作追蹤', desc: '從構想到成品，視覺化看板管理專案進度，結合 AI 輔助生成設計圖。', icon: Hammer, color: 'text-rose-400' },
            { title: '智慧庫存管理', desc: '即時監控耗材數量，手機掃描 QR Code 快速登記借用，避免器材遺失。', icon: Box, color: 'text-amber-400' },
            { title: '安全認證機制', desc: '落實工坊安全教育，記錄每位學生的機器操作權限與事故通報。', icon: ShieldAlert, color: 'text-emerald-400' },
            { title: 'AI 學習助教', desc: '內建 Gemini AI 助教，隨時解答學生在機構設計與程式撰寫上的疑難雜症。', icon: Bot, color: 'text-cyan-400' },
            { title: '數位作品展', desc: '打造線上作品集，完整記錄學生的創作歷程、設計圖與成果照片。', icon: Images, color: 'text-purple-400' },
            { title: '教學日程管理', desc: '整合行事曆與課表，輕鬆掌握每週授課進度與重要活動。', icon: Calendar, color: 'text-blue-400' },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
              <div className={`w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading text-slate-200">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900 py-12 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4 text-slate-300 font-bold font-heading">
          <Hammer size={20} className="text-amber-400" /> YUSI Craft
        </div>
        <p>&copy; 2023 YUSI Craft. All rights reserved. Designed for Technology Education.</p>
      </footer>
    </div>
  );
};

// --- Sub-Components (Dashboard, etc.) ---

const DashboardView = ({ 
  projects, 
  announcements, 
  isAdmin,
  weeklySchedule,
  calendarEvents
}: { 
  projects: Project[], 
  announcements: Announcement[], 
  isAdmin: boolean,
  weeklySchedule: ClassSession[],
  calendarEvents: CalendarEvent[]
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const stats = [
    { label: '進行中專案', value: projects.filter(p => p.status === 'approved').length, icon: PenTool, color: 'text-cyan-500', bg: 'bg-cyan-50', borderColor: 'border-cyan-100' },
    { label: '器材預約數', value: '12', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50', borderColor: 'border-amber-100' },
    { label: '未通過安檢', value: '5', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', borderColor: 'border-rose-100' },
    { label: '耗材低庫存', value: '3', icon: Box, color: 'text-purple-500', bg: 'bg-purple-50', borderColor: 'border-purple-100' },
  ];

  const stages: ProjectStage[] = ['ideation', 'prototyping', 'fabrication', 'testing', 'completed'];
  const chartData = stages.map(stage => ({
    name: stage === 'ideation' ? '構想' : stage === 'prototyping' ? '原型' : stage === 'fabrication' ? '製作' : stage === 'testing' ? '測試' : '完成',
    count: projects.filter(p => p.stage === stage && p.status === 'approved').length
  }));

  // Calendar Logic
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const offset = firstDay; // Sunday is 0

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const formatMonth = (date: Date) => date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });

  // Today Schedule Logic
  const todayDayOfWeek = new Date().getDay(); // 0-6
  // Assuming school days 1-5. If 0 (Sun) or 6 (Sat), show empty or next Monday? Let's just show filtered.
  const todaySchedule = weeklySchedule
    .filter(s => s.day === (todayDayOfWeek === 0 ? 1 : todayDayOfWeek)) // Fallback to Mon if Sunday
    .sort((a,b) => a.period - b.period);
  
  const periodTimes = [
    { p: 1, time: '08:10 - 09:00' },
    { p: 2, time: '09:10 - 10:00' },
    { p: 3, time: '10:10 - 11:00' },
    { p: 4, time: '11:10 - 12:00' },
    { p: 5, time: '13:10 - 14:00' },
    { p: 6, time: '14:10 - 15:00' },
    { p: 7, time: '15:10 - 16:00' },
    { p: 8, time: '16:10 - 17:00' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border ${stat.borderColor} flex items-center gap-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
            <div className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 font-heading">{stat.value}</h3>
            </div>
            {isAdmin && <button className="absolute top-3 right-3 text-slate-300 hover:text-cyan-500 transition-colors"><Edit size={16}/></button>}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${stat.bg} opacity-50`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Schedule & Calendar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 font-heading">
                <div className="bg-cyan-50 p-2 rounded-lg text-cyan-600">
                  <Calendar size={20} />
                </div>
                教學日程與課表
              </h3>
              <div className="text-sm text-cyan-600 font-bold bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100">
                {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Today's Schedule */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-heading">今日課表 ({todayDayOfWeek === 0 || todayDayOfWeek === 6 ? '假日' : '上課日'})</h4>
                <div className="space-y-0 relative min-h-[300px]">
                  {todaySchedule.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                       <div className="bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2"><Calendar size={20}/></div>
                       <p>今日無排課</p>
                    </div>
                  ) : (
                    <>
                      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
                      {todaySchedule.map((item, index) => {
                        const timeInfo = periodTimes.find(p => p.p === item.period);
                        // Mock status logic based on time could be added here
                        const isCurrent = index === 1; // Just a visual mock
                        return (
                          <div key={index} className="relative pl-10 py-3 group">
                            <div className={`absolute left-3 top-5 w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${
                              isCurrent ? 'bg-amber-400 border-amber-200 ring-4 ring-amber-50 scale-110' :
                              'bg-white border-slate-300'
                            }`}></div>
                            
                            <div className={`p-4 rounded-xl border transition-all duration-300 ${
                              isCurrent ? 'bg-amber-50 border-amber-100 shadow-md translate-x-1' : 'bg-slate-50 border-slate-100 hover:border-cyan-200'
                            }`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-bold font-heading ${isCurrent ? 'text-amber-600' : 'text-slate-500'}`}>
                                  第 {item.period} 節
                                </span>
                                <span className="text-xs text-slate-400 font-mono tracking-tight">{timeInfo?.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-slate-800 block text-lg font-heading">{item.class}</span>
                                  <span className="text-sm text-slate-600">{item.subject}</span>
                                </div>
                                {item.room && (
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                    <MapPin size={12} /> {item.room}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* Monthly Calendar */}
              <div>
                 <div className="flex justify-between items-center mb-6">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">{formatMonth(currentDate)}</h4>
                   <div className="flex gap-2">
                     <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-cyan-600 transition-colors"><ChevronLeft size={18}/></button>
                     <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-cyan-600 transition-colors"><ChevronRight size={18}/></button>
                   </div>
                 </div>
                 <div className="grid grid-cols-7 gap-2 text-center text-xs mb-3 font-heading">
                   {['日','一','二','三','四','五','六'].map(d => <div key={d} className="text-slate-400 font-bold py-1">{d}</div>)}
                 </div>
                 <div className="grid grid-cols-7 gap-2 text-center text-sm font-heading font-medium">
                    {Array.from({length: offset}).map((_, i) => <div key={`empty-${i}`} className="h-10"></div>)}
                    {Array.from({length: daysInMonth}).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                      const hasEvent = calendarEvents.some(e => e.date === dateStr);
                      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                      
                      return (
                        <div key={day} className={`h-10 w-10 mx-auto flex items-center justify-center rounded-xl cursor-pointer transition-all relative group ${
                          isToday ? 'bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/30' : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-600'
                        }`}>
                          {day}
                          {hasEvent && (
                            <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          )}
                        </div>
                      );
                    })}
                 </div>
                 
                 <div className="mt-8 space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">本月活動</p>
                   {calendarEvents
                     .filter(e => e.date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`))
                     .map(e => (
                       <div key={e.id} className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-amber-50 hover:border-amber-100 transition-colors cursor-pointer">
                         <div className={`w-2 h-2 rounded-full ${e.type === 'exam' ? 'bg-rose-500' : 'bg-amber-400'} shadow-[0_0_8px_rgba(251,191,36,0.6)]`}></div>
                         <span className="font-bold font-heading text-slate-800">{e.date.split('-')[2]}日</span> {e.title}
                       </div>
                   ))}
                   {calendarEvents.filter(e => e.date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`)).length === 0 && (
                     <p className="text-xs text-slate-400 text-center py-4">本月無活動</p>
                   )}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project Progress & Announcements */}
        <div className="space-y-8 lg:col-span-1">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-6 font-heading flex items-center gap-2">
               <TrendingUp size={18} className="text-cyan-500"/> 專案進度分佈
            </h3>
            <div className="h-48">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fontFamily: 'Noto Sans TC'}} axisLine={false} tickLine={false} dy={10} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9', radius: 4}} 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#06b6d4' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                總計 {projects.filter(p => p.status === 'approved').length} 組專案進行中
              </span>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 font-heading">最新公告</h3>
              {isAdmin ? (
                 <button className="text-sm text-cyan-600 hover:bg-cyan-50 p-1 rounded transition-colors"><Plus size={18}/></button>
              ) : (
                 <button className="text-xs font-bold text-cyan-500 hover:underline">VIEW ALL</button>
              )}
            </div>
            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="group p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md hover:border-cyan-100 transition-all duration-300 relative cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold font-heading tracking-wide ${
                      ann.type === 'important' ? 'bg-rose-100 text-rose-700' :
                      ann.type === 'activity' ? 'bg-amber-100 text-amber-700' : 'bg-cyan-100 text-cyan-700'
                    }`}>
                      {ann.type === 'important' ? 'IMPORTANT' : ann.type === 'activity' ? 'ACTIVITY' : 'NEWS'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1 truncate group-hover:text-cyan-700 transition-colors">{ann.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-1 opacity-80">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Projects View with Drag and Drop ---
const ProjectsView = ({ projects, setProjects, isAdmin }: { projects: Project[], setProjects: React.Dispatch<React.SetStateAction<Project[]>>, isAdmin: boolean }) => {
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', topic: '', groupName: '', members: '', description: '', notes: '' });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stages: {id: ProjectStage, label: string}[] = [
    { id: 'ideation', label: '構想 (Ideation)' },
    { id: 'prototyping', label: '原型製作 (Prototyping)' },
    { id: 'fabrication', label: '製作/外殼 (Fabrication)' },
    { id: 'testing', label: '功能測試 (Testing)' },
    { id: 'completed', label: '已完成 (Completed)' }
  ];

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const activeProjects = projects.filter(p => p.status === 'approved');

  const handleDragStart = (projectId: string) => {
    // Only admin can drag
    if (isAdmin) {
      setDraggedProject(projectId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: ProjectStage) => {
    if (draggedProject && isAdmin) {
      setProjects(prev => prev.map(p => 
        p.id === draggedProject ? { ...p, stage, lastUpdate: '剛剛' } : p
      ));
      setDraggedProject(null);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Project = {
      id: `p${Date.now()}`,
      title: newProject.title,
      topic: newProject.topic,
      groupName: newProject.groupName,
      members: newProject.members.split(',').map(m => m.trim()),
      description: newProject.description,
      notes: newProject.notes,
      stage: 'ideation',
      progress: 0,
      thumbnail: `https://picsum.photos/400/300?grayscale&random=${Date.now()}`, // Placeholder until approved
      lastUpdate: '剛剛',
      status: 'pending' // Default status
    };
    setProjects(prev => [...prev, p]);
    setIsAddModalOpen(false);
    setNewProject({ title: '', topic: '', groupName: '', members: '', description: '', notes: '' });
  };

  const handleApprove = async (project: Project) => {
    setProcessingId(project.id);
    
    // Generate Image using AI
    let generatedImage = null;
    try {
      generatedImage = await generateProjectImage(project.title, project.topic, project.description || "");
    } catch (e) {
      console.error("AI Gen Failed", e);
    }

    setProjects(prev => prev.map(p => 
      p.id === project.id 
        ? { 
            ...p, 
            status: 'approved', 
            thumbnail: generatedImage || `https://picsum.photos/400/300?random=${Date.now()}` // Use generated or fallback
          } 
        : p
    ));
    setProcessingId(null);
  };

  const handleReject = (id: string) => {
    if (confirm('確定要駁回此專案申請嗎？')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-slate-100 border border-transparent rounded-lg text-sm font-bold text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors">
            進行中專案 ({activeProjects.length})
          </button>
          {isAdmin && pendingProjects.length > 0 && (
             <span className="px-3 py-2 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold flex items-center gap-1">
               <AlertCircle size={14}/> {pendingProjects.length} 待審核
             </span>
          )}
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center gap-2 px-6 py-2.5 ${isAdmin ? 'bg-amber-400 hover:bg-amber-500 text-cyan-900' : 'bg-cyan-500 hover:bg-cyan-600 text-white'} rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/10 transition-all active:scale-95`}
        >
          <Plus size={18} /> {isAdmin ? '建立專案' : '申請新專案'}
        </button>
      </div>

      {/* Admin: Pending Approval List */}
      {isAdmin && pendingProjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2 font-heading">
            <AlertCircle size={20}/> 申請專案確認 (待審核)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingProjects.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded font-bold">{p.groupName}</span>
                  <span className="text-[10px] text-slate-400">{p.lastUpdate}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-1">{p.title}</h4>
                <p className="text-xs text-cyan-600 font-bold mb-3">{p.topic}</p>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{p.description}</p>
                
                <div className="space-y-1 mb-4">
                   <p className="text-xs text-slate-400"><strong>成員：</strong> {p.members.join(', ')}</p>
                   {p.notes && <p className="text-xs text-slate-400"><strong>備註：</strong> {p.notes}</p>}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleReject(p.id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1"
                  >
                    <XCircle size={14}/> 駁回
                  </button>
                  <button 
                    onClick={() => handleApprove(p)}
                    disabled={processingId === p.id}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1 shadow-md shadow-emerald-200"
                  >
                    {processingId === p.id ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
                    同意並生成
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1200px] lg:min-w-0">
           {stages.map(stage => (
             <div 
               key={stage.id} 
               className="flex-1 min-w-[250px] bg-slate-50/50 p-4 rounded-2xl min-h-[600px] border border-slate-200/50 flex flex-col"
               onDragOver={handleDragOver}
               onDrop={() => handleDrop(stage.id)}
             >
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-heading">
                    {stage.label}
                  </h3>
                  <span className="bg-white text-slate-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100">
                    {activeProjects.filter(p => p.stage === stage.id).length}
                  </span>
                </div>
                <div className="space-y-4 flex-1">
                  {activeProjects.filter(p => p.stage === stage.id).map(project => (
                    <div 
                      key={project.id} 
                      draggable={isAdmin} // Only admin can drag
                      onDragStart={() => handleDragStart(project.id)}
                      className={`group bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 relative ${isAdmin ? 'cursor-grab active:cursor-grabbing hover:shadow-xl hover:-translate-y-1' : ''}`}
                    >
                      <div className="h-32 bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold font-heading">
                           {project.groupName}
                        </div>
                        <div className="absolute top-2 right-2 bg-cyan-600/80 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold">
                           {project.topic}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base mb-2 font-heading">{project.title}</h4>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 flex-wrap">
                         {project.members.map((m, i) => (
                           <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{m}</span>
                         ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                        <span>Updated {project.lastUpdate}</span>
                        {isAdmin && <MoreHorizontal size={16} className="hover:text-cyan-600 cursor-pointer"/>}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-900/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl font-heading text-slate-800">申請新專案</h3>
                <button onClick={() => setIsAddModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
             </div>
             <form onSubmit={handleAddProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">專案名稱</label>
                    <input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="例如: 自動餵魚機" className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">專案主題/類別</label>
                    <input required value={newProject.topic} onChange={e => setNewProject({...newProject, topic: e.target.value})} placeholder="例如: 機電整合" className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"/>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">小隊名稱</label>
                    <input required value={newProject.groupName} onChange={e => setNewProject({...newProject, groupName: e.target.value})} placeholder="例如: 第一組" className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">隊員名單</label>
                    <input required value={newProject.members} onChange={e => setNewProject({...newProject, members: e.target.value})} placeholder="姓名請用逗號分隔" className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"/>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">專案說明</label>
                  <textarea required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="請簡述創作理念與功能..." className="w-full border p-2.5 rounded-xl h-24 focus:ring-2 focus:ring-cyan-500 outline-none"/>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">備註 (選填)</label>
                  <input value={newProject.notes} onChange={e => setNewProject({...newProject, notes: e.target.value})} placeholder="其他需求或說明" className="w-full border p-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"/>
                </div>

                <div className="pt-2">
                   <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95">
                     送出申請
                   </button>
                   <p className="text-center text-xs text-slate-400 mt-3">需等待老師核准後才會顯示於看板</p>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryView = ({ 
  inventory, 
  setInventory, 
  isAdmin, 
  borrowFormUrl, 
  setBorrowFormUrl 
}: { 
  inventory: InventoryItem[], 
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>, 
  isAdmin: boolean,
  borrowFormUrl: string,
  setBorrowFormUrl: React.Dispatch<React.SetStateAction<string>>
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-lg font-heading">庫存與設備清單</h3>
            <div className="flex items-center gap-3">
               <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-300 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋材料..." 
                  className="pl-9 pr-4 py-2 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all w-48 focus:w-64" 
                />
              </div>
              {isAdmin && (
                <button className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors shadow-md shadow-cyan-500/20">
                  <Plus size={18} />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold font-heading border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">名稱</th>
                  <th className="px-6 py-4">類別</th>
                  <th className="px-6 py-4">位置</th>
                  <th className="px-6 py-4">數量</th>
                  <th className="px-6 py-4">狀態</th>
                  <th className="px-6 py-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-cyan-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                       {item.name}
                       {item.spec && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">{item.spec}</span>}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        {item.category === 'consumable' && <Box size={14} className="text-cyan-500"/>}
                        {item.category === 'equipment' && <Zap size={14} className="text-amber-500"/>}
                        {item.category === 'consumable' ? '耗材' : item.category === 'equipment' ? '設備' : '工具'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.location}</td>
                    <td className="px-6 py-4 font-medium font-heading">
                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleUpdateStock(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"><Minus size={12}/></button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button onClick={() => handleUpdateStock(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200"><Plus size={12}/></button>
                          <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                        </div>
                      ) : (
                        `${item.quantity} ${item.unit}`
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'low_stock' ? 'bg-rose-100 text-rose-700' :
                        item.status === 'in_use' ? 'bg-cyan-100 text-cyan-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-cyan-600 hover:text-cyan-800 p-1 bg-cyan-50 rounded"><Edit size={16} /></button>
                          <button className="text-rose-600 hover:text-rose-800 p-1 bg-rose-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setIsScanModalOpen(true)} className="text-cyan-600 hover:text-cyan-800 font-bold text-xs border border-cyan-200 px-3 py-1 rounded hover:bg-cyan-50 transition-colors">
                          登記
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Reserve / QR Scan */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 p-6 rounded-2xl shadow-lg shadow-cyan-500/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="font-bold text-xl font-heading mb-1">借用登記 QR Code</h3>
                  <p className="text-cyan-100 text-sm opacity-90">手機掃描 QR Code 進行遠端借用登記</p>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-white/50 rounded flex items-center justify-center">
                    <QrCode className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsScanModalOpen(true)}
                className="w-full py-3 bg-white text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-md relative z-10 flex items-center justify-center gap-2"
              >
                 <QrCode size={18}/> 顯示登記表單
              </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 font-heading">今日設備預約</h3>
                {isAdmin && <button className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded hover:bg-cyan-100 transition-colors">管理時段</button>}
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-cyan-200 transition-colors">
                   <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-lg">
                      <Clock size={20} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700 font-heading">雷切機 #1</p>
                      <p className="text-xs text-slate-500 mt-0.5">10:00 - 11:30 • 綠手指小隊</p>
                   </div>
                   {isAdmin && <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-all"><X size={16}/></button>}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* QR Code / Form Link Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center animate-in zoom-in relative">
              <button onClick={() => setIsScanModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20}/></button>
              
              <h3 className="font-bold text-lg mb-2 text-slate-800">設備借用登記表單</h3>
              <p className="text-slate-500 text-xs mb-6">請使用手機相機掃描下方 QR Code</p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-slate-100 inline-block mb-6 shadow-sm">
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(borrowFormUrl)}`} 
                   alt="Form QR Code" 
                   className="w-48 h-48"
                 />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-left mb-4 break-all">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">表單連結</p>
                <a href={borrowFormUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-600 text-xs hover:underline flex items-center gap-1">
                   <Link size={10}/> {borrowFormUrl}
                </a>
              </div>

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                   <label className="text-xs font-bold text-slate-700 mb-1 block">設定表單網址 (僅管理員)</label>
                   <input 
                     value={borrowFormUrl} 
                     onChange={(e) => setBorrowFormUrl(e.target.value)}
                     className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-cyan-500 outline-none"
                   />
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const SafetyView = ({ isAdmin, incidents, setIncidents, safetyBanner, setSafetyBanner }: { isAdmin: boolean, incidents: IncidentReport[], setIncidents: React.Dispatch<React.SetStateAction<IncidentReport[]>>, safetyBanner: string, setSafetyBanner: React.Dispatch<React.SetStateAction<string>> }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({ description: '', location: '雷切機' });
  const [tempBanner, setTempBanner] = useState(safetyBanner);

  // Total registered students in the system
  const TOTAL_STUDENTS = 158;
  const certificationStats = [
    { name: '雷射切割機 (Laser Cutter)', passed: 142 },
    { name: '3D 印表機 (3D Printer)', passed: 155 },
    { name: '帶鋸機 (Band Saw)', passed: 65, warning: true },
    { name: '鑽床 (Drill Press)', passed: 120 },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIncidents(prev => [...prev, {
      id: `inc${Date.now()}`,
      studentName: '目前使用者',
      date: new Date().toISOString().split('T')[0],
      location: newIncident.location,
      description: newIncident.description,
      status: 'pending'
    }]);
    setIsReportModalOpen(false);
    setNewIncident({ description: '', location: '雷切機' });
  };

  const handleBannerSave = () => {
    setSafetyBanner(tempBanner);
    setIsEditBannerOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Hero Warning */}
       <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 flex items-start gap-6 relative shadow-sm">
          <div className="bg-amber-100 p-3 rounded-xl">
             <AlertTriangle className="text-amber-600 w-8 h-8 flex-shrink-0" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-900 font-heading">安全守則提醒</h3>
            <p className="text-amber-800 mt-2 leading-relaxed whitespace-pre-line">
              {safetyBanner}
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setTempBanner(safetyBanner); setIsEditBannerOpen(true); }}
              className="absolute top-6 right-6 px-4 py-2 bg-white text-amber-700 text-xs font-bold rounded-lg border border-amber-200 hover:bg-amber-50 shadow-sm transition-colors"
            >
              編輯公告
            </button>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-3 font-heading text-lg">
                <CheckCircle className="text-emerald-500" size={24}/> 機器操作認證狀況
              </h3>
              <div className="text-right">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">總註冊學員數</p>
                 <p className="text-2xl font-bold text-slate-700 font-heading">{TOTAL_STUDENTS} <span className="text-sm text-slate-400">人</span></p>
              </div>
            </div>
            
            <div className="space-y-6">
              {certificationStats.map((machine) => {
                const percentage = Math.round((machine.passed / TOTAL_STUDENTS) * 100);
                return (
                  <div key={machine.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-slate-700 font-medium text-sm">{machine.name}</span>
                      <div className="text-right">
                        <span className={`text-xl font-bold font-heading ${machine.warning ? 'text-amber-600' : 'text-slate-700'}`}>
                          {percentage}%
                        </span>
                        <span className="text-xs text-slate-400 ml-2">({machine.passed}人)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${machine.warning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
             <h3 className="font-bold text-slate-800 mb-6 w-full text-left font-heading text-lg flex justify-between">
               事故通報與紀錄
               {isAdmin && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{incidents.length} 筆紀錄</span>}
             </h3>
             
             {incidents.length === 0 && !isAdmin ? (
               <div className="flex flex-col items-center justify-center flex-1 py-10">
                  <div className="relative mb-6">
                      <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center z-10 relative">
                        <ShieldAlert className="w-16 h-16 text-emerald-500" />
                      </div>
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="space-y-1 mb-8 text-center">
                      <p className="text-2xl font-bold text-slate-800 font-heading">目前無未處理事故</p>
                      <p className="text-slate-500 text-sm">工坊已連續 <span className="font-bold text-emerald-600 text-lg">45</span> 天無受傷紀錄</p>
                  </div>
               </div>
             ) : (
                <div className="flex-1 overflow-y-auto mb-6 space-y-3 max-h-64">
                   {incidents.map(inc => (
                     <div key={inc.id} className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                        <div className="flex justify-between text-xs text-rose-800 font-bold mb-1">
                          <span>{inc.location}</span>
                          <span>{inc.date}</span>
                        </div>
                        <p className="text-sm text-slate-700">{inc.description}</p>
                     </div>
                   ))}
                   {incidents.length === 0 && <p className="text-center text-slate-400">暫無紀錄</p>}
                </div>
             )}

             <button 
               onClick={() => setIsReportModalOpen(true)}
               className={`w-full py-3 ${isAdmin ? 'bg-slate-800 hover:bg-slate-900' : 'bg-rose-500 hover:bg-rose-600'} text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
             >
                 {isAdmin ? <FileText size={18}/> : <AlertTriangle size={18}/>}
                 {isAdmin ? '查看完整紀錄' : '填寫事故通報單'}
             </button>
          </div>
       </div>

       {/* Report Modal */}
       {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h3 className="font-bold text-lg mb-4 text-rose-600 flex items-center gap-2"><AlertTriangle/> 填寫事故通報單</h3>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                   <select 
                      className="w-full border p-2 rounded-lg"
                      value={newIncident.location}
                      onChange={e => setNewIncident({...newIncident, location: e.target.value})}
                   >
                     <option>雷切機</option>
                     <option>3D印表機</option>
                     <option>帶鋸機</option>
                     <option>鑽床</option>
                     <option>其他區域</option>
                   </select>
                   <textarea 
                      required
                      placeholder="請描述事故經過與受傷狀況..."
                      className="w-full border p-2 rounded-lg h-32"
                      value={newIncident.description}
                      onChange={e => setNewIncident({...newIncident, description: e.target.value})}
                   />
                   <div className="flex gap-3">
                     <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 bg-slate-100 py-2 rounded-lg">取消</button>
                     <button type="submit" className="flex-1 bg-rose-500 text-white py-2 rounded-lg font-bold">送出通報</button>
                   </div>
                </form>
             </div>
          </div>
       )}

       {/* Edit Banner Modal */}
       {isEditBannerOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <h3 className="font-bold text-lg mb-4">編輯安全守則公告</h3>
              <textarea 
                 value={tempBanner}
                 onChange={e => setTempBanner(e.target.value)}
                 className="w-full h-40 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              />
              <div className="flex gap-3 mt-4">
                 <button onClick={() => setIsEditBannerOpen(false)} className="flex-1 bg-slate-100 py-2 rounded-lg">取消</button>
                 <button onClick={handleBannerSave} className="flex-1 bg-cyan-500 text-white py-2 rounded-lg font-bold">儲存</button>
              </div>
           </div>
         </div>
       )}
    </div>
  );
};

const GalleryView = ({ galleryItems, setGalleryItems, galleryTheme, setGalleryTheme, isAdmin }: { 
  galleryItems: GalleryItem[], 
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>, 
  galleryTheme: {title: string, desc: string}, 
  setGalleryTheme: React.Dispatch<React.SetStateAction<{title: string, desc: string}>>,
  isAdmin: boolean 
}) => {
  const [yearFilter, setYearFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filter Logic
  const filteredItems = galleryItems.filter(item => {
    const matchYear = yearFilter === 'All' || item.year === yearFilter;
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch = searchQuery === '' || 
                        item.title.includes(searchQuery) || 
                        item.student.includes(searchQuery) ||
                        item.description.includes(searchQuery);
    return matchYear && matchCategory && matchSearch;
  });

  const years = Array.from(new Set(galleryItems.map(item => item.year))).sort().reverse();
  const categories = Array.from(new Set(galleryItems.map(item => item.category)));

  // Mock Upload Handler
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newItem: GalleryItem = {
       id: Date.now(),
       title: formData.get('title') as string,
       student: formData.get('student') as string,
       year: '112',
       category: formData.get('category') as string,
       description: formData.get('description') as string,
       image: `https://picsum.photos/600/400?random=${Date.now()}`
    };
    setGalleryItems(prev => [newItem, ...prev]);
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
       <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl p-10 text-center relative overflow-hidden shadow-xl shadow-cyan-500/20">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
          <div className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-bold mb-4 tracking-widest uppercase border border-white/30">Exhibition</span>
            <h2 className="text-4xl font-bold mb-4 font-heading tracking-tight">{galleryTheme.title}</h2>
            <p className="text-cyan-50 text-lg max-w-2xl mx-auto">{galleryTheme.desc}</p>
            {isAdmin && (
              <button 
                onClick={() => setIsEditThemeOpen(true)}
                className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors"
              >
                編輯展覽主題
              </button>
            )}
          </div>
       </div>

       {/* Filter Bar */}
       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center sticky top-24 z-10 backdrop-blur-sm bg-white/95">
         <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
            <div className="flex items-center gap-2 text-slate-500">
              <Filter size={18} />
              <span className="text-sm font-bold hidden md:inline">篩選：</span>
            </div>
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All">所有學年度</option>
              {years.map(y => <option key={y} value={y}>{y} 學年度</option>)}
            </select>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All">所有主題類別</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
         </div>

         <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋作品名稱、作者..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" 
              />
           </div>
           
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-500 text-white rounded-lg text-sm font-bold hover:bg-cyan-600 whitespace-nowrap shadow-md"
            >
              <UploadCloud size={16} /> 上傳
            </button>
           
         </div>
       </div>

       {filteredItems.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-100 border-dashed">
            <Images className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-600">找不到符合條件的作品</h3>
            <p className="text-slate-400 text-sm mt-1">試著調整篩選條件或關鍵字</p>
            <button 
              onClick={() => { setYearFilter('All'); setCategoryFilter('All'); setSearchQuery(''); }}
              className="mt-4 text-cyan-600 font-bold text-sm hover:underline hover:text-cyan-800 transition-colors"
            >
              清除所有篩選
            </button>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                <div className="relative h-56 bg-slate-200 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {isAdmin && (
                    <div className="absolute inset-0 bg-cyan-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button className="p-2.5 bg-white rounded-full text-slate-800 hover:text-cyan-600 shadow-xl"><Edit size={18}/></button>
                    </div>
                  )}
                  {item.award && (
                     <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg shadow-amber-900/20 font-heading">
                       <span className="mr-1">🏆</span> {item.award}
                     </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-cyan-600 transition-colors font-heading mb-2">{item.title}</h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase tracking-wider">{item.year} 學年</span>
                       <span className="text-[10px] bg-cyan-50 text-cyan-600 px-2 py-1 rounded font-bold uppercase tracking-wider">{item.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img src={`https://picsum.photos/30/30?random=${item.id}`} className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm" />
                      <span className="text-xs text-slate-700 font-bold">{item.student}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
         </div>
       )}

       {/* Edit Theme Modal */}
       {isEditThemeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-2xl max-w-lg w-full p-6">
               <h3 className="font-bold text-lg mb-4">編輯展覽主題</h3>
               <div className="space-y-4">
                  <input 
                    value={galleryTheme.title}
                    onChange={e => setGalleryTheme({...galleryTheme, title: e.target.value})}
                    className="w-full border p-2 rounded-lg font-bold"
                  />
                  <textarea 
                    value={galleryTheme.desc}
                    onChange={e => setGalleryTheme({...galleryTheme, desc: e.target.value})}
                    className="w-full border p-2 rounded-lg h-24"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditThemeOpen(false)} className="flex-1 bg-slate-100 py-2 rounded-lg">取消</button>
                    <button onClick={() => setIsEditThemeOpen(false)} className="flex-1 bg-cyan-500 text-white py-2 rounded-lg">儲存</button>
                  </div>
               </div>
             </div>
          </div>
       )}

       {/* Upload Modal */}
       {isUploadOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-in zoom-in">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg">上傳作品</h3>
                 <button onClick={() => setIsUploadOpen(false)}><X size={20} className="text-slate-400"/></button>
               </div>
               <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <input name="title" required placeholder="作品名稱" className="border p-2 rounded-lg w-full"/>
                     <input name="student" required placeholder="作者姓名" className="border p-2 rounded-lg w-full"/>
                  </div>
                  <input name="category" required placeholder="類別 (如: 機構設計)" className="border p-2 rounded-lg w-full"/>
                  <textarea name="description" required placeholder="作品簡介..." className="border p-2 rounded-lg w-full h-32"/>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-400">
                     <UploadCloud className="mx-auto mb-2"/>
                     <p>點擊上傳圖片 (模擬)</p>
                  </div>
                  <button type="submit" className="w-full bg-cyan-500 text-white py-3 rounded-lg font-bold">確認上傳</button>
               </form>
            </div>
         </div>
       )}
    </div>
  );
};

const AssistantView = ({ inventory }: { inventory: InventoryItem[] }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const contextData = `
    現有工坊庫存材料：${inventory.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}。
  `;

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null); 

    const result = await generateTeachingAssistance(prompt, contextData);
    setResponse(result);
    setLoading(false);
  };

  const suggestedPrompts = [
    "我想做一個跟環保有關的 Arduino 專題，有什麼建議？",
    "我要用帶鋸機切木頭，要注意什麼安全事項？",
    "我的車子跑太慢了，怎麼透過齒輪比讓它跑快一點？",
    "工坊現在有什麼材料可以讓我做一個手機架？",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-in fade-in zoom-in duration-300">
       <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 text-white p-6 rounded-t-2xl flex items-center gap-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="bg-white/10 p-3.5 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
            <Bot className="w-8 h-8 text-amber-300" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-heading tracking-tight">YUSI Craft AI 學習小幫手</h2>
            <p className="text-cyan-50 text-sm mt-1">你的專題救星與安全顧問</p>
          </div>
       </div>

       <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {!response && !loading && (
            <div className="text-center text-slate-400 py-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                 <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
              <p className="text-lg text-slate-600 font-bold mb-2">嗨！專題遇到卡關了嗎？</p>
              <p className="text-sm text-slate-400">我可以幫你解決技術問題、提供靈感，或是查詢工坊安全規範。</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-2xl w-full">
                {suggestedPrompts.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="p-5 border border-slate-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-200 hover:shadow-md text-left text-sm text-slate-600 transition-all duration-200 group"
                  >
                    <span className="font-bold text-cyan-600 block mb-1 group-hover:text-cyan-700">範例問題 {i+1}</span>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
             <div className="flex gap-6 animate-pulse max-w-3xl">
                <div className="w-10 h-10 bg-cyan-50 rounded-full flex-shrink-0"></div>
                <div className="space-y-3 flex-1 py-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
             </div>
          )}

          {response && (
            <div className="flex gap-6 max-w-4xl">
              <div className="w-10 h-10 bg-cyan-50 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-cyan-100">
                <Bot size={22} className="text-cyan-600" />
              </div>
              <div className="flex-1 prose prose-slate prose-headings:font-heading max-w-none">
                 <div className="bg-slate-50 p-8 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm whitespace-pre-wrap text-slate-700 leading-relaxed text-base">
                   {response}
                 </div>
                 <div className="flex gap-2 mt-2 ml-2">
                    <button className="text-xs text-slate-400 hover:text-cyan-600 flex items-center gap-1"><Download size={12}/> 下載對話</button>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div className="bg-white p-5 border border-t-0 rounded-b-2xl border-slate-200 shadow-sm">
          <div className="relative shadow-sm rounded-xl">
             <textarea
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="輸入你的問題，例如：『我的伺服馬達不會轉怎麼辦？』"
               className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none h-16 text-slate-700 placeholder:text-slate-400"
               onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
             />
             <button 
               onClick={handleAsk}
               disabled={loading || !prompt.trim()}
               className="absolute right-3 top-3 p-2.5 bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors shadow-md active:scale-95"
             >
               <Send size={18} />
             </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3">
            AI 內容僅供參考，操作危險機具時請務必諮詢老師。
          </p>
       </div>
    </div>
  );
}

const CourseView = ({ courses, setCourses, isAdmin }: { courses: Course[], setCourses: React.Dispatch<React.SetStateAction<Course[]>>, isAdmin: boolean }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', grade: '', time: '', description: '' });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const course: Course = {
      id: `c${Date.now()}`,
      ...newCourse,
      studentCount: 0,
      color: 'from-cyan-400 to-cyan-600',
      units: []
    };
    setCourses(prev => [...prev, course]);
    setIsAddModalOpen(false);
    setNewCourse({ title: '', grade: '', time: '', description: '' });
  };

  if (selectedCourse) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 font-bold transition-colors mb-2"
        >
          <ArrowLeft size={20} /> 返回所有課程
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${selectedCourse.color} rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-cyan-500/30 font-heading`}>
              {selectedCourse.title.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3 font-heading">
                {selectedCourse.title}
                {isAdmin && <button className="text-slate-300 hover:text-cyan-600 transition-colors"><Edit size={20}/></button>}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium">
                <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {selectedCourse.grade}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {selectedCourse.time}</span>
                <span className="flex items-center gap-1.5"><Users size={16} /> {selectedCourse.studentCount} 位學生</span>
              </div>
              <p className="mt-3 text-slate-500 text-sm max-w-2xl">{selectedCourse.description}</p>
            </div>
          </div>
          {/* Mock Units */}
          <div className="space-y-5">
            {selectedCourse.units.map((item) => (
              <div key={item.week} className="flex items-center p-5 rounded-xl border border-slate-100 bg-white hover:border-cyan-200 transition-all">
                  <div className="w-24 font-bold text-slate-400 font-heading">WEEK {item.week}</div>
                  <div className="flex-1 font-bold text-slate-700">{item.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
         <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 font-heading pl-2">所有課程</h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">{courses.length}</span>
         </div>
         {isAdmin && (
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-cyan-900 rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/10 transition-all active:scale-95"
           >
             <Plus size={18} /> 新增課程
           </button>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
            >
               <div className={`h-32 bg-gradient-to-br ${course.color} p-6 relative`}>
                  <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-slate-700 font-heading border border-slate-100">
                     {course.title.charAt(0)}
                  </div>
               </div>
               <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
                      {course.grade}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 font-heading">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                    {course.description}
                  </p>
               </div>
            </div>
          ))}
       </div>

       {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-900/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">新增課程</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <input required type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} placeholder="課程名稱" className="w-full px-4 py-2 border rounded-xl"/>
              <input required type="text" value={newCourse.grade} onChange={e => setNewCourse({...newCourse, grade: e.target.value})} placeholder="適用年級" className="w-full px-4 py-2 border rounded-xl"/>
              <input required type="text" value={newCourse.time} onChange={e => setNewCourse({...newCourse, time: e.target.value})} placeholder="上課時間" className="w-full px-4 py-2 border rounded-xl"/>
              <textarea required value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} placeholder="課程簡介" className="w-full px-4 py-2 border rounded-xl h-24"/>
              <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">取消</button>
                 <button type="submit" className="flex-1 py-3 bg-cyan-500 text-white rounded-xl font-bold">確認新增</button>
              </div>
            </form>
          </div>
        </div>
       )}
    </div>
  );
}

const AdminView = ({ 
  setView, 
  systemMessage, 
  setSystemMessage,
  weeklySchedule,
  setWeeklySchedule,
  calendarEvents,
  setCalendarEvents
}: { 
  setView: (view: ViewState) => void, 
  systemMessage: string, 
  setSystemMessage: (msg: string) => void,
  weeklySchedule: ClassSession[],
  setWeeklySchedule: React.Dispatch<React.SetStateAction<ClassSession[]>>,
  calendarEvents: CalendarEvent[],
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>
}) => {
  const [isScheduleEditOpen, setIsScheduleEditOpen] = useState(false);
  const [isCalendarEditOpen, setIsCalendarEditOpen] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<ClassSession[]>([]);
  const [newEvent, setNewEvent] = useState({ date: '', title: '', type: 'activity' });

  const adminModules = [
    { title: '公告發布與管理', desc: '發布最新消息、課程提醒', icon: LayoutDashboard, view: ViewState.DASHBOARD, color: 'bg-cyan-500' },
    { title: '課程內容編輯', desc: '管理教學大綱、上傳講義', icon: BookOpen, view: ViewState.COURSES, color: 'bg-indigo-500' },
    { title: '專題進度追蹤', desc: '審核進度、管理分組', icon: Hammer, view: ViewState.PROJECTS, color: 'bg-rose-500' },
    { title: '設備與庫存盤點', desc: '耗材管理、設備預約設定', icon: Box, view: ViewState.INVENTORY, color: 'bg-amber-400' },
    { title: '安全認證中心', desc: '管理學生測驗紀錄、事故通報', icon: ShieldAlert, view: ViewState.SAFETY, color: 'bg-red-500' },
    { title: '作品展策展', desc: '精選優秀作品、管理展示內容', icon: Images, view: ViewState.GALLERY, color: 'bg-purple-500' },
  ];

  const handleOpenSchedule = () => {
    setTempSchedule(JSON.parse(JSON.stringify(weeklySchedule)));
    setIsScheduleEditOpen(true);
  };

  const handleSaveSchedule = () => {
    setWeeklySchedule(tempSchedule);
    setIsScheduleEditOpen(false);
  };

  const handleScheduleChange = (day: number, period: number, field: 'class' | 'subject' | 'room', value: string) => {
    setTempSchedule(prev => {
      const existingIndex = prev.findIndex(s => s.day === day && s.period === period);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], [field]: value };
        return updated;
      } else {
        return [...prev, { day, period, class: '', subject: '', room: '', [field]: value }];
      }
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.title) return;
    setCalendarEvents(prev => [...prev, {
      id: `evt${Date.now()}`,
      date: newEvent.date,
      title: newEvent.title,
      type: newEvent.type as any
    }]);
    setNewEvent({ date: '', title: '', type: 'activity' });
  };

  const handleDeleteEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 border-b border-slate-100 pb-6">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 font-heading">
             <Settings2 className="text-cyan-600" /> 後台管理控制中心
           </h2>
           <p className="text-slate-500 mt-2">歡迎回來，管理員。請選擇您要管理的模組：</p>
        </div>

        {/* System Broadcast Settings */}
        <div className="mb-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
           <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-3">
              <Megaphone size={20} /> 系統推播設定 (全站通知)
           </h3>
           <p className="text-xs text-amber-700 mb-3">輸入的內容將在使用者點擊鈴鐺時，以全螢幕彈窗顯示。</p>
           <div className="flex gap-4">
              <textarea 
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                className="flex-1 h-20 p-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-700"
                placeholder="輸入系統重要公告..."
              />
           </div>
        </div>

        {/* Schedule & Calendar Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100">
              <h3 className="font-bold text-cyan-800 mb-2 flex items-center gap-2"><Clock size={20}/> 教師課表管理</h3>
              <p className="text-xs text-cyan-700 mb-4">編輯每週固定課表，將同步顯示於今日課表。</p>
              <button onClick={handleOpenSchedule} className="w-full py-2 bg-white text-cyan-600 font-bold rounded-lg border border-cyan-200 hover:bg-cyan-100 transition-colors">
                編輯每週課表
              </button>
           </div>
           <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
              <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2"><Calendar size={20}/> 行事曆活動管理</h3>
              <p className="text-xs text-purple-700 mb-4">新增或刪除行事曆上的重要活動與考試日期。</p>
              <button onClick={() => setIsCalendarEditOpen(true)} className="w-full py-2 bg-white text-purple-600 font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
                編輯行事曆
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {adminModules.map((mod, idx) => (
             <button 
               key={idx}
               onClick={() => setView(mod.view)}
               className="group flex flex-col text-left p-6 rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white relative overflow-hidden"
             >
               <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${mod.color.replace('bg-', 'from-')} to-white opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>
               
               <div className={`${mod.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}>
                 <mod.icon size={26} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 group-hover:text-cyan-600 transition-colors font-heading">{mod.title}</h3>
               <p className="text-sm text-slate-500 mt-2 leading-relaxed">{mod.desc}</p>
             </button>
           ))}
        </div>
      </div>

      {/* Schedule Edit Modal */}
      {isScheduleEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-8 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">編輯每週課表</h3>
               <button onClick={() => setIsScheduleEditOpen(false)}><X size={24} className="text-slate-400"/></button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead>
                      <tr>
                        <th className="p-2 border">節次</th>
                        {[1,2,3,4,5].map(d => <th key={d} className="p-2 border bg-slate-50">星期{['一','二','三','四','五'][d-1]}</th>)}
                      </tr>
                   </thead>
                   <tbody>
                      {[1,2,3,4,5,6,7,8].map(p => (
                        <tr key={p}>
                           <td className="p-2 border font-bold text-center bg-slate-50">第 {p} 節</td>
                           {[1,2,3,4,5].map(d => {
                              const session = tempSchedule.find(s => s.day === d && s.period === p) || { class: '', subject: '', room: '' };
                              return (
                                <td key={d} className="p-2 border min-w-[150px]">
                                   <div className="space-y-1">
                                      <input 
                                        placeholder="班級" 
                                        value={session.class} 
                                        onChange={e => handleScheduleChange(d, p, 'class', e.target.value)}
                                        className="w-full p-1 border rounded text-xs"
                                      />
                                      <input 
                                        placeholder="科目" 
                                        value={session.subject} 
                                        onChange={e => handleScheduleChange(d, p, 'subject', e.target.value)}
                                        className="w-full p-1 border rounded text-xs"
                                      />
                                      <input 
                                        placeholder="教室" 
                                        value={session.room} 
                                        onChange={e => handleScheduleChange(d, p, 'room', e.target.value)}
                                        className="w-full p-1 border rounded text-xs text-slate-500"
                                      />
                                   </div>
                                </td>
                              );
                           })}
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsScheduleEditOpen(false)} className="px-6 py-2 bg-slate-100 rounded-lg font-bold">取消</button>
                <button onClick={handleSaveSchedule} className="px-6 py-2 bg-cyan-500 text-white rounded-lg font-bold">儲存變更</button>
             </div>
          </div>
        </div>
      )}

      {/* Calendar Edit Modal */}
      {isCalendarEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold">編輯行事曆活動</h3>
               <button onClick={() => setIsCalendarEditOpen(false)}><X size={24} className="text-slate-400"/></button>
             </div>
             
             {/* Add New Event */}
             <form onSubmit={handleAddEvent} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                   <label className="text-xs font-bold text-slate-500">日期</label>
                   <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-2 border rounded-lg"/>
                </div>
                <div className="flex-[2] space-y-1">
                   <label className="text-xs font-bold text-slate-500">活動名稱</label>
                   <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="輸入活動內容"/>
                </div>
                <div className="flex-1 space-y-1">
                   <label className="text-xs font-bold text-slate-500">類型</label>
                   <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full p-2 border rounded-lg">
                      <option value="activity">活動</option>
                      <option value="exam">考試/作業</option>
                      <option value="holiday">放假</option>
                   </select>
                </div>
                <button type="submit" className="bg-cyan-500 text-white p-2 rounded-lg h-[42px] px-4 font-bold">新增</button>
             </form>

             <div className="space-y-2">
                <h4 className="font-bold text-slate-700 mb-2">已排定活動</h4>
                {calendarEvents.sort((a,b) => a.date.localeCompare(b.date)).map(evt => (
                  <div key={evt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                     <div className="flex gap-4 items-center">
                        <span className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">{evt.date}</span>
                        <span className="font-bold text-slate-800">{evt.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                           evt.type === 'exam' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                           {evt.type === 'exam' ? '考試' : '活動'}
                        </span>
                     </div>
                     <button onClick={() => handleDeleteEvent(evt.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true); // Control Landing Page View
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Centralized State (acting as Database)
  const [projects, setProjects] = useState<Project[]>(INIT_PROJECTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INIT_INVENTORY);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INIT_ANNOUNCEMENTS);
  const [courses, setCourses] = useState<Course[]>(INIT_COURSES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INIT_GALLERY_ITEMS);
  const [galleryTheme, setGalleryTheme] = useState({ title: '年度最佳作品展', desc: '展示優悉工坊 112 學年度生活科技專題競賽精選作品，激發你的創作靈感。' });
  const [incidents, setIncidents] = useState<IncidentReport[]>(INIT_INCIDENTS);
  const [safetyBanner, setSafetyBanner] = useState('本週工坊重點檢查項目：護目鏡配戴狀況 與 長髮需綁起。\n請各組組長務必在操作機具前檢查組員服裝儀容。');
  const [borrowFormUrl, setBorrowFormUrl] = useState('https://forms.google.com/example-borrow-form');

  // Schedule & Calendar State
  const [weeklySchedule, setWeeklySchedule] = useState<ClassSession[]>(INIT_WEEKLY_SCHEDULE);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INIT_CALENDAR_EVENTS);

  // Single System Message State
  const [systemMessage, setSystemMessage] = useState('歡迎來到 YUSI Craft 優悉工坊！\n請同學注意：下週三將進行雷切機保養，當天暫停開放預約。');

  const handleLogin = (password: string) => {
    if (password === 'admin') {
      setIsAdmin(true);
      setView(ViewState.ADMIN); 
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setView(ViewState.DASHBOARD);
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      setView={setView} 
      isAdmin={isAdmin} 
      onLogin={handleLogin}
      onLogout={handleLogout}
      notifications={announcements}
      systemMessage={systemMessage}
    >
      {currentView === ViewState.DASHBOARD && (
        <DashboardView 
          projects={projects} 
          announcements={announcements} 
          isAdmin={isAdmin} 
          weeklySchedule={weeklySchedule}
          calendarEvents={calendarEvents}
        />
      )}
      {currentView === ViewState.COURSES && <CourseView courses={courses} setCourses={setCourses} isAdmin={isAdmin} />}
      {currentView === ViewState.PROJECTS && <ProjectsView projects={projects} setProjects={setProjects} isAdmin={isAdmin} />}
      {currentView === ViewState.INVENTORY && <InventoryView inventory={inventory} setInventory={setInventory} isAdmin={isAdmin} borrowFormUrl={borrowFormUrl} setBorrowFormUrl={setBorrowFormUrl} />}
      {currentView === ViewState.SAFETY && <SafetyView isAdmin={isAdmin} incidents={incidents} setIncidents={setIncidents} safetyBanner={safetyBanner} setSafetyBanner={setSafetyBanner} />}
      {currentView === ViewState.GALLERY && <GalleryView galleryItems={galleryItems} setGalleryItems={setGalleryItems} galleryTheme={galleryTheme} setGalleryTheme={setGalleryTheme} isAdmin={isAdmin} />}
      {currentView === ViewState.ASSISTANT && <AssistantView inventory={inventory} />}
      {currentView === ViewState.ADMIN && isAdmin && (
        <AdminView 
          setView={setView} 
          systemMessage={systemMessage} 
          setSystemMessage={setSystemMessage} 
          weeklySchedule={weeklySchedule}
          setWeeklySchedule={setWeeklySchedule}
          calendarEvents={calendarEvents}
          setCalendarEvents={setCalendarEvents}
        />
      )}
    </Layout>
  );
};

export default App;
    