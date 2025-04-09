import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requestApi from "../helpers/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import * as actions from "../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onChange = (event) => {
    let target = event.target;
    setLoginData({
      ...loginData,
      [target.name]: target.value,
    });
  };

  useEffect(() => {
    if (isSubmitted) {
      validateForm();
    }
  }, [loginData]);

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    if (loginData.email === "" || loginData.email === undefined) {
      errors.email = "Please enter email";
    } else {
      let valid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        loginData.email
      );
      if (!valid) {
        errors.email = "Email is not valid";
      }
    }

    if (loginData.password === "" || loginData.password === undefined) {
      errors.password = "Please enter password";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      isValid = false;
    } else {
      setFormErrors({});
    }

    return isValid;
  };

  const onSubmit = () => {
    console.log(loginData);
    let valid = validateForm();
    if (valid) {
      //request login api
      console.log("request login api");
      dispatch(actions.controlLoading(true));
      requestApi("/auth/login", "POST", loginData)
        .then((res) => {
          console.log(res);
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          dispatch(actions.controlLoading(false));
          navigate("/");
        })
        .catch((err) => {
          dispatch(actions.controlLoading(false));
          console.log(err);
          if (typeof err.response !== "undefined") {
            if (err.response.status !== 201) {
              toast.error(err.response.data.message, {
                position: "top-center",
              });
            }
          } else {
            toast.error("Server is down. Please try again!", {
              position: "top-center",
            });
          }
        });
    }

    setIsSubmitted(true);
  };

  return (
    <div id="layoutAuthentication" className="login-background bg-light py-5 min-vh-100 d-flex align-items-center">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0 rounded-3">
          <div className="card-header bg-white border-0 text-center py-4">
            <h3 className="fw-bold">Đăng Nhập</h3>
          </div>
          <div className="card-body px-4">
            <form>
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                  type="email"
                  name="email"
                  id="email"
                  onChange={onChange}
                  placeholder="name@example.com"
                />
                {formErrors.email && (
                  <div className="invalid-feedback">{formErrors.email}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
                <input
                  className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                  type="password"
                  name="password"
                  id="password"
                  onChange={onChange}
                  placeholder="••••••••"
                />
                {formErrors.password && (
                  <div className="invalid-feedback">{formErrors.password}</div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <a className="small text-decoration-none text-primary" href="password.html">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 py-2 fw-semibold"
                onClick={onSubmit}
              >
                Đăng nhập
              </button>
            </form>

            <div className="my-4 text-center text-muted">Hoặc</div>

            <div className="d-grid gap-2">
              <a
                href="http://localhost:5000/auth/google"
                className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
              >
                <FontAwesomeIcon icon={faGoogle} />
                Đăng nhập bằng Google
              </a>

              <a
                href="http://localhost:5000/auth/github"
                className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2"
              >
                <FontAwesomeIcon icon={faGithub} />
                Đăng nhập bằng GitHub
              </a>
            </div>
          </div>
          <div className="card-footer text-center bg-white border-0 py-3">
            <span className="text-muted small">Chưa có tài khoản?</span>{' '}
            <Link to="/register" className="text-decoration-none fw-semibold">Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
