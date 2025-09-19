// Main application controller
class PlacementProApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.sidebarCollapsed = false;
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', this.handleGlobalSearch.bind(this));
        }

        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick="toggleTheme()"]')) {
                this.toggleTheme();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserDropdown();
            }
            if (!e.target.closest('.notification-panel') && !e.target.closest('[onclick="toggleNotifications()"]')) {
                this.closeNotifications();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginPage();
        }
    }

    showLoginPage() {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        this.updateUserInfo();
        this.loadNavigation();
        this.loadDashboard();
    }

    updateUserInfo() {
        if (!this.currentUser) return;

        const userNameElements = document.querySelectorAll('#userName, .user-name');
        const userRoleElements = document.querySelectorAll('#userRole, .user-role');
        const userEmailElements = document.querySelectorAll('.user-email');

        userNameElements.forEach(el => {
            el.textContent = this.currentUser.name || 'User';
        });

        userRoleElements.forEach(el => {
            el.textContent = this.currentUser.role || 'Student';
        });

        userEmailElements.forEach(el => {
            el.textContent = this.currentUser.email || 'user@example.com';
        });
    }

    loadNavigation() {
        const sidebarNav = document.getElementById('sidebarNav');
        if (!sidebarNav || !this.currentUser) return;

        const navigationItems = this.getNavigationItems(this.currentUser.role);
        
        sidebarNav.innerHTML = navigationItems.map(section => `
            <div class="nav-section">
                <div class="nav-section-title">${section.title}</div>
                ${section.items.map(item => `
                    <a href="#" class="nav-item ${item.id === this.currentPage ? 'active' : ''}" 
                       onclick="app.navigateTo('${item.id}')">
                        <i class="${item.icon}"></i>
                        <span>${item.label}</span>
                        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
                    </a>
                `).join('')}
            </div>
        `).join('');
    }

    getNavigationItems(role) {
        const commonItems = [
            {
                title: 'Main',
                items: [
                    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
                    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
                    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', badge: '3' }
                ]
            }
        ];

        const roleSpecificItems = {
            student: [
                {
                    title: 'Opportunities',
                    items: [
                        { id: 'jobs', label: 'Job Listings', icon: 'fas fa-briefcase' },
                        { id: 'applications', label: 'My Applications', icon: 'fas fa-file-alt' },
                        { id: 'interviews', label: 'Interviews', icon: 'fas fa-calendar-check' }
                    ]
                },
                {
                    title: 'Development',
                    items: [
                        { id: 'resume', label: 'Resume Builder', icon: 'fas fa-file-user' },
                        { id: 'skills', label: 'Skills Assessment', icon: 'fas fa-chart-line' },
                        { id: 'mentorship', label: 'Mentorship', icon: 'fas fa-user-tie' }
                    ]
                }
            ],
            admin: [
                {
                    title: 'Management',
                    items: [
                        { id: 'users', label: 'User Management', icon: 'fas fa-users' },
                        { id: 'companies', label: 'Companies', icon: 'fas fa-building' },
                        { id: 'jobs-admin', label: 'Job Management', icon: 'fas fa-briefcase' }
                    ]
                },
                {
                    title: 'Analytics',
                    items: [
                        { id: 'reports', label: 'Reports', icon: 'fas fa-chart-bar' },
                        { id: 'analytics', label: 'Analytics', icon: 'fas fa-analytics' },
                        { id: 'settings', label: 'System Settings', icon: 'fas fa-cog' }
                    ]
                }
            ],
            mentor: [
                {
                    title: 'Mentoring',
                    items: [
                        { id: 'students', label: 'My Students', icon: 'fas fa-user-graduate' },
                        { id: 'sessions', label: 'Sessions', icon: 'fas fa-calendar' },
                        { id: 'resources', label: 'Resources', icon: 'fas fa-book' }
                    ]
                }
            ],
            recruiter: [
                {
                    title: 'Recruitment',
                    items: [
                        { id: 'post-job', label: 'Post Job', icon: 'fas fa-plus-circle' },
                        { id: 'candidates', label: 'Candidates', icon: 'fas fa-users' },
                        { id: 'interviews-rec', label: 'Interviews', icon: 'fas fa-calendar-check' }
                    ]
                }
            ]
        };

        return [...commonItems, ...(roleSpecificItems[role] || [])];
    }

    navigateTo(pageId) {
        this.currentPage = pageId;
        this.updateBreadcrumb(pageId);
        this.loadNavigation(); // Refresh navigation to update active state
        this.loadPageContent(pageId);
    }

    updateBreadcrumb(pageId) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const pageNames = {
            dashboard: 'Dashboard',
            profile: 'Profile',
            jobs: 'Job Listings',
            applications: 'My Applications',
            interviews: 'Interviews',
            resume: 'Resume Builder',
            skills: 'Skills Assessment',
            mentorship: 'Mentorship',
            users: 'User Management',
            companies: 'Companies',
            'jobs-admin': 'Job Management',
            reports: 'Reports',
            analytics: 'Analytics',
            settings: 'System Settings',
            students: 'My Students',
            sessions: 'Sessions',
            resources: 'Resources',
            'post-job': 'Post Job',
            candidates: 'Candidates',
            'interviews-rec': 'Interviews',
            notifications: 'Notifications'
        };

        breadcrumb.innerHTML = `<span>${pageNames[pageId] || 'Page'}</span>`;
    }

    loadPageContent(pageId) {
        const contentArea = document.getElementById('contentArea');
        if (!contentArea) return;

        this.showLoading();

        // Simulate loading delay
        setTimeout(() => {
            contentArea.innerHTML = this.getPageContent(pageId);
            this.hideLoading();
            this.initializePageSpecificFeatures(pageId);
        }, 500);
    }

    getPageContent(pageId) {
        const role = this.currentUser?.role || 'student';
        
        switch (pageId) {
            case 'dashboard':
                return this.getDashboardContent(role);
            case 'profile':
                return this.getProfileContent();
            case 'jobs':
                return this.getJobsContent();
            case 'applications':
                return this.getApplicationsContent();
            case 'resume':
                return this.getResumeBuilderContent();
            case 'users':
                return this.getUserManagementContent();
            case 'companies':
                return this.getCompaniesContent();
            case 'post-job':
                return this.getPostJobContent();
            default:
                return this.getDefaultContent(pageId);
        }
    }

    getDashboardContent(role) {
        const dashboardData = {
            student: {
                title: 'Student Dashboard',
                stats: [
                    { label: 'Applications Sent', value: '12', icon: 'fas fa-paper-plane', color: 'primary' },
                    { label: 'Interviews Scheduled', value: '3', icon: 'fas fa-calendar-check', color: 'success' },
                    { label: 'Job Matches', value: '28', icon: 'fas fa-bullseye', color: 'warning' },
                    { label: 'Profile Views', value: '156', icon: 'fas fa-eye', color: 'info' }
                ],
                recentActivity: [
                    { type: 'application', message: 'Applied to Software Developer at TechCorp', time: '2 hours ago' },
                    { type: 'interview', message: 'Interview scheduled with DataSoft', time: '1 day ago' },
                    { type: 'profile', message: 'Profile viewed by Google Recruiter', time: '2 days ago' }
                ]
            },
            admin: {
                title: 'Admin Dashboard',
                stats: [
                    { label: 'Total Users', value: '1,234', icon: 'fas fa-users', color: 'primary' },
                    { label: 'Active Jobs', value: '89', icon: 'fas fa-briefcase', color: 'success' },
                    { label: 'Companies', value: '45', icon: 'fas fa-building', color: 'warning' },
                    { label: 'Placements', value: '156', icon: 'fas fa-handshake', color: 'info' }
                ],
                recentActivity: [
                    { type: 'user', message: 'New user registration: John Doe', time: '1 hour ago' },
                    { type: 'job', message: 'New job posted by TechCorp', time: '3 hours ago' },
                    { type: 'company', message: 'Company verified: DataSoft Solutions', time: '1 day ago' }
                ]
            },
            mentor: {
                title: 'Mentor Dashboard',
                stats: [
                    { label: 'Active Students', value: '24', icon: 'fas fa-user-graduate', color: 'primary' },
                    { label: 'Sessions This Week', value: '8', icon: 'fas fa-calendar', color: 'success' },
                    { label: 'Success Rate', value: '92%', icon: 'fas fa-chart-line', color: 'warning' },
                    { label: 'Resources Shared', value: '45', icon: 'fas fa-share', color: 'info' }
                ],
                recentActivity: [
                    { type: 'session', message: 'Completed session with Alice Johnson', time: '2 hours ago' },
                    { type: 'resource', message: 'Shared resume template with 5 students', time: '1 day ago' },
                    { type: 'feedback', message: 'Received 5-star rating from Bob Smith', time: '2 days ago' }
                ]
            },
            recruiter: {
                title: 'Recruiter Dashboard',
                stats: [
                    { label: 'Active Jobs', value: '7', icon: 'fas fa-briefcase', color: 'primary' },
                    { label: 'Applications', value: '156', icon: 'fas fa-file-alt', color: 'success' },
                    { label: 'Interviews', value: '23', icon: 'fas fa-calendar-check', color: 'warning' },
                    { label: 'Hires', value: '8', icon: 'fas fa-handshake', color: 'info' }
                ],
                recentActivity: [
                    { type: 'application', message: 'New application for Senior Developer role', time: '1 hour ago' },
                    { type: 'interview', message: 'Interview completed with Sarah Wilson', time: '4 hours ago' },
                    { type: 'hire', message: 'Offer accepted by Michael Chen', time: '1 day ago' }
                ]
            }
        };

        const data = dashboardData[role] || dashboardData.student;

        return `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h1>${data.title}</h1>
                    <p>Welcome back! Here's what's happening with your account.</p>
                </div>

                <div class="stats-grid">
                    ${data.stats.map(stat => `
                        <div class="stat-card ${stat.color}">
                            <div class="stat-icon">
                                <i class="${stat.icon}"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${stat.value}</div>
                                <div class="stat-label">${stat.label}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="dashboard-content">
                    <div class="dashboard-section">
                        <div class="section-header">
                            <h2>Recent Activity</h2>
                            <a href="#" class="view-all">View All</a>
                        </div>
                        <div class="activity-list">
                            ${data.recentActivity.map(activity => `
                                <div class="activity-item">
                                    <div class="activity-icon ${activity.type}">
                                        <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                                    </div>
                                    <div class="activity-content">
                                        <p>${activity.message}</p>
                                        <span class="activity-time">${activity.time}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="dashboard-section">
                        <div class="section-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div class="quick-actions-grid">
                            ${this.getQuickActions(role).map(action => `
                                <button class="quick-action-btn" onclick="app.navigateTo('${action.page}')">
                                    <i class="${action.icon}"></i>
                                    <span>${action.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .dashboard {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .dashboard-header {
                    margin-bottom: 2rem;
                }

                .dashboard-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }

                .dashboard-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: var(--surface-elevated);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border);
                    transition: var(--transition-fast);
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: white;
                }

                .stat-card.primary .stat-icon { background: var(--primary-500); }
                .stat-card.success .stat-icon { background: var(--success-500); }
                .stat-card.warning .stat-icon { background: var(--warning-500); }
                .stat-card.info .stat-icon { background: #06b6d4; }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .stat-label {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-top: 0.25rem;
                }

                .dashboard-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }

                .dashboard-section {
                    background: var(--surface-elevated);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border);
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                }

                .section-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .view-all {
                    color: var(--primary-600);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .view-all:hover {
                    text-decoration: underline;
                }

                .activity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .activity-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--surface);
                    border-radius: var(--radius-md);
                    transition: var(--transition-fast);
                }

                .activity-item:hover {
                    background: var(--primary-50);
                }

                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .activity-icon.application { background: var(--primary-500); }
                .activity-icon.interview { background: var(--success-500); }
                .activity-icon.profile { background: var(--warning-500); }
                .activity-icon.user { background: var(--primary-500); }
                .activity-icon.job { background: var(--success-500); }
                .activity-icon.company { background: var(--warning-500); }
                .activity-icon.session { background: var(--primary-500); }
                .activity-icon.resource { background: var(--success-500); }
                .activity-icon.feedback { background: var(--warning-500); }
                .activity-icon.hire { background: var(--success-500); }

                .activity-content p {
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                    line-height: 1.4;
                }

                .activity-time {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .quick-actions-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 0.75rem;
                }

                .quick-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--surface);
                    border: 2px solid var(--border);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: var(--transition-fast);
                    text-align: left;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .quick-action-btn:hover {
                    border-color: var(--primary-300);
                    background: var(--primary-50);
                    transform: translateY(-1px);
                }

                .quick-action-btn i {
                    color: var(--primary-600);
                    width: 20px;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .dashboard-content {
                        grid-template-columns: 1fr;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    getActivityIcon(type) {
        const icons = {
            application: 'paper-plane',
            interview: 'calendar-check',
            profile: 'eye',
            user: 'user-plus',
            job: 'briefcase',
            company: 'building',
            session: 'calendar',
            resource: 'share',
            feedback: 'star',
            hire: 'handshake'
        };
        return icons[type] || 'circle';
    }

    getQuickActions(role) {
        const actions = {
            student: [
                { label: 'Browse Jobs', icon: 'fas fa-search', page: 'jobs' },
                { label: 'Update Resume', icon: 'fas fa-file-user', page: 'resume' },
                { label: 'View Applications', icon: 'fas fa-file-alt', page: 'applications' },
                { label: 'Schedule Mentoring', icon: 'fas fa-user-tie', page: 'mentorship' }
            ],
            admin: [
                { label: 'Manage Users', icon: 'fas fa-users', page: 'users' },
                { label: 'View Reports', icon: 'fas fa-chart-bar', page: 'reports' },
                { label: 'System Settings', icon: 'fas fa-cog', page: 'settings' },
                { label: 'Company Management', icon: 'fas fa-building', page: 'companies' }
            ],
            mentor: [
                { label: 'View Students', icon: 'fas fa-user-graduate', page: 'students' },
                { label: 'Schedule Session', icon: 'fas fa-calendar-plus', page: 'sessions' },
                { label: 'Share Resources', icon: 'fas fa-book', page: 'resources' }
            ],
            recruiter: [
                { label: 'Post New Job', icon: 'fas fa-plus-circle', page: 'post-job' },
                { label: 'Review Candidates', icon: 'fas fa-users', page: 'candidates' },
                { label: 'Schedule Interviews', icon: 'fas fa-calendar-check', page: 'interviews-rec' }
            ]
        };
        return actions[role] || actions.student;
    }

    getDefaultContent(pageId) {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1>${pageId.charAt(0).toUpperCase() + pageId.slice(1)}</h1>
                    <p>This page is under development.</p>
                </div>
                <div class="coming-soon">
                    <div class="coming-soon-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h2>Coming Soon</h2>
                    <p>We're working hard to bring you this feature. Stay tuned!</p>
                </div>
            </div>

            <style>
                .page-content {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                }

                .page-header {
                    margin-bottom: 3rem;
                }

                .page-header h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                }

                .page-header p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                }

                .coming-soon {
                    background: var(--surface-elevated);
                    border-radius: var(--radius-xl);
                    padding: 3rem;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border);
                }

                .coming-soon-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    color: white;
                    font-size: 2rem;
                }

                .coming-soon h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }

                .coming-soon p {
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
            </style>
        `;
    }

    loadDashboard() {
        this.navigateTo('dashboard');
    }

    initializePageSpecificFeatures(pageId) {
        // Initialize any page-specific JavaScript features
        switch (pageId) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'profile':
                this.initializeProfile();
                break;
            // Add more cases as needed
        }
    }

    initializeDashboard() {
        // Dashboard-specific initialization
        console.log('Dashboard initialized');
    }

    initializeProfile() {
        // Profile-specific initialization
        console.log('Profile initialized');
    }

    handleGlobalSearch(event) {
        const query = event.target.value.toLowerCase();
        console.log('Searching for:', query);
        // Implement search functionality
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K for search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Escape to close modals/dropdowns
        if (event.key === 'Escape') {
            this.closeUserDropdown();
            this.closeNotifications();
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const themeIcon = document.querySelector('[onclick="toggleTheme()"] i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    closeUserDropdown() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    closeNotifications() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
}

// Global functions for HTML onclick handlers
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Initialize the application
const app = new PlacementProApp();

// Export for use in other modules
window.app = app;