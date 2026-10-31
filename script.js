document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });

  const cards = [...document.querySelectorAll('.movie-card')];
  document.querySelectorAll('.movie-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      window.location.href = 'movie.html';
    });
  });
  document.querySelectorAll('.save-button').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.classList.toggle('active');
      const icon = button.querySelector('i');
      icon?.classList.toggle('fa-regular', !active);
      icon?.classList.toggle('fa-solid', active);
      button.setAttribute('aria-label', active ? 'Удалить из избранного' : 'Добавить в избранное');
    });
  });
  document.querySelectorAll('.genre-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const genre = chip.dataset.genre;
      cards.forEach((card) => {
        card.hidden = card.dataset.genre !== genre;
      });
      document.querySelector('#hits').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const openModal = (modal) => modal.classList.add('is-open');
  const closeModal = (modal) => modal.classList.remove('is-open');
  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.closest('.modal-close')) closeModal(modal);
    });
  });
  document.querySelectorAll('.modal-close-action').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.closest('.modal')));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') document.querySelectorAll('.modal.is-open').forEach(closeModal);
    if (event.key === 'Escape') setFiltersOpen?.(false);
  });

  document.querySelectorAll('.review-button').forEach((button) => {
    button.addEventListener('click', () => {
      window.location.href = 'votes.html';
    });
  });
  document.querySelectorAll('.reviewed-card').forEach((card) => {
    const openReview = () => {
      const movie = document.querySelector('#review-movie');
      if (movie) movie.textContent = card.dataset.movie;
      openModal(document.querySelector('#review-modal'));
    };
    card.addEventListener('click', openReview);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openReview();
      }
    });
  });
  document.querySelector('.vote-button')?.addEventListener('click', () => {
    window.location.href = 'votes.html';
  });
  document.querySelector('.watched-button')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const watched = button.classList.toggle('watched-active');
    button.textContent = watched ? 'Просмотрено ✓' : 'Отметить как просмотренное';
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((item) => {
        item.classList.toggle('is-active', item === tab);
        item.setAttribute('aria-selected', String(item === tab));
      });
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.tab;
        panel.classList.toggle('is-active', panel.id === tab.dataset.tab);
      });
    });
  });
  document.querySelectorAll('.stars button').forEach((star, index, stars) => {
    star.addEventListener('click', () => stars.forEach((item, itemIndex) => {
      item.style.opacity = itemIndex <= index ? '1' : '.35';
    }));
  });
  document.querySelector('.modal-submit')?.addEventListener('click', () => closeModal(document.querySelector('#review-modal')));

  document.querySelectorAll('.vote-stars button').forEach((star, index, stars) => {
    star.addEventListener('click', () => stars.forEach((item, itemIndex) => item.classList.toggle('is-selected', itemIndex <= index)));
  });
  document.querySelector('.vote-form')?.addEventListener('submit', (event) => event.preventDefault());

  document.querySelectorAll('.password-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      toggle.textContent = visible ? '◉' : '◎';
      toggle.setAttribute('aria-label', visible ? 'Показать пароль' : 'Скрыть пароль');
    });
  });
  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const error = form.querySelector('.form-error');
      const fields = [...form.querySelectorAll('input[required]')];
      const empty = fields.find((field) => !field.value.trim());
      const password = form.querySelector('input[name="password"]');
      const confirmation = form.querySelector('input[name="password-confirm"]');
      if (empty) {
        error.textContent = 'Заполните все обязательные поля.';
        empty.focus();
        return;
      }
      if (confirmation && password.value !== confirmation.value) {
        error.textContent = 'Пароли должны совпадать.';
        confirmation.focus();
        return;
      }
      if (password.value.length < 6) {
        error.textContent = 'Пароль должен содержать минимум 6 символов.';
        password.focus();
        return;
      }
      error.textContent = '';
      form.classList.remove('has-error');
      window.location.href = 'profile.html';
    });
  });

  const filterToggle = document.querySelector('.filter-toggle');
  const filterPanel = document.querySelector('.catalog-filters');
  const filterClose = document.querySelector('.filter-close');
  const setFiltersOpen = (open) => {
    if (!filterPanel || !filterToggle) return;
    filterPanel.classList.toggle('is-open', open);
    filterToggle.setAttribute('aria-expanded', String(open));
  };
  filterToggle?.addEventListener('click', () => setFiltersOpen(!filterPanel.classList.contains('is-open')));
  filterClose?.addEventListener('click', () => setFiltersOpen(false));

  const logoutModal = document.querySelector('#logout-modal');
  document.querySelector('.logout-button')?.addEventListener('click', () => openModal(logoutModal));
  document.querySelector('.modal-close-action')?.addEventListener('click', () => closeModal(logoutModal));
  document.querySelector('.profile-form')?.addEventListener('submit', (event) => event.preventDefault());

  const pickRandomMovie = () => {
    const movie = cards[Math.floor(Math.random() * cards.length)];
    if (!movie) return;
    document.querySelector('.lucky-result').textContent = movie.querySelector('h3').textContent;
    openModal(document.querySelector('#lucky-modal'));
  };
  document.querySelector('#lucky-button')?.addEventListener('click', pickRandomMovie);
  document.querySelector('#hero-lucky-button')?.addEventListener('click', pickRandomMovie);
});
