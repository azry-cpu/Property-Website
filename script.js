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

    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function(event) {
            previewContainer.innerHTML = '';
            const files = event.target.files;
            
            if (files) {
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
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
});
