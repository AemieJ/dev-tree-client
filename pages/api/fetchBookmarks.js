import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const parsed = JSON.parse(req.body)
    try {
        const { data } = await client.query({
            query: gql`
            query {
                bookmarks(email: "${parsed.email}", accessToken: "${parsed.accessToken}") {
                  status
                  bookmarks
                  accessToken {
                    token
                  }
                }
              }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.bookmarks), err: null})

    } catch(errors) {
        res.status(404).json({ data: null, err: 'No bookmarks found' })
    }

}