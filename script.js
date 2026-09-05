/* ============================================
   NEXUS ADMIN DASHBOARD - JAVASCRIPT
   ============================================ */

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    currentPage: 'dashboard',
    users: [],
    products: [],
    orders: [],
    notifications: [],
    contacts: [],
    messages: {},
    currentContact: null,
    theme: localStorage.getItem('theme') || 'dark',
    sidebarOpen: false,
    editingUserId: null,
    editingProductId: null,
    deleteCallback: null,
    currentPage_: 1,
    currentProductPage_: 1,
    currentOrderPage_: 1,
    itemsPerPage: 10,
    charts: {}
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    loadDataFromStorage();
    initializeEventListeners();
    renderDashboard();
    animateStatNumbers();
    initializeCharts();
    updateNotificationBadge();
});

// ============================================
// DATA INITIALIZATION
// ============================================

function loadDataFromStorage() {
    // Load or initialize users
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        state.users = JSON.parse(storedUsers);
    } else {
        state.users = [
            { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234-567-8900', role: 'Admin', status: 'Active', joined: '2024-01-15' },
            { id: 2, name: 'Michael Chen', email: 'michael@example.com', phone: '+1 234-567-8901', role: 'Editor', status: 'Active', joined: '2024-01-20' },
            { id: 3, name: 'David Wilson', email: 'david@example.com', phone: '+1 234-567-8902', role: 'Viewer', status: 'Active', joined: '2024-02-01' },
            { id: 4, name: 'Emily Brown', email: 'emily@example.com', phone: '+1 234-567-8903', role: 'Editor', status: 'Inactive', joined: '2024-02-10' },
            { id: 5, name: 'James Anderson', email: 'james@example.com', phone: '+1 234-567-8904', role: 'Viewer', status: 'Active', joined: '2024-02-15' }
        ];
        saveToStorage('users', state.users);
    }

// Load or initialize products
const storedProducts = localStorage.getItem('products');

if (storedProducts) {
    state.products = JSON.parse(storedProducts);

    // Update product images to local files
    const localProductImages = {
        1: 'images/wireless-headphones.jpg',
        2: 'images/smart-watch.jpg',
        3: 'images/running-shoes.jpg',
        4: 'images/yoga-mat.jpg',
        5: 'images/javascript-guide.jpg',
        6: 'images/coffee-maker.jpg'
    };

state.products.forEach(product => {
    if (localProductImages[product.id]) {
        product.image = localProductImages[product.id];
    }
});

// Add Clothing product if it doesn't already exist
if (!state.products.some(product => product.id === 7)) {
    state.products.push({
        id: 7,
        name: 'Premium Hoodie',
        category: 'Clothing',
        price: 59.99,
        stock: 25,
        status: 'Active',
        rating: 4.6,
        image: 'images/premium-hoodie.jpg'
    });
}

saveToStorage('products', state.products);

} else {
    state.products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 89.99,
            stock: 45,
            status: 'Active',
            rating: 4.5,
            image: 'images/wireless-headphones.jpg'
        },
        {
            id: 2,
            name: 'Smart Watch',
            category: 'Electronics',
            price: 199.99,
            stock: 12,
            status: 'Active',
            rating: 4.7,
            image: 'images/smart-watch.jpg'
        },
        {
            id: 3,
            name: 'Running Shoes',
            category: 'Sports',
            price: 129.99,
            stock: 28,
            status: 'Active',
            rating: 4.3,
            image: 'images/running-shoes.jpg'
        },
        {
            id: 4,
            name: 'Yoga Mat',
            category: 'Sports',
            price: 39.99,
            stock: 60,
            status: 'Active',
            rating: 4.6,
            image: 'images/yoga-mat.jpg'
        },
        {
            id: 5,
            name: 'JavaScript Guide',
            category: 'Books',
            price: 29.99,
            stock: 5,
            status: 'Active',
            rating: 4.8,
            image: 'images/javascript-guide.jpg'
        },
        {
            id: 6,
            name: 'Coffee Maker',
            category: 'Home',
            price: 149.99,
            stock: 18,
            status: 'Active',
            rating: 4.4,
            image: 'images/coffee-maker.jpg'
        },
       {
    id: 7,
    name: 'Premium Hoodie',
    category: 'Clothing',
    price: 59.99,
    stock: 25,
    status: 'Active',
    rating: 4.6,
    image: 'images/premium-hoodie.jpg'
}, 
    ];

    saveToStorage('products', state.products);
}
    // Load or initialize orders
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
        state.orders = JSON.parse(storedOrders);
    } else {
        state.orders = [
            { id: 'ORD-001', customer: 'Sarah Johnson', product: 'Wireless Headphones', date: '2024-01-15', amount: 89.99, payment: 'Credit Card', status: 'Completed' },
            { id: 'ORD-002', customer: 'Michael Chen', product: 'Smart Watch', date: '2024-01-16', amount: 199.99, payment: 'PayPal', status: 'Completed' },
            { id: 'ORD-003', customer: 'David Wilson', product: 'Running Shoes', date: '2024-01-17', amount: 129.99, payment: 'Credit Card', status: 'Processing' },
            { id: 'ORD-004', customer: 'Emily Brown', product: 'Yoga Mat', date: '2024-01-18', amount: 39.99, payment: 'Debit Card', status: 'Pending' },
            { id: 'ORD-005', customer: 'James Anderson', product: 'JavaScript Guide', date: '2024-01-19', amount: 29.99, payment: 'Credit Card', status: 'Completed' },
            { id: 'ORD-006', customer: 'Sarah Johnson', product: 'Coffee Maker', date: '2024-01-20', amount: 149.99, payment: 'Credit Card', status: 'Completed' }
        ];
        saveToStorage('orders', state.orders);
    }

    // Load or initialize notifications
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
        state.notifications = JSON.parse(storedNotifications);
    } else {
        state.notifications = [
            { id: 1, title: 'New order received', message: 'Order #12345 from Sarah Johnson', type: 'success', timestamp: new Date().toISOString(), read: false },
            { id: 2, title: 'New user registered', message: 'Emily Brown just joined', type: 'info', timestamp: new Date().toISOString(), read: false },
            { id: 3, title: 'Payment completed', message: 'Order #12344 payment confirmed', type: 'success', timestamp: new Date().toISOString(), read: true },
            { id: 4, title: 'Low stock warning', message: 'Product: JavaScript Guide (5 items left)', type: 'warning', timestamp: new Date().toISOString(), read: false }
        ];
        saveToStorage('notifications', state.notifications);
    }

    // Load or initialize contacts
    state.contacts = state.users.filter((u, i) => i < 4).map(u => ({
        id: u.id,
        name: u.name,
        status: 'Online',
        preview: 'Latest message preview...'
    }));

    // Initialize message conversations
    state.contacts.forEach(contact => {
        if (!state.messages[contact.id]) {
            state.messages[contact.id] = [
                { id: 1, sender: 'admin', text: 'Hi, how can I help?', timestamp: new Date() },
                { id: 2, sender: contact.id, text: 'I need assistance with my account', timestamp: new Date() }
            ];
        }
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================

function initializeTheme() {
    applyTheme(state.theme);
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(state.theme);
        localStorage.setItem('theme', state.theme);
    });

    // Update theme radio buttons in settings
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.theme = e.target.value;
            applyTheme(state.theme);
            localStorage.setItem('theme', state.theme);
        });
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update icon
    const themeIcon = document.getElementById('themeToggle');
    if (themeIcon) {
        themeIcon.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Update radio buttons
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.checked = radio.value === theme;
    });

    // Redraw charts if they exist
    Object.values(state.charts).forEach(chart => {
        if (chart && chart.destroy) {
            chart.destroy();
        }
    });
    state.charts = {};
    
    if (state.currentPage === 'dashboard') {
        initializeCharts();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Sidebar
    document.getElementById('hamburger').addEventListener('click', toggleSidebar);
    document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
    document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            navigateTo(page);
            closeSidebar();
        });
    });

    // Header dropdowns
    document.getElementById('notificationBtn').addEventListener('click', toggleNotificationDropdown);
    document.getElementById('profileBtn').addEventListener('click', toggleProfileDropdown);

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-container') && !e.target.closest('.profile-container')) {
            document.getElementById('notificationDropdown').classList.remove('active');
            document.getElementById('profileDropdown').classList.remove('active');
        }
    });

    // Profile dropdown navigation
    document.getElementById('myProfileLink').addEventListener('click', () => navigateTo('settings'));

    const settingsLinks = document.querySelectorAll('[data-page]');
    settingsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('data-page')) {
                navigateTo(link.getAttribute('data-page'));
            }
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('logoutModal');
    });

    document.getElementById('confirmLogoutBtn').addEventListener('click', () => {
        closeModal('logoutModal');
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            alert('Redirecting to login...');
        }, 500);
    });

    // Global Search
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', handleGlobalSearch);
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            document.getElementById('searchResults').classList.remove('active');
        }, 200);
    });

    // Modal handlers
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // Modal click outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Users page
    document.getElementById('addUserBtn').addEventListener('click', () => openAddUserModal());
    document.getElementById('userForm').addEventListener('submit', handleAddUser);
    document.getElementById('userSearch').addEventListener('input', filterAndSortUsers);
    document.getElementById('roleFilter').addEventListener('change', filterAndSortUsers);
    document.getElementById('statusFilter').addEventListener('change', filterAndSortUsers);

    // Products page
    document.getElementById('addProductBtn').addEventListener('click', () => openAddProductModal());
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);
    document.getElementById('productSearch').addEventListener('input', filterProductsGrid);
    document.getElementById('categoryFilter').addEventListener('change', filterProductsGrid);

    // Orders page
    document.getElementById('orderSearch').addEventListener('input', filterOrders);
    document.getElementById('statusFilter').addEventListener('change', filterOrders);

    // Analytics filters
    document.querySelectorAll('.analytics-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', handleAnalyticsFilter);
    });

    // Chart period filters
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', handleChartPeriodChange);
    });

    // Settings
    document.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', handleSettingsSection);
    });

    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('securityForm').addEventListener('submit', handleSecurityUpdate);
    document.getElementById('saveNotifBtn').addEventListener('click', handleNotificationSettings);

    // Reports
    document.querySelectorAll('.report-card button').forEach(btn => {
        btn.addEventListener('click', handleReportExport);
    });

    // Messages
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', selectContact);
    });
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Notification actions
    document.addEventListener('click', (e) => {
        if (e.target.closest('.notification-action')) {
            const action = e.target.closest('.notification-action');
            const item = action.closest('.notification-item');
            // Handle notification actions
        }
    });
}

