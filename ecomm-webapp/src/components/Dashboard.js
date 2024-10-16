import React, { useState, useEffect } from 'react';
import './styleDashboard.css';
import { Container, Row, Col, Card, Form, InputGroup, Button, Navbar, Nav } from 'react-bootstrap';

// Custom CSS for the color palette
const customStyles = {
    bodyBackground: { backgroundColor: '#DBE7C9', minHeight: '100vh' },
    cardBackground: { backgroundColor: '#789461', color: 'white' }, 
    navbarBackground: { backgroundColor: '#294B29' }, 
    buttonBackground: { backgroundColor: '#50623A', borderColor: '#50623A', color: 'white' }
};

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');

    // Testing product data
    const productData = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 1200 },
        { id: 2, name: 'Headphones', category: 'Electronics', price: 150 },
        { id: 3, name: 'T-shirt', category: 'Clothing', price: 20 },
        { id: 4, name: 'Running Shoes', category: 'Footwear', price: 80 },
        // Add more products as needed
    ];

    useEffect(() => {
        setProducts(productData);
    }, []);

    // Filter and search logic
    const filteredProducts = products.filter(product => {
        return (
            (product.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (category === 'All' || product.category === category)
        );
    });

    return (
        <div style={customStyles.bodyBackground}>
            {/* Navbar */}
            <Navbar expand="lg" variant="dark" style={customStyles.navbarBackground}>
                <Container>
                    <Navbar.Brand href="#">Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            <Nav.Link href="#" style={{ color: 'white' }}>Dashboard</Nav.Link>
                            <Nav.Link href="#" style={{ color: 'white' }}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Search and Filter Section */}
            <Container>
                <Row className="my-3">
                    <Col md={6}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <Button variant="primary" style={customStyles.buttonBackground}>Search</Button>
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Footwear">Footwear</option>
                        </Form.Select>
                    </Col>
                </Row>

                {/* Product List */}
                <Row>
                    {filteredProducts.map(product => (
                        <Col md={4} key={product.id} className="my-2">
                            <Card style={customStyles.cardBackground}>
                                <Card.Body>
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-white">
                                        Category: {product.category}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        Price: ${product.price}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
