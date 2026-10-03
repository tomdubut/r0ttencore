import {Card, Select, Stack, Text} from '@sanity/ui'
import {useCallback, type ChangeEvent} from 'react'
import {set, unset, useFormValue, type StringInputProps} from 'sanity'

interface CreditItem {
  _key: string
  role?: string
  name?: string
}

/**
 * "Photo by" dropdown: lists the people of this document's Credits list (not Location).
 * Stores the credit's _key, so renaming a person in Credits updates every photo at once.
 */
export function CreditPickerInput(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const credits = (useFormValue(['credits']) as CreditItem[] | undefined) ?? []
  const people = credits.filter((c) => c.name && c.role !== 'Location')
  const missing = Boolean(value) && !people.some((c) => c._key === value)

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const next = event.currentTarget.value
      onChange(next ? set(next) : unset())
    },
    [onChange],
  )

  if (people.length === 0) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Add the photographers and videographers in “Credits” first (tab “Line-up &amp; credits”), then pick them here.
        </Text>
      </Card>
    )
  }

  return (
    <Stack gap={2}>
      <Select {...elementProps} value={value ?? ''} onChange={handleChange}>
        <option value="">Automatic (only person credited for this role)</option>
        {people.map((c) => (
          <option key={c._key} value={c._key}>
            {c.name} ({c.role})
          </option>
        ))}
      </Select>
      {missing && (
        <Text size={1} style={{color: 'var(--card-badge-critical-dot-color, #e5484d)'}}>
          This person was removed from Credits. Pick someone else.
        </Text>
      )}
    </Stack>
  )
}
