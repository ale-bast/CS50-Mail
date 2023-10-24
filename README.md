# CS50-Mail

# Email Client

This project is a front-end for an email client that makes API calls to send and receive emails.

## Overview

This email client project is a single-page web application built using JavaScript, HTML, and CSS. It allows users to send and receive emails. The core functionality of the email client is controlled by JavaScript in the `inbox.js` file.

## Features

### Send Mail
- Users can send emails by filling out the email composition form.
- A POST request to `/emails` is made with recipient, subject, and body data to send the email.
- After sending the email, the user's sent mailbox is loaded.

### Mailbox
- Users can view emails in their Inbox, Sent mailbox, and Archive mailbox.
- A GET request to `/emails/<mailbox>` is made to fetch emails for a specific mailbox.
- Emails are displayed with sender, subject, timestamp, and read/unread status.

### View Email
- Users can click on an email to view its content.
- The email sender, recipients, subject, timestamp, and body are displayed.
- When an email is viewed, it is marked as read.

### Archive and Unarchive
- Users can archive and unarchive emails.
- A PUT request to `/emails/<email_id>` is made to update the archived status of an email.
- After archiving or unarchiving an email, the user's inbox is loaded.

### Reply
- Users can reply to emails.
- The reply functionality pre-fills the composition form with recipient, subject, and original email content.

## API Routes

This application uses the following API routes:

- **GET /emails/<mailbox>**: Retrieve a list of emails in a specific mailbox.
- **GET /emails/<int:email_id>**: Retrieve details of a specific email.
- **POST /emails**: Send a new email.
- **PUT /emails/<int:email_id>**: Update an email's read/unread or archived/unarchived status.

## Usage

1. Start the Django development server: `python manage.py runserver`.

2. Access the project in your web browser.

3. Register for an account and start using the email client.

## Notes

- The emails you send and receive in this project are stored in your local database, and they are not sent to real email servers. You can use any email address and password during registration.
