import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../../../../config/server.js";
import { Row, Col, Button, Badge } from 'react-bootstrap'
import styles from '../../../../styles/Profile.module.css'
import ProfileView from '../../../../Components/Profile.js'
import Personal from '../../../../Components/Personal.js'

export default function Profile({ err, mail, sender, data, personal }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [profile, setProfile] = useState('')
    const [personalID, setPersonal] = useState(null)

    useEffect(() => {
        setEmail(mail)
        if (data !== undefined) {
            setName(data.name)
            setGender(data.gender)
            setProfile(data.profile)
        }

        if (personal !== null && personal !== undefined) {
            setPersonal(personal)
        }
     })

    return (
        <>
            <Row className={styles.container}>
                <Col lg={3} sm={0} md={3} className={styles.sidebar}>
                    <Button className={styles.sidebar_btn}
                        onClick={() => {
                            document.querySelector('#user').scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}>User</Button>
                    <Button className={styles.sidebar_btn}
                        onClick={() => {
                            document.querySelector('#tree').scrollIntoView({
                                behavior: 'smooth'
                            });
                        }}>Tree View</Button>
                </Col>
                <Col>
                    {
                        sender !== "null" ? <Button>Add to bookmark</Button> : <></>
                    }
                    
                    <div id="user"><h1>User's Details</h1>
                        <p>This is the section that covers the detail of your profile. Within here,
                        your name, email, gender and profile (avatar) is displayed which will be showcased
                            publicly by any user.</p>
                        <ProfileView user={{ name: data.name, email: mail, gender: data.gender, profile: data.profile }} 
                        isLoggedUser={mail === sender}/>
                    </div>
                    <div id="tree"><h1>Tree View</h1>
                        <p>The tree comprises of the collection of major id and the list which will be showcased
                        on your profile publicly everytime a user views your profile. However, as the authenticated
                                owner, you can delete the id or update the list as per your convinience.</p>
                        {
                            personalID === null ? <><Badge bg="warning" text="dark">
                            No tree view has been created by the user yet
                          </Badge></>
                                : <><Personal personal={personalID} 
                                isLoggedUser={mail === sender}/></>
                        }
                    </div>
                </Col>
            </Row>
            <ToastContainer />
        </>
    )
}

export const getServerSideProps = async (context) => {
    let email = context.query.email
    let sender = context.query.sender

    let res = await fetch(`${server}/api/fetchProfile`, {
        method: "post",
        body: email
    })
    let { data, err } = await res.json()
    if (err) {
        return {
            props: {
                err,
                mail: "",
                sender: sender,
                data: "",
                personal: null,
            }
        }
    }

    let parsed = JSON.parse(data)

    res = await fetch(`${server}/api/fetchPersonal`, {
        method: "post",
        body: email
    })

    let data2 = await res.json()
    data = data2.data
    err = data2.err

    let parsed1 = JSON.parse(data)

    if (err) {
        return {
            props: {
                err: null,
                mail: email,
                sender: sender,
                data: parsed,
                personal: null
            }
        }
    }

    return {
        props: {
            err: null,
            mail: email,
            sender: sender,
            data: parsed,
            personal: parsed1.id
        }
    }
}