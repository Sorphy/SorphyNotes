import { readFileSync, writeFileSync, existsSync} from "fs"
import { exist } from "joi"
import { sign, verify} from "jsonwebtoken"



export const signToken = (name: any, id: any) => {
    const secret: string = process.env.JWT_SECRET!
    const token = sign({name: name, id: id}, 'itisnotyourbusiness')
    return token
}
export const verifyToken = (req: any, res: any, next: any) => {
    const cookie = req.cookies['invisibleCookie']
    if(!cookie) {
        req.authenticated = false
        res.render('Login', {error: "Please login your credentials"})
    }else{
        next()
    }
}
