import { useMemo, useState } from 'react'
import WorkspaceLayout from '../components/WorkspaceLayout'
import { readStorage, userStorageKey, writeStorage } from '../lib/browserStorage'

const noteColors = [
  { name: 'Butter', value: '#fff5d8' },
  { name: 'Rose', value: '#ffe8e6' },
  { name: 'Mint', value: '#e4f5eb' },
  { name: 'Sky', value: '#e7f2ff' },
  { name: 'Lilac', value: '#f0eaff' },
  { name: 'White', value: '#ffffff' },
]

function NoteEditor({ note, folders, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || '')
  const [body, setBody] = useState(note?.body || '')
  const [folder, setFolder] = useState(note?.folder || folders[0] || 'General')
  const [color, setColor] = useState(note?.color || noteColors[0].value)
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (!title.trim() && !body.trim()) {
      setError('Add a title or some note text before saving.')
      return
    }
    const saved = onSave({ ...note, id: note?.id || crypto.randomUUID(), title: title.trim() || 'Untitled note', body: body.trim(), folder, color, updatedAt: new Date().toISOString() })
    if (saved === false) {
      setError('The note could not be saved. Check the browser storage error shown on the page.')
      return
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-[#29253c]/40 p-5 backdrop-blur-[3px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[min(90vh,760px)] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#efedf4] bg-white p-7 shadow-[0_24px_70px_rgba(33,29,58,0.18)] max-sm:p-5" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
        <div className="mb-6 flex items-start justify-between"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">YOUR IDEAS</span><h2 id="note-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-[#302d43]">{note ? 'Edit note' : 'New note'}</h2></div><button className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-xl text-[#9996a9] hover:bg-[#f3f1ff] hover:text-[#6556ce]" type="button" onClick={onClose} aria-label="Close">×</button></div>
        <form onSubmit={submit}>
          <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Title<input className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none placeholder:text-[#b1afbb] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your note a name" /></label>
          <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Note<textarea className="w-full resize-y rounded-xl border border-[#e8e6ef] bg-white px-3 py-3 text-base leading-relaxed text-[#373449] outline-none placeholder:text-[#b1afbb] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write down an idea, a reminder, or anything worth keeping…" rows={7} /></label>
          <div className="flex gap-3 max-sm:gap-2">
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Folder<select className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none focus:border-[#a69bec]" value={folder} onChange={(event) => setFolder(event.target.value)}>{folders.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Card color<div className="flex min-h-11 items-center gap-2">{noteColors.map((item) => <button type="button" title={item.name} aria-label={`${item.name} background`} key={item.value} className={`h-6 w-6 cursor-pointer rounded-full border border-black/10 p-0 ${color === item.value ? 'outline outline-2 outline-offset-2 outline-[#7869e3]' : ''}`} style={{ backgroundColor: item.value }} onClick={() => setColor(item.value)} />)}</div></label>
          </div>
          {error && <p className="mb-3 text-sm text-[#c14852]" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-2"><button className="min-h-11 cursor-pointer rounded-xl border border-[#e9e8ef] bg-white px-4 text-sm font-semibold text-[#666478] hover:bg-[#f8f7fc]" type="button" onClick={onClose}>Cancel</button><button className="min-h-11 cursor-pointer rounded-xl bg-[#796be8] px-4 text-sm font-semibold text-white hover:bg-[#6b5cda]">Save note</button></div>
        </form>
      </section>
    </div>
  )
}

export default function NotesPage() {
  const storageKey = userStorageKey('notes')
  const [notes, setNotes] = useState(() => readStorage(storageKey, []))
  const [folders, setFolders] = useState(() => readStorage(userStorageKey('note-folders'), ['General', 'Ideas', 'Personal']))
  const [expanded, setExpanded] = useState(() => new Set(['General', 'Ideas', 'Personal']))
  const [search, setSearch] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [storageError, setStorageError] = useState('')

  const matchingNotes = useMemo(() => notes.filter((note) => `${note.title} ${note.body} ${note.folder}`.toLowerCase().includes(search.trim().toLowerCase())), [notes, search])
  const grouped = useMemo(() => folders.map((folder) => ({ folder, notes: matchingNotes.filter((note) => note.folder === folder) })).filter((group) => !search || group.notes.length), [folders, matchingNotes, search])
  const persistNotes = (next) => {
    try {
      writeStorage(storageKey, next)
      setNotes(next)
      setStorageError('')
      return true
    } catch (error) {
      setStorageError(`Could not save notes to this browser: ${error.message}`)
      return false
    }
  }
  const saveNote = (note) => persistNotes(notes.some((item) => item.id === note.id) ? notes.map((item) => item.id === note.id ? note : item) : [note, ...notes])
  const deleteNote = (note) => {
    if (window.confirm(`Delete “${note.title}”? This cannot be undone.`)) persistNotes(notes.filter((item) => item.id !== note.id))
  }
  const addFolder = () => {
    const name = window.prompt('Name your new folder')
    if (name?.trim() && !folders.some((folder) => folder.toLowerCase() === name.trim().toLowerCase())) {
      const next = [...folders, name.trim()]
      try {
        writeStorage(userStorageKey('note-folders'), next)
        setFolders(next)
        setExpanded((current) => new Set([...current, name.trim()]))
      } catch (error) {
        setStorageError(`Could not save folders to this browser: ${error.message}`)
      }
    }
  }
  const openEditor = (note = null) => { setEditingNote(note); setEditorOpen(true) }

  return (
    <WorkspaceLayout>
      <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">THINK IT. SAVE IT.</span><h1 className="my-2 text-[clamp(30px,3vw,42px)] font-bold leading-tight tracking-tight text-[#27243a]">Notes</h1><p className="m-0 text-base leading-relaxed text-[#89879a]">A calm place to collect thoughts, plans, and little sparks of inspiration.</p></div>
        <button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#796be8] px-5 text-sm font-semibold text-white hover:bg-[#6b5cda]" onClick={() => openEditor()}>＋ New note</button>
      </div>
      <section className="rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
        <div className="mb-5 flex gap-3 max-sm:flex-col">
          <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-[#eae9f0] bg-white px-3 text-[#9b99aa] focus-within:border-[#a69bec] focus-within:ring-4 focus-within:ring-[#796be814]"><span className="text-xl">⌕</span><input className="w-full min-w-0 border-0 bg-transparent text-sm text-[#39364d] outline-none placeholder:text-[#aaa8b6]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your notes…" aria-label="Search notes" /></label>
          <button className="min-h-11 cursor-pointer rounded-xl border border-[#e9e8ef] bg-white px-4 text-sm font-semibold text-[#666478] hover:bg-[#f8f7fc]" onClick={addFolder}>＋ New folder</button>
        </div>
        {storageError && <div className="my-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{storageError}</div>}
        <div>
          {grouped.map(({ folder, notes: folderNotes }) => {
            const isExpanded = expanded.has(folder) || Boolean(search)
            return <section className="border-t border-[#f0eff4]" key={folder}>
              <button className="flex min-h-14 w-full cursor-pointer items-center gap-3 border-0 bg-white px-2 text-left" onClick={() => setExpanded((current) => { const next = new Set(current); if (next.has(folder)) next.delete(folder); else next.add(folder); return next })} aria-expanded={isExpanded}>
                <span className="w-3 text-lg text-[#9895a7]">{isExpanded ? '⌄' : '›'}</span><span className="text-lg text-[#8778e3]">▰</span><strong className="text-base text-[#48455a]">{folder}</strong><span className="text-sm text-[#a6a4b1]">{folderNotes.length}</span>
                <span className="ml-auto text-xl text-[#8072df]" onClick={(event) => { event.stopPropagation(); openEditor({ folder }) }} aria-label={`Add note to ${folder}`}>＋</span>
              </button>
              {isExpanded && <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 py-2 pb-5 max-sm:grid-cols-1">
                {folderNotes.map((note) => <article className="flex min-h-[230px] flex-col rounded-xl border border-black/5 p-4 shadow-[0_3px_11px_rgba(40,35,66,0.04)]" key={note.id} style={{ backgroundColor: note.color || '#fff5d8' }}>
                  <div className="flex items-center justify-between"><span className="text-xs text-[#827f8c]">{note.updatedAt ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(note.updatedAt)) : ''}</span><div className="flex items-center gap-1"><button className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#716e7a] hover:bg-white/50" onClick={() => openEditor(note)} aria-label={`Edit ${note.title}`}>✎</button><button className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-[#716e7a] hover:bg-red-50 hover:text-red-600" onClick={() => deleteNote(note)} aria-label={`Delete ${note.title}`}>×</button></div></div>
                  <button className="flex-1 cursor-pointer border-0 bg-transparent px-1 py-2 text-left" onClick={() => openEditor(note)}><strong className="text-base text-[#393748]">{note.title}</strong><p className="mt-2 overflow-hidden whitespace-pre-wrap text-sm leading-relaxed text-[#656271] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">{note.body || 'A note waiting for your thoughts…'}</p></button>
                  <div className="flex items-center justify-between border-t border-black/5 pt-3"><span className="text-xs text-[#777482]">{folder}</span><div className="flex items-center gap-2" aria-label="Change note background color">{noteColors.map((color) => <button key={color.value} title={`${color.name} background`} aria-label={`Set ${color.name} background`} className={`h-3.5 w-3.5 cursor-pointer rounded-full border border-black/10 p-0 ${note.color === color.value ? 'outline outline-1 outline-offset-2 outline-[#7668df]' : ''}`} style={{ backgroundColor: color.value }} onClick={() => persistNotes(notes.map((item) => item.id === note.id ? { ...item, color: color.value } : item))} />)}</div></div>
                </article>)}
                {!folderNotes.length && <button className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#dcd9eb] bg-[#fcfbff] text-sm text-[#8e8a9d] hover:border-[#a99fe8] hover:bg-[#f8f6ff]" onClick={() => openEditor({ folder })}><span className="text-2xl text-[#8072df]">＋</span><strong>Add a note</strong></button>}
              </div>}
            </section>
          })}
          {!grouped.length && <div className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center text-[#8d8a9c]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0edff] text-xl text-[#796be8]">⌕</span><strong className="mt-3 text-base text-[#48455a]">No notes found</strong><p className="my-2 text-sm">Try another search or start a new note.</p></div>}
        </div>
      </section>
      {editorOpen && <NoteEditor note={editingNote} folders={folders} onClose={() => setEditorOpen(false)} onSave={saveNote} />}
    </WorkspaceLayout>
  )
}
