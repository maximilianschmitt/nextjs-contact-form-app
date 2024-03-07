import Mailgun from 'mailgun.js'
import FormData from 'form-data'
import { NextRequest, NextResponse } from 'next/server'

const CONTACT_FORM_FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL as string
const CONTACT_FORM_TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL as string
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN as string
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY as string

const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
	username: 'api',
	key: MAILGUN_API_KEY,

	// This needs to be customized based on your Mailgun region
	url: 'https://api.eu.mailgun.net',
})

export async function POST(request: NextRequest) {
	// Only allow post requests
	if (request.method !== 'POST') {
		return NextResponse.json({ status: 'not found' }, { status: 404 })
	}

	// Get the form data from the request body
	const { name, email, message } = await request.json()

	// Put together the email text
	const text = ['From: ' + name + '<' + email + '>\n', message].join('\n')

	// Send the email using Mailgun
	await mg.messages.create(MAILGUN_DOMAIN, {
		subject: 'New contact form submission',
		from: CONTACT_FORM_FROM_EMAIL,
		to: CONTACT_FORM_TO_EMAIL,
		text,
		'h:Reply-To': email,
	})

	// Send a 200 OK response
	return NextResponse.json({ status: 'ok' })
}
