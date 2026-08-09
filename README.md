# Advanced Login & Signup UI 🔐

A modern, responsive, and interactive Login and Signup system built with **HTML, CSS, and Vanilla JavaScript**. This project includes strict real-time form validation, password strength checking, and a complete UI flow for password recovery.

<img width="1870" height="842" alt="image" src="https://github.com/user-attachments/assets/3ca1a1e1-e52c-4a3b-b9b6-ce0737f2dcc5" />

<img width="1862" height="842" alt="image" src="https://github.com/user-attachments/assets/795b468d-b9c7-4dc7-bd74-c8a25255e1ed" />



## ✨ Features

- **Interactive Forms:** Smooth sliding transition between Login and Signup forms.
- **Strict Password Validation:** Real-time checking for:
  - Minimum 8 characters
  - At least one uppercase letter (`A-Z`)
  - At least one lowercase letter (`a-z`)
  - At least one number (`0-9`)
  - At least one special character (`!@#$%^&*`)
- **Live Visual Feedback:** Input borders turn green for valid entries and red for invalid ones.
- **Password Match Checker:** Live comparison between `Password` and `Confirm Password` fields.
- **Password Visibility Toggle:** Easily hide or show passwords using the eye icon.
- **Smart Clear Buttons (✕):** Instantly clear inputs; buttons appear only when text is entered.
- **Password Reset Flow:** Includes fully designed UI pages for:
  - Forgot Password
  - Reset Link Sent
  - Set New Password
  - Password Reset Success
- **Fully Responsive:** Adapts to desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

- **HTML5:** Semantic structure and form elements.
- **CSS3:** Custom properties (variables), Flexbox, CSS animations, and responsive media queries.
- **Vanilla JavaScript (ES6):** DOM manipulation, regex-based form validation, and event handling.
- **Unicons:** Clean and modern vector icons.

## 📂 File Structure

```text
├── assets/
│   ├── images/                       # SVG illustrations and social login icons
│   ├── style.css                     # Main stylesheet
│   └── script.js                     # Core logic & validation script
├── index.html                         # Main Login & Signup page
├── request-reset-form.html            # Step 1: Forgot Password page
├── reset_send_message.html            # Step 2: Check Email success page
├── set-new-password.html              # Step 3: Set New Password page
└── password_reset_complete.html       # Step 4: Password reset successful page
```

## 🚀 How to Run

This is a static frontend project. No build tools or local server are strictly required.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
```

### 2. Navigate to the project folder

```bash
cd your-repo-name
```

### 3. Open the app

Simply open `index.html` in your default web browser.

For a better development experience, you can also use the **Live Server** extension in VS Code.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

If you'd like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Open a Pull Request.

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 📝 Note

Replace:

```text
yourusername/your-repo-name
```

with your actual GitHub username and repository name.

For example:

```bash
git clone https://github.com/PrakashKC/advanced-login-signup-ui.git
```

> This README is designed to present the project in a clean, professional, and attractive way on GitHub.
