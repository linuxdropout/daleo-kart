const DkBasket = {
    items: [],
    total:0,
    isAvailable: true,
    Add(name, price) {
        this.items[this.items.length] = {"name": name, "price": price};
        this.total+=parseFloat(price);
    }

};
