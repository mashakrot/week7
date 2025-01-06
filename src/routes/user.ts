import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { validateToken } from '../middleware/validateToken'

const router: Router = Router()

const users: { email: string; password: string }[] = [];

router.post("/api/user/register", 
    // body("username").trim().isLength({min: 3}).escape(),
    body("email").isEmail().normalizeEmail().escape(),
    body("password").isLength({min: 5}),
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        if(!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({errors: errors.array()})
            
        }
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: "Email and password are required" });
        }


        try {
            const existingUser: IUser | null = await User.findOne({email: req.body.email})
            console.log(existingUser)
            if (existingUser) {
                return res.status(403).json({email: "email already in use"})
            }

            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            const newUser = await User.create({
                email: req.body.email,
                password: hash
            })
            users.push(newUser);

            return res.status(200).json({message: "User registered successfully" + {newUser}})

        } catch (error: any) {
            console.error(`Error during registration: ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }

    }
)


router.get("/user/list", validateToken, async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find()
        return res.status(200).json(users)
    } catch (error: any) {
        console.log(`Error while fecthing users ${error}`)
        return res.status(500).json({error: "Internal Server Error"})
    }

})

router.post("/api/user/login",
    body("email").isEmail().trim().escape(),
    body("password").escape(),
    async (req: Request, res: Response) => {
        try {
            const user: IUser | null = await User.findOne({email: req.body.email})

            console.log(user)

            if (!user) {
                return res.status(401).json({message: "Login failed"})
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload: JwtPayload = {
                    id: user._id,
                    email: user.email
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2m"})

                return res.status(200).json({success: true, token})
            }
            return res.status(401).json({message: "Login failed"})



        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
)



export default router