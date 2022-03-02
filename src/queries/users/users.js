const logger = require('../../config/logger')
const sequelize = require('../../models/sequelize/index')
const luxon = require('luxon')
const {ValidationError} = require('sequelize/lib/errors')

module.exports = {
       findUserById: async(Id) => {
              try {
                     return await sequelize.models.Users.findByPk(Id)
              } catch (e) {
                     throw new Error(e)
              }
       },
       createUser: async(userData) => {
              const {userType, branchId, permissions, personData, userEmail, userPassword, scope} = userData
              const t = await sequelize.transaction()
              try {
                     //Create a Person
                     const person = await sequelize.models.People.create({...personData}, {transaction: t})
                     const savedPerson = await person.save()
                     //Create user and associate him with the created person
                     const user = await sequelize.models.Users.create({
                            personId: savedPerson.personId,
                            userType,
                            branchId,
                            permissions,
                            scope,
                            userEmail,
                            userPassword
                     }, {transaction: t})
                     const savedUser = await user.save()
                     await t.commit()
                     return {user: savedUser, person: savedPerson}
              } catch (e) {
                     await t.rollback()
                     throw e
              }

       },
       findUserByEmail: async(email) => {
              try {
                     const user = await sequelize.models.Users.findOne({
                            where: {
                                   email: email
                            }
                     })
                     return user
              } catch (e) {
                     logger.error(e)
              }

       },
       findPersonById: async(id) => {
              const person = await sequelize.models.People.findByPk(id)
              return person
       },
       getAccessibleUsersQuery: async(userIds, t = null) => {
              const users = await sequelize.models.UserAccessPrivileges.findAll({
                     where: {
                            accessibleBy: userIds,
                     },
                     attributes: ['userId']
              })

              return users
       },
       updateUserById: async(userId, userData, t = null) => {
              const user = await sequelize.models.Users.findByPk(userId)
              if (user !== null) {
                     return await user.update({...userData}, {transaction: t})
              } else {
                     return null
       }
       },
       deleteUserAccessPrivileges: async(opts, t = null) => {
              const uap = await sequelize.models.UserAccessPrivileges.destroy({...opts, transaction: t})
              return uap
       },
       updateUserBynewPasswordQuery: async(userEmail, password) => {
              const unp = await sequelize.models.Users.findOne({
                     where: {
                            userEmail: userEmail
                     }
              })

              let u = await unp.update({userPassword: password})
              return u;
       },
       findUsersByOptsQ: async(opts) => {
              const users = await sequelize.models.Users.findAll(opts)
              return users
       }


}