// ============================================
// NAVIGATION
// ============================================

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.style.display = 'block';
        state.currentPage = page;

        // Update page title
        const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
        document.getElementById('pageTitle').textContent = pageTitle;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Initialize page-specific content
        switch(page) {
            case 'dashboard':
                renderDashboard();
                animateStatNumbers();
                initializeCharts();
                break;
            case 'analytics':
                initializeAnalyticsCharts();
                break;
            case 'users':
                renderUsers();
                break;
            case 'products':
                renderProducts();
                break;
            case 'orders':
                renderOrders();
                break;
            case 'messages':
                renderContacts();
                break;
            case 'notifications':
                renderNotificationsPage();
                break;
            case 'reports':
                renderReports();
                break;
            case 'settings':
                break;
        }
    }
}

// ============================================
// SIDEBAR
// ============================================

function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    document.querySelector('.sidebar').classList.toggle('active');
    document.getElementById('sidebarOverlay').classList.toggle('active');
}

function closeSidebar() {
    state.sidebarOpen = false;
    document.querySelector('.sidebar').classList.remove('active');
    document.getElementById('sidebarOverlay').classList.remove('active');
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
    // This is handled by the page displaying
    updateStatCards();
}

function updateStatCards() {
    const totalRevenue = state.orders.reduce((sum, o) => sum + o.amount, 0);
    const totalUsers = state.users.length;
    const totalOrders = state.orders.length;
    const completedOrders = state.orders.filter(o => o.status === 'Completed').length;
    const conversionRate = (completedOrders / totalOrders * 100).toFixed(2);

    document.querySelector('[data-target="48520"]').setAttribute('data-target', Math.round(totalRevenue));
    document.querySelector('[data-target="12450"]').setAttribute('data-target', totalUsers);
    document.querySelector('[data-target="1284"]').setAttribute('data-target', totalOrders);
    document.querySelector('[data-target="8.64"]').setAttribute('data-target', conversionRate);
}

