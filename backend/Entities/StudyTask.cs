namespace StudyTasks.Api.Entities;

public class StudyTask
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}
