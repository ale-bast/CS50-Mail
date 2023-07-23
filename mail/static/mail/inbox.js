document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);
    document.querySelector('#compose-form').onsubmit = send_email;

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    fetch('/emails/' + mailbox)
        .then(response => response.json())
        .then(emails => {
            // Create a box for each email
            emails.forEach(email => {
                const emailBox = document.createElement('div');
                emailBox.addEventListener('click', function() {
                    view_email(email.id, mailbox);
                });

                // Change the color of the background depending if the email is read
                if (email.read === true) {
                    emailBox.style.backgroundColor = 'gray';
                } else {
                    emailBox.style.backgroundColor = 'white';
                }
                
                // Populate the email box with email details
                emailBox.innerHTML = `
                    <p><strong>From:</strong> ${email.sender}</p>
                    <p><strong>Subject:</strong> ${email.subject}</p>
                    <p><strong>Timestamp:</strong> ${email.timestamp}</p>
                    <hr>
                    `;

                // Append the email box to the emailsView element
                document.querySelector('#emails-view').append(emailBox);
            });
        });
}

function send_email() {

    // Get values from form fields
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Send email
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body,
        })
    })
    .then(response => {
        if (response.status === 201) {
            // Email sent successfully, switch to the 'Sent' mailbox
            load_mailbox('sent');
        } else {
            // Handle other responses or errors if needed
            return response.json();
        }
    })

    // Stop form from submitting
    return false;
}

function view_email(email_id, mailbox) {

    // Show the mail and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';

    // Clear out email 
    const emailView = document.querySelector('#email-view');
    fetch('/emails/' + email_id)
        .then(response => response.json())
        .then(email => {

            // Check if the mailbox is not "sent" before including the button
            let archiveButtonHTML = '';
            let replyButtonHTML = '';
            if (mailbox !== 'sent') {
                // Set the button text based on the mailbox value
                let archiveButtonText = mailbox === 'inbox' ? 'Archive' : 'Unarchive';
                archiveButtonHTML = `<button id="archive">${archiveButtonText}</button>`;
                replyButtonHTML = `<button id="reply">Reply</button>`;
            }

            // Populate the email box with email details
            emailView.innerHTML = ` 
                ${archiveButtonHTML} 
                ${replyButtonHTML} 
                <p><strong>From:</strong> ${email.sender}</p>
                <p><strong>To:</strong> ${email.recipients}</p>
                <p><strong>Subject:</strong> ${email.subject}</p>
                <p><strong>Timestamp:</strong> ${email.timestamp}</p>
                <p><strong>Body:</strong> ${email.body}</p>
                <hr>
                `;
            
            // If unread mark it as read 
            if(email.read === false){
                fetch('/emails/' + email_id, {
                    method: 'PUT',
                    body: JSON.stringify({
                        read: true
                    })
                })
            }

            // Archive or Unarchive
            if (mailbox !== 'sent') {
                document.querySelector('#archive').onclick = () => archived_email(email);
                document.querySelector('#reply').onclick = () => reply_email(email);
            }
        });
}

function archived_email(email) {
    let archived = email.archived === false ? true : false; 
    fetch('/emails/' + email.id, {
        method: 'PUT',
        body: JSON.stringify({
            archived: archived 
        })
    })
    .then(response => {
        if (response.ok) {
            load_mailbox('inbox');
        } else {
            console.error('Failed to archive/unarchive the email:', response.status);
        }
    })
}

function reply_email(email) {
    compose_email();

    // Fill composition fields
    let replySubject = 'Re: ';
    let originalSubject = email.subject.trim();
    if (originalSubject.startsWith(replySubject)) {
        replySubject = ''; // Subject already starts with "Re: ", no need to add it again.
    }
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = replySubject + originalSubject;

    // Prepare the reply body
    const replyBody = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n\n`;
    document.querySelector('#compose-body').value = replyBody;
}

