// eslint-disable-next-line no-unused-vars
const DkBasket = {
    items: [],
    total: 0,
    isAvailable: true,
    Add(name, price) {
        this.items[this.items.length] = { name, price }
        this.total += parseFloat(price)
    },

}
