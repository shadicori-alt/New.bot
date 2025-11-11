// System State Management
let systemStatus = {
    facebook: true,
    whatsapp: false,
    ai: true,
    autoReply: true
};

let facebookPages = [
    { id: '123', name: 'صفحة القاهرة', connected: true, messages: 15, comments: 8 },
    { id: '456', name: 'صفحة الجيزة', connected: false, messages: 0, comments: 0 }
];

let delegates = [
    { id: 1, name: 'أحمد محمد', governorate: 'القاهرة', whatsapp: '+20100XXXXXX', active: true, orders: 23 },
    { id: 2, name: 'سارة علي', governorate: 'الجيزة', whatsapp: '+20101XXXXXX', active: true, orders: 18 }
];

let chatMessages = [
    { role: 'assistant', content: 'أهلاً بك! أنا مساعدك الذكي. اطرح أي سؤال عن النظام.' }
];

let botSettings = {
    replyMode: 'hybrid',
    responseTime: 2,
    keywords: ['طلب', 'عايز', 'حابب', 'وداي', 'سعر', 'عنوان']
};

// DOM Elements
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessage = document.getElementById('send-message');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadFacebookPages();
    loadDelegates();
});

function initializeDashboard() {
    // Initialize response time slider
    const responseTimeSlider = document.getElementById('response-time');
    const responseTimeValue = document.getElementById('response-time-value');
    
    if (responseTimeSlider && responseTimeValue) {
        responseTimeSlider.addEventListener('input', function() {
            responseTimeValue.textContent = this.value;
        });
    }
}

function setupEventListeners() {
    // Chat toggle
    chatToggle.addEventListener('click', () => toggleChat());
    closeChat.addEventListener('click', () => toggleChat());
    
    // Chat functionality
    sendMessage.addEventListener('click', () => sendChatMessage());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
}

function toggleChat() {
    chatContainer.classList.toggle('hidden');
}

function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    chatMessages.push({ role: 'user', content: message });
    appendMessage('user', message);
    chatInput.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        chatMessages.push({ role: 'assistant', content: response });
        appendMessage('assistant', response);
    }, 1000);
}

function appendMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-3 flex ${role === 'user' ? 'justify-start' : 'justify-end'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `max-w-xs px-4 py-2 rounded-2xl ${role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`;
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chatMessagesContainer.appendChild(messageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('فيسبوك') || lowerMessage.includes('facebook')) {
        return 'لربط صفحات فيسبوك، انتقل إلى الإعدادات > تكاملات > فيسبوك، ثم اضغط على "ربط حساب جديد".';
    } else if (lowerMessage.includes('واتساب') || lowerMessage.includes('whatsapp')) {
        return 'لتفعيل واتساب، انتقل إلى الإعدادات > تكاملات > واتساب، واتبع خطوات التفعيل باستخدام رمز QR.';
    } else if (lowerMessage.includes('مندوب') || lowerMessage.includes('delegate')) {
        return 'يمكنك إضافة مندوب جديد من خلال النموذج في الجانب الأيمن. أدخل الاسم، المحافظة، ورقم الواتساب.';
    } else if (lowerMessage.includes('رد') || lowerMessage.includes('response')) {
        return 'يمكنك تعديل إعدادات الردود التلقائية من تبويب "إعدادات البوت". اختر نمط الرد وسرعته.';
    } else {
        return `تم التحليل: "${message}". للحصول على المساعدة، حاول طرح سؤال أكثر تحديداً عن فيسبوك، واتساب، المندوبين، أو إعدادات البوت.`;
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Update tab buttons
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            button.classList.add('bg-blue-600', 'text-white');
        } else {
            button.classList.remove('bg-blue-600', 'text-white');
            button.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        }
    });
}

