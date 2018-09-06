/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  restaurant: `
      id
      name
      types
      tips
      description
      descriptionFr
      tags
      priceRange
      photos
      location{
        lat
        lng
        name
      }
      schedule {
        monday {
          start
          end
        }
        tuesday {
          start
          end
        }
        wednesday {
          start
          end
        }
        thursday {
          start
          end
        }
        friday {
          start
          end
        }
        sunday {
          start
          end
        }
        saturday {
          start
          end
        }
      } 
  `,
  queryRestaurants: (page, city) => {
    return `{
      restaurants(page: ${page}, city: "${city}") {
          id
          name
          types
          tips
          description
          descriptionFr
          tags
          priceRange
          photos
          location{
            lat
            lng
            name
          }
          schedule {
            monday {
              start
              end
            }
            tuesday {
              start
              end
            }
            wednesday {
              start
              end
            }
            thursday {
              start
              end
            }
            friday {
              start
              end
            }
            sunday {
              start
              end
            }
            saturday {
              start
              end
            }
          }
        }
    }`
  },
  queryRestaurantsByPriceAndType: (PSID, type, price, page) => {
    return `{
      restaurantsByPriceAndType(PSID: ${PSID}, type: "${type}", priceRange: ${price}, page: ${page}) 
      {
       _id
    name
    description
    descriptionFr
    photos
    tags
    types
    priceRange
    location {
      name
      lat
      lng
    }
    schedule {
      monday {
        start
        end
      }
      tuesday {
        start
        end
      }
      wednesday {
        start
        end
      }
      thursday {
        start
        end
      }
      friday {
        start
        end
      }
      saturday {
        start
        end
      }
      sunday {
        start
        end
      }
    }
    deleted
    createAt
      }
    }`
  },
  queryRestaurant: (id) => {
    return `{
      restaurant(id: "${id}") {
          id
          name
          types
          tips
          description
          descriptionFr
          tags
          priceRange
          photos
          location{
            lat
            lng
            name
          }
          schedule {
            monday {
              start
              end
            }
            tuesday {
              start
              end
            }
            wednesday {
              start
              end
            }
            thursday {
              start
              end
            }
            friday {
              start
              end
            }
            sunday {
              start
              end
            }
            saturday {
              start
              end
            }
          }
        }
    }`
  }
};