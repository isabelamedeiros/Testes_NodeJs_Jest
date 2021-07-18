const request = require('supertest');
const app = require('../../app')
const truncate = require('../utils/truncate')

const factory = require('../factories')


// describe("Authentication", () =>{
//     it('should sum two numbers', () => {
//         const x = 2;
//         const y = 4;

//         const sum = x + y;

//         expect(sum).toBe(6);
//     })
// })

// describe("Authentication", () => {
//     it('should sum two numbers', () => {
//         const user = await User.create({ 
//             name: 'Isabela', 
//             email: 'isabela@mail.com', 
//             password_hash: '123123' 
//         });
//         console.log(user)
//         expect(user.email).toBe('isabela')
//     })
// })

describe ("Authentication", () => {
    beforeEach(async() =>{
        await truncate();
    })

    it("should authenticate with valid credentials", async () => {
        const user = await factory.create(User, {
            password: 123123
        })

        console.log("para ver dados do faker", user)

        const response = await request(app)
        .post('/sessions')
        .send({
            email: user.email,
            senha: '123123',
        });
        expect(response.status).toBe(200);
    });

    it('should not authenticate with invalid credentials', async () => {
        const user = await factory.create(User, {
            password: 123123
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            email: user.email,
            senha: '123456',
        });
        expect(response.status).toBe(401);
    })

    it('should return jwt token when authenticate', async () => {
        const user = await factory.create(User, {
            password: 123123
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            email: user.email,
            senha: '123123',
        });
        expect(response.body).toHaveProperty('token')
    })

    it('should be able to access private routes when authenticated', async () => {
        const user = await factory.create(User, {
            password: 123123
        });

        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer ${ user.generateToken() }`);

            expect(response.status).toBe(200);
    })

    it('should not be able to access private routes without jwt token', async () => {
        const response = await request(app)
            .get('/dashboard')

            expect(response.status).toBe(401);
    })

    it('should not be able to access private routes with invalid jwt token', async () => {
        const response = await request(app)
            .get('/dashboard')
            .set('Authorization', `Bearer 123123`);

            expect(response.status).toBe(401);
    })
})

