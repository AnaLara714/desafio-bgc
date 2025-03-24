import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
dotenv.config();

const client = new DynamoDBClient({
  region: "sa-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Products";

export const handler = async ({ event, context }: any) => {
  try {
    const scanParams = {
      TableName: TABLE_NAME,
    };
    const { Items } = await docClient.send(new ScanCommand(scanParams));
    return {
      statusCode: 200,
      body: JSON.stringify(Items || []),
    };
  } catch (error) {
    console.error("Erro ao buscar produtos", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao buscar produtos" }),
    };
  }
};
