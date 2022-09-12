import { useCallback, useRef } from 'react'
import { z } from 'zod'

interface Params<T> {
  formRef: React.RefObject<HTMLFormElement>
  schema: z.ZodType<T>
  onSubmit?: (result: T) => void
  onError?: (error: any) => void
}
export const useForm = <T,>(params: Params<T>) => {
  const onSubmit: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      if (!params.formRef.current) return

      const rawEntity = Object.values(params.formRef.current)
        .filter((i) => i.name)
        .map<Record<string, string>>((i) => ({ [i.name]: i.value || null }))
        .reduce<Record<string, string | undefined>>((form, field) => {
          // should always exist
          const [key] = Object.keys(field)
          if (key) {
            form[key] = field[key]
          }

          return form
        }, {})

      try {
        const entity = params.schema.parse(rawEntity)
        if (typeof params.onSubmit === 'function') {
          params.onSubmit(entity)
          Object.values(params.formRef.current)
            .filter((i) => i.name)
            .forEach((i) => {
              i.value = ''
            })
        } else {
          console.groupCollapsed('%c onSubmit', 'background:blue;color:white;', 'not_implemented')
          console.log(entity)
          console.groupEnd()
        }
      } catch (err) {
        if (typeof params.onError === 'function') {
          params.onError(err)
        } else {
          console.groupCollapsed('%c onError', 'background:red;color:white;', 'not_implemented')
          console.error(err)
          console.groupEnd()
        }
      }
    },
    [params.formRef, params.schema, params.onSubmit]
  )

  return { onSubmit }
}

export const Form = <T,>({ schema, onSubmit }: { schema: z.ZodType<T>; onSubmit?: (result: T) => void }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const f = useForm({
    formRef,
    schema,
    onSubmit,
  })
  const zodToInputType = {
    ZodString: 'text',
    ZodNumber: 'number',
    ZodDate: 'datetime-local',
  } as const
  const shape = (schema._def as any).shape()

  return (
    <form ref={formRef} onSubmit={f.onSubmit}>
      {Object.keys(shape).map((key) => {
        const zodType = shape[key]._def.typeName as keyof typeof zodToInputType
        const type = zodToInputType[zodType] || 'text'

        if (!zodToInputType[zodType]) {
          console.log('WARNING', zodType)
        }

        return <input key={key} name={key} placeholder={key} type={type} />
      })}
      <button type="submit">submit</button>
    </form>
  )
}
