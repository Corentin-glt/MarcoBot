/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  museum: `
    id
    name
    types
    description
    descriptionFr
    tags
    tips
    priceRange
    note
    photos
    url
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
  queryMuseums: (page, city) => {
    return `{
      museums(page: ${page}, city: "${city}") {
          id
          name
          types
          description
          descriptionFr
          url
          tags
          priceRange
          note
          tips
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
  queryMuseum: (id) => {
    return `{
      museum(id: "${id}") {
          id
          name
          types
          description
          descriptionFr
          tags
          priceRange
          note
          url
          tips
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
