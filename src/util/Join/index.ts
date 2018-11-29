export class Join<S extends object, D extends object> {
  Inner(): ISourceAble<S, D> {
    return new Inner<S, D>()
  }
}

interface ISourceAble<S, D> {
  source(src: S[]): IOnAble<S, D>
}

interface IOnAble<S, D> {
  on(onProperty: string): IMergeOrWithAble<S, D>
}

interface IMergeOrWithAble<S, D> {
  merge(dest: D[]): any
  with(dest: D[]): [S, D][]
}

class Inner<S extends object, D extends object>
  implements ISourceAble<S, D>, IMergeOrWithAble<S, D>, IOnAble<S, D> {
  private src: S[]
  private dest: D[]
  private onProperty: string

  source(src: S[]): IOnAble<S, D> {
    this.src = src
    return this
  }

  on(onProperty: string): IMergeOrWithAble<S, D> {
        // FIXME: throw if onProperty is not a key of src or dest
    this.onProperty = onProperty
    return this
  }

  merge(dest: D[]) {
    this.dest = dest

    const onPropertyMapDest = dest.reduce((acc, d) => {
      acc[d[this.onProperty]] = d
      return acc
    }, {})

    return this.src.reduce((acc, s: object) => {
      const d = onPropertyMapDest[s[this.onProperty]]
      if (!d) {
        return acc
      }

      acc.push({
        ...s,
        ...d
      })

      return acc
    }, [])
  }

  with(dest: D[]): [S, D][] {
    this.dest = dest

    const onPropertyMapDest = dest.reduce((acc, d) => {
      acc[d[this.onProperty]] = d
      return acc
    }, {})

    return this.src.reduce((acc, s) => {
      const d = onPropertyMapDest[s[this.onProperty]]
      if (!d) {
        return acc
      }

      const tuple: [S, D] = [<S>s, d]
      acc.push(tuple)
    }, [])
  }
}