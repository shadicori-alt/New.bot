// Delegates Management System
let selectedDelegate = null;
let currentGovernorate = 'all';

// Sample data
let delegates = [
    {
        id: 1,
        name: 'أحمد محمد علي',
        governorate: 'القاهرة',
        area: 'مدينة نصر',
        whatsapp: '+201001234567',
        active: true,
        orders: 23,
        notes: 'مندوب موثوق به، يعمل منذ 6 أشهر',
        joinDate: '2024-05-15',
        rating: 4.8,
        totalEarnings: 3450
    },
    {
        id: 2,
        name: 'سارة علي حسن',
        governorate: 'الجيزة',
        area: 'الدقي',
        whatsapp: '+201012345678',
        active: true,
        orders: 18,
        notes: 'ممتازة في التعامل مع العملاء',
        joinDate: '2024-06-20',
        rating: 4.9,
        totalEarnings: 2870
    },
    {
        id: 3,
        name: 'محمود حسن مصطفى',
        governorate: 'الاسكندرية',
        area: 'سيدي بشر',
        whatsapp: '+201023456789',
        active: false,
        orders: 31,
        notes: 'في إجازة حالياً',
        joinDate: '2024-04-10',
        rating: 4.6,
        totalEarnings: 4230
    },
    {
        id: 4,
        name: 'فاطمة أحمد محمود',
        governorate: 'المنوفية',
        area: 'شبين الكوم',
        whatsapp: '+201034567890',
        active: true,
        orders: 15,
        notes: 'مندوبة جديدة، تحتاج تدريب',
        joinDate: '2024-08-01',
        rating: 4.3,
        totalEarnings: 1950
    },
    {
        id: 5,
        name: 'خالد سعيد إبراهيم',
        governorate: 'الشرقية',
        area: 'الزقازيق',
        whatsapp: '+201045678901',
        active: true,
        orders: 27,
        notes: 'سريع في التوصيل',
        joinDate: '2024-03-25',
        rating: 4.7,
        totalEarnings: 3780
    }
];

let orders = [
    {
        id: 'ORD001',
        delegateId: 1,
        customerName: 'محمد عبد الله',
        customerPhone: '+201112223334',
        address: 'مدينة نصر - شارع عباس العقاد',
        details: '2 منتج من فئة A، 1 منتج من فئة B',
        price: 450,
        status: 'pending',
        date: '2024-11-10',
        notes: 'العميل يريد التوصيل في المساء'
    },
    {
        id: 'ORD002',
        delegateId: 2,
        customerName: 'أمنية سامي',
        customerPhone: '+201223334445',
        address: 'الدقي - شارع التحرير',
        details: '1 منتج من فئة C',
        price: 280,
        status: 'processing',
        date: '2024-11-11',
        notes: ''
    },
    {
        id: 'ORD003',
        delegateId: 1,
        customerName: 'ياسر محمود',
        customerPhone: '+201334445556',
        address: 'مدينة نصر - شارع مصطفى النحاس',
        details: '3 منتجات متنوعة',
        price: 650,
        status: 'completed',
        date: '2024-11-09',
        notes: 'تم التوصيل بنجاح'
    }
];

let googleSheets = [
    {
        id: 'sheet1',
        name: 'طلبات القاهرة',
        governorate: 'القاهرة',
        url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
        lastSync: new Date(Date.now() - 300000),
        status: 'connected'
    },
    {
        id: 'sheet2',
        name: 'طلبات الجيزة',
        governorate: 'الجيزة',
        url: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
        lastSync: new Date(Date.now() - 600000),
        status: 'connected'
    }
];

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    loadStatistics();
    loadGovernorateTabs();
    loadDelegates();
    loadGoogleSheets();
    setupEventListeners();
});

function setupEventListeners() {
    // Add any global event listeners here
}

function loadStatistics() {
    const totalDelegates = delegates.length;
    const activeDelegates = delegates.filter(d => d.active).length;
    const totalOrders = delegates.reduce((sum, d) => sum + d.orders, 0);
    const avgOrders = Math.round(totalOrders / totalDelegates);

    document.getElementById('total-delegates').textContent = totalDelegates;
    document.getElementById('active-delegates').textContent = activeDelegates;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('avg-orders').textContent = avgOrders;
}

