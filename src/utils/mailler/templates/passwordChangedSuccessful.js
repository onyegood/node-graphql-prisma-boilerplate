const passwordChangedSuccessful = (email, message) => {
  const template = {
    to: email,
    from: 'noreply@app-stagin-api.ng',
    subject: 'Password Reset Link',
    html: message
  }

  return template
}

export default passwordChangedSuccessful;