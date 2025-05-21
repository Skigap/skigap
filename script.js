// Spracheinstellungen und Seitenfunktionalität
// Aktuelle Sprache der Website
let currentLanguage = 'de';

// DOM geladen Event
document.addEventListener('DOMContentLoaded', function() {
    // Scroll-Spy-Funktionalität für die Navigation
    window.addEventListener('scroll', updateScrollSpy);
    
    // Mobile Menü Ein/Ausklappen
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
       
    // Automatisches Schließen des mobilen Menüs nach Klick auf einen Link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            // Wenn das mobile Menü geöffnet ist, schließe es
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    });
    
    // Initialize EmailJS
    initializeEmailJS();
    
    // Initialize forms
    initializeForms();
    
    // Set up event listeners for form submissions
    setupFormListeners();
    
    // Initialize custom booking form functionality
    initializeBookingForm();

    $('button').on('click', function(){  
        function random(max){
            return Math.random() * (max - 0) + 0;
        }
      
        var c = document.createDocumentFragment();
        for (var i=0; i<100; i++) {
          var styles = 'transform: translate3d(' + (random(500) - 250) + 'px, ' + (random(200) - 150) + 'px, 0) rotate(' + random(360) + 'deg);\
                        background: hsla('+random(360)+',100%,50%,1);\
                        animation: bang 700ms ease-out forwards;\
                        opacity: 0';
            
          var e = document.createElement("i");
          e.style.cssText = styles.toString();
          c.appendChild(e);
      }
      // document.body.appendChild(c);
        $(this).append(c);
      })

    // Testimonial-Slider-Steuerung
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', showPreviousTestimonial);
        nextBtn.addEventListener('click', showNextTestimonial);
    }
    
    // Spracheinstellung aus localStorage wiederherstellen
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
    
    // Initiale Aktualisierung des UI basierend auf der Sprache
    updateLanguageUI();
    
    // Für Smooth Scrolling bei internen Links
    setupSmoothScrolling();
});

// EmailJS Integration for SkiGap website
// Constants
const EMAILJS_SERVICE_ID = "service_gbc99nf"; // Using the correct service ID
const CONTACT_FORM_TEMPLATE_ID = "template_my07whj"; // Contact form template ID
const BOOKING_FORM_TEMPLATE_ID = "template_rdjyyvd"; // Booking form template ID

// DOM Elements
let contactForm = null;
let bookingForm = null;

/**
 * Initialize EmailJS with public key
 */
function initializeEmailJS() {
    // EmailJS is already initialized in the HTML head section
    console.log("EmailJS is initialized with public key");
}

/**
 * Initialize form references
 */
function initializeForms() {
    // Using the correct form IDs from the HTML
    contactForm = document.getElementById('contactForm');
    bookingForm = document.getElementById('bookingForm');
    
    console.log("Contact Form:", contactForm ? "Found" : "Not Found");
    console.log("Booking Form:", bookingForm ? "Found" : "Not Found");
}

/**
 * Set up event listeners for form submissions
 */
function setupFormListeners() {
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        console.log("Contact form listener added");
    }
    
    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingFormSubmit);
        console.log("Booking form listener added");
    }
}

/**
 * Initialize custom booking form functionality
 */
function initializeBookingForm() {
    const previousTeachingSelect = document.getElementById('previousTeaching');
    const teachingDetailsContainer = document.querySelector('.previous-teaching-details');
    
    if (previousTeachingSelect && teachingDetailsContainer) {
        previousTeachingSelect.addEventListener('change', function() {
            if (this.value === 'Ja') {
                teachingDetailsContainer.style.display = 'block';
            } else {
                teachingDetailsContainer.style.display = 'none';
            }
        });
    }
    
    // Fix für doppeltes Formular-Problem
    removeExtraForms();
}

/**
 * Handle contact form submission
 * @param {Event} event - Form submission event
 */
