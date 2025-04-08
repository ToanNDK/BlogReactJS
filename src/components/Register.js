import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import requestApi from '../helpers/api';
import { useDispatch } from 'react-redux';
import * as actions from '../redux/actions';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerData, setRegisterData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    status: 1
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [registerData]);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!registerData.first_name) errors.first_name = 'Please enter your first name';
    if (!registerData.last_name) errors.last_name = 'Please enter your last name';

    if (!registerData.email) {
      errors.email = 'Please enter your email';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(registerData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!registerData.password) errors.password = 'Please enter your password';
    if (!registerData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (registerData.password !== registerData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;

    return isValid;
  };

  const onSubmit = () => {
    setIsSubmitted(true);
    if (!validateForm()) return;

    const payload = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      email: registerData.email,
      password: registerData.password,
      status: 1
    };

    dispatch(actions.controlLoading(true));
    requestApi('/auth/register', 'POST', payload)
      .then(() => {
        dispatch(actions.controlLoading(false));
        toast.success('Account created successfully!', { position: 'top-center' });
        navigate('/login');
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        if (err.response) {
          toast.error(err.response.data.message, { position: 'top-center' });
        } else {
          toast.error('Server error. Please try again later.', { position: 'top-center' });
        }
      });
  };

  return (
    <div id="layoutAuthentication" className="login-background">
      <div id="layoutAuthentication_content">
        <main>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="card shadow-lg border-0 rounded-lg mt-5">
                  <div className="card-header">
                    <h3 className="text-center font-weight-light my-4">Create Account</h3>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3 mb-md-0">
                            <input
                              className="form-control"
                              name="first_name"
                              type="text"
                              placeholder="Enter your first name"
                              onChange={onChange}
                            />
                            <label>First name</label>
                            {formErrors.first_name && <p style={{ color: 'red' }}>{formErrors.first_name}</p>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating">
                            <input
                              className="form-control"
                              name="last_name"
                              type="text"
                              placeholder="Enter your last name"
                              onChange={onChange}
                            />
                            <label>Last name</label>
                            {formErrors.last_name && <p style={{ color: 'red' }}>{formErrors.last_name}</p>}
                          </div>
                        </div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          className="form-control"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          onChange={onChange}
                        />
                        <label>Email address</label>
                        {formErrors.email && <p style={{ color: 'red' }}>{formErrors.email}</p>}
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="form-floating mb-3 mb-md-0">
                            <input
                              className="form-control"
                              name="password"
                              type="password"
                              placeholder="Create a password"
                              onChange={onChange}
                            />
                            <label>Password</label>
                            {formErrors.password && <p style={{ color: 'red' }}>{formErrors.password}</p>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-floating mb-3 mb-md-0">
                            <input
                              className="form-control"
                              name="confirmPassword"
                              type="password"
                              placeholder="Confirm password"
                              onChange={onChange}
                            />
                            <label>Confirm Password</label>
                            {formErrors.confirmPassword && (
                              <p style={{ color: 'red' }}>{formErrors.confirmPassword}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 mb-0">
                        <div className="d-grid">
                          <button type="button" onClick={onSubmit} className="btn btn-primary btn-block">
                            Create Account
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center py-3">
                    <div className="small">
                      <Link to="/login">Have an account? Go to login</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="layoutAuthentication_footer">
        <footer className="py-4 bg-light mt-auto">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center justify-content-between small">
              <div className="text-muted">Copyright &copy; Your Website 2023</div>
              <div>
                <a href="#">Privacy Policy</a>
                &middot;
                <a href="#">Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Register;
