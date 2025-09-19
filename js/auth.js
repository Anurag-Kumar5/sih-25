// Authentication module
class AuthManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!email || !password || !role) {
            this.showError('Please fill in all fields');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        this.showLoading();

        try {
            // Simulate API call
            await this.simulateLogin(email, password, role);
            
            const userData = this.createUserData(email, role);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            this.hideLoading();
            this.showSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.app.currentUser = userData;
                window.app.showMainApp();
            }, 1000);
            
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async simulateLogin(email, password, role) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, accept any email/password combination
        // In a real app, this would make an API call to authenticate
        if (password.length < 3) {
            throw new Error('Password must be at least 3 characters long');
        }
        
        return true;
    }

    createUserData(email, role) {
        const names = {
            student: 'Alex Johnson',
            admin: 'Sarah Wilson',
            mentor: 'Dr. Michael Chen',
            recruiter: 'Emily Rodriguez'
        };

        return {
            id: Date.now(),
            email: email,
            name: names[role] || 'User',
            role: role,
            avatar: null,
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `auth-message ${type}`;
        messageEl.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        const form = document.getElementById('loginForm');
        if (form) {
            form.insertBefore(messageEl, form.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    showLoading() {
        const submitBtn = document.querySelector('.auth-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <div class="loading-spinner-small"></div>
                <span>Signing In...</span>
            `;
        }
    }

    hideLoading() {
        const submitBtn = document.querySelector('.auth-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Sign In</span>
                <i class="fas fa-arrow-right"></i>
            `;
        }
    }
}

// Quick login function for demo buttons
function quickLogin(role) {
    const demoCredentials = {
        student: { email: 'student@demo.com', name: 'Alex Johnson' },
        admin: { email: 'admin@demo.com', name: 'Sarah Wilson' },
        mentor: { email: 'mentor@demo.com', name: 'Dr. Michael Chen' },
        recruiter: { email: 'recruiter@demo.com', name: 'Emily Rodriguez' }
    };

    const credentials = demoCredentials[role];
    if (!credentials) return;

    // Fill form fields
    document.getElementById('email').value = credentials.email;
    document.getElementById('password').value = 'demo123';
    document.getElementById('role').value = role;

    // Add visual feedback
    const demoBtn = event.target.closest('.demo-btn');
    if (demoBtn) {
        demoBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            demoBtn.style.transform = '';
        }, 150);
    }

    // Trigger login after a short delay
    setTimeout(() => {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }, 300);
}

// Password toggle function
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Add styles for auth messages
const authStyles = document.createElement('style');
authStyles.textContent = `
    .auth-message {
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    }

    .auth-message.error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
    }

    .auth-message.success {
        background: #f0fdf4;
        color: #16a34a;
        border: 1px solid #bbf7d0;
    }

    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .loading-spinner-small {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

document.head.appendChild(authStyles);