import bcrypt from 'bcryptjs'
import jwt from'jsonwebtoken'
import pool from '../db.js'

export async function register(req,res){
    const {email,password,full_name}=req.body
    if(!email || !password){
        return res.status(400).json({error :'Email and password are required.'})
    }
    if(password.length<6){
        return res.status(400).json({error:"password must be at least 6 characters long"})
    }
    const existing= await pool.query('select id , email, full_name from users where email=$1',[email])
    if(existing.rows.length>0){
        return res.status(409).json({error:"An account with this email already exists."})
    }
    const password_hash=await bcrypt.hash(password,10)

    const result= await pool.query(
        'insert into users (email,password_hash,full_name) values($1,$2,$3) returning id,email,full_name',[email,password_hash,full_name ||null]

    )
    const user=result.rows[0]
    const token=jwt.sign({userId:user.id} , process.env.JWT_SECRET , {expiresIn:"14d"})

    res.status(201).json({user,token})

}
export async function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." })
    }
    const result = await pool.query('select * from users where email=$1', [email])
    const user = result.rows[0]
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' })
    }
    const passwordValid = await bcrypt.compare(password, user.password_hash)
    if (!passwordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' })
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '14d' })
    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name }, token })
}

export async function me(req, res) {
    const result = await pool.query('SELECT id, email, full_name FROM users WHERE id = $1', [req.userId])
    res.json({ user: result.rows[0] })
}