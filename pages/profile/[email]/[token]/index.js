import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../../../../config/server.js";
import { Row, Col, Button } from 'react-bootstrap'
import styles from '../../../../styles/Profile.module.css'
import ProfileView from '../../../../Components/Profile.js'
import Bookmarks from '../../../../Components/Bookmarks.js'
import Personal from '../../../../Components/Personal.js'

export default function Profile({ err, mail, data, personal, token, bookmarks }) {
    const [accessToken, setAccessToken] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('')
    const [profile, setProfile] = useState('')
    const [firstTimeLogin, setFirstTimeLogin] = useState(false)
    const [personalID, setPersonal] = useState(null)
    const [bookList, setBookmarks] = useState(null)

    useEffect(() => {
        let getItem = localStorage.getItem("accessToken")
            if (getItem !== undefined) {
                setAccessToken(getItem)
                if (err) {
                    toast.notify(err, {
                        duration: 5,
                        type: "error"
                    })
                } else {
                    console.log(personal)
                    setAccessToken(token)
                    localStorage.setItem("accessToken", token)
                    setEmail(mail)
                    if (data !== undefined) {
                        setName(data.name)
                        setGender(data.gender)
                        setProfile(data.profile)
                        setFirstTimeLogin(data.isFirstTimeLogin)
                    }

                    if (personal !== null && personal !== undefined) {
                        setPersonal(personal)
                    } 

                    if (bookmarks !== null && bookmarks !== undefined) {
                        setBookmarks(bookmarks)
                    }
                }
            } else {
                setAccessToken('')
            }
    })

    return (
        <>
            {
                accessToken === "" || accessToken === null ? <></>
                    : <>
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
                            <Button className={styles.sidebar_btn}
                            onClick={() => {
                                document.querySelector('#bookmarks').scrollIntoView({
                                    behavior: 'smooth'
                                  });
                            }}>Bookmarks</Button>
                        </Col>
                        <Col>
                            <div id="user"><h1>User's Details</h1>
                            <p>This is the section that covers the detail of your profile. Within here,
                            your name, email, gender and profile (avatar) is displayed which will be showcased
                            publicly by any user.</p>
                            <ProfileView user={{name, email, gender, profile}} />
                            </div>
                            <div id="tree"><h1>Tree View</h1>
                            <p>The tree comprises of the collection of major id and the list which will be showcased
                                on your profile publicly everytime a user views your profile. However, as the authenticated
                                owner, you can delete the id or update the list as per your convinience.</p>
                            {
                                personalID === null ? <><Button className={styles.create_tree}
                                onClick={() => {
                                    if (firstTimeLogin) {
                                        alert('First time login')
                                    } else {
                                        window.location.href = "/registerTreeNFT"
                                    }
                                }}>Create Tree View</Button></>
                                : <Personal personal={personalID} />
                            }    
                            </div>
                            <div id="bookmarks"><h1>Bookmarks</h1>
                            <p>Bookmarks are the collection of developer's profile that has intrigued you. This section will be 
                                only observable to you and will be shown to no other user that lands on your profile.</p></div>
                            <Bookmarks users={bookList} />
                        </Col>
                    </Row>
                    <ToastContainer />
                    </>
            }
        </>
    )
}

export const getServerSideProps = async (context) => {
    let email = context.query.email
    let accessToken = context.query.token

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
                data: "",
                personal: null,
                token: accessToken,
                bookmarks: null
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

    res = await fetch(`${server}/api/fetchBookmarks`, {
        method: "post",
        body: JSON.stringify({
            email, accessToken
        })
    })
    
    data2 = await res.json()
    let data3 = data2.data
    let err3 = data2.err

    let parsed2 = JSON.parse(data3)
    if (parsed2.status === 403) {
        accessToken = parsed2.accessToken.token
        res = await fetch(`${server}/api/fetchBookmarks`, {
            method: "post",
            body: JSON.stringify({
                email, accessToken
            })
        })

        data2 = await res.json()
        data3 = data2.data
        err3 = data2.err
    }

    parsed2 = JSON.parse(data3)
    let bookmarksMail = parsed2.bookmarks
    let bookmarks = []
    for (let i = 0; i < bookmarksMail.length; ++i) {
        res = await fetch(`${server}/api/fetchUser`, {
            method: "post",
            body: bookmarksMail[i]
        })

        data2 = await res.json()
        let profileData = JSON.parse(data2.data)
        bookmarks.push(profileData)
    }
    
    if (err && !err3) {
        return {
            props: {
                err: null,
                mail: email,
                data: parsed,
                personal: null,
                token: accessToken,
                bookmarks: bookmarks
            }
        }
    }


    let parsed1 = JSON.parse(data)
    if (err3) {
        return {
            props: {
                err: null,
                mail: email,
                data: parsed,
                personal: parsed1.id,
                token: accessToken,
                bookmarks: null
            }
        }
    }

    return {
        props: {
            err: null,
            mail: email,
            data: parsed,
            personal: parsed1.id,
            token: accessToken,
            bookmarks: bookmarks
        }
    }
}