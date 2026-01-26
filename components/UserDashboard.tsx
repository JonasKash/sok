import React, { useState } from 'react';
import {
    Home, BarChart2, Users, Search,
    Settings, LogOut, Globe, MousePointer,
    DollarSign, Bell, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardHome, TablesView, BillingView, ProfileView } from './DashboardViews';

interface UserDashboardProps {
    onLogout?: () => void;
}

type ViewType = 'home' | 'tables' | 'billing' | 'profile';

export const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeView, setActiveView] = useState<ViewType>('home');

    const handleViewChange = (view: ViewType) => {
        setActiveView(view);
        setIsMobileMenuOpen(false); // Close mobile menu on navigate
    };

    const getViewTitle = () => {
        switch (activeView) {
            case 'home': return 'Início';
            case 'tables': return 'Tabelas';
            case 'billing': return 'Faturamento';
            case 'profile': return 'Perfil';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="flex h-screen bg-[#0F1214] text-white font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col p-4 bg-[#0F1214] transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-800/20`}>
                <div className="flex items-center justify-between px-4 py-6 mb-6 border-b border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">V</div>
                        <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">VISION UI</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem
                        icon={<Home size={18} />}
                        label="Início"
                        active={activeView === 'home'}
                        onClick={() => handleViewChange('home')}
                    />
                    <NavItem
                        icon={<BarChart2 size={18} />}
                        label="Tabelas"
                        active={activeView === 'tables'}
                        onClick={() => handleViewChange('tables')}
                    />
                    <NavItem
                        icon={<DollarSign size={18} />}
                        label="Faturamento"
                        active={activeView === 'billing'}
                        onClick={() => handleViewChange('billing')}
                    />
                    {/* Placeholder for Settings - can implement view later if needed */}
                    <NavItem
                        icon={<Settings size={18} />}
                        label="Configurações"
                        active={activeView === 'profile'} // Using profile for now or could be separate
                        onClick={() => handleViewChange('profile')}
                    />

                    <div className="mt-8 mb-2 px-4 text-xs font-bold text-gray-500 uppercase">Minha Conta</div>
                    <NavItem
                        icon={<Users size={18} />}
                        label="Perfil"
                        active={activeView === 'profile'}
                        onClick={() => handleViewChange('profile')}
                    />
                    <NavItem
                        icon={<LogOut size={18} />}
                        label="Sair"
                        onClick={onLogout}
                    />
                </nav>

                <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-shadow duration-300">
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                            <span className="text-lg font-bold">?</span>
                        </div>
                        <h4 className="font-bold mb-1">Precisa de ajuda?</h4>
                        <p className="text-xs text-blue-100 mb-3">Confira nossa documentação</p>
                        <button className="w-full py-2 bg-white text-blue-900 rounded-lg text-xs font-bold uppercase hover:bg-gray-100 transition-colors shadow-lg">
                            DOCUMENTAÇÃO
                        </button>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/20 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0F1214]">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Top Navbar */}
                <header className="h-20 px-6 flex items-center justify-between z-10 backdrop-blur-md bg-[#0F1214]/50 sticky top-0 border-b border-gray-800/10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-sm flex items-center gap-1">Páginas / <span className="text-white">{getViewTitle()}</span></span>
                            <h1 className="font-bold text-lg">{getViewTitle()}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                className="bg-[#1A1F37] border border-gray-700/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48 transition-all hover:border-gray-600"
                            />
                        </div>

                        <button
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold hover:bg-white/5 px-3 py-2 rounded-lg"
                            onClick={onLogout}
                        >
                            <Users size={16} />
                            <span className="hidden sm:inline">Sair</span>
                        </button>

                        <button
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                            onClick={() => handleViewChange('profile')}
                            title="Configurações"
                        >
                            <Settings size={16} />
                        </button>

                        <button
                            className="text-gray-400 hover:text-white transition-colors relative p-2 hover:bg-white/5 rounded-lg"
                            onClick={() => alert("Você não tem novas notificações.")}
                            title="Notificações"
                        >
                            <Bell size={16} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F1214]" />
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar scroll-smooth">
                    <AnimatePresence mode="wait">
                        {activeView === 'home' && <DashboardHome key="home" />}
                        {activeView === 'tables' && <TablesView key="tables" />}
                        {activeView === 'billing' && <BillingView key="billing" />}
                        {activeView === 'profile' && <ProfileView key="profile" />}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// --- Helper Components ---

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
            ${active
                ? 'bg-[#1A1F37] text-white shadow-lg border border-gray-700/50'
                : 'text-gray-400 hover:text-white hover:bg-white/5'}
        `}
    >
        <div className={`
            p-2 rounded-lg transition-colors
            ${active ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-[#1A1F37] group-hover:bg-[#252945]'}
        `}>
            {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
    </div>
);
