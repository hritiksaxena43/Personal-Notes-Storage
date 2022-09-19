import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Login = (props) => {
    const navigate = useNavigate();
    const [credentails, setcredentails] = useState({email: "", password: ""})
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credentails.email, password: credentails.password})
        });
        const json = await response.json();
        console.log(json)
        if (json.success) {
            localStorage.setItem('token', json.authtoken)
            navigate("/");
            props.showAlert("Logged in Successfully", "success")
        }
        else
        {
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
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" name='email' value={credentails.email} id="email" aria-describedby="emailHelp" onChange={onChange} placeholder="Please Enter a Email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" value={credentails.password} name="password" className="form-control" id="password" onChange={onChange} placeholder="Please Enter a Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login