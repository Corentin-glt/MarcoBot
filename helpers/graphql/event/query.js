/**
 * Created by corentin on 13/05/2018.
 */
module.exports = {
  event: `
      id
      name
      types
      description
      tags
      priceRange
      photos
      dateStart
      dateEnd
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
  queryEvents: (page) => {
    return `{
      events(page: ${page}) {
          id
          name
          types
          description
          tags
          priceRange
          photos
          dateStart
          dateEnd
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
  queryEvent: (id) => {
    return `{
      event(id: "${id}") {
          id
          name
          types
          description
          tags
          priceRange
          photos
          dateStart
          dateEnd
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
