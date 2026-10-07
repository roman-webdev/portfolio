// =========================
// MOBILE MENU
// =========================

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

function getCurrentLanguageCode() {
    const activeButton =
        document.querySelector(
            ".language-switcher [data-lang].is-active"
        );

    if (activeButton) {
        return activeButton.dataset.lang;
    }

    const documentLanguage =
        document.documentElement.lang;

    if (documentLanguage === "uk") {
        return "ua";
    }

    return documentLanguage === "ru" ||
        documentLanguage === "en"
            ? documentLanguage
            : "ua";
}


function updateMenuAccessibilityLabel(isOpen) {
    const language =
        getCurrentLanguageCode();

    const key =
        isOpen
            ? "aria.menuClose"
            : "aria.menu";

    const label =
        getTranslation(
            language,
            key
        );

    if (label) {
        menuButton.setAttribute(
            "aria-label",
            label
        );
    }
}


function closeMenu() {
    menuButton.classList.remove("active");
    nav.classList.remove("active");
    document.body.classList.remove("menu-open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

    updateMenuAccessibilityLabel(false);
}


menuButton.addEventListener("click", () => {
    const isOpen =
        nav.classList.toggle("active");

    menuButton.classList.toggle(
        "active",
        isOpen
    );

    document.body.classList.toggle(
        "menu-open",
        isOpen
    );

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    updateMenuAccessibilityLabel(isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("active")) {
        closeMenu();
        menuButton.focus();
    }
});


// Reset the overlay and scroll lock when the desktop navigation returns.
const compactNavigation = window.matchMedia("(max-width: 900px)");
compactNavigation.addEventListener("change", (event) => {
    if (!event.matches && nav.classList.contains("active")) {
        closeMenu();
    }
});

// =========================
// SCROLL REVEAL
// =========================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


// =========================
// PROJECT IMAGE FALLBACK
// =========================

function setupProjectImage(image) {
    const showImage = () => {
        image.hidden = false;
        image.classList.add("is-loaded");
    };

    const hideImage = () => {
        image.classList.remove("is-loaded");
        image.hidden = true;
    };

    image.addEventListener("load", showImage);
    image.addEventListener("error", hideImage);

    // The image can finish loading (or fail) before this script runs.
    // Checking complete/naturalWidth makes the fallback reliable on refresh too.
    if (image.complete) {
        if (image.naturalWidth > 0) {
            showImage();
        } else {
            hideImage();
        }
    }
}

document.querySelectorAll(".project-image img").forEach(setupProjectImage);

// =========================
// MOTION V3
// =========================

const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)");

const finePointer =
    window.matchMedia("(hover: hover) and (pointer: fine)");

document.documentElement.classList.add("motion-ready");


if (!reducedMotion.matches) {

    // =========================
    // MOUSE SPOTLIGHT
    // =========================

    let pointerFrame = null;

    let pointerX =
        window.innerWidth / 2;

    let pointerY =
        window.innerHeight / 2;


    const paintPointer = () => {

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${pointerX}px`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${pointerY}px`
        );

        pointerFrame = null;
    };


    if (finePointer.matches) {

        window.addEventListener(
            "pointermove",
            (event) => {

                pointerX =
                    event.clientX;

                pointerY =
                    event.clientY;


                if (!pointerFrame) {

                    pointerFrame =
                        requestAnimationFrame(
                            paintPointer
                        );
                }
            },
            {
                passive: true
            }
        );


        // =========================
        // PROJECT 3D PARALLAX
        // =========================

        document
            .querySelectorAll(".project-image")
            .forEach((card) => {

                const resetTilt = () => {

                    card.style.setProperty(
                        "--tilt-x",
                        "0deg"
                    );

                    card.style.setProperty(
                        "--tilt-y",
                        "0deg"
                    );

                    card.style.setProperty(
                        "--shift-x",
                        "0px"
                    );

                    card.style.setProperty(
                        "--shift-y",
                        "0px"
                    );
                };


                card.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height;


                        const tiltY =
                            (x - 0.5) * 4;


                        const tiltX =
                            (0.5 - y) * 3;


                        const shiftX =
                            (x - 0.5) * -10;


                        const shiftY =
                            (y - 0.5) * -8;


                        card.style.setProperty(
                            "--tilt-x",
                            `${tiltX.toFixed(2)}deg`
                        );


                        card.style.setProperty(
                            "--tilt-y",
                            `${tiltY.toFixed(2)}deg`
                        );


                        card.style.setProperty(
                            "--shift-x",
                            `${shiftX.toFixed(1)}px`
                        );


                        card.style.setProperty(
                            "--shift-y",
                            `${shiftY.toFixed(1)}px`
                        );
                    }
                );


                card.addEventListener(
                    "pointerleave",
                    resetTilt
                );


                card.addEventListener(
                    "blur",
                    resetTilt,
                    true
                );
            });
    }
}

