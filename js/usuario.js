
let currentMode = 'edit';
let profileData = {};


function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Arquivo muito grande! Máximo 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const photoUrl = e.target.result;
            document.getElementById('profilePhoto').src = photoUrl;
            document.getElementById('previewPhoto').src = photoUrl;
            profileData.photo = photoUrl;
            showNotification('Foto atualizada com sucesso!');
        };
        reader.readAsDataURL(file);
    }
}


function saveProfile() {

    profileData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        title: document.getElementById('title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        bio: document.getElementById('bio').value,
        social: {
            facebook: document.getElementById('facebook').value,
            instagram: document.getElementById('instagram').value,
            linkedin: document.getElementById('linkedin').value,
            twitter: document.getElementById('twitter').value,
            github: document.getElementById('github').value,
            website: document.getElementById('website').value
        },
        photo: document.getElementById('profilePhoto').src
    };


    if (!profileData.firstName || !profileData.lastName) {
        showNotification('Nome e sobrenome são obrigatórios!', 'error');
        return;
    }

    if (!isValidEmail(profileData.email)) {
        showNotification('E-mail inválido!', 'error');
        return;
    }


    localStorage.setItem('userProfile', JSON.stringify(profileData));

    showNotification('Perfil salvo com sucesso!');
}


function previewProfile() {

    updatePreviewData();


    document.getElementById('editMode').classList.add('hidden');
    document.getElementById('previewMode').classList.add('active');
    currentMode = 'preview';
}


function editProfile() {
    document.getElementById('previewMode').classList.remove('active');
    document.getElementById('editMode').classList.remove('hidden');
    currentMode = 'edit';
}


function updatePreviewData() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    document.getElementById('previewName').textContent = `${firstName} ${lastName}`;
    document.getElementById('previewTitle').textContent = document.getElementById('title').value;
    document.getElementById('previewBio').textContent = document.getElementById('bio').value;
    document.getElementById('previewEmail').textContent = document.getElementById('email').value;
    document.getElementById('previewPhone').textContent = document.getElementById('phone').value;
    document.getElementById('previewLocation').textContent = document.getElementById('location').value;


    updateSocialLinksPreview();
}


function updateSocialLinksPreview() {
    const socialContainer = document.getElementById('socialLinksPreview');
    socialContainer.innerHTML = '';

    const socialData = [
        { id: 'facebook', icon: '📘', name: 'Facebook' },
        { id: 'instagram', icon: '📸', name: 'Instagram' },
        { id: 'linkedin', icon: '💼', name: 'LinkedIn' },
        { id: 'twitter', icon: '🐦', name: 'Twitter' },
        { id: 'github', icon: '💻', name: 'GitHub' },
        { id: 'website', icon: '🌐', name: 'Website' }
    ];

    socialData.forEach(social => {
        const url = document.getElementById(social.id).value;
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.className = 'social-link';
            link.target = '_blank';
            link.innerHTML = `${social.icon} ${social.name}`;
            socialContainer.appendChild(link);
        }
    });
}


function resetForm() {
    if (confirm('Tem certeza que deseja resetar todas as informações?')) {
        document.getElementById('firstName').value = 'João';
        document.getElementById('lastName').value = 'Silva';
        document.getElementById('title').value = 'Desenvolvedor Full Stack';
        document.getElementById('email').value = 'joao.silva@email.com';
        document.getElementById('phone').value = '(11) 99999-9999';
        document.getElementById('location').value = 'São Paulo, SP';
        document.getElementById('bio').value = 'Desenvolvedor apaixonado por tecnologia, sempre em busca de novos desafios e oportunidades de aprendizado. Especializado em desenvolvimento web full stack com foco em soluções inovadoras.';


        document.getElementById('facebook').value = '';
        document.getElementById('instagram').value = '';
        document.getElementById('linkedin').value = '';
        document.getElementById('twitter').value = '';
        document.getElementById('github').value = '';
        document.getElementById('website').value = '';

        const defaultPhoto = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
        document.getElementById('profilePhoto').src = defaultPhoto;
        document.getElementById('previewPhoto').src = defaultPhoto;

        showNotification('Formulário resetado!');
    }
}


function goToCards() {

    showNotification('Redirecionando para cartões cadastrados...');


    setTimeout(() => {
        alert('Aqui você seria redirecionado para a página de cartões cadastrados!\n\nEsta é apenas uma demonstração.');
    }, 1000);
}


function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadSavedProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const data = JSON.parse(savedProfile);

        document.getElementById('firstName').value = data.firstName || '';
        document.getElementById('lastName').value = data.lastName || '';
        document.getElementById('title').value = data.title || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('bio').value = data.bio || '';

        if (data.social) {
            document.getElementById('facebook').value = data.social.facebook || '';
            document.getElementById('instagram').value = data.social.instagram || '';
            document.getElementById('linkedin').value = data.social.linkedin || '';
            document.getElementById('twitter').value = data.social.twitter || '';
            document.getElementById('github').value = data.social.github || '';
            document.getElementById('website').value = data.social.website || '';
        }

        if (data.photo) {
            document.getElementById('profilePhoto').src = data.photo;
            document.getElementById('previewPhoto').src = data.photo;
        }
    }
}


function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = value;
}

document.getElementById('phone').addEventListener('input', function () {
    formatPhone(this);
});


document.getElementById('email').addEventListener('blur', function () {
    if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = '#ef4444';
        showNotification('E-mail inválido!', 'error');
    } else {
        this.style.borderColor = '';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    loadSavedProfile();
});

setInterval(() => {
    if (currentMode === 'edit') {
        const currentData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            title: document.getElementById('title').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value
        };

        if (currentData.firstName && currentData.lastName) {
            localStorage.setItem('userProfileDraft', JSON.stringify(currentData));
        }
    }
}, 30000);