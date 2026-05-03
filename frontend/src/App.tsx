import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderGit2, LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>PM</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Nexus</h2>
      </div>
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="nav-link" style={{ marginTop: 'auto', color: 'var(--danger)' }}>
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

function Layout({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  return (
    <div className="layout">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function Login({ setToken }: { setToken: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (showOtp) {
        await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        setShowOtp(false);
        setIsRegistering(false);
        alert('Verified! You can now login.');
      } else if (isRegistering) {
        await axios.post(`${API_URL}/auth/register`, { name, email, password, role: 'Member' });
        setShowOtp(true);
      } else {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
      if (err.response?.data?.detail === "Inactive user. Please verify OTP.") {
        setShowOtp(true);
      }
    }
  };

  return (
    <div className="login-container">
      {/* Left side: branding/visuals */}
      <div className="login-banner">
        <div className="banner-content animate-fade-in">
          <div className="logo-box">PM</div>
          <h1 className="banner-title">Nexus</h1>
          <p className="banner-subtitle">
            Orchestrate your workflow, track progress, and conquer your goals with the ultimate project management platform.
          </p>
          
          <div className="feature-list">
            <div className="feature-item">
              <CheckSquare size={20} className="feature-icon" />
              <span>Real-time Task Tracking</span>
            </div>
            <div className="feature-item">
              <FolderGit2 size={20} className="feature-icon" />
              <span>Intuitive Project Organization</span>
            </div>
          </div>
        </div>
        <div className="banner-overlay"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="login-form-container">
        <div className="glass-panel hoverable animate-fade-in" style={{ width: '100%', maxWidth: '420px', zIndex: 1, padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>
              {showOtp ? 'Verify OTP' : isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              {showOtp ? 'Check your email for the code.' : isRegistering ? 'Sign up to start managing your projects.' : 'Enter your credentials to access your account.'}
            </p>
          </div>

          {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!showOtp && isRegistering && (
              <div className="input-group">
                <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            {!showOtp && (
              <>
                <div className="input-group">
                  <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </>
            )}
            {showOtp && (
              <div className="input-group">
                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.25rem' }} />
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              {showOtp ? 'Verify & Continue' : isRegistering ? 'Register Now' : 'Sign In'}
            </button>
          </form>

          {!showOtp && (
            <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsRegistering(!isRegistering)} style={{ color: 'var(--accent)', fontWeight: '600', transition: 'color 0.2s' }}>
                {isRegistering ? 'Sign In' : 'Create One'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ total_tasks: 0, completed_tasks: 0, pending_tasks: 0, overdue_tasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="glass-panel stat-card hoverable">
          <div className="stat-icon" style={{ color: 'var(--primary)' }}><CheckSquare /></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tasks</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.total_tasks}</div>
          </div>
        </div>
        <div className="glass-panel stat-card hoverable">
          <div className="stat-icon" style={{ color: 'var(--success)' }}><CheckSquare /></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.completed_tasks}</div>
          </div>
        </div>
        <div className="glass-panel stat-card hoverable">
          <div className="stat-icon" style={{ color: 'var(--warning)' }}><CheckSquare /></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.pending_tasks}</div>
          </div>
        </div>
        <div className="glass-panel stat-card hoverable">
          <div className="stat-icon" style={{ color: 'var(--danger)' }}><CheckSquare /></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overdue</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.overdue_tasks}</div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel hoverable animate-fade-in-delayed">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderGit2 size={20} style={{ color: 'var(--primary)' }} /> Recent Activity
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show. Keep up the good work!</p>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Projects</h1>
        <button className="btn-primary">New Project</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map((p: any) => (
          <div key={p._id} className="glass-panel hoverable">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{p.description}</p>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Members: {p.members?.length || 0}</div>
          </div>
        ))}
        {projects.length === 0 && <p>No projects found.</p>}
      </div>
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase().replace(' ', '');
    return <span className={`badge ${lower}`}>{status}</span>;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tasks</h1>
        <button className="btn-primary">New Task</button>
      </div>
      <div className="glass-panel hoverable" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Deadline</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t: any) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{getStatusBadge(t.status)}</td>
                <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