function animateStatNumbers() {
    const elements = document.querySelectorAll('.stat-value');
    elements.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target'));
        const isPercentage = el.textContent.includes('%');
        const startValue = 0;
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = startValue + (target - startValue) * progress;
            
            if (isPercentage) {
                el.textContent = current.toFixed(2) + '%';
            } else if (el.textContent.includes('$')) {
                el.textContent = '$' + Math.round(current).toLocaleString();
            } else {
                el.textContent = Math.round(current).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    });
}

// ============================================
// CHARTS
// ============================================

function initializeCharts() {
    // Revenue Chart
    initializeRevenueChart('weekly');

    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        state.charts.sales = new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Sales',
                    data: [1200, 1900, 1600, 2200, 2900, 2100, 1800],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: getChartOptions()
        });
    }

    // User Distribution Chart
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        state.charts.user = new Chart(userCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive'],
                datasets: [{
                    data: [22, 3],
                    backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)'],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary'),
                    borderWidth: 2
                }]
            },
            options: getChartOptions()
        });
    }

    // Order Status Chart
    const orderCtx = document.getElementById('orderChart');
    if (orderCtx) {
        state.charts.order = new Chart(orderCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
                datasets: [{
                    data: [3, 1, 1, 0],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary'),
                    borderWidth: 2
                }]
            },
            options: getChartOptions()
        });
    }
}

