import React, { useState } from 'react'
import loginDetails from '../loginDetails.json';

const Login = ({ setLoginState }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = formData;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = e => {
    e.preventDefault();
    if (loginDetails.email === email && loginDetails.password === password) {
      setLoginState(true)
    }
  }

  return (
    <div>

      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" onChange={handleChange} value={email} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" onChange={handleChange} value={password} />
        </div>
        <button type="submit">Login</button>

      </form>
    </div>
  )
}

export default Login