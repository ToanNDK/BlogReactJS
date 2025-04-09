import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import requestApi from "../helpers/api";
import { useDispatch } from "react-redux";
import * as actions from "../redux/actions";
import "animate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: 1,
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

  const getPasswordStrength = (password) => {
    if (password.length < 6) {
      return { text: "Weak password", color: "text-danger" };
    }
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const medium = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{6,}$/;

    if (strong.test(password)) {
      return { text: "Strong password", color: "text-success" };
    } else if (medium.test(password)) {
      return { text: "Medium strength password", color: "text-warning" };
    } else {
      return { text: "Weak password", color: "text-danger" };
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!registerData.first_name) {
      errors.first_name = "Please enter your first name";
    }

    if (!registerData.last_name) {
      errors.last_name = "Please enter your last name";
    }

    if (!registerData.email) {
      errors.email = "Please enter your email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(registerData.email)
    ) {
      errors.email = "Invalid email format";
    }

    if (!registerData.password) {
      errors.password = "Please enter your password";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        registerData.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

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
      status: 1,
    };

    dispatch(actions.controlLoading(true));
    requestApi("/auth/register", "POST", payload)
      .then(() => {
        dispatch(actions.controlLoading(false));
        toast.success("Account created successfully!", {
          position: "top-center",
        });
        navigate("/login");
      })
      .catch((err) => {
        dispatch(actions.controlLoading(false));
        if (err.response) {
          toast.error(err.response.data.message, { position: "top-center" });
        } else {
          toast.error("Server error. Please try again later.", {
            position: "top-center",
          });
        }
      });
  };

  return (
    <div
      id="layoutAuthentication"
      className="login-background bg-light min-vh-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-lg mt-5 animate__animated animate__fadeInDown">
              <div className="card-header bg-primary text-white text-center py-3">
                <h3 className="fw-light mb-0">Đăng ký</h3>
              </div>
              <div className="card-body px-4 py-4">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Họ</label>
                      <input
                        className="form-control"
                        name="first_name"
                        type="text"
                        placeholder="Enter your first name"
                        onChange={onChange}
                      />
                      {formErrors.first_name && (
                        <div className="text-danger mt-1">
                          {formErrors.first_name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tên</label>
                      <input
                        className="form-control"
                        name="last_name"
                        type="text"
                        placeholder="Enter your last name"
                        onChange={onChange}
                      />
                      {formErrors.last_name && (
                        <div className="text-danger mt-1">
                          {formErrors.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      onChange={onChange}
                    />
                    {formErrors.email && (
                      <div className="text-danger mt-1">{formErrors.email}</div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                          className="form-control focus-ring"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          onChange={onChange}
                          value={registerData.password}
                        />
                        <span
                          className="input-group-text"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                      {formErrors.password && (
                        <div className="text-danger mt-1">
                          {formErrors.password}
                        </div>
                      )}
                      {registerData.password && (
                        <div
                          className={`mt-1 fw-semibold ${
                            getPasswordStrength(registerData.password).color
                          }`}
                        >
                          {getPasswordStrength(registerData.password).text}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Xác nhận mật khẩu</label>
                      <div className="input-group">
                        <input
                          className="form-control focus-ring"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          onChange={onChange}
                        />
                        <span
                          className="input-group-text"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                          />
                        </span>
                      </div>
                      {formErrors.confirmPassword && (
                        <div className="text-danger mt-1">
                          {formErrors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="button"
                      onClick={onSubmit}
                      className="btn btn-primary fw-bold py-2"
                    >
                      Đăng ký
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer text-center py-3 bg-light">
                <div className="small">
                  <Link to="/login">Đã có tài khoản?  Đăng nhập ngay</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
