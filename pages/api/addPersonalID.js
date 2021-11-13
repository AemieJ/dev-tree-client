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
            if (Array.isArray(e[1])) {
                let lst_ = JSON.stringify(e[1])
                a += `${e[0]}: ${lst_}, `
            } else {
                a += `${e[0]} : "${e[1]}", `
            }
        }
        return a
      }, '`{')
      .slice(1, -2) + '}'
    return stringify
}

export default async (req, res) => {
    const parsed = JSON.parse(req.body);
    let email = parsed.email
    let accessToken = parsed.accessToken
    let body = convertObjToString(parsed.body)
    try {
        const query = `
            mutation {
                addPersonalID(email: "${email}", body: ${body}, accessToken: "${accessToken}") {
                    status
                    email
                    id {
                        youtube {
                            id
                        }
                    }

                    accessToken {
                        token
                    }
                }
            }
            `

        const { data } = await client.mutate({
            mutation: gql`${query}`
         })

        res.status(200).json({ data: JSON.stringify(data.addPersonalID), err: null})

    } catch(errors) {
        res.status(500).json({ data: null, err: 'Addition of personal ID unsuccessful.' })
    }

}