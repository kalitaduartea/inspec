/**
 * Inspec Caldeiras - Script Principal
 * Este arquivo contém todas as funcionalidades JavaScript do site
 * Organizado em módulos e classes para melhor manutenção e escalabilidade
 */

// =====================================================
// UTILIDADES
// =====================================================

/**
 * Função para limitar a frequência de execução de uma função
 * @param {Function} func - Função a ser executada
 * @param {Number} wait - Tempo de espera em milissegundos
 * @returns {Function} - Função com debounce aplicado
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =====================================================
// CLASSE SLIDER
// =====================================================

/**
 * Classe responsável por gerenciar o slider de imagens
 */
class Slider {
  constructor() {
    this.count = 1;
    this.maxSlides = 3; // Número total de slides
    this.sliderInterval = null;
    this.slider = document.querySelector('.slider');
    
    if (this.slider) {
      this.init();
    }
  }
  
  init() {
    // Configurar estado inicial
    this.count = 1;
document.getElementById("radio1").checked = true;

    // Atualizar os atributos de acessibilidade
    this.updateAriaAttributes();
    
    // Iniciar a rotação automática
    this.startAutoSlider();
    
    // Configurar eventos dos botões de navegação
    this.setupManualNavigation();
    
    // Adicionar suporte para navegação via teclado
    this.setupKeyboardNavigation();
  }
  
  startAutoSlider() {
    // Limpar intervalo existente, se houver
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    
    // Iniciar novo intervalo
    this.sliderInterval = setInterval(() => {
      this.nextImage();
    }, 8000); // Intervalo de 8 segundos
  }
  
  nextImage() {
    this.count++;
    if (this.count > this.maxSlides) {
      this.count = 1;
    }
    
    // Usar requestAnimationFrame para animações mais suaves
    window.requestAnimationFrame(() => {
      const radioBtn = document.getElementById("radio" + this.count);
      if (radioBtn) {
        radioBtn.checked = true;
        this.updateAriaAttributes();
      }
    });
  }
  
  updateAriaAttributes() {
    // Atualizar atributos aria para acessibilidade
    const manualBtns = document.querySelectorAll('.manual-btn');
    
    manualBtns.forEach((btn, index) => {
      const isSelected = index + 1 === this.count;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }
  
  setupManualNavigation() {
    const manualBtns = document.querySelectorAll('.manual-btn');
    
    manualBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Mudar para o slide correspondente
        this.count = index + 1;
        document.getElementById("radio" + this.count).checked = true;
        
        // Atualizar atributos de acessibilidade
        this.updateAriaAttributes();
        
        // Reiniciar a rotação automática
        this.startAutoSlider();
      });
      
      // Adicionar suporte para navegação via teclado (Enter/Space)
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
    
    // Configurar botões de seta para navegação
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        this.count = this.count > 1 ? this.count - 1 : this.maxSlides;
        document.getElementById("radio" + this.count).checked = true;
        this.updateAriaAttributes();
        this.startAutoSlider();
      });
    }
    
    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        this.nextImage();
        this.startAutoSlider();
      });
    }
  }
  
  setupKeyboardNavigation() {
    if (this.slider) {
      this.slider.addEventListener('keydown', (e) => {
        // Navegar com setas esquerda/direita
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.count = this.count > 1 ? this.count - 1 : this.maxSlides;
          document.getElementById("radio" + this.count).checked = true;
          this.updateAriaAttributes();
          this.startAutoSlider();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextImage();
          this.startAutoSlider();
        }
      });
      
      // Tornar o slider focável com Tab
      this.slider.setAttribute('tabindex', '0');
    }
  }
  
  updateSlider() {
    // Método para atualizar o slider quando a janela é redimensionada
    this.updateAriaAttributes();
  }
}

// =====================================================
// CLASSE MENU
// =====================================================

/**
 * Classe responsável por gerenciar o menu mobile e desktop
 */
class Menu {
  constructor() {
    this.menuMobile = document.querySelector('.mobile-menu');
    this.menuIcon = document.querySelector('.mobile-menu-icon button');
    
    if (this.menuIcon) {
      this.init();
    }
  }
  
  init() {
    this.menuIcon.addEventListener('click', () => this.toggleMenu());
  }
  
  toggleMenu() {
    if (this.menuMobile.classList.contains('open')) {
      this.menuMobile.classList.remove('open');
      this.menuIcon.classList.remove('open');
    } else {
      this.menuMobile.classList.add('open');
      this.menuIcon.classList.add('open');
    }
  }
  
  updateMenu() {
    // Método para atualizar o menu quando a janela é redimensionada
    if (window.innerWidth > 768) {
      this.menuMobile.classList.remove('open');
      this.menuIcon.classList.remove('open');
    }
  }
}

