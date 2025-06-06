import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Login.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalMessage, setGeneralMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: '',
    });
  };

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username) errors.username = t('login.errorRequired');
    if (!formData.password) errors.password = t('login.errorRequired');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralMessage('');

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        localStorage.setItem('token', data.token);
        setFormData({ username: '', password: '' });
        navigate('/');
      } else {
        formData.password = '';
        const err = await response.json();
        setGeneralMessage(`${t('login.error')}: ${t(err.message)}`);
      }
    } catch (error) {
      formData.password = '';
      setGeneralMessage(
        `${t('login.networkError')}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">{t('login.title')}</h1>

        <div className="form-group">
          <label htmlFor="username">{t('login.username')}</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
          />
          {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('login.password')}</label>
          <div className="password-input-container">
            <input
              id="password"
              name="password"
              type={isVisible ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              <i className={isVisible ? "bi bi-eye" : "bi bi-eye-slash"}></i>
            </button>
          </div>
          
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </div>

        <button type="submit" className="submit-button">
          {t('login.submit')}
        </button>

        {generalMessage && <div className="general-message">{generalMessage}</div>}
      </form>
      <p className="register-link">
        {t('login.noAccount')}{' '}
        <Link to="/register" className="register-link-text">
          {t('login.register')}
        </Link>
      </p>
    </div>
  );
};

export default Login;
