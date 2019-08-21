const resetPasswordTemplate = (user, token) => {

  const { email } = user;

  const template = {
    to: email,
    from: 'noreply@app-stagin-api.ng',
    subject: 'Password Reset Link',
    html: `
    <p>You requested a password reset.</p>
    <p>
        <a href="${process.env.REDIRECT_DOMAIN}/reset-password/${token}">
        Click here
        </a> 
        to reset your password
    </p>
    `
  }

  return template
}

export default resetPasswordTemplate;