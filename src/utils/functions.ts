import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { IProduct } from "./interfaces";

export function addProduct(product: IProduct, tableName: string) {
  const putParams = {
    TableName: tableName,
    Item: {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      link: product.link,
      createdAt: new Date().toISOString(),
    },
  };
  return putParams;
}

export function deleteProduct(productId: string, tableName: string) {
  const deleteParams = {
    TableName: tableName,
    Key: { id: productId },
  };
  return deleteParams;
}

export async function getExistingProducts(
  tableName: string,
  docClient: DynamoDBDocumentClient
) {
  const params = {
    TableName: tableName,
  };
  const { Items } = await docClient.send(new ScanCommand(params));
  return Items || [];
}
