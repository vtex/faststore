/* eslint-disable turbo/no-undeclared-env-vars */
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import storeConfig from '../../../discovery.config'

const dynamoDbClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
})

const TABLE_NAME = 'faststore-redirects'
const ACCOUNT_ID = storeConfig.api.storeId

export class RedirectsClient {
  async get(from: string) {
    try {
      const command = new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          account_name: {
            S: ACCOUNT_ID,
          },
          from: {
            S: from,
          },
        },
      })

      const { Item } = await dynamoDbClient.send(command)

      if (!Item) {
        return
      }

      const redirect = {
        to: Item.to.S,
        from: Item.from.S,
        type: Item.type.S,
      }

      return redirect
    } catch (error) {
      console.error(error)
    }
  }
}
