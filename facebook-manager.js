// Facebook Manager System
let selectedPage = null;
let currentReplyMessage = null;
let botActive = false;

// Sample data
let facebookPages = [
    {
        id: '123',
        name: 'صفحة القاهرة',
        connected: true,
        accessToken: 'EAABsBCS123...',
        picture: 'https://via.placeholder.com/100x100/3B82F6/FFFFFF?text=CAIRO',
        stats: {
            followers: 15420,
            messages: 15,
            comments: 8,
            posts: 3
        }
    },
    {
        id: '456',
        name: 'صفحة الجيزة',
        connected: true,
        accessToken: 'EAABsBCS456...',
        picture: 'https://via.placeholder.com/100x100/10B981/FFFFFF?text=GIZA',
        stats: {
            followers: 8932,
            messages: 7,
            comments: 12,
            posts: 5
        }
    },
    {
        id: '789',
        name: 'صفحة الإسكندرية',
        connected: false,
        accessToken: null,
        picture: 'https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=ALEX',
        stats: {
            followers: 0,
            messages: 0,
            comments: 0,
            posts: 0
        }
    }
];

let messages = [
    {
        id: 'msg1',
        pageId: '123',
        sender: 'أحمد محمد',
        content: 'عايز أعرف سعر المنتج الفلاني وهل متوفر؟',
        timestamp: new Date(Date.now() - 300000),
        read: false,
        replied: false,
        type: 'pricing'
    },
    {
        id: 'msg2',
        pageId: '123',
        sender: 'سارة علي',
        content: 'كم يستغرق التوصيل للمعادي؟',
        timestamp: new Date(Date.now() - 600000),
        read: false,
        replied: false,
        type: 'shipping'
    },
    {
        id: 'msg3',
        pageId: '456',
        sender: 'محمود حسن',
        content: 'عندكم توصيل للفيوم؟',
        timestamp: new Date(Date.now() - 900000),
        read: true,
        replied: true,
        type: 'shipping'
    }
];

let comments = [
    {
        id: 'cmt1',
        pageId: '123',
        postId: 'post1',
        sender: 'سارة علي',
        content: 'منتج رائع! هل فيه خصم على الكميات؟',
        timestamp: new Date(Date.now() - 1200000),
        replied: false,
        postContent: 'عرض خاص على المنتجات الجديدة'
    },
    {
        id: 'cmt2',
        pageId: '456',
        postId: 'post2',
        sender: 'محمود حسن',
        content: 'عايز طلب كبير، فيه خصم؟',
        timestamp: new Date(Date.now() - 1500000),
        replied: true,
        postContent: 'تخفيضات نهاية العام'
    }
];

let quickReplies = [
    {
        id: 'qr1',
        title: 'سعر المنتج',
        category: 'pricing',
        content: 'سعر المنتج هو {{price}} جنيه، ويوجد خصم 15% على الطلبات فوق 500 جنيه.',
        keywords: ['سعر', 'كم', 'بكام']
    },
    {
        id: 'qr2',
        title: 'مواعيد التوصيل',
        category: 'shipping',
        content: 'التوصيل خلال 24-48 ساعة داخل القاهرة والجيزة، ومن 2-3 أيام للمحافظات الأخرى.',
        keywords: ['توصيل', 'موعد', 'متى']
    },
    {
        id: 'qr3',
        title: 'طرق الدفع',
        category: 'payment',
        content: 'نقبل الدفع نقداً عند الاستلام، أو تحويل بنكي، أو فودافون كاش.',
        keywords: ['دفع', 'الفلوس', 'السعر']
    }
];

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    loadFacebookPages();
    setupEventListeners();
    initializeBotControls();
});

function setupEventListeners() {
    // Response speed slider
    const responseSpeed = document.getElementById('response-speed');
    const speedValue = document.getElementById('speed-value');
    
    if (responseSpeed && speedValue) {
        responseSpeed.addEventListener('input', function() {
            speedValue.textContent = this.value;
        });
    }
}

