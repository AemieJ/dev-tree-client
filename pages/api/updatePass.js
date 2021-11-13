import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const parsed = JSON.parse(req.body);
    let email = parsed.email
    let password = parsed.password
    let rePass = parsed.rePass
    try {
        const query = `
        mutation {
            resetPass(email: "${email}", password: "${password}", rePass: "${rePass}") {
              message
              status
            }
          }
            `

        const { data } = await client.mutate({
            mutation: gql`${query}`
         })

        res.status(200).json({ data: JSON.stringify(data.resetPass), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Reset of password was unsuccessful.' })
    }

}