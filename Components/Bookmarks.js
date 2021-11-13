import React from "react"
import { Row, Card, Col, Button } from 'react-bootstrap'
import styles from '../styles/Bookmarks.module.css'

const Bookmarks = ({ users }) => {
    return (
        <Row xs={1} md={2} lg={3} className={`g-4 ${styles.main}`}>
            {users.map((user) => {
                return (
                    
                        <Col key={user.email}>  
                        <Card className={styles.card}>
                        <Card.Img variant="top" src={user.profile} className={styles.card_img} />
                        <Card.Body>
                            <Card.Title>{user.name}</Card.Title>
                            <Card.Subtitle className={styles.card_subtitle}>{user.email}</Card.Subtitle>
                            <Card.Body className={styles.card_body}>
                            {"The developer's tree"} view is just one click away. 
                            Click the tree view to see the tree view of {user.name}.
                            </Card.Body>
                            <Button variant="primary" className={styles.btn}
                            onClick={(e) => {
                                e.preventDefault()
                                window.location.href = `/tree/${user.email}/${localStorage.getItem("email")}/${localStorage.getItem("accessToken")}`
                            }}
                            >Tree View</Button>
                        </Card.Body>
                    </Card>
                        </Col>
                );
            })}
        </Row>
    );
};

export default Bookmarks;