'use strict'

const emailTokenHTML = () => {
  return `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>ShopDev</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
          />
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Open Sans', sans-serif;
              color: #333;
              background-color: #fff;
            }
            .container {
              margin: 0 auto;
              width: 100%;
              max-width: 600px;
              padding: 0;
              padding-bottom: 10px;
              border-radius: 5px;
              line-height: 1.8;
            }
            .header {
              border-bottom: 1px solid #eee;
            }
            .header p {
              margin: 0;
              font-size: 1.4em;
              color: #000;
              text-decoration: none;
              font-weight: 600;
            }
            .content {
              min-width: 700px;
              overflow: auto;
              line-height: 2;
            }
            .otp {
              text-align: center;
            }
            .otp a {
              display: inline-block;
              padding: 4px 24px;
              border-radius: 4px;
              background: #219c90;
              color: #fff;
              text-decoration: none;
              font-weight: 600;
            }
            .footer {
              color: #666;
              font-size: 0.8em;
              line-height: 1;
              font-weight: 300;
            }
            .email-info {
              color: #333;
              font-size: 13px;
              line-height: 18px;
              padding-bottom: 6px;
            }
            .email-info a {
              text-decoration: none;
              color: #219c90;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p>PROVE YOUR SHOPDEV IDENTITY</p>
            </div>
            <br />
            <strong>Dear Sir/Madam,</strong>
            <p>
              We have received a register request for your ShopDev account. For
              security purposes, please verify your identity by providing the
              following One-Time Password (OTP).
              <br />
              <b>Click this button to get OTP and verify your account:</b>
            </p>
            <div class="otp"><a href="{{link_verify}}">Verify my account</a></div>
            <p>
              <strong>One-Time Password (OTP) is valid for 1 minutes.</strong>
              <br />
              <br />
              If you did not initiate this register request, please disregard this
              message. Please ensure the confidentiality of your OTP and do not share
              it with anyone.<br />
              <strong>Do not forward or give this code to anyone.</strong>
              <br />
              <br />
              <strong>Thank you for using ShopDev.</strong>
              <br />
              <br />
              Best regards,
              <br />
              <strong>Tucker Do</strong>
            </p>
            <hr style="border: none; border-top: 0.5px solid #131111" />
            <div class="footer">
              <p>This email can't receive replies.</p>
              <p>
                For more information about ShopDev and your account, visit
                <strong>ShopDev</strong>
              </p>
            </div>
            <div style="text-align: center">
              <div class="email-info"><a href="/">ShopDev</a> | Hanoi, Vietnam</div>
              <div class="email-info">&copy; 2024 ShopDev. All rights reserved.</div>
            </div>
          </div>
        </body>
      </html>
      `
}

module.exports = { emailTokenHTML }
