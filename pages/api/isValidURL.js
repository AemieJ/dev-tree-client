import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    let parsed = JSON.parse(req.body)
    try {
        const { data } = await client.query({
            query: gql`
            query {
                isCorrectResetURL(email: "${parsed.email}", token: "${parsed.token}") 
              }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.isCorrectResetURL), err: null})

    } catch(errors) {
        res.status(404).json({ data: null, err: 'Server Error' })
    }

}