function toggleService(service) {
    systemStatus[service] = !systemStatus[service];
    const card = document.getElementById(`${service}-card`);
    const statusSpan = card.querySelector('span');
    const button = card.querySelector('button');
    
    if (systemStatus[service]) {
        statusSpan.className = 'text-sm px-3 py-1 rounded-full bg-green-100 text-green-800';
        statusSpan.innerHTML = '🟢 نشط';
        button.className = 'w-full py-2 rounded-lg font-bold transition-all bg-red-500 hover:bg-red-600 text-white';
        button.textContent = 'إيقاف الخدمة';
        card.classList.remove('border-gray-200');
        card.classList.add('border-4', 'border-green-400');
    } else {
        statusSpan.className = 'text-sm px-3 py-1 rounded-full bg-red-100 text-red-800';
        statusSpan.innerHTML = '⚫ غير نشط';
        button.className = 'w-full py-2 rounded-lg font-bold transition-all bg-green-500 hover:bg-green-600 text-white';
        button.textContent = 'تشغيل الخدمة';
        card.classList.remove('border-4', 'border-green-400');
        card.classList.add('border-2', 'border-gray-200');
    }
}

function connectFacebook() {
    showNotification('🔄 جاري الربط بفيسبوك...', 'info');
    
    // Simulate connection process
    setTimeout(() => {
        facebookPages.forEach(page => {
            if (page.id === '456') {
                page.connected = true;
            }
        });
        loadFacebookPages();
        showNotification('✅ تم الربط بفيسبوك بنجاح!', 'success');
    }, 2000);
}

function loadFacebookPages() {
    const container = document.getElementById('facebook-pages');
    if (!container) return;
    
    container.innerHTML = '';
    
    facebookPages.forEach(page => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'border rounded-lg p-4 hover:shadow-md transition-all';
        
        pageDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="font-bold text-lg">${page.name}</h3>
                    <div class="flex gap-4 mt-2 text-sm text-gray-600">
                        <span><i class="fas fa-envelope mr-1"></i>${page.messages} رسائل</span>
                        <span><i class="fas fa-comments mr-1"></i>${page.comments} تعليقات</span>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${page.connected ? `
                        <span class="text-green-600">🟢 متصل</span>
                        <button onclick="managePage('${page.id}')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            إدارة
                        </button>
                    ` : `
                        <button onclick="connectPage('${page.id}')" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                            ربط
                        </button>
                    `}
                </div>
            </div>
        `;
        
        container.appendChild(pageDiv);
    });
}

function managePage(pageId) {
    showNotification(`فتح إدارة الصفحة ${pageId}`, 'info');
}

function connectPage(pageId) {
    showNotification(`جاري ربط الصفحة ${pageId}...`, 'info');
    
    setTimeout(() => {
        const page = facebookPages.find(p => p.id === pageId);
        if (page) {
            page.connected = true;
            loadFacebookPages();
            showNotification('✅ تم الربط بنجاح!', 'success');
        }
    }, 1500);
}

function addDelegate() {
    const name = document.getElementById('delegate-name').value.trim();
    const governorate = document.getElementById('delegate-governorate').value;
    const whatsapp = document.getElementById('delegate-whatsapp').value.trim();
    
    if (!name || !whatsapp) {
        showNotification('الرجاء إدخال الاسم ورقم الواتساب', 'error');
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
        whatsapp,
        active: true,
        orders: 0
    };
    
    delegates.push(newDelegate);
    loadDelegates();
    
    // Clear form
    document.getElementById('delegate-name').value = '';
    document.getElementById('delegate-whatsapp').value = '';
    document.getElementById('delegate-governorate').value = 'القاهرة';
    
    showNotification('✅ تم إضافة المندوب بنجاح', 'success');
}

function loadDelegates() {
    const container = document.getElementById('delegates-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    delegates.forEach(delegate => {
        const delegateDiv = document.createElement('div');
        delegateDiv.className = 'border rounded-lg p-3 hover:bg-gray-50 transition-all';
        
        delegateDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold">${delegate.name}</h4>
                    <p class="text-sm text-gray-600">${delegate.governorate}</p>
                    <p class="text-xs text-blue-600 mt-1"><i class="fas fa-phone mr-1"></i>${delegate.whatsapp}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-blue-600">${delegate.orders}</p>
                    <p class="text-xs text-gray-500">طلب</p>
                    <button onclick="toggleDelegate(${delegate.id})" class="mt-2 px-3 py-1 rounded text-xs ${delegate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${delegate.active ? '🟢 نشط' : '🔴 متوقف'}
                    </button>
                </div>
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="contactDelegate('${delegate.whatsapp}')" class="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600">
                    <i class="fab fa-whatsapp mr-1"></i> واتساب
                </button>
                <button onclick="viewDelegateDetails(${delegate.id})" class="flex-1 bg-gray-300 text-gray-700 py-1 rounded text-sm hover:bg-gray-400">
                    <i class="fas fa-info-circle mr-1"></i> التفاصيل
                </button>
            </div>
        `;
        
        container.appendChild(delegateDiv);
    });
}

