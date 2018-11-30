/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  bar: `
    id
    name
    types
    tips
    description
    descriptionFr
    note
    url
    tags
    priceRange
    photos
    affiliations {
      url
    }
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
  queryBars: (page, city) => {
    return `{
      bars(page: ${page}, city: "${city}") {
          id
          name
          types
          tips
          description
          descriptionFr
          note
          tags
          priceRange
          url
          photos
          affiliations {
      url
    }
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
  queryBarsByPriceAndType: (PSID, type, price, page) => {
    return `{
      barsByPriceAndType(PSID: ${PSID}, type: "${type}", priceRange: ${price}, page: ${page})
      {
       _id
    name
    description
    descriptionFr
    photos
    tags
    types
    priceRange
    note
    url
    affiliations {
      url
    }
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
  queryBar: (id) => {
    return `{
      bar(id: "${id}") {
          id
          name
          types
          tips
          description
          note
          descriptionFr
          tags
          url
          priceRange
          photos
          affiliations {
      url
    }
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