function initializeRevenueChart(period) {
    const revenueCtx = document.getElementById('revenueChart');
    if (!revenueCtx) return;

    const data = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [2400, 2210, 2290, 2000, 2181, 2500, 2100]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [9000, 8500, 9500, 10000]
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [65000, 59000, 80000, 81000, 56000, 55000, 40000, 77000, 75000, 85000, 90000, 88000]
        }
    };

    if (state.charts.revenue) {
        state.charts.revenue.destroy();
    }

    state.charts.revenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: data[period].labels,
            datasets: [{
                label: 'Revenue',
                data: data[period].data,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                pointBorderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary'),
                pointBorderWidth: 2
            }]
        },
        options: getChartOptions()
    });
}

function initializeAnalyticsCharts() {
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        if (state.charts.trend) state.charts.trend.destroy();
        state.charts.trend = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue Trend',
                    data: [65000, 59000, 80000, 81000, 56000, 55000],
                    borderColor: 'rgba(139, 92, 246, 1)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: getChartOptions()
        });
    }

    const topProductsCtx = document.getElementById('topProductsChart');
    if (topProductsCtx) {
        if (state.charts.topProducts) state.charts.topProducts.destroy();
        state.charts.topProducts = new Chart(topProductsCtx, {
            type: 'bar',
            data: {
                labels: ['Headphones', 'Watch', 'Shoes', 'Mat', 'Book'],
                datasets: [{
                    label: 'Sales',
                    data: [150, 120, 100, 80, 60],
                    backgroundColor: 'rgba(236, 72, 153, 0.8)',
                    borderRadius: 8
                }]
            },
            options: getChartOptions()
        });
    }

    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        if (state.charts.conversion) state.charts.conversion.destroy();
        state.charts.conversion = new Chart(conversionCtx, {
            type: 'bar',
            data: {
                labels: ['Mobile', 'Desktop', 'Tablet'],
                datasets: [{
                    label: 'Conversion Rate %',
                    data: [8.5, 12.3, 6.8],
                    backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(59, 130, 246, 0.8)'],
                    borderRadius: 8
                }]
            },
            options: getChartOptions()
        });
    }

    const deviceCtx = document.getElementById('deviceChart');
    if (deviceCtx) {
        if (state.charts.device) state.charts.device.destroy();
        state.charts.device = new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Mobile', 'Desktop', 'Tablet'],
                datasets: [{
                    data: [45, 35, 20],
                    backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)'],
                    borderWidth: 2
                }]
            },
            options: getChartOptions()
        });
    }
}

function getChartOptions() {
    const isDark = state.theme === 'dark';
    const textColor = isDark ? '#f0f2f5' : '#1f2937';
    const gridColor = isDark ? '#2a3447' : '#e5e7eb';

    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    font: { family: 'Inter, sans-serif', size: 12 }
                }
            }
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: textColor }
            },
            y: {
                grid: { color: gridColor },
                ticks: { color: textColor }
            }
        }
    };
}

function handleChartPeriodChange(e) {
    e.target.closest('.chart-filter').querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    const period = e.target.getAttribute('data-period');
    initializeRevenueChart(period);
}

// ============================================
// USERS MANAGEMENT
// ============================================

