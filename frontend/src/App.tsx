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
    <main>
      <h1>Study Tasks</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="muted">No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggle(task.id)}
                />
                <span>{task.title}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
