class ProductListing {

    name: string;
    url: string;
    price: number;
    rating: number;

    constructor(product: Element) {

        if (product == undefined) {
            this.name = "";
            this.url = "";
            this.price = 0;
            this.rating = 0;
        } else {
            this.name = product.querySelector('h2')?.textContent?.trim() ?? '';
            this.url = product.querySelector('a')?.getAttribute('href') ?? '';
            this.price = 0; // not needed yet
            this.rating = 0; // not needed yet
        }

    }

}

function amazonSearchUrl(search_term: string): string {

    return `https://www.amazon.com/s?k=${search_term}&ref=nb_sb_noss`;

}

function convertHTML(html: string): HTMLDivElement {

    const div = document.createElement('div');
    div.setAttribute('style', 'display: none;');
    div.innerHTML = html;
    return div;

}

function getProducts(results: HTMLDivElement): ProductListing[] {

    const sr_node_list = results.querySelectorAll('div[data-component-type="s-search-result"]');
    const sr_nodes: Element[] = Array.from(sr_node_list);
    const product_array: ProductListing[] = sr_nodes.map(node => new ProductListing(node));
    return product_array;

}

async function search(search_term: string): Promise<ProductListing[]> {

    const res: Response = (await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(amazonSearchUrl(search_term))}`));
    const res_json = await res.json();
    let page: HTMLDivElement = convertHTML(res_json.contents);

    return getProducts(page);

}

async function getProductSearchRank(search_term: string, search_name: string): Promise<Number> {

    let products = await search(search_term);
    return products.findIndex(product => product.name.includes(search_name));

}


