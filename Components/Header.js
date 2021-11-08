import { Navbar, Container, Nav } from 'react-bootstrap'
import styles from '../styles/Header.module.css'

const Header = () => {
    return (
        <Navbar className={styles.navbar} bg="light" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand href="/" className={styles.mainLink}>DevTree</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className={`${styles.navbar_toggler} ${styles.navbar_toggler_icon}`} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                            <Nav.Link href="/" className={styles.link}>Home</Nav.Link>
                            <Nav.Link href="/#about" className={styles.link}>About</Nav.Link>
                            <Nav.Link href="/dashboard" className={styles.link}>Dashboard</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                            <Nav.Link href="/register" className={styles.link}>Register</Nav.Link>
                            <Nav.Link href="/login" className={styles.login_link}>Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;