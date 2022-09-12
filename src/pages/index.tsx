import { useAutoAnimate } from '@formkit/auto-animate/react'
import cuid from 'cuid'
import type { NextPage } from 'next'
import { useState } from 'react'
import { z } from 'zod'

import { trpc } from 'utils/trpc'

import { Form } from '../form'

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Array<{ id: string; text: string; fecha: Date }>>([])
  const appendTodo = trpc.useMutation('example.add', {
    onSuccess(todo) {
      setTodos((todos) => todos.concat(todo))
    },
  })
  const serverTodos = trpc.useQuery(['example.read'], {
    onSuccess(todos) {
      setTodos(todos)
    },
  })
  const [animationParent] = useAutoAnimate()

  const schema = z.object({
    todo: z.string(),
  })
  const onSubmit = (entity: z.infer<typeof schema>) => {
    appendTodo.mutate({ id: cuid(), text: entity.todo, fecha: new Date() })
  }

  return (
    <div
      style={{
        background: '#000',
        color: 'white',
        height: '100vh',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <div>hello world</div>
      <Form schema={schema} onSubmit={onSubmit} />
      {serverTodos.isLoading || appendTodo.isLoading ? 'Loading...' : '-'}
      {serverTodos.isRefetching ? 'Refetching...' : '-'}
      <ul ref={animationParent as never}>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} - {todo.fecha.toISOString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
