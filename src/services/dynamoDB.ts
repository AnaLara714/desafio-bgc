import dotenv from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IProduct } from "../utils/interfaces";
import {
  addProduct,
  deleteProduct,
  getExistingProducts,
} from "../utils/functions";
dotenv.config();

const client = new DynamoDBClient({
  region: "sa-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_KEY || "",
  },
});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Products";

export async function saveProduct(products: IProduct[]) {
  try {
    const ExistingProducts = await getExistingProducts(TABLE_NAME, docClient);
    const newProductIds = new Set(products.map((product) => product.id));

    for (const existingProduct of ExistingProducts) {
      if (!newProductIds.has(existingProduct.id)) {
        const deleteParams = deleteProduct(existingProduct.id, TABLE_NAME);
        await docClient.send(new DeleteCommand(deleteParams));
        console.log(
          `Produto ${existingProduct.id} excluído com sucesso, pois saiu da lista de mais vendidos!`
        );
      }
    }

    for (const product of products) {
      const getParams = {
        TableName: TABLE_NAME,
        Key: { id: product.id },
      };
      const { Item } = await docClient.send(new GetCommand(getParams));

      if (!Item) {
        const putParams = addProduct(product, TABLE_NAME);
        await docClient.send(new PutCommand(putParams));
        console.log(
          `Produto ${product.id} adicionado com sucesso, pois entrou no top 3 mais vendidos!`
        );
      } else {
        const existingProduct = Item;
        const isDifferent =
          existingProduct.title.trim() !== product.title.trim() ||
          existingProduct.price.trim() !== product.price.trim() ||
          existingProduct.image.trim() !== product.image.trim();

        if (isDifferent) {
          const deleteParams = deleteProduct(product.id, TABLE_NAME);
          await docClient.send(new DeleteCommand(deleteParams));
          console.log(
            `Produto ${product.id} já está na lista de mais vendidos, mas está desatualizado!`
          );

          const putParams = addProduct(product, TABLE_NAME);
          await docClient.send(new PutCommand(putParams));
          console.log(`Produto ${product.id} atualizado com sucesso!`);
        } else {
          console.log(
            `Produto ${product.id} já está na lista de mais vendidos, sem alterações.`
          );
        }
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar os produtos: ", error);
  }
}