// =========================
// MOTION V4
// HERO SCROLL + PROJECT ENTRANCE
// =========================

const heroSection = document.querySelector(".hero");
const motionProjects = document.querySelectorAll(".project");

motionProjects.forEach((project) => {
    project.classList.add("project-motion-v4");
});


if (reducedMotion.matches) {

    motionProjects.forEach((project) => {
        project.classList.add("project-in-view");
    });

} else {

    // -------------------------
    // PROJECT ENTRANCE
    // -------------------------

    const projectMotionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("project-in-view");
                projectMotionObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    motionProjects.forEach((project) => {
        projectMotionObserver.observe(project);
    });


    // -------------------------
    // HERO → PROJECTS SCROLL
    // -------------------------

    if (heroSection) {

        let heroScrollFrame = null;

        const paintHeroScroll = () => {

            if (window.innerWidth <= 700) {

                heroSection.style.removeProperty("--hero-title-y");
                heroSection.style.removeProperty("--hero-top-y");
                heroSection.style.removeProperty("--hero-bottom-y");
                heroSection.style.removeProperty("--hero-spread");
                heroSection.style.removeProperty("--hero-scale");
                heroSection.style.removeProperty("--hero-top-opacity");
                heroSection.style.removeProperty("--hero-bottom-opacity");

                heroScrollFrame = null;
                return;
            }

            const heroHeight =
                Math.max(heroSection.offsetHeight, 1);

            const progress =
                Math.min(
                    Math.max(
                        window.scrollY /
                        (heroHeight * 0.82),
                        0
                    ),
                    1
                );

            heroSection.style.setProperty(
                "--hero-title-y",
                `${(-30 * progress).toFixed(2)}px`
            );

            heroSection.style.setProperty(
                "--hero-top-y",
                `${(-12 * progress).toFixed(2)}px`
            );

            heroSection.style.setProperty(
                "--hero-bottom-y",
                `${(20 * progress).toFixed(2)}px`
            );

            heroSection.style.setProperty(
                "--hero-spread",
                `${(18 * progress).toFixed(2)}px`
            );

            heroSection.style.setProperty(
                "--hero-scale",
                (1 - 0.025 * progress).toFixed(4)
            );

            heroSection.style.setProperty(
                "--hero-top-opacity",
                (1 - 0.42 * progress).toFixed(3)
            );

            heroSection.style.setProperty(
                "--hero-bottom-opacity",
                (1 - 0.34 * progress).toFixed(3)
            );

            heroScrollFrame = null;
        };


        const requestHeroPaint = () => {

            if (heroScrollFrame) {
                return;
            }

            heroScrollFrame =
                requestAnimationFrame(
                    paintHeroScroll
                );
        };


        window.addEventListener(
            "scroll",
            requestHeroPaint,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            requestHeroPaint,
            {
                passive: true
            }
        );

        requestHeroPaint();
    }
}

// =========================
// MOTION V5
// ABOUT / TOOLKIT / SERVICES / CONTACT
// =========================

const aboutSection =
    document.querySelector(".about");

const aboutWords =
    document.querySelectorAll(
        ".about-statement > span"
    );

const toolkitGrid =
    document.querySelector(".toolkit-grid");

const toolkitCards =
    document.querySelectorAll(".toolkit-card");

const servicesList =
    document.querySelector(".services-list");

const serviceRows =
    document.querySelectorAll(".service-row");

const contactSection =
    document.querySelector(".contact");


aboutWords.forEach((word, index) => {
    word.style.setProperty(
        "--v5-index",
        index
    );
});

toolkitCards.forEach((card, index) => {
    card.style.setProperty(
        "--v5-index",
        index
    );
});

serviceRows.forEach((row, index) => {
    row.style.setProperty(
        "--v5-index",
        index
    );
});


document.documentElement.classList.add(
    "motion-v5-ready"
);


const v5Targets = [
    aboutSection,
    toolkitGrid,
    servicesList,
    contactSection
].filter(Boolean);


