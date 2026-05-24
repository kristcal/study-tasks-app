using StudyTasks.Api.Models;

namespace StudyTasks.Api.Services;

public class TaskStore
{
    private readonly List<StudyTask> _tasks = [];
    private int _nextId = 1;
    private readonly object _lock = new();

    public IReadOnlyList<StudyTask> GetAll()
    {
        lock (_lock)
        {
            return _tasks.ToList();
        }
    }

    public StudyTask Add(string title)
    {
        lock (_lock)
        {
            var task = new StudyTask(_nextId++, title.Trim(), false);
            _tasks.Add(task);
            return task;
        }
    }

    public StudyTask? Toggle(int id)
    {
        lock (_lock)
        {
            var index = _tasks.FindIndex(t => t.Id == id);
            if (index < 0)
            {
                return null;
            }

            var current = _tasks[index];
            var updated = current with { IsCompleted = !current.IsCompleted };
            _tasks[index] = updated;
            return updated;
        }
    }
}