function initializeBotControls() {
    // Set initial bot state
    updateBotToggleButton();
}

function loadFacebookPages() {
    const container = document.getElementById('pages-grid');
    container.innerHTML = '';

    facebookPages.forEach(page => {
        const pageCard = document.createElement('div');
        pageCard.className = `page-card bg-white rounded-xl shadow-lg p-6 cursor-pointer border-2 ${page.connected ? 'border-green-400' : 'border-gray-200'}`;
        
        pageCard.innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <img src="${page.picture}" alt="${page.name}" class="w-16 h-16 rounded-full object-cover">
                <div class="flex-1">
                    <h3 class="font-bold text-lg">${page.name}</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-sm ${page.connected ? 'text-green-600' : 'text-red-600'}">
                            ${page.connected ? '🟢 متصلة' : '🔴 غير متصلة'}
                        </span>
                        <span class="text-sm text-gray-500">
                            <i class="fas fa-users mr-1"></i>
                            ${page.stats.followers.toLocaleString()} متابع
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-4 mb-4 text-center">
                <div class="bg-blue-50 rounded-lg p-2">
                    <div class="text-lg font-bold text-blue-600">${page.stats.messages}</div>
                    <div class="text-xs text-gray-600">رسائل</div>
                </div>
                <div class="bg-green-50 rounded-lg p-2">
                    <div class="text-lg font-bold text-green-600">${page.stats.comments}</div>
                    <div class="text-xs text-gray-600">تعليقات</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-2">
                    <div class="text-lg font-bold text-purple-600">${page.stats.posts}</div>
                    <div class="text-xs text-gray-600">منشورات</div>
                </div>
            </div>
            
            <div class="flex gap-2">
                ${page.connected ? `
                    <button onclick="selectPage('${page.id}')" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                        <i class="fas fa-cog mr-2"></i>
                        الإدارة
                    </button>
                    <button onclick="disconnectPage('${page.id}')" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                        <i class="fas fa-unlink"></i>
                    </button>
                ` : `
                    <button onclick="connectPage('${page.id}')" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all">
                        <i class="fas fa-link mr-2"></i>
                        ربط الصفحة
                    </button>
                `}
            </div>
        `;
        
        container.appendChild(pageCard);
    });
}

function selectPage(pageId) {
    selectedPage = facebookPages.find(p => p.id === pageId);
    if (selectedPage) {
        document.getElementById('page-management').classList.remove('hidden');
        loadMessages();
        loadComments();
        loadQuickReplies();
        loadAISuggestions();
        
        // Update page title
        document.querySelector('#page-management h1').textContent = `إدارة ${selectedPage.name}`;
        
        showNotification(`تم اختيار صفحة ${selectedPage.name} للإدارة`, 'success');
    }
}

function connectPage(pageId) {
    showNotification('🔄 جاري ربط الصفحة...', 'info');
    
    // Simulate OAuth connection
    setTimeout(() => {
        const page = facebookPages.find(p => p.id === pageId);
        if (page) {
            page.connected = true;
            page.accessToken = 'EAABsBCS' + Math.random().toString(36).substr(2, 9) + '...';
            loadFacebookPages();
            showNotification('✅ تم ربط الصفحة بنجاح!', 'success');
        }
    }, 2000);
}

function disconnectPage(pageId) {
    if (confirm('هل أنت متأكد من فصل الصفحة؟')) {
        const page = facebookPages.find(p => p.id === pageId);
        if (page) {
            page.connected = false;
            page.accessToken = null;
            loadFacebookPages();
            showNotification('✅ تم فصل الصفحة', 'info');
        }
    }
}

function loadMessages() {
    const container = document.getElementById('messages-list');
    if (!container || !selectedPage) return;
    
    container.innerHTML = '';
    
    const pageMessages = messages.filter(m => m.pageId === selectedPage.id);
    
    pageMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-all ${message.read ? '' : 'border-r-4 border-blue-500'}`;
        
        messageDiv.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <h4 class="font-bold">${message.sender}</h4>
                    ${!message.read ? '<span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">جديد</span>' : ''}
                    ${message.replied ? '<span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">تم الرد</span>' : '<span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">قيد الانتظار</span>'}
                </div>
                <span class="text-sm text-gray-500">${formatTime(message.timestamp)}</span>
            </div>
            <p class="text-gray-700 mb-3">${message.content}</p>
            <div class="flex gap-2">
                <button onclick="replyToMessage('${message.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    <i class="fas fa-reply mr-1"></i>
                    رد
                </button>
                <button onclick="markMessageRead('${message.id}')" class="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">
                    <i class="fas fa-check mr-1"></i>
                    مقروء
                </button>
                <button onclick="generateAIReply('${message.id}')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    <i class="fas fa-magic mr-1"></i>
                    اقتراح AI
                </button>
            </div>
        `;
        
        container.appendChild(messageDiv);
    });
}

function loadComments() {
    const container = document.getElementById('comments-list');
    if (!container || !selectedPage) return;
    
    container.innerHTML = '';
    
    const pageComments = comments.filter(c => c.pageId === selectedPage.id);
    
    pageComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item bg-gray-50 rounded-lg p-4';
        
        commentDiv.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                    <h4 class="font-bold">${comment.sender}</h4>
                    ${!comment.replied ? '<span class="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">قيد الانتظار</span>' : '<span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">تم الرد</span>'}
                </div>
                <span class="text-sm text-gray-500">${formatTime(comment.timestamp)}</span>
            </div>
            <div class="bg-blue-50 p-2 rounded mb-2 text-sm">
                <strong>على المنشور:</strong> ${comment.postContent}
            </div>
            <p class="text-gray-700 mb-3">${comment.content}</p>
            <div class="flex gap-2">
                <button onclick="replyToComment('${comment.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    <i class="fas fa-reply mr-1"></i>
                    رد
                </button>
                <button onclick="likeComment('${comment.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    <i class="fas fa-heart mr-1"></i>
                    إعجاب
                </button>
                <button onclick="generateAIReply('${comment.id}', 'comment')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                    <i class="fas fa-magic mr-1"></i>
                    اقتراح AI
                </button>
            </div>
        `;
        
        container.appendChild(commentDiv);
    });
}

