class Mouse {
  element: HTMLElement;

  under = false;
  pUnder = false;

  x: number = -100;
  y: number = -100;

  pX: number = -100;
  pY: number = -100;

  left= false;
  pLeft= false;

  delta= 0;
  pDelta = 0;

  constructor(element: HTMLElement) {
    this.element = element;

    const update = (e: MouseEvent) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.under = true;
      this.delta = 0;
    };

    element.addEventListener("mousemove", (e: MouseEvent) => {
      this.tick();
      update(e);
    });

    element.addEventListener("mouseenter", (e: MouseEvent) => {
      this.tick();
      update(e);
    });

    element.addEventListener("mouseleave", (e: MouseEvent) => {
      this.tick();
      update(e);

      this.under = false;
    });

    element.addEventListener("mouseup", (e: MouseEvent) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = false;
      }
    });

    element.addEventListener("mousedown", (e: MouseEvent) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = true;
      }
    });

    element.addEventListener("wheel", (e: WheelEvent) => {
      this.tick();

      this.x = e.clientX;
      this.y = e.clientY;
      this.under = true;
      this.delta = e.deltaY > 0 ? 1 : -1;
    });
  }

  tick() {
    this.pUnder = this.under;
    this.pX = this.x;
    this.pY = this.y;
    this.pLeft = this.left;
    this.pDelta = this.delta;
    this.delta = 0;
  }
}

export default Mouse