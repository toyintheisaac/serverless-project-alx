import * as AWS from 'aws-sdk'
const  AWSXRay = require( 'aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

 const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// TODO: Implement the dataLayer logic
async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient
    .put({
      TableName: todosTable,
      Item: todo
    })
    .promise()

    return todo
}

async function getAllTodosByUserId(userId: string): Promise<TodoItem[]>{
    const result = await docClient
    .query({
        TableName : todosTable, 
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
    .promise()
    return result.Items as TodoItem[]
}

async function updateTodos(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
  await docClient
  .update({
      TableName: todosTable,
      Key: {
          userId: userId,
          todoId: todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
          '#name': 'name'
      },
      ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
      }

  })
  .promise()
  return todoUpdate
}

async function deleteTodo(todoId: string, userId: string) {
  await docClient
  .delete({
      TableName: todosTable,
      Key: {
          todoId: todoId,
          userId: userId
      }
  })
  .promise();

}

async function  addAttachment(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient
  .update({
      TableName: todosTable,
      Key: {
          userId: todo.userId,
          todoId: todo.todoId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
          ':attachmentUrl': todo.attachmentUrl
      }
  })
  .promise()
  return result.Attributes as TodoItem
}

async function getAllTodoById(todoId: string):Promise<TodoItem>  {
 const output= await docClient
 .query({
      TableName: todosTable,
      IndexName: todosIndex,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
          ':todoId': todoId
      }
  })
  .promise()
  const item = output.Items
  const result= (item.length !==0)?  item[0] as TodoItem :null
  return result;
}


function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}

module.exports.todoAccess = {
  createTodo,
  getAllTodosByUserId,
  updateTodos,
  deleteTodo,
  addAttachment,
  getAllTodoById,
};