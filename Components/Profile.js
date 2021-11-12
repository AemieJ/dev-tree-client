import { useState } from 'react';
import { Card, Col, Row, FormControl, DropdownButton, Dropdown, Button } from 'react-bootstrap'
import styles from '../styles/Profile.module.css'
import toonavatar from 'cartoon-avatar'
import { server } from '../config/server.js'
import {toast, ToastContainer} from 'react-nextjs-toast'


const Profile = ({ user }) => {
    const [name, setName] = useState(user.name)
    const [gender, setGender] = useState(user.gender)
    const [profile, setProfile] = useState(user.profile)

    const updateData = async(e) => {
        e.preventDefault()
        let pic = profile
        if (gender !== user.gender) {
            pic = toonavatar.generate_avatar({ gender: gender })
            setProfile(pic)
        }

        if (name === user.name && gender === user.gender && pic === user.profile) {
            toast.notify('User data doesn\'t require any update', {
                duration: 5,
                type: "success"
            })
        } else {
            let obj = {
                name, gender, profile: pic
            }
            let body = {
                email: localStorage.getItem("email"),
                body: obj,
                accessToken: localStorage.getItem("accessToken")
            }
    
            let res = await fetch(`${server}/api/updateUser`, {
                method: "post",
                body: JSON.stringify(body)
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
                    localStorage.setItem("accessToken", token)
                    body.accessToken = token
    
                    res = await fetch(`${server}/api/updateUser`, {
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
                        toast.notify('User data has been updated', {
                            duration: 5,
                            type: "success"
                        })
                        setTimeout(window.location.reload(), 8000)
                    }
                } else {
                    toast.notify('User data has been updated', {
                        duration: 5,
                        type: "success"
                    })
                    setTimeout(window.location.reload(), 8000)
                }
            }
        }

        

    }

    return (
        <>
        <Row xs={1} md={1} lg={1} className={`g-4`}>
            <Col>
                <Card className={styles.card}>
                <Card.Img variant="top" src={user.profile} className={styles.card_img} />
                    <Card.Body>
                        <p><b>The is a profile card. Email of user can't be edited.</b></p>
                        <div className={styles.info}>
                        <Card.Title className={styles.card_title}>📌 Name: &nbsp;</Card.Title>
                        <Card.Subtitle className={styles.card_subtitle}><FormControl 
                        placeholder="Enter your name"
                        className={styles.form_control_user}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        /></Card.Subtitle>
                        </div>
                        <div className={styles.info}>
                        <Card.Title className={styles.card_title}>📌 Email: &nbsp;</Card.Title>
                        <Card.Subtitle className={styles.card_subtitle}
                        ><FormControl 
                        placeholder="Enter your email"
                        className={styles.form_control_user}
                        value={user.email}
                        disabled
                        /></Card.Subtitle>
                        </div>
                        <div className={styles.info}>
                            <Card.Title className={styles.card_title}>📌 Gender: &nbsp;</Card.Title>
                            <Card.Subtitle className={styles.card_subtitle_drop}>
                            <DropdownButton
                title={gender}
                id="btn_gender"
                align="end"
                >
                <Dropdown.Item href="#"
                className={styles.drop_item}
                active={gender === 'male'}
                onClick={() => {
                    setGender('male')
                }}>male</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item href="#"
                className={styles.drop_item}
                active={gender === 'female'}
                onClick={() => {
                    setGender('female')
                }}>female</Dropdown.Item>
                </DropdownButton>
                            </Card.Subtitle>
                        </div> 
                    </Card.Body>
                </Card>
                <Button className={styles.update_btn}
                onClick={updateData}>Update Data</Button>
            </Col>
        </Row>
        <ToastContainer />
        </>
    );
};

export default Profile;