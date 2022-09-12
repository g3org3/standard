import { z } from 'zod'

import { append, read } from 'utils/gs'

import { createRouter } from './context'

export const exampleRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany()
    },
  })
  .query('read', {
    async resolve() {
      const { data } = await read()
      const payload =
        data.values?.map((d) => {
          return { id: `${d[0]}`, text: `${d[1]}`, fecha: new Date(d[2]) }
        }) || []

      return payload
    },
  })
  .mutation('add', {
    input: z.object({
      id: z.string(),
      text: z.string(),
      fecha: z.date(),
    }),
    async resolve({ input }) {
      const row = [input.id, input.text, input.fecha.toISOString()]
      await append([row])

      return input
    },
  })
