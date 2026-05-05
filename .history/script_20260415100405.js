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
    tempAdminPic: null,

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
                if (!this.data.qrCodes) this.data.qrCodes = [];
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
                { id: 1, name: 'Admin User', email: 'admin@csc.com', password: 'admin123', role: 'admin', adminRole: 'Super Admin', studentId: 'ADM001', active: true, createdAt: '2026-01-01' },
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
                document.querySelectorAll('.dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
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
                        if (!user.adminRole && user.role === 'admin') {
                            user.adminRole = 'Admin';
                            self.saveData();
                        }
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
                        '<div class="form-group"><label class="form-label">Birthday</label>' +
                        '<input type="date" class="form-input" id="register-birthday"></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Course *</label>' +
                        '<select class="form-input" id="register-course" required>' +
                        '<option value="">Select Course</option>' +
                        '<option value="BSIT">BSIT</option>' +
                        '<option value="BSCPE">BSCPE</option>' +
                        '<option value="BSBA">BSBA</option>' +
                        '<option value="BSAIS">BSAIS</option>' +
                        '<option value="BSHM">BSHM</option></select></div>' +
                        '<div class="form-group"><label class="form-label">Block *</label>' +
                        '<select class="form-input" id="register-block" required>' +
                        '<option value="">Select Block</option>' +
                        '<option value="101">101</option>' +
                        '<option value="102">102</option>' +
                        '<option value="201">201</option>' +
                        '<option value="202">202</option>' +
                        '<option value="301">301</option>' +
                        '<option value="302">302</option>' +
                        '<option value="401">401</option>' +
                        '<option value="402">402</option></select></div></div>' +
                        '<div class="form-group"><label class="form-label">Section *</label>' +
                        '<input type="text" class="form-input" id="register-section" placeholder="Enter Section (e.g., A, B, C, D)" required></div>' +
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
                var birthday = document.getElementById('register-birthday').value;
                var course = document.getElementById('register-course').value;
                var block = document.getElementById('register-block').value;
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
                    birthday: birthday,
                    course: course,
                    block: block,
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
                    document.querySelectorAll('.otp-input').forEach(function(inp) { inp.classList.add('error'); });
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
                    block: self.registerData.block,
                    section: self.registerData.section,
                    birthday: self.registerData.birthday,
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
                self.registerData = null;
                
                if (successEl) {
                    successEl.textContent = 'Email verified! Your account is pending admin approval.';
                    successEl.style.display = 'block';
                }
                
                setTimeout(function() { 
                    self.renderPendingApproval(); 
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

        // Student Toggle (Activate/Deactivate)
        document.querySelectorAll('[data-action="toggle-student"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (self.currentUser.adminRole !== 'Super Admin') {
                    alert('Only Super Admin can perform this action!');
                    return;
                }
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    student.active = !student.active;
                    self.saveData();
                    self.renderAdminDashboard();
                    alert(student.name + ' has been ' + (student.active ? 'activated' : 'deactivated') + '!');
                }
            });
        });

        // Student Promote to Admin
        document.querySelectorAll('[data-action="promote-student"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (self.currentUser.adminRole !== 'Super Admin') {
                    alert('Only Super Admin can promote students!');
                    return;
                }
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    var newRole = prompt('Enter admin role for ' + student.name + ':\n\n1. Admin\n2. Super Admin\n3. Adviser\n4. Student Affair Officer\n5. Principal\n6. Administrator');
                    var roleMap = {'1':'Admin', '2':'Super Admin', '3':'Adviser', '4':'Student Affair Officer', '5':'Principal', '6':'Administrator'};
                    var selectedRole = roleMap[newRole];
                    if (selectedRole) {
                        if (confirm('Are you sure you want to promote ' + student.name + ' to ' + selectedRole + '?')) {
                            student.role = 'admin';
                            student.adminRole = selectedRole;
                            self.saveData();
                            self.renderAdminDashboard();
                            alert(student.name + ' has been promoted to ' + selectedRole + '!');
                        }
                    }
                }
            });
        });

        // Student Delete
        document.querySelectorAll('[data-action="delete-student"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                if (self.currentUser.adminRole !== 'Super Admin') {
                    alert('Only Super Admin can delete students!');
                    return;
                }
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    if (confirm('Are you sure you want to delete ' + student.name + '? This action cannot be undone.')) {
                        var index = self.data.users.findIndex(function(u) { return u.id === studentId; });
                        if (index > -1) {
                            self.data.users.splice(index, 1);
                            self.saveData();
                            self.renderAdminDashboard();
                            alert(student.name + ' has been deleted.');
                        }
                    }
                }
            });
        });

        // Organization Modal
        var addOrgBtn = document.getElementById('add-org-member-btn');
        var addOrgModal = document.getElementById('add-org-member-modal');
        var closeAddOrgModal = document.getElementById('close-add-org-modal');
        var addOrgForm = document.getElementById('add-org-form');

        if (addOrgBtn && addOrgModal) {
            addOrgBtn.addEventListener('click', function() {
                addOrgModal.style.display = 'flex';
            });
        }
        if (closeAddOrgModal && addOrgModal) {
            closeAddOrgModal.addEventListener('click', function() {
                addOrgModal.style.display = 'none';
            });
        }
        if (addOrgForm) {
            addOrgForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var studentId = parseInt(document.getElementById('org-student-select').value);
                var position = document.getElementById('org-position').value;
                var committee = document.getElementById('org-committee').value;

                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    if (!student.organization) student.organization = {};
                    student.organization.position = position;
                    student.organization.committee = committee;
                    self.saveData();
                    addOrgModal.style.display = 'none';
                    self.renderAdminDashboard();
                    alert('Member added to organization!');
                }
            });
        }
    },

    renderAddAdmin: function() {
        var self = this;
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="add-new-admin-btn"><i class="fas fa-plus"></i> Add Administrator</button>' +
            '</div>' +
            '<div style="margin-top:20px;">' +
            '<h3 style="font-size:16px;margin-bottom:16px;">Administrators</h3>' +
            '<div class="table-container">' +
            '<table class="data-table">' +
            '<thead><tr><th>Photo</th><th>Name</th><th>Student ID</th><th>Course</th><th>Block</th><th>Section</th><th>Batch</th><th>Birthday</th><th>Role</th><th>Joined Date</th><th>Status</th><th>Actions</th></tr></thead>' +
            '<tbody>';
        
        var admins = (this.data.users || []).filter(function(u) { return u.role === 'admin'; });
        
        if (admins.length === 0) {
            html += '<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-light);">No administrators found</td></tr>';
        } else {
            admins.forEach(function(admin) {
                var photoHtml = admin.profilePic ? 
                    '<img src="' + admin.profilePic + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">' :
                    '<div style="width:40px;height:40px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;">' + (admin.name ? admin.name.charAt(0).toUpperCase() : '?') + '</div>';
                html += '<tr>' +
                    '<td>' + photoHtml + '</td>' +
                    '<td>' + (admin.name || 'N/A') + '</td>' +
                    '<td>' + (admin.studentId || 'N/A') + '</td>' +
                    '<td>' + (admin.course || 'N/A') + '</td>' +
                    '<td>' + (admin.block || 'N/A') + '</td>' +
                    '<td>' + (admin.section || 'N/A') + '</td>' +
                    '<td>' + (admin.batch || 'N/A') + '</td>' +
                    '<td>' + (admin.birthday || 'N/A') + '</td>' +
                    '<td><span class="badge badge-primary">' + (admin.adminRole || 'Admin') + '</span></td>' +
                    '<td>' + (admin.joinedDate || admin.createdAt || 'N/A') + '</td>' +
                    '<td><span class="badge ' + (admin.active ? 'badge-success' : 'badge-danger') + '">' + (admin.active ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td>' +
                    '<button class="btn btn-sm btn-secondary" onclick="App.editAdmin(' + admin.id + ')" style="margin-right:4px;"><i class="fas fa-edit"></i></button>' +
                    '<button class="btn btn-sm btn-danger" onclick="App.deleteAdmin(' + admin.id + ')"><i class="fas fa-trash"></i></button>' +
                    '</td></tr>';
            });
        }
        
        html += '</tbody></table></div></div>';
        
        html += '<div id="add-admin-modal" class="modal" style="display:none;">' +
            '<div class="modal-content" style="max-width:500px;">' +
            '<div class="modal-header"><h3>Add Administrator</h3><button class="modal-close" id="close-add-admin-modal">&times;</button></div>' +
            '<div class="modal-body">' +
            '<form id="add-admin-form">' +
            '<div class="form-group">' +
            '<label class="form-label">Profile Picture</label>' +
            '<div class="file-upload-wrapper" id="admin-pic-upload">' +
            '<div class="file-upload-icon"><i class="fas fa-camera"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Photo</span></div>' +
            '<div class="file-preview" id="admin-pic-preview"></div>' +
            '</div>' +
            '<input type="file" id="admin-pic-input" accept="image/*" hidden></div>' +
            '<div class="form-group"><label class="form-label">Full Name *</label>' +
            '<input type="text" class="form-input" id="admin-name" placeholder="Enter full name" required></div>' +
            '<div class="form-group"><label class="form-label" id="admin-id-label">Student ID</label>' +
            '<input type="text" class="form-input" id="admin-student-id" placeholder="Enter student ID"></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Course</label>' +
            '<select class="form-input" id="admin-course">' +
            '<option value="">Select Course</option>' +
            '<option value="BSIT">BSIT</option>' +
            '<option value="BSCPE">BSCPE</option>' +
            '<option value="BSBA">BSBA</option>' +
            '<option value="BSAIS">BSAIS</option>' +
            '<option value="BSHM">BSHM</option></select></div>' +
            '<div class="form-group"><label class="form-label">Block</label>' +
            '<select class="form-input" id="admin-block">' +
            '<option value="">Select Block</option>' +
            '<option value="101">101</option>' +
            '<option value="102">102</option>' +
            '<option value="201">201</option>' +
            '<option value="202">202</option>' +
            '<option value="301">301</option>' +
            '<option value="302">302</option>' +
            '<option value="401">401</option>' +
            '<option value="402">402</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">Section</label>' +
            '<input type="text" class="form-input" id="admin-section" placeholder="Enter Section (e.g., A, B, C, D)"></div>' +
            '<div class="form-group"><label class="form-label">Batch *</label>' +
            '<select class="form-input" id="admin-batch" required>' +
            '<option value="">Select Batch</option>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option></select></div>' +
            '<div class="form-group"><label class="form-label">Admin Role *</label>' +
            '<select class="form-input" id="admin-role" required>' +
            '<option value="">Select Role</option>' +
            '<option value="Super Admin">Super Admin</option>' +
            '<option value="Admin">Admin</option>' +
            '<option value="Adviser">Adviser</option>' +
            '<option value="Student Affair Officer">Student Affair Officer</option>' +
            '<option value="Principal">Principal</option>' +
            '<option value="Administrator">Administrator</option>' +
            '</select></div>' +
            '<div class="form-group" id="admin-position-group" style="display:none;"><label class="form-label">Position</label>' +
            '<input type="text" class="form-input" id="admin-position" placeholder="Enter position (e.g., Faculty, Coordinator)"></div>' +
            '<div class="form-group"><label class="form-label">Birthday</label>' +
            '<input type="date" class="form-input" id="admin-birthday"></div>' +
            '<div class="form-group"><label class="form-label">Email Address *</label>' +
            '<input type="email" class="form-input" id="admin-email" placeholder="Enter email address" required></div>' +
            '<div class="form-group"><label class="form-label">Password *</label>' +
            '<input type="password" class="form-input" id="admin-password" placeholder="Create password" required></div>' +
            '<div class="form-group"><label class="form-label">Confirm Password *</label>' +
            '<input type="password" class="form-input" id="admin-confirm-password" placeholder="Confirm password" required></div>' +
            '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Add Administrator</button>' +
            '</form></div></div></div>';
        
        return html;
    },

    renderOrganization: function() {
        var self = this;
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student'; });
        
        var batchGroups = {};
        students.forEach(function(s) {
            var batch = s.batch || 'Unknown';
            if (!batchGroups[batch]) batchGroups[batch] = [];
            batchGroups[batch].push(s);
        });
        
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="add-org-member-btn"><i class="fas fa-plus"></i> Add Member</button>' +
            '<button class="btn btn-secondary" id="export-org-btn"><i class="fas fa-download"></i> Export</button>' +
            '</div>' +
            '<div style="margin-top:20px;">' +
            '<div class="stats-grid">';
        
        var batches = Object.keys(batchGroups).sort().reverse();
        batches.forEach(function(batch) {
            html += '<div class="stat-card">' +
                '<div class="stat-icon"><i class="fas fa-users"></i></div>' +
                '<div class="stat-info"><div class="stat-value">' + batchGroups[batch].length + '</div><div class="stat-label">' + batch + '</div></div>' +
                '</div>';
        });
        
        html += '</div>' +
            '<h3 style="font-size:16px;margin:20px 0 16px;">Organization Structure by Batch</h3>';
        
        batches.forEach(function(batch) {
            html += '<div style="margin-bottom:24px;">' +
                '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;padding:8px 12px;background:var(--primary-color);color:white;border-radius:4px;">' + batch + ' (' + batchGroups[batch].length + ' members)</h4>' +
                '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">';
            
            var batchStudents = batchGroups[batch].slice(0, 6);
            batchStudents.forEach(function(s) {
                html += '<div style="background:var(--bg-color);padding:16px;border-radius:8px;border:1px solid var(--border-color);">' +
                    '<div style="display:flex;align-items:center;gap:12px;">' +
                    '<div style="width:40px;height:40px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;">' +
                    (s.name ? s.name.charAt(0).toUpperCase() : '?') + '</div>' +
                    '<div><div style="font-weight:600;font-size:14px;">' + (s.name || 'N/A') + '</div>' +
                    '<div style="font-size:12px;color:var(--text-light);">' + (s.course || '') + ' - ' + (s.section || '') + '</div></div></div></div>';
            });
            
            html += '</div></div>';
        });
        
        if (batches.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-sitemap"></i></div>' +
                '<h3 class="empty-title">No organization data</h3><p class="empty-text">Add students to see organization structure</p></div>';
        }
        
        html += '</div>';
        
        html += '<div id="add-org-member-modal" class="modal" style="display:none;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>Add Organization Member</h3><button class="modal-close" id="close-add-org-modal">&times;</button></div>' +
            '<div class="modal-body">' +
            '<form id="add-org-form">' +
            '<div class="form-group"><label class="form-label">Select Student *</label>' +
            '<select class="form-input" id="org-student-select" required>' +
            '<option value="">Select Student</option>';
        
        students.forEach(function(s) {
            html += '<option value="' + s.id + '">' + (s.name || 'Unknown') + ' - ' + (s.studentId || '') + '</option>';
        });
        
        html += '</select></div>' +
            '<div class="form-group"><label class="form-label">Position</label>' +
            '<input type="text" class="form-input" id="org-position" placeholder="e.g., President, Secretary"></div>' +
            '<div class="form-group"><label class="form-label">Committee</label>' +
            '<select class="form-input" id="org-committee">' +
            '<option value="">Select Committee</option>' +
            '<option value="Executive">Executive</option>' +
            '<option value="Finance">Finance</option>' +
            '<option value="Events">Events</option>' +
            '<option value="Documentation">Documentation</option>' +
            '<option value="Public Relations">Public Relations</option>' +
            '</select></div>' +
            '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Add to Organization</button>' +
            '</form></div></div></div>';
        
        return html;
    },

    editAdmin: function(id) {
        var self = this;
        var admin = this.data.users.find(function(u) { return u.id === id; });
        if (!admin) return;
        
        var html = '<div id="edit-admin-modal" class="modal" style="display:flex;">' +
            '<div class="modal-content" style="max-width:500px;">' +
            '<div class="modal-header"><h3>Edit Administrator</h3><button class="modal-close" id="close-edit-admin-modal">&times;</button></div>' +
            '<div class="modal-body">' +
            '<form id="edit-admin-form">' +
            '<input type="hidden" id="edit-admin-id" value="' + admin.id + '">' +
            '<div class="form-group">' +
            '<label class="form-label">Profile Picture</label>' +
            '<div class="file-upload-wrapper" id="edit-admin-pic-upload">' +
            '<div class="file-upload-icon"><i class="fas fa-camera"></i></div>' +
            '<div class="file-upload-text">Click to upload <span>Photo</span></div>' +
            '<div class="file-preview" id="edit-admin-pic-preview">' + (admin.profilePic ? '<img src="' + admin.profilePic + '" style="max-width:100%;max-height:120px;border-radius:8px;">' : '') + '</div>' +
            '</div>' +
            '<input type="file" id="edit-admin-pic-input" accept="image/*" hidden></div>' +
            '<div class="form-group"><label class="form-label">Full Name *</label>' +
            '<input type="text" class="form-input" id="edit-admin-name" value="' + (admin.name || '') + '" required></div>' +
            '<div class="form-group"><label class="form-label">Student ID *</label>' +
            '<input type="text" class="form-input" id="edit-admin-student-id" value="' + (admin.studentId || '') + '" required></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Course *</label>' +
            '<select class="form-input" id="edit-admin-course" required>' +
            '<option value="">Select Course</option>' +
            '<option value="BSIT"' + (admin.course === 'BSIT' ? ' selected' : '') + '>BSIT</option>' +
            '<option value="BSCPE"' + (admin.course === 'BSCPE' ? ' selected' : '') + '>BSCPE</option>' +
            '<option value="BSBA"' + (admin.course === 'BSBA' ? ' selected' : '') + '>BSBA</option>' +
            '<option value="BSAIS"' + (admin.course === 'BSAIS' ? ' selected' : '') + '>BSAIS</option>' +
            '<option value="BSHM"' + (admin.course === 'BSHM' ? ' selected' : '') + '>BSHM</option></select></div>' +
            '<div class="form-group"><label class="form-label">Block *</label>' +
            '<select class="form-input" id="edit-admin-block" required>' +
            '<option value="">Select Block</option>' +
            '<option value="101"' + (admin.block === '101' ? ' selected' : '') + '>101</option>' +
            '<option value="102"' + (admin.block === '102' ? ' selected' : '') + '>102</option>' +
            '<option value="201"' + (admin.block === '201' ? ' selected' : '') + '>201</option>' +
            '<option value="202"' + (admin.block === '202' ? ' selected' : '') + '>202</option>' +
            '<option value="301"' + (admin.block === '301' ? ' selected' : '') + '>301</option>' +
            '<option value="302"' + (admin.block === '302' ? ' selected' : '') + '>302</option>' +
            '<option value="401"' + (admin.block === '401' ? ' selected' : '') + '>401</option>' +
            '<option value="402"' + (admin.block === '402' ? ' selected' : '') + '>402</option></select></div></div>' +
            '<div class="form-group"><label class="form-label">Section *</label>' +
            '<input type="text" class="form-input" id="edit-admin-section" value="' + (admin.section || '') + '" placeholder="Enter Section (e.g., A, B, C, D)" required></div>' +
            '<div class="form-group"><label class="form-label">Batch *</label>' +
            '<select class="form-input" id="edit-admin-batch" required>' +
            '<option value="">Select Batch</option>' +
            '<option value="2025-2026"' + (admin.batch === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
            '<option value="2024-2025"' + (admin.batch === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
            '<option value="2023-2024"' + (admin.batch === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div>' +
            '<div class="form-group"><label class="form-label">Admin Role *</label>' +
            '<select class="form-input" id="edit-admin-role" required>' +
            '<option value="">Select Role</option>' +
            '<option value="Admin"' + (admin.adminRole === 'Admin' ? ' selected' : '') + '>Admin</option>' +
            '<option value="Super Admin"' + (admin.adminRole === 'Super Admin' ? ' selected' : '') + '>Super Admin</option>' +
            '<option value="Adviser"' + (admin.adminRole === 'Adviser' ? ' selected' : '') + '>Adviser</option>' +
            '<option value="Student Affair Officer"' + (admin.adminRole === 'Student Affair Officer' ? ' selected' : '') + '>Student Affair Officer</option>' +
            '<option value="Principal">' + (admin.adminRole === 'Principal' ? ' selected' : '') + '>Principal</option>' +
            '<option value="Administrator">' + (admin.adminRole === 'Administrator' ? ' selected' : '') + '>Administrator</option>' +
            '</select></div>' +
            '<div class="form-group"><label class="form-label">Birthday</label>' +
            '<input type="date" class="form-input" id="edit-admin-birthday" value="' + (admin.birthday || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Email Address *</label>' +
            '<input type="email" class="form-input" id="edit-admin-email" value="' + (admin.email || '') + '" required></div>' +
            '<div class="form-group"><label class="form-label">Status</label>' +
            '<select class="form-input" id="edit-admin-status">' +
            '<option value="true"' + (admin.active !== false ? ' selected' : '') + '>Active</option>' +
            '<option value="false"' + (admin.active === false ? ' selected' : '') + '>Inactive</option>' +
            '</select></div>' +
            '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Save Changes</button>' +
            '</form></div></div></div>';
        
        document.getElementById('app').insertAdjacentHTML('beforeend', html);
        
        var closeEditModal = document.getElementById('close-edit-admin-modal');
        var editAdminModal = document.getElementById('edit-admin-modal');
        if (closeEditModal && editAdminModal) {
            closeEditModal.addEventListener('click', function() {
                editAdminModal.remove();
            });
        }
        
        var editForm = document.getElementById('edit-admin-form');
        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var editId = parseInt(document.getElementById('edit-admin-id').value);
                var updatedAdmin = self.data.users.find(function(u) { return u.id === editId; });
                if (updatedAdmin) {
                    updatedAdmin.name = document.getElementById('edit-admin-name').value;
                    updatedAdmin.studentId = document.getElementById('edit-admin-student-id').value;
                    updatedAdmin.course = document.getElementById('edit-admin-course').value;
                    updatedAdmin.block = document.getElementById('edit-admin-block').value;
                    updatedAdmin.section = document.getElementById('edit-admin-section').value;
                    updatedAdmin.batch = document.getElementById('edit-admin-batch').value;
                    updatedAdmin.adminRole = document.getElementById('edit-admin-role').value;
                    updatedAdmin.birthday = document.getElementById('edit-admin-birthday').value;
                    updatedAdmin.email = document.getElementById('edit-admin-email').value;
                    updatedAdmin.active = document.getElementById('edit-admin-status').value === 'true';
                    if (self.tempAdminPic) {
                        updatedAdmin.profilePic = self.tempAdminPic;
                        self.tempAdminPic = null;
                    }
                    self.saveData();
                    editAdminModal.remove();
                    self.renderAdminDashboard();
                    alert('Administrator updated successfully!');
                }
            });
        }
        
        var editAdminPicInput = document.getElementById('edit-admin-pic-input');
        var editAdminPicUpload = document.getElementById('edit-admin-pic-upload');
        var editAdminPicPreview = document.getElementById('edit-admin-pic-preview');
        if (editAdminPicInput && editAdminPicUpload) {
            editAdminPicUpload.style.cursor = 'pointer';
            editAdminPicUpload.addEventListener('click', function(e) {
                e.preventDefault();
                editAdminPicInput.click();
            });
            editAdminPicInput.addEventListener('change', function(e) {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        self.tempAdminPic = evt.target.result;
                        if (editAdminPicPreview) {
                            editAdminPicPreview.innerHTML = '<img src="' + evt.target.result + '" style="max-width:100%;max-height:120px;border-radius:8px;">';
                        }
                        var textEl = editAdminPicUpload.querySelector('.file-upload-text');
                        if (textEl) {
                            textEl.innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i> ' + file.name;
                        }
                        editAdminPicUpload.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    },

    deleteAdmin: function(id) {
        var self = this;
        var admin = this.data.users.find(function(u) { return u.id === id; });
        if (!admin) return;
        
        if (admin.id === this.currentUser.id) {
            alert('You cannot delete your own account!');
            return;
        }
        
        if (confirm('Are you sure you want to delete ' + admin.name + '?')) {
            var index = this.data.users.findIndex(function(u) { return u.id === id; });
            if (index > -1) {
                this.data.users.splice(index, 1);
                this.saveData();
                this.renderAdminDashboard();
            }
        }
    }

};

window.App = App;

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
