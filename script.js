// Global Variables
let formData = {
    operatorName: '',
    customerName: '',
    phoneNumber: '',
    emailId: '',
    aadharNumber: '',
    dob: '',
    pincode: '',
    aadharPhoto: null,
    planSpeed: '',
    planValidity: '',
    iptvApp: '',
    iptvCategory: '',
    imageUrl: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContainer').style.opacity = '1';
        }, 500);
    }, 1500);

    // Set today as max date for DOB
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').max = today;

    // Initialize form validation
    initializeValidation();
});

// Form Navigation
function nextStep(next) {
    const currentStep = document.querySelector('.form-step.active');
    const nextStep = document.getElementById('step' + next);
    
    // Validate current step
    if (!validateStep(currentStep.id.replace('step', ''))) {
        showError('कृपया सभी आवश्यक फ़ील्ड भरें');
        return;
    }
    
    // Animation
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutLeft 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        nextStep.style.display = 'block';
        setTimeout(() => {
            nextStep.classList.add('active');
            updateProgressBar(next);
        }, 10);
    }, 500);
}

function prevStep(prev) {
    const currentStep = document.querySelector('.form-step.active');
    const prevStep = document.getElementById('step' + prev);
    
    // Animation
    currentStep.classList.remove('active');
    currentStep.style.animation = 'slideOutRight 0.5s ease';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        currentStep.style.animation = '';
        
        prevStep.style.display = 'block';
        setTimeout(() => {
            prevStep.classList.add('active');
            updateProgressBar(prev);
        }, 10);
    }, 500);
}

// Update Progress Bar
function updateProgressBar(step) {
    const progress = (step - 1) * 25;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active');
        if (parseInt(s.dataset.step) <= step) {
            s.classList.add('active');
        }
    });
}

// Form Validation
function initializeValidation() {
    // Phone number validation
    document.getElementById('phoneNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
    
    // Aadhar validation
    document.getElementById('aadharNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 12);
    });
    
    // Pincode validation
    document.getElementById('pincode').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });
    
    // Email validation
    document.getElementById('emailId').addEventListener('blur', function(e) {
        const email = this.value;
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('कृपया वैध ईमेल आईडी दर्ज करें');
        }
    });
}

function validateStep(step) {
    switch(step) {
        case '1':
            const opName = document.getElementById('operatorName').value;
            const custName = document.getElementById('customerName').value;
            const phone = document.getElementById('phoneNumber').value;
            const email = document.getElementById('emailId').value;
            
            if (!opName || !custName || !phone || !email) return false;
            if (phone.length !== 10) return false;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
            
            // Store data
            formData.operatorName = opName;
            formData.customerName = custName;
            formData.phoneNumber = phone;
            formData.emailId = email;
            return true;
            
        case '2':
            const aadhar = document.getElementById('aadharNumber').value;
            const dob = document.getElementById('dob').value;
            const pincode = document.getElementById('pincode').value;
            
            if (!aadhar || !dob || !pincode) return false;
            if (aadhar.length !== 12) return false;
            if (pincode.length !== 6) return false;
            
            formData.aadharNumber = aadhar;
            formData.dob = dob;
            formData.pincode = pincode;
            return true;
            
        case '3':
            if (!formData.planSpeed || !formData.planValidity) {
                showError('कृपया स्पीड और वैधता प्लान चुनें');
                return false;
            }
            return true;
            
        case '4':
            if (!formData.iptvApp) {
                showError('कृपया IPTV ऐप चुनें');
                return false;
            }
            if (formData.iptvApp === 'onyxplay' && !formData.iptvCategory) {
                showError('कृपया भाषा चुनें');
                return false;
            }
            if (formData.iptvApp === 'ziggtv' && !formData.iptvCategory) {
                showError('कृपया पैकेज चुनें');
                return false;
            }
            return true;
    }
    return true;
}

