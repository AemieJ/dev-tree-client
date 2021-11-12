import React from "react"
import Image from 'next/image'
import youtube from '../public/youtube.svg'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { useState } from 'react'
import styles from '../styles/Personal.module.css'
import { server } from '../config/server.js'
import { toast, ToastContainer } from 'react-nextjs-toast'

const Personal = ({ personal }) => {
    const [youtubeID, setYtID] = useState(personal.youtube.id)
    const [youtubeList, setYtList] = useState(personal.youtube.list)
    const [first, setFirst] = useState(personal.youtube.list[0] ?? "")
    const [second, setSecond] = useState(personal.youtube.list[1] ?? "")
    const [third, setThird] = useState(personal.youtube.list[2] ?? "")

    const approveID = (string) => {
        let url;
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url.protocol === "http:" || url.protocol === "https:";
      }

    const updatePersonal = async() => {
        let length = youtubeList.length
        let finalList = []
        for (let i = 0; i < length; ++i) {
            let status = await approveID(youtubeList[i])
            if (!status && youtubeList[i] !== "") {
                toast.notify('URL isn\'t valid', {
                    duration: 5,
                    type: "error"
                })
                setTimeout(window.location.reload(), 8000)
            } else {
                if (youtubeList[i] !== "") finalList.push(youtubeList[i])
            }
        }

        let obj = {
            youtubeList: finalList
        }

        let body = {
            email: localStorage.getItem("email"),
            body: obj,
            accessToken: localStorage.getItem("accessToken")
        }

        let res = await fetch(`${server}/api/updatePersonalID`, {
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
                localStorage.setItem("accessToken", token)
                body.accessToken = token

                res = await fetch(`${server}/api/updatePersonalID`, {
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
                    toast.notify('Personal ID has been updated', {
                        duration: 5,
                        type: "success"
                    })
                    setTimeout(window.location.reload(), 8000)
                }
            } else {
                toast.notify('Personal ID has been updated', {
                    duration: 5,
                    type: "success"
                })
                setTimeout(window.location.reload(), 8000)
            }
        }
    }

    const deletePersonalID = async(account) => {
        let body = {
            email: localStorage.getItem("email"),
            acc: account,
            accessToken: localStorage.getItem("accessToken")
        }

        let res = await fetch(`${server}/api/deletePersonalID`, {
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
                localStorage.setItem("accessToken", token)
                body.accessToken = token

                res = await fetch(`${server}/api/deletePersonalID`, {
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
                    toast.notify('Personal ID has been deleted', {
                        duration: 5,
                        type: "success"
                    })
                    setTimeout(window.location.reload(), 8000)
                }
            } else {
                toast.notify('Personal ID has been deleted', {
                    duration: 5,
                    type: "success"
                })
                setTimeout(window.location.reload(), 8000)
            }
        }
    }

    return (
        <>
        <Button className={styles.delete}
        onClick={async(e) => {
            e.preventDefault()
            await deletePersonalID("youtube")
        }}>Delete ID</Button>
        <InputGroup className="mb-3">
            <InputGroup.Text className={styles.input_group_text}>
                <Image src={youtube} /></InputGroup.Text>
            <FormControl
            value={youtubeID}
            disabled
            className={styles.input}
            />
        </InputGroup>
        
        <InputGroup className={styles.list_input_grp} key="1">
            <InputGroup.Text className={styles.list_input_grp_txt}>
                {1}</InputGroup.Text>
            <FormControl
                className={styles.list_input}
                type="text"
                onChange={(e) => {
                    let list = youtubeList
                    list[0] = e.target.value
                    setYtList(list)
                    setFirst(e.target.value)
                }}
                value={first}
                placeholder="Enter first channel link"
            />
        </InputGroup> 

        <InputGroup className={styles.list_input_grp} key="2">
            <InputGroup.Text className={styles.list_input_grp_txt}>
                {2}</InputGroup.Text>
            <FormControl
                className={styles.list_input}
                onChange={(e) => {
                    let list = youtubeList
                    list[1] = e.target.value
                    setYtList(list)
                    setSecond(e.target.value)
                }}
                value={second}
                placeholder="Enter second channel link"
            />
        </InputGroup> 

        <InputGroup className={styles.list_input_grp} key="3">
            <InputGroup.Text className={styles.list_input_grp_txt}>
                {3}</InputGroup.Text>
            <FormControl
                className={styles.list_input}
                onChange={(e) => {
                    let list = youtubeList
                    list[2] = e.target.value
                    setYtList(list)
                    setThird(e.target.value)
                }}
                value={third}
                placeholder="Enter third channel link"
            />
        </InputGroup> 

        <div className={styles.btn_grp}>
        <Button className={styles.reset}
        onClick={(e) => {
            e.preventDefault()
            window.location.reload()
        }}>Reset</Button>
        <Button onClick={updatePersonal}>Update Youtube List</Button>
        </div>
        <ToastContainer/>
        </>
    );
};

export default Personal;