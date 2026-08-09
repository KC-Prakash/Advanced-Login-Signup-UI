document.addEventListener("DOMContentLoaded", () => {
  initInputFocusEffects();
  initPasswordToggle();
  initFormToggle();
  initPasswordMatchValidation();
  initPasswordStrengthValidation();
  initSetNewPasswordStatus();
  initEmailValidation();
  initUsernameValidation();
  initClearButtons();
  initAdvancedPasswordRequirements();
  initLoginPasswordValidation(); // यो नयाँ थपिएको हो
});

// ══════════════════════════════════════════════════════════════════════════
// VALIDATION UTILITIES
// ══════════════════════════════════════════════════════════════════════════

const VALIDATORS = {
  // Email validation regex (RFC 5322 simplified)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Username: alphanumeric + spaces + basic punctuation, no special chars
  username: /^[a-zA-Z\s'-]{2,50}$/,
  
  // Password requirements
  passwordRules: {
    minLength: (pw) => pw.length >= 8,
    hasUppercase: (pw) => /[A-Z]/.test(pw),
    hasLowercase: (pw) => /[a-z]/.test(pw),
    hasNumber: (pw) => /[0-9]/.test(pw),
    hasSpecial: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
  },
  
  // Common weak passwords to avoid
  commonPasswords: [
    'password', '12345678', 'qwerty', 'abc12345', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'sunshine',
    'princess', 'qwerty123', 'password123', 'admin', 'login'
  ]
};

// Email validation
function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email is required' };
  if (!VALIDATORS.email.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true, message: 'Email is valid' };
}

// Username/name validation
function validateUsername(username) {
  if (!username) return { valid: false, message: 'Name is required' };
  if (username.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  if (!VALIDATORS.username.test(username)) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true, message: 'Name is valid' };
}

// Advanced password validation
function validatePassword(password) {
  const result = {
    valid: false,
    strength: 'weak',
    checks: {
      minLength: VALIDATORS.passwordRules.minLength(password),
      hasUppercase: VALIDATORS.passwordRules.hasUppercase(password),
      hasLowercase: VALIDATORS.passwordRules.hasLowercase(password),
      hasNumber: VALIDATORS.passwordRules.hasNumber(password),
      hasSpecial: VALIDATORS.passwordRules.hasSpecial(password),
    },
    isCommon: false,
    message: ''
  };

  // Check if password is too common
  if (VALIDATORS.commonPasswords.includes(password.toLowerCase())) {
    result.isCommon = true;
    result.message = 'This password is too common. Choose a stronger password.';
    return result;
  }

  // Calculate strength 
  const passedChecks = Object.values(result.checks).filter(Boolean).length;
  
  // यहाँ पहिले >= 4 थियो, अब === 5 बनाइएको छ (५ वटै सर्त पूरा हुनैपर्छ)
  if (passedChecks === 5) result.strength = 'strong';
  else if (passedChecks >= 3) result.strength = 'medium';
  else result.strength = 'weak';

  // Valid = strong password (सबै ५ नियम पास भए मात्र valid हुन्छ)
  result.valid = result.strength === 'strong' && !result.isCommon;
  
  if (result.valid) {
    result.message = 'Strong password!';
  }

  return result;
}

// ══════════════════════════════════════════════════════════════════════════
// EMAIL & PASSWORD VALIDATION LISTENERS
// ══════════════════════════════════════════════════════════════════════════

function initEmailValidation() {
  // Sign-up email
  const signupEmailInput = document.getElementById('signup-email');
  if (signupEmailInput) {
    signupEmailInput.addEventListener('input', () => updateEmailValidation('signup'));
    signupEmailInput.addEventListener('blur', () => updateEmailValidation('signup'));
  }

  // Login email
  const loginEmailInput = document.getElementById('login-email');
  if (loginEmailInput) {
    loginEmailInput.addEventListener('input', () => updateEmailValidation('login'));
    loginEmailInput.addEventListener('blur', () => updateEmailValidation('login'));
  }

  // Reset email
  const resetEmailInput = document.getElementById('reset-email');
  if (resetEmailInput) {
    resetEmailInput.addEventListener('input', () => updateEmailValidation('reset'));
    resetEmailInput.addEventListener('blur', () => updateEmailValidation('reset'));
  }
}

