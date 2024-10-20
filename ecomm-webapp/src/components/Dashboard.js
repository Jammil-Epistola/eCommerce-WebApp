import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Navbar, Nav, Modal } from 'react-bootstrap';

const customStyles = {
    bodyBackground: { backgroundColor: '#DBE7C9', minHeight: '100vh' },
    cardBackground: { backgroundColor: '#789461', color: 'white' }, 
    navbarBackground: { backgroundColor: '#294B29' }, 
    buttonBackground: { backgroundColor: '#50623A', borderColor: '#50623A', color: 'white' },
    redButton: { backgroundColor: 'red', borderColor: 'red', color: 'white' },
    blueButton: { backgroundColor: 'blue', borderColor: 'blue', color: 'white' }
};

const Dashboard = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // For edit product
    const [deletingProduct, setDeletingProduct] = useState(null); // For delete confirmation
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Electronics',  // Default category
        price: ''
    });

    // Fetch products from Laravel API
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/products')  
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleAddProduct = () => {
        setNewProduct({ name: '', category: 'Electronics', price: '' }); // Reset form
        setEditingProduct(null); // Ensure we are not in editing mode
        setShowModal(true); // Show the modal when 'Add Product' button is clicked
    };

    const handleSaveProduct = () => {
        // Validate the input
        if (!newProduct.name || !newProduct.price) {
            alert('Please fill in all fields');
            return;
        }

        const url = editingProduct
            ? `http://127.0.0.1:8000/api/products/${editingProduct.id}`
            : 'http://127.0.0.1:8000/api/products';

        const method = editingProduct ? 'PUT' : 'POST';

        // Send new/updated product data to Laravel backend
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            if (editingProduct) {
                setProducts(products.map(product => (product.id === data.id ? data : product)));
            } else {
                setProducts([...products, data]);
            }
            setShowModal(false); // Close the modal after successful submission
            setNewProduct({ name: '', category: 'Electronics', price: '' }); // Reset the form
        })
        .catch(error => console.error('Error saving product:', error));
    };

    const handleEditProduct = (product) => {
        setNewProduct(product); // Populate form with the selected product
        setEditingProduct(product); // Set editing state
        setShowModal(true); // Show modal for editing
    };

    const handleDeleteProduct = (product) => {
        setDeletingProduct(product); // Store product for deletion confirmation
    };

    const confirmDeleteProduct = () => {
        fetch(`http://127.0.0.1:8000/api/products/${deletingProduct.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setProducts(products.filter(product => product.id !== deletingProduct.id));
            setDeletingProduct(null); // Close delete confirmation modal
        })
        .catch(error => console.error('Error deleting product:', error));
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingProduct(null); // Reset edit state when modal is closed
    };

    const handleDeleteModalClose = () => setDeletingProduct(null); // Close delete modal

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
                            <Nav.Link onClick={onLogout} style={{ color: 'white' }}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Search and Filter Section */}
            <Container>
                <Row className="my-3">
                    <Col md={5}>
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
                    <Col md={4}>
                        <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Footwear">Footwear</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Button variant="success" onClick={handleAddProduct} style={customStyles.buttonBackground}>
                            + Add Product
                        </Button>
                    </Col>
                </Row>

                {/* Product List */}
                <Row>
                    {filteredProducts.length === 0 ? (
                        <Col md={12}>
                            <Card style={customStyles.cardBackground}>
                                <Card.Body>No products found</Card.Body>
                            </Card>
                        </Col>
                    ) : (
                        filteredProducts.map(product => (
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
                                        {/* Edit and Delete Buttons */}
                                        <Button 
                                            onClick={() => handleEditProduct(product)} 
                                            style={customStyles.blueButton} 
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            onClick={() => handleDeleteProduct(product)} 
                                            style={customStyles.redButton}
                                        >
                                            Delete
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                {/* Add/Edit Product Modal */}
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="productName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter product name"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="productCategory" className="mt-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Footwear">Footwear</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="productPrice" className="mt-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Enter price"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveProduct}>
                            {editingProduct ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal show={!!deletingProduct} onHide={handleDeleteModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete "{deletingProduct?.name}"?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteModalClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteProduct}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default Dashboard;
