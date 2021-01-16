function AuthForm({
  title,
  buttonText,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  submit,
  errors
}) {

  return (
    <form onSubmit={submit} className="card p-4 m-auto" style={{ width: '18rem' }}>
      <h1>{title}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          id="email"
          className="form-control"
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={onPasswordChange}
        />
      </div>
      {errors}
      <button className="btn btn-primary" type="submit">{buttonText}</button>
    </form>
  )
}

export default AuthForm