function renderUsers(page = 1) {
    state.currentPage_ = page;
    const tbody = document.getElementById('usersTableBody');
    const startIndex = (page - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const users = state.users.slice(startIndex, endIndex);

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff" alt="${user.name}" style="width: 32px; height: 32px; border-radius: 50%;">
                    <strong>${user.name}</strong>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
            <td>${user.joined}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-icon-sm" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-icon-sm" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    renderUsersPagination();
}

function renderUsersPagination() {
    const pagination = document.getElementById('usersPagination');
    const totalPages = Math.ceil(state.users.length / state.itemsPerPage);
    let html = '';

    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="pagination-btn ${i === state.currentPage_ ? 'active' : ''}" onclick="renderUsers(${i})">${i}</button>`;
    }

    pagination.innerHTML = html;
}

function filterAndSortUsers() {
    const search = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    state.users = state.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    renderUsers(1);
}

function openAddUserModal() {
    state.editingUserId = null;
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userForm').querySelector('button[type="submit"]').textContent = 'Add User';
    openModal('userModal');
}

function editUser(userId) {
    const user = state.users.find(u => u.id === userId);
    if (!user) return;

    state.editingUserId = userId;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userFullName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPhone').value = user.phone;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userForm').querySelector('button[type="submit"]').textContent = 'Update User';
    
    openModal('userModal');
}

function deleteUser(userId) {
    state.deleteCallback = () => {
        state.users = state.users.filter(u => u.id !== userId);
        saveToStorage('users', state.users);
        renderUsers(1);
        showToast('User deleted successfully', 'success');
    };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this user?';
    openModal('deleteModal');
}

function handleAddUser(e) {
    e.preventDefault();
    
    const name = document.getElementById('userFullName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;

    // Validation
    if (!name || !email || !role) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }

    if (state.editingUserId) {
        const user = state.users.find(u => u.id === state.editingUserId);
        if (user) {
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.role = role;
            user.status = status;
            showToast('User updated successfully', 'success');
        }
    } else {
        const newUser = {
            id: Math.max(...state.users.map(u => u.id), 0) + 1,
            name,
            email,
            phone,
            role,
            status,
            joined: new Date().toISOString().split('T')[0]
        };
        state.users.push(newUser);
        showToast('User added successfully', 'success');
    }

    saveToStorage('users', state.users);
    loadDataFromStorage();
    closeModal('userModal');
    renderUsers(1);
}

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

function renderProducts(category = '') {
    const grid = document.getElementById('productsGrid');
    let products = state.products;

    if (category) {
        products = products.filter(p => p.category === category);
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250?text=Product'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-details">
                    <div class="product-price">$${product.price}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </div>
                </div>
                <div class="product-stock">Stock: ${product.stock}</div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-tertiary);">No products found</div>';
    }
}

function filterProductsGrid() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filteredProducts = state.products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            !category || product.category === category;

        return matchesSearch && matchesCategory;
    });

    const grid = document.getElementById('productsGrid');

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>

                <div class="product-details">
                    <div class="product-price">$${product.price}</div>
                    <div class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </div>
                </div>

                <div class="product-stock">Stock: ${product.stock}</div>

                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-tertiary);">
                No products found
            </div>
        `;
    }
}

function openAddProductModal() {
    state.editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productForm').querySelector('button[type="submit"]').textContent = 'Add Product';
    openModal('productModal');
}

function editProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productStatus').value = product.status;
    document.getElementById('productForm').querySelector('button[type="submit"]').textContent = 'Update Product';
    
    openModal('productModal');
}

function deleteProduct(productId) {
    state.deleteCallback = () => {
        state.products = state.products.filter(p => p.id !== productId);
        saveToStorage('products', state.products);
        renderProducts();
        showToast('Product deleted successfully', 'success');
    };
    document.getElementById('deleteMessage').textContent = 'Are you sure you want to delete this product?';
    openModal('deleteModal');
}