function loadQuickReplies() {
    const container = document.getElementById('quick-replies-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    quickReplies.forEach(reply => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'quick-reply bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg cursor-pointer';
        
        const categoryIcons = {
            pricing: '💰',
            shipping: '🚚',
            payment: '💳',
            general: '❓',
            complaint: '😞'
        };
        
        replyDiv.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold">${reply.title}</h4>
                <span class="text-lg">${categoryIcons[reply.category] || '📝'}</span>
            </div>
            <p class="text-sm mb-3 line-clamp-2">${reply.content}</p>
            <div class="flex gap-2">
                <button onclick="useQuickReply('${reply.id}')" class="flex-1 bg-white bg-opacity-20 text-white py-1 rounded text-sm hover:bg-opacity-30">
                    <i class="fas fa-paper-plane mr-1"></i>
                    استخدام
                </button>
                <button onclick="editQuickReply('${reply.id}')" class="px-3 py-1 bg-white bg-opacity-20 text-white rounded text-sm hover:bg-opacity-30">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteQuickReply('${reply.id}')" class="px-3 py-1 bg-red-500 bg-opacity-20 text-white rounded text-sm hover:bg-opacity-30">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(replyDiv);
    });
}

function loadAISuggestions() {
    const container = document.getElementById('ai-suggestions');
    if (!container) return;
    
    const suggestions = [
        {
            type: 'trending',
            title: 'زيادة في الأسئلة عن الشحن',
            description: 'لاحظنا زيادة في الأسئلة عن مواعيد التوصيل، نقترح إضافة رد سريع جديد.',
            action: 'إضافة رد شحن جديد'
        },
        {
            type: 'performance',
            title: 'تحسين وقت الرد',
            description: 'يمكن تحسين وقت الرد بخفض السرعة إلى 2 ثانية بدلاً من 3.',
            action: 'تعديل السرعة'
        },
        {
            type: 'opportunity',
            title: 'فرصة مبيعات',
            description: 'هناك اهتمام كبير بمنتج معين، يمكن إنشاء عرض خاص.',
            action: 'إنشاء عرض'
        }
    ];
    
    container.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'ai-suggestion p-4 rounded-lg';
        
        const typeIcons = {
            trending: '📈',
            performance: '⚡',
            opportunity: '💡'
        };
        
        suggestionDiv.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-2xl">${typeIcons[suggestion.type]}</span>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800">${suggestion.title}</h4>
                    <p class="text-sm text-gray-600 mt-1">${suggestion.description}</p>
                    <button onclick="applyAISuggestion('${suggestion.type}')" class="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        ${suggestion.action}
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(suggestionDiv);
    });
}

