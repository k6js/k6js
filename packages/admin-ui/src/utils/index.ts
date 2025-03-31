export * from './Fields'
export * from './utils'
export * from './item-form'
export * from './serialization'
export * from './useCreateItem'
export * from './usePreventNavigation'

export type DeepNullable<T> =
  | null
  | (T extends Array<infer Item>
      ? Array<DeepNullable<Item>>
      : { [Key in keyof T]: DeepNullable<T[Key]> })
