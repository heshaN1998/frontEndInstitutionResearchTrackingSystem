import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { projectService } from '../../services/projectService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const projects = await projectService.getAllProjects();
      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
        completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
      });
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Welcome, {user?.fullName}!</h2>
      
      <Row>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <h1 className="text-primary">{stats.totalProjects}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <h1 className="text-success">{stats.activeProjects}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Projects</Card.Title>
              <h1 className="text-info">{stats.completedProjects}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Card.Header>
          <h4>Quick Links</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-grid gap-2">
            <a href="/projects" className="btn btn-outline-primary">View All Projects</a>
            {(user?.role === 'ADMIN' || user?.role === 'PI') && (
              <a href="/projects/create" className="btn btn-outline-success">Create New Project</a>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;