function updateEmailValidation(page) {
  const prefix = page === 'signup' ? 'signup-email' : page === 'login' ? 'login-email' : 'reset-email';
  const emailInput = document.getElementById(prefix);
  const validation = document.getElementById(prefix + '-validation');
  const field = emailInput.parentNode;

  if (!emailInput.value) {
    // यदि validation span छ भने मात्र त्यसको style चेन्ज गर्ने
    if (validation) {
      validation.style.display = 'none';
    }
    field.classList.remove('valid', 'invalid');
    return;
  }

  const result = validateEmail(emailInput.value);

  if (result.valid) {
    field.classList.add('valid');
    field.classList.remove('invalid');
    if (validation) {
      validation.style.display = 'none';
      validation.className = 'validation-icon';
    }
  } else {
    field.classList.add('invalid');
    field.classList.remove('valid');
    if (validation) {
      validation.innerHTML = '✕';
      validation.className = 'validation-icon invalid-icon';
      validation.style.display = 'flex';
    }
  }
}

// Login Password Validation (Strict Rules Update)
function initLoginPasswordValidation() {
  const loginPassword = document.getElementById('login-password');
  if (loginPassword) {
    loginPassword.addEventListener('input', () => {
      const field = loginPassword.parentNode;
      const pw = loginPassword.value;
      
      // यदि पासवर्ड खाली छ भने कुनै पनि कलर नदेखाउने
      if (!pw) {
        field.classList.remove('valid', 'invalid');
        return;
      }

      // सबै नियमहरू चेक गर्ने (8 chars, uppercase, lowercase, number, symbol)
      const hasLength = pw.length >= 8;
      const hasUpper = /[A-Z]/.test(pw);
      const hasLower = /[a-z]/.test(pw);
      const hasNumber = /[0-9]/.test(pw);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw);

      // यदि माथिका सबै ५ वटै सर्तहरू पूरा भए मात्र हरियो (valid) देखाउने
      if (hasLength && hasUpper && hasLower && hasNumber && hasSpecial) {
        field.classList.add('valid');
        field.classList.remove('invalid');
      } else {
        // कुनै एउटा कुरा पुगेन भने रातो (invalid) देखाउने
        field.classList.add('invalid');
        field.classList.remove('valid');
      }
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// USERNAME/NAME VALIDATION
// ══════════════════════════════════════════════════════════════════════════

function initUsernameValidation() {
  const usernameInput = document.getElementById('signup-username');
  if (!usernameInput) return;

  usernameInput.addEventListener('input', updateUsernameValidation);
  usernameInput.addEventListener('blur', updateUsernameValidation);
}

function updateUsernameValidation() {
  const usernameInput = document.getElementById('signup-username');
  const field = usernameInput.parentNode;

  if (!usernameInput.value) {
    field.classList.remove('valid', 'invalid');
    return;
  }

  const result = validateUsername(usernameInput.value);

  if (result.valid) {
    field.classList.add('valid');
    field.classList.remove('invalid');
  } else {
    field.classList.add('invalid');
    field.classList.remove('valid');
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ADVANCED PASSWORD REQUIREMENTS
// ══════════════════════════════════════════════════════════════════════════

function initAdvancedPasswordRequirements() {
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    // Only show requirements when user starts typing, not on focus alone
    passwordInput.addEventListener('input', () => {
      const reqEl = document.getElementById('password-requirements');
      if (passwordInput.value.length > 0) {
        reqEl.classList.add('show');
      } else {
        reqEl.classList.remove('show');
      }
      updatePasswordRequirements();
    });
  }

  const newPasswordInput = document.getElementById('new-password');
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', () => {
      const reqEl = document.getElementById('new-password-requirements');
      if (newPasswordInput.value.length > 0) {
        reqEl.classList.add('show');
      } else {
        reqEl.classList.remove('show');
      }
      updatePasswordRequirements('new');
    });
  }
}

function updatePasswordRequirements(page = '') {
  const prefix = page === 'new' ? 'new-' : '';
  const passwordInput = document.getElementById(prefix + 'password');
  const reqId = prefix === 'new-' ? 'new-req-' : 'req-';

  if (!passwordInput) return;

  const password = passwordInput.value;
  const validation = validatePassword(password);
  const field = passwordInput.parentNode;
  const validationIcon = document.getElementById((prefix || '') + 'password-validation');

  // Update each requirement
  updateRequirement(reqId + 'length', validation.checks.minLength);
  updateRequirement(reqId + 'uppercase', validation.checks.hasUppercase);
  updateRequirement(reqId + 'lowercase', validation.checks.hasLowercase);
  updateRequirement(reqId + 'number', validation.checks.hasNumber);
  updateRequirement(reqId + 'special', validation.checks.hasSpecial);

  // यदि पासवर्ड खाली छ भने कुनै कलर नदेखाउने
  if (!password) {
    if (validationIcon) {
      validationIcon.style.display = 'none';
      validationIcon.className = 'validation-icon';
    }
    field.classList.remove('valid', 'invalid');
    return;
  }

  // यहाँ चेन्ज गरिएको छ: पासवर्ड टाइप गर्ने बित्तिकै (८ अक्षर नपुगे पनि) फेल भए रातो देखाउने
  if (validation.valid) {
    // ५ वटै सर्त पूरा भए मात्र हरियो
    field.classList.add('valid');
    field.classList.remove('invalid');
    if (validationIcon) {
      validationIcon.style.display = 'none';
      validationIcon.className = 'validation-icon';
    }
  } else {
    // एउटा मात्र सर्त फेल भए पनि रातो देखाउने
    field.classList.add('invalid');
    field.classList.remove('valid');
    if (validationIcon && validation.isCommon) {
      validationIcon.innerHTML = '✕';
      validationIcon.className = 'validation-icon invalid-icon';
      validationIcon.style.display = 'flex';
    } else if (validationIcon) {
      validationIcon.style.display = 'none';
    }
  }
}

function updateRequirement(reqId, isValid) {
  const reqElement = document.getElementById(reqId);
  if (!reqElement) return;

  if (isValid) {
    reqElement.classList.add('valid');
    reqElement.classList.remove('invalid');
    reqElement.querySelector('.req-icon').textContent = '✓';
  } else {
    reqElement.classList.remove('valid');
    reqElement.classList.add('invalid');
    reqElement.querySelector('.req-icon').textContent = '✕';
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CLEAR BUTTONS
// ══════════════════════════════════════════════════════════════════════════

function initClearButtons() {
  // Show/hide clear buttons based on input content
  const clearButtons = {
    'signup-email': 'clear-email',
    'signup-username': 'clear-username',
    'password': 'clear-password',
    'confirm-password': 'clear-confirm',
    'login-email': 'clear-login-email',
    'login-password': 'clear-login-password',
    'reset-email': 'clear-reset-email',
    'new-password': 'clear-new-password',
  };

  for (const [inputId, clearBtnId] of Object.entries(clearButtons)) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(clearBtnId);
    
    if (!input || !clearBtn) continue;

    // Show/hide button based on input value (uses 'visible' class for hover-only display)
    input.addEventListener('input', () => {
      if (input.value) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
    });

    // Clear input on button click (security: sensitive data cleared immediately)
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      input.value = '';
      clearBtn.classList.remove('visible');
      input.focus();
      
      // Trigger validation update
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      
      // For password fields, also clear visual validation
      if (inputId.includes('password')) {
        const field = input.parentNode;
        field.classList.remove('valid', 'invalid');
      }
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ORIGINAL FUNCTIONS (PRESERVED)
// ══════════════════════════════════════════════════════════════════════════

// Focus effects on input fields
function initInputFocusEffects() {
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", () => input.parentNode.classList.add("active"));
    input.addEventListener("blur",  () => input.parentNode.classList.remove("active"));
  });
}

// Show/hide password toggle
function initPasswordToggle() {
  const passwordInputs = document.querySelectorAll(".password-input");
  const eyeButtons     = document.querySelectorAll(".eye-btn");

  eyeButtons.forEach((eyeBtn, index) => {
    eyeBtn.addEventListener("click", () => {
      const passwordInput = passwordInputs[index];
      if (!passwordInput) return;
      const isPassword = passwordInput.type === "password";
      passwordInput.type      = isPassword ? "text" : "password";
      eyeBtn.innerHTML        = isPassword
        ? "<i class='uil uil-eye'></i>"
        : "<i class='uil uil-eye-slash'></i>";
    });
  });
}

// Toggle between sign-in and sign-up forms
function initFormToggle() {
  const signUpBtn  = document.querySelector(".sign-up-btn");
  const signInBtn  = document.querySelector(".sign-in-btn");
  const signUpForm = document.querySelector(".sign-up-form");
  const signInForm = document.querySelector(".sign-in-form");

  if (!signUpBtn || !signInBtn) return;

  signUpBtn.addEventListener("click", () => {
    signInForm.classList.add("hide");
    signInForm.classList.remove("show");
    signUpForm.classList.add("show");
  });

  signInBtn.addEventListener("click", () => {
    signInForm.classList.remove("hide");
    signInForm.classList.add("show");
    signUpForm.classList.remove("show");
  });
}

// Password match validation on sign-up submit
function initPasswordMatchValidation() {
  const signUpFormElement = document.querySelector(".sign-up-box form");
  if (!signUpFormElement) return;

  const passwordField        = signUpFormElement.querySelector("input[type='password']");
  const confirmPasswordField = document.getElementById("confirm-password");
  const passwordError        = document.getElementById("password-error");

  signUpFormElement.addEventListener("submit", (event) => {
    if (passwordField.value !== confirmPasswordField.value) {
      event.preventDefault();
      showError(passwordError, "Passwords do not match");
    } else {
      passwordError.style.display = "none";
    }
  });
}

// Password strength meter + live match check (sign-up)
function initPasswordStrengthValidation() {
  const passwordInput        = document.getElementById("password");
  const passwordStrength     = document.getElementById("password-strength");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const passwordError        = document.getElementById("password-error");

  if (!passwordInput) return;

  passwordInput.addEventListener("input", () => {
    checkPasswordStrength(passwordInput.value, passwordStrength);
    if (confirmPasswordInput.value) {
      checkPasswordMatch(passwordInput, confirmPasswordInput, passwordError);
    }
  });

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", () =>
      checkPasswordMatch(passwordInput, confirmPasswordInput, passwordError)
    );
  }
}


