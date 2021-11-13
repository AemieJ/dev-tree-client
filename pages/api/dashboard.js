import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "https://dev-tree-server.herokuapp.com/graphql/"
const client = new ApolloClient({
    uri,
    cache: new InMemoryCache()
})

const convertObjToString = (obj) => {
    const stringify = Object
      .entries(obj)
      .reduce((a, e) => {
        if (typeof e[1] !== 'function') {
          a += `${e[0]} : "${e[1]}", `
        }
        return a
      }, '`{')
      .slice(1, -2) + '}'
    return stringify
}

export default async (req, res) => {
    const parsed = JSON.parse(req.body);
    try {
        const { data } = await client.query({
            query: gql`
            query {
                users(page: ${parsed.page}) {
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
        res.status(500).json({ list: null, err: 'Server Error.' })
    }

}