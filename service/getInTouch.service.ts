'use server'

import nodemailer from 'nodemailer'

type SendEmailOptions = {
    to: string | string[]
    subject: string
    text?: string
    html?: string
    fromName?: string
    fromEmail?: string
    replyTo?: string
}
type GetInTouchPayload = {
    name: string
    email: string
    message: string
}
export type { SendEmailOptions, GetInTouchPayload }

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

const sanitizeHeaderValue = (value: string) => value.replace(/[\r\n"]/g, ' ').trim()

const formatReplyTo = (name: string, email: string) => {
    const safeName = sanitizeHeaderValue(name)

    return safeName ? `"${safeName}" <${email}>` : email
}

const getTransporter = () => {
    const {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_USER,
        SMTP_PASS,
        GMAIL_SENDER_EMAIL,
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REFRESH_TOKEN
    } = process.env

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
        const port = Number(SMTP_PORT)

        if (!Number.isFinite(port)) {
            throw new Error('SMTP_PORT must be a valid number.')
        }

        return nodemailer.createTransport({
            host: SMTP_HOST,
            port,
            secure: port === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        })
    }

    if (GMAIL_SENDER_EMAIL && GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: GMAIL_SENDER_EMAIL,
                clientId: GMAIL_CLIENT_ID,
                clientSecret: GMAIL_CLIENT_SECRET,
                refreshToken: GMAIL_REFRESH_TOKEN
            }
        })
    }

    throw new Error(
        'Mail configuration is incomplete. Provide SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS, or configure Gmail OAuth credentials.'
    )
}

export default async function sendGmail(options: SendEmailOptions) {
    const { to, subject, text, html, fromName, fromEmail, replyTo } = options

    if (!subject?.trim()) {
        throw new Error('Email subject is required.')
    }

    if (!html && !text) {
        throw new Error('Email content is required. Provide either html or text.')
    }

    try {
        const transporter = getTransporter()
        const senderEmail = process.env.SMTP_USER || process.env.GMAIL_SENDER_EMAIL

        if (!senderEmail) {
            throw new Error('Sender email is not configured. Add SMTP_USER or GMAIL_SENDER_EMAIL.')
        }

        const headerFromEmail = fromEmail?.trim() || senderEmail
        const from = fromName ? `${fromName} <${headerFromEmail}>` : headerFromEmail
        const sender = headerFromEmail !== senderEmail ? senderEmail : undefined

        await transporter.sendMail({
            from,
            sender,
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

        if (msg.includes('deleted_client')) {
            throw new Error(
                'Failed to authenticate with Gmail because the OAuth client was deleted. Recreate the Google OAuth app or use SMTP credentials instead.'
            )
        }

        throw error
    }
}

export async function sendGetInTouchEmail({ name, email, message }: GetInTouchPayload) {
    const safeName = sanitizeHeaderValue(name) || 'Website visitor'
    const safeEmail = email.trim()
    const safeMessage = message.trim()
    const contactReceiver =
        process.env.CONTACT_RECEIVER || process.env.SMTP_USER || process.env.GMAIL_SENDER_EMAIL

    if (!contactReceiver) {
        throw new Error('Contact receiver is not configured. Add CONTACT_RECEIVER or GMAIL_SENDER_EMAIL.')
    }

    const messageHtml = escapeHtml(safeMessage).replace(/\n/g, '<br />')
    const messageText = safeMessage

    await sendGmail({
        to: contactReceiver,
        subject: `New Get In Touch message from ${safeName}`,
        text: [
            'New Get In Touch message',
            `Name: ${safeName}`,
            `Email: ${safeEmail}`,
            '',
            'Message:',
            messageText
        ].join('\n'),
        html: `
            <h2>New Get In Touch message</h2>
            <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
            <p><strong>Reply to:</strong> ${escapeHtml(safeEmail)}</p>
            <p><strong>Message:</strong></p>
            <p>${messageHtml}</p>
        `,
        fromName: safeName,
        fromEmail: safeEmail,
        replyTo: formatReplyTo(safeName, safeEmail)
    })
}
