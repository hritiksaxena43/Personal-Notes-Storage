import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const SignUp = (props) => {
    const navigate = useNavigate();
    const [credentails, setcredentails] = useState({ name: "", email: "", password: "", cpassword: "" })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password } = credentails
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        const json = await response.json();
        console.log(json)
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate("/");
            props.showAlert("Account Created Successfully", "success")
        }
        else {
            props.showAlert("Invalid Credentials","danger")
        }
    }
    const onChange = (e) => {
        setcredentails({ ...credentails, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" name='name' className="form-control" id="name" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" name='email' className="form-control" id="email" aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="password" onChange={onChange} minLength={8} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" name='cpassword' className="form-control" id="cpassword" onChange={onChange} minLength={8} required/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default SignUp