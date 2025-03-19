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
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector("button");
        submitButton.disabled = true;

        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const subject = contactForm.querySelector('input[name="subject"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || subject.length < 3 || message.length < 5) {
            confirmation.textContent = "Please fill out all fields correctly.";
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
            confirmation.textContent = "Oops! Something went wrong.";
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
