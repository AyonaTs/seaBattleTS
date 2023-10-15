class Shot {
  x: number;
  y: number;
  variant = 'miss';

  constructor(x: number, y: number, variant: string) {
    this.y = y
    this.x = x
    this.variant = variant
  }

  setVariant (variant: string) {
    this.variant = variant;
  }
}
export default Shot