function toggleDelegate(delegateId) {
    const delegate = delegates.find(d => d.id === delegateId);
    if (delegate) {
        delegate.active = !delegate.active;
        loadDelegates();
        showNotification(delegate.active ? 'تم تفعيل المندوب' : 'تم إيقاف المندوب', 'info');
    }
}

function contactDelegate(whatsapp) {
    window.open(`https://wa.me/${whatsapp.replace('+', '')}`, '_blank');
}

function viewDelegateDetails(delegateId) {
    showNotification(`عرض تفاصيل المندوب ${delegateId}`, 'info');
}

function addKeyword() {
    const input = document.getElementById('new-keyword');
    const keyword = input.value.trim();
    
    if (!keyword) return;
    
    if (botSettings.keywords.includes(keyword)) {
        showNotification('الكلمة موجودة بالفعل', 'error');
        return;
    }
    
    botSettings.keywords.push(keyword);
    input.value = '';
    loadKeywords();
    showNotification('✅ تم إضافة الكلمة', 'success');
}

function removeKeyword(button) {
    const keywordSpan = button.parentElement;
    const keyword = keywordSpan.textContent.replace('✕', '').trim();
    
    botSettings.keywords = botSettings.keywords.filter(k => k !== keyword);
    keywordSpan.remove();
    showNotification('✅ تم حذف الكلمة', 'success');
}

function loadKeywords() {
    const container = document.getElementById('keywords-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    botSettings.keywords.forEach(keyword => {
        const span = document.createElement('span');
        span.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm';
        span.innerHTML = `${keyword} <button onclick="removeKeyword(this)" class="ml-2 text-red-500">✕</button>`;
        container.appendChild(span);
    });
}

function saveBotSettings() {
    const replyMode = document.getElementById('reply-mode').value;
    const responseTime = document.getElementById('response-time').value;
    
    botSettings.replyMode = replyMode;
    botSettings.responseTime = parseInt(responseTime);
    
    showNotification('✅ تم حفظ إعدادات البوت بنجاح', 'success');
}

function quickAction(action) {
    const actions = {
        export: 'جاري تصدير الطلبات...',
        sync: 'جاري مزامنة البيانات...',
        cleanup: 'جاري تنظيف البيانات...',
        notify: 'جاري إرسال الإشعارات...'
    };
    
    showNotification(actions[action] || 'جاري تنفيذ العملية...', 'info');
    
    // Simulate action completion
    setTimeout(() => {
        showNotification(`✅ تم تنفيذ ${action} بنجاح`, 'success');
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility Functions
function formatNumber(num) {
    return new Intl.NumberFormat('ar-EG').format(num);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('ar-EG').format(date);
}

// Export functions for global access
window.toggleService = toggleService;
window.connectFacebook = connectFacebook;
window.managePage = managePage;
window.connectPage = connectPage;
window.addDelegate = addDelegate;
window.toggleDelegate = toggleDelegate;
window.contactDelegate = contactDelegate;
window.viewDelegateDetails = viewDelegateDetails;
window.addKeyword = addKeyword;
window.removeKeyword = removeKeyword;
window.saveBotSettings = saveBotSettings;
window.quickAction = quickAction;