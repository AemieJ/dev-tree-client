import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import login from '../public/login.svg'
import Image from 'next/image'
import { Col, Row, Form, Button, Modal, ModalBody } from 'react-bootstrap'
import styles from '../styles/Auth.module.css'
import { useState } from 'react'
import Link from 'next/link'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showForgot, setShowForgot] = useState(false)

    return (
        <>
        <Head>
            <title>DevTree - Register</title>
            <meta name="description" content="DevTree is a tree view just for developers" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer />

        <Row className={styles.main}>
            <Col className={styles.image}><Image src={login} className={styles.login_image}/></Col>
            <Col sm={12} lg={true}>
                {
                    !showForgot ? 
                    <div>
                    <div className={styles.title}>Welcome Back 👋🏼</div>
                    <div className={styles.description}>If you're a member of a dev-tree, just login and be free to <b>utilize 
                    all the features</b> of our platform.</div>
                </div> : 
                <div>
                <div className={styles.title}>Forgot Password ❓</div>
                <div className={styles.description}>If you've forgotten the password, just enter an email and a token will 
                be sent to your respective mail.</div>
            </div>
                }
                <Form auto="new-password" className={styles.form}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label><b>Email address</b></Form.Label>
                        <Form.Control 
                        type="email" 
                        placeholder="name@example.com" 
                        className={styles.form_control}/>
                    </Form.Group>

                    {
                        !showForgot ? <>
                        <Form.Group className={`mb-3`} controlId="formBasicPassword">
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control type="password" placeholder="*********" className={styles.form_control}/>
                        </Form.Group>
                    <div className={styles.btn_grp}>
                        <Button variant="primary" type="submit" className={styles.submit}>
                            Login
                        </Button>
                        <div className={styles.btn_description}><Button
                        className={styles.forgot_pass_btn}
                        onClick={() => {setShowForgot(true)}}
                        >Forgot Password?</Button></div>
                    </div>
                        </> : 
                        <>
                        <Button variant="primary" type="submit" 
                        className={styles.submit}
                        onClick={() => {setShowForgot(false)}}
                        >
                            Send Mail
                        </Button> 
                        </>
                    }
                    

                </Form>
            </Col>
        </Row>

        </>
    )
}