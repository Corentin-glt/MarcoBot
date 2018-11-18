const Template = require('./Template');
const helper = require('../../helpers/helper');


class Receipt extends Template {
  constructor(name, orderNumber, currency, paymentMethod) {
    super();

    if (!name)
      throw new Error('Recipient\'s name cannot be empty');

    if (!orderNumber)
      throw new Error('Order number cannot be empty');

    if (!currency)
      throw new Error('Currency cannot be empty');

    if (!paymentMethod)
      throw new Error('Payment method cannot be empty');

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          recipient_name: name,
          order_number: orderNumber,
          currency: currency,
          payment_method: paymentMethod,
          elements: [],
          summary: {}
        }
      }
    };
  }

  addTimestamp(timestamp) {
    if (!timestamp)
      throw new Error('Timestamp is required for addTimestamp method');

    if (!(timestamp instanceof Date))
      throw new Error('Timestamp needs to be a valid Date object');

    this.template.attachment.payload.timestamp = timestamp.getTime();

    return this;
  }

  addOrderUrl(url) {
    if (!url)
      throw new Error('Url is required for addOrderUrl method');

    if (!helper.isUrl(url))
      throw new Error('Url needs to be valid for addOrderUrl method');

    this.template.attachment.payload.order_url = url;

    return this;
  }

  getLastItem() {
    if (!this.template.attachment.payload.elements || !this.template.attachment.payload.elements.length)
      throw new Error('Add at least one order item first!');

    return this.template.attachment.payload.elements[this.template.attachment.payload.elements.length - 1];
  }

  addItem(title) {
    if (!title)
      throw new Error('Item title is required');

    this.template.attachment.payload.elements.push({
      title: title
    });

    return this;
  }

  addSubtitle(subtitle) {
    if (!subtitle)
      throw new Error('Subtitle is required for addSubtitle method');

    let item = this.getLastItem();

    item.subtitle = subtitle;

    return this;
  }

  addQuantity(quantity) {
    if (!quantity)
      throw new Error('Quantity is required for addQuantity method');

    if (!helper.isNumber(quantity))
      throw new Error('Quantity needs to be a number');

    let item = this.getLastItem();

    item.quantity = quantity;

    return this;
  }

  addPrice(price) {
    if (!price)
      throw new Error('Price is required for addPrice method');

    if (!helper.isNumber(price))
      throw new Error('Price needs to be a number');

    let item = this.getLastItem();

    item.price = price;

    return this;
  }

  addCurrency(currency) {
    if (!currency)
      throw new Error('Currency is required for addCurrency method');

    let item = this.getLastItem();

    item.currency = currency;

    return this;
  }

  addImage(image) {
    if (!image)
      throw new Error('Abotolute url is required for addImage method');

    if (!helper.isUrl(image))
      throw new Error('Valid absolute url is required for addImage method');

    let item = this.getLastItem();

    item.image_url = image;

    return this;
  }

  addShippingAddress(street1, street2, city, zip, state, country) {
    if (!street1)
      throw new Error('Street is required for addShippingAddress');

    if (!city)
      throw new Error('City is required for addShippingAddress method');

    if (!zip)
      throw new Error('Zip code is required for addShippingAddress method');

    if (!state)
      throw new Error('State is required for addShippingAddress method');

    if (!country)
      throw new Error('Country is required for addShippingAddress method');

    this.template.attachment.payload.address = {
      street_1: street1,
      street_2: street2 || '',
      city: city,
      postal_code: zip,
      state: state,
      country: country
    };

    return this;
  }

  addAdjustment(name, amount) {
    if (!amount || !helper.isNumber(amount))
      throw new Error('Adjustment amount must be a number');

    let adjustment = {};

    if (name)
      adjustment.name = name;

    if (amount)
      adjustment.amount = amount;

    if (name || amount) {
      this.template.attachment.payload.adjustments = this.template.attachment.payload.adjustments || [];
      this.template.attachment.payload.adjustments.push(adjustment);
    }

    return this;
  }

  addSubtotal(subtotal) {
    if (!subtotal)
      throw new Error('Subtotal is required for addSubtotal method');

    if (!helper.isNumber(subtotal))
      throw new Error('Subtotal must be a number');

    this.template.attachment.payload.summary.subtotal = subtotal;

    return this;
  }

  addShippingCost(shippingCost) {
    if (!shippingCost)
      throw new Error('shippingCost is required for addShippingCost method');

    if (!helper.isNumber(shippingCost))
      throw new Error('Shipping cost must be a number');

    this.template.attachment.payload.summary.shipping_cost = shippingCost;

    return this;
  }

  addTax(tax) {
    if (!tax)
      throw new Error('Total tax amount is required for addSubtotal method');

    if (!helper.isNumber(tax))
      throw new Error('Total tax amount must be a number');

    this.template.attachment.payload.summary.total_tax = tax;

    return this;
  }

  addTotal(total) {
    if (!total)
      throw new Error('Total amount is required for addSubtotal method');

    if (!helper.isNumber(total))
      throw new Error('Total amount must be a number');

    this.template.attachment.payload.summary.total_cost = total;

    return this;
  }

  get() {
    if (!this.template.attachment.payload.elements.length)
      throw new Error('At least one element/item is required');

    if (!this.template.attachment.payload.summary.total_cost)
      throw new Error('Total amount is required');

    return this.template;
  }
}

module.exports = Receipt;