function handleAddProduct(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const status = document.getElementById('productStatus').value;

    if (!name || !category || !price || stock === '') {
        showToast('Please fill all required fields', 'error');
        return;
    }

    if (state.editingProductId) {
        const product = state.products.find(p => p.id === state.editingProductId);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = price;
            product.stock = stock;
            product.status = status;
            showToast('Product updated successfully', 'success');
        }
    } else {
        const newProduct = {
            id: Math.max(...state.products.map(p => p.id), 0) + 1,
            name,
            category,
            price,
            stock,
            status,
            rating: 4.5,
            image: 'https://via.placeholder.com/250?text=' + name.replace(/\s+/g, '+')
        };
        state.products.push(newProduct);
        showToast('Product added successfully', 'success');
    }

    saveToStorage('products', state.products);
    closeModal('productModal');
    renderProducts();
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    
    tbody.innerHTML = state.orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.date}</td>
            <td>$${order.amount.toFixed(2)}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const search = document.getElementById('orderSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;

    state.orders = state.orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(search) || order.customer.toLowerCase().includes(search);
        const matchesStatus = !status || order.status === status;
        return matchesSearch && matchesStatus;
    });

    renderOrders();
}

function viewOrder(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const content = document.getElementById('orderModalContent');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Order ID</div>
                    <div style="font-size: 1.125rem; font-weight: 600;">${order.id}</div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Customer</div>
                    <div style="font-size: 1.125rem; font-weight: 600;">${order.customer}</div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Date</div>
                    <div style="font-size: 1.125rem; font-weight: 600;">${order.date}</div>
                </div>
            </div>
            <div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Product</div>
                    <div style="font-size: 1.125rem; font-weight: 600;">${order.product}</div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Status</div>
                    <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <div style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.25rem;">Payment</div>
                    <div style="font-size: 1.125rem; font-weight: 600;">${order.payment}</div>
                </div>
            </div>
        </div>
        <div style="border-top: 1px solid var(--border-color); margin: 1.5rem 0; padding-top: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span>Subtotal:</span>
                <span>$${(order.amount * 0.9).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span>Tax (10%):</span>
                <span>$${(order.amount * 0.1).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.125rem;">
                <span>Total:</span>
                <span>$${order.amount.toFixed(2)}</span>
            </div>
        </div>
    `;

    openModal('orderModal');
}

// ============================================
// MESSAGES
// ============================================

function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = state.contacts.map(contact => `
        <div class="contact-item ${state.currentContact === contact.id ? 'active' : ''}" onclick="selectContact(${contact.id})">
            <div class="contact-header">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-time">12:30 PM</div>
            </div>
            <div class="contact-preview">${contact.preview}</div>
        </div>
    `).join('');
}

function selectContact(contactId) {
    state.currentContact = contactId;
    const contact = state.contacts.find(c => c.id === contactId);

    if (contact) {
        document.getElementById('chatContactName').textContent = contact.name;
        document.getElementById('chatContactStatus').textContent = contact.status;
        document.getElementById('messageInputArea').style.display = 'flex';

        renderMessages(contactId);
        renderContacts();
    }
}

function renderMessages(contactId) {
    const messagesArea = document.getElementById('messagesArea');
    const messages = state.messages[contactId] || [];

    messagesArea.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender === 'admin' ? 'sent' : 'received'}">
            <div class="message-content">${msg.text}</div>
        </div>
    `).join('');

    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function sendMessage() {
    if (!state.currentContact) return;

    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text) return;

    if (!state.messages[state.currentContact]) {
        state.messages[state.currentContact] = [];
    }

    state.messages[state.currentContact].push({
        id: Date.now(),
        sender: 'admin',
        text: text,
        timestamp: new Date()
    });

    input.value = '';
    renderMessages(state.currentContact);

    // Simulate response
    setTimeout(() => {
        state.messages[state.currentContact].push({
            id: Date.now(),
            sender: state.currentContact,
            text: 'Thanks for your message!',
            timestamp: new Date()
        });
        renderMessages(state.currentContact);
    }, 500);
}

// ============================================
// NOTIFICATIONS
// ============================================

function updateNotificationBadge() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    dropdown.classList.toggle('active');
    renderNotificationsList();
}

