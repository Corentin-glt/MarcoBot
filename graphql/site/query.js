/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  site: `
    id
    name
    types
    description
    descriptionFr
    tags
    tips
    priceRange
    photos
    url
    note
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
  querySites: (page, city) => {
    return `{
      sites(page: ${page}, city: "${city}") {
          id
          name
          types
          description
          descriptionFr
          tags
          tips
          url
          note
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
  },
  querySite: (id) => {
    return `{
      site(id: "${id}") {
          id
          name
          types
          description
          descriptionFr
          tags
          tips
          note
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
