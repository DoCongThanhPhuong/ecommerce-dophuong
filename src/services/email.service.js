'use strict'

const transporter = require('~/dbs/init.nodemailer')
const { newOtp } = require('./otp.service')
const { getTemplate } = require('./template.service')
const { replacePlaceholder } = require('~/utils')
const { NotFoundError } = require('~/core/error.response')

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = 'Prove Your ShopDev Identity',
  text = 'Prove Your ShopDev Identity'
}) => {
  try {
    const mailOptions = {
      from: ' "<ShopDev>" <docongthanhphuong@gmail.com> ',
      to: toEmail,
      subject,
      text,
      html
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.err(err)
      }
      console.log('Message sent: ', info.messageId)
    })
  } catch (error) {
    console.err('Error sending: ', error.message)
    return error
  }
}

const sendEmailToken = async ({ email = null }) => {
  try {
    // 1. get token
    const token = await newOtp({ email })
    // 2. get email template
    const template = await getTemplate({
      tem_name: 'EMAIL TOKEN HTML'
    })
    if (!template) throw new NotFoundError('Template not found')
    // 3. replace placeholder with parameters
    const content = replacePlaceholder(template.tem_html, {
      link_verify: `http://localhost:3056/cgp/welcome-back?token=${token.otp_token}`
    })
    // 4. send email with token
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: 'Prove Your ShopDev Identity',
      text: 'Prove Your ShopDev Identity'
    }).catch((err) => console.error(err))

    return 1
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  sendEmailToken
}