function initSetNewPasswordStatus() {
  const passwordInput        = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const statusText           = document.getElementById("status-text");

  if (!passwordInput || !confirmPasswordInput || !statusText) return;

  function updateStatus() {
    const pw  = passwordInput.value;
    const cpw = confirmPasswordInput.value;
    const confirmField = confirmPasswordInput.parentNode; 

    // यदि Confirm Password खाली छ भने कुनै कलर नदेखाउने
    if (!cpw) {
      statusText.textContent = "";
      statusText.className   = "status-text";
      confirmField.classList.remove('valid', 'invalid');
      return;
    }

    // पासवर्ड म्याच भयो भने हरियो बोर्डर (valid) ल्याउने
    if (pw === cpw) {
      statusText.textContent = "✓ Passwords match";
      statusText.className   = "status-text match";
      confirmField.classList.add('valid');
      confirmField.classList.remove('invalid');
    } else {
      statusText.textContent = "✗ Passwords do not match";
      statusText.className   = "status-text no-match";
      confirmField.classList.add('invalid');
      confirmField.classList.remove('valid');
    }
  }

  passwordInput.addEventListener("input", updateStatus);
  confirmPasswordInput.addEventListener("input", updateStatus);
}

// ══════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════

function checkPasswordStrength(password, strengthMeter) {
  if (!strengthMeter) return;

  if (!password) {
    strengthMeter.className = "password-strength";
    return;
  }

  const strong = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).{8,}$/;
  const medium = /^(?=.*[a-z])(?=.*[0-9]).{6,}$/;

  if (strong.test(password))      strengthMeter.className = "password-strength strong";
  else if (medium.test(password)) strengthMeter.className = "password-strength medium";
  else                            strengthMeter.className = "password-strength weak";
}

// Confirm Password को बोर्डर कलरको लागि अपडेट गरिएको फङ्सन
function checkPasswordMatch(passwordInput, confirmPasswordInput, errorEl) {
  if (!errorEl) return;
  
  const confirmField = confirmPasswordInput.parentNode;
  
  if (!confirmPasswordInput.value) {
    confirmField.classList.remove('valid', 'invalid');
    errorEl.style.display = "none";
    return;
  }

  if (passwordInput.value !== confirmPasswordInput.value) {
    showError(errorEl, "Passwords do not match!");
    confirmField.classList.add('invalid');
    confirmField.classList.remove('valid');
  } else {
    errorEl.textContent    = "";
    errorEl.style.display  = "none";
    confirmField.classList.add('valid');
    confirmField.classList.remove('invalid');
  }
}

function showError(el, message) {
  el.textContent   = message;
  el.style.display = "block";
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => { el.style.display = "none"; }, 5000);
}