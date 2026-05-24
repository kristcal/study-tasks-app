import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createTask, getTasks, toggleTask } from './api'
import type { StudyTask } from './types'

function App() {
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        {loading ? (
          <p className="status">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks yet. Add one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <label
                  className={`task-card${task.isCompleted ? ' task-card--completed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task.id)}
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
                  <span className="task-title">{task.title}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
