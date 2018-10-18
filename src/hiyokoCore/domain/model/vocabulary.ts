export class VocabularyEntity {
  readonly vocaId: number
  readonly name: string

  constructor(vocaId: number, name: string) {
    this.vocaId = vocaId
    this.name = name
  }
}