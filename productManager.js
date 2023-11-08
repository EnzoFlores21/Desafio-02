const fs = require("node:fs")

// Clase para manejar posts
class ProductManager {

    // Constructor para leer y parsear los productos
    constructor(fileName) {
        this.path = fileName
        this.id = 0
        if (fs.existsSync(this.path)) {
            try {
                const fileText = fs.readFileSync(this.path, "utf-8")
                this.products = JSON.parse(fileText)
            } catch {
                this.products = []
            }
        } else {
            this.products = []
        }
    }

    async saveFile(){
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, "\t"),
                "utf-8"
            )
        } catch (error) {
            console.log(`Hubo un error ${error}`);
        }
    }

    getProducts(){
        console.log(this.products)
        return this.products
    }

    async addProduct(product){
        const buscador = this.products.find((p) => p.code === product.code)

        if (buscador) {
            console.log("El codigo del producto ya existe");
        } else {
            const newProduct = {...product, id: this.products.length + 1}
            this.products.push(newProduct)

            await this.saveFile()
        }
    }

    async deleteProduct(id){
        const selector = this.products.find((p) => p.id === id)

        if (selector) {
            const newProductArray = this.products.filter((p) => p.id =! id)

            this.products = newProductArray

            await this.saveFile()
        } else {
            console.log("ERROR");
        }
    }
}



class Product {
    constructor(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    ) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock
    }
}


async function PruebaProducts() {
    const productManager = new ProductManager("./products.json");

    await productManager.addProduct(new Product("Producto1", "Sillon", 400, "pepe", 1, 20));
    await productManager.addProduct(new Product("Producto2", "TV", 600, "dadas", 2, 30));

    productManager.getProducts();

    await productManager.deleteProduct(1);

    productManager.getProducts();
}

PruebaProducts();