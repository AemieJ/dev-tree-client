import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "http://localhost:4000/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

export default async (req, res) => {
    const page = req.query.id
    try {
        const { data } = await client.query({
            query: gql`
            query {
                users(page: ${page}) {
                    users {
                        name
                        email
                        profile
                    }
                }
            }
            `
         })

        res.status(200).json({ list: JSON.stringify(data.users), err: null})

    } catch(errors) {
        res.status(500).json({ list: null, err: 'Server Error' })
    }

}