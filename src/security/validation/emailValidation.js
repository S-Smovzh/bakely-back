import { createRequire } from 'module';
import dotenv from 'dotenv';
import crypto from 'crypto';
import redisClient from '../../config/redis.config.js';

const require = createRequire(import.meta.url);
const nodemailer = require('nodemailer');

dotenv.config({ path: '../../../.env' });

export default async function validateEmail(targetEmail) {
  let verificationLink = process.env.FRONT_URL.concat(`/en/user/verification/${Buffer.from(targetEmail).toString('base64')}/${generateVerificationCode(targetEmail)}`);

  console.log(
    process.env.MAIL_HOST,
    process.env.MAIL_PORT,
      process.env.MAIL_USER,
      process.env.MAIL_PASSWORD
    );

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.zoho.com',
    port: process.env.MAIL_PORT || 465,
    secure: true,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: '"Bakely" <bakely@zohomail.eu>',
    to: targetEmail,
    subject: 'Email verification',
    text: `Welcome to Bakely!\n\nTo activate your account copy and paste the link below in your browser.\n\n ${verificationLink}\n\n Hurry up! Your activation link expires in 24 hours!\n\n\nThis message was produced and distributed by Bakely LLC, Bohdan Khmelnytsky street 17/52а , Kiyv 01030\n\nwww.bakely.com`,
    html: '<div' +
      '        style="margin:0;background:#F0F0F0!important;box-sizing:border-box;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important">' +
      '        <span' +
      '                style="color:#f3f3f3;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden"></span>' +
      '    <table' +
      '            style="margin:0;background:#F0F0F0!important;border-collapse:collapse;border-spacing:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '        <tbody>' +
      '        <tr style="padding:0;text-align:left;vertical-align:top">' +
      '            <td align="center" valign="top"' +
      '                style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                <center style="min-width:580px;width:100%">' +
      '                    <table align="center"' +
      '                           style="margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:580px">' +
      '                        <tbody>' +
      '                        <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                            <td' +
      '                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                <table' +
      '                                        style="background:#F0F0F0;border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                    <tbody>' +
      '                                    <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                        <th' +
      '                                                style="margin:0 auto;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:0;padding-left:32px;padding-right:32px;text-align:left;width:548px">' +
      '                                            <table' +
      '                                                    style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                <tbody>' +
      '                                                <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                    <th' +
      '                                                            style="margin:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="32px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;line-height:32px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                        <center style="min-width:484px;width:100%">' +
      '                                                            <img src="https://res.cloudinary.com/gachi322/image/upload/v1620490480/Bakely/logo-min_pbbgds.png"' +
      '                                                                 align="center"' +
      '                                                                 style="margin:0 auto;clear:both;display:block;float:none;max-width:100%;outline:0;text-align:center;text-decoration:none;width:auto;height:150px"' +
      '                                                                 alt=""/>' +
      '                                                        </center>' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="24px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:400;line-height:24px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                    </th>' +
      '                                                    <th' +
      '                                                            style="margin:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>' +
      '                                                </tr>' +
      '                                                </tbody>' +
      '                                            </table>' +
      '                                        </th>' +
      '                                    </tr>' +
      '                                    </tbody>' +
      '                                </table>' +
      '                                <table' +
      '                                        style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                    <tbody>' +
      '                                    <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                        <th' +
      '                                                style="margin:0 auto;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:32px;padding-left:32px;padding-right:32px;text-align:left;width:548px">' +
      '                                            <table' +
      '                                                    style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                <tbody>' +
      '                                                <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                    <th' +
      '                                                            style="margin:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="32px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;line-height:32px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                        <center style="min-width:484px;width:100%"></center>' +
      '                                                        <h1' +
      '                                                                style="margin:0;margin-bottom:10px;color:#711604;font-family:Helvetica,Arial,sans-serif;font-size:32px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center;word-wrap:normal">' +
      '                                                            Welcome to Bakely!' +
      '                                                        </h1>' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="8px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:8px;font-weight:400;line-height:8px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                        <p' +
      '                                                                style="margin:0;margin-bottom:10px;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center">' +
      '                                                            Please click below to activate your account and complete' +
      '                                                            your signup process.' +
      '                                                        </p>' +
      '                                                        <center style="min-width:484px;width:100%">' +
      '                                                            <table' +
      '                                                                    style="margin:0 0 16px 0;border-collapse:collapse;border-spacing:0;float:none;margin:0 0 16px 0;padding:0;text-align:center;vertical-align:top;width:auto">' +
      '                                                                <tbody>' +
      '                                                                <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                    <td' +
      '                                                                            style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                        <table' +
      '                                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                                            <tbody>' +
      '                                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                                <td' +
      '                                                                                        style="margin:0;background:#711604;border:none;border-collapse:collapse!important;border-radius:5px;color:#fefefe;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      `                                                                                    <a href="${verificationLink}"` +
      '                                                                                       style="margin:0;border:0 solid #711604;border-radius:5px;color:#fefefe;display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;line-height:1.3;margin:0;padding:10px 20px 10px 20px;text-align:left;text-decoration:none"' +
      '                                                                                       target="_blank">' +
      '                                                                                        Activate Now' +
      '                                                                                    </a>' +
      '                                                                                </td>' +
      '                                                                            </tr>' +
      '                                                                            </tbody>' +
      '                                                                        </table>' +
      '                                                                    </td>' +
      '                                                                </tr>' +
      '                                                                </tbody>' +
      '                                                            </table>' +
      '                                                        </center>' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="8px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:8px;font-weight:400;line-height:8px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                        <p' +
      '                                                                style="margin:0;margin-bottom:10px;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center">' +
      '                                                            <span style="color:#711604">' +
      '                                                                Hurry up! Your activation link expires in 24 hours!' +
      '                                                            </span>' +
      '                                                        </p>' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                    </th>' +
      '                                                    <th' +
      '                                                            style="margin:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>' +
      '                                                </tr>' +
      '                                                </tbody>' +
      '                                            </table>' +
      '                                        </th>' +
      '                                    </tr>' +
      '                                    </tbody>' +
      '                                </table>' +
      '                                <table' +
      '                                        style="background:#F0F0F0;border-collapse:collapse;border-spacing:0;border-top:8px solid #A7ACA9;display:table;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                    <tbody>' +
      '                                    <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                        <th' +
      '                                                style="margin:0 auto;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:32px;padding-left:32px;padding-right:32px;text-align:left;width:548px">' +
      '                                            <table' +
      '                                                    style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                <tbody>' +
      '                                                <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                    <th' +
      '                                                            style="margin:0;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">' +
      '                                                        <table' +
      '                                                                style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">' +
      '                                                            <tbody>' +
      '                                                            <tr style="padding:0;text-align:left;vertical-align:top">' +
      '                                                                <td height="16px"' +
      '                                                                    style="margin:0;border-collapse:collapse!important;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:16px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">' +
      '                                                                    &nbsp;' +
      '                                                                </td>' +
      '                                                            </tr>' +
      '                                                            </tbody>' +
      '                                                        </table>' +
      '                                                        <p' +
      '                                                                style="margin:0;margin-bottom:10px;color:#565D59;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center">' +
      '                                                            <small style="color:grey;font-size:80%">' +
      '                                                                This message was produced and distributed by Bakely LLC,' +
      '                                                                Bohdan Khmelnytsky street 17/52а , Kiyv 01030' +
      '                                                                <a' +
      '                                                                        style="margin:0;color:#711604;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none"' +
      `                                                                        href=${process.env.FRONT_URL} target="_blank">` +
      '                                                                    www.bakely.com' +
      '                                                                </a>' +
      '                                                            </small>' +
      '                                                        </p>' +
      '                                                    </th>' +
      '                                                </tr>' +
      '                                                </tbody>' +
      '                                            </table>' +
      '                                        </th>' +
      '                                    </tr>' +
      '                                    </tbody>' +
      '                                </table>' +
      '                            </td>' +
      '                        </tr>' +
      '                        </tbody>' +
      '                    </table>' +
      '                </center>' +
      '            </td>' +
      '        </tr>' +
      '        </tbody>' +
      '    </table>' +
      '</div>'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Verification email sent to ${targetEmail}: ${info.response}`);
    }
  });
}

function generateVerificationCode(targetEmail) {
  const verificationCode = crypto.randomBytes(40).toString('hex');
  redisClient.client.set(targetEmail, verificationCode, 'EX', 60 * 60 * 24);

  return verificationCode;
}
