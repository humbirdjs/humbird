export const defineReadOnlyProperty = (scope: object, name: string, value: any, message: string = 'property is readonly') => {
  Object.defineProperty(scope, name, {
    enumerable: true,
    get() {
      return value
    },
    set() {
      throw Error(message)
    }
  })
}

export const isReadonly = (property: any) => {
  return property.readonly === true
}

export const lowerCaseFirst = (str: string) => {
  return str.slice(0, 1).toLowerCase() + str.slice(1);  
} 
