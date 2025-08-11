export const emailVerifyTemplate = (otp: string, email: string) => { 
return  `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your BlogSpace Account</title>
    <!--[if mso]>
    <noscript>
        <xml>
        <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles */
        body, table, td, p, div, span {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
        }
        
        /* Email client compatibility */
        body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
        width: 100% !important;
        min-width: 100%;
        }
        
        table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        }
        
        img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        display: block;
        }
        
        /* Main styles */
        .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #f8f9fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 20px;
        text-align: center;
        }
        
        .logo {
        color: white;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        text-decoration: none;
        }
        
        .logo::before {
        content: "✍️";
        margin-right: 10px;
        }
        
        .header-subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        margin: 0;
        }
        
        .content {
        background: white;
        padding: 40px 30px;
        }
        
        .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
        text-align: center;
        }
        
        .message {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
        margin-bottom: 30px;
        text-align: center;
        }
        
        .otp-container {
        background: linear-gradient(145deg, #f8f9ff, #e8ecff);
        border: 2px solid rgba(102, 126, 234, 0.2);
        border-radius: 15px;
        padding: 30px;
        margin: 30px 0;
        text-align: center;
        }
        
        .otp-label {
        font-size: 14px;
        color: #667eea;
        font-weight: 600;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
        }
        
        .otp-code {
        font-size: 36px;
        font-weight: bold;
        color: #667eea;
        letter-spacing: 8px;
        font-family: 'Courier New', monospace;
        background: white;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgba(102, 126, 234, 0.3);
        display: inline-block;
        margin-bottom: 15px;
        }
        
        .otp-validity {
        font-size: 12px;
        color: #888;
        font-style: italic;
        }
        
        .instructions {
        background: #fff8dc;
        border-left: 4px solid #ffd700;
        padding: 20px;
        margin: 25px 0;
        border-radius: 0 8px 8px 0;
        }
        
        .instructions p {
        margin: 0;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
        }
        
        .security-note {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        padding: 15px;
        margin: 25px 0;
        text-align: center;
        }
        
        .security-note p {
        margin: 0;
        font-size: 13px;
        color: #721c24;
        font-weight: 500;
        }
        
        .footer {
        background: #f8f9fa;
        padding: 30px;
        text-align: center;
        border-top: 1px solid #e9ecef;
        }
        
        .footer-content {
        font-size: 13px;
        color: #6c757d;
        line-height: 1.5;
        }
        
        .footer-links {
        margin-top: 15px;
        }
        
        .footer-links a {
        color: #667eea;
        text-decoration: none;
        margin: 0 10px;
        font-weight: 500;
        }
        
        .footer-links a:hover {
        text-decoration: underline;
        }
        
        .divider {
        height: 1px;
        background: linear-gradient(to right, transparent, #667eea, transparent);
        margin: 30px 0;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
        .email-container {
            width: 100% !important;
        }
        
        .content {
            padding: 30px 20px !important;
        }
        
        .header {
            padding: 30px 20px !important;
        }
        
        .logo {
            font-size: 24px !important;
        }
        
        .greeting {
            font-size: 20px !important;
        }
        
        .otp-code {
            font-size: 28px !important;
            letter-spacing: 4px !important;
            padding: 15px !important;
        }
        
        .otp-container {
            padding: 20px !important;
        }
        }
    </style>
    </head>
    <body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
        <div class="logo">BlogSpace</div>
        <p class="header-subtitle">Your Minimal Blogging Platform</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
        <h1 class="greeting">Welcome to BlogSpace! 🎉</h1>
        
        <p class="message">
            Thank you for signing up! We're excited to have you join our community of writers and readers. 
            To complete your account setup, please verify your email address using the code below.
        </p>
        
        <div class="otp-container">
            <div class="otp-label">Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-validity">This code expires in 5 minutes</div>
        </div>
        
        <div class="instructions">
            <p><strong>How to verify:</strong></p>
            <p>1. Return to the BlogSpace verification page</p>
            <p>2. Enter the 4-digit code above</p>
            <p>3. Click "Verify Email" to activate your account</p>
        </div>
        
        <div class="divider"></div>
        
        <p class="message">
            Once verified, you'll be able to create articles, manage your profile, and explore all the features BlogSpace has to offer.
        </p>
        
        <div class="security-note">
            <p>🔒 For your security, never share this code with anyone. BlogSpace will never ask for your verification code via phone or email.</p>
        </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
        <div class="footer-content">
            <p>This email was sent to <strong>${email}</strong></p>
            <p>If you didn't create a BlogSpace account, you can safely ignore this email.</p>
            
            <div class="footer-links">
            <a href="${process.env.SERVER_URL}">Visit BlogSpace</a>
            <a href="${process.env.SERVER_URL}/contact">Contact Support</a>
            <a href="${process.env.SERVER_URL}/about">About Us</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
            © 2024 BlogSpace. Made with ❤️ for writers everywhere.
            </p>
        </div>
        </div>
    </div>
    </body>
    </html>
`;
}

