import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Home() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [customCategory, setCustomCategory] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (task.trim().length === 0) return;
    const finalCategory =
      category === "Custom" && customCategory.trim().length > 0
        ? customCategory
        : category;

    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex].text = task;
      updatedTasks[editingIndex].category = finalCategory;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([
        ...tasks,
        { text: task, completed: false, category: finalCategory },
      ]);
    }
    setTask("");
    setCategory("Work");
    setCustomCategory("");
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
    setEditingIndex(null);
  }

  function editTask(index) {
    setTask(tasks[index].text);
    setCategory(tasks[index].category);
    if (
      tasks[index].category !== "Work" &&
      tasks[index].category !== "Personal" &&
      tasks[index].category !== "Shopping"
    ) {
      setCategory("Custom");
      setCustomCategory(tasks[index].category);
    }
    setEditingIndex(index);
  }

  function toggleComplete(index) {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  }

  // Group tasks by category
  const groupedTasks = tasks.reduce((groups, task, index) => {
    if (!groups[task.category]) groups[task.category] = [];
    groups[task.category].push({ ...task, index });
    return groups;
  }, {});

  const categoryColors = {
    Work: "#2196f3",
    Personal: "#9c27b0",
    Shopping: "#4caf50",
    Custom: "#ff9800",
  };

  function getCategoryColor(cat) {
    return categoryColors[cat] || categoryColors["Custom"];
  }

  const filteredGroupedTasks =
    filter === "All"
      ? groupedTasks
      : { [filter]: groupedTasks[filter] || [] };

  function handleDragEnd(result) {
    if (!result.destination) return;
    const { source, destination } = result;
    const catTasks = [...filteredGroupedTasks[source.droppableId]];
    const [moved] = catTasks.splice(source.index, 1);
    catTasks.splice(destination.index, 0, moved);

    // Merge back to tasks array
    const newTasks = [...tasks].filter(
      (t) => t.category !== source.droppableId
    );
    setTasks([...newTasks, ...catTasks]);
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📂 Categorized To-Do List</h1>

      {/* Filter bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["All", "Work", "Personal", "Shopping", "Custom"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: filter === cat ? getCategoryColor(cat) : "#e0e0e0",
              color: filter === cat ? "white" : "black",
              fontWeight: filter === cat ? "bold" : "normal",
              transition: "0.3s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Input section */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ padding: "0.75rem", flex: "2", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "0.75rem", flex: "1", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem" }}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
          <option value="Custom">Custom</option>
        </select>
        {category === "Custom" && (
          <input
            type="text"
            placeholder="Custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            style={{ padding: "0.75rem", flex: "1", border: "2px solid #ccc", borderRadius: "8px", fontSize: "1rem" }}
          />
        )}
        <button
          onClick={addTask}
          style={{ padding: "0.75rem 1.25rem", borderRadius: "8px", border: "none", backgroundColor: editingIndex !== null ? "#ff9800" : "#4caf50", color: "white", fontSize: "1rem", cursor: "pointer", transition: "0.3s" }}
        >
          {editingIndex !== null ? "Save" : "Add"}
        </button>
      </div>

      {/* Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.keys(filteredGroupedTasks).map((cat) => (
          <div key={cat} style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#fff", backgroundColor: getCategoryColor(cat), padding: "0.5rem 1rem", borderRadius: "8px" }}>
              {cat}
            </h2>
            <Droppable droppableId={cat}>
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyle: "none", padding: 0 }}>
                  {filteredGroupedTasks[cat].map((t, index) => (
                    <Draggable key={t.index} draggableId={String(t.index)} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            background: "#f9f9f9",
                            padding: "0.75rem 1rem",
                            marginBottom: "0.75rem",
                            borderRadius: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", flex: 1, textDecoration: t.completed ? "line-through" : "none", color: t.completed ? "#888" : "#000" }}>
                            <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: getCategoryColor(t.category), marginRight: "8px" }}></span>
                            {t.text}
                          </span>
                          <div>
                            <button onClick={() => toggleComplete(t.index)} style={{ marginRight: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "6px", border: "none", backgroundColor: t.completed ? "#9e9e9e" : "#4caf50", color: "white", cursor: "pointer", transition: "0.3s" }}>
                              {t.completed 
