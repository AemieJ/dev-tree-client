import Head from 'next/head'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server.js";
import login from '../public/login.svg'
import Image from 'next/image'
import {
    Col, Row, Form, Button, Dropdown,
    DropdownButton, InputGroup, FormControl
} from 'react-bootstrap'
import styles from '../styles/RegisterTree.module.css'
import { useState, useEffect } from 'react'


export default function RegisterTreeNFT() {
    const [accessToken, setAccessToken] = useState(null)
    const [email, setEmail] = useState(null)
    const [id, setID] = useState('youtube')
    const [idName, setIDName] = useState('')
    const [first, setFirst] = useState('')
    const [second, setSecond] = useState('')
    const [third, setThird] = useState('')

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

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const addPersonalID = async (e) => {
        e.preventDefault()
        let list = []
        if (first !== '') list.push(first)
        if (second !== '') list.push(second)
        if (third !== '') list.push(third)

        let length = list.length
        let finalList = []
        let status = true
        for (let i = 0; i < length; ++i) {
            status = await approveID(list[i])
            if (!status && list[i] !== "") {
                toast.notify('URL isn\'t valid', {
                    duration: 5,
                    type: "error"
                })
                window.location.reload()
            } else {
                if (list[i] !== "") finalList.push(list[i])
            }
        }

        status = await approveID(idName)
        if (!status) {
            toast.notify('URL isn\'t valid', {
                duration: 5,
                type: "error"
            })
            window.location.reload()
        } else {
            let obj = {
                id: idName, 
                list: finalList,
                account: id
            }
    
            let body = {
                email, 
                body: obj,
                accessToken
            }
    
            let res = await fetch(`${server}/api/addPersonalID`, {
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
                if (parsed.status === 403) {
                    let token = parsed.accessToken.token
                    setAccessToken(token)
                    localStorage.setItem("accessToken", token)
                    body.accessToken = token
    
                    res = await fetch(`${server}/api/addPersonalID`, {
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
                        toast.notify('Personal ID has been added', {
                            duration: 5,
                            type: "success"
                        })
                        setTimeout(window.location.href = `/profile/${email}/${token}`, 8000)
                    }
                } else {
                    toast.notify('Personal ID has been added', {
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
                <Col className={styles.image}><Image src={login} className={styles.login_image} /></Col>
                <Col sm={12} lg={true}>
                    <div>
                        <div className={styles.title}>Insertion of ID 🚀</div>
                        <div className={styles.description}>Here, the ID along with the list of channels
                                can be included. Insert your ID to include in your tree view.</div>
                    </div>
                    <Form auto="new-password" className={styles.form}>
                        <Form.Group className="mb-3">
                            <Form.Label><b>ID of channel</b></Form.Label>
                            <InputGroup className="mb-3">
                                <DropdownButton
                                    title={capitalizeFirstLetter(id)}
                                    align="end"
                                >
                                    <Dropdown.Item href="#"
                                        className={styles.drop_item}
                                        active={id === 'youtube'}
                                        onClick={() => {
                                            setID('youtube')
                                        }}>Youtube</Dropdown.Item>
                                </DropdownButton>
                                <FormControl
                                    placeholder="Enter User ID Link"
                                    className={styles.input}
                                    required={true}
                                    value={idName}
                                    onChange={(e) => {setIDName(e.target.value)}}
                                />
                            </InputGroup>

                        </Form.Group>

                        <Form.Group className={`mb-3`}>
                            <Form.Label><b>List of channels</b></Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text
                                className={styles.list_id_text}>1</InputGroup.Text>
                                <FormControl
                                    placeholder="Enter first channel link"
                                    type="text"
                                    className={styles.input}
                                    value={first}
                                    onChange={(e) => {setFirst(e.target.value)}}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text
                                className={styles.list_id_text}>2</InputGroup.Text>
                                <FormControl
                                    placeholder="Enter second channel link"
                                    className={styles.input}
                                    type="text"
                                    value={second}
                                    onChange={(e) => {setSecond(e.target.value)}}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text
                                className={styles.list_id_text}>3</InputGroup.Text>
                                <FormControl
                                    placeholder="Enter third channel link"
                                    className={styles.input}
                                    type="text"
                                    value={third}
                                    onChange={(e) => {setThird(e.target.value)}}
                                />
                            </InputGroup>
                        </Form.Group>
                        <div className={styles.btn_grp}>
                            <Button variant="primary" type="submit"
                                className={styles.submit}
                                onClick={addPersonalID}>
                                Add ID
                        </Button>
                        </div>


                    </Form>
                </Col>
            </Row>

            <ToastContainer />

        </>
    )
}