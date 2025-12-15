import { Link, Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const location = useLocation();

  const isLoginPage = location.pathname == '/login' || location.pathname == '/';

  return (
    <div className="min-h-screen flex">
      {!isLoginPage && (
        <nav className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold mb-4">Asset Management</h1>
          <ul>
            <li className="mb-2"><Link to="/dashboard">Dashboard</Link></li>
            <li className="mb-2"><Link to="/purchases">Purchases</Link></li>
            <li className="mb-2"><Link to="/transfers">Transfers</Link></li>
            <li className="mb-2"><Link to="/assignments">Assignments</Link></li>
          </ul>
        </nav>
      )}
      <main className="flex-1 p-6 bg-gray-100">
        {!isLoginPage && <Navbar />}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
