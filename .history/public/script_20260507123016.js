var App = {
    currentUser: null,
    currentPage: 'login',
    currentAdminTab: 'overview',
    currentStudentTab: 'overview',
    currentStudentDetail: null,
    currentPendingDetail: null,
    currentDate: new Date(),
    darkMode: false,
    searchQuery: '',
    currentFilter: {},
    currentSort: {},

     updateTermFromBlock: function() {
        var block = document.getElementById('register-block').value;
        var termField = document.getElementById('register-current-term');
        var prevSection = document.getElementById('previous-year-section');
        var firstYearInput = document.getElementById('first-year-input');
        var secondYearInput = document.getElementById('second-year-input');
        var thirdYearInput = document.getElementById('third-year-input');
        var fourthYearInput = document.getElementById('fourth-year-input');
        
        var termMap = {
            '101': '1st Year - 1st Term',
            '102': '1st Year - 2nd Term',
            '201': '2nd Year - 1st Term',
            '202': '2nd Year - 2nd Term',
            '301': '3rd Year - 1st Term',
            '302': '3rd Year - 2nd Term',
            '401': '4th Year - 1st Term',
            '402': '4th Year - 2nd Term'
        };
        
        if (termField) {
            termField.value = termMap[block] || '';
        }
        
        function clearFields(ids) {
            for (var k = 0; k < ids.length; k++) {
                var f = document.getElementById(ids[k]);
                if (f) f.value = '';
            }
        }
        
        function hideFieldContainer(fieldId) {
            var field = document.getElementById(fieldId);
            if (field) {
                field.style.display = 'none';
                field.value = '';
                var container = field.closest('.form-group');
                if (container) container.style.display = 'none';
            }
        }
        
        function showFieldContainer(fieldId) {
            var field = document.getElementById(fieldId);
            if (field) {
                field.style.display = 'block';
                var container = field.closest('.form-group');
                if (container) container.style.display = 'block';
            }
        }
        
        // Reset: show all year sections first, all fields visible
        var allYearSections = [firstYearInput, secondYearInput, thirdYearInput, fourthYearInput];
        var allSemFields = [
            'register-first-year-1st', 'register-first-year-2nd',
            'register-second-year-1st', 'register-second-year-2nd',
            'register-third-year-1st', 'register-third-year-2nd',
            'register-fourth-year-1st', 'register-fourth-year-2nd'
        ];
        
        // Show all year sections and clear all fields
        for (var i = 0; i < allYearSections.length; i++) {
            if (allYearSections[i]) allYearSections[i].style.display = 'block';
        }
        for (var j = 0; j < allSemFields.length; j++) {
            var f = document.getElementById(allSemFields[j]);
            if (f) {
                f.style.display = 'block';
                f.value = '';
            }
        }
        
        if (!prevSection) return;
        
        // PROGRESSIVE REQUIREMENT LOGIC
        
        if (block === '101') {
            // No previous history required → hide everything
            prevSection.style.display = 'none';
            
        } else if (block === '102') {
            // Require only 101
            prevSection.style.display = 'block';
            hideFieldContainer('register-first-year-2nd'); // hide current 102
            hideFieldContainer('register-second-year-1st');
            hideFieldContainer('register-second-year-2nd');
            hideFieldContainer('register-third-year-1st');
            hideFieldContainer('register-third-year-2nd');
            hideFieldContainer('register-fourth-year-1st');
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '201') {
            // Require 101, 102
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            hideFieldContainer('register-second-year-1st'); // hide current 201
            hideFieldContainer('register-second-year-2nd');
            hideFieldContainer('register-third-year-1st');
            hideFieldContainer('register-third-year-2nd');
            hideFieldContainer('register-fourth-year-1st');
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '202') {
            // Require 101, 102, 201
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            showFieldContainer('register-second-year-1st');
            hideFieldContainer('register-second-year-2nd'); // hide current 202
            hideFieldContainer('register-third-year-1st');
            hideFieldContainer('register-third-year-2nd');
            hideFieldContainer('register-fourth-year-1st');
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '301') {
            // Require 101, 102, 201, 202
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            showFieldContainer('register-second-year-1st');
            showFieldContainer('register-second-year-2nd');
            hideFieldContainer('register-third-year-1st'); // hide current 301
            hideFieldContainer('register-third-year-2nd');
            hideFieldContainer('register-fourth-year-1st');
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '302') {
            // Require 101, 102, 201, 202, 301
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            showFieldContainer('register-second-year-1st');
            showFieldContainer('register-second-year-2nd');
            showFieldContainer('register-third-year-1st');
            hideFieldContainer('register-third-year-2nd'); // hide current 302
            hideFieldContainer('register-fourth-year-1st');
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '401') {
            // Require 101–302 only (no 4th year history)
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            showFieldContainer('register-second-year-1st');
            showFieldContainer('register-second-year-2nd');
            showFieldContainer('register-third-year-1st');
            showFieldContainer('register-third-year-2nd');
            hideFieldContainer('register-fourth-year-1st'); // no 4th year history
            hideFieldContainer('register-fourth-year-2nd');
            
        } else if (block === '402') {
            // Require 101–401 (4th year 1st sem included)
            prevSection.style.display = 'block';
            showFieldContainer('register-first-year-1st');
            showFieldContainer('register-first-year-2nd');
            showFieldContainer('register-second-year-1st');
            showFieldContainer('register-second-year-2nd');
            showFieldContainer('register-third-year-1st');
            showFieldContainer('register-third-year-2nd');
            showFieldContainer('register-fourth-year-1st'); // 401 required
            hideFieldContainer('register-fourth-year-2nd'); // hide current 402
        }
    },

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
        var self = this;
        try {
            this.loadData();
            this.loadPreferences();
            this.setupEventListeners();
            if (this.darkMode) {
                document.body.classList.add('dark-mode');
            }
            // Show loading screen then load from Supabase
            document.getElementById('app').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;flex-direction:column;gap:16px;"><div style="width:40px;height:40px;border:4px solid #e5e7eb;border-top-color:#4f46e5;border-radius:50%;animation:spin 0.8s linear infinite;"></div><p style="color:#6b7280;font-size:14px;">Loading CSC Transparency...</p></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
            this.loadDataFromAPI().then(function() {
                self.checkAuth();
            }).catch(function(e) {
                console.error(e);
                self.checkAuth();
            });
        } catch(e) {
            console.error(e);
            this.renderLandingPage();
        }
    },

    loadData: function() {
        // Data loads from Supabase - see loadDataFromAPI()
        this.setupDefaultData();
    },

    loadDataFromAPI: async function() {
        var self = this;
        var tables = ['users','events','announcements','files','polls','suggestions',
                      'complaints','notifications','messages','comments','headlines',
                      'postRequests','mediaContent','qrCodes','auditLogs','activities',
                      'batches','organizations','reportFiles'];
        try {
            var results = await Promise.all(tables.map(function(t) {
                return fetch('/api/data/' + t)
                    .then(function(r) { return r.json(); })
                    .catch(function() { return { success: false, data: [] }; });
            }));
            tables.forEach(function(t, i) {
                if (results[i].success && Array.isArray(results[i].data)) {
                    self.data[t] = results[i].data;
                }
            });
            // Load finance
            var finRes = await fetch('/api/data/finance').then(function(r){ return r.json(); }).catch(function(){ return { success: false }; });
            if (finRes.success && finRes.data) {
                self.data.finance = finRes.data;
                self.data.finance.currentFunds = finRes.data.currentFunds != null ? Number(finRes.data.currentFunds) : 0;
                self.data.finance.transactions = finRes.data.transactions || [];
            }
            // Load positionMappings
            var pmRes = await fetch('/api/data/positionMappings').then(function(r){ return r.json(); }).catch(function(){ return { success: false }; });
            if (pmRes.success && pmRes.data && Object.keys(pmRes.data).length > 0) {
                self.data.positionMappings = pmRes.data;
            }
            // Normalize event fields
            (self.data.events || []).forEach(function(e) {
                if (!e.attendees) e.attendees = [];
                if (!e.evaluations) e.evaluations = [];
                if (!e.evaluationLink) e.evaluationLink = '';
                if (!e.evaluationEnabled) e.evaluationEnabled = false;
                if (!e.qrCode) e.qrCode = '';
                if (!e.rsvps) e.rsvps = [];
            });
            console.log('[CSC] Data loaded from Supabase');
        } catch(e) {
            console.error('[CSC] Failed to load from API, using defaults:', e);
        }
    },

    setupDefaultData: function() {
        this.data = {
            users: [
                { id: 1, name: 'Super Admin', email: 'superAdmin@csc.com', password: 'superAdmin123', role: 'admin', adminRole: 'Super Admin', studentId: 'ADM001', active: true, createdAt: '2026-01-01' },
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
            reportFiles: [],
            organizations: [
                { id: 1, name: 'College Student Council', committees: ['Executive', 'Finance', 'Public Relations', 'Documentation', 'Events'] },
                { id: 2, name: 'IT Club', committees: ['Executive', 'Technical', 'Documentation', 'Public Relations'] },
                { id: 3, name: 'HM Club', committees: ['Executive', 'Hospitality', 'Documentation', 'Public Relations'] },
                { id: 4, name: 'CPE Club', committees: ['Executive', 'Technical', 'Documentation', 'Public Relations'] },
                { id: 5, name: 'BA Club', committees: ['Executive', 'Finance', 'Documentation', 'Public Relations'] },
                { id: 6, name: 'BSAIS Club', committees: ['Executive', 'Finance', 'Documentation', 'Public Relations'] },
                { id: 7, name: 'Junior Council', committees: ['Executive', 'Student Affairs', 'Events'] }
            ],
            positionMappings: {
                'President': { committee: 'Executive', isHead: true },
                'Vice President': { committee: 'Executive', isHead: true },
                'Secretary': { committee: 'Secretariate', isHead: true },
                'Treasurer': { committee: 'Finance', isHead: true },
                'Auditor': { committee: 'Finance', isHead: true },
                'Business Manager': { committee: 'Finance', isHead: true },
                'Peace Officer': { committee: 'Executive', isHead: true },
                'Public Information Officer': { committee: 'Public Relations', isHead: true },
                'PIO': { committee: 'Public Relations', isHead: true },
                'Representative - IT': { committee: 'Public Relations', isHead: false },
                'Representative - HM': { committee: 'Public Relations', isHead: false },
                'Representative - CPE': { committee: 'Public Relations', isHead: false },
                'Representative - BA': { committee: 'Public Relations', isHead: false },
                'Representative - BSAIS': { committee: 'Public Relations', isHead: false },
                'Junior Councilor': { committee: 'Student Affairs', isHead: false },
                'P.I.O': { committee: 'Public Relations', isHead: true },
                'Business Manager': { committee: 'Finance', isHead: true }
            }
        };
        // Do not saveData() on default - will be overwritten by API load
    },

    saveData: function() {
        // Trigger async save to Supabase
        this.saveDataToAPI();
    },

    saveDataToAPI: async function() {
        var self = this;
        var tables = ['users','events','announcements','files','polls','suggestions',
                      'complaints','notifications','messages','comments','headlines',
                      'postRequests','mediaContent','qrCodes','auditLogs','activities',
                      'batches','organizations','reportFiles'];

        // For each table, sync in-memory data back to Supabase
        // Strategy: upsert each record individually using its id
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var records = self.data[table];
            if (!Array.isArray(records)) continue;
            for (var j = 0; j < records.length; j++) {
                var rec = records[j];
                if (!rec || !rec.id) continue;
                try {
                    await fetch('/api/data/' + table + '/' + rec.id, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(rec)
                    });
                } catch(e) { /* silent fail - data is still in memory */ }
            }
        }

        // Save finance
        try {
            await fetch('/api/data/finance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(self.data.finance || { currentFunds: 0, transactions: [] })
            });
        } catch(e) {}

        // Save positionMappings
        try {
            await fetch('/api/data/positionMappings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(self.data.positionMappings || {})
            });
        } catch(e) {}
    },

    // Create a new record in Supabase and add to local data
    createRecord: async function(table, record) {
        try {
            var res = await fetch('/api/data/' + table, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
            var json = await res.json();
            if (json.success && json.data) {
                // Update the record id with the one assigned by Supabase
                record.id = json.data.id;
            }
        } catch(e) { console.error('createRecord error:', e); }
        return record;
    },

    // Delete a record from Supabase
    deleteRecord: async function(table, id) {
        try {
            await fetch('/api/data/' + table + '/' + id, { method: 'DELETE' });
        } catch(e) { console.error('deleteRecord error:', e); }
    },

    // Check if a position can be assigned based on organization limits
    // Returns { valid: boolean, message: string }
    checkPositionLimit: function(organization, position, excludeUserId) {
        var self = this;
        excludeUserId = excludeUserId || null;
        
        // Positions with limit of 1 per organization
        var singlePositionLimit = [
            'President', 'Vice President', 'Secretary', 'Treasurer', 'Auditor',
            'Peace Officer', 'Public Information Officer', 'PIO', 'P.I.O',
            'Representative - IT', 'Representative - HM', 'Representative - CPE',
            'Representative - BA', 'Representative - BSAIS'
        ];
        
        // Business Manager can have up to 2
        var businessManagerLimit = 2;
        
        // Junior Councilor has no limit
        var unlimitedPositions = ['Junior Councilor', 'Member'];
        
        // Check if position is unlimited
        if (unlimitedPositions.indexOf(position) !== -1) {
            return { valid: true, message: '' };
        }
        
        // Count current holders of this position in the organization
        var students = this.data.users || [];
        var currentCount = 0;
        var existingHolderName = '';
        
        for (var i = 0; i < students.length; i++) {
            var student = students[i];
            if (student.role !== 'student') continue;
            if (!student.organization || !student.organization.name || !student.organization.position) continue;
            if (student.organization.name !== organization) continue;
            if (student.organization.position !== position) continue;
            if (excludeUserId && student.id === excludeUserId) continue;
            
            currentCount++;
            if (!existingHolderName) {
                existingHolderName = student.name || 'Unknown';
            }
        }
        
        // Check single position limit
        if (singlePositionLimit.indexOf(position) !== -1) {
            if (currentCount >= 1) {
                return { 
                    valid: false, 
                    message: 'Only 1 ' + position + ' is allowed per organization. Current holder: ' + existingHolderName 
                };
            }
        }
        
        // Check Business Manager limit (max 2)
        if (position === 'Business Manager') {
            if (currentCount >= businessManagerLimit) {
                return { 
                    valid: false, 
                    message: 'Only 2 Business Managers are allowed per organization. Current holders: ' + currentCount
                };
            }
        }
        
        return { valid: true, message: '' };
    },

    loadPreferences: function() {
        try {
            // localStorage removed - darkMode is session-only, defaults to false
            this.darkMode = false;
        } catch(e) {}
    },

    savePreferences: function() {
        try {
            // localStorage removed - preferences are session-only
        } catch(e) {}
    },

    checkAuth: function() {
        try {
            var user = this.currentUser; // localStorage removed - in-memory session only
            if (user) {
                this.renderDashboard();
            } else {
                this.renderLandingPage();
            }
        } catch(e) {
            this.renderLandingPage();
        }
    },

    setupEventListeners: function() {
        var self = this;
        document.addEventListener('click', function(e) {
            // Profile dropdown toggle (dashboard)
            if (e.target.closest('.dropdown-toggle')) {
                var btn = e.target.closest('.dropdown-toggle');
                var dropdown = btn.closest('.profile-dropdown');
                if (dropdown) {
                    var menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) menu.classList.toggle('show');
                }
            }
            // Close profile dropdown when clicking outside
            else if (!e.target.closest('.profile-dropdown')) {
                document.querySelectorAll('.dropdown-menu.show').forEach(function(m) { m.classList.remove('show'); });
            }

            // Login button toggle (navbar & mobile)
            if (e.target.closest('.login-btn')) {
                var loginDropdown = document.getElementById('login-dropdown');
                if (loginDropdown) {
                    loginDropdown.classList.toggle('show');
                    // Close mobile menu if open
                    var mobileMenu = document.getElementById('mobile-menu');
                    var mobileOverlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu && mobileOverlay && mobileMenu.classList.contains('show')) {
                        mobileMenu.classList.remove('show');
                        mobileOverlay.classList.remove('show');
                    }
                }
            }

            // Close login dropdown when clicking outside
            if (!e.target.closest('.login-dropdown') && !e.target.closest('.login-btn')) {
                var loginDropdown = document.getElementById('login-dropdown');
                if (loginDropdown) loginDropdown.classList.remove('show');
            }

            // Mobile menu button (hamburger) - toggle dashboard sidebar or landing navbar menu
            if (e.target.closest('.mobile-menu-btn')) {
                var dashboardSidebar = document.querySelector('.dashboard-sidebar');
                if (dashboardSidebar) {
                    dashboardSidebar.classList.toggle('show');
                } else {
                    var mobileMenu = document.getElementById('mobile-menu');
                    var mobileOverlay = document.getElementById('mobile-menu-overlay');
                    if (mobileMenu && mobileOverlay) {
                        mobileMenu.classList.toggle('show');
                        mobileOverlay.classList.toggle('show');
                    }
                }
            }

            // Mobile menu overlay click - closes mobile menu
            if (e.target.closest('.mobile-menu-overlay')) {
                var mobileMenu = document.getElementById('mobile-menu');
                var mobileOverlay = document.getElementById('mobile-menu-overlay');
                if (mobileMenu && mobileOverlay) {
                    mobileMenu.classList.remove('show');
                    mobileOverlay.classList.remove('show');
                }
            }

            // Close mobile menu when clicking a nav link
            if (e.target.closest('.mobile-nav-link')) {
                var mobileMenu = document.getElementById('mobile-menu');
                var mobileOverlay = document.getElementById('mobile-menu-overlay');
                if (mobileMenu && mobileOverlay) {
                    mobileMenu.classList.remove('show');
                    mobileOverlay.classList.remove('show');
                }
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

    // ========== LANDING PAGE ==========
    renderLandingPage: function() {
        this.currentPage = 'landing';
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <nav class="navbar">
                <div class="navbar-left">
                    <div class="navbar-logo"><i class="fas fa-university"></i></div>
                    <span class="navbar-brand">CSC Transparency Website</span>
                </div>
                <div class="navbar-center">
                    <a href="#" class="nav-link">Home</a>
                    <a href="#" class="nav-link">About</a>
                    <a href="#" class="nav-link">FAQ</a>
                </div>
                <div class="navbar-right">
                    <button class="login-btn" id="login-toggle">Log in</button>
                    <div class="login-dropdown" id="login-dropdown">
                        <h3>Welcome Back</h3>
                        <div id="login-error" class="alert alert-error" style="display:none;"></div>
                        <form id="login-form">
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-input" id="login-email" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required>
                            </div>
                            <button type="submit" class="login-submit">Login</button>
                        </form>
                        <div class="login-dropdown-footer">
                            Don't have an account? <a href="#" id="go-to-register">Register</a>
                        </div>
                    </div>
                </div>
                <button class="mobile-menu-btn" id="mobile-menu-btn">
                    <span class="hamburger-icon"></span>
                </button>
            </nav>

            <div class="mobile-menu" id="mobile-menu">
                <a href="#" class="mobile-nav-link">Home</a>
                <a href="#" class="mobile-nav-link">About</a>
                <a href="#" class="mobile-nav-link">FAQ</a>
                <button class="mobile-login-btn login-btn" id="mobile-login-btn">Log in</button>
            </div>

            <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>

            <section class="hero-section">
                <div class="hero-content">
                    <h1 class="hero-title">Welcome to CSC Transparency Website</h1>
                    <p class="hero-subtitle">Your gateway to transparent governance, student representation, and institutional excellence. Access announcements, events, files, and more.</p>
                </div>
            </section>
        `;

        // Login form submission
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
                   
                   // Cancel scan button - only for students
                   var cancelScanBtn = document.getElementById('cancel-scan-btn');
                   if (cancelScanBtn) {
                       cancelScanBtn.addEventListener('click', function() {
                           var scannerContainer = document.getElementById('qr-scanner-container');
                           
                           // Try to stop the scanner if it's running
                           try {
                               var Html5QrcodeCls = Html5Qrcode || (window && window.Html5Qrcode);
                               if (Html5QrcodeCls && typeof Html5QrcodeCls === 'function') {
                                   var html5QrCode = new Html5QrcodeCls('qr-reader');
                                   html5QrCode.stop().then(function() {
                                       html5QrCode.clear();
                                   }).catch(function(err) {
                                       console.log('Scanner stop ignored (may not be running):', err.message);
                                   });
                               }
                           } catch(e) {}
                           
                           if (scannerContainer) scannerContainer.style.display = 'none';
                           if (scanQrBtn) scanQrBtn.style.display = 'block';
                       });
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
                        // localStorage removed - session stored in memory
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

        // Register link in dropdown
        var registerLink = document.getElementById('go-to-register');
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                var dropdown = document.getElementById('login-dropdown');
                if (dropdown) dropdown.classList.remove('show');
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
                        '<div class="form-group"><label class="form-label">Birthday <span style="font-weight:normal;color:var(--text-light);font-size:12px;"></span></label>' +
                        '<div id="birthday-picker-container" style="position:relative;">' +
                        '<input type="text" class="form-input" id="birthday-display" readonly placeholder="Click to select date" style="cursor:pointer;background:var(--bg-white);">' +
                        '<div id="birthday-calendar" style="display:none;position:absolute;z-index:100;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);width:300px;margin-top:4px;">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                        '<button type="button" id="bday-prev-month" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 8px;color:var(--text-light);">&#10094;</button>' +
                        '<div style="display:flex;gap:4px;">' +
                        '<div id="bday-month-display" style="font-weight:600;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;"></div>' +
                        '<div id="bday-year-display" style="font-weight:600;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;"></div>' +
                        '</div>' +
                        '<button type="button" id="bday-next-month" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 8px;color:var(--text-light);">&#10095;</button>' +
                        '</div>' +
                        '<div id="bday-month-selector" style="display:none;position:absolute;top:36px;left:0;right:0;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:8px;max-height:200px;overflow-y:auto;">' +
                        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;" id="bday-months-grid"></div>' +
                        '</div>' +
                        '<div id="bday-year-selector" style="display:none;position:absolute;top:36px;left:0;right:0;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:8px;max-height:200px;overflow-y:auto;">' +
                        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;" id="bday-years-grid"></div>' +
                        '</div>' +
                        '<div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:11px;color:var(--text-light);margin-bottom:6px;">' +
                        '<div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>' +
                        '</div>' +
                        '<div id="bday-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;"></div>' +
                        '<input type="hidden" id="register-birthday-month"><input type="hidden" id="register-birthday-day"><input type="hidden" id="register-birthday-year">' +
                        '</div></div></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Course *</label>' +
                        '<select class="form-input" id="register-course" onchange="App.updateTermFromBlock()" required>' +
                        '<option value="">Select Course</option>' +
                        '<option value="BSIT">BSIT</option>' +
                        '<option value="BSCPE">BSCPE</option>' +
                        '<option value="BSBA">BSBA</option>' +
                        '<option value="BSAIS">BSAIS</option>' +
                        '<option value="BSHM">BSHM</option></select></div>' +
                        '<div class="form-group"><label class="form-label">Block *</label>' +
                        '<select class="form-input" id="register-block" onchange="App.updateTermFromBlock()" required>' +
                        '<option value="">Select Block</option>' +
                        '<option value="101">101</option>' +
                        '<option value="102">102</option>' +
                        '<option value="201">201</option>' +
                        '<option value="202">202</option>' +
                        '<option value="301">301</option>' +
                        '<option value="302">302</option>' +
                        '<option value="401">401</option>' +
                        '<option value="402">402</option></select></div></div>' +
                        '<div class="form-group"><label class="form-label">Current Term</label>' +
                        '<input type="text" class="form-input" id="register-current-term" readonly style="background:var(--bg-color);" placeholder="Will be auto-detected from block"></div>' +
                        '<div class="form-group"><label class="form-label">Section *</label>' +
                        '<input type="text" class="form-input" id="register-section" oninput="App.updateTermFromBlock()" placeholder="Enter Section (e.g., A, B, C, D)" required></div>' +
                        '<div class="form-group"><label class="form-label">Batch/Semester *</label>' +
                        '<select class="form-input" id="register-batch" required>' +
                        '<option value="">Select Batch</option>' +
                        '<option value="2025-2026">2025-2026</option>' +
                        '<option value="2024-2025">2024-2025</option>' +
                        '<option value="2023-2024">2023-2024</option></select></div>' +
                        '<div id="previous-year-section" style="display:none;">' +
                        '<div style="margin:24px 0 12px;border-top:1px solid var(--border-color);padding-top:16px;">' +
                        '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Previous Academic History</h4></div>' +

                        '<div id="first-year-input" style="display:none;">' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">1st Year 1st Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-first-year-1st" placeholder="A"></div>' +
                        '<div class="form-group"><label class="form-label">1st Year 2nd Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-first-year-2nd" placeholder="A"></div></div></div>' +
                        '<div id="second-year-input" style="display:none;">' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">2nd Year 1st Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-second-year-1st" placeholder="A"></div>' +
                        '<div class="form-group"><label class="form-label">2nd Year 2nd Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-second-year-2nd" placeholder="A"></div></div></div>' +
                        '<div id="third-year-input" style="display:none;">' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">3rd Year 1st Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-third-year-1st" placeholder="A"></div>' +
                        '<div class="form-group"><label class="form-label">3rd Year 2nd Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-third-year-2nd" placeholder="A"></div></div></div>' +
                        '<div id="fourth-year-input" style="display:none;">' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">4th Year 1st Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-fourth-year-1st" placeholder="A"></div>' +
                        '<div class="form-group"><label class="form-label">4th Year 2nd Sem - Section</label>' +
                        '<input type="text" class="form-input" id="register-fourth-year-2nd" placeholder="A"></div></div></div>' +
                        '</div>' +
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
                        '<div style="margin:24px 0 12px;border-top:1px solid var(--border-color);padding-top:16px;">' +
                        '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Address Information</h4></div>' +
                        '<div class="form-group"><label class="form-label">Street Address</label>' +
                        '<input type="text" class="form-input" id="register-street" placeholder="House No., Street Name"></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Barangay</label>' +
                        '<input type="text" class="form-input" id="register-barangay" placeholder="Barangay"></div>' +
                        '<div class="form-group"><label class="form-label">City/Municipality</label>' +
                        '<input type="text" class="form-input" id="register-city" placeholder="City"></div></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Province</label>' +
                        '<input type="text" class="form-input" id="register-province" placeholder="Province"></div>' +
                        '<div class="form-group"><label class="form-label">Postal Code</label>' +
                        '<input type="text" class="form-input" id="register-postal" placeholder="Postal Code"></div>' +
                        '<div class="form-group"><label class="form-label">Country</label>' +
                        '<input type="text" class="form-input" id="register-country" placeholder="Country" value="Philippines"></div></div>' +
                        '<div class="form-group"><label class="form-label">Cellphone Number *</label>' +
                        '<input type="tel" class="form-input" id="register-cellphone" placeholder="e.g., 09123456789" required></div>' +
                        '<div style="margin:24px 0 12px;border-top:1px solid var(--border-color);padding-top:16px;">' +
                        '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Emergency Contact (Parent/Guardian)</h4></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Full Name *</label>' +
                        '<input type="text" class="form-input" id="register-emergency-name" placeholder="Mother/Father/Guardian Name" required></div>' +
                        '<div class="form-group"><label class="form-label">Relationship *</label>' +
                        '<select class="form-input" id="register-emergency-relation" required>' +
                        '<option value="">Select</option>' +
                        '<option value="Mother">Mother</option>' +
                        '<option value="Father">Father</option>' +
                        '<option value="Guardian">Guardian</option></select></div></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Parent/Guardian Birthday</label>' +
                        '<div id="parent-birthday-container" style="position:relative;">' +
                        '<input type="text" class="form-input" id="parent-birthday-display" readonly placeholder="Click to select date" style="cursor:pointer;background:var(--bg-white);">' +
                        '<div id="parent-birthday-calendar" style="display:none;position:absolute;z-index:100;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);width:300px;margin-top:4px;">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                        '<button type="button" id="parent-prev-month" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 8px;color:var(--text-light);">&#10094;</button>' +
                        '<div style="display:flex;gap:4px;">' +
                        '<div id="parent-month-display" style="font-weight:600;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;"></div>' +
                        '<div id="parent-year-display" style="font-weight:600;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;"></div>' +
                        '</div>' +
                        '<button type="button" id="parent-next-month" style="background:none;border:none;cursor:pointer;font-size:18px;padding:4px 8px;color:var(--text-light);">&#10095;</button>' +
                        '</div>' +
                        '<div id="parent-month-selector" style="display:none;position:absolute;top:36px;left:0;right:0;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:8px;max-height:200px;overflow-y:auto;">' +
                        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;" id="parent-months-grid"></div>' +
                        '</div>' +
                        '<div id="parent-year-selector" style="display:none;position:absolute;top:36px;left:0;right:0;background:var(--bg-white);border:1px solid var(--border-color);border-radius:8px;padding:8px;max-height:200px;overflow-y:auto;">' +
                        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;" id="parent-years-grid"></div>' +
                        '</div>' +
                        '<div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-size:11px;color:var(--text-light);margin-bottom:6px;">' +
                        '<div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>' +
                        '</div>' +
                        '<div id="parent-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;"></div>' +
                        '<input type="hidden" id="register-parent-birthday-month"><input type="hidden" id="register-parent-birthday-day"><input type="hidden" id="register-parent-birthday-year">' +
                        '</div></div></div>' +
                        '<div class="form-group"><label class="form-label">Cellphone Number *</label>' +
                        '<input type="tel" class="form-input" id="register-emergency-cellphone" placeholder="e.g., 09123456789" required></div>' +
                        '<div class="form-group"><label class="form-label">Email</label>' +
                        '<input type="email" class="form-input" id="register-emergency-email" placeholder="Email Address"></div></div>' +
                        '<button type="submit" class="btn btn-primary btn-block">Next: Upload Documents</button>' +
                    '</form>' +
                    '<div class="auth-footer">Already have an account? <a href="#" id="go-to-login">Login</a></div>' +
                '</div>' +
            '</div>';
        
this.attachPasswordToggle('register-password', 'toggle-password');
        this.attachPasswordToggle('register-confirm', 'toggle-confirm');
        
        // Birthday Picker Calendar
        var bdayDisplay = document.getElementById('birthday-display');
        var bdayCalendar = document.getElementById('birthday-calendar');
        var bdayMonthDisplay = document.getElementById('bday-month-display');
        var bdayYearDisplay = document.getElementById('bday-year-display');
        var bdayDays = document.getElementById('bday-days');
        var bdayMonthSelector = document.getElementById('bday-month-selector');
        var bdayMonthsGrid = document.getElementById('bday-months-grid');
        var bdayYearSelector = document.getElementById('bday-year-selector');
        var bdayYearsGrid = document.getElementById('bday-years-grid');
        
        var currentBdayDate = new Date();
        var currentBdayMonth = currentBdayDate.getMonth();
        var currentBdayYear = currentBdayDate.getFullYear();
        
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        function renderBdayCalendar(month, year) {
            if (bdayMonthDisplay) bdayMonthDisplay.textContent = monthNames[month];
            if (bdayYearDisplay) bdayYearDisplay.textContent = year;
            bdayDays.innerHTML = '';
            
            var firstDay = new Date(year, month, 1).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for (var i = 0; i < firstDay; i++) {
                var emptyDiv = document.createElement('div');
                bdayDays.appendChild(emptyDiv);
            }
            
            for (var day = 1; day <= daysInMonth; day++) {
                var dayDiv = document.createElement('div');
                dayDiv.textContent = day;
                dayDiv.style.padding = '6px';
                dayDiv.style.cursor = 'pointer';
                dayDiv.style.borderRadius = '4px';
                dayDiv.style.fontSize = '13px';
                
                dayDiv.addEventListener('click', function() {
                    var selectedDay = this.textContent;
                    document.getElementById('register-birthday-month').value = String(month + 1).padStart(2, '0');
                    document.getElementById('register-birthday-day').value = selectedDay;
                    document.getElementById('register-birthday-year').value = year;
                    bdayDisplay.value = monthNames[month] + ' ' + selectedDay + ', ' + year;
                    bdayCalendar.style.display = 'none';
                });
                
                dayDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                dayDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                bdayDays.appendChild(dayDiv);
            }
        }
        
        function renderMonthSelector() {
            bdayMonthsGrid.innerHTML = '';
            for (var m = 0; m < 12; m++) {
                var monthDiv = document.createElement('div');
                monthDiv.textContent = monthAbbr[m];
                monthDiv.style.padding = '6px 8px';
                monthDiv.style.textAlign = 'center';
                monthDiv.style.cursor = 'pointer';
                monthDiv.style.borderRadius = '4px';
                monthDiv.style.fontSize = '12px';
                
                monthDiv.addEventListener('click', function() {
                    var selectedMonth = monthAbbr.indexOf(this.textContent);
                    if (selectedMonth !== -1) {
                        currentBdayMonth = selectedMonth;
                        bdayMonthSelector.style.display = 'none';
                        renderBdayCalendar(currentBdayMonth, currentBdayYear);
                    }
                });
                
                monthDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                monthDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                bdayMonthsGrid.appendChild(monthDiv);
            }
        }
        
        function renderYearSelector() {
            bdayYearsGrid.innerHTML = '';
            var startYear = 1900;
            var endYear = new Date().getFullYear();
            
            for (var y = endYear; y >= startYear; y--) {
                var yearDiv = document.createElement('div');
                yearDiv.textContent = y;
                yearDiv.style.padding = '8px';
                yearDiv.style.textAlign = 'center';
                yearDiv.style.cursor = 'pointer';
                yearDiv.style.borderRadius = '4px';
                yearDiv.style.fontSize = '13px';
                
                yearDiv.addEventListener('click', function() {
                    var selectedYear = parseInt(this.textContent);
                    currentBdayYear = selectedYear;
                    document.getElementById('register-birthday-year').value = selectedYear;
                    bdayYearSelector.style.display = 'none';
                    renderBdayCalendar(currentBdayMonth, currentBdayYear);
                });
                
                yearDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                yearDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                bdayYearsGrid.appendChild(yearDiv);
            }
        }
        
        if (bdayDisplay && bdayCalendar) {
            renderMonthSelector();
            bdayDisplay.addEventListener('click', function(e) {
                e.stopPropagation();
                if (bdayCalendar.style.display === 'none') {
                    bdayCalendar.style.display = 'block';
                    renderBdayCalendar(currentBdayMonth, currentBdayYear);
                } else {
                    bdayCalendar.style.display = 'none';
                }
            });
            
            document.getElementById('bday-prev-month').addEventListener('click', function(e) {
                e.stopPropagation();
                currentBdayMonth--;
                if (currentBdayMonth < 0) {
                    currentBdayMonth = 11;
                    currentBdayYear--;
                }
                renderBdayCalendar(currentBdayMonth, currentBdayYear);
            });
            
            document.getElementById('bday-next-month').addEventListener('click', function(e) {
                e.stopPropagation();
                currentBdayMonth++;
                if (currentBdayMonth > 11) {
                    currentBdayMonth = 0;
                    currentBdayYear++;
                }
                renderBdayCalendar(currentBdayMonth, currentBdayYear);
            });
            
            if (bdayMonthDisplay) {
                bdayMonthDisplay.style.cursor = 'pointer';
                bdayMonthDisplay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    bdayMonthSelector.style.display = bdayMonthSelector.style.display === 'none' ? 'block' : 'none';
                    bdayYearSelector.style.display = 'none';
                });
            }
            
            if (bdayYearDisplay) {
                bdayYearDisplay.style.cursor = 'pointer';
                bdayYearDisplay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (bdayYearSelector.style.display === 'none') {
                        renderYearSelector();
                        bdayYearSelector.style.display = 'block';
                    } else {
                        bdayYearSelector.style.display = 'none';
                    }
                    bdayMonthSelector.style.display = 'none';
                });
            }
            
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#birthday-picker-container')) {
                    bdayCalendar.style.display = 'none';
                    bdayMonthSelector.style.display = 'none';
                    bdayYearSelector.style.display = 'none';
                }
            });
        }
        
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

        // Parent Birthday Picker Calendar
        var parentBdayDisplay = document.getElementById('parent-birthday-display');
        var parentBdayCalendar = document.getElementById('parent-birthday-calendar');
        var parentMonthDisplay = document.getElementById('parent-month-display');
        var parentYearDisplay = document.getElementById('parent-year-display');
        var parentDays = document.getElementById('parent-days');
        var parentMonthSelector = document.getElementById('parent-month-selector');
        var parentMonthsGrid = document.getElementById('parent-months-grid');
        var parentYearSelector = document.getElementById('parent-year-selector');
        var parentYearsGrid = document.getElementById('parent-years-grid');
        
        var currentParentBdayMonth = new Date().getMonth();
        var currentParentBdayYear = new Date().getFullYear();
        
        function renderParentBdayCalendar(month, year) {
            if (parentMonthDisplay) parentMonthDisplay.textContent = monthNames[month];
            if (parentYearDisplay) parentYearDisplay.textContent = year;
            parentDays.innerHTML = '';
            
            var firstDay = new Date(year, month, 1).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for (var i = 0; i < firstDay; i++) {
                var emptyDiv = document.createElement('div');
                parentDays.appendChild(emptyDiv);
            }
            
            for (var day = 1; day <= daysInMonth; day++) {
                var dayDiv = document.createElement('div');
                dayDiv.textContent = day;
                dayDiv.style.padding = '6px';
                dayDiv.style.cursor = 'pointer';
                dayDiv.style.borderRadius = '4px';
                dayDiv.style.fontSize = '13px';
                
                dayDiv.addEventListener('click', function() {
                    var selectedDay = this.textContent;
                    document.getElementById('register-parent-birthday-month').value = String(month + 1).padStart(2, '0');
                    document.getElementById('register-parent-birthday-day').value = selectedDay;
                    document.getElementById('register-parent-birthday-year').value = year;
                    parentBdayDisplay.value = monthNames[month] + ' ' + selectedDay + ', ' + year;
                    parentBdayCalendar.style.display = 'none';
                });
                
                dayDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                dayDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                parentDays.appendChild(dayDiv);
            }
        }
        
        function renderParentMonthSelector() {
            parentMonthsGrid.innerHTML = '';
            for (var m = 0; m < 12; m++) {
                var monthDiv = document.createElement('div');
                monthDiv.textContent = monthAbbr[m];
                monthDiv.style.padding = '6px 8px';
                monthDiv.style.textAlign = 'center';
                monthDiv.style.cursor = 'pointer';
                monthDiv.style.borderRadius = '4px';
                monthDiv.style.fontSize = '12px';
                
                monthDiv.addEventListener('click', function() {
                    var selectedMonth = monthAbbr.indexOf(this.textContent);
                    if (selectedMonth !== -1) {
                        currentParentBdayMonth = selectedMonth;
                        parentMonthSelector.style.display = 'none';
                        renderParentBdayCalendar(currentParentBdayMonth, currentParentBdayYear);
                    }
                });
                
                monthDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                monthDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                parentMonthsGrid.appendChild(monthDiv);
            }
        }
        
        function renderParentYearSelector() {
            parentYearsGrid.innerHTML = '';
            var startYear = 1900;
            var endYear = new Date().getFullYear();
            
            for (var y = endYear; y >= startYear; y--) {
                var yearDiv = document.createElement('div');
                yearDiv.textContent = y;
                yearDiv.style.padding = '8px';
                yearDiv.style.textAlign = 'center';
                yearDiv.style.cursor = 'pointer';
                yearDiv.style.borderRadius = '4px';
                yearDiv.style.fontSize = '13px';
                
                yearDiv.addEventListener('click', function() {
                    var selectedYear = parseInt(this.textContent);
                    currentParentBdayYear = selectedYear;
                    document.getElementById('register-parent-birthday-year').value = selectedYear;
                    parentYearSelector.style.display = 'none';
                    renderParentBdayCalendar(currentParentBdayMonth, currentParentBdayYear);
                });
                
                yearDiv.addEventListener('mouseenter', function() {
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'white';
                });
                yearDiv.addEventListener('mouseleave', function() {
                    this.style.background = '';
                    this.style.color = '';
                });
                
                parentYearsGrid.appendChild(yearDiv);
            }
        }
        
        if (parentBdayDisplay && parentBdayCalendar) {
            renderParentMonthSelector();
            parentBdayDisplay.addEventListener('click', function(e) {
                e.stopPropagation();
                if (parentBdayCalendar.style.display === 'none') {
                    parentBdayCalendar.style.display = 'block';
                    renderParentBdayCalendar(currentParentBdayMonth, currentParentBdayYear);
                } else {
                    parentBdayCalendar.style.display = 'none';
                }
            });
            
            document.getElementById('parent-prev-month').addEventListener('click', function(e) {
                e.stopPropagation();
                currentParentBdayMonth--;
                if (currentParentBdayMonth < 0) {
                    currentParentBdayMonth = 11;
                    currentParentBdayYear--;
                }
                renderParentBdayCalendar(currentParentBdayMonth, currentParentBdayYear);
            });
            
            document.getElementById('parent-next-month').addEventListener('click', function(e) {
                e.stopPropagation();
                currentParentBdayMonth++;
                if (currentParentBdayMonth > 11) {
                    currentParentBdayMonth = 0;
                    currentParentBdayYear++;
                }
                renderParentBdayCalendar(currentParentBdayMonth, currentParentBdayYear);
            });
            
            if (parentMonthDisplay) {
                parentMonthDisplay.style.cursor = 'pointer';
                parentMonthDisplay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    parentMonthSelector.style.display = parentMonthSelector.style.display === 'none' ? 'block' : 'none';
                    parentYearSelector.style.display = 'none';
                });
            }
            
            if (parentYearDisplay) {
                parentYearDisplay.style.cursor = 'pointer';
                parentYearDisplay.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (parentYearSelector.style.display === 'none') {
                        renderParentYearSelector();
                        parentYearSelector.style.display = 'block';
                    } else {
                        parentYearSelector.style.display = 'none';
                    }
                    parentMonthSelector.style.display = 'none';
                });
            }
            
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#parent-birthday-container')) {
                    parentBdayCalendar.style.display = 'none';
                    parentMonthSelector.style.display = 'none';
                    parentYearSelector.style.display = 'none';
                }
            });
        }

        var backBtn = document.getElementById('back-to-login');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLandingPage();
            });
        }
        
        var loginLink = document.getElementById('go-to-login');
        if (loginLink) {
            loginLink.addEventListener('click', function(e) {
                e.preventDefault();
                self.renderLandingPage();
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
                var bMonth = document.getElementById('register-birthday-month').value;
                var bDay = document.getElementById('register-birthday-day').value;
                var bYear = document.getElementById('register-birthday-year').value;
                var birthday = bYear && bMonth && bDay ? bYear + '-' + bMonth + '-' + (bDay.length === 1 ? '0' + bDay : bDay) : '';
                var course = document.getElementById('register-course').value;
                var block = document.getElementById('register-block').value;
                var section = document.getElementById('register-section').value;
                var batch = document.getElementById('register-batch').value;
                var studentId = document.getElementById('register-student-id').value;
                var email = document.getElementById('register-email').value;
                var pass = document.getElementById('register-password').value;
                var confirm = document.getElementById('register-confirm').value;
                
                var street = document.getElementById('register-street').value;
                var barangay = document.getElementById('register-barangay').value;
                var city = document.getElementById('register-city').value;
                var province = document.getElementById('register-province').value;
                var postal = document.getElementById('register-postal').value;
                var country = document.getElementById('register-country').value;
                var cellphone = document.getElementById('register-cellphone').value;
                
                var emergencyName = document.getElementById('register-emergency-name').value;
                var emergencyRelation = document.getElementById('register-emergency-relation').value;
                var emergencyBdayMonth = document.getElementById('register-parent-birthday-month').value;
                var emergencyBdayDay = document.getElementById('register-parent-birthday-day').value;
                var emergencyBdayYear = document.getElementById('register-parent-birthday-year').value;
                var emergencyBday = emergencyBdayYear && emergencyBdayMonth && emergencyBdayDay ? emergencyBdayYear + '-' + emergencyBdayMonth + '-' + (emergencyBdayDay.length === 1 ? '0' + emergencyBdayDay : emergencyBdayDay) : '';
                var emergencyCellphone = document.getElementById('register-emergency-cellphone').value;
                var emergencyEmail = document.getElementById('register-emergency-email').value;
                
                var errorEl = document.getElementById('register-error');
                
                if (!firstName || !lastName || !studentId || !email || !pass || !course || !block || !section || !batch || !bMonth || !bDay || !bYear) {
                    if (errorEl) {
                        errorEl.textContent = 'All required fields must be filled';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                if (!cellphone) {
                    if (errorEl) {
                        errorEl.textContent = 'Cellphone number is required';
                        errorEl.style.display = 'block';
                    }
                    return;
                }
                
                if (!emergencyName || !emergencyRelation || !emergencyCellphone) {
                    if (errorEl) {
                        errorEl.textContent = 'Emergency contact information is required';
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
                    term: (block === '101' || block === '102') ? '1st Term' : (block === '201' || block === '202') ? '2nd Term' : (block === '301' || block === '302') ? '3rd Term' : '4th Term',
                    section: section,
                    batch: batch,
                    academicYear: batch,
                    semester: (block === '101' || block === '201' || block === '301' || block === '401') ? '1st Semester' : '2nd Semester',
                    studentId: studentId, 
                    email: email, 
                    password: pass,
                    address: {
                        street: street,
                        barangay: barangay,
                        city: city,
                        province: province,
                        postalCode: postal,
                        country: country
                    },
                    cellphone: cellphone,
                    previousYearHistory: {
                        firstYear1st: document.getElementById('register-first-year-1st') ? document.getElementById('register-first-year-1st').value : '',
                        firstYear2nd: document.getElementById('register-first-year-2nd') ? document.getElementById('register-first-year-2nd').value : '',
                        secondYear1st: document.getElementById('register-second-year-1st') ? document.getElementById('register-second-year-1st').value : '',
                        secondYear2nd: document.getElementById('register-second-year-2nd') ? document.getElementById('register-second-year-2nd').value : '',
                        thirdYear1st: document.getElementById('register-third-year-1st') ? document.getElementById('register-third-year-1st').value : '',
                        thirdYear2nd: document.getElementById('register-third-year-2nd') ? document.getElementById('register-third-year-2nd').value : '',
                        fourthYear1st: document.getElementById('register-fourth-year-1st') ? document.getElementById('register-fourth-year-1st').value : '',
                        fourthYear2nd: document.getElementById('register-fourth-year-2nd') ? document.getElementById('register-fourth-year-2nd').value : ''
                    },
                    emergencyContact: {
                        name: emergencyName,
                        relationship: emergencyRelation,
                        birthday: emergencyBday,
                        cellphone: emergencyCellphone,
                        email: emergencyEmail
                    }
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
                self.renderLandingPage();
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
                self.renderLandingPage();
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
                    self.renderLandingPage();
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
                    term: self.registerData.term || '',
                    section: self.registerData.section,
                    birthday: self.registerData.birthday,
                    batch: self.registerData.batch,
                    academicYear: self.registerData.academicYear || self.registerData.batch,
                    semester: self.registerData.semester || '1st Semester',
                    previousYearHistory: self.registerData.previousYearHistory || {},
                    role: 'student',
                    status: 'pending',
                    active: false,
                    profilePic: self.registerData.profilePic,
                    schoolIdPic: self.registerData.schoolIdPic,
                    createdAt: new Date().toISOString().split('T')[0],
                    pollsAnswered: [],
                    suggestionsSubmitted: [],
                    address: self.registerData.address || {},
                    cellphone: self.registerData.cellphone || '',
                    emergencyContact: self.registerData.emergencyContact || {}
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
    },

      renderPendingApproval: function() {
          this.currentPage = 'pending';
          var self = this;
          var app = document.getElementById('app');
          if (!app) return;
          
          app.innerHTML = 
              '<div class="auth-page">' +
                  '<div class="auth-card" style="text-align:center;">' +
                      '<button class="register-back-btn" id="back-to-login" style="margin:0 auto 16px auto;"><i class="fas fa-arrow-left"></i> Back to Login</button>' +
                      '<div class="pending-status">' +
                          '<i class="fas fa-clock"></i>' +
                          '<div class="pending-status-text">' +
                          '<strong>Account Pending Approval</strong>' +
                          'Your account is awaiting admin approval. You will receive an email once your account has been reviewed.' +
                          '</div>' +
                      '</div>' +
                  '</div>' +
              '</div>';
          
          var backBtn = document.getElementById('back-to-login');
          if (backBtn) {
              backBtn.addEventListener('click', function(e) {
                  e.preventDefault();
                  self.renderLandingPage();
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
        var profilePicHtml = user.profilePic ? 
            '<img src="' + user.profilePic + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">' :
            '<div class="profile-avatar">' + (user.name ? user.name.charAt(0).toUpperCase() : '?') + '</div>';
        
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
                        profilePicHtml +
                        '<span class="profile-name">' + user.name + '</span>' +
                        '<i class="fas fa-chevron-down"></i>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                        '<div class="dropdown-item" data-action="home"><i class="fas fa-home"></i> Home</div>' +
                        '<div class="dropdown-item" data-action="profile"><i class="fas fa-user"></i> Profile</div>' +
                        '<div class="dropdown-divider"></div>' +
                        '<div class="dropdown-item" data-action="dark-mode"><i class="fas fa-moon"></i> Dark Mode</div>' +
                        '<div class="dropdown-item" data-action="settings"><i class="fas fa-cog"></i> Settings</div>' +
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
        var isSuperAdmin = this.currentUser.adminRole === 'Super Admin';
        
        var tabs = [
            { id: 'overview', icon: 'fa-tachometer-alt', label: 'Overview' },
            { id: 'events', icon: 'fa-calendar', label: 'Events' },
            { id: 'announcements', icon: 'fa-newspaper', label: 'News' },
            { id: isSuperAdmin ? 'post-requests' : 'headlines', icon: isSuperAdmin ? 'fa-paper-plane' : 'fa-star', label: isSuperAdmin ? 'Post Requests' : 'Featured' },
            { id: 'attendance', icon: 'fa-qrcode', label: 'Attendance' }
        ];
        
        if (isSuperAdmin) {
            tabs.push({ id: 'students', icon: 'fa-users', label: 'Students' });
            tabs.push({ id: 'administrators', icon: 'fa-user-shield', label: 'Administrators' });
        }
        
        tabs.push({ id: 'organization', icon: 'fa-sitemap', label: 'Organization' });
        
        if (isSuperAdmin) {
            tabs.push({ id: 'pending', icon: 'fa-user-plus', label: 'Account Request' + (pendingCount > 0 ? ' (' + pendingCount + ')' : '') });
        }
        
        tabs = tabs.concat([
            { id: 'files', icon: 'fa-folder', label: 'Files' },
            { id: 'reports', icon: 'fa-file-pdf', label: 'Reports' },
            { id: 'finance', icon: 'fa-coins', label: 'Finance' },
            { id: 'polls', icon: 'fa-poll', label: 'Polls' },
            { id: 'suggestions', icon: 'fa-lightbulb', label: 'Suggestions' + (suggestionsCount > 0 ? ' (' + suggestionsCount + ')' : '') },
            { id: 'complaints', icon: 'fa-exclamation-triangle', label: 'Complaints' + (complaintsCount > 0 ? ' (' + complaintsCount + ')' : '') },
            { id: 'analytics', icon: 'fa-chart-bar', label: 'Analytics' }
        ]);
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
            '<div id="qr-scanner-container" style="display:none;margin-top:10px;">' +
                '<div id="qr-reader" style="width:100%;border-radius:8px;overflow:hidden;"></div>' +
                '<button class="btn btn-danger" id="cancel-scan-btn" style="width:100%;margin-top:8px;"><i class="fas fa-times"></i> Cancel</button>' +
            '</div>' +
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

    renderDashboardRight: function(role, currentTab) {
        var activeStudents = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.active; });
        var latestAnnouncements = (this.data.announcements || []).slice(0, 3);
        var headlines = (this.data.headlines || []).filter(function(h) { return h.status === 'approved'; });
        
        var hideRight = currentTab && ['organization', 'students', 'administrators', 'pending', 'analytics'].includes(currentTab);
        
        var html = '<aside class="dashboard-right"' + (hideRight ? ' style="display:none;"' : '') + '>' +
            '<div class="right-section"><h3 class="right-section-title">Calendar</h3>' + this.renderCalendar() + '</div>';
        
        if (role === 'student' || role === 'admin') {
            if (headlines.length > 0) {
                html += '<div class="right-section"><h3 class="right-section-title">Featured</h3>';
                headlines.slice(0, 2).forEach(function(h) {
                    html += '<div style="background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:white;padding:12px;border-radius:var(--radius-sm);margin-bottom:8px;">' +
                        '<div style="font-weight:600;font-size:14px;">' + h.title + '</div>' +
                        '<div style="font-size:12px;opacity:0.9;margin-top:4px;">' + h.content + '</div></div>';
                });
                html += '</div>';
            }
        }
        
        if (role === 'student') {
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
                    this.renderDashboardRight('admin', this.currentAdminTab) +
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
                    this.renderDashboardRight('student', this.currentStudentTab) +
                '</div>' +
            '</div>';
        setTimeout(function() {
            self.attachDashboardListeners('student');
        }, 100);
    },

    // ========== ADMIN CONTENT ==========
renderAdminContent: function() {
        var self = this;
        var titles = {
            overview: 'Dashboard',
            events: 'Events', 
            announcements: 'News & Updates',
            headlines: 'Featured',
            'post-requests': 'Post Requests',
            students: 'Students', 
            administrators: 'Administrators',
            organization: 'Organization',
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
        var isSuperAdmin = this.currentUser.adminRole === 'Super Admin';
        
        switch(this.currentAdminTab) {
            case 'overview': content = this.renderAdminOverview(); break;
            case 'events': content = this.renderAdminEvents(); break;
            case 'announcements': content = this.renderAdminAnnouncements(); break;
            case 'headlines': content = this.renderAdminHeadlines(); break;
            case 'post-requests': content = this.renderPostRequests(); break;
            case 'attendance': content = this.renderAdminAttendance(); break;
            case 'students': if (isSuperAdmin) { if (self.currentStudentDetail) { var s = self.data.users.find(function(u) { return u.id === self.currentStudentDetail; }); content = s ? self.renderStudentDetail(s) : self.renderAdminStudents(); } else { content = self.renderAdminStudents(); } } break;
            case 'administrators': if (isSuperAdmin) content = this.renderAddAdmin(); break;
            case 'organization': content = this.renderOrganization(); break;
            case 'pending': if (isSuperAdmin) { if (self.currentPendingDetail) { var p = self.data.users.find(function(u) { return u.id === self.currentPendingDetail; }); content = p ? self.renderPendingDetail(p) : self.renderAdminPending(); } else { content = self.renderAdminPending(); } } break;
            case 'files': content = this.renderAdminFiles(); break;
            case 'reports': content = this.renderAdminReports(); break;
            case 'finance': content = this.renderAdminFinance(); break;
            case 'polls': content = this.renderAdminPolls(); break;
            case 'suggestions': content = this.renderAdminSuggestions(); break;
            case 'complaints': content = this.renderAdminComplaints(); break;
            case 'analytics': content = this.renderAdminAnalytics(); break;
            default: content = this.renderAdminOverview(); break;
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
                '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">₱' + (finance.currentFunds || 0).toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalExpenses || 0).toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalFundsRaised || 0).toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
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
            
            // Apply sorting - pinned events first, then by date
            var pinnedEvents = filteredEvents.filter(function(e) { return e.pinned; });
            var unpinnedEvents = filteredEvents.filter(function(e) { return !e.pinned; });
            
            unpinnedEvents.sort(function(a, b) { 
                if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
                if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
                return 0;
            });
            
            filteredEvents = pinnedEvents.concat(unpinnedEvents);
            
            html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;max-width:100%;">';
            for (var i = 0; i < filteredEvents.length; i++) {
                var e = filteredEvents[i];
                var statusClass = e.status === 'upcoming' ? 'badge-primary' : e.status === 'finished' ? 'badge-success' : e.status === 'cancelled' ? 'badge-danger' : 'badge-warning';
                var statusLabel = e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Upcoming';
                
                var mediaHtml = '';
                if (e.mediaGallery && e.mediaGallery.length > 0) {
                    var firstMedia = e.mediaGallery[0];
                    if (firstMedia.type === 'video') {
                        mediaHtml = '<div style="margin-top:12px;cursor:pointer;" onclick="App.viewEventGallery(' + e.id + ', 0)"><video controls style="width:100%;max-height:200px;border-radius:8px;"><source src="' + firstMedia.data + '"></video></div>';
                    } else {
                        mediaHtml = '<div style="margin-top:12px;cursor:pointer;" onclick="App.viewEventGallery(' + e.id + ', 0)"><img src="' + firstMedia.data + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;"></div>';
                    }
                    if (e.mediaGallery.length > 1) {
                        mediaHtml += '<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">';
                        e.mediaGallery.forEach(function(m, idx) {
                            if (idx > 0) {
                                if (m.type === 'image') {
                                    mediaHtml += '<img src="' + m.data + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;cursor:pointer;" onclick="App.viewEventGallery(' + e.id + ', ' + idx + ')">';
                                } else {
                                    mediaHtml += '<div style="width:50px;height:50px;background:#333;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;" onclick="App.viewEventGallery(' + e.id + ', ' + idx + ')"><i class="fas fa-video"></i></div>';
                                }
                            }
                        });
                        mediaHtml += '</div>';
                    }
                } else if (e.media) {
                    mediaHtml = '<div style="margin-top:12px;cursor:pointer;" onclick="App.viewImage(\'' + e.media + '\')"><img src="' + e.media + '" style="width:100%;height:200px;object-fit:cover;border-radius:8px;"></div>';
                }
                
                html += '<div class="card" style="overflow:hidden;">' +
                    '<div class="card-header"><h3 class="card-title">' + e.title + '</h3>' +
                    '<span class="card-badge ' + (e.pinned ? 'badge-warning' : 'badge-primary') + '">' + (e.pinned ? 'Pinned' : 'Event') + '</span></div>' +
                    '<div class="card-body"><div style="text-align:center;margin-bottom:12px;">' +
                    '<span class="badge ' + statusClass + '">' + statusLabel + '</span>' +
                    '<span class="badge badge-secondary" style="margin-left:8px;">' + (e.category || 'General') + '</span>' +
                    (e.batch ? '<span class="badge badge-secondary" style="margin-left:8px;">' + e.batch + '</span>' : '') + '</div>' +
                    '<div class="event-details">' +
                    '<div class="event-detail"><i class="fas fa-calendar"></i> ' + e.date + '</div>' +
                    '<div class="event-detail"><i class="fas fa-clock"></i> ' + e.time + '</div>' +
                    '<div class="event-detail"><i class="fas fa-map-marker-alt"></i> ' + e.location + '</div></div>' +
                    (e.evaluationLink ? '<div style="margin-top:8px;"><a href="' + e.evaluationLink + '" target="_blank" style="color:var(--primary-color);font-size:13px;"><i class="fas fa-clipboard"></i> Evaluation Form</a></div>' : '') +
                    mediaHtml +
                    '<p class="card-text mt-4">' + e.description + '</p></div>' +
                    '<div class="card-footer">' +
                    '<button class="btn btn-secondary btn-sm" data-action="edit-event" data-id="' + e.id + '">Edit</button>' +
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

    filterComplaints: function(status) {
        this.currentFilter.complaintStatus = status;
        this.renderAdminDashboard();
    },

    renderCreateEventModal: function() {
        return '<div id="event-modal" class="modal" style="display:none;align-items:center;justify-content:center;" onclick="if(event.target === this) this.style.display=\'none\'">' +
            '<div class="modal-content" style="max-width:600px;margin:auto;max-height:90vh;overflow-y:auto;">' +
                '<div class="modal-header"><h3>Create Event</h3><button type="button" class="modal-close" id="close-event-modal" onclick="document.getElementById(\'event-modal\').style.display=\'none\'">&times;</button></div>' +
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
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
                '<div class="form-group"><label class="form-label">Year *</label>' +
                '<select class="form-input" id="event-year" required>' +
                '<option value="">Select</option>' +
                '<option value="2025">2025</option>' +
                '<option value="2026">2026</option>' +
                '<option value="2027">2027</option>' +
                '<option value="2028">2028</option>' +
                '<option value="2029">2029</option>' +
                '<option value="2030">2030</option>' +
                '</select></div>' +
                '<div class="form-group"><label class="form-label">Month *</label>' +
                '<select class="form-input" id="event-month" required>' +
                '<option value="">Select</option>' +
                '<option value="01">Jan</option>' +
                '<option value="02">Feb</option>' +
                '<option value="03">Mar</option>' +
                '<option value="04">Apr</option>' +
                '<option value="05">May</option>' +
                '<option value="06">Jun</option>' +
                '<option value="07">Jul</option>' +
                '<option value="08">Aug</option>' +
                '<option value="09">Sep</option>' +
                '<option value="10">Oct</option>' +
                '<option value="11">Nov</option>' +
                '<option value="12">Dec</option>' +
                '</select></div>' +
                '<div class="form-group"><label class="form-label">Day *</label>' +
                '<select class="form-input" id="event-day" required>' +
                '<option value="">Select</option>' +
                '</select></div></div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                '<div class="form-group"><label class="form-label">Time *</label>' +
                '<input type="time" class="form-input" id="event-time" required list="time-options">' +
                '<datalist id="time-options">' +
                '<option value="07:00">' +
                '<option value="08:00">' +
                '<option value="09:00">' +
                '<option value="10:00">' +
                '<option value="11:00">' +
                '<option value="12:00">' +
                '<option value="13:00">' +
                '<option value="14:00">' +
                '<option value="15:00">' +
                '<option value="16:00">' +
                '<option value="17:00">' +
                '<option value="18:00">' +
                '<option value="19:00">' +
                '<option value="20:00">' +
                '</datalist></div>' +
                '<div class="form-group"><label class="form-label">&nbsp;</label>' +
                '<div style="font-size:11px;color:var(--text-light);padding-top:8px;">Type or select time</div></div></div>' +
                '<div class="form-group"><label class="form-label">Location *</label><input type="text" class="form-input" id="event-location" required></div>' +
                '<div class="form-group"><label class="form-label">Description</label><textarea class="form-input" id="event-description" rows="3"></textarea></div>' +
                '<div class="form-group"><label class="form-label">Images/Videos (Select multiple)</label>' +
                '<div class="file-upload-wrapper" id="event-media-upload" style="cursor:pointer;min-height:100px;">' +
                '<div class="file-upload-icon"><i class="fas fa-images"></i></div>' +
                '<div class="file-upload-text">Click to select <span>Images/Videos</span></div>' +
                '<div class="file-preview" id="event-media-preview" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;"></div></div>' +
                '<input type="file" id="event-media-input" accept="image/*,video/*" multiple style="display:none;"></div>' +
                '<div class="form-group"><label class="form-label">Evaluation Form Link (Optional)</label><input type="url" class="form-input" id="event-evaluation-link" placeholder="https://docs.google.com/forms/..."></div>' +
                '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="event-evaluation-enabled"><span>Enable Evaluation</span></label></div>' +
                '<div class="form-group"><label class="checkbox-label"><input type="checkbox" id="event-pin"><span>Pin this event (will appear first)</span></label></div>' +
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
            '<button class="btn btn-secondary" id="create-headline-btn"><i class="fas fa-star"></i> Featured</button>' +
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
        var isSuperAdmin = this.currentUser.adminRole === 'Super Admin';
        
        if (isSuperAdmin) {
            return this.renderPostRequests();
        }
        
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="create-headline-btn"><i class="fas fa-paper-plane"></i> Request Post</button></div>' +
            '<p style="color:var(--text-light);margin-top:8px;">Submit your featured post request. Super Admin will review and approve.</p>';
        
        if (headlines.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-star"></i></div><h3 class="empty-title">No Featured Posts</h3><p class="empty-text">Request a post to show on student dashboard</p></div>';
        } else {
            html += '<div class="cards-grid">';
            headlines.forEach(function(h) {
                html += '<div class="card" style="background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:white;">' +
                    '<div class="card-header" style="border-bottom:1px solid rgba(255,255,255,0.2);color:white;">' +
                    '<span class="card-title" style="color:white;">' + h.title + '</span>' +
                    '<div><span class="badge badge-light">' + (h.status || 'Active') + '</span></div></div>' +
                    '<div class="card-body">' +
                    '<p style="font-size:14px;opacity:0.95;">' + h.content + '</p>' +
                    '<p style="font-size:12px;opacity:0.7;margin-top:8px;">Posted: ' + h.date + '</p>' +
                    '</div></div>';
            });
            html += '</div>';
        }
        
        html += '<div id="headline-modal" class="modal" style="display:none;align-items:center;justify-content:center;">' +
            '<div class="modal-content">' +
            '<div class="modal-header"><h3>Request Featured Post</h3><button class="modal-close" id="close-headline-modal">&times;</button></div>' +
            '<form id="headline-form">' +
            '<div class="form-group"><label class="form-label">Title *</label><input type="text" class="form-input" id="headline-title" required></div>' +
            '<div class="form-group"><label class="form-label">Content *</label><textarea class="form-input" id="headline-content" rows="3" required></textarea></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Submit Request</button></div>' +
            '</form></div></div>';
        
        return html;
    },

    renderPostRequests: function() {
        var self = this;
        var postRequests = this.data.postRequests || [];
        var isSuperAdmin = this.currentUser.adminRole === 'Super Admin';
        var myRequests = postRequests.filter(function(r) { return r.requestedByEmail === self.currentUser.email; });
        
        if (isSuperAdmin) {
            var approvedHeadlines = (this.data.headlines || []).filter(function(h) { return h.status === 'approved'; });
            var pendingRequests = postRequests.filter(function(r) { return r.status === 'pending'; });
            var onReviewRequests = postRequests.filter(function(r) { return r.status === 'on_review'; });
            
            var html = '<div class="content-actions">' +
                '<h3 style="margin:0;">Post Requests</h3></div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px;">' +
                '<div><h4 style="margin-bottom:12px;">Pending (' + pendingRequests.length + ')</h4>';
            
            if (pendingRequests.length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-inbox"></i></div><h3 class="empty-title">No Pending</h3></div>';
            } else {
                html += '<div class="cards-grid">';
                pendingRequests.forEach(function(req) {
                    var typeLabel = req.contentType || 'Featured';
                    html += '<div class="card" style="border-left:4px solid var(--warning-color);">' +
                        '<div class="card-header">' +
                        '<span class="card-title">' + req.title + '</span>' +
                        '<span class="badge badge-warning">' + req.status + '</span>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<p style="font-size:13px;">' + req.content + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">Type: ' + typeLabel + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">From: ' + (req.requestedBy || 'Unknown') + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">Email: ' + (req.requestedByEmail || 'N/A') + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">Date: ' + req.date + '</p>' +
                        '<div style="margin-top:8px;">' +
                        '<button class="btn btn-success btn-sm" data-action="approve-post-request" data-id="' + req.id + '"><i class="fas fa-check"></i> Approve</button> ' +
                        '<button class="btn btn-warning btn-sm" data-action="onreview-post-request" data-id="' + req.id + '"><i class="fas fa-eye"></i> On Review</button> ' +
                        '<button class="btn btn-danger btn-sm" data-action="reject-post-request" data-id="' + req.id + '"><i class="fas fa-times"></i> Deny</button>' +
                        '</div>' +
                        '</div></div>';
                });
                html += '</div>';
            }
            
            html += '</div><div><h4 style="margin-bottom:12px;">On Review (' + onReviewRequests.length + ')</h4>';
            
            if (onReviewRequests.length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-eye"></i></div><h3 class="empty-title">No On Review</h3></div>';
            } else {
                html += '<div class="cards-grid">';
                onReviewRequests.forEach(function(req) {
                    var typeLabel = req.contentType || 'Featured';
                    html += '<div class="card" style="border-left:4px solid var(--info-color);">' +
                        '<div class="card-header">' +
                        '<span class="card-title">' + req.title + '</span>' +
                        '<span class="badge badge-info">' + req.status + '</span>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<p style="font-size:13px;">' + req.content + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">Type: ' + typeLabel + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">From: ' + (req.requestedBy || 'Unknown') + '</p>' +
                        '<div style="margin-top:8px;">' +
                        '<button class="btn btn-success btn-sm" data-action="approve-post-request" data-id="' + req.id + '"><i class="fas fa-check"></i> Approve</button> ' +
                        '<button class="btn btn-danger btn-sm" data-action="reject-post-request" data-id="' + req.id + '"><i class="fas fa-times"></i> Deny</button>' +
                        '</div>' +
                        '</div></div>';
                });
                html += '</div>';
            }
            
            html += '</div></div><div style="margin-top:24px;"><h4 style="margin-bottom:12px;">Approved Posts (' + approvedHeadlines.length + ')</h4>';
            
            if (approvedHeadlines.length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-star"></i></div><h3 class="empty-title">No Approved Posts</h3></div>';
            } else {
                html += '<div class="cards-grid">';
                approvedHeadlines.forEach(function(h) {
                    html += '<div class="card" style="background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:white;">' +
                        '<div class="card-header" style="border-bottom:1px solid rgba(255,255,255,0.2);color:white;">' +
                        '<span class="card-title" style="color:white;">' + h.title + '</span>' +
                        '<button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:none;" data-action="delete-headline" data-id="' + h.id + '"><i class="fas fa-trash"></i></button>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<p style="font-size:14px;opacity:0.95;">' + h.content + '</p>' +
                        '<p style="font-size:12px;opacity:0.7;margin-top:8px;">Posted: ' + h.date + '</p>' +
                        '</div></div>';
                });
                html += '</div>';
            }
            
            html += '</div>';
            
            return html;
        } else {
            var pending = myRequests.filter(function(r) { return r.status === 'pending'; });
            var onReview = myRequests.filter(function(r) { return r.status === 'on_review'; });
            var posted = myRequests.filter(function(r) { return r.status === 'approved'; });
            var denied = myRequests.filter(function(r) { return r.status === 'denied'; });
            
            var html = '<div class="content-actions">' +
                '<h3 style="margin:0;">My Post Requests</h3></div>' +
                '<div style="margin-top:16px;">' +
                '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;">' +
                '<div style="background:var(--warning-color);color:white;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:bold;">' + pending.length + '</div><div>Pending</div></div>' +
                '<div style="background:var(--info-color);color:white;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:bold;">' + onReview.length + '</div><div>On Review</div></div>' +
                '<div style="background:var(--success-color);color:white;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:bold;">' + posted.length + '</div><div>Posted</div></div>' +
                '<div style="background:var(--danger-color);color:white;padding:16px;border-radius:8px;text-align:center;"><div style="font-size:24px;font-weight:bold;">' + denied.length + '</div><div>Denied</div></div>' +
                '</div>';
            
            if (myRequests.length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-inbox"></i></div><h3 class="empty-title">No Requests</h3><p class="empty-text">Submit a post request from any tab</p></div>';
            } else {
                html += '<h4 style="margin-bottom:12px;">All My Requests</h4><div class="cards-grid">';
                myRequests.forEach(function(req) {
                    var statusClass = req.status === 'approved' ? 'success' : req.status === 'denied' ? 'danger' : req.status === 'on_review' ? 'info' : 'warning';
                    var typeLabel = req.contentType || 'Featured';
                    html += '<div class="card" style="border-left:4px solid var(--' + statusClass + '-color);">' +
                        '<div class="card-header">' +
                        '<span class="card-title">' + req.title + '</span>' +
                        '<span class="badge badge-' + statusClass + '">' + req.status + '</span>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<p style="font-size:13px;">' + req.content + '</p>' +
                        '<p style="font-size:11px;color:var(--text-light);">Type: ' + typeLabel + ' | Date: ' + req.date + '</p>' +
                        (req.status === 'denied' ? '<button class="btn btn-danger btn-sm" style="margin-top:8px;" data-action="remove-denied-request" data-id="' + req.id + '"><i class="fas fa-trash"></i> Remove</button>' : '') +
                        '</div></div>';
                });
                html += '</div>';
            }
            
            html += '</div>';
            return html;
        }
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
                '<td>' +
                '<button class="btn btn-sm btn-warning" data-action="view-qr-code" data-id="' + q.id + '" data-url="' + encodeURIComponent(qrUrl) + '"><i class="fas fa-qrcode"></i> QR</button> ' +
                '<button class="btn btn-sm btn-info" data-action="view-qr-attendees" data-id="' + q.id + '"><i class="fas fa-users"></i> View</button> ' +
                (attendeeCount > 0 ? '<button class="btn btn-sm btn-primary" data-action="export-qr-attendance" data-id="' + q.id + '"><i class="fas fa-download"></i> Export</button> ' : '') +
                '<button class="btn btn-sm btn-danger" data-action="delete-qr-code" data-id="' + q.id + '"><i class="fas fa-trash"></i> Delete</button>' +
                '</td></tr>';
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

        // QR Generation Success Modal (full screen overlay)
        html += '<div id="qr-generation-modal" class="qr-modal-overlay" style="display:none;">' +
            '<div class="qr-modal-content">' +
            '<button class="modal-close" id="close-qr-generation-modal" style="position:absolute;top:12px;right:12px;z-index:10;background:none;border:none;font-size:28px;cursor:pointer;color:var(--text-light);line-height:1;">&times;</button>' +
            '<h2 class="qr-modal-title">QR Code Generated</h2>' +
            '<p class="qr-modal-subtitle">Your QR code for event attendance is ready.</p>' +
            '<div class="qr-modal-image-container">' +
            '<img id="qr-generation-image" class="qr-modal-image" alt="QR Code">' +
            '</div>' +
            '<div class="qr-modal-details">' +
            '<div><strong>Event:</strong> <span id="qr-generation-event"></span></div>' +
            '<div><strong>Code:</strong> <div class="qr-modal-code" id="qr-generation-code"></div></div>' +
            '<div><strong>Date Generated:</strong> <span id="qr-generation-date"></span></div>' +
            '</div>' +
            '<div class="qr-modal-buttons">' +
            '<button class="qr-modal-btn primary" id="modal-download-qr-btn"><i class="fas fa-download"></i> Download</button>' +
            '<button class="qr-modal-btn secondary" id="modal-close-qr-btn"><i class="fas fa-times"></i> Close</button>' +
            '</div>' +
            '</div></div>';
        
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
        var block = this.currentFilter.studentBlock || '';
        var section = this.currentFilter.studentSection || '';
        var batch = this.currentFilter.studentBatch || '';
        var showActive = this.currentFilter.studentActive !== 'false';
        
        var students = (this.data.users || []).filter(function(u) { return u.role === 'student'; });
        var self = this;
        
        var statusFilter = this.currentFilter.studentStatus || 'active';
        if (statusFilter === 'active') {
            students = students.filter(function(s) { return s.active === true; });
        } else if (statusFilter === 'inactive') {
            students = students.filter(function(s) { return s.active !== true; });
        }
        
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
        if (block) {
            students = students.filter(function(s) { return s.block === block; });
        }
        if (section) {
            students = students.filter(function(s) { return s.section === section; });
        }
        if (batch) {
            students = students.filter(function(s) { return s.batch === batch; });
        }
        // if 'all', show all students (no filter)
        
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
            '<option value="BSIT">BSIT</option>' +
            '<option value="BSCPE">BSCPE</option>' +
            '<option value="BSBA">BSBA</option>' +
            '<option value="BSAIS">BSAIS</option>' +
            '<option value="BSHM">BSHM</option>' +
            '</select>' +
            '<select class="form-input" id="student-block" style="width:120px;">' +
            '<option value="">All Blocks</option>' +
            '<option value="101">101</option>' +
            '<option value="102">102</option>' +
            '<option value="201">201</option>' +
            '<option value="202">202</option>' +
            '<option value="301">301</option>' +
            '<option value="302">302</option>' +
            '<option value="401">401</option>' +
            '<option value="402">402</option>' +
            '</select>' +
            '<select class="form-input" id="student-batch" style="width:150px;">' +
            '<option value="">All Batches</option>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option>' +
            '</select>' +
            '<select class="form-input" id="student-status-filter" style="width:140px;">' +
            '<option value="active">Active Only</option>' +
            '<option value="inactive">Inactive Only</option>' +
            '<option value="all">Show All</option>' +
            '</select>' +
            '<button class="btn btn-secondary" id="end-semester-btn" style="margin-left:auto;"><i class="fas fa-graduation-cap"></i> End Semester</button></div>' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
            '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;">' +
            '<input type="checkbox" id="select-all-students"> <strong>Select All</strong>' +
            '</label>' +
            '<button class="btn btn-danger btn-sm" id="delete-selected-students" style="display:none;"><i class="fas fa-trash"></i> Delete Selected (<span id="selected-count">0</span>)</button>' +
            '</div>' +
            '<div class="table-container"><table class="table"><thead><tr><th style="width:40px;"><input type="checkbox" id="select-all-checkbox-header"></th><th style="width:60px;">Photo</th><th>Name</th><th>Student ID</th><th>Course</th><th>Block</th><th>Section</th><th>Batch</th><th>Organization</th><th>Position</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        
        if (students.length === 0) {
            var noMsg = searchQuery || course || section || batch ? 'No students match your search/filters' : 'No active students';
            html += '<tr><td colspan="11" style="text-align:center;">' + noMsg + '</td></tr>';
        } else {
            students.forEach(function(s) {
                var profilePicHtml = s.profilePic ? 
                    '<img src="' + s.profilePic + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;cursor:pointer;" onclick="App.viewImage(\'' + s.profilePic + '\')" title="Click to view">' :
                    '<div class="profile-avatar" style="width:40px;height:40px;font-size:14px;">' + (s.name ? s.name.charAt(0) : '?') + '</div>';
                
                html += '<tr>' +
                    '<td><input type="checkbox" class="student-checkbox" value="' + s.id + '"></td>' +
                    '<td>' + profilePicHtml + '</td>' +
                    '<td><a href="#" onclick="App.showStudentModal(' + s.id + ');return false;" style="color:var(--primary-color);font-weight:600;text-decoration:none;">' + s.name + '</a></td>' +
                    '<td>' + s.studentId + '</td>' +
                    '<td>' + (s.course || 'N/A') + '</td>' +
                    '<td>' + (s.block || 'N/A') + '</td>' +
                    '<td>' + (s.section || 'N/A') + '</td>' +
                    '<td>' + (s.batch || 'N/A') + '</td>' +
                    '<td>' + (s.organization && s.organization.name ? s.organization.name : '-') + '</td>' +
                    '<td>' + (s.organization && s.organization.position ? s.organization.position : '-') + '</td>' +
                    '<td>' + s.email + '</td>' +
                    '<td>' + (s.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-secondary">Inactive</span>') + '</td>' +
                    '<td style="white-space:nowrap;">' + 
                    '<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">' +
                    '<button class="btn btn-' + (s.active ? 'warning' : 'success') + ' btn-sm" style="font-size:11px;padding:4px 8px;" data-action="toggle-student" data-id="' + s.id + '">' + (s.active ? 'Deactivate' : 'Activate') + '</button> ' +
                    '<button class="btn btn-secondary btn-sm" style="font-size:11px;padding:4px 8px;" data-action="edit-student" data-id="' + s.id + '"><i class="fas fa-edit"></i> Edit</button> ' +
                    '<button class="btn btn-warning btn-sm" style="font-size:11px;padding:4px 8px;" data-action="reset-password" data-id="' + s.id + '"><i class="fas fa-key"></i> Reset</button> ' +
                    '<button class="btn btn-danger btn-sm" style="font-size:11px;padding:4px 8px;" data-action="delete-student" data-id="' + s.id + '"><i class="fas fa-trash"></i></button></div></td></tr>';
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
                    '<td style="white-space:nowrap;"><div style="display:flex;gap:4px;">' +
                    '<button class="btn btn-' + (s.active ? 'warning' : 'success') + ' btn-sm" style="font-size:11px;padding:4px 8px;" data-action="toggle-student" data-id="' + s.id + '">' + (s.active ? 'Deactivate' : 'Activate') + '</button> ' +
                    '<button class="btn btn-danger btn-sm" style="font-size:11px;padding:4px 8px;" data-action="delete-student" data-id="' + s.id + '"><i class="fas fa-trash"></i></button></div></td></tr>';
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
        var searchQuery = this.currentFilter.pendingSearch || '';
        var courseFilter = this.currentFilter.pendingCourse || '';
        var blockFilter = this.currentFilter.pendingBlock || '';
        var batchFilter = this.currentFilter.pendingBatch || '';
        
        var pendingUsers = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status === 'pending'; });
        var self = this;
        
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            pendingUsers = pendingUsers.filter(function(u) {
                return (u.name && u.name.toLowerCase().includes(searchQuery)) ||
                       (u.studentId && u.studentId.toLowerCase().includes(searchQuery)) ||
                       (u.email && u.email.toLowerCase().includes(searchQuery));
            });
        }
        if (courseFilter) {
            pendingUsers = pendingUsers.filter(function(u) { return u.course === courseFilter; });
        }
        if (blockFilter) {
            pendingUsers = pendingUsers.filter(function(u) { return u.block === blockFilter; });
        }
        if (batchFilter) {
            pendingUsers = pendingUsers.filter(function(u) { return u.batch === batchFilter; });
        }
        
        var html = '<div class="content-actions" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:20px;">' +
            '<input type="text" class="form-input" id="pending-search" placeholder="Search by name, ID, or email..." style="width:280px;">' +
            '<select class="form-input" id="pending-course" style="width:140px;">' +
            '<option value="">All Courses</option>' +
            '<option value="BSIT">BSIT</option>' +
            '<option value="BSCPE">BSCPE</option>' +
            '<option value="BSBA">BSBA</option>' +
            '<option value="BSAIS">BSAIS</option>' +
            '<option value="BSHM">BSHM</option>' +
            '</select>' +
            '<select class="form-input" id="pending-block" style="width:120px;">' +
            '<option value="">All Blocks</option>' +
            '<option value="101">101</option>' +
            '<option value="102">102</option>' +
            '<option value="201">201</option>' +
            '<option value="202">202</option>' +
            '<option value="301">301</option>' +
            '<option value="302">302</option>' +
            '<option value="401">401</option>' +
            '<option value="402">402</option>' +
            '</select>' +
            '<select class="form-input" id="pending-batch" style="width:150px;">' +
            '<option value="">All Batches</option>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option>' +
            '</select>' +
            '<span style="margin-left:auto;font-size:13px;color:var(--text-light);">' + pendingUsers.length + ' pending request(s)</span></div>';
        
        if (pendingUsers.length === 0) {
            var noMsg = searchQuery || courseFilter || blockFilter || batchFilter ? 'No requests match your filters' : 'No Pending Requests';
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-clock"></i></div>' +
                '<h3 class="empty-title">' + noMsg + '</h3><p class="empty-text">' + (searchQuery || courseFilter || blockFilter || batchFilter ? 'Try adjusting your search or filters' : 'All registration requests have been processed') + '</p></div>';
        } else {
            html += '<div style="display:flex;flex-direction:column;gap:12px;max-width:800px;">';
            pendingUsers.forEach(function(user) {
                var profilePicHtml = user.profilePic ? 
                    '<img src="' + user.profilePic + '" style="width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color);cursor:pointer;" onclick="App.viewImage(this.src)" title="View Profile">' :
                    '<div style="width:50px;height:50px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:20px;">' + (user.name ? user.name.charAt(0).toUpperCase() : '?') + '</div>';
                
                var hasDocs = user.profilePic || user.schoolIdPic;
                
                html += '<div onclick="App.showPendingDetail(' + user.id + ')" style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;cursor:pointer;transition:all 0.2s;">' +
                    '<div style="display:flex;align-items:center;gap:16px;">' +
                    '<div style="flex-shrink:0;">' + profilePicHtml + '</div>' +
                    '<div style="flex:1;min-width:150px;">' +
                    '<div style="font-weight:600;font-size:15px;">' + (user.name || 'Unknown') + '</div>' +
                    '<div style="font-size:12px;color:var(--text-light);">' + (user.studentId || '') + ' | ' + (user.email || '') + '</div>' +
                    '<div style="font-size:12px;color:var(--text-light);margin-top:4px;">' +
                    '<span style="background:var(--primary-color);color:white;padding:2px 8px;border-radius:4px;font-size:11px;">' + (user.course || 'N/A') + '</span> ' +
                    '<span style="background:var(--bg-color);padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px;">Block ' + (user.block || 'N/A') + '</span> ' +
                    '<span style="background:var(--bg-color);padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px;">Sec ' + (user.section || 'N/A') + '</span> ' +
                    '<span style="background:var(--bg-color);padding:2px 8px;border-radius:4px;font-size:11px;margin-left:4px;">' + (user.batch || 'N/A') + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div style="flex-shrink:0;">' +
                    '<span class="badge badge-warning">Pending</span>' +
                    '</div>' +
                    '<div style="flex-shrink:0;display:flex;gap:8px;" onclick="event.stopPropagation();">' +
                    (hasDocs ? '<button class="btn btn-secondary btn-sm" onclick="App.showDocModal(' + user.id + ')"><i class="fas fa-file-image"></i></button>' : '') +
                    '<button class="btn btn-success btn-sm" data-action="approve-user" data-id="' + user.id + '" title="Approve"><i class="fas fa-check"></i></button> ' +
                    '<button class="btn btn-danger btn-sm" data-action="deny-user" data-id="' + user.id + '" title="Deny"><i class="fas fa-times"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
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

    showPendingDetail: function(userId) {
        var user = this.data.users.find(function(u) { return u.id === userId; });
        if (!user) return;
        
        this.currentPendingDetail = userId;
        this.renderAdminDashboard();
    },

    renderPendingDetail: function(user) {
        var profileImg = user.profilePic ? '<img src="' + user.profilePic + '" style="max-width:180px;max-height:180px;border-radius:8px;object-fit:cover;cursor:pointer;border:1px solid var(--border-color);" onclick="App.viewImage(this.src)">' : '<div style="width:180px;height:140px;display:flex;align-items:center;justify-content:center;background:var(--bg-color);border-radius:8px;color:var(--text-light);">No Profile</div>';
        var schoolIdImg = user.schoolIdPic ? '<img src="' + user.schoolIdPic + '" style="max-width:220px;max-height:140px;border-radius:8px;object-fit:cover;cursor:pointer;border:1px solid var(--border-color);" onclick="App.viewImage(this.src)">' : '<div style="width:220px;height:140px;display:flex;align-items:center;justify-content:center;background:var(--bg-color);border-radius:8px;color:var(--text-light);">No School ID</div>';
        
        var addressStr = user.address && (user.address.street || user.address.barangay || user.address.city || user.address.province) ? 
            [user.address.street, user.address.barangay, user.address.city, user.address.province].filter(Boolean).join(', ') : 'N/A';
        
        return '<div class="student-detail-view">' +
            '<div class="student-detail-header">' +
            '<button onclick="App.closePendingDetail()"><i class="fas fa-arrow-left"></i> Back</button>' +
            '<h2 style="margin:0;flex:1;">Account Request - ' + (user.name || 'Unknown') + '</h2>' +
            '</div>' +
            '<div style="display:flex;gap:20px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:300px;">' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:20px;text-align:center;margin-bottom:16px;">' +
            (user.profilePic ? '<img src="' + user.profilePic + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--warning-color);cursor:pointer;" onclick="App.viewImage(this.src)" title="View Full">' : '<div style="width:100px;height:100px;border-radius:50%;background:var(--warning-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:40px;margin:0 auto;">' + (user.name ? user.name.charAt(0).toUpperCase() : '?') + '</div>') +
            '<h3 style="margin:16px 0 8px;">' + (user.name || 'Unknown') + '</h3>' +
            '<span class="badge badge-warning">Pending</span>' +
            '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">' +
            '<button class="btn btn-danger btn-sm" onclick="if(confirm(\'Deny this request?\')){App.denyUser(' + user.id + ');}"><i class="fas fa-times"></i> Deny</button> ' +
            '<button class="btn btn-success btn-sm" onclick="if(confirm(\'Approve this request?\')){App.approveUser(' + user.id + ');}"><i class="fas fa-check"></i> Approve</button>' +
            '</div>' +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;">' +
            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">SUBMITTED DOCUMENTS</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
            '<div style="text-align:center;"><div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">Profile Picture</div>' + profileImg + '</div>' +
            '<div style="text-align:center;"><div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">School ID</div>' + schoolIdImg + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div style="flex:2;min-width:350px;">' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:20px;margin-bottom:16px;">' +
            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">PERSONAL INFORMATION</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:14px;">' +
            '<div><span style="color:var(--text-light);font-size:12px;">Student ID</span><div style="font-weight:600;">' + (user.studentId || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Email</span><div style="font-weight:600;word-break:break-all;">' + (user.email || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Birthday</span><div style="font-weight:600;">' + (user.birthday || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Cellphone</span><div style="font-weight:600;">' + (user.cellphone || 'N/A') + '</div></div>' +
            '<div style="grid-column:1/-1;"><span style="color:var(--text-light);font-size:12px;">Address</span><div style="font-weight:600;">' + addressStr + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Registered</span><div style="font-weight:600;">' + (user.createdAt || 'N/A') + '</div></div>' +
            '</div>' +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:20px;margin-bottom:16px;">' +
            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">ACADEMIC INFORMATION</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;font-size:14px;">' +
            '<div><span style="color:var(--text-light);font-size:12px;">Course</span><div style="font-weight:600;">' + (user.course || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Block</span><div style="font-weight:600;">' + (user.block || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Term</span><div style="font-weight:600;">' + (user.term || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Section</span><div style="font-weight:600;">' + (user.section || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Batch</span><div style="font-weight:600;">' + (user.batch || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Academic Year</span><div style="font-weight:600;">' + (user.academicYear || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Semester</span><div style="font-weight:600;">' + (user.semester || 'N/A') + '</div></div>' +
            '</div>' +
            (user.previousYearHistory && (user.previousYearHistory.firstYear1st || user.previousYearHistory.firstYear2nd || user.previousYearHistory.secondYear1st || user.previousYearHistory.secondYear2nd || user.previousYearHistory.thirdYear1st || user.previousYearHistory.thirdYear2nd || user.previousYearHistory.fourthYear1st || user.previousYearHistory.fourthYear2nd) ?
            '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color);">' +
            '<h5 style="margin:0 0 8px;font-size:12px;color:var(--text-light);">Previous Academic History</h5>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;margin-bottom:8px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">1st Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 101' + (user.previousYearHistory && user.previousYearHistory.firstYear1st ? user.previousYearHistory.firstYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">1st Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 102' + (user.previousYearHistory && user.previousYearHistory.firstYear2nd ? user.previousYearHistory.firstYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;margin-bottom:8px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">2nd Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 201' + (user.previousYearHistory && user.previousYearHistory.secondYear1st ? user.previousYearHistory.secondYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">2nd Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 202' + (user.previousYearHistory && user.previousYearHistory.secondYear2nd ? user.previousYearHistory.secondYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;margin-bottom:8px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">3rd Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 301' + (user.previousYearHistory && user.previousYearHistory.thirdYear1st ? user.previousYearHistory.thirdYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">3rd Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 302' + (user.previousYearHistory && user.previousYearHistory.thirdYear2nd ? user.previousYearHistory.thirdYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">4th Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 401' + (user.previousYearHistory && user.previousYearHistory.fourthYear1st ? user.previousYearHistory.fourthYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">4th Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 402' + (user.previousYearHistory && user.previousYearHistory.fourthYear2nd ? user.previousYearHistory.fourthYear2nd : '') + '</div></div></div>' +
            '</div>' : '') +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:20px;">' +
            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">EMERGENCY CONTACT</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;font-size:14px;">' +
            '<div><span style="color:var(--text-light);font-size:12px;">Contact Name</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.name ? user.emergencyContact.name : 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Relationship</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.relationship ? user.emergencyContact.relationship : 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Cellphone</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.cellphone ? user.emergencyContact.cellphone : 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:12px;">Birthday</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.birthday ? user.emergencyContact.birthday : 'N/A') + '</div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div></div>';
    },

    closePendingDetail: function() {
        this.currentPendingDetail = null;
        this.renderAdminDashboard();
    },

    approveUser: function(userId) {
        var user = this.data.users.find(function(u) { return u.id === userId; });
        if (user) {
            user.status = 'active';
            user.active = true;
            user.academicYear = user.batch || '2025-2026';
            user.semester = '1st Semester';
            this.saveData();
            this.currentPendingDetail = null;
            this.renderAdminDashboard();
            alert(user.name + ' has been approved!');
        }
    },

    denyUser: function(userId) {
        var user = this.data.users.find(function(u) { return u.id === userId; });
        if (user) {
            if (confirm('Deny ' + user.name + '\'s registration? This will remove the user.')) {
                var index = this.data.users.findIndex(function(u) { return u.id === userId; });
                if (index > -1) {
                    this.data.users.splice(index, 1);
                    this.saveData();
                    this.currentPendingDetail = null;
                    this.renderAdminDashboard();
                    alert(user.name + ' has been denied and removed.');
                }
            }
        }
    },

    showStudentModal: function(studentId) {
        var student = this.data.users.find(function(u) { return u.id === studentId; });
        if (!student) return;
        
        this.currentStudentDetail = studentId;
        this.renderAdminDashboard();
    },

    renderStudentDetail: function(student) {
        var profilePicHtml = student.profilePic ? 
            '<img src="' + student.profilePic + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary-color);">' :
            '<div style="width:80px;height:80px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:600;">' + (student.name ? student.name.charAt(0).toUpperCase() : '?') + '</div>';
        
        return '<div class="student-detail-view">' +
            '<div class="student-detail-header">' +
            '<button onclick="App.closeStudentDetail()"><i class="fas fa-arrow-left"></i> Back</button>' +
            '<h2 style="margin:0;flex:1;">Student Details - ' + (student.name || 'Unknown') + '</h2>' +
            '</div>' +
            '<div style="display:flex;gap:20px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:280px;">' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:20px;text-align:center;margin-bottom:16px;">' +
            '<div style="display:flex;justify-content:center;margin-bottom:12px;">' + profilePicHtml + '</div>' +
            '<h3 style="margin:0 0 8px;">' + (student.name || 'Unknown') + '</h3>' +
            '<span class="badge ' + (student.active ? 'badge-success' : 'badge-secondary') + '">' + (student.active ? 'Active' : 'Inactive') + '</span>' +
            '<div style="margin-top:16px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">' +
            '<button class="btn btn-secondary btn-sm" onclick="App.editStudentByIdDetail(' + student.id + ')"><i class="fas fa-edit"></i> Edit</button>' +
            '<button class="btn btn-' + (student.active ? 'warning' : 'success') + ' btn-sm" onclick="App.toggleStudentByIdDetail(' + student.id + ')">' + (student.active ? 'Deactivate' : 'Activate') + '</button>' +
            '<button class="btn btn-primary btn-sm" onclick="App.resetStudentPasswordById(' + student.id + ')"><i class="fas fa-key"></i> Reset</button>' +
            '</div>' +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">PERSONAL</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">Student ID</span><div style="font-weight:600;">' + (student.studentId || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Birthday</span><div style="font-weight:600;">' + (student.birthday || 'N/A') + '</div></div>' +
            '<div style="grid-column:1/-1;"><span style="color:var(--text-light);font-size:11px;">Registered</span><div style="font-weight:600;">' + (student.createdAt || 'N/A') + '</div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div style="flex:2;min-width:350px;">' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">ACADEMIC</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:13px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">Course</span><div style="font-weight:600;">' + (student.course || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Block</span><div style="font-weight:600;">' + (student.block || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Term</span><div style="font-weight:600;">' + (student.term || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Section</span><div style="font-weight:600;">' + (student.section || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Batch</span><div style="font-weight:600;">' + (student.batch || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Academic Year</span><div style="font-weight:600;">' + (student.academicYear || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Semester</span><div style="font-weight:600;">' + (student.semester || 'N/A') + '</div></div>' +
            '</div>' +
            (student.previousYearHistory && (student.previousYearHistory.firstYear1st || student.previousYearHistory.firstYear2nd || student.previousYearHistory.secondYear1st || student.previousYearHistory.secondYear2nd || student.previousYearHistory.thirdYear1st || student.previousYearHistory.thirdYear2nd || student.previousYearHistory.fourthYear1st || student.previousYearHistory.fourthYear2nd) ?
            '<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-color);">' +
            '<h5 style="margin:0 0 8px;font-size:11px;color:var(--text-light);">Previous Academic History</h5>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:6px;">' +
            '<div><span style="color:var(--text-light);font-size:10px;">1st Year 1st Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 101' + (student.previousYearHistory && student.previousYearHistory.firstYear1st ? student.previousYearHistory.firstYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:10px;">1st Year 2nd Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 102' + (student.previousYearHistory && student.previousYearHistory.firstYear2nd ? student.previousYearHistory.firstYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:6px;">' +
            '<div><span style="color:var(--text-light);font-size:10px;">2nd Year 1st Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 201' + (student.previousYearHistory && student.previousYearHistory.secondYear1st ? student.previousYearHistory.secondYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:10px;">2nd Year 2nd Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 202' + (student.previousYearHistory && student.previousYearHistory.secondYear2nd ? student.previousYearHistory.secondYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;margin-bottom:6px;">' +
            '<div><span style="color:var(--text-light);font-size:10px;">3rd Year 1st Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 301' + (student.previousYearHistory && student.previousYearHistory.thirdYear1st ? student.previousYearHistory.thirdYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:10px;">3rd Year 2nd Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 302' + (student.previousYearHistory && student.previousYearHistory.thirdYear2nd ? student.previousYearHistory.thirdYear2nd : '') + '</div></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;">' +
            '<div><span style="color:var(--text-light);font-size:10px;">4th Year 1st Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 401' + (student.previousYearHistory && student.previousYearHistory.fourthYear1st ? student.previousYearHistory.fourthYear1st : '') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:10px;">4th Year 2nd Sem</span><div style="font-weight:600;">' + (student.course || '') + ' 402' + (student.previousYearHistory && student.previousYearHistory.fourthYear2nd ? student.previousYearHistory.fourthYear2nd : '') + '</div></div></div>' +
            '</div>' : '') +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">ORGANIZATION</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;font-size:13px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">Organization</span><div style="font-weight:600;">' + (student.organization && student.organization.name ? student.organization.name : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Position</span><div style="font-weight:600;">' + (student.organization && student.organization.position ? student.organization.position : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Committee</span><div style="font-weight:600;">' + (student.organization && student.organization.committee ? student.organization.committee : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Role</span><div style="font-weight:600;">' + (student.organization && student.organization.roleType ? student.organization.roleType : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Batch</span><div style="font-weight:600;">' + (student.organization && student.organization.batch ? student.organization.batch : '-') + '</div></div>' +
            '</div>' +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">CONTACT</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;font-size:13px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">Cellphone</span><div style="font-weight:600;">' + (student.cellphone || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Email</span><div style="font-weight:600;word-break:break-all;font-size:12px;">' + (student.email || 'N/A') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Address</span><div style="font-weight:600;font-size:12px;">' + 
                (student.address && (student.address.street || student.address.barangay || student.address.city) ? 
                [student.address.street, student.address.barangay, student.address.city].filter(Boolean).join(', ') : '-') + 
            '</div></div>' +
            '</div>' +
            '</div>' +
            '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;">' +
            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">EMERGENCY</h4>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:13px;">' +
            '<div><span style="color:var(--text-light);font-size:11px;">Contact</span><div style="font-weight:600;">' + (student.emergencyContact && student.emergencyContact.name ? student.emergencyContact.name : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Relationship</span><div style="font-weight:600;">' + (student.emergencyContact && student.emergencyContact.relationship ? student.emergencyContact.relationship : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Cellphone</span><div style="font-weight:600;">' + (student.emergencyContact && student.emergencyContact.cellphone ? student.emergencyContact.cellphone : '-') + '</div></div>' +
            '<div><span style="color:var(--text-light);font-size:11px;">Birthday</span><div style="font-weight:600;">' + (student.emergencyContact && student.emergencyContact.birthday ? student.emergencyContact.birthday : '-') + '</div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    },

    closeStudentDetail: function() {
        this.currentStudentDetail = null;
        this.renderAdminDashboard();
    },

    editStudentByIdDetail: function(studentId) {
        var student = this.data.users.find(function(u) { return u.id === studentId; });
        if (!student) return;
        
        var self = this;
        var currentProfilePic = student.profilePic || '';
        var profilePicHtml = currentProfilePic ? 
            '<img src="' + currentProfilePic + '" id="current-profile-preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color);">' :
            '<div id="current-profile-preview" style="width:80px;height:80px;border-radius:50%;background:var(--bg-color);border:2px dashed var(--border-color);display:flex;align-items:center;justify-content:center;color:var(--text-light);"><i class="fas fa-user"></i></div>';
        
        var editHtml = '<div id="edit-student-modal" class="modal" style="display:flex;align-items:center;justify-content:center;z-index:200;">' +
            '<div class="modal-content wide" style="max-width:650px;max-height:90vh;overflow-y:auto;">' +
            '<div class="modal-header"><h3>Edit Student - ' + (student.name || '') + '</h3><button class="modal-close" id="close-edit-student-modal">&times;</button></div>' +
            '<div style="padding:24px;">' +
            '<form id="edit-student-form">' +
            '<input type="hidden" id="edit-student-id" value="' + student.id + '">' +
            
            '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--primary-color);">Profile Picture</h4>' +
            '<div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:12px;background:var(--bg-color);border-radius:var(--radius-sm);">' +
            '<div id="profile-preview-container">' + profilePicHtml + '</div>' +
            '<div style="flex:1;">' +
            '<div class="file-upload-wrapper" id="edit-profile-upload" style="display:inline-block;cursor:pointer;padding:8px 16px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-white);">' +
            '<i class="fas fa-camera"></i> Change Photo' +
            '</div>' +
            '<input type="file" id="edit-profile-input" accept="image/*" hidden>' +
            '<button type="button" id="remove-profile-btn" class="btn btn-danger btn-sm" style="margin-left:8px;' + (currentProfilePic ? '' : 'display:none;') + '"><i class="fas fa-trash"></i> Remove</button>' +
            '<p style="font-size:11px;color:var(--text-light);margin-top:4px;">Click to upload new photo</p>' +
            '</div>' +
            '</div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--primary-color);">Personal Information</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Full Name *</label>' +
            '<input type="text" class="form-input" id="edit-student-name" value="' + (student.name || '') + '" required></div>' +
            '<div class="form-group"><label class="form-label">Student ID *</label>' +
            '<input type="text" class="form-input" id="edit-student-id-number" value="' + (student.studentId || '') + '" required></div>' +
            '<div class="form-group"><label class="form-label">Birthday</label>' +
            '<input type="date" class="form-input" id="edit-student-birthday" value="' + (student.birthday || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Email</label>' +
            '<input type="email" class="form-input" id="edit-student-email" value="' + (student.email || '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Cellphone</label>' +
            '<input type="text" class="form-input" id="edit-student-cellphone" value="' + (student.cellphone || '') + '"></div>' +
            '</div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin:16px 0 12px;color:var(--primary-color);">Academic Information</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Course *</label>' +
            '<select class="form-input" id="edit-student-course" required>' +
            '<option value="">Select Course</option>' +
            '<option value="BSIT"' + (student.course === 'BSIT' ? ' selected' : '') + '>BSIT</option>' +
            '<option value="BSCPE"' + (student.course === 'BSCPE' ? ' selected' : '') + '>BSCPE</option>' +
            '<option value="BSBA"' + (student.course === 'BSBA' ? ' selected' : '') + '>BSBA</option>' +
            '<option value="BSAIS"' + (student.course === 'BSAIS' ? ' selected' : '') + '>BSAIS</option>' +
            '<option value="BSHM"' + (student.course === 'BSHM' ? ' selected' : '') + '>BSHM</option></select></div>' +
            '<div class="form-group"><label class="form-label">Block *</label>' +
            '<select class="form-input" id="edit-student-block" required>' +
            '<option value="">Select Block</option>' +
            '<option value="101"' + (student.block === '101' ? ' selected' : '') + '>101</option>' +
            '<option value="102"' + (student.block === '102' ? ' selected' : '') + '>102</option>' +
            '<option value="201"' + (student.block === '201' ? ' selected' : '') + '>201</option>' +
            '<option value="202"' + (student.block === '202' ? ' selected' : '') + '>202</option>' +
            '<option value="301"' + (student.block === '301' ? ' selected' : '') + '>301</option>' +
            '<option value="302"' + (student.block === '302' ? ' selected' : '') + '>302</option>' +
            '<option value="401"' + (student.block === '401' ? ' selected' : '') + '>401</option>' +
            '<option value="402"' + (student.block === '402' ? ' selected' : '') + '>402</option></select></div>' +
            '<div class="form-group"><label class="form-label">Term</label>' +
            '<select class="form-input" id="edit-student-term">' +
            '<option value="">Select Term</option>' +
            '<option value="1st Term"' + (student.term === '1st Term' ? ' selected' : '') + '>1st Term</option>' +
            '<option value="2nd Term"' + (student.term === '2nd Term' ? ' selected' : '') + '>2nd Term</option>' +
            '<option value="3rd Term"' + (student.term === '3rd Term' ? ' selected' : '') + '>3rd Term</option>' +
            '<option value="4th Term"' + (student.term === '4th Term' ? ' selected' : '') + '>4th Term</option></select></div>' +
            '<div class="form-group"><label class="form-label">Section *</label>' +
            '<input type="text" class="form-input" id="edit-student-section" value="' + (student.section || '') + '" required></div>' +
            '<div class="form-group"><label class="form-label">Batch *</label>' +
            '<select class="form-input" id="edit-student-batch" required>' +
            '<option value="">Select Batch</option>' +
            '<option value="2025-2026"' + (student.batch === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
            '<option value="2024-2025"' + (student.batch === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
            '<option value="2023-2024"' + (student.batch === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div>' +
            '<div class="form-group"><label class="form-label">Academic Year</label>' +
            '<select class="form-input" id="edit-student-academic-year">' +
            '<option value="">Select Academic Year</option>' +
            '<option value="2025-2026"' + (student.academicYear === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
            '<option value="2024-2025"' + (student.academicYear === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
            '<option value="2023-2024"' + (student.academicYear === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div>' +
            '<div class="form-group"><label class="form-label">Semester</label>' +
            '<select class="form-input" id="edit-student-semester">' +
            '<option value="">Select Semester</option>' +
            '<option value="1st Semester"' + (student.semester === '1st Semester' ? ' selected' : '') + '>1st Semester</option>' +
            '<option value="2nd Semester"' + (student.semester === '2nd Semester' ? ' selected' : '') + '>2nd Semester</option>' +
            '<option value="Summer"' + (student.semester === 'Summer' ? ' selected' : '') + '>Summer</option></select></div>' +
            '</div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin:16px 0 12px;color:var(--primary-color);">Previous Academic History</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
            '<div class="form-group"><label class="form-label">1st Year 1st Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-first-year-1st" value="' + (student.previousYearHistory && student.previousYearHistory.firstYear1st ? student.previousYearHistory.firstYear1st : '') + '" placeholder="A"></div>' +
            '<div class="form-group"><label class="form-label">1st Year 2nd Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-first-year-2nd" value="' + (student.previousYearHistory && student.previousYearHistory.firstYear2nd ? student.previousYearHistory.firstYear2nd : '') + '" placeholder="A"></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
            '<div class="form-group"><label class="form-label">2nd Year 1st Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-second-year-1st" value="' + (student.previousYearHistory && student.previousYearHistory.secondYear1st ? student.previousYearHistory.secondYear1st : '') + '" placeholder="A"></div>' +
            '<div class="form-group"><label class="form-label">2nd Year 2nd Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-second-year-2nd" value="' + (student.previousYearHistory && student.previousYearHistory.secondYear2nd ? student.previousYearHistory.secondYear2nd : '') + '" placeholder="A"></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">3rd Year 1st Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-third-year-1st" value="' + (student.previousYearHistory && student.previousYearHistory.thirdYear1st ? student.previousYearHistory.thirdYear1st : '') + '" placeholder="A"></div>' +
            '<div class="form-group"><label class="form-label">3rd Year 2nd Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-third-year-2nd" value="' + (student.previousYearHistory && student.previousYearHistory.thirdYear2nd ? student.previousYearHistory.thirdYear2nd : '') + '" placeholder="A"></div></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">4th Year 1st Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-fourth-year-1st" value="' + (student.previousYearHistory && student.previousYearHistory.fourthYear1st ? student.previousYearHistory.fourthYear1st : '') + '" placeholder="A"></div>' +
            '<div class="form-group"><label class="form-label">4th Year 2nd Sem - Section</label>' +
            '<input type="text" class="form-input" id="edit-student-fourth-year-2nd" value="' + (student.previousYearHistory && student.previousYearHistory.fourthYear2nd ? student.previousYearHistory.fourthYear2nd : '') + '" placeholder="A"></div></div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin:16px 0 12px;color:var(--primary-color);">Address</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Street</label>' +
            '<input type="text" class="form-input" id="edit-student-street" value="' + (student.address && student.address.street ? student.address.street : '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Barangay</label>' +
            '<input type="text" class="form-input" id="edit-student-barangay" value="' + (student.address && student.address.barangay ? student.address.barangay : '') + '"></div>' +
            '<div class="form-group"><label class="form-label">City</label>' +
            '<input type="text" class="form-input" id="edit-student-city" value="' + (student.address && student.address.city ? student.address.city : '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Province</label>' +
            '<input type="text" class="form-input" id="edit-student-province" value="' + (student.address && student.address.province ? student.address.province : '') + '"></div>' +
            '</div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin:16px 0 12px;color:var(--primary-color);">Organization Information</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Organization</label>' +
            '<select class="form-input" id="edit-student-organization">' +
            '<option value="">Select Organization</option>' +
            '<option value="College Student Council"' + (student.organization && student.organization.name === 'College Student Council' ? ' selected' : '') + '>College Student Council</option>' +
            '<option value="IT Club"' + (student.organization && student.organization.name === 'IT Club' ? ' selected' : '') + '>IT Club</option>' +
            '<option value="HM Club"' + (student.organization && student.organization.name === 'HM Club' ? ' selected' : '') + '>HM Club</option>' +
            '<option value="CPE Club"' + (student.organization && student.organization.name === 'CPE Club' ? ' selected' : '') + '>CPE Club</option>' +
            '<option value="BA Club"' + (student.organization && student.organization.name === 'BA Club' ? ' selected' : '') + '>BA Club</option>' +
            '<option value="BSAIS Club"' + (student.organization && student.organization.name === 'BSAIS Club' ? ' selected' : '') + '>BSAIS Club</option>' +
            '<option value="Junior Council"' + (student.organization && student.organization.name === 'Junior Council' ? ' selected' : '') + '>Junior Council</option></select></div>' +
            '<div class="form-group"><label class="form-label">Position</label>' +
            '<select class="form-input" id="edit-student-position">' +
            '<option value="">Select Position</option>' +
            '<option value="President"' + (student.organization && student.organization.position === 'President' ? ' selected' : '') + '>President</option>' +
            '<option value="Vice President"' + (student.organization && student.organization.position === 'Vice President' ? ' selected' : '') + '>Vice President</option>' +
            '<option value="Secretary"' + (student.organization && student.organization.position === 'Secretary' ? ' selected' : '') + '>Secretary</option>' +
            '<option value="Treasurer"' + (student.organization && student.organization.position === 'Treasurer' ? ' selected' : '') + '>Treasurer</option>' +
            '<option value="Auditor"' + (student.organization && student.organization.position === 'Auditor' ? ' selected' : '') + '>Auditor</option>' +
            '<option value="Business Manager"' + (student.organization && student.organization.position === 'Business Manager' ? ' selected' : '') + '>Business Manager</option>' +
            '<option value="Peace Officer"' + (student.organization && student.organization.position === 'Peace Officer' ? ' selected' : '') + '>Peace Officer</option>' +
            '<option value="Public Information Officer"' + (student.organization && student.organization.position === 'Public Information Officer' ? ' selected' : '') + '>Public Information Officer</option>' +
            '<option value="Representative - IT"' + (student.organization && student.organization.position === 'Representative - IT' ? ' selected' : '') + '>Representative - IT</option>' +
            '<option value="Representative - HM"' + (student.organization && student.organization.position === 'Representative - HM' ? ' selected' : '') + '>Representative - HM</option>' +
            '<option value="Representative - CPE"' + (student.organization && student.organization.position === 'Representative - CPE' ? ' selected' : '') + '>Representative - CPE</option>' +
            '<option value="Representative - BA"' + (student.organization && student.organization.position === 'Representative - BA' ? ' selected' : '') + '>Representative - BA</option>' +
            '<option value="Representative - BSAIS"' + (student.organization && student.organization.position === 'Representative - BSAIS' ? ' selected' : '') + '>Representative - BSAIS</option>' +
            '<option value="Junior Councilor"' + (student.organization && student.organization.position === 'Junior Councilor' ? ' selected' : '') + '>Junior Councilor</option>' +
            '<option value="Member"' + (student.organization && student.organization.position === 'Member' ? ' selected' : '') + '>Member</option></select></div>' +
            '<div class="form-group"><label class="form-label">Committee</label>' +
            '<select class="form-input" id="edit-student-committee">' +
            '<option value="">Select Committee</option>' +
            '<option value="Executive"' + (student.organization && student.organization.committee === 'Executive' ? ' selected' : '') + '>Executive</option>' +
            '<option value="Finance"' + (student.organization && student.organization.committee === 'Finance' ? ' selected' : '') + '>Finance</option>' +
            '<option value="Public Relations"' + (student.organization && student.organization.committee === 'Public Relations' ? ' selected' : '') + '>Public Relations</option>' +
            '<option value="Secretariate"' + (student.organization && student.organization.committee === 'Secretariate' ? ' selected' : '') + '>Secretariate</option>' +
            '<option value="Documentation"' + (student.organization && student.organization.committee === 'Documentation' ? ' selected' : '') + '>Documentation</option>' +
            '<option value="Events"' + (student.organization && student.organization.committee === 'Events' ? ' selected' : '') + '>Events</option>' +
            '<option value="Technical"' + (student.organization && student.organization.committee === 'Technical' ? ' selected' : '') + '>Technical</option>' +
            '<option value="Hospitality"' + (student.organization && student.organization.committee === 'Hospitality' ? ' selected' : '') + '>Hospitality</option>' +
            '<option value="Student Affairs"' + (student.organization && student.organization.committee === 'Student Affairs' ? ' selected' : '') + '>Student Affairs</option></select></div>' +
            '<div class="form-group"><label class="form-label">Role Type</label>' +
            '<select class="form-input" id="edit-student-role-type">' +
            '<option value="">Select Role Type</option>' +
            '<option value="Head"' + (student.organization && student.organization.roleType === 'Head' ? ' selected' : '') + '>Head</option>' +
            '<option value="Member"' + (student.organization && student.organization.roleType === 'Member' ? ' selected' : '') + '>Member</option></select></div>' +
            '<div class="form-group"><label class="form-label">Batch/Term</label>' +
            '<select class="form-input" id="edit-student-org-batch">' +
            '<option value="">Select Batch</option>' +
            '<option value="2025-2026"' + (student.organization && student.organization.batch === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
            '<option value="2024-2025"' + (student.organization && student.organization.batch === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
            '<option value="2023-2024"' + (student.organization && student.organization.batch === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div></div>' +
            
            '<h4 style="font-size:14px;font-weight:600;margin:16px 0 12px;color:var(--primary-color);">Emergency Contact</h4>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div class="form-group"><label class="form-label">Contact Name</label>' +
            '<input type="text" class="form-input" id="edit-emergency-name" value="' + (student.emergencyContact && student.emergencyContact.name ? student.emergencyContact.name : '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Relationship</label>' +
            '<select class="form-input" id="edit-emergency-relation">' +
            '<option value="">Select</option>' +
            '<option value="Mother"' + (student.emergencyContact && student.emergencyContact.relationship === 'Mother' ? ' selected' : '') + '>Mother</option>' +
            '<option value="Father"' + (student.emergencyContact && student.emergencyContact.relationship === 'Father' ? ' selected' : '') + '>Father</option>' +
            '<option value="Guardian"' + (student.emergencyContact && student.emergencyContact.relationship === 'Guardian' ? ' selected' : '') + '>Guardian</option></select></div>' +
            '<div class="form-group"><label class="form-label">Cellphone</label>' +
            '<input type="text" class="form-input" id="edit-emergency-cellphone" value="' + (student.emergencyContact && student.emergencyContact.cellphone ? student.emergencyContact.cellphone : '') + '"></div>' +
            '<div class="form-group"><label class="form-label">Email</label>' +
            '<input type="email" class="form-input" id="edit-emergency-email" value="' + (student.emergencyContact && student.emergencyContact.email ? student.emergencyContact.email : '') + '"></div>' +
            '</div>' +
            '<div class="form-group"><label class="form-label">Parent/Guardian Birthday</label>' +
            '<input type="date" class="form-input" id="edit-emergency-birthday" value="' + (student.emergencyContact && student.emergencyContact.birthday ? student.emergencyContact.birthday : '') + '"></div>' +
            
            '<button type="submit" class="btn btn-primary btn-block" style="margin-top:20px;">Save Changes</button>' +
            '</form></div></div></div>';
        
        document.getElementById('app').insertAdjacentHTML('beforeend', editHtml);
        
        document.getElementById('close-edit-student-modal').addEventListener('click', function() {
            document.getElementById('edit-student-modal').remove();
        });
        
        // Profile picture upload handling
        var newProfilePic = null;
        document.getElementById('edit-profile-upload') && document.getElementById('edit-profile-upload').addEventListener('click', function() {
            document.getElementById('edit-profile-input').click();
        });
        
        document.getElementById('edit-profile-input') && document.getElementById('edit-profile-input').addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    newProfilePic = evt.target.result;
                    document.getElementById('profile-preview-container').innerHTML = 
                        '<img src="' + newProfilePic + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid var(--primary-color);">';
                    document.getElementById('remove-profile-btn').style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.getElementById('remove-profile-btn') && document.getElementById('remove-profile-btn').addEventListener('click', function() {
            newProfilePic = '';
            document.getElementById('profile-preview-container').innerHTML = 
                '<div style="width:80px;height:80px;border-radius:50%;background:var(--bg-color);border:2px dashed var(--border-color);display:flex;align-items:center;justify-content:center;color:var(--text-light);"><i class="fas fa-user"></i></div>';
            document.getElementById('remove-profile-btn').style.display = 'none';
        });
        
        document.getElementById('edit-student-form').addEventListener('submit', function(e) {
            e.preventDefault();
            student.name = document.getElementById('edit-student-name').value;
            student.studentId = document.getElementById('edit-student-id-number').value;
            student.birthday = document.getElementById('edit-student-birthday').value;
            student.email = document.getElementById('edit-student-email').value;
            student.cellphone = document.getElementById('edit-student-cellphone').value;
            student.course = document.getElementById('edit-student-course').value;
            student.block = document.getElementById('edit-student-block').value;
            student.term = document.getElementById('edit-student-term').value;
            student.section = document.getElementById('edit-student-section').value;
            student.batch = document.getElementById('edit-student-batch').value;
            student.academicYear = document.getElementById('edit-student-academic-year').value;
            student.semester = document.getElementById('edit-student-semester').value;
            var orgName = document.getElementById('edit-student-organization').value;
            var orgPosition = document.getElementById('edit-student-position').value;
            var orgCommittee = document.getElementById('edit-student-committee').value;
            var orgRoleType = document.getElementById('edit-student-role-type').value;
            var orgBatch = document.getElementById('edit-student-org-batch').value;
            
            if (orgName || orgPosition || orgCommittee || orgRoleType || orgBatch) {
                // Check position limits before saving
                if (orgName && orgPosition) {
                    var checkResult = self.checkPositionLimit(orgName, orgPosition, student.id);
                    if (!checkResult.valid) {
                        alert('Cannot assign position: ' + checkResult.message);
                        return;
                    }
                }
                student.organization = {
                    name: orgName,
                    position: orgPosition,
                    committee: orgCommittee,
                    roleType: orgRoleType,
                    batch: orgBatch
                };
            } else {
                student.organization = null;
            }
            
            student.previousYearHistory = {
                firstYear1st: document.getElementById('edit-student-first-year-1st') ? document.getElementById('edit-student-first-year-1st').value : '',
                firstYear2nd: document.getElementById('edit-student-first-year-2nd') ? document.getElementById('edit-student-first-year-2nd').value : '',
                secondYear1st: document.getElementById('edit-student-second-year-1st') ? document.getElementById('edit-student-second-year-1st').value : '',
                secondYear2nd: document.getElementById('edit-student-second-year-2nd') ? document.getElementById('edit-student-second-year-2nd').value : '',
                thirdYear1st: document.getElementById('edit-student-third-year-1st') ? document.getElementById('edit-student-third-year-1st').value : '',
                thirdYear2nd: document.getElementById('edit-student-third-year-2nd') ? document.getElementById('edit-student-third-year-2nd').value : '',
                fourthYear1st: document.getElementById('edit-student-fourth-year-1st') ? document.getElementById('edit-student-fourth-year-1st').value : '',
                fourthYear2nd: document.getElementById('edit-student-fourth-year-2nd') ? document.getElementById('edit-student-fourth-year-2nd').value : ''
            };
            
            if (newProfilePic !== null) {
                student.profilePic = newProfilePic;
            }
            
            student.address = {
                street: document.getElementById('edit-student-street').value,
                barangay: document.getElementById('edit-student-barangay').value,
                city: document.getElementById('edit-student-city').value,
                province: document.getElementById('edit-student-province').value
            };
            
            student.emergencyContact = {
                name: document.getElementById('edit-emergency-name').value,
                relationship: document.getElementById('edit-emergency-relation').value,
                cellphone: document.getElementById('edit-emergency-cellphone').value,
                email: document.getElementById('edit-emergency-email').value,
                birthday: document.getElementById('edit-emergency-birthday').value
            };
            
            self.saveData();
            document.getElementById('edit-student-modal').remove();
            self.renderAdminDashboard();
        });
    },

    toggleStudentByIdDetail: function(studentId) {
        var student = this.data.users.find(function(u) { return u.id === studentId; });
        if (!student) return;
        student.active = !student.active;
        student.status = student.active ? 'active' : 'inactive';
        this.saveData();
        this.renderAdminDashboard();
    },

    resetStudentPasswordById: function(studentId) {
        var student = this.data.users.find(function(u) { return u.id === studentId; });
        if (!student) return;
        var newPwd = prompt('Enter new password for ' + student.name + ':');
        if (newPwd && newPwd.length >= 6) {
            student.password = newPwd;
            this.saveData();
            alert('Password reset successfully!');
        } else if (newPwd) {
            alert('Password must be at least 6 characters!');
        }
    },

    showDocModal: function(userId) {
        var user = this.data.users.find(function(u) { return u.id === userId; });
        if (!user) return;
        
        var profileImg = user.profilePic ? '<img src="' + user.profilePic + '" style="max-width:200px;max-height:200px;border-radius:8px;cursor:pointer;" onclick="App.viewImage(this.src)">' : '<div style="width:200px;height:150px;display:flex;align-items:center;justify-content:center;background:var(--bg-color);border-radius:8px;color:var(--text-light);">No Profile</div>';
        var schoolIdImg = user.schoolIdPic ? '<img src="' + user.schoolIdPic + '" style="max-width:250px;max-height:180px;border-radius:8px;cursor:pointer;" onclick="App.viewImage(this.src)">' : '<div style="width:250px;height:150px;display:flex;align-items:center;justify-content:center;background:var(--bg-color);border-radius:8px;color:var(--text-light);">No School ID</div>';
        
        var html = '<div id="doc-modal-' + user.id + '" class="modal" style="display:flex;align-items:center;justify-content:center;z-index:300;">' +
            '<div class="modal-content" style="max-width:600px;max-height:90vh;overflow:auto;">' +
            '<div class="modal-header">' +
            '<h3>Documents - ' + (user.name || 'User') + '</h3>' +
            '<button class="modal-close" onclick="document.getElementById(\'doc-modal-' + user.id + '\').remove()">&times;</button>' +
            '</div>' +
            '<div style="padding:20px;">' +
            '<div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;">' +
            '<div style="text-align:center;"><h4 style="margin-bottom:8px;">Profile Picture</h4>' + profileImg + '</div>' +
            '<div style="text-align:center;"><h4 style="margin-bottom:8px;">School ID</h4>' + schoolIdImg + '</div>' +
            '</div>' +
            '</div></div></div>';
        
        document.getElementById('app').insertAdjacentHTML('beforeend', html);
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

    viewEventGallery: function(eventId, currentIndex) {
        var self = this;
        var event = this.data.events.find(function(e) { return e.id === eventId; });
        if (!event || !event.mediaGallery || event.mediaGallery.length === 0) return;
        
        var html = '<div id="gallery-modal" class="modal" style="display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.9);">' +
            '<button type="button" onclick="document.getElementById(\'gallery-modal\').remove()" style="position:absolute;top:20px;right:20px;background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:20px;z-index:1001;">&times;</button>' +
            '<button type="button" id="gallery-maximize" style="position:absolute;top:20px;right:70px;background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;font-size:18px;z-index:1001;" title="Fullscreen"><i class="fas fa-expand"></i></button>' +
            '<button type="button" id="gallery-prev" style="position:absolute;left:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:50px;height:50px;cursor:pointer;font-size:20px;z-index:1001;">&#10094;</button>' +
            '<button type="button" id="gallery-next" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);color:white;border:none;border-radius:50%;width:50px;height:50px;cursor:pointer;font-size:20px;z-index:1001;">&#10095;</button>' +
            '<div id="gallery-content" style="display:flex;align-items:center;justify-content:center;"></div>' +
            '<div id="gallery-counter" style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:white;font-size:16px;background:rgba(0,0,0,0.5);padding:8px 16px;border-radius:20px;"></div></div>';
        
        document.getElementById('app').insertAdjacentHTML('beforeend', html);
        
        var galleryModal = document.getElementById('gallery-modal');
        var galleryContent = document.getElementById('gallery-content');
        var galleryCounter = document.getElementById('gallery-counter');
        var currentIdx = currentIndex || 0;
        var media = event.mediaGallery;
        var isFullscreen = false;
        
        function showImage(idx) {
            if (idx < 0) idx = media.length - 1;
            if (idx >= media.length) idx = 0;
            currentIdx = idx;
            
            if (media[idx].type === 'video') {
                galleryContent.innerHTML = '<video controls autoplay style="width:' + (isFullscreen ? '100vw' : 'auto') + ';height:' + (isFullscreen ? '100vh' : 'auto') + 'max-width:100%;max-height:100%;object-fit:contain;"><source src="' + media[idx].data + '"></video>';
            } else {
                galleryContent.innerHTML = '<img src="' + media[idx].data + '" style="width:' + (isFullscreen ? '100vw' : 'auto') + ';height:' + (isFullscreen ? '100vh' : 'auto') + ';max-width:100%;max-height:100%;object-fit:contain;margin:0;">';
            }
            galleryCounter.textContent = (currentIdx + 1) + ' / ' + media.length;
        }
        
        showImage(currentIdx);
        
        document.getElementById('gallery-prev').addEventListener('click', function() {
            showImage(currentIdx - 1);
        });
        
        document.getElementById('gallery-next').addEventListener('click', function() {
            showImage(currentIdx + 1);
        });
        
        document.getElementById('gallery-maximize').addEventListener('click', function() {
            isFullscreen = !isFullscreen;
            showImage(currentIdx);
            var galModal = document.getElementById('gallery-modal');
            if (isFullscreen) {
                galModal.style.position = 'fixed';
                galModal.style.top = '0';
                galModal.style.left = '0';
                galModal.style.width = '100vw';
                galModal.style.height = '100vh';
            } else {
                galModal.style.position = 'absolute';
                galModal.style.top = '';
                galModal.style.left = '';
                galModal.style.width = '';
                galModal.style.height = '';
            }
        });
    },

    removeEventMedia: function(idx, btn) {
        var self = this;
        if (self.registerData && self.registerData.eventMediaGallery && self.registerData.eventMediaGallery[idx]) {
            self.registerData.eventMediaGallery.splice(idx, 1);
            if (btn && btn.parentElement) {
                btn.parentElement.remove();
            }
            var preview = document.getElementById('event-media-preview');
            if (preview) {
                preview.innerHTML = '';
                self.registerData.eventMediaGallery.forEach(function(mediaData, mediaIdx) {
                    var div = document.createElement('div');
                    div.style.position = 'relative';
                    div.style.display = 'inline-block';
                    div.style.margin = '4px';
                    if (mediaData.type === 'image') {
                        div.innerHTML = '<img src="' + mediaData.data + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">' +
                            '<button type="button" onclick="App.removeEventMedia(' + mediaIdx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                    } else {
                        div.innerHTML = '<div style="width:80px;height:80px;background:#333;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-video"></i></div>' +
                            '<button type="button" onclick="App.removeEventMedia(' + mediaIdx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                    }
                    preview.appendChild(div);
                });
            }
        }
    },

    showProfileModal: function() {
        var self = this;
        var user = this.currentUser;
        var profilePicHtml = user.profilePic ?
            '<img src="' + user.profilePic + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;display:block;margin:0 auto;cursor:pointer;" id="profile-pic-display" title="Click to change">' :
            '<div style="width:100px;height:100px;border-radius:50%;background:var(--primary-color);display:flex;align-items:center;justify-content:center;color:white;font-size:40px;margin:0 auto;cursor:pointer;" id="profile-pic-display" title="Click to change">' + (user.name ? user.name.charAt(0) : '?') + '</div>';

        var html = '' +
        '<div id="profile-modal" class="slide-panel" style="display:flex;">' +
            '<div class="slide-panel-overlay" onclick="document.getElementById(\'profile-modal\').remove()"></div>' +
            '<div class="slide-panel-content">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:20px;border-bottom:1px solid var(--border-color);">' +
                    '<h2 style="margin:0;font-size:18px;">My Profile</h2>' +
                    '<button onclick="document.getElementById(\'profile-modal\').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>' +
                '</div>' +
                '<div style="padding:24px;overflow-y:auto;max-height:calc(100vh - 140px);">' +
                    '<div style="text-align:center;margin-bottom:24px;">' +
                        profilePicHtml + '<input type="file" id="profile-pic-input" accept="image/*" style="display:none;">' +
                        '<h3 style="margin:16px 0 4px;">' + user.name + '</h3>' +
                        '<p style="color:var(--text-light);margin:0;">' + user.email + '</p>' +
                        '<span class="badge ' + (user.active ? 'badge-success' : 'badge-secondary') + '" style="margin-top:8px;">' + (user.active ? 'Active' : 'Inactive') + '</span>' +
                    '</div>' +

                     // Super Admin Profile - Simplified view
                     (user.role === 'admin' ?
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                             '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">PERSONAL</h4>' +
                            '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;font-size:13px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">User ID</span><div style="font-weight:600;">' + (user.id || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Email</span><div style="font-weight:600;word-break:break-all;">' + (user.email || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Role</span><div style="font-weight:600;">' + (user.adminRole || user.role || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Date Created</span><div style="font-weight:600;">' + (user.createdAt || 'N/A') + '</div></div>' +
                            '</div>' +
                        '</div>'
                    :
                    // Regular user profile - Full view
                        // PERSONAL INFORMATION
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">PERSONAL</h4>' +
                            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;font-size:13px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Student ID</span><div style="font-weight:600;">' + (user.studentId || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Birthday</span><div style="font-weight:600;">' + (user.birthday || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Cellphone</span><div style="font-weight:600;">' + (user.cellphone || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Email</span><div style="font-weight:600;word-break:break-all;">' + (user.email || 'N/A') + '</div></div>' +
                            '</div>' +
                            '<div style="margin-top:12px;">' +
                                '<span style="color:var(--text-light);font-size:11px;">Address</span><div style="font-weight:600;">' +
                                    (user.address && (user.address.street || user.address.barangay || user.address.city || user.address.province) ?
                                        [user.address.street, user.address.barangay, user.address.city, user.address.province].filter(Boolean).join(', ') : 'N/A') +
                                '</div></div>' +
                        '</div>' +

                        // ORGANIZATION
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">ORGANIZATION</h4>' +
                            '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;font-size:13px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Organization</span><div style="font-weight:600;">' + (user.organization && user.organization.name ? user.organization.name : '-') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Position</span><div style="font-weight:600;">' + (user.organization && user.organization.position ? user.organization.position : '-') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Committee</span><div style="font-weight:600;">' + (user.organization && user.organization.committee ? user.organization.committee : '-') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Role</span><div style="font-weight:600;">' + (user.organization && user.organization.roleType ? user.organization.roleType : '-') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">Batch</span><div style="font-weight:600;">' + (user.organization && user.organization.batch ? user.organization.batch : '-') + '</div></div>' +
                            '</div>' +
                        '</div>' +

                        // ACADEMIC INFORMATION
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">ACADEMIC INFORMATION</h4>' +
                            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px;">' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Course</span><div style="font-weight:600;">' + (user.course || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Block</span><div style="font-weight:600;">' + (user.block || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Section</span><div style="font-weight:600;">' + (user.section || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Batch</span><div style="font-weight:600;">' + (user.batch || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Academic Year</span><div style="font-weight:600;">' + (user.academicYear || 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Semester</span><div style="font-weight:600;">' + (user.semester || 'N/A') + '</div></div>' +
                            '</div>' +
                        '</div>' +

                        // PREVIOUS ACADEMIC HISTORY (conditional)
                        (user.previousYearHistory && (user.previousYearHistory.firstYear1st || user.previousYearHistory.firstYear2nd || user.previousYearHistory.secondYear1st || user.previousYearHistory.secondYear2nd || user.previousYearHistory.thirdYear1st || user.previousYearHistory.thirdYear2nd || user.previousYearHistory.fourthYear1st || user.previousYearHistory.fourthYear2nd) ?
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                            '<h4 style="margin:0 0 10px;font-size:13px;color:var(--text-light);">PREVIOUS ACADEMIC HISTORY</h4>' +
                            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-bottom:6px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">1st Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 101' + (user.previousYearHistory.firstYear1st || '') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">1st Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 102' + (user.previousYearHistory.firstYear2nd || '') + '</div></div>' +
                            '</div>' +
                            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-bottom:6px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">2nd Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 201' + (user.previousYearHistory.secondYear1st || '') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">2nd Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 202' + (user.previousYearHistory.secondYear2nd || '') + '</div></div>' +
                            '</div>' +
                            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;margin-bottom:6px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">3rd Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 301' + (user.previousYearHistory.thirdYear1st || '') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">3rd Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 302' + (user.previousYearHistory.thirdYear2nd || '') + '</div></div>' +
                            '</div>' +
                            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">' +
                                '<div><span style="color:var(--text-light);font-size:11px;">4th Year 1st Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 401' + (user.previousYearHistory.fourthYear1st || '') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:11px;">4th Year 2nd Sem</span><div style="font-weight:600;">' + (user.course || '') + ' 402' + (user.previousYearHistory.fourthYear2nd || '') + '</div></div>' +
                            '</div>' +
                        '</div>' : '') +

                        // EMERGENCY CONTACT
                        '<div style="background:var(--bg-white);border-radius:var(--radius-md);border:1px solid var(--border-color);padding:16px;margin-bottom:16px;">' +
                            '<h4 style="margin:0 0 12px;font-size:14px;color:var(--text-light);">EMERGENCY CONTACT</h4>' +
                            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;font-size:14px;">' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Contact Name</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.name ? user.emergencyContact.name : 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Relationship</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.relationship ? user.emergencyContact.relationship : 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Cellphone</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.cellphone ? user.emergencyContact.cellphone : 'N/A') + '</div></div>' +
                                '<div><span style="color:var(--text-light);font-size:12px;">Birthday</span><div style="font-weight:600;">' + (user.emergencyContact && user.emergencyContact.birthday ? user.emergencyContact.birthday : 'N/A') + '</div></div>' +
                            '</div>' +
                        '</div>'
                    ) +

                    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">' +
                        '<button class="btn btn-primary" id="change-password-btn"><i class="fas fa-key"></i> Change Password</button>' +
                        '<button class="btn btn-secondary" id="edit-profile-btn"><i class="fas fa-edit"></i> Edit Profile</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

        
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        document.getElementById('app').appendChild(tempDiv.firstElementChild);

        // Profile Picture Upload
        var profilePicDisplay = document.getElementById('profile-pic-display');
        var profilePicInput = document.getElementById('profile-pic-input');
        if (profilePicDisplay && profilePicInput) {
            profilePicDisplay.addEventListener('click', function() {
                profilePicInput.click();
            });
            profilePicInput.addEventListener('change', function(e) {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        user.profilePic = evt.target.result;
                        
                        var userIndex = self.data.users.findIndex(function(u) { return u.id === user.id; });
                        if (userIndex > -1) {
                            self.data.users[userIndex].profilePic = evt.target.result;
                        }
                        self.saveData();
                        // session in memory only
                        
                        // Update display
                        profilePicDisplay.innerHTML = '<img src="' + evt.target.result + '" style="width:100px;height:100px;border-radius:50%;object-fit:cover;display:block;margin:0 auto;">';
                        profilePicDisplay.style.background = 'transparent';
                        
                        // Update header avatar
                        var headerAvatar = document.querySelector('.header-right .profile-avatar');
                        if (headerAvatar) {
                            headerAvatar.outerHTML = '<img src="' + evt.target.result + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" class="profile-avatar">';
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        var changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', function() {
                if (user.role === 'student') {
                    alert('For security reasons, please contact the administrator to change your password.\n\nGo to the Main Office or message an admin for further instructions.');
                    return;
                }
                
                var changePwdHtml = '<div id="change-password-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
                    '<div class="modal-content" style="max-width:400px;">' +
                    '<div class="modal-header"><h3>Change Password</h3><button class="modal-close" id="close-change-password-modal">&times;</button></div>' +
                    '<div style="padding:24px;">' +
                    '<form id="change-password-form">' +
                    '<div class="form-group"><label class="form-label">Current Password *</label>' +
                    '<input type="password" class="form-input" id="current-password" required></div>' +
                    '<div class="form-group"><label class="form-label">New Password *</label>' +
                    '<input type="password" class="form-input" id="new-password" required></div>' +
                    '<div class="form-group"><label class="form-label">Confirm New Password *</label>' +
                    '<input type="password" class="form-input" id="confirm-new-password" required></div>' +
                    '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Update Password</button>' +
                    '</form>' +
                    '</div></div></div>';
                
                document.getElementById('profile-modal').insertAdjacentHTML('beforeend', changePwdHtml);
                
                var closeChangePwd = document.getElementById('close-change-password-modal');
                var changePwdModal = document.getElementById('change-password-modal');
                if (closeChangePwd) {
                    closeChangePwd.addEventListener('click', function() {
                        changePwdModal.remove();
                    });
                }
                
                var changePwdForm = document.getElementById('change-password-form');
                if (changePwdForm) {
                    changePwdForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        var currentPass = document.getElementById('current-password').value;
                        var newPass = document.getElementById('new-password').value;
                        var confirmPass = document.getElementById('confirm-new-password').value;
                        
                        if (currentPass !== user.password) {
                            alert('Current password is incorrect!');
                            return;
                        }
                        
                        if (newPass !== confirmPass) {
                            alert('New passwords do not match!');
                            return;
                        }
                        
                        if (newPass.length < 6) {
                            alert('Password must be at least 6 characters!');
                            return;
                        }
                        
                        user.password = newPass;
                        var userIndex = self.data.users.findIndex(function(u) { return u.id === user.id; });
                        if (userIndex > -1) {
                            self.data.users[userIndex].password = newPass;
                        }
                        self.saveData();
                        // session in memory only
                        
                        changePwdModal.remove();
                        alert('Password updated successfully!');
                    });
                }
            });
        }

        var editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                if (user.role === 'student') {
                    alert('For security reasons, please contact the administrator to edit your profile.\n\nGo to the Main Office or message an admin for further instructions.');
                    return;
                }
                
                 // Build edit form based on user role
                 var editProfileHtml = '';
                 
                 if (user.role === 'admin') {
                     // Admin simplified edit form - read-only account details + name only
                     editProfileHtml = '<div id="edit-profile-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
                     '<div class="modal-content" style="max-width:500px;">' +
                     '<div class="modal-header"><h3>Edit Profile - ' + (user.adminRole || 'Admin') + '</h3><button class="modal-close" id="close-edit-profile-modal">&times;</button></div>' +
                     '<div style="padding:24px;">' +
                     '<form id="edit-profile-form">' +
                     '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;color:var(--primary-color);">Account Details (Read-Only)</h4>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">' +
                     '<div class="form-group"><label class="form-label">User ID</label>' +
                     '<input type="text" class="form-input" value="' + (user.id || 'N/A') + '" readonly style="background:var(--bg-color);"></div>' +
                     '<div class="form-group"><label class="form-label">Email</label>' +
                     '<input type="email" class="form-input" value="' + (user.email || 'N/A') + '" readonly style="background:var(--bg-color);"></div>' +
                     '<div class="form-group"><label class="form-label">Role</label>' +
                     '<input type="text" class="form-input" value="' + (user.adminRole || user.role || 'N/A') + '" readonly style="background:var(--bg-color);"></div>' +
                     '<div class="form-group"><label class="form-label">Date Created</label>' +
                     '<input type="text" class="form-input" value="' + (user.createdAt || 'N/A') + '" readonly style="background:var(--bg-color);"></div>' +
                     '</div>' +
                     '<div style="margin:16px 0 12px;border-top:1px solid var(--border-color);padding-top:12px;">' +
                     '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Editable Information</h4></div>' +
                     '<div class="form-group"><label class="form-label">Full Name *</label>' +
                     '<input type="text" class="form-input" id="edit-name" value="' + (user.name || '') + '" required></div>' +
                     '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Save Changes</button>' +
                     '</form>' +
                     '</div></div></div>';
                 } else {
                     // Student full edit form
                     editProfileHtml = '<div id="edit-profile-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
                     '<div class="modal-content wide">' +
                     '<div class="modal-header"><h3>Edit Profile</h3><button class="modal-close" id="close-edit-profile-modal">&times;</button></div>' +
                     '<div style="padding:24px;max-height:70vh;overflow-y:auto;">' +
                     '<form id="edit-profile-form">' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Full Name *</label>' +
                     '<input type="text" class="form-input" id="edit-name" value="' + (user.name || '') + '" required></div>' +
                     '<div class="form-group"><label class="form-label">Student ID</label>' +
                     '<input type="text" class="form-input" id="edit-student-id" value="' + (user.studentId || '') + '"></div></div>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Course</label>' +
                     '<select class="form-input" id="edit-course">' +
                     '<option value="">Select Course</option>' +
                     '<option value="BSIT"' + (user.course === 'BSIT' ? ' selected' : '') + '>BSIT</option>' +
                     '<option value="BSCPE"' + (user.course === 'BSCPE' ? ' selected' : '') + '>BSCPE</option>' +
                     '<option value="BSBA"' + (user.course === 'BSBA' ? ' selected' : '') + '>BSBA</option>' +
                     '<option value="BSAIS"' + (user.course === 'BSAIS' ? ' selected' : '') + '>BSAIS</option>' +
                     '<option value="BSHM"' + (user.course === 'BSHM' ? ' selected' : '') + '>BSHM</option></select></div>' +
                     '<div class="form-group"><label class="form-label">Block</label>' +
                     '<select class="form-input" id="edit-block">' +
                     '<option value="">Select Block</option>' +
                     '<option value="101"' + (user.block === '101' ? ' selected' : '') + '>101</option>' +
                     '<option value="102"' + (user.block === '102' ? ' selected' : '') + '>102</option>' +
                     '<option value="201"' + (user.block === '201' ? ' selected' : '') + '>201</option>' +
                     '<option value="202"' + (user.block === '202' ? ' selected' : '') + '>202</option>' +
                     '<option value="301"' + (user.block === '301' ? ' selected' : '') + '>301</option>' +
                     '<option value="302"' + (user.block === '302' ? ' selected' : '') + '>302</option>' +
                     '<option value="401"' + (user.block === '401' ? ' selected' : '') + '>401</option>' +
                     '<option value="402"' + (user.block === '402' ? ' selected' : '') + '>402</option></select></div></div>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Section</label>' +
                     '<input type="text" class="form-input" id="edit-section" value="' + (user.section || '') + '"></div>' +
                     '<div class="form-group"><label class="form-label">Batch/Semester</label>' +
                     '<select class="form-input" id="edit-batch">' +
                     '<option value="">Select Batch</option>' +
                     '<option value="2025-2026"' + (user.batch === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
                     '<option value="2024-2025"' + (user.batch === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
                     '<option value="2023-2024"' + (user.batch === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div></div>' +
                     '<div class="form-group"><label class="form-label">Birthday</label>' +
                     '<input type="date" class="form-input" id="edit-birthday" value="' + (user.birthday || '') + '"></div>' +
                     '<div style="margin:16px 0 12px;border-top:1px solid var(--border-color);padding-top:12px;">' +
                     '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Organization Information</h4></div>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Organization</label>' +
                     '<select class="form-input" id="edit-organization">' +
                     '<option value="">Select Organization</option>' +
                     '<option value="College Student Council"' + (user.organization === 'College Student Council' ? ' selected' : '') + '>College Student Council</option>' +
                     '<option value="IT Club"' + (user.organization === 'IT Club' ? ' selected' : '') + '>IT Club</option>' +
                     '<option value="HM Club"' + (user.organization === 'HM Club' ? ' selected' : '') + '>HM Club</option>' +
                     '<option value="CPE Club"' + (user.organization === 'CPE Club' ? ' selected' : '') + '>CPE Club</option>' +
                     '<option value="BA Club"' + (user.organization === 'BA Club' ? ' selected' : '') + '>BA Club</option>' +
                     '<option value="BSAIS Club"' + (user.organization === 'BSAIS Club' ? ' selected' : '') + '>BSAIS Club</option>' +
                     '<option value="Junior Council"' + (user.organization === 'Junior Council' ? ' selected' : '') + '>Junior Council</option></select></div>' +
                     '<div class="form-group"><label class="form-label">Position</label>' +
                     '<select class="form-input" id="edit-position">' +
                     '<option value="">Select Position</option>' +
                     '<option value="President"' + (user.position === 'President' ? ' selected' : '') + '>President</option>' +
                     '<option value="Vice President"' + (user.position === 'Vice President' ? ' selected' : '') + '>Vice President</option>' +
                     '<option value="Secretary"' + (user.position === 'Secretary' ? ' selected' : '') + '>Secretary</option>' +
                     '<option value="Treasurer"' + (user.position === 'Treasurer' ? ' selected' : '') + '>Treasurer</option>' +
                     '<option value="Auditor"' + (user.position === 'Auditor' ? ' selected' : '') + '>Auditor</option>' +
                     '<option value="Business Manager"' + (user.position === 'Business Manager' ? ' selected' : '') + '>Business Manager</option>' +
                     '<option value="Peace Officer"' + (user.position === 'Peace Officer' ? ' selected' : '') + '>Peace Officer</option>' +
                     '<option value="Public Information Officer"' + (user.position === 'Public Information Officer' ? ' selected' : '') + '>Public Information Officer</option>' +
                     '<option value="PIO"' + (user.position === 'PIO' ? ' selected' : '') + '>PIO</option>' +
                     '<option value="Representative - IT"' + (user.position === 'Representative - IT' ? ' selected' : '') + '>Representative - IT</option>' +
                     '<option value="Representative - HM"' + (user.position === 'Representative - HM' ? ' selected' : '') + '>Representative - HM</option>' +
                     '<option value="Representative - CPE"' + (user.position === 'Representative - CPE' ? ' selected' : '') + '>Representative - CPE</option>' +
                     '<option value="Representative - BA"' + (user.position === 'Representative - BA' ? ' selected' : '') + '>Representative - BA</option>' +
                     '<option value="Representative - BSAIS"' + (user.position === 'Representative - BSAIS' ? ' selected' : '') + '>Representative - BSAIS</option>' +
                     '<option value="Junior Councilor"' + (user.position === 'Junior Councilor' ? ' selected' : '') + '>Junior Councilor</option>' +
                     '<option value="Member"' + (user.position === 'Member' ? ' selected' : '') + '>Member</option></select></div></div>' +
                     '<div style="margin:16px 0 12px;border-top:1px solid var(--border-color);padding-top:12px;">' +
                     '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Contact Information</h4></div>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Cellphone Number</label>' +
                     '<input type="tel" class="form-input" id="edit-cellphone" value="' + (user.cellphone || '') + '"></div>' +
                     '<div class="form-group"><label class="form-label">Email Address</label>' +
                     '<input type="email" class="form-input" id="edit-email" value="' + (user.email || '') + '" disabled></div></div>' +
                     '<div class="form-group"><label class="form-label">Street Address</label>' +
                     '<input type="text" class="form-input" id="edit-street" value="' + (user.address ? user.address.street : '') + '"></div>' +
                     '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">' +
                     '<div class="form-group"><label class="form-label">Barangay</label>' +
                     '<input type="text" class="form-input" id="edit-baranggay" value="' + (user.address ? user.address.barangay : '') + '"></div>' +
                     '<div class="form-group"><label class="form-label">City/Municipality</label>' +
                     '<input type="text" class="form-input" id="edit-city" value="' + (user.address ? user.address.city : '') + '"></div>' +
                     '<div class="form-group"><label class="form-label">Province</label>' +
                     '<input type="text" class="form-input" id="edit-province" value="' + (user.address ? user.address.province : '') + '"></div></div>' +
                     '<button type="submit" class="btn btn-primary" style="width:100%;margin-top:16px;">Save Changes</button>' +
                     '</form>' +
                     '</div></div></div>';
                 }
                
                document.getElementById('profile-modal').insertAdjacentHTML('beforeend', editProfileHtml);
                
                var closeEditProfile = document.getElementById('close-edit-profile-modal');
                var editProfileModal = document.getElementById('edit-profile-modal');
                if (closeEditProfile) {
                    closeEditProfile.addEventListener('click', function() {
                        editProfileModal.remove();
                    });
                }
                
                var editProfileForm = document.getElementById('edit-profile-form');
                if (editProfileForm) {
                    editProfileForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        var userIndex = self.data.users.findIndex(function(u) { return u.id === user.id; });
                        
                        if (user.role === 'admin') {
                            // Admin: only name editable
                            var newName = document.getElementById('edit-name').value;
                            user.name = newName;
                            if (userIndex > -1) {
                                self.data.users[userIndex].name = newName;
                            }
                        } else {
                            // Student: all fields
                            var newName = document.getElementById('edit-name').value;
                            var newStudentId = document.getElementById('edit-student-id').value;
                            var newCourse = document.getElementById('edit-course').value;
                            var newBlock = document.getElementById('edit-block').value;
                            var newSection = document.getElementById('edit-section').value;
                            var newBatch = document.getElementById('edit-batch').value;
                            var newBirthday = document.getElementById('edit-birthday').value;
                            var newOrganization = document.getElementById('edit-organization').value;
                            var newPosition = document.getElementById('edit-position').value;
                            var newCellphone = document.getElementById('edit-cellphone').value;
                            var newStreet = document.getElementById('edit-street').value;
                            var newBarangay = document.getElementById('edit-baranggay').value;
                            var newCity = document.getElementById('edit-city').value;
                            var newProvince = document.getElementById('edit-province').value;
                            
                            user.name = newName;
                            user.studentId = newStudentId;
                            user.course = newCourse;
                            user.block = newBlock;
                            user.section = newSection;
                            user.batch = newBatch;
                            user.birthday = newBirthday;
                            user.organization = newOrganization;
                            user.position = newPosition;
                            user.cellphone = newCellphone;
                            user.address = {
                                street: newStreet,
                                barangay: newBarangay,
                                city: newCity,
                                province: newProvince
                            };
                            
                            if (userIndex > -1) {
                                self.data.users[userIndex].name = newName;
                                self.data.users[userIndex].studentId = newStudentId;
                                self.data.users[userIndex].course = newCourse;
                                self.data.users[userIndex].block = newBlock;
                                self.data.users[userIndex].section = newSection;
                                self.data.users[userIndex].batch = newBatch;
                                self.data.users[userIndex].birthday = newBirthday;
                                self.data.users[userIndex].organization = newOrganization;
                                self.data.users[userIndex].position = newPosition;
                                self.data.users[userIndex].cellphone = newCellphone;
                                self.data.users[userIndex].address = user.address;
                            }
                        }
                        self.saveData();
                        // session in memory only
                        
                        var headerNameEl = document.querySelector('.header-right .profile-name');
                        if (headerNameEl) headerNameEl.textContent = user.name;
                        var headerAvatarEl = document.querySelector('.header-right .profile-avatar');
                        if (headerAvatarEl) headerAvatarEl.textContent = user.name.charAt(0).toUpperCase();
                        
                        editProfileModal.remove();
                        document.getElementById('profile-modal').remove();
                        self.showProfileModal();
                        alert('Profile updated successfully!');
                    });
                }
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
            document.querySelectorAll('.conversation-item').forEach(function(item) {
                var name = item.querySelector('div').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'block' : 'none';
            });
        });
        
        document.querySelectorAll('.conversation-item').forEach(function(item) {
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
            '<div class="form-group"><label class="form-label">Current Funds Amount (₱)</label><input type="number" class="form-input" id="funds-amount" min="0" step="0.01" required></div>' +
            '<div class="modal-actions"><button type="submit" class="btn btn-primary">Update Funds</button></div>' +
            '</form></div></div>';
        
        var totalExpenses = finance.transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var totalFundsRaised = finance.transactions.filter(function(t) { return t.type === 'funds_raised'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        html += '<div class="stats-grid" style="margin-bottom:20px;">' +
            '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">₱' + (finance.currentFunds || 0).toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalExpenses || 0).toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalFundsRaised || 0).toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
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
                    '<td>₱' + (t.amount || 0).toLocaleString() + '</td>' +
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
            '<div><div style="font-size:28px;font-weight:700;color:#10b981;">₱' + (finance.currentFunds || 0).toLocaleString() + '</div><div style="font-size:13px;color:var(--text-light);">Current Funds</div></div>' +
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

    renderAddAdmin: function() {
        var self = this;
        var yearOptions = '';
        var currentYear = new Date().getFullYear();
        for (var y = currentYear; y >= 1900; y--) {
            yearOptions += '<option value="' + y + '">' + y + '</option>';
        }
        var html = '<div class="content-actions">' +
            '<button class="btn btn-primary" id="add-new-admin-btn"><i class="fas fa-plus"></i> Add Administrator</button>' +
            '</div>' +
            '<div style="margin-top:20px;">' +
            '<h3 style="font-size:16px;margin-bottom:16px;">Administrators</h3>' +
            '<div class="table-container" style="overflow-x:auto;">' +
            '<table class="table" style="min-width:900px;">' +
            '<thead><tr><th style="width:50px;">Photo</th><th>Name</th><th style="width:100px;">ID</th><th style="width:80px;">Course</th><th style="width:70px;">Block</th><th style="width:70px;">Section</th><th style="width:100px;">Batch</th><th style="width:100px;">Role</th><th style="width:80px;">Status</th><th style="width:100px;">Actions</th></tr></thead>' +
            '<tbody>';
        
        var admins = (this.data.users || []).filter(function(u) { return u.role === 'admin'; });
        
        if (admins.length === 0) {
            html += '<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-light);">No administrators found</td></tr>';
        } else {
            admins.forEach(function(admin) {
                var photoHtml = admin.profilePic ? 
                    '<img src="' + admin.profilePic + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">' :
                    '<div style="width:36px;height:36px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;">' + (admin.name ? admin.name.charAt(0).toUpperCase() : '?') + '</div>';
                html += '<tr>' +
                    '<td style="text-align:center;">' + photoHtml + '</td>' +
                    '<td><strong>' + (admin.name || 'N/A') + '</strong></td>' +
                    '<td><code style="font-size:12px;">' + (admin.studentId || 'N/A') + '</code></td>' +
                    '<td>' + (admin.course || '-') + '</td>' +
                    '<td>' + (admin.block || '-') + '</td>' +
                    '<td>' + (admin.section || '-') + '</td>' +
                    '<td>' + (admin.batch || 'N/A') + '</td>' +
                    '<td><span class="badge badge-primary" style="font-size:11px;">' + (admin.adminRole || 'Admin') + '</span></td>' +
                    '<td><span class="badge ' + (admin.active ? 'badge-success' : 'badge-secondary') + '" style="font-size:11px;">' + (admin.active ? 'Active' : 'Inactive') + '</span></td>' +
                    '<td style="white-space:nowrap;">' +
                    '<button class="btn btn-sm btn-secondary" onclick="App.editAdmin(' + admin.id + ')" style="padding:4px 8px;font-size:12px;"><i class="fas fa-edit"></i></button> ' +
                    '<button class="btn btn-sm btn-danger" onclick="App.deleteAdmin(' + admin.id + ')" style="padding:4px 8px;font-size:12px;"><i class="fas fa-trash"></i></button>' +
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
            '<option value="Admin">Admin</option>' +
            '<option value="Super Admin">Super Admin</option>' +
            '<option value="Adviser">Adviser</option>' +
            '<option value="Student Affair Officer">Student Affair Officer</option>' +
            '<option value="Principal">Principal</option>' +
            '<option value="Administrator">Administrator</option>' +
            '</select></div>' +
            '<div class="form-group" id="admin-position-group" style="display:none;"><label class="form-label">Position</label>' +
            '<input type="text" class="form-input" id="admin-position" placeholder="Enter position (e.g., Faculty, Coordinator)"></div>' +
            '<div class="form-group"><label class="form-label">Birthday</label>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
            '<select class="form-input" id="admin-birthday-month">' +
            '<option value="">Month</option>' +
            '<option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option>' +
            '<option value="04">Apr</option><option value="05">May</option><option value="06">Jun</option>' +
            '<option value="07">Jul</option><option value="08">Aug</option><option value="09">Sep</option>' +
            '<option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option>' +
            '</select>' +
            '<select class="form-input" id="admin-birthday-day">' +
            '<option value="">Day</option>' +
            '</select>' +
            '<select class="form-input" id="admin-birthday-year">' +
            '<option value="">Year</option>' + yearOptions + '</select></div></div>' +
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
        var searchQuery = this.currentFilter.orgSearch || '';
        var selectedOrg = this.currentFilter.selectedOrg || '';
        var selectedTerm = this.currentFilter.orgTerm || '2025-2026';
        var currentBatch = '2025-2026';
        
        var allStudents = (this.data.users || []).filter(function(u) { return u.role === 'student' && u.status === 'active' && u.active === true && u.organization && u.organization.position; });
        
        var students = allStudents.filter(function(s) { return s.batch === selectedTerm || (s.organization && s.organization.term === selectedTerm); });
        
        var batchGroups = {};
        allStudents.forEach(function(s) {
            var batch = s.batch || 'Unknown';
            if (!batchGroups[batch]) batchGroups[batch] = [];
            batchGroups[batch].push(s);
        });
        
        var termOptions = '';
        Object.keys(batchGroups).sort().reverse().forEach(function(batch) {
            termOptions += '<option value="' + batch + '"' + (batch === selectedTerm ? ' selected' : '') + '>' + batch + '</option>';
        });
        
        var organizations = this.data.organizations || [
            { id: 1, name: 'College Student Council', committees: ['Executive', 'Finance', 'Public Relations', 'Documentation', 'Events'] },
            { id: 2, name: 'IT Club', committees: ['Executive', 'Technical', 'Documentation', 'Public Relations'] },
            { id: 3, name: 'HM Club', committees: ['Executive', 'Hospitality', 'Documentation', 'Public Relations'] },
            { id: 4, name: 'CPE Club', committees: ['Executive', 'Technical', 'Documentation', 'Public Relations'] },
            { id: 5, name: 'BA Club', committees: ['Executive', 'Finance', 'Documentation', 'Public Relations'] },
            { id: 6, name: 'BSAIS Club', committees: ['Executive', 'Finance', 'Documentation', 'Public Relations'] },
            { id: 7, name: 'Junior Council', committees: ['Executive', 'Student Affairs', 'Events'] }
        ];
        
        var positionMappings = this.data.positionMappings || {
            'President': { committee: 'Executive', isHead: true },
            'Vice President': { committee: 'Executive', isHead: true },
            'Secretary': { committee: 'Secretariate', isHead: true },
            'Treasurer': { committee: 'Finance', isHead: true },
            'Auditor': { committee: 'Finance', isHead: true },
            'Business Manager': { committee: 'Finance', isHead: true },
            'Peace Officer': { committee: 'Executive', isHead: true },
            'Public Information Officer': { committee: 'Public Relations', isHead: true },
            'PIO': { committee: 'Public Relations', isHead: true },
            'Representative - IT': { committee: 'Public Relations', isHead: false },
            'Representative - HM': { committee: 'Public Relations', isHead: false },
            'Representative - CPE': { committee: 'Public Relations', isHead: false },
            'Representative - BA': { committee: 'Public Relations', isHead: false },
            'Representative - BSAIS': { committee: 'Public Relations', isHead: false },
            'Junior Councilor': { committee: 'Student Affairs', isHead: false },
            'P.I.O': { committee: 'Public Relations', isHead: true }
        };
        
        var orgOptions = '<option value="">All Organizations</option>';
        organizations.forEach(function(org) {
            orgOptions += '<option value="' + org.name + '">' + org.name + '</option>';
        });
        
        if (searchQuery) {
            searchQuery = searchQuery.toLowerCase();
            students = students.filter(function(s) {
                return (s.name && s.name.toLowerCase().includes(searchQuery)) ||
                       (s.studentId && s.studentId.toLowerCase().includes(searchQuery));
            });
        }
        
        var html = '<div class="content-actions" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;">' +
            '<input type="text" class="form-input" id="org-search-input" placeholder="Search by name or ID..." style="width:240px;">' +
            '<button class="btn btn-primary" id="add-org-member-btn"><i class="fas fa-plus"></i> Add Member</button>' +
            '<div><span style="font-size:12px;font-weight:600;margin-bottom:4px;display:block;color:var(--text-light);">Term</span>' +
            '<select class="form-input" id="org-term-select" style="width:140px;">' + termOptions + '</select></div>' +
            '<div><span style="font-size:12px;font-weight:600;margin-bottom:4px;display:block;color:var(--text-light);">Organization</span>' +
            '<select class="form-input" id="org-filter-select" style="width:180px;">' + orgOptions + '</select></div>' +
            '</div>';
        
        var filteredStudents = selectedOrg ? students.filter(function(s) { return s.organization && s.organization.name === selectedOrg; }) : students;
        
        html += '<div style="margin-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
            '<h3 style="font-size:16px;margin:0;">Hierarchy Chart' + (selectedTerm ? ' - ' + selectedTerm : '') + (selectedOrg ? ' - ' + selectedOrg : '') + '</h3>' +
            '</div>' +
            '<div style="display:flex;gap:8px;">' +
            '<button class="btn btn-secondary btn-sm" id="manage-org-members-btn"><i class="fas fa-edit"></i> Manage</button>' +
            '<button class="btn btn-secondary btn-sm" id="export-org-btn"><i class="fas fa-download"></i> Export</button>' +
            '</div>' +
            '</div>';
        
        if (selectedOrg) {
            var orgStudents = filteredStudents;
            var heads = orgStudents.filter(function(s) { return s.organization && s.organization.roleType === 'Head'; });
            var members = orgStudents.filter(function(s) { return !s.organization || s.organization.roleType !== 'Head'; });
            
            var committeeGroups = {};
            heads.forEach(function(h) {
                var committee = h.organization && h.organization.committee ? h.organization.committee : 'Other';
                if (!committeeGroups[committee]) committeeGroups[committee] = { head: null, memberList: [] };
                committeeGroups[committee].head = h;
            });
            
            members.forEach(function(m) {
                var committee = m.organization && m.organization.committee ? m.organization.committee : 'Other';
                if (!committeeGroups[committee]) committeeGroups[committee] = { head: null, memberList: [] };
                committeeGroups[committee].memberList.push(m);
            });
            
            var committeeNames = Object.keys(committeeGroups).sort();
            
            var uniqueBlocks = {};
            orgStudents.forEach(function(s) { if (s.block) uniqueBlocks[s.block] = true; });
            var blockInfo = Object.keys(uniqueBlocks).sort().join(', ') || '-';
            var uniqueSections = {};
            orgStudents.forEach(function(s) { if (s.section) uniqueSections[s.section] = true; });
            var sectionInfo = Object.keys(uniqueSections).sort().join(', ') || '-';
            
            html += '<div style="background:var(--bg-white);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:12px 16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
                '<div style="font-size:14px;font-weight:600;"><strong>' + selectedOrg + '</strong></div>' +
                '<div style="display:flex;gap:16px;font-size:13px;color:var(--text-light);">' +
                '<div>Block: <strong style="color:var(--text-dark);">' + blockInfo + '</strong></div>' +
                '<div>Section: <strong style="color:var(--text-dark);">' + sectionInfo + '</strong></div>' +
                '</div>' +
                '</div>' +
                '<div class="table-container" style="overflow-x:auto;">' +
                '<table class="table" style="min-width:900px;">' +
                '<thead><tr>' +
                '<th style="width:120px;">Committee</th>' +
                '<th style="width:100px;">Role</th>' +
                '<th style="width:180px;">Name</th>' +
                '<th style="width:130px;">Position</th>' +
                '<th style="width:80px;">Course</th>' +
                '<th style="width:60px;">Block</th>' +
                '<th style="width:60px;">Section</th>' +
                '</tr></thead><tbody>';
            
            committeeNames.forEach(function(committee) {
                var group = committeeGroups[committee];
                var firstCommittee = true;
                
                if (group.head) {
                    var profilePicHtml = group.head.profilePic ? 
                        '<img src="' + group.head.profilePic + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">' :
                        '<div style="width:28px;height:28px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;">' + (group.head.name ? group.head.name.charAt(0).toUpperCase() : '?') + '</div>';
                    
                    html += '<tr>' +
                        '<td style="font-weight:600;background:' + (firstCommittee ? '#e8f5e9' : 'transparent') + ';">' + (firstCommittee ? committee + ' Committee' : '') + '</td>' +
                        '<td><span style="background:#4caf50;color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">HEAD</span></td>' +
                        '<td><div style="display:flex;align-items:center;gap:8px;">' + profilePicHtml + '<span>' + (group.head.name || 'N/A') + '</span></div></td>' +
                        '<td>' + (group.head.organization && group.head.organization.position ? group.head.organization.position : 'Member') + '</td>' +
                        '<td>' + (group.head.course || '-') + '</td>' +
                        '<td>' + (group.head.block || '-') + '</td>' +
                        '<td>' + (group.head.section || '-') + '</td>' +
                        '</tr>';
                    firstCommittee = false;
                }
                
                group.memberList.forEach(function(m) {
                    var memberPicHtml = m.profilePic ? 
                        '<img src="' + m.profilePic + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">' :
                        '<div style="width:28px;height:28px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:12px;">' + (m.name ? m.name.charAt(0).toUpperCase() : '?') + '</div>';
                    
                    html += '<tr>' +
                        '<td style="font-weight:600;">' + (firstCommittee ? committee + ' Committee' : '') + '</td>' +
                        '<td><span style="background:var(--bg-color);color:var(--text-light);padding:2px 8px;border-radius:4px;font-size:11px;">Member</span></td>' +
                        '<td><div style="display:flex;align-items:center;gap:8px;">' + memberPicHtml + '<span>' + (m.name || 'N/A') + '</span></div></td>' +
                        '<td>' + (m.organization && m.organization.position ? m.organization.position : 'Member') + '</td>' +
                        '<td>' + (m.course || '-') + '</td>' +
                        '<td>' + (m.block || '-') + '</td>' +
                        '<td>' + (m.section || '-') + '</td>' +
                        '</tr>';
                    firstCommittee = false;
                });
            });
            
            html += '</tbody></table></div>';
            
            if (Object.keys(committeeGroups).length === 0) {
                html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-sitemap"></i></div>' +
                    '<h3 class="empty-title">No hierarchy data</h3><p class="empty-text">Add members to see hierarchy chart</p></div>';
            }
        } else {
            html += '<div style="padding:40px;text-align:center;background:var(--bg-white);border-radius:8px;border:1px solid var(--border-color);">' +
                '<i class="fas fa-sitemap" style="font-size:48px;color:var(--text-light);margin-bottom:16px;display:block;"></i>' +
                '<p style="color:var(--text-light);">Select an organization above to view its hierarchy chart</p></div>';
        }
        
        html += '</div>';
        
        var orgSelectOptions = '<option value="">Select Organization</option>';
        organizations.forEach(function(org) {
            orgSelectOptions += '<option value="' + org.name + '">' + org.name + '</option>';
        });
        
        html += '<div id="add-org-member-modal" class="modal" style="display:none;">' +
            '<div class="modal-content" style="max-width:500px;">' +
            '<div class="modal-header"><h3>Add Organization Member</h3><button class="modal-close" id="close-add-org-modal">&times;</button></div>' +
            '<div class="modal-body">' +
            '<form id="add-org-form">' +
            '<div class="form-group"><label class="form-label">Search Student *</label>' +
            '<input type="text" class="form-input" id="org-student-search" placeholder="Type to search student by name or ID..." required autocomplete="off">' +
            '<div id="org-search-results" style="max-height:200px;overflow-y:auto;border:1px solid var(--border-color);border-radius:4px;margin-top:4px;display:none;"></div>' +
            '<input type="hidden" id="org-student-id"></div>' +
            '<div id="selected-student-info" style="display:none;padding:12px;background:var(--bg-color);border-radius:8px;margin-bottom:12px;">' +
            '<strong>Selected:</strong> <span id="selected-student-name"></span></div>' +
            '<div class="form-group"><label class="form-label">Term/Batch *</label>' +
            '<select class="form-input" id="org-term" required>' +
            '<option value="2025-2026">2025-2026</option>' +
            '<option value="2024-2025">2024-2025</option>' +
            '<option value="2023-2024">2023-2024</option></select></div>' +
            '<div class="form-group"><label class="form-label">Organization Name *</label>' +
            '<select class="form-input" id="org-name" required>' + orgSelectOptions + '</select></div>' +
            '<div class="form-group"><label class="form-label">Position *</label>' +
            '<select class="form-input" id="org-position" required>' +
            '<option value="">Select Position</option>' +
            '<option value="President">President</option>' +
            '<option value="Vice President">Vice President</option>' +
            '<option value="Secretary">Secretary</option>' +
            '<option value="Treasurer">Treasurer</option>' +
            '<option value="Auditor">Auditor</option>' +
            '<option value="Business Manager">Business Manager</option>' +
            '<option value="Peace Officer">Peace Officer</option>' +
            '<option value="Public Information Officer">Public Information Officer (PIO)</option>' +
            '<option value="Representative - IT">Representative - IT</option>' +
            '<option value="Representative - HM">Representative - HM</option>' +
            '<option value="Representative - CPE">Representative - CPE</option>' +
            '<option value="Representative - BA">Representative - BA</option>' +
            '<option value="Representative - BSAIS">Representative - BSAIS</option>' +
            '<option value="Junior Councilor">Junior Councilor</option>' +
            '</select></div>' +
            '<div class="form-group"><label class="form-label">Committee</label>' +
            '<select class="form-input" id="org-committee">' +
            '<option value="">Select Committee</option>' +
            '<option value="Executive">Executive</option>' +
            '<option value="Finance">Finance</option>' +
            '<option value="Public Relations">Public Relations</option>' +
            '<option value="Secretariate">Secretariate</option>' +
            '<option value="Documentation">Documentation</option>' +
            '<option value="Events">Events</option>' +
            '<option value="Technical">Technical</option>' +
            '<option value="Hospitality">Hospitality</option>' +
            '<option value="Student Affairs">Student Affairs</option>' +
            '</select></div>' +
            '<div class="form-group"><label class="form-label">Role Type *</label>' +
            '<select class="form-input" id="org-role-type" required>' +
            '<option value="">Select Role Type</option>' +
            '<option value="Head">Head</option>' +
            '<option value="Member">Member</option>' +
            '</select></div>' +
            '<div class="form-group"><label class="form-label">Status</label>' +
            '<select class="form-input" id="org-status">' +
            '<option value="Active">Active</option>' +
            '<option value="Inactive">Inactive</option>' +
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
            '<option value="Student">' + (admin.adminRole === 'Student' ? ' selected' : '') + '>Student</option>' +
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
                    var selectedRole = document.getElementById('edit-admin-role').value;
                    if (selectedRole === 'Student') {
                        updatedAdmin.role = 'student';
                        updatedAdmin.adminRole = null;
                    } else {
                        updatedAdmin.role = 'admin';
                        updatedAdmin.adminRole = selectedRole;
                    }
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
                '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">₱' + (finance.currentFunds || 0).toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalExpenses || 0).toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
                '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalFundsRaised || 0).toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
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
            '<div class="stat-card"><div class="stat-icon" style="background:#f0fdf4;color:#16a34a;"><i class="fas fa-wallet"></i></div><div class="stat-info"><div class="stat-value">₱' + (finance.currentFunds || 0).toLocaleString() + '</div><div class="stat-label">Current Funds</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#fef2f2;color:#dc2626;"><i class="fas fa-minus-circle"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalExpenses || 0).toLocaleString() + '</div><div class="stat-label">Total Expenses</div></div></div>' +
            '<div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#2563eb;"><i class="fas fa-donate"></i></div><div class="stat-info"><div class="stat-value">₱' + (totalFundsRaised || 0).toLocaleString() + '</div><div class="stat-label">Funds Raised</div></div></div>' +
        '</div>';
        
        if (finance.transactions.length === 0) {
            html += '<div class="empty-state"><div class="empty-icon"><i class="fas fa-receipt"></i></div><h3 class="empty-title">No transactions</h3><p class="empty-text">Transaction history will appear here</p></div>';
        } else {
            html += '<div class="table-container"><table class="table"><thead><tr><th>Date</th><th>Type</th><th>Event</th><th>Amount</th><th>Description</th></tr></thead><tbody>';
            finance.transactions.forEach(function(t) {
                var typeBadge = t.type === 'expense' ? 'badge-danger' : 'badge-primary';
                var typeLabel = t.type === 'expense' ? 'Expense' : 'Funds Raised';
                html += '<tr><td>' + t.date + '</td><td><span class="badge ' + typeBadge + '">' + typeLabel + '</span></td><td>' + (t.eventTitle || '-') + '</td><td>₱' + (t.amount || 0).toLocaleString() + '</td><td>' + t.description + '</td></tr>';
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
        
        document.querySelectorAll('.nav-item').forEach(function(item) {
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
            // localStorage removed
            self.currentUser = null;
            self.renderLandingPage();
        });

        // Dark Mode Toggle
        document.querySelector('[data-action="dark-mode"]') && document.querySelector('[data-action="dark-mode"]').addEventListener('click', function() {
            self.darkMode = !self.darkMode;
            self.savePreferences();
            document.body.classList.toggle('dark-mode', self.darkMode);
            var icon = this.querySelector('i');
            if (icon) {
                icon.className = self.darkMode ? 'fas fa-sun' : 'fas fa-moon';
            }
        });

        // Settings
        document.querySelector('[data-action="settings"]') && document.querySelector('[data-action="settings"]').addEventListener('click', function() {
            var settingsHtml = '<div id="settings-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
                '<div class="modal-content" style="max-width:400px;">' +
                '<div class="modal-header"><h3>Settings</h3><button class="modal-close" id="close-settings-modal">&times;</button></div>' +
                '<div style="padding:24px;">' +
                '<div class="form-group">' +
                '<label class="form-label"><i class="fas fa-moon"></i> Dark Mode</label>' +
                '<label style="display:flex;align-items:center;cursor:pointer;">' +
                '<input type="checkbox" id="settings-dark-mode" ' + (self.darkMode ? 'checked' : '') + ' style="margin-right:8px;">' +
                '<span>Enable dark mode</span>' +
                '</label>' +
                '</div>' +
                '<div class="form-group">' +
                '<label class="form-label"><i class="fas fa-bell"></i> Notifications</label>' +
                '<label style="display:flex;align-items:center;cursor:pointer;">' +
                '<input type="checkbox" id="settings-notifications" checked style="margin-right:8px;">' +
                '<span>Enable notifications</span>' +
                '</label>' +
                '</div>' +
                '<button class="btn btn-primary" id="save-settings-btn" style="width:100%;margin-top:16px;">Save Settings</button>' +
                '</div></div></div>';
            
            document.getElementById('app').insertAdjacentHTML('beforeend', settingsHtml);
            
            document.getElementById('close-settings-modal').addEventListener('click', function() {
                document.getElementById('settings-modal').remove();
            });
            
            document.getElementById('save-settings-btn').addEventListener('click', function() {
                var darkModeChecked = document.getElementById('settings-dark-mode').checked;
                self.darkMode = darkModeChecked;
                self.savePreferences();
                document.body.classList.toggle('dark-mode', self.darkMode);
                document.getElementById('settings-modal').remove();
                self.renderDashboard();
            });
        });

        // Message Button
        var messageBtn = document.getElementById('message-btn');
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                self.showMessageModal();
            });
        }

        // Content Tab Buttons (Student - inside content area)
        document.querySelectorAll('.content-tab-btn').forEach(function(btn) {
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
                var isSuperAdmin = self.currentUser.adminRole === 'Super Admin';
                
                if (editId) {
                    var idx = self.data.headlines.findIndex(function(h) { return h.id == editId; });
                    if (idx > -1) {
                        self.data.headlines[idx] = { id: parseInt(editId), title: title, content: content, date: self.data.headlines[idx].date, status: 'approved' };
                    }
                } else {
                    if (isSuperAdmin) {
                        self.data.headlines.push({
                            id: Date.now(),
                            title: title,
                            content: content,
                            contentType: 'Featured',
                            date: new Date().toISOString().split('T')[0],
                            status: 'approved',
                            requestedBy: self.currentUser.name,
                            requestedByEmail: self.currentUser.email
                        });
                    } else {
                        self.data.postRequests.push({
                            id: Date.now(),
                            title: title,
                            content: title,
                            contentType: 'Featured',
                            date: new Date().toISOString().split('T')[0],
                            requestedBy: self.currentUser.name,
                            requestedByEmail: self.currentUser.email,
                            status: 'pending'
                        });
                    }
                }
                
                self.saveData();
                headlineModal.style.display = 'none';
                self.renderAdminDashboard();
            });
        }

        // Post Request Approve/Reject/On Review
        document.querySelectorAll('[data-action="approve-post-request"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var reqId = parseInt(btn.dataset.id);
                var req = self.data.postRequests.find(function(r) { return r.id === reqId; });
                if (req) {
                    self.data.headlines.push({
                        id: Date.now(),
                        title: req.title,
                        content: req.content,
                        contentType: req.contentType || 'Featured',
                        date: new Date().toISOString().split('T')[0],
                        status: 'approved',
                        requestedBy: req.requestedBy,
                        requestedByEmail: req.requestedByEmail
                    });
                    self.data.postRequests = self.data.postRequests.filter(function(r) { return r.id !== reqId; });
                    self.saveData();
                    self.renderAdminDashboard();
                    alert('Post request approved!');
                }
            });
        });

        document.querySelectorAll('[data-action="onreview-post-request"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var reqId = parseInt(btn.dataset.id);
                var req = self.data.postRequests.find(function(r) { return r.id === reqId; });
                if (req) {
                    req.status = 'on_review';
                    self.saveData();
                    self.renderAdminDashboard();
                    alert('Request marked as On Review');
                }
            });
        });

        document.querySelectorAll('[data-action="reject-post-request"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var reqId = parseInt(btn.dataset.id);
                var req = self.data.postRequests.find(function(r) { return r.id === reqId; });
                if (req) {
                    req.status = 'denied';
                    self.saveData();
                    self.renderAdminDashboard();
                    alert('Post request denied.');
                }
            });
        });

        // Remove denied request
        document.querySelectorAll('[data-action="remove-denied-request"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var reqId = parseInt(btn.dataset.id);
                if (confirm('Remove this denied request?')) {
                    self.data.postRequests = self.data.postRequests.filter(function(r) { return r.id !== reqId; });
                    self.saveData();
                    self.renderAdminDashboard();
                }
            });
        });

        // Headline Edit/Delete
        document.querySelectorAll('[data-action="edit-headline"]').forEach(function(btn) {
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
        
        document.querySelectorAll('[data-action="delete-headline"]').forEach(function(btn) {
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

        // Student Toggle (Activate/Deactivate)
        document.querySelectorAll('[data-action="toggle-student"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    if (student.active) {
                        student.active = false;
                        student.status = 'inactive';
                    } else {
                        student.active = true;
                        student.status = 'active';
                    }
                    self.saveData();
                    self.renderAdminDashboard();
                    alert(student.name + ' has been ' + (student.active ? 'activated' : 'deactivated') + '!');
                }
            });
        });

        // Student Checkbox - Select All
        var selectAllHeader = document.getElementById('select-all-checkbox-header');
        var selectAllStudents = document.getElementById('select-all-students');
        var deleteSelectedBtn = document.getElementById('delete-selected-students');
        var selectedCountSpan = document.getElementById('selected-count');
        
        function updateSelectedCount() {
            var checkboxes = document.querySelectorAll('.student-checkbox:checked');
            var count = checkboxes.length;
            if (selectedCountSpan) selectedCountSpan.textContent = count;
            if (deleteSelectedBtn) {
                deleteSelectedBtn.style.display = count > 0 ? 'inline-block' : 'none';
            }
        }
        
        if (selectAllHeader) {
            selectAllHeader.addEventListener('change', function() {
                var checkboxes = document.querySelectorAll('.student-checkbox');
                checkboxes.forEach(function(cb) {
                    cb.checked = selectAllHeader.checked;
                });
                if (selectAllStudents) selectAllStudents.checked = selectAllHeader.checked;
                updateSelectedCount();
            });
        }
        
        if (selectAllStudents) {
            selectAllStudents.addEventListener('change', function() {
                var checkboxes = document.querySelectorAll('.student-checkbox');
                checkboxes.forEach(function(cb) {
                    cb.checked = selectAllStudents.checked;
                });
                if (selectAllHeader) selectAllHeader.checked = selectAllStudents.checked;
                updateSelectedCount();
            });
        }
        
        document.querySelectorAll('.student-checkbox').forEach(function(cb) {
            cb.addEventListener('change', updateSelectedCount);
        });
        
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', function() {
                if (self.currentUser.adminRole !== 'Super Admin') {
                    alert('Only Super Admin can delete students!');
                    return;
                }
                var checkboxes = document.querySelectorAll('.student-checkbox:checked');
                var idsToDelete = Array.from(checkboxes).map(function(cb) { return parseInt(cb.value); });
                
                if (idsToDelete.length === 0) {
                    alert('No students selected!');
                    return;
                }
                
                if (confirm('Are you sure you want to delete ' + idsToDelete.length + ' student(s)? This action cannot be undone.')) {
                    self.data.users = self.data.users.filter(function(u) { return !idsToDelete.includes(u.id) || u.role !== 'student'; });
                    self.saveData();
                    self.renderAdminDashboard();
                    alert(idsToDelete.length + ' student(s) deleted successfully!');
                }
            });
        }

        // Student Edit
        document.querySelectorAll('[data-action="edit-student"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    var editHtml = '<div id="edit-student-modal" class="modal" style="display:flex;align-items:center;justify-content:center;">' +
                        '<div class="modal-content wide">' +
                        '<div class="modal-header"><h3>Edit Student</h3><button class="modal-close" id="close-edit-student-modal">&times;</button></div>' +
                        '<div style="padding:24px;">' +
                        '<form id="edit-student-form">' +
                        '<input type="hidden" id="edit-student-id" value="' + student.id + '">' +
                        '<div class="form-group"><label class="form-label">Full Name *</label>' +
                        '<input type="text" class="form-input" id="edit-student-name" value="' + (student.name || '') + '" required></div>' +
                        '<div class="form-group"><label class="form-label">Student ID *</label>' +
                        '<input type="text" class="form-input" id="edit-student-id-number" value="' + (student.studentId || '') + '" required></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Course *</label>' +
                        '<select class="form-input" id="edit-student-course" required>' +
                        '<option value="">Select Course</option>' +
                        '<option value="BSIT"' + (student.course === 'BSIT' ? ' selected' : '') + '>BSIT</option>' +
                        '<option value="BSCPE"' + (student.course === 'BSCPE' ? ' selected' : '') + '>BSCPE</option>' +
                        '<option value="BSBA"' + (student.course === 'BSBA' ? ' selected' : '') + '>BSBA</option>' +
                        '<option value="BSAIS"' + (student.course === 'BSAIS' ? ' selected' : '') + '>BSAIS</option>' +
                        '<option value="BSHM"' + (student.course === 'BSHM' ? ' selected' : '') + '>BSHM</option></select></div>' +
                        '<div class="form-group"><label class="form-label">Block *</label>' +
                        '<select class="form-input" id="edit-student-block" required>' +
                        '<option value="">Select Block</option>' +
                        '<option value="101"' + (student.block === '101' ? ' selected' : '') + '>101</option>' +
                        '<option value="102"' + (student.block === '102' ? ' selected' : '') + '>102</option>' +
                        '<option value="201"' + (student.block === '201' ? ' selected' : '') + '>201</option>' +
                        '<option value="202"' + (student.block === '202' ? ' selected' : '') + '>202</option>' +
                        '<option value="301"' + (student.block === '301' ? ' selected' : '') + '>301</option>' +
                        '<option value="302"' + (student.block === '302' ? ' selected' : '') + '>302</option>' +
                        '<option value="401"' + (student.block === '401' ? ' selected' : '') + '>401</option>' +
                        '<option value="402"' + (student.block === '402' ? ' selected' : '') + '>402</option></select></div></div>' +
                        '<div class="form-group"><label class="form-label">Section *</label>' +
                        '<input type="text" class="form-input" id="edit-student-section" value="' + (student.section || '') + '" required></div>' +
                        '<div class="form-group"><label class="form-label">Batch *</label>' +
                        '<select class="form-input" id="edit-student-batch" required>' +
                        '<option value="">Select Batch</option>' +
                        '<option value="2025-2026"' + (student.batch === '2025-2026' ? ' selected' : '') + '>2025-2026</option>' +
                        '<option value="2024-2025"' + (student.batch === '2024-2025' ? ' selected' : '') + '>2024-2025</option>' +
                        '<option value="2023-2024"' + (student.batch === '2023-2024' ? ' selected' : '') + '>2023-2024</option></select></div>' +
                        '<div style="margin:16px 0 12px;border-top:1px solid var(--border-color);padding-top:12px;">' +
                        '<h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Organization Information</h4></div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                        '<div class="form-group"><label class="form-label">Organization</label>' +
                        '<select class="form-input" id="edit-student-organization">' +
                        '<option value="">Select Organization</option>' +
                        '<option value="College Student Council"' + (student.organization && student.organization.name === 'College Student Council' ? ' selected' : '') + '>College Student Council</option>' +
                        '<option value="IT Club"' + (student.organization && student.organization.name === 'IT Club' ? ' selected' : '') + '>IT Club</option>' +
                        '<option value="HM Club"' + (student.organization && student.organization.name === 'HM Club' ? ' selected' : '') + '>HM Club</option>' +
                        '<option value="CPE Club"' + (student.organization && student.organization.name === 'CPE Club' ? ' selected' : '') + '>CPE Club</option>' +
                        '<option value="BA Club"' + (student.organization && student.organization.name === 'BA Club' ? ' selected' : '') + '>BA Club</option>' +
                        '<option value="BSAIS Club"' + (student.organization && student.organization.name === 'BSAIS Club' ? ' selected' : '') + '>BSAIS Club</option>' +
                        '<option value="Junior Council"' + (student.organization && student.organization.name === 'Junior Council' ? ' selected' : '') + '>Junior Council</option></select></div>' +
                        '<div class="form-group"><label class="form-label">Position</label>' +
                        '<select class="form-input" id="edit-student-position">' +
                        '<option value="">Select Position</option>' +
                        '<option value="President"' + (student.organization && student.organization.position === 'President' ? ' selected' : '') + '>President</option>' +
                        '<option value="Vice President"' + (student.organization && student.organization.position === 'Vice President' ? ' selected' : '') + '>Vice President</option>' +
                        '<option value="Secretary"' + (student.organization && student.organization.position === 'Secretary' ? ' selected' : '') + '>Secretary</option>' +
                        '<option value="Treasurer"' + (student.organization && student.organization.position === 'Treasurer' ? ' selected' : '') + '>Treasurer</option>' +
                        '<option value="Auditor"' + (student.organization && student.organization.position === 'Auditor' ? ' selected' : '') + '>Auditor</option>' +
                        '<option value="Business Manager"' + (student.organization && student.organization.position === 'Business Manager' ? ' selected' : '') + '>Business Manager</option>' +
                        '<option value="Peace Officer"' + (student.organization && student.organization.position === 'Peace Officer' ? ' selected' : '') + '>Peace Officer</option>' +
                        '<option value="Public Information Officer"' + (student.organization && student.organization.position === 'Public Information Officer' ? ' selected' : '') + '>Public Information Officer</option>' +
                        '<option value="Representative - IT"' + (student.organization && student.organization.position === 'Representative - IT' ? ' selected' : '') + '>Representative - IT</option>' +
                        '<option value="Representative - HM"' + (student.organization && student.organization.position === 'Representative - HM' ? ' selected' : '') + '>Representative - HM</option>' +
                        '<option value="Representative - CPE"' + (student.organization && student.organization.position === 'Representative - CPE' ? ' selected' : '') + '>Representative - CPE</option>' +
                        '<option value="Representative - BA"' + (student.organization && student.organization.position === 'Representative - BA' ? ' selected' : '') + '>Representative - BA</option>' +
                        '<option value="Representative - BSAIS"' + (student.organization && student.organization.position === 'Representative - BSAIS' ? ' selected' : '') + '>Representative - BSAIS</option>' +
                        '<option value="Junior Councilor"' + (student.organization && student.organization.position === 'Junior Councilor' ? ' selected' : '') + '>Junior Councilor</option>' +
                        '<option value="Member"' + (student.organization && student.organization.position === 'Member' ? ' selected' : '') + '>Member</option></select></div></div>' +
'<button type="submit" class="btn btn-primary btn-block" style="margin-top:16px;">Save Changes</button>' +
                        '</form></div></div></div>';
                    
                    document.getElementById('app').insertAdjacentHTML('beforeend', editHtml);
                    
                    document.getElementById('close-edit-student-modal').addEventListener('click', function() {
                        document.getElementById('edit-student-modal').remove();
                    });
                    
                    document.getElementById('edit-student-form').addEventListener('submit', function(e) {
                        e.preventDefault();
                        student.name = document.getElementById('edit-student-name').value;
                        student.studentId = document.getElementById('edit-student-id-number').value;
                        student.course = document.getElementById('edit-student-course').value;
                        student.block = document.getElementById('edit-student-block').value;
                        student.section = document.getElementById('edit-student-section').value;
                        student.batch = document.getElementById('edit-student-batch').value;
                        var orgName2 = document.getElementById('edit-student-organization').value;
                        var orgPosition2 = document.getElementById('edit-student-position').value;
                        var orgCommittee2 = document.getElementById('edit-student-committee') ? document.getElementById('edit-student-committee').value : '';
                        var orgRoleType2 = document.getElementById('edit-student-role-type') ? document.getElementById('edit-student-role-type').value : '';
                        
                        if (orgName2 || orgPosition2 || orgCommittee2 || orgRoleType2) {
                            student.organization = {
                                name: orgName2,
                                position: orgPosition2,
                                committee: orgCommittee2,
                                roleType: orgRoleType2
                            };
                        } else {
                            student.organization = null;
                        }
                        self.saveData();
                        document.getElementById('edit-student-modal').remove();
                        self.renderAdminDashboard();
                        alert('Student updated successfully!');
                    });
                }
            });
        });

        // Student Reset Password
        document.querySelectorAll('[data-action="reset-password"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var studentId = parseInt(btn.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    if (confirm('Reset password for ' + student.name + ' to default "student123"?')) {
                        student.password = 'student123';
                        self.saveData();
                        alert('Password has been reset to: student123');
                    }
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

        // Student Promote via Dropdown
        document.querySelectorAll('[data-action="promote-student-select"]').forEach(function(select) {
            if (select.classList.contains('listener-added')) return;
            select.classList.add('listener-added');
            select.addEventListener('change', function() {
                if (self.currentUser.adminRole !== 'Super Admin') {
                    alert('Only Super Admin can promote students!');
                    this.value = '';
                    return;
                }
                var selectedRole = this.value;
                if (!selectedRole) return;
                
                var studentId = parseInt(this.dataset.id);
                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    if (confirm('Are you sure you want to promote ' + student.name + ' to ' + selectedRole + '?')) {
                        student.role = 'admin';
                        student.adminRole = selectedRole;
                        self.saveData();
                        self.renderAdminDashboard();
                        alert(student.name + ' has been promoted to ' + selectedRole + '!');
                    }
                }
                this.value = '';
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

        // Events
        document.querySelectorAll('[data-action="delete-event"]').forEach(function(btn) {
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

        // Events Edit
        document.querySelectorAll('[data-action="edit-event"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var eventId = parseInt(btn.dataset.id);
                var event = self.data.events.find(function(e) { return e.id === eventId; });
                if (event) {
                    document.getElementById('event-form').dataset.editId = eventId;
                    document.getElementById('event-submit-btn').textContent = 'Update Event';
                    document.querySelector('.modal-header h3').textContent = 'Edit Event';
                    document.getElementById('event-title').value = event.title || '';
                    document.getElementById('event-location').value = event.location || '';
                    document.getElementById('event-description').value = event.description || '';
                    if (document.getElementById('event-status')) document.getElementById('event-status').value = event.status || 'upcoming';
                    if (document.getElementById('event-batch')) document.getElementById('event-batch').value = event.batch || '';
                    if (document.getElementById('event-pin')) document.getElementById('event-pin').checked = event.pinned || false;
                    
                    if (event.date) {
                        var parts = event.date.split('-');
                        if (parts.length === 3) {
                            if (document.getElementById('event-year')) document.getElementById('event-year').value = parts[0];
                            if (document.getElementById('event-month')) document.getElementById('event-month').value = parts[1];
                            if (document.getElementById('event-day')) {
                                var daySelect = document.getElementById('event-day');
                                daySelect.innerHTML = '<option value="">Select</option>';
                                var daysInMonth = new Date(parseInt(parts[0]), parseInt(parts[1]), 0).getDate();
                                for (var d = 1; d <= daysInMonth; d++) {
                                    var option = document.createElement('option');
                                    option.value = d;
                                    option.textContent = d;
                                    if (d === parseInt(parts[2])) option.selected = true;
                                    daySelect.appendChild(option);
                                }
                            }
                        }
                    }
                    if (event.time && document.getElementById('event-time')) {
                        document.getElementById('event-time').value = event.time;
                    }
                    
                    if (event.mediaGallery && event.mediaGallery.length > 0) {
                        self.registerData = self.registerData || {};
                        self.registerData.eventMediaGallery = event.mediaGallery.slice();
                        var preview = document.getElementById('event-media-preview');
                        if (preview) {
                            preview.innerHTML = '';
                            event.mediaGallery.forEach(function(mediaData, idx) {
                                var div = document.createElement('div');
                                div.style.position = 'relative';
                                div.style.display = 'inline-block';
                                div.style.margin = '4px';
                                if (mediaData.type === 'image') {
                                    div.innerHTML = '<img src="' + mediaData.data + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">' +
                                        '<button type="button" onclick="App.removeEventMedia(' + idx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                                } else {
                                    div.innerHTML = '<div style="width:80px;height:80px;background:#333;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-video"></i></div>' +
                                        '<button type="button" onclick="App.removeEventMedia(' + idx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                                }
                                preview.appendChild(div);
                            });
                        }
                    }
                    
                    document.getElementById('event-modal').style.display = 'flex';
                }
            });
        });

        // Approve User
        document.querySelectorAll('[data-action="approve-user"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var userId = parseInt(btn.dataset.id);
                var user = self.data.users.find(function(u) { return u.id === userId; });
                if (user) {
                    if (confirm('Approve ' + user.name + '\'s registration?')) {
                        user.status = 'active';
                        user.active = true;
                        self.saveData();
                        self.renderAdminDashboard();
                        alert(user.name + ' has been approved!');
                    }
                }
            });
        });

        // Deny User
        document.querySelectorAll('[data-action="deny-user"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var userId = parseInt(btn.dataset.id);
                var user = self.data.users.find(function(u) { return u.id === userId; });
                if (user) {
                    if (confirm('Deny ' + user.name + '\'s registration? This will remove the user.')) {
                        var index = self.data.users.findIndex(function(u) { return u.id === userId; });
                        if (index > -1) {
                            self.data.users.splice(index, 1);
                            self.saveData();
                            self.renderAdminDashboard();
                            alert(user.name + ' has been denied and removed.');
                        }
                    }
                }
            });
        });

        // Approve/Deny buttons click stop propagation
        document.querySelectorAll('[data-action="approve-user"], [data-action="deny-user"]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });

        // Toggle Images in Pending
        document.querySelectorAll('.toggle-images-btn').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var targetId = btn.dataset.target;
                var target = document.getElementById(targetId);
                if (target) {
                    if (target.style.display === 'none') {
                        target.style.display = 'block';
                        btn.innerHTML = '<i class="fas fa-images"></i> Hide Documents';
                    } else {
                        target.style.display = 'none';
                        btn.innerHTML = '<i class="fas fa-images"></i> View Documents';
                    }
                }
            });
        });

        // Close Image Modal
        var closeImageModal = document.getElementById('close-image-modal');
        if (closeImageModal) {
            closeImageModal.addEventListener('click', function() {
                var modal = document.getElementById('image-modal');
                if (modal) modal.style.display = 'none';
            });
        }

        // Download QR Code (from QR list table)
        document.querySelectorAll('[data-action="download-qr"]').forEach(function(btn) {
            if (btn.classList.contains('listener-added')) return;
            btn.classList.add('listener-added');
            btn.addEventListener('click', function() {
                var event = self.data.events.find(function(e) { return e.id == btn.dataset.id; });
                if (event && event.qrCode) {
                    var qrData = 'CSC:' + event.qrCode + '|' + event.id + '|' + encodeURIComponent(event.title);
                    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrData);
                    var filename = 'QR-' + event.title.replace(/\s+/g, '-') + '.png';
                    downloadQR(qrUrl, filename);
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
                var event = eventId ? self.data.events.find(function(e) { return e.id == eventId; }) : null;
                var eventTitle = event ? event.title : codeName;
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
                
                // Populate modal with QR code and event details
                var modal = document.getElementById('qr-generation-modal');
                var qrImg = document.getElementById('qr-generation-image');
                var eventSpan = document.getElementById('qr-generation-event');
                var codeDiv = document.getElementById('qr-generation-code');
                var dateSpan = document.getElementById('qr-generation-date');
                var downloadBtn = document.getElementById('modal-download-qr-btn');
                
                if (qrImg) qrImg.src = qrUrl;
                if (eventSpan) eventSpan.textContent = eventTitle + (event ? ' (' + event.date + ')' : '');
                if (codeDiv) codeDiv.textContent = code;
                if (dateSpan) dateSpan.textContent = new Date().toLocaleDateString();
                if (downloadBtn) {
                    downloadBtn.dataset.qrUrl = qrUrl;
                    downloadBtn.dataset.filename = 'QR-' + codeName.replace(/\s+/g, '-') + '.png';
                }
                
                // Show modal
                if (modal) modal.style.display = 'flex';
            });
        }
        
        // Helper function to download QR code as PNG using canvas
        function downloadQR(url, filename) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                try {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    var dataUrl = canvas.toDataURL('image/png');
                    var a = document.createElement('a');
                    a.href = dataUrl;
                    a.download = filename || 'qr-code.png';
                    document.body.appendChild(a);
                    setTimeout(function() {
                        a.click();
                        document.body.removeChild(a);
                    }, 100);
                } catch (e) {
                    // Fallback: if canvas is tainted or other error, use direct URL
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = filename || 'qr-code.png';
                    document.body.appendChild(a);
                    setTimeout(function() {
                        a.click();
                        document.body.removeChild(a);
                    }, 100);
                }
            };
            img.onerror = function() {
                // Fallback: if image fails to load, still attempt direct download
                var a = document.createElement('a');
                a.href = url;
                a.download = filename || 'qr-code.png';
                document.body.appendChild(a);
                setTimeout(function() {
                    a.click();
                    document.body.removeChild(a);
                }, 100);
            };
            img.src = url;
        }
        
        // Modal Close and Download handlers for QR Generation Modal
        var closeQrGenModal = document.getElementById('close-qr-generation-modal');
        var closeQrGenBtn = document.getElementById('modal-close-qr-btn');
        var downloadQrGenBtn = document.getElementById('modal-download-qr-btn');
        var qrGenerationModal = document.getElementById('qr-generation-modal');
        
        if (closeQrGenModal) {
            closeQrGenModal.addEventListener('click', function() {
                if (qrGenerationModal) qrGenerationModal.style.display = 'none';
            });
        }
        if (closeQrGenBtn) {
            closeQrGenBtn.addEventListener('click', function() {
                if (qrGenerationModal) qrGenerationModal.style.display = 'none';
            });
        }
        if (downloadQrGenBtn) {
            downloadQrGenBtn.addEventListener('click', function() {
                var qrUrl = this.dataset.qrUrl;
                var filename = this.dataset.filename || 'QR-Code.png';
                if (qrUrl) {
                    downloadQR(qrUrl, filename);
                }
            });
        }
        // Close modal when clicking outside the modal content
        if (qrGenerationModal) {
            qrGenerationModal.addEventListener('click', function(e) {
                if (e.target === qrGenerationModal) {
                    qrGenerationModal.style.display = 'none';
                }
            });
        }
        
        var downloadQrBtn = document.getElementById('download-qr-btn');
        if (downloadQrBtn) {
            downloadQrBtn.addEventListener('click', function() {
                var qrImage = document.getElementById('qr-view-image');
                if (qrImage && qrImage.src) {
                    var filename = 'QR-Code.png';
                    // Try to extract filename from the QR data
                    var qrCodeDisplay = document.getElementById('qr-view-code');
                    if (qrCodeDisplay && qrCodeDisplay.textContent) {
                        filename = 'QR-' + qrCodeDisplay.textContent.replace(/\s+/g, '-') + '.png';
                    }
                    downloadQR(qrImage.src, filename);
                }
            });
        }
        
        // Export Attendance (from QR codes list)
        document.querySelectorAll('[data-action="export-qr-attendance"]').forEach(function(btn) {
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
        document.querySelectorAll('[data-action="view-qr-attendees"]').forEach(function(btn) {
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
        document.querySelectorAll('[data-action="view-qr-code"]').forEach(function(btn) {
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
        
        // Delete QR Code
        document.querySelectorAll('[data-action="delete-qr-code"]').forEach(function(btn) {
            if (btn.classList.contains('listener-attached')) return;
            btn.classList.add('listener-attached');
            btn.addEventListener('click', function() {
                var qrId = parseInt(btn.dataset.id);
                var qr = self.data.qrCodes.find(function(q) { return q.id == qrId; });
                
                if (!qr) return; // Already deleted
                
                if (confirm('Delete QR code "' + qr.name + '"? This cannot be undone.')) {
                    // Disable button to prevent double clicks
                    btn.disabled = true;
                    
                    // Remove from data array
                    self.data.qrCodes = self.data.qrCodes.filter(function(q) { return q.id != qrId; });
                    self.saveData();
                    
                    // Remove row from DOM with animation
                    var row = btn.closest('tr');
                    if (row) {
                        row.style.transition = 'opacity 0.3s, transform 0.3s';
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(-20px)';
                        setTimeout(function() {
                            row.remove();
                            // Re-render the dashboard to refresh the table (handles empty state)
                            self.renderAdminDashboard();
                        }, 300);
                    } else {
                        // Fallback: full re-render
                        self.renderAdminDashboard();
                    }
                }
            });
        });
        
        // View QR Attendees
        document.querySelectorAll('[data-action="view-qr-attendees"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="scan-qr"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="mark-attended"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="do-evaluation"]').forEach(function(btn) {
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
                    if (document.getElementById('scanned-event')) document.getElementById('scanned-event').style.display = 'none';
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
                      // Check library availability first
                      var Html5QrcodeCls = Html5Qrcode || (window && window.Html5Qrcode);
                      if (!Html5QrcodeCls || typeof Html5QrcodeCls !== 'function') {
                          alert('QR scanner is not ready. Please refresh the page and try again.');
                          return;
                      }
                      
                      var scannerContainer = document.getElementById('qr-scanner-container');
                      var qrReader = document.getElementById('qr-reader');
                      
                      if (scannerContainer && qrReader) {
                          scannerContainer.style.display = 'block';
                          scanQrBtn.style.display = 'none';
                          
                          var html5QrCode = new Html5QrcodeCls('qr-reader');
                          var config = { 
                              fps: 10, 
                              qrbox: { width: 250, height: 250 },
                              aspectRatio: 1.0
                          };
                          
                          // Success callback
                          var onScanSuccess = function(decodedText) {
                              html5QrCode.stop().then(function() {
                                  html5QrCode.clear();
                                  
                                          fetch('/api/attendance/mark', {

                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({
                                                  qrData: decodedText,
                                                  studentId: self.currentUser.studentId,
                                                  timestamp: new Date().toISOString()
                                              })
                                          })
                                  .then(function(res) { return res.json(); })
                                  .then(function(data) {
                                      if (data.success) {
                                          alert('Attendance marked successfully! ' + (data.message || ''));
                                      } else {
                                          alert('Error: ' + (data.message || 'Failed to mark attendance'));
                                      }
                                  })
                                  .catch(function(err) {
                                      alert('Error: Could not connect to server. Please try again.');
                                      console.error('API error:', err);
                                  })
                                  .finally(function() {
                                      scannerContainer.style.display = 'none';
                                      scanQrBtn.style.display = 'block';
                                  });
                              }).catch(function(err) {
                                  console.error('Failed to stop scanner:', err);
                              });
                          };
                          
                          // Failure callback (QR not detected - normal)
                          var onScanFailure = function(error) {
                              console.debug('QR scan attempt:', error);
                          };
                          
                          // Start camera (back camera first)
                          var startPromise = html5QrCode.start(
                              { facingMode: 'environment' },
                              config,
                              onScanSuccess,
                              onScanFailure
                          );
                          
                          startPromise.catch(function(err) {
                              // If back camera not available, try front camera
                              if (err.message && err.message.toLowerCase().includes('environment')) {
                                  console.log('Back camera not found, trying front camera...');
                                  return html5QrCode.start(
                                      { facingMode: 'user' },
                                      config,
                                      onScanSuccess,
                                      onScanFailure
                                  );
                              }
                              throw err;
                          }).catch(function(finalErr) {
                              // Final error handler
                              scannerContainer.style.display = 'none';
                              scanQrBtn.style.display = 'block';
                              
                              var errorMsg = 'Camera error: ' + finalErr.message;
                              if (finalErr.name === 'NotAllowedError' || 
                                  finalErr.message.includes('permission') || 
                                  finalErr.message.includes('PermissionDeniedError')) {
                                  errorMsg = 'Camera permission denied. Please allow camera access in browser settings, then refresh the page.';
                              } else if (finalErr.name === 'NotFoundError' || 
                                        finalErr.message.toLowerCase().includes('not found') ||
                                        finalErr.message.toLowerCase().includes('no camera')) {
                                  errorMsg = 'No camera found. Please connect a camera and try again.';
                              } else if (finalErr.message && finalErr.message.toLowerCase().includes('https')) {
                                  errorMsg = 'Camera requires HTTPS or localhost. Check your connection.';
                              } else if (finalErr.message && finalErr.message.toLowerCase().includes('already')) {
                                  errorMsg = 'Camera is already in use by another application.';
                              }
                              
                               alert(errorMsg);
                               console.error('Camera start error:', finalErr);
                           });
                       }
                   });
                  }
                  var cancelScanBtn = document.getElementById('cancel-scan-btn');
                  if (cancelScanBtn) {
                      cancelScanBtn.addEventListener('click', function() {
                          var scannerContainer = document.getElementById('qr-scanner-container');
                          
                          // Try to stop the scanner if it's running
                          try {
                              var Html5QrcodeCls = Html5Qrcode || (window && window.Html5Qrcode);
                              if (Html5QrcodeCls && typeof Html5QrcodeCls === 'function') {
                                  var html5QrCode = new Html5QrcodeCls('qr-reader');
                                  html5QrCode.stop().then(function() {
                                      html5QrCode.clear();
                                  }).catch(function(err) {
                                      console.log('Scanner stop ignored (may not be running):', err.message);
                                  });
                              }
                          } catch(e) {}
                          
                          if (scannerContainer) scannerContainer.style.display = 'none';
                          if (scanQrBtn) scanQrBtn.style.display = 'block';
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
            document.querySelectorAll('[data-action="like-announcement"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="toggle-comments"]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var section = document.getElementById('comments-' + btn.dataset.id);
                    if (section) {
                        section.style.display = section.style.display === 'none' ? 'block' : 'none';
                    }
                });
            });

            // Toggle Pending Details Row
            document.querySelectorAll('.toggle-pending-details').forEach(function(btn) {
                if (btn.classList.contains('listener-attached')) return;
                btn.classList.add('listener-attached');
                btn.addEventListener('click', function() {
                    var userId = btn.dataset.id;
                    var row = document.getElementById('details-' + userId);
                    if (row) {
                        row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
                    }
                });
            });

            // Submit Comments
            document.querySelectorAll('.comment-form').forEach(function(form) {
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
            document.querySelectorAll('[data-action="vote-poll"]').forEach(function(btn) {
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
                            // session in memory only
                            self.saveData();
                            self.renderStudentDashboard();
                        }
                    }
                });
            });

            // Upvote Suggestions
            document.querySelectorAll('[data-action="upvote-suggestion"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="submit-suggestion"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="submit-complaint"]').forEach(function(btn) {
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
            document.querySelectorAll('[data-action="download-file"]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var file = self.data.files.find(function(f) { return f.id == btn.dataset.id; });
                    if (file) {
                        alert('Downloading: ' + file.name + '\nSize: ' + file.size);
                    }
                });
            });
        } catch(e) {}

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
                
                // Clear day options
                var daySelect = document.getElementById('event-day');
                if (daySelect) {
                    daySelect.innerHTML = '<option value="">Day</option>';
                }
                
                eventModal.style.display = 'flex';
            });
        }

        // Event Date - Year/Month/Day dropdown population
        var eventYear = document.getElementById('event-year');
        var eventMonth = document.getElementById('event-month');
        var eventDay = document.getElementById('event-day');
        
        if (eventYear) {
            eventYear.addEventListener('change', function() {
                updateEventDays();
            });
        }
        if (eventMonth) {
            eventMonth.addEventListener('change', function() {
                updateEventDays();
            });
        }
        
        function updateEventDays() {
            var year = document.getElementById('event-year') ? document.getElementById('event-year').value : '';
            var month = document.getElementById('event-month') ? document.getElementById('event-month').value : '';
            var daySelect = document.getElementById('event-day');
            
            if (!daySelect) return;
            
            daySelect.innerHTML = '<option value="">Day</option>';
            
            if (year && month) {
                var daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
                for (var d = 1; d <= daysInMonth; d++) {
                    var option = document.createElement('option');
                    option.value = d;
                    option.textContent = d;
                    daySelect.appendChild(option);
                }
            }
        }
        
        // Calendar Navigation
        document.querySelectorAll('[data-calendar="prev"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.currentDate.setMonth(self.currentDate.getMonth() - 1);
                if (role === 'admin') self.renderAdminDashboard();
                else self.renderStudentDashboard();
            });
        });

        document.querySelectorAll('[data-calendar="next"]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.currentDate.setMonth(self.currentDate.getMonth() + 1);
                if (role === 'admin') self.renderAdminDashboard();
                else self.renderStudentDashboard();
            });
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
                var year = document.getElementById('event-year').value;
                var month = document.getElementById('event-month').value;
                var day = document.getElementById('event-day').value;
                var time = document.getElementById('event-time').value;
                var location = document.getElementById('event-location').value;
                
                if (!title || !batch || !year || !month || !day || !time || !location) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                var date = year + '-' + month + '-' + (day.length === 1 ? '0' + day : day);
                
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
                
                if (self.registerData && self.registerData.eventMediaGallery) {
                    newEvent.mediaGallery = self.registerData.eventMediaGallery;
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
                    self.registerData.eventMediaGallery = null;
                }
                delete document.getElementById('event-form').dataset.editId;
                self.renderAdminDashboard();
            });
        }

        // Close Event Modal
        if (closeEventModal && eventModal) {
            closeEventModal.addEventListener('click', function() {
                eventModal.style.display = 'none';
            });
        }

        // Event Media Upload - Multiple files
        var eventMediaInput = document.getElementById('event-media-input');
        var eventMediaWrapper = document.getElementById('event-media-upload');
        if (eventMediaWrapper && eventMediaInput) {
            eventMediaWrapper.addEventListener('click', function() {
                eventMediaInput.click();
            });
        }
        if (eventMediaInput) {
            eventMediaInput.addEventListener('change', function() {
                var files = this.files;
                if (files && files.length > 0) {
                    self.registerData = self.registerData || {};
                    self.registerData.eventMediaGallery = self.registerData.eventMediaGallery || [];
                    
                    var preview = document.getElementById('event-media-preview');
                    if (preview) {
                        preview.innerHTML = '';
                    }
                    
                    for (var i = 0; i < files.length; i++) {
                        (function(file) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                var mediaData = {
                                    data: e.target.result,
                                    type: file.type.startsWith('video/') ? 'video' : 'image',
                                    name: file.name
                                };
                                self.registerData.eventMediaGallery.push(mediaData);
                                
                                // Show preview with remove button
                                var preview = document.getElementById('event-media-preview');
                                if (preview) {
                                    var idx = self.registerData.eventMediaGallery.length - 1;
                                    var div = document.createElement('div');
                                    div.style.position = 'relative';
                                    div.style.display = 'inline-block';
                                    div.style.margin = '4px';
                                    
                                    if (mediaData.type === 'image') {
                                        div.innerHTML = '<img src="' + mediaData.data + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">' +
                                            '<button type="button" onclick="App.removeEventMedia(' + idx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                                    } else {
                                        div.innerHTML = '<div style="width:80px;height:80px;background:#333;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-video"></i></div>' +
                                            '<button type="button" onclick="App.removeEventMedia(' + idx + ', this)" style="position:absolute;top:-8px;right:-8px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;">&times;</button>';
                                    }
                                    preview.appendChild(div);
                                }
                            };
                            reader.readAsDataURL(file);
                        })(files[i]);
                    }
                }
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
        document.querySelectorAll('[data-action="delete-media"]').forEach(function(btn) {
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
        var studentBlock = document.getElementById('student-block');
        var studentSection = document.getElementById('student-section');
        var studentBatch = document.getElementById('student-batch');
        
        if (studentSearch) {
            studentSearch.value = self.currentFilter.studentSearch || '';
            if (!studentSearch.listenerAttached) {
                studentSearch.listenerAttached = true;
                studentSearch.addEventListener('input', function() {
                    var query = this.value;
                    if (self._studentSearchTimeout) clearTimeout(self._studentSearchTimeout);
                    self._studentSearchTimeout = setTimeout(function() {
                        self.currentFilter.studentSearch = query;
                        self.renderAdminDashboard();
                    }, 400);
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
        if (studentBlock) {
            studentBlock.value = self.currentFilter.studentBlock || '';
            if (!studentBlock.listenerAttached) {
                studentBlock.listenerAttached = true;
                studentBlock.addEventListener('change', function() {
                    self.currentFilter.studentBlock = this.value;
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
        
        var studentStatusFilter = document.getElementById('student-status-filter');
        if (studentStatusFilter) {
            studentStatusFilter.value = self.currentFilter.studentStatus || 'active';
            if (!studentStatusFilter.listenerAttached) {
                studentStatusFilter.listenerAttached = true;
                studentStatusFilter.addEventListener('change', function() {
                    self.currentFilter.studentStatus = this.value;
                    self.renderAdminDashboard();
                });
            }
        }

        // Organization Search
        var orgSearchInput = document.getElementById('org-search-input');
        if (orgSearchInput) {
            orgSearchInput.value = self.currentFilter.orgSearch || '';
            if (!orgSearchInput.listenerAttached) {
                orgSearchInput.listenerAttached = true;
                var orgSearchTimeout;
                orgSearchInput.addEventListener('input', function() {
                    clearTimeout(orgSearchTimeout);
                    var query = this.value;
                    orgSearchTimeout = setTimeout(function() {
                        self.currentFilter.orgSearch = query;
                        self.renderAdminDashboard();
                    }, 400);
                });
            }
        }

        // Pending Account Request Search and Filters
        var pendingSearch = document.getElementById('pending-search');
        var pendingCourse = document.getElementById('pending-course');
        var pendingBlock = document.getElementById('pending-block');
        var pendingBatch = document.getElementById('pending-batch');
        
        if (pendingSearch) {
            pendingSearch.value = self.currentFilter.pendingSearch || '';
            if (!pendingSearch.listenerAttached) {
                pendingSearch.listenerAttached = true;
                pendingSearch.addEventListener('input', function() {
                    self.currentFilter.pendingSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingCourse) {
            pendingCourse.value = self.currentFilter.pendingCourse || '';
            if (!pendingCourse.listenerAttached) {
                pendingCourse.listenerAttached = true;
                pendingCourse.addEventListener('change', function() {
                    self.currentFilter.pendingCourse = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingBlock) {
            pendingBlock.value = self.currentFilter.pendingBlock || '';
            if (!pendingBlock.listenerAttached) {
                pendingBlock.listenerAttached = true;
                pendingBlock.addEventListener('change', function() {
                    self.currentFilter.pendingBlock = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingBatch) {
            pendingBatch.value = self.currentFilter.pendingBatch || '';
            if (!pendingBatch.listenerAttached) {
                pendingBatch.listenerAttached = true;
                pendingBatch.addEventListener('change', function() {
                    self.currentFilter.pendingBatch = this.value;
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
        
        var confirmEndSemesterBtn = document.getElementById('confirm-end-semester');
        if (confirmEndSemesterBtn) {
            confirmEndSemesterBtn.addEventListener('click', function() {
                var newBatch = document.getElementById('new-batch-year').value;
                var students = self.data.users.filter(function(u) { return u.role === 'student' && u.active === true; });
                var count = 0;
                students.forEach(function(s) {
                    s.active = false;
                    s.status = 'inactive';
                    s.batch = newBatch;
                    count++;
                });
                self.saveData();
                endSemesterModal.style.display = 'none';
                self.renderAdminDashboard();
                alert(count + ' students have been deactivated for the new semester!');
            });
        }

        // Pending Account Request Search and Filters
        var pendingSearch = document.getElementById('pending-search');
        var pendingCourse = document.getElementById('pending-course');
        var pendingBlock = document.getElementById('pending-block');
        var pendingBatch = document.getElementById('pending-batch');
        
        if (pendingSearch) {
            pendingSearch.value = self.currentFilter.pendingSearch || '';
            if (!pendingSearch.listenerAttached) {
                pendingSearch.listenerAttached = true;
                pendingSearch.addEventListener('input', function() {
                    self.currentFilter.pendingSearch = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingCourse) {
            pendingCourse.value = self.currentFilter.pendingCourse || '';
            if (!pendingCourse.listenerAttached) {
                pendingCourse.listenerAttached = true;
                pendingCourse.addEventListener('change', function() {
                    self.currentFilter.pendingCourse = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingBlock) {
            pendingBlock.value = self.currentFilter.pendingBlock || '';
            if (!pendingBlock.listenerAttached) {
                pendingBlock.listenerAttached = true;
                pendingBlock.addEventListener('change', function() {
                    self.currentFilter.pendingBlock = this.value;
                    self.renderAdminDashboard();
                });
            }
        }
        if (pendingBatch) {
            pendingBatch.value = self.currentFilter.pendingBatch || '';
            if (!pendingBatch.listenerAttached) {
                pendingBatch.listenerAttached = true;
                pendingBatch.addEventListener('change', function() {
                    self.currentFilter.pendingBatch = this.value;
                    self.renderAdminDashboard();
                });
            }
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
        document.querySelectorAll('[data-action="delete-report"]').forEach(function(btn) {
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
        document.querySelectorAll('[data-action="download-report"]').forEach(function(btn) {
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

        // Add Admin Modal
        var addAdminBtn = document.getElementById('add-new-admin-btn');
        var addAdminModal = document.getElementById('add-admin-modal');
        var closeAddAdminModal = document.getElementById('close-add-admin-modal');
        var addAdminForm = document.getElementById('add-admin-form');

        if (addAdminBtn && addAdminModal) {
            addAdminBtn.addEventListener('click', function() {
                addAdminModal.style.display = 'flex';
            });
        }
        if (closeAddAdminModal && addAdminModal) {
            closeAddAdminModal.addEventListener('click', function() {
                addAdminModal.style.display = 'none';
            });
        }
        if (addAdminForm) {
            addAdminForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var name = document.getElementById('admin-name').value;
                var studentId = document.getElementById('admin-student-id').value;
                var course = document.getElementById('admin-course').value;
                var block = document.getElementById('admin-block').value;
                var section = document.getElementById('admin-section').value;
                var batch = document.getElementById('admin-batch').value;
                var adminRole = document.getElementById('admin-role').value;
                var bMonth = document.getElementById('admin-birthday-month').value;
                var bDay = document.getElementById('admin-birthday-day').value;
                var bYear = document.getElementById('admin-birthday-year').value;
                var birthday = bYear && bMonth && bDay ? bYear + '-' + bMonth + '-' + bDay : '';
                var email = document.getElementById('admin-email').value;
                var password = document.getElementById('admin-password').value;
                var confirmPassword = document.getElementById('admin-confirm-password').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                var emailExists = self.data.users.some(function(u) { return u.email === email; });
                if (emailExists) {
                    alert('Email already registered!');
                    return;
                }

                var newAdmin = {
                    id: Date.now(),
                    name: name,
                    studentId: studentId,
                    course: course,
                    block: block,
                    section: section,
                    batch: batch,
                    adminRole: adminRole,
                    birthday: birthday,
                    email: email,
                    password: password,
                    role: 'admin',
                    active: true,
                    createdAt: new Date().toISOString().split('T')[0],
                    profilePic: self.tempAdminPic || null
                };
                self.tempAdminPic = null;
                self.data.users.push(newAdmin);
                self.saveData();
                addAdminModal.style.display = 'none';
                addAdminForm.reset();
                self.renderAdminDashboard();
                alert('Administrator added successfully!');
            });
        }

        var adminPicInput = document.getElementById('admin-pic-input');
        var adminPicUpload = document.getElementById('admin-pic-upload');
        var adminPicPreview = document.getElementById('admin-pic-preview');
        if (adminPicInput && adminPicUpload) {
            adminPicUpload.style.cursor = 'pointer';
            adminPicUpload.addEventListener('click', function(e) {
                e.preventDefault();
                adminPicInput.click();
            });
            adminPicInput.addEventListener('change', function(e) {
                var file = this.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        self.tempAdminPic = evt.target.result;
                        if (adminPicPreview) {
                            adminPicPreview.innerHTML = '<img src="' + evt.target.result + '" style="max-width:100%;max-height:120px;border-radius:8px;">';
                        }
                        var textEl = adminPicUpload.querySelector('.file-upload-text');
                        if (textEl) {
                            textEl.innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i> ' + file.name;
                        }
                        adminPicUpload.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Admin Role - dynamic ID field
        var adminRoleSelect = document.getElementById('admin-role');
        var adminIdLabel = document.getElementById('admin-id-label');
        var adminIdInput = document.getElementById('admin-student-id');
        var adminPositionGroup = document.getElementById('admin-position-group');
        if (adminRoleSelect) {
            adminRoleSelect.addEventListener('change', function() {
                var role = this.value;
                if (role === 'Adviser' || role === 'Student Affair Officer' || role === 'Principal' || role === 'Administrator') {
                    if (adminIdLabel) adminIdLabel.textContent = 'Employee ID';
                    if (adminIdInput) adminIdInput.placeholder = 'Enter employee ID';
                    if (adminPositionGroup) adminPositionGroup.style.display = 'block';
                } else {
                    if (adminIdLabel) adminIdLabel.textContent = 'Student ID';
                    if (adminIdInput) adminIdInput.placeholder = 'Enter student ID';
                    if (adminPositionGroup) adminPositionGroup.style.display = 'none';
                }
            });
        }

        // Admin Birthday Day Population
        var adminBMonth = document.getElementById('admin-birthday-month');
        var adminBDay = document.getElementById('admin-birthday-day');
        var adminBYear = document.getElementById('admin-birthday-year');
        function updateAdminDays() {
            var year = adminBYear ? adminBYear.value : '';
            var month = adminBMonth ? adminBMonth.value : '';
            if (adminBDay) {
                adminBDay.innerHTML = '<option value="">Day</option>';
                if (year && month) {
                    var daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
                    for (var d = 1; d <= daysInMonth; d++) {
                        var option = document.createElement('option');
                        option.value = d;
                        option.textContent = d;
                        adminBDay.appendChild(option);
                    }
                }
            }
        }
        if (adminBMonth) adminBMonth.addEventListener('change', updateAdminDays);
        if (adminBYear) adminBYear.addEventListener('change', updateAdminDays);

        // Organization Term Filter
        var orgTermSelect = document.getElementById('org-term-select');
        if (orgTermSelect) {
            orgTermSelect.value = self.currentFilter.orgTerm || '2025-2026';
            orgTermSelect.addEventListener('change', function() {
                self.currentFilter.orgTerm = this.value;
                self.renderAdminDashboard();
            });
        }
        
        // Organization Filter
        var orgFilterSelect = document.getElementById('org-filter-select');
        if (orgFilterSelect) {
            orgFilterSelect.value = self.currentFilter.selectedOrg || '';
            orgFilterSelect.addEventListener('change', function() {
                self.currentFilter.selectedOrg = this.value;
                self.renderAdminDashboard();
            });
        }
        
        // Org Search Input
        var orgSearchInput = document.getElementById('org-search-input');
        if (orgSearchInput) {
            orgSearchInput.value = self.currentFilter.orgSearch || '';
            orgSearchInput.addEventListener('input', function() {
                self.currentFilter.orgSearch = this.value;
            });
        }

        // Add Organization Member Modal
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
        
        // Auto-link committee and role type based on position
        var orgPositionSelect = document.getElementById('org-position');
        var orgCommitteeSelect = document.getElementById('org-committee');
        var orgRoleTypeSelect = document.getElementById('org-role-type');
        if (orgPositionSelect && orgCommitteeSelect) {
            orgPositionSelect.addEventListener('change', function() {
                var position = this.value;
                var mappings = self.data.positionMappings || {};
                
                // Auto-select committee (except for Junior Councilor)
                if (position !== 'Junior Councilor' && mappings[position]) {
                    var mapping = mappings[position];
                    if (mapping.committee) {
                        var options = orgCommitteeSelect.options;
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].value === mapping.committee) {
                                orgCommitteeSelect.selectedIndex = i;
                                break;
                            }
                        }
                    }
                }
                
                // Auto-set role type: Head for all except Junior Councilor and Representatives
                if (orgRoleTypeSelect) {
                    if (position === 'Junior Councilor' || position.indexOf('Representative') !== -1) {
                        orgRoleTypeSelect.value = 'Member';
                    } else {
                        orgRoleTypeSelect.value = 'Head';
                    }
                }
            });
        }
        
        if (addOrgForm) {
            addOrgForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var studentId = parseInt(document.getElementById('org-student-id').value);
                var orgName = document.getElementById('org-name').value;
                var position = document.getElementById('org-position').value;
                var committee = document.getElementById('org-committee').value;
                var roleType = document.getElementById('org-role-type').value;
                var status = document.getElementById('org-status').value;
                var term = document.getElementById('org-term').value;
                
                if (!studentId) {
                    alert('Please search and select a student');
                    return;
                }
                if (!orgName) {
                    alert('Please select an organization');
                    return;
                }
                if (!position) {
                    alert('Please select a position');
                    return;
                }
                if (!roleType) {
                    alert('Please select role type (Head or Member)');
                    return;
                }

                var student = self.data.users.find(function(u) { return u.id === studentId; });
                if (student) {
                    // Committee head limits based on committee type
                    var committeeHeadLimits = {
                        'Executive': 2,      // President, Vice President
                        'Finance': 3,       // Treasurer, Auditor, Business Manager
                        'Public Relations': 1 // PIO only (Representatives are members)
                    };
                    
                    // Check for existing heads in same organization and committee
                    if (roleType === 'Head') {
                        var headLimit = committeeHeadLimits[committee] || 1;
                        var existingHeads = (self.data.users || []).filter(function(u) {
                            return u.organization && 
                                   u.organization.name === orgName &&
                                   u.organization.committee === committee &&
                                   u.organization.roleType === 'Head' &&
                                   (u.organization.term === term || u.batch === term) &&
                                   u.id !== studentId;
                        });
                        if (existingHeads.length >= headLimit) {
                            var limitMsg = committee === 'Executive' ? 'Only President and Vice President allowed' :
                                          committee === 'Finance' ? 'Only Treasurer, Auditor, and Business Manager allowed' :
                                          committee === 'Public Relations' ? 'Only PIO can be head (Representatives are members)' :
                                          'Only one head per committee allowed';
                            alert(limitMsg + ' in ' + orgName + '.');
                            return;
                        }
                    }
                    
                    // For Public Relations - Representatives must be Members
                    if (committee === 'Public Relations' && position.indexOf('Representative') !== -1 && roleType === 'Head') {
                        alert('Representatives in Public Relations should be Members, not Heads.');
                        return;
                    }
                    
                    // Junior Councilor cannot be a Head
                    if (position === 'Junior Councilor' && roleType === 'Head') {
                        alert('Junior Councilor must be a Member, not a Head.');
                        return;
                    }
                    
                    // Check for duplicate positions (isHead positions only)
                    var positionMappings = self.data.positionMappings || {};
                    var currentPositionMapping = positionMappings[position];
                    if (currentPositionMapping && currentPositionMapping.isHead) {
                        var existingPos = (self.data.users || []).filter(function(u) {
                            return u.organization && 
                                   u.organization.name === orgName &&
                                   u.organization.position === position &&
                                   (u.organization.term === term || u.batch === term) &&
                                   u.id !== studentId;
                        });
                        if (existingPos.length > 0) {
                            alert('The position "' + position + '" is already taken in ' + orgName + '. Each position can only be held by one person.');
                            return;
                        }
                    }
                    
                    if (!student.organization) student.organization = {};
                    student.organization.name = orgName;
                    student.organization.position = position;
                    student.organization.committee = committee || 'Other';
                    student.organization.roleType = roleType;
                    student.organization.status = status;
                    student.organization.term = term;
                    student.batch = term;
                    self.saveData();
                    addOrgModal.style.display = 'none';
                    addOrgForm.reset();
                    self.renderAdminDashboard();
                    alert('Member added to ' + orgName + ' as ' + roleType + '!');
                }
            });
        }

        // Organization Member Search
        var orgStudentSearch = document.getElementById('org-student-search');
        var orgSearchResults = document.getElementById('org-search-results');
        var orgStudentIdInput = document.getElementById('org-student-id');
        var selectedStudentInfo = document.getElementById('selected-student-info');
        var selectedStudentName = document.getElementById('selected-student-name');
        
        if (orgStudentSearch && orgSearchResults) {
            orgStudentSearch.addEventListener('input', function() {
                clearTimeout(orgSearchTimeout);
                var searchVal = this.value;
                var self2 = self;
                orgSearchTimeout = setTimeout(function() {
                    var query = searchVal.toLowerCase();
                    var students = (self2.data.users || []).filter(function(u) { 
                        return u.role === 'student';
                    });
                
                    if (query.length < 2) {
                        orgSearchResults.style.display = 'none';
                        return;
                    }
                    
                    var matches = students.filter(function(s) {
                        return (s.name && s.name.toLowerCase().includes(query)) ||
                               (s.studentId && s.studentId.toLowerCase().includes(query));
                    });
                    
                    if (matches.length === 0) {
                        orgSearchResults.innerHTML = '<div style="padding:12px;color:var(--text-light);">No students found</div>';
                    } else {
                        orgSearchResults.innerHTML = '';
                        matches.slice(0, 10).forEach(function(s) {
                            var div = document.createElement('div');
                            var statusTag = s.active ? '<span style="color:green;font-size:11px;">(Active)</span>' : '<span style="color:gray;font-size:11px;">(Inactive)</span>';
                            div.style.padding = '10px';
                            div.style.cursor = 'pointer';
                            div.style.borderBottom = '1px solid var(--border-color)';
                            div.style.background = 'var(--bg-white)';
                            div.innerHTML = '<strong>' + (s.name || 'Unknown') + '</strong> ' + statusTag + '<br><small>' + (s.studentId || '') + ' - ' + (s.course || '') + '</small>';
                            div.addEventListener('click', function() {
                                orgStudentIdInput.value = s.id;
                                orgStudentSearch.value = s.name;
                                selectedStudentName.textContent = s.name + ' (' + s.studentId + ')';
                                selectedStudentInfo.style.display = 'block';
                                orgSearchResults.style.display = 'none';
                            });
                            orgSearchResults.appendChild(div);
                        });
                    }
                    orgSearchResults.style.display = 'block';
                }, 300);
            });
            
            document.addEventListener('click', function(e) {
                if (!e.target.closest('#org-student-search') && !e.target.closest('#org-search-results')) {
                    orgSearchResults.style.display = 'none';
                }
            });
        }

        // Export Organization
        var exportOrgBtn = document.getElementById('export-org-btn');
        if (exportOrgBtn) {
            exportOrgBtn.addEventListener('click', function() {
                var students = (self.data.users || []).filter(function(u) { return u.role === 'student' && u.organization && u.organization.position; });
                if (students.length === 0) {
                    alert('No organization members to export');
                    return;
                }
                var csv = 'Name,Student ID,Course,Block,Section,Batch,Position,Committee\n';
                students.forEach(function(s) {
                    csv += '"' + (s.name || '') + '","' + (s.studentId || '') + '","' + (s.course || '') + '","' + (s.block || '') + '","' + (s.section || '') + '","' + (s.batch || '') + '","' + (s.organization.position || '') + '","' + (s.organization.committee || '') + '"\n';
                });
                var blob = new Blob([csv], { type: 'text/csv' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'organization_export.csv';
                link.click();
            });
        }

        // Manage Organization Members
        var manageMembersBtn = document.getElementById('manage-org-members-btn');
        if (manageMembersBtn) {
            manageMembersBtn.addEventListener('click', function() {
                var selectedOrg = self.currentFilter.selectedOrg || '';
                if (!selectedOrg) {
                    alert('Please select an organization first');
                    return;
                }
                var orgStudents = (self.data.users || []).filter(function(u) { 
                    return u.role === 'student' && u.organization && u.organization.name === selectedOrg; 
                });
                
                var html = '<div id="manage-members-modal" class="modal" style="display:flex;">' +
                    '<div class="modal-content" style="max-width:700px;max-height:80vh;">' +
                    '<div class="modal-header"><h3>Manage Members - ' + selectedOrg + '</h3><button class="modal-close" id="close-manage-modal">&times;</button></div>' +
                    '<div class="modal-body" style="max-height:60vh;overflow-y:auto;">';
                
                if (orgStudents.length === 0) {
                    html += '<div class="empty-state"><p class="empty-text">No members in this organization</p></div>';
                } else {
                    html += '<table class="table"><thead><tr><th>Name</th><th>Position</th><th>Committee</th><th>Role</th><th>Actions</th></tr></thead><tbody>';
                    orgStudents.forEach(function(s) {
                        var profilePicHtml = s.profilePic ? 
                            '<img src="' + s.profilePic + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">' :
                            '<div style="width:28px;height:28px;border-radius:50%;background:var(--primary-color);color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;">' + (s.name ? s.name.charAt(0).toUpperCase() : '?') + '</div>';
                        
                        html += '<tr>' +
                            '<td><div style="display:flex;align-items:center;gap:8px;">' + profilePicHtml + '<span>' + (s.name || 'N/A') + '</span></div></td>' +
                            '<td>' + (s.organization && s.organization.position ? s.organization.position : '-') + '</td>' +
                            '<td>' + (s.organization && s.organization.committee ? s.organization.committee : '-') + '</td>' +
                            '<td>' + (s.organization && s.organization.roleType === 'Head' ? '<span style="background:#4caf50;color:white;padding:2px 6px;border-radius:4px;font-size:10px;">HEAD</span>' : 'Member') + '</td>' +
                            '<td><button class="btn btn-sm btn-secondary edit-org-member-btn" data-id="' + s.id + '"><i class="fas fa-edit"></i></button> <button class="btn btn-sm btn-danger delete-org-member-btn" data-id="' + s.id + '"><i class="fas fa-trash"></i></button></td>' +
                            '</tr>';
                    });
                    html += '</tbody></table>';
                }
                
                html += '</div></div></div>';
                
                document.getElementById('app').insertAdjacentHTML('beforeend', html);
                
                var closeModal = document.getElementById('close-manage-modal');
                var manageModal = document.getElementById('manage-members-modal');
                if (closeModal) {
                    closeModal.addEventListener('click', function() {
                        manageModal.remove();
                    });
                }
                
                document.querySelectorAll('.edit-org-member-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var userId = parseInt(this.getAttribute('data-id'));
                        var student = self.data.users.find(function(u) { return u.id === userId; });
                        if (student) {
                            document.getElementById('manage-members-modal').remove();
                            self.showEditOrgMemberModal(student, selectedOrg);
                        }
                    });
                });
                
                document.querySelectorAll('.delete-org-member-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var userId = parseInt(this.getAttribute('data-id'));
                        if (confirm('Are you sure you want to remove this member from the organization?')) {
                            var student = self.data.users.find(function(u) { return u.id === userId; });
                            if (student && student.organization) {
                                student.organization = null;
                                self.saveData();
                                document.getElementById('manage-members-modal').remove();
                                self.renderAdminDashboard();
                                alert('Member removed successfully');
                            }
                        }
                    });
                });
            });
        }
    },

    showEditOrgMemberModal: function(student, organization) {
        var self = this;
        var app = document.getElementById('app');
        if (!app) return;
        
        var currentOrg = student.organization || {};
        var currentPosition = currentOrg.position || '';
        var currentCommittee = currentOrg.committee || '';
        
        var orgCommittees = [];
        var selectedOrgData = this.data.organizations.find(function(o) { return o.name === organization; });
        if (selectedOrgData) {
            orgCommittees = selectedOrgData.committees;
        }
        
        var html = '<div id="edit-org-member-modal" class="modal" style="display:flex;">' +
            '<div class="modal-content" style="max-width:450px;">' +
                '<div class="modal-header">' +
                    '<h3>Edit Organization Member</h3>' +
                    '<button class="close-modal" id="close-edit-modal">&times;</button>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:12px;background:var(--bg-color);border-radius:8px;">' +
                        '<div style="width:48px;height:48px;border-radius:50%;background:var(--primary-color);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">' +
                            (student.name ? student.name.charAt(0).toUpperCase() : 'U') +
                        '</div>' +
                        '<div><div style="font-weight:600;">' + (student.name || 'Unknown') + '</div>' +
                        '<div style="font-size:13px;color:var(--text-light);">' + (student.email || '') + '</div></div>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Organization</label>' +
                        '<input type="text" class="form-input" value="' + organization + '" readonly style="background:var(--bg-color);">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Committee</label>' +
                        '<select class="form-input" id="edit-member-committee">' +
                            '<option value="">Select Committee</option>';
        
        orgCommittees.forEach(function(comm) {
            html += '<option value="' + comm + '"' + (comm === currentCommittee ? ' selected' : '') + '>' + comm + '</option>';
        });
        
        html += '</select></div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Position</label>' +
                        '<select class="form-input" id="edit-member-position">' +
                            '<option value="">Select Position</option>';
        
        var positions = ['President', 'Vice President', 'Secretary', 'Treasurer', 'Auditor', 'Business Manager', 'Peace Officer', 'Public Information Officer', 'PIO', 'Representative'];
        
        positions.forEach(function(pos) {
            html += '<option value="' + pos + '"' + (pos === currentPosition ? ' selected' : '') + '>' + pos + '</option>';
        });
        
        html += '</select></div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Status</label>' +
                        '<select class="form-input" id="edit-member-status">' +
                            '<option value="active"' + (currentOrg.status === 'active' ? ' selected' : '') + '>Active</option>' +
                            '<option value="inactive"' + (currentOrg.status === 'inactive' ? ' selected' : '') + '>Inactive</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button class="btn btn-secondary" id="cancel-edit-member">Cancel</button>' +
                    '<button class="btn btn-primary" id="save-edit-member">Save Changes</button>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        app.insertAdjacentHTML('beforeend', html);
        
        var closeBtn = document.getElementById('close-edit-modal');
        var cancelBtn = document.getElementById('cancel-edit-member');
        var saveBtn = document.getElementById('save-edit-member');
        
        function closeModal() {
            var modal = document.getElementById('edit-org-member-modal');
            if (modal) modal.remove();
        }
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                var newCommittee = document.getElementById('edit-member-committee').value;
                var newPosition = document.getElementById('edit-member-position').value;
                var newStatus = document.getElementById('edit-member-status').value;
                
                if (!newCommittee) {
                    alert('Please select a committee');
                    return;
                }
                if (!newPosition) {
                    alert('Please select a position');
                    return;
                }
                
                if (!student.organization) {
                    student.organization = {};
                }
                
                // Check position limits before saving
                if (organization && newPosition) {
                    var checkResult = self.checkPositionLimit(organization, newPosition, student.id);
                    if (!checkResult.valid) {
                        alert('Cannot assign position: ' + checkResult.message);
                        return;
                    }
                }
                
                student.organization.organization = organization;
                student.organization.committee = newCommittee;
                student.organization.position = newPosition;
                student.organization.status = newStatus;
                student.organization.updatedAt = new Date().toISOString();
                
                self.saveData();
                closeModal();
                
                var manageBtn = document.querySelector('.manage-org-btn[data-org="' + organization + '"]');
                if (manageBtn) {
                    manageBtn.click();
                } else {
                    self.renderAdminDashboard();
                }
                
                alert('Member updated successfully!');
            });
        }
    }

};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
