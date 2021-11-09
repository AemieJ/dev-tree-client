import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server";
import login from '../public/login.svg'
import Image from 'next/image'
import { Col, Row, Form, Button, Modal, ModalBody } from 'react-bootstrap'
import styles from '../styles/Auth.module.css'
import { useState } from 'react'
import Link from 'next/link'

// TODO: forgot password flow integration is left

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showForgot, setShowForgot] = useState(false)

    const setAllNull = () => {
        setEmail('')
        setPassword('')
    }

    const verifyData = () => {
        if (password.length >= 6 && password.length <= 256) {
            return true
        } else {
            return false
        }
    }

    const loginUser = async (e) => {
        e.preventDefault()

        if (name.length === 0 || password.length === 0) {
            toast.notify('Form is incomplete', {
                duration: 5,
                type: "error"
              })
        } else {
            let valid = verifyData()
            if (valid) {
                let body = {
                    email, password
                }
                
                const res = await fetch(`${server}/api/login`, {
                    method: "post",
                    body: JSON.stringify(body),
                });
    
                const { data, err } = await res.json()
                if (err) {
                    toast.notify(err, {
                        duration: 5,
                        type: "error"
                    })
                } else {
                    let parsed = JSON.parse(data)
                    let accessToken = parsed.msg.accessToken.token
                    localStorage.setItem("acessToken", accessToken)
                    localStorage.setItem("isLogged", 1)
                    toast.notify('Successful Login', {
                        duration: 5,
                        type: "success"
                    })
                    setTimeout(location.href = "/dashboard", 8000)
                }
            } else {
                toast.notify('Data filled is invalid', {
                    duration: 5,
                    type: "error"
                })
            }
        }

    }

    return (
        <>
            <Head>
                <title>DevTree - Register</title>
                <meta name="description" content="DevTree is a tree view just for developers" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Row className={styles.main}>
                <Col className={styles.image}><Image src={login} className={styles.login_image} /></Col>
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
                                className={styles.form_control}
                                value={email}
                                onChange={e => { setEmail(e.target.value) }} />
                        </Form.Group>

                        {
                            !showForgot ? <>
                                <Form.Group className={`mb-3`} controlId="formBasicPassword">
                                    <Form.Label><b>Password</b></Form.Label>
                                    <Form.Control type="password" placeholder="*********"
                                        className={styles.form_control}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value) }} />
                                </Form.Group>
                                <div className={styles.btn_grp}>
                                    <Button variant="primary" type="submit" 
                                    className={styles.submit}
                                    onClick={loginUser}>
                                        Login
                        </Button>
                                    <div className={styles.btn_description}><Button
                                        className={styles.forgot_pass_btn}
                                        onClick={() => { setShowForgot(true) }}
                                    >Forgot Password?</Button></div>
                                </div>
                            </> :
                                <>
                                    <Button variant="primary" type="submit"
                                        className={styles.submit}
                                        onClick={() => { setShowForgot(false) }}
                                    >
                                        Send Mail
                        </Button>
                                </>
                        }


                    </Form>
                </Col>
            </Row>

            <ToastContainer />

        </>
    )
}