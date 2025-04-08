import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Layout } from "../Layout/Layout";
import { FiEdit, FiTrash2  } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DetailPage = () => {
    const navigate = useNavigate();
  const { taskId } = useParams(); 
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    userId: "",
    taskId: "", 
  });

  useEffect(() => {
    const fetchTaskDetail = async () => {
      const res = await fetch(`http://localhost:5000/task/${taskId}`);
      const taskData = await res.json();
      setTask(taskData); 
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        userId: taskData.userId,
        taskId: taskData.id
      });
    };

    fetchTaskDetail();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await res.json();
      setTask(updatedTask); 
      setShowModal(false);  
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Something went wrong while updating the task.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
  
      setTask(null); // Clear the task
      toast.success("Task deleted successfully!");
  

      navigate("/"); 
  
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Something went wrong while deleting the task.");
    }
  };
  

  return (
    <Layout>
      <div className="task-detail-container bg-white m-3 p-2 ">
      {task && (
          <>
            <div className="d-flex justify-content-between">
              <h3 className="fs-4 fw-extrabold px-3 mt-2">{task.title}</h3>
              <p className="me-5 mt-3">
                Status:{" "}
                <span
                  className={`badge ${
                    task.status === "Done"
                      ? "bg-success"
                      : task.status === "On Hold"
                      ? "bg-danger"
                      : task.status === "To Do"
                      ? "bg-secondary"
                      : "bg-info"
                  }`}
                >
                  {task.status}
                </span>
              </p>
            </div>

            <label className="px-3 text-secondary mb-2" htmlFor="Description">
              Description:
            </label>
              <p className="px-3 text-secondary">{task.description}</p>
              <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary btn-sm d-flex align-items-center me-3 mt-2"
                onClick={() => setShowModal(true)} 
              >
                <span className="me-2 text-white">Edit</span>
                <FiEdit className="text-white" style={{ cursor: "pointer" }} />
              </button>
              <button
                className="btn btn-danger d-flex btn-sm align-items-center me-3 mt-2"
                 onClick={() => handleDelete(task.id)}
              >
                <span className="me-2">Delete</span>
                <FiTrash2  className="text-white" style={{ cursor: "pointer" }} />
              </button>
              </div>
          </>
        )}
      </div>

      {/* Modal editing */}
      {showModal && (
        <div className="modal d-block" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
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
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>On Hold</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-info text-white">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
              position="top-center" 
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
            />
    </Layout>
  );
};
