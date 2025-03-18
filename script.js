document.addEventListener("DOMContentLoaded", () => {
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

    const skillBoxes = document.querySelectorAll(".skill-box");
    skillBoxes.forEach(box => {
        box.addEventListener("click", () => {
            box.classList.add("clicked");
            setTimeout(() => box.classList.remove("clicked"), 600);
        });
    });

    const typewriter = document.getElementById("typewriter");
    const phrases = ["Tech Enthusiast", "Developer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let lastTime = 0;
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const pauseDuration = 1000;

    function type(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        const currentPhrase = phrases[phraseIndex];
        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (delta >= delay) {
            if (!isDeleting) {
                typewriter.innerHTML = currentPhrase.substring(0, charIndex + 1) + "<span style='color: #00FFB9;'>|</span>";
                charIndex++;
                if (charIndex === currentPhrase.length) {
                    setTimeout(() => { isDeleting = true; }, pauseDuration);
                }
            } else {
                typewriter.innerHTML = currentPhrase.substring(0, charIndex - 1) + "<span style='color: #00FFB9;'>|</span>";
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            }
            lastTime = timestamp;
        }
        requestAnimationFrame(type);
    }
    requestAnimationFrame(type);

    function calculateAge(birthday) {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
        return age >= 0 ? age : 0;
    }
    const birthday = "2005-05-13";
    const ageElement = document.getElementById("age");
    ageElement.textContent = calculateAge(birthday);

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
                progressBars.forEach(bar => {
                    const percentage = bar.getAttribute("data-percentage");
                    bar.style.width = percentage + "%";
                });
                percentageElements.forEach(element => {
                    const target = parseInt(element.getAttribute("data-target"));
                    animatePercentage(element, target);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const skillsSection = document.querySelector("#skills");
    skillsObserver.observe(skillsSection);

    const contactForm = document.getElementById("contact-form");
    const confirmation = document.getElementById("confirmation");
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector("button");
        submitButton.disabled = true;

        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const subject = contactForm.querySelector('input[name="subject"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        if (name.length < 2) {
            confirmation.textContent = "Name must be at least 2 characters long.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
            submitButton.disabled = false;
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            confirmation.textContent = "Please enter a valid email address.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
            submitButton.disabled = false;
            return;
        }

        if (subject.length < 3) {
            confirmation.textContent = "Subject must be at least 3 characters long.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
            submitButton.disabled = false;
            return;
        }

        if (message.length < 10) {
            confirmation.textContent = "Message must be at least 10 characters long.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
            submitButton.disabled = false;
            return;
        }

        if (!navigator.onLine) {
            confirmation.textContent = "No internet connection. Please try again later.";
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
                throw new Error("Submission failed: " + response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
            confirmation.textContent = "Oops! Something went wrong. Please try again.";
            confirmation.style.color = "#FF007A";
            confirmation.style.display = "block";
            setTimeout(() => { confirmation.style.display = "none"; }, 3000);
        } finally {
            submitButton.disabled = false;
        }
    });

    const submitButton = document.querySelector("#contact-form button");
    submitButton.addEventListener("mouseover", () => {
        const bubbles = submitButton.querySelectorAll(".button-bubble");
        bubbles.forEach(bubble => bubble.style.display = "block");
    });
    submitButton.addEventListener("mouseout", () => {
        const bubbles = submitButton.querySelectorAll(".button-bubble");
        bubbles.forEach(bubble => bubble.style.display = "none");
    });

    // Enhanced Navigation
    const navLinks = document.querySelectorAll("nav ul li a");
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    const href = link.getAttribute("href").substring(1);
                    if (href === entry.target.id) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { threshold: 0.3 }); // Lowered threshold for better detection
    sections.forEach(section => sectionObserver.observe(section));

    // Dark/Light Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");
    const sunIcon = themeToggle.querySelector(".sun-icon");
    const moonIcon = themeToggle.querySelector(".moon-icon");

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        if (document.body.classList.contains("light-mode")) {
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        } else {
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
        }
        localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });

    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    }

    // Scroll to Top
    const scrollTopBtn = document.getElementById("scroll-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
