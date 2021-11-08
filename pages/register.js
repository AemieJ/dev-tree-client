import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import register from '../public/register.svg'
import Image from 'next/image'
import { Col, Row, Form, Button } from 'react-bootstrap'
import styles from '../styles/Auth.module.css'
import { useState } from 'react'
import Link from 'next/link'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('male')
    const [password, setPassword] = useState('')

    return (
        <>
        <Head>
            <title>DevTree - Register</title>
            <meta name="description" content="DevTree is a tree view just for developers" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer />

        <Row className={styles.main}>
            <Col sm={12} lg={true}>
                <div>
                    <div className={styles.title}>Join us & grow!</div>
                    <div className={styles.description}>Just easily fill up the form in a few seconds, 
                    and you will be part of the dev-tree family where <b>you grow as a developer and help others to grow</b> as 
                    well by improvizing your tree view</div>
                </div>
                <Form autoComplete="new-password" className={styles.form}>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label><b>Developer's Name</b></Form.Label>
                        <Form.Control type="text" 
                        placeholder="eg. Aemie Jariwala" 
                        className={styles.form_control}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label><b>Email address</b></Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="name@example.com" 
                        className={styles.form_control}
                        autoComplete="new-password"/>
                    </Form.Group>

                    <Form.Label><b>Gender</b></Form.Label>
                    <div key={`inline-radio`} className="mb-3" className={styles.form_control}>
                    <Form.Check
                        inline
                        label="male"
                        name="group1"
                        type="radio"
                        id="male"
                        defaultChecked
                    />
                    <Form.Check
                        inline
                        label="female"
                        name="group1"
                        type="radio"
                        id="female"
                    />
                    </div>

                    <div className={styles.password_sec}>
                        <Form.Group className={`mb-3`} controlId="formBasicPassword">
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control type="password" placeholder="*********" className={styles.form_control}/>
                        </Form.Group>
                        <Form.Group className={`mb-3 ${styles.password}`} controlId="formBasicRePassword">
                            <Form.Label><b>Re-enter Password</b></Form.Label>
                            <Form.Control type="password" placeholder="*********" className={styles.form_control}/>
                        </Form.Group>
                    </div>
                    <div className={styles.btn_grp}>
                        <Button variant="primary" type="submit" className={styles.submit}>
                        Register
                        </Button>
                        <div className={styles.btn_description}>Have an account? <br/> <b><Link href="/login">Login In</Link></b></div>
                    </div>

                </Form>
            </Col>
            <Col className={styles.image}><Image src={register} /></Col>
        </Row>

        </>
    )
}