function loadGovernorateTabs() {
    const container = document.getElementById('governorate-tabs');
    container.innerHTML = '';

    // Add "All" tab
    const allTab = document.createElement('button');
    allTab.className = 'governorate-tab active px-4 py-2 rounded-lg font-medium';
    allTab.textContent = 'الكل';
    allTab.onclick = () => filterByGovernorate('all');
    container.appendChild(allTab);

    // Get unique governorates
    const governorates = [...new Set(delegates.map(d => d.governorate))];
    
    governorates.forEach(governorate => {
        const tab = document.createElement('button');
        tab.className = 'governorate-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300';
        tab.textContent = governorate;
        tab.onclick = () => filterByGovernorate(governorate);
        container.appendChild(tab);
    });
}

function filterByGovernorate(governorate) {
    currentGovernorate = governorate;
    
    // Update tab styles
    document.querySelectorAll('.governorate-tab').forEach(tab => {
        tab.className = 'governorate-tab bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300';
    });
    
    event.target.className = 'governorate-tab active px-4 py-2 rounded-lg font-medium';
    
    loadDelegates();
}

function loadDelegates() {
    const container = document.getElementById('delegates-grid');
    container.innerHTML = '';

    const filteredDelegates = currentGovernorate === 'all' 
        ? delegates 
        : delegates.filter(d => d.governorate === currentGovernorate);

    filteredDelegates.forEach(delegate => {
        const delegateCard = document.createElement('div');
        delegateCard.className = 'delegate-card bg-white rounded-xl shadow-lg p-6 cursor-pointer';
        
        const statusColor = delegate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const statusText = delegate.active ? 'نشط' : 'غير نشط';
        
        delegateCard.innerHTML = `
            <div class="text-center mb-4">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3 class="font-bold text-lg">${delegate.name}</h3>
                <p class="text-gray-600 text-sm">${delegate.governorate} - ${delegate.area}</p>
            </div>
            
            <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">الحالة:</span>
                    <span class="status-badge ${statusColor} px-2 py-1 rounded-full text-xs">${statusText}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">الطلبات:</span>
                    <span class="font-bold text-blue-600">${delegate.orders}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">التقييم:</span>
                    <div class="flex items-center">
                        <span class="font-bold text-yellow-600">${delegate.rating}</span>
                        <i class="fas fa-star text-yellow-500 mr-1 text-xs"></i>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="selectDelegate(${delegate.id})" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all text-sm">
                    <i class="fas fa-info-circle mr-1"></i>
                    التفاصيل
                </button>
                <button onclick="sendWhatsAppToDelegate(${delegate.id})" class="px-3 py-2 whatsapp-button text-white rounded-lg hover:opacity-90 transition-all">
                    <i class="fab fa-whatsapp"></i>
                </button>
            </div>
        `;
        
        container.appendChild(delegateCard);
    });
}

function selectDelegate(delegateId) {
    selectedDelegate = delegates.find(d => d.id === delegateId);
    if (selectedDelegate) {
        document.getElementById('delegate-details').classList.remove('hidden');
        
        // Update delegate info
        document.getElementById('delegate-name-display').textContent = selectedDelegate.name;
        document.getElementById('delegate-governorate-display').textContent = selectedDelegate.governorate;
        document.getElementById('delegate-orders-display').textContent = selectedDelegate.orders;
        document.getElementById('delegate-whatsapp-input').value = selectedDelegate.whatsapp;
        document.getElementById('delegate-area-input').value = selectedDelegate.area;
        document.getElementById('delegate-notes-input').value = selectedDelegate.notes;
        
        // Update status badge
        const statusBadge = document.querySelector('.status-badge');
        if (selectedDelegate.active) {
            statusBadge.className = 'status-badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm';
            statusBadge.textContent = 'نشط';
        } else {
            statusBadge.className = 'status-badge bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm';
            statusBadge.textContent = 'غير نشط';
        }
        
        loadOrders();
        
        // Scroll to details
        document.getElementById('delegate-details').scrollIntoView({ behavior: 'smooth' });
    }
}

