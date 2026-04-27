(() => {
  const id = 'ferdium-kimi-google-callback-relay';
  const stateKey = '__ferdiumKimiGoogleCallbackRelay';
  const previous = window[stateKey];
  const labels = {
    ready: 'Paste Google callback',
    copyFirst: 'Copy callback URL first',
    clipboardBlocked: 'Clipboard blocked',
    signingIn: 'Signing in...',
    reloading: 'Reloading Kimi...',
    failed: 'Login exchange failed',
  };
  const resetDelayMs = 1800;
  const failureDelayMs = 2200;
  const retryDelayMs = 1200;
  const homeUrl = 'https://www.kimi.com/';
  const prefixes = [
    'https://www.kimi.com/google-callback#',
    'https://kimi.com/google-callback#',
  ];
  const state = {
    credential: '',
    resetTimer: 0,
    loginTimer: 0,
    pasteHandler: null,
  };

  if (previous?.pasteHandler) {
    document.removeEventListener('paste', previous.pasteHandler, true);
  }

  if (previous?.resetTimer) {
    window.clearTimeout(previous.resetTimer);
  }

  if (previous?.loginTimer) {
    window.clearTimeout(previous.loginTimer);
  }

  window[stateKey] = state;

  const normalize = value => {
    const url = value.trim();

    if (!prefixes.some(prefix => url.startsWith(prefix))) {
      return '';
    }

    return url.replace('https://kimi.com/', 'https://www.kimi.com/');
  };

  const getButton = () => document.getElementById(id);

  const setLabel = label => {
    const button = getButton();

    if (button) {
      button.textContent = label;
    }
  };

  const resetLabel = (label, delay = resetDelayMs) => {
    setLabel(label);
    window.clearTimeout(state.resetTimer);
    state.resetTimer = window.setTimeout(() => setLabel(labels.ready), delay);
  };

  const returnHome = () => {
    window.location.replace(homeUrl);
  };

  const getCredential = value => {
    const url = normalize(value);

    if (!url) {
      return '';
    }

    return new URLSearchParams(url.split('#')[1] || '').get('id_token') || '';
  };

  const storeLogin = data => {
    if (!data?.access_token || !data?.refresh_token) {
      return false;
    }

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    if (data.user?.id && !data.user?.is_anonymous) {
      localStorage.setItem('msh_user_id', data.user.id.trim());
    }

    return true;
  };

  const directLogin = async credential => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Language': navigator.language || 'en-US',
      'x-msh-platform': 'web',
    };
    const anonymousToken = localStorage.getItem('anonymous_access_token');

    if (anonymousToken) {
      headers.Authorization = `Bearer ${anonymousToken}`;
    }

    const response = await fetch('/api/auth/login/google', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ code: credential }),
    });

    if (!response.ok) {
      throw new Error(`login exchange failed: ${response.status}`);
    }

    const data = await response.json();

    if (!storeLogin(data)) {
      throw new Error('login exchange returned no token');
    }

    return data;
  };

  const completeLogin = credential => {
    if (state.credential === credential) {
      return;
    }

    state.credential = credential;
    setLabel(labels.signingIn);
    window.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS', credential }, window.location.origin);
    window.clearTimeout(state.loginTimer);
    state.loginTimer = window.setTimeout(async () => {
      if (localStorage.getItem('access_token')) {
        setLabel(labels.reloading);
        returnHome();
        return;
      }

      try {
        await directLogin(credential);
        setLabel(labels.reloading);
        returnHome();
      } catch (error) {
        console.error(error);
        state.credential = '';
        resetLabel(labels.failed, failureDelayMs);
      }
    }, retryDelayMs);
  };

  const relay = async () => {
    try {
      const credential = getCredential(await navigator.clipboard.readText());

      if (!credential) {
        resetLabel(labels.copyFirst);
        return;
      }

      completeLogin(credential);
    } catch {
      resetLabel(labels.clipboardBlocked);
    }
  };

  const mount = () => {
    getButton()?.remove();

    const button = document.createElement('button');
    button.id = id;
    button.type = 'button';
    button.textContent = labels.ready;
    Object.assign(button.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: '2147483647',
      padding: '9px 12px',
      border: '1px solid rgba(255,255,255,.22)',
      borderRadius: '10px',
      background: 'rgba(20,20,24,.88)',
      color: '#fff',
      font: '12px sans-serif',
      boxShadow: '0 8px 24px rgba(0,0,0,.26)',
      cursor: 'pointer',
    });
    button.addEventListener('click', relay);
    document.documentElement.appendChild(button);
  };

  const finishCallback = () => {
    const credential = getCredential(window.location.href);

    if (!credential) {
      return;
    }

    completeLogin(credential);
  };

  const handlePaste = event => {
    const credential = getCredential(event.clipboardData?.getData('text') || '');

    if (!credential) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    completeLogin(credential);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  finishCallback();
  state.pasteHandler = handlePaste;
  document.addEventListener('paste', state.pasteHandler, true);
})();
