/**
 * =============================================
 *  成功页面逻辑
 *  从 localStorage 读取订单数据并展示
 * =============================================
 */

/* ------------------------------------------
   DOM 元素缓存
------------------------------------------ */
const SUCCESS_DOM = {};

function cacheSuccessDOM() {
    SUCCESS_DOM.orderNumber = document.getElementById('successOrderNumber');
    SUCCESS_DOM.productName = document.getElementById('successProductName');
    SUCCESS_DOM.quantity = document.getElementById('successQuantity');
    SUCCESS_DOM.total = document.getElementById('successTotal');
    SUCCESS_DOM.successCircle = document.querySelector('.success-circle');
    SUCCESS_DOM.successCheck = document.querySelector('.success-check');
    SUCCESS_DOM.successGlow = document.querySelector('.success-glow');
    SUCCESS_DOM.successContent = document.querySelector('.success-content');
}

/* ------------------------------------------
   工具函数
------------------------------------------ */

/** 格式化货币 */
function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/* ------------------------------------------
   加载订单数据
------------------------------------------ */

/** 从 localStorage 读取并显示订单信息 */
function loadOrder() {
    const stored = localStorage.getItem('lastOrder');

    if (!stored) {
        // 没有订单数据，重定向回首页
        window.location.href = 'index.html';
        return false;
    }

    try {
        const order = JSON.parse(stored);

        // 填充订单详情
        SUCCESS_DOM.orderNumber.textContent = order.orderNumber || '--';
        SUCCESS_DOM.productName.textContent = order.product ? order.product.name : '--';
        SUCCESS_DOM.quantity.textContent = order.quantity || '--';
        SUCCESS_DOM.total.textContent = order.total ? formatCurrency(order.total) : '--';

        // 清除选中产品（防止重复下单）
        localStorage.removeItem('selectedProduct');

        return true;

    } catch (err) {
        console.error('Failed to parse order data:', err);
        window.location.href = 'index.html';
        return false;
    }
}

/* ------------------------------------------
   GSAP 成功动画序列
------------------------------------------ */

/** 播放成功页面的完整动画 */
function playSuccessAnimations() {
    const circle = SUCCESS_DOM.successCircle;
    const check = SUCCESS_DOM.successCheck;
    const glow = SUCCESS_DOM.successGlow;
    const content = SUCCESS_DOM.successContent;

    // 获取 SVG 路径长度（用于 stroke-dashoffset 动画）
    const circleLength = circle.getTotalLength();
    const checkLength = check.getTotalLength();

    // 设置初始状态
    gsap.set(circle, { strokeDasharray: circleLength, strokeDashoffset: circleLength });
    gsap.set(check, { strokeDasharray: checkLength, strokeDashoffset: checkLength });
    gsap.set(glow, { opacity: 0, scale: 0.5 });
    gsap.set(content, { opacity: 0 });

    // 构建动画时间线
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    // 1. 绘制圆圈
    tl.to(circle, {
        strokeDashoffset: 0,
        duration: 0.8
    });

    // 2. 光晕出现
    tl.to(glow, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.3');

    // 3. 绘制对勾
    tl.to(check, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: 'power2.out'
    }, '-=0.2');

    // 4. 整体图标弹跳
    tl.to('.success-icon-wrapper', {
        scale: 1.1,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
    }, '-=0.1');

    // 5. 内容渐入
    tl.to(content, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.1');

    // 6. 标题滑入
    tl.from('.success-heading', {
        y: 25,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3');

    // 7. 副标题滑入
    tl.from('.success-subheading', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.3');

    // 8. 订单详情卡片滑入
    tl.from('.order-details-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3');

    // 9. 详情行逐行出现
    tl.from('.order-detail-row', {
        x: -15,
        opacity: 0,
        stagger: 0.07,
        duration: 0.35,
        ease: 'power2.out'
    }, '-=0.3');

    // 10. 按钮滑入
    tl.from('.success-actions', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
    }, '-=0.15');

    // 11. 底部文字
    tl.from('.success-footer-note', {
        y: 15,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.out'
    }, '-=0.2');

    return tl;
}

/* ------------------------------------------
   背景装饰粒子（微妙的浮动效果）
------------------------------------------ */

function createFloatingParticles() {
    const container = document.querySelector('.bg-decor');
    if (!container) return;

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${4 + Math.random() * 6}px;
            height: ${4 + Math.random() * 6}px;
            border-radius: 50%;
            background: rgba(27, 67, 50, ${0.05 + Math.random() * 0.08});
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
        `;
        container.appendChild(particle);

        // 随机浮动动画
        gsap.to(particle, {
            y: -30 - Math.random() * 40,
            x: -10 + Math.random() * 20,
            opacity: 0,
            duration: 4 + Math.random() * 4,
            repeat: -1,
            delay: Math.random() * 3,
            ease: 'power1.out'
        });
    }
}

/* ------------------------------------------
   初始化
------------------------------------------ */

/** 成功页面初始化入口 */
function initializeSuccessPage() {
    cacheSuccessDOM();

    // 加载订单数据（失败则重定向）
    if (!loadOrder()) return;

    // 播放成功动画
    playSuccessAnimations();

    // 背景粒子
    createFloatingParticles();
}

// 页面就绪后启动
document.addEventListener('DOMContentLoaded', initializeSuccessPage);