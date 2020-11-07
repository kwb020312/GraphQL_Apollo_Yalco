const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        teams(manager: String, cleaning_duty: String): [Team]
        team(id: ID!): Team
        people(team: ID, sex: String, blood_type: BloodType, from: String): [People]
        person(id: ID!): People
        equipments(used_by: Role, new_or_used: NewOrUsed): [Equipment]
        equipment(id: ID!): Equipment
        softwares(used_by: Role, developed_by: String): [Software]
        software(id: ID!): Software
        supplies(team: ID): [Supply]
        supply(id: ID!): Supply
    }
`

module.exports = typeDefs