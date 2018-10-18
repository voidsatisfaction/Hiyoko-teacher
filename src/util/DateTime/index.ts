export class DateTime extends Date {
  constructor() {
    super()

    // FIXME: db에서 엔티티를 가져올때, milisecond가 차이나는것을 방지
    this.setMilliseconds(0)
  }
}