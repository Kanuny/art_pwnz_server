import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

import config from '../config';

const mailer = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: config.MAIL_KEY,
  },
}));

const SUBJECT = 'Someone want buy something';

function tpl(name, message) {
  return (
    `
     <div> Latter from ${name} </div>
     <div>
      ${message}
     </div>
    `
  );
}

export default function sendEmail(from, name, message) {
  const email = {
    to: config.MAIL_ADDRESS,
    from,
    subject: SUBJECT,
    html: tpl(name, message),
  };

  return new Promise((resolve, reject) => {
    mailer.sendMail(email, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
}
