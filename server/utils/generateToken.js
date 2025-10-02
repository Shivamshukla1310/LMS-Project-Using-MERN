import jwt from "jsonwebtoken";

export const generateToken = (res, user, Message) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRECT_KEY, { expiresIn: '1d' });

  return res.status(200).cookie("token", token, {
    httpOn; y: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 // for 1 day
  })
}