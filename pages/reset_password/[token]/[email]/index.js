import Image from 'next/image'
import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../../../../config/server.js";
import PassError from '../../../../Components/PassError.js'
import ResetPassword from '../../../../Components/ResetPassword.js'

export default function ResetPass({ isValid, email }) {
    console.log(isValid)
    return (
        <>
        {
            isValid === "false" ? 
                <PassError />
            : <ResetPassword mail={email} />
        }
        </>
    );
}

export const getServerSideProps = async (context) => {
    let token = context.query.token
    let email = context.query.email

    const res = await fetch(`${server}/api/isValidURL`, {
        method: "post",
        body: JSON.stringify({ email, token })
    })

    const { data, err } = await res.json()
    if (err) {
        return {
            props: {
                isValid: false,
                email
            }
        }
    }

    return {
        props: {
            isValid: data,
            email
        }
    }
}