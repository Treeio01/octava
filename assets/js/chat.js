
// Assuming your HTML includes a file input:
// <input type="file" id="photo_input" accept="image/*" />

// -------------- Chat Script --------------
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat');
    const messageInput = document.getElementById('message_input');
    const sendButton = document.getElementById('send');
    const clearButton = document.getElementById('clear');
    const photoInput = document.getElementById('photo_input');
    const email = document.getElementById("email");
    email.innerText = localStorage.getItem("email");
  
    // Welcome and standard messages
    const welcomeMessage = "Hello! Let's begin. Tell me your investment goals, and I'll build a strategy just for you.";
    const standardResponse = "Your request is received. The platform will soon be ready, and we can begin shaping your strategy.";
    let firstInteractionComplete = false;

    // Avatar helper
    function getUserEmail() {
        return localStorage.getItem('email') || '';
    }
    function getAvatarLetter() {
        const email = getUserEmail();
        return email ? email.charAt(0).toUpperCase() : 'U';
    }

    // Save and load chat (including images)
    function saveChat() {
        const messages = [];
        chatContainer.querySelectorAll('[data-type]').forEach(el => {
            const type = el.getAttribute('data-type');
            if (type === 'message') {
                if (el.querySelector('img')) {
                    messages.push({ type: 'image', src: el.querySelector('img').src });
                } else {
                    messages.push({ type: 'message', message: el.querySelector('span').textContent });
                }
            } else if (type === 'bot') {
                messages.push({ type: 'bot', message: el.querySelector('span').textContent });
            }
        });
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        localStorage.setItem('firstInteractionComplete', firstInteractionComplete);
    }

    function loadChat() {
        const saved = localStorage.getItem('chatHistory');
        const firstDone = localStorage.getItem('firstInteractionComplete');
        if (firstDone === 'true') firstInteractionComplete = true;
        if (saved) {
            JSON.parse(saved).forEach(msg => {
                if (msg.type === 'bot') addBotMessage(msg.message);
                else if (msg.type === 'message') addUserMessage(msg.message);
                else if (msg.type === 'image') addUserImageMessage(msg.src);
            });
        } else {
            addBotMessage(welcomeMessage);
        }
    }

    // Standard user text message
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.setAttribute('data-type', 'message');
        div.className = 'flex justify-end gap-3 items-center';
        div.innerHTML = `
            <div class="flex justify-center min-w-[48px] min-h-[48px] order-2 bg-primary rounded-full py-3">
                <span class="font-Inter text-white font-medium text-xl">${getAvatarLetter()}</span>
            </div>
            <div class="flex order-1 max-w-[510px] py-2.5 px-4 bg-primary rounded-full">
                <span class="text-[12px] text-black">${text}</span>
            </div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        saveChat();
    }

    // User image message
    function addUserImageMessage(src) {
        const div = document.createElement('div');
        div.setAttribute('data-type', 'message');
        div.className = 'flex justify-end gap-3 items-center';
        div.innerHTML = `
            <div class="flex justify-center min-w-[48px] min-h-[48px] order-2 bg-primary rounded-full py-3">
                <span class="font-Inter text-white font-medium text-xl">${getAvatarLetter()}</span>
            </div>
            <div class="flex order-1 max-w-[510px] p-2 bg-primary rounded-lg">
                <img src="${src}" alt="Uploaded image" class="max-w-full h-auto rounded" />
            </div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        setTimeout(() => {
            if (!firstInteractionComplete) firstInteractionComplete = true;
            addBotMessage(standardResponse);
        }, 1000);
        saveChat();
    }

    // Bot message
    function addBotMessage(text) {
        const div = document.createElement('div');
        div.setAttribute('data-type', 'bot');
        div.className = 'flex gap-3 items-center';
        div.innerHTML = `
            <div class="flex bg-primary rounded-full py-2 px-2.5"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 28 32" fill="none">
                    <g clip-path="url(#clip0_6_295)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8218 0.00189532C13.9173 0.00684131 14.0102 0.0389902 14.14 0.103288C14.2403 0.155221 14.4459 0.268979 14.5928 0.358006C14.7396 0.444562 14.9599 0.57563 15.0822 0.647347C15.2046 0.719064 15.4543 0.867445 15.6403 0.97873C15.8238 1.09001 15.9804 1.17904 15.9879 1.17904C15.9952 1.17904 16.0294 1.19883 16.0686 1.22603C16.1052 1.25076 16.2448 1.33484 16.3794 1.41398C16.514 1.49311 16.7832 1.65139 16.979 1.76762C17.1749 1.88384 17.3731 2.00254 17.4195 2.03222C17.4661 2.0619 17.6546 2.17566 17.8356 2.28446C18.0168 2.39328 18.3497 2.59606 18.5772 2.73456C18.8024 2.87058 18.9933 2.98434 19.0031 2.98434C19.0153 2.98434 19.1328 3.0511 19.2674 3.13024C19.402 3.20938 19.561 3.30088 19.6223 3.33549C19.6835 3.37011 19.8695 3.47893 20.0384 3.57786C20.2072 3.67677 20.4984 3.84987 20.6869 3.96117C20.8754 4.07245 21.3429 4.34942 21.7271 4.57941C22.1114 4.80693 22.5837 5.09133 22.7796 5.21003C22.9754 5.32874 23.2128 5.4697 23.3057 5.5241C23.3987 5.5785 23.6141 5.70462 23.7831 5.80355C23.9519 5.90246 24.182 6.036 24.297 6.1003C24.4119 6.16461 24.7694 6.36986 25.0925 6.55781C25.4155 6.74576 25.7581 6.94606 25.8511 7.00294C25.9442 7.0623 26.0615 7.13155 26.1081 7.15875C26.1547 7.18595 26.375 7.31208 26.5976 7.44067C26.8203 7.56926 27.0797 7.71765 27.1728 7.76958C27.2658 7.8215 27.4322 7.92043 27.5399 7.99214C27.6476 8.06139 27.7944 8.17021 28 8.33837L27.9853 15.7944C27.978 19.8947 27.9609 23.3742 27.9314 23.8045L27.8336 23.9059C27.7797 23.9627 27.6427 24.0618 27.5276 24.1259C27.4126 24.1928 27.0822 24.3882 26.7934 24.5613C26.5047 24.7344 26.1741 24.9322 26.0592 24.9989C25.9442 25.0682 25.6357 25.2462 25.3739 25.3971C25.1119 25.5454 24.7743 25.7408 24.6273 25.8299C24.4805 25.9189 24.3264 26.0104 24.2848 26.0326C24.2431 26.0549 24.1502 26.1093 24.0767 26.1538C24.0034 26.1984 23.925 26.2429 23.9053 26.2552C23.8858 26.2675 23.7707 26.3344 23.6484 26.4061C23.526 26.4754 23.2079 26.6632 22.9386 26.819C22.6694 26.9749 22.3512 27.1603 22.2288 27.232C22.1065 27.3013 21.8202 27.4694 21.5925 27.603C21.3649 27.7341 20.9243 27.9962 20.6136 28.1842C20.3027 28.3696 19.6149 28.7778 19.0839 29.0869C18.5527 29.396 17.8798 29.7891 17.5909 29.9598C17.302 30.1304 16.8665 30.3877 16.6242 30.5334C16.3819 30.6794 16.0024 30.9045 15.7798 31.0331C15.5571 31.1616 15.2487 31.3397 15.0945 31.4238C14.9403 31.5104 14.7029 31.6414 14.5683 31.7131C14.4337 31.7874 14.2574 31.8813 14.0298 32L13.8952 31.9456C13.8218 31.9134 13.5844 31.7947 13.369 31.676C13.1536 31.5598 12.8795 31.4066 12.7572 31.3373C12.6348 31.2654 12.4879 31.1814 12.4267 31.1469C12.3655 31.1122 12.1012 30.9589 11.8393 30.8056C11.5775 30.6522 11.2471 30.4568 11.1051 30.3728C10.9632 30.2886 10.6058 30.076 10.3097 29.9029C10.0135 29.7274 9.34782 29.3366 8.82895 29.0299C8.31009 28.7258 7.87445 28.4661 7.8622 28.4562C7.84996 28.4462 7.78878 28.4093 7.72759 28.3771C7.66641 28.3424 7.46327 28.2213 7.27481 28.1099C7.08636 27.9962 6.76084 27.8058 6.55281 27.6821C6.34477 27.561 5.99233 27.3533 5.76962 27.2197C5.5469 27.0886 5.18957 26.876 4.97418 26.7498C4.75881 26.6237 4.38434 26.4037 4.14205 26.2602C3.89974 26.1168 3.57423 25.9262 3.42004 25.8349C3.26585 25.7434 3.09452 25.6443 3.04069 25.6123C2.98685 25.5802 2.82776 25.4861 2.6858 25.4021C2.54385 25.3179 2.32357 25.1869 2.19631 25.1126C2.06904 25.036 1.60647 24.759 1.16837 24.497C0.730273 24.2347 0.30686 23.9752 0.228541 23.9206C0.128194 23.8515 0.07435 23.7971 0.0596652 23.7451C0.0498753 23.703 0.0278481 23.0254 0.0156107 22.2366C0.000925862 21.3736 -0.00396908 18.3738 0.00337333 14.7187C0.0107157 10.5517 0.022953 8.56094 0.0425329 8.40019C0.0572177 8.2716 0.0816924 8.15042 0.0988248 8.13064C0.11351 8.11085 0.265253 8.00451 0.434128 7.89323C0.603004 7.78194 1.01663 7.52475 1.35193 7.31949C1.68968 7.1167 2.22323 6.79522 2.53896 6.60726C2.85469 6.41933 3.14837 6.24621 3.18753 6.22395C3.2267 6.2017 3.50326 6.036 3.7994 5.86043C4.09554 5.68237 4.39903 5.50184 4.47246 5.45733C4.54588 5.41282 4.91544 5.19272 5.29236 4.96768C5.66927 4.74262 6.09268 4.49038 6.23464 4.4063C6.37659 4.32222 6.61399 4.18126 6.76084 4.09222C6.90769 4.00568 7.39963 3.71386 7.84996 3.4443C8.30031 3.17475 8.71882 2.92251 8.78001 2.88541C8.84119 2.84832 9.13734 2.67026 9.44083 2.48973C9.74432 2.3092 10.2167 2.0248 10.4932 1.85912C10.7698 1.69342 11.2911 1.37936 11.6558 1.16173C12.0205 0.944107 12.5589 0.622618 12.855 0.444562C13.1512 0.266506 13.4302 0.103288 13.4743 0.0785582C13.5183 0.0538283 13.5844 0.0241523 13.6211 0.0142603C13.6578 0.00189532 13.7484 -0.00305068 13.8218 0.00189532ZM13.2466 4.98746C13.0851 5.07402 12.7596 5.25454 12.5246 5.39056C12.2897 5.52658 11.9642 5.71451 11.8026 5.81096C11.6411 5.90741 11.2128 6.16461 10.8481 6.3847C10.4835 6.6048 10.0821 6.84467 9.95479 6.92134C9.82753 6.99554 9.58522 7.13896 9.41635 7.23789C9.24748 7.3368 9.00517 7.48024 8.8779 7.55443C8.75063 7.63109 8.52302 7.76464 8.37618 7.85118C8.22932 7.94021 8.05067 8.05891 7.97968 8.11333C7.9087 8.17021 7.85242 8.22709 7.84996 8.23944C7.84996 8.25429 7.89891 8.31117 7.96011 8.37051C8.02129 8.42739 8.18283 8.54858 8.32233 8.64008C8.45939 8.73157 8.82162 8.95909 9.12754 9.14704C9.43594 9.33499 9.69047 9.4883 9.6978 9.4883C9.70515 9.4883 9.77857 9.53035 9.8618 9.58475C9.94744 9.63669 10.1384 9.75045 10.2852 9.83947C10.432 9.92851 10.6376 10.0472 10.738 10.1066C10.8383 10.1659 11.1076 10.3242 11.3376 10.4602C11.5677 10.5962 12.0229 10.8682 12.3533 11.0661C12.6837 11.2639 13.2222 11.5904 13.5526 11.7882C13.883 11.9885 14.4092 12.3026 14.7225 12.4905C15.0333 12.676 15.2927 12.8269 15.2976 12.8269C15.3001 12.8269 15.4127 12.8887 15.5473 12.9629C15.6819 13.0395 15.8385 13.1484 15.8948 13.2052C15.9731 13.2844 16.0074 13.3388 16.027 13.4327C16.0417 13.5045 16.0612 14.1079 16.0734 14.8671C16.0857 15.5892 16.0956 18.0746 16.0979 20.3942C16.0979 22.7139 16.1101 24.9222 16.1225 25.3032C16.1347 25.684 16.1542 26.003 16.164 26.0128C16.1738 26.0227 16.2398 26.0104 16.306 25.9882C16.3745 25.9659 16.5336 25.8867 16.6608 25.8126C16.7881 25.7408 17.1014 25.5554 17.3584 25.4021C17.6155 25.2486 17.9605 25.0435 18.1294 24.9445C18.2982 24.8456 18.5405 24.7046 18.6678 24.628C18.795 24.5538 18.9786 24.445 19.0717 24.3882C19.1646 24.3312 19.4632 24.1531 19.7324 23.9925C20.0016 23.8317 20.3272 23.6387 20.4544 23.5597C20.5817 23.483 20.8241 23.3371 20.9929 23.2382C21.1617 23.1392 21.4579 22.9611 21.6538 22.8474C21.8495 22.7312 22.1236 22.568 22.2655 22.4838C22.4076 22.3998 22.6596 22.2515 22.8286 22.1525C22.9974 22.0512 23.2006 21.9325 23.2813 21.883C23.3621 21.836 23.5162 21.7395 23.6239 21.6678C23.7316 21.5936 23.8736 21.4824 23.9372 21.4155L24.0547 21.2968C24.0326 18.04 24.0228 16.1134 24.0155 14.9165C24.0081 13.7196 23.9959 12.3298 23.991 11.8253C23.9837 11.3233 23.969 10.8608 23.9592 10.8015C23.9446 10.7026 23.9299 10.6828 23.8074 10.6061C23.7341 10.5591 23.4354 10.3811 23.1467 10.2104C22.8579 10.0423 22.5226 9.84442 22.4002 9.7727C22.2777 9.70099 21.9596 9.51304 21.6905 9.35229C21.4213 9.19155 21.152 9.0308 21.0907 8.99371C21.0296 8.95662 20.8484 8.84781 20.6869 8.75136C20.5254 8.65738 20.195 8.46202 19.9527 8.32106C19.7104 8.17762 19.2381 7.89818 18.9003 7.69786C18.565 7.49507 18.1783 7.26755 18.0437 7.18842C17.9091 7.10928 17.6398 6.95102 17.4441 6.83726C17.2482 6.72102 17.0402 6.59986 16.979 6.56523C16.9178 6.53061 16.7146 6.4119 16.5262 6.29814C16.3379 6.18686 16.0783 6.03354 15.9511 5.95686C15.8238 5.88269 15.6794 5.79859 15.6329 5.77139C15.5864 5.74419 15.4763 5.67989 15.3882 5.63043C15.3001 5.5785 15.1238 5.4771 14.9966 5.40293C14.8693 5.32874 14.6417 5.19766 14.4948 5.1111C14.348 5.02454 14.1326 4.90584 14.0176 4.8465C13.9026 4.78714 13.7973 4.74016 13.7851 4.74016C13.7728 4.74262 13.7117 4.76242 13.6505 4.78715C13.5893 4.80941 13.4082 4.9009 13.2466 4.98746ZM3.92912 11.573C3.91443 11.9663 3.91199 13.9125 3.91934 16.524C3.92912 18.8907 3.9438 20.9358 3.95359 21.0669L3.97073 21.3067C4.14205 21.4848 4.31338 21.6109 4.46022 21.7024C4.60706 21.7965 4.91055 21.977 5.13328 22.1056C5.356 22.2341 5.75248 22.4666 6.01436 22.62C6.27624 22.7733 6.65071 22.9933 6.84651 23.1096C7.0423 23.2258 7.2944 23.3766 7.40942 23.4434C7.52445 23.5126 7.67865 23.6018 7.75207 23.6462C7.82549 23.6883 8.32234 23.9826 8.85343 24.3016C9.38453 24.6181 10.0625 25.0237 10.3586 25.1992C10.6548 25.3749 11.0243 25.5925 11.1785 25.6814C11.3327 25.7706 11.5848 25.909 11.7341 25.9882C11.9789 26.1142 12.0131 26.1266 12.0278 26.0896C12.0376 26.0648 12.0498 23.708 12.0523 20.8517C12.0596 16.7021 12.0547 15.651 12.0302 15.6263C12.0131 15.6065 11.9226 15.5447 11.8271 15.4878C11.7317 15.4284 11.3082 15.1688 10.8848 14.9116C10.4614 14.6519 9.71739 14.2043 9.23279 13.915C8.74819 13.6256 8.22443 13.314 8.07024 13.2225C7.91605 13.131 7.59053 12.9381 7.34824 12.7972C7.10594 12.6537 6.85875 12.5103 6.79755 12.4757C6.73636 12.4411 6.55526 12.3347 6.39372 12.2408C6.23219 12.1468 5.84549 11.9193 5.53711 11.7387C5.22873 11.5582 4.86894 11.348 4.74168 11.2738C4.61441 11.1996 4.41616 11.0908 4.30114 11.029C4.1861 10.9672 4.06863 10.9078 4.03681 10.8954C4.00498 10.8831 3.97807 10.8856 3.96827 10.9004C3.95848 10.9152 3.94135 11.2169 3.92912 11.573Z" fill="white"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_6_295">
                            <rect width="28" height="32" fill="white" />
                        </clipPath>
                    </defs>
                </svg></div>
            <div class="flex max-w-[510px] py-2.5 px-4 bg-white/4 border border-white/4 rounded-full">
                <span class="text-[12px] text-white">${text}</span>
            </div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
        saveChat();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Handle sending text
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        messageInput.value = '';
        setTimeout(() => {
            if (!firstInteractionComplete) firstInteractionComplete = true;
            addBotMessage(standardResponse);
        }, 1000);
    }

    // Handle image upload
    photoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => addUserImageMessage(reader.result);
        reader.readAsDataURL(file);
    });

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
    clearButton.addEventListener('click', () => {
        messageInput.value = '';
    });

    // Initialize chat
    loadChat();
    messageInput.focus();
});
