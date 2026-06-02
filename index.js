/* ==========================================================================
   AIMM Consulting LLP - Modern Interactions JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------------------------------------------------
       1. Mobile Navigation Menu Toggle
       ---------------------------------------------------------------------- */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn-link');

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            
            mobileNavToggle.setAttribute('aria-expanded', !isOpened);
            document.body.classList.toggle('mobile-menu-active');
            primaryNav.classList.toggle('open');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('mobile-menu-active');
                primaryNav.classList.remove('open');
            });
        });
    }

    /* ----------------------------------------------------------------------
       2. Sticky Header Scroll Effect
       ---------------------------------------------------------------------- */
    const siteHeader = document.getElementById('site-header');
    
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Run initially in case page loaded scrolled down

    /* ----------------------------------------------------------------------
       3. Scroll-Linked Animations (Intersection Observer)
       ---------------------------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.scroll-reveal, .fade-in, .fade-in-up');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, we can unobserve if we only want it to animate once
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    /* ----------------------------------------------------------------------
       4. Numeric Statistics Counter Animation
       ---------------------------------------------------------------------- */
    const statsContainer = document.querySelector('.hero-stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out quad formula for smoother ending
                const easeProgress = progress * (2 - progress);
                const currentValue = Math.floor(easeProgress * target);
                
                stat.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target; // Ensure exact final value
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    if (statsContainer) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statsObserver.observe(statsContainer);
    }

    /* ----------------------------------------------------------------------
       5. Interactive FAQ Accordion
       ---------------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current FAQ item
            if (isActive) {
                faqItem.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ----------------------------------------------------------------------
       6. Lead Form Validation & Success Display
       ---------------------------------------------------------------------- */
    const leadForm = document.getElementById('lead-form');
    const formSuccess = document.getElementById('success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const formFields = leadForm ? leadForm.querySelectorAll('input[required], textarea[required]') : [];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        // Strip non-digits and check if there are 10 digits (common for India mobile phone formats)
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    };

    const validateField = (input) => {
        const group = input.parentElement;
        let isValid = true;

        if (input.value.trim() === '') {
            isValid = false;
        } else if (input.type === 'email') {
            isValid = validateEmail(input.value);
        } else if (input.type === 'tel') {
            isValid = validatePhone(input.value);
        }

        if (isValid) {
            group.classList.remove('invalid');
        } else {
            group.classList.add('invalid');
        }

        return isValid;
    };

    // Add live check on blur for cleaner user guidance
    formFields.forEach(field => {
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            const group = field.parentElement;
            if (group.classList.contains('invalid')) {
                validateField(field);
            }
        });
    });

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            
            formFields.forEach(field => {
                const isFieldValid = validateField(field);
                if (!isFieldValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Perform form animations & transitions
                leadForm.style.transition = 'opacity var(--transition-medium)';
                leadForm.style.opacity = '0';
                
                setTimeout(() => {
                    leadForm.style.display = 'none';
                    formSuccess.style.display = 'flex';
                    formSuccess.style.opacity = '0';
                    formSuccess.style.transition = 'opacity var(--transition-medium)';
                    
                    // Trigger reflow
                    formSuccess.offsetHeight;
                    formSuccess.style.opacity = '1';
                }, 300);
            }
        });
    }

    if (resetFormBtn && leadForm) {
        resetFormBtn.addEventListener('click', () => {
            leadForm.reset();
            formFields.forEach(field => {
                field.parentElement.classList.remove('invalid');
            });

            formSuccess.style.opacity = '0';
            setTimeout(() => {
                formSuccess.style.display = 'none';
                leadForm.style.display = 'flex';
                // Trigger reflow
                leadForm.offsetHeight;
                leadForm.style.opacity = '1';
            }, 300);
        });
    }
});
