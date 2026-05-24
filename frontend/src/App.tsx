import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from './api'
import type { StudyTask } from './types'

type Filter = 'all' | 'active' | 'completed'

function App() {
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.isCompleted
    if (filter === 'completed') return task.isCompleted
    return true
  })

  const loadTasks = useCallback(async () => {
    try {
      setError(null)
      const data = await getTasks()
      setTasks(data)
    } catch {
      setError('Could not load tasks. Is the API running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    try {
      setError(null)
      const task = await createTask(trimmed)
      setTasks((prev) => [...prev, task])
      setTitle('')
    } catch {
      setError('Could not add task.')
    }
  }

  async function handleToggle(id: number) {
    try {
      setError(null)
      const updated = await toggleTask(id)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch {
      setError('Could not update task.')
    }
  }

  async function handleDelete(id: number) {
    try {
      setError(null)
      await deleteTask(id)
      await loadTasks()
    } catch {
      setError('Could not delete task.')
    }
  }

  function startEdit(task: StudyTask) {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  async function handleSave(id: number) {
    const trimmed = editTitle.trim()
    if (!trimmed) return

    try {
      setError(null)
      const updated = await updateTask(id, trimmed)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      setEditingId(null)
      setEditTitle('')
    } catch {
      setError('Could not save task.')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Study Tasks</h1>
      </header>

      <div className="panel">
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="What do you need to study?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Task title"
          />
          <button type="submit">Add task</button>
        </form>

        {error && <p className="status status--error">{error}</p>}

        {!loading && tasks.length > 0 && (
          <div className="filters" role="group" aria-label="Filter tasks">
            <button
              type="button"
              className={`filter-btn${filter === 'all' ? ' filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-btn${filter === 'active' ? ' filter-btn--active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={`filter-btn${filter === 'completed' ? ' filter-btn--active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        )}

        {loading ? (
          <p className="status">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above.</p>
        ) : filteredTasks.length === 0 ? (
          <p className="empty">
            {filter === 'active' ? 'No active tasks.' : 'No completed tasks.'}
          </p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => {
              const isEditing = editingId === task.id

              return (
              <li key={task.id}>
                <div className={`task-card${task.isCompleted ? ' task-card--completed' : ''}`}>
                  <label className="task-card__main">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggle(task.id)}
                      disabled={isEditing}
                    />
                    <span className="task-check" aria-hidden="true">
                      <svg viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6l2.5 2.5 4.5-5"
                          stroke="white"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        className="task-edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        aria-label="Edit task title"
                        autoFocus
                      />
                    ) : (
                      <span className="task-title">{task.title}</span>
                    )}
                  </label>
                  <div className="task-actions">
                    {isEditing ? (
                      <button
                        type="button"
                        className="task-save"
                        onClick={() => handleSave(task.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="task-edit"
                        onClick={() => startEdit(task)}
                        aria-label={`Edit ${task.title}`}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      type="button"
                      className="task-delete"
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
