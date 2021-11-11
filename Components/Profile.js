import { Card, Col, Row } from 'react-bootstrap'
import styles from '../styles/Profile.module.css'

const Profile = ({ user }) => {
    return (
        <Row xs={1} md={1} lg={1} className={`g-4`}>
            <Col>
                <Card className={styles.card}>
                <Card.Img variant="top" src={user.profile} className={styles.card_img} />
                    <Card.Body>
                        <p><b>The card in display showcases the essential information regarding the developer's 
                        detail.</b></p>
                        <div className={styles.info}>
                        <Card.Title className={styles.card_title}>📌 Name: &nbsp;</Card.Title>
                        <Card.Subtitle className={styles.card_subtitle}>{user.name}</Card.Subtitle>
                        </div>
                        <div className={styles.info}>
                        <Card.Title className={styles.card_title}>📌 Email: &nbsp;</Card.Title>
                        <Card.Subtitle className={styles.card_subtitle}
                        >{user.email}</Card.Subtitle>
                        </div>
                        <div className={styles.info}>
                            <Card.Title className={styles.card_title}>📌 Gender: &nbsp;</Card.Title>
                            <Card.Subtitle className={styles.card_subtitle}>{user.gender}</Card.Subtitle>
                        </div> 
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Profile;