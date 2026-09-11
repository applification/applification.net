export const privacyUpdated = "10 September 2026";

export const privacyCopy = {
  "title": "What this site does with your data.",
  "description": "Applification Ltd is a UK company run by Dave Hudson. This site publishes information about his work. It has no accounts, no tracking cookies and no advertising. The only personal data it handles is what you choose to send through the contact page.",
  "sections": [
    {
      "id": "reading",
      "title": "Reading the site",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Pages, the public API and the agent guides are served without accounts, API keys or cookies. Vercel hosts the site and keeps short lived request logs, including IP addresses, to run and protect the service."
        },
        {
          "kind": "paragraph",
          "text": "Vercel Web Analytics records page views and the referring page. It does not set cookies and does not build a profile that follows you to other sites."
        },
        {
          "kind": "paragraph",
          "text": "Your light or dark theme choice is stored in your browser only. Embedded videos use YouTube’s privacy-enhanced player and load nothing until you press play."
        }
      ]
    },
    {
      "id": "contact",
      "title": "Sending an enquiry",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "The contact page is optional. When it is enabled, you write a brief and can add your name, reply email, company, timing and working arrangement. An AI assistant may help tidy the brief; the model provider receives only the text you enter in that step."
        },
        {
          "kind": "paragraph",
          "text": "You can attach one contract brief of up to 4 MB. It is stored in a private file store and linked only from the delivered email."
        },
        {
          "kind": "paragraph",
          "text": "Nothing is sent until you review the finished enquiry and give consent. Delivery is by email through Resend to Dave’s inbox. Bot detection and a rate limit protect the form; the rate limit keeps a hashed, not readable, form of your network address for a short time."
        },
        {
          "kind": "paragraph",
          "text": "Enquiries are used only to reply to you and to discuss the work you describe. They are not sold, shared for marketing, or exposed through the public API."
        }
      ]
    },
    {
      "id": "services",
      "title": "Services used",
      "blocks": [
        {
          "kind": "list",
          "items": [
            "Vercel: hosting, request logs, bot detection, analytics and the private file store.",
            "Resend: email delivery for enquiries.",
            "An AI model accessed through Vercel AI Gateway: optional help preparing an enquiry.",
            "YouTube (privacy-enhanced mode): video embeds in some articles."
          ]
        },
        {
          "kind": "paragraph",
          "text": "Each provider processes data on Applification’s instructions under its own terms. Some run outside the UK under standard data transfer safeguards."
        }
      ]
    },
    {
      "id": "rights",
      "title": "Your rights and questions",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Applification Ltd is the data controller under UK GDPR. Enquiry data is processed because you asked for a reply, and kept for as long as the conversation and any resulting work need it. You can ask what is held about you, ask for it to be corrected or deleted, or withdraw consent, and you can complain to the Information Commissioner’s Office."
        },
        {
          "kind": "paragraph",
          "text": "Send privacy questions through the routes on the about page or by message on LinkedIn. No email address is published on this site."
        }
      ]
    }
  ]
} as const;
