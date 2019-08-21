const resetPasswordTemplateMobile = (user, token) => {

  const { email } = user;

  const template = {
    to: email,
    from: 'noreply@app-stagin-api.ng',
    subject: 'Password Reset Link',
    html: `
    <p>You requested a password reset.</p>
    <p>Reset password OTP: ${token}</p>
    `
  }

  return template
}

export default resetPasswordTemplateMobile;