function loadOrders() {
    const container = document.getElementById('orders-list');
    if (!container || !selectedDelegate) return;
    
    container.innerHTML = '';
    
    const delegateOrders = orders.filter(o => o.delegateId === selectedDelegate.id);
    
    if (delegateOrders.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">لا توجد طلبات لهذا المندوب</div>';
        return;
    }
    
    delegateOrders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item border rounded-lg p-4';
        
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        
        const statusTexts = {
            pending: 'قيد الانتظار',
            processing: 'قيد التنفيذ',
            completed: 'مكتمل',
            cancelled: 'ملغي'
        };
        
        orderDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h4 class="font-bold">${order.customerName}</h4>
                    <p class="text-sm text-gray-600">${order.customerPhone}</p>
                </div>
                <div class="text-right">
                    <span class="status-badge ${statusColors[order.status]} px-2 py-1 rounded-full text-xs">
                        ${statusTexts[order.status]}
                    </span>
                    <p class="font-bold text-lg text-green-600 mt-1">${order.price} جنيه</p>
                </div>
            </div>
            
            <div class="mb-3">
                <p class="text-sm text-gray-700"><strong>العنوان:</strong> ${order.address}</p>
                <p class="text-sm text-gray-700"><strong>التفاصيل:</strong> ${order.details}</p>
                ${order.notes ? `<p class="text-sm text-gray-600"><strong>ملاحظات:</strong> ${order.notes}</p>` : ''}
            </div>
            
            <div class="flex gap-2">
                <button onclick="updateOrderStatus('${order.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    <i class="fas fa-edit mr-1"></i>
                    تغيير الحالة
                </button>
                <button onclick="viewOrderDetails('${order.id}')" class="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
                    <i class="fas fa-eye mr-1"></i>
                    التفاصيل
                </button>
                <button onclick="deleteOrder('${order.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    <i class="fas fa-trash mr-1"></i>
                    حذف
                </button>
            </div>
        `;
        
        container.appendChild(orderDiv);
    });
}

function updateDelegateInfo() {
    if (!selectedDelegate) return;
    
    selectedDelegate.whatsapp = document.getElementById('delegate-whatsapp-input').value;
    selectedDelegate.area = document.getElementById('delegate-area-input').value;
    selectedDelegate.notes = document.getElementById('delegate-notes-input').value;
    
    showNotification('✅ تم تحديث بيانات المندوب', 'success');
}

function toggleDelegateStatus() {
    if (!selectedDelegate) return;
    
    selectedDelegate.active = !selectedDelegate.active;
    
    const statusBadge = document.querySelector('.status-badge');
    if (selectedDelegate.active) {
        statusBadge.className = 'status-badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm';
        statusBadge.textContent = 'نشط';
    } else {
        statusBadge.className = 'status-badge bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm';
        statusBadge.textContent = 'غير نشط';
    }
    
    loadDelegates();
    showNotification(`✅ تم تغيير حالة المندوب إلى ${selectedDelegate.active ? 'نشط' : 'غير نشط'}`, 'success');
}

function sendWhatsAppToDelegate(delegateId) {
    const delegate = delegates.find(d => d.id === delegateId);
    if (delegate) {
        window.open(`https://wa.me/${delegate.whatsapp.replace('+', '')}`, '_blank');
    }
}

function sendWhatsAppMessage() {
    if (!selectedDelegate) return;
    
    const whatsappNumber = document.getElementById('delegate-whatsapp-input').value;
    if (whatsappNumber) {
        window.open(`https://wa.me/${whatsappNumber.replace('+', '')}`, '_blank');
    }
}

function addNewDelegate() {
    document.getElementById('add-delegate-modal').classList.remove('hidden');
}

function closeAddDelegateModal() {
    document.getElementById('add-delegate-modal').classList.add('hidden');
    clearAddDelegateForm();
}

function clearAddDelegateForm() {
    document.getElementById('new-delegate-name').value = '';
    document.getElementById('new-delegate-governorate').value = 'القاهرة';
    document.getElementById('new-delegate-whatsapp').value = '';
    document.getElementById('new-delegate-area').value = '';
    document.getElementById('new-delegate-notes').value = '';
}

