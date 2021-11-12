import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "http://localhost:4000/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const parsed = JSON.parse(req.body);
    let email = parsed.email
    let userEmail = parsed.userEmail
    let accessToken = parsed.accessToken
    try {
        const query = `
        mutation {
            insertBookmark(userEmail: "${userEmail}", email: "${email}", accessToken: "${accessToken}") {
              status
              accessToken {
                token
              }
            }
          }
            `

        const { data } = await client.mutate({
            mutation: gql`${query}`
         })

        res.status(200).json({ data: JSON.stringify(data.insertBookmark), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Addition of bookmark unsuccessful.' })
    }

}