import React from 'react';
import {
    Users, MousePointer, Globe,
    DollarSign, TrendingUp, Filter, Zap,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

// --- Shared Components ---

const MetricSmall = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
    <div>
        <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded flex items-center justify-center ${color}`}>{icon}</div>
            <span className="text-xs text-gray-400 font-bold">{label}</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full w-full mb-1">
            <div className="h-full bg-white rounded-full w-[60%]" />
        </div>
        <span className="text-lg font-bold block">{value}</span>
    </div>
);

const PanelMetric = ({ title, value, color }: { title: string, value: string, color: string }) => (
    <div className="bg-[#1A1F37] p-5 rounded-2xl border border-gray-800/20 hover:border-blue-500/50 transition-colors">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <div className="flex items-center gap-2 mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs text-green-500 font-bold">+12%</span>
        </div>
    </div>
);

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// --- Home View ---

const metrics = [
    {
        title: "Cliques no Perfil",
        value: "1.240",
        change: "+15%",
        icon: <MousePointer size={20} className="text-white" />,
        color: "bg-blue-600"
    },
    {
        title: "Msg via ChatGPT",
        value: "85",
        change: "+40%",
        icon: <Zap size={20} className="text-white" />,
        color: "bg-blue-600"
    },
    {
        title: "Posição Google",
        value: "3º",
        change: "+2",
        icon: <Globe size={20} className="text-white" />,
        color: "bg-blue-600"
    },
    {
        title: "Leads Totais",
        value: "450",
        change: "+12%",
        icon: <Users size={20} className="text-white" />,
        color: "bg-blue-600"
    }
];

export const DashboardHome = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Top Metrics Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-[#1A1F37] p-5 rounded-2xl flex items-center justify-between shadow-lg border border-gray-800/20 hover:scale-[1.02] transition-transform duration-300">
                        <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">{metric.title}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-bold text-xl">{metric.value}</span>
                                <span className={metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500' + " text-sm font-bold"}>
                                    {metric.change}
                                </span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center shadow-lg shadow-blue-900/20`}>
                            {metric.icon}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Second Row: Welcome, Satisfaction, Referral */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">

                {/* Welcome Card */}
                <div className="lg:col-span-4 bg-[#1A1F37] rounded-2xl p-6 relative overflow-hidden group border border-gray-800/20">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Bem-vindo de volta,</p>
                            <h2 className="text-3xl font-bold mb-2">Mark Johnson</h2>
                            <p className="text-gray-400 text-sm max-w-[200px]">Bom ver você novamente! Pergunte-me qualquer coisa.</p>
                        </div>
                        <button
                            className="flex items-center gap-2 text-white text-sm mt-8 hover:gap-3 transition-all cursor-pointer"
                            onClick={() => alert("Recurso de gravação em desenvolvimento!")}
                        >
                            Toque para gravar <span className="text-lg">→</span>
                        </button>
                    </div>
                    {/* Profile Image */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-100 group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1A1F37]" />
                        <img src="/mark-johnson.jpg"
                            alt="Mark Johnson"
                            className="w-full h-full object-cover object-center mix-blend-normal"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=1000' }}
                        />
                    </div>
                </div>

                {/* Reputation ChatGPT */}
                <div className="lg:col-span-3 bg-[#1A1F37] rounded-2xl p-6 relative border border-gray-800/20">
                    <div className="flex justify-between items-start mb-8">
                        <h3 className="font-bold text-lg">Reputação dentro do ChatGPT</h3>
                        <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
                            <Zap size={20} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center relative py-4">
                        {/* Central Score */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Outer Glow */}
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[40px]" />

                            {/* Circle Ring */}
                            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="283" strokeDashoffset="20" strokeLinecap="round" />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-black text-white">9.8</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Excelência</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400 max-w-[200px] leading-relaxed">
                                Sua clínica é citada como <strong className="text-white">referência top 3</strong> na região.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Third Row: Charts */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Sales Overview Grid */}
                <div className="lg:col-span-3 bg-[#1A1F37] rounded-2xl p-6 border border-gray-800/20">
                    <h3 className="font-bold text-lg mb-1">Evolução do Posicionamento</h3>
                    <p className="text-sm text-gray-400 mb-6 font-bold">
                        <span className="text-green-500">(+2 posições)</span> em 2024
                    </p>

                    <div className="h-64 relative flex items-end justify-between px-2 gap-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    { name: 'Jan', value: 200 }, { name: 'Fev', value: 180 }, { name: 'Mar', value: 160 },
                                    { name: 'Abr', value: 140 }, { name: 'Mai', value: 120 }, { name: 'Jun', value: 100 },
                                    { name: 'Jul', value: 80 }, { name: 'Ago', value: 60 }, { name: 'Set', value: 40 },
                                    { name: 'Out', value: 20 }, { name: 'Nov', value: 10 }, { name: 'Dez', value: 5 },
                                ]}
                                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2D60FF" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2D60FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#A0AEC0"
                                    tick={{ fill: '#A0AEC0', fontSize: 12, fontWeight: 'bold' }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={0}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F1214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#2D60FF', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2D60FF"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Removed static Months X-Axis as Recharts handles it */}
                </div>

                {/* Active Users Bar Chart */}
                <div className="lg:col-span-2 bg-[#1A1F37] rounded-2xl p-6 border border-gray-800/20">
                    <div className="h-40 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: 'Google', value: 65, color: '#2563EB' }, // blue-600
                                    { name: 'Direto', value: 15, color: '#2563EB' },
                                    { name: 'ChatGPT', value: 12, color: '#F97316' }, // orange-500
                                    { name: 'Outros', value: 8, color: '#3B82F6' }, // blue-500
                                    { name: 'Ref', value: 20, color: '#fff' }, // filler
                                    { name: 'Ads', value: 45, color: '#fff' },
                                    { name: 'Social', value: 30, color: '#fff' },
                                    { name: 'Email', value: 55, color: '#fff' },
                                ]}
                            >
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0F1214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={8}>
                                    { /* Custom Cell coloring if we want to vary per bar */}
                                    {[
                                        { name: 'Google', value: 65, color: '#fff' },
                                        { name: 'Direto', value: 15, color: '#fff' },
                                        { name: 'ChatGPT', value: 12, color: '#fff' },
                                        { name: 'Outros', value: 8, color: '#fff' },
                                        { name: 'Ref', value: 20, color: '#fff' },
                                        { name: 'Ads', value: 45, color: '#fff' },
                                        { name: 'Social', value: 30, color: '#fff' },
                                        { name: 'Email', value: 55, color: '#fff' },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <h3 className="font-bold text-lg mb-1">Origem do Tráfego</h3>
                    <p className="text-sm text-gray-400 mb-6 font-bold">
                        <span className="text-green-500">(+23%)</span> vs mês anterior
                    </p>

                    <div className="grid grid-cols-4 gap-4">
                        <MetricSmall icon={<Users size={12} />} label="Google" value="65%" color="bg-blue-600" />
                        <MetricSmall icon={<MousePointer size={12} />} label="Direto" value="15%" color="bg-blue-600" />
                        <MetricSmall icon={<Zap size={12} />} label="ChatGPT" value="12%" color="bg-orange-500" />
                        <MetricSmall icon={<Filter size={12} />} label="Outros" value="8%" color="bg-blue-500" />
                    </div>
                </div>
            </motion.div>

            {/* Bottom Row: Additional Metrics requested by User */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
                <PanelMetric title="Cliques" value="12,543" color="text-blue-500" />
                <PanelMetric title="Alcance" value="45,000" color="text-purple-500" />
                <PanelMetric title="Pesquisas" value="8,900" color="text-pink-500" />
                <PanelMetric title="Search Google" value="3,200" color="text-green-500" />
                <PanelMetric title="CPC Médio" value="R$ 1,25" color="text-orange-500" />
            </motion.div>
        </motion.div>
    );
};

// --- Tables View ---

export const TablesView = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="bg-[#1A1F37] p-6 rounded-2xl border border-gray-800/20">
                <h3 className="font-bold text-lg mb-4">Tabela de Clientes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-xs text-left uppercase border-b border-gray-700">
                                <th className="pb-3 pl-4">Cliente</th>
                                <th className="pb-3">Função</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Entrada</th>
                                <th className="pb-3">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                                            MJ
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Mark Johnson</p>
                                            <p className="text-xs text-gray-500">mark@email.com</p>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <p className="font-bold text-sm">Manager</p>
                                        <p className="text-xs text-gray-500">Organization</p>
                                    </td>
                                    <td className="py-4">
                                        <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-md font-bold">Online</span>
                                    </td>
                                    <td className="py-4 text-sm font-bold text-gray-400">24/01/24</td>
                                    <td className="py-4 text-gray-400 text-sm cursor-pointer hover:text-white">Editar</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

// --- Billing View ---

export const BillingView = () => {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card Wrapper */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 relative overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all">
                        <div className="flex justify-between items-start mb-12">
                            <h3 className="font-bold text-xl">Vision UI</h3>
                            <div className="w-8 h-8 flex items-center justify-center">
                                <Zap className="text-white" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="font-mono text-xl tracking-widest mb-2">4562   1122   4594   7852</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Titular</p>
                                <p className="font-bold text-sm">Mark Johnson</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Expira em</p>
                                <p className="font-bold text-sm">11/25</p>
                            </div>
                            <div className="w-10">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-red-500/80"></div>
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/80"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#1A1F37] rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-800/20 hover:border-blue-500/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
                                <DollarSign className="text-blue-500" />
                            </div>
                            <p className="font-bold text-lg mb-1">Salário</p>
                            <p className="text-xs text-gray-400">Pertence a Interactive</p>
                            <div className="w-full border-t border-gray-700 my-4" />
                            <p className="font-bold text-xl">+$2000</p>
                        </div>
                        <div className="bg-[#1A1F37] rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-800/20 hover:border-blue-500/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
                                <Zap className="text-blue-500" />
                            </div>
                            <p className="font-bold text-lg mb-1">Paypal</p>
                            <p className="text-xs text-gray-400">Pagamento Freelance</p>
                            <div className="w-full border-t border-gray-700 my-4" />
                            <p className="font-bold text-xl">$455.00</p>
                        </div>
                    </div>
                </div>

                {/* Invoices */}
                <div className="bg-[#1A1F37] p-6 rounded-2xl border border-gray-800/20">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Faturas</h3>
                        <button className="bg-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition">VER TODAS</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { date: "Março, 01, 2024", id: "#MS-415646", price: "$180", color: "text-white" },
                            { date: "Fev, 10, 2024", id: "#RV-126749", price: "$250", color: "text-white" },
                            { date: "Abril, 05, 2024", id: "#FB-212562", price: "$560", color: "text-white" },
                            { date: "Jun, 25, 2024", id: "#QW-103578", price: "$120", color: "text-white" },
                            { date: "Março, 01, 2023", id: "#AR-803481", price: "$300", color: "text-gray-500" },
                        ].map((inv, i) => (
                            <div key={i} className="flex justify-between items-center bg-transparent p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="font-bold text-sm block">{inv.date}</p>
                                    <p className="text-xs text-gray-500">{inv.id}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold ${inv.color}`}>{inv.price}</span>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs cursor-pointer hover:text-white">
                                        <FileText size={14} /> PDF
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Profile View ---

export const ProfileView = () => {
    const [emailNotify, setEmailNotify] = React.useState(true);
    const [newLaunches, setNewLaunches] = React.useState(false);

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <div className="relative h-40 bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl overflow-hidden mb-16">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549488497-2965ae13dc1b?q=80&w=1000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
            </div>

            <div className="relative px-6 -mt-24 mb-6">
                <div className="bg-[#1A1F37]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                        <img src="/mark-johnson.jpg" className="w-full h-full object-cover rounded-xl bg-[#0F1214]" alt="Profile"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=1000' }}
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold">Mark Johnson</h3>
                        <p className="text-gray-400 text-sm">CEO / Co-Founder</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Platform Settings */}
                <div className="bg-[#1A1F37] p-6 rounded-2xl border border-gray-800/20">
                    <h3 className="font-bold text-lg mb-6">Configurações da Plataforma</h3>
                    <div className="space-y-6">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase mb-4">Conta</p>
                            <div className="space-y-4">
                                <div
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setEmailNotify(!emailNotify)}
                                >
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${emailNotify ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${emailNotify ? 'right-1' : 'left-1'}`} />
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Notificar por email</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setNewLaunches(!newLaunches)}
                                >
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${newLaunches ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${newLaunches ? 'right-1' : 'left-1'}`} />
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Novos lançamentos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="lg:col-span-1 bg-[#1A1F37] p-6 rounded-2xl border border-gray-800/20">
                    <h3 className="font-bold text-lg mb-4">Informações do Perfil</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Olá, sou Mark Johnson, Decisões: se você não consegue decidir, a resposta é não. Se dois caminhos igualmente difíceis, escolha o mais doloroso no curto prazo (evitar a dor cria uma ilusão de igualdade).
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <strong className="text-sm text-white">Nome Completo:</strong>
                            <span className="text-sm text-gray-400">Mark Johnson</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-sm text-white">Celular:</strong>
                            <span className="text-sm text-gray-400">(44) 123 1234 123</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-sm text-white">Email:</strong>
                            <span className="text-sm text-gray-400">mark@avestra.app</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-sm text-white">Localização:</strong>
                            <span className="text-sm text-gray-400">Brasil</span>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div className="bg-[#1A1F37] p-6 rounded-2xl border border-gray-800/20">
                    <h3 className="font-bold text-lg mb-2">Projetos</h3>
                    <p className="text-sm text-gray-400 mb-6">Arquitetos projetam casas</p>

                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => alert(`Visualizando projeto #${i}`)}>
                                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                                    <FileText className="text-blue-500" size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Design System Moderno</h4>
                                    <p className="text-xs text-gray-400">Projeto #1</p>
                                </div>
                                <button className="text-gray-400 hover:text-white text-xs font-bold uppercase">Ver</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
