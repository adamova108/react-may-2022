import type { NextPage } from 'next'
import React from 'react'
import { MyFooter } from '.'
import { AuthGuard } from '../src/user/AuthGuard'

const About: NextPage = () => {
    return (
        <AuthGuard>
            <div>
                <h1>About this offce hour</h1>
                <MyFooter companyName='Coca Cola' />
            </div>
        </AuthGuard>
    )
}

export default About
