const {resetPassword} = require('../../Controllers/forgotpwd.controller')
const mssql = require('mssql');

describe('resetPassword test', () => {
    it('should fail when the request body is empty', async () => {
        const req = {
            body: {}
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await resetPassword(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error: 'Please provide new password'})
    })

    it('should fail if the reset password is not successful', async () => {
        const result = {
            rowsAffected: [0]
        }
        const req = {
            body: {
                email : 'rachael@gmail.com',
                password : 'Test1234.',
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce(result)
        })

        await resetPassword(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error: 'Password reset failed'})
    })

    it('should pass if the reset password is successful', async () => {
      const mockresult = [
        {
            email: 'rachael@gmail.com',
            password: 'Test1234.',
        }
      ]
        const result = {
            rowsAffected: [1]
        }
        const req = {
            body: {
                email : 'rachael@gmail.com',
                password: 'Test1234.'
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce(result)
        })

        await resetPassword(req, res)

        // expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: 'Password reset successful'})
      })
})