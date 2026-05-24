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
    <div className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-header__title">Study Tasks</h1>
        </header>

        <section className="composer-card">
          <form className="task-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="What do you need to study?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Task title"
            />
            <button type="submit" className="btn btn--primary">
              Add task
            </button>
          </form>
          {error && <p className="alert alert--error">{error}</p>}
        </section>

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

        <section className="tasks-section">
          {loading ? (
            <p className="empty-state">Loading tasks…</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add your first task 🚀</p>
          ) : filteredTasks.length === 0 ? (
            <p className="empty-state">
              {filter === 'active' ? 'No active tasks.' : 'No completed tasks.'}
            </p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => {
                const isEditing = editingId === task.id

                return (
                  <li key={task.id} className="task-list__item">
                    <article
                      className={`task-card${task.isCompleted ? ' task-card--completed' : ''}${isEditing ? ' task-card--editing' : ''}`}
                    >
                      <div className="task-card__content">
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
                          <>
                            <p className="task-title">{task.title}</p>
                            {task.isCompleted && (
                              <span className="task-badge">Completed</span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="task-actions">
                        {isEditing ? (
                          <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={() => handleSave(task.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="task-action task-action--edit"
                            onClick={() => startEdit(task)}
                            aria-label={`Edit ${task.title}`}
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.793 8.793-3.182.795.795-3.182 8.793-8.793z" />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          className="task-action task-action--delete"
                          onClick={() => handleDelete(task.id)}
                          aria-label={`Delete ${task.title}`}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M8.75 2A2.75 2.75 0 006 4.75v.5H3.75a.75.75 0 000 1.5h.473l.81 11.24A2.25 2.25 0 006.987 20h6.026a2.25 2.25 0 002.254-2.01l.81-11.24h.473a.75.75 0 000-1.5H14v-.5A2.75 2.75 0 0011.25 2h-2.5zm-1.25 3v-.5c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.5H7.5zm1 4.25a.75.75 0 011.5 0v6.5a.75.75 0 01-1.5 0v-6.5zm3.75-.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <label
                          className="task-action task-action--toggle"
                          title="Toggle complete"
                        >
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
                        </label>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