function renderNotificationsList() {
    const list = document.getElementById('notificationList');
    list.innerHTML = state.notifications.map(notif => `
        <div class="notification-item ${!notif.read ? 'unread' : ''}">
            <div class="notification-content">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-time">${getTimeAgo(new Date(notif.timestamp))}</div>
            </div>
            <div class="notification-actions">
                <button class="notification-action" onclick="deleteNotification(${notif.id})" title="Delete">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function renderNotificationsPage() {
    const container = document.getElementById('pageNotifications');
    container.innerHTML = `<div style="display: flex; flex-direction: column; gap: 1rem;">
        ${state.notifications.map(notif => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">${notif.title}</div>
                    <div style="color: var(--text-secondary); font-size: 0.875rem;">${notif.message}</div>
                    <div style="color: var(--text-tertiary); font-size: 0.75rem; margin-top: 0.5rem;">${getTimeAgo(new Date(notif.timestamp))}</div>
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteNotification(${notif.id})">Delete</button>
            </div>
        `).join('')}
    </div>`;
}

function deleteNotification(notifId) {
    state.notifications = state.notifications.filter(n => n.id !== notifId);
    updateNotificationBadge();
    renderNotificationsList();
    renderNotificationsPage();
}

// ============================================
// REPORTS
// ============================================

function renderReports() {
    const salesBody = document.getElementById('salesReportBody');
    const userBody = document.getElementById('userReportBody');

    // Sales Report
    const salesData = [
        { date: '2024-01-15', sales: 12, orders: 15, revenue: '$1,245.50' },
        { date: '2024-01-16', sales: 18, orders: 22, revenue: '$1,890.75' },
        { date: '2024-01-17', sales: 15, orders: 19, revenue: '$1,567.25' },
        { date: '2024-01-18', sales: 20, orders: 26, revenue: '$2,145.00' }
    ];

    salesBody.innerHTML = salesData.map(row => `
        <tr>
            <td>${row.date}</td>
            <td>${row.sales}</td>
            <td>${row.orders}</td>
            <td>${row.revenue}</td>
        </tr>
    `).join('');

    // User Report
    userBody.innerHTML = state.users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.joined}</td>
        </tr>
    `).join('');
}

function handleReportExport(e) {
    const report = e.target.closest('[data-report]').getAttribute('data-report');
    
    if (report === 'sales') {
        exportCSV([
            ['Date', 'Sales', 'Orders', 'Revenue'],
            ['2024-01-15', '12', '15', '$1,245.50'],
            ['2024-01-16', '18', '22', '$1,890.75'],
            ['2024-01-17', '15', '19', '$1,567.25'],
            ['2024-01-18', '20', '26', '$2,145.00']
        ], 'sales-report.csv');
    } else if (report === 'users') {
        const data = [
            ['Name', 'Email', 'Role', 'Joined'],
            ...state.users.map(u => [u.name, u.email, u.role, u.joined])
        ];
        exportCSV(data, 'users-report.csv');
    }

    showToast('Report exported successfully', 'success');
}

function exportCSV(data, filename) {
    const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ============================================
// SETTINGS
// ============================================

function handleSettingsSection(e) {
    const section = e.target.closest('.settings-item').getAttribute('data-section');

    document.querySelectorAll('.settings-item').forEach(item => item.classList.remove('active'));
    e.target.closest('.settings-item').classList.add('active');

    document.querySelectorAll('.settings-section').forEach(sec => sec.style.display = 'none');
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) targetSection.style.display = 'block';
}

function handleProfileUpdate(e) {
    e.preventDefault();
    showToast('Profile updated successfully', 'success');
}

function handleSecurityUpdate(e) {
    e.preventDefault();
    showToast('Password changed successfully', 'success');
}

function handleNotificationSettings() {
    showToast('Notification preferences saved', 'success');
}

function handleAnalyticsFilter(e) {
    document.querySelectorAll('.analytics-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
}

// ============================================
// DROPDOWNS
// ============================================

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}

// ============================================
// SEARCH
// ============================================

function handleGlobalSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const results = document.getElementById('searchResults');

    if (!query) {
        results.classList.remove('active');
        return;
    }

    const foundItems = [
        ...state.users.map(u => ({ type: 'user', name: u.name, desc: u.email })),
        ...state.products.map(p => ({ type: 'product', name: p.name, desc: p.category })),
        ...state.orders.map(o => ({ type: 'order', name: o.id, desc: o.customer }))
    ].filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
    ).slice(0, 8);

    if (foundItems.length === 0) {
        results.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        results.innerHTML = foundItems.map(item => `
            <div class="search-result-item">
                <div class="search-result-title">${item.name}</div>
                <div class="search-result-desc">${item.type} - ${item.desc}</div>
            </div>
        `).join('');
    }

    results.classList.add('active');
}

// ============================================
// MODALS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-warning'
    };

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight var(--transition-base)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// UTILITIES
// ============================================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// Add missing modal close button event listener
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (state.deleteCallback) {
        state.deleteCallback();
        state.deleteCallback = null;
    }
    closeModal('deleteModal');
});

