/**
 * LE CARNET - Script principal
 * Gestion du Thème Sombre, Menu Mobile, Recherche & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. GESTION DU THÈME SOMBRE (DARK MODE)
    // --------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Détecter l'état précédent enregistré ou la préférence système
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // Basculer au clic sur le bouton
    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            showToast('Mode clair activé ☀️', 'info');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            showToast('Mode sombre activé 🌙', 'info');
        }
    });

    // --------------------------------------------------------------------------
    // 2. MENU MOBILE RESPONSIVE
    // --------------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Fermer automatiquement le menu après le clic sur un lien
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // --------------------------------------------------------------------------
    // 3. SYSTÈME DE NOTIFICATION TOAST (Remplace alert())
    // --------------------------------------------------------------------------
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        if (type === 'emerald') {
            toast.style.backgroundColor = '#059669';
        }

        container.appendChild(toast);

        // Animation d'apparition
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Masquer et supprimer après 3.5 secondes
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    // --------------------------------------------------------------------------
    // 4. RECHERCHE DYNAMIQUE D'ARTICLES
    // --------------------------------------------------------------------------
    const searchInput = document.getElementById('search-input');
    const articleCards = document.querySelectorAll('.article-card');
    const noResults = document.getElementById('no-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            articleCards.forEach(card => {
                const title = card.getAttribute('data-title')?.toLowerCase() || '';
                const content = card.textContent.toLowerCase();

                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Gérer le message si aucun article trouvé
            if (visibleCount === 0 && noResults) {
                noResults.classList.remove('hidden');
            } else if (noResults) {
                noResults.classList.add('hidden');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 5. FILTRES PAR CATÉGORIE
    // --------------------------------------------------------------------------
    const categoryButtons = document.querySelectorAll('.category-filter');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour de l'apparence des boutons de filtre
            categoryButtons.forEach(b => {
                b.classList.remove('btn-filter-active');
                b.classList.add('btn-filter');
            });
            btn.classList.add('btn-filter-active');
            btn.classList.remove('btn-filter');

            const category = btn.getAttribute('data-category');

            articleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Re-réinitialiser la recherche
            if (searchInput) searchInput.value = '';
            if (noResults) noResults.classList.add('hidden');
        });
    });

    // --------------------------------------------------------------------------
    // 6. SOUMISSION DE FORMULAIRE & ACTIONS UTILISATEURS
    // --------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (newsletterEmail && newsletterEmail.value.trim() !== '') {
                showToast('Merci ! Vous êtes bien inscrit à la newsletter ✉️', 'emerald');
                newsletterEmail.value = '';
            }
        });
    }

    // Gestion du clic sur la lecture des articles
    const articleTriggers = document.querySelectorAll('.article-trigger, .read-more-btn');
    articleTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.article-card');
            const title = card ? card.getAttribute('data-title') : 'Article';
            showToast(`Lecture de : "${title}"`, 'info');
        });
    });

});