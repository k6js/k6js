import { parse, isValid, formatISO, format } from 'date-fns'
import { type ChangeEvent, type FocusEvent, useState } from 'react'

const FULL_TIME_PATTERN = 'HH:mm:ss.SSS'

function formatFullTime (date: Date) {
  return format(date, FULL_TIME_PATTERN)
}

export function formatTime (time: string) {
  const date = parse(time, FULL_TIME_PATTERN, new Date())
  if (date.getMilliseconds() !== 0) {
    return format(date, FULL_TIME_PATTERN)
  }
  if (date.getSeconds() !== 0) {
    return format(date, 'HH:mm:ss')
  }
  return format(date, 'HH:mm')
}

export function parseTime (time: string) {
  for (const pattern of ['H:m:s.SSS', 'H:m:s', 'H:m', 'H']) {
    const parsed = parse(time, pattern, new Date())
    if (isValid(parsed)) {
      return format(parsed, FULL_TIME_PATTERN)
    }
  }
  return undefined
}

export function constructTimestamp ({
  dateValue,
  timeValue,
}: {
  dateValue: string
  timeValue: string
}) {
  return new Date(`${dateValue}T${timeValue}`).toISOString()
}

export function deconstructTimestamp (value: string): InnerValue {
  return {
    dateValue: formatISO(new Date(value), { representation: 'date' }),
    timeValue: { kind: 'parsed', value: formatFullTime(new Date(value)) },
  }
}

export function formatOutput (value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString()
}

export type InnerValue = {
  dateValue: string | null
  timeValue: string | { kind: 'parsed', value: string | null }
}

export type Value =
  | {
      kind: 'create'
      value: InnerValue
    }
  | {
      kind: 'update'
      value: InnerValue
      initial: string | null
    }

type ParsedValueBase = undefined | symbol | boolean | object | number | null | bigint

type Config<ParsedValue extends ParsedValueBase> = {
  parse: (value: string) => ParsedValue | string
  format: (value: ParsedValue) => string
}

export function useFormattedInput<ParsedValue extends ParsedValueBase> (
  config: Config<ParsedValue>,
  {
    value,
    onChange,
    onBlur,
    onFocus,
  }: {
    value: string | ParsedValue
    onChange: (value: string | ParsedValue) => void
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  }
) {
  // typeof value === 'string' implies the unparsed form
  // typeof value !== 'string' implies the parsed form
  if (typeof value === 'string' && typeof config.parse(value) !== 'string') {
    throw new Error(`Expected ${typeof config.parse(value)}, got ${typeof value}`)
  }
  let [internalValueState, setInternalValueState] = useState(() =>
    typeof value === 'string' ? value : config.format(value)
  )
  const [isFocused, setIsFocused] = useState(false)
  if (typeof value === 'string' && value !== internalValueState) {
    setInternalValueState(value)
  }
  // If the value is not a string, we know it's in the parsed form
  if (typeof value !== 'string') {
    const formatted = config.format(value)
    // When the input is blurred, we want to show always show the formatted
    // version so if we're not focussed and the formatted version is different
    // to the current version, we need to update it.
    if (!isFocused && formatted !== internalValueState) {
      setInternalValueState(formatted)
    }

    const parsedInternal = config.parse(internalValueState)

    // We updating the internal value here because the
    // external value has changed.
    if (typeof parsedInternal !== 'string' && config.format(parsedInternal) !== formatted) {
      setInternalValueState(formatted)
    }
  }

  return {
    value: internalValueState,
    onChange (event: ChangeEvent<HTMLInputElement>) {
      const value = event.target.value
      const parsed = config.parse(value)
      onChange(parsed)
      setInternalValueState(value)
    },
    onFocus (event: FocusEvent<HTMLInputElement>) {
      onFocus?.(event)
      setIsFocused(true)
    },
    onBlur (event: FocusEvent<HTMLInputElement>) {
      onBlur?.(event)
      setIsFocused(false)
      // this isn't strictly necessary since we already do this in render
      // this just saves another rerender after setIsFocused(false)
      if (typeof value !== 'string') {
        setInternalValueState(config.format(value))
      }
    },
  }
}
