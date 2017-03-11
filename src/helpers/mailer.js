import nodemailer from 'nodemailer';
import sgTransport from 'nodemailer-sendgrid-transport';

import config from '../config';

const mailer = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: config.MAIL_KEY,
  },
}));

const SUBJECT = (name, email) => `Запрос с сайта klapouh.com - ${name} ${email}`;

function tpl(name, email, message) {
  return (
    `
     <div> Пишет ${name}, ${email} </div>
     <p></p>
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
    subject: SUBJECT(name, from),
    html: tpl(name, from, message),
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
