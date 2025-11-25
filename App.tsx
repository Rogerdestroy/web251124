import React, { useState, useRef } from 'react';
import { Layout } from './components/Layout';
import { ViewState, InventoryItem, Project, Announcement } from './types';
import { generateTeachingAssistance } from './services/geminiService';
import { 
  Users, AlertTriangle, PenTool, Calendar, Clock, CheckCircle, 
  Search, Plus, MoreHorizontal, FileText, Video, Box, 
  AlertCircle, Sparkles, Send, ShieldAlert, Bot,
  Settings2, Trash2, Edit, Eye, Filter,
  X, LayoutDashboard, BookOpen, Hammer, Images, MapPin, ChevronLeft, ChevronRight,
  TrendingUp, Download, ExternalLink, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Mock Data ---
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: '【重要】期末專題繳交期限延長', date: '2023-10-25', type: 'important', content: '考慮到雷切機預約爆滿，繳交期限延長至下週五。' },
  { id: '2', title: '全縣生活科技競賽報名開始', date: '2023-10-22', type: 'activity', content: '欲參加「液壓手臂」項目的同學請找老師報名。' },
  { id: '3', title: '3D印表機 #2 維修完成', date: '2023-10-20', type: 'important', content: '已更換噴頭，請同學愛惜使用。' },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'PLA 線材 (白)', category: 'consumable', quantity: 5, unit: '卷', location: 'A-01', status: 'available' },
  { id: '2', name: 'PLA 線材 (黑)', category: 'consumable', quantity: 1, unit: '卷', location: 'A-02', status: 'low_stock' },
  { id: '3', name: '雷切機 60W', category: 'equipment', quantity: 1, unit: '台', location: 'B-01', status: 'in_use' },
  { id: '4', name: '3mm 密迪板', category: 'consumable', quantity: 50, unit: '片', location: 'C-05', status: 'available', spec: '60x40cm' },
  { id: '5', name: 'Arduino Uno', category: 'equipment', quantity: 28, unit: '片', location: 'D-01', status: 'available' },
];

const MOCK_PROJECTS: Project[] = [
  { id: '1', title: '智慧盆栽澆水系統', groupName: '綠手指小隊', members: ['陳小明', '李小華'], stage: 'prototyping', progress: 65, thumbnail: 'https://picsum.photos/400/300?random=1', lastUpdate: '2天前' },
  { id: '2', title: '液壓機械手臂', groupName: '大力士', members: ['王大鈞', '林志豪'], stage: 'fabrication', progress: 80, thumbnail: 'https://picsum.photos/400/300?random=2', lastUpdate: '1小時前' },
  { id: '3', title: '藍芽遙控車', groupName: '極速傳說', members: ['張建國'], stage: 'testing', progress: 95, thumbnail: 'https://picsum.photos/400/300?random=3', lastUpdate: '5天前' },
];

interface GalleryItem {
  id: number;
  title: string;
  student: string;
  year: string;
  category: string;
  description: string;
  image: string;
  award?: string;
}

const MOCK_GALLERY_ITEMS: GalleryItem[] = [
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
  {
    id: 5,
    title: '仿生獸行走機構',
    student: '林志豪',
    year: '111',
    category: '機構設計',
    description: '模仿泰奧揚森機構 (Theo Jansen Linkage) 設計的風力行走模型。',
    image: 'https://picsum.photos/600/400?random=15',
    award: '優等'
  },
  {
    id: 6,
    title: '太陽能追日系統',
    student: '吳小美',
    year: '110',
    category: '綠能科技',
    description: '利用光敏電阻偵測光源位置，控制太陽能板轉向以獲得最大發電效率。',
    image: 'https://picsum.photos/600/400?random=16'
  }
];

