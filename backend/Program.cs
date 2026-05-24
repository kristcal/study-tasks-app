using System.Text.Json;
using StudyTasks.Api.Models;
using StudyTasks.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddOpenApi();
builder.Services.AddSingleton<TaskStore>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.MapGet("/tasks", (TaskStore store) => Results.Ok(store.GetAll()));

app.MapPost("/tasks", (CreateTaskRequest request, TaskStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
    {
        return Results.BadRequest(new { error = "Title is required." });
    }

    var task = store.Add(request.Title);
    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPut("/tasks/{id}/toggle", (int id, TaskStore store) =>
{
    var task = store.Toggle(id);
    return task is null ? Results.NotFound() : Results.Ok(task);
});

app.Run();
