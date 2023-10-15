class Ship {
  size: number = 0;
  direction: string = 'row';
  killed: boolean = false;

  x: number | null = null;
  y: number | null= null;

  get placed(){
    return this.x && this.y;
  }
  constructor(size: number, direction: string ) {
    this.size = size;
    this.direction = direction;
  }
}

export default Ship