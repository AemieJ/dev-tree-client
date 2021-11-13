import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server";
import login from '../public/login.svg'
import Image from 'next/image'
import { Col, Row, Form, Button, Modal, ModalBody } from 'react-bootstrap'
import styles from '../styles/Auth.module.css'
import { useState } from 'react'
import Link from 'next/link'


export default function ResetPassword({ mail }) {
    const [email, setEmail] = useState(mail)
    const [password, setPassword] = useState('')
    const [rePass, setRePass] = useState('')

    const setAllNull = () => {
        setPassword('')
        setRePass('')
    }

    const verifyData = () => {
        if (password.length >= 6 && password.length <= 256) {
            return true
        } else {
            return false
        }
    }

    const updatePass = async(e) => {
        e.preventDefault()
        let verified = verifyData()

        if (password !== rePass) {
            toast.notify('Password don\'t match', {
                duration: 5,
                type: 'error'
            })
            setTimeout(setAllNull, 8000)
        } else {
            if (!verified) {
                toast.notify('Data isn\'t valid', {
                    duration: 5,
                    type: 'error'
                })
                setTimeout(setAllNull, 8000)
            } else {
                if (password.length === 0 || rePass.length === 0) {
                    toast.notify('Form is incomplete', {
                        duration: 5,
                        type: 'error'
                    })
                    setTimeout(setAllNull, 8000)
                } else {
                    let body = {
                        email, password, rePass
                    }
                    
                    const res = await fetch(`${server}/api/updatePass`, {
                        method: "post",
                        body: JSON.stringify(body)
                    })
    
                    const { data, err } = await res.json()
                    
                    if (err) {
                        toast.notify(err, {
                            duration: 5,
                            type: 'error'
                        })
                        setTimeout(setAllNull, 8000)
                    } else {
                        toast.notify('Login with the new credentials', {
                            duration: 5,
                            type: 'success'
                        })
    
                        setTimeout(window.location.href = "/login", 8000)
                    }
                }
            }
        }
        
    }

    return (
        <>
            <Head>
                <title>DevTree - Reset Password</title>
                <meta name="description" content="DevTree is a tree view just for developers" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Row className={styles.main}>
                <Col className={styles.image}><Image src={login} className={styles.login_image} /></Col>
                <Col sm={12} lg={true}>
                    <div className={styles.title}>Reset Password ⚒️</div>
                    <div className={styles.description}>{"Let's reset"} your password so we can help you login 
                    to the platform with ease.
                </div>
                    <Form auto="new-password" className={styles.form}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label><b>Email ID</b></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                className={styles.form_control}
                                disabled
                                value={email}
                                onChange={e => { setEmail(e.target.value) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label><b>Password</b></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="*********"
                                className={styles.form_control}
                                value={password}
                                onChange={e => { setPassword(e.target.value) }} />
                        </Form.Group>

                        <Form.Group className={`mb-3`} controlId="formBasicPassword">
                                    <Form.Label><b>Re-write Password</b></Form.Label>
                                    <Form.Control type="password" 
                                        placeholder="*********"
                                        className={styles.form_control}
                                        value={rePass}
                                        onChange={e => { setRePass(e.target.value) }} />
                                </Form.Group>
                                <div className={styles.btn_grp}>
                                    <Button variant="primary" type="submit" 
                                    className={styles.submit}
                                    onClick={updatePass}
                                    >
                                        Update Password
                        </Button>
                        </div>
                    </Form>
                </Col>
            </Row>

            <ToastContainer />

        </>
    )
}