import React from 'react';
import { useState, useEffect, useRef } from 'react';
import logo from './logo.png';
import './App.css';
import bcrypt from 'bcryptjs';

function App() {
  const url = 'https://frontend-take-home.fetchrewards.com/form';

  const [occupations, setOccupations] = useState([]);
  const [states, setStates] = useState([]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // use effect hook here to load up dropdowns with data from api call
  useEffect(() => {
    fetch(url).then((res) => {
      return res.json();
    }).then((json) => {
      setOccupations(json.occupations);
      setStates(json.states);
    }).catch(err => {
      setError(err);
    })
  }, []);

  // define form data values
  const nameEl = useRef();
  const emailEl = useRef();
  const passEl = useRef();
  const occupationEl = useRef();
  const stateEl = useRef();

  // submit form 
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);

    // validate form - TODO don't hardcode this
    if (nameEl.current.value === '') {
      setError('Please fill in the Name field.');
      return;
    }
    if (emailEl.current.value === '') {
      setError('Please fill in the Email field.');
      return;
    }
    if (passEl.current.value === '') {
      setError('Please fill in the Password field.');
      return;
    }
    if (occupationEl.current.value === '') {
      setError('Please fill in the Occupation field.');
      return;
    }
    if (stateEl.current.value === '') {
      setError('Please fill in the State field.');
      return;
    }
    
    // encrypt password
    const hashedPass = bcrypt.hashSync(passEl.current.value);

    // format data
    const data = {
      name: nameEl.current.value,
      email: emailEl.current.value,
      password: hashedPass,
      occupation: occupationEl.current.value,
      state: stateEl.current.value
    }

    // submit form request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    const call = await fetch(url, requestOptions);

    // show results of request (success or error)
    if (call.status !== 201 && call.status !== 200) {
      setError('There was an issue submitting this form. Please try again.');
      return;
    }

    setError(null);
    setSuccess(true);

    // clear all form values
    document.getElementById("signUpForm").reset();
  }

  return (
    <div className="app container">
      <div className="row pt-5 pb-5">
        <div className="col-md">
          <img src={logo} alt="logo" className="img-fluid"/>
        </div>
        <div className="col-md">
          <form id="signUpForm" className="d-flex flex-column bg-white pt-3 pl-5 pr-5 pb-4 rounded shadow" onSubmit={handleSubmit}>
            <div>
              <h2>Sign Up</h2>
              <hr></hr>
            </div>

            {success &&
            <div className="text-success alert success">
              Thank you for signing up with Fetch Rewards!
            </div>
            }

            {error !== null &&
            <div className="text-danger alert error">
              {error}
            </div>
            }

            <div className="form-group">
              <label>Name</label>
              <input type="name" className="form-control" id="nameInput" placeholder="Enter name" ref={nameEl}/>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" id="emailInput" placeholder="Enter email" name="email" ref={emailEl}/>
              <small className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" id="passwordInput" placeholder="Enter password" name="password" ref={passEl}/>
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <select className="form-control" name="occupation" ref={occupationEl}>
                {occupations.map(o => (<option key={o}>{o}</option>))}
              </select>
            </div>

            <div className="form-group">
              <label>State</label>
              <select className="form-control" name="state" ref={stateEl}>
                {states.map(o => (<option key={o.abbreviation}>{o.name}</option>))}
              </select>
            </div>

            <button type="submit" className="btn btn-secondary mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