// =====================================================
// CLASSE COMPONENTES
// =====================================================

/**
 * Classe responsável por gerenciar os componentes da página
 */
class Components {
  constructor() {
    this.init();
  }
  
  init() {
    // Carregar header e footer
    this.loadHeader();
    this.loadFooter();
    
    // Prevenir comportamento de seleção e cursor de texto
    this.preventTextSelection();
    
    // Garantir que o footer ocupe toda a largura da tela
    this.fixFooterWidth();
    
    // Configuração personalizada do Fancybox
    this.setupFancybox();
  }
  
  loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      fetch('header.html')
        .then(response => response.text())
        .then(data => {
          headerPlaceholder.innerHTML = data;
          
          // Reaplica o evento do menu após o header ser carregado
          const menuButton = document.querySelector('.mobile-menu-icon button');
          if (menuButton) {
            menuButton.onclick = () => new Menu().toggleMenu();
          }
          
          // Adiciona funcionalidades adicionais ao cabeçalho
          this.setupNavbarInteractivity();
        })
        .catch(error => console.error('Erro ao carregar o header:', error));
    }
  }
  
  loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      fetch('footer.html')
        .then(response => response.text())
        .then(data => {
          footerPlaceholder.innerHTML = data;
          // Garantir que o footer ocupe toda a largura da tela após ser carregado
          this.fixFooterWidth();
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));
    }
  }
  
  preventTextSelection() {
    // Prevenir comportamento de seleção e cursor de texto apenas para elementos não textuais
    document.body.addEventListener('mousedown', (e) => {
      // Permitir seleção para elementos textuais
      const isTextElement = e.target.tagName === 'P' || 
                           e.target.tagName === 'H1' || 
                           e.target.tagName === 'H2' || 
                           e.target.tagName === 'H3' || 
                           e.target.tagName === 'H4' || 
                           e.target.tagName === 'H5' || 
                           e.target.tagName === 'H6' || 
                           e.target.tagName === 'LI' || 
                           e.target.tagName === 'SPAN' || 
                           e.target.tagName === 'LABEL';

      // Não interferir com campos editáveis ou elementos textuais
      if (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.getAttribute('contenteditable') === 'true' ||
          isTextElement) {
        return; // Não fazer nada, permitir comportamento padrão
      }

      // Prevenir comportamento padrão apenas nos elementos que queremos proteger
      if (e.target.tagName === 'IMG' ||
        e.target.tagName === 'SVG' ||
        e.target.classList.contains('carousel') ||
        e.target.classList.contains('slide') ||
        e.target.parentElement && e.target.parentElement.classList.contains('flickr_loaded')) {
        e.preventDefault();
      }
    });
  }
  
  fixFooterWidth() {
  const footer = document.querySelector('footer');
  const footerContent = document.getElementById('footer_content');
  const footerCopyright = document.querySelector('.footer_copyright');

  if (footer && footerContent) {
    // Definir estilos para garantir largura total
    footer.style.width = '100%';
    footer.style.maxWidth = '100%';
    footer.style.boxSizing = 'border-box';
    footer.style.left = '0';
    footer.style.right = '0';
    footer.style.overflow = 'hidden';

    footerContent.style.width = '100%';
    footerContent.style.maxWidth = '100%';
    footerContent.style.boxSizing = 'border-box';

    if (footerCopyright) {
      footerCopyright.style.width = '100%';
      footerCopyright.style.boxSizing = 'border-box';
    }

    // Forçar reflow para aplicar as mudanças imediatamente
    footer.offsetHeight;
  }
}

  setupFancybox() {
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="gallery"]', {
      // Desativa o comportamento padrão de abrir em nova aba
      target: null,

      // Configurações visuais
      mainClass: "fancybox-inline",
      parentEl: document.body,
      showClass: false,
      hideClass: false,
      Image: {
        zoom: false,
      },
      keyboard: {
        Escape: "close",
      },
      caption: function (fancybox, slide) {
        // Usa o atributo 'data-caption' como texto descritivo
        const caption = slide.triggerEl.dataset.caption || "";
        return caption;
      },
    });
  }
}
  
  setupNavbarInteractivity() {
    // Destacar a página atual no menu
    this.highlightCurrentPage();
    
    // Adicionar evento de scroll para animar a navbar
    this.setupNavbarScrollEffect();
  }
  
  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      
      // Remove classe active de todos os links
      link.classList.remove('active');
      
      // Verifica se o href do link corresponde à página atual
      if (linkHref === currentPage || 
          (currentPage === '' && linkHref === 'index.html') || 
          (currentPage === '/' && linkHref === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  setupNavbarScrollEffect() {
    const navbar = document.querySelector('.nav-bar');
    
    if (navbar) {
      // Verifica a posição inicial do scroll
      this.checkScrollPosition();
      
      // Adiciona evento de scroll
      window.addEventListener('scroll', () => {
        this.checkScrollPosition();
      });
    }
  }
  
  checkScrollPosition() {
    const navbar = document.querySelector('.nav-bar');
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
}

// =====================================================
// CLASSE FORMULÁRIO DE CONTATO
// =====================================================

/**
 * Classe responsável por gerenciar a validação e feedback visual do formulário de contato
 */
class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = this.form.querySelectorAll('input, select, textarea');
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.charCounter = null;
    
    this.init();
  }
  
  init() {
    // Adiciona validação em tempo real para cada campo
    this.fields.forEach(field => {
      field.addEventListener('input', () => this.validateField(field));
      field.addEventListener('blur', () => this.validateField(field));
      
      // Adiciona classe required para campos obrigatórios
      if (field.hasAttribute('required')) {
        field.closest('.form-group').classList.add('required');
      }
      
      // Configura contador de caracteres para textarea
      if (field.tagName === 'TEXTAREA') {
        this.setupCharCounter(field);
      }
    });
    
    // Adiciona validação no envio do formulário
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  setupCharCounter(textarea) {
    const maxLength = textarea.getAttribute('maxlength');
    if (!maxLength) return;
    
    const counter = document.createElement('span');
    counter.className = 'char-counter';
    counter.textContent = `0/${maxLength}`;
    
    textarea.parentNode.style.position = 'relative';
    textarea.parentNode.appendChild(counter);
    
    this.charCounter = counter;
    
    textarea.addEventListener('input', () => {
      const length = textarea.value.length;
      counter.textContent = `${length}/${maxLength}`;
      
      // Atualiza classes de warning/error baseado no número de caracteres
      counter.classList.remove('warning', 'error');
      if (length >= maxLength * 0.9) {
        counter.classList.add('warning');
      }
      if (length >= maxLength) {
        counter.classList.add('error');
      }
    });
  }
  
  validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message') || 
                        this.createErrorMessage(formGroup);
    
    // Remove classes de erro/sucesso anteriores
    formGroup.classList.remove('error', 'success');
    
    // Validações específicas por tipo de campo
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      message = 'Este campo é obrigatório';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
      message = 'Por favor, insira um email válido';
    } else if (field.type === 'tel' && field.value) {
      const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
      isValid = phoneRegex.test(field.value);
      message = 'Por favor, insira um telefone válido (ex: (11) 99999-9999)';
    }
    
    // Atualiza classes e mensagens
    if (!isValid) {
      formGroup.classList.add('error');
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    } else if (field.value.trim()) {
      formGroup.classList.add('success');
      errorMessage.style.display = 'none';
    }
    
    return isValid;
  }
  
  createErrorMessage(formGroup) {
    const errorMessage = document.createElement('span');
    errorMessage.className = 'error-message';
    formGroup.appendChild(errorMessage);
    return errorMessage;
  }
  
  validateForm() {
    let isValid = true;
    this.fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    // Desabilita o botão de envio
    this.submitButton.disabled = true;
    this.submitButton.textContent = 'Enviando...';
    
    try {
      // Aqui você pode adicionar a lógica para enviar o formulário
      // Por exemplo, usando fetch para enviar para um endpoint
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // Simula um envio (substitua por sua lógica real de envio)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Feedback de sucesso
      this.showSuccessMessage();
      this.form.reset();
      
    } catch (error) {
      // Feedback de erro
      this.showErrorMessage();
      console.error('Erro ao enviar formulário:', error);
    } finally {
      // Reabilita o botão de envio
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Enviar Mensagem';
    }
  }
  
  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    this.form.parentNode.insertBefore(message, this.form);
    
    setTimeout(() => message.remove(), 5000);
  }
  
  showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente.';
    this.form.parentNode.insertBefore(message, this.form);
    
    setTimeout(() => message.remove(), 5000);
  }
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

// Inicializa os componentes da página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o slider
  const slider = new Slider();
  
  // Inicializa o menu
  const menu = new Menu();
  
  // Inicializa os componentes
  const components = new Components();
  
  // Inicializa o formulário de contato se estiver na página de contato
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    new ContactForm('contact-form');
  }
  
  // Adiciona debounce para o evento de redimensionamento
  const debouncedResize = debounce(() => {
    slider.updateSlider();
    menu.updateMenu();
  }, 250);
  
  window.addEventListener('resize', debouncedResize);
});
