import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch, FiEye, FiEyeOff } from 'react-icons/fi';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../services/api';
import { removeToken } from '../services/authService';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde',
  'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Republic of the',
  'Congo, Democratic Republic of the', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark',
  'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini',
  'Ethiopia', 'Fiji', 'Finland', 'France', 'French Polynesia', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Kosovo'
];

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('urls');
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [search, setSearch] = useState('');
  const [nationality, setNationality] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
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

  const togglePasswordVisibility = (id) => {
    setVisiblePasswordId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmed) return;
    setLoading(true);
    try {
      await api.delete(`/entries/${id}`);
      setToast({ message: 'Entry deleted successfully', type: 'success' });
      fetchEntries();
    } catch (error) {
      setToast({ message: 'Unable to delete entry', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openUrlModal = (entry) => {
    setSelectedEntry(entry);
    setModalMode('urls');
    setShowModal(true);
  };

  const openEditModal = (entry) => {
    setSelectedEntry(entry);
    setEditEntry({ ...entry });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleEditChange = (key, value) => {
    setEditEntry((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditUrlChange = (index, value) => {
    setEditEntry((prev) => {
      const urls = [...(prev.urls || [])];
      urls[index] = value;
      return { ...prev, urls };
    });
  };

  const addEditUrl = () => {
    setEditEntry((prev) => ({ ...prev, urls: [...(prev.urls || []), ''] }));
  };

  const removeEditUrl = (index) => {
    setEditEntry((prev) => ({ ...prev, urls: prev.urls.filter((_, idx) => idx !== index) }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editEntry?.id) return;
    setLoading(true);
    try {
      await api.put(`/entries/${editEntry.id}`, editEntry);
      setToast({ message: 'Entry updated successfully', type: 'success' });
      setShowModal(false);
      fetchEntries();
    } catch (error) {
      setToast({ message: 'Unable to update entry', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const memoizedCountryOptions = useMemo(
    () => countries.map((country) => ({ label: country, value: country })),
    []
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex flex-col gap-6 xl:flex-row xl:max-w-[1600px]">
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
                  {memoizedCountryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
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
                          <span>{visiblePasswordId === entry?.id ? entry?.password : '********'}</span>
                          {entry && (
                            <>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(entry.id)}
                                className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200"
                              >
                                {visiblePasswordId === entry.id ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                              </button>
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
                            onClick={() => openUrlModal(entry)}
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
                        <button
                          type="button"
                          onClick={() => openUrlModal(entry)}
                          className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(entry)}
                          className="rounded-2xl bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-white transition hover:bg-rose-600"
                        >
                          Delete
                        </button>
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

      <Modal open={showModal} title={modalMode === 'edit' ? 'Edit Entry' : 'Registered URLs'} onClose={() => setShowModal(false)}>
        {modalMode === 'edit' ? (
          <form className="space-y-5" onSubmit={handleUpdate}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Name</span>
                <input
                  value={editEntry?.name || ''}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Email</span>
                <input
                  value={editEntry?.email || ''}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Phone</span>
                <input
                  value={editEntry?.phoneNumber || ''}
                  onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Nationality</span>
                <select
                  value={editEntry?.nationality || ''}
                  onChange={(e) => handleEditChange('nationality', e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
                >
                  <option value="">Select country</option>
                  {memoizedCountryOptions.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Backup Code</span>
              <input
                value={editEntry?.backupCode || ''}
                onChange={(e) => handleEditChange('backupCode', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <div className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Registered URLs</p>
                <button
                  type="button"
                  onClick={addEditUrl}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  + Add URL
                </button>
              </div>
              <div className="space-y-3">
                {(editEntry?.urls || []).map((url, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      value={url}
                      onChange={(e) => handleEditUrlChange(index, e.target.value)}
                      className="flex-1 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeEditUrl(index)}
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
                value={editEntry?.remarks || ''}
                onChange={(e) => handleEditChange('remarks', e.target.value)}
                rows="4"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-70"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {(selectedEntry?.urls || []).length ? (
              selectedEntry.urls.map((url) => (
                <div key={url} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                  {url}
                </div>
              ))
            ) : (
              <p className="text-slate-500">No URLs available.</p>
            )}
          </div>
        )}
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default EntriesPage;
