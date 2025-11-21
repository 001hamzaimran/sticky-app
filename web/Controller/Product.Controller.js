import shopify from '../shopify.js';

const getProductById = async (req, res) => {
  try {
    const { id, shop } = req.params;
    // const shop = req.query.shop;

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
                    compareAtPrice
                    availableForSale
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
    //console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default getProductById;

const getProducts = async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({ session: res.locals.shopify.session });
    const data = await client.query({
      data: `query GetProducts {
                products(first: 150) {
                  edges {
                    node {
                      id
                      title
                      tags
                      images(first: 1) {
                        edges {
                          node {
                            originalSrc
                          }
                        }
                      }
                    }
                  }
                }
            }`
    })

    //console.log(data);
    return res.status(200).json({ data: data.body.data.products.edges, message: "Products fetched successfully", success: true });
  } catch (error) {
    //console.error(error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

export { getProducts }
