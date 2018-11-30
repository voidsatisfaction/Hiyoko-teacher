export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      // Do not override methods when there is already methods with same name
      if (!derivedCtor.prototype[name]) {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}