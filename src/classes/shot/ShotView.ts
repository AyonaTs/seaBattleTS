import Shot from "./Shot.ts";

class ShotView extends Shot {
  div = document.createElement("div");

  constructor(x: number, y: number, variant = "miss") {
    super(x, y, variant);
    this.div.classList.add("shot");
    this.setVariant(variant, true);
  }

  setVariant (variant: string, force = false) {
    if (!force && this.variant === variant) {
      return false;
    }

    this.variant = variant;

    this.div.classList.remove("shot-missed", "shot-wounded", "shot-killed");
    this.div.textContent = "";

    if (this.variant === "miss") {
      this.div.classList.add("shot-missed");
      this.div.textContent = '♥';
    } else if (this.variant === "wounded") {
      this.div.classList.add("shot-wounded");
    } else if (this.variant === "killed") {
      this.div.classList.add("shot-wounded", "shot-killed");
    }

    return true;
  }
}

export default ShotView