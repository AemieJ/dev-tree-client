import Image from 'next/image'
import notFound from '../public/404.svg'
import { Col, Button } from 'react-bootstrap'
import styles from '../styles/404.module.css'

export default function PassErr() {
    return (
        <>
        <div className={styles.main}>
        <Col lg={6}><Image src={notFound} /></Col>
        <Col className={styles.title}><b>This {"isn't"} a valid URL! </b><br/>
        {"Don't worry"}, we will send you back to the safe place.</Col>
        <Button className={styles.home_btn}
        onClick={() => {window.location.href = '/'}}>Take me Home &nbsp; 🚀</Button>
        </div>
        </>
    )
}