if (reducedMotion.matches) {

    v5Targets.forEach((target) => {
        target.classList.add("v5-in-view");
    });

} else {

    const v5Observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "v5-in-view"
                    );

                    v5Observer.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.14,
                rootMargin:
                    "0px 0px -8% 0px"
            }
        );


    v5Targets.forEach((target) => {
        v5Observer.observe(target);
    });
}


// -------------------------
// TOOLKIT CURSOR GLOW
// -------------------------

if (
    !reducedMotion.matches &&
    finePointer.matches
) {

    toolkitCards.forEach((card) => {

        let cardFrame = null;
        let cardX = 0;
        let cardY = 0;

        const paintCardGlow = () => {

            card.style.setProperty(
                "--card-x",
                `${cardX.toFixed(1)}px`
            );

            card.style.setProperty(
                "--card-y",
                `${cardY.toFixed(1)}px`
            );

            cardFrame = null;
        };


        card.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    card.getBoundingClientRect();

                cardX =
                    event.clientX -
                    rect.left;

                cardY =
                    event.clientY -
                    rect.top;

                if (!cardFrame) {
                    cardFrame =
                        requestAnimationFrame(
                            paintCardGlow
                        );
                }
            },
            {
                passive: true
            }
        );
    });


    // -------------------------
    // CONTACT LOCAL SPOTLIGHT
    // -------------------------

    if (contactSection) {

        let contactFrame = null;
        let contactX = 0;
        let contactY = 0;

        const paintContactGlow = () => {

            contactSection.style.setProperty(
                "--contact-x",
                `${contactX.toFixed(1)}px`
            );

            contactSection.style.setProperty(
                "--contact-y",
                `${contactY.toFixed(1)}px`
            );

            contactFrame = null;
        };


        contactSection.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    contactSection
                        .getBoundingClientRect();

                contactX =
                    event.clientX -
                    rect.left;

                contactY =
                    event.clientY -
                    rect.top;

                if (!contactFrame) {
                    contactFrame =
                        requestAnimationFrame(
                            paintContactGlow
                        );
                }
            },
            {
                passive: true
            }
        );
    }
}

// =========================
// MULTILINGUAL V1
// UA / RU / EN
// =========================

