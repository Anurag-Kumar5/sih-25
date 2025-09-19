// Chatbot functionality
class PlacementBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = this.initializeResponses();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    initializeResponses() {
        return {
            greetings: [
                "Hello! I'm PlacementBot, your AI career assistant. How can I help you today?",
                "Hi there! I'm here to help you with your career journey. What would you like to know?",
                "Welcome! I can assist you with job searches, resume tips, interview preparation, and more!"
            ],
            jobs: [
                "I can help you find relevant job opportunities! Based on your profile, here are some suggestions:\n\n• Software Developer positions at tech startups\n• Data Analyst roles in finance\n• Product Manager opportunities\n\nWould you like me to show you specific job listings?",
                "Great! Let me help you with job searching. What type of role are you looking for? I can filter opportunities by:\n\n• Industry\n• Experience level\n• Location\n• Salary range\n• Company size"
            ],
            resume: [
                "Here are some key resume tips:\n\n• Keep it concise (1-2 pages)\n• Use action verbs and quantify achievements\n• Tailor it for each job application\n• Include relevant keywords from job descriptions\n• Proofread carefully\n\nWould you like specific advice for your field?",
                "I'd be happy to help with your resume! Here's what makes a great resume:\n\n• Clear, professional formatting\n• Strong summary statement\n• Relevant work experience with measurable results\n• Skills section matching job requirements\n• Education and certifications\n\nDo you have a specific section you'd like help with?"
            ],
            interview: [
                "Interview preparation is crucial! Here are my top tips:\n\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare specific examples using the STAR method\n• Dress appropriately\n• Arrive 10-15 minutes early\n• Prepare thoughtful questions to ask\n\nWhat type of interview are you preparing for?",
                "Let me help you ace that interview! Key areas to focus on:\n\n• Technical skills (if applicable)\n• Behavioral questions\n• Company culture fit\n• Your career goals\n• Questions about the role\n\nWould you like to practice some common questions?"
            ],
            skills: [
                "Skill development is essential for career growth! Popular in-demand skills include:\n\n• Programming languages (Python, JavaScript, Java)\n• Data analysis and visualization\n• Digital marketing\n• Project management\n• Communication and leadership\n\nWhat area would you like to develop?",
                "Great question! Here are ways to build valuable skills:\n\n• Online courses (Coursera, Udemy, LinkedIn Learning)\n• Certifications in your field\n• Personal projects and portfolios\n• Networking and mentorship\n• Industry conferences and workshops\n\nWhat's your current career focus?"
            ],
            salary: [
                "Salary negotiation tips:\n\n• Research market rates for your role\n• Consider the total compensation package\n• Practice your negotiation conversation\n• Be prepared to justify your request\n• Know when to negotiate (usually after an offer)\n\nWhat position are you considering?",
                "Here's how to approach salary discussions:\n\n• Wait for them to make the first offer\n• Express enthusiasm for the role first\n• Present your research and value proposition\n• Be flexible and consider non-salary benefits\n• Get everything in writing\n\nNeed help with market research?"
            ],
            networking: [
                "Networking is key to career success! Here's how to build your network:\n\n• Attend industry events and meetups\n• Join professional associations\n• Connect on LinkedIn thoughtfully\n• Offer help before asking for favors\n• Follow up consistently\n\nWhat industry are you in?",
                "Building professional relationships is crucial! Try these strategies:\n\n• Reach out to alumni from your school\n• Engage with content on social media\n• Volunteer for industry organizations\n• Attend virtual events and webinars\n• Ask for informational interviews\n\nWould you like help crafting networking messages?"
            ],
            default: [
                "I'm here to help with your career journey! I can assist with:\n\n• Job searching strategies\n• Resume and cover letter tips\n• Interview preparation\n• Skill development advice\n• Salary negotiation\n• Networking guidance\n\nWhat would you like to explore?",
                "That's an interesting question! While I specialize in career and placement guidance, I'm always learning. Could you rephrase your question or ask about:\n\n• Job opportunities\n• Career development\n• Interview tips\n• Resume advice\n• Professional skills",
                "I'd love to help you with that! My expertise is in career guidance and job placement. Is there a specific career-related topic you'd like to discuss?"
            ]
        };
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: this.getRandomResponse('greetings'),
            timestamp: new Date(),
            showQuickActions: true
        };
        this.messages.push(welcomeMessage);
        this.renderMessages();
    }

    toggleChatbot() {
        const chatbot = document.getElementById('chatbot');
        const chatbotBody = document.getElementById('chatbotBody');
        const toggleIcon = document.querySelector('.chatbot-toggle i');
        
        if (!chatbot || !chatbotBody) return;

        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbotBody.classList.remove('collapsed');
            toggleIcon.className = 'fas fa-chevron-down';
        } else {
            chatbotBody.classList.add('collapsed');
            toggleIcon.className = 'fas fa-chevron-up';
        }
    }

    sendMessage(messageText = null) {
        const chatInput = document.getElementById('chatInput');
        const message = messageText || chatInput?.value.trim();
        
        if (!message) return;

        // Add user message
        this.messages.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });

        // Clear input
        if (chatInput && !messageText) {
            chatInput.value = '';
        }

        // Generate bot response
        setTimeout(() => {
            const botResponse = this.generateResponse(message);
            this.messages.push({
                type: 'bot',
                content: botResponse,
                timestamp: new Date()
            });
            this.renderMessages();
        }, 500 + Math.random() * 1000); // Simulate thinking time

        this.renderMessages();
    }

    sendQuickMessage(message) {
        this.sendMessage(message);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for specific keywords and return appropriate responses
        if (this.containsKeywords(message, ['job', 'jobs', 'work', 'position', 'career', 'opportunity'])) {
            return this.getRandomResponse('jobs');
        }
        
        if (this.containsKeywords(message, ['resume', 'cv', 'curriculum'])) {
            return this.getRandomResponse('resume');
        }
        
        if (this.containsKeywords(message, ['interview', 'interviews', 'interviewing'])) {
            return this.getRandomResponse('interview');
        }
        
        if (this.containsKeywords(message, ['skill', 'skills', 'learn', 'learning', 'course'])) {
            return this.getRandomResponse('skills');
        }
        
        if (this.containsKeywords(message, ['salary', 'pay', 'money', 'compensation', 'negotiate'])) {
            return this.getRandomResponse('salary');
        }
        
        if (this.containsKeywords(message, ['network', 'networking', 'connect', 'contacts'])) {
            return this.getRandomResponse('networking');
        }
        
        if (this.containsKeywords(message, ['hello', 'hi', 'hey', 'greetings'])) {
            return this.getRandomResponse('greetings');
        }
        
        return this.getRandomResponse('default');
    }

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = this.messages.map(message => {
            const timeString = message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            if (message.type === 'bot') {
                return `
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>${message.content.replace(/\n/g, '<br>')}</p>
                            <div class="message-time">${timeString}</div>
                            ${message.showQuickActions ? this.renderQuickActions() : ''}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="message user-message">
                        <div class="message-content">
                            <p>${message.content}</p>
                            <div class="message-time">${timeString}</div>
                        </div>
                        <div class="message-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                `;
            }
        }).join('');

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    renderQuickActions() {
        return `
            <div class="quick-actions">
                <button class="quick-action" onclick="placementBot.sendQuickMessage('Find jobs')">
                    <i class="fas fa-search"></i>
                    Find Jobs
                </button>
                <button class="quick-action" onclick="placementBot.sendQuickMessage('Resume tips')">
                    <i class="fas fa-file-alt"></i>
                    Resume Tips
                </button>
                <button class="quick-action" onclick="placementBot.sendQuickMessage('Interview prep')">
                    <i class="fas fa-comments"></i>
                    Interview Prep
                </button>
                <button class="quick-action" onclick="placementBot.sendQuickMessage('Skill development')">
                    <i class="fas fa-chart-line"></i>
                    Skills
                </button>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
function toggleChatbot() {
    placementBot.toggleChatbot();
}

function sendMessage() {
    placementBot.sendMessage();
}

function sendQuickMessage(message) {
    placementBot.sendQuickMessage(message);
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize chatbot
const placementBot = new PlacementBot();

// Add additional styles for message timestamps
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .message-time {
        font-size: 0.7rem;
        color: var(--text-muted);
        margin-top: 0.25rem;
        opacity: 0.7;
    }

    .user-message .message-time {
        color: rgba(255, 255, 255, 0.8);
        text-align: right;
    }

    .user-message {
        flex-direction: row-reverse;
    }

    .user-message .message-content {
        background: var(--primary-500);
        color: white;
        margin-left: auto;
        margin-right: 0;
        max-width: 80%;
    }

    .bot-message .message-content {
        max-width: 85%;
    }

    .quick-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
    }

    .quick-action {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5rem 0.75rem;
        background: var(--surface-elevated);
        color: var(--primary-700);
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-md);
        font-size: 0.8rem;
        cursor: pointer;
        transition: var(--transition-fast);
        white-space: nowrap;
    }

    .quick-action:hover {
        background: var(--primary-50);
        border-color: var(--primary-300);
        transform: translateY(-1px);
    }

    .quick-action i {
        font-size: 0.75rem;
    }

    @media (max-width: 480px) {
        .quick-actions {
            flex-direction: column;
        }
        
        .quick-action {
            justify-content: center;
        }
    }
`;

document.head.appendChild(chatStyles);