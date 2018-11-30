const categoryIndex = require("./categories/index");
const Generic = require("../messenger/Generic");
const Text = require("../messenger/Text");
const async = require("async");
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class Category {
  constructor(locale, venueOfCategory, user) {
    this.locale = locale;
    this.venueOfCategory = venueOfCategory;
    this.user = user;
    this.categories = categoryIndex(
      this.venueOfCategory,
      this.user.cityTraveling
    );
    i18n.setLocale(this.locale);
  }

  firstMessage(){
    return new Text(
      i18n.__(`${this.venueOfCategory}Selection`)
    )
      .get();
  }

  secondMessage(){
    return new Text(
      i18n.__(`${this.venueOfCategory}Selection2`)
    )
      .get();
  }

  init() {
    return new Promise((resolve, reject) => {
      const generic = new Generic();
      async.each(
        this.categories,
        (category, callback) => {
          generic
          .addBubble(
            i18n.__(`${category.title}`),
            i18n.__(`${category.subtitle}`)
          )
          .addImage(category.image_url)
          .addButton(
            i18n.__(`${category.buttons[0].title}`),
            category.buttons[0].payload
          );
          callback();
        },
        err => {
          if (err) return reject(err);
          return resolve(generic.get());
        }
      );
    })
  }
}

module.exports = Category;
