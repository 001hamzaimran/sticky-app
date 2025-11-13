import shopify from '../shopify.js';

const getProductById = async (req, res) => {
  try {
    const { id, shop } = req.params;
    let sessionInstance = await shopify.config.sessionStorage.findSessionsByShop(shop);

    const sessions = sessionInstance[0]

    const client = new shopify.api.clients.Graphql({ session: sessions }); 

    const query = `
      query ProductMetafields($ownerId: ID!) {
            product(id: $ownerId) {
              id
              title
              variants(first:150){
                edges{
                  node{
                    id
                    title
                    price
                    media(first:10) {
                      edges {
                        node {
                          preview {
                            image {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              media(first:1) {
                edges {
                  node {
                    preview {
                      image {
                        url
                      }
                    }
                  }
                }
              }
              
            }
          }
    `;

    const variables = {
      ownerId: `gid://shopify/Product/${id}`,
    };

    const response = await client.query({
      data: {
        query,
        variables,
      },
    });

    return res.status(200).json({
      success: true,
      data: response.body.data,
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default getProductById;
