import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Submit.css';
import { ArrowLeft } from 'lucide-react';

const SubmitPage = () => {
  const { projectId, name } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState('');
  const [checkedTasks, setCheckedTasks] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const filteredTasks = allTasks.filter(
      task =>
        task.projectId === projectId &&
        task.assignedto?.toLowerCase() === name?.toLowerCase()
    );

    setTasks(filteredTasks);
  }, [projectId, name]);

  const handleCheck = (taskName) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskName]: !prev[taskName]
    }));
  };

  const handleSubmit = () => {
    const total = tasks.length;
    const selected = tasks.filter(task => checkedTasks[task.task]).length;

    let newStatus = 'Pending';
    if (selected === total) newStatus = 'Completed';
    else if (selected > 0) newStatus = 'In Progress';

    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = allTasks.map(task => {
      if (
        task.projectId === projectId &&
        task.assignedto?.toLowerCase() === name?.toLowerCase()
      ) {
        return {
          ...task,
          status: newStatus,
          github: link
        };
      }
      return task;
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    navigate(`/user/${name}/tasks`);
  };

  if (tasks.length === 0) return <p>Task not found</p>;

  return (
    <div className="submit-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
      </div>

      <h2>Submit Tasks for Project</h2>
      <form className="submit-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Project:</label>
          <input type="text" value={tasks[0]?.name || ''} readOnly />
        </div>

        <div>
          <label>Due Dates:</label>
          <input
            type="text"
            value={tasks.map(t => t.duedate).join(', ')}
            readOnly
          />
        </div>

        <div>
          <label>Tasks:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {tasks.map(task => (
              <label key={task.task}>
                <input
                  type="checkbox"
                  checked={checkedTasks[task.task] || false}
                  onChange={() => handleCheck(task.task)}
                />
                {task.task}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>GitHub Link:</label>
          <input
            type="url"
            placeholder="Enter GitHub link"
            value={link}
            onChange={e => setLink(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default SubmitPage;
