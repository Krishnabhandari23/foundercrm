import React, { useState, useEffect } from 'react'

const STORAGE_NOTIFS = 'team_notifications_v1'

const Notifications = () => {
  const [notifs, setNotifs] = useState([])

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_NOTIFS); setNotifs(raw?JSON.parse(raw):[ // seed
      { id:1, type:'task', title:'New task assigned', message:'You were assigned "Follow up with Sarah"', time: '2m ago', unread: true },
      { id:2, type:'deadline', title:'Task deadline soon', message:'Prepare proposal is due tomorrow', time: '1h ago', unread: true },
      { id:3, type:'contact', title:'Contact updated', message:'Sarah Johnson updated her phone number', time: '3h ago', unread:false }
    ]) } catch(e){}
  }, [])

  useEffect(() => { try { localStorage.setItem(STORAGE_NOTIFS, JSON.stringify(notifs)) } catch(e){} }, [notifs])

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id===id?{...n, unread:false}:n))

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Notifications</h3>
        <button onClick={() => setNotifs([])} className="text-sm text-gray-500">Clear</button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="text-sm text-gray-400">No notifications</div>
        ) : (
          notifs.map(n => (
            <div key={n.id} className={`p-3 rounded-md border ${n.unread?'bg-blue-50 border-blue-100':'bg-white border-gray-100'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
                {n.unread && <button onClick={() => markRead(n.id)} className="text-sm text-blue-600">Mark read</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notifications