// Message and Comment Functions
function replyToMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message) {
        currentReplyMessage = { ...message, type: 'message' };
        showReplyModal(message);
    }
}

function replyToComment(commentId) {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
        currentReplyMessage = { ...comment, type: 'comment' };
        showReplyModal(comment);
    }
}

function showReplyModal(originalMessage) {
    const modal = document.getElementById('reply-modal');
    const originalDiv = document.getElementById('original-message');
    
    originalDiv.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="flex-1">
                <h4 class="font-bold">${originalMessage.sender}</h4>
                <p class="text-gray-700 mt-1">${originalMessage.content}</p>
                <span class="text-xs text-gray-500">${formatTime(originalMessage.timestamp)}</span>
            </div>
        </div>
    `;
    
    // Load quick suggestions
    loadQuickSuggestions(originalMessage);
    
    modal.classList.remove('hidden');
}

function loadQuickSuggestions(message) {
    const container = document.getElementById('quick-suggestions');
    container.innerHTML = '';
    
    const relevantReplies = quickReplies.filter(reply => 
        reply.keywords.some(keyword => message.content.includes(keyword))
    );
    
    relevantReplies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200';
        button.textContent = reply.title;
        button.onclick = () => {
            document.getElementById('reply-text').value = reply.content;
        };
        container.appendChild(button);
    });
}

function closeReplyModal() {
    document.getElementById('reply-modal').classList.add('hidden');
    currentReplyMessage = null;
}

function sendReply() {
    const replyText = document.getElementById('reply-text').value.trim();
    if (!replyText || !currentReplyMessage) return;
    
    // Simulate sending reply
    showNotification('🔄 جاري إرسال الرد...', 'info');
    
    setTimeout(() => {
        if (currentReplyMessage.type === 'message') {
            const message = messages.find(m => m.id === currentReplyMessage.id);
            if (message) {
                message.replied = true;
                message.read = true;
            }
            loadMessages();
        } else {
            const comment = comments.find(c => c.id === currentReplyMessage.id);
            if (comment) {
                comment.replied = true;
            }
            loadComments();
        }
        
        closeReplyModal();
        showNotification('✅ تم إرسال الرد بنجاح!', 'success');
    }, 1500);
}

function sendAndClose() {
    sendReply();
}

function generateAIReply(messageId, type = 'message') {
    showNotification('🧠 جاري توليد رد ذكي...', 'info');
    
    setTimeout(() => {
        const aiReplies = [
            'شكراً لتواصلك معنا! بالنسبة لسؤالك، يسعدنا مساعدتك. المنتج متوفر حالياً وبسعر منافس.',
            'نقدر اهتمامك! يمكننا توصيل طلبك خلال 24-48 ساعة حسب موقعك. هل ترغب في تقديم الطلب؟',
            'شكراً لسؤالك! نعم، نقبل الدفع عند الاستلام في معظم المناطق. ما هو عنوانك بالتحديد؟'
        ];
        
        const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
        
        if (type === 'message') {
            const message = messages.find(m => m.id === messageId);
            if (message) {
                replyToMessage(messageId);
                document.getElementById('reply-text').value = randomReply;
            }
        } else {
            const comment = comments.find(c => c.id === messageId);
            if (comment) {
                replyToComment(messageId);
                document.getElementById('reply-text').value = randomReply;
            }
        }
        
        showNotification('✅ تم توليد رد ذكي!', 'success');
    }, 2000);
}

// Bot Control Functions
function toggleBot() {
    botActive = !botActive;
    updateBotToggleButton();
    
    if (botActive) {
        startBot();
        showNotification('🤖 تم تشغيل البوت بنجاح!', 'success');
    } else {
        stopBot();
        showNotification('⏹️ تم إيقاف البوت', 'info');
    }
}

function updateBotToggleButton() {
    const button = document.getElementById('bot-toggle');
    if (botActive) {
        button.innerHTML = '<i class="fas fa-stop mr-2"></i>إيقاف البوت';
        button.className = 'bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all';
    } else {
        button.innerHTML = '<i class="fas fa-play mr-2"></i>تشغيل البوت';
        button.className = 'bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all';
    }
}

function startBot() {
    // Simulate bot starting
    console.log('Bot started for page:', selectedPage?.name);
}

function stopBot() {
    // Simulate bot stopping
    console.log('Bot stopped for page:', selectedPage?.name);
}

// Quick Reply Functions
function addQuickReply() {
    document.getElementById('add-reply-form').classList.remove('hidden');
}

function cancelQuickReply() {
    document.getElementById('add-reply-form').classList.add('hidden');
    clearQuickReplyForm();
}

function clearQuickReplyForm() {
    document.getElementById('reply-title').value = '';
    document.getElementById('reply-category').value = 'general';
    document.getElementById('reply-text').value = '';
}

function saveQuickReply() {
    const title = document.getElementById('reply-title').value.trim();
    const category = document.getElementById('reply-category').value;
    const text = document.getElementById('reply-text').value.trim();
    
    if (!title || !text) {
        showNotification('الرجاء إدخال عنوان ونص الرد', 'error');
        return;
    }
    
    const newReply = {
        id: 'qr' + Date.now(),
        title,
        category,
        content: text,
        keywords: extractKeywords(text)
    };
    
    quickReplies.push(newReply);
    loadQuickReplies();
    cancelQuickReply();
    showNotification('✅ تم حفظ الرد السريع', 'success');
}

function extractKeywords(text) {
    const commonKeywords = ['سعر', 'توصيل', 'دفع', 'كم', 'متى', 'كيف', 'أين'];
    return commonKeywords.filter(keyword => text.includes(keyword));
}

function useQuickReply(replyId) {
    const reply = quickReplies.find(r => r.id === replyId);
    if (reply) {
        // Copy to clipboard or use directly
        navigator.clipboard.writeText(reply.content);
        showNotification('📋 تم نسخ الرد', 'success');
    }
}

function editQuickReply(replyId) {
    const reply = quickReplies.find(r => r.id === replyId);
    if (reply) {
        document.getElementById('reply-title').value = reply.title;
        document.getElementById('reply-category').value = reply.category;
        document.getElementById('reply-text').value = reply.content;
        document.getElementById('add-reply-form').classList.remove('hidden');
        
        // Remove the old reply
        const index = quickReplies.findIndex(r => r.id === replyId);
        quickReplies.splice(index, 1);
    }
}

function deleteQuickReply(replyId) {
    if (confirm('هل أنت متأكد من حذف هذا الرد؟')) {
        const index = quickReplies.findIndex(r => r.id === replyId);
        if (index > -1) {
            quickReplies.splice(index, 1);
            loadQuickReplies();
            showNotification('✅ تم حذف الرد السريع', 'success');
        }
    }
}

// Filter Functions
function filterMessages(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300';
    });
    
    event.target.className = 'filter-btn bg-blue-600 text-white px-3 py-1 rounded-full text-sm';
    
    // Apply filter (in a real app, this would filter the messages)
    showNotification(`تم عرض ${filter} الرسائل`, 'info');
}

function markAllMessagesRead() {
    messages.forEach(message => {
        if (message.pageId === selectedPage?.id) {
            message.read = true;
        }
    });
    loadMessages();
    showNotification('✅ تم وضع علامة مقروء على جميع الرسائل', 'success');
}

function markAllCommentsRead() {
    comments.forEach(comment => {
        if (comment.pageId === selectedPage?.id) {
            comment.replied = true;
        }
    });
    loadComments();
    showNotification('✅ تم وضع علامة مقروء على جميع التعليقات', 'success');
}

function markMessageRead(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message) {
        message.read = true;
        loadMessages();
        showNotification('✅ تم وضع علامة مقروء', 'success');
    }
}

function likeComment(commentId) {
    showNotification('❤️ تم الإعجاب بالتعليق', 'success');
}

// AI Functions
function applyAISuggestion(type) {
    switch(type) {
        case 'trending':
            addQuickReply();
            document.getElementById('reply-category').value = 'shipping';
            break;
        case 'performance':
            document.getElementById('response-speed').value = '2';
            document.getElementById('speed-value').textContent = '2';
            break;
        case 'opportunity':
            showNotification('💡 سيتم إنشاء عرض خاص قريباً', 'info');
            break;
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

function refreshPages() {
    showNotification('🔄 جاري تحديث الصفحات...', 'info');
    
    setTimeout(() => {
        loadFacebookPages();
        if (selectedPage) {
            loadMessages();
            loadComments();
        }
        showNotification('✅ تم تحديث البيانات', 'success');
    }, 1500);
}

function connectNewPage() {
    showNotification('🔄 جاري فتح نافذة ربط صفحة جديدة...', 'info');
    
    // Simulate OAuth popup
    setTimeout(() => {
        const newPage = {
            id: 'page' + Date.now(),
            name: 'صفحة جديدة',
            connected: true,
            accessToken: 'EAABsBCS' + Math.random().toString(36).substr(2, 9) + '...',
            picture: 'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=NEW',
            stats: {
                followers: 0,
                messages: 0,
                comments: 0,
                posts: 0
            }
        };
        
        facebookPages.push(newPage);
        loadFacebookPages();
        showNotification('✅ تم ربط صفحة جديدة!', 'success');
    }, 2000);
}

function testNotification() {
    showNotification('🔔 هذا هو إشعار تجريبي!', 'info');
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
window.selectPage = selectPage;
window.connectPage = connectPage;
window.disconnectPage = disconnectPage;
window.replyToMessage = replyToMessage;
window.replyToComment = replyToComment;
window.closeReplyModal = closeReplyModal;
window.sendReply = sendReply;
window.sendAndClose = sendAndClose;
window.generateAIReply = generateAIReply;
window.toggleBot = toggleBot;
window.addQuickReply = addQuickReply;
window.cancelQuickReply = cancelQuickReply;
window.saveQuickReply = saveQuickReply;
window.useQuickReply = useQuickReply;
window.editQuickReply = editQuickReply;
window.deleteQuickReply = deleteQuickReply;
window.filterMessages = filterMessages;
window.markAllMessagesRead = markAllMessagesRead;
window.markAllCommentsRead = markAllCommentsRead;
window.markMessageRead = markMessageRead;
window.likeComment = likeComment;
window.applyAISuggestion = applyAISuggestion;
window.refreshPages = refreshPages;
window.connectNewPage = connectNewPage;
window.testNotification = testNotification;