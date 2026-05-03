import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderGit2, LogOut, Plus, X, Users, Mail, Lock, User, ShieldCheck, Key } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/team', label: 'Team Directory', icon: Users, adminOnly: true },
  ];

  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : 'Member';
  const email = token ? JSON.parse(atob(token.split('.')[1])).sub : '';

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>NX</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Nexus</h2>
      </div>
      <nav style={{ flex: 1, marginBottom: '2rem' }}>
        {navItems.filter(item => !item.adminOnly || role === 'Admin').map((item) => (
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
      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600' }} className="truncate" title={email}>{email}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem', fontWeight: '500' }}>{role} Role</div>
      </div>
      <button onClick={onLogout} className="nav-link" style={{ color: 'var(--danger)', width: '100%' }}>
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
  const [role, setRole] = useState('Member');
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
        await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
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
      if (err.response?.data?.detail) {
        // FastAPI might return an array of validation errors for 422
        if (Array.isArray(err.response.data.detail)) {
          setError(err.response.data.detail[0].msg);
        } else {
          setError(err.response.data.detail);
        }
      } else if (!err.response || err.message === 'Network Error') {
        setError('Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError(err.message || 'An error occurred');
      }

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
          <div className="logo-box">NX</div>
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
        <div className="glass-panel login-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', zIndex: 1, padding: '3rem 2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(217, 70, 239, 0.2))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={32} style={{ color: 'var(--text-primary)' }} />
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
              {showOtp ? 'Verify Access' : isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {showOtp ? 'Check your email for the verification code.' : isRegistering ? 'Sign up to start orchestrating your workflow.' : 'Enter your credentials to securely access your workspace.'}
            </p>
          </div>

          {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.875rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', fontWeight: '500' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!showOtp && isRegistering && (
              <>
                <div className="input-group relative">
                  <div className="input-icon-wrapper"><User size={18} /></div>
                  <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="premium-input with-icon" />
                </div>
                <div className="input-group relative">
                  <div className="input-icon-wrapper"><ShieldCheck size={18} /></div>
                  <select value={role} onChange={e => setRole(e.target.value)} required className="premium-input with-icon">
                    <option value="Member">Member Role</option>
                    <option value="Admin">Admin Role</option>
                  </select>
                </div>
              </>
            )}
            {!showOtp && (
              <>
                <div className="input-group relative">
                  <div className="input-icon-wrapper"><Mail size={18} /></div>
                  <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="premium-input with-icon" />
                </div>
                <div className="input-group relative">
                  <div className="input-icon-wrapper"><Lock size={18} /></div>
                  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="premium-input with-icon" />
                </div>
              </>
            )}
            {showOtp && (
              <div className="input-group relative">
                <div className="input-icon-wrapper"><Key size={18} /></div>
                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} required className="premium-input with-icon" style={{ letterSpacing: '0.2em', fontWeight: 'bold' }} />
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem', padding: '1.1rem', fontSize: '1.1rem', borderRadius: '0.75rem', width: '100%', boxShadow: '0 8px 20px -6px var(--primary-glow)' }}>
              {showOtp ? 'Verify & Continue' : isRegistering ? 'Register Now' : 'Secure Login'}
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
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : 'Member';

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/projects/`, newProject, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProjects([...projects, res.data] as any);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create project');
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Projects</h1>
        {role === 'Admin' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Project
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {projects.map((p: any) => (
          <div key={p._id} className="glass-panel hoverable" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="card-gradient-top"></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '0.75rem', color: 'var(--primary)' }}>
                <FolderGit2 size={24} />
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>Active</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>{p.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                   <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', border: '2px solid var(--surface-color)' }}>
                     {p.members?.length || 0}
                   </div>
                 </div>
                 Members
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed var(--border)' }}>
            <FolderGit2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--text-secondary)' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No projects yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Create a new project to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative', overflow: 'hidden' }}>
            <div className="card-gradient-top"></div>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', opacity: 0.5 }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Create Project</h2>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
              <input type="text" placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required className="premium-input" />
              <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required rows={3} className="premium-input"></textarea>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem' }}>Launch Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', project_id: '', assigned_to: '', deadline: '' });

  const token = localStorage.getItem('token');
  const role = token ? JSON.parse(atob(token.split('.')[1])).role : 'Member';

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

  useEffect(() => {
    fetchTasks();
    if (role === 'Admin') {
      axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setProjects(res.data)).catch(console.error);

      axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => setUsers(res.data)).catch(console.error);
    }
  }, [role]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks/`, {
        ...newTask,
        deadline: new Date(newTask.deadline).toISOString()
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowModal(false);
      setNewTask({ title: '', description: '', project_id: '', assigned_to: '', deadline: '' });
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string, task: any) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        deadline: task.deadline
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTasks();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase().replace(' ', '');
    return <span className={`badge ${lower}`}>{status}</span>;
  }

  return (
    <div className="animate-fade-in relative">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Tasks</h1>
        {role === 'Admin' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Task
          </button>
        )}
      </div>
      <div className="glass-panel hoverable" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t: any) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{getStatusBadge(t.status)}</td>
                <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className="status-select-wrapper">
                    <select 
                      value={t.status} 
                      onChange={e => handleUpdateStatus(t._id, e.target.value, t)}
                      className="status-select"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No tasks found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative', overflow: 'hidden' }}>
            <div className="card-gradient-top"></div>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', opacity: 0.5 }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Create Task</h2>
              <button onClick={() => setShowModal(false)} className="close-btn"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
              <input type="text" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required className="premium-input" />
              <textarea placeholder="Detailed Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} required rows={3} className="premium-input"></textarea>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <select value={newTask.project_id} onChange={e => setNewTask({...newTask, project_id: e.target.value})} required className="premium-input">
                  <option value="" disabled>Select Project</option>
                  {projects.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <select value={newTask.assigned_to} onChange={e => setNewTask({...newTask, assigned_to: e.target.value})} required className="premium-input">
                  <option value="" disabled>Assign To</option>
                  {users.map((u: any) => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div className="premium-input-group">
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Deadline</label>
                <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} required className="premium-input" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem' }}>Deploy Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Team() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="animate-fade-in relative">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Team Directory</h1>
      </div>
      <div className="glass-panel hoverable" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge" style={{ background: u.role === 'Admin' ? 'rgba(217, 70, 239, 0.1)' : 'rgba(79, 70, 229, 0.1)', color: u.role === 'Admin' ? 'var(--accent)' : 'var(--primary)', borderColor: u.role === 'Admin' ? 'rgba(217, 70, 239, 0.2)' : 'rgba(79, 70, 229, 0.2)' }}>
                    {u.role}
                  </span>
                </td>
                <td><span className="badge completed">Active</span></td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</td></tr>
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

  const role = token ? JSON.parse(atob(token.split('.')[1])).role : 'Member';

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
          <Route path="/team" element={role === 'Admin' ? <Team /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
