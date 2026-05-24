namespace StudyTasks.Api.Models;

public record StudyTask(int Id, string Title, bool IsCompleted);

public record CreateTaskRequest(string Title);
