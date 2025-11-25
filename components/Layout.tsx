
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
  Settings2,
  Megaphone
} from 'lucide-react';
import { ViewState, Announcement } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  notifications: Announcement[]; // Kept for dashboard usage
  systemMessage: string; // New prop for the single system alert
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
        ? (highlight ? 'bg-amber-400 text-cyan-900 shadow-lg shadow-amber-400/40' : 'bg-amber-400 text-cyan-900 shadow-lg shadow-amber-400/30')
        : 'text-cyan-50 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  setView, 
  children, 
  isAdmin, 
  onLogin, 
  onLogout, 
  notifications,
  systemMessage 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSystemMessageOpen, setIsSystemMessageOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Helper to close mobile menu on navigation
  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

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
      <div className="md:hidden fixed top-0 w-full bg-cyan-600 text-white z-40 border-b border-cyan-500 p-4 flex justify-between items-center shadow-md">
        <button 
          onClick={() => handleNavClick(ViewState.DASHBOARD)}
          className="flex items-center gap-2 font-bold text-xl font-heading hover:opacity-90 transition-opacity focus:outline-none"
        >
          <Hammer className="text-amber-300" /> YUSI Craft
        </button>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-cyan-50 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Brighter Cyan Theme */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-cyan-700 border-r border-cyan-600 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <div 
          onClick={() => handleNavClick(ViewState.DASHBOARD)}
          className="p-6 flex items-center gap-3 cursor-pointer hover:bg-cyan-600/50 transition-colors group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick(ViewState.DASHBOARD); }}
        >
          <div className="bg-gradient-to-br from-amber-300 to-amber-500 p-2.5 rounded-xl shadow-lg shadow-amber-900/10 group-hover:scale-105 transition-transform">
            <Hammer className="text-cyan-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-heading tracking-tight">YUSI Craft</h1>
            <p className="text-xs text-cyan-100 font-medium tracking-wider">優悉工坊 | 教學平台</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
          {isAdmin && (
            <div className="mb-6 pb-4 border-b border-cyan-500/30">
              <NavItem 
                icon={Settings2} 
                label="後台管理系統" 
                isActive={currentView === ViewState.ADMIN} 
                onClick={() => handleNavClick(ViewState.ADMIN)} 
                highlight={true}
              />
            </div>
          )}

          <NavItem 
            icon={LayoutDashboard} 
            label="總覽儀表板" 
            isActive={currentView === ViewState.DASHBOARD} 
            onClick={() => handleNavClick(ViewState.DASHBOARD)} 
          />
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-200 uppercase tracking-widest font-heading">教學管理</div>
          <NavItem 
            icon={BookOpen} 
            label="課程與教材" 
            isActive={currentView === ViewState.COURSES} 
            onClick={() => handleNavClick(ViewState.COURSES)} 
          />
          <NavItem 
            icon={Hammer} 
            label="專題製作管理" 
            isActive={currentView === ViewState.PROJECTS} 
            onClick={() => handleNavClick(ViewState.PROJECTS)} 
          />
          
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-200 uppercase tracking-widest font-heading">工坊管理</div>
          <NavItem 
            icon={Box} 
            label="設備與庫存" 
            isActive={currentView === ViewState.INVENTORY} 
            onClick={() => handleNavClick(ViewState.INVENTORY)} 
          />
          <NavItem 
            icon={ShieldAlert} 
            label="安全與紀律" 
            isActive={currentView === ViewState.SAFETY} 
            onClick={() => handleNavClick(ViewState.SAFETY)} 
          />
          
          <div className="pt-6 pb-3 px-4 text-[10px] font-bold text-cyan-200 uppercase tracking-widest font-heading">成果展示</div>
          <NavItem 
            icon={Images} 
            label="作品展示館" 
            isActive={currentView === ViewState.GALLERY} 
            onClick={() => handleNavClick(ViewState.GALLERY)} 
          />

          <div className="mt-8 pt-6 border-t border-cyan-500/30">
             <button
              onClick={() => handleNavClick(ViewState.ASSISTANT)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                currentView === ViewState.ASSISTANT 
                  ? 'bg-white/10 text-amber-300 border-amber-300/50 shadow-lg shadow-amber-900/10' 
                  : 'text-cyan-100 border-cyan-500/30 hover:bg-white/10 hover:border-cyan-400/50'
              }`}
            >
              <Bot size={20} className={currentView === ViewState.ASSISTANT ? "text-amber-300" : "text-cyan-200 group-hover:text-amber-300 transition-colors"} />
              <div className="text-left">
                <span className="font-bold block font-heading">AI 學習小幫手</span>
                <span className="text-xs opacity-80">專題解惑 & 安全諮詢</span>
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0 bg-slate-50 relative">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
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
            
            {/* Notification Bell Trigger */}
            <button 
              className="relative p-2 text-slate-400 hover:text-cyan-600 transition-colors"
              onClick={() => setIsSystemMessageOpen(true)}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
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

      {/* System Message Modal (Notification Center) */}
      {isSystemMessageOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-300 border border-white/40">
            <button 
              onClick={() => setIsSystemMessageOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Megaphone className="w-8 h-8 text-amber-600" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800 font-heading mb-2">重要系統公告</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">System Notification</p>
               
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 w-full mb-6">
                 <p className="text-lg text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                   {systemMessage}
                 </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings / Login Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-cyan-900/20 backdrop-blur-sm p-4">
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
                   className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 font-heading"
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
