import puppeteer from "puppeteer";
import { saveProduct } from "../services/dynamoDB";
import { IProduct } from "../utils/interfaces";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com.br/bestsellers");

  const products = await page.evaluate(() => {
    const items = document.querySelectorAll(".p13n-sc-uncoverable-faceout");
    const data: IProduct[] = [];

    items.forEach((item, index) => {
      if (index < 3) {
        const id = item.getAttribute("id") || "Sem id";
        const title =
          item.querySelector("div a span div")?.textContent?.trim() ||
          "Sem título";
        const price =
          item.querySelector("div a div span")?.textContent?.trim() ||
          "Sem preço";
        const image =
          item.querySelector("a div img")?.getAttribute("src") || "Sem imagem";
        let link = item.querySelector("div a")?.getAttribute("href") || "#";
        if (link && !link.startsWith("http")) {
          link = `https://www.amazon.com.br${link}`;
        }

        if (id && title && price && image && link) {
          data.push({
            id,
            title,
            price,
            image,
            link: link,
          });
        }
      }
    });
    return data;
  });

  if (products) {
    for (const product of products) {
      await saveProduct(product);
    }
  } else {
    console.log("Nenhum produto encontrado.");
  }
  console.log(products);
})();
