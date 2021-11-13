import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const email = req.body
    try {
        const { data } = await client.mutate({
            mutation: gql`
            mutation {
                insertSubscriber(email: "${email}") {
                    status
                }
            }
            `
         })
        res.status(201).json({ data: data.insertSubscriber, err: null})

    } catch(errors) {
        let errorMsg = errors.graphQLErrors[0].message.message
        let statusCode = JSON.stringify(errors.graphQLErrors[0].message.statusCode)
        res.status(statusCode).json({ data: null, err: errorMsg })
    }
}