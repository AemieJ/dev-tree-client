import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
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
                user(email: "${email}") {
                  status
                  name
                  email
                  gender
                  profile
                  isFirstTimeLogin
                }
              }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.user), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Server Error.' })
    }

}