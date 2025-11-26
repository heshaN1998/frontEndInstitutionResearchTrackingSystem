import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { projectService } from '../../services/projectService';
import { ProjectFormData, ProjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';


const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    summary: '',
    status: ProjectStatus.PLANNING,
    piId: user?.id || '',
    tags: '',
    startDate: '',
    endDate: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      setLoading(true);
      const project = await projectService.getProjectById(projectId);
      setFormData({
        title: project.title,
        summary: project.summary,
        status: project.status,
        piId: project.piId,
        tags: project.tags,
        startDate: project.startDate,
        endDate: project.endDate || '',
      });
    } catch (err: any) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit && id) {
        await projectService.updateProject(id, formData);
      } else {
        await projectService.createProject(formData);
      }
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>{isEdit ? 'Edit Project' : 'Create New Project'}</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter project title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Summary *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="Brief description of the project"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value={ProjectStatus.PLANNING}>Planning</option>
                <option value={ProjectStatus.ACTIVE}>Active</option>
                <option value={ProjectStatus.ON_HOLD}>On Hold</option>
                <option value={ProjectStatus.COMPLETED}>Completed</option>
                <option value={ProjectStatus.ARCHIVED}>Archived</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="AI, Machine Learning, Education (comma separated)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date *</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : (isEdit ? 'Update' : 'Create')}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/projects')}>
                Cancel
              </Button>
            </div>
          </Form>
         
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectForm;