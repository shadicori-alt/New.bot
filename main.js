// منطق التطبيق الرئيسي
const BotPlatform = {
    // إعدادات الـ APIs
    apis: {},
    
    // حالة البوت
    settings: {
        messenger: false,
        comments: false,
        whatsapp: false,
        sheets: false,
        test: false
    },
    
    // تهيئة النظام
    init() {
        this.loadApis();
        this.loadSettings();
        this.startMonitoring();
    },
    
    // تحميل إعدادات الـ APIs
    loadApis() {
        const apiTypes = ['facebook', 'whatsapp', 'bot', 'googlesheets'];
        apiTypes.forEach(type => {
            const data = localStorage.getItem(`api_${type}`);
            if (data) {
                this.apis[type] = JSON.parse(data);
            }
        });
    },
    
    // تحميل إعدادات البوت
    loadSettings() {
        Object.keys(this.settings).forEach(key => {
            const value = localStorage.getItem(`bot_setting_${key}`);
            this.settings[key] = value === 'true';
        });
    },
    
    // حفظ إعدادات البوت
    saveSettings() {
        Object.keys(this.settings).forEach(key => {
            localStorage.setItem(`bot_setting_${key}`, this.settings[key]);
        });
    },
    
    // بدء مراقبة المنشورات
    startMonitoring() {
        if (!this.settings.comments) return;
        
        console.log('🤖 Bot monitoring started...');
        this.checkNewComments();
        
        // فحص كل 30 ثانية
        setInterval(() => this.checkNewComments(), 30000);
    },
    
    // محاكاة فحص تعليقات جديدة
    checkNewComments() {
        const posts = JSON.parse(localStorage.getItem('monitored_posts') || '[]');
        if (posts.length === 0) return;
        
        // محاكاة تلقي تعليق جديد
        if (Math.random() > 0.7) { // 30% احتمال
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            this.handleNewComment({
                postId: randomPost.id,
                user: 'عميل_' + Math.floor(Math.random() * 1000),
                message: 'استفسار عن المنتج',
                timestamp: new Date()
            });
        }
    },
    
    // معالجة تعليق جديد
    handleNewComment(comment) {
        if (!this.settings.comments) return;
        
        const templates = JSON.parse(localStorage.getItem('bot_templates') || '[]');
        const matchingTemplate = templates.find(t => 
            comment.message.includes(t.keyword)
        );
        
        if (matchingTemplate) {
            this.sendReply(comment, matchingTemplate.response);
        } else {
            // رد افتراضي
            this.sendReply(comment, 'شكراً لتواصلك! سنرد عليك في أقرب وقت.');
        }
    },
    
    // إرسال رد
    sendReply(comment, response) {
        console.log(`📤 Sending reply to ${comment.user}: ${response}`);
        
        // تسجيل في السجل
        this.addLog(`تم الرد على ${comment.user}: ${response.substring(0, 50)}...`);
        
        // إرسال لـ WhatsApp إذا كان مفعلاً
        if (this.settings.whatsapp) {
            this.sendToWhatsApp(comment.user, response);
        }
        
        // تسجيل في Google Sheets إذا كان مفعلاً
        if (this.settings.sheets) {
            this.logToSheets(comment, response);
        }
    },
    
    // محاكاة إرسال لـ WhatsApp
    sendToWhatsApp(user, message) {
        console.log(`💬 WhatsApp to ${user}: ${message}`);
        this.addLog(`تم إرسال رسالة WhatsApp لـ ${user}`);
    },
    
    // محاكاة تسجيل في Google Sheets
    logToSheets(comment, response) {
        console.log(`📊 Logged to Sheets: ${comment.user}`);
        this.addLog(`تم تسجيل تفاعل ${comment.user} في Google Sheets`);
    },
    
    // إضافة سجل
    addLog(message) {
        const logs = JSON.parse(localStorage.getItem('bot_logs') || '[]');
        logs.unshift({
            timestamp: new Date().toLocaleTimeString(),
            message: message
        });
        
        if (logs.length > 100) logs.pop();
        localStorage.setItem('bot_logs', JSON.stringify(logs));
    },
    
    // اختبار اتصال API
    async testApiConnection(apiType) {
        try {
            const api = this.apis[apiType];
            if (!api) throw new Error('API not configured');
            
            // محاكاة اختبار الاتصال
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            return { success: true, message: 'تم الاتصال بنجاح!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    BotPlatform.init();
});

// تصدير للاستخدام الخارجي
window.BotPlatform = BotPlatform;