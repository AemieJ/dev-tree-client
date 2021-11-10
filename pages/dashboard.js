import { Pagination, InputGroup, FormControl, 
    Dropdown, DropdownButton, Button } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useState } from 'react'
import Users from '../Components/Users.js'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard(results) {
    const initialState = results;
    const [totalPages, setTotalPages] = useState(initialState.pages)
    const [users, setUsers] = useState(initialState.users);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('')
    const [clicked, setClicked] = useState(false)
    const [filter, setFilter] = useState('name')

    const fetchUsers = async (number) => {
        const res = await fetch(`${server}/api/dashboard/${number - 1}`);
        const { list, err } = await res.json()
        if (err) {
            toast.notify(err, {
                duration: 5,
                type: "error"
            })
        } else {
            const parsed = JSON.parse(list)
            const userList = parsed.users
            setUsers(userList)
            window.scrollTo(0,0)
        }
    }

    const fetchSearch = async (number) => {
        let body = {page: number, query: search, attr: filter}
        const res = await fetch(`${server}/api/search`, {
            method: "post",
            body: JSON.stringify(body),
        });

        const { data, err } = await res.json()
        if (err) {
            toast.notify(err, {
                duration: 5,
                type: "error"
            })
        } else {
            let parsed = JSON.parse(data)
            setTotalPages(parsed.pages)
            let list = parsed.users
            setUsers(list)
            window.scrollTo(0, 0)
        }
    }

    let items = []
    for (let number = 1; number <= totalPages; ++number) {
        items.push(
            <Pagination.Item key={number} active={number === page}
            onClick={(e) => {
                e.preventDefault()
                setPage(number)
                {
                    !clicked ? fetchUsers(number) 
                    : fetchSearch(number)

                }
            }}
            >
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <>
            <p className={styles.title}>Developer's Dashboard</p>
            <p className={styles.description}>Dev-tree is a platform just for the developers and that means you. This dashboard includes all the developers that are the members of our dev-tree platform.
            You could check out their tree view and if motivated, create your own as well. </p>
            <InputGroup className={`mb-3 ${styles.search_inp}`}>
                <InputGroup.Text className={styles.search}>Search</InputGroup.Text>
                <FormControl aria-label="Search user" 
                placeholder="Enter your search query"
                value={search}
                onChange={e => setSearch(e.target.value)} />
                <DropdownButton
                title="Filter"
                id="input-group-dropdown-4"
                align="end"
                >
                <Dropdown.Item href="#"
                className={styles.drop_item}
                active={filter === 'name'}
                onClick={() => {
                    setFilter('name')
                }}>By Name</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item href="#"
                className={styles.drop_item}
                active={filter === 'email'}
                onClick={() => {
                    setFilter('email')
                }}>By Email</Dropdown.Item>
                </DropdownButton>
                {
                    search === '' || !clicked ?
                    <Button className={styles.search_btn}
                    onClick={(e) => {
                        e.preventDefault()
                        setPage(1)
                        setClicked(true)
                        fetchSearch(1)
                    }}
                    >
                    Search
                </Button>
                : <Button className={`${styles.search_btn} ${styles.danger_btn}`}
                onClick={(e) => {
                    e.preventDefault()
                    setTotalPages(initialState.pages)

                    setSearch("")
                    setPage(1)
                    setClicked(false)
                    fetchUsers(1)
                }}>
                Clear
            </Button>
                }
            </InputGroup>

            <Users users={users} />

            {
                totalPages === 0 ? <>{<p className={styles.error_msg}>
                    Sorry, but no user has been found based on your query</p>}</>
                : <Pagination>
                <Pagination.First disabled={page === 1}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(1)
                    {
                        !clicked ? fetchUsers(1)
                        : fetchSearch(1)
                    }
                }}
                />
                <Pagination.Prev disabled={page === 1}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(page - 1)
                    {
                        !clicked ? fetchUsers(page - 1)
                        : fetchSearch(page - 1)
                    }
                }}/>
                {items}
                <Pagination.Next disabled={page === totalPages}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(page + 1)
                    {
                        !clicked ? fetchUsers(page + 1)
                        : fetchSearch(page + 1)
                    }
                }}/>
                <Pagination.Last disabled={page === totalPages}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(totalPages)
                    {
                        !clicked ? fetchUsers(totalPages)
                        : fetchSearch(totalPages)
                    }
                }}/>
            </Pagination>
            }

            <ToastContainer />
        </>
    )
}

export const getStaticProps = async () => {
    const uri = "http://localhost:4000/graphql/"
    const client = new ApolloClient({
        uri,
        cache: new InMemoryCache()
    })


    const { data } = await client.query({
        query: gql`
            query {
                totalUsers 
            }    
            `
    })

    let pages = Math.ceil(data.totalUsers / 6);


    const res = await fetch(`${server}/api/dashboard/0`);
    const { list, err } = await res.json()

    if (err) {
        return {
            props: {
                err: err,
                pages: 0,
                users: null
            }
        }
    }

    const parsed = JSON.parse(list)
    const users = parsed.users
    return {
        props: {
            err: null,
            pages,
            users
        }
    }
}