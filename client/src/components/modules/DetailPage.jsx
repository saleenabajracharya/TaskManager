import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../Layout/Layout";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearSearchQuery } from "../../redux/SearchSlice";

export const DetailPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const { taskId } = useParams(); // Get task ID from the URL
  const [task, setTask] = useState(null); // State to hold task data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    userId: "",
    taskId: "",
  });

  const handleNavigate = () => {
        dispatch(clearSearchQuery());
        navigate("/");
      };
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch task details on component mount or when taskId changes
  useEffect(() => {
    const fetchTaskDetail = async () => {
      const res = await fetch(`${apiUrl}/task/${taskId}`);
      const taskData = await res.json();
      setTask(taskData); 
      setFormData({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        userId: user.id,
        taskId: taskData.id,
      });
    };

    fetchTaskDetail();
  }, [taskId]); 

  // Handle form input change to update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle task update (submit edited form)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
        ...formData,
        taskId: taskId, 
      };

    try {
      const res = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), 
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

  // Handle task deletion
  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTask(null); 
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
                      : "bg-primary"
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
              {/* Button to open the modal for editing */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center me-3 mt-2"
                onClick={() => setShowModal(true)}
              >
                <span className="me-2 text-white">Edit</span>
                <FiEdit className="text-white" style={{ cursor: "pointer" }} />
              </button>
              {/* Button to delete the task */}
              <button
                className="btn btn-danger d-flex btn-sm align-items-center me-3 mt-2"
                onClick={() => handleDelete(task.id)}
              >
                <span className="me-2">Delete</span>
                <FiTrash2
                  className="text-white"
                  style={{ cursor: "pointer" }}
                />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal for editing task */}
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

      {/* Toast notification container */}
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        closeButton={true}
        toastClassName="custom-toast"
      />
    </Layout>
  );
};