const translations = {
    ua: {
        meta: {
            title: "Roman — Full-Stack Developer",
            description:
                "Full-stack розробник. Вебзастосунки, booking-системи, backend і Telegram-боти."
        },

        aria: {
            home: "На головну",
            menu: "Відкрити меню",
            menuClose: "Закрити меню",
            projects: "Дивитися проєкти",
            language: "Мова сайту",
            pipeline: "Процес розробки"
        },

        nav: {
            projects: "Проєкти",
            about: "Про мене",
            contact: "Контакти"
        },

        hero: {
            description:
                "Створюю вебсайти, системи онлайн-запису та Telegram-ботів — від інтерфейсу й backend-логіки до бази даних і production deployment."
        },

        projects: {
            title: "Проєкти",
            open: "Відкрити проєкт ↗",

            helixprimus: { description: "Від звернення до перевіреної відповіді: аналіз, політики, погодження оператором, SLA, аналітика й аудит в одному робочому просторі. Portfolio Release Candidate / demo-grade: синтетичні дані, deterministic mock AI та mock delivery." },

            manor: {
                description:
                    "Система онлайн-запису та керування барбершопом: публічний сайт, PostgreSQL, Telegram-сповіщення і захищена CRM для роботи з клієнтами, розкладом та аналітикою."
            },

            shopflow: {
                subtitle: "Full-Stack E-commerce Platform",
                description: "Багатомовна e-commerce платформа з варіантами товарів, обраним, історією переглядів, порівнянням, постійним кошиком, checkout, адмін-панеллю, керуванням замовленнями та PostgreSQL."
            },

            drivefix: {
                description:
                    "Сайт автосервісу з адаптивним інтерфейсом, backend API, серверною валідацією заявок і надсиланням нових звернень власнику через Telegram."
            },

            smartsave: {
                description:
                    "Telegram-асистент для особистих фінансів: доходи й витрати, бюджети, цілі, CSV-імпорт, аналітика та відновлення даних. UA / EN / RU. Beta 1.3.14 — Release Candidate / Beta Deployment на Linux / Oracle Linux. 454 автоматизовані тести пройдено, 0 пропущено.",
                overlay: "Telegram Assistant"
            }
        },

        about: {
            title: "Про мене",
            statement1: "НЕ ПРОСТО",
            statement2: "ІНТЕРФЕЙС.",
            copy1:
                "Я full-stack розробник, працюю з Python, Flask і JavaScript. Створюю вебзастосунки від користувацького інтерфейсу до серверної логіки, бази даних і deployment.",
            copy2:
                "Мені цікаві проєкти, які розв’язують конкретні задачі: отримання заявок, онлайн-запис, автоматизація, робота з клієнтами та інтеграції із зовнішніми сервісами."
        },

        toolkit: {
            title: "Інструменти"
        },

        services: {
            title: "Що я роблю",
            websites:
                "Адаптивні сайти для послуг і малого бізнесу.",
            booking:
                "Онлайн-запис, розклад, клієнти та адміністративні панелі.",
            bots:
                "Автоматизація, сповіщення, обробка даних і користувацькі сценарії.",
            backend:
                "Серверна логіка, бази даних, API та інтеграції."
        },

        contact: {
            copy:
                "Вебзастосунки, бізнес-системи та Telegram-автоматизація. Готовий обговорити задачу й підібрати практичне рішення.",
            github: "GITHUB PROFILE ↗"
        },

        alt: {
            helixprimus: "HELIXPRIMUS — AI Customer Operations Platform",
            shopflow: "ShopFlow — багатомовна e-commerce платформа",
            manor:
                "MANOR HOUSE — система онлайн-запису та CRM для барбершопу",
            drivefix:
                "DRIVEFIX — сайт автосервісу",
            smartsave:
                "SmartSave — Telegram-асистент для особистих фінансів"
        }
    },

    ru: {
        meta: {
            title: "Roman — Full-Stack Developer",
            description:
                "Full-stack разработчик. Веб-приложения, booking-системы, backend и Telegram-боты."
        },

        aria: {
            home: "На главную",
            menu: "Открыть меню",
            menuClose: "Закрыть меню",
            projects: "Смотреть проекты",
            language: "Язык сайта",
            pipeline: "Процесс разработки"
        },

        nav: {
            projects: "Проекты",
            about: "Обо мне",
            contact: "Контакты"
        },

        hero: {
            description:
                "Создаю веб-сайты, системы онлайн-записи и Telegram-ботов — от интерфейса и backend-логики до базы данных и production deployment."
        },

        projects: {
            title: "Проекты",
            open: "Открыть проект ↗",

            helixprimus: { description: "От обращения до проверенного ответа: анализ, политики, одобрение оператором, SLA, аналитика и аудит в одном рабочем пространстве. Portfolio Release Candidate / demo-grade: synthetic data, deterministic mock AI и mock delivery." },

            manor: {
                description:
                    "Система онлайн-записи и управления барбершопом: публичный сайт, PostgreSQL, Telegram-уведомления и защищённая CRM для работы с клиентами, расписанием и аналитикой."
            },

            shopflow: {
                subtitle: "Full-Stack E-commerce Platform",
                description: "Многоязычная e-commerce платформа с вариантами товаров, избранным, историей просмотров, сравнением, постоянной корзиной, checkout, админ-панелью, управлением заказами и PostgreSQL."
            },

            drivefix: {
                description:
                    "Сайт автосервиса с адаптивным интерфейсом, backend API, серверной валидацией заявок и отправкой новых обращений владельцу через Telegram."
            },

            smartsave: {
                description:
                    "Telegram-ассистент для личных финансов: доходы и расходы, бюджеты, цели, CSV-импорт, аналитика и восстановление данных. UA / EN / RU. Beta 1.3.14 — Release Candidate / Beta Deployment на Linux / Oracle Linux. 454 автоматизированных теста пройдено, 0 пропущено.",
                overlay: "Telegram Assistant"
            }
        },

        about: {
            title: "Обо мне",
            statement1: "НЕ ПРОСТО",
            statement2: "ИНТЕРФЕЙС.",
            copy1:
                "Я full-stack разработчик, работающий с Python, Flask и JavaScript. Создаю веб-приложения от пользовательского интерфейса до серверной логики, базы данных и deployment.",
            copy2:
                "Мне интересны проекты, которые решают конкретные задачи: получение заявок, онлайн-запись, автоматизация, работа с клиентами и интеграции с внешними сервисами."
        },

        toolkit: {
            title: "Инструменты"
        },

        services: {
            title: "Что я делаю",
            websites:
                "Адаптивные сайты для услуг и малого бизнеса.",
            booking:
                "Онлайн-запись, расписание, клиенты и административные панели.",
            bots:
                "Автоматизация, уведомления, обработка данных и пользовательские сценарии.",
            backend:
                "Серверная логика, базы данных, API и интеграции."
        },

        contact: {
            copy:
                "Веб-приложения, бизнес-системы и Telegram-автоматизация. Готов обсудить задачу и подобрать практичное решение.",
            github: "GITHUB PROFILE ↗"
        },

        alt: {
            helixprimus: "HELIXPRIMUS — AI Customer Operations Platform",
            shopflow: "ShopFlow — многоязычная e-commerce платформа",
            manor:
                "MANOR HOUSE — система онлайн-записи и CRM для барбершопа",
            drivefix:
                "DRIVEFIX — сайт автосервиса",
            smartsave:
                "SmartSave — Telegram-ассистент для личных финансов"
        }
    },

    en: {
        meta: {
            title: "Roman — Full-Stack Developer",
            description:
                "Full-stack developer building web applications, booking systems, backend services and Telegram bots."
        },

        aria: {
            home: "Back to top",
            menu: "Open menu",
            menuClose: "Close menu",
            projects: "View projects",
            language: "Website language",
            pipeline: "Development process"
        },

        nav: {
            projects: "Projects",
            about: "About",
            contact: "Contact"
        },

        hero: {
            description:
                "I build websites, online booking systems and Telegram bots — from interface and backend logic to databases and production deployment."
        },

        projects: {
            title: "Projects",
            open: "Open project ↗",

            helixprimus: { description: "From customer issue to a reviewed response: analysis, policy matching, human approval, SLA, analytics and an audit trail in one workspace. Portfolio Release Candidate / demo-grade with synthetic data, deterministic mock AI and mock delivery." },

            manor: {
                description:
                    "A barbershop booking and management system with a public website, PostgreSQL, Telegram notifications and a protected CRM for clients, scheduling and analytics."
            },

            shopflow: {
                subtitle: "Full-Stack E-commerce Platform",
                description: "Multilingual e-commerce platform with product variants, favorites, recently viewed products, comparison, persistent cart, checkout, admin dashboard, order management and PostgreSQL."
            },

            drivefix: {
                description:
                    "An auto service website with a responsive interface, backend API, server-side request validation and Telegram notifications for new customer inquiries."
            },

            smartsave: {
                description:
                    "A personal finance Telegram assistant: income and expenses, budgets, goals, CSV imports, insights and data recovery. UA / EN / RU. Beta 1.3.14 — Release Candidate / Beta Deployment on Linux / Oracle Linux. 454 automated tests passed, 0 skipped.",
                overlay: "Telegram Assistant"
            }
        },

        about: {
            title: "About me",
            statement1: "MORE THAN",
            statement2: "INTERFACE.",
            copy1:
                "I am a full-stack developer working with Python, Flask and JavaScript. I build web applications from the user interface to server-side logic, databases and deployment.",
            copy2:
                "I focus on projects that solve practical problems: lead capture, online booking, automation, customer workflows and integrations with external services."
        },

        toolkit: {
            title: "Tools"
        },

        services: {
            title: "What I do",
            websites:
                "Responsive websites for services and small businesses.",
            booking:
                "Online booking, scheduling, clients and administrative dashboards.",
            bots:
                "Automation, notifications, data processing and user workflows.",
            backend:
                "Server-side logic, databases, APIs and integrations."
        },

        contact: {
            copy:
                "Web applications, business systems and Telegram automation. Ready to discuss your task and find a practical solution.",
            github: "GITHUB PROFILE ↗"
        },

        alt: {
            helixprimus: "HELIXPRIMUS — AI Customer Operations Platform",
            shopflow: "ShopFlow — multilingual e-commerce platform",
            manor:
                "MANOR HOUSE — barbershop booking and CRM system",
            drivefix:
                "DRIVEFIX — auto service website",
            smartsave:
                "SmartSave — personal finance Telegram assistant"
        }
    }
};


