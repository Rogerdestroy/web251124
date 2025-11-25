import React, { useState } from 'react';
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
  Bell,
  Settings,
  LogOut,
  Lock,
  Settings2
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  highlight = false
}: { 
  icon: React.ElementType, 
  label: string, 
  isActive: boolean, 
  onClick: () => void,
  highlight?: boolean
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActive 
        ? (highlight ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20')
        : 'text-cyan-100/70 hover:bg-cyan-800/50 hover:text-white'
    }`}
  >
    <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, isAdmin, onLogin, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(passwordInput)) {
      setIsSettingsOpen(false);
      setPasswordInput('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-cyan-950 text-white z-20 border-b border-cyan-800 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl font-heading">
          <Hammer className="text-amber-500" /> YUSI Craft
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-cyan-100 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Deep Cyan Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-cyan-950 border-r border-cyan-900 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shadow-lg shadow-amber-900/20">
            <Hammer className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-heading tracking-tight">YUSI Craft</h1>
            <p className="text-xs text-cyan-200/60 font-medium tracking-wider">優悉工坊 | 教學平台</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
          {isAdmin && (
            <div className="mb-6 pb-4 border-b border-cyan-800/50">
              <NavItem 
                icon={Settings2} 
                label="後台管理系統" 
                isActive={currentView === ViewState.ADMIN} 
                onClick={() => setView(ViewState.ADMIN)} 
                highlight={true}
              />
            </div>
          )}

          <NavItem 
            icon={LayoutDashboard} 
            label="總覽儀表板" 
            isActive={currentView === ViewState.DASHBOARD} 
            onClick={() => setView(ViewState.DASHBOARD)} 
          />
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest font-heading">教學管理</div>
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
          
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest font-heading">工坊管理</div>
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
          
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest font-heading">成果展示</div>
          <NavItem 
            icon={Images} 
            label="作品展示館" 
            isActive={currentView === ViewState.GALLERY} 
            onClick={() => setView(ViewState.GALLERY)} 
          />

          <div className="mt-8 pt-6 border-t border-cyan-800/50">
             <button
              onClick={() => setView(ViewState.ASSISTANT)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                currentView === ViewState.ASSISTANT 
                  ? 'bg-cyan-800/50 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-900/10' 
                  : 'text-cyan-200 border-cyan-800 hover:bg-cyan-800 hover:border-cyan-700'
              }`}
            >
              <Bot size={20} className={currentView === ViewState.ASSISTANT ? "text-amber-400" : "text-cyan-400 group-hover:text-amber-300 transition-colors"} />
              <div className="text-left">
                <span className="font-bold block font-heading">AI 學習小幫手</span>
                <span className="text-xs opacity-70">專題解惑 & 安全諮詢</span>
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0 bg-slate-50 relative">
        <header className="sticky top-0 z-0 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800 font-heading tracking-tight">
              {currentView === ViewState.DASHBOARD && '教室總覽'}
              {currentView === ViewState.COURSES && '課程管理'}
              {currentView === ViewState.PROJECTS && '專題製作追蹤'}
              {currentView === ViewState.INVENTORY && '庫存與設備預約'}
              {currentView === ViewState.SAFETY && '安全認證中心'}
              {currentView === ViewState.GALLERY && '作品展示館'}
              {currentView === ViewState.ASSISTANT && 'AI 學習小幫手'}
              {currentView === ViewState.ADMIN && '後台管理系統'}
            </h2>
            {isAdmin && currentView !== ViewState.ADMIN && (
              <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-1 rounded-full font-bold border border-rose-200 font-heading">
                管理者模式
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 text-slate-400 hover:text-cyan-600 transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              {isAdmin ? <Settings className="text-amber-500" size={20} /> : <Settings size={20} />}
            </button>
            <button className="relative p-2 text-slate-400 hover:text-cyan-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <img 
                src="https://picsum.photos/40/40" 
                alt="User" 
                className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
              />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-700 font-heading">{isAdmin ? '系統管理員' : '訪客/學生'}</p>
                <p className="text-xs text-slate-500">{isAdmin ? '完全存取權限' : '檢視權限'}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Settings / Login Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyan-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-heading">
                <Settings size={24} className="text-cyan-600" /> 系統設定
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {isAdmin ? (
               <div className="space-y-4">
                 <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-amber-100 p-2.5 rounded-full">
                      <Settings2 className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 font-heading">目前身分：管理員</p>
                      <p className="text-xs text-amber-600">您擁有完全控制權限</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { onLogout(); setIsSettingsOpen(false); }}
                   className="w-full py-3 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors font-heading"
                 >
                   <LogOut size={18} /> 登出管理員
                 </button>
               </div>
            ) : (
               <form onSubmit={handleLoginSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 font-heading">管理員登入</label>
                   <div className="relative">
                     <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                     <input 
                        type="password" 
                        placeholder="輸入管理員密碼 (admin)"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                     />
                   </div>
                   {loginError && <p className="text-xs text-rose-500 font-medium flex items-center gap-1"><ShieldAlert size={12}/> 密碼錯誤，請重試。</p>}
                 </div>
                 <button 
                   type="submit"
                   className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 font-heading"
                 >
                   登入後台
                 </button>
                 <p className="text-xs text-center text-slate-400 mt-2">
                   僅限授權教師使用
                 </p>
               </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};