function handleContactFormSubmit(event) {
    event.preventDefault();
    console.log("Contact form submitted");
    
    // Zeige den Ladezustand
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Wird gesendet...';
    }
    
    // Zeige die Erfolgsmeldung an oder erstelle sie
    const successMessage = contactForm.querySelector('.success-message');
    const errorMessage = contactForm.querySelector('.error-message');
    
    // Verstecke Erfolgsmeldung und Fehlermeldung
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const phone = document.getElementById('phone')?.value.trim() || '';
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Nachricht senden';
        }
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Nachricht senden';
        }
        return;
    }
    
    // Template parameters for EmailJS - angepasst an die tatsächlichen Template-Parameter
    const templateParams = {
        name: name,
        email: email,
        title: subject || 'Kontaktanfrage von der Website',
        message: message,
        phone: phone
    };
    
    console.log("Sending email with params:", templateParams);
    
    // Send email with EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, CONTACT_FORM_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            if (successMessage) {
                successMessage.style.display = 'block';
            } else {
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.');
            }
            contactForm.reset();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            if (errorMessage) {
                errorMessage.style.display = 'block';
            } else {
                alert('Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt unter info@skischool-go.com.');
            }
        })
        .finally(function() {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Nachricht senden';
            }
        });
}

/**
 * Handle booking form submission
 * @param {Event} event - Form submission event
 */
function handleBookingFormSubmit(event) {
    event.preventDefault();
    console.log("Booking form submitted");
    
    // Zeige den Ladezustand
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Wird gesendet...';
    }
    
    // Zeige die Erfolgsmeldung an oder erstelle sie
    const successMessage = bookingForm.querySelector('.success-message');
    const errorMessage = bookingForm.querySelector('.error-message');
    
    // Verstecke Erfolgsmeldung und Fehlermeldung
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';
    
    // Formularfelder auslesen
    const firstName = document.getElementById('firstName')?.value.trim();
    const lastName = document.getElementById('lastName')?.value.trim();
    const fullname = firstName && lastName ? `${firstName} ${lastName}` : "";
    
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const birthdate = document.getElementById('dateOfBirth')?.value || document.getElementById('birthdate')?.value || "";
    const nationality = document.getElementById('nationality')?.value.trim();
    
    // Adressfelder - möglicherweise nicht im Formular vorhanden, daher mit Fallbacks
    const address = document.getElementById('address')?.value.trim() || "";
    const zip = document.getElementById('zip')?.value.trim() || "";
    const city = document.getElementById('city')?.value.trim() || "";
    const bookerCountry = document.getElementById('booker-country')?.value.trim() || nationality || "";
    
    const skillLevel = document.getElementById('skill-level')?.value || "";
    const experience = document.getElementById('experience')?.value.trim();
    
    // Zusätzliche Optionen
    const cancellationInsurance = document.getElementById('cancellation-insurance')?.checked;
    const germanCourse = document.getElementById('german-course')?.value || "none";
    const holidayOption = document.querySelector('input[name="holiday-option"]')?.checked;
    const terms = document.querySelector('input[name="terms"]')?.checked;
    
    // Einfache Validierung
    if (!fullname || !email || !phone || !birthdate || !nationality || !skillLevel || !experience) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Platz reservieren';
        }
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Platz reservieren';
        }
        return;
    }
    
    if (!terms) {
        alert('Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Jetzt Platz reservieren';
        }
        return;
    }
    
    // Generiere eine eindeutige Bestellnummer
    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    
    // Template-Parameter für EmailJS erstellen - angepasst an die tatsächlichen Template-Parameter
    const templateParams = {
        fullname: fullname,
        email: email,
        phone: phone,
        birthdate: birthdate,
        nationality: nationality,
        address: address,
        zip: zip,
        city: city,
        'booker-country': bookerCountry,
        'skill-level': skillLevel,
        experience: experience,
        'holiday-option': holidayOption ? 'Ja' : 'Nein',
        terms: terms ? 'Akzeptiert' : 'Nicht akzeptiert',
        'german-course': germanCourse,
        'cancellation-insurance': cancellationInsurance ? 'Ja' : 'Nein',
        order_id: orderId
    };
    
    console.log("Sending booking email with params:", templateParams);
    
    // E-Mail mit EmailJS senden
    emailjs.send(EMAILJS_SERVICE_ID, BOOKING_FORM_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            if (successMessage) {
                successMessage.style.display = 'block';
            } else {
                alert('Vielen Dank für Ihre Buchungsanfrage! Wir werden uns in Kürze per E-Mail mit weiteren Informationen bei Ihnen melden.');
            }
            bookingForm.reset();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            if (errorMessage) {
                errorMessage.style.display = 'block';
            } else {
                alert('Es gab ein Problem beim Senden Ihrer Buchungsanfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt via info@skischool-go.com.');
            }
        })
        .finally(function() {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Jetzt Platz reservieren';
            }
        });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sprache setzen und UI aktualisieren
function setLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('language', language);
    
    // Sprachbuttons aktualisieren
    const languageButtons = document.querySelectorAll('.lang-btn');
    languageButtons.forEach(button => {
        if (button.getAttribute('data-lang') === language) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Übersetze die Seite
    translatePage();
}

// UI basierend auf der gewählten Sprache aktualisieren
function updateLanguageUI() {
    // Sprachbuttons aktualisieren
    const languageButtons = document.querySelectorAll('.lang-btn');
    languageButtons.forEach(button => {
        if (button.getAttribute('data-lang') === currentLanguage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Seite übersetzen basierend auf der aktuellen Sprache
function translatePage() {
    // Alle Elemente mit Übersetzungsklassen durchgehen
    for (const key in translations) {
        // Elemente mit dieser Klasse finden
        const elements = document.querySelectorAll('.' + key.replace(/\./g, '-'));
        
        if (elements.length > 0) {
            // Text für die aktuelle Sprache bekommen
            const translation = translations[key][currentLanguage];
            
            // Alle gefundenen Elemente übersetzen
            elements.forEach(element => {
                element.textContent = translation;
            });
        }
    }
    
    // Placeholder für Eingabefelder übersetzen
    const placeholderElements = document.querySelectorAll('[placeholder]');
    placeholderElements.forEach(element => {
        const placeholderClass = element.classList[0];
        if (placeholderClass && translations[placeholderClass]) {
            element.placeholder = translations[placeholderClass][currentLanguage];
        }
    });
}

// Mobile Menü umschalten
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    // Umschalten der Klasse active für das Menü
    nav.classList.toggle('active');
    
    // Umschalten der Klasse active für den Hamburger-Button
    menuBtn.classList.toggle('active');
}

// Scroll-Spy für die Navigation
function updateScrollSpy() {
    // Aktuelle Scroll-Position
    const scrollPosition = window.scrollY;
    
    // Alle Abschnitte finden
    const sections = document.querySelectorAll('section[id]');
    
    // Jeden Abschnitt überprüfen
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Wenn der Benutzer innerhalb dieses Abschnitts scrollt
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Den entsprechenden Navigationspunkt hervorheben
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href').includes(sectionId)) {
                    navLink.classList.add('active');
                }
            });
        }
    });
}

// Testimonial Slider Steuerung
let currentTestimonialIndex = 0;

function showPreviousTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Aktuelles Testimonial ausblenden
    testimonials[currentTestimonialIndex].style.display = 'none';
    dots[currentTestimonialIndex].classList.remove('active');
    
    // Index aktualisieren (mit Schleife)
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    
    // Neues Testimonial anzeigen
    testimonials[currentTestimonialIndex].style.display = 'block';
    dots[currentTestimonialIndex].classList.add('active');
}

function showNextTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Aktuelles Testimonial ausblenden
    testimonials[currentTestimonialIndex].style.display = 'none';
    dots[currentTestimonialIndex].classList.remove('active');
    
    // Index aktualisieren (mit Schleife)
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    
    // Neues Testimonial anzeigen
    testimonials[currentTestimonialIndex].style.display = 'block';
    dots[currentTestimonialIndex].classList.add('active');
}

// Smooth Scrolling für interne Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Nur scrollen, wenn es ein gültiges Element ist
            if (targetId !== "#" && document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Extra Booking-Forms entfernen (falls durch CMS-Bug mehrfach vorhanden)
function removeExtraForms() {
    const forms = document.querySelectorAll('#booking-form');
    
    if (forms.length > 1) {
        // Alle bis auf das erste Form-Element entfernen
        for (let i = 1; i < forms.length; i++) {
            forms[i].remove();
        }
    }
}

// Initialize mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn && header) {
        // Create mobile navigation if it doesn't exist
        if (!document.querySelector('.mobile-nav')) {
            const nav = document.querySelector('nav');
            
            if (nav) {
                const mobileNav = document.createElement('div');
                mobileNav.className = 'mobile-nav';
                mobileNav.innerHTML = nav.innerHTML;
                header.appendChild(mobileNav);
                
                // Setup mobile nav links
                const mobileNavLinks = mobileNav.querySelectorAll('a');
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        mobileNav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    });
                });
            }
        }
        
        const mobileNav = document.querySelector('.mobile-nav');
        
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }
});
