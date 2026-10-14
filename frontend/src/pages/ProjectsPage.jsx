import { useMemo, useState } from 'react'
import WorkspaceLayout from '../components/WorkspaceLayout'
import { readStorage, userStorageKey, writeStorage } from '../lib/browserStorage'

const projectColors = ['#7c6ee8', '#df8b63', '#42a89c', '#6694d8', '#d575a0', '#78a75d']

function ProjectEditor({ project, onClose, onSave }) {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [color, setColor] = useState(project?.color || projectColors[0])
  const [status, setStatus] = useState(project?.status || 'active')
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!name.trim()) { setError('Project name is required.'); return }
    const saved = onSave({ ...project, id: project?.id || crypto.randomUUID(), name: name.trim(), description: description.trim(), color, status, updatedAt: new Date().toISOString() })
    if (saved === false) {
      setError('The project could not be saved. Check the browser storage error shown on the page.')
      return
    }
    onClose()
  }
  return <div className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-[#29253c]/40 p-5 backdrop-blur-[3px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="max-h-[min(90vh,760px)] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#efedf4] bg-white p-7 shadow-[0_24px_70px_rgba(33,29,58,0.18)] max-sm:p-5" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
    <div className="mb-6 flex items-start justify-between"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">MAKE IT HAPPEN</span><h2 id="project-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-[#302d43]">{project ? 'Edit project' : 'New project'}</h2></div><button className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-xl text-[#9996a9] hover:bg-[#f3f1ff] hover:text-[#6556ce]" type="button" onClick={onClose} aria-label="Close">×</button></div>
    <form onSubmit={submit}>
      <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Project name<input className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none placeholder:text-[#b1afbb] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Website redesign" autoFocus /></label>
      <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Description<textarea className="w-full resize-y rounded-xl border border-[#e8e6ef] bg-white px-3 py-3 text-base leading-relaxed text-[#373449] outline-none placeholder:text-[#b1afbb] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What are you working towards?" /></label>
      <div className="flex gap-3"><label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Status<select className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none focus:border-[#a69bec]" value={status} onChange={(event) => setStatus(event.target.value)}><option value="active">In progress</option><option value="planned">Planned</option><option value="completed">Completed</option></select></label><div className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Color<div className="flex min-h-11 items-center gap-2">{projectColors.map((item) => <button type="button" aria-label={`Choose project color ${item}`} key={item} className={`h-6 w-6 cursor-pointer rounded-full border border-black/10 p-0 ${color === item ? 'outline outline-2 outline-offset-2 outline-[#7869e3]' : ''}`} style={{ backgroundColor: item }} onClick={() => setColor(item)} />)}</div></div></div>
      {error && <p className="mb-3 text-sm text-[#c14852]" role="alert">{error}</p>}<div className="flex justify-end gap-2 pt-2"><button className="min-h-11 cursor-pointer rounded-xl border border-[#e9e8ef] bg-white px-4 text-sm font-semibold text-[#666478] hover:bg-[#f8f7fc]" type="button" onClick={onClose}>Cancel</button><button className="min-h-11 cursor-pointer rounded-xl bg-[#796be8] px-4 text-sm font-semibold text-white hover:bg-[#6b5cda]">{project ? 'Save changes' : 'Create project'}</button></div>
    </form>
  </section></div>
}

export default function ProjectsPage() {
  const storageKey = userStorageKey('projects')
  const [projects, setProjects] = useState(() => readStorage(storageKey, []))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [storageError, setStorageError] = useState('')
  const filtered = useMemo(() => projects.filter((project) => `${project.name} ${project.description}`.toLowerCase().includes(search.trim().toLowerCase()) && (filter === 'all' || project.status === filter)), [projects, search, filter])
  const persistProjects = (next) => {
    try {
      writeStorage(storageKey, next)
      setProjects(next)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not save projects to this browser: ${error.message}`)
      return false
    }
  }
  const saveProject = (project) => {
    return persistProjects(projects.some((item) => item.id === project.id) ? projects.map((item) => item.id === project.id ? project : item) : [project, ...projects])
  }
  const deleteProject = (project) => {
    if (window.confirm(`Delete “${project.name}”?`)) persistProjects(projects.filter((item) => item.id !== project.id))
  }
  const openEditor = (project = null) => { setEditing(project); setEditorOpen(true) }

  return <WorkspaceLayout>
    <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">THE BIG PICTURE</span><h1 className="my-2 text-[clamp(30px,3vw,42px)] font-bold leading-tight tracking-tight text-[#27243a]">Projects</h1><p className="m-0 text-base leading-relaxed text-[#89879a]">Give your goals a home and keep your momentum in view.</p></div><button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#796be8] px-5 text-sm font-semibold text-white hover:bg-[#6b5cda]" onClick={() => openEditor()}>＋ New project</button></div>
    <section className="relative mb-5 flex items-center justify-between gap-5 overflow-hidden rounded-2xl border border-[#eae6ff] bg-gradient-to-r from-[#f2efff] to-white px-7 py-6 max-sm:flex-col max-sm:items-start max-sm:p-5"><div className="relative z-[1]"><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">YOUR PORTFOLIO</span><h2 className="my-2 text-xl font-bold text-[#37334e]">Good things are in progress.</h2><p className="m-0 text-sm text-[#8e8aa1]">Organize the work behind your next big idea.</p></div><div className="relative z-[1] flex gap-6 max-sm:w-full max-sm:justify-between max-sm:border-t max-sm:border-[#e9e5fb] max-sm:pt-3"><div className="flex flex-col gap-1"><strong className="text-xl text-[#685ad2]">{projects.length}</strong><span className="text-xs text-[#9390a4]">Total projects</span></div><div className="flex flex-col gap-1"><strong className="text-xl text-[#685ad2]">{projects.filter((project) => project.status === 'active').length}</strong><span className="text-xs text-[#9390a4]">In progress</span></div><div className="flex flex-col gap-1"><strong className="text-xl text-[#685ad2]">{projects.filter((project) => project.status === 'completed').length}</strong><span className="text-xs text-[#9390a4]">Completed</span></div></div></section>
    <section className="rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
      <div className="mb-5"><h2 className="text-xl font-bold text-[#302d43]">Your projects</h2><p className="mt-1 text-sm text-[#9996a8]">Everything you’re moving forward.</p></div>
      <div className="mb-4 flex gap-3 max-sm:flex-wrap"><label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-[#eae9f0] bg-white px-3 text-[#9b99aa] focus-within:border-[#a69bec] focus-within:ring-4 focus-within:ring-[#796be814] max-sm:basis-full"><span className="text-xl">⌕</span><input className="w-full min-w-0 border-0 bg-transparent text-sm text-[#39364d] outline-none placeholder:text-[#aaa8b6]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects…" aria-label="Search projects" /></label><select className="min-h-11 rounded-xl border border-[#eae9f0] bg-white py-0 pl-3 pr-8 text-sm text-[#726f84] outline-none focus:border-[#a69bec]" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter projects"><option value="all">All projects</option><option value="active">In progress</option><option value="planned">Planned</option><option value="completed">Completed</option></select></div>
      {storageError && <div className="my-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{storageError}</div>}
      {filtered.length ? <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4 max-sm:grid-cols-1">{filtered.map((project) => <article className="flex min-h-[220px] flex-col rounded-xl border border-[#efedf4] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_9px_24px_rgba(41,35,66,0.05)]" key={project.id}>
        <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl text-base text-white" style={{ backgroundColor: project.color || projectColors[0] }}>✦</span><div className="flex items-center gap-1"><button className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#9996a9] hover:bg-[#f3f1ff] hover:text-[#6556ce]" aria-label={`Edit ${project.name}`} onClick={() => openEditor(project)}>✎</button><button className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#9996a9] hover:bg-[#fff0f0] hover:text-[#d65e69]" aria-label={`Delete ${project.name}`} onClick={() => deleteProject(project)}>×</button></div></div>
        <button className="flex-1 cursor-pointer border-0 bg-transparent py-4 text-left" onClick={() => openEditor(project)}><h3 className="mb-2 text-base font-bold text-[#39364b]">{project.name}</h3><p className="m-0 text-sm leading-relaxed text-[#9390a1]">{project.description || 'Add a short description to keep this project in focus.'}</p></button>
        <div className="flex items-center justify-between gap-2 border-t border-[#f0eff4] pt-3 text-xs text-[#aaa7b5]"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${project.status === 'active' ? 'bg-[#e9f7f2] text-[#3d8d7b]' : project.status === 'planned' ? 'bg-[#fff5e5] text-[#a17b45]' : 'bg-[#f0eeff] text-[#7265c9]'}`}>{project.status === 'active' ? 'In progress' : project.status === 'planned' ? 'Planned' : 'Completed'}</span><span>{project.updatedAt ? `Updated ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(project.updatedAt))}` : ''}</span></div>
      </article>)}</div> : <div className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center text-[#8d8a9c]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0edff] text-xl text-[#796be8]">◫</span><strong className="mt-3 text-base text-[#48455a]">{search ? 'No matching projects' : 'Your next big thing starts here'}</strong><p className="my-2 text-sm">{search ? 'Try another search or filter.' : 'Create a project to bring related work together.'}</p>{!projects.length && <button className="mt-2 min-h-11 cursor-pointer rounded-xl bg-[#796be8] px-4 text-sm font-semibold text-white hover:bg-[#6b5cda]" onClick={() => openEditor()}>Create a project</button>}</div>}
    </section>
    {editorOpen && <ProjectEditor project={editing} onClose={() => setEditorOpen(false)} onSave={saveProject} />}
  </WorkspaceLayout>
}
