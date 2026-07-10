const TopStats = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total Entries</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-950">{stats.totalEntries ?? 0}</h2>
    </div>
    <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total URLs</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-950">{stats.totalUrls ?? 0}</h2>
    </div>
    <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Countries</p>
      <h2 className="mt-4 text-3xl font-semibold text-slate-950">{stats.countries ?? 0}</h2>
    </div>
    <div className="rounded-[32px] border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/60">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Last Added</p>
      <p className="mt-4 text-lg text-slate-600">{stats.lastAdded ? new Date(stats.lastAdded).toLocaleDateString() : 'No entries yet'}</p>
    </div>
  </div>
);

export default TopStats;
