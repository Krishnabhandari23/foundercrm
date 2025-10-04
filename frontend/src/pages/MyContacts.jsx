import React, { useState, useEffect } from 'react'

const sample = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@foundercrm.com', company: 'InnovateCorp', type: 'customer', status: 'active' },
  { id: 2, name: 'Alex Parker', email: 'alex@startup.com', company: 'Startify', type: 'partner', status: 'active' },
  { id: 3, name: 'Maya Lee', email: 'maya@invest.com', company: 'InvestCo', type: 'investor', status: 'inactive' }
]

const STORAGE_CONTACT_NOTES = 'contact_notes_v1'

const MyContacts = () => {
  const [contacts] = useState(sample)
  const [noteOpen, setNoteOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [notesMap, setNotesMap] = useState({})

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_CONTACT_NOTES); setNotesMap(raw?JSON.parse(raw):{}) } catch(e){}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_CONTACT_NOTES, JSON.stringify(notesMap)) } catch(e){}
  }, [notesMap])

  const openNote = (c) => { setSelected(c); setNoteOpen(true) }

  const saveNote = (text) => {
    if (!selected) return
    setNotesMap(prev => {
      const list = prev[selected.id] ? [ { text, date: new Date().toISOString() }, ...prev[selected.id] ] : [ { text, date: new Date().toISOString() } ]
      const next = { ...prev, [selected.id]: list }
      return next
    })
    setNoteOpen(false)
  }

  // Load tasks linked to a contact from mytasks storage
  const linkedTasks = (contactName) => {
    try {
      const raw = localStorage.getItem('mytasks_v1')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return ['todo','inprogress','done'].flatMap(k => parsed[k].filter(t => t.contact === contactName))
    } catch (e) { return [] }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Contacts</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map(c => (
          <div key={c.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <div className="text-sm text-gray-500">{c.email} • {c.company}</div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${c.type==='customer'?'bg-indigo-50 text-indigo-700':'bg-yellow-50 text-yellow-700'}`}>{c.type}</span>
                <div className="mt-2">
                  <button onClick={() => openNote(c)} className="text-sm text-blue-600">Add Note</button>
                </div>
              </div>
            </div>

            {/* Linked tasks */}
            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Linked tasks</div>
              {linkedTasks(c.name).length === 0 ? (
                <div className="text-sm text-gray-400">No tasks linked</div>
              ) : (
                <ul className="space-y-2">
                  {linkedTasks(c.name).map(t => (
                    <li key={t.id} className="text-sm text-gray-700">• {t.title} <span className="text-xs text-gray-400">({t.priority})</span></li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact notes */}
            <div className="mt-4 text-xs text-gray-500">
              <div className="font-medium text-gray-700 mb-1">Notes</div>
              {notesMap[c.id] && notesMap[c.id].length > 0 ? (
                <div className="space-y-2 text-sm text-gray-700">
                  {notesMap[c.id].map((n, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded-md border">{n.text} <div className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</div></div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400">No notes yet</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Note modal (simple) */}
      {noteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold mb-2">Add Note for {selected?.name}</h3>
            <NoteEditor onSave={saveNote} onCancel={() => setNoteOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

const NoteEditor = ({ onSave, onCancel }) => {
  const [text, setText] = useState('')
  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border p-2 rounded-lg" rows={4} />
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
        <button onClick={() => onSave(text)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">Save</button>
      </div>
    </div>
  )
}

export default MyContacts
