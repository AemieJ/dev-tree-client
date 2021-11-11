import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "http://localhost:4000/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const email = req.body
    try {
        const { data } = await client.query({
            query: gql`
            query {
                personal(email: "${email}") {
                  status
                  email
                  id {
                    youtube {
                      id
                      list
                    }
                  }
                }
            }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.personal), err: null})

    } catch(errors) {
        res.status(404).json({ data: null, err: 'No personal instance found' })
    }

}