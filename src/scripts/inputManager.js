class InputManager {
  constructor() {
    this.events = {};
    this.listen();
  }

  on(event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  listen() {
    const map = {
      ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, // Arrows
      k: 0, l: 1, j: 2, h: 3,                               // Vim keybindings
      w: 0, d: 1, s: 2, a: 3                                // WASD
    };

    document.addEventListener("keydown", event => {
      const { altKey, ctrlKey, metaKey, shiftKey, key } = event;
      const modifiers = altKey || ctrlKey || metaKey || shiftKey;
      const mapped = map[key];

      if (!modifiers && mapped !== undefined) {
        event.preventDefault();
        this.emit("move", mapped);
      }

      if (key === " ") this.restart(event);
    });

    const retry = document.querySelector(".retry-button");
    retry.addEventListener("click", this.restart.bind(this));


    let touchStartClientX, touchStartClientY;

    document.addEventListener("touchstart", event => {
      if (event.touches.length === 1) {
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
        event.preventDefault();
      }
    });

    document.addEventListener("touchmove", event => {
      event.preventDefault();
    });

    document.addEventListener("touchend", event => {
      if (event.touches.length === 0) {
        const dx = event.changedTouches[0].clientX - touchStartClientX;
        const dy = event.changedTouches[0].clientY - touchStartClientY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10) {
          this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
        }
      }
    });
  }

  restart(event) {
    event.preventDefault();
    this.emit("restart");
  }
}