function saveNewDelegate() {
    const name = document.getElementById('new-delegate-name').value.trim();
    const governorate = document.getElementById('new-delegate-governorate').value;
    const whatsapp = document.getElementById('new-delegate-whatsapp').value.trim();
    const area = document.getElementById('new-delegate-area').value.trim();
    const notes = document.getElementById('new-delegate-notes').value.trim();
    
    if (!name || !whatsapp || !area) {
        showNotification('الرجاء إدخال جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // Validate WhatsApp format
    if (!/^\+?[0-9]{10,15}$/.test(whatsapp)) {
        showNotification('الرجاء إدخال رقم واتساب صحيح', 'error');
        return;
    }
    
    const newDelegate = {
        id: Date.now(),
        name,
        governorate,
        area,
        whatsapp,
        notes,
        active: true,
        orders: 0,
        joinDate: new Date().toISOString().split('T')[0],
        rating: 0,
        totalEarnings: 0
    };
    
    delegates.push(newDelegate);
    loadDelegates();
    loadStatistics();
    closeAddDelegateModal();
    showNotification('✅ تم إضافة المندوب بنجاح', 'success');
}

function addOrder() {
    document.getElementById('add-order-modal').classList.remove('hidden');
}

function closeAddOrderModal() {
    document.getElementById('add-order-modal').classList.add('hidden');
    clearAddOrderForm();
}

function clearAddOrderForm() {
    document.getElementById('order-customer-name').value = '';
    document.getElementById('order-customer-phone').value = '';
    document.getElementById('order-address').value = '';
    document.getElementById('order-details').value = '';
    document.getElementById('order-price').value = '';
}

function saveOrder() {
    if (!selectedDelegate) {
        showNotification('الرجاء اختيار مندوب أولاً', 'error');
        return;
    }
    
    const customerName = document.getElementById('order-customer-name').value.trim();
    const customerPhone = document.getElementById('order-customer-phone').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const details = document.getElementById('order-details').value.trim();
    const price = parseFloat(document.getElementById('order-price').value);
    
    if (!customerName || !customerPhone || !address || !details || !price) {
        showNotification('الرجاء إدخال جميع الحقول', 'error');
        return;
    }
    
    const newOrder = {
        id: 'ORD' + String(orders.length + 1).padStart(3, '0'),
        delegateId: selectedDelegate.id,
        customerName,
        customerPhone,
        address,
        details,
        price,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    };
    
    orders.push(newOrder);
    selectedDelegate.orders++;
    
    loadOrders();
    loadDelegates();
    loadStatistics();
    closeAddOrderModal();
    showNotification('✅ تم إضافة الطلب بنجاح', 'success');
}

function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const statuses = ['pending', 'processing', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    order.status = statuses[nextIndex];
    loadOrders();
    showNotification(`✅ تم تغيير حالة الطلب إلى ${getStatusText(order.status)}`, 'success');
}

function getStatusText(status) {
    const statusTexts = {
        pending: 'قيد الانتظار',
        processing: 'قيد التنفيذ',
        completed: 'مكتمل',
        cancelled: 'ملغي'
    };
    return statusTexts[status] || status;
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        showNotification(`عرض تفاصيل الطلب ${order.id}`, 'info');
    }
}

function deleteOrder(orderId) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        const index = orders.findIndex(o => o.id === orderId);
        if (index > -1) {
            const order = orders[index];
            const delegate = delegates.find(d => d.id === order.delegateId);
            if (delegate) {
                delegate.orders--;
            }
            
            orders.splice(index, 1);
            loadOrders();
            loadDelegates();
            loadStatistics();
            showNotification('✅ تم حذف الطلب', 'success');
        }
    }
}

function filterOrders(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300';
    });
    
    event.target.className = 'filter-btn bg-blue-600 text-white px-3 py-1 rounded-full text-sm';
    
    // Apply filter (in a real app, this would filter the orders)
    loadOrders();
    showNotification(`تم عرض ${filter} الطلبات`, 'info');
}

function exportOrders() {
    if (!selectedDelegate) return;
    
    showNotification('🔄 جاري تصدير الطلبات...', 'info');
    
    setTimeout(() => {
        showNotification('✅ تم تصدير الطلبات بنجاح', 'success');
    }, 2000);
}

// WhatsApp Integration Functions
function sendBulkMessage() {
    showNotification('📱 جاري تحضير نموذج الرسالة الجماعية...', 'info');
}

function setupWhatsAppBot() {
    showNotification('🤖 جاري إعداد بوت واتساب...', 'info');
}

// Google Sheets Integration
function syncWithGoogleSheets() {
    showNotification('🔄 جاري المزامنة مع Google Sheets...', 'info');
    
    setTimeout(() => {
        showNotification('✅ تمت المزامنة بنجاح', 'success');
    }, 3000);
}

function createSheet() {
    showNotification('📊 جاري إنشاء شيت جديد...', 'info');
    
    setTimeout(() => {
        const newSheet = {
            id: 'sheet' + Date.now(),
            name: 'شيت جديد',
            governorate: 'القاهرة',
            url: 'https://docs.google.com/spreadsheets/d/NEW_SHEET_ID/edit',
            lastSync: new Date(),
            status: 'connected'
        };
        
        googleSheets.push(newSheet);
        loadGoogleSheets();
        showNotification('✅ تم إنشاء الشيت بنجاح', 'success');
    }, 2000);
}

