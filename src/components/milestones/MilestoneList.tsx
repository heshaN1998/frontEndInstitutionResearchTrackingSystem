import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { milestoneService } from '../../services/milestoneService';
import { Milestone } from '../../types';
import MilestoneForm from './MilestoneForm';

interface MilestoneListProps {
  projectId: string;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ projectId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    try {
      const data = await milestoneService.getMilestonesByProject(projectId);
      setMilestones(data);
    } catch (err: any) {
      setError('Failed to load milestones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await milestoneService.deleteMilestone(id);
      loadMilestones();
    } catch (err: any) {
      setError('Failed to delete milestone');
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMilestone(null);
    loadMilestones();
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Milestones</h5>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          Add Milestone
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm && (
        <MilestoneForm
          projectId={projectId}
          milestone={editingMilestone}
          onClose={handleFormClose}
        />
      )}

      {milestones.length === 0 ? (
        <Alert variant="info">No milestones yet. Create one to get started!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone) => (
              <tr key={milestone.id}>
                <td>{milestone.title}</td>
                <td>{milestone.description}</td>
                <td>{new Date(milestone.dueDate).toLocaleDateString()}</td>
                <td>
                  {milestone.isCompleted ? (
                    <Badge bg="success">Completed</Badge>
                  ) : (
                    <Badge bg="warning">Pending</Badge>
                  )}
                </td>
                <td>{milestone.createdByName}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(milestone)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(milestone.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MilestoneList;