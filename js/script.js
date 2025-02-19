document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // ===== MENÚ MÓVIL =====
    const menuToggle = document.querySelector('.mobile-nav .menu-toggle');
    const navLinks = document.querySelector('.mobile-nav .nav-links');
    const tiendaMenu = document.querySelector('.mobile-nav .tienda-menu');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (tiendaMenu) {
        tiendaMenu.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                tiendaMenu.classList.toggle('active');
            }
        });
    }

    // ===== SCROLL HEADER =====
    function handleScroll() {
        const header = document.querySelector('header');
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleScroll);
    }

    // ===== CARRUSEL =====
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        let currentSlide = 0;
        let isMoving = false;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        let autoplayInterval;

        function moveSlide(direction) {
            if (isMoving) return;
            isMoving = true;

            const movement = direction === 'next' ? -100 : 100;
            currentSlide = direction === 'next' ? 
                (currentSlide + 1) % totalSlides : 
                (currentSlide - 1 + totalSlides) % totalSlides;

            carousel.style.transform = `translateX(${currentSlide * -50}%)`;

            setTimeout(() => {
                isMoving = false;
            }, 500);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(() => moveSlide('next'), 5000);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        // Event Listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoplay();
                moveSlide('prev');
                startAutoplay();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoplay();
                moveSlide('next');
                startAutoplay();
            });
        }

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Iniciar el carrusel
        startAutoplay();
    }

    // ===== MODAL DE COMPRA RÁPIDA =====
    const modal = document.getElementById('modalCompra');
    const closeBtn = document.querySelector('.close-modal');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const quantityInput = document.getElementById('quantity');
    
    if (!modal || !closeBtn || !addToCartBtn || !quantityInput) {
        console.error('Elementos del modal no encontrados');
        return;
    }

    // Función para abrir el modal
    function openModal(productData) {
        if (!productData) return;
        console.log('Abriendo modal con:', productData);
        
        const modalImg = document.getElementById('modalProductImage');
        const modalName = document.getElementById('modalProductName');
        const modalPrice = document.getElementById('modalProductPrice');

        if (modalImg) modalImg.src = productData.image;
        if (modalName) modalName.textContent = productData.name;
        if (modalPrice) modalPrice.textContent = productData.price;
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // Resetear formulario
            document.getElementById('size').value = '';
            quantityInput.value = '1';
        }, 300);
    }

    // Agregar botones solo a productos (no al carrusel)
    document.querySelectorAll('.product-item img, .collection-item img').forEach((img, index) => {
        const container = img.closest('.product-item, .collection-item');
        if (!container) return;

        // Crear botón de compra rápida
        const buyButton = document.createElement('button');
        buyButton.className = 'quick-buy-btn';
        buyButton.textContent = 'Compra Rápida';
        
        // Datos del producto
        const productData = {
            image: img.src,
            name: container.querySelector('h3')?.textContent.split('→')[0].trim() || 'Producto',
            price: `$${Math.floor(Math.random() * 50000) + 10000}`,
            id: `prod-${index + 1}`
        };

        // Eventos de clic
        buyButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(productData);
        };

        // Añadir botón al contenedor
        container.appendChild(buyButton);
    });

    // Eventos del modal
    closeBtn.onclick = (e) => {
        e.preventDefault();
        closeModal();
    };

    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };

    // Controles de cantidad
    document.querySelector('.quantity-btn.minus').onclick = () => {
        const value = parseInt(quantityInput.value);
        if (value > 1) quantityInput.value = value - 1;
    };

    document.querySelector('.quantity-btn.plus').onclick = () => {
        const value = parseInt(quantityInput.value);
        if (value < 10) quantityInput.value = value + 1;
    };

    // Agregar al carrito
    addToCartBtn.onclick = () => {
        const size = document.getElementById('size').value;
        if (!size) {
            alert('Por favor selecciona una talla');
            return;
        }

        // Simular agregar al carrito
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            let badge = cartIcon.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                cartIcon.appendChild(badge);
            }
            
            const currentCount = parseInt(badge.textContent || '0');
            badge.textContent = currentCount + 1;

            // Mostrar notificación
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = 'Producto agregado al carrito';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        closeModal();
    };
});