function getTranslation(language, path) {
    return path
        .split(".")
        .reduce(
            (value, key) =>
                value && value[key] !== undefined
                    ? value[key]
                    : undefined,
            translations[language]
        );
}


function applyLanguage(language) {
    const selectedLanguage =
        translations[language]
            ? language
            : "ua";

    const htmlLanguage =
        selectedLanguage === "ua"
            ? "uk"
            : selectedLanguage;

    document.documentElement.lang =
        htmlLanguage;

    document.title =
        translations[selectedLanguage]
            .meta.title;

    const metaDescription =
        document.querySelector(
            'meta[name="description"]'
        );

    if (metaDescription) {
        metaDescription.setAttribute(
            "content",
            translations[selectedLanguage]
                .meta.description
        );
    }


    document
        .querySelectorAll("[data-i18n]")
        .forEach((element) => {

            const value =
                getTranslation(
                    selectedLanguage,
                    element.dataset.i18n
                );

            if (value !== undefined) {
                element.textContent = value;

                if (
                    element.matches('#projects h2[data-i18n="projects.title"]') &&
                    (selectedLanguage === "ru" || selectedLanguage === "ua")
                ) {
                    const pairIndex = value.toUpperCase().indexOf("КТ");

                    if (pairIndex !== -1) {
                        const letter = document.createElement("span");
                        letter.className = "projects-kt-kern";
                        letter.textContent = value[pairIndex];
                        element.replaceChildren(
                            document.createTextNode(value.slice(0, pairIndex)),
                            letter,
                            document.createTextNode(value.slice(pairIndex + 1))
                        );
                    }
                }
            }
        });


    document
        .querySelectorAll("[data-i18n-aria]")
        .forEach((element) => {

            const value =
                getTranslation(
                    selectedLanguage,
                    element.dataset.i18nAria
                );

            if (value !== undefined) {
                element.setAttribute(
                    "aria-label",
                    value
                );
            }
        });


    document
        .querySelectorAll("[data-i18n-alt]")
        .forEach((element) => {

            const value =
                getTranslation(
                    selectedLanguage,
                    element.dataset.i18nAlt
                );

            if (value !== undefined) {
                element.setAttribute(
                    "alt",
                    value
                );
            }
        });


    document
        .querySelectorAll(
            ".language-switcher [data-lang]"
        )
        .forEach((button) => {

            const isActive =
                button.dataset.lang ===
                selectedLanguage;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });


    const menuLabel =
        getTranslation(
            selectedLanguage,
            nav.classList.contains("active")
                ? "aria.menuClose"
                : "aria.menu"
        );

    if (menuLabel) {
        menuButton.setAttribute(
            "aria-label",
            menuLabel
        );
    }


    try {
        localStorage.setItem(
            "portfolio-language",
            selectedLanguage
        );
    } catch (error) {
        // The site still works if storage is unavailable.
    }
}


