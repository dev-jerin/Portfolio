document.addEventListener("DOMContentLoaded", () => {
    const CONSTANTS = {
        TYPING_SPEED: 150,
        DELETING_SPEED: 100,
        PAUSE_DURATION: 2000,
        ANIMATION_DURATION: 600,
    };

    // Section Visibility
    function initSectionVisibility() {
        const sections = document.querySelectorAll(".section");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    document.title = `Jerin Sigi - ${entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1)}`;
                } else {
                    entry.target.classList.remove("visible");
                }
            });
        }, { threshold: 0.1 });
        sections.forEach(section => observer.observe(section));
    }

    // Hamburger Menu
    function initHamburgerMenu() {
        const hamburger = document.querySelector(".hamburger");
        const navUl = document.querySelector("nav ul");
        if (hamburger && navUl) {
            hamburger.addEventListener("click", () => {
                navUl.classList.toggle("active");
            });
        }
    }

    // Interactive Background
    function initInteractiveBackground() {
        const bubbleContainer = document.querySelector(".bubble-container");
        for (let i = 0; i < 30; i++) { // Increased to 30 bubbles
            const bubble = document.createElement("div");
            bubble.classList.add("bubble");
            const size = Math.random() * 40 + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.background = `rgba(0, 255, 185, ${Math.random() * 0.5 + 0.2})`;
            bubble.style.bottom = `${Math.random() * 100}%`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animation = `float ${Math.random() * 8 + 4}s infinite ease-in-out`;
            bubbleContainer.appendChild(bubble);
        }
    }

    // Skill Box Interaction
    function initSkillBoxes() {
        const skillBoxes = document.querySelectorAll(".skill-box");
        document.addEventListener("mousemove", (e) => {
            skillBoxes.forEach(box => {
                const rect = box.getBoundingClientRect();
                const boxX = rect.left + rect.width / 2;
                const boxY = rect.top + rect.height / 2;
                const dx = (e.clientX - boxX) / window.innerWidth * 20;
                const dy = (e.clientY - boxY) / window.innerHeight * 20;
                box.style.transform = `translate(${dx}px, ${dy}px)`;
            });
        });
    }

    // Education Box Interaction
    function initEducationBoxes() {
        const timelineContents = document.querySelectorAll(".timeline-content");
        document.addEventListener("mousemove", (e) => {
            timelineContents.forEach(content => {
                const rect = content.getBoundingClientRect();
                const contentX = rect.left + rect.width / 2;
                const contentY = rect.top + rect.height / 2;
                const dx = (e.clientX - contentX) / window.innerWidth * 20;
                const dy = (e.clientY - contentY) / window.innerHeight * 20;
                content.style.transform = `translate(${dx}px, ${dy}px)`;
            });
        });
    }

    // Typewriter Effect
    function initTypewriter() {
        const typewriter = document.getElementById("typewriter");
        const phrases = ["Tech Enthusiast", "Developer"];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            if (!isDeleting && charIndex <= currentPhrase.length) {
                typewriter.innerHTML = currentPhrase.substring(0, charIndex) + "<span style='color: #00FFB9;'>|</span>";
                charIndex++;
                setTimeout(type, CONSTANTS.TYPING_SPEED);
            } else if (!isDeleting && charIndex === currentPhrase.length + 1) {
                setTimeout(() => { isDeleting = true; type(); }, CONSTANTS.PAUSE_DURATION);
            } else if (isDeleting && charIndex >= 0) {
                typewriter.innerHTML = currentPhrase.substring(0, charIndex) + "<span style='color: #00FFB9;'>|</span>";
                charIndex--;
                setTimeout(type, CONSTANTS.DELETING_SPEED);
            } else if (isDeleting && charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                charIndex = 0;
                setTimeout(type, CONSTANTS.TYPING_SPEED);
            }
        }
        type();
    }

    // Age Calculation
    function initAge() {
        function calculateAge(birthday) {
            const today = new Date();
            const birthDate = new Date(birthday);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
            return age;
        }
        document.getElementById("age").textContent = calculateAge("2005-05-13");
    }

    // Skills Progress Animation
    function initSkillsProgress() {
        const progressBars = document.querySelectorAll(".progress-fill");
        const percentageElements = document.querySelectorAll(".skill-percentage");
        const animatePercentage = (element, target) => {
            let current = 0;
            const increment = target / 100;
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                element.textContent = Math.round(current) + "%";
            }, 10); // Adjusted for faster animation
        };
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBars.forEach(bar => bar.style.width = bar.getAttribute("data-percentage") + "%");
                    percentageElements.forEach(element => animatePercentage(element, parseInt(element.getAttribute("data-target"))));
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        skillsObserver.observe(document.querySelector("#skills"));
    }

    // Contact Form Handling
    function initContactForm() {
        const contactForm = document.getElementById("contact-form");
        const confirmation = document.getElementById("confirmation");
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const counter = document.getElementById("message-counter");

        messageInput.addEventListener("input", () => {
            counter.textContent = `${messageInput.value.length}/1000 characters`;
        });

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector("button");
            submitButton.disabled = true;
            submitButton.textContent = "Sending…";

            try {
                const response = await fetch("https://formspree.io/f/movevjqd", {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { "Accept": "application/json" }
                });
                if (response.ok) {
                    contactForm.reset();
                    confirmation.textContent = "Thank you! Your message has been sent successfully.";
                    confirmation.style.color = "#00FFB9";
                    confirmation.classList.add("success");
                    confirmation.style.display = "block";
                    const bubbles = submitButton.querySelectorAll(".button-bubble");
                    bubbles.forEach(bubble => bubble.style.display = "block");
                    setTimeout(() => {
                        confirmation.style.display = "none";
                        confirmation.classList.remove("success");
                        bubbles.forEach(bubble => bubble.style.display = "none");
                    }, 3000);
                    submitButton.textContent = "Send Message";
                } else {
                    throw new Error("Submission failed");
                }
            } catch (error) {
                confirmation.textContent = "Oops! Something went wrong. Please try again later.";
                confirmation.style.color = "#FF007A";
                confirmation.style.display = "block";
                setTimeout(() => { confirmation.style.display = "none"; }, 3000);
                submitButton.textContent = "Send Message";
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Navigation Enhancement
    function initNavigation() {
        const navLinks = document.querySelectorAll("nav ul li a");
        const navUl = document.querySelector("nav ul");
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = link.getAttribute("href").substring(1);
                const targetSection = document.getElementById(targetId);
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: "smooth"
                });
                if (window.innerWidth <= 768) {
                    navUl.classList.remove("active");
                }
            });
        });

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle("active", link.getAttribute("href").substring(1) === entry.target.id);
                    });
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll(".section").forEach(section => sectionObserver.observe(section));
    }

    // Scroll to Top
    function initScrollToTop() {
        function debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        }
        const scrollTopBtn = document.getElementById("scroll-top");
        window.addEventListener("scroll", debounce(() => {
            scrollTopBtn.classList.toggle("visible", window.scrollY > 300);
        }, 100));
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            scrollTopBtn.classList.add("active");
            window.addEventListener("scroll", () => {
                if (window.scrollY === 0) {
                    scrollTopBtn.classList.remove("active");
                }
            });
        });
    }

    // Theme Toggle
    function initThemeToggle() {
        const toggleButton = document.getElementById("theme-toggle");
        const sunIcon = document.getElementById("sun-icon");
        const moonIcon = document.getElementById("moon-icon");

        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLightMode = document.body.classList.contains("light-mode");
            sunIcon.style.display = isLightMode ? "none" : "block";
            moonIcon.style.display = isLightMode ? "block" : "none";
            localStorage.setItem("theme", isLightMode ? "light" : "dark");
        });

        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light-mode");
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        }
    }

    // Initialize Features
    initSectionVisibility();
    initHamburgerMenu();
    initInteractiveBackground();
    initSkillBoxes();
    initEducationBoxes();
    initTypewriter();
    initAge();
    initSkillsProgress();
    initContactForm();
    initNavigation();
    initScrollToTop();
    initThemeToggle();
});
