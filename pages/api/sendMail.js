import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "http://localhost:4000/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    let email = req.body
    try {
        const query = `
        mutation {
            forgotPass(email: "${email}") {
              status
              email
              message
            }
          }
            `

        const { data } = await client.mutate({
            mutation: gql`${query}`
         })

        res.status(200).json({ data: JSON.stringify(data.forgotPass), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Mail couldn\'t be sent.' })
    }

}