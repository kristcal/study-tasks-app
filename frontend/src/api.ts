import type { StudyTask } from './types'

const base = '/tasks'

export async function getTasks(): Promise<StudyTask[]> {
  const res = await fetch(base)
  if (!res.ok) throw new Error('Failed to load tasks')
  return res.json()
}

export async function createTask(title: string): Promise<StudyTask> {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

export async function toggleTask(id: number): Promise<StudyTask> {
  const res = await fetch(`${base}/${id}/toggle`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to toggle task')
  return res.json()
}

export async function updateTask(id: number, title: string): Promise<StudyTask> {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${base}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}
