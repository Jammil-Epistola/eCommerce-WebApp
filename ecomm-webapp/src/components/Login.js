import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import './Login.css'; 

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (email === 'admin@gmail.com' && password === 'password') {
      onLogin();
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <Container style={{ minHeight: '100vh', backgroundColor: '#DBE7C9' }}>
      <Card className="mx-auto my-5" style={{ width: '300px', backgroundColor: '#789461', color: 'white' }}>
        <Card.Body>
          <Card.Title className="text-center">Login</Card.Title>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <Button variant="primary" type="submit" style={{ backgroundColor: '#50623A', borderColor: '#50623A' }}>
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;