export const passwordResetTemplate = (link: string, email: string) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your BlogSpace Password</title>
        <!--[if mso]>
        <noscript>
            <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            /* Reset styles */
            body, table, td, p, div, span {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
            }
            
            /* Email client compatibility */
            body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            }
            
            table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            }
            
            img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            display: block;
            }
            
            /* Main styles */
            .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            }
            
            .logo {
            color: white;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            text-decoration: none;
            }
            
            .logo::before {
            content: "✍️";
            margin-right: 10px;
            }
            
            .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin: 0;
            }
            
            .content {
            background: white;
            padding: 40px 30px;
            }
            
            .icon-container {
            text-align: center;
            margin-bottom: 30px;
            }
            
            .reset-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: white;
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
            }
            
            .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
            }
            
            .message {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 25px;
            text-align: center;
            }
            
            .reset-container {
            background: linear-gradient(145deg, #f8f9ff, #e8ecff);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            padding: 35px;
            margin: 35px 0;
            text-align: center;
            }
            
            .reset-button {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white !important;
            text-decoration: none;
            padding: 18px 40px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            text-align: center;
            margin-bottom: 20px;
            }
            
            .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
            }
            
            .button-subtitle {
            font-size: 13px;
            color: #888;
            font-style: italic;
            margin-top: 15px;
            }
            
            .alternative-link {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 12px;
            color: #6c757d;
            word-break: break-all;
            line-height: 1.4;
            }
            
            .alternative-text {
            font-size: 13px;
            color: #666;
            margin-bottom: 10px;
            text-align: center;
            }
            
            .expiry-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
            }
            
            .expiry-warning p {
            margin: 0;
            font-size: 14px;
            color: #856404;
            font-weight: 500;
            }
            
            .security-note {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
            }
            
            .security-note p {
            margin: 0;
            font-size: 13px;
            color: #721c24;
            font-weight: 500;
            }
            
            .help-section {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            }
            
            .help-section h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #0c5460;
            font-weight: 600;
            }
            
            .help-section p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #0c5460;
            line-height: 1.5;
            }
            
            .help-section p:last-child {
            margin-bottom: 0;
            }
            
            .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            }
            
            .footer-content {
            font-size: 13px;
            color: #6c757d;
            line-height: 1.5;
            }
            
            .footer-links {
            margin-top: 15px;
            }
            
            .footer-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
            font-weight: 500;
            }
            
            .footer-links a:hover {
            text-decoration: underline;
            }
            
            .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #667eea, transparent);
            margin: 30px 0;
            }
            
            /* Mobile responsiveness */
            @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            .header {
                padding: 30px 20px !important;
            }
            
            .logo {
                font-size: 24px !important;
            }
            
            .greeting {
                font-size: 20px !important;
            }
            
            .reset-container {
                padding: 25px 20px !important;
            }
            
            .reset-button {
                padding: 16px 30px !important;
                font-size: 15px !important;
                width: 90%;
                box-sizing: border-box;
            }
            
            .reset-icon {
                width: 60px;
                height: 60px;
                font-size: 28px;
            }
            }
        </style>
        </head>
        <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
            <div class="logo">BlogSpace</div>
            <p class="header-subtitle">Your Minimal Blogging Platform</p>
            </div>
            
            <!-- Main Content -->
            <div class="content">
            <div class="icon-container">
                <div class="reset-icon">🔐</div>
            </div>
            
            <h1 class="greeting">Password Reset Request</h1>
            
            <p class="message">
                We received a request to reset the password for your BlogSpace account associated with <strong>${email}</strong>.
            </p>
            
            <p class="message">
                If you made this request, click the button below to choose a new password. If you didn't request this, you can safely ignore this email.
            </p>
            
            <div class="reset-container">
                <a href="${link}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="expiry-warning">
                <p>⏰ This password reset link is short-lived for your security. If you need a new link, please request another password reset.</p>
            </div>
            
            <div class="alternative-text">
                If the button doesn't work, copy and paste this link into your browser:
            </div>
            
            <div class="alternative-link">
                ${link}
            </div>
            
            <div class="divider"></div>
            
            <div class="help-section">
                <h3>Need Help?</h3>
                <p>• If you didn't request this password reset, please ignore this email</p>
                <p>• Your password won't change until you create a new one using the link above</p>
                <p>• If you're having trouble, contact our support team</p>
            </div>
            
            <div class="security-note">
                <p>🔒 For your security, never share password reset links with anyone. BlogSpace will never ask for your password via email.</p>
            </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
            <div class="footer-content">
                <p>This email was sent to <strong>${email}</strong></p>
                <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
                
                <div class="footer-links">
                <a href="${process.env.SERVER_URL}">Visit BlogSpace</a>
                <a href="${process.env.SERVER_URL}/contact">Contact Support</a>
                <a href="${process.env.SERVER_URL}/about">About Us</a>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2024 BlogSpace. Made with ❤️ for writers everywhere.
                </p>
            </div>
            </div>
        </div>
        </body>
        </html>
    
    `
}