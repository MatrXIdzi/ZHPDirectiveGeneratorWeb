import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalMessage, setGeneralMessage] = useState('');
  const [emailExists, setEmailExists] = useState('');
  const [usernameExists, setUsernameExists] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Reset błędów dla pola
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: '',
    });

    if (e.target.name === 'email') {
      setEmailExists('');
    }

    if (e.target.name === 'username') {
      setUsernameExists('');
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;

    try {
      const response = await fetch(`http://localhost:8080/api/auth/check-email?email=${formData.email}`);
      if (!response.ok) {
        const err = await response.text();
        setEmailExists(t(err));
      } else {
        setEmailExists('');
      }
    } catch (error) {
      setGeneralMessage(
        `${t('register.networkError')}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const handleUsernameBlur = async () => {
    if (!formData.username) return;

    try {
      const response = await fetch(`http://localhost:8080/api/auth/check-username?username=${formData.username}`);
      if (!response.ok) {
        const err = await response.text();
        setUsernameExists(t(err));
      } else {
        setUsernameExists('');
      }
    } catch (error) {
      setGeneralMessage(
        `${t('register.networkError')}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  useEffect(() => {
    if (formData.email) {
      handleEmailBlur();
    }
  }, [formData.email]);
  
  useEffect(() => {
    if (formData.username) {
      handleUsernameBlur();
    }
  }, [formData.username]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstname) errors.firstname = t('register.errorRequired');
    if (!formData.surname) errors.surname = t('register.errorRequired');
    if (!formData.email) errors.email = t('register.errorRequired');
    else if (!formData.email.includes('@')) errors.email = t('register.invalidEmail');

    if (!formData.username) errors.username = t('register.errorRequired');
    if (!formData.password) errors.password = t('register.errorRequired');
    else if (formData.password.length < 8) errors.password = t('register.passwordTooShort');

    if (!formData.confirmPassword) errors.confirmPassword = t('register.errorRequired');
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = t('register.passwordsDontMatch');

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralMessage('');

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...dataToSend } = formData;

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate('/');
      } else {
        const err = await response.text();
        setGeneralMessage(`${t('register.error')}: ${err}`);
      }
    } catch (error) {
      setGeneralMessage(
        `${t('register.networkError')}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const isSubmitDisabled = !!emailExists || !!usernameExists;

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="register-title">{t('register.title')}</h1>

        <div className="form-group">
          <label htmlFor="firstname">{t('register.firstname')}</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
          />
          {fieldErrors.firstname && <div className="field-error">{fieldErrors.firstname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="surname">{t('register.surname')}</label>
          <input
            id="surname"
            name="surname"
            type="text"
            value={formData.surname}
            onChange={handleChange}
          />
          {fieldErrors.surname && <div className="field-error">{fieldErrors.surname}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('register.email')}</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          {emailExists && <div className="field-error">{emailExists}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="username">{t('register.username')}</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleUsernameBlur}
          />
          {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
          {usernameExists && <div className="field-error">{usernameExists}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('register.password')}</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitDisabled}>
          {t('register.submit')}
        </button>

        {generalMessage && <div className="general-message">{generalMessage}</div>}
      </form>
    </div>
  );
};

export default Register;
