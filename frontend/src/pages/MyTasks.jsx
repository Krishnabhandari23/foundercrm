import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { format } from 'date-fns'

const initial = {
  todo: [
    { id: 't1', title: 'Follow up with Sarah', priority: 'high', due: new Date().toISOString(), contact: 'Sarah Johnson', assignee: 'You', notes: [] },
    { id: 't2', title: 'Prepare proposal', priority: 'medium', due: new Date().toISOString(), contact: 'TechCorp', assignee: 'You', notes: [] }
  ],
  inprogress: [
    { id: 't3', title: 'Design landing page', priority: 'low', due: new Date().toISOString(), contact: 'Design Team', assignee: 'You', notes: [] }
  ],
  done: [
    { id: 't4', title: 'Call with investor', priority: 'medium', due: new Date().toISOString(), contact: 'Angel VC', assignee: 'You', notes: [] }
  ]
}

const priorityColor = (p) => {
  switch(p) {
    case 'high': return 'bg-red-100 text-red-700'
    case 'medium': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-green-100 text-green-700'
  }
}

const STORAGE_KEY = 'mytasks_v1'

const MyTasks = () => {
  const [columns, setColumns] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })

  const [noteOpen, setNoteOpen] = useState(false)
  const [noteTask, setNoteTask] = useState(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(columns)) } catch (e) {}
  }, [columns])

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceList = Array.from(columns[source.droppableId])
    const [moved] = sourceList.splice(source.index, 1)
    const destList = Array.from(columns[destination.droppableId])
    destList.splice(destination.index, 0, moved)

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList
    }))
  }

  const toggleComplete = (colId, idx) => {
    const item = columns[colId][idx]
    if (colId !== 'done') {
      const newSrc = Array.from(columns[colId])
      newSrc.splice(idx,1)
      setColumns(prev => ({
        ...prev,
        [colId]: newSrc,
        done: [item, ...prev.done]
      }))
    } else {
      const newDone = Array.from(columns.done)
      newDone.splice(idx,1)
      setColumns(prev => ({...prev, done: newDone, todo: [item, ...prev.todo]}))
    }
  }

  const openNotes = (task, colId, idx) => {
    setNoteTask({ task, colId, idx })
    setNoteText('')
    setNoteOpen(true)
  }

  const saveNote = () => {
    if (!noteTask) return
    setColumns(prev => {
      const col = Array.from(prev[noteTask.colId])
      const item = { ...col[noteTask.idx] }
      item.notes = item.notes || []
      if (noteText.trim()) item.notes = [{ text: noteText.trim(), date: new Date().toISOString() }, ...item.notes]
      col[noteTask.idx] = item
      return { ...prev, [noteTask.colId]: col }
    })
    setNoteOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-gray-500">Drag tasks between columns to update status</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['todo','inprogress','done'].map((colId) => (
            <Droppable droppableId={colId} key={colId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-lg min-h-[200px] ${colId==='todo'?'bg-gradient-to-br from-pink-50 to-rose-50':colId==='inprogress'?'bg-gradient-to-br from-blue-50 to-cyan-50':'bg-gradient-to-br from-green-50 to-emerald-50'}`}
                >
                  <h3 className="font-semibold mb-3 text-gray-800">{colId==='todo'?'To Do':colId==='inprogress'?'In Progress':'Completed'}</h3>
                  {columns[colId].map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{task.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(task.priority)}`}>{task.priority}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-2">Due {format(new Date(task.due), 'MMM d')}</div>
                              <div className="text-xs text-gray-500">{task.contact}</div>

                              {/* Notes preview */}
                              {task.notes && task.notes.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <strong>Notes:</strong> {task.notes[0].text}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face" alt="assignee" className="w-8 h-8 rounded-full" />
                              <div className="flex flex-col items-end space-y-1">
                                <button onClick={() => openNotes(task, colId, idx)} className="text-sm text-gray-600">Notes</button>
                                <button onClick={() => toggleComplete(colId, idx)} className="text-sm text-blue-600">{colId==='done'?'Undo':'Done'}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Note modal */}
      {noteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="font-semibold mb-2">Add note for: {noteTask?.task?.title}</h3>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="w-full border p-2 rounded-lg" rows={4} />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setNoteOpen(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
              <button onClick={saveNote} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyTasks
