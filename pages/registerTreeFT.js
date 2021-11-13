import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server.js";
import register from '../public/register.svg'
import Image from 'next/image'
import {
    Col, Row, Form, Button, InputGroup, FormControl
} from 'react-bootstrap'
import styles from '../styles/RegisterTree.module.css'
import { useState, useEffect } from 'react'


export default function RegisterTreeFT() {
    const [accessToken, setAccessToken] = useState(null)
    const [email, setEmail] = useState(null)
    const [id, setID] = useState('youtube')
    const [idName, setIDName] = useState('')

    useEffect(() => {
        let getItem = localStorage.getItem("accessToken")
        if (getItem !== null && getItem !== undefined) {
            setAccessToken(getItem)
            getItem = localStorage.getItem("email")
            if (getItem !== null && getItem !== undefined) {
                setEmail(getItem)
            } else {
                setEmail(null)
            }
        } else {
            setAccessToken(null)
        }
        
    })

    const approveID = (string) => {
        let url;
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const registerPersonalID = async (e) => {
        e.preventDefault()
        const status = await approveID(idName)

        if (!status) {
            toast.notify('ID Link isn\'t valid', {
                duration: 5,
                type: "error"
            })
            window.location.reload()
        } else {
            let obj;

            if (id === "youtube") {
                obj = {
                    youtubeID: idName, 
                    youtubeList: []
                }
            }

            let body = {
                email, 
                body: obj,
                accessToken
            }

            let res = await fetch(`${server}/api/registerPersonalID`, {
                method: "post",
                body: JSON.stringify(body),
            });
            
            const { data, err} = await res.json()
            if (err) {
                toast.notify(err, {
                    duration: 5,
                    type: "error"
                })
            } else {
                let parsed = JSON.parse(data)
                if (parsed.status === 403) {
                    let token = parsed.accessToken.token
                    setAccessToken(token)
                    localStorage.setItem("accessToken", token)
                    body.accessToken = token
    
                    res = await fetch(`${server}/api/registerPersonalID`, {
                        method: "post",
                        body: JSON.stringify(body),
                    });
    
                    let data2 = await res.json()
                    if (data2.err) {
                        toast.notify(err, {
                            duration: 5,
                            type: "error"
                        })
                    } else {
                        toast.notify('Personal ID has been registered', {
                            duration: 5,
                            type: "success"
                        })
                        setTimeout(window.location.href = `/profile/${email}/${token}`, 8000)
                    }
                } else {
                    toast.notify('Personal ID has been registered', {
                        duration: 5,
                        type: "success"
                    })
                    setTimeout(window.location.href = `/profile/${email}/${accessToken}`, 8000)
                }
            }
        }

    }

    return (
        <>
            <Row className={styles.main}>
                <Col sm={12} lg={true}>
                    <div>
                        <div className={styles.title}>Registration of ID 🚀</div>
                        <div className={styles.description}>As a first time login user, you can register the ID 
                        of each channel here. {"You'll"} be then directed to the profile where you can update the list 
                        for the respective ID. </div>
                    </div>
                    <Form auto="new-password" className={styles.form}>
                        <Form.Group className="mb-3">
                            <Form.Label><b>ID of channel</b></Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text className={styles.input_group_text}>Youtube</InputGroup.Text>
                                <FormControl
                                    placeholder="Enter User ID Link"
                                    className={styles.input}
                                    required={true}
                                    value={idName}
                                    onChange={(e) => {setIDName(e.target.value)}}
                                />
                            </InputGroup>

                        </Form.Group>
                        <div className={styles.btn_grp}>
                            <Button variant="primary" type="submit"
                                className={styles.submit}
                                onClick={registerPersonalID}>
                                Register ID
                        </Button>
                        </div>
                    </Form>
                </Col>
                <Col className={styles.image}><Image src={register} className={styles.login_image} /></Col>
            </Row>

            <ToastContainer />

        </>
    )
}