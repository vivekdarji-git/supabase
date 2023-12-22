import { countWords } from '../../utils/words'

export class ExceptionList {
  private map: Map<string, string[]>

  static isMultiword(word: string) {
    return /\s+/.test(word)
  }

  constructor() {
    this.map = new Map()
  }

  addSingle(word: string) {
    const subWord = word.split(/\s+/)[0]
    if (!this.map.has(subWord)) {
      this.map.set(subWord, [])
    }
    this.map.get(subWord).push(word)
    return this
  }

  addPlural(word: string) {
    this.addSingle(word)
    this.addSingle(`${word}s`)
    return this
  }

  getSortedMultiwords(word: string) {
    // Sort multiwords by order of decreasing word count to capture longer exceptions first
    return this.map
      .get(word)
      .filter(ExceptionList.isMultiword)
      .sort((a, b) => countWords(b) - countWords(a))
  }

  matchException({
    word,
    fullString,
    index,
  }: {
    word: string
    fullString: string
    index: number
  }): {
    exception: boolean
    advanceIndexBy: number
    match?: string
  } {
    if (this.map.has(word)) {
      const multiwords = this.getSortedMultiwords(word)
      for (const term of multiwords) {
        if (fullString.indexOf(term, index) === index) {
          return { exception: true, match: term, advanceIndexBy: term.length - word.length }
        }
      }

      // If word directly matches, then it's on the exception list
      if (this.map.get(word).includes(word)) {
        return { exception: true, advanceIndexBy: 0 }
      }
    }

    return { exception: false, advanceIndexBy: 0 }
  }
}
