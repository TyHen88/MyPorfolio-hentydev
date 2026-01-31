'use server'

import nodemailer from 'nodemailer'

type SendEmailOptions = {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    fromName?: string
    replyTo?: string
}
export type { SendEmailOptions }

// Create reusable transporter
const getTransporter = () => {
    const {
        GMAIL_SENDER_EMAIL,
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REFRESH_TOKEN
    } = process.env

    if (!GMAIL_SENDER_EMAIL || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
        throw new Error(
            'Gmail configuration is incomplete. Please provide GMAIL_SENDER_EMAIL, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN.'
        )
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_SENDER_EMAIL,
            clientId: GMAIL_CLIENT_ID,
            clientSecret: GMAIL_CLIENT_SECRET,
            refreshToken: GMAIL_REFRESH_TOKEN
        }
    })
}

export default async function sendGmail(options: SendEmailOptions) {
    const { to, subject, text, html, fromName, replyTo } = options

    if (!subject?.trim()) {
        throw new Error('Email subject is required.')
    }

    if (!html && !text) {
        throw new Error('Email content is required. Provide either html or text.')
    }

    try {
        const transporter = getTransporter()
        const { GMAIL_SENDER_EMAIL } = process.env

        const from = fromName ? `${fromName} <${GMAIL_SENDER_EMAIL}>` : GMAIL_SENDER_EMAIL

        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html,
            replyTo
        })
    } catch (error: any) {
        const msg = error?.message || String(error)

        if (msg.includes('unauthorized_client') || msg.includes('invalid_grant')) {
            throw new Error(
                'Failed to authenticate with Gmail. Check that GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN are correct.'
            )
        }

        throw error
    }
}
