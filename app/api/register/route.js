import { connectDB } from "@/lib/connectDB";
import User from "@/models/userModel";
import bcrypt from "bcrypt"
export async function POST(request) {
  await connectDB();
  const user = await request.json();

  try {
    const{name,email,password} =user;

    if(!name || !email || !password){
      return Response.json({
        error:"plz fill all required field"
      })
    }

    const hashPassword= await bcrypt.hash(password,10)
    const newUser = await User.create({name,email,password:hashPassword});
    return Response.json(newUser, {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return Response.json(
        { error: "Email already exists" },
        {
          status: 409,
        }
      );
    } else {
      return Response.json(
        { error: "Something went wrong" },
        {
          status: 500,
        }
      );
    }
  }
}
