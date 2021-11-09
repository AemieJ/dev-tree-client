import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const uri = "http://localhost:4000/graphql/"
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
                searchUser(query: "${parsed.query}", attr: "${parsed.attr}", page: ${parsed.page - 1}) {
                  users {
                    name
                    email
                    profile
                  }
                  pages
                }
              }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.searchUser), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Server Error.' })
    }

}