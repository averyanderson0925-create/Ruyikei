import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../services/api';
import { removeToken } from '../services/authService';

const AddEntryPage = () => {
  const [entry, setEntry] = useState({
    phoneNumber: '',
    name: '',
    email: '',
    password: '',
    nationality: '',
    urls: [''],
    backupCode: '',
    remarks: '',
  });
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const handleChange = (key, value) => {
    setEntry((prev) => ({ ...prev, [key]: value }));
  };

  const handleUrlChange = (index, value) => {
    const urls = [...entry.urls];
    urls[index] = value;
    setEntry((prev) => ({ ...prev, urls }));
  };

  const addUrl = () => setEntry((prev) => ({ ...prev, urls: [...prev.urls, ''] }));
  const removeUrl = (index) => setEntry((prev) => ({ ...prev, urls: prev.urls.filter((_, idx) => idx !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/entries', entry);
      setToast({ message: 'Entry saved successfully', type: 'success' });
      setEntry({ phoneNumber: '', name: '', email: '', password: '', nationality: '', urls: [''], backupCode: '', remarks: '' });
    } catch (error) {
      setToast({ message: 'Unable to save entry', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 space-y-6">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-950">Add New Entry</h1>
              <p className="mt-2 text-sm text-slate-500">Create a new secure account record and save it to the vault.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Phone Number</span>
                  <input
                    value={entry.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Name</span>
                  <input
                    value={entry.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter name"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Email</span>
                  <input
                    type="email"
                    value={entry.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Password</span>
                  <input
                    type="password"
                    value={entry.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Nationality</span>
                  <input
                    value={entry.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    placeholder="Enter nationality"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  <span>Backup Code</span>
                  <input
                    value={entry.backupCode}
                    onChange={(e) => handleChange('backupCode', e.target.value)}
                    placeholder="Enter backup code"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>

              <div className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Registered URLs</p>
                  <button type="button" onClick={addUrl} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    + Add URL
                  </button>
                </div>
                <div className="space-y-3">
                  {entry.urls.map((url, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        placeholder="https://example.com"
                      />
                      <button
                        type="button"
                        onClick={() => removeUrl(index)}
                        className="rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Remarks</span>
                <textarea
                  value={entry.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  rows="4"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter remarks (optional)"
                />
              </label>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEntry({ phoneNumber: '', name: '', email: '', password: '', nationality: '', urls: [''], backupCode: '', remarks: '' })}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-105 disabled:opacity-70"
                >
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default AddEntryPage;
