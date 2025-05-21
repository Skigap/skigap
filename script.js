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
    
    // Kontaktformular abschicken
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Buchungsformular abschicken
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    
        // Fix für doppeltes Formular-Problem
        removeExtraForms();
    }

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

// Kontaktformular absenden
function handleContactForm(event) {
    event.preventDefault();
    
    // Formularfelder auslesen
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Einfache Validierung
    if (!name || !email || !message) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return;
    }
    
    // Template-Parameter für EmailJS erstellen
    const templateParams = {
        from_name: name,
        from_email: email,
        subject: subject || 'Kontaktanfrage von der Website',
        message: message,
        reply_to: email
    };
    
    // E-Mail mit EmailJS senden
    emailjs.send('service_gbc99nf', 'template_my07whj', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.');
            event.target.reset();
        }, function(error) {
            console.log('FAILED...', error);
            alert('Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
        });
}

// Buchungsformular absenden
function handleBookingForm(event) {
    event.preventDefault();
    
    // Validieren
    if (!validateBookingForm()) {
        return;
    }
    
    // Formularfelder auslesen
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const nationality = document.getElementById('nationality').value.trim();
    const skillLevel = document.getElementById('skill-level').value;
    const experience = document.getElementById('experience').value.trim();
    
    // Zusätzliche Optionen
    const cancellationInsurance = document.getElementById('cancellation-insurance').checked;
    const germanCourse = document.getElementById('german-course').value;
    const holidayOption = document.querySelector('input[name="holiday-option"]').checked;
    const terms = document.querySelector('input[name="terms"]').checked;
    
    // Template-Parameter für EmailJS erstellen
    const templateParams = {
        fullname: fullname,
        email: email,
        phone: phone,
        birthdate: birthdate,
        nationality: nationality,
        skill_level: skillLevel,
        experience: experience,
        cancellation_insurance: cancellationInsurance ? 'Ja' : 'Nein',
        german_course: germanCourse,
        holiday_option: holidayOption ? 'Ja' : 'Nein',
        terms: terms ? 'Akzeptiert' : 'Nicht akzeptiert'
    };
    
    // E-Mail mit EmailJS senden - mit dem korrekten Template ID
    emailjs.send('service_gbc99nf', 'template_rdjyyvd', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Vielen Dank für Ihre Buchungsanfrage! Wir werden uns in Kürze per E-Mail mit weiteren Informationen bei Ihnen melden.');
            event.target.reset();
        }, function(error) {
            console.log('FAILED...', error);
            alert('Es gab ein Problem beim Senden Ihrer Buchungsanfrage. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
        });
}

// Buchungsformular validieren
function validateBookingForm() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const nationality = document.getElementById('nationality').value.trim();
    const skillLevel = document.getElementById('skill-level').value;
    const experience = document.getElementById('experience').value.trim();
    const terms = document.querySelector('input[name="terms"]').checked;
    
    if (!fullname || !email || !phone || !birthdate || !nationality || !skillLevel || !experience) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return false;
    }
    
    if (!isValidEmail(email)) {
        alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        return false;
    }
    
    if (!terms) {
        alert('Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen.');
        return false;
    }
    
    return true;
}

// E-Mail-Validierung
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Doppelte Formulare entfernen
function removeExtraForms() {
    const forms = document.querySelectorAll('#booking-form');
    if (forms.length > 1) {
        for (let i = 1; i < forms.length; i++) {
            forms[i].remove();
        }
    }
}

// Smooth Scrolling für interne Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}
