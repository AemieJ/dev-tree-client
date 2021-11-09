import { Pagination, InputGroup, FormControl, Dropdown, DropdownButton } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-nextjs-toast'
import { server } from "../config/server";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useState } from 'react'
import Users from '../Components/Users.js'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard(results) {
    const initialState = results;
    const totalPages = results.pages;
    const [users, setUsers] = useState(initialState.users);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('name')

    const fetchUsers = async (number) => {
        const res = await fetch(`${server}/api/dashboard/${number - 1}`);
        const { list, err } = await res.json()
        if (err) {

        } else {
            const parsed = JSON.parse(list)
            const userList = parsed.users
            setUsers(userList)
            window.scrollTo(0,0)
        }
    }

    let items = []
    for (let number = 1; number <= totalPages; ++number) {
        items.push(
            <Pagination.Item key={number} active={number === page}
            onClick={(e) => {
                e.preventDefault()
                setPage(number)
                fetchUsers(number)
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
            <InputGroup className="mb-3">
                <InputGroup.Text className={styles.search}>Search</InputGroup.Text>
                <FormControl aria-label="Search user" 
                placeholder="Enter your search query" />
                <DropdownButton
                title="Dropdown"
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
            </InputGroup>

            <Users users={users} />

            <Pagination>
                <Pagination.First disabled={page === 1}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(1)
                    fetchUsers(1)
                }}
                />
                <Pagination.Prev disabled={page === 1}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(page - 1)
                    fetchUsers(page - 1)
                }}/>
                {items}
                <Pagination.Next disabled={page === totalPages}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(page + 1)
                    fetchUsers(page + 1)
                }}/>
                <Pagination.Last disabled={page === totalPages}
                onClick={(e) => {
                    e.preventDefault()
                    setPage(totalPages)
                    fetchUsers(totalPages)
                }}/>
            </Pagination>

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