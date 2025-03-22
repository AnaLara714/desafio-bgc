import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.com.br/bestsellers");

  const products = await page.evaluate(() => {
    const items = document.querySelectorAll(".p13n-sc-uncoverable-faceout");
    const data: {
      title: string;
      price: string;
      image: string;
      link: string;
    }[] = [];

    items.forEach((item, index) => {
      if (index < 3) {
        const title =
          item.querySelector("div a span div")?.textContent?.trim() ||
          "Sem título";
        const price =
          item.querySelector("div a div span")?.textContent?.trim() ||
          "Sem preço";
        const image =
          item.querySelector("a div img")?.getAttribute("src") || "Sem imagem";
        const link = item.querySelector("div a")?.getAttribute("href") || "#";

        data.push({
          title,
          price,
          image,
          link: `https://www.amazon.com.br${link}`,
        });
      }
    });

    return data;
  });

  console.log(products);
})();
