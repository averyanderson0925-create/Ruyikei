import { useCallback, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../services/api';
import { removeToken } from '../services/authService';

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [nationality, setNationality] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showUrls, setShowUrls] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/entries', {
        params: { search, nationality, page, limit: 10 },
      });
      setEntries(response.data.entries);
      setPagination(response.data.pagination);
    } catch (error) {
      setToast({ message: 'Unable to load entries', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, nationality, page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast({ message: `${label} copied!`, type: 'success' });
    } catch {
      setToast({ message: 'Copy failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 space-y-6">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-950">All Entries</h1>
                <p className="mt-2 text-sm text-slate-500">Search by name, email, phone or filter by nationality.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FiSearch className="h-5 w-5 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                    placeholder="Search by name, email, or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  <option value="">All countries</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Spain">Spain</option>
                  <option value="China">China</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[32px] border border-slate-200 bg-slate-50">
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Name</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Email</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Password</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Phone</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Nationality</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">URLs</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Backup Code</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Remarks</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(loading ? Array.from({ length: 4 }) : entries).map((entry, index) => (
                    <tr key={entry?.id ?? index} className="bg-white transition hover:bg-blue-50/40">
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">{entry?.name ?? 'Loading...'}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span>{entry?.email ?? 'Loading...'}</span>
                          {entry && (
                            <button
                              onClick={() => handleCopy(entry.email, 'Email')}
                              className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                            >
                              📋
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span>********</span>
                          {entry && (
                            <>
                              <button className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200">👁</button>
                              <button
                                onClick={() => handleCopy(entry.password, 'Password')}
                                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                              >
                                📋
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">{entry?.phoneNumber ?? 'Loading...'}</td>
                      <td className="whitespace-nowrap px-4 py-4">{entry?.nationality ?? 'Loading...'}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        {entry ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setShowUrls(true);
                            }}
                            className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-600"
                          >
                            View URLs
                          </button>
                        ) : (
                          'Loading...'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span>{entry?.backupCode ?? 'Loading...'}</span>
                          {entry && (
                            <button
                              onClick={() => handleCopy(entry.backupCode, 'Backup code')}
                              className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                            >
                              📋
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">{entry?.remarks ?? 'Loading...'}</td>
                      <td className="px-4 py-4 space-x-2 text-sm">
                        <button className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200">View</button>
                        <button className="rounded-2xl bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700">Edit</button>
                        <button className="rounded-2xl bg-rose-500 px-3 py-2 text-white transition hover:bg-rose-600">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Showing {entries.length} of {pagination.total ?? 0} entries</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  disabled={page >= (pagination.pages || 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal open={showUrls} title="Registered URLs" onClose={() => setShowUrls(false)}>
        <div className="space-y-3">
          {selectedEntry?.urls?.length ? (
            selectedEntry.urls.map((url) => (
              <div key={url} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900">{url}</div>
            ))
          ) : (
            <p className="text-slate-500">No URLs available.</p>
          )}
        </div>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default EntriesPage;
