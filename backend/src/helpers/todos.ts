const todosAccess = require('./todosAcess'); 
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { APIGatewayProxyEvent } from 'aws-lambda'
// import { getUserId } from '../lambda/utils'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic

export function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    return todosAccess.getAllTodosByUserId(userId)
}

export async function createTodo(todoRequest:  CreateTodoRequest, userId: string): Promise<TodoItem>{
    if(!todoRequest.name){
        return null
    }
    return await todosAccess.createTodo({
        todoId: uuid.v4(),
        userId: userId,
        createdAt: new Date().toISOString(),
        name: todoRequest.name,
        dueDate: todoRequest.dueDate,
        done: false,
        attachmentUrl: ''
      })
}

export async function updateTodos(
    userId: string,
    todoId: string,
    todoUpdate: UpdateTodoRequest
  ): Promise<UpdateTodoRequest> {
    const updateTodo = await todosAccess.updateTodos(todoId, userId, todoUpdate)
    return updateTodo
}

export async function deleteTodo(todoId: string, userId: string) {
const deleteData = await todosAccess.deleteTodo(todoId, userId)
return deleteData
}

export async function getAllTodoById(todoId: string) {
const getAllTodo = await todosAccess.getAllTodoById(todoId)
return getAllTodo
}

export async function addAttachment(todo: TodoItem): Promise<TodoItem> {
const addAttach = await todosAccess.addAttachment(todo)
return addAttach
}
  



