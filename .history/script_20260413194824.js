var App = {
    currentUser: null,
    currentPage: 'login',
    currentAdminTab: 'overview',
    currentStudentTab: 'overview',
    currentDate: new Date(),
    darkMode: false,
    searchQuery: '',
    currentFilter: {},
    currentSort: {},

    data: {
        users: [],
        events: [],
        announcements: [],
        files: [],
        polls: [],
        suggestions: [],
        reports: [],
        auditLogs: [],
        activities: [],
        notifications: [],
        mediaContent: [],
        batches: [],
        otpCodes: {}
    },

    init: function() {
        try {
            this.loadData();
            this.loadPreferences();
            this.checkAuth();
            this.setupEventListeners();
        } catch(e) {
            console.error(e);
            this.renderLogin();
        }
    },

    loadData: function() {
        try {
            var stored = localStorage.getItem('cscTransparencyData');
            if (stored) {
                this.data = JSON.parse(stored);
                if (!this.data.finance) this.data.finance = { currentFunds: 50000, transactions: [] };
                if (!this.data.reportFiles) this.data.reportFiles = [];
                if (!this.data.notifications) this.data.notifications = [];
                if (!this.data.mediaContent) this.data.mediaContent = [];
                if (!this.data.batches) this.data.batches = [];
                if (!this.data.complaints) this.data.complaints = [];
                if (!this.data.otpCodes) this.data.otpCodes = {};
                if (!this.data.auditLogs) this.data.auditLogs = [];
                if (!this.data.activities) this.data.activities = [];
                if (!this.data.headlines) this.data.headlines = [];
                if (!this.data.messages) this.data.messages = [];
if (!this.data.comments) this.data.comments = [];
                
                // Ensure events have required fields for evaluation and QR
                (this.data.events || []).forEach(function(e) {
                    if (!e.attendees) e.attendees = [];
                    if (!e.evaluations) e.evaluations = [];
                    if (!e.evaluationLink) e.evaluationLink = '';
                    if (!e.evaluationEnabled) e.evaluationEnabled = false;
                    if (!e.qrCode) e.qrCode = '';
                });
            } else {
                this.setupDefaultData();
            }
        } catch(e) {
            this.setupDefaultData();
        }
    },

    setupDefaultData: function() {
        this.data = {
            users: [
                { id: 1, name: 'Admin User', email: 'admin@csc.com', password: 'admin123', role: 'admin', studentId: 'ADM001', active: true, createdAt: '2026-01-01' },
                { id: 2, name: 'John Student', email: 'john@student.csc.com', password: 'student123', role: 'student', studentId: 'STU001', active: true, createdAt: '2026-01-15', pollsAnswered: [], suggestionsSubmitted: [] }
            ],
            events: [
                { id: 1, title: 'General Assembly', category: 'Meeting', status: 'upcoming', date: '2026-04-15', time: '09:00', location: 'Main Hall', description: 'Monthly general assembly for all students and staff.', rsvps: [], pinned: false },
                { id: 2, title: 'Workshop: Career Skills', category: 'Workshop', status: 'upcoming', date: '2026-04-20', time: '14:00', location: 'Room 101', description: 'Interactive workshop on developing professional skills.', rsvps: [], pinned: false }
            ],
            announcements: [
                { id: 1, title: 'Office Hours Changed', content: 'Effective immediately, office hours are now from 8 AM to 5 PM, Monday to Friday.', date: '2026-04-01', pinned: true, scheduledDate: null, likes: [], readBy: [] },
                { id: 2, title: 'New Policy Update', content: 'Please review the updated student handbook for the new academic year.', date: '2026-04-05', pinned: false, scheduledDate: null, likes: [], readBy: [] }
            ],
            files: [
                { id: 1, name: 'Student Handbook 2026', size: '2.4 MB', type: 'pdf', category: 'Reports', version: '1.0', updatedAt: '2026-04-01' },
                { id: 2, name: 'Course Catalog', size: '1.8 MB', type: 'pdf', category: 'Academic', version: '2.1', updatedAt: '2026-03-15' },
                { id: 3, name: 'Academic Calendar', size: '456 KB', type: 'pdf', category: 'Academic', version: '1.0', updatedAt: '2026-01-10' },
                { id: 4, name: 'Budget Report Q1', size: '1.2 MB', type: 'pdf', category: 'Budgets', version: '1.0', updatedAt: '2026-04-05' }
            ],
            polls: [
                { id: 1, question: 'What time slot works best for weekend events?', type: 'multiple', options: ['Saturday Morning', 'Saturday Afternoon', 'Sunday Morning', 'Sunday Afternoon'], votes: { 'Saturday Morning': 5, 'Saturday Afternoon': 8, 'Sunday Morning': 3, 'Sunday Afternoon': 2 }, voted: [], deadline: '2026-04-30', active: true },
                { id: 2, question: 'Do you support the new library hours?', type: 'yesno', options: ['Yes', 'No'], votes: { 'Yes': 12, 'No': 7 }, voted: [], deadline: '2026-04-25', active: true }
            ],
            suggestions: [
                { id: 1, author: 'John Student', email: 'john@student.csc.com', content: 'Can we have more food options in the cafeteria?', date: '2026-04-02', reply: 'Thank you for your suggestion. We will look into this.', replyDate: '2026-04-03', status: 'resolved', upvotes: 5, hasUpvoted: [], replies: [], category: 'Suggestion' }
            ],
            complaints: [],
            reports: [
                { id: 1, title: 'Facility Issue', author: 'John Student', category: 'Facility', content: 'The air conditioning in Room 201 is not working properly.', date: '2026-04-01', status: 'resolved' },
                { id: 2, title: 'Scheduling Conflict', author: 'Jane Doe', category: 'Academic', content: 'Two of my classes overlap on Wednesday.', date: '2026-04-03', status: 'pending' }
            ],
            auditLogs: [],
            activities: [],
            headlines: [],
            messages: [],
            finance: {
                currentFunds: 50000,
                transactions: []
            },
            reportFiles: []
        };
        this.saveData();
    },

    saveData: function() {
        try {
            localStorage.setItem('cscTransparencyData', JSON.stringify(this.data));
        } catch(e) {}
    },

    loadPreferences: function() {
        try {
            var prefs = localStorage.getItem('cscPreferences');
            if (prefs) {
                var p = JSON.parse(prefs);
                this.darkMode = p.darkMode || false;
            }
        } catch(e) {}
    },

    savePreferences: function() {
        try {
            localStorage.setItem('cscPreferences', JSON.stringify({ darkMode: this.darkMode }));
        } catch(e) {}
    },

    checkAuth: function() {
        try {
            var user = localStorage.getItem('cscCurrentUser');
            if (user) {
                this.currentUser = JSON.parse(user);
                this.renderDashboard();
            } else {
                this.renderLogin();
            }
        } catch(e) {
            this.renderLogin();
        }
    },

    setupEventListeners: function() {
        var self = this;
        document.addEventListener('click', function(e) {
            if (e.target.closest('.dropdown-toggle')) {
                var btn = e.target.closest('.dropdown-toggle');
                var dropdown = btn.closest('.profile-dropdown');
                if (dropdown) {
                    var menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) menu.classList.toggle('show');
                }
            } else if (!e.target.closest('.profile-dropdown')) {
                var dropdowns = document.querySelectorAll('.dropdown-menu.show');
                Array.prototype.forEach.call(dropdowns, function(m) { m.classList.remove('show'); });
            }
            if (e.target.closest('.mobile-menu-btn')) {
                var sb = document.querySelector('.dashboard-sidebar');
                if (sb) sb.classList.toggle('show');
            }
        });
    },

    checkPasswordStrength: function(password) {
        var score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        if (score <= 2) return { level: 'Weak', color: '#ef4444' };
        if (score <= 3) return { level: 'Medium', color: '#f59e0b' };
        return { level: 'Strong', color: '#10b981' };
    },

    // ========== AUTH PAGES ==========
    renderLogin: function() {
        this.currentPage = 'login';
        this.registerData = null;
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card">' +
                    '<div class="auth-header">' +
                        '<div class="auth-logo"><i class="fas fa-university"></i></div>' +
                        '<h1 class="auth-title">Welcome Back</h1>' +
                        '<p class="auth-subtitle">Sign in to CSC Transparency Website</p>' +
                    '</div>' +
                    '<div id="login-error" class="alert alert-error" style="display:none;"></div>' +
                    '<form id="login-form">' +
                        '<div class="form-group"><label class="form-label">Email Address</label>' +
                        '<input type="email" class="form-input" id="login-email" placeholder="Enter your email" required></div>' +
                        '<div class="form-group"><label class="form-label">Password</label>' +
                        '<input type="password" class="form-input" id="login-password" placeholder="Enter your password" required></div>' +
                        '<button type="submit" class="btn btn-primary btn-block">Login</button>' +
                    '</form>' +
                    '<div class="auth-footer">Don\'t have an account? <a href="#" id="go-to-register">Register</a></div>' +
                '</div>' +
            '</div>';
        
        var loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var email = document.getElementById('login-email').value;
                var pass = document.getElementById('login-password').value;
                var user = null;
                for (var i = 0; i < self.data.users.length; i++) {
                    if (self.data.users[i].email === email && self.data.users[i].password === pass) {
                        user = self.data.users[i];
                        break;
                    }
                }
                if (user) {
                    if (user.status === 'pending' || user.status === 'pending_reactivation') {
                        if (user.status === 'pending_reactivation') {
                            var err = document.getElementById('login-error');
                            if (err) {
                                err.innerHTML = 'Your account needs reactivation.<br><button class="btn btn-primary btn-sm" id="request-reactivation" style="margin-top:8px;">Submit ID for Reactivation</button>';
                                err.style.display = 'block';
                                
                                var reactivateBtn = document.getElementById('request-reactivation');
                                if (reactivateBtn) {
                                    reactivateBtn.addEventListener('click', function() {
                                        self.showReactivationModal(user.id);
                                    });
                                }
                            }
                        } else {
                            var err = document.getElementById('login-error');
                            if (err) {
                                err.textContent = 'Your account is pending admin approval. Please wait for confirmation.';
                                err.style.display = 'block';
                            }
                        }
                        return;
                    }
                    if (user.active !== false) {
                        self.currentUser = user;
                        localStorage.setItem('cscCurrentUser', JSON.stringify(user));
                        self.renderDashboard();
                    } else {
                        var err = document.getElementById('login-error');
                        if (err) {
                            err.textContent = 'Your account has been deactivated. Contact admin for assistance.';
                            err.style.display = 'block';
                        }
                    }
                } else {
                    var err = document.getElementById('login-error');
                    if (err) {
                        err.textContent = 'Invalid email or password';
                        err.style.display = 'block';
                    }
                }
            });
        }

        var registerLink = document.getElementById('go-to-register');
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderRegister();
            });
        }
    },

    renderRegister: function(step) {
        step = step || 1;
        this.currentPage = 'register';
        this.registerData = this.registerData || {};
        
        if (step === 1) {
            this.renderRegisterStep1();
        } else if (step === 2) {
            this.renderRegisterStep2();
        } else if (step === 3) {
            this.renderOTPVerification();
        }
    },

    renderRegisterStep1: function() {
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        this.registerData = {};
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card registration-card">' +
                    '<div class="register-steps">' +
                        '<div class="register-step active">1</div>' +
                        '<div class="register-step">2</div>' +
                        '<div class="register-step">3</div>' +
                    '</div>' +
                    '<div class="auth-header">' +
                        '<div class="auth-logo"><i class="fas fa-user-plus"></i></div>' +
                        '<h1 class="auth-title">Create Account</h1>' +
                        '<p class="auth-subtitle">Step 1: Account Information</p>' +
                    '</div>' +
                    '<button class="register-back-btn" id="back-to-login"><i class="fas fa-arrow-left"></i> Back to Login</button>' +
                    '<div id="register-error" class="alert alert-error" style="display:none;"></div>' +
                    '<form id="register-form-step1">' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">First Name *</label>' +
                        '<input type="text" class="form-input" id="register-firstname" placeholder="First Name" required></div>' +
                        '<div class="form-group"><label class="form-label">Middle Name</label>' +
                        '<input type="text" class="form-input" id="register-middlename" placeholder="Middle Name"></div></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Last Name *</label>' +
                        '<input type="text" class="form-input" id="register-lastname" placeholder="Last Name" required></div>' +
                        '<div class="form-group"><label class="form-label">Suffix</label>' +
                        '<input type="text" class="form-input" id="register-suffix" placeholder="Jr., Sr., III"></div></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Course *</label>' +
                        '<select class="form-input" id="register-course" required>' +
                        '<option value="">Select Course</option>' +
                        '<option value="BS Computer Science">BS Computer Science</option>' +
                        '<option value="BS Information Technology">BS Information Technology</option>' +
                        '<option value="BS Information Systems">BS Information Systems</option>' +
                        '<option value="BS Computer Engineering">BS Computer Engineering</option></select></div>' +
                        '<div class="form-group"><label class="form-label">Section *</label>' +
                        '<select class="form-input" id="register-section" required>' +
                        '<option value="">Select Section</option>' +
                        '<option value="A">Section A</option>' +
                        '<option value="B">Section B</option>' +
                        '<option value="C">Section C</option>' +
                        '<option value="D">Section D</option></select></div></div>' +
                        '<div class="form-group"><label class="form-label">Student ID *</label>' +
                        '<input type="text" class="form-input" id="register-student-id" placeholder="Enter your student ID" required></div>' +
                        '<div class="form-group"><label class="form-label">Email Address *</label>' +
                        '<input type="email" class="form-input" id="register-email" placeholder="Enter your email" required></div>' +
                        '<div class="form-group"><label class="form-label">Password *</label>' +
                        '<div class="password-input-wrapper">' +
                        '<input type="password" class="form-input" id="register-password" placeholder="Create a password" required>' +
                        '<button type="button" class="password-toggle" id="toggle-password"><i class="fas fa-eye"></i></button>' +
                        '</div>' +
                        '<div class="password-strength"><div class="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>' +
                        '<span class="strength-label" id="strength-label"></span></div></div>' +
                        '<div class="form-group"><label class="form-label">Confirm Password *</label>' +
                        '<div class="password-input-wrapper">' +
                        '<input type="password" class="form-input" id="register-confirm" placeholder="Confirm your password" required>' +
                        '<button type="button" class="password-toggle" id="toggle-confirm"><i class="fas fa-eye"></i></button>' +
                        '</div></div>' +
                        '<button type="submit" class="btn btn-primary btn-block">Next: Upload Documents</button>' +
                    '</form>' +
                    '<div class="auth-footer">Already have an account? <a href="#" id="go-to-login">Login</a></div>' +
                '</div>' +
            '</div>';
        
        this.attachPasswordToggle('register-password', 'toggle-password');
        this.attachPasswordToggle('register-confirm', 'toggle-confirm');
        
        var passInput = document.getElementById('register-password');
        if (passInput) {
            passInput.addEventListener('input', function() {
                var strength = self.checkPasswordStrength(this.value);
                var fill = document.getElementById('strength-fill');
                var label = document.getElementById('strength-label');
                if (fill && label) {
                    var width = strength.level === 'Weak' ? '33%' : strength.level === 'Medium' ? '66%' : '100%';
                    fill.style.width = width;
                    fill.style.backgroundColor = strength.color;
                    label.textContent = strength.level;
                    label.style.color = strength.color;
                }
            });
        }

        var backBtn = document.getElementById('back-to-login');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLogin();
            });
        }
        
        var loginLink = document.getElementById('go-to-login');
        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLogin();
            });
        }

        var form = document.getElementById('register-form-step1');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var firstName = document.getElementById('register-firstname').value;
                var middleName = document.getElementById('register-middlename').value;
                var lastName = document.getElementById('register-lastname').value;
                var suffix = document.getElementById('register-suffix').value;
                var course = document.getElementById('register-course').value;
                var section = document.getElementById('register-section').value;
                var studentId = document.getElementById('register-student-id').value;
                var email = document.getElementById('register-email').value;
                var pass = document.getElementById('register-password').value;
                var confirm = document.getElementById('register-confirm').value;
                var errorEl = document.getElementById('register-error');
                
                if (!firstName || !lastName || !studentId || !email || !pass || !course || !section) {
                    if (errorEl) {
                        errorEl.textContent = 'All required fields must be filled';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                if (pass !== confirm) {
                    if (errorEl) {
                        errorEl.textContent = 'Passwords do not match';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                var emailExists = false;
                for (var i = 0; i < self.data.users.length; i++) {
                    if (self.data.users[i].email === email) {
                        emailExists = true;
                        break;
                    }
                }
                
                if (emailExists) {
                    if (errorEl) {
                        errorEl.textContent = 'Email already registered';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                self.registerData = { 
                    firstName: firstName, 
                    middleName: middleName,
                    lastName: lastName, 
                    suffix: suffix,
                    course: course,
                    section: section,
                    studentId: studentId, 
                    email: email, 
                    password: pass 
                };
                if (errorEl) errorEl.style.display = 'none';
                self.renderRegister(2);
            });
        }
    },

    renderRegisterStep2: function() {
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card registration-card">' +
                    '<div class="register-steps">' +
                        '<div class="register-step completed">1</div>' +
                        '<div class="register-step active">2</div>' +
                        '<div class="register-step">3</div>' +
                    '</div>' +
                    '<div class="auth-header">' +
                        '<div class="auth-logo"><i class="fas fa-user-plus"></i></div>' +
                        '<h1 class="auth-title">Create Account</h1>' +
                        '<p class="auth-subtitle">Step 2: Upload Documents</p>' +
                    '</div>' +
                    '<button class="register-back-btn" id="back-to-step1"><i class="fas fa-arrow-left"></i> Back</button>' +
                    '<div id="upload-error" class="alert alert-error" style="display:none;"></div>' +
                    '<p class="text-sm text-muted" style="margin-bottom:16px;text-align:center;">👇 Click each box below to upload your files</p>' +
                    '<form id="register-form-step2">' +
                        '<div class="form-group">' +
                        '<label class="form-label">Profile Picture * ( Required )</label>' +
                        '<div class="file-upload-wrapper" id="profile-upload">' +
                        '<div class="file-upload-icon"><i class="fas fa-camera"></i></div>' +
                        '<div class="file-upload-text">Click to upload <span>Profile Photo</span></div>' +
                        '<div class="file-preview" id="profile-preview"></div>' +
                        '</div>' +
                        '<input type="file" id="profile-input" accept="image/*" hidden>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label class="form-label">School ID * ( Required )</label>' +
                        '<div class="file-upload-wrapper" id="schoolid-upload">' +
                        '<div class="file-upload-icon"><i class="fas fa-id-card"></i></div>' +
                        '<div class="file-upload-text">Click to upload <span>School ID</span></div>' +
                        '<div class="file-preview" id="schoolid-preview"></div>' +
                        '</div>' +
                        '<input type="file" id="schoolid-input" accept="image/*,.pdf" hidden>' +
                        '</div>' +
                        '<button type="submit" class="btn btn-primary btn-block">Next: Verify Email</button>' +
                    '</form>' +
                    '<div class="auth-footer">Already have an account? <a href="#" id="go-to-login">Login</a></div>' +
                '</div>' +
            '</div>';
        
        this.attachFileUpload('profile-input', 'profile-upload', 'profile-preview');
        this.attachFileUpload('schoolid-input', 'schoolid-upload', 'schoolid-preview');
        
        var backBtn = document.getElementById('back-to-step1');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderRegister(1);
            });
        }
        
        var loginLink = document.getElementById('go-to-login');
        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLogin();
            });
        }
        
        var form = document.getElementById('register-form-step2');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var errorEl = document.getElementById('upload-error');
                
                // Ensure registerData exists
                if (!self.registerData) {
                    self.registerData = {};
                }
                
                // Log for debugging
                console.log('Step 2 submit - registerData:', self.registerData);
                console.log('profilePic:', self.registerData.profilePic ? 'SET' : 'NOT SET');
                console.log('schoolIdPic:', self.registerData.schoolIdPic ? 'SET' : 'NOT SET');
                
                var profilePic = self.registerData.profilePic;
                var schoolIdPic = self.registerData.schoolIdPic;
                
                if (!profilePic) {
                    if (errorEl) {
                        errorEl.textContent = 'Please upload a profile picture - click the box and select an image file';
                        errorEl.style.display = 'block';
                    }
                    // Try triggering file input
                    var pInput = document.getElementById('profile-input');
                    if (pInput) { pInput.click(); }
                    return;
                }
                if (!schoolIdPic) {
                    if (errorEl) {
                        errorEl.textContent = 'Please upload your school ID - click the box and select an image file';
                        errorEl.style.display = 'block';
                    }
                    var sInput = document.getElementById('schoolid-input');
                    if (sInput) { sInput.click(); }
                    return;
                }
                
                if (errorEl) { errorEl.style.display = 'none'; }
                
                console.log('Proceeding to step 3...');
                self.renderRegister(3);
                return false;
            });
        }
    },

    sendRealOTP: function(email, otp) {
        var self = this;
        
        // Initialize otpCodes if not exists
        if (!this.data.otpCodes) {
            this.data.otpCodes = {};
        }
        
        // Store OTP code
        this.data.otpCodes[email] = {
            code: otp,
            expiry: Date.now() + 5 * 60 * 1000,
            sentAt: new Date().toISOString()
        };
        
        // Log activity
        if (!this.data.activities) {
            this.data.activities = [];
        }
        this.data.activities.push({
            type: 'otp_sent',
            email: email,
            data: {
                to: email,
                subject: 'CSC Transparency - Email Verification Code',
                body: 'Your verification code is: ' + otp,
                sentAt: new Date().toISOString()
            },
            date: new Date().toISOString()
        });
        
        this.saveData();
        
        // Show OTP for testing
        alert('OTP has been generated!\n\nYour verification code is: ' + otp + '\n\n(This would be sent to your email in production)');
        
        return true;
    },

    showReactivationModal: function(userId) {
        var self = this;
        var user = this.data.users.find(function(u) { return u.id === userId; });
        if (!user) return;
        
        var app = document.getElementById('app');
        if (!app) return;
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card">' +
                    '<div class="auth-header">' +
                        '<div class="auth-logo"><i class="fas fa-user-check"></i></div>' +
                        '<h1 class="auth-title">Reactivate Account</h1>' +
                        '<p class="auth-subtitle">Please resubmit your school ID for reactivation</p>' +
                    '</div>' +
                    '<div id="reactivate-error" class="alert alert-error" style="display:none;"></div>' +
                    '<form id="reactivate-form">' +
                    '<div class="form-group"><p class="text-sm text-muted">Your previous batch: ' + (user.batch || 'N/A') + '</p></div>' +
                    '<div class="form-group">' +
                    '<label class="form-label">School ID *</label>' +
                    '<div class="file-upload-wrapper" id="reactivate-schoolid-upload">' +
                    '<div class="file-upload-icon"><i class="fas fa-id-card"></i></div>' +
                    '<div class="file-upload-text">Click to upload <span>School ID</span></div>' +
                    '<div class="file-preview" id="reactivate-schoolid-preview"></div>' +
                    '</div>' +
                    '<input type="file" id="reactivate-schoolid-input" accept="image/*,.pdf" style="display:none;"></div>' +
                    '<div class="form-group"><label class="form-label">Course *</label>' +
                    '<select class="form-input" id="reactivate-course" required>' +
                    '<option value="">Select Course</option>' +
                    '<option value="BS Computer Science">BS Computer Science</option>' +
                    '<option value="BS Information Technology">BS Information Technology</option>' +
                    '<option value="BS Information Systems">BS Information Systems</option>' +
                    '<option value="BS Computer Engineering">BS Computer Engineering</option></select></div>' +
                    '<div class="form-group"><label class="form-label">Section *</label>' +
                    '<select class="form-input" id="reactivate-section" required>' +
                    '<option value="">Select Section</option>' +
                    '<option value="A">Section A</option>' +
                    '<option value="B">Section B</option>' +
                    '<option value="C">Section C</option>' +
                    '<option value="D">Section D</option></select></div>' +
                    '<button type="submit" class="btn btn-primary btn-block">Submit for Reactivation</button>' +
                    '</form>' +
                    '<div class="auth-footer"><a href="#" id="cancel-reactivation">Back to Login</a></div>' +
                '</div>' +
            '</div>';
        
        this.attachFileUpload('reactivate-schoolid-input', 'reactivate-schoolid-upload', 'reactivate-schoolid-preview');
        
        var cancelLink = document.getElementById('cancel-reactivation');
        if (cancelLink) {
            cancelLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLogin();
            });
        }
        
        var form = document.getElementById('reactivate-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var errorEl = document.getElementById('reactivate-error');
                
                if (!self.registerData || !self.registerData.schoolIdPic) {
                    if (errorEl) {
                        errorEl.textContent = 'Please upload your school ID';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                var course = document.getElementById('reactivate-course').value;
                var section = document.getElementById('reactivate-section').value;
                
                if (!course || !section) {
                    if (errorEl) {
                        errorEl.textContent = 'Please select course and section';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                user.schoolIdPic = self.registerData.schoolIdPic;
                user.course = course;
                user.section = section;
                user.status = 'pending';
                user.batch = user.previousBatch || '2025-2026';
                self.saveData();
                
                if (errorEl) {
                    errorEl.className = 'alert alert-success';
                    errorEl.textContent = 'Reactivation request submitted! Please wait for admin approval.';
                    errorEl.style.display = 'block';
                }
                
                setTimeout(function() {
                    self.renderLogin();
                }, 3000);
            });
        }
    },

    renderOTPVerification: function() {
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        var otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.registerData.otp = otp;
        this.registerData.otpExpiry = Date.now() + 5 * 60 * 1000;
        
        this.sendRealOTP(this.registerData.email, otp);
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card registration-card">' +
                    '<div class="register-steps">' +
                        '<div class="register-step completed">1</div>' +
                        '<div class="register-step completed">2</div>' +
                        '<div class="register-step active">3</div>' +
                    '</div>' +
                    '<div class="auth-header">' +
                        '<div class="auth-logo"><i class="fas fa-envelope"></i></div>' +
                        '<h1 class="auth-title">Verify Email</h1>' +
                        '<p class="auth-subtitle">Step 3: Enter the 6-digit code sent to your email</p>' +
                    '</div>' +
                    '<button class="register-back-btn" id="back-to-step2"><i class="fas fa-arrow-left"></i> Back</button>' +
                    '<div id="otp-error" class="alert alert-error" style="display:none;"></div>' +
                    '<div id="otp-success" class="alert alert-success" style="display:none;"></div>' +
                    '<p class="text-sm text-muted" style="text-align:center;margin-bottom:16px;">A verification code has been sent to: <strong>' + this.registerData.email + '</strong></p>' +
                    '<form id="otp-form">' +
                        '<div class="otp-inputs">' +
                        '<input type="text" class="form-input otp-input" id="otp-1" maxlength="1" required>' +
                        '<input type="text" class="form-input otp-input" id="otp-2" maxlength="1" required>' +
                        '<input type="text" class="form-input otp-input" id="otp-3" maxlength="1" required>' +
                        '<input type="text" class="form-input otp-input" id="otp-4" maxlength="1" required>' +
                        '<input type="text" class="form-input otp-input" id="otp-5" maxlength="1" required>' +
                        '<input type="text" class="form-input otp-input" id="otp-6" maxlength="1" required>' +
                        '</div>' +
                        '<button type="submit" class="btn btn-primary btn-block" style="margin-top:16px;">Verify Email</button>' +
                    '</form>' +
                    '<div class="resend-otp">Don\'t receive the code? <a id="resend-otp">Resend Code</a></div>' +
                '</div>' +
            '</div>';
        
        this.attachOTPInput();
        
        var backBtn = document.getElementById('back-to-step2');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderRegister(2);
            });
        }
        
        var otpForm = document.getElementById('otp-form');
        if (otpForm) {
            otpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var enteredOtp = '';
                for (var i = 1; i <= 6; i++) {
                    enteredOtp += document.getElementById('otp-' + i).value;
                }
                
                var errorEl = document.getElementById('otp-error');
                var successEl = document.getElementById('otp-success');
                
                if (enteredOtp !== self.registerData.otp) {
                    if (errorEl) {
                        errorEl.textContent = 'Invalid verification code';
                        errorEl.style.display = 'block';
                    }
                    var otpInputs = document.querySelectorAll('.otp-input');
                    Array.prototype.forEach.call(otpInputs, function(inp) { inp.classList.add('error'); });
                    return;
                }
                
                if (Date.now() > self.registerData.otpExpiry) {
                    if (errorEl) {
                        errorEl.textContent = 'Verification code expired';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                self.registerData.emailVerified = true;
                if (errorEl) errorEl.style.display = 'none';
                
                var currentBatch = '2025-2026';
                var fullName = self.registerData.firstName;
                if (self.registerData.middleName) fullName += ' ' + self.registerData.middleName;
                fullName += ' ' + self.registerData.lastName;
                if (self.registerData.suffix) fullName += ' ' + self.registerData.suffix;
                
                var newUser = {
                    id: Date.now(),
                    name: fullName,
                    firstName: self.registerData.firstName,
                    middleName: self.registerData.middleName || '',
                    lastName: self.registerData.lastName,
                    suffix: self.registerData.suffix || '',
                    email: self.registerData.email,
                    password: self.registerData.password,
                    studentId: self.registerData.studentId,
                    course: self.registerData.course,
                    section: self.registerData.section,
                    batch: currentBatch,
                    role: 'student',
                    status: 'pending',
                    active: false,
                    profilePic: self.registerData.profilePic,
                    schoolIdPic: self.registerData.schoolIdPic,
                    createdAt: new Date().toISOString().split('T')[0],
                    pollsAnswered: [],
                    suggestionsSubmitted: []
                };
                self.data.users.push(newUser);
                self.saveData();
                
                if (successEl) {
                    successEl.textContent = 'Email verified! Your account is pending admin approval.';
                    successEl.style.display = 'block';
                }
                
                setTimeout(function() { 
                    self.pendingApproval(); 
                }, 2000);
            });
        }
        
        var resendBtn = document.getElementById('resend-otp');
        if (resendBtn) {
            resendBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.classList.contains('disabled')) return;
                
                var newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                self.registerData.otp = newOtp;
                self.registerData.otpExpiry = Date.now() + 5 * 60 * 1000;
                
                self.sendRealOTP(self.registerData.email, newOtp);
                
                this.classList.add('disabled');
                this.textContent = 'Resend Code (59s)';
                
                var countdown = 59;
                var interval = setInterval(function() {
                    countdown--;
                    if (countdown <= 0) {
                        clearInterval(interval);
                        resendBtn.classList.remove('disabled');
                        resendBtn.textContent = 'Resend Code';
                    } else {
                        resendBtn.textContent = 'Resend Code (' + countdown + 's)';
                    }
                }, 1000);
            });
        }
    },

    attachPasswordToggle: function(inputId, btnId) {
        var input = document.getElementById(inputId);
        var btn = document.getElementById(btnId);
        if (input && btn) {
            btn.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    btn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        }
    },

    attachFileUpload: function(inputId, wrapperId, previewId) {
        var self = this;
        var input = document.getElementById(inputId);
        var wrapper = document.getElementById(wrapperId);
        var preview = document.getElementById(previewId);
        
        console.log('Setting up file upload for:', inputId, wrapperId);
        
        // Ensure registerData exists
        if (!self.registerData) {
            self.registerData = {};
        }
        
        // Handle wrapper click
        if (wrapper) {
            wrapper.style.cursor = 'pointer';
            wrapper.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Wrapper clicked:', wrapperId);
                if (input) {
                    input.click();
                }
            });
        }
        
        // Handle file input change
        if (input) {
            input.addEventListener('change', function(e) {
                e.preventDefault();
                var file = this.files[0];
                console.log('File selected:', file ? file.name : 'none');
                
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        // Determine key based on input ID
                        var key = 'schoolIdPic'; // default
                        if (inputId.indexOf('profile') !== -1) {
                            key = 'profilePic';
                        }
                        
                        self.registerData[key] = evt.target.result;
                        console.log('File uploaded, key:', key, ', data length:', evt.target.result.length);
                        
                        // Update preview
                        if (preview) {
                            if (file.type.startsWith('image/')) {
                                preview.innerHTML = '<img src="' + evt.target.result + '" style="max-width:100%;max-height:120px;border-radius:8px;">';
                            } else {
                                preview.innerHTML = '<div style="padding:8px;background:#eee;border-radius:8px;"><i class="fas fa-file"></i> ' + file.name + '</div>';
                            }
                            preview.classList.add('show');
                        }
                        
                        // Update wrapper style
                        if (wrapper) {
                            wrapper.classList.add('has-file');
                            var textEl = wrapper.querySelector('.file-upload-text');
                            if (textEl) {
                                textEl.innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i> ' + file.name;
                            }
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    },

    attachOTPInput: function() {
        var self = this;
        var inputs = document.querySelectorAll('.otp-input');
        
        inputs.forEach(function(input, index) {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    },

    pendingApproval: function() {
        this.currentPage = 'pending';
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        app.innerHTML = 
            '<div class="auth-page">' +
                '<div class="auth-card" style="text-align:center;">' +
                    '<button class="register-back-btn" id="back-to-otp" style="margin:0 auto 16px auto;"><i class="fas fa-arrow-left"></i> Back</button>' +
                    '<div class="pending-status">' +
                        '<i class="fas fa-clock"></i>' +
                        '<div class="pending-status-text">' +
                        '<strong>Account Pending Approval</strong>' +
                        'Your account is awaiting admin approval. You will receive an email once your account has been reviewed.' +
                        '</div>' +
                    '</div>' +
                    '<button class="btn btn-secondary" id="logout-pending" style="margin-top:16px;">Logout</button>' +
                '</div>' +
            '</div>';
        
        var backBtn = document.getElementById('back-to-otp');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderRegister(3);
            });
        }
        
        var logoutBtn = document.getElementById('logout-pending');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('cscCurrentUser');
                self.currentUser = null;
                self.renderLogin();
            });
        }
    },

    // ========== DASHBOARD ==========
    renderDashboard: function() {
        if (this.currentUser.role === 'admin') {
            this.renderAdminDashboard();
        } else {
            this.renderStudentDashboard();
        }
    },