// Plan Selection
function selectPlan(type, element) {
    const cards = document.querySelectorAll(`#${type}Plans .plan-card`);
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    if (type === 'speed') {
        formData.planSpeed = element.dataset.value + ' Mbps';
    } else {
        formData.planValidity = element.dataset.value + ' Month' + (element.dataset.value > 1 ? 's' : '');
    }
    
    // Add animation
    element.style.transform = 'scale(1.1)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// IPTV Selection
function selectIPTVApp(app) {
    const cards = document.querySelectorAll('.iptv-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.target.closest('.iptv-card').classList.add('selected');
    
    formData.iptvApp = app;
    
    // Show respective options
    if (app === 'onyxplay') {
        document.getElementById('languageSection').style.display = 'block';
        document.getElementById('packageSection').style.display = 'none';
        formData.iptvCategory = '';
    } else {
        document.getElementById('packageSection').style.display = 'block';
        document.getElementById('languageSection').style.display = 'none';
        formData.iptvCategory = '';
    }
}

function selectLanguage(element) {
    const langs = document.querySelectorAll('.lang-card');
    langs.forEach(lang => lang.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

function selectPackage(element) {
    const packages = document.querySelectorAll('.package-card');
    packages.forEach(pkg => pkg.classList.remove('selected'));
    element.classList.add('selected');
    formData.iptvCategory = element.textContent;
}

// Image Upload
function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showError('कृपया केवल इमेज फाइल अपलोड करें');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showError('फाइल साइज 5MB से कम होनी चाहिए');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Aadhar Preview">`;
        formData.aadharPhoto = file;
        formData.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Submit Form
async function submitForm() {
    // Validate all steps
    if (!validateStep(4)) return;
    
    // Show loading
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> प्रोसेस हो रहा है...';
    submitBtn.disabled = true;
    
    try {
        // Get area name from pincode
        const areaName = await getAreaFromPincode(formData.pincode);
        
        // Prepare data for Google Sheets
        const submissionData = {
            timestamp: new Date().toISOString(),
            operatorName: formData.operatorName,
            customerName: formData.customerName,
            phoneNumber: formData.phoneNumber,
            emailId: formData.emailId,
            aadharNumber: formData.aadharNumber,
            planSpeed: formData.planSpeed,
            planValidity: formData.planValidity,
            iptvApp: formData.iptvApp,
            areaName: areaName,
            dob: formData.dob,
            languageSelection: formData.iptvApp === 'onyxplay' ? formData.iptvCategory : '',
            iptvPackage: formData.iptvApp === 'ziggtv' ? formData.iptvCategory : '',
            imageData: formData.imageUrl
        };
        
        // Send to Google Apps Script
        const response = await fetch('YOUR_APPS_SCRIPT_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });
        
        if (response.ok) {
            showSuccess();
        } else {
            throw new Error('Submission failed');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError('सबमिशन में त्रुटि। कृपया बाद में पुनः प्रयास करें।');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Get Area from Pincode
async function getAreaFromPincode(pincode) {
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
            return data[0].PostOffice[0].District;
        }
    } catch (error) {
        console.error('Error fetching area:', error);
    }
    return 'Area not found';
}

// Show Success Message
function showSuccess() {
    document.querySelector('.form-container').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    
    // Send Telegram notification
    sendTelegramNotification();
}

// Send Telegram Notification
async function sendTelegramNotification() {
    const message = `🚀 *नया कनेक्शन रिक्वेस्ट*
    
👤 *ग्राहक:* ${formData.customerName}
📞 *फोन:* ${formData.phoneNumber}
📧 *ईमेल:* ${formData.emailId}
🆔 *आधार:* ${formData.aadharNumber}
⚡ *स्पीड:* ${formData.planSpeed}
📅 *वैधता:* ${formData.planValidity}
📺 *IPTV:* ${formData.iptvApp} - ${formData.iptvCategory}
📍 *पिन कोड:* ${formData.pincode}

✅ सबमिट किया गया: ${new Date().toLocaleString()}`;
    
    const chatIds = ["6582960717", "2028547811", "1492277630"];
    const token = "8428090705:AAGyI-23H2czhusnbZ6nNP324_DdqUU-DRI";
    
    for (const chatId of chatIds) {
        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
        } catch (error) {
            console.error('Telegram error:', error);
        }
    }
}

// Reset Form
function resetForm() {
    formData = {
        operatorName: '',
        customerName: '',
        phoneNumber: '',
        emailId: '',
        aadharNumber: '',
        dob: '',
        pincode: '',
        aadharPhoto: null,
        planSpeed: '',
        planValidity: '',
        iptvApp: '',
        iptvCategory: '',
        imageUrl: ''
    };
    
    // Reset form fields
    document.getElementById('step1').reset();
    document.getElementById('step2').reset();
    document.getElementById('step3').reset();
    document.getElementById('step4').reset();
    
    // Reset selections
    document.querySelectorAll('.plan-card, .iptv-card, .lang-card, .package-card').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Reset image preview
    document.getElementById('imagePreview').innerHTML = '';
    
    // Hide sections
    document.getElementById('languageSection').style.display = 'none';
    document.getElementById('packageSection').style.display = 'none';
    
    // Show form, hide success
    document.getElementById('successMessage').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';
    
    // Go to step 1
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    document.getElementById('step1').classList.add('active');
    document.getElementById('step1').style.display = 'block';
    
    updateProgressBar(1);
}

// Error Handling
function showError(message) {
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <i class="fas fa-times" onclick="this.parentElement.remove()"></i>
    `;
    errorEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4757;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
    `;
    
    document.body.appendChild(errorEl);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorEl.parentNode) {
            errorEl.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => errorEl.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-100px); opacity: 0; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .error-message {
        font-size: 0.9rem;
    }
    
    .error-message i.fa-times {
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);
