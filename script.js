document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Header scroll background
    const header = document.getElementById('navbar');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('bg-white', 'shadow-md', 'py-4');
                header.classList.remove('bg-transparent', 'py-6');
                header.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.add('text-slate-800');
                    link.classList.remove('text-white');
                });
                const logo = document.getElementById('logo');
                if(logo) {
                    logo.classList.add('text-slate-900');
                    logo.classList.remove('text-white');
                }
            } else {
                header.classList.remove('bg-white', 'shadow-md', 'py-4');
                header.classList.add('bg-transparent', 'py-6');
                // Only on homepage hero section (transparent nav)
                if(document.body.classList.contains('transparent-nav')) {
                    header.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('text-slate-800');
                        link.classList.add('text-white');
                    });
                    const logo = document.getElementById('logo');
                    if(logo) {
                        logo.classList.remove('text-slate-900');
                        logo.classList.add('text-white');
                    }
                }
            }
        });
    }

    // Image preview for add-property form
    const imageInput = document.getElementById('property-images');
    const previewContainer = document.getElementById('image-preview-container');
    let base64Images = [];

    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function(event) {
            previewContainer.innerHTML = '';
            base64Images = []; // reset
            const files = event.target.files;
            
            if (files) {
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            base64Images.push(e.target.result);
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.className = 'w-full h-32 object-cover rounded-lg shadow-sm border border-slate-200';
                            previewContainer.appendChild(img);
                        }
                        reader.readAsDataURL(file);
                    }
                });
            }
        });
    }

    // Form Submission for Add Property
    const addPropertyForm = document.getElementById('add-property-form');
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect data
            const newProperty = {
                id: Date.now(),
                title: document.getElementById('prop-title').value,
                status: document.getElementById('prop-status').value,
                type: document.getElementById('prop-type').value,
                price: document.getElementById('prop-price').value,
                area: document.getElementById('prop-area').value || 'N/A',
                address: document.getElementById('prop-address').value,
                city: document.getElementById('prop-city').value,
                state: document.getElementById('prop-state').value,
                beds: document.getElementById('prop-beds').value || '0',
                baths: document.getElementById('prop-baths').value || '0',
                desc: document.getElementById('prop-desc').value,
                image: base64Images.length > 0 ? base64Images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' // fallback
            };

            // Save to LocalStorage
            let properties = JSON.parse(localStorage.getItem('elysian_properties')) || [];
            properties.push(newProperty);
            
            try {
                localStorage.setItem('elysian_properties', JSON.stringify(properties));
                alert('Property listed successfully!');
                addPropertyForm.reset();
                if(previewContainer) previewContainer.innerHTML = '';
                base64Images = [];
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    alert('Images are too large to save in local storage. Try adding without images or using smaller ones.');
                } else {
                    alert('An error occurred while saving the property.');
                }
            }
        });
    }

    // Load Properties onto Properties Grid
    const propertiesGrid = document.getElementById('properties-grid');
    if (propertiesGrid) {
        const savedProperties = JSON.parse(localStorage.getItem('elysian_properties')) || [];
        
        savedProperties.forEach(prop => {
            // Format price
            const formattedPrice = Number(prop.price).toLocaleString();
            const statusClass = prop.status.toLowerCase().includes('sale') ? 'bg-primary' : 'bg-secondary';
            const statusText = prop.status.toUpperCase();
            
            const cardHTML = `
                <a href="#" class="property-card group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 flex flex-col h-full">
                    <div class="relative overflow-hidden h-64">
                        <div class="absolute top-4 left-4 z-10 ${statusClass} text-white text-xs font-bold px-3 py-1 rounded tracking-wider">${statusText}</div>
                        <img src="${prop.image}" alt="${prop.title}" class="property-img w-full h-full object-cover transition-transform duration-700">
                        <div class="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded shadow-sm text-primary font-bold">
                            $${formattedPrice}
                        </div>
                    </div>
                    <div class="p-5 flex-1 flex flex-col">
                        <div class="text-secondary text-sm font-medium mb-1">${prop.city}${prop.state ? ', ' + prop.state : ''}</div>
                        <h3 class="text-lg font-serif text-slate-800 font-bold mb-3 line-clamp-1">${prop.title}</h3>
                        <div class="flex items-center gap-4 text-slate-500 text-sm mb-4 mt-auto">
                            <div class="flex items-center gap-1"><i data-lucide="bed" class="w-4 h-4"></i> ${prop.beds}</div>
                            <div class="flex items-center gap-1"><i data-lucide="bath" class="w-4 h-4"></i> ${prop.baths}</div>
                            <div class="flex items-center gap-1"><i data-lucide="maximize" class="w-4 h-4"></i> ${prop.area} sqft</div>
                        </div>
                        <div class="border-t border-slate-100 pt-3 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <img src="https://i.pravatar.cc/100?img=68" alt="Agent" class="w-6 h-6 rounded-full">
                                <span class="text-xs text-slate-600">You (Owner)</span>
                            </div>
                            <button class="text-slate-400 hover:text-red-500 transition-colors"><i data-lucide="heart" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                </a>
            `;
            
            // Insert at the beginning of the grid
            propertiesGrid.insertAdjacentHTML('afterbegin', cardHTML);
        });

        // Re-initialize any new lucide icons that were injected dynamically
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});
