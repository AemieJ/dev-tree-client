import React from "react"
import Image from 'next/image'
import youtube from '../public/youtube.svg'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { useState } from 'react'
import styles from '../styles/Personal.module.css'
import urlExist from 'url-exist'

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
        for (let i = 0; i < length; ++i) {
            let status = await approveID(youtubeList[i])
            if (!status) {
                // TODO: add err status
                setTimeout(window.location.reload(), 8000)
            }
        }

        console.log(youtubeList)
    }

    return (
        <>
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
        </>
    );
};

export default Personal;