const MOCK_TODAY_SCHEDULE = [
  { period: 1, time: '08:10 - 09:00', class: '201 班', subject: '生活科技', room: '生科教室一', status: 'completed' },
  { period: 2, time: '09:10 - 10:00', class: '201 班', subject: '生活科技', room: '生科教室一', status: 'completed' },
  { period: 3, time: '10:10 - 11:00', class: '105 班', subject: '生活科技', room: '生科教室二', status: 'current' },
  { period: 4, time: '11:10 - 12:00', class: '105 班', subject: '生活科技', room: '生科教室二', status: 'upcoming' },
  { period: 5, time: '13:10 - 14:00', class: '午休 / 備課', subject: '', room: '辦公室', status: 'upcoming' },
  { period: 6, time: '14:10 - 15:00', class: '309 班', subject: '專題實作', room: '雷切加工區', status: 'upcoming' },
];

// --- Sub-Components (Views) ---

const DashboardView = ({ projects, announcements, isAdmin }: { projects: Project[], announcements: Announcement[], isAdmin: boolean }) => {
  const stats = [
    { label: '進行中專案', value: projects.length, icon: PenTool, color: 'text-cyan-600', bg: 'bg-cyan-100', borderColor: 'border-cyan-200' },
    { label: '器材預約數', value: '12', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100', borderColor: 'border-amber-200' },
    { label: '未通過安檢', value: '5', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100', borderColor: 'border-rose-200' },
    { label: '耗材低庫存', value: '3', icon: Box, color: 'text-purple-600', bg: 'bg-purple-100', borderColor: 'border-purple-200' },
  ];

  const chartData = [
    { name: '構想', count: 4 },
    { name: '原型', count: 8 },
    { name: '製作', count: 12 },
    { name: '測試', count: 6 },
    { name: '完成', count: 3 },
  ];

  // Simple calendar day generator
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 3; 

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
            {isAdmin && <button className="absolute top-3 right-3 text-slate-300 hover:text-cyan-600 transition-colors"><Edit size={16}/></button>}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${stat.bg} opacity-20`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Schedule & Calendar */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 font-heading">
                <div className="bg-cyan-100 p-2 rounded-lg text-cyan-700">
                  <Calendar size={20} />
                </div>
                教學日程與課表
              </h3>
              <div className="text-sm text-cyan-700 font-bold bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100">
                2023年 10月 25日 (三)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Today's Schedule */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-heading">今日課表</h4>
                <div className="space-y-0 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
                  
                  {MOCK_TODAY_SCHEDULE.map((item, index) => (
                    <div key={index} className="relative pl-10 py-3 group">
                      <div className={`absolute left-3 top-5 w-4 h-4 rounded-full border-2 z-10 transition-all duration-300 ${
                        item.status === 'current' ? 'bg-amber-500 border-amber-200 ring-4 ring-amber-50 scale-110' :
                        item.status === 'completed' ? 'bg-cyan-100 border-cyan-200' :
                        'bg-white border-slate-300'
                      }`}></div>
                      
                      <div className={`p-4 rounded-xl border transition-all duration-300 ${
                        item.status === 'current' ? 'bg-amber-50 border-amber-200 shadow-md translate-x-1' : 'bg-slate-50 border-slate-100 hover:border-cyan-200'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs font-bold font-heading ${item.status === 'current' ? 'text-amber-600' : 'text-slate-500'}`}>
                            PERIOD {item.period}
                          </span>
                          <span className="text-xs text-slate-400 font-mono tracking-tight">{item.time}</span>
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
                  ))}
                </div>
              </div>

              {/* Monthly Calendar */}
              <div>
                 <div className="flex justify-between items-center mb-6">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">2023 十月</h4>
                   <div className="flex gap-2">
                     <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-cyan-600 transition-colors"><ChevronLeft size={18}/></button>
                     <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-cyan-600 transition-colors"><ChevronRight size={18}/></button>
                   </div>
                 </div>
                 <div className="grid grid-cols-7 gap-2 text-center text-xs mb-3 font-heading">
                   {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => <div key={d} className="text-slate-400 font-bold py-1">{d}</div>)}
                 </div>
                 <div className="grid grid-cols-7 gap-2 text-center text-sm font-heading font-medium">
                    {Array.from({length: startOffset}).map((_, i) => <div key={`empty-${i}`} className="h-10"></div>)}
                    {currentMonthDays.map(d => (
                      <div key={d} className={`h-10 w-10 mx-auto flex items-center justify-center rounded-xl cursor-pointer transition-all relative group ${
                        d === 25 ? 'bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-600/30' : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-700'
                      }`}>
                        {d}
                        {(d === 12 || d === 20 || d === 28) && (
                          <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        )}
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 space-y-3">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-heading">近期活動</p>
                   <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-amber-50 hover:border-amber-100 transition-colors cursor-pointer">
                     <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                     <span className="font-bold font-heading text-slate-800">28日</span> 期末專題構想書繳交
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-cyan-50 hover:border-cyan-100 transition-colors cursor-pointer">
                     <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                     <span className="font-bold font-heading text-slate-800">31日</span> 萬聖節工坊特別活動
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project Progress (Shrunk) & Announcements */}
        <div className="space-y-8 lg:col-span-1">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-6 font-heading flex items-center gap-2">
               <TrendingUp size={18} className="text-cyan-600"/> 專案進度分佈
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
                        <Cell key={`cell-${index}`} fill={index === 2 ? '#0891b2' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                總計 {projects.length} 組專案進行中
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
                 <button className="text-xs font-bold text-cyan-600 hover:underline">VIEW ALL</button>
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

const ProjectsView = ({ projects, isAdmin }: { projects: Project[], isAdmin: boolean }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-slate-100 border border-transparent rounded-lg text-sm font-bold text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors">所有專案</button>
          <button className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">需審核</button>
        </div>
        <button className={`flex items-center gap-2 px-6 py-2.5 ${isAdmin ? 'bg-amber-500 hover:bg-amber-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/10 transition-all active:scale-95`}>
          <Plus size={18} /> {isAdmin ? '建立示範專案' : '新增專案'}
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[1000px] lg:min-w-0">
           {['prototyping', 'fabrication', 'testing', 'completed'].map(stage => (
             <div key={stage} className="bg-slate-50/50 p-4 rounded-2xl min-h-[600px] border border-slate-200/50">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-heading">
                    {stage === 'prototyping' && '原型製作'}
                    {stage === 'fabrication' && '外殼/結構'}
                    {stage === 'testing' && '功能測試'}
                    {stage === 'completed' && '已完成'}
                  </h3>
                  <span className="bg-white text-slate-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-slate-100">
                    {projects.filter(p => p.stage === stage).length}
                  </span>
                </div>
                <div className="space-y-4">
                  {projects.filter(p => p.stage === stage).map(project => (
                    <div key={project.id} className="group bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-move hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                      <div className="h-32 bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded font-bold font-heading">
                           {project.groupName}
                        </div>
                        {isAdmin && (
                          <div className="absolute inset-0 bg-cyan-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                             <button className="p-2 bg-white rounded-full text-slate-800 hover:text-cyan-600 shadow-lg"><Edit size={16}/></button>
                             <button className="p-2 bg-white rounded-full text-rose-500 hover:text-rose-700 shadow-lg"><Trash2 size={16}/></button>
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 text-base mb-2 font-heading">{project.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                         {project.members.map((m, i) => (
                           <span key={i} className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{m}</span>
                         ))}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                        <span>Updated {project.lastUpdate}</span>
                        <button className="hover:text-cyan-600"><MoreHorizontal size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16}/> Add Card
                  </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const InventoryView = ({ inventory, isAdmin }: { inventory: InventoryItem[], isAdmin: boolean }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 text-lg font-heading">庫存與設備清單</h3>
            <div className="flex items-center gap-3">
               <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="搜尋材料..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all w-48 focus:w-64" />
              </div>
              {isAdmin && (
                <button className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-600/20">
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
                {inventory.map(item => (
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
                          <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200">-</button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200">+</button>
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
                        {item.status === 'available' ? 'Available' : 
                         item.status === 'low_stock' ? 'Low Stock' : 
                         item.status === 'in_use' ? 'In Use' : 'Maintenance'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-cyan-600 hover:text-cyan-800 p-1 bg-cyan-50 rounded"><Edit size={16} /></button>
                          <button className="text-rose-600 hover:text-rose-800 p-1 bg-rose-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <button className="text-cyan-600 hover:text-cyan-800 font-bold text-xs border border-cyan-200 px-3 py-1 rounded hover:bg-cyan-50 transition-colors">
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
          {!isAdmin && (
            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-6 rounded-2xl shadow-lg shadow-cyan-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="font-bold text-xl font-heading mb-1">快速掃描登記</h3>
                  <p className="text-cyan-100 text-sm opacity-80">使用平板或手機掃描材料 QR Code</p>
                </div>
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 border-2 border-white/50 rounded flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-amber-400 animate-pulse box-shadow-glow"></div>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-white text-cyan-800 font-bold rounded-xl hover:bg-cyan-50 transition-colors shadow-md relative z-10 flex items-center justify-center gap-2">
                 <Box size={18}/> 開啟相機掃描
              </button>
            </div>
          )}

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
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-cyan-200 transition-colors">
                   <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
                      <Clock size={20} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700 font-heading">3D印表機 #3</p>
                      <p className="text-xs text-slate-500 mt-0.5">08:00 - 16:00 • 301班 張同學</p>
                   </div>
                   {isAdmin && <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-all"><X size={16}/></button>}
                </div>
             </div>
             <button className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-cyan-600 transition-colors">
               查看完整行事曆
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SafetyView = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Hero Warning */}
       <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 flex items-start gap-6 relative shadow-sm">
          <div className="bg-amber-100 p-3 rounded-xl">
             <AlertTriangle className="text-amber-600 w-8 h-8 flex-shrink-0" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 font-heading">安全守則提醒</h3>
            <p className="text-amber-800 mt-2 leading-relaxed">
              本週工坊重點檢查項目：<b className="text-amber-900 bg-amber-200/50 px-1 rounded">護目鏡配戴狀況</b> 與 <b className="text-amber-900 bg-amber-200/50 px-1 rounded">長髮需綁起</b>。
              請各組組長務必在操作機具前檢查組員服裝儀容。
            </p>
          </div>
          {isAdmin && (
            <button className="absolute top-6 right-6 px-4 py-2 bg-white text-amber-700 text-xs font-bold rounded-lg border border-amber-200 hover:bg-amber-50 shadow-sm transition-colors">
              編輯公告
            </button>
          )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-3 font-heading text-lg">
              <CheckCircle className="text-emerald-500" size={24}/> 機器操作認證狀況 (301班)
            </h3>
            <div className="space-y-6">
              {[
                { name: '雷射切割機', passed: 28, total: 30 },
                { name: '3D 印表機', passed: 30, total: 30 },
                { name: '帶鋸機', passed: 15, total: 30, warning: true },
                { name: '鑽床', passed: 30, total: 30 },
              ].map((machine) => (
                <div key={machine.name}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-700">{machine.name}</span>
                    <span className={machine.warning ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                      {machine.passed} / {machine.total} 人通過
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${machine.warning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(machine.passed/machine.total)*100}%` }}
                      ></div>
                    </div>
                    {isAdmin && <button className="text-xs text-cyan-600 hover:underline font-bold">管理</button>}
                  </div>
                </div>
              ))}
            </div>
            {isAdmin && (
              <button className="mt-8 w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-cyan-600 transition-colors flex items-center justify-center gap-2">
                <Download size={16}/> 匯出認證報表
              </button>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
             <h3 className="font-bold text-slate-800 mb-6 w-full text-left font-heading text-lg">事故通報與紀錄</h3>
             
             <div className="relative mb-6">
                <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center z-10 relative">
                  <ShieldAlert className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"></div>
             </div>

             <div className="space-y-1 mb-8">
                <p className="text-2xl font-bold text-slate-800 font-heading">目前無未處理事故</p>
                <p className="text-slate-500 text-sm">工坊已連續 <span className="font-bold text-emerald-600 text-lg">45</span> 天無受傷紀錄</p>
             </div>

             <button className={`w-full py-3 ${isAdmin ? 'bg-slate-800 hover:bg-slate-900' : 'bg-rose-500 hover:bg-rose-600'} text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}>
                 {isAdmin ? <FileText size={18}/> : <AlertTriangle size={18}/>}
                 {isAdmin ? '查看歷史紀錄' : '填寫事故通報單'}
             </button>
          </div>
       </div>
    </div>
  );
};

const GalleryView = ({ isAdmin }: { isAdmin: boolean }) => {
  const [yearFilter, setYearFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique years and categories for filter options
  const years = Array.from(new Set(MOCK_GALLERY_ITEMS.map(item => item.year))).sort().reverse();
  const categories = Array.from(new Set(MOCK_GALLERY_ITEMS.map(item => item.category)));

  const filteredItems = MOCK_GALLERY_ITEMS.filter(item => {
    const matchYear = yearFilter === 'All' || item.year === yearFilter;
    const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchSearch = searchQuery === '' || 
                        item.title.includes(searchQuery) || 
                        item.student.includes(searchQuery) ||
                        item.description.includes(searchQuery);
    return matchYear && matchCategory && matchSearch;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
       <div className="bg-gradient-to-r from-cyan-900 to-slate-900 text-white rounded-2xl p-10 text-center relative overflow-hidden shadow-xl shadow-cyan-900/20">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
          <div className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4 tracking-widest uppercase border border-amber-500/30">Exhibition</span>
            <h2 className="text-4xl font-bold mb-4 font-heading tracking-tight">年度最佳作品展</h2>
            <p className="text-cyan-200 text-lg max-w-2xl mx-auto">展示優悉工坊 112 學年度生活科技專題競賽精選作品，激發你的創作靈感。</p>
            {isAdmin && (
              <button className="mt-6 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm font-bold hover:bg-white/20 transition-colors">
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
           {isAdmin && (
            <button className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-bold hover:bg-cyan-700 whitespace-nowrap shadow-md">
              <Plus size={16} /> 上傳
            </button>
           )}
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
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                    <Box size={12} /> 3D View
                  </div>
                  {isAdmin && (
                    <div className="absolute inset-0 bg-cyan-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button className="p-2.5 bg-white rounded-full text-slate-800 hover:text-cyan-600 shadow-xl"><Edit size={18}/></button>
                      <button className="p-2.5 bg-white rounded-full text-slate-800 hover:text-cyan-600 shadow-xl"><Eye size={18}/></button>
                    </div>
                  )}
                  {item.award && (
                     <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg shadow-amber-900/20 font-heading">
                       <span className="mr-1">🏆</span> {item.award}
                     </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-cyan-700 transition-colors font-heading mb-2">{item.title}</h3>
                    <div className="flex gap-2">
                       <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase tracking-wider">{item.year} 學年</span>
                       <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-1 rounded font-bold uppercase tracking-wider">{item.category}</span>
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
                    <button className="text-cyan-600 hover:text-cyan-800 text-xs font-bold flex items-center gap-1 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors">
                      查看詳情 <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
    我們班目前主要進行的專題類型：Arduino 機電整合、木工機構設計。
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
       <div className="bg-gradient-to-r from-cyan-800 to-cyan-950 text-white p-6 rounded-t-2xl flex items-center gap-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="bg-white/10 p-3.5 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
            <Bot className="w-8 h-8 text-amber-300" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-heading tracking-tight">YUSI Craft AI 學習小幫手</h2>
            <p className="text-cyan-200 text-sm mt-1">你的專題救星與安全顧問</p>
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
                    <span className="font-bold text-cyan-700 block mb-1 group-hover:text-cyan-800">範例問題 {i+1}</span>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
             <div className="flex gap-6 animate-pulse max-w-3xl">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex-shrink-0"></div>
                <div className="space-y-3 flex-1 py-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                </div>
             </div>
          )}

          {response && (
            <div className="flex gap-6 max-w-4xl">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-cyan-200">
                <Bot size={22} className="text-cyan-700" />
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
               className="absolute right-3 top-3 p-2.5 bg-cyan-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors shadow-md active:scale-95"
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

const CourseView = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
         <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
           <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-cyan-500/30 font-heading">
             1A
           </div>
           <div className="flex-1">
             <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3 font-heading">
               生活科技 - 第一冊 
               {isAdmin && <button className="text-slate-300 hover:text-cyan-600 transition-colors"><Edit size={20}/></button>}
             </h2>
             <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium">
               <span className="flex items-center gap-1.5"><Users size={16} /> 一年級</span>
               <span className="flex items-center gap-1.5"><Clock size={16} /> 每週二 第 3-4 節</span>
             </div>
           </div>
           {isAdmin && (
             <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
               <Users size={18}/> 管理學生名單
             </button>
           )}
         </div>

         <div className="border-b border-slate-100 mb-8">
           <nav className="flex gap-8">
             <button className="pb-4 border-b-2 border-cyan-600 text-cyan-600 font-bold text-lg">課程進度</button>
             <button className="pb-4 text-slate-400 hover:text-slate-800 font-medium text-lg transition-colors">作業繳交</button>
             <button className="pb-4 text-slate-400 hover:text-slate-800 font-medium text-lg transition-colors">教材資源</button>
           </nav>
         </div>

         <div className="space-y-5">
           {isAdmin && (
             <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 group">
               <div className="bg-slate-100 p-1 rounded-full group-hover:bg-cyan-100 transition-colors"><Plus size={18}/></div>
               新增課程單元
             </button>
           )}
           {[
             { week: 1, topic: '工坊安全與工具介紹', status: 'completed' },
             { week: 2, topic: '機構結構原理 - 連桿與齒輪', status: 'completed' },
             { week: 3, topic: '電腦輔助繪圖 (CAD) 基礎 - Tinkercad', status: 'active' },
             { week: 4, topic: '雷射切割實作 - 手機架設計', status: 'upcoming' },
           ].map((item) => (
             <div key={item.week} className={`flex items-center p-5 rounded-xl border transition-all duration-300 group relative ${item.status === 'active' ? 'border-cyan-200 bg-cyan-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'}`}>
                <div className="w-24 font-bold text-slate-400 font-heading tracking-wide">WEEK {item.week}</div>
                <div className="flex-1">
                   <h4 className={`font-bold text-lg ${item.status === 'active' ? 'text-cyan-900' : 'text-slate-700'}`}>{item.topic}</h4>
                   {item.status === 'active' && <span className="text-xs font-bold text-cyan-600 mt-1 inline-block">進行中</span>}
                </div>
                <div className="flex gap-3">
                   <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-cyan-600 hover:border-cyan-200 transition-colors shadow-sm">
                     <FileText size={16} /> <span className="hidden sm:inline">講義</span>
                   </button>
                   {item.status !== 'upcoming' && (
                     <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm">
                       <Video size={16} /> <span className="hidden sm:inline">影片</span>
                     </button>
                   )}
                </div>
                {isAdmin && (
                  <div className="absolute right-2 -top-3 hidden group-hover:flex gap-1 animate-in fade-in slide-in-from-bottom-2">
                     <button className="p-1.5 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700"><Edit size={14}/></button>
                     <button className="p-1.5 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600"><Trash2 size={14}/></button>
                  </div>
                )}
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}

const AdminView = ({ setView }: { setView: (view: ViewState) => void }) => {
  const adminModules = [
    { title: '公告發布與管理', desc: '發布最新消息、課程提醒', icon: LayoutDashboard, view: ViewState.DASHBOARD, color: 'bg-cyan-500' },
    { title: '課程內容編輯', desc: '管理教學大綱、上傳講義', icon: BookOpen, view: ViewState.COURSES, color: 'bg-indigo-500' },
    { title: '專題進度追蹤', desc: '審核進度、管理分組', icon: Hammer, view: ViewState.PROJECTS, color: 'bg-rose-500' },
    { title: '設備與庫存盤點', desc: '耗材管理、設備預約設定', icon: Box, view: ViewState.INVENTORY, color: 'bg-amber-500' },
    { title: '安全認證中心', desc: '管理學生測驗紀錄、事故通報', icon: ShieldAlert, view: ViewState.SAFETY, color: 'bg-red-600' },
    { title: '作品展策展', desc: '精選優秀作品、管理展示內容', icon: Images, view: ViewState.GALLERY, color: 'bg-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 border-b border-slate-100 pb-6">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 font-heading">
             <Settings2 className="text-cyan-700" /> 後台管理控制中心
           </h2>
           <p className="text-slate-500 mt-2">歡迎回來，管理員。請選擇您要管理的模組：</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {adminModules.map((mod, idx) => (
             <button 
               key={idx}
               onClick={() => setView(mod.view)}
               className="group flex flex-col text-left p-6 rounded-2xl border border-slate-200 hover:border-cyan-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white relative overflow-hidden"
             >
               <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${mod.color.replace('bg-', 'from-')} to-white opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150`}></div>
               
               <div className={`${mod.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300`}>
                 <mod.icon size={26} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 group-hover:text-cyan-700 transition-colors font-heading">{mod.title}</h3>
               <p className="text-sm text-slate-500 mt-2 leading-relaxed">{mod.desc}</p>
               <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center w-full">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-cyan-600 uppercase tracking-wider">Manage</span>
                  <div className="bg-slate-50 p-1.5 rounded-full text-slate-300 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                    <ChevronRight size={16} />
                  </div>
               </div>
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 font-heading text-lg"><Users size={20} className="text-cyan-600"/> 最近登入學生</h3>
           <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                       {i === 1 ? '王' : i === 2 ? '李' : '張'}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-700">王小明</p>
                        <p className="text-xs text-slate-500 mt-0.5">301班 • 10分鐘前</p>
                     </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Online</span>
               </div>
             ))}
           </div>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 font-heading text-lg"><AlertCircle size={20} className="text-rose-500"/> 系統待辦事項</h3>
           <ul className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-rose-800 font-medium">審核 3 件新上傳的學生作品</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-amber-800 font-medium">確認雷切機 #2 維修進度</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl border border-cyan-100">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-cyan-800 font-medium">發布下週課程預習公告</span>
              </li>
           </ul>
         </div>
      </div>
    </div>
  );
}

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data State
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  const handleLogin = (password: string) => {
    // Mock password check
    if (password === 'admin') {
      setIsAdmin(true);
      setView(ViewState.ADMIN); // Redirect to Admin Dashboard upon login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setView(ViewState.DASHBOARD);
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setView} 
      isAdmin={isAdmin} 
      onLogin={handleLogin}
      onLogout={handleLogout}
    >
      {currentView === ViewState.DASHBOARD && <DashboardView projects={projects} announcements={announcements} isAdmin={isAdmin} />}
      {currentView === ViewState.COURSES && <CourseView isAdmin={isAdmin} />}
      {currentView === ViewState.PROJECTS && <ProjectsView projects={projects} isAdmin={isAdmin} />}
      {currentView === ViewState.INVENTORY && <InventoryView inventory={inventory} isAdmin={isAdmin} />}
      {currentView === ViewState.SAFETY && <SafetyView isAdmin={isAdmin} />}
      {currentView === ViewState.GALLERY && <GalleryView isAdmin={isAdmin} />}
      {currentView === ViewState.ASSISTANT && <AssistantView inventory={inventory} />}
      {currentView === ViewState.ADMIN && isAdmin && <AdminView setView={setView} />}
    </Layout>
  );
};

export default App;