function linkSheet() {
    const sheetUrl = prompt('أدخل رابط Google Sheets:');
    if (sheetUrl) {
        showNotification('🔗 جاري ربط الشيت...', 'info');
        
        setTimeout(() => {
            const newSheet = {
                id: 'sheet' + Date.now(),
                name: 'شيت مرتبط',
                governorate: 'القاهرة',
                url: sheetUrl,
                lastSync: new Date(),
                status: 'connected'
            };
            
            googleSheets.push(newSheet);
            loadGoogleSheets();
            showNotification('✅ تم ربط الشيت بنجاح', 'success');
        }, 2000);
    }
}

function syncData() {
    showNotification('🔄 جاري مزامنة البيانات...', 'info');
    
    setTimeout(() => {
        googleSheets.forEach(sheet => {
            sheet.lastSync = new Date();
        });
        loadGoogleSheets();
        showNotification('✅ تمت مزامنة البيانات بنجاح', 'success');
    }, 3000);
}

function loadGoogleSheets() {
    const container = document.getElementById('sheets-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    googleSheets.forEach(sheet => {
        const sheetDiv = document.createElement('div');
        sheetDiv.className = 'bg-gray-50 rounded-lg p-4';
        
        sheetDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold">${sheet.name}</h4>
                <span class="status-badge ${sheet.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded-full text-xs">
                    ${sheet.status === 'connected' ? 'متصل' : 'غير متصل'}
                </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">المحافظة: ${sheet.governorate}</p>
            <p class="text-xs text-gray-500 mb-3">آخر مزامنة: ${formatTime(sheet.lastSync)}</p>
            <div class="flex gap-2">
                <button onclick="openSheet('${sheet.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    <i class="fas fa-external-link-alt mr-1"></i>
                    فتح
                </button>
                <button onclick="syncSheet('${sheet.id}')" class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    <i class="fas fa-sync-alt mr-1"></i>
                    مزامنة
                </button>
                <button onclick="deleteSheet('${sheet.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    <i class="fas fa-trash mr-1"></i>
                    حذف
                </button>
            </div>
        `;
        
        container.appendChild(sheetDiv);
    });
}

function openSheet(sheetId) {
    const sheet = googleSheets.find(s => s.id === sheetId);
    if (sheet) {
        window.open(sheet.url, '_blank');
    }
}

function syncSheet(sheetId) {
    showNotification(`🔄 جاري مزامنة ${googleSheets.find(s => s.id === sheetId)?.name}...`, 'info');
    
    setTimeout(() => {
        const sheet = googleSheets.find(s => s.id === sheetId);
        if (sheet) {
            sheet.lastSync = new Date();
            loadGoogleSheets();
            showNotification('✅ تمت المزامنة بنجاح', 'success');
        }
    }, 2000);
}

function deleteSheet(sheetId) {
    if (confirm('هل أنت متأكد من حذف هذا الشيت؟')) {
        const index = googleSheets.findIndex(s => s.id === sheetId);
        if (index > -1) {
            googleSheets.splice(index, 1);
            loadGoogleSheets();
            showNotification('✅ تم حذف الشيت', 'success');
        }
    }
}

// Utility Functions
function formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
        return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
        return `منذ ${hours} ساعة`;
    } else {
        return timestamp.toLocaleDateString('ar-EG');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-black'
    };
    
    notification.className += ` ${colors[type]}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Global functions
window.selectDelegate = selectDelegate;
window.sendWhatsAppToDelegate = sendWhatsAppToDelegate;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.updateDelegateInfo = updateDelegateInfo;
window.toggleDelegateStatus = toggleDelegateStatus;
window.addNewDelegate = addNewDelegate;
window.closeAddDelegateModal = closeAddDelegateModal;
window.saveNewDelegate = saveNewDelegate;
window.addOrder = addOrder;
window.closeAddOrderModal = closeAddOrderModal;
window.saveOrder = saveOrder;
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetails = viewOrderDetails;
window.deleteOrder = deleteOrder;
window.filterOrders = filterOrders;
window.exportOrders = exportOrders;
window.sendBulkMessage = sendBulkMessage;
window.setupWhatsAppBot = setupWhatsAppBot;
window.syncWithGoogleSheets = syncWithGoogleSheets;
window.createSheet = createSheet;
window.linkSheet = linkSheet;
window.syncData = syncData;
window.openSheet = openSheet;
window.syncSheet = syncSheet;
window.deleteSheet = deleteSheet;
window.filterByGovernorate = filterByGovernorate;