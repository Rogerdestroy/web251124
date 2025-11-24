import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Hammer, 
  Box, 
  ShieldAlert, 
  Images, 
  Bot,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-xl">
          <Hammer className="text-blue-600" /> TechCraft
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Hammer className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">TechCraft</h1>
            <p className="text-xs text-slate-500">生活科技教學系統</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
          <NavItem 
            icon={LayoutDashboard} 
            label="總覽儀表板" 
            isActive={currentView === ViewState.DASHBOARD} 
            onClick={() => setView(ViewState.DASHBOARD)} 
          />
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">教學管理</div>
          <NavItem 
            icon={BookOpen} 
            label="課程與教材" 
            isActive={currentView === ViewState.COURSES} 
            onClick={() => setView(ViewState.COURSES)} 
          />
          <NavItem 
            icon={Hammer} 
            label="專題製作管理" 
            isActive={currentView === ViewState.PROJECTS} 
            onClick={() => setView(ViewState.PROJECTS)} 
          />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">工坊管理</div>
          <NavItem 
            icon={Box} 
            label="設備與庫存" 
            isActive={currentView === ViewState.INVENTORY} 
            onClick={() => setView(ViewState.INVENTORY)} 
          />
          <NavItem 
            icon={ShieldAlert} 
            label="安全與紀律" 
            isActive={currentView === ViewState.SAFETY} 
            onClick={() => setView(ViewState.SAFETY)} 
          />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">成果展示</div>
          <NavItem 
            icon={Images} 
            label="作品展示館" 
            isActive={currentView === ViewState.GALLERY} 
            onClick={() => setView(ViewState.GALLERY)} 
          />

          <div className="mt-8 pt-4 border-t border-slate-100">
             <button
              onClick={() => setView(ViewState.ASSISTANT)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-indigo-100 transition-all duration-200 ${
                currentView === ViewState.ASSISTANT 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Bot size={20} className="text-indigo-600" />
              <div className="text-left">
                <span className="font-bold block">AI 學習小幫手</span>
                <span className="text-xs opacity-80">專題解惑 & 安全諮詢</span>
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0 bg-slate-50/50">
        <header className="sticky top-0 z-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {currentView === ViewState.DASHBOARD && '教室總覽'}
            {currentView === ViewState.COURSES && '課程管理'}
            {currentView === ViewState.PROJECTS && '專題製作追蹤'}
            {currentView === ViewState.INVENTORY && '庫存與設備預約'}
            {currentView === ViewState.SAFETY && '安全認證中心'}
            {currentView === ViewState.GALLERY && '作品展示館'}
            {currentView === ViewState.ASSISTANT && 'AI 學習小幫手'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <img 
                src="https://picsum.photos/40/40" 
                alt="Teacher" 
                className="w-8 h-8 rounded-full border border-slate-200"
              />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-700">王大明 老師</p>
                <p className="text-xs text-slate-500">生活科技科</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};