import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Badge, Button, Tabs, Tab, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext';


const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isPI, user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const data = await projectService.getProjectById(projectId);
      setProject(data);
    } catch (err: any) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.deleteProject(id);
      navigate('/projects');
    } catch (err: any) {
      setError('Failed to delete project');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    try {
      await projectService.updateProjectStatus(id, newStatus);
      loadProject(id);
    } catch (err: any) {
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      PLANNING: 'secondary',
      ACTIVE: 'primary',
      ON_HOLD: 'warning',
      COMPLETED: 'success',
      ARCHIVED: 'dark'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error || 'Project not found'}</Alert>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </Container>
    );
  }

  const canEdit = isAdmin || (isPI && project.piId === user?.id);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h3>{project.title}</h3>
            <Badge bg={getStatusColor(project.status)}>{project.status}</Badge>
          </div>
          <div className="d-flex gap-2">
            {canEdit && (
              <>
                <Link to={`/projects/${id}/edit`}>
                  <Button variant="outline-primary" size="sm">Edit</Button>
                </Link>
                {isAdmin && (
                  <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                    Delete
                  </Button>
                )}
              </>
            )}
            <Link to="/projects">
              <Button variant="secondary" size="sm">Back</Button>
            </Link>
          </div>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>Summary</h5>
              <p>{project.summary}</p>

              {project.tags && (
                <div className="mb-3">
                  <h6>Tags</h6>
                  {project.tags.split(',').map((tag, idx) => (
                    <Badge key={idx} bg="info" className="me-1">{tag.trim()}</Badge>
                  ))}
                </div>
              )}
            </Col>

            <Col md={4}>
              <Card bg="light">
                <Card.Body>
                  <h6>Project Information</h6>
                  <p className="mb-2">
                    <strong>PI:</strong> {project.piName}
                  </p>
                  <p className="mb-2">
                    <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                  </p>
                  {project.endDate && (
                    <p className="mb-2">
                      <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="mb-2">
                    <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  {project.updatedAt && (
                    <p className="mb-0">
                      <strong>Updated:</strong> {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </Card.Body>
              </Card>

              {canEdit && (
                <Card bg="light" className="mt-3">
                  <Card.Body>
                    <h6>Quick Actions</h6>
                    <div className="d-grid gap-2">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleStatusChange('ACTIVE')}
                      >
                        Set Active
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-warning"
                        onClick={() => handleStatusChange('ON_HOLD')}
                      >
                        Set On Hold
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-success"
                        onClick={() => handleStatusChange('COMPLETED')}
                      >
                        Mark Completed
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <hr className="my-4" />

         
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectDetails;