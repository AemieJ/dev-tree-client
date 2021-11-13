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
    let body = convertObjToString(parsed)
    try {
        const { data } = await client.mutate({
            mutation: gql`
            mutation {
                loginUser(body: ${body}) {
                  status
                  msg {
                    accessToken {
                        token
                    }
                  }
                }
              }
            `
         })

        res.status(200).json({ data: JSON.stringify(data.loginUser), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Login Unsuccessful.' })
    }

}