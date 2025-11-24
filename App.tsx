import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ViewState, InventoryItem, Project, Announcement, MachineBooking } from './types';
import { generateTeachingAssistance } from './services/geminiService';
import { 
  Users, AlertTriangle, PenTool, Calendar, Clock, CheckCircle, 
  Search, Plus, MoreHorizontal, FileText, Download, PlayCircle,
  Video, Box, Cpu, AlertCircle, Sparkles, Send, ShieldAlert, Bot
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

// --- Sub-Components (Views) ---

const DashboardView = ({ projects, announcements }: { projects: Project[], announcements: Announcement[] }) => {
  const stats = [
    { label: '進行中專案', value: projects.length, icon: PenTool, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: '器材預約數', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: '未通過安檢', value: '5', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: '耗材低庫存', value: '3', icon: Box, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const chartData = [
    { name: '構想', count: 4 },
    { name: '原型', count: 8 },
    { name: '製作', count: 12 },
    { name: '測試', count: 6 },
    { name: '完成', count: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">專案進度分佈</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">最新公告</h3>
            <button className="text-sm text-blue-600 hover:underline">查看全部</button>
          </div>
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    ann.type === 'important' ? 'bg-red-100 text-red-700' :
                    ann.type === 'activity' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ann.type === 'important' ? '重要' : ann.type === 'activity' ? '活動' : '一般'}
                  </span>
                  <span className="text-xs text-slate-400">{ann.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{ann.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsView = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">所有專案</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">需審核</button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} /> 新增專案
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 overflow-x-auto">
        {/* Simple Kanban Columns Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {['prototyping', 'fabrication', 'testing', 'completed'].map(stage => (
             <div key={stage} className="bg-slate-100 p-4 rounded-xl min-h-[500px]">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center justify-between">
                  {stage === 'prototyping' && '原型製作'}
                  {stage === 'fabrication' && '外殼/結構製作'}
                  {stage === 'testing' && '功能測試'}
                  {stage === 'completed' && '已完成'}
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                    {projects.filter(p => p.stage === stage).length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {projects.filter(p => p.stage === stage).map(project => (
                    <div key={project.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow">
                      <div className="h-24 bg-slate-100 rounded mb-3 overflow-hidden">
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{project.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <Users size={12} /> {project.groupName}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>{project.lastUpdate}更新</span>
                        <MoreHorizontal size={14} />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const InventoryView = ({ inventory }: { inventory: InventoryItem[] }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">庫存與設備清單</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="搜尋材料..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">名稱</th>
                <th className="px-6 py-3">類別</th>
                <th className="px-6 py-3">位置</th>
                <th className="px-6 py-3">數量</th>
                <th className="px-6 py-3">狀態</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2">
                     {item.name}
                     {item.spec && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{item.spec}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.category === 'consumable' ? '耗材' : item.category === 'equipment' ? '設備' : '工具'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.location}</td>
                  <td className="px-6 py-4 font-medium">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'available' ? 'bg-green-100 text-green-700' :
                      item.status === 'low_stock' ? 'bg-red-100 text-red-700' :
                      item.status === 'in_use' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'available' ? '充足' : 
                       item.status === 'low_stock' ? '低庫存' : 
                       item.status === 'in_use' ? '使用中' : '維護中'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">編輯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Reserve / QR Scan */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-xl shadow-md text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">快速掃描登記</h3>
                <p className="text-indigo-100 text-sm">使用平板或手機掃描材料 QR Code</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-red-500 animate-pulse"></div>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              開啟相機掃描
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">今日設備預約</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded">
                      <Clock size={18} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">雷切機 #1</p>
                      <p className="text-xs text-slate-500">10:00 - 11:30 • 綠手指小隊</p>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded">
                      <Clock size={18} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">3D印表機 #3</p>
                      <p className="text-xs text-slate-500">08:00 - 16:00 • 301班 張同學</p>
                   </div>
                </div>
             </div>
             <button className="w-full mt-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
               查看完整行事曆
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SafetyView = () => {
  return (
    <div className="space-y-8">
       {/* Hero Warning */}
       <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-4">
          <AlertTriangle className="text-amber-600 w-12 h-12 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-amber-800">安全守則提醒</h3>
            <p className="text-amber-700 mt-1">
              本週工坊重點檢查項目：<b>護目鏡配戴狀況</b> 與 <b>長髮需綁起</b>。
              請各組組長務必在操作機具前檢查組員服裝儀容。
            </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle className="text-green-500" /> 機器操作認證狀況 (301班)
            </h3>
            <div className="space-y-4">
              {[
                { name: '雷射切割機', passed: 28, total: 30 },
                { name: '3D 印表機', passed: 30, total: 30 },
                { name: '帶鋸機', passed: 15, total: 30, warning: true },
                { name: '鑽床', passed: 30, total: 30 },
              ].map((machine) => (
                <div key={machine.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{machine.name}</span>
                    <span className={machine.warning ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                      {machine.passed}/{machine.total} 人通過
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${machine.warning ? 'bg-amber-500' : 'bg-green-500'}`} 
                      style={{ width: `${(machine.passed/machine.total)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-6">事故通報與紀錄</h3>
             <div className="text-center py-8">
               <div className="inline-block p-4 bg-green-50 rounded-full mb-3">
                 <ShieldAlert className="w-8 h-8 text-green-600" />
               </div>
               <p className="text-slate-800 font-bold">目前無未處理事故</p>
               <p className="text-slate-500 text-sm">工坊已連續 45 天無受傷紀錄</p>
               <button className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-md">
                 填寫事故通報單
               </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const GalleryView = () => {
  return (
    <div className="space-y-6">
       <div className="bg-slate-900 text-white rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">年度最佳作品展</h2>
            <p className="text-slate-300">112學年度 生活科技專題競賽精選</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img 
                  src={`https://picsum.photos/600/400?random=${i+10}`} 
                  alt="Portfolio" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Box size={12} /> 3D View
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">智慧自動分類垃圾桶</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">特優</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                  使用 Arduino 結合超音波感測器與伺服馬達，能夠自動辨識垃圾丟入並開啟對應的蓋子。外殼使用雷射切割木板製作。
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <img src={`https://picsum.photos/30/30?random=${i}`} className="w-6 h-6 rounded-full" />
                    <span className="text-xs text-slate-600 font-medium">李小華</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1">
                    查看詳情 <PenTool size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
       </div>
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
    setResponse(null); // Clear previous response for simplicity in this demo or append to chat list

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
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
       <div className="bg-indigo-600 text-white p-6 rounded-t-xl flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">TechCraft AI 學習小幫手</h2>
            <p className="text-indigo-200">你的專題救星與安全顧問</p>
          </div>
       </div>

       <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6">
          {!response && !loading && (
            <div className="text-center text-slate-400 py-10">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>嗨！專題遇到卡關了嗎？我可以幫你喔！</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
                {suggestedPrompts.map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 text-left text-sm text-slate-600 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
             <div className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
             </div>
          )}

          {response && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1 prose prose-slate max-w-none bg-slate-50 p-6 rounded-xl rounded-tl-none">
                 <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                   {response}
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div className="bg-white p-4 border border-t-0 rounded-b-xl border-slate-200 shadow-sm">
          <div className="relative">
             <textarea
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="輸入你的問題，例如：『我的伺服馬達不會轉怎麼辦？』"
               className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-14"
               onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
             />
             <button 
               onClick={handleAsk}
               disabled={loading || !prompt.trim()}
               className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
             >
               <Send size={18} />
             </button>
          </div>
       </div>
    </div>
  );
}

const CourseView = () => {
  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex items-center gap-4 mb-6">
           <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
             1A
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-800">生活科技 - 第一冊</h2>
             <p className="text-slate-500">一年級 • 每週二 第 3-4 節</p>
           </div>
         </div>

         <div className="border-b border-slate-200 mb-6">
           <nav className="flex gap-6">
             <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold">課程進度</button>
             <button className="pb-3 text-slate-500 hover:text-slate-800">作業繳交</button>
             <button className="pb-3 text-slate-500 hover:text-slate-800">教材資源</button>
           </nav>
         </div>

         <div className="space-y-4">
           {[
             { week: 1, topic: '工坊安全與工具介紹', status: 'completed' },
             { week: 2, topic: '機構結構原理 - 連桿與齒輪', status: 'completed' },
             { week: 3, topic: '電腦輔助繪圖 (CAD) 基礎 - Tinkercad', status: 'active' },
             { week: 4, topic: '雷射切割實作 - 手機架設計', status: 'upcoming' },
           ].map((item) => (
             <div key={item.week} className={`flex items-center p-4 rounded-lg border ${item.status === 'active' ? 'border-blue-200 bg-blue-50' : 'border-slate-100'}`}>
                <div className="w-16 font-bold text-slate-500">Week {item.week}</div>
                <div className="flex-1 font-bold text-slate-800">{item.topic}</div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">
                     <FileText size={14} /> 講義
                   </button>
                   {item.status !== 'upcoming' && (
                     <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50">
                       <Video size={14} /> 影片
                     </button>
                   )}
                </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Data State (In a real app, this comes from an API/Database)
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  return (
    <Layout currentView={currentView} setView={setView}>
      {currentView === ViewState.DASHBOARD && <DashboardView projects={projects} announcements={announcements} />}
      {currentView === ViewState.COURSES && <CourseView />}
      {currentView === ViewState.PROJECTS && <ProjectsView projects={projects} />}
      {currentView === ViewState.INVENTORY && <InventoryView inventory={inventory} />}
      {currentView === ViewState.SAFETY && <SafetyView />}
      {currentView === ViewState.GALLERY && <GalleryView />}
      {currentView === ViewState.ASSISTANT && <AssistantView inventory={inventory} />}
    </Layout>
  );
};

export default App;