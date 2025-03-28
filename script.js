document.addEventListener("DOMContentLoaded", () => {
    const CONSTANTS = {
        TYPING_SPEED: 150,
        DELETING_SPEED: 100,
        PAUSE_DURATION: 2000, // Increased for a longer pause
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
        let lastMove = 0;
        document.addEventListener("mousemove", (e) => {
            if (Date.now() - lastMove < 16) return;
            lastMove = Date.now();
            const bubbles = document.querySelectorAll(".bubble");
            bubbles.forEach(bubble => {
                const rect = bubble.getBoundingClientRect();
                const bubbleX = rect.left + rect.width / 2;
                const bubbleY = rect.top + rect.height / 2;
                const dx = (e.clientX - bubbleX) / window.innerWidth * 50;
                const dy = (e.clientY - bubbleY) / window.innerHeight * 50;
                bubble.style.transform = `translate(${dx}px, ${dy}px)`;
            });
        });
    }

    // Skill Box Interaction
    function initSkillBoxes() {
        const skillBoxes = document.querySelectorAll(".skill-box");
        skillBoxes.forEach(box => {
            const handleInteraction = () => {
                box.classList.add("clicked");
                setTimeout(() => box.classList.remove("clicked"), CONSTANTS.ANIMATION_DURATION);
            };
            box.addEventListener("click", handleInteraction);
            box.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleInteraction();
                }
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
            }, 20);
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
        const counter = document.createElement("span");
        counter.style.fontSize = "12px";
        counter.style.color = "#CCCCCC";
        counter.style.display = "block";
        counter.style.marginTop = "5px";
        messageInput.insertAdjacentElement("afterend", counter);
        messageInput.addEventListener("input", () => {
            counter.textContent = `${messageInput.value.length}/1000 characters`;
        });

        function getErrorSpan(input) {
            let errorSpan = input.nextElementSibling;
            if (input.name === "message" && errorSpan === counter) {
                errorSpan = counter.nextElementSibling;
            }
            if (!errorSpan || !errorSpan.classList.contains("error")) {
                errorSpan = document.createElement("span");
                errorSpan.classList.add("error");
                errorSpan.style.color = "#FF007A";
                errorSpan.style.fontSize = "14px";
                input.insertAdjacentElement("afterend", errorSpan);
            }
            return errorSpan;
        }

        const inputs = contactForm.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.addEventListener("input", () => {
                const value = input.value.trim();
                const errorSpan = getErrorSpan(input);

                switch (input.name) {
                    case "name":
                        if (!value) errorSpan.textContent = "Name is required.";
                        else if (!/^[a-zA-Z\s-]{2,50}$/.test(value)) {
                            if (value.length < 2) errorSpan.textContent = "Name must be at least 2 characters long.";
                            else if (value.length > 50) errorSpan.textContent = "Name must be 50 characters or less.";
                            else errorSpan.textContent = "Name can only contain letters, spaces, or hyphens.";
                        } else errorSpan.textContent = "";
                        break;
                    case "email":
                        if (!value) errorSpan.textContent = "Email is required.";
                        else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) errorSpan.textContent = "Please enter a valid email.";
                        else errorSpan.textContent = "";
                        break;
                    case "subject":
                        if (!value) errorSpan.textContent = "Subject is required.";
                        else if (!/^[\w\s.,!?()-]{3,100}$/.test(value)) {
                            if (value.length < 3) errorSpan.textContent = "Subject must be at least 3 characters long.";
                            else if (value.length > 100) errorSpan.textContent = "Subject must be 100 characters or less.";
                            else errorSpan.textContent = "Subject can only contain letters, numbers, or basic punctuation.";
                        } else errorSpan.textContent = "";
                        break;
                    case "message":
                        if (!value) errorSpan.textContent = "Message is required.";
                        else if (!/^[\s\S]{5,1000}$/.test(value)) {
                            if (value.length < 5) errorSpan.textContent = `Message must be at least 5 characters long. (Currently ${value.length})`;
                            else if (value.length > 1000) errorSpan.textContent = "Message must be 1000 characters or less.";
                        } else errorSpan.textContent = "";
                        break;
                    default:
                        errorSpan.textContent = "";
                }
                input.classList.toggle("invalid", errorSpan.textContent !== "");
            });
        });

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector("button");
            submitButton.disabled = true;
            submitButton.textContent = "Sending…";

            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const subject = contactForm.querySelector('input[name="subject"]').value.trim();
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();

            const nameValid = /^[a-zA-Z\s-]{2,50}$/.test(name);
            const emailValid = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
            const subjectValid = /^[\w\s.,!?()-]{3,100}$/.test(subject);
            const messageValid = /^[\s\S]{5,1000}$/.test(message);

            if (!nameValid || !emailValid || !subjectValid || !messageValid) {
                confirmation.textContent = "Please fix the errors above before submitting.";
                confirmation.style.color = "#FF007A";
                confirmation.style.display = "block";
                setTimeout(() => { confirmation.style.display = "none"; }, 3000);
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
                return;
            }

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
    initTypewriter();
    initAge();
    initSkillsProgress();
    initContactForm();
    initNavigation();
    initScrollToTop();
    initThemeToggle();
});
