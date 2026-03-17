const makePageApp = () => {
  let
    notifications = [],
    sweeps = [];
  const $base = document.querySelector('template#toast-container');

  const add_notification = () => {
    const
      _$container = document.importNode($base.content, true),
      _$notification = _$container.querySelector('.toast'),
      _notiCancel = new AbortController(),
      _notiAbortSignal = _notiCancel.signal;

    _$notification.querySelector('button.close').addEventListener('click', (_clickEvt) => {
      let toRemove;

      if (_clickEvt.target.parentNode !== _$notification) { return; }
    
      _$notification.hidePopover();
      _$notification.style.setProperty('display', 'none');
      _$notification.classList.add('gc-me');

      toRemove = notifications.indexOf(_$notification);

      if (toRemove != -1) {
        sweeps.push(notifications[toRemove]);
        notifications = notifications.toSpliced(toRemove, 1);
        _$notification.remove();
      }
    });

    document.querySelector('#toaster').appendChild(_$notification);
    _$notification.showPopover();

    if (notifications.length >= 3) {
      const _$byeNoti = notifications.shift();

      _$byeNoti.hidePopover();
      _$byeNoti.style.setProperty('display', 'none');
      _$byeNoti.classList.add('gc-me');
      sweeps.push(_$byeNoti);
      _$byeNoti.remove();
    }
    
    notifications.push(_$notification);
    
  };

  return Object.freeze({
    boot: () => { console.log("app started"); },
    newToast: add_notification
  });
};

let singlePageApp;

const getSinglePageApp = () => {
  if (!singlePageApp) {
    singlePageApp = makePageApp();
  }

  return singlePageApp;
};

export default makePageApp;
