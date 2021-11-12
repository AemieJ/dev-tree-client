import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../../../../../config/server.js";
import { Row, Col, Button, Badge } from 'react-bootstrap'
import styles from '../../../../../styles/Profile.module.css'
import ProfileView from '../../../../../Components/Profile.js'
import Personal from '../../../../../Components/Personal.js'

export default function Profile({ err, mail, sender, data, personal, isSenderBookmarked, token }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [profile, setProfile] = useState('')
    const [personalID, setPersonal] = useState(null)

    useEffect(() => {
        console.log(isSenderBookmarked)
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
    
    const addBookmark = async(e) => {
        e.preventDefault()

        let body = {
            userEmail: sender,
            email: mail,
            accessToken: token
        }

        let res = await fetch(`${server}/api/addBookmark`, {
            method: "post",
            body: JSON.stringify(body)
        })
        
        let { data, err } = await res.json()

        if (err) {
            toast.notify(err, {
                duration: 5,
                type: "error"
            })
            setTimeout(window.location.reload(), 8000)
        } else {
            let parsed = JSON.parse(data)
            if (parsed.status === 403) {
                let accessToken = parsed.accessToken.token
                localStorage.setItem("accessToken", accessToken)
                body.accessToken = accessToken
                res = await fetch(`${server}/api/addBookmark`, {
                    method: "post",
                    body: JSON.stringify(body)
                })
        
                let data2 = await res.json()
                data = data2.data
                err = data2.err

                if (err) {
                    toast.notify(err, {
                        duration: 5,
                        type: "error"
                    })
                    setTimeout(window.location.reload(), 8000)
                }
            }

            toast.notify('Profile added as bookmark', {
                duration: 5,
                type: "success"
            })
            setTimeout(window.location.reload(), 8000)
        }
    }

    const removeBookmark = async(e) => {
        e.preventDefault()

        let body = {
            userEmail: sender,
            email: mail,
            accessToken: token
        }

        let res = await fetch(`${server}/api/removeBookmark`, {
            method: "post",
            body: JSON.stringify(body)
        })
        
        let { data, err } = await res.json()

        if (err) {
            toast.notify(err, {
                duration: 5,
                type: "error"
            })
            setTimeout(window.location.reload(), 8000)
        } else {
            let parsed = JSON.parse(data)
            if (parsed.status === 403) {
                let accessToken = parsed.accessToken.token
                localStorage.setItem("accessToken", accessToken)
                body.accessToken = accessToken
                res = await fetch(`${server}/api/removeBookmark`, {
                    method: "post",
                    body: JSON.stringify(body)
                })
        
                let data2 = await res.json()
                data = data2.data
                err = data2.err

                if (err) {
                    toast.notify(err, {
                        duration: 5,
                        type: "error"
                    })
                    setTimeout(window.location.reload(), 8000)
                }
            }

            toast.notify('Profile removed as bookmark', {
                duration: 5,
                type: "success"
            })
            setTimeout(window.location.reload(), 8000)
        }
    }

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
                        (sender !== "null"  && (sender !== mail))? <>{isSenderBookmarked ? 
                        <div className={styles.bookmark}>
                            <Button className={styles.btn_bookmark}
                            onClick={removeBookmark}>Remove Bookmark</Button> 
                        </div>: <div className={styles.bookmark}>
                        <Button className={styles.btn_bookmark}
                        onClick={addBookmark}>Add Bookmark</Button></div>
                        }</> : <></>
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
                            (personalID === null && mail !== sender) ? <><Badge bg="warning" text="dark">
                            No tree view has been created by the user yet
                          </Badge></>
                                : <> {(mail !== sender) ? <Personal personal={personalID} isLoggedUser={false} /> 
                            : <>
                                {
                                    personalID === null ? <><Button className={styles.create_tree}
                                        onClick={() => {
                                            if (data.isFirstTimeLogin) {
                                                window.location.href = "/registerTreeFT"
                                            } else {
                                                window.location.href = "/registerTreeNFT"
                                            }
                                        }}>Create Tree View</Button></>
                                    : <>{
                                        personalID.youtube.id !== '' ? <Personal personal={personalID} 
                                        isLoggedUser={true}/>
                                        : <Button className={styles.create_tree}
                                        onClick={() => {
                                            if (data.isFirstTimeLogin) {
                                                window.location.href = "/registerTreeFT"
                                            } else {
                                                window.location.href = "/registerTreeNFT"
                                            }
                                        }}>Add Tree View</Button>
                                    }</>
                                }
                            </>
                            }</>
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
    let token = context.query.token

    let isSenderBookmarked = false

    let res = await fetch(`${server}/api/fetchUser`, {
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
                isSenderBookmarked,
                token
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

    if (token && sender) {
        res = await fetch(`${server}/api/fetchBookmarks`, {
            method: "post",
            body: JSON.stringify({
                email: sender, accessToken: token
            })
        })
        
        data2 = await res.json()
        let data3 = data2.data
        let err3 = data2.err
        if (err3) {
            return {
                props: {
                    err,
                    mail: email,
                    sender: sender,
                    data: parsed,
                    personal: err ? null : parsed1.id,
                    isSenderBookmarked: false,
                    token
                }
            }
        }
    
        let parsed2 = JSON.parse(data3)
        console.log(parsed2)
        console.log(err3)
        if (parsed2.status === 403) {
            let accessToken = parsed2.accessToken.token
            res = await fetch(`${server}/api/fetchBookmarks`, {
                method: "post",
                body: JSON.stringify({
                    email: sender, accessToken
                })
            })
    
            data2 = await res.json()
            data3 = data2.data
            err3 = data2.err
        }
    
        parsed2 = JSON.parse(data3)
        let bookmarksMail = parsed2.bookmarks
        if (bookmarksMail.includes(email)) {
            isSenderBookmarked = true
        }
    }

    if (err) {
        return {
            props: {
                err: null,
                mail: email,
                sender: sender,
                data: parsed,
                personal: null,
                isSenderBookmarked,
                token
            }
        }
    }

    return {
        props: {
            err: null,
            mail: email,
            sender: sender,
            data: parsed,
            personal: parsed1.id,
            isSenderBookmarked,
            token
        }
    }
}