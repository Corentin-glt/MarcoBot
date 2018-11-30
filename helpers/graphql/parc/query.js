/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  parc: `
    id
    name
    types
    description
    descriptionFr
    tags
    tips
    priceRange
    note
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
  `,
  queryParcs: (page, city) => {
    return `{
      parcs(page: ${page}, city: "${city}") {
          id
          name
          types
          description
          descriptionFr
          tags
          priceRange
          photos
          note
          tips
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
        }
    }`
  },
  queryParc: (id) => {
    return `{
      parc(id: "${id}") {
          id
          name
          types
          tips
          description
          note
          descriptionFr
          tags
          priceRange
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
        }
    }`
  }
};
