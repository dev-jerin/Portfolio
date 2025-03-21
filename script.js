document.addEventListener("DOMContentLoaded", () => {
    // Section Visibility
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                document.title = `Jerin Sigi - ${entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1)}`;
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    // Skill Box Interaction
    const skillBoxes = document.querySelectorAll(".skill-box");
    skillBoxes.forEach(box => {
        box.addEventListener("click", () => {
            box.classList.add("clicked");
            setTimeout(() => box.classList.remove("clicked"), 600);
        });
    });

    // Typewriter Effect
    const typewriter = document.getElementById("typewriter");
    const phrases = ["Tech Enthusiast", "Developer"];
    let phraseIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0;
    const typingSpeed = 150, deletingSpeed = 100, pauseDuration = 1000;

    function type(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        const currentPhrase = phrases[phraseIndex];
        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (delta >= delay) {
            typewriter.innerHTML = !isDeleting
                ? currentPhrase.substring(0, charIndex + 1) + "<span style='color: #00FFB9;'>|</span>"
                : currentPhrase.substring(0, charIndex - 1) + "<span style='color: #00FFB9;'>|</span>";
            charIndex += isDeleting ? -1 : 1;
            if (!isDeleting && charIndex === currentPhrase.length) {
                setTimeout(() => { isDeleting = true; }, pauseDuration);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            lastTime = timestamp;
        }
        requestAnimationFrame(type);
    }
    requestAnimationFrame(type);

    // Age Calculation
    function calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    }
    document.getElementById("age").textContent = calculateAge("2005-05-13");

    // Skills Progress Animation
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

    // Contact Form Handling
    const contactForm = document.getElementById("contact-form");
    const confirmation = document.getElementById("confirmation");

    // Function to create or get error span for an input
    function getErrorSpan(input) {
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains("error")) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error");
            errorSpan.style.color = "#FF007A";
            errorSpan.style.fontSize = "14px";
            input.insertAdjacentElement("afterend", errorSpan);
        }
        return errorSpan;
    }

    // Real-time validation for each input
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const value = input.value.trim();
            const errorSpan = getErrorSpan(input);

            switch (input.name) {
                case "name":
                    if (!value) {
                        errorSpan.textContent = "Name is required.";
                    } else if (!/^[a-zA-Z\s-]{2,50}$/.test(value)) {
                        if (value.length < 2) {
                            errorSpan.textContent = "Name must be at least 2 characters long.";
                        } else if (value.length > 50) {
                            errorSpan.textContent = "Name must be 50 characters or less.";
                        } else {
                            errorSpan.textContent = "Name can only contain letters, spaces, or hyphens.";
                        }
                    } else {
                        errorSpan.textContent = "";
                    }
                    break;

                case "email":
                    if (!value) {
                        errorSpan.textContent = "Email is required.";
                    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) {
                        errorSpan.textContent = "Please enter a valid email (e.g., user@domain.com).";
                    } else {
                        errorSpan.textContent = "";
                    }
                    break;

                case "subject":
                    if (!value) {
                        errorSpan.textContent = "Subject is required.";
                    } else if (!/^[\w\s.,!?()-]{3,100}$/.test(value)) {
                        if (value.length < 3) {
                            errorSpan.textContent = "Subject must be at least 3 characters long.";
                        } else if (value.length > 100) {
                            errorSpan.textContent = "Subject must be 100 characters or less.";
                        } else {
                            errorSpan.textContent = "Subject can only contain letters, numbers, or basic punctuation.";
                        }
                    } else {
                        errorSpan.textContent = "";
                    }
                    break;

                case "message":
                    if (!value) {
                        errorSpan.textContent = "Message is required.";
                    } else if (!/^[\s\S]{5,1000}$/.test(value)) {
                        if (value.length < 5) {
                            errorSpan.textContent = `Message must be at least 5 characters long. (Currently ${value.length} characters)`;
                        } else if (value.length > 1000) {
                            errorSpan.textContent = "Message must be 1000 characters or less.";
                        }
                    } else {
                        errorSpan.textContent = "";
                    }
                    break;

                default:
                    errorSpan.textContent = "";
            }
            input.classList.toggle("invalid", errorSpan.textContent !== "");
        });
    });

    // Submission handling
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector("button");
        submitButton.disabled = true;

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
                confirmation.style.display = "block";
                const bubbles = submitButton.querySelectorAll(".button-bubble");
                bubbles.forEach(bubble => bubble.style.display = "block");
                setTimeout(() => {
                    confirmation.style.display = "none";
                    bubbles.forEach(bubble => bubble.style.display = "none");
                }, 3000);
            } else {
                throw new Error("Submission failed");
            }
        } catch (error) {
            confirmation.textContent = "Oops! Something went wrong. Please try again later.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
        } finally {
            submitButton.disabled = false;
        }
    });

    // Navigation Enhancement
    const navLinks = document.querySelectorAll("nav ul li a");
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href").substring(1) === entry.target.id);
                });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(section => sectionObserver.observe(section));

    // Scroll to Top
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
});