const languageButtons =
    document.querySelectorAll(
        ".language-switcher [data-lang]"
    );


languageButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            applyLanguage(
                button.dataset.lang
            );
        }
    );
});


let savedLanguage = null;

try {
    savedLanguage =
        localStorage.getItem(
            "portfolio-language"
        );
} catch (error) {
    savedLanguage = null;
}

applyLanguage(
    savedLanguage || "ua"
);

// =========================
// FIREFLY V3
// INTERACTIVE STAR / FIREFLY BACKGROUND
// =========================

function createFireflyField() {

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }


    const oldCanvas =
        document.querySelector(
            ".firefly-canvas"
        );

    if (oldCanvas) {
        oldCanvas.remove();
    }


    const canvas =
        document.createElement("canvas");

    canvas.className =
        "firefly-canvas";

    canvas.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.prepend(canvas);


    const context =
        canvas.getContext("2d", {
            alpha: true
        });

    if (!context) {
        canvas.remove();
        return;
    }


    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastTime =
        performance.now();


    const pointer = {
        x: 0,
        y: 0,
        active: false
    };


    const isMobile =
        window.matchMedia(
            "(max-width: 700px)"
        ).matches;


    /*
       Intentionally sparse:
       these should read as luminous objects,
       not dust on the display.
    */
    const count =
        isMobile ? 7 : 12;


    const palette = [
        {
            core: "rgba(235, 252, 255, 1)",
            glow: "95, 231, 255"
        },
        {
            core: "rgba(246, 239, 255, 1)",
            glow: "151, 90, 255"
        },
        {
            core: "rgba(238, 247, 255, 1)",
            glow: "87, 132, 255"
        },
        {
            core: "rgba(248, 255, 224, 1)",
            glow: "216, 255, 62"
        }
    ];


    const random =
        (min, max) =>
            Math.random() *
            (max - min) +
            min;


    function chooseColor() {

        /*
           Lime is deliberately rare so it stays
           an accent rather than taking over Aurora.
        */
        if (Math.random() < 0.10) {
            return palette[3];
        }

        return palette[
            Math.floor(
                Math.random() * 3
            )
        ];
    }


    function makeFirefly(index) {

        const color =
            chooseColor();

        const star =
            index > 1 &&
            Math.random() < 0.28;

        return {
            x: random(0, Math.max(width, 1)),
            y: random(0, Math.max(height, 1)),

            vx: random(-0.055, 0.055),
            vy: random(-0.045, 0.045),

            baseRadius:
                star
                    ? random(1.7, 2.8)
                    : random(2.4, 4.2),

            halo:
                star
                    ? random(25, 42)
                    : random(34, 62),

            phase:
                random(0, Math.PI * 2),

            twinkleSpeed:
                random(0.0007, 0.0018),

            wanderX:
                random(0.00020, 0.00048),

            wanderY:
                random(0.00018, 0.00042),

            wanderPhaseX:
                random(0, Math.PI * 2),

            wanderPhaseY:
                random(0, Math.PI * 2),

            color,
            star,

            depth:
                random(0.62, 1.18),

            cursorGlow: 0
        };
    }


    let fireflies = [];


    function resizeCanvas() {

        width =
            window.innerWidth;

        height =
            window.innerHeight;

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                1.5
            );


        canvas.width =
            Math.round(width * dpr);

        canvas.height =
            Math.round(height * dpr);

        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;


        context.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        if (fireflies.length === 0) {
            fireflies =
                Array.from(
                    { length: count },
                    (_, index) =>
                        makeFirefly(index)
                );
        } else {

            fireflies.forEach(
                (firefly) => {

                    firefly.x =
                        Math.min(
                            width,
                            Math.max(0, firefly.x)
                        );

                    firefly.y =
                        Math.min(
                            height,
                            Math.max(0, firefly.y)
                        );
                }
            );
        }
    }


    function drawStar(
        x,
        y,
        radius,
        alpha,
        color
    ) {

        context.save();

        context.translate(x, y);

        context.globalAlpha =
            alpha;

        context.strokeStyle =
            color.core;

        context.lineWidth =
            Math.max(
                0.55,
                radius * 0.34
            );

        context.lineCap =
            "round";


        const arm =
            radius * 3.9;

        const shortArm =
            radius * 2.0;


        context.beginPath();

        context.moveTo(-arm, 0);
        context.lineTo(arm, 0);

        context.moveTo(0, -arm);
        context.lineTo(0, arm);

        context.moveTo(
            -shortArm,
            -shortArm
        );

        context.lineTo(
            shortArm,
            shortArm
        );

        context.moveTo(
            shortArm,
            -shortArm
        );

        context.lineTo(
            -shortArm,
            shortArm
        );

        context.stroke();

        context.restore();
    }


    function drawFirefly(
        firefly,
        time
    ) {

        const twinkle =
            0.62 +
            Math.sin(
                time *
                firefly.twinkleSpeed +
                firefly.phase
            ) * 0.25;


        const cursorBoost =
            firefly.cursorGlow;


        const brightness =
            Math.min(
                1,
                twinkle +
                cursorBoost * 0.34
            );


        const radius =
            firefly.baseRadius *
            firefly.depth *
            (
                0.88 +
                brightness * 0.18
            );


        const haloSize =
            firefly.halo *
            (
                0.82 +
                brightness * 0.34 +
                cursorBoost * 0.22
            );


        const gradient =
            context.createRadialGradient(
                firefly.x,
                firefly.y,
                0,
                firefly.x,
                firefly.y,
                haloSize
            );


        gradient.addColorStop(
            0,
            `rgba(${firefly.color.glow}, ${
                0.30 + brightness * 0.26
            })`
        );

        gradient.addColorStop(
            0.12,
            `rgba(${firefly.color.glow}, ${
                0.17 + brightness * 0.16
            })`
        );

        gradient.addColorStop(
            0.42,
            `rgba(${firefly.color.glow}, ${
                0.055 + brightness * 0.055
            })`
        );

        gradient.addColorStop(
            1,
            `rgba(${firefly.color.glow}, 0)`
        );


        context.fillStyle =
            gradient;

        context.beginPath();

        context.arc(
            firefly.x,
            firefly.y,
            haloSize,
            0,
            Math.PI * 2
        );

        context.fill();


        /*
           A crisp bright core makes every object
           read as a light source instead of a speck.
        */
        context.shadowColor =
            `rgba(${firefly.color.glow}, ${
                0.72 + cursorBoost * 0.18
            })`;

        context.shadowBlur =
            12 + cursorBoost * 12;

        context.fillStyle =
            firefly.color.core;

        context.globalAlpha =
            0.74 +
            brightness * 0.26;

        context.beginPath();

        context.arc(
            firefly.x,
            firefly.y,
            radius,
            0,
            Math.PI * 2
        );

        context.fill();

        context.shadowBlur = 0;
        context.globalAlpha = 1;


        if (firefly.star) {
            drawStar(
                firefly.x,
                firefly.y,
                radius,
                0.34 +
                    brightness * 0.44,
                firefly.color
            );
        }
    }


    function updateFirefly(
        firefly,
        time,
        delta
    ) {

        /*
           Slow organic wandering rather than
           straight "screensaver" movement.
        */
        firefly.vx +=
            Math.sin(
                time *
                firefly.wanderX +
                firefly.wanderPhaseX
            ) *
            0.00055 *
            delta;

        firefly.vy +=
            Math.cos(
                time *
                firefly.wanderY +
                firefly.wanderPhaseY
            ) *
            0.00048 *
            delta;


        /*
           Cursor interaction:
           nearby lights orbit / slide around the pointer
           and become brighter instead of all chasing it.
        */
        if (
            pointer.active &&
            !isMobile
        ) {

            const dx =
                pointer.x -
                firefly.x;

            const dy =
                pointer.y -
                firefly.y;

            const distance =
                Math.hypot(dx, dy);

            const influenceRadius =
                230;


            if (
                distance > 0 &&
                distance < influenceRadius
            ) {

                const force =
                    1 -
                    distance /
                    influenceRadius;

                const nx =
                    dx / distance;

                const ny =
                    dy / distance;


                /*
                   Small attraction + sideways force
                   creates an orbit-like response.
                */
                firefly.vx +=
                    nx *
                    force *
                    0.0014 *
                    delta;

                firefly.vy +=
                    ny *
                    force *
                    0.0014 *
                    delta;

                firefly.vx +=
                    -ny *
                    force *
                    0.0010 *
                    delta;

                firefly.vy +=
                    nx *
                    force *
                    0.0010 *
                    delta;


                firefly.cursorGlow +=
                    (
                        force -
                        firefly.cursorGlow
                    ) * 0.075;
            } else {

                firefly.cursorGlow *=
                    0.94;
            }
        } else {

            firefly.cursorGlow *=
                0.94;
        }


        const maxSpeed =
            0.095 *
            firefly.depth;

        const speed =
            Math.hypot(
                firefly.vx,
                firefly.vy
            );


        if (speed > maxSpeed) {

            firefly.vx =
                firefly.vx /
                speed *
                maxSpeed;

            firefly.vy =
                firefly.vy /
                speed *
                maxSpeed;
        }


        firefly.x +=
            firefly.vx *
            delta;

        firefly.y +=
            firefly.vy *
            delta;


        /*
           Soft wrap keeps motion continuous
           without visible bouncing at screen edges.
        */
        const margin =
            firefly.halo + 18;


        if (
            firefly.x <
            -margin
        ) {
            firefly.x =
                width + margin;
        }

        if (
            firefly.x >
            width + margin
        ) {
            firefly.x =
                -margin;
        }

        if (
            firefly.y <
            -margin
        ) {
            firefly.y =
                height + margin;
        }

        if (
            firefly.y >
            height + margin
        ) {
            firefly.y =
                -margin;
        }
    }


    function animate(time) {

        const delta =
            Math.min(
                32,
                Math.max(
                    8,
                    time - lastTime
                )
            );

        lastTime = time;


        context.clearRect(
            0,
            0,
            width,
            height
        );


        fireflies.forEach(
            (firefly) => {

                updateFirefly(
                    firefly,
                    time,
                    delta
                );

                drawFirefly(
                    firefly,
                    time
                );
            }
        );


        animationFrame =
            requestAnimationFrame(
                animate
            );
    }


    function handlePointerMove(event) {

        pointer.x =
            event.clientX;

        pointer.y =
            event.clientY;

        pointer.active = true;
    }


    function handlePointerLeave() {
        pointer.active = false;
    }


    function handleVisibility() {

        if (document.hidden) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = 0;

        } else if (!animationFrame) {

            lastTime =
                performance.now();

            animationFrame =
                requestAnimationFrame(
                    animate
                );
        }
    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas,
        { passive: true }
    );


    if (!isMobile) {

        window.addEventListener(
            "pointermove",
            handlePointerMove,
            { passive: true }
        );

        document.documentElement
            .addEventListener(
                "pointerleave",
                handlePointerLeave
            );
    }


    document.addEventListener(
        "visibilitychange",
        handleVisibility
    );


    animationFrame =
        requestAnimationFrame(
            animate
        );
}


createFireflyField();

