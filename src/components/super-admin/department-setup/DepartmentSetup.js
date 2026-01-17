// src/components/super-admin/department-setup/DepartmentSetup.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DepartmentSetup.css';

const DepartmentSetup = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [stats, setStats] = useState({
    departments: 0,
    examCenters: 0,
    batches: 0,
    controllers: 0,
    students: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const steps = [
    { number: 1, name: 'Add Department', path: '/super-admin/add-department', completed: false },
    { number: 2, name: 'Add Exam Center', path: '/super-admin/add-exam-center', completed: false },
    { number: 3, name: 'Create Batch', path: '/super-admin/create-batch', completed: false },
    { number: 4, name: 'Assign Controller', path: '/super-admin/assign-controller', completed: false },
    { number: 5, name: 'Register Students', path: '/super-admin/register-students', completed: false }
  ];

  useEffect(() => {
    fetchStats();
    loadCurrentStep();
  }, []);

  const loadCurrentStep = () => {
    try {
      const persisted = localStorage.getItem('departmentSetupData');
      if (persisted) {
        const data = JSON.parse(persisted);
        if (data.currentStep) {
          setCurrentStep(data.currentStep);
        }
      }
    } catch (error) {
      console.error('Error loading current step:', error);
    }
  };

  const persistCurrentStep = (stepNumber) => {
    try {
      const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
      const dataToPersist = {
        ...existingData,
        currentStep: stepNumber,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
    } catch (error) {
      console.error('Error persisting current step:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [deptRes, centerRes, batchRes, controllerRes, studentRes] = await Promise.all([
        axios.get('https://www.shorthandonlineexam.in/api/new-department/departments'),
        axios.get('https://www.shorthandonlineexam.in/api/new-department/exam-centers'),
        axios.get('https://www.shorthandonlineexam.in/api/new-department/batches'),
        axios.get('https://www.shorthandonlineexam.in/api/new-department/controllers'),
        axios.get('https://www.shorthandonlineexam.in/api/new-department/students')
      ]);

      const completedSteps = [
        deptRes.data.count > 0,
        centerRes.data.count > 0,
        batchRes.data.count > 0,
        controllerRes.data.count > 0,
        studentRes.data.count > 0
      ];

      const completedCount = completedSteps.filter(Boolean).length;
      setProgress((completedCount / steps.length) * 100);

      setStats({
        departments: deptRes.data.count,
        examCenters: centerRes.data.count,
        batches: batchRes.data.count,
        controllers: controllerRes.data.count,
        students: studentRes.data.count
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setMessage('Error loading setup progress');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueSetup = () => {
    const targetStep = steps.find(step => step.number === currentStep);
    if (targetStep) {
      navigate(targetStep.path);
    } else {
      const firstIncomplete = steps.find(step => !step.completed);
      navigate(firstIncomplete?.path || '/super-admin/add-department');
    }
  };

  const handleStartStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    persistCurrentStep(stepNumber);
    const targetStep = steps.find(step => step.number === stepNumber);
    if (targetStep) {
      navigate(targetStep.path);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This will clear all form data.')) {
      localStorage.removeItem('departmentSetupData');
      setCurrentStep(1);
      setProgress(0);
      setMessage('Progress reset successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Container className="my-4">
      <div className="text-center mb-4">
        <h2>Department Setup & Exam Flow</h2>
        <p className="text-muted">Complete the setup process step by step to conduct exams</p>
      </div>

      {message && (
        <Alert variant="info" className="mb-4">
          {message}
        </Alert>
      )}

      {/* Progress Section */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Setup Progress</h4>
          {progress > 0 && (
            <Button variant="outline-danger" size="sm" onClick={handleResetProgress}>
              Reset Progress
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <ProgressBar 
              now={progress} 
              label={`${Math.round(progress)}%`} 
              variant={progress === 100 ? 'success' : 'primary'}
              animated={progress < 100}
            />
            <div className="mt-2 text-muted small">
              Current Step: {steps.find(s => s.number === currentStep)?.name || 'Not Started'}
            </div>
          </div>
          
          <Row className="text-center">
            <Col>
              <div className="stat-card">
                <h5>{stats.departments}</h5>
                <small>Departments</small>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <h5>{stats.examCenters}</h5>
                <small>Exam Centers</small>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <h5>{stats.batches}</h5>
                <small>Batches</small>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <h5>{stats.controllers}</h5>
                <small>Controllers</small>
              </div>
            </Col>
            <Col>
              <div className="stat-card">
                <h5>{stats.students}</h5>
                <small>Students</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col className="text-center">
          {progress === 0 ? (
            <Button variant="primary" size="lg" onClick={() => handleStartStep(1)}>
              Start Setup Process
            </Button>
          ) : progress < 100 ? (
            <Button variant="warning" size="lg" onClick={handleContinueSetup}>
              Continue Setup (Step {currentStep} of {steps.length})
            </Button>
          ) : (
            <Button variant="success" size="lg" onClick={() => navigate('/super-admin/register-students')}>
              Setup Complete - Register More Students
            </Button>
          )}
        </Col>
      </Row>

      {/* Steps Overview */}
      <Row>
        {steps.map((step) => (
          <Col key={step.number} md={6} lg={4} className="mb-3">
            <Card 
              className={`step-card h-100 ${step.number <= currentStep ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleStartStep(step.number)}
            >
              <Card.Body className="text-center">
                <div className={`step-number ${
                  step.number < currentStep ? 'bg-success' : 
                  step.number === currentStep ? 'bg-primary' : 'bg-secondary'
                }`}>
                  {step.number}
                </div>
                <h6 className="mt-3">{step.name}</h6>
                <small className="text-muted">
                  {step.number === 1 && 'Create department with credentials and logo'}
                  {step.number === 2 && 'Define exam centers with PC capacity'}
                  {step.number === 3 && 'Schedule batches with dates and timings'}
                  {step.number === 4 && 'Assign controllers to batch-center combinations'}
                  {step.number === 5 && 'Register students with all dependencies'}
                </small>
                {step.number === currentStep && (
                  <div className="mt-2">
                    <small className="text-primary">● Current Step</small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DepartmentSetup;