import { Home, Search, PlusSquare, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <aside className="h-screen w-64 bg-white border-r p-6 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-blue-600 mb-10">ConnectHub</h1>
        <nav className="flex flex-col gap-6">
          <NavItem icon={<Home size={20} />} label="Home" />
          <NavItem icon={<Search size={20} />} label="Search" />
          <NavItem icon={<PlusSquare size={20} />} label="Create" />
          <NavItem icon={<Bell size={20} />} label="Notifications" />
          <NavItem icon={<User size={20} />} label="Profile" />
        </nav>
      </div>
      <div>
        <span className="text-sm text-gray-500">© 2025 ConnectHub</span>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer">
    {icon}
    <span>{label}</span>
  </div>
);

export default Navbar;