renderHeader: function(user) {
        var unreadCount = (this.data.messages || []).filter(function(m) { return m.to === user.email && !m.read; }).length;
        
        return '<header class="dashboard-header">' +
            '<div class="header-left">' +
                '<button class="mobile-menu-btn"><i class="fas fa-bars"></i></button>' +
                '<div class="header-logo"><i class="fas fa-university"></i></div>' +
                '<h1 class="header-title">CSC Transparency</h1>' +
            '</div>' +
            '<div class="header-right">' +
                '<button class="btn btn-sm" id="message-btn" style="margin-right:8px;background:transparent;border:none;color:var(--text-color);cursor:pointer;position:relative;"><i class="fas fa-envelope"></i>' +
                (unreadCount > 0 ? '<span style="position:absolute;top:-4px;right:-4px;background:var(--danger-color);color:white;font-size:10px;padding:2px 5px;border-radius:10px;min-width:16px;text-align:center;">' + unreadCount + '</span>' : '') +
                '</button>' +
                '<div class="profile-dropdown">' +
                    '<button class="profile-btn dropdown-toggle">' +
                        '<div class="profile-avatar">' + user.name.charAt(0) + '</div>' +
                        '<span class="profile-name">' + user.name + '</span>' +
                        '<i class="fas fa-chevron-down"></i>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                        '<div class="dropdown-item" data-action="home"><i class="fas fa-home"></i> Home</div>' +
                        '<div class="dropdown-item" data-action="profile"><i class="fas fa-user"></i> Profile</div>' +
                        '<div class="dropdown-divider"></div>' +
                        '<div class="dropdown-item danger" data-action="logout"><i class="fas fa-sign-out-alt"></i> Logout</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</header>';
    },

    renderAdminSidebar: function() {
        var pendingCount = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status === 'pending'; }).length;
        var suggestionsCount = (this.data.suggestions || []).filter(function(s) { return s.status === 'pending'; }).length;
        var complaintsCount = (this.data.complaints || []).filter(function(c) { return c.status === 'pending' || c.status === 'inreview'; }).length;
        
        var tabs = [
            { id: 'overview', icon: 'fa-tachometer-alt', label: 'Overview' },
            { id: 'events', icon: 'fa-calendar', label: 'Events' },
            { id: 'announcements', icon: 'fa-newspaper', label: 'News' },
            { id: 'headlines', icon: 'fa-star', label: 'Featured' },
            { id: 'attendance', icon: 'fa-qrcode', label: 'Attendance' },
            { id: 'students', icon: 'fa-users', label: 'Students' },
            { id: 'pending', icon: 'fa-user-plus', label: 'Account Request' + (pendingCount > 0 ? ' (' + pendingCount + ')' : '') },
            { id: 'files', icon: 'fa-folder', label: 'Files' },
            { id: 'reports', icon: 'fa-file-pdf', label: 'Reports' },
            { id: 'finance', icon: 'fa-coins', label: 'Finance' },
            { id: 'polls', icon: 'fa-poll', label: 'Polls' },
            { id: 'suggestions', icon: 'fa-lightbulb', label: 'Suggestions' + (suggestionsCount > 0 ? ' (' + suggestionsCount + ')' : '') },
            { id: 'complaints', icon: 'fa-exclamation-triangle', label: 'Complaints' + (complaintsCount > 0 ? ' (' + complaintsCount + ')' : '') },
            { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics' }
        ];
        var self = this;
        var html = '<nav class="dashboard-sidebar"><ul class="sidebar-nav">';
        tabs.forEach(function(tab) {
            html += '<li class="nav-item ' + (self.currentAdminTab === tab.id ? 'active' : '') + '" data-tab="' + tab.id + '">' +
                '<i class="fas ' + tab.icon + '"></i><span>' + tab.label + '</span></li>';
        });
        html += '</ul>' +
        '<div style="padding:12px;border-top:1px solid var(--border-color);">' +
        '<button class="btn btn-primary" id="chatbot-btn" style="width:100%;"><i class="fas fa-robot"></i> Chat Bot</button>' +
        '</div></nav>';
        
        // Add chatbot modal HTML
        html += '<div id="chatbot-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
        '<div class="modal-content" style="max-width:500px;max-height:80vh;display:flex;flex-direction:column;">' +
        '<div class="modal-header"><h3><i class="fas fa-robot"></i> CSC Assistant</h3><button class="modal-close" id="close-chatbot">&times;</button></div>' +
        '<div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:16px;background:var(--bg-color);min-height:300px;">' +
        '<div style="background:white;padding:12px;border-radius:8px;margin-bottom:8px;max-width:80%;"><strong>Assistant:</strong> Hello! How can I help you today?</div>' +
        '</div>' +
        '<div style="padding:12px;border-top:1px solid var(--border-color);">' +
        '<input type="text" id="chatbot-input" placeholder="Type your message..." style="width:100%;">' +
        '<button class="btn btn-primary btn-sm" id="chatbot-send" style="margin-top:8px;"><i class="fas fa-paper-plane"></i> Send</button>' +
        '</div></div></div>';
        
        return html;
    },

    renderStudentSidebar: function() {
        var tabs = [
            { id: 'overview', icon: 'fa-tachometer-alt', label: 'Overview' },
            { id: 'events', icon: 'fa-calendar', label: 'Events' },
            { id: 'files', icon: 'fa-folder', label: 'Files' },
            { id: 'reports', icon: 'fa-file-pdf', label: 'Reports' },
            { id: 'finance', icon: 'fa-coins', label: 'Finance' },
            { id: 'polls', icon: 'fa-poll', label: 'Polls' },
            { id: 'suggestions', icon: 'fa-lightbulb', label: 'Suggestions' },
            { id: 'complaints', icon: 'fa-exclamation-triangle', label: 'Complaints' }
        ];
        var self = this;
var html = '<nav class="dashboard-sidebar"><ul class="sidebar-nav">';
        tabs.forEach(function(tab) {
            html += '<li class="nav-item ' + (self.currentStudentTab === tab.id ? 'active' : '') + '" data-tab="' + tab.id + '">' +
                '<i class="fas ' + tab.icon + '"></i><span>' + tab.label + '</span></li>';
        });
        html += '</ul>' +
            '<div style="padding:12px;border-top:1px solid var(--border-color);">' +
            '<button class="btn btn-warning" id="scan-qr-btn" style="width:100%;margin-bottom:8px;"><i class="fas fa-qrcode"></i> Scan QR</button>' +
            '<button class="btn btn-primary" id="chatbot-btn" style="width:100%;"><i class="fas fa-robot"></i> Chat Bot</button>' +
            '</div></nav>';
        
        // Add chatbot modal HTML
        html += '<div id="chatbot-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
        '<div class="modal-content" style="max-width:500px;max-height:80vh;display:flex;flex-direction:column;">' +
        '<div class="modal-header"><h3><i class="fas fa-robot"></i> CSC Assistant</h3><button class="modal-close" id="close-chatbot">&times;</button></div>' +
        '<div id="chatbot-messages" style="flex:1;overflow-y:auto;padding:16px;background:var(--bg-color);min-height:300px;">' +
        '<div style="background:white;padding:12px;border-radius:8px;margin-bottom:8px;max-width:80%;"><strong>Assistant:</strong> Hello! How can I help you today?</div>' +
        '</div>' +
        '<div style="padding:12px;border-top:1px solid var(--border-color);">' +
        '<input type="text" id="chatbot-input" placeholder="Type your message..." style="width:100%;">' +
        '<button class="btn btn-primary btn-sm" id="chatbot-send" style="margin-top:8px;"><i class="fas fa-paper-plane"></i> Send</button>' +
        '</div></div></div>';
        
        return html;
    },

    renderCalendar: function() {
        var year = this.currentDate.getFullYear();
        var month = this.currentDate.getMonth();
        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var today = new Date();
        
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        var daysHtml = '';
        for (var i = 0; i < firstDay; i++) daysHtml += '<div></div>';
        for (var day = 1; day <= daysInMonth; day++) {
            var isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            daysHtml += '<div class="calendar-day' + (isToday ? ' today' : '') + '">' + day + '</div>';
        }
        
        return '<div class="calendar">' +
            '<div class="calendar-header">' +
                '<h3 class="calendar-title">' + monthNames[month] + ' ' + year + '</h3>' +
                '<div class="calendar-nav">' +
                    '<button class="calendar-nav-btn" data-calendar="prev"><i class="fas fa-chevron-left"></i></button>' +
                    '<button class="calendar-nav-btn" data-calendar="next"><i class="fas fa-chevron-right"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="calendar-grid">' + dayNames.map(function(d) { return '<div class="calendar-day-name">' + d + '</div>'; }).join('') + daysHtml + '</div>' +
        '</div>';
    },

    renderMediaContent: function() {
        var media = this.data.mediaContent || [];
        var html = '<div class="right-section">' +
            '<h3 class="right-section-title">Featured Media</h3>';
        
        if (media.length === 0) {
            html += '<p class="text-sm text-muted">No media available</p>';
        } else {
            media.slice(0, 3).forEach(function(m) {
                if (m.type === 'image') {
                    html += '<div style="margin-bottom:12px;cursor:pointer;" onclick="App.viewFullImage(this)">' +
                        '<img src="' + m.url + '" style="width:100%;border-radius:8px;object-fit:cover;height:150px;">' +
                        '<div style="font-size:12px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + m.title + '</div></div>';
                } else if (m.type === 'video') {
                    html += '<div style="margin-bottom:12px;">' +
                        '<div style="position:relative;cursor:pointer;border-radius:8px;overflow:hidden;" onclick="App.viewVideo(\'' + m.url + '\')">' +
                        '<div style="width:100%;height:150px;background:#333;display:flex;align-items:center;justify-content:center;color:white;font-size:32px;"><i class="fas fa-play-circle"></i></div>' +
                        '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-size:24px;pointer-events:none;"><i class="fas fa-play-circle"></i></div></div>' +
                        '<div style="font-size:12px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + m.title + '</div></div>';
                }
            });
        }
        
        html += '</div>';
        return html;
    },

    viewFullImage: function(imgEl) {
        var src = imgEl.tagName === 'IMG' ? imgEl.src : imgEl.querySelector('img').src;
        var modal = document.getElementById('image-modal');
        var img = document.getElementById('modal-image');
        if (modal && img) {
            img.src = src;
            modal.style.display = 'flex';
        }
    },

    viewVideo: function(url) {
        if (url) {
            window.open(url, '_blank');
        }
    },

    renderDashboardRight: function(role) {
        var activeStudents = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.active; });
        var latestAnnouncements = (this.data.announcements || []).slice(0, 3);
        var headlines = this.data.headlines || [];
        
        var html = '<aside class="dashboard-right">' +
            '<div class="right-section"><h3 class="right-section-title">Calendar</h3>' + this.renderCalendar() + '</div>';
        
        if (role === 'student') {
            if (headlines.length > 0) {
                html += '<div class="right-section"><h3 class="right-section-title">Featured</h3>';
                headlines.slice(0, 2).forEach(function(h) {
                    html += '<div style="background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:white;padding:12px;border-radius:var(--radius-sm);margin-bottom:8px;">' +
                        '<div style="font-weight:600;font-size:14px;">' + h.title + '</div>' +
                        '<div style="font-size:12px;opacity:0.9;margin-top:4px;">' + h.content + '</div></div>';
                });
                html += '</div>';
            }
            
            if (latestAnnouncements.length > 0) {
                html += '<div class="right-section"><h3 class="right-section-title">Announcements</h3>';
                latestAnnouncements.forEach(function(a) {
                    html += '<div style="background:var(--bg-color);padding:10px;border-radius:var(--radius-sm);margin-bottom:8px;cursor:pointer;" onclick="App.goToTab(\'news\')">' +
                        '<div style="font-weight:600;font-size:13px;margin-bottom:2px;">' + a.title + '</div>' +
                        '<div style="font-size:11px;color:var(--text-light);">' + a.date + '</div></div>';
                });
                html += '</div>';
            }
            
            html += '<div class="right-section"><h3 class="right-section-title">Active Students</h3>' +
                '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
            activeStudents.slice(0, 8).forEach(function(s) {
                var initial = s.name ? s.name.charAt(0) : '?';
                html += '<div class="profile-avatar" style="width:32px;height:32px;font-size:12px;cursor:pointer;" title="' + s.name + '">' + initial + '</div>';
            });
            html += '<div style="font-size:12px;color:var(--text-light);width:100%;">' + activeStudents.length + ' students online</div></div>';
        } else {
            html += this.renderMediaContent();
        }
        
        html += '</aside>';
        return html;
    },

    renderAdminDashboard: function() {
        var self = this;
        document.getElementById('app').innerHTML = 
            '<div class="dashboard active">' +
                this.renderHeader(this.currentUser) +
                '<div class="dashboard-container">' +
                    this.renderAdminSidebar() +
                    '<main class="dashboard-main">' + this.renderAdminContent() + '</main>' +
                    this.renderDashboardRight('admin') +
                '</div>' +
            '</div>';
        setTimeout(function() {
            self.attachDashboardListeners('admin');
        }, 100);
    },

    renderStudentDashboard: function() {
        var self = this;
        document.getElementById('app').innerHTML = 
            '<div class="dashboard active">' +
                this.renderHeader(this.currentUser) +
                '<div class="dashboard-container">' +
                    this.renderStudentSidebar() +
                    '<main class="dashboard-main">' + this.renderStudentContent() + '</main>' +
                    this.renderDashboardRight('student') +
                '</div>' +
            '</div>';
        setTimeout(function() {
            self.attachDashboardListeners('student');
        }, 100);
    },

    // ========== ADMIN CONTENT ==========
    renderAdminContent: function() {
        var titles = { 
            overview: 'Dashboard Overview', 
            events: 'Events', 
            announcements: 'News & Updates',
            headlines: 'Featured',
            students: 'Students', 
            pending: 'Pending Requests', 
            files: 'Files', 
            reports: 'Reports', 
            finance: 'Finance', 
            polls: 'Polls', 
            suggestions: 'Suggestions',
            complaints: 'Complaints',
            analytics: 'Analytics',
            attendance: 'Attendance'
        };
        var content = '';
        switch(this.currentAdminTab) {
            case 'overview': content = this.renderAdminOverview(); break;
            case 'events': content = this.renderAdminEvents(); break;
            case 'announcements': content = this.renderAdminAnnouncements(); break;
            case 'headlines': content = this.renderAdminHeadlines(); break;
            case 'attendance': content = this.renderAdminAttendance(); break;
            case 'students': content = this.renderAdminStudents(); break;
            case 'pending': content = this.renderAdminPending(); break;
            case 'files': content = this.renderAdminFiles(); break;
            case 'reports': content = this.renderAdminReports(); break;
            case 'finance': content = this.renderAdminFinance(); break;
            case 'polls': content = this.renderAdminPolls(); break;
            case 'suggestions': content = this.renderAdminSuggestions(); break;
            case 'complaints': content = this.renderAdminComplaints(); break;
            case 'analytics': content = this.renderAdminAnalytics(); break;
        }
        return '<div class="content-area"><div class="content-header"><h2 class="content-title">' + titles[this.currentAdminTab] + '</h2></div>' + content + '</div>';
    },

    renderAdminOverview: function() {
        var self = this;
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student'; });
        var activePolls = (this.data.polls || []).filter(function(p) { return p.active; }).length;
        var recentAnn = (this.data.announcements || []).slice(0, 3);
        
        var currentMonth = new Date().toISOString().slice(0, 7);
        
        var upcomingEvents = (this.data.events || []).filter(function(e) { return e.status === 'upcoming'; });
        var upcomingThisMonth = upcomingEvents.filter(function(e) { return e.date && e.date.slice(0, 7) === currentMonth; });
        var finishedEvents = (this.data.events || []).filter(function(e) { return e.status === 'finished'; });
        var finishedThisMonth = finishedEvents.filter(function(e) { return e.date && e.date.slice(0, 7) === currentMonth; });
        var cancelledEvents = (this.data.events || []).filter(function(e) { return e.status === 'cancelled'; });
        var cancelledThisMonth = cancelledEvents.filter(function(e) { return e.date && e.date.slice(0, 7) === currentMonth; });
        var movedEvents = (this.data.events || []).filter(function(e) { return e.status === 'moved'; });
        var movedThisMonth = movedEvents.filter(function(e) { return e.date && e.date.slice(0, 7) === currentMonth; });
        
        var finance = this.data.finance || { currentFunds: 0, transactions: [] };
        var totalExpenses = finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var totalFundsRaised = finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        return '<div class="welcome-banner"><h2>Welcome, ' + this.currentUser.name + '!</h2><p>Here\'s what\'s happening today</p></div>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-info"><div class="stat-value">' + students.length + '</div><div class="stat-label">Total Students</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-poll"></i></div><div class="stat-info"><div class="stat-value">' + activePolls + '</div><div class="stat-label">Active Polls</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-bullhorn"></i></div><div class="stat-info"><div class="stat-value">' + (this.data.announcements || []).length + '</div><div class="stat-label">Announcements</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-file-alt"></i></div><div class="stat-info"><div class="stat-value">' + (this.data.files || []).length + '</div><div class="stat-label">Files</div></div></div>' +
            '</div>' +
            '<h3 style="margin:20px 0 12px;font-size:16px;font-weight:600;">Events Overview</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-calendar-check"></i></div><div class="stat-info"><div class="stat-value">' + upcomingEvents.length + '</div><div class="stat-label">Total Upcoming</div><div class="text-sm text-muted">This Month: ' + upcomingThisMonth.length + '</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dcfce7;color:#10b981;"><i class="fas fa-check-circle"></i></div><div class="stat-info"><div class="stat-value">' + finishedEvents.length + '</div><div class="stat-label">Total Finished</div><div class="text-sm text-muted">This Month: ' + finishedThisMonth.length + '</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#ef4444;"><i class="fas fa-times-circle"></i></div><div class="stat-info"><div class="stat-value">' + cancelledEvents.length + '</div><div class="stat-label">Total Cancelled</div><div class="text-sm text-muted">This Month: ' + cancelledThisMonth.length + '</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef3c7;color:#f59e0b;"><i class="fas fa-arrow-right"></i></div><div class="stat-info"><div class="stat-value">' + movedEvents.length + '</div><div class="stat-label">Total Moved</div><div class="text-sm text-muted">This Month: ' + movedThisMonth.length + '</div></div></div>' +
            '</div>' +
            '<h3 style="margin:20px 0 12px;font-size:16px;font-weight:600;">Finance Overview</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">$' + finance.currentFunds.toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">$' + totalExpenses.toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">$' + totalFundsRaised.toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
            '</div>';
    },

    renderAdminEvents: function() {
        var self = this;
        var html = '<div class="content-actions" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">' +
            '<button class="btn btn-primary" id="create-event-btn"><i class="fas fa-plus"></i> Create Event</button>' +
            '<input type="text" class="form-input" id="event-search" placeholder="Search events..." style="width:200px;margin-left:auto;">' +
            '<select class="form-input" id="event-sort" style="width:150px;">' +
            '<option value="">Sort By</option>' +
            '<option value="date-asc">Date (Earliest)</option>' +
            '<option value="date-desc">Date (Latest)</option>' +
            '<option value="upcoming">Status: Upcoming</option>' +
            '<option value="finished">Status: Finished</option>' +
            '<option value="cancelled">Status: Cancelled</option>' +
            '<option value="moved">Status: Moved</option>' +
            '</select>' +
            '<select class="form-input" id="event-batch-filter" style="width:150px;">' +
            '<option value="">All Batches</option>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option>' +
            '</select></div>';
        
        var events = this.data.events.slice();
        
        // Get current filter values
        var searchQuery = this.currentFilter.eventSearch || '';
        var sortBy = this.currentSort.eventSort || '';
        var batchFilter = this.currentFilter.eventBatch || '';
        
        if (events.length === 0) {
            var noEventMsg = searchQuery || sortBy || batchFilter ? 'No events match your search/filters' : 'No events yet';
            var noEventSub = searchQuery || sortBy || batchFilter ? '' : 'Create your first event';
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-calendar"></i></div><h3 class="empty-title">' + noEventMsg + '</h3><p class="empty-text">' + noEventSub + '</p></div>';
        } else {
            // Apply search filter - title only
            if (searchQuery) {
                var sq = searchQuery.toLowerCase();
                events = events.filter(function(e) {
                    return (e.title && e.title.toLowerCase().includes(sq));
                });
            }
            
            // Apply status filter
            var filteredEvents = events.filter(function(e) {
                if (sortBy) {
                    if (sortBy === 'upcoming' && e.status !== 'upcoming') return false;
                    if (sortBy === 'finished' && e.status !== 'finished') return false;
                    if (sortBy === 'cancelled' && e.status !== 'cancelled') return false;
                    if (sortBy === 'moved' && e.status !== 'moved') return false;
                }
                if (batchFilter && e.batch !== batchFilter) return false;
                return true;
            });
            
            // Apply sorting
            if (sortBy === 'date-asc') {
                filteredEvents.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
            } else if (sortBy === 'date-desc') {
                filteredEvents.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
            }
            
            html += '<div class="cards-grid">';
            for (var i = 0; i < filteredEvents.length; i++) {
                var e = filteredEvents[i];
                var rsvpCount = e.rsvps ? e.rsvps.length : 0;
                var statusClass = e.status === 'upcoming' ? 'badge-primary' : e.status === 'finished' ? 'badge-success' : e.status === 'cancelled' ? 'badge-danger' : 'badge-warning';
                var statusLabel = e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Upcoming';
                html += '<div class="card">' +
                    '<div class="card-header"><h3 class="card-title">' + e.title + '</h3>' +
                    '<span class="card-badge badge-primary">' + (e.pinned ? 'Pinned' : 'Event') + '</span></div>' +
                    '<div class="card-body"><div style="text-align:center;margin-bottom:12px;">' +
                    '<span class="badge ' + statusClass + '">' + statusLabel + '</span>' +
                    '<span class="badge badge-secondary" style="margin-left:8px;">' + (e.category || 'General') + '</span>' +
                    (e.batch ? '<span class="badge badge-secondary" style="margin-left:8px;">' + e.batch + '</span>' : '') + '</div>' +
                    '<div class="event-details">' +
                    '<div class="event-detail"><i class="fas fa-calendar"></i> ' + e.date + '</div>' +
                    '<div class="event-detail"><i class="fas fa-clock"></i> ' + e.time + '</div>' +
                    '<div class="event-detail"><i class="fas fa-map-marker-alt"></i> ' + e.location + '</div>' +
                    '<div class="event-detail"><i class="fas fa-users"></i> ' + rsvpCount + ' Attendees</div></div>' +
                    (e.evaluationLink ? '<div style="margin-top:8px;"><a href="' + e.evaluationLink + '" target="_blank" style="color:var(--primary-color);font-size:13px;"><i class="fas fa-clipboard"></i> Evaluation Form</a></div>' : '') +
                    (e.qrCode ? '<div style="margin-top:8px;font-size:12px;color:var(--text-light);"><i class="fas fa-qrcode"></i> Code: ' + e.qrCode + '</div>' : '') +
                    (e.media ? '<div style="margin-top:12px;"><img src="' + e.media + '" style="max-width:100%;max-height:200px;border-radius:8px;cursor:pointer;" onclick="App.viewImage(\'' + e.media + '\')" title="Click to view"></div>' : '') +
                    '<p class="card-text mt-4">' + e.description + '</p></div>' +
                    '<div class="card-footer">' +
                    '<button class="btn btn-secondary btn-sm" data-action="edit-event" data-id="' + e.id + '">Edit</button>' +
                    (e.qrCode ? '<button class="btn btn-primary btn-sm" data-action="download-qr" data-id="' + e.id + '"><i class="fas fa-qrcode"></i> QR</button>' : '') +
                    (e.qrCode || e.evaluationLink ? '<button class="btn btn-info btn-sm" data-action="view-attendees" data-id="' + e.id + '"><i class="fas fa-users"></i> Attendees (' + (e.attendees ? e.attendees.length : 0) + ')</button>' : '') +
                    '<button class="btn btn-danger btn-sm" data-action="delete-event" data-id="' + e.id + '">Delete</button></div></div>';
            }
            html += '</div>';
        }
        
        html += self.renderCreateEventModal();
        return html;
    },
    
    filterEvents: function(value) {
        this.currentFilter.eventSearch = value;
        this.renderAdminDashboard();
    },
    
    sortEvents: function(value) {
        this.currentSort.eventSort = value;
        this.renderAdminDashboard();
    },
    
    filterEventsBatch: function(value) {
        this.currentFilter.eventBatch = value;
        this.renderAdminDashboard();
    },

    renderCreateEventModal: function() {
        return '<div id="event-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;margin:auto;">' +
                '<div class="modal-header"><h3>Create Event</h3><button class="modal-close" id="close-event-modal">&times;</button></div>' +
                '<form id="event-form">' +
                '<div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="event-title" required></div>' +
                '<div class="form-group"><label class="form-label">Category *</label>' +
                '<div style="display:flex;gap:8px;align-items:center;">' +
                '<select class="form-input" id="event-category-select" style="flex:1;">' +
                '<option value="">Select Category</option>' +
                '<option value="Seminar">Seminar</option>' +
                '<option value="Workshop">Workshop</option>' +
                '<option value="Meeting">Meeting</option>' +
                '<option value="Conference">Conference</option>' +
                '<option value="Social">Social</option>' +
                '<option value="Sports">Sports</option>' +
                '<option value="Other">Other</option>' +
                '</select>' +
                '<span style="color:var(--text-light);">or</span>' +
                '<input type="text" class="form-input" id="event-category-custom" placeholder="Custom category" style="flex:1;"></div></div>' +
                '<div class="form-group"><label class="form-label">Status *</label>' +
                '<select class="form-input" id="event-status" required>' +
                '<option value="upcoming">Upcoming</option>' +
                '<option value="finished">Finished</option>' +
                '<option value="cancelled">Cancelled</option>' +
                '<option value="moved">Moved</option>' +
                '</select></div>' +
                '<div class="form-group"><label class="form-label">Semester/Batch *</label>' +
                '<select class="form-input" id="event-batch" required>' +
                '<option value="">Select Batch</option>' +
                '<option value="2025-2026">2025-2026</option>' +
                '<option value="2024-2025">2024-2025</option>' +
                '<option value="2023-2024">2023-2024</option>' +
                '</select></div>' +
                '<div class="form-group"><label class="form-label">Date *</label><input type="date" class="form-input" id="event-date" required></div>' +
                '<div class="form-group"><label class="form-label">Time *</label><input type="time" class="form-input" id="event-time" required></div>' +
                '<div class="form-group"><label class="form-label">Location *</label><input type="text" class="form-input" id="event-location" required></div>' +
                '<div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="event-description" rows="3"></textarea></div>' +
'<div class="form-group"><label class="form-label">Image/Video (Optional)</label>' +
            '<div class="file-upload-wrapper" id="event-media-upload" style="position:relative;">' +
            '<div class="file-upload-icon"><i class="fas fa-image"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Image or Video</span></div>' +
            '<div class="file-preview" id="event-media-preview"></div></div>' +
            '<button type="button" class="btn btn-danger btn-sm" id="remove-event-media" style="position:absolute;top:8px;right:8px;display:none;">&times;</button>' +
            '<input type="file" id="event-media-input" accept="image/*,video/*" style="display:none;"></div>' +
            '<div class="form-group"><label class="form-label">Attendance Code (paste generated code)</label><input type="text" class="form-input" id="event-qr-code" placeholder="e.g., EVENT-12345"></div>' +
            '<div class="form-group"><label class="form-label">Evaluation Form Link (Optional)</label><input type="url" class="form-input" id="event-evaluation-link" placeholder="https://docs.google.com/forms/..."></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="event-evaluation-enabled"><span>Enable Evaluation</span></label></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="event-pin"><span>Pin this event</span></label></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary" id="event-submit-btn">Create Event</button></div>' +
                '</form></div></div>';
    },

    renderAdminAnnouncements: function() {
        var self = this;
        var announcements = (this.data.announcements || []).slice();
        
        var sortBy = this.currentSort.announcementSort || 'date-desc';
        if (sortBy === 'date-desc') {
            announcements.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
        } else if (sortBy === 'date-asc') {
            announcements.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
        } else if (sortBy === 'pinned') {
            announcements.sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
        }
        
        var searchQuery = this.currentFilter.announcementSearch || '';
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            announcements = announcements.filter(function(a) {
                return (a.title && a.title.toLowerCase().includes(searchQuery));
            });
        }
        
        var html = '<div class="content-actions" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">' +
            '<button class="btn btn-primary" id="create-announcement-btn"><i class="fas fa-plus"></i> Create Announcement</button>' +
            '<input type="text" class="form-input" id="announcement-search" placeholder="Search announcements..." style="width:200px;margin-left:auto;">' +
            '<select class="form-input" id="announcement-sort" style="width:150px;">' +
            '<option value="date-desc">Newest First</option>' +
            '<option value="date-asc">Oldest First</option>' +
            '<option value="pinned">Pinned First</option>' +
            '</select></div>';
        
        if (announcements.length === 0) {
            var noResults = searchQuery || sortBy !== 'date-desc' ? 'No announcements match your search' : 'No announcements';
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-bullhorn"></i></div><h3 class="empty-title">' + noResults + '</h3></div>';
        } else {
            html += '<div class="newsfeed">';
            for (var i = 0; i < announcements.length; i++) {
                var a = announcements[i];
                var likesCount = a.likes ? a.likes.length : 0;
                html += '<div class="newsfeed-item" style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);margin-bottom:16px;overflow:hidden;">';
                
                if (a.image) {
                    html += '<div style="cursor:pointer;" onclick="App.viewImage(\'' + a.image + '\')">' +
                        '<img src="' + a.image + '" style="width:100%;max-height:300px;object-fit:cover;"></div>';
                }
                if (a.video) {
                    html += '<div style="padding:16px;background:#333;"><video controls style="width:100%;max-height:300px;"><source src="' + a.video + '"></video></div>';
                }
                
                html += '<div style="padding:16px;">' +
                    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
                    '<div class="profile-avatar" style="width:40px;height:40px;font-size:16px;"><i class="fas fa-school"></i></div>' +
                    '<div><div style="font-weight:600;font-size:15px;">CSC Administration</div>' +
                    '<div style="font-size:12px;color:var(--text-light);">' + a.date + (a.pinned ? ' <span class="badge badge-warning">Pinned</span>' : '') + '</div></div></div>' +
                    '<h3 style="font-size:18px;font-weight:600;margin-bottom:8px;">' + a.title + '</h3>' +
                    '<p style="font-size:14px;line-height:1.6;margin-bottom:12px;">' + a.content + '</p>';
                
                if (a.attachments && a.attachments.length > 0) {
                    html += '<div style="margin-bottom:12px;"><strong>Attachments:</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">';
                    a.attachments.forEach(function(att) {
                        html += '<div class="file-item" style="padding:8px 12px;background:var(--bg-color);border-radius:6px;display:flex;align-items:center;gap:8px;">' +
                            '<i class="fas fa-file"></i><span>' + att.name + '</span></div>';
                    });
                    html += '</div></div>';
                }
                
                html += '<div style="display:flex;gap:8px;align-items:center;border-top:1px solid var(--border-color);padding-top:12px;margin-top:12px;">' +
                    '<button class="btn btn-' + (likesCount > 0 ? 'success' : 'secondary') + ' btn-sm"><i class="fas fa-thumbs-up"></i> ' + likesCount + ' Likes</button>' +
                    '<button class="btn btn-secondary btn-sm" data-action="pin-announcement" data-id="' + a.id + '">' + (a.pinned ? 'Unpin' : 'Pin') + '</button>' +
                    '<button class="btn btn-danger btn-sm" data-action="delete-announcement" data-id="' + a.id + '">Delete</button></div></div></div>';
            }
            html += '</div>';
        }
        
        html += self.renderCreateAnnouncementModal();
        return html;
    },
    
    renderCreateAnnouncementModal: function() {
        return '<div id="announcement-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:600px;margin:auto;">' +
            '<div class="modal-header"><h3>Create Announcement</h3><button class="modal-close" id="close-announcement-modal">&times;</button></div>' +
            '<form id="announcement-form">' +
            '<div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="announcement-title" required></div>' +
            '<div class="form-group"><label class="form-label">Content *</label><textarea class="form-input" id="announcement-content" rows="4" required></textarea></div>' +
            '<div class="form-group"><label class="form-label">Image (Optional)</label>' +
            '<div class="file-upload-wrapper" id="announcement-image-upload" style="position:relative;">' +
            '<div class="file-upload-icon"><i class="fas fa-image"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Image</span></div>' +
            '<div class="file-preview" id="announcement-image-preview"></div></div>' +
            '<button type="button" class="btn btn-danger btn-sm" id="remove-announcement-image" style="position:absolute;top:8px;right:8px;display:none;">&times;</button>' +
            '<input type="file" id="announcement-image-input" accept="image/*" style="display:none;"></div>' +
            '<div class="form-group"><label class="form-label">Video (Optional)</label>' +
            '<div class="file-upload-wrapper" id="announcement-video-upload" style="position:relative;">' +
            '<div class="file-upload-icon"><i class="fas fa-video"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Video</span></div>' +
            '<div class="file-preview" id="announcement-video-preview"></div></div>' +
            '<button type="button" class="btn btn-danger btn-sm" id="remove-announcement-video" style="position:absolute;top:8px;right:8px;display:none;">&times;</button>' +
            '<input type="file" id="announcement-video-input" accept="video/*" style="display:none;"></div>' +
            '<div class="form-group"><label class="form-label">Attachments (Optional)</label>' +
            '<div class="file-upload-wrapper" id="announcement-files-upload">' +
            '<div class="file-upload-icon"><i class="fas fa-paperclip"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Files</span></div>' +
            '<div class="file-preview" id="announcement-files-preview"></div></div>' +
            '<input type="file" id="announcement-files-input" accept=".pdf,.doc,.docx,.xls,.xlsx" style="display:none;" multiple></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="announcement-pin"><span>Pin this announcement</span></label></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Post Announcement</button></div>' +
            '</form></div></div>';
    },

    renderAdminHeadlines: function() {
        var self = this;
        var headlines = this.data.headlines || [];
        
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="create-headline-btn"><i class="fas fa-plus"></i> Add Featured Post</button></div>';
        
        if (headlines.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-star"></i></div><h3 class="empty-title">No Featured Posts</h3><p class="empty-text">Add headlines to show on student dashboard</p></div>';
        } else {
            html += '<div class="cards-grid">';
            headlines.forEach(function(h) {
                html += '<div class="card" style="background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:white;">' +
                    '<div class="card-header" style="border-bottom:1px solid rgba(255,255,255,0.2);color:white;">' +
                    '<span class="card-title" style="color:white;">' + h.title + '</span>' +
                    '<div>' +
                    '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:none;" data-action="edit-headline" data-id="' + h.id + '"><i class="fas fa-edit"></i></button> ' +
                    '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:none;" data-action="delete-headline" data-id="' + h.id + '"><i class="fas fa-trash"></i></button>' +
                    '</div></div>' +
                    '<div class="card-body">' +
                    '<p style="font-size:14px;opacity:0.95;">' + h.content + '</p>' +
                    '<p style="font-size:12px;opacity:0.7;margin-top:8px;">Posted: ' + h.date + '</p>' +
                    '</div></div>';
            });
            html += '</div>';
        }
        
        html += '<div id="headline-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>Add Featured Post</h3><button class="modal-close" id="close-headline-modal">&times;</button></div>' +
            '<form id="headline-form">' +
            '<div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="headline-title" required></div>' +
            '<div class="form-group"><label class="form-label">Content *</label><textarea class="form-input" id="headline-content" rows="3" required></textarea></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Post</button></div>' +
            '</form></div></div>';
        
        return html;
    },

    renderAdminAttendance: function() {
        var self = this;
        var events = (this.data.events || []).filter(function(e) { return e.status === 'upcoming' || e.status === 'finished'; });
        var qrCodesList = self.data.qrCodes || [];
        
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="generate-qr-btn"><i class="fas fa-plus"></i> Generate QR Code</button></div>' +
            '<div id="qr-generator-panel" style="margin-top:16px;padding:16px;background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);display:none;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
            '<h3 style="margin:0;">Generate Attendance QR Code</h3>' +
            '<button class="modal-close" id="close-qr-panel" style="background:none;border:none;font-size:24px;cursor:pointer;">&times;</button></div>' +
            '<div class="form-group"><label class="form-label">QR Code Name *</label>' +
            '<input type="text" class="form-input" id="qr-name-input" placeholder="e.g., General Assembly April 2026" required></div>' +
            '<div class="form-group"><label class="form-label">Event (Optional - for linking)</label>' +
            '<select class="form-input" id="qr-event-select">' +
            '<option value="">Select Event (or leave blank)</option>';
        
        events.forEach(function(e) {
            html += '<option value="' + e.id + '">' + e.title + ' (' + e.date + ')</option>';
        });
        html += '</select></div>' +
            '<button class="btn btn-primary" id="create-qr-btn" style="width:100%;">Generate & Download QR</button></div>';
        
        html += '<h3 style="margin:24px 0 16px;">Generated QR Codes</h3>';
        
        if (qrCodesList.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-qrcode"></i></div><h3 class="empty-title">No QR Codes Generated</h3><p class="empty-text">Click "Generate QR Code" to create one</p></div>';
        } else {
            html += '<div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Event</th><th>Code</th><th>Date</th><th>Attendees</th><th>Actions</th></tr></thead><tbody>';
            qrCodesList.forEach(function(q) {
                var attendeeCount = q.attendees ? q.attendees.length : 0;
                var qrData = 'CSC:' + q.code + '|' + encodeURIComponent(q.eventTitle || q.name);
                var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qrData);
                html += '<tr><td>' + q.name + '</td><td>' + (q.eventTitle || '-') + '</td><td><code>' + q.code + '</code></td><td>' + q.date + '</td><td>' + attendeeCount + '</td>' +
                '<td><button class="btn btn-sm btn-warning" data-action="view-qr-code" data-id="' + q.id + '" data-url="' + encodeURIComponent(qrUrl) + '"><i class="fas fa-qrcode"></i> QR</button> ' +
                '<button class="btn btn-sm btn-info" data-action="view-qr-attendees" data-id="' + q.id + '"><i class="fas fa-users"></i> View</button> ' +
                (attendeeCount > 0 ? '<button class="btn btn-sm btn-primary" data-action="export-qr-attendance" data-id="' + q.id + '"><i class="fas fa-download"></i> Export</button>' : '') + '</td></tr>';
            });
            html += '</tbody></table></div>';
        }
        
        // QR Code View Modal
        html += '<div id="qr-view-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:350px;text-align:center;">' +
            '<div class="modal-header"><h3 id="qr-view-title">QR Code</h3><button class="modal-close" id="close-qr-view">&times;</button></div>' +
            '<div style="padding:20px;">' +
            '<img id="qr-view-image" style="width:100%;max-width:250px;border-radius:8px;margin-bottom:12px;">' +
            '<div id="qr-view-code" style="font-size:14px;font-weight:600;margin-bottom:12px;word-break:break-all;"></div>' +
            '<button class="btn btn-primary" id="download-qr-btn"><i class="fas fa-download"></i> Download QR</button></div></div></div>';
        
        // QR Attendees Modal
        html += '<div id="qr-attendees-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;max-height:80vh;overflow:auto;">' +
            '<div class="modal-header"><h3 id="qr-attendees-title">Attendance</h3><button class="modal-close" id="close-qr-attendees-modal">&times;</button></div>' +
            '<div style="padding:16px;"><div id="qr-attendees-count" style="margin-bottom:12px;font-weight:600;"></div>' +
            '<button class="btn btn-primary" id="export-qr-attendees-btn" style="margin-bottom:12px;"><i class="fas fa-download"></i> Export to Excel</button>' +
            '<div id="qr-attendees-list" style="max-height:300px;overflow-y:auto;"></div></div></div></div>';
        
        return html;
    },

    renderAdminStudents: function() {
        var searchQuery = this.currentFilter.studentSearch || '';
        var course = this.currentFilter.studentCourse || '';
        var section = this.currentFilter.studentSection || '';
        var batch = this.currentFilter.studentBatch || '';
        
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status !== 'pending'; });
        var self = this;
        
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            students = students.filter(function(s) {
                return (s.name && s.name.toLowerCase().includes(searchQuery)) ||
                       (s.studentId && s.studentId.toLowerCase().includes(searchQuery)) ||
                       (s.email && s.email.toLowerCase().includes(searchQuery));
            });
        }
        if (course) {
            students = students.filter(function(s) { return s.course === course; });
        }
        if (section) {
            students = students.filter(function(s) { return s.section === section; });
        }
        if (batch) {
            students = students.filter(function(s) { return s.batch === batch; });
        }
        
        var html = '<div class="content-actions" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px;">' +
            '<input type="text" class="form-input" id="student-search" placeholder="Search by name..." style="width:280px;">' +
            '<select class="form-input" id="student-course" style="width:180px;">' +
            '<option value="">All Courses</option>' +
            '<option value="BS Computer Science">BS Computer Science</option>' +
            '<option value="BS Information Technology">BS Information Technology</option>' +
            '<option value="BS Information Systems">BS Information Systems</option>' +
            '<option value="BS Computer Engineering">BS Computer Engineering</option>' +
            '</select>' +
            '<select class="form-input" id="student-section" style="width:120px;">' +
            '<option value="">All Sections</option>' +
            '<option value="A">Section A</option>' +
            '<option value="B">Section B</option>' +
            '<option value="C">Section C</option>' +
            '<option value="D">Section D</option>' +
            '</select>' +
            '<select class="form-input" id="student-batch" style="width:150px;">' +
            '<option value="">All Batches</option>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option>' +
            '</select>' +
            '<button class="btn btn-secondary" id="end-semester-btn" style="margin-left:auto;"><i class="fas fa-graduation-cap"></i> End Semester</button></div>' +
            '<div class="table-container"><table class="table"><thead><tr><th style="width:60px;">Photo</th><th>Name</th><th>Student ID</th><th>Course</th><th>Section</th><th>Batch</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        
        if (students.length === 0) {
            var noMsg = searchQuery || course || section || batch ? 'No students match your search/filters' : 'No active students';
            html += '<tr><td colspan="9" style="text-align:center;">' + noMsg + '</td></tr>';
        } else {
            students.forEach(function(s) {
                var profilePicHtml = s.profilePic ? 
                    '<img src="' + s.profilePic + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;cursor:pointer;" onclick="App.viewImage(\'' + s.profilePic + '\')" title="Click to view">' :
                    '<div class="profile-avatar" style="width:40px;height:40px;font-size:14px;">' + (s.name ? s.name.charAt(0) : '?') + '</div>';
                
                html += '<tr>' +
                    '<td>' + profilePicHtml + '</td>' +
                    '<td>' + s.name + '</td>' +
                    '<td>' + s.studentId + '</td>' +
                    '<td>' + (s.course || 'N/A') + '</td>' +
                    '<td>' + (s.section || 'N/A') + '</td>' +
                    '<td>' + (s.batch || 'N/A') + '</td>' +
                    '<td>' + s.email + '</td>' +
                    '<td>' + (s.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>') + '</td>' +
                    '<td><button class="btn btn-' + (s.active ? 'warning' : 'success') + ' btn-sm" data-action="toggle-student" data-id="' + s.id + '">' + (s.active ? 'Deactivate' : 'Activate') + '</button> ' +
                    '<button class="btn btn-danger btn-sm" data-action="delete-student" data-id="' + s.id + '">Delete</button></td></tr>';
            });
        }
        html += '</tbody></table></div>';
        
        html += '<div id="end-semester-modal" class="modal" style="display:none;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>End Semester</h3><button class="modal-close" id="close-end-semester-modal">&times;</button></div>' +
            '<div style="padding:16px;">' +
            '<p style="margin-bottom:16px;">This will deactivate all currently active students. They will need to reactivate their accounts by re-submitting their ID.</p>' +
            '<div class="form-group"><label class="form-label">New Batch Year</label>' +
            '<select class="form-input" id="new-batch-year">' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '</select></div>' +
            '<button class="btn btn-danger btn-block" id="confirm-end-semester">Deactivate All Students</button></div></div></div>';
        
        return html;
    },

    renderAdminStudentsFiltered: function(searchQuery, course, section, batch) {
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status !== 'pending'; });
        var self = this;
        
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            students = students.filter(function(s) {
                return (s.name && s.name.toLowerCase().includes(searchQuery));
            });
        }
        if (course) {
            students = students.filter(function(s) { return s.course === course; });
        }
        if (section) {
            students = students.filter(function(s) { return s.section === section; });
        }
        if (batch) {
            students = students.filter(function(s) { return s.batch === batch; });
        }
        
        var html = '<div class="table-container"><table class="table"><thead><tr><th style="width:60px;">Photo</th><th>Name</th><th>Student ID</th><th>Course</th><th>Section</th><th>Batch</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        
        if (students.length === 0) {
            html += '<tr><td colspan="9" style="text-align:center;">No students found</td></tr>';
        } else {
            students.forEach(function(s) {
                var profilePicHtml = s.profilePic ? 
                    '<img src="' + s.profilePic + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;cursor:pointer;" onclick="App.viewImage(\'' + s.profilePic + '\')" title="Click to view">' :
                    '<div class="profile-avatar" style="width:40px;height:40px;font-size:14px;">' + (s.name ? s.name.charAt(0) : '?') + '</div>';
                
                html += '<tr>' +
                    '<td>' + profilePicHtml + '</td>' +
                    '<td>' + s.name + '</td>' +
                    '<td>' + s.studentId + '</td>' +
                    '<td>' + (s.course || 'N/A') + '</td>' +
                    '<td>' + (s.section || 'N/A') + '</td>' +
                    '<td>' + (s.batch || 'N/A') + '</td>' +
                    '<td>' + s.email + '</td>' +
                    '<td>' + (s.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>') + '</td>' +
                    '<td><button class="btn btn-' + (s.active ? 'warning' : 'success') + ' btn-sm" data-action="toggle-student" data-id="' + s.id + '">' + (s.active ? 'Deactivate' : 'Activate') + '</button> ' +
                    '<button class="btn btn-danger btn-sm" data-action="delete-student" data-id="' + s.id + '">Delete</button></td></tr>';
            });
        }
        html += '</tbody></table></div>';
        
        document.querySelector('.dashboard-main .table-container').innerHTML = html;
        document.querySelector('.dashboard-main .table-container').previousElementSibling.innerHTML = 
            '<input type="text" class="form-input" id="student-search" placeholder="Search by name..." style="width:280px;" value="' + (searchQuery || '') + '">' +
            '<select class="form-input" id="student-course" style="width:180px;">' +
            '<option value="">All Courses</option>' +
            '<option value="BS Computer Science" ' + (course === 'BS Computer Science' ? 'selected' : '') + '>BS Computer Science</option>' +
            '<option value="BS Information Technology" ' + (course === 'BS Information Technology' ? 'selected' : '') + '>BS Information Technology</option>' +
            '<option value="BS Information Systems" ' + (course === 'BS Information Systems' ? 'selected' : '') + '>BS Information Systems</option>' +
            '<option value="BS Computer Engineering" ' + (course === 'BS Computer Engineering' ? 'selected' : '') + '>BS Computer Engineering</option>' +
            '</select>' +
            '<select class="form-input" id="student-section" style="width:120px;">' +
            '<option value="">All Sections</option>' +
            '<option value="A" ' + (section === 'A' ? 'selected' : '') + '>Section A</option>' +
            '<option value="B" ' + (section === 'B' ? 'selected' : '') + '>Section B</option>' +
            '<option value="C" ' + (section === 'C' ? 'selected' : '') + '>Section C</option>' +
            '<option value="D" ' + (section === 'D' ? 'selected' : '') + '>Section D</option>' +
            '</select>' +
            '<select class="form-input" id="student-batch" style="width:150px;">' +
            '<option value="">All Batches</option>' +
            '<option value="2025-2026" ' + (batch === '2025-2026' ? 'selected' : '') + '>2025-2026</option>' +
            '<option value="2024-2025" ' + (batch === '2024-2025' ? 'selected' : '') + '>2024-2025</option>' +
            '<option value="2023-2024" ' + (batch === '2023-2024' ? 'selected' : '') + '>2023-2024</option>' +
            '</select>' +
            '<button class="btn btn-secondary" id="end-semester-btn" style="margin-left:auto;"><i class="fas fa-graduation-cap"></i> End Semester</button>';
    },

    renderAdminPending: function() {
        var pendingUsers = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status === 'pending'; });
        var self = this;
        var html = '';
        
        if (pendingUsers.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-clock"></i></div>' +
                '<h3 class="empty-title">No Pending Requests</h3><p class="empty-text">All registration requests have been processed</p></div>';
        } else {
            html += '<div class="pending-requests-list">';
            pendingUsers.forEach(function(user) {
                html += '<div class="card" style="margin-bottom:16px;">' +
                    '<div class="card-header"><h3 class="card-title">' + user.name + '</h3>' +
                    '<span class="badge badge-warning">Pending</span></div>' +
                    '<div class="card-body">' +
                    '<div class="event-details">' +
                    '<div class="event-detail"><i class="fas fa-id-card"></i> Student ID: ' + user.studentId + '</div>' +
                    '<div class="event-detail"><i class="fas fa-envelope"></i> Email: ' + user.email + '</div>' +
                    '<div class="event-detail"><i class="fas fa-graduation-cap"></i> Course: ' + (user.course || 'N/A') + ' - Section ' + (user.section || 'N/A') + '</div>' +
                    '<div class="event-detail"><i class="fas fa-calendar"></i> Registered: ' + user.createdAt + '</div>' +
                    '</div>';
                
                if (user.profilePic || user.schoolIdPic) {
                    html += '<div style="margin-top:12px;">' +
                        '<button class="btn btn-secondary btn-sm toggle-images-btn" data-target="img-' + user.id + '">' +
                        '<i class="fas fa-images"></i> View Documents</button>' +
                        '<div id="img-' + user.id + '" class="image-gallery collapsed" style="display:none;margin-top:12px;">';
                    
                    if (user.profilePic) {
                        html += '<div style="margin-bottom:12px;"><label class="form-label">Profile Picture:</label>' +
                            '<div><img src="' + user.profilePic + '" style="width:120px;height:120px;border-radius:8px;object-fit:cover;border:1px solid var(--border-color);cursor:pointer;" onclick="App.viewImage(this.src)" title="Click to maximize"></div></div>';
                    }
                    if (user.schoolIdPic) {
                        html += '<div style="margin-bottom:12px;"><label class="form-label">School ID:</label>' +
                            '<div><img src="' + user.schoolIdPic + '" style="max-width:200px;max-height:150px;border-radius:8px;border:1px solid var(--border-color);cursor:pointer;" onclick="App.viewImage(this.src)" title="Click to maximize"></div></div>';
                    }
                    html += '</div></div>';
                }
                
                html += '</div><div class="card-footer">' +
                    '<button class="btn btn-success btn-sm" data-action="approve-user" data-id="' + user.id + '"><i class="fas fa-check"></i> Approve</button> ' +
                    '<button class="btn btn-danger btn-sm" data-action="deny-user" data-id="' + user.id + '"><i class="fas fa-times"></i> Deny</button></div></div>';
            });
            html += '</div>';
        }
        
        html += '<div id="image-modal" class="modal" style="display:none;z-index:200;">' +
            '<div class="modal-content" style="max-width:800px;background:transparent;border:none;">' +
            '<button class="modal-close" id="close-image-modal" style="color:white;font-size:32px;">&times;</button>' +
            '<img id="modal-image" style="max-width:100%;max-height:90vh;border-radius:8px;">' +
            '</div></div>';
        
        return html;
    },

    goToTab: function(tab) {
        if (this.currentUser.role === 'admin') {
            this.currentAdminTab = tab;
            this.renderAdminDashboard();
        } else {
            this.currentStudentTab = tab;
            this.renderStudentDashboard();
        }
    },

    viewImage: function(src) {
        var modal = document.getElementById('image-modal');
        var img = document.getElementById('modal-image');
        if (modal && img) {
            img.src = src;
            modal.style.display = 'flex';
        }
    },

    showProfileModal: function() {
        var user = this.currentUser;
        var profilePicHtml = user.profilePic ? 
            '<img src="' + user.profilePic + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;display:block;margin:0 auto;">' :
            '<div style="width:100px;height:100px;border-radius:50%;background:var(--primary-color);display:flex;align-items:center;justify-content:center;color:white;font-size:40px;margin:0 auto;">' + (user.name ? user.name.charAt(0) : '?') + '</div>';
        
        var html = '<div id="profile-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;">' +
            '<div class="modal-header"><h3>My Profile</h3><button class="modal-close" id="close-profile-modal">&times;</button></div>' +
            '<div style="padding:24px;text-align:center;">' +
            '<div style="margin-bottom:16px;display:flex;justify-content:center;">' + profilePicHtml + '</div>' +
            '<h2 style="margin-bottom:8px;">' + user.name + '</h2>' +
            '<p style="color:var(--text-light);margin-bottom:24px;">' + user.email + '</p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;text-align:left;">' +
            '<div><label style="font-size:12px;color:var(--text-light);">Student ID</label><div style="font-weight:600;">' + (user.studentId || 'N/A') + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Role</label><div style="font-weight:600;">' + user.role + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Course</label><div style="font-weight:600;">' + (user.course || 'N/A') + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Section</label><div style="font-weight:600;">' + (user.section || 'N/A') + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Batch</label><div style="font-weight:600;">' + (user.batch || 'N/A') + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Status</label><div style="font-weight:600;"><span class="badge ' + (user.active ? 'badge-success' : 'badge-secondary') + '">' + (user.active ? 'Active' : 'Inactive') + '</span></div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Account Status</label><div style="font-weight:600;"><span class="badge ' + (user.status === 'approved' ? 'badge-success' : 'badge-warning') + '">' + (user.status || 'approved') + '</span></div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Joined Date</label><div style="font-weight:600;">' + (user.joinDate || 'N/A') + '</div></div>' +
            '<div><label style="font-size:12px;color:var(--text-light);">Last Login</label><div style="font-weight:600;">' + (user.lastLogin || 'Just now') + '</div></div>' +
            '</div>' +
            '</div></div></div>';
        
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.getElementById('app').appendChild(tempDiv.firstElementChild);
        
        var closeBtn = document.getElementById('close-profile-modal');
        var modal = document.getElementById('profile-modal');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
    },

    showMessageModal: function() {
        var self = this;
        var user = this.currentUser;
        var messages = this.data.messages || [];
        var users = this.data.users || [];
        
        var userMessages = messages.filter(function(m) { return m.to === user.email || m.from === user.email; });
        
        var conversations = {};
        userMessages.forEach(function(m) {
            var otherEmail = m.from === user.email ? m.to : m.from;
            if (!conversations[otherEmail]) {
                conversations[otherEmail] = [];
            }
            conversations[otherEmail].push(m);
        });
        
        var unreadCount = userMessages.filter(function(m) { return m.to === user.email && !m.read; }).length;
        
        var html = '<div id="message-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:700px;max-height:80vh;overflow:hidden;display:flex;flex-direction:column;">' +
            '<div class="modal-header"><h3>Messages' + (unreadCount > 0 ? ' <span class="badge badge-danger">' + unreadCount + '</span>' : '') + '</h3><button class="modal-close" id="close-message-modal">&times;</button></div>' +
            '<div style="display:flex;flex:1;overflow:hidden;border-bottom:1px solid var(--border-color);">' +
            '<div style="width:200px;border-right:1px solid var(--border-color);overflow-y:auto;padding:8px;background:var(--bg-color);">' +
            '<input type="text" class="form-input" id="message-search" placeholder="Search..." style="width:100%;margin-bottom:8px;font-size:13px;">' +
            '<div id="conversation-list">';
        
        Object.keys(conversations).forEach(function(email) {
            var otherUser = users.find(function(u) { return u.email === email; });
            var convMessages = conversations[email];
            var lastMsg = convMessages.sort(function(a, b) { return new Date(b.date) - new Date(a.date); })[0];
            var unread = convMessages.filter(function(m) { return m.to === user.email && !m.read; }).length;
            var name = otherUser ? otherUser.name : email;
            html += '<div class="conversation-item" data-email="' + email + '" style="padding:10px;border-radius:6px;cursor:pointer;margin-bottom:4px;background:white;border:1px solid var(--border-color);' + (unread ? 'border-left:3px solid var(--primary-color);' : '') + '">' +
                '<div style="font-weight:600;font-size:13px;">' + name + '</div>' +
                '<div style="font-size:11px;color:var(--text-light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (lastMsg.content || '').substring(0, 25) + '...</div>' +
                (unread ? '<span class="badge badge-primary" style="margin-top:4px;font-size:10px;">' + unread + ' new</span>' : '') +
                '</div>';
        });
        
        html += '</div></div>' +
            '<div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">' +
            '<div id="conversation-header" style="padding:12px;border-bottom:1px solid var(--border-color);font-weight:600;display:none;">Select a conversation</div>' +
            '<div id="conversation-messages" style="flex:1;overflow-y:auto;padding:12px;"></div>' +
            '<div id="reply-section" style="padding:12px;border-top:1px solid var(--border-color);display:none;">' +
            '<form id="new-message-form" style="display:flex;gap:8px;">' +
            '<input type="hidden" id="message-to">' +
            '<textarea class="form-input" id="message-content" rows="2" placeholder="Type your message..." required style="flex:1;font-size:14px;resize:none;"></textarea>' +
            '<button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane"></i></button>' +
            '</form></div>' +
            '</div></div></div>';
        
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.getElementById('app').appendChild(tempDiv.firstElementChild);
        
        document.getElementById('close-message-modal').addEventListener('click', function() {
            document.getElementById('message-modal').remove();
        });
        
        document.getElementById('message-search').addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var convItems = document.querySelectorAll('.conversation-item');
            Array.prototype.forEach.call(convItems, function(item) {
                var name = item.querySelector('div').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
        
        var convItems = document.querySelectorAll('.conversation-item');
        Array.prototype.forEach.call(convItems, function(item) {
            item.addEventListener('click', function() {
                var email = item.dataset.email;
                var otherUser = users.find(function(u) { return u.email === email; });
                var convMessages = conversations[email] || [];
                
                document.getElementById('conversation-header').textContent = otherUser ? otherUser.name : email;
                document.getElementById('conversation-header').style.display = 'block';
                document.getElementById('reply-section').style.display = 'flex';
                document.getElementById('message-to').value = email;
                
                var msgsHtml = '';
                convMessages.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
                convMessages.forEach(function(m) {
                    var isMe = m.from === user.email;
                    msgsHtml += '<div style="background:var(--bg-color);padding:10px;border-radius:8px;margin-bottom:8px;margin-left:' + (isMe ? '60px' : '0') + ';margin-right:' + (isMe ? '0' : '60px') + ';">' +
                        '<div style="font-size:12px;font-weight:600;">' + (isMe ? 'You' : (otherUser ? otherUser.name : m.from)) + '</div>' +
                        '<div style="font-size:14px;">' + m.content + '</div>' +
                        '<div style="font-size:10px;color:var(--text-light);margin-top:2px;">' + new Date(m.date).toLocaleString() + '</div>' +
                        '</div>';
                });
                document.getElementById('conversation-messages').innerHTML = msgsHtml || '<p style="text-align:center;color:var(--text-light);">No messages yet</p>';
                
                convMessages.forEach(function(m) {
                    if (m.to === user.email && !m.read) {
                        m.read = true;
                    }
                });
                self.saveData();
            });
        });
        
        var newMsgForm = document.getElementById('new-message-form');
        if (newMsgForm) {
            newMsgForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var to = document.getElementById('message-to').value;
                var content = document.getElementById('message-content').value;
                
                if (to && content) {
                    self.data.messages.push({
                        id: Date.now(),
                        from: user.email,
                        to: to,
                        content: content,
                        date: new Date().toISOString(),
                        read: false
                    });
                    self.saveData();
                    self.showMessageModal();
                }
            });
        }
        
        self.saveData();
    },

    renderAdminFiles: function() {
        var self = this;
        this.filesTab = this.filesTab || 'files';
        
        var html = '<div style="display:flex;gap:8px;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:8px;">' +
            '<button class="btn ' + (this.filesTab === 'files' ? 'btn-primary' : 'btn-secondary') + '" id="tab-files"><i class="fas fa-folder"></i> Files</button>' +
            '<button class="btn ' + (this.filesTab === 'media' ? 'btn-primary' : 'btn-secondary') + '" id="tab-media"><i class="fas fa-image"></i> Media</button></div>';
        
        if (this.filesTab === 'files') {
            html += '<div class="content-actions"><button class="btn btn-primary" id="create-file-btn"><i class="fas fa-plus"></i> Upload File</button></div>';
            
            if ((this.data.files || []).length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-folder"></i></div><h3 class="empty-title">No files</h3></div>';
            } else {
                html += '<div>';
                for (var i = 0; i < (this.data.files || []).length; i++) {
                    var f = this.data.files[i];
                    var icon = f.type === 'pdf' ? 'fa-file-pdf' : 'fa-file-alt';
                    html += '<div class="file-item">' +
                        '<div class="file-icon"><i class="fas ' + icon + '"></i></div>' +
                        '<div class="file-info"><div class="file-name">' + f.name + '</div><div class="file-size">' + f.size + ' | ' + f.category + '</div></div>' +
                        '<button class="btn btn-danger btn-sm" data-action="delete-file" data-id="' + f.id + '">Delete</button></div>';
                }
                html += '</div>';
            }
            
            html += self.renderCreateFileModal();
        } else {
            html += '<div class="content-actions"><button class="btn btn-primary" id="upload-media-btn"><i class="fas fa-plus"></i> Upload Media</button></div>';
            
            var media = this.data.mediaContent || [];
            if (media.length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-image"></i></div><h3 class="empty-title">No media uploaded</h3></div>';
            } else {
                html += '<div class="cards-grid">';
                media.forEach(function(m) {
                    html += '<div class="card">' +
                        '<div class="card-body" style="text-align:center;">' +
                        (m.type === 'image' ? '<img src="' + m.url + '" style="width:100%;height:150px;object-fit:cover;border-radius:8px;">' : 
                            '<div style="height:150px;background:#333;display:flex;align-items:center;justify-content:center;color:white;font-size:32px;"><i class="fas fa-play-circle"></i></div>') +
                        '<p class="text-sm mt-4">' + m.title + '</p>' +
                        '<button class="btn btn-danger btn-sm" data-action="delete-media" data-id="' + m.id + '">Delete</button></div></div>';
                });
                html += '</div>';
            }
        }
        
        html += '<div id="media-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;margin:auto;">' +
            '<div class="modal-header"><h3>Upload Media for Sidebar</h3><button class="modal-close" id="close-media-modal">&times;</button></div>' +
            '<form id="media-form">' +
            '<div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="media-title" required></div>' +
            '<div class="form-group"><label class="form-label">Media Type *</label>' +
            '<select class="form-input" id="media-type" required>' +
            '<option value="">Select Type</option>' +
            '<option value="image">Image</option>' +
            '<option value="video">Video</option>' +
            '</select></div>' +
            '<div class="form-group"><label class="form-label">Media File *</label>' +
            '<div class="file-upload-wrapper" id="media-file-upload">' +
            '<div class="file-upload-icon"><i class="fas fa-image"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Image or Video</span></div>' +
            '<div class="file-preview" id="media-file-preview"></div></div>' +
            '<input type="file" id="media-file-input" accept="image/*,video/*" style="display:none;"></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Upload Media</button></div>' +
            '</form></div></div>';
        
        return html;
    },

    renderAdminReports: function() {
        var self = this;
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="upload-report-btn"><i class="fas fa-upload"></i> Upload Report</button></div>';
        
        var reports = this.data.reportFiles || [];
        
        if (reports.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-file-pdf"></i></div><h3 class="empty-title">No reports uploaded</h3><p class="empty-text">Upload PDF reports for students to download</p></div>';
        } else {
            html += '<div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Category</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
            reports.forEach(function(r) {
                html += '<tr><td><i class="fas fa-file-pdf" style="color:#ef4444;margin-right:8px;"></i>' + r.name + '</td><td>' + r.category + '</td><td>' + r.date + '</td>' +
                    '<td><button class="btn btn-danger btn-sm" data-action="delete-report" data-id="' + r.id + '">Delete</button></td></tr>';
            });
            html += '</tbody></table></div>';
        }
        
        html += '<div id="report-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3>Upload Report</h3><button class="modal-close" id="close-report-modal">&times;</button></div>' +
                '<form id="report-form">' +
                '<div class="form-group"><label class="form-label">Report Name *</label><input type="text" class="form-input" id="report-name" required></div>' +
                '<div class="form-group"><label class="form-label">Category *</label>' +
                '<select class="form-input" id="report-category" required><option value="">Select Category</option>' +
                '<option value="Annual">Annual Report</option><option value="Financial">Financial Report</option><option value="Activity">Activity Report</option>' +
                '<option value="Meeting">Meeting Minutes</option><option value="Other">Other</option></select></div>' +
                '<div class="form-group"><label class="form-label">File *</label><input type="file" class="form-input" id="report-file" accept=".pdf" required></div>' +
                '<div class="modal-actions"><button type="submit" class="btn btn-primary">Upload</button></div>' +
                '</form></div></div>';
        
        return html;
    },

    renderAdminFinance: function() {
        var self = this;
        var finance = this.data.finance || { currentFunds: 0, transactions: [] };
        
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="add-transaction-btn"><i class="fas fa-plus"></i> Add Transaction</button>' +
            '<button class="btn btn-secondary" id="set-funds-btn"><i class="fas fa-coins"></i> Set Current Funds</button>' +
            '<button class="btn btn-danger" id="reset-finance-btn" style="margin-left:auto;"><i class="fas fa-redo"></i> Reset Finance</button></div>' +
            '<div id="funds-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>Set Current Funds</h3><button class="modal-close" id="close-funds-modal">&times;</button></div>' +
            '<form id="funds-form">' +
            '<div class="form-group"><label class="form-label">Current Funds Amount ($)</label><input type="number" class="form-input" id="funds-amount" min="0" step="0.01" required></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Update Funds</button></div>' +
            '</form></div></div>';
        
        var totalExpenses = finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var totalFundsRaised = finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        html += '<div class="stats-grid" style="margin-bottom:20px;">' +
            '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">$' + finance.currentFunds.toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">$' + totalExpenses.toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">$' + totalFundsRaised.toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
        '</div>';
        
        if (finance.transactions.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-receipt"></i></div><h3 class="empty-title">No transactions</h3><p class="empty-text">Add expenses or funds raised</p></div>';
        } else {
            html += '<div class="table-container"><table class="table"><thead><tr><th>Date</th><th>Type</th><th>Event</th><th>Amount</th><th>Description</th><th>Actions</th></tr></thead><tbody>';
            finance.transactions.forEach(function(t) {
                var typeBadge = t.type === 'expense' ? 'badge-danger' : 'badge-primary';
                var typeLabel = t.type === 'expense' ? 'Expense' : 'Funds Raised';
                html += '<tr>' +
                    '<td>' + t.date + '</td>' +
                    '<td><span class="badge ' + typeBadge + '">' + typeLabel + '</span></td>' +
                    '<td>' + (t.eventTitle || '-') + '</td>' +
                    '<td>$' + t.amount.toLocaleString() + '</td>' +
                    '<td>' + t.description + '</td>' +
                    '<td style="white-space:nowrap;">' +
                    '<button class="btn btn-secondary btn-sm" data-action="edit-transaction" data-id="' + t.id + '">Edit</button> ' +
                    '<button class="btn btn-danger btn-sm" data-action="delete-transaction" data-id="' + t.id + '">Delete</button>' +
                    '</td></tr>';
            });
            html += '</tbody></table></div>';
        }
        
        html += '<div id="finance-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3>Add Transaction</h3><button class="modal-close" id="close-finance-modal">&times;</button></div>' +
                '<form id="finance-form">' +
                '<div class="form-group"><label class="form-label">Type *</label>' +
                '<select class="form-input" id="finance-type" required><option value="">Select Type</option>' +
                '<option value="expense">Expense</option>' +
                '<option value="funds_raised">Funds Raised</option></select></div>' +
                '<div class="form-group"><label class="form-label">Related Event</label>' +
                '<select class="form-input" id="finance-event"><option value="">No Event</option>';
        self.data.events.forEach(function(e) {
            html += '<option value="' + e.id + '">' + e.title + '</option>';
        });
        html += '</select></div>' +
                '<div class="form-group"><label class="form-label">Amount *</label><input type="number" class="form-input" id="finance-amount" min="0" required></div>' +
                '<div class="form-group"><label class="form-label">Description *</label><input type="text" class="form-input" id="finance-description" required></div>' +
                '<div class="modal-actions"><button type="submit" class="btn btn-primary">Add Transaction</button></div>' +
                '</form></div></div>';
        
        return html;
    },
    
    renderCreateFileModal: function() {
        return '<div id="file-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
                '<div class="modal-header"><h3>Upload File</h3><button class="modal-close" id="close-file-modal">&times;</button></div>' +
                '<form id="file-form">' +
                '<div class="form-group"><label class="form-label">Select File *</label><input type="file" class="form-input" id="file-input" required></div>' +
                '<div class="form-group"><label class="form-label">Category *</label>' +
                '<select class="form-input" id="file-category" required><option value="">Select Category</option>' +
                '<option value="Reports">Reports</option><option value="Academic">Academic</option><option value="Budgets">Budgets</option>' +
                '<option value="Policies">Policies</option><option value="Other">Other</option></select></div>' +
                '<div class="modal-actions"><button type="submit" class="btn btn-primary">Upload</button></div>' +
                '</form></div></div>';
    },

    renderAdminPolls: function() {
        var self = this;
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="create-poll-btn"><i class="fas fa-link"></i> Add Poll Link</button></div>';
        
        if ((this.data.polls || []).length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-poll"></i></div><h3 class="empty-title">No polls</h3><p class="empty-text">Add a Google Form or poll link for students</p></div>';
        } else {
            html += '<div class="cards-grid">';
            for (var i = 0; i < this.data.polls.length; i++) {
                var p = this.data.polls[i];
                html += '<div class="card">' +
                    '<div class="card-header"><h3 class="card-title">' + p.question + '</h3>' +
                    '<span class="badge ' + (p.active ? 'badge-success' : 'badge-secondary') + '">' + (p.active ? 'Active' : 'Closed') + '</span></div>' +
                    '<div class="card-body">';
                
                if (p.link) {
                    html += '<p class="text-sm" style="margin-bottom:12px;"><i class="fas fa-link"></i> <a href="' + p.link + '" target="_blank">Open Poll Link</a></p>';
                }
                
                html += '<p class="text-sm text-muted">Created: ' + p.date + '</p></div>' +
                    '<div class="card-footer">' +
                    '<button class="btn btn-' + (p.active ? 'warning' : 'success') + ' btn-sm" data-action="toggle-poll" data-id="' + p.id + '">' + (p.active ? 'Close' : 'Open') + '</button>' +
                    '<button class="btn btn-danger btn-sm" data-action="delete-poll" data-id="' + p.id + '">Delete</button></div></div>';
            }
            html += '</div>';
        }
        
        html += '<div id="poll-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;margin:auto;">' +
            '<div class="modal-header"><h3>Add Poll</h3><button class="modal-close" id="close-poll-modal">&times;</button></div>' +
            '<form id="poll-form">' +
            '<div class="form-group"><label class="form-label">Poll Title *</label><input type="text" class="form-input" id="poll-question" placeholder="e.g., Semester Evaluation" required></div>' +
            '<div class="form-group"><label class="form-label">Poll Type</label>' +
            '<select class="form-input" id="poll-type">' +
            '<option value="link">External Link (Google Form, etc.)</option>' +
            '<option value="manual">Manual Poll (with options)</option>' +
            '</select></div>' +
            '<div class="form-group" id="poll-link-group"><label class="form-label">Poll Link *</label><input type="url" class="form-input" id="poll-link" placeholder="https://docs.google.com/forms/..."></div>' +
            '<div class="form-group" id="poll-options-group" style="display:none;"><label class="form-label">Options (comma separated) *</label><input type="text" class="form-input" id="poll-options" placeholder="Option 1, Option 2, Option 3"></div>' +
            '<div class="form-group"><label class="form-label">Deadline</label><input type="date" class="form-input" id="poll-deadline" value="2026-12-31"></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="poll-active" checked><span>Active</span></label></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Add Poll</button></div>' +
            '</form></div></div>';
        
        return html;
    },

    renderAdminSuggestions: function() {
        var self = this;
        var suggestions = (this.data.suggestions || []).slice().sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        
        if (suggestions.length === 0) return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-lightbulb"></i></div><h3 class="empty-title">No suggestions</h3></div>';
        
        var html = '<div class="suggestion-list">';
        suggestions.forEach(function(s) {
            html += '<div class="suggestion-item">' +
                '<div class="suggestion-header"><span class="suggestion-author">' + s.author + '</span><span class="suggestion-date">' + s.date + '</span></div>' +
                '<span class="badge badge-' + (s.status === 'resolved' ? 'success' : s.status === 'inreview' ? 'warning' : 'secondary') + '">' + s.status + '</span>' +
                '<p class="suggestion-content">' + s.content + '</p>' +
                '<p class="text-sm"><i class="fas fa-arrow-up"></i> ' + (s.upvotes || 0) + ' upvotes</p>' +
                (s.replies && s.replies.length ? '<div class="suggestion-replies"><div class="reply-item"><strong>Admin:</strong> ' + s.replies[s.replies.length-1].content + '</div></div>' : '') +
                '<div class="mt-4"><input type="text" class="form-input" id="reply-' + s.id + '" placeholder="Write reply..."> ' +
                '<select class="form-input" id="status-' + s.id + '" style="width:auto;margin-top:8px;"><option value="pending">Pending</option><option value="inreview">In Review</option><option value="resolved">Resolved</option></select>' +
                '<button class="btn btn-primary btn-sm mt-4" data-action="reply-suggestion" data-id="' + s.id + '">Reply</button></div></div>';
        });
        html += '</div>';
        return html;
    },

    renderAdminComplaints: function() {
        var self = this;
        var complaints = (this.data.complaints || []).slice().sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        
        var searchQuery = this.currentFilter.complaintSearch || '';
        var statusFilter = this.currentFilter.complaintStatus || '';
        
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            complaints = complaints.filter(function(c) {
                return (c.author && c.author.toLowerCase().includes(searchQuery)) ||
                       (c.content && c.content.toLowerCase().includes(searchQuery));
            });
        }
        if (statusFilter) {
            complaints = complaints.filter(function(c) { return c.status === statusFilter; });
        }
        
        var pendingCount = (this.data.complaints || []).filter(function(c) { return c.status === 'pending'; }).length;
        var inReviewCount = complaints.filter(function(c) { return c.status === 'inreview'; }).length;
        var resolvedCount = complaints.filter(function(c) { return c.status === 'resolved'; }).length;
        
        var html = '<div style="margin-bottom:20px;">' +
            '<div class="stats-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));">' +
            '<div class="stat-card" onclick="App.filterComplaints(\'pending\')" style="cursor:pointer;"><div class="stat-icon" style="background:#fef3c7;color:#f59e0b;"><i class="fas fa-clock"></i></div><div class="stat-info"><div class="stat-value">' + pendingCount + '</div><div class="stat-label">Pending</div></div></div>' +
            '<div class="stat-card" onclick="App.filterComplaints(\'inreview\')" style="cursor:pointer;"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-search"></i></div><div class="stat-info"><div class="stat-value">' + inReviewCount + '</div><div class="stat-label">In Review</div></div></div>' +
            '<div class="stat-card" onclick="App.filterComplaints(\'resolved\')" style="cursor:pointer;"><div class="stat-icon" style="background:#dcfce7;color:#10b981;"><i class="fas fa-check-circle"></i></div><div class="stat-info"><div class="stat-value">' + resolvedCount + '</div><div class="stat-label">Resolved</div></div></div>' +
            '</div></div>' +
            '<div class="content-actions">' +
            '<input type="text" class="form-input" id="complaint-search" placeholder="Search complaints..." style="width:250px;">' +
            '<select class="form-input" id="complaint-status-filter" style="width:150px;">' +
            '<option value="">All Status</option>' +
            '<option value="pending">Pending</option>' +
            '<option value="inreview">In Review</option>' +
            '<option value="resolved">Resolved</option>' +
            '</select></div>';
        
        if (complaints.length === 0) {
            var noResultsMsg = searchQuery || statusFilter ? 'No complaints match your search' : 'No complaints';
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-exclamation-triangle"></i></div><h3 class="empty-title">' + noResultsMsg + '</h3></div>';
        } else {
            html += '<div class="suggestion-list">';
            complaints.forEach(function(c) {
                var statusBadge = c.status === 'resolved' ? 'success' : c.status === 'inreview' ? 'info' : 'warning';
                html += '<div class="suggestion-item" style="border-left:4px solid ' + (c.status === 'resolved' ? '#10b981' : c.status === 'inreview' ? '#2563eb' : '#f59e0b') + ';">' +
                    '<div class="suggestion-header"><span class="suggestion-author"><i class="fas fa-user"></i> ' + c.author + '</span><span class="suggestion-date">' + c.date + '</span></div>' +
                    '<span class="badge badge-' + statusBadge + '">' + (c.status === 'inreview' ? 'In Review' : c.status) + '</span>' +
                    '<p class="suggestion-content">' + c.content.substring(0, 150) + (c.content.length > 150 ? '...' : '') + '</p>' +
                    (c.attachment ? '<div style="margin-top:8px;"><strong>Attachment:</strong> <a href="' + c.attachment + '" download="' + (c.attachmentName || 'attachment') + '" style="color:var(--primary-color);"><i class="fas fa-paperclip"></i> ' + (c.attachmentName || 'Download') + '</a></div>' : '') +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">' +
                    '<button class="btn btn-primary btn-sm" data-action="view-complaint" data-id="' + c.id + '"><i class="fas fa-eye"></i> View Details</button> ' +
                    '<button class="btn btn-secondary btn-sm" data-action="chat-complaint" data-id="' + c.id + '"><i class="fas fa-comments"></i> Chat</button> ' +
                    '<select class="form-input" id="cstatus-' + c.id + '" data-action="change-complaint-status" data-id="' + c.id + '" style="width:auto;">' +
                    '<option value="pending"' + (c.status === 'pending' ? ' selected' : '') + '>Pending</option>' +
                    '<option value="inreview"' + (c.status === 'inreview' ? ' selected' : '') + '>In Review</option>' +
                    '<option value="resolved"' + (c.status === 'resolved' ? ' selected' : '') + '>Resolved</option>' +
                    '</select></div>' +
                    '</div>';
            });
            html += '</div>';
        }
        
        html += '<div id="complaint-detail-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:600px;">' +
            '<div class="modal-header"><h3>Complaint Details</h3><button class="modal-close" id="close-complaint-detail-modal">&times;</button></div>' +
            '<div id="complaint-detail-content" style="padding:20px;"></div></div></div>' +
            '<div id="complaint-chat-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;max-height:80vh;">' +
            '<div class="modal-header"><h3>Chat with Complainant</h3><button class="modal-close" id="close-complaint-chat-modal">&times;</button></div>' +
            '<div id="complaint-chat-content" style="padding:20px;max-height:400px;overflow-y:auto;"></div>' +
            '<div style="padding:20px;border-top:1px solid var(--border-color);">' +
            '<div class="form-group"><textarea class="form-input" id="chat-message" placeholder="Type your message..." rows="2"></textarea></div>' +
            '<div style="display:flex;gap:8px;"><input type="file" id="chat-file" accept="image/*,.pdf,.doc,.docx" style="flex:1;">' +
            '<button class="btn btn-primary" id="send-chat-btn">Send</button></div>' +
            '</div></div></div>';
        
        return html;
    },

    renderAdminAnalytics: function() {
        var self = this;
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student'; });
        var events = this.data.events || [];
        var announcements = this.data.announcements || [];
        var suggestions = this.data.suggestions || [];
        var complaints = this.data.complaints || [];
        var finance = this.data.finance || { currentFunds: 0, transactions: [] };
        
        var totalStudents = students.length;
        var activeStudents = students.filter(function(s) { return s.active; }).length;
        var pendingApproval = students.filter(function(s) { return s.status === 'pending'; }).length;
        
        var totalEvents = events.length;
        var upcomingEvents = events.filter(function(e) { return e.status === 'upcoming'; }).length;
        var finishedEvents = events.filter(function(e) { return e.status === 'finished'; }).length;
        var cancelledEvents = events.filter(function(e) { return e.status === 'cancelled'; }).length;
        
        var totalAttendees = events.reduce(function(sum, e) { return sum + (e.attendees ? e.attendees.length : 0); }, 0);
        var totalEvaluations = events.reduce(function(sum, e) { return sum + (e.evaluations ? e.evaluations.length : 0); }, 0);
        var eventsWithEvals = events.filter(function(e) { return e.evaluationEnabled; }).length;
        
        var totalAnnouncements = announcements.length;
        var pinnedAnnouncements = announcements.filter(function(a) { return a.pinned; }).length;
        
        var totalSuggestions = suggestions.length;
        var resolvedSuggestions = suggestions.filter(function(s) { return s.status === 'resolved'; }).length;
        var pendingSuggestions = suggestions.filter(function(s) { return s.status === 'pending'; }).length;
        
        var totalComplaints = complaints.length;
        var resolvedComplaints = complaints.filter(function(c) { return c.status === 'resolved'; }).length;
        var pendingComplaints = complaints.filter(function(c) { return c.status === 'pending'; }).length;
        
        var studentActivePct = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;
        var eventCompletePct = totalEvents > 0 ? Math.round((finishedEvents / totalEvents) * 100) : 0;
        var suggestionResolvePct = totalSuggestions > 0 ? Math.round((resolvedSuggestions / totalSuggestions) * 100) : 0;
        var complaintResolvePct = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
        
        var otherEvents = totalEvents - upcomingEvents - finishedEvents - cancelledEvents;
        var otherSuggestions = totalSuggestions - pendingSuggestions - resolvedSuggestions;
        var otherComplaints = totalComplaints - pendingComplaints - resolvedComplaints;
        
        function barChart(label, color, currentVal, totalVal) {
            var pct = totalVal > 0 ? Math.round((currentVal / totalVal) * 100) : 0;
            return '<div style="margin-bottom:20px;">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;">' +
                '<span style="font-weight:600;">' + label + '</span>' +
                '<span style="color:var(--text-light);">' + currentVal + ' / ' + totalVal + ' (' + pct + '%)</span></div>' +
                '<div style="background:var(--bg-color);border-radius:8px;height:12px;overflow:hidden;">' +
                '<div style="width:' + pct + '%;background:' + color + ';height:100%;border-radius:8px;transition:width 0.5s;"></div></div></div>';
        }
        
        function statCard(icon, value, label, color) {
            return '<div style="background:var(--bg-white);border-radius:var(--radius-md);padding:16px;border:1px solid var(--border-color);display:flex;align-items:center;gap:12px;flex:1;min-width:140px;overflow:hidden;">' +
                '<div style="width:44px;height:44px;min-width:44px;background:' + color + ';border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;"><i class="' + icon + '"></i></div>' +
                '<div><div style="font-size:22px;font-weight:700;">' + value + '</div><div style="font-size:12px;color:var(--text-light);">' + label + '</div></div></div>';
        }
        
        function statusBlock(title, items) {
            var html = '<div style="background:var(--bg-white);border-radius:var(--radius-md);padding:16px;border:1px solid var(--border-color);margin-bottom:16px;min-width:0;">' +
                '<div style="font-weight:600;margin-bottom:12px;">' + title + '</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
            for (var i = 0; i < items.length; i++) {
                html += '<span class="badge ' + items[i].class + '">' + items[i].count + ' ' + items[i].label + '</span>';
            }
            html += '</div></div>';
            return html;
        }
        
        var html = '<style>@media(max-width:900px){.analytics-stats{grid-template-columns:1fr 1fr!important}.analytics-grid{grid-template-columns:1fr!important}}@media(max-width:600px){.analytics-stats{grid-template-columns:1fr!important}}</style>' +
            '<div class="analytics-stats" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;min-width:0;">' +
            statCard('fa-users', totalStudents, 'Total Students', '#3b82f6') +
            statCard('fa-user-check', activeStudents, 'Active', '#10b981') +
            statCard('fa-clock', pendingApproval, 'Pending', '#f59e0b') +
            statCard('fa-calendar-check', finishedEvents, 'Events Done', '#8b5cf6') +
            '</div>' +
            
            '<div class="analytics-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;min-width:0;">' +
            '<div style="min-width:0;">' +
            '<h3 style="margin-bottom:16px;font-size:16px;font-weight:600;">Overview Statistics</h3>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);padding:20px;border:1px solid var(--border-color);">' +
            barChart('Active Students', '#2563eb', activeStudents, totalStudents) +
            barChart('Events Completed', '#4f46e5', finishedEvents, totalEvents) +
            barChart('Suggestions Resolved', '#16a34a', resolvedSuggestions, totalSuggestions) +
            barChart('Complaints Resolved', '#dc2626', resolvedComplaints, totalComplaints) +
            '</div>' +
            
            '<div style="margin-top:24px;background:var(--bg-white);border-radius:var(--radius-md);padding:20px;border:1px solid var(--border-color);">' +
            '<div style="font-size:16px;font-weight:600;margin-bottom:16px;">Financial Summary</div>' +
            '<div style="display:flex;gap:32px;flex-wrap:wrap;">' +
            '<div><div style="font-size:28px;font-weight:700;color:#10b981;">$' + finance.currentFunds.toLocaleString() + '</div><div style="font-size:13px;color:var(--text-light);">Current Funds</div></div>' +
            '<div><div style="font-size:28px;font-weight:700;color:#2563eb;">' + totalAnnouncements + '</div><div style="font-size:13px;color:var(--text-light);">Announcements</div></div>' +
            '<div><div style="font-size:28px;font-weight:700;color:#f59e0b;">' + pinnedAnnouncements + '</div><div style="font-size:13px;color:var(--text-light);">Pinned</div></div>' +
            '</div></div>' +
            '</div>' +
            
            '<div style="min-width:0;">' +
            '<h3 style="margin-bottom:16px;font-size:16px;font-weight:600;">Activity Breakdown</h3>' +
            statusBlock('Events by Status', [
                { count: upcomingEvents, label: 'Upcoming', class: 'badge-primary' },
                { count: finishedEvents, label: 'Finished', class: 'badge-success' },
                { count: cancelledEvents, label: 'Cancelled', class: 'badge-danger' },
                { count: otherEvents, label: 'Other', class: 'badge-secondary' }
            ]) +
            statusBlock('Event Evaluations', [
                { count: totalAttendees, label: 'Attendances', class: 'badge-primary' },
                { count: totalEvaluations, label: 'Evaluated', class: 'badge-success' },
                { count: totalStudents, label: 'Total Students', class: 'badge-secondary' }
            ]) +
            statusBlock('Suggestions Status', [
                { count: pendingSuggestions, label: 'Pending', class: 'badge-warning' },
                { count: resolvedSuggestions, label: 'Resolved', class: 'badge-success' },
                { count: otherSuggestions, label: 'In Review', class: 'badge-secondary' }
            ]) +
            statusBlock('Complaints Status', [
                { count: pendingComplaints, label: 'Pending', class: 'badge-warning' },
                { count: resolvedComplaints, label: 'Resolved', class: 'badge-success' },
                { count: otherComplaints, label: 'In Review', class: 'badge-secondary' }
            ]) +
            '</div>' +
            '</div>';
        
        return html;
    },

    // ========== STUDENT CONTENT ==========
    renderStudentContent: function() {
        var titles = { 
            overview: 'Dashboard', 
            events: 'Events', 
            news: 'News', 
            files: 'Files', 
            reports: 'Reports', 
            finance: 'Finance', 
            polls: 'Polls', 
            suggestions: 'Suggestions',
            complaints: 'Complaints'
        };
        var content = '';
        switch(this.currentStudentTab) {
            case 'overview': content = this.renderStudentOverview(); break;
            case 'events': content = this.renderStudentEvents(); break;
            case 'news':
            case 'announcements': content = this.renderStudentNews(); break;
            case 'files': content = this.renderStudentFiles(); break;
            case 'reports': content = this.renderStudentReports(); break;
            case 'finance': content = this.renderStudentFinance(); break;
            case 'polls': content = this.renderStudentPolls(); break;
            case 'suggestions': content = this.renderStudentSuggestions(); break;
            case 'complaints': content = this.renderStudentComplaints(); break;
        }
        
        var newsCount = (this.data.announcements || []).length;
        
        return '<div class="content-area">' +
            '<div class="content-header" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
            '<h2 class="content-title">' + titles[this.currentStudentTab === 'news' ? 'News' : 'Dashboard'] + '</h2>' +
            '<div style="display:flex;gap:4px;margin-left:8px;padding-left:8px;border-left:1px solid var(--border-color);">' +
            '<button class="content-tab-btn ' + (this.currentStudentTab === 'overview' ? 'active' : '') + '" data-content-tab="overview" style="padding:4px 10px;background:none;border:none;border-bottom:2px solid ' + (this.currentStudentTab === 'overview' ? 'var(--primary-color)' : 'transparent') + ';color:' + (this.currentStudentTab === 'overview' ? 'var(--primary-color)' : 'var(--text-light)') + ';cursor:pointer;font-size:13px;font-weight:500;">Dashboard</button>' +
            '<button class="content-tab-btn ' + (this.currentStudentTab === 'news' ? 'active' : '') + '" data-content-tab="news" style="padding:4px 10px;background:none;border:none;border-bottom:2px solid ' + (this.currentStudentTab === 'news' ? 'var(--primary-color)' : 'transparent') + ';color:' + (this.currentStudentTab === 'news' ? 'var(--primary-color)' : 'var(--text-light)') + ';cursor:pointer;font-size:13px;font-weight:500;position:relative;">News' + (newsCount > 0 ? '<span style="background:var(--danger-color);color:white;padding:1px 5px;border-radius:8px;font-size:10px;margin-left:4px;">' + newsCount + '</span>' : '') +
            '</button></div>' +
            '</div>' + content + '</div>';
    },

    renderStudentOverview: function() {
        var self = this;
        var pollsAnswered = this.currentUser.pollsAnswered ? this.currentUser.pollsAnswered.length : 0;
        var suggestionsMade = (this.data.suggestions || []).filter(function(s) { return s.email === self.currentUser.email; }).length;
        
        var finance = this.data.finance || { currentFunds: 0, transactions: [] };
        var totalExpenses = finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var totalFundsRaised = finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        return '<div class="welcome-banner"><h2>Welcome, ' + this.currentUser.name + '!</h2><p>Here\'s your dashboard overview</p></div>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-poll"></i></div><div class="stat-info"><div class="stat-value">' + pollsAnswered + '</div><div class="stat-label">Polls Answered</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-lightbulb"></i></div><div class="stat-info"><div class="stat-value">' + suggestionsMade + '</div><div class="stat-label">Suggestions</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-bullhorn"></i></div><div class="stat-info"><div class="stat-value">' + this.data.announcements.length + '</div><div class="stat-label">Announcements</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon"><i class="fas fa-calendar"></i></div><div class="stat-info"><div class="stat-value">' + this.data.events.length + '</div><div class="stat-label">Events</div></div></div>' +
            '</div>' +
            '<h3 style="margin:20px 0 12px;font-size:16px;font-weight:600;">Finance Overview</h3>' +
            '<div class="stats-grid">' +
                '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">$' + finance.currentFunds.toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">$' + totalExpenses.toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">$' + totalFundsRaised.toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
            '</div>';
    },

    renderStudentEvents: function() {
        var self = this;
        if ((this.data.events || []).length === 0) return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-calendar"></i></div><h3 class="empty-title">No events</h3></div>';
        
        var html = '<div class="cards-grid">';
        this.data.events.forEach(function(e) {
            var rsvpd = e.rsvps && e.rsvps.indexOf(self.currentUser.email) > -1;
            var attended = e.attendees && e.attendees.some(function(a) { return a.email === self.currentUser.email; });
            var evaluated = e.evaluations && e.evaluations.some(function(ev) { return ev.email === self.currentUser.email; });
            var statusClass = e.status === 'upcoming' ? 'badge-primary' : e.status === 'finished' ? 'badge-success' : e.status === 'cancelled' ? 'badge-danger' : e.status === 'moved' ? 'badge-warning' : 'badge-secondary';
            var statusLabel = e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Upcoming';
            
            html += '<div class="card">' +
                '<div class="card-header"><h3 class="card-title">' + e.title + '</h3></div>' +
                '<div class="card-body"><div style="text-align:center;margin-bottom:12px;">' +
                '<span class="badge ' + statusClass + '">' + statusLabel + '</span>' +
                '<span class="badge badge-secondary" style="margin-left:8px;">' + (e.category || 'General') + '</span></div>' +
                '<div class="event-details">' +
                '<div class="event-detail"><i class="fas fa-calendar"></i> ' + e.date + '</div>' +
                '<div class="event-detail"><i class="fas fa-clock"></i> ' + e.time + '</div>' +
                '<div class="event-detail"><i class="fas fa-map-marker-alt"></i> ' + e.location + '</div>' +
                '<div class="event-detail"><i class="fas fa-users"></i> ' + (e.attendees ? e.attendees.length : 0) + ' attended</div></div>' +
                '<p class="card-text mt-4">' + e.description + '</p></div>' +
                '<div class="card-footer" style="display:flex;flex-wrap:wrap;gap:8px;">' +
                '<button class="btn btn-' + (rsvpd ? 'success' : 'primary') + ' btn-sm" data-action="rsvp-event" data-id="' + e.id + '">' + (rsvpd ? 'Attending' : 'Attend') + '</button>';
            
            // QR code scan button for events with QR codes (only for upcoming)
            if (e.qrCode && e.status === 'upcoming') {
                html += '<button class="btn btn-warning btn-sm" data-action="scan-qr" data-id="' + e.id + '"><i class="fas fa-qrcode"></i> Scan QR</button>';
            }
            
            // Evaluation form display
            if (e.evaluationLink) {
                html += '<a href="' + e.evaluationLink + '" target="_blank" class="btn btn-info btn-sm" style="margin-top:8px;"><i class="fas fa-clipboard"></i> Evaluation</a>';
            }
            
            // Mark as attended button if already scanned
            if (e.qrCode && e.status === 'finished' && !attended) {
                html += '<button class="btn btn-success btn-sm" data-action="mark-attended" data-id="' + e.id + '"><i class="fas fa-check"></i> Mark Attended</button>';
            }
            
            // Evaluation form button
            if (e.evaluationEnabled && e.evaluationLink && attended && !evaluated) {
                html += '<button class="btn btn-info btn-sm" data-action="do-evaluation" data-id="' + e.id + '"><i class="fas fa-clipboard"></i> Do Evaluation</button>';
            }
            
            if (attended) {
                html += '<span class="badge badge-success" style="margin-left:auto;"><i class="fas fa-check"></i> Attended</span>';
            }
            
            if (evaluated) {
                html += '<span class="badge badge-success"><i class="fas fa-clipboard"></i> Evaluated</span>';
            }
            
            html += '</div></div>';
        });
        html += '</div>';
        
        html += '<div id="qr-scan-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:400px;">' +
            '<div class="modal-header"><h3>Scan Event QR Code</h3><button class="modal-close" id="close-qr-modal">&times;</button></div>' +
            '<div style="padding:20px;">' +
            '<p style="margin-bottom:12px;text-align:center;">Enter the QR code from the attendance QR:</p>' +
            '<input type="text" class="form-input" id="qr-code-input" placeholder="Enter ATT-XXXXX code">' +
            '<button class="btn btn-primary" id="verify-qr-btn" style="margin-top:12px;width:100%;">Verify Code</button>' +
            '<div id="scanned-event" style="display:none;text-align:left;margin-top:16px;">' +
            '<div style="text-align:center;margin-bottom:16px;">' +
            '<div id="scanned-event-title" style="font-size:18px;font-weight:600;margin-bottom:8px;"></div>' +
            '<div id="scanned-event-info" style="font-size:13px;color:var(--text-light);margin-bottom:12px;"></div></div>' +
            '<div style="padding:12px;background:var(--bg-white);border-radius:6px;margin-bottom:12px;">' +
            '<p style="font-size:12px;margin-bottom:4px;"><strong>Your Info:</strong></p>' +
            '<p style="font-size:12px;margin:0;">Name: ' + self.currentUser.name + '</p>' +
            '<p style="font-size:12px;margin:0;">Course: ' + (self.currentUser.course || '-') + '</p>' +
            '<p style="font-size:12px;margin:0;">Section: ' + (self.currentUser.section || '-') + '</p>' +
            '<p style="font-size:12px;margin:0;">Email: ' + self.currentUser.email + '</p></div>' +
            '<button class="btn btn-success" id="attend-event-btn" style="width:100%;"><i class="fas fa-check-circle"></i> Attend This Event</button>' +
            '</div>' +
            '</div></div>';
        
        html += '<div id="evaluation-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>Submit Evaluation</h3><button class="modal-close" id="close-evaluation-modal">&times;</button></div>' +
            '<form id="evaluation-form" style="padding:20px;">' +
            '<p id="eval-event-title" style="font-weight:600;margin-bottom:16px;"></p>' +
            '<p style="margin-bottom:12px;">Please complete the evaluation form first, then upload your screenshot:</p>' +
            '<a id="eval-link" href="" target="_blank" class="btn btn-secondary" style="display:block;margin-bottom:16px;">Open Evaluation Form</a>' +
            '<div class="form-group"><label class="form-label">Upload Screenshot *</label>' +
            '<input type="file" id="eval-screenshot" accept="image/*" required></div>' +
            '<button type="submit" class="btn btn-primary">Submit</button></form></div>';
        
        return html;
    },

    renderStudentAnnouncements: function() {
        var self = this;
        if (this.data.announcements.length === 0) return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-bullhorn"></i></div><h3 class="empty-title">No announcements</h3></div>';
        
        var html = '<div>';
        this.data.announcements.forEach(function(a) {
            var hasLiked = a.likes && a.likes.indexOf(self.currentUser.email) > -1;
            html += '<div class="announcement-item">' +
                '<h3 class="announcement-title">' + a.title + '</h3>' +
                '<div class="announcement-date">' + a.date + (a.pinned ? ' <span class="badge badge-warning">Pinned</span>' : '') + '</div>' +
                '<p class="announcement-content">' + a.content + '</p>' +
                '<div class="announcement-actions">' +
                '<button class="btn btn-' + (hasLiked ? 'success' : 'secondary') + ' btn-sm" data-action="like-announcement" data-id="' + a.id + '"><i class="fas fa-thumbs-up"></i> ' + (a.likes ? a.likes.length : 0) + '</button>' +
                '<button class="btn btn-secondary btn-sm" data-action="mark-read" data-id="' + a.id + '"><i class="fas fa-check"></i> Mark Read</button></div></div>';
        });
        html += '</div>';
        return html;
    },

    renderStudentFiles: function() {
        if ((this.data.files || []).length === 0) return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-folder"></i></div><h3 class="empty-title">No files</h3></div>';
        
        var html = '<div>';
        this.data.files.forEach(function(f) {
            html += '<div class="file-item">' +
                '<div class="file-icon"><i class="fas fa-file-' + (f.type === 'pdf' ? 'pdf' : 'alt') + '"></i></div>' +
                '<div class="file-info"><div class="file-name">' + f.name + '</div><div class="file-size">' + f.size + ' | ' + f.category + '</div></div>' +
                '<button class="file-download" data-action="download-file" data-id="' + f.id + '"><i class="fas fa-download"></i> Download</button></div>';
        });
        html += '</div>';
        return html;
    },

    renderStudentReports: function() {
        var reports = this.data.reportFiles || [];
        
        if (reports.length === 0) return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-file-pdf"></i></div><h3 class="empty-title">No reports available</h3><p class="empty-text">Check back later for uploaded reports</p></div>';
        
        var html = '<div class="table-container"><table class="table"><thead><tr><th>Name</th><th>Category</th><th>Date</th><th>Action</th></tr></thead><tbody>';
        reports.forEach(function(r) {
            html += '<tr><td><i class="fas fa-file-pdf" style="color:#ef4444;margin-right:8px;"></i>' + r.name + '</td><td>' + r.category + '</td><td>' + r.date + '</td>' +
                '<td><button class="btn btn-primary btn-sm" data-action="download-report" data-id="' + r.id + '"><i class="fas fa-download"></i> Download</button></td></tr>';
        });
        html += '</tbody></table></div>';
        return html;
    },

    renderStudentFinance: function() {
        var finance = this.data.finance || { currentFunds: 0, transactions: [] };
        
        var totalExpenses = finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var totalFundsRaised = finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        var html = '<div class="stats-grid" style="margin-bottom:20px;">' +
            '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">$' + finance.currentFunds.toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">$' + totalExpenses.toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">$' + totalFundsRaised.toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
        '</div>';
        
        if (finance.transactions.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-receipt"></i></div><h3 class="empty-title">No transactions</h3><p class="empty-text">Transaction history will appear here</p></div>';
        } else {
            html += '<div class="table-container"><table class="table"><thead><tr><th>Date</th><th>Type</th><th>Event</th><th>Amount</th><th>Description</th></tr></thead><tbody>';
            finance.transactions.forEach(function(t) {
                var typeBadge = t.type === 'expense' ? 'badge-danger' : 'badge-primary';
                var typeLabel = t.type === 'expense' ? 'Expense' : 'Funds Raised';
                html += '<tr><td>' + t.date + '</td><td><span class="badge ' + typeBadge + '">' + typeLabel + '</span></td><td>' + (t.eventTitle || '-') + '</td><td>$' + t.amount.toLocaleString() + '</td><td>' + t.description + '</td></tr>';
            });
            html += '</tbody></table></div>';
        }
        
        return html;
    },

    renderStudentPolls: function() {
        var self = this;
        var activePolls = (this.data.polls || []).filter(function(p) { return p.active; });
        
        if (activePolls.length === 0) {
            return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-poll"></i></div><h3 class="empty-title">No active polls</h3><p class="empty-text">Check back later for new polls</p></div>';
        }
        
        var html = '<div class="cards-grid">';
        activePolls.forEach(function(p) {
            html += '<div class="card">' +
                '<div class="card-header"><h3 class="card-title">' + p.question + '</h3></div>' +
                '<div class="card-body">';
            
            if (p.link) {
                html += '<p class="text-sm" style="margin-bottom:12px;">Click below to take the poll:</p>' +
                    '<a href="' + p.link + '" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> Open Poll</a>';
            } else {
                html += '<p class="text-muted">Poll link not available.</p>';
            }
            
            html += '<p class="text-sm text-muted" style="margin-top:12px;">Created: ' + p.date + '</p>' +
                '</div></div>';
        });
        html += '</div>';
        return html;
    },

    renderStudentSuggestions: function() {
        var self = this;
        return '<div class="suggestion-box">' +
            '<div class="form-group"><select class="form-input" id="suggestion-category"><option value="">Select Category</option><option value="Suggestion">Suggestion</option><option value="Inquiry">Inquiry</option></select></div>' +
            '<div class="form-group"><textarea class="form-input suggestion-textarea" id="suggestion-input" placeholder="Share your suggestions..." rows="4"></textarea></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="anonymous-submit"><span>Submit Anonymously</span></label></div>' +
            '<div class="suggestion-actions"><button class="btn btn-primary" data-action="submit-suggestion">Submit</button></div></div>' +
            '<h3 style="margin-top:24px;">Previous Suggestions</h3>' +
            '<div class="suggestion-list">' +
            ((this.data.suggestions || []).length === 0 ? '<p class="text-muted">No suggestions yet</p>' : 
                (this.data.suggestions || []).map(function(s) {
                    var hasUpvoted = s.hasUpvoted && s.hasUpvoted.indexOf(self.currentUser.email) > -1;
                    return '<div class="suggestion-item"><div class="suggestion-header"><span class="suggestion-author">' + (s.anonymous ? 'Anonymous' : s.author) + '</span><span class="suggestion-date">' + s.date + '</span></div>' +
                    '<p class="suggestion-content">' + s.content + '</p>' +
                    '<div class="suggestion-actions"><button class="btn btn-' + (hasUpvoted ? 'success' : 'secondary') + ' btn-sm" data-action="upvote-suggestion" data-id="' + s.id + '"><i class="fas fa-arrow-up"></i> ' + (s.upvotes || 0) + '</button></div>' +
                    (s.reply ? '<div class="suggestion-reply"><strong>Admin:</strong> ' + s.reply + '</div>' : '') + '</div>';
                }).join('')) +
            '</div>';
    },

    renderStudentComplaints: function() {
        var self = this;
        var complaints = this.data.complaints || [];
        var userComplaints = complaints.filter(function(c) { return c.author === self.currentUser.name || (c.email && c.email === self.currentUser.email); });
        
        var html = '<div class="suggestion-box">' +
            '<div class="form-group"><textarea class="form-input suggestion-textarea" id="complaint-input" placeholder="File your complaint here..." rows="4"></textarea></div>' +
            '<div class="form-group"><label class="form-label">Attach File/Image (Optional)</label>' +
            '<input type="file" id="complaint-file" accept="image/*,.pdf,.doc,.docx,.png,.jpg,.jpeg"></div>' +
            '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="anonymous-complaint"><span>Submit Anonymously</span></label></div>' +
            '<div class="suggestion-actions"><button class="btn btn-danger" data-action="submit-complaint">Submit Complaint</button></div></div>' +
            '<h3 style="margin-top:24px;">My Complaints</h3>' +
            '<div class="suggestion-list">' +
            (userComplaints.length === 0 ? '<p class="text-muted">No complaints yet</p>' : 
                userComplaints.map(function(c) {
                    var statusBadge = c.status === 'resolved' ? 'success' : c.status === 'inreview' ? 'warning' : 'secondary';
                    var statusLabel = c.status === 'resolved' ? 'Resolved' : c.status === 'inreview' ? 'In Review' : 'Pending';
                    return '<div class="suggestion-item">' +
                        '<div class="suggestion-header"><span class="suggestion-author">' + (c.anonymous ? 'Anonymous' : c.author) + '</span><span class="suggestion-date">' + c.date + '</span></div>' +
                        '<span class="badge badge-' + statusBadge + '">' + statusLabel + '</span>' +
                        '<p class="suggestion-content">' + c.content + '</p>' +
                        (c.replies && c.replies.length ? c.replies.map(function(r) { 
                            return '<div class="suggestion-reply"><strong>' + (r.fromAdmin ? 'Admin' : 'You') + ':</strong> ' + r.content + '</div>'; 
                        }).join('') : '') +
                        '<div style="margin-top:12px;">' +
                        '<button class="btn btn-primary btn-sm" data-action="view-complaint-status" data-id="' + c.id + '"><i class="fas fa-comments"></i> View & Chat</button>' +
                        '</div></div>';
                }).join('')) +
            '</div>';
        
        html += '<div id="complaint-status-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content" style="max-width:500px;max-height:80vh;">' +
            '<div class="modal-header"><h3>Complaint Details & Chat</h3><button class="modal-close" id="close-complaint-status-modal">&times;</button></div>' +
            '<div id="complaint-status-content" style="padding:20px;max-height:300px;overflow-y:auto;"></div>' +
            '<div style="padding:20px;border-top:1px solid var(--border-color);">' +
            '<div class="form-group"><textarea class="form-input" id="student-chat-message" placeholder="Type your message..." rows="2"></textarea></div>' +
            '<div style="display:flex;gap:8px;"><input type="file" id="student-chat-file" accept="image/*,.pdf,.doc,.docx" style="flex:1;">' +
            '<button class="btn btn-primary" id="student-send-chat-btn">Send</button></div>' +
            '</div></div></div>';
        
        return html;
    },

    renderStudentNews: function() {
        var self = this;
        if (!this.data.comments) this.data.comments = [];
        if ((this.data.announcements || []).length === 0) {
            return '<div class="empty-state"><div class="empty-icon"><i class="fas fa-newspaper"></i></div><h3 class="empty-title">No news</h3><p class="empty-text">Check back later for updates</p></div>';
        }
        
        var html = '<div class="newsfeed">';
        this.data.announcements.forEach(function(a) {
            var hasLiked = a.likes && a.likes.indexOf(self.currentUser.email) > -1;
            var hasAnswered = a.evaluations && a.evaluations.some(function(e) { return e.email === self.currentUser.email; });
            var announcementComments = (self.data.comments || []).filter(function(c) { return c.announcementId === a.id; });
            
            html += '<div class="newsfeed-item">' +
                (a.image ? '<img src="' + a.image + '" style="width:100%;max-height:300px;object-fit:cover;cursor:pointer;" onclick="App.viewFullImage(this)">' : '') +
                '<div style="padding:16px;">' +
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
                '<div class="profile-avatar" style="width:40px;height:40px;font-size:16px;"><i class="fas fa-school"></i></div>' +
                '<div><div style="font-weight:600;">CSC Administration</div>' +
                '<div style="font-size:12px;color:var(--text-light);">' + a.date + '</div></div></div>' +
                '<h3 style="font-size:18px;font-weight:600;margin-bottom:8px;">' + a.title + '</h3>' +
                '<p style="font-size:14px;line-height:1.6;margin-bottom:12px;">' + a.content + '</p>';
            
            // Evaluation form if exists
            if (a.hasEvaluation && !hasAnswered) {
                html += '<div style="background:var(--bg-color);padding:16px;border-radius:8px;margin-bottom:12px;">' +
                    '<h4 style="margin-bottom:12px;">Please rate this announcement:</h4>' +
                    '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
                    '<button class="btn btn-sm btn-' + (a.userRating === 1 ? 'primary' : 'secondary') + '" data-action="rate-announcement" data-id="' + a.id + '" data-rating="1">1</button>' +
                    '<button class="btn btn-sm btn-' + (a.userRating === 2 ? 'primary' : 'secondary') + '" data-action="rate-announcement" data-id="' + a.id + '" data-rating="2">2</button>' +
                    '<button class="btn btn-sm btn-' + (a.userRating === 3 ? 'primary' : 'secondary') + '" data-action="rate-announcement" data-id="' + a.id + '" data-rating="3">3</button>' +
                    '<button class="btn btn-sm btn-' + (a.userRating === 4 ? 'primary' : 'secondary') + '" data-action="rate-announcement" data-id="' + a.id + '" data-rating="4">4</button>' +
                    '<button class="btn btn-sm btn-' + (a.userRating === 5 ? 'primary' : 'secondary') + '" data-action="rate-announcement" data-id="' + a.id + '" data-rating="5">5</button>' +
                    '</div></div>';
            }
            
            html += '<div style="display:flex;gap:8px;">' +
                '<button class="btn btn-' + (hasLiked ? 'success' : 'secondary') + ' btn-sm" data-action="like-announcement" data-id="' + a.id + '"><i class="fas fa-thumbs-up"></i> ' + (a.likes ? a.likes.length : 0) + '</button>' +
                '<button class="btn btn-secondary btn-sm" data-action="toggle-comments" data-id="' + a.id + '"><i class="fas fa-comment"></i> ' + announcementComments.length + ' Comments</button>' +
                '</div>' +
                '<div class="comments-section" id="comments-' + a.id + '" style="display:none;margin-top:12px;padding:12px;background:var(--bg-color);border-radius:8px;">';
            
            announcementComments.forEach(function(c) {
                var commentUser = (self.data.users || []).find(function(u) { return u.email === c.email; });
                html += '<div style="margin-bottom:8px;padding:8px;background:white;border-radius:6px;">' +
                    '<div style="font-weight:600;font-size:12px;">' + (commentUser ? commentUser.name : c.email) + '</div>' +
                    '<div style="font-size:13px;">' + c.content + '</div>' +
                    '<div style="font-size:11px;color:var(--text-light);margin-top:4px;">' + c.date + '</div>' +
                    '</div>';
            });
            
            html += '<form class="comment-form" data-announcement-id="' + a.id + '" style="margin-top:8px;display:flex;gap:8px;">' +
                '<input type="text" class="form-input" placeholder="Write a comment..." style="flex:1;font-size:13px;" required>' +
                '<button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-paper-plane"></i></button>' +
                '</form></div></div></div>';
        });
        html += '</div>';
        
        html += '<style>.newsfeed-item{background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);margin-bottom:16px;overflow:hidden;}</style>';
        
        return html;
    },

    // ========== EVENT LISTENERS ==========
    attachDashboardListeners: function(role) {
        var self = this;
        try {
        
        var navItems = document.querySelectorAll('.nav-item');
        
        Array.prototype.forEach.call(navItems, function(item) {
            item.addEventListener('click', function() {
                var tab = this.dataset.tab;
                if (role === 'admin') {
                    self.currentAdminTab = tab;
                    self.renderAdminDashboard();
                } else {
                    self.currentStudentTab = tab;
                    self.renderStudentDashboard();
                }
            });
        });

        document.querySelector('[data-action="home"]') && document.querySelector('[data-action="home"]').addEventListener('click', function() {
            if (role === 'admin') {
                self.currentAdminTab = 'overview';
                self.renderAdminDashboard();
            } else {
                self.currentStudentTab = 'overview';
                self.renderStudentDashboard();
            }
        });

        document.querySelector('[data-action="profile"]') && document.querySelector('[data-action="profile"]').addEventListener('click', function() {
            self.showProfileModal();
        });

        document.querySelector('[data-action="logout"]') && document.querySelector('[data-action="logout"]').addEventListener('click', function() {
            localStorage.removeItem('cscCurrentUser');
            self.currentUser = null;
            self.renderLogin();
        });

        // Message Button
        var messageBtn = document.getElementById('message-btn');
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                self.showMessageModal();
            });
        }

        // Content Tab Buttons (Student - inside content area)
        var contentTabBtns = document.querySelectorAll('.content-tab-btn');
        Array.prototype.forEach.call(contentTabBtns, function(btn) {
            btn.addEventListener('click', function() {
                var tab = btn.dataset.contentTab;
                if (tab === 'overview') {
                    self.currentStudentTab = 'overview';
                } else if (tab === 'news') {
                    self.currentStudentTab = 'news';
                }
                self.renderStudentDashboard();
            });
        });

        // Headlines (Admin)
        var createHeadlineBtn = document.getElementById('create-headline-btn');
        var headlineModal = document.getElementById('headline-modal');
        var closeHeadlineModal = document.getElementById('close-headline-modal');
        var headlineForm = document.getElementById('headline-form');
        
        if (createHeadlineBtn && headlineModal) {
            createHeadlineBtn.addEventListener('click', function() {
                headlineForm.dataset.editId = '';
                document.getElementById('headline-title').value = '';
                document.getElementById('headline-content').value = '';
                headlineModal.style.display = 'flex';
            });
        }
        if (closeHeadlineModal) {
            closeHeadlineModal.addEventListener('click', function() {
                headlineModal.style.display = 'none';
            });
        }
        if (headlineForm && !headlineForm.dataset.listenerAttached) {
            headlineForm.dataset.listenerAttached = 'true';
            headlineForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var title = document.getElementById('headline-title').value;
                var content = document.getElementById('headline-content').value;
                var editId = headlineForm.dataset.editId;
                
                if (editId) {
                    var idx = self.data.headlines.findIndex(function(h) { return h.id == editId; });
                    if (idx > -1) {
                        self.data.headlines[idx] = { id: parseInt(editId), title: title, content: content, date: self.data.headlines[idx].date };
                    }
                } else {
                    self.data.headlines.push({
                        id: Date.now(),
                        title: title,
                        content: content,
                        date: new Date().toISOString().split('T')[0]
                    });
                }
                
                self.saveData();
                headlineModal.style.display = 'none';
                self.renderAdminDashboard();
            });
        }

        // Headline Edit/Delete
        var editHeadlineBtns = document.querySelectorAll('[data-action="edit-headline"]');
        Array.prototype.forEach.call(editHeadlineBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var headline = self.data.headlines.find(function(h) { return h.id == btn.dataset.id; });
                if (headline) {
                    var modal = document.getElementById('headline-modal');
                    var form = document.getElementById('headline-form');
                    form.dataset.editId = headline.id;
                    document.getElementById('headline-title').value = headline.title || '';
                    document.getElementById('headline-content').value = headline.content || '';
                    modal.style.display = 'flex';
                }
            });
        });
        
        var deleteHeadlineBtns = document.querySelectorAll('[data-action="delete-headline"]');
        Array.prototype.forEach.call(deleteHeadlineBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (confirm('Delete this featured post?')) {
                    self.data.headlines = self.data.headlines.filter(function(h) { return h.id != btn.dataset.id; });
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        });

        // Events
        var deleteEventBtns = document.querySelectorAll('[data-action="delete-event"]');
        Array.prototype.forEach.call(deleteEventBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (confirm('Delete this event?')) {
                    self.data.events = self.data.events.filter(function(e) { return e.id != btn.dataset.id; });
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        });

        // Download QR Code
        var downloadQrBtns = document.querySelectorAll('[data-action="download-qr"]');
        Array.prototype.forEach.call(downloadQrBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var event = self.data.events.find(function(e) { return e.id == btn.dataset.id; });
                if (event && event.qrCode) {
                    var qrData = 'CSC:' + event.qrCode + '|' + event.id + '|' + encodeURIComponent(event.title);
                    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrData);
                    var link = document.createElement('a');
                    link.href = qrUrl;
                    link.download = 'QR-' + event.title + '.png';
                    link.click();
                }
            });
        });

        // Generate QR Code buttons in Attendance Tab
        var generateQrBtn = document.getElementById('generate-qr-btn');
        if (generateQrBtn) {
            generateQrBtn.addEventListener('click', function() {
                var panel = document.getElementById('qr-generator-panel');
                var result = document.getElementById('qr-result');
                if (panel) panel.style.display = 'block';
                if (result) result.style.display = 'none';
            });
        }
        
        // Close QR Generator Panel
        var closeQrPanel = document.getElementById('close-qr-panel');
        if (closeQrPanel) {
            closeQrPanel.addEventListener('click', function() {
                var panel = document.getElementById('qr-generator-panel');
                var nameInput = document.getElementById('qr-name-input');
                if (panel) panel.style.display = 'none';
                if (nameInput) nameInput.value = '';
            });
        }
        
        // Close QR Result
        var closeQrResult = document.getElementById('close-qr-result');
        if (closeQrResult) {
            closeQrResult.addEventListener('click', function() {
                var result = document.getElementById('qr-result');
                if (result) result.style.display = 'none';
            });
        }
        
        var createQrBtn = document.getElementById('create-qr-btn');
        if (createQrBtn) {
            createQrBtn.addEventListener('click', function() {
                var codeName = document.getElementById('qr-name-input').value.trim();
                var eventId = document.getElementById('qr-event-select').value;
                
                if (!codeName) {
                    alert('Please enter a name for the QR code');
                    return;
                }
                
                var code = 'ATT-' + codeName.toUpperCase().replace(/\s+/g, '-') + '-' + Date.now();
                var eventTitle = eventId ? (self.data.events.find(function(e) { return e.id == eventId; }) || {}).title : codeName;
                var qrData = 'CSC:' + code + '|' + encodeURIComponent(eventTitle);
                var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qrData);
                
                // Save the QR code to data
                if (!self.data.qrCodes) self.data.qrCodes = [];
                self.data.qrCodes.push({
                    id: Date.now(),
                    code: code,
                    name: codeName,
                    eventId: eventId || null,
                    eventTitle: eventTitle,
                    date: new Date().toISOString().split('T')[0],
                    attendees: []
                });
                self.saveData();
                
                // Show result
                var qrImage = document.getElementById('qr-image');
                var qrDisplay = document.getElementById('qr-code-display');
                var qrResult = document.getElementById('qr-result');
                if (qrImage) qrImage.src = qrUrl;
                if (qrDisplay) qrDisplay.textContent = code;
                if (qrResult) qrResult.style.display = 'block';
                if (document.getElementById('qr-generator-panel')) document.getElementById('qr-generator-panel').style.display = 'none';
                
                // Auto download
                var link = document.createElement('a');
                link.href = qrUrl;
                link.download = 'QR-' + codeName.replace(/\s+/g, '-') + '.png';
                link.click();
            });
        }
        
        var downloadQrBtn = document.getElementById('download-qr-btn');
        if (downloadQrBtn) {
            downloadQrBtn.addEventListener('click', function() {
                var qrImage = document.getElementById('qr-image');
                if (qrImage && qrImage.src) {
                    var link = document.createElement('a');
                    link.href = qrImage.src;
                    link.download = 'QR-Code.png';
                    link.click();
                }
            });
        }

        // Export Attendance (from QR codes list)
        var exportQrAttendanceBtns = document.querySelectorAll('[data-action="export-qr-attendance"]');
        Array.prototype.forEach.call(exportQrAttendanceBtns, function(btn) {
            if (btn.classList.contains('listener-attached')) return;
            btn.classList.add('listener-attached');
            btn.addEventListener('click', function() {
                var qr = self.data.qrCodes.find(function(q) { return q.id == btn.dataset.id; });
                if (qr && qr.attendees && qr.attendees.length > 0) {
                    var csv = 'Name,Email,Course,Section,Date,Time\n';
                    qr.attendees.forEach(function(a) {
                        csv += '"' + a.name + '","' + a.email + '","' + a.course + '","' + a.section + '","' + a.date + '","' + (a.time || '') + '"\n';
                    });
                    var blob = new Blob([csv], { type: 'text/csv' });
                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = 'Attendance-' + qr.name.replace(/\s+/g, '-') + '.csv';
                    link.click();
                }
            });
        });
        
        // View QR Attendees
        var viewQrAttendeesBtns = document.querySelectorAll('[data-action="view-qr-attendees"]');
        Array.prototype.forEach.call(viewQrAttendeesBtns, function(btn) {
            if (btn.classList.contains('listener-attached')) return;
            btn.classList.add('listener-attached');
            btn.addEventListener('click', function() {
                var qr = self.data.qrCodes.find(function(q) { return q.id == btn.dataset.id; });
                if (qr) {
                    var attendees = qr.attendees || [];
                    var modal = document.getElementById('qr-attendees-modal');
                    var title = document.getElementById('qr-attendees-title');
                    var count = document.getElementById('qr-attendees-count');
                    var list = document.getElementById('qr-attendees-list');
                    
                    if (modal && title && count && list) {
                        title.textContent = 'Attendance - ' + qr.name;
                        count.textContent = 'Total Attendees: ' + attendees.length;
                        
                        var html = '<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Course</th><th>Section</th><th>Date</th><th>Time</th></tr></thead><tbody>';
                        attendees.forEach(function(a) {
                            html += '<tr><td>' + a.name + '</td><td>' + a.email + '</td><td>' + (a.course || '-') + '</td><td>' + (a.section || '-') + '</td><td>' + a.date + '</td><td>' + (a.time || '') + '</td></tr>';
                        });
                        html += '</tbody></table>';
                        list.innerHTML = html;
                        modal.style.display = 'flex';
                    }
                }
            });
        });
        
        // Close QR Attendees Modal
        var closeQrAttendeesModal = document.getElementById('close-qr-attendees-modal');
        if (closeQrAttendeesModal) {
            closeQrAttendeesModal.addEventListener('click', function() {
                var modal = document.getElementById('qr-attendees-modal');
                if (modal) modal.style.display = 'none';
            });
        }
        
        // Export QR Attendees from Modal
        var exportQrAttendeesBtn = document.getElementById('export-qr-attendees-btn');
        if (exportQrAttendeesBtn) {
            exportQrAttendeesBtn.addEventListener('click', function() {
                var title = document.getElementById('qr-attendees-title');
                if (title) {
                    var qrName = title.textContent.replace('Attendance - ', '');
                    var qr = self.data.qrCodes.find(function(q) { return q.name === qrName; });
                    if (qr && qr.attendees && qr.attendees.length > 0) {
                        var csv = 'Name,Email,Course,Section,Date,Time\n';
                        qr.attendees.forEach(function(a) {
                            csv += '"' + a.name + '","' + a.email + '","' + (a.course || '') + '","' + (a.section || '') + '","' + a.date + '","' + (a.time || '') + '"\n';
                        });
                        var blob = new Blob([csv], { type: 'text/csv' });
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.download = 'Attendance-' + qr.name.replace(/\s+/g, '-') + '.csv';
                        link.click();
                    }
                }
            });
        }

        // View QR Code Modal
        var viewQrCodeBtns = document.querySelectorAll('[data-action="view-qr-code"]');
        Array.prototype.forEach.call(viewQrCodeBtns, function(btn) {
            if (btn.classList.contains('listener-attached')) return;
            btn.classList.add('listener-attached');
            btn.addEventListener('click', function() {
                var qr = self.data.qrCodes.find(function(q) { return q.id == btn.dataset.id; });
                if (qr) {
                    var modal = document.getElementById('qr-view-modal');
                    var title = document.getElementById('qr-view-title');
                    var image = document.getElementById('qr-view-image');
                    var code = document.getElementById('qr-view-code');
                    if (modal && title && image && code) {
                        title.textContent = qr.name;
                        image.src = decodeURIComponent(btn.dataset.url);
                        code.textContent = qr.code;
                        modal.style.display = 'flex';
                    }
                }
            });
        });

        // Close QR View Modal
        var closeQrView = document.getElementById('close-qr-view');
        if (closeQrView) {
            closeQrView.addEventListener('click', function() {
                var modal = document.getElementById('qr-view-modal');
                if (modal) modal.style.display = 'none';
            });
        }

        // Download QR from Modal
        var downloadQrBtn = document.getElementById('download-qr-btn');
        if (downloadQrBtn) {
            downloadQrBtn.addEventListener('click', function() {
                var image = document.getElementById('qr-view-image');
                if (image && image.src) {
                    var link = document.createElement('a');
                    link.href = image.src;
                    link.download = 'QR-Code.png';
                    link.click();
                }
            });
        }

        // View QR Attendees
        var viewQrAttendeesStudentBtns = document.querySelectorAll('[data-action="view-qr-attendees"]');
        Array.prototype.forEach.call(viewQrAttendeesStudentBtns, function(btn) {
            if (btn.classList.contains('listener-attached')) return;
            btn.classList.add('listener-attached');
            btn.addEventListener('click', function() {
                var evt = self.data.events.find(function(e) { return e.id == btn.dataset.id; });
                if (evt) {
                    if (!evt.rsvps) evt.rsvps = [];
                    var idx = evt.rsvps.indexOf(self.currentUser.email);
                    if (idx > -1) evt.rsvps.splice(idx, 1);
                    else evt.rsvps.push(self.currentUser.email);
                    self.saveData();
                    self.renderStudentDashboard();
                }
            });
        });

        // Scan QR Button
        var scanQrBtns = document.querySelectorAll('[data-action="scan-qr"]');
        Array.prototype.forEach.call(scanQrBtns, function(btn) {
                if (btn.classList.contains('listener-attached')) return;
                btn.classList.add('listener-attached');
                btn.addEventListener('click', function() {
                    document.getElementById('qr-scan-modal').style.display = 'flex';
                });
            });

            // Camera Scanner - show instruction for manual entry
            var openCameraBtn = document.getElementById('open-camera-btn');
            if (openCameraBtn && !openCameraBtn.dataset.listenerAttached) {
                openCameraBtn.dataset.listenerAttached = 'true';
                openCameraBtn.addEventListener('click', function() {
                    alert('Please use the manual entry option below to enter the QR code. Camera scanning requires additional permissions.');
                });
            }

            // Verify QR Code - shows event details first
            document.getElementById('verify-qr-btn') && document.getElementById('verify-qr-btn').addEventListener('click', function() {
                var code = document.getElementById('qr-code-input').value.trim();
                if (!code) {
                    alert('Please enter a code');
                    return;
                }
                
                // Check in qrCodes array first
                var qrRecord = (self.data.qrCodes || []).find(function(q) { return q.code === code; });
                var evt = null;
                var eventTitle = '';
                
                if (qrRecord) {
                    eventTitle = qrRecord.eventTitle || qrRecord.name;
                    if (qrRecord.eventId) {
                        evt = self.data.events.find(function(e) { return e.id == qrRecord.eventId; });
                    }
                } else {
                    // Also check in events
                    evt = self.data.events.find(function(e) { return e.qrCode === code; });
                    if (evt) eventTitle = evt.title;
                }
                
                if (!eventTitle) {
                    alert('Invalid QR code. Please check and try again.');
                    return;
                }
                
                // Show event details
                document.getElementById('scanned-event').style.display = 'block';
                document.getElementById('scanned-event-title').textContent = eventTitle;
                document.getElementById('scanned-event-info').innerHTML = 
                    '<p>Date: ' + (evt ? evt.date : new Date().toISOString().split('T')[0]) + '</p>' +
                    '<p>Time: ' + (evt ? evt.time : '') + '</p>' +
                    '<p>Location: ' + (evt ? evt.location : 'N/A') + '</p>' +
                    (qrRecord ? '<p>Code: ' + qrRecord.code + '</p>' : '');
                
                // Store for attend button
                document.getElementById('attend-event-btn').dataset.qrCode = code;
                document.getElementById('attend-event-btn').dataset.eventId = evt ? evt.id : '';
            });

            // Attend Event Button
            document.getElementById('attend-event-btn') && document.getElementById('attend-event-btn').addEventListener('click', function() {
                var code = this.dataset.qrCode;
                var eventId = this.dataset.eventId;
                var user = self.currentUser;
                
                // Find QR record to add attendance
                var qrRecord = (self.data.qrCodes || []).find(function(q) { return q.code === code; });
                
                if (qrRecord) {
                    if (!qrRecord.attendees) qrRecord.attendees = [];
                    var alreadyAttended = qrRecord.attendees.some(function(a) { return a.email === user.email; });
                    
                    if (!alreadyAttended) {
                        qrRecord.attendees.push({
                            name: user.name,
                            email: user.email,
                            course: user.course || '',
                            section: user.section || '',
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toTimeString().split(' ')[0]
                        });
                        self.saveData();
                        alert('You have successfully attended! Thanks, ' + user.name);
                    } else {
                        alert('You have already attended this event.');
                    }
                } else if (eventId) {
                    // Also add to event if linked
                    var evt = self.data.events.find(function(e) { return e.id == eventId; });
                    if (evt) {
                        if (!evt.attendees) evt.attendees = [];
                        var alreadyAttended = evt.attendees.some(function(a) { return a.email === user.email; });
                        if (!alreadyAttended) {
                            evt.attendees.push({
                                name: user.name,
                                email: user.email,
                                course: user.course || '',
                                section: user.section || '',
                                date: new Date().toISOString().split('T')[0],
                                rsvp: evt.rsvps && evt.rsvps.indexOf(user.email) > -1
                            });
                            self.saveData();
                            alert('You have successfully attended! Thanks, ' + user.name);
                        } else {
                            alert('You have already attended this event.');
                        }
                    }
                } else {
                    alert('Attendance recorded! Thanks, ' + user.name);
                }
                
                document.getElementById('qr-scan-modal').style.display = 'none';
                self.renderStudentDashboard();
            });

            // Mark Attended (for finished events)
            var markAttendedBtns = document.querySelectorAll('[data-action="mark-attended"]');
            Array.prototype.forEach.call(markAttendedBtns, function(btn) {
                if (btn.classList.contains('listener-attached')) return;
                btn.classList.add('listener-attached');
                btn.addEventListener('click', function() {
                    var evt = self.data.events.find(function(e) { return e.id == btn.dataset.id; });
                    if (evt) {
                        if (!evt.attendees) evt.attendees = [];
                        evt.attendees.push({
                            email: self.currentUser.email,
                            date: new Date().toISOString().split('T')[0],
                            rsvp: evt.rsvps && evt.rsvps.indexOf(self.currentUser.email) > -1
                        });
                        self.saveData();
                        self.renderStudentDashboard();
                    }
                });
            });

            // Do Evaluation Button
            var doEvaluationBtns = document.querySelectorAll('[data-action="do-evaluation"]');
            Array.prototype.forEach.call(doEvaluationBtns, function(btn) {
                if (btn.classList.contains('listener-attached')) return;
                btn.classList.add('listener-attached');
                btn.addEventListener('click', function() {
                    var evt = self.data.events.find(function(e) { return e.id == btn.dataset.id; });
                    if (evt) {
                        document.getElementById('eval-event-title').textContent = evt.title;
                        document.getElementById('eval-link').href = evt.evaluationLink;
                        document.getElementById('evaluation-modal').style.display = 'flex';
                    }
                });
            });

            // Evaluation Form Submission
            var evalForm = document.getElementById('evaluation-form');
            if (evalForm && !evalForm.dataset.listenerAttached) {
                evalForm.dataset.listenerAttached = 'true';
                evalForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var fileInput = document.getElementById('eval-screenshot');
                    var file = fileInput.files[0];
                    var eventTitle = document.getElementById('eval-event-title').textContent;
                    var evt = self.data.events.find(function(e) { return e.title === eventTitle; });
                    
                    if (evt && file) {
                        var reader = new FileReader();
                        reader.onload = function() {
                            if (!evt.evaluations) evt.evaluations = [];
                            evt.evaluations.push({
                                email: self.currentUser.email,
                                screenshot: reader.result,
                                date: new Date().toISOString().split('T')[0]
                            });
                            self.saveData();
                            document.getElementById('evaluation-modal').style.display = 'none';
                            alert('Evaluation submitted successfully!');
                            self.renderStudentDashboard();
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Close modals - reset form
            var closeQrModal = document.getElementById('close-qr-modal');
            if (closeQrModal) {
                closeQrModal.addEventListener('click', function() {
                    document.getElementById('qr-scan-modal').style.display = 'none';
                    document.getElementById('scanned-event').style.display = 'none';
                    document.getElementById('scan-input-section').style.display = 'block';
                    document.getElementById('camera-container').style.display = 'none';
                    document.getElementById('qr-code-input').value = '';
                });
            }
            var closeEvalModal = document.getElementById('close-evaluation-modal');
            if (closeEvalModal) {
                closeEvalModal.addEventListener('click', function() {
                    document.getElementById('evaluation-modal').style.display = 'none';
                });
            }

            // Chat Bot - only for admin
            if (role === 'admin') {
                var chatbotBtn = document.getElementById('chatbot-btn');
                var closeChatbot = document.getElementById('close-chatbot');
                
                if (chatbotBtn) {
                    chatbotBtn.addEventListener('click', function() {
                        document.getElementById('chatbot-modal').style.display = 'flex';
                    });
                }
                if (closeChatbot) {
                    closeChatbot.addEventListener('click', function() {
                        document.getElementById('chatbot-modal').style.display = 'none';
                    });
                }
            }
            
            // Scan QR Button - only for students
            if (role === 'student') {
                var scanQrBtn = document.getElementById('scan-qr-btn');
                if (scanQrBtn) {
                    scanQrBtn.addEventListener('click', function() {
                        var modal = document.getElementById('qr-scan-modal');
                        if (modal) modal.style.display = 'flex';
                    });
                }
            }
            
            var chatbotSend = document.getElementById('chatbot-send');
            if (chatbotSend) {
                chatbotSend.addEventListener('click', function() {
                    var input = document.getElementById('chatbot-input');
                    var msg = input.value.trim();
                    if (msg) {
                        var messagesDiv = document.getElementById('chatbot-messages');
                        messagesDiv.innerHTML += '<div style="background:white;padding:12px;border-radius:8px;margin-bottom:8px;margin-left:auto;max-width:80%;text-align:right;">' + msg + '</div>';
                        
                        // Simple responses based on keywords
                        var responses = [
                            { keywords: ['event', 'schedule', 'when'], response: 'You can check the Events tab to see upcoming events and their schedules.' },
                            { keywords: ['grade', 'grades', 'scores'], response: 'For grades, please contact your professors or check the academic portal.' },
                            { keywords: ['finance', 'fee', 'payment', 'funds'], response: 'You can view your finance details in the Finance tab.' },
                            { keywords: ['complaint', 'report', 'issue'], response: 'You can submit a complaint in the Complaints tab or use the chat to talk to admin.' },
                            { keywords: ['suggestion', 'idea'], response: 'Great! You can submit suggestions in the Suggestions tab.' },
                            { keywords: ['poll', 'vote'], response: 'Check the Polls tab to vote on active polls.' },
                            { keywords: ['hello', 'hi', 'hey'], response: 'Hello! How can I help you today?' },
                            { keywords: ['help'], response: 'I can help with: events, grades, finance, complaints, suggestions, polls. Just ask!' },
                            { keywords: ['thank', 'thanks'], response: 'You\'re welcome! Let me know if you need anything else.' }
                        ];
                        var matched = responses.find(function(r) { return r.keywords.some(function(k) { return msg.toLowerCase().includes(k); }); });
                        var reply = matched ? matched.response : 'I\'m not sure about that. Try asking about events, grades, finance, complaints, suggestions, or polls.';
                        messagesDiv.innerHTML += '<div style="background:#e0e7ff;padding:12px;border-radius:8px;margin-bottom:8px;max-width:80%;"><strong>Assistant:</strong> ' + reply + '</div>';
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                        input.value = '';
                    }
                });
            }

            // Like Announcements
            var likeAnnouncementBtns = document.querySelectorAll('[data-action="like-announcement"]');
            Array.prototype.forEach.call(likeAnnouncementBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var ann = self.data.announcements.find(function(a) { return a.id == btn.dataset.id; });
                    if (ann) {
                        if (!ann.likes) ann.likes = [];
                        if (ann.likes.indexOf(self.currentUser.email) === -1) {
                            ann.likes.push(self.currentUser.email);
                        }
                        self.saveData();
                        self.renderStudentDashboard();
                    }
                });
            });

            // Toggle Comments
            var toggleCommentBtns = document.querySelectorAll('[data-action="toggle-comments"]');
            Array.prototype.forEach.call(toggleCommentBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var section = document.getElementById('comments-' + btn.dataset.id);
                    if (section) {
                        section.style.display = section.style.display === 'none' ? 'block' : 'none';
                    }
                });
            });

            // Submit Comments
            var commentForms = document.querySelectorAll('.comment-form');
            Array.prototype.forEach.call(commentForms, function(form) {
                if (form.classList.contains('listener-attached')) return;
                form.classList.add('listener-attached');
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var input = form.querySelector('input');
                    var content = input.value.trim();
                    var announcementId = form.dataset.announcementId;
                    if (content && announcementId) {
                        if (!self.data.comments) self.data.comments = [];
                        self.data.comments.push({
                            id: Date.now(),
                            announcementId: parseInt(announcementId),
                            email: self.currentUser.email,
                            content: content,
                            date: new Date().toISOString().split('T')[0]
                        });
                        self.saveData();
                        self.renderStudentDashboard();
                    }
                });
            });

            // Vote Polls
            var votePollBtns = document.querySelectorAll('[data-action="vote-poll"]');
            Array.prototype.forEach.call(votePollBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var poll = self.data.polls.find(function(p) { return p.id == btn.dataset.id; });
                    if (poll) {
                        var selected = document.querySelector('input[name="poll-' + poll.id + '"]:checked');
                        if (selected) {
                            poll.votes[selected.value] = (poll.votes[selected.value] || 0) + 1;
                            if (!poll.voted) poll.voted = [];
                            poll.voted.push(self.currentUser.email);
                            if (!self.currentUser.pollsAnswered) self.currentUser.pollsAnswered = [];
                            self.currentUser.pollsAnswered.push(poll.id);
                            localStorage.setItem('cscCurrentUser', JSON.stringify(self.currentUser));
                            self.saveData();
                            self.renderStudentDashboard();
                        }
                    }
                });
            });

            // Upvote Suggestions
            var upvoteSuggestionBtns = document.querySelectorAll('[data-action="upvote-suggestion"]');
            Array.prototype.forEach.call(upvoteSuggestionBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var suggestion = self.data.suggestions.find(function(s) { return s.id == btn.dataset.id; });
                    if (suggestion) {
                        if (!suggestion.hasUpvoted) suggestion.hasUpvoted = [];
                        var idx = suggestion.hasUpvoted.indexOf(self.currentUser.email);
                        if (idx > -1) {
                            suggestion.hasUpvoted.splice(idx, 1);
                            suggestion.upvotes = (suggestion.upvotes || 1) - 1;
                        } else {
                            suggestion.hasUpvoted.push(self.currentUser.email);
                            suggestion.upvotes = (suggestion.upvotes || 0) + 1;
                        }
                        self.saveData();
                        self.renderStudentDashboard();
                    }
                });
            });

            // Submit Suggestion
            var submitSuggestionBtns = document.querySelectorAll('[data-action="submit-suggestion"]');
            Array.prototype.forEach.call(submitSuggestionBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var input = document.getElementById('suggestion-input');
                    var category = document.getElementById('suggestion-category');
                    var anonymous = document.getElementById('anonymous-submit');
                    if (input && input.value.trim()) {
                        var now = new Date();
                        var batch = self.currentUser.batch || '2025-2026';
                        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        var dateFolder = batch + '-' + monthNames[now.getMonth()] + '-' + now.getFullYear();
                        self.data.suggestions.push({
                            id: Date.now(),
                            author: anonymous && anonymous.checked ? 'Anonymous' : self.currentUser.name,
                            email: self.currentUser.email,
                            studentId: self.currentUser.studentId,
                            content: input.value.trim(),
                            date: now.toISOString().split('T')[0],
                            dateFolder: dateFolder,
                            status: 'pending',
                            upvotes: 0,
                            hasUpvoted: [],
                            replies: [],
                            category: category ? category.value : 'Suggestion',
                            anonymous: anonymous ? anonymous.checked : false
                        });
                        self.saveData();
                        input.value = '';
                        self.renderStudentDashboard();
                    }
                });
            });

            // Submit Complaint
            var submitComplaintBtns = document.querySelectorAll('[data-action="submit-complaint"]');
            Array.prototype.forEach.call(submitComplaintBtns, function(btn) {
                if (btn.classList.contains('listener-attached')) return;
                btn.classList.add('listener-attached');
                btn.addEventListener('click', function() {
                    var input = document.getElementById('complaint-input');
                    var fileInput = document.getElementById('complaint-file');
                    var anonymous = document.getElementById('anonymous-complaint');
                    var file = fileInput && fileInput.files[0];
                    
                    function submitComplaint(fileData) {
                        if (input && input.value.trim()) {
                            if (!self.data.complaints) self.data.complaints = [];
                            var now = new Date();
                            var batch = self.currentUser.batch || '2025-2026';
                            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            var dateFolder = batch + '-' + monthNames[now.getMonth()] + '-' + now.getFullYear();
                            self.data.complaints.push({
                                id: Date.now(),
                                author: anonymous && anonymous.checked ? 'Anonymous' : self.currentUser.name,
                                email: self.currentUser.email,
                                content: input.value.trim(),
                                date: now.toISOString().split('T')[0],
                                dateFolder: dateFolder,
                                status: 'pending',
                                replies: [],
                                anonymous: anonymous ? anonymous.checked : false,
                                attachment: fileData || null,
                                attachmentName: file ? file.name : null
                            });
                            self.saveData();
                            input.value = '';
                            if (fileInput) fileInput.value = '';
                            if (anonymous) anonymous.checked = false;
                            self.renderStudentDashboard();
                        }
                    }
                    
                    if (file) {
                        var reader = new FileReader();
                        reader.onload = function() {
                            submitComplaint(reader.result);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        submitComplaint(null);
                    }
                });
            });

            // Download Files
            var downloadFileBtns = document.querySelectorAll('[data-action="download-file"]');
            Array.prototype.forEach.call(downloadFileBtns, function(btn) {
                btn.addEventListener('click', function() {
                    var file = self.data.files.find(function(f) { return f.id == btn.dataset.id; });
                    if (file) {
                        alert('Downloading: ' + file.name + '\nSize: ' + file.size);
                    }
                });
            });
        }

        // Toggle Images in Pending Requests
        var toggleImageBtns = document.querySelectorAll('.toggle-images-btn');
        Array.prototype.forEach.call(toggleImageBtns, function(btn) {
            btn.addEventListener('click', function() {
                var target = document.getElementById(this.dataset.target);
                if (target) {
                    if (target.style.display === 'none') {
                        target.style.display = 'grid';
                        this.innerHTML = '<i class="fas fa-minus"></i> Hide Documents';
                    } else {
                        target.style.display = 'none';
                        this.innerHTML = '<i class="fas fa-images"></i> View Documents';
                    }
                }
            });
        });

        // Image Modal Close
        var closeImageModal = document.getElementById('close-image-modal');
        var imageModal = document.getElementById('image-modal');
        if (closeImageModal && imageModal) {
            closeImageModal.addEventListener('click', function() {
                imageModal.style.display = 'none';
            });
            imageModal.addEventListener('click', function(e) {
                if (e.target === imageModal) {
                    imageModal.style.display = 'none';
                }
            });
        }

        // Modal Buttons - Create Event
        var eventModal = document.getElementById('event-modal');
        var createEventBtn = document.getElementById('create-event-btn');
        var closeEventModal = document.getElementById('close-event-modal');
        var eventForm = document.getElementById('event-form');

        if (createEventBtn) {
            createEventBtn.addEventListener('click', function() {
                document.getElementById('event-form').dataset.editId = '';
                document.getElementById('event-submit-btn').textContent = 'Create Event';
                document.querySelector('.modal-header h3').textContent = 'Create Event';
                eventForm.reset();
                eventModal.style.display = 'flex';
            });
        }
        
        if (closeEventModal && eventModal) {
            closeEventModal.addEventListener('click', function() {
                eventModal.style.display = 'none';
            });
        }
        
        // Prevent duplicate event form handler
        if (eventForm && !eventForm.dataset.listenerAttached) {
            eventForm.dataset.listenerAttached = 'true';
            eventForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var title = document.getElementById('event-title').value;
                var batch = document.getElementById('event-batch').value;
                var date = document.getElementById('event-date').value;
                var time = document.getElementById('event-time').value;
                var location = document.getElementById('event-location').value;
                
                if (!title || !batch || !date || !time || !location) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                var categorySelect = document.getElementById('event-category-select').value;
                var categoryCustom = document.getElementById('event-category-custom').value;
                var category = categoryCustom || categorySelect || 'General';
                var newEvent = {
                    id: document.getElementById('event-form').dataset.editId ? parseInt(document.getElementById('event-form').dataset.editId) : Date.now(),
                    title: title,
                    category: category,
                    status: document.getElementById('event-status').value || 'upcoming',
                    batch: batch,
                    date: date,
                    time: time,
                    location: location,
                    description: document.getElementById('event-description').value || '',
                    rsvps: [],
                    pinned: document.getElementById('event-pin') ? document.getElementById('event-pin').checked : false
                };
                
                if (self.registerData && self.registerData.eventMedia) {
                    newEvent.media = self.registerData.eventMedia;
                    newEvent.mediaType = self.registerData.eventMediaType;
                }
                
                var editId = document.getElementById('event-form').dataset.editId;
                if (editId) {
                    var idx = self.data.events.findIndex(function(e) { return e.id == editId; });
                    if (idx > -1) {
                        var existingRsvps = self.data.events[idx].rsvps;
                        newEvent.rsvps = existingRsvps || [];
                    }
                }
                
                if (editId) {
                    var idx = self.data.events.findIndex(function(e) { return e.id == editId; });
                    if (idx > -1) self.data.events[idx] = newEvent;
                } else {
                    self.data.events.push(newEvent);
                }
                
                self.saveData();
                eventModal.style.display = 'none';
                eventForm.reset();
                if (self.registerData) {
                    self.registerData.eventMedia = null;
                    self.registerData.eventMediaType = null;
                }
                delete document.getElementById('event-form').dataset.editId;
                self.renderAdminDashboard();
            });
        }
        
        // Calendar Navigation
        var calendarPrevBtns = document.querySelectorAll('[data-calendar="prev"]');
        Array.prototype.forEach.call(calendarPrevBtns, function(btn) {
            btn.onclick = function() {
                self.currentDate.setMonth(self.currentDate.getMonth() - 1);
                if (role === 'admin') self.renderAdminDashboard();
                else self.renderStudentDashboard();
        });

        var calendarNextBtns = document.querySelectorAll('[data-calendar="next"]');
        Array.prototype.forEach.call(calendarNextBtns, function(btn) {
            btn.onclick = function() {
                self.currentDate.setMonth(self.currentDate.getMonth() + 1);
                if (role === 'admin') self.renderAdminDashboard();
                else self.renderStudentDashboard();
        });

        // Modal Event Listeners
        
        // Event Media Upload
        var eventMediaInput = document.getElementById('event-media-input');
        var eventMediaWrapper = document.getElementById('event-media-upload');
        if (eventMediaWrapper && eventMediaInput) {
            eventMediaWrapper.addEventListener('click', function() {
                eventMediaInput.click();
            });
        }
        if (eventMediaInput) {
            eventMediaInput.addEventListener('change', function() {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var preview = document.getElementById('event-media-preview');
                        var removeBtn = document.getElementById('remove-event-media');
                        if (preview) {
                            if (file.type.startsWith('image/')) {
                                preview.innerHTML = '<img src="' + e.target.result + '" style="max-width:120px;max-height:120px;border-radius:8px;">';
                            } else {
                                preview.innerHTML = '<div style="padding:8px;background:var(--bg-color);border-radius:8px;"><i class="fas fa-video"></i> Video uploaded</div>';
                            }
                            preview.classList.add('show');
                        }
                        if (removeBtn) removeBtn.style.display = 'block';
                        var wrapper = document.getElementById('event-media-upload');
                        if (wrapper) wrapper.classList.add('has-file');
                        self.registerData = self.registerData || {};
                        self.registerData.eventMedia = e.target.result;
                        self.registerData.eventMediaType = file.type.startsWith('video/') ? 'video' : 'image';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Prevent duplicate form handlers in case element was already processed
        if (eventForm && !eventForm.dataset.listenerAttached) {
            eventForm.dataset.listenerAttached = 'true';
            eventForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var title = document.getElementById('event-title').value;
                var batch = document.getElementById('event-batch').value;
                var date = document.getElementById('event-date').value;
                var time = document.getElementById('event-time').value;
                var location = document.getElementById('event-location').value;
                
                if (!title || !batch || !date || !time || !location) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                var categorySelect = document.getElementById('event-category-select').value;
                var categoryCustom = document.getElementById('event-category-custom').value;
                var category = categoryCustom || categorySelect || 'General';
                var newEvent = {
                    id: document.getElementById('event-form').dataset.editId ? parseInt(document.getElementById('event-form').dataset.editId) : Date.now(),
                    title: title,
                    category: category,
                    status: document.getElementById('event-status').value || 'upcoming',
                    batch: batch,
                    date: date,
                    time: time,
                    location: location,
                    description: document.getElementById('event-description').value || '',
                    rsvps: [],
                    pinned: document.getElementById('event-pin') ? document.getElementById('event-pin').checked : false
                };
                
                if (self.registerData && self.registerData.eventMedia) {
                    newEvent.media = self.registerData.eventMedia;
                    newEvent.mediaType = self.registerData.eventMediaType;
                }
                
                var editId = document.getElementById('event-form').dataset.editId;
                if (editId) {
                    var idx = self.data.events.findIndex(function(e) { return e.id == editId; });
                    if (idx > -1) {
                        var existingRsvps = self.data.events[idx].rsvps;
                        newEvent.rsvps = existingRsvps || [];
                    }
                }
                
                if (editId) {
                    var idx = self.data.events.findIndex(function(e) { return e.id == editId; });
                    if (idx > -1) self.data.events[idx] = newEvent;
                } else {
                    self.data.events.push(newEvent);
                }
                
                self.saveData();
                eventModal.style.display = 'none';
                eventForm.reset();
                if (self.registerData) {
                    self.registerData.eventMedia = null;
                    self.registerData.eventMediaType = null;
                }
                delete document.getElementById('event-form').dataset.editId;
                self.renderAdminDashboard();
            });
        }

        var annModal = document.getElementById('announcement-modal');
        var createAnnBtn = document.getElementById('create-announcement-btn');
        var closeAnnModal = document.getElementById('close-announcement-modal');
        var annForm = document.getElementById('announcement-form');

        if (createAnnBtn && annModal) {
            createAnnBtn.addEventListener('click', function() {
                annModal.style.display = 'flex';
            });
        }
        
        if (closeAnnModal && annModal) {
            closeAnnModal.addEventListener('click', function() {
                annModal.style.display = 'none';
            });
        }
        
        // Announcement Image Upload with wrapper click
        var announcementImageWrapper = document.getElementById('announcement-image-upload');
        var announcementImageInput = document.getElementById('announcement-image-input');
        if (announcementImageWrapper && announcementImageInput) {
            announcementImageWrapper.addEventListener('click', function() {
                announcementImageInput.click();
            });
            announcementImageInput.addEventListener('change', function() {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        self.registerData = self.registerData || {};
                        self.registerData.announcementImage = e.target.result;
                        var preview = document.getElementById('announcement-image-preview');
                        var removeBtn = document.getElementById('remove-announcement-image');
                        if (preview) {
                            preview.innerHTML = '<img src="' + e.target.result + '" style="max-width:120px;max-height:120px;border-radius:8px;">';
                            preview.classList.add('show');
                        }
                        if (removeBtn) removeBtn.style.display = 'block';
                        if (announcementImageWrapper) announcementImageWrapper.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Announcement Video Upload with wrapper click
        var announcementVideoWrapper = document.getElementById('announcement-video-upload');
        var announcementVideoInput = document.getElementById('announcement-video-input');
        if (announcementVideoWrapper && announcementVideoInput) {
            announcementVideoWrapper.addEventListener('click', function() {
                announcementVideoInput.click();
            });
            announcementVideoInput.addEventListener('change', function() {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        self.registerData = self.registerData || {};
                        self.registerData.announcementVideo = e.target.result;
                        var preview = document.getElementById('announcement-video-preview');
                        var removeBtn = document.getElementById('remove-announcement-video');
                        if (preview) {
                            preview.innerHTML = '<div style="padding:8px;background:var(--bg-color);border-radius:8px;"><i class="fas fa-video"></i> Video uploaded</div>';
                            preview.classList.add('show');
                        }
                        if (removeBtn) removeBtn.style.display = 'block';
                        if (announcementVideoWrapper) announcementVideoWrapper.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Announcement Image Remove Button
        var removeAnnImageBtn = document.getElementById('remove-announcement-image');
        if (removeAnnImageBtn) {
            removeAnnImageBtn.addEventListener('click', function() {
                self.registerData = self.registerData || {};
                self.registerData.announcementImage = null;
                var preview = document.getElementById('announcement-image-preview');
                if (preview) preview.innerHTML = '';
                this.style.display = 'none';
                var wrapper = document.getElementById('announcement-image-upload');
                if (wrapper) wrapper.classList.remove('has-file');
            });
        }
        
        // Announcement Video Remove Button
        var removeAnnVideoBtn = document.getElementById('remove-announcement-video');
        if (removeAnnVideoBtn) {
            removeAnnVideoBtn.addEventListener('click', function() {
                self.registerData = self.registerData || {};
                self.registerData.announcementVideo = null;
                var preview = document.getElementById('announcement-video-preview');
                if (preview) preview.innerHTML = '';
                this.style.display = 'none';
                var wrapper = document.getElementById('announcement-video-upload');
                if (wrapper) wrapper.classList.remove('has-file');
            });
        }
        
        // Event Media Remove Button
        var removeEventMediaBtn = document.getElementById('remove-event-media');
        if (removeEventMediaBtn) {
            removeEventMediaBtn.addEventListener('click', function() {
                self.registerData = self.registerData || {};
                self.registerData.eventMedia = null;
                self.registerData.eventMediaType = null;
                var preview = document.getElementById('event-media-preview');
                if (preview) preview.innerHTML = '';
                this.style.display = 'none';
                var wrapper = document.getElementById('event-media-upload');
                if (wrapper) wrapper.classList.remove('has-file');
            });
        }

        // Announcement Files Upload with wrapper click
        var announcementFilesWrapper = document.getElementById('announcement-files-upload');
        var announcementFilesInput = document.getElementById('announcement-files-input');
        if (announcementFilesWrapper && announcementFilesInput) {
            announcementFilesWrapper.addEventListener('click', function() {
                announcementFilesInput.click();
            });
        }
        
        // Attach announcement file upload handlers
        this.attachFileUpload('announcement-files-input', 'announcement-files-upload', 'announcement-files-preview');
        
        if (annForm) {
            annForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var newAnn = {
                    id: Date.now(),
                    title: document.getElementById('announcement-title').value,
                    content: document.getElementById('announcement-content').value,
                    date: new Date().toISOString().split('T')[0],
                    pinned: document.getElementById('announcement-pin') ? document.getElementById('announcement-pin').checked : false,
                    scheduledDate: null,
                    likes: [],
                    readBy: []
                };
                
                // Check for images in registerData (uploaded via custom wrapper) or file inputs
                if (self.registerData && self.registerData.announcementImage) {
                    newAnn.image = self.registerData.announcementImage;
                }
                if (self.registerData && self.registerData.announcementVideo) {
                    newAnn.video = self.registerData.announcementVideo;
                }
                
                finishAnnouncement();
                
                function finishAnnouncement() {
                    // Reset announcement media from registerData
                    if (self.registerData) {
                        self.registerData.announcementImage = null;
                        self.registerData.announcementVideo = null;
                        self.registerData.announcementFiles = null;
                    }
                    self.data.announcements.unshift(newAnn);
                    self.saveData();
                    annModal.style.display = 'none';
                    annForm.reset();
                    
                    // Clear previews
                    var imgPreview = document.getElementById('announcement-image-preview');
                    var vidPreview = document.getElementById('announcement-video-preview');
                    if (imgPreview) imgPreview.innerHTML = '';
                    if (vidPreview) vidPreview.innerHTML = '';
                    
                    self.renderAdminDashboard();
                }
            });
        }

        var fileModal = document.getElementById('file-modal');
        var createFileBtn = document.getElementById('create-file-btn');
        var closeFileModal = document.getElementById('close-file-modal');
        var fileForm = document.getElementById('file-form');

        if (createFileBtn && fileModal) {
            createFileBtn.addEventListener('click', function() {
                fileModal.style.display = 'flex';
            });
        }
        
        if (closeFileModal && fileModal) {
            closeFileModal.addEventListener('click', function() {
                fileModal.style.display = 'none';
            });
        }
        if (fileForm) {
            fileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var fileInput = document.getElementById('file-input');
                var file = fileInput.files[0];
                if (!file) {
                    alert('Please select a file');
                    return;
                }
                var newFile = {
                    id: Date.now(),
                    name: file.name,
                    category: document.getElementById('file-category').value,
                    type: file.name.split('.').pop().toLowerCase(),
                    size: (file.size / 1024).toFixed(1) + ' KB',
                    version: '1.0',
                    updatedAt: new Date().toISOString().split('T')[0]
                };
                self.data.files.push(newFile);
                self.saveData();
                fileModal.style.display = 'none';
                fileForm.reset();
                self.renderAdminDashboard();
            });
        }

        // Files/Media Tab Handlers
        var tabFiles = document.getElementById('tab-files');
        var tabMedia = document.getElementById('tab-media');
        if (tabFiles) {
            tabFiles.addEventListener('click', function() {
                self.filesTab = 'files';
                self.renderAdminDashboard();
            });
        }
        if (tabMedia) {
            tabMedia.addEventListener('click', function() {
                self.filesTab = 'media';
                self.renderAdminDashboard();
            });
        }

        // Media Upload Modal for Sidebar
        var uploadMediaBtn = document.getElementById('upload-media-btn');
        var mediaModal = document.getElementById('media-modal');
        var closeMediaModal = document.getElementById('close-media-modal');
        var mediaForm = document.getElementById('media-form');

        if (uploadMediaBtn && mediaModal) {
            uploadMediaBtn.addEventListener('click', function() {
                mediaModal.style.display = 'flex';
            });
        }
        
        if (closeMediaModal && mediaModal) {
            closeMediaModal.addEventListener('click', function() {
                mediaModal.style.display = 'none';
            });
        }

        var mediaFileWrapper = document.getElementById('media-file-upload');
        var mediaFileInput = document.getElementById('media-file-input');
        if (mediaFileWrapper && mediaFileInput) {
            mediaFileWrapper.addEventListener('click', function() {
                mediaFileInput.click();
            });
            mediaFileInput.addEventListener('change', function() {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var preview = document.getElementById('media-file-preview');
                        if (preview) {
                            if (file.type.startsWith('image/')) {
                                preview.innerHTML = '<img src="' + e.target.result + '" style="max-width:120px;max-height:120px;border-radius:8px;">';
                            } else {
                                preview.innerHTML = '<div style="padding:8px;background:var(--bg-color);border-radius:8px;"><i class="fas fa-video"></i> Video ready</div>';
                            }
                            preview.classList.add('show');
                        }
                        if (mediaFileWrapper) mediaFileWrapper.classList.add('has-file');
                        self.registerData = self.registerData || {};
                        self.registerData.sidebarMedia = e.target.result;
                        self.registerData.sidebarMediaType = file.type.startsWith('video/') ? 'video' : 'image';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (mediaForm) {
            mediaForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (!self.registerData || !self.registerData.sidebarMedia) {
                    alert('Please upload a media file');
                    return;
                }
                var newMedia = {
                    id: Date.now(),
                    title: document.getElementById('media-title').value,
                    type: document.getElementById('media-type').value,
                    url: self.registerData.sidebarMedia,
                    date: new Date().toISOString().split('T')[0]
                };
                if (!self.data.mediaContent) self.data.mediaContent = [];
                self.data.mediaContent.push(newMedia);
                self.saveData();
                mediaModal.style.display = 'none';
                mediaForm.reset();
                self.registerData.sidebarMedia = null;
                self.renderAdminDashboard();
            });
        }

        var pollModal = document.getElementById('poll-modal');
        var createPollBtn = document.getElementById('create-poll-btn');
        var closePollModal = document.getElementById('close-poll-modal');
        var pollForm = document.getElementById('poll-form');

        if (createPollBtn && pollModal) {
            createPollBtn.addEventListener('click', function() {
                pollModal.style.display = 'flex';
            });
        }
        if (closePollModal && pollModal) {
            closePollModal.addEventListener('click', function() {
                pollModal.style.display = 'none';
            });
        }
        
        // Poll type toggle
        var pollTypeSelect = document.getElementById('poll-type');
        var pollLinkGroup = document.getElementById('poll-link-group');
        var pollOptionsGroup = document.getElementById('poll-options-group');
        if (pollTypeSelect) {
            pollTypeSelect.addEventListener('change', function() {
                if (this.value === 'manual') {
                    pollLinkGroup.style.display = 'none';
                    pollOptionsGroup.style.display = 'block';
                    document.getElementById('poll-link').required = false;
                    document.getElementById('poll-options').required = true;
                } else {
                    pollLinkGroup.style.display = 'block';
                    pollOptionsGroup.style.display = 'none';
                    document.getElementById('poll-link').required = true;
                    document.getElementById('poll-options').required = false;
                }
            });
        }
        
        if (pollForm) {
            pollForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var question = document.getElementById('poll-question').value;
                var pollType = document.getElementById('poll-type').value;
                var deadline = document.getElementById('poll-deadline').value || '2026-12-31';
                var active = document.getElementById('poll-active') ? document.getElementById('poll-active').checked : true;
                
                var newPoll = {
                    id: Date.now(),
                    question: question,
                    type: pollType || 'link',
                    date: new Date().toISOString().split('T')[0],
                    deadline: deadline,
                    active: active
                };
                
                if (pollType === 'manual') {
                    var optionsStr = document.getElementById('poll-options').value;
                    var optionsArr = optionsStr.split(',').map(function(o) { return o.trim(); }).filter(function(o) { return o; });
                    newPoll.options = optionsArr;
                    newPoll.votes = {};
                    optionsArr.forEach(function(opt) { newPoll.votes[opt] = 0; });
                } else {
                    newPoll.link = document.getElementById('poll-link').value;
                }
                
                self.data.polls.push(newPoll);
                self.saveData();
                pollModal.style.display = 'none';
                pollForm.reset();
                self.renderAdminDashboard();
            });
        }

        // Media
        var deleteMediaBtns = document.querySelectorAll('[data-action="delete-media"]');
        Array.prototype.forEach.call(deleteMediaBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (confirm('Delete this media?')) {
                    self.data.mediaContent = (self.data.mediaContent || []).filter(function(m) { return m.id != btn.dataset.id; });
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Event Search, Sort, and Batch Filter
        var eventSearch = document.getElementById('event-search');
        var eventSort = document.getElementById('event-sort');
        var eventBatchFilter = document.getElementById('event-batch-filter');
        
        if (eventSearch) {
            eventSearch.value = self.currentFilter.eventSearch || '';
            if (!eventSearch.listenerAttached) {
                eventSearch.listenerAttached = true;
                eventSearch.addEventListener('input', function() {
                    self.currentFilter.eventSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (eventSort) {
            eventSort.value = self.currentSort.eventSort || '';
            if (!eventSort.listenerAttached) {
                eventSort.listenerAttached = true;
                eventSort.addEventListener('change', function() {
                    self.currentSort.eventSort = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (eventBatchFilter) {
            eventBatchFilter.value = self.currentFilter.eventBatch || '';
            if (!eventBatchFilter.listenerAttached) {
                eventBatchFilter.listenerAttached = true;
                eventBatchFilter.addEventListener('change', function() {
                    self.currentFilter.eventBatch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }

        // Announcement Search and Sort
        var announcementSearch = document.getElementById('announcement-search');
        var announcementSort = document.getElementById('announcement-sort');
        if (announcementSearch) {
            announcementSearch.value = self.currentFilter.announcementSearch || '';
            if (!announcementSearch.listenerAttached) {
                announcementSearch.listenerAttached = true;
                announcementSearch.addEventListener('input', function() {
                    self.currentFilter.announcementSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (announcementSort) {
            announcementSort.value = self.currentSort.announcementSort || 'date-desc';
            if (!announcementSort.listenerAttached) {
                announcementSort.listenerAttached = true;
                announcementSort.addEventListener('change', function() {
                    self.currentSort.announcementSort = this.value;
                    self.renderAdminDashboard();
                });
            }
        }

        // Student Search and Filters
        var studentSearch = document.getElementById('student-search');
        var studentCourse = document.getElementById('student-course');
        var studentSection = document.getElementById('student-section');
        var studentBatch = document.getElementById('student-batch');
        
        if (studentSearch) {
            studentSearch.value = self.currentFilter.studentSearch || '';
            if (!studentSearch.listenerAttached) {
                studentSearch.listenerAttached = true;
                studentSearch.addEventListener('input', function() {
                    self.currentFilter.studentSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (studentCourse) {
            studentCourse.value = self.currentFilter.studentCourse || '';
            if (!studentCourse.listenerAttached) {
                studentCourse.listenerAttached = true;
                studentCourse.addEventListener('change', function() {
                    self.currentFilter.studentCourse = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (studentSection) {
            studentSection.value = self.currentFilter.studentSection || '';
            if (!studentSection.listenerAttached) {
                studentSection.listenerAttached = true;
                studentSection.addEventListener('change', function() {
                    self.currentFilter.studentSection = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (studentBatch) {
            studentBatch.value = self.currentFilter.studentBatch || '';
            if (!studentBatch.listenerAttached) {
                studentBatch.listenerAttached = true;
                studentBatch.addEventListener('change', function() {
                    self.currentFilter.studentBatch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }

        // End Semester Button
        var endSemesterBtn = document.getElementById('end-semester-btn');
        var endSemesterModal = document.getElementById('end-semester-modal');
        var closeEndSemesterModal = document.getElementById('close-end-semester-modal');
        
        if (endSemesterBtn && endSemesterModal) {
            endSemesterBtn.addEventListener('click', function() {
                endSemesterModal.style.display = 'flex';
            });
        }
        
        if (closeEndSemesterModal && endSemesterModal) {
            closeEndSemesterModal.addEventListener('click', function() {
                endSemesterModal.style.display = 'none';
            });
        }
         
        // Set Funds Button
        var setFundsBtn = document.getElementById('set-funds-btn');
        if (setFundsBtn) {
            setFundsBtn.addEventListener('click', function() {
                var currentFunds = self.data.finance ? self.data.finance.currentFunds : 0;
                document.getElementById('funds-amount').value = currentFunds;
                var fundsModal = document.getElementById('funds-modal');
                var closeFundsModal = document.getElementById('close-funds-modal');
                var fundsForm = document.getElementById('funds-form');
                
                fundsModal.style.display = 'flex';
                
                closeFundsModal.addEventListener('click', function() {
                    fundsModal.style.display = 'none';
                });
                
                fundsForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var newFunds = parseFloat(document.getElementById('funds-amount').value);
                    if (!isNaN(newFunds) && newFunds >= 0) {
                        if (!self.data.finance) self.data.finance = { currentFunds: 0, transactions: [] };
                        var totalExpenses = self.data.finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
                        var totalFundsRaised = self.data.finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
                        self.data.finance.currentFunds = newFunds - totalExpenses + totalFundsRaised;
                        self.saveData();
                        fundsModal.style.display = 'none';
                        self.renderAdminDashboard();
                    }
                });
            });
        }

        // Reports Modal
        var uploadReportBtn = document.getElementById('upload-report-btn');
        var reportModal = document.getElementById('report-modal');
        var closeReportModal = document.getElementById('close-report-modal');
        var reportForm = document.getElementById('report-form');

        if (uploadReportBtn && reportModal) {
            uploadReportBtn.addEventListener('click', function() {
                reportModal.style.display = 'flex';
            });
        }
        if (closeReportModal && reportModal) {
            closeReportModal.addEventListener('click', function() {
                reportModal.style.display = 'none';
            });
        }
        if (reportForm) {
            reportForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var name = document.getElementById('report-name').value;
                var category = document.getElementById('report-category').value;
                var fileInput = document.getElementById('report-file');
                var file = fileInput.files[0];
                
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        if (!self.data.reportFiles) self.data.reportFiles = [];
                        self.data.reportFiles.push({
                            id: Date.now(),
                            name: name,
                            category: category,
                            date: new Date().toISOString().split('T')[0],
                            fileData: evt.target.result,
                            size: (file.size / 1024).toFixed(1) + ' KB'
                        });
                        self.saveData();
                        reportModal.style.display = 'none';
                        reportForm.reset();
                        self.renderAdminDashboard();
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Delete Report
        var deleteReportBtns = document.querySelectorAll('[data-action="delete-report"]');
        Array.prototype.forEach.call(deleteReportBtns, function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (confirm('Delete this report?')) {
                    self.data.reportFiles = self.data.reportFiles.filter(function(r) { return r.id != btn.dataset.id; });
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        });

        // Finance Modal
        var addTransBtn = document.getElementById('add-transaction-btn');
        var resetFinanceBtn = document.getElementById('reset-finance-btn');
        var financeModal = document.getElementById('finance-modal');
        var closeFinanceModal = document.getElementById('close-finance-modal');
        var financeForm = document.getElementById('finance-form');
        
        if (resetFinanceBtn) {
            resetFinanceBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to reset all finance data? This will clear current funds, all expenses, and funds raised.')) {
                    self.data.finance = { currentFunds: 0, transactions: [] };
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        }

        if (addTransBtn && financeModal) {
            addTransBtn.addEventListener('click', function() {
                financeModal.style.display = 'flex';
            });
        }
        if (closeFinanceModal && financeModal) {
            closeFinanceModal.addEventListener('click', function() {
                financeModal.style.display = 'none';
            });
        }
        if (financeForm && !financeForm.dataset.listenerAttached) {
            financeForm.dataset.listenerAttached = 'true';
            financeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var type = document.getElementById('finance-type').value;
                var eventId = document.getElementById('finance-event').value;
                var amount = parseFloat(document.getElementById('finance-amount').value);
                var description = document.getElementById('finance-description').value;
                var editId = financeForm.dataset.editId;
                
                var eventTitle = '';
                if (eventId) {
                    var evt = self.data.events.find(function(e) { return e.id == eventId; });
                    if (evt) eventTitle = evt.title;
                }
                
                if (!self.data.finance) self.data.finance = { currentFunds: 0, transactions: [] };
                
                if (editId) {
                    var idx = self.data.finance.transactions.findIndex(function(t) { return t.id == editId; });
                    if (idx > -1) {
                        self.data.finance.transactions[idx] = {
                            id: parseInt(editId),
                            type: type,
                            eventId: eventId,
                            eventTitle: eventTitle,
                            amount: amount,
                            description: description,
                            date: self.data.finance.transactions[idx].date
                        };
                    }
                    delete financeForm.dataset.editId;
                } else {
                    self.data.finance.transactions.push({
                        id: Date.now(),
                        type: type,
                        eventId: eventId,
                        eventTitle: eventTitle,
                        amount: amount,
                        description: description,
                        date: new Date().toISOString().split('T')[0]
                    });
                    
                    if (type === 'expense') {
                        self.data.finance.currentFunds -= amount;
                    } else if (type === 'funds_raised') {
                        self.data.finance.currentFunds += amount;
                    }
                }
                
                self.saveData();
                financeModal.style.display = 'none';
                financeForm.reset();
                self.renderAdminDashboard();
            });
        }

        // Complaint Search and Filter
        var complaintSearch = document.getElementById('complaint-search');
        var complaintStatusFilter = document.getElementById('complaint-status-filter');
        if (complaintSearch) {
            complaintSearch.value = self.currentFilter.complaintSearch || '';
            if (!complaintSearch.listenerAttached) {
                complaintSearch.listenerAttached = true;
                complaintSearch.addEventListener('input', function() {
                    self.currentFilter.complaintSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (complaintStatusFilter) {
            complaintStatusFilter.value = self.currentFilter.complaintStatus || '';
            if (!complaintStatusFilter.listenerAttached) {
                complaintStatusFilter.listenerAttached = true;
                complaintStatusFilter.addEventListener('change', function() {
                    self.currentFilter.complaintStatus = this.value;
                    self.renderAdminDashboard();
                });
            }
        }

        // Complaint Modals - Admin
        var closeComplaintDetailModal = document.getElementById('close-complaint-detail-modal');
        var complaintDetailModal = document.getElementById('complaint-detail-modal');
        if (closeComplaintDetailModal && complaintDetailModal) {
            closeComplaintDetailModal.addEventListener('click', function() {
                complaintDetailModal.style.display = 'none';
            });
        }

        var closeComplaintChatModal = document.getElementById('close-complaint-chat-modal');
        var complaintChatModal = document.getElementById('complaint-chat-modal');
        if (closeComplaintChatModal && complaintChatModal) {
            closeComplaintChatModal.addEventListener('click', function() {
                complaintChatModal.style.display = 'none';
            });
        }

        // Complaint Modal - Student
        var closeComplaintStatusModal = document.getElementById('close-complaint-status-modal');
        var complaintStatusModal = document.getElementById('complaint-status-modal');
        if (closeComplaintStatusModal && complaintStatusModal) {
            closeComplaintStatusModal.addEventListener('click', function() {
                complaintStatusModal.style.display = 'none';
            });
        }

// Student - Download Report
        var downloadReportBtns = document.querySelectorAll('[data-action="download-report"]');
        Array.prototype.forEach.call(downloadReportBtns, function(btn) {
            btn.addEventListener('click', function() {
                var report = self.data.reportFiles.find(function(r) { return r.id == btn.dataset.id; });
                if (report && report.fileData) {
                    var link = document.createElement('a');
                    link.href = report.fileData;
                    link.download = report.name + '.pdf';
                    link.click();
                }
            });
        });
    } catch(e) {
        console.error('Error in attachDashboardListeners:', e);
    }
    }
}; // Added closing brace for App object

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
