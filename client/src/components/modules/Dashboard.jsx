import React, { useState, useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export const Dashboard = () => {
  // Local state to manage modal visibility, form data, tasks, and loading state
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const [showModal, setShowModal] = useState(false);
  const searchQuery = useSelector((state) => state.search.query);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    userId: "",
    taskId: "",
  });

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const userId = user.id;
      setTimeout(async () => {
        const res = await fetch(`${apiUrl}/tasks/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const resData = await res.json();
        setTasks(resData);
      }, 500);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on search query (title or description)
  const filteredTasks = tasks.filter((task) =>
    (task.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );
  
  // Handle task form submission to create new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user:detail"));
      const userId = user?.id;
      const formDataWithUser = { ...formData, userId };

      let res;
        res = await fetch(`${apiUrl}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataWithUser),
        });
        if (!res.ok) {
          throw new Error("Failed to create task");
        }
        toast.success("Task created successfully!");
        fetchTasks();

      const newTask = await res.json();
        setTasks([...tasks, newTask]);

      setShowModal(false);
      setFormData({ title: "", description: "", status: "To Do", taskId: "" });
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Something went wrong while saving the task.");
    }
  };

  return (
    <Layout>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ backgroundColor: "var(--secondary-color)" }}
      >
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-column align-items-center w-75 bg-white border rounded">
            <div className="d-flex justify-content-between align-items-center p-3 w-100">
              <div className="m-4">
                <h3 className=" mb-2 fw-extrabold">
                  Hello, {user?.name.split(" ")[0]}!
                </h3>
                <h5 className="mb-0 text-muted">Let's start work.</h5>
              </div>
              <button
                className="btn btn-info text-white me-4"
                onClick={() => setShowModal(true)}
              >
                Create new task
              </button>
            </div>

            {/* Task Categories */}
            <div
              className="container"
              style={{ maxHeight: "440px", overflowY: "auto" }}
            >
              <div className="row gy-3 w-100 px-4 pb-4">
                {/* To Do Tasks */}
                <div className="col-12 col-md-4">
                  <h6 className="status-header">To Do</h6>
                  {loading ? (
                    <div className="w-100 d-flex justify-content-center py-5">
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredTasks.filter((task) => task.status === "To Do")
                      .length > 0 ? (
                    filteredTasks
                      .filter((task) => task.status === "To Do")
                      .map((task) => (
                        <div key={task.id} className="card shadow-sm mb-3">
                          <Link
                            to={`/task/${task.id}`}
                            className="text-decoration-none"
                          >
                            <div className="card-body">
                              <h6 className="card-title text-black">
                                {task.title}
                              </h6>
                              <p className="text-secondary">
                                {task.description.length > 30
                                  ? `${task.description.slice(0, 35)}...`
                                  : task.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span
                                  className={`badge ${
                                    task.status === "Done"
                                      ? "bg-success"
                                      : task.status === "To Do"
                                      ? "bg-secondary"
                                      : "bg-primary"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))
                  ) : (
                    <div className="text-center w-100 py-5 text-muted">
                      No tasks in "To Do"
                    </div>
                  )}
                </div>

                {/* In Progress Tasks */}
                <div className="col-12 col-md-4">
                  <h6 className="status-header">In Progress</h6>
                  {loading ? (
                    <div className="w-100 d-flex justify-content-center py-5">
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredTasks.filter(task => task.status === "In Progress").length > 0 ? (
                    filteredTasks.filter(task => task.status === "In Progress").map((task) => (
                      <div key={task.id} className="card shadow-sm mb-3">
                        <Link to={`/task/${task.id}`} className="text-decoration-none">
                          <div className="card-body">
                            <h6 className="card-title text-black">{task.title}</h6>
                            <p className="text-secondary">
                              {task.description.length > 30
                                ? `${task.description.slice(0, 35)}...`
                                : task.description}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${
                                task.status === "Done"
                                  ? "bg-success"
                                  : task.status === "To Do"
                                  ? "bg-secondary"
                                  : "bg-primary"
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center w-100 py-5 text-muted">
                      No tasks in "In Progress"
                    </div>
                  )}

                </div>

                {/* Done Tasks */}
                <div className="col-12 col-md-4">
                  <h6 className="status-header">Done</h6>
                  {loading ? (
                    <div className="w-100 d-flex justify-content-center py-5">
                      <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredTasks.filter(task => task.status === "Done").length > 0 ? (
                    filteredTasks.filter(task => task.status === "Done").map((task) => (
                      <div key={task.id} className="card shadow-sm mb-3">
                        <Link to={`/task/${task.id}`} className="text-decoration-none">
                          <div className="card-body">
                            <h6 className="card-title text-black">{task.title}</h6>
                            <p className="text-secondary">
                              {task.description.length > 30
                                ? `${task.description.slice(0, 35)}...`
                                : task.description}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${
                                task.status === "Done"
                                  ? "bg-success"
                                  : task.status === "To Do"
                                  ? "bg-secondary"
                                  : "bg-primary"
                              }`}>
                                {task.status}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center w-100 py-5 text-muted">
                      No tasks in "Done"
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for task creation or editing */}
        {showModal && (
          <div className="modal d-block" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {formData.id ? "Edit Task" : "New Task"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSubmit} className="bg-white">
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      {formData.id ? "Update Task" : "Create Task"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-center" 
              autoClose={1200} 
              hideProgressBar={true}  
              newestOnTop={false}
              closeOnClick                     
              closeButton={true}             
              toastClassName="custom-toast"/>
          </Layout>
  );
};
