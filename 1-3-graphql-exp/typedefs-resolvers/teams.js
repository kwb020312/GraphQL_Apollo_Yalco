const { gql } = require('apollo-server')
const dbWorks = require('../dbWorks.js')

const typeDefs = gql`
    type Team {
        id: ID!
        manager: String!
        office: String
        extension_number: String
        mascot: String,
        cleaning_duty: String!
        project: String
        members: [People]
    }
`

const resolvers = {
    Query: {
        teams: (parent, args) => dbWorks.getTeams(args),
        team: (parent, args) => dbWorks.getTeams(args)[0]
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}