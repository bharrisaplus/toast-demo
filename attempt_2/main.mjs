const makePageApp = () => {
  let
    notifications = [],
    uiCount = 1;
  const $base = document.querySelector('template#toast-container');

  const add_notification = () => {
    const
      _$container = document.importNode($base.content, true),
      _$notification = _$container.querySelector('.toast'),
      _notiAbortController = new AbortController();

    let notiMsg = _$notification.querySelector('p').textContent;

    _$notification.querySelector('p').textContent = `${notiMsg}, Numbah ${uiCount++}`;
    
    _$notification.querySelector('button.close').addEventListener('click', (_clickEvt) => {
      let
        toRemove,
        _gcClose;

      if (_clickEvt.target.parentNode !== _$notification) { return; }

      toRemove = notifications.map((notiItm) => notiItm.$elm ).indexOf(_$notification);

      if (notifications.length == 1) {
        document.querySelector('#toaster').hidePopover();
      }

      if (toRemove == -1) {
        _$notification.remove();
        return;
      }

      _gcClose = notifications[toRemove];
      _gcClose.cancel.abort();
      notifications = notifications.toSpliced(toRemove, 1);
      _gcClose.$elm.remove();
    }, {signal: _notiAbortController.signal});

    document.querySelector('#toaster').appendChild(_$notification);
    document.querySelector('#toaster').showPopover();

    if (notifications.length >= 3) {
      const _gcBye = notifications.shift();

      _gcBye.cancel.abort();
      _gcBye.$elm.remove();
    }

    notifications.push({$elm: _$notification, cancel: _notiAbortController});
    
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
