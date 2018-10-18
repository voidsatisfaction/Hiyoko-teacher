export class Random {
  static alphaNumeric(length: number): string {
    var array = []
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++)
      array.push(
        possible.charAt(Math.floor(Math.random() * possible.length))
      )

    return array.join('')
  }

  static numeric(length: number): number {
    length = length || 10
    return Math.floor(Math.random() * 10**length)
  }

  static alphabetic(length: number): string {
    var array = []
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    for (var i = 0; i < length; i++)
      array.push(
        possible.charAt(Math.floor(Math.random() * possible.length))
      )

    return array.join('')
  }
}